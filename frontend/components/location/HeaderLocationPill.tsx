"use client";

import React from 'react';
import { useLocation } from '@/context/LocationContext';
import { MapPin, ChevronDown } from 'lucide-react';

export const HeaderLocationPill: React.FC = () => {
  const { activeLocation, selectedAddress, openLocationPicker } = useLocation();

  const displayCity = selectedAddress?.city || activeLocation?.city || 'Tirupati';
  const displayPin = selectedAddress?.postal_code || activeLocation?.postal_code || '517501';
  const fullAddressSnippet = selectedAddress
    ? `${selectedAddress.house}, ${selectedAddress.area}`
    : activeLocation?.formatted_address || 'Central Hub, Tirupati';

  return (
    <button
      onClick={openLocationPicker}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 dark:bg-gray-800/80 dark:hover:bg-gray-700/80 border border-gray-200/40 dark:border-gray-700/60 text-gray-900 dark:text-white text-xs font-black transition-all active:scale-95 shadow-xs group"
      title={`Current Delivery Address: ${fullAddressSnippet}. Click to Change Location.`}
    >
      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0 group-hover:animate-bounce" />
      <div className="flex items-center gap-1 max-w-[150px] sm:max-w-[220px] truncate text-[11px] sm:text-xs">
        <span className="text-gray-400 font-bold hidden xs:inline">Deliver to:</span>
        <span className="font-extrabold truncate text-gray-900 dark:text-white">{displayCity}</span>
        <span className="text-blue-500 font-bold">{displayPin}</span>
      </div>

      <span className="px-2 py-0.5 rounded-full bg-blue-600/10 text-blue-500 dark:text-blue-400 text-[10px] font-black uppercase tracking-wider hidden md:inline-flex items-center gap-1">
        <span>Change</span>
        <ChevronDown className="w-3 h-3 text-blue-400 shrink-0" />
      </span>
      
      <ChevronDown className="w-3 h-3 text-gray-400 shrink-0 md:hidden" />
    </button>
  );
};
