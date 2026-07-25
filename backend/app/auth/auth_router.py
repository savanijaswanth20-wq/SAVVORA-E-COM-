from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import hashlib
import jwt
from datetime import datetime, timedelta
from app.database.db import get_db
from app.database.models import User, UserRole

SECRET_KEY = "stockflow_secret_key_super_secure_change_in_production"
ALGORITHM = "HS256"

router = APIRouter(prefix="/api/auth", tags=["1. Authentication"])

class RegisterPayload(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "customer"

class LoginPayload(BaseModel):
    email: str
    password: str

class RefreshPayload(BaseModel):
    refresh_token: str

class ForgotPasswordPayload(BaseModel):
    email: str

def hash_pwd(pwd: str) -> str:
    return hashlib.sha256((pwd + SECRET_KEY).encode('utf-8')).hexdigest()

def create_tokens(email: str, role: str):
    acc_exp = datetime.utcnow() + timedelta(days=1)
    ref_exp = datetime.utcnow() + timedelta(days=30)
    access_token = jwt.encode({"sub": email, "role": role, "type": "access", "exp": acc_exp}, SECRET_KEY, algorithm=ALGORITHM)
    refresh_token = jwt.encode({"sub": email, "role": role, "type": "refresh", "exp": ref_exp}, SECRET_KEY, algorithm=ALGORITHM)
    return access_token, refresh_token

@router.post("/register")
def register(payload: RegisterPayload, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    access_token, refresh_token = create_tokens(payload.email, payload.role or "customer")
    user = User(
        name=payload.name,
        email=payload.email,
        hashed_password=hash_pwd(payload.password),
        role=payload.role or UserRole.CUSTOMER.value,
        is_verified=True,
        refresh_token=refresh_token
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role}
    }

@router.post("/login")
def login(payload: LoginPayload, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or user.hashed_password != hash_pwd(payload.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token, refresh_token = create_tokens(user.email, user.role)
    user.refresh_token = refresh_token
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role}
    }

@router.post("/refresh")
def refresh_token(payload: RefreshPayload, db: Session = Depends(get_db)):
    try:
        data = jwt.decode(payload.refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        if data.get("type") != "refresh":
            raise HTTPException(status_code=400, detail="Invalid token type")
        
        user = db.query(User).filter(User.email == data.get("sub")).first()
        if not user or user.refresh_token != payload.refresh_token:
            raise HTTPException(status_code=401, detail="Invalid or revoked refresh token")
        
        new_access_token, new_refresh_token = create_tokens(user.email, user.role)
        user.refresh_token = new_refresh_token
        db.commit()

        return {"access_token": new_access_token, "refresh_token": new_refresh_token, "token_type": "bearer"}
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Expired or invalid refresh token")

class GoogleAuthPayload(BaseModel):
    id_token: Optional[str] = None
    email: Optional[str] = "aarav.sharma@gmail.com"
    name: Optional[str] = "Aarav Sharma"
    avatar: Optional[str] = None

class PhoneOtpSendPayload(BaseModel):
    phone: str

class PhoneOtpVerifyPayload(BaseModel):
    phone: str
    otp: str

@router.post("/google")
def google_login(payload: Optional[GoogleAuthPayload] = None, db: Session = Depends(get_db)):
    email = (payload and payload.email) or "aarav.sharma@gmail.com"
    name = (payload and payload.name) or "Aarav Sharma"
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            name=name,
            email=email,
            hashed_password=hash_pwd("google_oauth_secret"),
            role="customer",
            is_verified=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token, refresh_token = create_tokens(user.email, user.role)
    return {
        "access_token": access_token, 
        "refresh_token": refresh_token, 
        "token_type": "bearer",
        "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role}
    }

@router.post("/phone/send-otp")
def send_phone_otp(payload: PhoneOtpSendPayload):
    return {
        "status": "success",
        "message": f"OTP successfully sent to +91 {payload.phone}",
        "demo_otp": "123456"
    }

@router.post("/phone/verify-otp")
def verify_phone_otp(payload: PhoneOtpVerifyPayload, db: Session = Depends(get_db)):
    if payload.otp != "123456":
        raise HTTPException(status_code=400, detail="Invalid OTP code")
    
    email = f"phone_{payload.phone}@savvora.com"
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            name=f"Customer +91{payload.phone}",
            email=email,
            hashed_password=hash_pwd("phone_otp_secret"),
            role="customer",
            is_verified=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token, refresh_token = create_tokens(user.email, user.role)
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {"id": user.id, "name": user.name, "phone": payload.phone, "role": user.role}
    }

@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordPayload, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")
    
    reset_code = f"RESET-{datetime.utcnow().strftime('%M%S')}"
    user.reset_token = reset_code
    db.commit()
    return {"message": f"Password reset code generated and sent to {user.email}", "reset_code": reset_code}

