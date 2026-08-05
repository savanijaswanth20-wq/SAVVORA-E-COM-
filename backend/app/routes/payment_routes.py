from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.models import User, Order, Payment, Transaction, Refund
from app.schemas.schemas import CreatePaymentOrderPayload, VerifyPaymentPayload, RefundPayload
from app.services.razorpay_service import razorpay_service
from app.services.email_service import email_service
from app.dependencies.auth_deps import get_current_user, require_admin

router = APIRouter(prefix="/payments", tags=["6. Payments & Razorpay"])

@router.post("/create-order")
def create_payment_order(
    payload: CreatePaymentOrderPayload,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generates a Razorpay Order ID for checkout."""
    order = db.query(Order).filter(Order.id == payload.order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    return razorpay_service.create_order(
        amount_in_inr=order.net_amount,
        receipt_id=order.order_number or f"ORD-{order.id}",
        notes={"order_id": str(order.id), "user_id": str(current_user.id)}
    )

@router.post("/verify")
def verify_payment_signature(
    payload: VerifyPaymentPayload,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Verifies Razorpay HMAC SHA256 payment signature and updates payment status."""
    is_valid = razorpay_service.verify_payment_signature(
        razorpay_order_id=payload.razorpay_order_id,
        razorpay_payment_id=payload.razorpay_payment_id,
        razorpay_signature=payload.razorpay_signature
    )

    if not is_valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Payment signature verification failed")

    order = db.query(Order).filter(Order.id == payload.order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    order.payment_status = "Paid"
    order.status = "confirmed"

    # Create Payment record
    payment = db.query(Payment).filter(Payment.order_id == order.id).first()
    if not payment:
        payment = Payment(
            order_id=order.id,
            payment_gateway="Razorpay",
            transaction_id=payload.razorpay_payment_id,
            razorpay_order_id=payload.razorpay_order_id,
            razorpay_payment_id=payload.razorpay_payment_id,
            razorpay_signature=payload.razorpay_signature,
            amount=order.net_amount,
            status="SUCCESS"
        )
        db.add(payment)

    # Create Transaction log
    tx = Transaction(
        user_id=current_user.id,
        order_id=order.id,
        payment_id=payment.id,
        transaction_type="DEBIT",
        amount=order.net_amount,
        description=f"Payment for order #{order.order_number}",
        reference_id=payload.razorpay_payment_id
    )
    db.add(tx)
    db.commit()

    return {
        "status": "success",
        "message": "Payment verified and order confirmed",
        "order_number": order.order_number
    }

@router.post("/webhook")
async def razorpay_webhook_handler(request: Request, db: Session = Depends(get_db)):
    """Async webhook endpoint for Razorpay payment captured/failed events."""
    body = await request.body()
    sig_header = request.headers.get("X-Razorpay-Signature", "")

    if not razorpay_service.verify_webhook_signature(body, sig_header):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid webhook signature")

    import json
    data = json.loads(body.decode("utf-8"))
    event = data.get("event")

    if event == "payment.captured":
        payload = data.get("payload", {}).get("payment", {}).get("entity", {})
        rzp_order_id = payload.get("order_id")
        payment_id = payload.get("id")

        payment = db.query(Payment).filter(Payment.razorpay_order_id == rzp_order_id).first()
        if payment:
            payment.status = "SUCCESS"
            payment.razorpay_payment_id = payment_id
            order = db.query(Order).filter(Order.id == payment.order_id).first()
            if order:
                order.payment_status = "Paid"
                order.status = "confirmed"
            db.commit()

    return {"status": "ok"}

@router.post("/refund")
def process_refund(
    payload: RefundPayload,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Processes a refund via Razorpay (Admin only)."""
    order = db.query(Order).filter(Order.id == payload.order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    payment = db.query(Payment).filter(Payment.order_id == order.id).first()
    if not payment or not payment.razorpay_payment_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No recorded Razorpay payment for this order")

    refund_res = razorpay_service.create_refund(
        razorpay_payment_id=payment.razorpay_payment_id,
        amount_in_inr=payload.amount or order.net_amount,
        notes={"reason": payload.reason}
    )

    refund = Refund(
        order_id=order.id,
        user_id=order.user_id,
        razorpay_refund_id=refund_res.get("refund_id"),
        amount=payload.amount or order.net_amount,
        status="PROCESSED"
    )
    db.add(refund)
    order.status = "refunded"
    order.payment_status = "Refunded"
    db.commit()

    user = db.query(User).filter(User.id == order.user_id).first()
    if user:
        email_service.send_refund_notification(user.email, order.order_number, refund.amount, refund.razorpay_refund_id)

    return {
        "status": "success",
        "refund_id": refund.razorpay_refund_id,
        "amount": refund.amount
    }
