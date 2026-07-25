from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Header
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from database.db import get_db
from models.models import Order, OrderItem, Product, Inventory, User, Payment, Coupon, MovementType
from schemas.schemas import OrderCreate, OrderResponse, DashboardStats, CouponVerify, CouponResponse
from auth.auth import get_current_user, get_admin_user
from services.inventory_engine import InventoryEngine
from services.background_workers import send_order_confirmation_email, generate_pdf_invoice, dispatch_low_stock_webhook

router = APIRouter(prefix="/api/orders", tags=["Orders"])

@router.post("/verify-coupon", response_model=CouponResponse)
def verify_coupon(payload: CouponVerify, db: Session = Depends(get_db)):
    coupon = db.query(Coupon).filter(Coupon.code == payload.code.upper(), Coupon.is_active == True).first()
    if not coupon:
        return CouponResponse(valid=False, discount_amount=0.0, message="Invalid or expired coupon code")
    
    if payload.cart_total < coupon.min_order_value:
        return CouponResponse(valid=False, discount_amount=0.0, message=f"Minimum cart value for this coupon is ₹{coupon.min_order_value}")
    
    discount = (payload.cart_total * coupon.discount_percent) / 100.0
    discount = min(discount, coupon.max_discount)
    return CouponResponse(valid=True, discount_amount=round(discount, 2), message=f"Coupon applied! You saved ₹{round(discount, 2)}")

@router.post("", response_model=OrderResponse)
def create_order(
    order_data: OrderCreate,
    background_tasks: BackgroundTasks,
    x_idempotency_key: Optional[str] = Header(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not order_data.items:
        raise HTTPException(status_code=400, detail="Order items list cannot be empty")
    
    # 1. Idempotency Key check to prevent double-charging/duplicate orders
    if x_idempotency_key:
        existing_order = db.query(Order).filter(Order.idempotency_key == x_idempotency_key).first()
        if existing_order:
            return existing_order

    total_amount = 0.0
    order_items_to_create = []
    inventory_updates = []

    # 2. Concurrency Safety & Atomic Stock Deduction
    # Uses conditional atomic UPDATE (WHERE stock_count >= requested_qty) to prevent race conditions across both SQLite & PostgreSQL!
    try:
        for item in order_data.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if not product:
                raise HTTPException(status_code=404, detail=f"Product ID {item.product_id} not found")
            
            # Atomic conditional update
            rows_affected = db.query(Inventory).filter(
                Inventory.product_id == item.product_id,
                Inventory.stock_count >= item.quantity
            ).update(
                {Inventory.stock_count: Inventory.stock_count - item.quantity},
                synchronize_session=False
            )

            if rows_affected == 0:
                inv = db.query(Inventory).filter(Inventory.product_id == item.product_id).first()
                available = inv.stock_count if inv else 0
                db.rollback()
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock for '{product.name}'. Available: {available}"
                )

            inv_after = db.query(Inventory).filter(Inventory.product_id == item.product_id).first()
            subtotal = product.price * item.quantity
            total_amount += subtotal

            inventory_updates.append((inv_after, inv_after.stock_count, product.id, item.quantity, product.name))

            order_items_to_create.append({
                "product_id": product.id,
                "quantity": item.quantity,
                "unit_price": product.price,
                "subtotal": subtotal
            })

        # Apply discount if valid coupon
        discount_amount = 0.0
        if order_data.coupon_code:
            coupon = db.query(Coupon).filter(Coupon.code == order_data.coupon_code.upper(), Coupon.is_active == True).first()
            if coupon and total_amount >= coupon.min_order_value:
                discount_amount = min((total_amount * coupon.discount_percent) / 100.0, coupon.max_discount)

        net_amount = round(total_amount - discount_amount, 2)
        tracking_num = f"STK-{uuid.uuid4().hex[:8].upper()}"

        # 3. Create Order
        new_order = Order(
            user_id=current_user.id,
            total_amount=total_amount,
            discount_amount=discount_amount,
            net_amount=net_amount,
            status="processing",
            payment_method=order_data.payment_method,
            payment_status="Paid",
            tracking_number=tracking_num,
            shipping_address=order_data.shipping_address,
            idempotency_key=x_idempotency_key
        )
        db.add(new_order)
        db.commit()
        db.refresh(new_order)

        # 4. Create OrderItems & Record Immutable Stock Movements
        for item_data in order_items_to_create:
            oi = OrderItem(
                order_id=new_order.id,
                product_id=item_data["product_id"],
                quantity=item_data["quantity"],
                unit_price=item_data["unit_price"],
                subtotal=item_data["subtotal"]
            )
            db.add(oi)

        # Record immutable movement ledger
        for inv_obj, new_stock, prod_id, qty_bought, prod_name in inventory_updates:
            InventoryEngine.record_movement(
                db=db,
                product_id=prod_id,
                movement_type=MovementType.STOCK_OUT.value,
                quantity=qty_bought,
                balance_after=new_stock,
                reference_id=tracking_num,
                notes=f"Order #{new_order.id} purchased by User #{current_user.id}",
                user_id=current_user.id
            )

            # Trigger low-stock webhook alert if stock dropped below threshold
            if new_stock <= inv_obj.low_stock_threshold:
                background_tasks.add_task(dispatch_low_stock_webhook, prod_name, new_stock)
        
        # 5. Create Payment record
        payment = Payment(
            order_id=new_order.id,
            payment_gateway=order_data.payment_method,
            transaction_id=f"TXN-{uuid.uuid4().hex[:10].upper()}",
            amount=net_amount,
            status="SUCCESS"
        )
        db.add(payment)

        db.commit()
        db.refresh(new_order)

        # 6. Queue Async Background Worker Tasks
        background_tasks.add_task(send_order_confirmation_email, current_user.email, new_order.id, tracking_num)
        background_tasks.add_task(generate_pdf_invoice, new_order.id, net_amount)

        return new_order

    except Exception as e:
        db.rollback()
        raise e

@router.get("/my-orders", response_model=List[OrderResponse])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()

@router.get("/admin/all", response_model=List[OrderResponse])
def get_all_orders_admin(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    return db.query(Order).order_by(Order.created_at.desc()).all()

@router.get("/admin/stats", response_model=DashboardStats)
def get_admin_dashboard_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    orders = db.query(Order).all()
    today_revenue = sum(o.net_amount for o in orders)
    orders_count = len(orders)
    products_count = db.query(Product).count()
    customers_count = db.query(User).filter(User.role == "customer").count()
    low_stock_count = db.query(Inventory).filter(Inventory.stock_count <= Inventory.low_stock_threshold).count()

    return DashboardStats(
        today_revenue=round(today_revenue, 2),
        orders_count=orders_count,
        products_count=products_count,
        customers_count=customers_count,
        low_stock_count=low_stock_count
    )
