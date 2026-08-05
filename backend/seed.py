import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.db import engine, Base, SessionLocal
from app.models.models import (
    User, Category, Brand, Product, Inventory, Supplier, Coupon, 
    Order, OrderItem, Payment, UserRole, OrderStatus
)
from app.core.security import hash_password

def seed_data():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    # 1. Users
    admin_user = User(
        name="Admin Manager",
        email="admin@stockflow.com",
        hashed_password=hash_password("admin123"),
        role=UserRole.SUPER_ADMIN.value,
        is_verified=True,
        referral_code="SAV-ADMIN-0001",
        avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
    )
    customer_user = User(
        name="Jaswanth Savani",
        email="customer@stockflow.com",
        phone="9876543210",
        hashed_password=hash_password("user123"),
        role=UserRole.CUSTOMER.value,
        is_verified=True,
        referral_code="SAV-JASW-2026",
        avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    )
    db.add_all([admin_user, customer_user])
    db.commit()
    db.refresh(admin_user)
    db.refresh(customer_user)

    # 2. Brands
    b_apple = Brand(name="Apple", slug="apple", logo_url="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200")
    b_sony = Brand(name="Sony", slug="sony", logo_url="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200")
    b_keychron = Brand(name="Keychron", slug="keychron", logo_url="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200")
    db.add_all([b_apple, b_sony, b_keychron])
    db.commit()

    # 3. Categories
    cat_electronics = Category(name="Electronics", slug="electronics", icon="Smartphone", image_url="https://images.unsplash.com/photo-1498049860654-af1a5c566876?w=600")
    cat_fashion = Category(name="Fashion", slug="fashion", icon="Shirt", image_url="https://images.unsplash.com/photo-1445205170230-053b83016050?w=600")
    cat_computers = Category(name="Computers", slug="computers", icon="Laptop", image_url="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600")
    cat_watches = Category(name="Watches", slug="watches", icon="Watch", image_url="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600")
    cat_audio = Category(name="Audio", slug="audio", icon="Headphones", image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600")

    db.add_all([cat_electronics, cat_fashion, cat_computers, cat_watches, cat_audio])
    db.commit()

    # 4. Products & Stock Counts
    products_data = [
        {
            "name": "MacBook Air M2",
            "desc": "Apple M2 chip with 8-core CPU and 10-core GPU, 8GB Unified Memory, 256GB SSD Storage.",
            "price": 99900.0,
            "orig_price": 114900.0,
            "sku": "MAC-AIR-M2-256",
            "cat_id": cat_computers.id,
            "brand_id": b_apple.id,
            "img": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
            "stock": 3,
            "featured": True,
            "trending": True,
            "best_seller": True
        },
        {
            "name": "Sony WH-1000XM5",
            "desc": "Industry-leading noise canceling wireless headphones with Auto NC Optimizer.",
            "price": 29990.0,
            "orig_price": 34990.0,
            "sku": "SONY-XM5-BLK",
            "cat_id": cat_audio.id,
            "brand_id": b_sony.id,
            "img": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
            "stock": 2,
            "featured": True,
            "trending": True,
            "best_seller": True
        },
        {
            "name": "iPhone 15 Pro MagSafe Case",
            "desc": "Minimalist silicone case designed with built-in magnets for effortless MagSafe charging.",
            "price": 4900.0,
            "orig_price": 5900.0,
            "sku": "IPHONE-CASE-15P",
            "cat_id": cat_electronics.id,
            "brand_id": b_apple.id,
            "img": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800",
            "stock": 5,
            "featured": True,
            "trending": False,
            "best_seller": False
        },
        {
            "name": "Apple Watch Ultra 2",
            "desc": "The ultimate sports and adventure watch with precision dual-frequency GPS.",
            "price": 89900.0,
            "orig_price": 99900.0,
            "sku": "AW-ULTRA-2",
            "cat_id": cat_watches.id,
            "brand_id": b_apple.id,
            "img": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
            "stock": 18,
            "featured": True,
            "trending": True,
            "best_seller": True
        },
        {
            "name": "Keychron Q1 Pro Mechanical Keyboard",
            "desc": "Custom Bluetooth mechanical keyboard with CNC aluminum body and hot-swappable switches.",
            "price": 18990.0,
            "orig_price": 21990.0,
            "sku": "KEYCHRON-Q1-PRO",
            "cat_id": cat_computers.id,
            "brand_id": b_keychron.id,
            "img": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
            "stock": 14,
            "featured": True,
            "trending": False,
            "best_seller": False
        }
    ]

    for p_data in products_data:
        p = Product(
            name=p_data["name"],
            slug=p_data["sku"].lower(),
            description=p_data["desc"],
            price=p_data["price"],
            original_price=p_data["orig_price"],
            sku=p_data["sku"],
            category_id=p_data["cat_id"],
            brand_id=p_data["brand_id"],
            image_url=p_data["img"],
            is_approved=True,
            rating=4.9,
            reviews_count=28,
            is_featured=p_data["featured"],
            is_trending=p_data["trending"],
            is_best_seller=p_data["best_seller"],
            is_deleted=False
        )
        db.add(p)
        db.commit()
        db.refresh(p)

        inv = Inventory(
            product_id=p.id,
            stock_count=p_data["stock"],
            low_stock_threshold=5,
            warehouse_location="Warehouse A-1",
            reorder_level=10,
            reorder_quantity=40
        )
        db.add(inv)

    # 5. Suppliers
    s1 = Supplier(name="Apple India Authorized Dist.", contact_person="Rajesh Kumar", email="rajesh@apple-dist.in", phone="+91 9876543210", address="Tech Park, Bengaluru")
    s2 = Supplier(name="Sony Electronics Asia", contact_person="Priya Sharma", email="priya@sony-dist.com", phone="+91 9812345678", address="Electronic City, Hyderabad")
    db.add_all([s1, s2])

    # 6. Coupons
    c1 = Coupon(code="SAVVORA20", discount_percent=20.0, max_discount=2000.0, min_order_value=4999.0, is_active=True)
    c2 = Coupon(code="WELCOME10", discount_percent=10.0, max_discount=1000.0, min_order_value=999.0, is_active=True)
    db.add_all([c1, c2])

    # 7. Sample Orders
    o1 = Order(
        order_number="ORD-20260805-1001",
        user_id=customer_user.id,
        total_amount=89900.0,
        discount_amount=4500.0,
        net_amount=85400.0,
        status=OrderStatus.DELIVERED.value,
        payment_method="Razorpay",
        payment_status="Paid",
        tracking_number="STK-85400DEMO",
        shipping_address="Jaswanth Savani, Plot 42, Silicon Valley Colony, Gachibowli, Hyderabad - 500032, Ph: 9876543210"
    )
    db.add(o1)
    db.commit()
    db.refresh(o1)

    oi1 = OrderItem(order_id=o1.id, product_id=1, product_name="Apple Watch Ultra 2", sku="AW-ULTRA-2", quantity=1, unit_price=89900.0, subtotal=89900.0)
    pay1 = Payment(order_id=o1.id, payment_gateway="Razorpay", transaction_id="PAY-RZP-992810", amount=85400.0, status="SUCCESS")
    db.add_all([oi1, pay1])

    db.commit()
    db.close()
    print("SAVVORA Production Database successfully seeded!")

if __name__ == "__main__":
    seed_data()
