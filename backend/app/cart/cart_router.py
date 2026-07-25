from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database.db import get_db
from app.database.models import CartItem, Product, User

router = APIRouter(prefix="/api/cart", tags=["4. Shopping Cart"])

class AddCartPayload(BaseModel):
    user_id: int
    product_id: int
    quantity: int = 1

class UpdateCartPayload(BaseModel):
    quantity: int
    saved_for_later: bool = False

@router.get("/{user_id}")
def get_user_cart(user_id: int, db: Session = Depends(get_db)):
    items = db.query(CartItem).filter(CartItem.user_id == user_id).all()
    active_items = []
    saved_items = []
    
    for item in items:
        data = {
            "id": item.id,
            "product_id": item.product_id,
            "product_name": item.product.name if item.product else "Product",
            "price": item.product.price if item.product else 0.0,
            "image_url": item.product.image_url if item.product else "",
            "quantity": item.quantity,
            "saved_for_later": item.saved_for_later
        }
        if item.saved_for_later:
            saved_items.append(data)
        else:
            active_items.append(data)

    return {"active_cart": active_items, "saved_for_later": saved_items}

@router.post("")
def add_to_cart(payload: AddCartPayload, db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.user_id == payload.user_id, CartItem.product_id == payload.product_id).first()
    if item:
        item.quantity += payload.quantity
    else:
        item = CartItem(user_id=payload.user_id, product_id=payload.product_id, quantity=payload.quantity)
        db.add(item)
    
    db.commit()
    db.refresh(item)
    return item

@router.put("/{item_id}")
def update_cart_item(item_id: int, payload: UpdateCartPayload, db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    item.quantity = payload.quantity
    item.saved_for_later = payload.saved_for_later
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}")
def remove_from_cart(item_id: int, db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    db.delete(item)
    db.commit()
    return {"message": "Item removed from cart"}
