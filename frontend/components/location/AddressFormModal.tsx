"use client";

import React, { useState, useEffect } from 'react';
import { useLocation } from '@/context/LocationContext';
import { AddressInput, AddressType } from '@/types/address';
import { X, Home, Briefcase, MapPin, CheckCircle2, Loader2 } from 'lucide-react';

export const AddressFormModal: React.FC = () => {
  const {
    isAddressFormOpen,
    closeAddressForm,
    editingAddress,
    activeLocation,
    saveAddress,
    updateAddress,
  } = useLocation();

  const [formData, setFormData] = useState<AddressInput>({
    full_name: '',
    phone: '',
    house: '',
    apartment: '',
    landmark: '',
    area: '',
    city: 'Tirupati',
    district: 'Tirupati',
    state: 'Andhra Pradesh',
    country: 'India',
    postal_code: '517501',
    address_type: 'home',
    is_default: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (editingAddress) {
      setFormData({
        full_name: editingAddress.full_name,
        phone: editingAddress.phone,
        house: editingAddress.house,
        apartment: editingAddress.apartment || '',
        landmark: editingAddress.landmark || '',
        area: editingAddress.area,
        city: editingAddress.city,
        district: editingAddress.district || '',
        state: editingAddress.state,
        country: editingAddress.country,
        postal_code: editingAddress.postal_code,
        latitude: editingAddress.latitude || undefined,
        longitude: editingAddress.longitude || undefined,
        address_type: editingAddress.address_type,
        is_default: editingAddress.is_default,
      });
    } else if (activeLocation) {
      setFormData((prev) => ({
        ...prev,
        house: activeLocation.house_number || prev.house,
        area: activeLocation.area || prev.area,
        city: activeLocation.city || prev.city,
        district: activeLocation.district || prev.district,
        state: activeLocation.state || prev.state,
        postal_code: activeLocation.postal_code || prev.postal_code,
        latitude: activeLocation.latitude,
        longitude: activeLocation.longitude,
      }));
    }
  }, [editingAddress, activeLocation, isAddressFormOpen]);

  if (!isAddressFormOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.full_name || !formData.phone || !formData.house || !formData.area || !formData.city || !formData.postal_code) {
      setErrorMsg('Please fill in all mandatory address fields (*)');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, formData);
      } else {
        await saveAddress(formData);
      }
      setIsSubmitting(false);
      closeAddressForm();
    } catch (err: any) {
      console.error('Save address error:', err);
      setErrorMsg(err.message || 'Failed to save address. Please check Supabase permissions.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0d121f] text-white border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h3 className="text-lg font-black tracking-tight">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h3>
          <button
            onClick={closeAddressForm}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-400 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {/* Full Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase text-gray-400 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="e.g. Savani Jaswanth"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-gray-400 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* House / Flat & Apartment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase text-gray-400 mb-1">
                Flat / House / Building No. *
              </label>
              <input
                type="text"
                required
                value={formData.house}
                onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                placeholder="e.g. Flat 402, SVJ Heights"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-gray-400 mb-1">
                Apartment / Street (Optional)
              </label>
              <input
                type="text"
                value={formData.apartment || ''}
                onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                placeholder="e.g. Lotus Enclave Road"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Landmark & Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase text-gray-400 mb-1">
                Landmark (Optional)
              </label>
              <input
                type="text"
                value={formData.landmark || ''}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                placeholder="e.g. Near SV University"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-gray-400 mb-1">
                Area / Locality *
              </label>
              <input
                type="text"
                required
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="e.g. Korramenugunta"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* City, State & PIN Code */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-extrabold uppercase text-gray-400 mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-gray-400 mb-1">
                State *
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-gray-400 mb-1">
                PIN Code *
              </label>
              <input
                type="text"
                required
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold focus:outline-none"
              />
            </div>
          </div>

          {/* Address Type Selector */}
          <div>
            <label className="block text-xs font-extrabold uppercase text-gray-400 mb-2">
              Save Address As
            </label>
            <div className="flex items-center gap-3">
              {(['home', 'work', 'other'] as AddressType[]).map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setFormData({ ...formData, address_type: type })}
                  className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-extrabold capitalize flex items-center justify-center gap-2 transition-all ${
                    formData.address_type === type
                      ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {type === 'home' && <Home className="w-4 h-4" />}
                  {type === 'work' && <Briefcase className="w-4 h-4" />}
                  {type === 'other' && <MapPin className="w-4 h-4" />}
                  <span>{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Default Address Checkbox */}
          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="is_default"
              checked={formData.is_default || false}
              onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
              className="w-4 h-4 rounded border-gray-700 bg-white/10 text-blue-600 focus:ring-0"
            />
            <label htmlFor="is_default" className="text-xs font-bold text-gray-300 cursor-pointer">
              Set as my default shipping address
            </label>
          </div>

          {/* Footer Submit Button */}
          <div className="pt-4 border-t border-gray-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeAddressForm}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/40 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>{editingAddress ? 'Update Address' : 'Save Address'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
