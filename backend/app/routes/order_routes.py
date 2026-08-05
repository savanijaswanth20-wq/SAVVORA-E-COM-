from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.models import User, Order, DeliveryTracking
from app.schemas.schemas import CheckoutPayload, OrderOut, CancelOrderPayload, ReturnOrderPayload
from app.services.order_service import order_service
from app.dependencies.auth_deps import get_current_user, require_staff

router = APIRouter(prefix="/orders", tags=["5. Order System & Tracking"])

@router.post("/checkout")
def checkout_order(
    payload: CheckoutPayload,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Creates a new order from user's shopping cart with stock reservation and Razorpay payload."""
    return order_service.create_order_from_cart(
        db,
        user=current_user,
        address_id=payload.address_id,
        payment_method=payload.payment_method or "Razorpay",
        coupon_code=payload.coupon_code,
        idempotency_key=payload.idempotency_key
    )

@router.get("", response_model=List[OrderOut])
def get_user_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Lists order history for logged-in customer."""
    orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()
    return [order_service._format_order_response(db, o) for o in orders]

@router.get("/{order_id}")
def get_order_details(order_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fetches full details of a specific order."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    if order.user_id != current_user.id and current_user.role not in ["admin", "staff"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    res = order_service._format_order_response(db, order)
    tracking = db.query(DeliveryTracking).filter(DeliveryTracking.order_id == order.id).order_by(DeliveryTracking.timestamp.asc()).all()
    res["delivery_tracking"] = [
        {
            "status": t.status,
            "description": t.status_description,
            "location": t.location,
            "timestamp": t.timestamp
        }
        for t in tracking
    ]
    return res

@router.post("/{order_id}/cancel")
def cancel_order(
    order_id: int,
    payload: CancelOrderPayload,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cancels order and restores stock inventory."""
    return order_service.cancel_order(db, current_user.id, order_id, payload.reason)

@router.get("/{order_id}/invoice")
def download_invoice(order_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Generates and downloads official PDF Tax Invoice."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    if order.user_id != current_user.id and current_user.role not in ["admin", "staff"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    inv = order_service.generate_invoice_for_order(db, order.id)
    pdf_path = inv["pdf_path"]

    return FileResponse(
        path=pdf_path,
        filename=f"SAVVORA_Invoice_{order.order_number}.pdf",
        media_type="application/pdf"
    )

@router.put("/{order_id}/status")
def update_order_status(
    order_id: int,
    status_str: str,
    tracking_number: Optional[str] = None,
    current_user: User = Depends(require_staff),
    db: Session = Depends(get_db)
):
    """Updates order status (Staff/Admin only)."""
    order = order_service.update_order_status(db, order_id, status_str, tracking_number)
    return {"status": "success", "message": f"Order #{order_id} status updated to {status_str}"}
