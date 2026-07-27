from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from app.database.db import get_db
from app.database.models import User, Address

router = APIRouter(prefix="/api/users", tags=["1. Users & Profiles"])

class ProfileUpdatePayload(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None

class AddressCreatePayload(BaseModel):
    street: str
    city: str
    state: str
    zip_code: str
    is_default: bool = False

@router.get("/{user_id}")
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "avatar": user.avatar,
        "is_verified": user.is_verified,
        "addresses": user.addresses
    }

@router.put("/{user_id}")
def update_user_profile(user_id: int, payload: ProfileUpdatePayload, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.name:
        user.name = payload.name
    if payload.avatar:
        user.avatar = payload.avatar

    db.commit()
    db.refresh(user)
    return user

@router.post("/{user_id}/addresses")
def add_user_address(user_id: int, payload: AddressCreatePayload, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    addr = Address(
        user_id=user_id,
        street=payload.street,
        city=payload.city,
        state=payload.state,
        zip_code=payload.zip_code,
        is_default=payload.is_default
    )
    db.add(addr)
    db.commit()
    db.refresh(addr)
    return addr
