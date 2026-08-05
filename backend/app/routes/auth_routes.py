from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.schemas.schemas import (
    RegisterPayload, LoginPayload, RefreshTokenPayload, 
    ForgotPasswordPayload, ResetPasswordPayload, 
    PhoneOtpSendPayload, PhoneOtpVerifyPayload, GoogleCodeExchangePayload
)
from app.services.auth_service import auth_service

router = APIRouter(prefix="/auth", tags=["1. Authentication"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: RegisterPayload, db: Session = Depends(get_db)):
    """Registers a new user account with email & password."""
    return auth_service.register_user(db, payload.name, payload.email, payload.password, payload.role or "customer")

@router.post("/login")
def login(payload: LoginPayload, db: Session = Depends(get_db)):
    """Authenticates user with email & password and returns JWT tokens."""
    return auth_service.login_user(db, payload.email, payload.password)

@router.post("/refresh")
def refresh_token(payload: RefreshTokenPayload, db: Session = Depends(get_db)):
    """Rotates refresh token and issues a new access token."""
    return auth_service.refresh_user_token(db, payload.refresh_token)

@router.post("/google/exchange-code")
def google_code_exchange(payload: GoogleCodeExchangePayload, db: Session = Depends(get_db)):
    """Exchanges Google OAuth code for JWT token session."""
    return auth_service.google_code_exchange(db, payload.authorization_code)

@router.post("/google")
def google_login_demo(db: Session = Depends(get_db)):
    """Google OAuth quick login for demo users."""
    return auth_service.register_user(db, "Google Demo User", "google.user@savvora.com", "GooglePass123!", "customer")

@router.post("/phone/send-otp")
def send_phone_otp(payload: PhoneOtpSendPayload):
    """Sends OTP code to customer phone number."""
    return auth_service.send_phone_otp(payload.phone)

@router.post("/phone/verify-otp")
def verify_phone_otp(payload: PhoneOtpVerifyPayload, db: Session = Depends(get_db)):
    """Verifies phone OTP code and authenticates user."""
    return auth_service.verify_phone_otp(db, payload.phone, payload.otp)

@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordPayload, db: Session = Depends(get_db)):
    """Generates password reset token and sends email."""
    return auth_service.forgot_password(db, payload.email)

@router.post("/reset-password")
def reset_password(payload: ResetPasswordPayload, db: Session = Depends(get_db)):
    """Resets password using verification token."""
    return auth_service.reset_password(db, payload.email, payload.reset_token, payload.new_password)
