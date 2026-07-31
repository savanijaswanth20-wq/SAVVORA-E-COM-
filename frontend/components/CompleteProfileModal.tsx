"use client";

import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Check, 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  X, 
  ShoppingBag, 
  Zap, 
  Sliders,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { KeychainStore, UserProfile } from '../types/store';
import { SupabaseAuthService } from '../services/supabase/auth';

interface CompleteProfileModalProps {
  isOpen: boolean;
  user: UserProfile | null;
  onClose: () => void;
  onSuccess: (updatedUser: UserProfile) => void;
}

const CATEGORY_PREFERENCES = [
  { id: 'custom-name', label: 'Custom Keychains', icon: Zap, color: 'from-amber-500 to-orange-500' },
  { id: 'electronics', label: 'Electronics & Gadgets', icon: Sliders, color: 'from-blue-500 to-indigo-500' },
  { id: 'accessories', label: 'Fashion & Accessories', icon: ShoppingBag, color: 'from-rose-500 to-pink-500' },
  { id: 'bestseller', label: 'Bestseller Lineup', icon: Sparkles, color: 'from-emerald-500 to-teal-500' },
];

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
];

export const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({
  isOpen,
  user,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [streetAddress, setStreetAddress] = useState(user?.addresses?.[0]?.street || '');
  const [cityState, setCityState] = useState(user?.addresses?.[0]?.city ? `${user.addresses[0].city}, ${user.addresses[0].state || ''}` : '');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(user?.avatar || AVATAR_PRESETS[0]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(user?.preferences || ['custom-name', 'bestseller']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const togglePreference = (catId: string) => {
    if (selectedPreferences.includes(catId)) {
      setSelectedPreferences(selectedPreferences.filter((p) => p !== catId));
    } else {
      setSelectedPreferences([...selectedPreferences, catId]);
    }
  };

  const handleSubmit = async () => {
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name');
      setStep(1);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const addresses = streetAddress.trim() ? [
        {
          id: `addr-${Date.now()}`,
          fullName: fullName.trim(),
          street: streetAddress.trim(),
          city: cityState.split(',')[0]?.trim() || 'Bengaluru',
          state: cityState.split(',')[1]?.trim() || 'Karnataka',
          zip: '560001',
          phone: phone.trim() || '+91 9876543210',
          isDefault: true
        }
      ] : (user?.addresses || []);

      const updatedProfile: UserProfile = {
        id: user?.id || `usr-${Date.now()}`,
        fullName: fullName.trim(),
        email: user?.email,
        phone: phone.trim() || user?.phone,
        avatar: selectedAvatar,
        loginProvider: user?.loginProvider || 'Email',
        role: user?.role || 'customer',
        addresses: addresses,
        profileCompleted: true,
        preferences: selectedPreferences,
      };

      // Save locally
      KeychainStore.setUser(updatedProfile);

      // Async update in Supabase
      try {
        await SupabaseAuthService.updateProfile({
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          avatar_url: selectedAvatar,
          profile_completed: true,
          preferences: selectedPreferences,
        });
      } catch (err) {
        console.warn('Could not sync complete profile to Supabase DB:', err);
      }

      onSuccess(updatedProfile);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-[#1F2937] rounded-[32px] p-8 border border-gray-100 dark:border-gray-700 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-black dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badge & Progress Indicator */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Step {step} of 2 — Complete Profile
          </div>
          <h2 className="text-2xl font-black text-[#111827] dark:text-white tracking-tight uppercase">
            {step === 1 ? 'Complete Your Profile' : 'Select Shopping Style'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {step === 1 
              ? 'Required details for seamless checkout and personalized recommendations.' 
              : 'Choose the categories you are most interested in exploring.'}
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="flex gap-2">
          <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-[#2563EB]' : 'bg-gray-200 dark:bg-gray-700'}`} />
          <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-[#2563EB]' : 'bg-gray-200 dark:bg-gray-700'}`} />
        </div>

        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Step 1: Personal Information */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            
            {/* Profile Photo (Optional) */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 block text-center">
                ✔ Profile Photo (Optional)
              </label>
              <div className="flex items-center justify-center gap-3">
                {AVATAR_PRESETS.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedAvatar(img)}
                    className={`relative rounded-full overflow-hidden transition-all ${
                      selectedAvatar === img 
                        ? 'ring-4 ring-[#2563EB] scale-110 shadow-lg' 
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img src={img} alt={`Avatar ${idx + 1}`} className="w-11 h-11 object-cover" />
                    {selectedAvatar === img && (
                      <div className="absolute inset-0 bg-[#2563EB]/40 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white font-bold" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ✔ Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 block">
                ✔ Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Jaswanth Savan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800 text-xs font-bold border border-gray-200 dark:border-gray-700 text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB] transition-colors"
                />
              </div>
            </div>

            {/* ✔ Phone Number */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 block">
                ✔ Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800 text-xs font-bold border border-gray-200 dark:border-gray-700 text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB] transition-colors"
                />
              </div>
            </div>

            {/* ✔ Delivery Address */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 block">
                ✔ Delivery Address (Street & City)
              </label>
              <div className="relative space-y-2">
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Street Address, House / Flat No."
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800 text-xs font-bold border border-gray-200 dark:border-gray-700 text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB] transition-colors"
                  />
                </div>
                <input
                  type="text"
                  placeholder="City, State (e.g. Bengaluru, Karnataka)"
                  value={cityState}
                  onChange={(e) => setCityState(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800 text-xs font-bold border border-gray-200 dark:border-gray-700 text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB] transition-colors"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!fullName.trim()) {
                  setErrorMessage('Please enter your full name');
                  return;
                }
                setErrorMessage('');
                setStep(2);
              }}
              className="w-full py-3.5 rounded-2xl bg-[#2563EB] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/25 active:scale-95 mt-2"
            >
              Continue to Preferences <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Shopping & Category Preferences */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
                Select Your Favorite Collections
              </label>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORY_PREFERENCES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedPreferences.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => togglePreference(cat.id)}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'border-[#2563EB] bg-blue-50/50 dark:bg-blue-950/40 shadow-md ring-2 ring-[#2563EB]'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`p-2.5 rounded-xl bg-gradient-to-r ${cat.color} text-white shadow-sm`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />}
                      </div>
                      <span className="text-xs font-black text-[#111827] dark:text-white leading-tight">
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-4 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold uppercase tracking-wider hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-4 rounded-2xl bg-[#2563EB] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/25 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving Profile...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Save & Continue Shopping
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Footer skip action */}
        <div className="text-center pt-1">
          <button
            onClick={handleSubmit}
            className="text-[11px] font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline transition-colors"
          >
            [ Save & Continue Shopping ]
          </button>
        </div>

      </div>
    </div>
  );
};
