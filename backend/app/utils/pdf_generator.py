import os

def generate_pdf_invoice_file(order_id: int, tracking_num: str, user_name: str, net_amount: float) -> str:
    """
    Generates a PDF Invoice text document saved to uploads/invoices/.
    """
    os.makedirs("uploads/invoices", exist_ok=True)
    filename = f"uploads/invoices/INV-{order_id}.pdf"
    
    content = f"""==================================================
           STOCKFLOW ENTERPRISE INVOICE
==================================================
Invoice Ref: INV-{order_id}
Tracking ID: {tracking_num}
Customer Name: {user_name}
Date: 2026-07-24
--------------------------------------------------
Total Net Amount Paid: ₹{net_amount:,.2f}
Payment Gateway: Razorpay / Stripe / COD
Status: PAID & VERIFIED
==================================================
Thank you for shopping with StockFlow!
"""
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)
    
    return filename
