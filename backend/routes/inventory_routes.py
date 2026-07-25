from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from database.db import get_db
from models.models import Inventory, StockMovementLog, PurchaseOrder, Supplier, User, MovementType
from schemas.schemas import InventoryResponse, StockUpdate
from auth.auth import get_admin_user
from services.inventory_engine import InventoryEngine

router = APIRouter(prefix="/api/inventory", tags=["Inventory"])

@router.get("", response_model=List[InventoryResponse])
def get_all_inventory(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    return db.query(Inventory).all()

@router.get("/low-stock", response_model=List[InventoryResponse])
def get_low_stock(db: Session = Depends(get_db)):
    return db.query(Inventory).filter(Inventory.stock_count <= Inventory.low_stock_threshold).all()

@router.get("/movements")
def get_stock_movements(
    product_id: Optional[int] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    query = db.query(StockMovementLog)
    if product_id:
        query = query.filter(StockMovementLog.product_id == product_id)
    return query.order_by(StockMovementLog.timestamp.desc()).limit(100).all()

@router.get("/eoq/{product_id}")
def get_economic_order_quantity(
    product_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    inv = db.query(Inventory).filter(Inventory.product_id == product_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Inventory record not found")
    return InventoryEngine.calculate_eoq(inv)

@router.get("/purchase-orders")
def get_purchase_orders(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    return db.query(PurchaseOrder).order_by(PurchaseOrder.created_at.desc()).all()

@router.put("/{product_id}", response_model=InventoryResponse)
def update_stock(
    product_id: int,
    stock_data: StockUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    inv = db.query(Inventory).filter(Inventory.product_id == product_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Inventory record not found for product")
    
    old_count = inv.stock_count
    inv.stock_count = stock_data.stock_count
    if stock_data.warehouse_location:
        inv.warehouse_location = stock_data.warehouse_location
    
    db.commit()
    db.refresh(inv)

    # Record movement ledger
    m_type = MovementType.STOCK_IN.value if stock_data.stock_count > old_count else MovementType.STOCK_OUT.value
    InventoryEngine.record_movement(
        db=db,
        product_id=product_id,
        movement_type=m_type,
        quantity=abs(stock_data.stock_count - old_count),
        balance_after=stock_data.stock_count,
        notes="Manual stock update by Admin",
        user_id=admin.id
    )

    return inv
