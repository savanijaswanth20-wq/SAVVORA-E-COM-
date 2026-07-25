from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    name: str
    email: str
    role: Optional[str] = "customer"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(UserBase):
    id: int
    is_verified: bool
    avatar: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Category Schemas
class CategoryBase(BaseModel):
    name: str
    slug: str
    icon: str = "Package"
    image_url: Optional[str] = None

class CategoryResponse(CategoryBase):
    id: int

    class Config:
        from_attributes = True

# Product Schemas
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    sku: str
    category_id: int
    image_url: str
    is_featured: Optional[bool] = False

class ProductCreate(ProductBase):
    initial_stock: Optional[int] = 50

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    category_id: Optional[int] = None
    image_url: Optional[str] = None
    is_featured: Optional[bool] = None

class InventoryResponse(BaseModel):
    id: int
    stock_count: int
    low_stock_threshold: int
    warehouse_location: str
    reorder_level: int
    reorder_quantity: int
    last_restocked: datetime

    class Config:
        from_attributes = True

class ProductResponse(ProductBase):
    id: int
    is_approved: bool
    rating: float
    reviews_count: int
    created_at: datetime
    inventory: Optional[InventoryResponse] = None
    category: Optional[CategoryResponse] = None

    class Config:
        from_attributes = True

# Inventory Operations
class StockUpdate(BaseModel):
    stock_count: int
    warehouse_location: Optional[str] = "Warehouse A-1"

# Order Schemas
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    shipping_address: str
    payment_method: str = "Razorpay"
    coupon_code: Optional[str] = None

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float
    subtotal: float
    product: ProductResponse

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    user_id: int
    total_amount: float
    discount_amount: float
    net_amount: float
    status: str
    payment_method: str
    payment_status: str
    tracking_number: Optional[str] = None
    shipping_address: str
    created_at: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True

# AI Chat & Search Schemas
class AIChatRequest(BaseModel):
    prompt: str
    context: Optional[str] = None

class AIChatResponse(BaseModel):
    reply: str
    action_suggested: Optional[str] = None
    related_products: Optional[List[int]] = None

# Analytics Dashboard Schema
class DashboardStats(BaseModel):
    today_revenue: float
    orders_count: int
    products_count: int
    customers_count: int
    low_stock_count: int

class CouponVerify(BaseModel):
    code: str
    cart_total: float

class CouponResponse(BaseModel):
    valid: bool
    discount_amount: float
    message: str
