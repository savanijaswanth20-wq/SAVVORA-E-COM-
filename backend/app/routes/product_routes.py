from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.models import Category, Brand
from app.schemas.schemas import ProductIn, ProductOut, PaginatedProductsResponse, CategoryOut, BrandOut
from app.services.product_service import product_service
from app.dependencies.auth_deps import require_admin, get_current_user
from app.models.models import User

router = APIRouter(prefix="/products", tags=["3. Products & Catalog"])

@router.get("", response_model=PaginatedProductsResponse)
def list_products(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    q: Optional[str] = Query(default=None),
    category_id: Optional[int] = Query(default=None),
    brand_id: Optional[int] = Query(default=None),
    min_price: Optional[float] = Query(default=None),
    max_price: Optional[float] = Query(default=None),
    is_featured: Optional[bool] = Query(default=None),
    is_trending: Optional[bool] = Query(default=None),
    is_best_seller: Optional[bool] = Query(default=None),
    sort_by: Optional[str] = Query(default="created_at_desc"),
    db: Session = Depends(get_db)
):
    """Lists products with search query, category/brand filters, and pagination."""
    return product_service.get_products(
        db, page=page, limit=limit, query=q, category_id=category_id,
        brand_id=brand_id, min_price=min_price, max_price=max_price,
        is_featured=is_featured, is_trending=is_trending, is_best_seller=is_best_seller,
        sort_by=sort_by
    )

@router.get("/collections")
def get_product_collections(db: Session = Depends(get_db)):
    """Fetches product collections: Trending, Featured, Best Sellers."""
    return product_service.get_collections(db)

@router.get("/categories", response_model=List[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    """Lists all product categories."""
    return db.query(Category).filter(Category.is_active == True).all()

@router.get("/brands", response_model=List[BrandOut])
def list_brands(db: Session = Depends(get_db)):
    """Lists all product brands."""
    return db.query(Brand).filter(Brand.is_active == True).all()

@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Fetches details of a single product."""
    return product_service.get_product_by_id(db, product_id)

@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductIn,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Creates a new product in catalog (Admin only)."""
    return product_service.create_product(db, payload.dict())

@router.put("/{product_id}", response_model=ProductOut)
def update_product(
    product_id: int,
    payload: ProductIn,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Updates product information (Admin only)."""
    return product_service.update_product(db, product_id, payload.dict())

@router.delete("/{product_id}")
def soft_delete_product(
    product_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Soft deletes product by setting is_deleted=True (Admin only)."""
    product_service.soft_delete_product(db, product_id)
    return {"status": "success", "message": f"Product #{product_id} soft deleted"}
