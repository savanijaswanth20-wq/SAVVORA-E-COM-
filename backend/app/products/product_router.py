from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.database.db import get_db
from app.database.models import Product, Category, Inventory, ProductVariant, ProductImage
from app.utils.cloudinary_upload import upload_image_to_cloudinary

router = APIRouter(prefix="/api/products", tags=["2. Product Management"])

class ProductCreatePayload(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    sku: str
    category_id: int
    image_url: str
    initial_stock: Optional[int] = 50

class VariantCreatePayload(BaseModel):
    name: str
    sku: str
    price_modifier: float = 0.0
    stock_count: int = 10

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@router.get("")
def get_products(
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.is_approved == True)
    
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%") | Product.description.ilike(f"%{search}%"))
    if category_id:
        query = query.filter(Product.category_id == category_id)
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    total_count = query.count()
    offset = (page - 1) * limit
    products = query.offset(offset).limit(limit).all()

    # Format result with inventory info
    result = []
    for p in products:
        result.append({
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "price": p.price,
            "original_price": p.original_price,
            "sku": p.sku,
            "category_id": p.category_id,
            "image_url": p.image_url,
            "rating": p.rating,
            "reviews_count": p.reviews_count,
            "is_featured": p.is_featured,
            "inventory": {
                "stock_count": p.inventory.stock_count if p.inventory else 0,
                "low_stock_threshold": p.inventory.low_stock_threshold if p.inventory else 5
            } if p.inventory else None
        })

    return {
        "page": page,
        "limit": limit,
        "total_count": total_count,
        "total_pages": (total_count + limit - 1) // limit,
        "items": result
    }

@router.get("/{product_id}")
def get_product_details(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "original_price": product.original_price,
        "sku": product.sku,
        "image_url": product.image_url,
        "inventory": product.inventory,
        "variants": product.variants,
        "images": product.images
    }

@router.post("")
def create_product(payload: ProductCreatePayload, db: Session = Depends(get_db)):
    if db.query(Product).filter(Product.sku == payload.sku).first():
        raise HTTPException(status_code=400, detail="SKU already exists")
    
    prod = Product(
        name=payload.name,
        description=payload.description,
        price=payload.price,
        original_price=payload.original_price or (payload.price * 1.2),
        sku=payload.sku,
        category_id=payload.category_id,
        image_url=payload.image_url,
        is_approved=True
    )
    db.add(prod)
    db.commit()
    db.refresh(prod)

    inv = Inventory(
        product_id=prod.id,
        stock_count=payload.initial_stock or 50,
        low_stock_threshold=5,
        warehouse_location="Warehouse A-1"
    )
    db.add(inv)
    db.commit()

    return prod

@router.post("/{product_id}/variants")
def add_product_variant(product_id: int, payload: VariantCreatePayload, db: Session = Depends(get_db)):
    prod = db.query(Product).filter(Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    
    variant = ProductVariant(
        product_id=product_id,
        name=payload.name,
        sku=payload.sku,
        price_modifier=payload.price_modifier,
        stock_count=payload.stock_count
    )
    db.add(variant)
    db.commit()
    db.refresh(variant)
    return variant

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    prod = db.query(Product).filter(Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    if prod.inventory:
        db.delete(prod.inventory)
    db.delete(prod)
    db.commit()
    return {"message": "Product deleted successfully"}
