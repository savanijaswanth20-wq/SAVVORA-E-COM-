export type AddressType = 'home' | 'work' | 'other';

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  house: string;
  apartment?: string | null;
  landmark?: string | null;
  area: string;
  city: string;
  district?: string | null;
  state: string;
  country: string;
  postal_code: string;
  latitude?: number | null;
  longitude?: number | null;
  address_type: AddressType;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AddressInput {
  full_name: string;
  phone: string;
  house: string;
  apartment?: string;
  landmark?: string;
  area: string;
  city: string;
  district?: string;
  state: string;
  country?: string;
  postal_code: string;
  latitude?: number;
  longitude?: number;
  address_type: AddressType;
  is_default?: boolean;
}

export interface GeocodingResult {
  formatted_address: string;
  house_number?: string;
  street?: string;
  area?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  latitude: number;
  longitude: number;
}

export interface DeliveryValidation {
  is_available: boolean;
  distance_km: number;
  estimated_delivery?: string | null;
  message: string;
  store_hub?: {
    lat: number;
    lng: number;
    radius_km: number;
  };
}

export interface LocationCoordinates {
  lat: number;
  lng: number;
  accuracy?: number;
}
