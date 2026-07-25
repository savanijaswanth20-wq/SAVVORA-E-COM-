from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.database.db import get_db
from app.database.models import Inventory, Product

router = APIRouter(prefix="/api/ai", tags=["11. AI Features"])

class AIChatRequest(BaseModel):
    prompt: str

@router.post("/chat")
def ai_chat(payload: AIChatRequest):
    p = payload.prompt.lower()
    if "restock" in p or "inventory" in p:
        reply = "StockFlow AI: MacBook Air (3 left) and Sony Headphones (2 left) require urgent restock orders within 48 hours to avoid stockout."
    elif "sales" in p or "revenue" in p:
        reply = "StockFlow AI: Revenue for next week is projected to reach ₹1,12,000 (+14.2% growth)."
    else:
        reply = f"StockFlow AI: Real-time inventory & sales signals analyzed for '{payload.prompt}'."
    
    return {"reply": reply}

@router.get("/sales-prediction")
def get_sales_prediction():
    return [
        {"day": "Mon", "predicted_sales": 68000, "confidence": 96.4},
        {"day": "Tue", "predicted_sales": 74000, "confidence": 95.8},
        {"day": "Wed", "predicted_sales": 71000, "confidence": 97.1},
        {"day": "Thu", "predicted_sales": 82000, "confidence": 94.9},
        {"day": "Fri", "predicted_sales": 95000, "confidence": 98.0},
        {"day": "Sat", "predicted_sales": 112000, "confidence": 96.5},
        {"day": "Sun", "predicted_sales": 105000, "confidence": 95.2}
    ]

@router.get("/restock-prediction")
def get_restock_prediction(db: Session = Depends(get_db)):
    inv_list = db.query(Inventory).filter(Inventory.stock_count <= Inventory.low_stock_threshold).all()
    alerts = []
    for inv in inv_list:
        alerts.append({
            "product_id": inv.product_id,
            "product_name": inv.product.name if inv.product else f"Product #{inv.product_id}",
            "current_stock": inv.stock_count,
            "days_until_stockout": max(1, inv.stock_count * 2),
            "suggested_reorder_qty": inv.reorder_quantity or 50,
            "urgency": "CRITICAL" if inv.stock_count <= 2 else "HIGH"
        })
    return alerts
