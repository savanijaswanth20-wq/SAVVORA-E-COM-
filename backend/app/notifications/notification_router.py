from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database.db import get_db
from app.database.models import Notification

router = APIRouter(prefix="/api/notifications", tags=["10. Notifications"])

class SendNotificationPayload(BaseModel):
    user_id: int
    title: str
    message: str
    channel: str = "in_app" # in_app, email, whatsapp

@router.get("/{user_id}")
def get_user_notifications(user_id: int, db: Session = Depends(get_db)):
    return db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.created_at.desc()).all()

@router.post("")
def send_notification(payload: SendNotificationPayload, db: Session = Depends(get_db)):
    notif = Notification(
        user_id=payload.user_id,
        title=payload.title,
        message=payload.message,
        type=payload.channel
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return {"status": "sent", "channel": payload.channel, "notification": notif}
