from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.db import get_db
from models.models import Inventory
from schemas.schemas import AIChatRequest, AIChatResponse
from services.ai_service import AIService

router = APIRouter(prefix="/api/ai", tags=["AI Features"])

@router.post("/chat", response_model=AIChatResponse)
def ai_chat(payload: AIChatRequest):
    result = AIService.generate_chat_reply(payload.prompt)
    return AIChatResponse(
        reply=result["reply"],
        action_suggested=result.get("action_suggested")
    )

@router.get("/sales-prediction")
def get_sales_prediction():
    return AIService.get_sales_predictions()

@router.get("/restock-prediction")
def get_restock_prediction(db: Session = Depends(get_db)):
    inv_list = db.query(Inventory).all()
    return AIService.get_restock_predictions(inv_list)

@router.get("/customer-behavior")
def get_customer_behavior():
    return AIService.analyze_customer_behavior()
