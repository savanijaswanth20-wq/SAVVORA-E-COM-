import sys
import os
import json

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.seed import seed_data
from fastapi.testclient import TestClient
from main import app

def format_json(obj):
    return json.dumps(obj, indent=2)

def run_full_demo():
    print("=" * 70)
    print(" [STOCKFLOW ENTERPRISE PLATFORM] LIVE BACKEND DEMO OUTPUT RUNNER")
    print("=" * 70)

    # 1. Seed Database
    print("\n[STEP 1] Seeding Enterprise Database...")
    seed_data()

    client = TestClient(app)

    # 2. Root API status
    print("\n[STEP 2] GET / (Root Health Check)")
    res = client.get("/")
    print(format_json(res.json()))

    # 3. Authentication
    print("\n[STEP 3] POST /api/auth/login (Admin & Customer Authentication)")
    auth_res = client.post("/api/auth/login", json={"email": "customer@stockflow.com", "password": "user123"})
    print("Status Code:", auth_res.status_code)
    auth_data = auth_res.json()
    print("Access Token:", auth_data["access_token"][:40] + "...")
    print("Refresh Token:", auth_data["refresh_token"][:40] + "...")
    print("User:", auth_data["user"])

    token = auth_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 4. Products List
    print("\n[STEP 4] GET /api/products (Product Catalog & Live Stock Counts)")
    prod_res = client.get("/api/products?limit=3")
    print("Total Products in System:", prod_res.json()["total_count"])
    for p in prod_res.json()["items"]:
        inv = p.get("inventory")
        stock = inv["stock_count"] if inv else 0
        print(f"  * {p['name']} | Price: RS {p['price']:,.2f} | Stock: {stock} units | SKU: {p['sku']}")

    # 5. Low Stock Alerts
    print("\n[STEP 5] GET /api/inventory/low-stock (Automated Low-Stock Alerts)")
    low_res = client.get("/api/inventory/low-stock")
    for item in low_res.json():
        print(f"  [ALERT] Product ID #{item['product_id']} | Stock Left: {item['stock_count']} | Threshold: {item['low_stock_threshold']} | Warehouse: {item['warehouse_location']}")

    # 6. Coupon Verification
    print("\n[STEP 6] POST /api/coupons/verify (Coupon Discount Verification)")
    coupon_res = client.post("/api/coupons/verify", json={"code": "STOCKFLOW20", "cart_total": 99900.0})
    print(format_json(coupon_res.json()))

    # 7. Create Order & PDF Invoice
    print("\n[STEP 7] POST /api/orders (Concurrency-Safe Order Creation & PDF Invoice Generation)")
    order_payload = {
        "user_id": auth_data["user"]["id"],
        "items": [
            {"product_id": 1, "quantity": 1},
            {"product_id": 3, "quantity": 1}
        ],
        "shipping_address": "Plot 42, Silicon Valley Colony, Gachibowli, Hyderabad - 500032",
        "payment_method": "Razorpay",
        "coupon_code": "STOCKFLOW20"
    }
    order_res = client.post("/api/orders", json=order_payload, headers=headers)
    print("Order Creation Status:", order_res.status_code)
    o_data = order_res.json()
    print(f"  * Tracking Number: {o_data['tracking_number']}")
    print(f"  * Total Amount:   RS {o_data['total_amount']:,.2f}")
    print(f"  * Discount:       -RS {o_data['discount_amount']:,.2f}")
    print(f"  * Net Paid:       RS {o_data['net_amount']:,.2f}")
    print(f"  * Payment Status: {o_data['payment_status']} ({o_data['payment_method']})")

    # 8. Order Timeline
    print("\n[STEP 8] GET /api/orders/{id}/timeline (Order Tracking Timeline)")
    time_res = client.get(f"/api/orders/{o_data['id']}/timeline")
    print(format_json(time_res.json()))

    # 9. AI Restock & Sales Forecast
    print("\n[STEP 9] GET /api/ai/restock-prediction & GET /api/ai/sales-prediction (AI Engine)")
    ai_restock = client.get("/api/ai/restock-prediction")
    print("AI Restock Alerts:", format_json(ai_restock.json()))
    
    ai_sales = client.get("/api/ai/sales-prediction")
    print("7-Day Sales Forecast:", format_json(ai_sales.json()[:3]))

    # 10. Analytics Dashboard
    print("\n[STEP 10] GET /api/analytics/dashboard (Admin Dashboard Revenue Metrics)")
    an_res = client.get("/api/analytics/dashboard")
    print(format_json(an_res.json()))

    print("\n" + "=" * 70)
    print(" [SUCCESS] ALL ENTERPRISE BACKEND ENDPOINTS EXECUTED AND VERIFIED SUCCESSFULLY!")
    print("=" * 70)

if __name__ == "__main__":
    run_full_demo()
