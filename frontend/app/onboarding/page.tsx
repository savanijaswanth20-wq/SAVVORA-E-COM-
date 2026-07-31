"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Phone, 
  MapPin, 
  Camera, 
  Check, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Loader2,
  ShoppingBag,
  Zap,
  Sliders
} from 'lucide-react';
import { KeychainStore, UserProfile } from '@/types/store';
import { SupabaseAuthService } from '@/services/supabase/auth';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
];

const CATEGORY_PREFERENCES = [
  { id: 'custom-name', label: 'Custom Keychains', icon: Zap, color: 'from-amber-500 to-orange-500' },
  { id: 'electronics', label: 'Electronics & Gadgets', icon: Sliders, color: 'from-blue-500 to-indigo-500' },
  { id: 'accessories', label: 'Fashion & Accessories', icon: ShoppingBag, color: 'from-rose-500 to-pink-500' },
  { id: 'bestseller', label: 'Bestseller Lineup', icon: Sparkles, color: 'from-emerald-500 to-teal-500' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [cityState, setCityState] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(AVATAR_PRESETS[0]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(['custom-name', 'bestseller']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const currentUser = KeychainStore.getUser();
    if (currentUser) {
      setUser(currentUser);
      setFullName(currentUser.fullName || '');
      setPhone(currentUser.phone || '');
      if (currentUser.avatar) setSelectedAvatar(currentUser.avatar);
      if (currentUser.preferences?.length) setSelectedPreferences(currentUser.preferences);
      if (currentUser.addresses?.[0]) {
        setStreetAddress(currentUser.addresses[0].street || '');
        setCityState(`${currentUser.addresses[0].city || ''}, ${currentUser.addresses[0].state || ''}`);
      }
    }
  }, []);

  const togglePreference = (catId: string) => {
    if (selectedPreferences.includes(catId)) {
      setSelectedPreferences(selectedPreferences.filter((p) => p !== catId));
    } else {
      setSelectedPreferences([...selectedPreferences, catId]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name');
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

      KeychainStore.setUser(updatedProfile);

      try {
        await SupabaseAuthService.updateProfile({
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          avatar_url: selectedAvatar,
          profile_completed: true,
          preferences: selectedPreferences,
        });
      } catch (err) {
        console.warn('Could not sync profile to Supabase DB:', err);
      }

      router.push('/');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to complete profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#1F2937] rounded-[36px] p-8 md:p-10 border border-gray-800 shadow-2xl space-y-8 animate-fade-in">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-2xl font-black mx-auto shadow-lg shadow-blue-500/30">
            ◎
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-[#2563EB] block">
            First-Time User Onboarding
          </span>
          <h1 className="text-3xl font-black tracking-tight uppercase text-white">
            Complete Your Profile
          </h1>
          <p className="text-xs text-gray-400 font-medium max-w-md mx-auto">
            Welcome to SAVVORA! Please fill in your basic details for express delivery and personalized deals.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* ✔ Profile Photo (Optional) */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-gray-400 block text-center">
              ✔ Profile Photo (Optional)
            </label>
            <div className="flex items-center justify-center gap-4">
              {AVATAR_PRESETS.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(img)}
                  className={`relative rounded-full overflow-hidden transition-all ${
                    selectedAvatar === img 
                      ? 'ring-4 ring-[#2563EB] scale-110 shadow-lg' 
                      : 'opacity-60 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <img src={img} alt={`Avatar ${idx + 1}`} className="w-14 h-14 object-cover" />
                  {selectedAvatar === img && (
                    <div className="absolute inset-0 bg-[#2563EB]/40 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white font-bold" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ✔ Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-gray-300 block">
              ✔ Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Jaswanth Savan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-800 text-xs font-bold border border-gray-700 text-white focus:outline-none focus:border-[#2563EB] transition-colors"
              />
            </div>
          </div>

          {/* ✔ Phone Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-gray-300 block">
              ✔ Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-800 text-xs font-bold border border-gray-700 text-white focus:outline-none focus:border-[#2563EB] transition-colors"
              />
            </div>
          </div>

          {/* ✔ Delivery Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-gray-300 block">
              ✔ Delivery Address
            </label>
            <div className="space-y-2">
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Street Address, House / Flat No."
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-800 text-xs font-bold border border-gray-700 text-white focus:outline-none focus:border-[#2563EB] transition-colors"
                />
              </div>
              <input
                type="text"
                placeholder="City, State (e.g. Bengaluru, Karnataka)"
                value={cityState}
                onChange={(e) => setCityState(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-gray-800 text-xs font-bold border border-gray-700 text-white focus:outline-none focus:border-[#2563EB] transition-colors"
              />
            </div>
          </div>

          {/* Category Preferences */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-black uppercase tracking-wider text-gray-400 block">
              Select Preferred Shopping Collections
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
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'border-[#2563EB] bg-blue-950/40 text-white ring-2 ring-[#2563EB]'
                        : 'border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <div className={`p-2 rounded-xl bg-gradient-to-r ${cat.color} text-white shadow-sm`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-[#2563EB] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/30 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving Profile...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> [ Save & Continue Shopping ]
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
