from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.db import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    STAFF = "staff"
    CUSTOMER = "customer"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default=UserRole.CUSTOMER.value)
    is_verified = Column(Boolean, default=True)
    avatar = Column(String, nullable=True)
    reset_token = Column(String, nullable=True)
    refresh_token = Column(String, nullable=True)
    google_oauth_token = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    orders = relationship("Order", back_populates="user")
    reviews = relationship("Review", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    wishlist_items = relationship("Wishlist", back_populates="user")
    cart_items = relationship("CartItem", back_populates="user")
    addresses = relationship("Address", back_populates="user")

class Address(Base):
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    street = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    zip_code = Column(String, nullable=False)
    is_default = Column(Boolean, default=False)

    user = relationship("User", back_populates="addresses")

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    icon = Column(String, nullable=False, default="Package")
    image_url = Column(String, nullable=True)

    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=True)
    sku = Column(String, unique=True, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"))
    image_url = Column(String, nullable=False)
    is_approved = Column(Boolean, default=True)
    rating = Column(Float, default=4.8)
    reviews_count = Column(Integer, default=12)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    category = relationship("Category", back_populates="products")
    inventory = relationship("Inventory", back_populates="product", uselist=False)
    order_items = relationship("OrderItem", back_populates="product")
    reviews = relationship("Review", back_populates="product")
    images = relationship("ProductImage", back_populates="product")
    variants = relationship("ProductVariant", back_populates="product")

class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    image_url = Column(String, nullable=False)
    is_primary = Column(Boolean, default=False)

    product = relationship("Product", back_populates="images")

class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    name = Column(String, nullable=False) # e.g. Size: M, Color: Black
    sku = Column(String, unique=True, nullable=False)
    price_modifier = Column(Float, default=0.0)
    stock_count = Column(Integer, default=10)

    product = relationship("Product", back_populates="variants")

class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), unique=True)
    stock_count = Column(Integer, default=0)
    low_stock_threshold = Column(Integer, default=5)
    warehouse_location = Column(String, default="Warehouse A-1")
    reorder_level = Column(Integer, default=10)
    reorder_quantity = Column(Integer, default=50)
    annual_demand = Column(Integer, default=1200)
    ordering_cost = Column(Float, default=500.0)
    holding_cost = Column(Float, default=150.0)
    last_restocked = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="inventory")

class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, default=1)
    saved_for_later = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="cart_items")
    product = relationship("Product")

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    contact_person = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    total_amount = Column(Float, nullable=False)
    discount_amount = Column(Float, default=0.0)
    net_amount = Column(Float, nullable=False)
    status = Column(String, default="processing") # processing, shipped, delivered, cancelled, return_requested
    payment_method = Column(String, default="Razorpay")
    payment_status = Column(String, default="Paid")
    tracking_number = Column(String, nullable=True)
    shipping_address = Column(Text, nullable=False)
    idempotency_key = Column(String, unique=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")
    payment = relationship("Payment", back_populates="order", uselist=False)

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    subtotal = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), unique=True)
    payment_gateway = Column(String, nullable=False) # Razorpay, Stripe, COD
    transaction_id = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String, default="SUCCESS") # SUCCESS, REFUNDED, FAILED
    refund_amount = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    order = relationship("Order", back_populates="payment")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)
    is_approved = Column(Boolean, default=True) # Admin Moderation
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="reviews")
    product = relationship("Product", back_populates="reviews")

class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    discount_percent = Column(Float, nullable=False)
    max_discount = Column(Float, default=500.0)
    min_order_value = Column(Float, default=999.0)
    usage_limit = Column(Integer, default=100)
    used_count = Column(Integer, default=0)
    valid_until = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, default="info") # info, stock_alert, order_update
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class Wishlist(Base):
    __tablename__ = "wishlist"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="wishlist_items")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    ip_address = Column(String, nullable=True)
    action = Column(String, nullable=False)
    entity = Column(String, nullable=False)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class StockMovementLog(Base):
    __tablename__ = "stock_movement_logs"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    movement_type = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    balance_after = Column(Integer, nullable=False)
    reference_id = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    user_id = Column(Integer, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
