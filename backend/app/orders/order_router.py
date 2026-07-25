from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime
from app.database.db import get_db
from app.database.models import Order, OrderItem, Product, Inventory, Payment, Coupon, StockMovementLog
from app.utils.pdf_generator import generate_pdf_invoice_file

router = APIRouter(prefix="/api/orders", tags=["5. Orders Management"])

class OrderItemPayload(BaseModel):
    product_id: int
    quantity: int

class CreateOrderPayload(BaseModel):
    user_id: int
    items: List[OrderItemPayload]
    shipping_address: str
    payment_method: str = "Razorpay"
    coupon_code: Optional[str] = None

class ReturnRequestPayload(BaseModel):
    reason: str

@router.post("")
def create_order(payload: CreateOrderPayload, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total_amount = 0.0
    items_to_create = []

    try:
        for item in payload.items:
            prod = db.query(Product).filter(Product.id == item.product_id).first()
            if not prod:
                raise HTTPException(status_code=404, detail=f"Product #{item.product_id} not found")

            # Atomic Concurrency Update
            updated = db.query(Inventory).filter(
                Inventory.product_id == item.product_id,
                Inventory.stock_count >= item.quantity
            ).update(
                {Inventory.stock_count: Inventory.stock_count - item.quantity},
                synchronize_session=False
            )

            if updated == 0:
                inv = db.query(Inventory).filter(Inventory.product_id == item.product_id).first()
                db.rollback()
                raise HTTPException(status_code=400, detail=f"Insufficient stock for '{prod.name}'. Available: {inv.stock_count if inv else 0}")

            subtotal = prod.price * item.quantity
            total_amount += subtotal
            items_to_create.append((prod.id, item.quantity, prod.price, subtotal))

        # Discount
        discount = 0.0
        if payload.coupon_code:
            coupon = db.query(Coupon).filter(Coupon.code == payload.coupon_code.upper(), Coupon.is_active == True).first()
            if coupon and total_amount >= coupon.min_order_value:
                discount = min((total_amount * coupon.discount_percent) / 100.0, coupon.max_discount)

        net_amount = round(total_amount - discount, 2)
        tracking_num = f"STK-{uuid.uuid4().hex[:8].upper()}"

        new_order = Order(
            user_id=payload.user_id,
            total_amount=total_amount,
            discount_amount=discount,
            net_amount=net_amount,
            status="processing",
            payment_method=payload.payment_method,
            payment_status="Paid",
            tracking_number=tracking_num,
            shipping_address=payload.shipping_address
        )
        db.add(new_order)
        db.commit()
        db.refresh(new_order)

        for prod_id, qty, u_price, stotal in items_to_create:
            oi = OrderItem(order_id=new_order.id, product_id=prod_id, quantity=qty, unit_price=u_price, subtotal=stotal)
            db.add(oi)

        payment = Payment(order_id=new_order.id, payment_gateway=payload.payment_method, transaction_id=f"TXN-{uuid.uuid4().hex[:10].upper()}", amount=net_amount, status="SUCCESS")
        db.add(payment)

        db.commit()
        db.refresh(new_order)

        # Generate Invoice Background
        background_tasks.add_task(generate_pdf_invoice_file, new_order.id, tracking_num, "Customer", net_amount)

        return new_order
    except Exception as e:
        db.rollback()
        raise e

@router.get("/{order_id}/timeline")
def get_order_timeline(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return {
        "order_id": order.id,
        "tracking_number": order.tracking_number,
        "current_status": order.status,
        "timeline": [
            {"step": "Order Placed", "status": "COMPLETED", "timestamp": order.created_at},
            {"step": "Payment Verified", "status": "COMPLETED", "timestamp": order.created_at},
            {"step": "Processing at Warehouse", "status": "COMPLETED" if order.status in ["processing", "shipped", "delivered"] else "PENDING"},
            {"step": "Out for Delivery", "status": "COMPLETED" if order.status in ["shipped", "delivered"] else "PENDING"},
            {"step": "Delivered", "status": "COMPLETED" if order.status == "delivered" else "PENDING"}
        ]
    }

@router.post("/{order_id}/cancel")
def cancel_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.status in ["shipped", "delivered"]:
        raise HTTPException(status_code=400, detail="Cannot cancel order already shipped or delivered")
    
    order.status = "cancelled"
    
    # Restore inventory
    for item in order.items:
        db.query(Inventory).filter(Inventory.product_id == item.product_id).update(
            {Inventory.stock_count: Inventory.stock_count + item.quantity}, synchronize_session=False
        )

    db.commit()
    return {"message": "Order cancelled and stock restored to inventory"}

@router.post("/{order_id}/return")
def return_request(order_id: int, payload: ReturnRequestPayload, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = "return_requested"
    db.commit()
    return {"message": "Return request submitted successfully", "reason": payload.reason}

@router.get("/{order_id}/invoice")
def get_invoice_pdf(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    filename = generate_pdf_invoice_file(order.id, order.tracking_number, "Customer", order.net_amount)
    return {"invoice_file": filename, "download_url": f"/uploads/invoices/INV-{order.id}.pdf"}
