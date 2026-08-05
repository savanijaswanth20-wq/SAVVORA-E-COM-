import re
import math
import logging
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc
from fastapi import HTTPException, status
from app.models.models import Product, Category, Brand, Inventory, RecentlyViewed
from app.core.cache import cache_manager

logger = logging.getLogger("savvora.products")

class ProductService:
    def _slugify(self, text: str) -> str:
        text = text.lower().strip()
        text = re.sub(r'[^\w\s-]', '', text)
        return re.sub(r'[\s_-]+', '-', text)

    def get_products(
        self,
        db: Session,
        page: int = 1,
        limit: int = 20,
        query: Optional[str] = None,
        category_id: Optional[int] = None,
        brand_id: Optional[int] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        is_featured: Optional[bool] = None,
        is_trending: Optional[bool] = None,
        is_best_seller: Optional[bool] = None,
        sort_by: Optional[str] = "created_at_desc"
    ) -> Dict[str, Any]:
        """Lists products with filtering, search query, sorting, and pagination."""
        base_query = db.query(Product).filter(Product.is_deleted == False, Product.is_approved == True)

        if query:
            search_pattern = f"%{query}%"
            base_query = base_query.filter(
                or_(
                    Product.name.ilike(search_pattern),
                    Product.description.ilike(search_pattern),
                    Product.sku.ilike(search_pattern)
                )
            )

        if category_id:
            base_query = base_query.filter(Product.category_id == category_id)
        if brand_id:
            base_query = base_query.filter(Product.brand_id == brand_id)
        if min_price is not None:
            base_query = base_query.filter(Product.price >= min_price)
        if max_price is not None:
            base_query = base_query.filter(Product.price <= max_price)
        if is_featured is not None:
            base_query = base_query.filter(Product.is_featured == is_featured)
        if is_trending is not None:
            base_query = base_query.filter(Product.is_trending == is_trending)
        if is_best_seller is not None:
            base_query = base_query.filter(Product.is_best_seller == is_best_seller)

        # Sorting logic
        if sort_by == "price_asc":
            base_query = base_query.order_by(Product.price.asc())
        elif sort_by == "price_desc":
            base_query = base_query.order_by(Product.price.desc())
        elif sort_by == "rating":
            base_query = base_query.order_by(Product.rating.desc())
        else:
            base_query = base_query.order_by(Product.created_at.desc())

        total = base_query.count()
        pages = math.ceil(total / limit) if limit > 0 else 1
        offset = (page - 1) * limit

        products = base_query.offset(offset).limit(limit).all()

        return {
            "total": total,
            "page": page,
            "limit": limit,
            "pages": pages,
            "items": products
        }

    def get_product_by_id(self, db: Session, product_id: int, user_id: Optional[int] = None) -> Product:
        """Fetches product details and records recently viewed item for user."""
        product = db.query(Product).filter(Product.id == product_id, Product.is_deleted == False).first()
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

        if user_id:
            # Record recently viewed
            rv = RecentlyViewed(user_id=user_id, product_id=product.id)
            db.add(rv)
            db.commit()

        return product

    def create_product(self, db: Session, payload: Dict[str, Any]) -> Product:
        """Creates a new product and initializes inventory record."""
        slug = self._slugify(payload.get("name", ""))
        existing_sku = db.query(Product).filter(Product.sku == payload.get("sku")).first()
        if existing_sku:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="SKU already exists")

        product = Product(
            name=payload.get("name"),
            slug=slug,
            description=payload.get("description"),
            price=payload.get("price"),
            original_price=payload.get("original_price") or payload.get("price"),
            cost_price=payload.get("cost_price"),
            sku=payload.get("sku"),
            barcode=payload.get("barcode"),
            category_id=payload.get("category_id"),
            brand_id=payload.get("brand_id"),
            image_url=payload.get("image_url"),
            gallery_images=str(payload.get("gallery_images", [])),
            is_featured=payload.get("is_featured", False),
            is_trending=payload.get("is_trending", False),
            is_best_seller=payload.get("is_best_seller", False)
        )
        db.add(product)
        db.commit()
        db.refresh(product)

        # Create inventory
        inventory = Inventory(
            product_id=product.id,
            stock_count=payload.get("stock_count", 50)
        )
        db.add(inventory)
        db.commit()

        # Invalidate cache
        cache_manager.delete("featured_products")
        cache_manager.delete("trending_products")

        return product

    def update_product(self, db: Session, product_id: int, payload: Dict[str, Any]) -> Product:
        """Updates product information."""
        product = db.query(Product).filter(Product.id == product_id, Product.is_deleted == False).first()
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

        for k, v in payload.items():
            if v is not None and hasattr(product, k):
                setattr(product, k, v)

        if "name" in payload:
            product.slug = self._slugify(payload["name"])

        db.commit()
        db.refresh(product)
        return product

    def soft_delete_product(self, db: Session, product_id: int) -> bool:
        """Soft deletes product by setting is_deleted=True."""
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

        product.is_deleted = True
        db.commit()
        return True

    def get_collections(self, db: Session) -> Dict[str, Any]:
        """Fetches Trending, Featured, Best Sellers, and Top Categories."""
        cached = cache_manager.get_json("product_collections")
        if cached:
            return cached

        trending = db.query(Product).filter(Product.is_trending == True, Product.is_deleted == False).limit(8).all()
        featured = db.query(Product).filter(Product.is_featured == True, Product.is_deleted == False).limit(8).all()
        best_sellers = db.query(Product).filter(Product.is_best_seller == True, Product.is_deleted == False).limit(8).all()
        categories = db.query(Category).filter(Category.is_active == True).all()

        res = {
            "trending": [p.id for p in trending],
            "featured": [p.id for p in featured],
            "best_sellers": [p.id for p in best_sellers],
            "categories_count": len(categories)
        }
        cache_manager.set_json("product_collections", res, expire_seconds=300)
        return res

product_service = ProductService()
