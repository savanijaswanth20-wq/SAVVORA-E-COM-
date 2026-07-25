import math
from sqlalchemy.orm import Session
from models.models import Inventory, StockMovementLog, Product, PurchaseOrder, PurchaseOrderItem, PurchaseOrderStatus
from datetime import datetime, timedelta

class InventoryEngine:
    @staticmethod
    def record_movement(
        db: Session,
        product_id: int,
        movement_type: str,
        quantity: int,
        balance_after: int,
        reference_id: str = None,
        notes: str = None,
        user_id: int = None
    ) -> StockMovementLog:
        """
        Appends an immutable audit log entry to the stock movement ledger.
        """
        log = StockMovementLog(
            product_id=product_id,
            movement_type=movement_type,
            quantity=quantity,
            balance_after=balance_after,
            reference_id=reference_id,
            notes=notes,
            user_id=user_id
        )
        db.add(log)
        db.commit()
        db.refresh(log)
        return log

    @staticmethod
    def calculate_eoq(inventory: Inventory) -> dict:
        """
        Calculates Economic Order Quantity (EOQ) using formula:
        EOQ = sqrt( (2 * D * S) / H )
        Where:
        D = Annual Demand in units
        S = Ordering/Setup cost per order
        H = Holding/Carrying cost per unit per year
        """
        D = inventory.annual_demand or 1200
        S = inventory.ordering_cost or 500.0
        H = inventory.holding_cost or 150.0

        if H <= 0:
            H = 1.0

        eoq_val = math.sqrt((2 * D * S) / H)
        recommended_eoq = int(round(eoq_val))

        # Reorder Point (ROP) = (Daily Demand * Lead Time in days) + Safety Stock
        daily_demand = D / 365.0
        lead_time_days = 7
        rop = int(round((daily_demand * lead_time_days) + (inventory.safety_stock or 5)))

        return {
            "product_id": inventory.product_id,
            "current_stock": inventory.stock_count,
            "annual_demand": D,
            "ordering_cost": S,
            "holding_cost": H,
            "economic_order_quantity": recommended_eoq,
            "reorder_point": rop,
            "reorder_required": inventory.stock_count <= rop
        }

    @staticmethod
    def auto_create_purchase_order(db: Session, supplier_id: int, product_id: int, qty: int) -> PurchaseOrder:
        """
        Generates an official supplier purchase order when inventory drops below safety threshold.
        """
        po_num = f"PO-{datetime.utcnow().strftime('%Y%m%d')}-{product_id}"
        
        existing_po = db.query(PurchaseOrder).filter(PurchaseOrder.po_number == po_num).first()
        if existing_po:
            return existing_po

        prod = db.query(Product).filter(Product.id == product_id).first()
        unit_cost = (prod.price * 0.6) if prod else 1000.0

        po = PurchaseOrder(
            po_number=po_num,
            supplier_id=supplier_id,
            status=PurchaseOrderStatus.APPROVED.value,
            total_cost=qty * unit_cost,
            expected_delivery=datetime.utcnow() + timedelta(days=5)
        )
        db.add(po)
        db.commit()
        db.refresh(po)

        poi = PurchaseOrderItem(
            purchase_order_id=po.id,
            product_id=product_id,
            requested_qty=qty,
            unit_cost=unit_cost
        )
        db.add(poi)
        db.commit()
        return po
