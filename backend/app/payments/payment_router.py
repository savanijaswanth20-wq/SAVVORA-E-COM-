from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database.db import get_db
from app.database.models import Payment, Order

router = APIRouter(prefix="/api/payments", tags=["6. Payments & Refunds"])

class RefundPayload(BaseModel):
    order_id: int
    refund_amount: float
    reason: str

@router.get("/status/{order_id}")
def get_payment_status(order_id: int, db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.order_id == order_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment record not found")
    return payment

@router.post("/refund")
def process_refund(payload: RefundPayload, db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.order_id == payload.order_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment record not found")

    payment.status = "REFUNDED"
    payment.refund_amount = payload.refund_amount
    
    order = db.query(Order).filter(Order.id == payload.order_id).first()
    if order:
        order.payment_status = "Refunded"

    db.commit()
    return {
        "message": f"Refund of ₹{payload.refund_amount:,.2f} processed successfully",
        "transaction_id": payment.transaction_id,
        "refund_status": "COMPLETED"
    }
