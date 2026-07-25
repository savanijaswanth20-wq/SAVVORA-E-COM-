from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from app.database.db import get_db
from app.database.models import Inventory, StockMovementLog, Product

router = APIRouter(prefix="/api/inventory", tags=["3. Inventory Management"])

class StockUpdatePayload(BaseModel):
    stock_count: int
    warehouse_location: Optional[str] = "Warehouse A-1"
    notes: Optional[str] = "Manual update"

@router.get("")
def get_all_inventory(db: Session = Depends(get_db)):
    return db.query(Inventory).all()

@router.get("/low-stock")
def get_low_stock(db: Session = Depends(get_db)):
    return db.query(Inventory).filter(Inventory.stock_count <= Inventory.low_stock_threshold).all()

@router.get("/history")
def get_stock_history(product_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(StockMovementLog)
    if product_id:
        query = query.filter(StockMovementLog.product_id == product_id)
    return query.order_by(StockMovementLog.timestamp.desc()).all()

@router.put("/{product_id}")
def update_stock(product_id: int, payload: StockUpdatePayload, db: Session = Depends(get_db)):
    inv = db.query(Inventory).filter(Inventory.product_id == product_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Inventory record not found")
    
    old_stock = inv.stock_count
    inv.stock_count = payload.stock_count
    if payload.warehouse_location:
        inv.warehouse_location = payload.warehouse_location

    # Log movement
    m_type = "STOCK_IN" if payload.stock_count > old_stock else "STOCK_OUT"
    log = StockMovementLog(
        product_id=product_id,
        movement_type=m_type,
        quantity=abs(payload.stock_count - old_stock),
        balance_after=payload.stock_count,
        notes=payload.notes
    )
    db.add(log)
    db.commit()
    db.refresh(inv)
    return inv

@router.get("/reports/export")
def export_inventory_report(db: Session = Depends(get_db)):
    items = db.query(Inventory).all()
    report_data = []
    for item in items:
        report_data.append({
            "product_id": item.product_id,
            "product_name": item.product.name if item.product else "N/A",
            "stock_count": item.stock_count,
            "warehouse_location": item.warehouse_location,
            "status": "CRITICAL" if item.stock_count <= item.low_stock_threshold else "HEALTHY"
        })
    return {"generated_at": "2026-07-24", "total_records": len(report_data), "inventory": report_data}
