"use client";

import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, Mail, Lock, User, AlertCircle, CheckCircle, Smartphone, KeyRound, Loader2 } from 'lucide-react';
import { KeychainStore, UserProfile } from '../types/store';
import { SupabaseAuthService } from '../services/supabase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [tab, setTab] = useState<'signin' | 'signup' | 'phone' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // Phone OTP state
  const [phone, setPhone] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [otpStep, setOtpStep] = useState<'send' | 'verify'>('send');
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'facebook' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setLoadingProvider('google');
    setErrorMessage('');
    try {
      await SupabaseAuthService.signInWithGoogle();
    } catch (err: any) {
      console.warn("Supabase Google OAuth error:", err);
      setErrorMessage(err.message || 'Failed to initiate Google Sign-In.');
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    setLoadingProvider('facebook');
    setErrorMessage('');
    try {
      await SupabaseAuthService.signInWithFacebook();
    } catch (err: any) {
      console.warn("Supabase Facebook OAuth error:", err);
      setErrorMessage(err.message || 'Failed to initiate Facebook Sign-In.');
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const data = await SupabaseAuthService.signIn(email, password);
      const user = data.user;
      
      const userProfile: UserProfile = {
        id: user?.id || `usr-${Date.now()}`,
        fullName: user?.user_metadata?.full_name || user?.user_metadata?.name || email.split('@')[0],
        email: user?.email || email,
        phone: user?.phone || undefined,
        avatar: user?.user_metadata?.avatar_url || undefined,
        loginProvider: 'Email',
        role: 'customer',
        addresses: []
      };

      KeychainStore.setUser(userProfile);
      onSuccess(userProfile);
      onClose();
    } catch (err: any) {
      console.warn("Supabase Sign In error:", err);
      setErrorMessage(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await SupabaseAuthService.signUp(email, password, fullName);
      setSuccessMessage('Registration successful! Please check your email inbox for the verification link.');
    } catch (err: any) {
      console.warn("Supabase Sign Up error:", err);
      setErrorMessage(err.message || 'Could not register account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await SupabaseAuthService.signInWithOtp(phone);
      setOtpStep('verify');
      setSuccessMessage(`OTP sent successfully to ${phone}. Enter 6-digit verification code.`);
    } catch (err: any) {
      console.warn("Supabase Send OTP error:", err);
      setErrorMessage(err.message || 'Failed to send OTP to phone number.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const data = await SupabaseAuthService.verifyOtp(phone, otpToken);
      const user = data.user;

      const userProfile: UserProfile = {
        id: user?.id || `usr-${Date.now()}`,
        fullName: user?.user_metadata?.full_name || `User ${phone.slice(-4)}`,
        email: user?.email || undefined,
        phone: phone,
        avatar: user?.user_metadata?.avatar_url || undefined,
        loginProvider: 'Phone',
        role: 'customer',
        addresses: []
      };

      KeychainStore.setUser(userProfile);
      onSuccess(userProfile);
      onClose();
    } catch (err: any) {
      console.warn("Supabase Verify OTP error:", err);
      setErrorMessage(err.message || 'Invalid OTP code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await SupabaseAuthService.resetPasswordForEmail(email);
      setSuccessMessage(`Password reset link dispatched to ${email}. Please check your inbox.`);
    } catch (err: any) {
      console.warn("Supabase Password Reset error:", err);
      setErrorMessage(err.message || 'Failed to send password reset email.');
    } finally {
      setIsLoading(false);
    }
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

        {/* Auth Mode Tabs */}
        {tab !== 'forgot' && (
          <div className="flex bg-[#F8FAFC] dark:bg-gray-800 p-1 rounded-2xl border border-[#E5E7EB] dark:border-gray-700 text-xs font-black">
            <button
              onClick={() => { setTab('signin'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex-1 py-2 text-center rounded-xl transition-all ${
                tab === 'signin'
                  ? 'bg-white dark:bg-black text-[#111827] dark:text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('signup'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex-1 py-2 text-center rounded-xl transition-all ${
                tab === 'signup'
                  ? 'bg-white dark:bg-black text-[#111827] dark:text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
            >
              Register
            </button>
            <button
              onClick={() => { setTab('phone'); setOtpStep('send'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex-1 py-2 text-center rounded-xl transition-all ${
                tab === 'phone'
                  ? 'bg-white dark:bg-black text-[#111827] dark:text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
            >
              Phone OTP
            </button>
          </div>
        )}

        {/* Notifications */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Sign In Form */}
        {tab === 'signin' && (
          <div className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 font-extrabold text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-gray-500">Password</label>
                  <button
                    type="button"
                    onClick={() => { setTab('forgot'); setErrorMessage(''); setSuccessMessage(''); }}
                    className="text-[11px] font-bold text-[#2563EB] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 font-extrabold text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-full bg-[#2563EB] hover:bg-blue-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'Signing In...' : 'Sign In with Email'}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </form>

            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-[#E5E7EB] dark:border-gray-700 w-full" />
              <span className="bg-white dark:bg-[#1F2937] px-3 text-[10px] font-black uppercase text-gray-400 absolute">
                OR CONTINUE WITH
              </span>
            </div>

            <div className="space-y-2.5">
              {/* 1. Google Login */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-black border border-[#E5E7EB] dark:border-gray-700 font-extrabold text-xs text-[#111827] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 shadow-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                {loadingProvider === 'google' ? (
                  <>
                    <Loader2 className="w-4 h-4 text-[#4285F4] animate-spin shrink-0" />
                    <span>Connecting to Google...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* 2. Facebook Login */}
              <button
                type="button"
                onClick={handleFacebookLogin}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] font-extrabold text-xs text-white shadow-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                {loadingProvider === 'facebook' ? (
                  <>
                    <Loader2 className="w-4 h-4 text-white animate-spin shrink-0" />
                    <span>Connecting to Facebook...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Continue with Facebook</span>
                  </>
                )}
              </button>

              {/* 3. Phone OTP Login */}
              <button
                type="button"
                onClick={() => { setTab('phone'); setOtpStep('send'); setErrorMessage(''); setSuccessMessage(''); }}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-2xl bg-[#F8FAFC] dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-[#E5E7EB] dark:border-gray-700 font-extrabold text-xs text-[#111827] dark:text-white shadow-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                <Smartphone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Continue with Phone OTP</span>
              </button>
            </div>
          </div>
        )}

        {/* Sign Up Form */}
        {tab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 font-extrabold text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 font-extrabold text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 font-extrabold text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-[#2563EB] hover:bg-blue-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md disabled:opacity-40 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isLoading ? 'Registering...' : 'Register Account'}</span>
            </button>
          </form>
        )}

        {/* Phone OTP Form */}
        {tab === 'phone' && (
          <div className="space-y-4">
            {otpStep === 'send' ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Mobile Phone Number</label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 font-extrabold text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">We will send a 6-digit verification code via SMS.</p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-full bg-[#2563EB] hover:bg-blue-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>{isLoading ? 'Sending Code...' : 'Send Verification OTP'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">6-Digit Verification Code</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="123456"
                      value={otpToken}
                      onChange={(e) => setOtpToken(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 font-extrabold text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB] tracking-widest text-center"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isLoading ? 'Verifying...' : 'Verify OTP & Log In'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOtpStep('send')}
                  className="w-full text-center text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white"
                >
                  Change Phone Number
                </button>
              </form>
            )}
          </div>
        )}

        {/* Forgot Password Form */}
        {tab === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-sm font-black text-[#111827] dark:text-white">Recover Password</h3>
              <p className="text-xs text-gray-400">Enter your email address to receive a secure reset link.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 font-extrabold text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-[#2563EB] hover:bg-blue-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md disabled:opacity-40 transition-all flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Sending Link...' : 'Send Reset Link'}</span>
            </button>

            <button
              type="button"
              onClick={() => { setTab('signin'); setErrorMessage(''); setSuccessMessage(''); }}
              className="w-full text-center text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white"
            >
              Back to Sign In
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
