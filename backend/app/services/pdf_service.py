import os
import logging
from typing import Optional, Dict, Any
from datetime import datetime

logger = logging.getLogger("savvora.pdf")

class PDFInvoiceService:
    def generate_invoice_pdf(self, order_data: Dict[str, Any], output_path: str) -> bool:
        """Generates a professional PDF invoice using ReportLab."""
        try:
            from reportlab.lib.pagesizes import letter
            from reportlab.lib import colors
            from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
            from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            doc = SimpleDocTemplate(output_path, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
            story = []
            styles = getSampleStyleSheet()

            title_style = ParagraphStyle(
                'DocTitle',
                parent=styles['Heading1'],
                fontSize=24,
                textColor=colors.HexColor("#4F46E5"),
                spaceAfter=12
            )
            
            normal_style = styles['Normal']

            story.append(Paragraph("<b>SAVVORA E-COMMERCE</b>", title_style))
            story.append(Paragraph("Official Tax Invoice", styles['Heading2']))
            story.append(Spacer(1, 12))

            order_number = order_data.get("order_number", f"ORD-{order_data.get('id', '0000')}")
            created_at = order_data.get("created_at", datetime.now().strftime("%Y-%m-%d"))

            info_data = [
                [Paragraph(f"<b>Invoice #:</b> INV-{order_number}", normal_style), Paragraph(f"<b>Date:</b> {created_at}", normal_style)],
                [Paragraph(f"<b>Customer Name:</b> {order_data.get('user_name', 'Valued Customer')}", normal_style), Paragraph(f"<b>Payment Method:</b> {order_data.get('payment_method', 'Online')}", normal_style)],
                [Paragraph(f"<b>Shipping Address:</b> {order_data.get('shipping_address', 'N/A')}", normal_style), Paragraph(f"<b>Payment Status:</b> {order_data.get('payment_status', 'Paid')}", normal_style)]
            ]
            info_table = Table(info_data, colWidths=[270, 270])
            info_table.setStyle(TableStyle([
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('BOTTOMPADDING', (0,0), (-1,-1), 6)
            ]))
            story.append(info_table)
            story.append(Spacer(1, 20))

            items_table_data = [["Item Description", "Qty", "Unit Price", "Subtotal"]]
            for item in order_data.get("items", []):
                items_table_data.append([
                    item.get("product_name", "Product Item"),
                    str(item.get("quantity", 1)),
                    f"INR {item.get('unit_price', 0):,.2f}",
                    f"INR {item.get('subtotal', 0):,.2f}"
                ])

            total_amount = order_data.get("net_amount", order_data.get("total_amount", 0))
            items_table_data.append(["", "", "Total Net Amount:", f"INR {total_amount:,.2f}"])

            items_table = Table(items_table_data, colWidths=[260, 60, 110, 110])
            items_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#4F46E5")),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
                ('LINEBELOW', (0, -1), (-1, -1), 1.5, colors.HexColor("#4F46E5")),
            ]))
            story.append(items_table)
            story.append(Spacer(1, 30))

            story.append(Paragraph("<i>Thank you for shopping with SAVVORA! For queries, email support@savvora.com.</i>", normal_style))
            doc.build(story)
            logger.info(f"PDF Invoice generated successfully at {output_path}")
            return True
        except Exception as e:
            logger.error(f"Failed to generate PDF Invoice: {e}")
            return False

pdf_invoice_service = PDFInvoiceService()
