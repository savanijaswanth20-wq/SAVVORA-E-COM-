from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.models import User
from app.schemas.schemas import AddToCartPayload, UpdateCartPayload, CartSummaryOut, ApplyCouponPayload
from app.services.cart_service import cart_service
from app.dependencies.auth_deps import get_current_user

router = APIRouter(prefix="/cart", tags=["4. Cart & Wishlist"])

@router.get("", response_model=CartSummaryOut)
def get_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetches user shopping cart items with calculated totals."""
    return cart_service.get_user_cart(db, current_user.id)

@router.post("/items")
def add_to_cart(
    payload: AddToCartPayload,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Adds product to cart or increments quantity."""
    item = cart_service.add_to_cart(db, current_user.id, payload.product_id, payload.quantity)
    return {"status": "success", "message": "Item added to cart", "cart_item_id": item.id}

@router.put("/items/{item_id}")
def update_cart_item(
    item_id: int,
    payload: UpdateCartPayload,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Updates cart item quantity."""
    cart_service.update_cart_item(db, current_user.id, item_id, payload.quantity)
    return {"status": "success", "message": "Cart item updated"}

@router.delete("/items/{item_id}")
def remove_cart_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Removes single item from cart."""
    cart_service.remove_from_cart(db, current_user.id, item_id)
    return {"status": "success", "message": "Item removed from cart"}

@router.delete("/clear")
def clear_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Clears all items in user's cart."""
    cart_service.clear_cart(db, current_user.id)
    return {"status": "success", "message": "Cart cleared"}

# --- Wishlist Routes ---
@router.get("/wishlist")
def get_wishlist(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Lists items in user's wishlist."""
    return cart_service.get_wishlist(db, current_user.id)

@router.post("/wishlist/toggle/{product_id}")
def toggle_wishlist(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Toggles product in user wishlist."""
    return cart_service.toggle_wishlist(db, current_user.id, product_id)

# --- Coupon Application ---
@router.post("/apply-coupon")
def apply_coupon(payload: ApplyCouponPayload, db: Session = Depends(get_db)):
    """Evaluates coupon code and returns discount calculation."""
    return cart_service.apply_coupon(db, payload.code, payload.order_amount)
