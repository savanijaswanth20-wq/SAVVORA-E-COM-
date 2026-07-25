from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.database.db import get_db
from app.database.models import Coupon

router = APIRouter(prefix="/api/coupons", tags=["8. Coupon Management"])

class CouponCreatePayload(BaseModel):
    code: str
    discount_percent: float
    max_discount: float = 500.0
    min_order_value: float = 999.0
    usage_limit: int = 100

class CouponVerifyPayload(BaseModel):
    code: str
    cart_total: float

@router.get("")
def list_coupons(db: Session = Depends(get_db)):
    return db.query(Coupon).all()

@router.post("/verify")
def verify_coupon(payload: CouponVerifyPayload, db: Session = Depends(get_db)):
    coupon = db.query(Coupon).filter(Coupon.code == payload.code.upper(), Coupon.is_active == True).first()
    if not coupon:
        return {"valid": False, "discount_amount": 0.0, "message": "Invalid or expired coupon code"}

    if payload.cart_total < coupon.min_order_value:
        return {"valid": False, "discount_amount": 0.0, "message": f"Minimum cart value for this coupon is ₹{coupon.min_order_value}"}

    discount = (payload.cart_total * coupon.discount_percent) / 100.0
    discount = min(discount, coupon.max_discount)
    return {"valid": True, "discount_amount": round(discount, 2), "message": f"Coupon applied! Saved ₹{round(discount, 2)}"}

@router.post("")
def create_coupon(payload: CouponCreatePayload, db: Session = Depends(get_db)):
    if db.query(Coupon).filter(Coupon.code == payload.code.upper()).first():
        raise HTTPException(status_code=400, detail="Coupon code already exists")

    coupon = Coupon(
        code=payload.code.upper(),
        discount_percent=payload.discount_percent,
        max_discount=payload.max_discount,
        min_order_value=payload.min_order_value,
        usage_limit=payload.usage_limit,
        is_active=True
    )
    db.add(coupon)
    db.commit()
    db.refresh(coupon)
    return coupon
