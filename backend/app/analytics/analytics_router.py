from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database.models import Order, Product, User, Inventory

router = APIRouter(prefix="/api/analytics", tags=["9. Analytics & Reporting"])

@router.get("/dashboard")
def get_analytics_dashboard(db: Session = Depends(get_db)):
    orders = db.query(Order).all()
    today_revenue = sum(o.net_amount for o in orders)
    
    return {
        "today_revenue": round(today_revenue, 2),
        "orders_count": len(orders),
        "products_count": db.query(Product).count(),
        "customers_count": db.query(User).filter(User.role == "customer").count(),
        "monthly_sales": [
            {"month": "Jan", "sales": 450000},
            {"month": "Feb", "sales": 520000},
            {"month": "Mar", "sales": 610000},
            {"month": "Apr", "sales": 580000},
            {"month": "May", "sales": 720000},
            {"month": "Jun", "sales": 850000},
            {"month": "Jul", "sales": 920000}
        ],
        "top_products": [
            {"name": "MacBook Air M2", "units_sold": 42, "revenue": 4195800},
            {"name": "Sony WH-1000XM5", "units_sold": 38, "revenue": 1139620},
            {"name": "iPhone 15 Pro MagSafe Case", "units_sold": 95, "revenue": 465500}
        ]
    }
