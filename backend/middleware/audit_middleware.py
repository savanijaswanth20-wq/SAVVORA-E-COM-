from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from database.db import SessionLocal
from models.models import AuditLog

class AuditLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Only log mutating HTTP operations
        if request.method in ["POST", "PUT", "DELETE", "PATCH"]:
            db = SessionLocal()
            try:
                client_ip = request.client.host if request.client else "127.0.0.1"
                path = request.url.path
                
                log = AuditLog(
                    ip_address=client_ip,
                    action=f"HTTP_{request.method}",
                    entity=path,
                    details=f"Status: {response.status_code}"
                )
                db.add(log)
                db.commit()
            except Exception as e:
                db.rollback()
            finally:
                db.close()

        return response
