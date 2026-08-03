import os
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.db import engine, Base
from app.auth import auth_router
from app.users import user_router
from app.products import product_router
from app.inventory import inventory_router
from app.cart import cart_router
from app.orders import order_router
from app.payments import payment_router
from app.reviews import review_router
from app.coupons import coupon_router
from app.analytics import analytics_router
from app.notifications import notification_router
from app.admin import admin_router
from app.ai import ai_router
from routes.location_routes import router as location_router

from middleware.audit_middleware import AuditLoggingMiddleware
from middleware.rate_limit import RateLimitingMiddleware

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="StockFlow Enterprise Modular API",
    description="Next-Generation Stock & Inventory Management E-Commerce Platform API",
    version="3.0.0"
)

# 1. Rate Limiting Middleware
app.add_middleware(RateLimitingMiddleware, requests_per_minute=120)

# 2. Audit Logging Middleware
app.add_middleware(AuditLoggingMiddleware)

# 3. CORS Middleware for Next.js Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register modular routers
app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(product_router.router)
app.include_router(inventory_router.router)
app.include_router(cart_router.router)
app.include_router(order_router.router)
app.include_router(payment_router.router)
app.include_router(review_router.router)
app.include_router(coupon_router.router)
app.include_router(analytics_router.router)
app.include_router(notification_router.router)
app.include_router(admin_router.router)
app.include_router(ai_router.router)
app.include_router(location_router, prefix="/api/v1")

# Save OpenAPI Schema to docs/
try:
    os.makedirs("docs", exist_ok=True)
    with open("docs/openapi.json", "w", encoding="utf-8") as f:
        json.dump(app.openapi(), f, indent=2)
except Exception as e:
    pass

@app.get("/")
def root():
    return {
        "platform": "StockFlow Enterprise Modular Platform",
        "status": "Online",
        "version": "3.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
