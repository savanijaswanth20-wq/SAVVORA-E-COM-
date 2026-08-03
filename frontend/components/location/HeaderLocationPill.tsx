"use client";

import React from 'react';
import { useLocation } from '@/context/LocationContext';
import { MapPin, ChevronDown } from 'lucide-react';

export const HeaderLocationPill: React.FC = () => {
  const { activeLocation, selectedAddress, openLocationPicker } = useLocation();

  const displayCity = selectedAddress?.city || activeLocation?.city || 'Tirupati';
  const displayPin = selectedAddress?.postal_code || activeLocation?.postal_code || '517501';

  return (
    <button
      onClick={openLocationPicker}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 dark:bg-gray-800/80 dark:hover:bg-gray-800 border border-gray-200/40 dark:border-gray-700/60 text-gray-900 dark:text-white text-xs font-black transition-all active:scale-95 shadow-xs"
      title="Click to select or change delivery location"
    >
      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
      <div className="flex items-center gap-1 max-w-[140px] sm:max-w-[180px] truncate text-[11px] sm:text-xs">
        <span className="text-gray-400 font-bold hidden xs:inline">Deliver to:</span>
        <span className="font-extrabold truncate">{displayCity}</span>
        <span className="text-blue-400 font-bold">{displayPin}</span>
      </div>
      <ChevronDown className="w-3 h-3 text-gray-400 shrink-0" />
    </button>
  );
};
