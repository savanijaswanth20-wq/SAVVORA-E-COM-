"use client";

import React from 'react';
import { Address } from '@/types/address';
import { useLocation } from '@/context/LocationContext';
import { Home, Briefcase, MapPin, Check, Edit2, Trash2, Star } from 'lucide-react';

interface AddressCardProps {
  address: Address;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  isSelected = false,
  onSelect,
}) => {
  const { setDefaultAddress, deleteAddress, openAddressForm } = useLocation();

  const handleSetDefault = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await setDefaultAddress(address.id);
    } catch (err) {
      console.error('Failed to set default address:', err);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(address.id);
      } catch (err) {
        console.error('Failed to delete address:', err);
      }
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    openAddressForm(address);
  };

  return (
    <div
      onClick={onSelect}
      className={`relative p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
        isSelected
          ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-600/20'
          : 'bg-white/5 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800 hover:border-blue-400/50'
      }`}
    >
      {/* Top Row: Type & Default Badges */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-white/10 dark:bg-gray-800 border border-white/10 text-[10px] font-black uppercase tracking-wider text-blue-400 flex items-center gap-1">
            {address.address_type === 'home' && <Home className="w-3 h-3 text-emerald-400" />}
            {address.address_type === 'work' && <Briefcase className="w-3 h-3 text-amber-400" />}
            {address.address_type === 'other' && <MapPin className="w-3 h-3 text-purple-400" />}
            <span>{address.address_type}</span>
          </span>

          {address.is_default && (
            <span className="px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>DEFAULT</span>
            </span>
          )}
        </div>

        {/* Selected Checkmark */}
        {isSelected && (
          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        )}
      </div>

      {/* Contact Name & Phone */}
      <div className="space-y-1 mb-2">
        <h4 className="text-sm font-black text-gray-900 dark:text-white">
          {address.full_name}
        </h4>
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
          📞 {address.phone}
        </p>
      </div>

      {/* Address Details */}
      <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed mb-4">
        {address.house}
        {address.apartment ? `, ${address.apartment}` : ''}
        {address.landmark ? `, Near ${address.landmark}` : ''}, {address.area},{' '}
        <span className="font-bold">{address.city}</span>, {address.state} -{' '}
        <span className="font-bold text-blue-500">{address.postal_code}</span>
      </p>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800 text-xs font-extrabold">
        {!address.is_default && (
          <button
            onClick={handleSetDefault}
            className="text-amber-500 hover:text-amber-400 transition-colors"
          >
            Set Default
          </button>
        )}

        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={handleEdit}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors"
            title="Edit Address"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors"
            title="Delete Address"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
