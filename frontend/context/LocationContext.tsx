"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Address, AddressInput, GeocodingResult, DeliveryValidation, LocationCoordinates } from '@/types/address';
import { SupabaseAddressService } from '@/services/supabase/addresses';
import { reverseGeocodeCoordinates, validateDeliveryRadiusBackend } from '@/services/location/geocoding';

interface LocationContextType {
  coordinates: LocationCoordinates | null;
  activeLocation: GeocodingResult | null;
  savedAddresses: Address[];
  selectedAddress: Address | null;
  deliveryValidation: DeliveryValidation | null;
  isLoadingLocation: boolean;
  isPermissionDenied: boolean;

  // Modals
  isPickerOpen: boolean;
  isAddressFormOpen: boolean;
  editingAddress: Address | null;

  // Actions
  detectCurrentLocation: () => Promise<GeocodingResult | null>;
  selectLocationCoordinates: (lat: number, lng: number) => Promise<GeocodingResult>;
  selectSavedAddress: (address: Address) => Promise<void>;
  fetchSavedAddresses: () => Promise<void>;
  saveAddress: (input: AddressInput) => Promise<Address>;
  updateAddress: (id: string, input: Partial<AddressInput>) => Promise<Address>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;

  // Modal Controls
  openLocationPicker: () => void;
  closeLocationPicker: () => void;
  openAddressForm: (addressToEdit?: Address) => void;
  closeAddressForm: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const DEFAULT_TIRUPATI_LOCATION: GeocodingResult = {
  formatted_address: 'Tirupati, Andhra Pradesh 517501, India',
  area: 'Central Hub',
  city: 'Tirupati',
  district: 'Tirupati',
  state: 'Andhra Pradesh',
  country: 'India',
  postal_code: '517501',
  latitude: 13.6288,
  longitude: 79.4192,
};

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coordinates, setCoordinates] = useState<LocationCoordinates | null>(null);
  const [activeLocation, setActiveLocation] = useState<GeocodingResult | null>(DEFAULT_TIRUPATI_LOCATION);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [deliveryValidation, setDeliveryValidation] = useState<DeliveryValidation | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [isPermissionDenied, setIsPermissionDenied] = useState<boolean>(false);

  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Fetch saved addresses from Supabase on mount
  const fetchSavedAddresses = useCallback(async () => {
    try {
      const addresses = await SupabaseAddressService.getAddresses();
      setSavedAddresses(addresses);

      // If user has a default address, select it
      const defaultAddr = addresses.find((a) => a.is_default) || addresses[0];
      if (defaultAddr && !selectedAddress) {
        setSelectedAddress(defaultAddr);
        if (defaultAddr.latitude && defaultAddr.longitude) {
          validateDeliveryRadiusBackend(defaultAddr.latitude, defaultAddr.longitude, defaultAddr.postal_code)
            .then(setDeliveryValidation)
            .catch(() => {});
        }
      }
    } catch (err) {
      console.warn('Could not load saved addresses:', err);
    }
  }, [selectedAddress]);

  useEffect(() => {
    fetchSavedAddresses();
  }, [fetchSavedAddresses]);

  // Detect GPS Location
  const detectCurrentLocation = async (): Promise<GeocodingResult | null> => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return null;
    }

    setIsLoadingLocation(true);
    setIsPermissionDenied(false);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = position.coords.accuracy;

          setCoordinates({ lat, lng, accuracy });

          try {
            const geocodeResult = await reverseGeocodeCoordinates(lat, lng);
            setActiveLocation(geocodeResult);

            const validation = await validateDeliveryRadiusBackend(lat, lng, geocodeResult.postal_code);
            setDeliveryValidation(validation);

            setIsLoadingLocation(false);
            resolve(geocodeResult);
          } catch (err) {
            console.error('Failed to reverse geocode location:', err);
            setIsLoadingLocation(false);
            resolve(null);
          }
        },
        (error) => {
          console.warn('Geolocation permission or detection error:', error);
          if (error.code === error.PERMISSION_DENIED) {
            setIsPermissionDenied(true);
          }
          setIsLoadingLocation(false);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  };

  // Select location by lat/lng (e.g. dragging map pin or picking autocomplete result)
  const selectLocationCoordinates = async (lat: number, lng: number): Promise<GeocodingResult> => {
    setIsLoadingLocation(true);
    setCoordinates({ lat, lng });

    const geocodeResult = await reverseGeocodeCoordinates(lat, lng);
    setActiveLocation(geocodeResult);

    const validation = await validateDeliveryRadiusBackend(lat, lng, geocodeResult.postal_code);
    setDeliveryValidation(validation);

    setIsLoadingLocation(false);
    return geocodeResult;
  };

  // Select a saved address
  const selectSavedAddress = async (address: Address) => {
    setSelectedAddress(address);
    if (address.latitude && address.longitude) {
      setCoordinates({ lat: address.latitude, lng: address.longitude });
      const validation = await validateDeliveryRadiusBackend(address.latitude, address.longitude, address.postal_code);
      setDeliveryValidation(validation);
    }
  };

  // Save new address
  const saveAddress = async (input: AddressInput): Promise<Address> => {
    const newAddress = await SupabaseAddressService.addAddress(input);
    await fetchSavedAddresses();
    if (newAddress.is_default || !selectedAddress) {
      setSelectedAddress(newAddress);
    }
    return newAddress;
  };

  // Update address
  const updateAddress = async (id: string, input: Partial<AddressInput>): Promise<Address> => {
    const updated = await SupabaseAddressService.updateAddress(id, input);
    await fetchSavedAddresses();
    if (selectedAddress?.id === id) {
      setSelectedAddress(updated);
    }
    return updated;
  };

  // Delete address
  const deleteAddress = async (id: string) => {
    await SupabaseAddressService.deleteAddress(id);
    await fetchSavedAddresses();
    if (selectedAddress?.id === id) {
      setSelectedAddress(null);
    }
  };

  // Set default address
  const setDefaultAddress = async (id: string) => {
    const updatedDefault = await SupabaseAddressService.setDefaultAddress(id);
    await fetchSavedAddresses();
    setSelectedAddress(updatedDefault);
  };

  // Modal Controls
  const openLocationPicker = () => setIsPickerOpen(true);
  const closeLocationPicker = () => setIsPickerOpen(false);

  const openAddressForm = (addressToEdit?: Address) => {
    setEditingAddress(addressToEdit || null);
    setIsAddressFormOpen(true);
  };
  const closeAddressForm = () => {
    setEditingAddress(null);
    setIsAddressFormOpen(false);
  };

  return (
    <LocationContext.Provider
      value={{
        coordinates,
        activeLocation,
        savedAddresses,
        selectedAddress,
        deliveryValidation,
        isLoadingLocation,
        isPermissionDenied,
        isPickerOpen,
        isAddressFormOpen,
        editingAddress,
        detectCurrentLocation,
        selectLocationCoordinates,
        selectSavedAddress,
        fetchSavedAddresses,
        saveAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        openLocationPicker,
        closeLocationPicker,
        openAddressForm,
        closeAddressForm,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
