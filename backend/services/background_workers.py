import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("StockFlowWorker")

def send_order_confirmation_email(user_email: str, order_id: int, tracking_num: str):
    """
    Simulates asynchronous background email notification dispatch.
    """
    time.sleep(0.1)
    logger.info(f" [BACKGROUND WORKER] Dispatched confirmation email to {user_email} for Order #{order_id} (Tracking: {tracking_num})")

def generate_pdf_invoice(order_id: int, net_amount: float):
    """
    Simulates PDF invoice compilation and storage upload.
    """
    time.sleep(0.1)
    logger.info(f"📄 [BACKGROUND WORKER] Compiled PDF Invoice for Order #{order_id} (Total: ₹{net_amount}). Saved to /uploads/invoices/INV-{order_id}.pdf")

def dispatch_low_stock_webhook(product_name: str, stock_left: int):
    """
    Simulates webhook trigger to warehouse Slack / WhatsApp notification integration.
    """
    logger.info(f"⚠️ [BACKGROUND WORKER] Webhook Alert triggered! Product '{product_name}' dropped to {stock_left} units left.")
