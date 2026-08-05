import os
import json
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config.config import settings
from app.database.db import engine, Base
from app.api.v1.api import api_router

# Legacy router imports for 100% backward compatibility
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

from middleware.audit_middleware import AuditLoggingMiddleware
from middleware.rate_limit import RateLimitingMiddleware

# Configure Structured Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("savvora.main")

# Auto-create missing database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="SAVVORA Production Enterprise E-Commerce Platform API",
    version=settings.VERSION,
    openapi_url="/docs/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# 1. Rate Limiting Middleware
app.add_middleware(RateLimitingMiddleware, requests_per_minute=120)

# 2. Audit Logging Middleware
app.add_middleware(AuditLoggingMiddleware)

# 3. Security & CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static uploads directory for invoices and images
os.makedirs("uploads/invoices", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Unified API v1 Router Registration
app.include_router(api_router, prefix=settings.API_V1_STR)

# Legacy Routers for 100% Backward Compatibility with existing frontend/clients
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

# Save OpenAPI Schema to docs/
try:
    os.makedirs("docs", exist_ok=True)
    with open("docs/openapi.json", "w", encoding="utf-8") as f:
        json.dump(app.openapi(), f, indent=2)
except Exception as e:
    logger.warning(f"Could not write openapi.json file: {e}")

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "status": "Online",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
