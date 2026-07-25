import random

class AIService:
    @staticmethod
    def generate_chat_reply(prompt: str) -> dict:
        p = prompt.lower()
        if "restock" in p or "inventory" in p:
            return {
                "reply": "Based on sales velocity analysis, MacBook Air (3 left) and Sony Headphones (2 left) require urgent restock orders within 48 hours to avoid stockout.",
                "action_suggested": "restock_alert"
            }
        elif "revenue" in p or "sales" in p:
            return {
                "reply": "Projected revenue for next week is estimated at ₹1,12,000, representing a 14% growth driven by Electronics and Audio categories.",
                "action_suggested": "view_analytics"
            }
        elif "recommend" in p or "product" in p or "search" in p:
            return {
                "reply": "I recommend featuring the Wireless Noise Canceling Headphones and Smart Apple Watch Ultra. Customers buying laptops show a 78% cross-sell affinity with high-tier audio gear.",
                "action_suggested": "recommendation"
            }
        else:
            return {
                "reply": f"StockFlow AI Assistant: I'm monitoring your store metrics. '{prompt}' has been logged. Let me know if you want predictions on sales, restock triggers, or customer behavior analytics!",
                "action_suggested": "general"
            }

    @staticmethod
    def get_sales_predictions():
        days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        base_revenue = 65000
        predictions = []
        for d in days:
            variance = random.randint(-5000, 15000)
            predictions.append({
                "day": d,
                "predicted_sales": base_revenue + variance,
                "confidence": round(random.uniform(92.0, 98.5), 1)
            })
        return predictions

    @staticmethod
    def get_restock_predictions(inventory_list):
        alerts = []
        for inv in inventory_list:
            if inv.stock_count <= inv.low_stock_threshold:
                urgency = "CRITICAL" if inv.stock_count <= 2 else "HIGH"
                alerts.append({
                    "product_id": inv.product_id,
                    "product_name": inv.product.name if inv.product else f"Product #{inv.product_id}",
                    "current_stock": inv.stock_count,
                    "days_until_stockout": max(1, inv.stock_count * 2),
                    "suggested_reorder_qty": inv.reorder_quantity or 50,
                    "urgency": urgency
                })
        return alerts

    @staticmethod
    def analyze_customer_behavior():
        return {
            "top_purchasing_segment": "Tech Enthusiasts (25-34 yrs)",
            "average_order_value": "₹12,450",
            "cart_abandonment_rate": "18.4%",
            "repeat_purchase_rate": "42.8%",
            "insights": [
                "Customers buying Electronics are 3.5x more likely to purchase Extended Warranty.",
                "Peak ordering hours are between 7:00 PM and 10:00 PM.",
                "Offering free shipping above ₹1,999 increased average cart size by 24%."
            ]
        }
