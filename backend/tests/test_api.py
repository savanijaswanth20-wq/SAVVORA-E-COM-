import os
import sys
import pytest
from fastapi.testclient import TestClient

# Add backend directory to python path for test imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Online"
    assert "SAVVORA" in data["platform"]

def test_auth_register_and_login():
    email = f"test_user_{os.urandom(4).hex()}@savvora.com"
    payload = {
        "name": "Integration Test User",
        "email": email,
        "password": "TestPassword123!",
        "role": "customer"
    }
    reg_resp = client.post("/api/v1/auth/register", json=payload)
    assert reg_resp.status_code == 201
    data = reg_resp.json()
    assert "access_token" in data
    assert "refresh_token" in data

    # Test Login
    login_resp = client.post("/api/v1/auth/login", json={"email": email, "password": "TestPassword123!"})
    assert login_resp.status_code == 200
    login_data = login_resp.json()
    assert "access_token" in login_data

def test_product_catalog_endpoints():
    resp = client.get("/api/v1/products")
    assert resp.status_code == 200
    data = resp.json()
    assert "items" in data
    assert "total" in data

def test_location_endpoints():
    resp = client.get("/api/v1/location/reverse-geocode?lat=17.4399&lng=78.4482")
    assert resp.status_code == 200
    data = resp.json()
    assert "address" in data

def test_location_delivery_radius():
    resp = client.get("/api/v1/location/delivery-check?lat=17.4399&lng=78.4482")
    assert resp.status_code == 200
    data = resp.json()
    assert data["deliverable"] is True
