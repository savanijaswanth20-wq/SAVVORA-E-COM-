import sys
import os
import time
from concurrent.futures import ThreadPoolExecutor

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.db import SessionLocal
from app.database.seed import seed_data
from app.database.models import Inventory, Order, StockMovementLog
from fastapi.testclient import TestClient
from main import app

def run_stress_test():
    print("[INIT] Reseeding database for Concurrency Stress Test...")
    seed_data()

    client = TestClient(app)

    # Login to get JWT token
    login_res = client.post("/api/auth/login", json={"email": "customer@stockflow.com", "password": "user123"})
    assert login_res.status_code == 200, "Login failed"
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Product ID #1 (MacBook Air M2) has exactly 3 units in stock
    db = SessionLocal()
    inv_before = db.query(Inventory).filter(Inventory.product_id == 1).first()
    print(f"[STOCK CHECK] Initial Stock for MacBook Air M2: {inv_before.stock_count} units")
    assert inv_before.stock_count == 3, f"Expected 3 units, found {inv_before.stock_count}"
    db.close()

    order_payload = {
        "user_id": 2,
        "items": [{"product_id": 1, "quantity": 1}],
        "shipping_address": "Concurrency Test Address 123",
        "payment_method": "Razorpay"
    }

    results = []

    def attempt_checkout(thread_id):
        time.sleep(0.01)
        res = client.post("/api/orders", json=order_payload, headers=headers)
        return (thread_id, res.status_code, res.json())

    print("[STRESS TEST] Launching 10 parallel checkout requests against 3 stock units...")
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(attempt_checkout, i) for i in range(10)]
        for f in futures:
            results.append(f.result())

    successes = [r for r in results if r[1] == 200]
    failures = [r for r in results if r[1] != 200]

    print(f"[RESULTS] Successful Checkouts: {len(successes)}")
    print(f"[RESULTS] Rejected Checkouts:   {len(failures)}")

    db = SessionLocal()
    inv_after = db.query(Inventory).filter(Inventory.product_id == 1).first()
    movements_count = db.query(StockMovementLog).filter(StockMovementLog.product_id == 1).count()
    print(f"[VERIFICATION] Final Remaining Stock: {inv_after.stock_count} units")
    print(f"[LEDGER] Total Stock Movement Ledger Entries: {movements_count}")
    db.close()

    assert len(successes) == 3, f"CRITICAL RACE CONDITION! Expected 3 successes, got {len(successes)}"
    assert len(failures) == 7, f"Expected 7 failures, got {len(failures)}"
    assert inv_after.stock_count == 0, f"Oversold! Final stock is {inv_after.stock_count}"

    print("\n[SUCCESS] CONCURRENCY STRESS TEST PASSED PERFECTLY! ZERO OVERSELLING DETECTED!")

if __name__ == "__main__":
    run_stress_test()
