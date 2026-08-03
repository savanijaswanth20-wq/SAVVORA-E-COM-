"use client";

import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import { useLocation } from '@/context/LocationContext';
import { X, Navigation, Search, MapPin, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

const mapContainerStyle = {
  width: '100%',
  height: '340px',
};

const libraries: ('places' | 'geometry' | 'drawing')[] = ['places'];

export const LocationPickerModal: React.FC = () => {
  const {
    isPickerOpen,
    closeLocationPicker,
    activeLocation,
    selectLocationCoordinates,
    detectCurrentLocation,
    deliveryValidation,
    isLoadingLocation,
    openAddressForm,
  } = useLocation();

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries,
  });

  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [mapCenter, setMapCenter] = useState({
    lat: activeLocation?.latitude || 13.6288,
    lng: activeLocation?.longitude || 79.4192,
  });
  const [markerPosition, setMarkerPosition] = useState({
    lat: activeLocation?.latitude || 13.6288,
    lng: activeLocation?.longitude || 79.4192,
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onAutocompleteLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setMapCenter({ lat, lng });
        setMarkerPosition({ lat, lng });
        selectLocationCoordinates(lat, lng);
      }
    }
  };

  const handleMarkerDragEnd = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPosition({ lat, lng });
      await selectLocationCoordinates(lat, lng);
    }
  };

  const handleDetectGPS = async () => {
    const geo = await detectCurrentLocation();
    if (geo) {
      setMapCenter({ lat: geo.latitude, lng: geo.longitude });
      setMarkerPosition({ lat: geo.latitude, lng: geo.longitude });
    }
  };

  const handleProceedToForm = () => {
    closeLocationPicker();
    openAddressForm();
  };

  if (!isPickerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0d121f] text-white border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Select Delivery Location</h3>
              <p className="text-xs text-gray-400">Search area or drag marker on Google Map</p>
            </div>
          </div>
          <button
            onClick={closeLocationPicker}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          
          {/* Autocomplete Search & Detect GPS Row */}
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            <div className="relative flex-1">
              {isLoaded ? (
                <Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={onPlaceChanged}>
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search city, area, or landmark..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 text-xs font-semibold focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </Autocomplete>
              ) : (
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    disabled
                    placeholder="Loading Google Places API..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-xs font-semibold"
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleDetectGPS}
              disabled={isLoadingLocation}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50 shrink-0"
            >
              {isLoadingLocation ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4 text-amber-300" />
              )}
              <span>Detect GPS</span>
            </button>
          </div>

          {/* Google Map Container */}
          <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-inner">
            {loadError ? (
              <div className="p-8 text-center bg-red-950/30 text-red-400 border border-red-800/40 rounded-xl space-y-2">
                <AlertTriangle className="w-8 h-8 mx-auto" />
                <p className="font-bold text-sm">Failed to load Google Maps JS API</p>
                <p className="text-xs text-red-300">Please check process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</p>
              </div>
            ) : isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={15}
                onLoad={onMapLoad}
                options={{
                  disableDefaultUI: false,
                  zoomControl: true,
                  streetViewControl: false,
                  mapTypeControl: true,
                  styles: [
                    { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
                    { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
                    { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
                  ],
                }}
              >
                <Marker
                  position={markerPosition}
                  draggable={true}
                  onDragEnd={handleMarkerDragEnd}
                  title="Drag pin to select exact delivery location"
                />
              </GoogleMap>
            ) : (
              <div className="h-80 flex flex-col items-center justify-center bg-gray-900 text-gray-400 space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="text-xs font-bold">Loading Interactive Google Map...</span>
              </div>
            )}
          </div>

          {/* Reverse Geocoded Address Display & Delivery Status */}
          {activeLocation && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Detected Address</span>
                  <p className="text-xs font-bold text-white">{activeLocation.formatted_address}</p>
                </div>
              </div>

              {/* Delivery Availability Status Pill */}
              {deliveryValidation && (
                <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs">
                  {deliveryValidation.is_available ? (
                    <div className="flex items-center gap-2 text-emerald-400 font-extrabold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{deliveryValidation.message} ({deliveryValidation.estimated_delivery})</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-rose-400 font-extrabold">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{deliveryValidation.message}</span>
                    </div>
                  )}
                  <span className="text-[10px] font-bold text-gray-400">
                    {deliveryValidation.distance_km} km from hub
                  </span>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-gray-800 bg-[#0a0d16] flex items-center justify-end gap-3">
          <button
            onClick={closeLocationPicker}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleProceedToForm}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/40 transition-all active:scale-95 flex items-center gap-2"
          >
            <span>Confirm & Enter Address Details</span>
          </button>
        </div>

      </div>
    </div>
  );
};
