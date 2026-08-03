from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional
import math
import os

router = APIRouter(prefix="/location", tags=["Location & Delivery Validation"])

# Default Store Hub Coordinates (Tirupati Central Hub)
STORE_HUB_LAT = float(os.getenv("STORE_HUB_LAT", "13.6288"))
STORE_HUB_LNG = float(os.getenv("STORE_HUB_LNG", "79.4192"))
MAX_DELIVERY_RADIUS_KM = float(os.getenv("MAX_DELIVERY_RADIUS_KM", "25.0"))

class LocationValidationRequest(BaseModel):
    latitude: float = Field(..., description="Latitude coordinate")
    longitude: float = Field(..., description="Longitude coordinate")
    postal_code: Optional[str] = Field(None, description="PIN / Postal Code")

class LocationValidationResponse(BaseModel):
    is_available: bool
    distance_km: float
    estimated_delivery: Optional[str] = None
    message: str
    store_hub: dict

def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great-circle distance between two points on the Earth in kilometers."""
    R = 6371.0  # Earth's radius in kilometers

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return round(R * c, 2)

@router.post("/validate-delivery", response_model=LocationValidationResponse)
async def validate_delivery_radius(payload: LocationValidationRequest):
    """
    Validate if a given customer location falls within the store's maximum delivery radius (25 km).
    """
    try:
        distance = calculate_haversine_distance(
            STORE_HUB_LAT, STORE_HUB_LNG,
            payload.latitude, payload.longitude
        )

        is_within_radius = distance <= MAX_DELIVERY_RADIUS_KM

        if is_within_radius:
            if distance <= 5.0:
                eta = "Express Delivery (Within 2 Hours)"
            elif distance <= 15.0:
                eta = "Same Day Delivery"
            else:
                eta = "Standard Delivery (Tomorrow)"

            return LocationValidationResponse(
                is_available=True,
                distance_km=distance,
                estimated_delivery=eta,
                message="Delivery is available at your location!",
                store_hub={"lat": STORE_HUB_LAT, "lng": STORE_HUB_LNG, "radius_km": MAX_DELIVERY_RADIUS_KM}
            )
        else:
            return LocationValidationResponse(
                is_available=False,
                distance_km=distance,
                estimated_delivery=None,
                message="Sorry, delivery is currently unavailable at this location.",
                store_hub={"lat": STORE_HUB_LAT, "lng": STORE_HUB_LNG, "radius_km": MAX_DELIVERY_RADIUS_KM}
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Location validation failed: {str(e)}")
