import json
import logging
from typing import Any, Optional
from app.config.config import settings

logger = logging.getLogger("savvora.cache")

class MemoryCache:
    """In-memory cache fallback when Redis is not reachable."""
    def __init__(self):
        self._store = {}

    def get(self, key: str) -> Optional[str]:
        return self._store.get(key)

    def set(self, key: str, value: str, ex: Optional[int] = None) -> bool:
        self._store[key] = value
        return True

    def delete(self, key: str) -> bool:
        if key in self._store:
            del self._store[key]
            return True
        return False

    def clear(self):
        self._store.clear()

class CacheManager:
    def __init__(self):
        self.redis_client = None
        self.memory_client = MemoryCache()
        self._init_redis()

    def _init_redis(self):
        try:
            import redis
            self.redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True, socket_timeout=2)
            self.redis_client.ping()
            logger.info("Connected to Redis Cache server.")
        except Exception as e:
            logger.warning(f"Redis Cache connection failed ({e}). Falling back to in-memory cache.")
            self.redis_client = None

    def get_json(self, key: str) -> Optional[Any]:
        try:
            val = None
            if self.redis_client:
                val = self.redis_client.get(key)
            else:
                val = self.memory_client.get(key)
            if val:
                return json.loads(val)
        except Exception as e:
            logger.error(f"Error fetching cache key '{key}': {e}")
        return None

    def set_json(self, key: str, value: Any, expire_seconds: int = 3600) -> bool:
        try:
            serialized = json.dumps(value)
            if self.redis_client:
                return bool(self.redis_client.set(key, serialized, ex=expire_seconds))
            else:
                return self.memory_client.set(key, serialized, ex=expire_seconds)
        except Exception as e:
            logger.error(f"Error setting cache key '{key}': {e}")
            return False

    def delete(self, key: str) -> bool:
        try:
            if self.redis_client:
                return bool(self.redis_client.delete(key))
            else:
                return self.memory_client.delete(key)
        except Exception as e:
            logger.error(f"Error deleting cache key '{key}': {e}")
            return False

cache_manager = CacheManager()
