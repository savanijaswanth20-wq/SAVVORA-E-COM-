"use client";

import React, { useState, useRef } from 'react';
import { KeychainStore, UserProfile } from '../types/store';
import { SupabaseAuthService } from '../services/supabase/auth';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile, isNewUser?: boolean) => void;
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

  // 3D tilt ref
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    cardRef.current.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(0)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'rotateY(0deg) rotateX(0deg)';
  };

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
      
      const existingUser = KeychainStore.getUser();
      const isCompleted = existingUser?.profileCompleted ?? (user?.user_metadata?.profile_completed || false);

      const userProfile: UserProfile = {
        id: user?.id || `usr-${Date.now()}`,
        fullName: user?.user_metadata?.full_name || user?.user_metadata?.name || email.split('@')[0],
        email: user?.email || email,
        phone: user?.phone || undefined,
        avatar: user?.user_metadata?.avatar_url || undefined,
        loginProvider: 'Email',
        role: 'customer',
        addresses: [],
        profileCompleted: isCompleted,
      };

      KeychainStore.setUser(userProfile);
      onSuccess(userProfile, !isCompleted);
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

      const existingUser = KeychainStore.getUser();
      const isCompleted = existingUser?.profileCompleted ?? false;

      const userProfile: UserProfile = {
        id: user?.id || `usr-${Date.now()}`,
        fullName: user?.user_metadata?.full_name || `User ${phone.slice(-4)}`,
        email: user?.email || undefined,
        phone: phone,
        avatar: user?.user_metadata?.avatar_url || undefined,
        loginProvider: 'Phone',
        role: 'customer',
        addresses: [],
        profileCompleted: isCompleted,
      };

      KeychainStore.setUser(userProfile);
      onSuccess(userProfile, !isCompleted);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-fade-in overflow-y-auto">
      
      {/* Embedded CSS matching user specifications */}
      <style jsx>{`
        .sv-card {
          --bg-0: #0a0d16;
          --bg-1: #0f1422;
          --panel: #131a2b;
          --panel-2: #161e33;
          --line: rgba(255,255,255,0.07);
          --line-soft: rgba(255,255,255,0.04);
          --text-hi: #f2f4fb;
          --text-mid: #9aa3bd;
          --text-low: #5d6584;
          --blue-1: #3d5bff;
          --blue-2: #6f8bff;
          --blue-glow: rgba(61,91,255,0.45);

          position: relative;
          background: linear-gradient(180deg, var(--panel-2) 0%, var(--panel) 100%);
          border: 1px solid var(--line);
          border-radius: 24px;
          padding: 24px 22px 20px;
          box-shadow:
            0 1px 0 rgba(255,255,255,0.06) inset,
            0 30px 60px -20px rgba(0,0,0,0.75),
            0 15px 30px -15px rgba(61,91,255,0.20);
          transform-style: preserve-3d;
          transition: transform 0.15s ease-out, box-shadow 0.3s ease;
          will-change: transform;
          color: var(--text-hi);
          font-family: 'Inter', sans-serif;
          max-height: 90vh;
          overflow-y: auto;
        }

        .sv-card::-webkit-scrollbar {
          display: none;
        }

        .sv-close {
          position: absolute; top: 16px; right: 18px;
          width: 26px; height: 26px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-low); cursor: pointer;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--line-soft);
          font-size: 13px;
          transition: color .2s ease, background .2s ease;
        }
        .sv-close:hover { color: var(--text-hi); background: rgba(255,255,255,0.07); }

        .sv-logo-wrap {
          display: flex; flex-direction: column; align-items: center;
          margin-bottom: 12px;
          transform: translateZ(40px);
        }
        .sv-sphere {
          width: 52px; height: 52px; border-radius: 50%;
          background: radial-gradient(circle at 32% 28%, #9db0ff 0%, var(--blue-2) 22%, var(--blue-1) 55%, #1c2e9e 100%);
          box-shadow:
            inset -4px -8px 14px rgba(0,0,0,0.35),
            inset 3px 4px 8px rgba(255,255,255,0.35),
            0 14px 22px -6px var(--blue-glow);
          display: flex; align-items: center; justify-content: center;
          animation: svFloat 5s ease-in-out infinite;
        }
        .sv-sphere svg { width: 22px; height: 22px; filter: drop-shadow(0 1px 1px rgba(0,0,0,0.4)); }
        .sv-sphere-shadow {
          width: 40px; height: 8px; margin-top: 6px; border-radius: 50%;
          background: radial-gradient(closest-side, rgba(61,91,255,0.35), transparent 75%);
          filter: blur(2px);
          animation: svShadowPulse 5s ease-in-out infinite;
        }
        @keyframes svFloat {
          0%,100%{ transform: translateY(0px); }
          50%{ transform: translateY(-6px); }
        }
        @keyframes svShadowPulse {
          0%,100%{ opacity:1; transform: scaleX(1); }
          50%{ opacity:0.6; transform: scaleX(0.8); }
        }

        .sv-eyebrow {
          text-align: center; font-size: 10px; letter-spacing: 0.18em;
          color: var(--text-mid); font-weight: 600; margin-bottom: 2px;
        }
        .sv-brand {
          text-align: center; font-family: 'Space Grotesk', sans-serif;
          font-size: 20px; font-weight: 700; letter-spacing: 0.01em;
          background: linear-gradient(180deg, #ffffff, #b9c3ea);
          -webkit-background-clip: text; background-clip: text; color: transparent;
          margin-bottom: 16px;
        }

        .sv-tabs {
          display: flex; gap: 4px; padding: 4px;
          background: var(--bg-1);
          border: 1px solid var(--line);
          border-radius: 14px;
          box-shadow: inset 0 2px 6px rgba(0,0,0,0.4);
          margin-bottom: 16px;
        }
        .sv-tab {
          flex: 1; text-align: center; padding: 7px 4px;
          font-size: 11.5px; font-weight: 600; letter-spacing: 0.01em;
          color: var(--text-mid); border-radius: 10px; cursor: pointer;
          transition: all .2s ease;
          border: 1px solid transparent;
        }
        .sv-tab.active {
          color: var(--text-hi);
          background: linear-gradient(180deg, #232c46, #171e33);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.08) inset,
            0 6px 14px -6px rgba(0,0,0,0.6);
          border-color: var(--line);
        }
        .sv-tab:not(.active):hover { color: var(--text-hi); }

        .sv-field { margin-bottom: 12px; }
        .sv-field-row {
          display: flex; justify-content: space-between; align-items: baseline;
          margin-bottom: 5px;
        }
        .sv-label { font-size: 11.5px; font-weight: 600; color: var(--text-mid); }
        .sv-link-sm { font-size: 11px; color: var(--blue-2); text-decoration: none; cursor: pointer; background: none; border: none; }
        .sv-link-sm:hover { color: #a9b9ff; }

        .sv-input-shell {
          display: flex; align-items: center; gap: 8px;
          background: var(--bg-1);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 9.5px 12px;
          box-shadow: inset 0 2px 5px rgba(0,0,0,0.45);
          transition: border-color .2s ease, box-shadow .2s ease;
        }
        .sv-input-shell:focus-within {
          border-color: rgba(111,139,255,0.55);
          box-shadow: inset 0 2px 5px rgba(0,0,0,0.45), 0 0 0 3px rgba(61,91,255,0.15);
        }
        .sv-input-shell svg { width: 15px; height: 15px; color: var(--text-low); flex-shrink: 0; }
        .sv-input-shell input {
          background: none; border: none; outline: none; width: 100%;
          color: var(--text-hi); font-size: 12.5px; font-family: 'Inter', sans-serif;
        }
        .sv-input-shell input::placeholder { color: var(--text-low); }

        .sv-btn-primary {
          width: 100%; margin-top: 4px; padding: 10.5px;
          border: none; border-radius: 13px; cursor: pointer;
          display: flex; align-items: center; justify-center; gap: 8px;
          font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; color: #fff;
          background: linear-gradient(180deg, var(--blue-2) 0%, var(--blue-1) 100%);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.35) inset,
            0 10px 20px -8px var(--blue-glow);
          transition: transform .15s ease, box-shadow .15s ease;
        }
        .sv-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 1px 0 rgba(255,255,255,0.35) inset, 0 14px 24px -6px var(--blue-glow); }
        .sv-btn-primary:active { transform: translateY(0px) scale(0.99); }
        .sv-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .sv-btn-primary svg { width: 14px; height: 14px; }

        .sv-divider {
          display: flex; align-items: center; gap: 10px;
          margin: 14px 0 10px; color: var(--text-low);
          font-size: 9.5px; letter-spacing: 0.12em; font-weight: 600;
        }
        .sv-divider::before, .sv-divider::after {
          content: ""; flex: 1; height: 1px; background: var(--line);
        }

        .sv-btn-social {
          width: 100%; padding: 9px 12px; margin-bottom: 8px;
          border-radius: 12px; cursor: pointer;
          display: flex; align-items: center; justify-center; gap: 8px;
          font-size: 12px; font-weight: 600; color: var(--text-hi);
          background: linear-gradient(180deg, #1b2338, #131a2b);
          border: 1px solid var(--line);
          box-shadow: 0 1px 0 rgba(255,255,255,0.05) inset, 0 6px 14px -8px rgba(0,0,0,0.6);
          transition: transform .15s ease, border-color .2s ease;
        }
        .sv-btn-social:hover { transform: translateY(-1px); border-color: rgba(255,255,255,0.16); }
        .sv-btn-social:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .sv-btn-social svg { width: 15px; height: 15px; }

        .sv-footer-note {
          text-align: center; font-size: 10px; color: var(--text-low);
          margin-top: 12px; line-height: 1.4;
        }
        .sv-footer-note a { color: var(--text-mid); text-decoration: underline; }
      `}</style>

      <div 
        className="w-full max-w-[400px] perspective-[1600px]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="sv-card" id="card" ref={cardRef}>
          
          {/* Close Button */}
          <button onClick={onClose} className="sv-close" title="Close">
            ✕
          </button>

          {/* 3D Logo Sphere */}
          <div className="sv-logo-wrap">
            <div className="sv-sphere">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="white" strokeWidth="1.6"/>
                <circle cx="12" cy="12" r="3" fill="white"/>
              </svg>
            </div>
            <div className="sv-sphere-shadow"></div>
          </div>

          <div className="sv-eyebrow">WELCOME TO</div>
          <div className="sv-brand">SAVVORA</div>

          {/* Auth Tabs */}
          {tab !== 'forgot' && (
            <div className="sv-tabs">
              <div 
                className={`sv-tab ${tab === 'signin' ? 'active' : ''}`}
                onClick={() => { setTab('signin'); setErrorMessage(''); setSuccessMessage(''); }}
              >
                Sign In
              </div>
              <div 
                className={`sv-tab ${tab === 'signup' ? 'active' : ''}`}
                onClick={() => { setTab('signup'); setErrorMessage(''); setSuccessMessage(''); }}
              >
                Register
              </div>
              <div 
                className={`sv-tab ${tab === 'phone' ? 'active' : ''}`}
                onClick={() => { setTab('phone'); setOtpStep('send'); setErrorMessage(''); setSuccessMessage(''); }}
              >
                Phone OTP
              </div>
            </div>
          )}

          {/* Notifications */}
          {errorMessage && (
            <div className="p-3 mb-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 mb-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. SIGN IN FORM */}
          {tab === 'signin' && (
            <div>
              <form onSubmit={handleSignIn}>
                <div className="sv-field">
                  <div className="sv-field-row">
                    <label className="sv-label">Email address</label>
                  </div>
                  <div className="sv-input-shell">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M3 6h18v12H3z"/><path d="m3 7 9 6 9-6"/>
                    </svg>
                    <input 
                      type="email" 
                      required 
                      placeholder="name@example.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="sv-field">
                  <div className="sv-field-row">
                    <label className="sv-label">Password</label>
                    <button
                      type="button"
                      onClick={() => { setTab('forgot'); setErrorMessage(''); setSuccessMessage(''); }}
                      className="sv-link-sm"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="sv-input-shell">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>
                    </svg>
                    <input 
                      type="password" 
                      required 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="sv-btn-primary">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
                    </>
                  ) : (
                    <>
                      Sign in with email
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                    </>
                  )}
                </button>
              </form>

              <div className="sv-divider">OR CONTINUE WITH</div>

              <button 
                type="button" 
                onClick={handleGoogleLogin} 
                disabled={isLoading} 
                className="sv-btn-social"
              >
                {loadingProvider === 'google' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Connecting to Google...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.9 1.5l2.6-2.5C16.9 3.3 14.7 2.3 12 2.3 6.9 2.3 2.7 6.5 2.7 11.6S6.9 21 12 21c6.9 0 8.9-4.9 8.9-7.4 0-.5-.05-.9-.12-1.3H12z"/></svg>
                    Continue with Google
                  </>
                )}
              </button>

              <button 
                type="button" 
                onClick={handleFacebookLogin} 
                disabled={isLoading} 
                className="sv-btn-social"
              >
                {loadingProvider === 'facebook' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Connecting to Facebook...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24"><path fill="#1877F2" d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z"/></svg>
                    Continue with Facebook
                  </>
                )}
              </button>

              <button 
                type="button" 
                onClick={() => { setTab('phone'); setOtpStep('send'); setErrorMessage(''); setSuccessMessage(''); }}
                disabled={isLoading}
                className="sv-btn-social"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="#34c77a" strokeWidth="1.6"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>
                Continue with Phone OTP
              </button>
            </div>
          )}

          {/* 2. REGISTER FORM */}
          {tab === 'signup' && (
            <form onSubmit={handleSignUp}>
              <div className="sv-field">
                <div className="sv-field-row">
                  <label className="sv-label">Full Name</label>
                </div>
                <div className="sv-input-shell">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <circle cx="12" cy="8" r="4"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
                  </svg>
                  <input 
                    type="text" 
                    required 
                    placeholder="Jaswanth Savan" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              <div className="sv-field">
                <div className="sv-field-row">
                  <label className="sv-label">Email address</label>
                </div>
                <div className="sv-input-shell">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M3 6h18v12H3z"/><path d="m3 7 9 6 9-6"/>
                  </svg>
                  <input 
                    type="email" 
                    required 
                    placeholder="name@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="sv-field">
                <div className="sv-field-row">
                  <label className="sv-label">Password</label>
                </div>
                <div className="sv-input-shell">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>
                  </svg>
                  <input 
                    type="password" 
                    required 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="sv-btn-primary">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Registering...
                  </>
                ) : (
                  <>
                    Register Account
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                  </>
                )}
              </button>
            </form>
          )}

          {/* 3. PHONE OTP FORM */}
          {tab === 'phone' && (
            <div>
              {otpStep === 'send' ? (
                <form onSubmit={handleSendOtp}>
                  <div className="sv-field">
                    <div className="sv-field-row">
                      <label className="sv-label">Mobile Phone Number</label>
                    </div>
                    <div className="sv-input-shell">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#34c77a" strokeWidth="1.6"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>
                      <input 
                        type="tel" 
                        required 
                        placeholder="+91 98765 43210" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={isLoading} className="sv-btn-primary">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Sending OTP...
                      </>
                    ) : (
                      <>
                        Send Verification OTP
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp}>
                  <div className="sv-field">
                    <div className="sv-field-row">
                      <label className="sv-label">6-Digit OTP Code</label>
                    </div>
                    <div className="sv-input-shell">
                      <input 
                        type="text" 
                        required 
                        maxLength={6}
                        placeholder="123456" 
                        value={otpToken} 
                        onChange={(e) => setOtpToken(e.target.value)}
                        className="text-center font-mono tracking-widest"
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={isLoading} className="sv-btn-primary">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                      </>
                    ) : (
                      <>
                        Verify OTP & Log In
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOtpStep('send')}
                    className="sv-link-sm w-full text-center mt-3 block"
                  >
                    Change Phone Number
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 4. FORGOT PASSWORD FORM */}
          {tab === 'forgot' && (
            <form onSubmit={handleForgotPassword}>
              <div className="sv-field">
                <div className="sv-field-row">
                  <label className="sv-label">Email address</label>
                </div>
                <div className="sv-input-shell">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M3 6h18v12H3z"/><path d="m3 7 9 6 9-6"/>
                  </svg>
                  <input 
                    type="email" 
                    required 
                    placeholder="name@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="sv-btn-primary">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending Link...
                  </>
                ) : (
                  <>
                    Send Password Reset Link
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setTab('signin'); setErrorMessage(''); setSuccessMessage(''); }}
                className="sv-link-sm w-full text-center mt-3 block"
              >
                Back to Sign In
              </button>
            </form>
          )}

          {/* Footer Note */}
          <div className="sv-footer-note">
            By continuing, you agree to SAVVORA&apos;s <a href="#">Terms &amp; Privacy Policy</a>
          </div>

        </div>
      </div>
    </div>
  );
};
