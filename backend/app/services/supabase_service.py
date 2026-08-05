import logging
from typing import Optional, Dict, Any
from app.config.config import settings

logger = logging.getLogger("savvora.supabase")

class SupabaseService:
    """Supabase Auth & Storage Service Wrapper."""
    def __init__(self):
        self.client = None
        self._init_supabase()

    def _init_supabase(self):
        if settings.SUPABASE_URL and (settings.SUPABASE_SECRET_KEY or settings.SUPABASE_PUBLISHABLE_KEY):
            try:
                from supabase import create_client, Client
                key = settings.SUPABASE_SECRET_KEY or settings.SUPABASE_PUBLISHABLE_KEY
                self.client: Client = create_client(settings.SUPABASE_URL, key)
                logger.info("Connected to Supabase client.")
            except Exception as e:
                logger.warning(f"Supabase client initialization failed: {e}")
                self.client = None
        else:
            logger.info("Supabase URL/Key not configured. Supabase service in standalone mode.")

    def verify_supabase_token(self, jwt_token: str) -> Optional[Dict[str, Any]]:
        """Verifies JWT issued by Supabase Auth."""
        if not self.client:
            return None
        try:
            res = self.client.auth.get_user(jwt_token)
            if res and res.user:
                return {
                    "id": res.user.id,
                    "email": res.user.email,
                    "phone": res.user.phone,
                    "user_metadata": res.user.user_metadata
                }
        except Exception as e:
            logger.error(f"Supabase token verification failed: {e}")
        return None

    def upload_storage_file(self, bucket_name: str, file_path: str, file_bytes: bytes, content_type: str = "image/jpeg") -> Optional[str]:
        """Uploads a file to Supabase Storage bucket and returns public URL."""
        if not self.client:
            return None
        try:
            res = self.client.storage.from_(bucket_name).upload(
                file_path,
                file_bytes,
                file_options={"content-type": content_type, "upsert": "true"}
            )
            public_url = self.client.storage.from_(bucket_name).get_public_url(file_path)
            return public_url
        except Exception as e:
            logger.error(f"Supabase Storage upload failed: {e}")
            return None

supabase_service = SupabaseService()
