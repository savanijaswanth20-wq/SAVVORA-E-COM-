from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.models import User, Profile, Address
from app.schemas.schemas import UserOut, ProfileUpdatePayload, AddressIn, AddressOut
from app.dependencies.auth_deps import get_current_user

router = APIRouter(prefix="/users", tags=["2. Users & Profile"])

@router.get("/me", response_model=UserOut)
def get_my_profile(current_user: User = Depends(get_current_user)):
    """Fetches currently logged-in user profile details."""
    return current_user

@router.put("/me", response_model=UserOut)
def update_my_profile(
    payload: ProfileUpdatePayload,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Updates user profile information."""
    if payload.name:
        current_user.name = payload.name
    if payload.phone:
        current_user.phone = payload.phone
    if payload.avatar:
        current_user.avatar = payload.avatar

    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        profile = Profile(user_id=current_user.id)
        db.add(profile)

    if payload.bio:
        profile.bio = payload.bio
    if payload.gender:
        profile.gender = payload.gender
    if payload.dob:
        profile.dob = payload.dob

    db.commit()
    db.refresh(current_user)
    return current_user

# --- Address Book Routes ---
@router.get("/addresses", response_model=List[AddressOut])
def get_user_addresses(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Lists all saved delivery addresses for current user."""
    return db.query(Address).filter(Address.user_id == current_user.id).all()

@router.post("/addresses", response_model=AddressOut, status_code=status.HTTP_201_CREATED)
def add_user_address(
    payload: AddressIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Adds a new shipping address to user's address book."""
    if payload.is_default:
        # Clear previous defaults
        db.query(Address).filter(Address.user_id == current_user.id).update({"is_default": False})

    address = Address(
        user_id=current_user.id,
        title=payload.title or "Home",
        recipient_name=payload.recipient_name,
        phone=payload.phone,
        street=payload.street,
        city=payload.city,
        state=payload.state,
        postal_code=payload.postal_code,
        country=payload.country or "India",
        latitude=payload.latitude,
        longitude=payload.longitude,
        is_default=payload.is_default or False
    )
    db.add(address)
    db.commit()
    db.refresh(address)
    return address

@router.put("/addresses/{address_id}/set-default")
def set_default_address(
    address_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Sets specified address as default."""
    address = db.query(Address).filter(Address.id == address_id, Address.user_id == current_user.id).first()
    if not address:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Address not found")

    db.query(Address).filter(Address.user_id == current_user.id).update({"is_default": False})
    address.is_default = True
    db.commit()
    return {"status": "success", "message": "Default address updated"}

@router.delete("/addresses/{address_id}")
def delete_address(
    address_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deletes an address from user's address book."""
    address = db.query(Address).filter(Address.id == address_id, Address.user_id == current_user.id).first()
    if not address:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Address not found")

    db.delete(address)
    db.commit()
    return {"status": "success", "message": "Address deleted"}

@router.get("/wallet")
def get_wallet_balance(current_user: User = Depends(get_current_user)):
    """Fetches user wallet balance and referral details."""
    return {
        "wallet_balance": current_user.wallet_balance,
        "referral_code": current_user.referral_code,
        "currency": "INR"
    }
