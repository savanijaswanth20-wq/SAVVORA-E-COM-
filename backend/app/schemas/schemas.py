from typing import Optional, List, Any
from pydantic import BaseModel, Field
from datetime import datetime

# --- Auth Schemas ---
class RegisterPayload(BaseModel):
    name: str = Field(..., example="Aarav Sharma")
    email: str = Field(..., example="aarav@example.com")
    password: str = Field(..., min_length=6, example="Secret123!")
    role: Optional[str] = "customer"

class LoginPayload(BaseModel):
    email: str
    password: str

class RefreshTokenPayload(BaseModel):
    refresh_token: str

class ForgotPasswordPayload(BaseModel):
    email: str

class ResetPasswordPayload(BaseModel):
    email: str
    reset_token: str
    new_password: str = Field(..., min_length=6)

class PhoneOtpSendPayload(BaseModel):
    phone: str = Field(..., example="9876543210")

class PhoneOtpVerifyPayload(BaseModel):
    phone: str
    otp: str

class GoogleCodeExchangePayload(BaseModel):
    authorization_code: str
    state: Optional[str] = "state_default"

# --- User & Profile Schemas ---
class UserOut(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    role: str
    is_verified: bool
    avatar: Optional[str] = None
    wallet_balance: float = 0.0
    referral_code: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ProfileUpdatePayload(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    avatar: Optional[str] = None
    bio: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[str] = None

class AddressIn(BaseModel):
    title: Optional[str] = "Home"
    recipient_name: str
    phone: str
    street: str
    city: str
    state: str
    postal_code: str
    country: Optional[str] = "India"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_default: Optional[bool] = False

class AddressOut(AddressIn):
    id: int
    user_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Product, Brand & Category Schemas ---
class CategoryOut(BaseModel):
    id: int
    name: str
    slug: str
    icon: Optional[str] = "Package"
    image_url: Optional[str] = None
    parent_id: Optional[int] = None
    is_active: bool = True

    class Config:
        from_attributes = True

class BrandOut(BaseModel):
    id: int
    name: str
    slug: str
    logo_url: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True

class ProductIn(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    cost_price: Optional[float] = None
    sku: str
    barcode: Optional[str] = None
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    image_url: str
    gallery_images: Optional[List[str]] = []
    is_featured: Optional[bool] = False
    is_trending: Optional[bool] = False
    is_best_seller: Optional[bool] = False

class ProductOut(BaseModel):
    id: int
    name: str
    slug: Optional[str] = None
    description: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    sku: str
    image_url: str
    rating: float = 4.8
    reviews_count: int = 12
    is_featured: bool = False
    is_trending: bool = False
    is_best_seller: bool = False
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    stock_count: Optional[int] = 50

    class Config:
        from_attributes = True

class PaginatedProductsResponse(BaseModel):
    total: int
    page: int
    limit: int
    pages: int
    items: List[ProductOut]

# --- Cart & Wishlist Schemas ---
class AddToCartPayload(BaseModel):
    product_id: int
    quantity: int = Field(default=1, ge=1)

class UpdateCartPayload(BaseModel):
    quantity: int = Field(..., ge=1)

class CartItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    product: ProductOut

    class Config:
        from_attributes = True

class CartSummaryOut(BaseModel):
    items: List[CartItemOut]
    subtotal: float
    discount: float
    tax: float
    shipping_fee: float
    total: float

# --- Order & Checkout Schemas ---
class CheckoutPayload(BaseModel):
    address_id: int
    payment_method: str = "Razorpay" # Razorpay, COD, Wallet
    coupon_code: Optional[str] = None
    idempotency_key: Optional[str] = None

class OrderItemOut(BaseModel):
    id: int
    product_id: int
    product_name: Optional[str] = None
    sku: Optional[str] = None
    quantity: int
    unit_price: float
    subtotal: float

    class Config:
        from_attributes = True

class OrderOut(BaseModel):
    id: int
    order_number: Optional[str] = None
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
    items: List[OrderItemOut] = []

    class Config:
        from_attributes = True

class CancelOrderPayload(BaseModel):
    reason: str

class ReturnOrderPayload(BaseModel):
    reason: str

# --- Payment & Razorpay Schemas ---
class CreatePaymentOrderPayload(BaseModel):
    order_id: int

class VerifyPaymentPayload(BaseModel):
    order_id: int
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

class RefundPayload(BaseModel):
    order_id: int
    reason: str
    amount: Optional[float] = None

# --- Coupons & Support Schemas ---
class ApplyCouponPayload(BaseModel):
    code: str
    order_amount: float

class CouponOut(BaseModel):
    id: int
    code: str
    description: Optional[str] = None
    discount_type: str
    discount_percent: float
    max_discount: float
    min_order_value: float
    is_active: bool

    class Config:
        from_attributes = True

class SupportTicketIn(BaseModel):
    subject: str
    category: Optional[str] = "General"
    priority: Optional[str] = "MEDIUM"
    message: str

class SupportTicketOut(BaseModel):
    id: int
    ticket_number: str
    subject: str
    category: str
    priority: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Admin Analytics Schema ---
class AdminDashboardMetrics(BaseModel):
    total_sales_inr: float
    total_orders: int
    total_customers: int
    low_stock_products: int
    active_products: int
    pending_returns: int
