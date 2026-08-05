from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.models import User, Product, Inventory, SupportTicket, Coupon
from app.schemas.schemas import AdminDashboardMetrics, CouponOut, SupportTicketOut
from app.services.admin_service import admin_service
from app.dependencies.auth_deps import require_admin, require_staff

router = APIRouter(prefix="/admin", tags=["8. Admin Dashboard & Analytics"])

@router.get("/metrics", response_model=AdminDashboardMetrics)
def get_dashboard_metrics(current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    """Fetches high-level executive dashboard statistics (Admin only)."""
    return admin_service.get_dashboard_metrics(db)

@router.get("/analytics")
def get_sales_analytics(current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    """Fetches sales trends, revenue distribution, and growth metrics (Admin only)."""
    return admin_service.get_sales_analytics(db)

@router.get("/inventory/low-stock")
def get_low_stock_inventory(current_user: User = Depends(require_staff), db: Session = Depends(get_db)):
    """Lists products with inventory below low stock threshold (Staff/Admin)."""
    low_stock = db.query(Inventory).filter(Inventory.stock_count <= Inventory.low_stock_threshold).all()
    res = []
    for inv in low_stock:
        p = db.query(Product).filter(Product.id == inv.product_id).first()
        if p:
            res.append({
                "product_id": p.id,
                "name": p.name,
                "sku": p.sku,
                "stock_count": inv.stock_count,
                "low_stock_threshold": inv.low_stock_threshold,
                "warehouse_location": inv.warehouse_location
            })
    return res

@router.get("/coupons", response_model=List[CouponOut])
def list_coupons(current_user: User = Depends(require_staff), db: Session = Depends(get_db)):
    """Lists all active and inactive discount coupons."""
    return db.query(Coupon).all()

@router.post("/coupons", response_model=CouponOut, status_code=status.HTTP_201_CREATED)
def create_coupon(
    code: str,
    discount_percent: float = 10.0,
    max_discount: float = 500.0,
    min_order_value: float = 999.0,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Creates a new discount coupon (Admin only)."""
    existing = db.query(Coupon).filter(Coupon.code == code).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Coupon code already exists")

    coupon = Coupon(
        code=code.upper(),
        discount_percent=discount_percent,
        max_discount=max_discount,
        min_order_value=min_order_value,
        is_active=True
    )
    db.add(coupon)
    db.commit()
    db.refresh(coupon)
    return coupon

@router.get("/tickets", response_model=List[SupportTicketOut])
def list_support_tickets(current_user: User = Depends(require_staff), db: Session = Depends(get_db)):
    """Lists all customer support tickets."""
    return db.query(SupportTicket).all()
