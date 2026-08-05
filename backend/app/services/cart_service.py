import logging
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.models import CartItem, Wishlist, Product, Coupon

logger = logging.getLogger("savvora.cart")

class CartService:
    def get_user_cart(self, db: Session, user_id: int) -> Dict[str, Any]:
        """Calculates cart totals, item subtotal, discounts, tax, shipping."""
        items = db.query(CartItem).filter(CartItem.user_id == user_id).all()

        subtotal = 0.0
        formatted_items = []

        for item in items:
            p = db.query(Product).filter(Product.id == item.product_id, Product.is_deleted == False).first()
            if p:
                item_subtotal = p.price * item.quantity
                subtotal += item_subtotal
                formatted_items.append({
                    "id": item.id,
                    "product_id": p.id,
                    "quantity": item.quantity,
                    "product": {
                        "id": p.id,
                        "name": p.name,
                        "price": p.price,
                        "original_price": p.original_price,
                        "sku": p.sku,
                        "image_url": p.image_url,
                        "rating": p.rating,
                        "reviews_count": p.reviews_count
                    },
                    "subtotal": item_subtotal
                })

        tax = round(subtotal * 0.18, 2) # 18% GST standard rate
        shipping_fee = 0.0 if subtotal >= 999.0 or subtotal == 0 else 99.0
        total = round(subtotal + tax + shipping_fee, 2)

        return {
            "items": formatted_items,
            "subtotal": round(subtotal, 2),
            "discount": 0.0,
            "tax": tax,
            "shipping_fee": shipping_fee,
            "total": total
        }

    def add_to_cart(self, db: Session, user_id: int, product_id: int, quantity: int = 1) -> CartItem:
        """Adds a product item to user's cart or increments quantity."""
        product = db.query(Product).filter(Product.id == product_id, Product.is_deleted == False).first()
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

        cart_item = db.query(CartItem).filter(CartItem.user_id == user_id, CartItem.product_id == product_id).first()
        if cart_item:
            cart_item.quantity += quantity
        else:
            cart_item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
            db.add(cart_item)

        db.commit()
        db.refresh(cart_item)
        return cart_item

    def update_cart_item(self, db: Session, user_id: int, item_id: int, quantity: int) -> CartItem:
        """Updates item quantity in cart."""
        cart_item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.user_id == user_id).first()
        if not cart_item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")

        cart_item.quantity = quantity
        db.commit()
        db.refresh(cart_item)
        return cart_item

    def remove_from_cart(self, db: Session, user_id: int, item_id: int) -> bool:
        """Removes single item from cart."""
        cart_item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.user_id == user_id).first()
        if cart_item:
            db.delete(cart_item)
            db.commit()
            return True
        return False

    def clear_cart(self, db: Session, user_id: int):
        """Clears all items in user's cart."""
        db.query(CartItem).filter(CartItem.user_id == user_id).delete()
        db.commit()

    def toggle_wishlist(self, db: Session, user_id: int, product_id: int) -> Dict[str, Any]:
        """Toggles product presence in user wishlist."""
        existing = db.query(Wishlist).filter(Wishlist.user_id == user_id, Wishlist.product_id == product_id).first()
        if existing:
            db.delete(existing)
            db.commit()
            return {"status": "removed", "message": "Product removed from wishlist"}
        else:
            w = Wishlist(user_id=user_id, product_id=product_id)
            db.add(w)
            db.commit()
            return {"status": "added", "message": "Product added to wishlist"}

    def get_wishlist(self, db: Session, user_id: int) -> List[Dict[str, Any]]:
        """Lists all wishlist items for user."""
        items = db.query(Wishlist).filter(Wishlist.user_id == user_id).all()
        result = []
        for item in items:
            p = db.query(Product).filter(Product.id == item.product_id, Product.is_deleted == False).first()
            if p:
                result.append({
                    "id": item.id,
                    "product_id": p.id,
                    "name": p.name,
                    "price": p.price,
                    "original_price": p.original_price,
                    "image_url": p.image_url,
                    "rating": p.rating,
                    "created_at": item.created_at
                })
        return result

    def apply_coupon(self, db: Session, code: str, order_amount: float) -> Dict[str, Any]:
        """Validates coupon code and calculates discount."""
        coupon = db.query(Coupon).filter(Coupon.code == code, Coupon.is_active == True).first()
        if not coupon:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid or expired coupon code")

        if order_amount < coupon.min_order_value:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Minimum order amount for coupon {code} is ₹{coupon.min_order_value:,.2f}"
            )

        if coupon.discount_type == "percentage":
            discount = (order_amount * coupon.discount_percent) / 100.0
            if coupon.max_discount:
                discount = min(discount, coupon.max_discount)
        else:
            discount = coupon.discount_value

        return {
            "code": coupon.code,
            "discount_amount": round(discount, 2),
            "final_amount": round(order_amount - discount, 2)
        }

cart_service = CartService()
