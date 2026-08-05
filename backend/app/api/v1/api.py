from fastapi import APIRouter
from app.routes.auth_routes import router as auth_router
from app.routes.user_routes import router as user_router
from app.routes.product_routes import router as product_router
from app.routes.cart_routes import router as cart_router
from app.routes.order_routes import router as order_router
from app.routes.payment_routes import router as payment_router
from app.routes.location_routes import router as location_router
from app.routes.admin_routes import router as admin_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(user_router)
api_router.include_router(product_router)
api_router.include_router(cart_router)
api_router.include_router(order_router)
api_router.include_router(payment_router)
api_router.include_router(location_router)
api_router.include_router(admin_router)
