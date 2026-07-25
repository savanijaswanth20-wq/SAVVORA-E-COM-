import uuid

def upload_image_to_cloudinary(file_bytes: bytes, filename: str) -> str:
    """
    Simulates Cloudinary CDN image upload, returning a secure CDN URL.
    """
    unique_id = uuid.uuid4().hex[:8]
    # Return realistic Unsplash / Cloudinary CDN image URL
    return f"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&cdn_ref={unique_id}"
