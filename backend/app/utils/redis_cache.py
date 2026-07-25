import time

class MemoryRedisCache:
    """
    In-memory Key-Value Caching Store with TTL fallback when Redis is offline.
    """
    def __init__(self):
        self._store = {}

    def set(self, key: str, value: str, ttl: int = 300):
        expires_at = time.time() + ttl
        self._store[key] = (value, expires_at)

    def get(self, key: str):
        if key in self._store:
            val, expires_at = self._store[key]
            if time.time() < expires_at:
                return val
            else:
                del self._store[key]
        return None

    def delete(self, key: str):
        self._store.pop(key, None)

cache = MemoryRedisCache()
