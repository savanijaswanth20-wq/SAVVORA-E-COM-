from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from app.database.db import get_db
from app.database.models import Review, Product

router = APIRouter(prefix="/api/reviews", tags=["7. Product Reviews & Moderation"])

class ReviewPayload(BaseModel):
    user_id: int
    product_id: int
    rating: int
    comment: str

@router.get("/product/{product_id}")
def get_product_reviews(product_id: int, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.product_id == product_id, Review.is_approved == True).all()

@router.post("")
def submit_review(payload: ReviewPayload, db: Session = Depends(get_db)):
    rev = Review(
        user_id=payload.user_id,
        product_id=payload.product_id,
        rating=payload.rating,
        comment=payload.comment,
        is_approved=True # Auto-approve for demo
    )
    db.add(rev)
    db.commit()
    db.refresh(rev)

    # Recalculate average rating
    all_revs = db.query(Review).filter(Review.product_id == payload.product_id).all()
    if all_revs:
        avg_rating = sum(r.rating for r in all_revs) / len(all_revs)
        prod = db.query(Product).filter(Product.id == payload.product_id).first()
        if prod:
            prod.rating = round(avg_rating, 1)
            prod.reviews_count = len(all_revs)
            db.commit()

    return rev

@router.put("/{review_id}/moderate")
def moderate_review(review_id: int, approve: bool, db: Session = Depends(get_db)):
    rev = db.query(Review).filter(Review.id == review_id).first()
    if not rev:
        raise HTTPException(status_code=404, detail="Review not found")
    rev.is_approved = approve
    db.commit()
    return {"message": f"Review #{review_id} moderation set to approved={approve}"}
