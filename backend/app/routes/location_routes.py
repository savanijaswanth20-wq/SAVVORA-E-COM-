from typing import Optional
from fastapi import APIRouter, Query, HTTPException, status
from app.services.location_service import location_service

router = APIRouter(prefix="/location", tags=["7. Google Maps & Geocoding"])

@router.get("/reverse-geocode")
async def reverse_geocode(
    lat: float = Query(..., description="Latitude coordinate"),
    lng: float = Query(..., description="Longitude coordinate")
):
    """Converts latitude and longitude into street address via Google Maps API."""
    return await location_service.reverse_geocode(lat, lng)

@router.get("/autocomplete")
async def autocomplete_address(
    query: str = Query(..., min_length=2, description="Search term for address autocomplete")
):
    """Provides Google Maps place predictions for address search input."""
    return await location_service.autocomplete_address(query)

@router.get("/delivery-check")
def check_delivery_radius(
    lat: float = Query(..., description="Destination latitude"),
    lng: float = Query(..., description="Destination longitude")
):
    """Checks if destination coordinates fall within maximum delivery radius."""
    return location_service.is_within_delivery_radius(lat, lng)
