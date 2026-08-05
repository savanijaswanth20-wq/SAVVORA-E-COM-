import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional, Dict, Any
from app.config.config import settings

logger = logging.getLogger("savvora.email")

class EmailService:
    def __init__(self):
        self.resend_api_key = settings.RESEND_API_KEY
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_user = settings.SMTP_USER
        self.smtp_password = settings.SMTP_PASSWORD
        self.from_email = settings.EMAILS_FROM_EMAIL
        self.from_name = settings.EMAILS_FROM_NAME

    def _get_html_wrapper(self, title: str, content: str) -> str:
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0; }}
                .container {{ max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }}
                .header {{ background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; padding: 30px 20px; text-align: center; }}
                .header h1 {{ margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 1px; }}
                .content {{ padding: 30px 25px; color: #334155; line-height: 1.6; font-size: 15px; }}
                .footer {{ background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }}
                .btn {{ display: inline-block; background: #4f46e5; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 15px; }}
                .badge {{ background: #e0e7ff; color: #3730a3; padding: 6px 14px; border-radius: 20px; font-weight: 600; font-size: 14px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>SAVVORA</h1>
                    <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">Enterprise E-Commerce</p>
                </div>
                <div class="content">
                    <h2 style="color: #1e293b; margin-top: 0;">{title}</h2>
                    {content}
                </div>
                <div class="footer">
                    &copy; 2026 SAVVORA E-Commerce Platform. All rights reserved.<br>
                    Need help? Contact support@savvora.com
                </div>
            </div>
        </body>
        </html>
        """

    def send_email(self, to_email: str, subject: str, html_content: str) -> bool:
        """Sends email via Resend API if available, or falls back to SMTP."""
        if self.resend_api_key:
            try:
                import resend
                resend.api_key = self.resend_api_key
                params = {
                    "from": f"{self.from_name} <{self.from_email}>",
                    "to": [to_email],
                    "subject": subject,
                    "html": html_content,
                }
                resend.Emails.send(params)
                logger.info(f"Email sent via Resend to {to_email}")
                return True
            except Exception as e:
                logger.warning(f"Resend email dispatch failed: {e}. Falling back to SMTP.")

        if self.smtp_user and self.smtp_password:
            try:
                msg = MIMEMultipart("alternative")
                msg["Subject"] = subject
                msg["From"] = f"{self.from_name} <{self.from_email}>"
                msg["To"] = to_email
                msg.attach(MIMEText(html_content, "html"))

                with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                    server.starttls()
                    server.login(self.smtp_user, self.smtp_password)
                    server.sendmail(self.from_email, to_email, msg.as_string())
                logger.info(f"Email sent via SMTP to {to_email}")
                return True
            except Exception as e:
                logger.error(f"SMTP email dispatch failed: {e}")
                return False

        logger.info(f"[SIMULATED EMAIL] To: {to_email} | Subject: {subject}")
        return True

    def send_welcome(self, to_email: str, user_name: str) -> bool:
        content = f"""
        <p>Hi <strong>{user_name}</strong>,</p>
        <p>Welcome to SAVVORA! We're thrilled to have you join our premier shopping destination.</p>
        <p>Explore thousands of curated products with instant delivery and seamless checkout.</p>
        <a href="https://savvora.com" class="btn">Start Shopping Now</a>
        """
        html = self._get_html_wrapper("Welcome to SAVVORA!", content)
        return self.send_email(to_email, "Welcome to SAVVORA!", html)

    def send_otp(self, to_email: str, otp_code: str) -> bool:
        content = f"""
        <p>Your Security OTP Code for account verification is:</p>
        <p style="text-align: center; margin: 25px 0;">
            <span class="badge" style="font-size: 28px; letter-spacing: 4px;">{otp_code}</span>
        </p>
        <p>This code expires in 10 minutes. Please do not share this code with anyone.</p>
        """
        html = self._get_html_wrapper("Your Verification Code", content)
        return self.send_email(to_email, f"SAVVORA Code: {otp_code}", html)

    def send_order_confirmation(self, to_email: str, order_number: str, amount: float, items_summary: str) -> bool:
        content = f"""
        <p>Thank you for your order! We have received your purchase and are preparing it for shipment.</p>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin: 5px 0;"><strong>Order Number:</strong> {order_number}</p>
            <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹{amount:,.2f}</p>
            <p style="margin: 5px 0;"><strong>Items:</strong> {items_summary}</p>
        </div>
        <a href="https://savvora.com/orders/{order_number}" class="btn">Track Order Status</a>
        """
        html = self._get_html_wrapper(f"Order Confirmed #{order_number}", content)
        return self.send_email(to_email, f"SAVVORA Order Confirmed #{order_number}", html)

    def send_shipping_notification(self, to_email: str, order_number: str, tracking_number: str) -> bool:
        content = f"""
        <p>Great news! Your order <strong>#{order_number}</strong> has been shipped and is on its way.</p>
        <div style="background: #e0e7ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin: 5px 0; color: #3730a3;"><strong>Tracking Number:</strong> {tracking_number}</p>
        </div>
        <p>You can monitor the live delivery location directly from your account dashboard.</p>
        """
        html = self._get_html_wrapper(f"Order Shipped #{order_number}", content)
        return self.send_email(to_email, f"SAVVORA Order Shipped #{order_number}", html)

    def send_delivery_notification(self, to_email: str, order_number: str) -> bool:
        content = f"""
        <p>Your order <strong>#{order_number}</strong> has been successfully delivered!</p>
        <p>We hope you love your products. Please leave a review to share your feedback.</p>
        """
        html = self._get_html_wrapper(f"Order Delivered #{order_number}", content)
        return self.send_email(to_email, f"SAVVORA Order Delivered #{order_number}", html)

    def send_cancellation(self, to_email: str, order_number: str, reason: str) -> bool:
        content = f"""
        <p>Your order <strong>#{order_number}</strong> has been cancelled.</p>
        <p><strong>Reason:</strong> {reason}</p>
        <p>If you were charged, a full refund has been initiated to your original payment method.</p>
        """
        html = self._get_html_wrapper(f"Order Cancelled #{order_number}", content)
        return self.send_email(to_email, f"SAVVORA Order Cancelled #{order_number}", html)

    def send_refund_notification(self, to_email: str, order_number: str, amount: float, refund_id: str) -> bool:
        content = f"""
        <p>A refund of <strong>₹{amount:,.2f}</strong> has been processed for order <strong>#{order_number}</strong>.</p>
        <p><strong>Refund Reference ID:</strong> {refund_id}</p>
        <p>Funds will reflect in your account within 3 to 5 business days depending on your bank.</p>
        """
        html = self._get_html_wrapper("Refund Processed", content)
        return self.send_email(to_email, f"SAVVORA Refund Processed #{order_number}", html)

    def send_password_reset(self, to_email: str, reset_token: str) -> bool:
        content = f"""
        <p>You requested a password reset for your SAVVORA account.</p>
        <p style="text-align: center; margin: 25px 0;">
            <span class="badge" style="font-size: 24px; letter-spacing: 3px;">{reset_token}</span>
        </p>
        <p>Use this code in the app to set a new password. If you didn't request this, ignore this email.</p>
        """
        html = self._get_html_wrapper("Password Reset Code", content)
        return self.send_email(to_email, "SAVVORA Password Reset Code", html)

email_service = EmailService()
