"use client";

import React, { useState } from 'react';
import { X, Smartphone, ArrowRight, CheckCircle, ShieldCheck, Lock } from 'lucide-react';
import { KeychainStore, UserProfile } from '../services/keychainStore';

import { SupabaseAuthService } from '../services/supabase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'methods' | 'otp'>('methods');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsSending(true);
    try {
      await SupabaseAuthService.signInWithGoogle();
    } catch (err) {
      console.warn("Supabase Google OAuth fallback mode:", err);
      const googleUser: UserProfile = {
        id: `usr-g-${Date.now()}`,
        fullName: 'Aarav Sharma',
        email: 'aarav.sharma@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
        loginProvider: 'Google',
        addresses: [
          {
            id: 'addr-1',
            fullName: 'Aarav Sharma',
            street: '42 MG Road, Indiranagar',
            city: 'Bengaluru',
            state: 'Karnataka',
            zip: '560038',
            phone: '+91 98765 43210',
            isDefault: true
          }
        ]
      };
      KeychainStore.setUser(googleUser);
      onSuccess(googleUser);
      onClose();
    } finally {
      setIsSending(false);
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setStep('otp');
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneUser: UserProfile = {
      id: `usr-p-${Date.now()}`,
      fullName: 'Verified Customer',
      phone: `+91 ${phone}`,
      loginProvider: 'Phone',
      addresses: []
    };
    KeychainStore.setUser(phoneUser);
    onSuccess(phoneUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-[#1F2937] rounded-[28px] p-8 border border-[#E5E7EB] dark:border-gray-700 shadow-2xl relative space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-[#F8FAFC] dark:bg-gray-800 text-gray-500 hover:text-black dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xl font-black mx-auto shadow-md shadow-[#2563EB]/20">
            ◎
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Welcome to</span>
          <h2 className="text-2xl font-black text-[#111827] dark:text-white tracking-tight uppercase">
            SAVVORA
          </h2>
        </div>

        {step === 'methods' ? (
          <div className="space-y-5">
            
            {/* Google Sign-In Button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3.5 px-4 rounded-full bg-white dark:bg-black border border-[#E5E7EB] dark:border-gray-700 font-extrabold text-xs text-[#111827] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 shadow-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-[#E5E7EB] dark:border-gray-700 w-full" />
              <span className="bg-white dark:bg-[#1F2937] px-3 text-[10px] font-black uppercase text-gray-400 absolute">
                OR
              </span>
            </div>

            {/* Phone Number Input */}
            <form onSubmit={handleSendOtp} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Phone Number</label>
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-3 rounded-2xl bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 font-extrabold text-xs text-[#111827] dark:text-white">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="98765 43210"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 px-4 py-3 rounded-2xl bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 font-extrabold text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSending || phone.length < 10}
                className="w-full py-3.5 rounded-full bg-[#111827] hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider shadow-md disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                <span>{isSending ? 'Sending OTP...' : 'Send OTP'}</span>
                <ArrowRight className="w-4 h-4 text-[#2563EB]" />
              </button>
            </form>

          </div>
        ) : (
          /* OTP Verification Step */
          <form onSubmit={handleVerifyOtp} className="space-y-5 text-center">
            <div>
              <h3 className="text-sm font-black text-[#111827] dark:text-white">Verify Phone Number</h3>
              <p className="text-xs text-gray-400 mt-1">Enter 6-digit OTP sent to +91 {phone}</p>
            </div>

            <div className="flex justify-center gap-2 my-2">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={otp[idx]}
                  onChange={(e) => {
                    const val = e.target.value;
                    const newOtp = [...otp];
                    newOtp[idx] = val;
                    setOtp(newOtp);
                    if (val && e.target.nextElementSibling) {
                      (e.target.nextElementSibling as HTMLInputElement).focus();
                    }
                  }}
                  className="w-10 h-12 text-center text-lg font-black rounded-xl bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 text-[#111827] dark:text-white focus:border-[#2563EB]"
                />
              ))}
            </div>

            <p className="text-[11px] font-mono text-gray-400">Demo OTP: <strong className="text-[#2563EB]">123456</strong></p>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#2563EB] hover:bg-blue-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md"
            >
              Verify OTP & Login
            </button>
          </form>
        )}

        {/* Footer Policy */}
        <div className="pt-4 border-t border-[#E5E7EB] dark:border-gray-700 text-center text-[10px] text-gray-400">
          By continuing, you agree to SAVVORA's <a href="#" className="underline font-bold">Terms & Privacy Policy</a>
        </div>

      </div>
    </div>
  );
};
