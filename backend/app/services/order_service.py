import random
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.models import (
    Order, OrderItem, Address, CartItem, Product, Inventory, 
    StockMovementLog, StockReservation, OrderStatus, DeliveryTracking, 
    Payment, Invoice, Return, Refund, User
)
from app.services.razorpay_service import razorpay_service
from app.services.email_service import email_service
from app.services.pdf_service import pdf_invoice_service

logger = logging.getLogger("savvora.orders")

class OrderService:
    def create_order_from_cart(
        self,
        db: Session,
        user: User,
        address_id: int,
        payment_method: str = "Razorpay",
        coupon_code: Optional[str] = None,
        idempotency_key: Optional[str] = None
    ) -> Dict[str, Any]:
        """Creates an order from user's active cart items with idempotency key protection."""
        if idempotency_key:
            existing = db.query(Order).filter(Order.idempotency_key == idempotency_key).first()
            if existing:
                return self._format_order_response(db, existing)

        address = db.query(Address).filter(Address.id == address_id, Address.user_id == user.id).first()
        if not address:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shipping address not found")

        cart_items = db.query(CartItem).filter(CartItem.user_id == user.id).all()
        if not cart_items:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Your cart is empty")

        total_amount = 0.0
        order_items_data = []

        # Check stock availability for all cart items
        for ci in cart_items:
            product = db.query(Product).filter(Product.id == ci.product_id, Product.is_deleted == False).first()
            if not product:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Product #{ci.product_id} no longer available")

            inventory = db.query(Inventory).filter(Inventory.product_id == product.id).first()
            available_stock = (inventory.stock_count - inventory.reserved_count) if inventory else 100

            if available_stock < ci.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient stock for '{product.name}'. Available: {available_stock}, Requested: {ci.quantity}"
                )

            subtotal = product.price * ci.quantity
            total_amount += subtotal
            order_items_data.append({
                "product_id": product.id,
                "product_name": product.name,
                "sku": product.sku,
                "quantity": ci.quantity,
                "unit_price": product.price,
                "subtotal": subtotal,
                "inventory": inventory
            })

        discount_amount = 0.0
        tax_amount = round(total_amount * 0.18, 2)
        shipping_fee = 0.0 if total_amount >= 999.0 else 99.0
        net_amount = round(total_amount - discount_amount + tax_amount + shipping_fee, 2)

        order_number = f"ORD-{datetime.utcnow().strftime('%Y%m%d')}-{random.randint(1000, 9999)}"
        formatted_address_str = f"{address.recipient_name}, {address.street}, {address.city}, {address.state} {address.postal_code}, Ph: {address.phone}"

        order = Order(
            order_number=order_number,
            user_id=user.id,
            total_amount=total_amount,
            discount_amount=discount_amount,
            tax_amount=tax_amount,
            shipping_fee=shipping_fee,
            net_amount=net_amount,
            status=OrderStatus.PENDING.value,
            payment_method=payment_method,
            payment_status="Paid" if payment_method == "Wallet" else "Pending",
            shipping_address=formatted_address_str,
            idempotency_key=idempotency_key
        )
        db.add(order)
        db.commit()
        db.refresh(order)

        # Create Order Items and update Stock Logs
        for item in order_items_data:
            oi = OrderItem(
                order_id=order.id,
                product_id=item["product_id"],
                product_name=item["product_name"],
                sku=item["sku"],
                quantity=item["quantity"],
                unit_price=item["unit_price"],
                subtotal=item["subtotal"]
            )
            db.add(oi)

            # Record stock reservation movement
            inv = item["inventory"]
            if inv:
                inv.reserved_count += item["quantity"]
                inv.stock_count -= item["quantity"]
                balance_after = inv.stock_count

                log = StockMovementLog(
                    product_id=item["product_id"],
                    movement_type="STOCK_OUT",
                    quantity=item["quantity"],
                    balance_after=balance_after,
                    reference_id=order_number,
                    notes=f"Order #{order_number} checkout deduction",
                    user_id=user.id
                )
                db.add(log)

        # Clear user cart
        db.query(CartItem).filter(CartItem.user_id == user.id).delete()
        db.commit()

        # Add initial tracking step
        tracking = DeliveryTracking(
            order_id=order.id,
            status="ORDER_PLACED",
            status_description="Order successfully placed and pending processing.",
            location=address.city
        )
        db.add(tracking)
        db.commit()

        # Prepare Razorpay Payment Order if payment_method is Razorpay
        razorpay_data = None
        if payment_method == "Razorpay":
            razorpay_data = razorpay_service.create_order(
                amount_in_inr=net_amount,
                receipt_id=order_number,
                notes={"user_email": user.email, "order_id": str(order.id)}
            )

        # Dispatch email asynchronously
        items_summary_str = ", ".join([f"{i['product_name']} (x{i['quantity']})" for i in order_items_data])
        email_service.send_order_confirmation(user.email, order_number, net_amount, items_summary_str)

        res = self._format_order_response(db, order)
        if razorpay_data:
            res["razorpay_order"] = razorpay_data
        return res

    def update_order_status(self, db: Session, order_id: int, new_status: str, tracking_number: Optional[str] = None) -> Order:
        """Updates order status along with delivery tracking audit log."""
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

        order.status = new_status
        if tracking_number:
            order.tracking_number = tracking_number

        tracking = DeliveryTracking(
            order_id=order.id,
            status=new_status.upper(),
            status_description=f"Order status updated to {new_status}",
            location="Hub distribution centre"
        )
        db.add(tracking)
        db.commit()
        db.refresh(order)

        # Dispatch email status update
        user = db.query(User).filter(User.id == order.user_id).first()
        if user:
            if new_status == OrderStatus.SHIPPED.value:
                email_service.send_shipping_notification(user.email, order.order_number, tracking_number or "TRK-99201")
            elif new_status == OrderStatus.DELIVERED.value:
                email_service.send_delivery_notification(user.email, order.order_number)

        return order

    def cancel_order(self, db: Session, user_id: int, order_id: int, reason: str) -> Dict[str, Any]:
        """Cancels an order and restores product inventory."""
        order = db.query(Order).filter(Order.id == order_id, Order.user_id == user_id).first()
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

        if order.status in [OrderStatus.SHIPPED.value, OrderStatus.DELIVERED.value]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Shipped or delivered orders cannot be cancelled directly. Submit a return request instead.")

        order.status = OrderStatus.CANCELLED.value
        order.cancel_reason = reason

        # Restore inventory
        items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
        for item in items:
            inv = db.query(Inventory).filter(Inventory.product_id == item.product_id).first()
            if inv:
                inv.stock_count += item.quantity
                log = StockMovementLog(
                    product_id=item.product_id,
                    movement_type="STOCK_IN",
                    quantity=item.quantity,
                    balance_after=inv.stock_count,
                    reference_id=order.order_number,
                    notes=f"Order #{order.order_number} cancellation restock",
                    user_id=user_id
                )
                db.add(log)

        db.commit()

        user = db.query(User).filter(User.id == user_id).first()
        if user:
            email_service.send_cancellation(user.email, order.order_number, reason)

        return {"status": "success", "message": f"Order #{order.order_number} successfully cancelled"}

    def generate_invoice_for_order(self, db: Session, order_id: int) -> Dict[str, Any]:
        """Generates or fetches invoice PDF path."""
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

        user = db.query(User).filter(User.id == order.user_id).first()
        inv_number = f"INV-{order.order_number}"
        pdf_filename = f"uploads/invoices/{inv_number}.pdf"

        items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
        order_dict = {
            "id": order.id,
            "order_number": order.order_number,
            "user_name": user.name if user else "Valued Customer",
            "shipping_address": order.shipping_address,
            "payment_method": order.payment_method,
            "payment_status": order.payment_status,
            "created_at": order.created_at.strftime("%Y-%m-%d"),
            "net_amount": order.net_amount,
            "items": [{"product_name": i.product_name, "quantity": i.quantity, "unit_price": i.unit_price, "subtotal": i.subtotal} for i in items]
        }

        pdf_invoice_service.generate_invoice_pdf(order_dict, pdf_filename)

        invoice = db.query(Invoice).filter(Invoice.order_id == order.id).first()
        if not invoice:
            invoice = Invoice(
                invoice_number=inv_number,
                order_id=order.id,
                user_id=order.user_id,
                pdf_path=pdf_filename,
                total_amount=order.net_amount
            )
            db.add(invoice)
            db.commit()

        return {
            "invoice_number": inv_number,
            "pdf_path": pdf_filename,
            "total_amount": order.net_amount
        }

    def _format_order_response(self, db: Session, order: Order) -> Dict[str, Any]:
        items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
        return {
            "id": order.id,
            "order_number": order.order_number,
            "user_id": order.user_id,
            "total_amount": order.total_amount,
            "discount_amount": order.discount_amount,
            "net_amount": order.net_amount,
            "status": order.status,
            "payment_method": order.payment_method,
            "payment_status": order.payment_status,
            "tracking_number": order.tracking_number,
            "shipping_address": order.shipping_address,
            "created_at": order.created_at,
            "items": [
                {
                    "id": i.id,
                    "product_id": i.product_id,
                    "product_name": i.product_name,
                    "sku": i.sku,
                    "quantity": i.quantity,
                    "unit_price": i.unit_price,
                    "subtotal": i.subtotal
                }
                for i in items
            ]
        }

order_service = OrderService()
