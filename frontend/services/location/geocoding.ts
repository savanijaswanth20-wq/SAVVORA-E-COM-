import { GeocodingResult, DeliveryValidation } from '@/types/address';

export async function reverseGeocodeCoordinates(
  lat: number,
  lng: number
): Promise<GeocodingResult> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (window.google && window.google.maps) {
    const geocoder = new window.google.maps.Geocoder();
    const response = await geocoder.geocode({ location: { lat, lng } });

    if (response.results && response.results.length > 0) {
      return parseGoogleGeocodeResult(response.results[0], lat, lng);
    }
  }

  // Fallback REST API call if JS API isn't initialized
  if (apiKey) {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        return parseGoogleGeocodeResult(data.results[0], lat, lng);
      }
    } catch (err) {
      console.warn('Google Maps Geocoding REST API fallback failed:', err);
    }
  }

  return {
    formatted_address: `Coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    area: 'Local Area',
    city: 'City',
    state: 'State',
    country: 'India',
    postal_code: '517501',
    latitude: lat,
    longitude: lng,
  };
}

function parseGoogleGeocodeResult(
  result: any,
  lat: number,
  lng: number
): GeocodingResult {
  const components = result.address_components || [];
  let house_number = '';
  let street = '';
  let area = '';
  let city = '';
  let district = '';
  let state = '';
  let country = 'India';
  let postal_code = '';

  for (const comp of components) {
    const types = comp.types || [];
    if (types.includes('street_number')) {
      house_number = comp.long_name;
    } else if (types.includes('route')) {
      street = comp.long_name;
    } else if (
      types.includes('sublocality_level_1') ||
      types.includes('sublocality') ||
      types.includes('neighborhood')
    ) {
      area = comp.long_name;
    } else if (types.includes('locality')) {
      city = comp.long_name;
    } else if (types.includes('administrative_area_level_2')) {
      district = comp.long_name;
    } else if (types.includes('administrative_area_level_1')) {
      state = comp.long_name;
    } else if (types.includes('country')) {
      country = comp.long_name;
    } else if (types.includes('postal_code')) {
      postal_code = comp.long_name;
    }
  }

  // Fallbacks if area/city are missing in coarse geocodes
  if (!city && district) city = district;
  if (!area && street) area = street;

  return {
    formatted_address: result.formatted_address || '',
    house_number,
    street,
    area: area || city || 'Local Area',
    city: city || 'Tirupati',
    district,
    state: state || 'Andhra Pradesh',
    country,
    postal_code: postal_code || '517501',
    latitude: lat,
    longitude: lng,
  };
}

export async function validateDeliveryRadiusBackend(
  lat: number,
  lng: number,
  postal_code?: string
): Promise<DeliveryValidation> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

  try {
    const response = await fetch(`${backendUrl}/api/v1/location/validate-delivery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude: lat,
        longitude: lng,
        postal_code: postal_code || '',
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('Backend delivery validation API unreachable, performing client Haversine fallback:', error);
    
    // Client-side Haversine Fallback if backend API is offline
    const STORE_LAT = 13.6288;
    const STORE_LNG = 79.4192;
    const R = 6371.0;

    const dlat = ((lat - STORE_LAT) * Math.PI) / 180;
    const dlng = ((lng - STORE_LNG) * Math.PI) / 180;
    const a =
      Math.sin(dlat / 2) * Math.sin(dlat / 2) +
      Math.cos((STORE_LAT * Math.PI) / 180) *
        Math.cos((lat * Math.PI) / 180) *
        Math.sin(dlng / 2) *
        Math.sin(dlng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = Math.round(R * c * 100) / 100;

    const is_available = dist <= 25.0;

    return {
      is_available,
      distance_km: dist,
      estimated_delivery: is_available
        ? dist <= 5.0
          ? 'Express Delivery (Within 2 Hours)'
          : dist <= 15.0
          ? 'Same Day Delivery'
          : 'Standard Delivery (Tomorrow)'
        : null,
      message: is_available
        ? 'Delivery is available at your location!'
        : 'Sorry, delivery is currently unavailable at this location.',
      store_hub: { lat: STORE_LAT, lng: STORE_LNG, radius_km: 25.0 },
    };
  }
}
