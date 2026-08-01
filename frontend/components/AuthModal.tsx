"use client";

import React, { useState, useRef, useCallback, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeychainStore, UserProfile } from '../types/store';
import { SupabaseAuthService } from '../services/supabase/auth';
import {
  Loader2, AlertCircle, CheckCircle, Mail, Lock, User,
  Smartphone, Eye, EyeOff, ArrowRight, ShieldCheck, X,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile, isNewUser?: boolean) => void;
}

type Tab = 'signin' | 'signup' | 'phone' | 'forgot';
type OtpStep = 'send' | 'verify';

/* ─────────────────────────────────────────────
   Particle data (generated once, stable)
───────────────────────────────────────────── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: 2 + (i % 3),
  left: `${5 + (i * 5.3) % 90}%`,
  bottom: `${(i * 7.1) % 40}%`,
  duration: 8 + (i % 7) * 1.5,
  delay: (i * 0.6) % 6,
  opacity: 0.3 + (i % 4) * 0.12,
}));

/* ─────────────────────────────────────────────
   Floating-label input component
───────────────────────────────────────────── */
interface FloatingInputProps {
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  suffix?: React.ReactNode;
  autoComplete?: string;
  'aria-describedby'?: string;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  id, type, label, value, onChange, icon, required,
  placeholder, maxLength, inputMode, suffix, autoComplete,
  'aria-describedby': ariaDescribedBy,
}) => {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value.length > 0;

  return (
    <div className="auth-field-wrap">
      <div
        className="auth-input-shell"
        style={{ paddingTop: isFloating ? '14px' : '8px', paddingBottom: '5px', position: 'relative' }}
      >
        {/* Icon */}
        <span style={{ color: focused ? 'rgba(139,148,255,0.9)' : 'rgba(93,101,132,0.8)', flexShrink: 0, transition: 'color 0.2s ease', display: 'flex', alignItems: 'center' }}>
          {icon}
        </span>

        {/* Floating label */}
        <label
          htmlFor={id}
          className={`auth-floating-label${isFloating ? ' floating' : ''}`}
          style={{ left: isFloating ? '10px' : '34px' }}
        >
          {label}
        </label>

        {/* Input */}
        <input
          id={id}
          type={type}
          required={required}
          value={value}
          placeholder={focused ? (placeholder || '') : ''}
          maxLength={maxLength}
          inputMode={inputMode}
          autoComplete={autoComplete}
          aria-label={label}
          aria-describedby={ariaDescribedBy}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          style={{ paddingTop: '2px' }}
        />

        {/* Suffix (e.g. password toggle) */}
        {suffix && (
          <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Password input (with visibility toggle)
───────────────────────────────────────────── */
const PasswordInput: React.FC<{
  id: string; label: string; value: string;
  onChange: (v: string) => void; required?: boolean;
}> = ({ id, label, value, onChange, required }) => {
  const [show, setShow] = useState(false);
  return (
    <FloatingInput
      id={id}
      type={show ? 'text' : 'password'}
      label={label}
      value={value}
      onChange={onChange}
      required={required}
      placeholder="••••••••"
      autoComplete={id === 'pw-signin' ? 'current-password' : 'new-password'}
      icon={<Lock size={15} />}
      suffix={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(93,101,132,0.8)', padding: '2px',
            display: 'flex', alignItems: 'center',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(139,148,255,0.9)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(93,101,132,0.8)')}
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      }
    />
  );
};

/* ─────────────────────────────────────────────
   Tab pill (sliding indicator)
───────────────────────────────────────────── */
const TABS: { id: Tab; label: string }[] = [
  { id: 'signin', label: 'Sign In' },
  { id: 'signup', label: 'Register' },
  { id: 'phone', label: 'Phone OTP' },
];

const TabBar: React.FC<{
  activeTab: Tab;
  onSelect: (t: Tab) => void;
}> = ({ activeTab, onSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({ left: 4, width: 0 });

  const updatePill = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const idx = TABS.findIndex((t) => t.id === activeTab);
    const tabEls = container.querySelectorAll<HTMLButtonElement>('.auth-tab');
    const el = tabEls[idx];
    if (!el) return;
    setPillStyle({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeTab]);

  useLayoutEffect(() => {
    updatePill();
  }, [updatePill]);

  return (
    <div className="auth-tabs" ref={containerRef} role="tablist" aria-label="Authentication method">
      {/* Sliding pill */}
      <div
        className="auth-tab-pill"
        style={{
          left: pillStyle.left,
          width: pillStyle.width,
          height: `calc(100% - 8px)`,
        }}
        aria-hidden="true"
      />
      {TABS.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={activeTab === t.id}
          aria-controls={`auth-panel-${t.id}`}
          className={`auth-tab${activeTab === t.id ? ' active' : ''}`}
          onClick={() => onSelect(t.id)}
          type="button"
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  /* ── State (all preserved from original) ── */
  const [tab, setTab] = useState<Tab>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [otpStep, setOtpStep] = useState<OtpStep>('send');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'facebook' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  /* ── 3D Tilt ── */
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    cardRef.current.style.transform = `perspective(1400px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateZ(0)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1400px) rotateY(0deg) rotateX(0deg)';
  };

  /* ── Tab helper ── */
  const switchTab = (t: Tab) => {
    setTab(t);
    setErrorMessage('');
    setSuccessMessage('');
    if (t === 'phone') setOtpStep('send');
  };

  /* ─────────────────────────────────────────
     Auth Handlers — PRESERVED EXACTLY
  ───────────────────────────────────────── */
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
      let user: any = null;
      try {
        const data = await SupabaseAuthService.signIn(email, password);
        user = data.user;
      } catch (err: any) {
        console.warn("Supabase Auth API notice, creating instant session:", err);
      }

      const existingUser = KeychainStore.getUser();
      const isCompleted = existingUser?.profileCompleted ?? (user?.user_metadata?.profile_completed || false);

      const userProfile: UserProfile = {
        id: user?.id || `usr-${Date.now()}`,
        fullName: user?.user_metadata?.full_name || user?.user_metadata?.name || (email ? email.split('@')[0] : 'Customer'),
        email: user?.email || email || 'customer@savvora.com',
        phone: user?.phone || undefined,
        avatar: user?.user_metadata?.avatar_url || undefined,
        loginProvider: 'Email',
        role: 'customer',
        addresses: existingUser?.addresses || [],
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

  /* ─────────────────────────────────────────
     Render
  ───────────────────────────────────────── */
  if (!isOpen) return null;

  /* Framer Motion variants */
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
    exit:   { opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
  };
  const cardVariants = {
    hidden:  { opacity: 0, scale: 0.91, y: 24 },
    visible: { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] } },
    exit:    { opacity: 0, scale: 0.95, y: 16, transition: { duration: 0.22, ease: 'easeIn' } },
  };
  const panelVariants = {
    hidden:  { opacity: 0, x: 14 },
    visible: { opacity: 1, x: 0,  transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } },
    exit:    { opacity: 0, x: -12, transition: { duration: 0.18, ease: 'easeIn' } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="auth-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="dialog"
          aria-modal="true"
          aria-label="SAVVORA Authentication"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          {/* ── Aurora Background ── */}
          <div className="auth-aurora-bg" aria-hidden="true">
            <div className="auth-aurora-mesh" />
            <div className="auth-orb auth-orb-1" />
            <div className="auth-orb auth-orb-2" />
            <div className="auth-orb auth-orb-3" />

            {/* Floating particles */}
            {PARTICLES.map((p) => (
              <div
                key={p.id}
                className="auth-particle"
                style={{
                  width: p.size,
                  height: p.size,
                  left: p.left,
                  bottom: p.bottom,
                  opacity: p.opacity,
                  animationDuration: `${p.duration}s`,
                  animationDelay: `${p.delay}s`,
                }}
              />
            ))}
          </div>

          {/* ── Card wrapper (3D tilt zone) ── */}
          <motion.div
            style={{ width: '100%', maxWidth: 360, position: 'relative', zIndex: 10 }}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div
              className="auth-glass-card"
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ padding: '16px 16px 12px' }}
            >
              {/* ── Close button ── */}
              <button
                onClick={onClose}
                aria-label="Close authentication dialog"
                style={{
                  position: 'absolute', top: 12, right: 12,
                  width: 24, height: 24, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  color: 'rgba(93,101,132,0.9)',
                  cursor: 'pointer',
                  transition: 'color 0.2s, background 0.2s',
                  zIndex: 10,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#f2f4fb'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(93,101,132,0.9)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              >
                <X size={13} />
              </button>

              {/* ── Logo & Brand ── */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 10 }}>
                {/* 3D sphere */}
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: 'radial-gradient(circle at 32% 28%, #c4b5fd 0%, #8b5cf6 28%, #6366f1 58%, #3730a3 100%)',
                  boxShadow: 'inset -3px -6px 10px rgba(0,0,0,0.35), inset 2px 3px 6px rgba(255,255,255,0.3), 0 10px 20px -4px rgba(99,102,241,0.65)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'orbFloat 5s ease-in-out infinite',
                  marginBottom: 4,
                }}>
                  <ShieldCheck size={17} color="rgba(255,255,255,0.92)" strokeWidth={1.7} />
                </div>
                {/* Sphere shadow */}
                <div style={{
                  width: 26, height: 4, borderRadius: '50%',
                  background: 'radial-gradient(closest-side, rgba(99,102,241,0.4), transparent 80%)',
                  filter: 'blur(2px)',
                  marginBottom: 6,
                  animation: 'orbPulse 5s ease-in-out infinite',
                }} />

                <p style={{ fontSize: 9, letterSpacing: '0.18em', color: 'rgba(154,163,189,0.75)', fontWeight: 600, marginBottom: 2 }}>
                  WELCOME TO
                </p>
                <h1 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 18, fontWeight: 800, letterSpacing: '0.01em',
                  background: 'linear-gradient(160deg, #ffffff 0%, #c7d2fe 60%, #a5b4fc 100%)',
                  WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
                  margin: 0,
                }}>
                  SAVVORA
                </h1>
              </div>

              {/* ── Tabs (hidden on forgot) ── */}
              {tab !== 'forgot' && (
                <TabBar activeTab={tab} onSelect={switchTab} />
              )}

              {/* ── Notifications ── */}
              <AnimatePresence mode="wait">
                {errorMessage && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22 }}
                    className="auth-alert-error"
                    role="alert"
                    aria-live="assertive"
                  >
                    <AlertCircle size={15} style={{ flexShrink: 0 }} />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}

                {successMessage && !errorMessage && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22 }}
                    className="auth-alert-success"
                    role="status"
                    aria-live="polite"
                  >
                    <CheckCircle size={15} style={{ flexShrink: 0 }} />
                    <span>{successMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Panel content ── */}
              <AnimatePresence mode="wait">

                {/* ══════════ 1. SIGN IN ══════════ */}
                {tab === 'signin' && (
                  <motion.div
                    key="signin"
                    id="auth-panel-signin"
                    role="tabpanel"
                    aria-labelledby="tab-signin"
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <form onSubmit={handleSignIn} noValidate>
                      <FloatingInput
                        id="email-signin"
                        type="email"
                        label="Email address"
                        value={email}
                        onChange={setEmail}
                        icon={<Mail size={15} />}
                        required
                        placeholder="name@example.com"
                        autoComplete="email"
                      />
                      <div style={{ position: 'relative' }}>
                        <PasswordInput id="pw-signin" label="Password" value={password} onChange={setPassword} required />
                        <button
                          type="button"
                          onClick={() => switchTab('forgot')}
                          className="auth-link-sm"
                          style={{ position: 'absolute', top: -16, right: 0, fontSize: 10.5 }}
                        >
                          Forgot?
                        </button>
                      </div>

                      <button type="submit" disabled={isLoading} className="auth-btn-primary">
                        {isLoading ? (
                          <><Loader2 size={14} className="animate-spin" /> Signing in…</>
                        ) : (
                          <><span>Sign in with Email</span><ArrowRight size={14} /></>
                        )}
                      </button>
                    </form>

                    {/* Social divider */}
                    <div className="auth-divider">OR CONTINUE WITH</div>

                    {/* Google & Facebook side-by-side grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 6 }}>
                      <button type="button" onClick={handleGoogleLogin} disabled={isLoading} className="auth-btn-social">
                        {loadingProvider === 'google' ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.9 1.5l2.6-2.5C16.9 3.3 14.7 2.3 12 2.3 6.9 2.3 2.7 6.5 2.7 11.6S6.9 21 12 21c6.9 0 8.9-4.9 8.9-7.4 0-.5-.05-.9-.12-1.3H12z"/>
                            </svg>
                            <span>Google</span>
                          </>
                        )}
                      </button>

                      <button type="button" onClick={handleFacebookLogin} disabled={isLoading} className="auth-btn-social">
                        {loadingProvider === 'facebook' ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                              <path fill="#1877F2" d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z"/>
                            </svg>
                            <span>Facebook</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Phone OTP */}
                    <button
                      type="button"
                      onClick={() => switchTab('phone')}
                      disabled={isLoading}
                      className="auth-btn-social"
                      style={{ marginBottom: 6 }}
                    >
                      <Smartphone size={14} style={{ color: '#34d399' }} />
                      <span>Continue with Phone OTP</span>
                    </button>

                    <div className="auth-footer-note">
                      Don&apos;t have an account?{' '}
                      <button className="auth-link-sm" type="button" onClick={() => switchTab('signup')}>
                        Register here
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ══════════ 2. REGISTER ══════════ */}
                {tab === 'signup' && (
                  <motion.div
                    key="signup"
                    id="auth-panel-signup"
                    role="tabpanel"
                    aria-labelledby="tab-signup"
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <form onSubmit={handleSignUp} noValidate>
                      <FloatingInput
                        id="name-signup"
                        type="text"
                        label="Full Name"
                        value={fullName}
                        onChange={setFullName}
                        icon={<User size={15} />}
                        required
                        placeholder="Jaswanth Savan"
                        autoComplete="name"
                      />
                      <FloatingInput
                        id="email-signup"
                        type="email"
                        label="Email address"
                        value={email}
                        onChange={setEmail}
                        icon={<Mail size={15} />}
                        required
                        placeholder="name@example.com"
                        autoComplete="email"
                      />
                      <PasswordInput id="pw-signup" label="Create Password" value={password} onChange={setPassword} required />

                      <button type="submit" disabled={isLoading} className="auth-btn-primary">
                        {isLoading ? (
                          <><Loader2 size={14} className="animate-spin" /> Registering…</>
                        ) : (
                          <><span>Create Account</span><ArrowRight size={14} /></>
                        )}
                      </button>
                    </form>
                    <div className="auth-footer-note">
                      Already have an account?{' '}
                      <button className="auth-link-sm" type="button" onClick={() => switchTab('signin')}>
                        Sign in
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ══════════ 3. PHONE OTP ══════════ */}
                {tab === 'phone' && (
                  <motion.div
                    key="phone"
                    id="auth-panel-phone"
                    role="tabpanel"
                    aria-labelledby="tab-phone"
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <AnimatePresence mode="wait">
                      {otpStep === 'send' ? (
                        <motion.form
                          key="otp-send"
                          onSubmit={handleSendOtp}
                          noValidate
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0, transition: { duration: 0.25, ease: [0.16,1,0.3,1] } }}
                          exit={{ opacity: 0, x: -16, transition: { duration: 0.18 } }}
                        >
                          <FloatingInput
                            id="phone-input"
                            type="tel"
                            label="Mobile Phone Number"
                            value={phone}
                            onChange={setPhone}
                            icon={<Smartphone size={15} style={{ color: '#34d399' }} />}
                            required
                            placeholder="+91 98765 43210"
                            inputMode="tel"
                            autoComplete="tel"
                          />
                          <button type="submit" disabled={isLoading} className="auth-btn-primary">
                            {isLoading ? (
                              <><Loader2 size={14} className="animate-spin" /> Sending OTP…</>
                            ) : (
                              <><span>Send Verification OTP</span><ArrowRight size={14} /></>
                            )}
                          </button>
                        </motion.form>
                      ) : (
                        <motion.form
                          key="otp-verify"
                          onSubmit={handleVerifyOtp}
                          noValidate
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0, transition: { duration: 0.25, ease: [0.16,1,0.3,1] } }}
                          exit={{ opacity: 0, x: -16, transition: { duration: 0.18 } }}
                        >
                          {/* OTP sent hint */}
                          <div style={{
                            padding: '8px 12px', marginBottom: 14, borderRadius: 10,
                            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                            fontSize: 11.5, color: 'rgba(165,180,252,0.9)', fontWeight: 500,
                          }}>
                            📱 OTP sent to <strong>{phone}</strong>
                          </div>

                          {/* OTP boxes */}
                          <FloatingInput
                            id="otp-token"
                            type="text"
                            label="6-Digit OTP Code"
                            value={otpToken}
                            onChange={setOtpToken}
                            icon={<ShieldCheck size={15} style={{ color: '#34d399' }} />}
                            required
                            maxLength={6}
                            placeholder="123456"
                            inputMode="numeric"
                          />

                          <button type="submit" disabled={isLoading} className="auth-btn-primary">
                            {isLoading ? (
                              <><Loader2 size={14} className="animate-spin" /> Verifying…</>
                            ) : (
                              <><span>Verify OTP &amp; Log In</span><ArrowRight size={14} /></>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => { setOtpStep('send'); setOtpToken(''); setSuccessMessage(''); }}
                            className="auth-link-sm"
                            style={{ width: '100%', textAlign: 'center', display: 'block', marginTop: 12 }}
                          >
                            ← Change Phone Number
                          </button>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* ══════════ 4. FORGOT PASSWORD ══════════ */}
                {tab === 'forgot' && (
                  <motion.div
                    key="forgot"
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {/* Forgot header */}
                    <div style={{ textAlign: 'center', marginBottom: 18 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: 'rgba(99,102,241,0.12)',
                        border: '1px solid rgba(99,102,241,0.25)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: 8,
                      }}>
                        <Mail size={18} style={{ color: 'rgba(139,148,255,0.9)' }} />
                      </div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#f2f4fb', margin: '0 0 4px' }}>
                        Reset Password
                      </p>
                      <p style={{ fontSize: 11.5, color: 'rgba(154,163,189,0.75)', margin: 0 }}>
                        Enter your email to receive a reset link.
                      </p>
                    </div>

                    <form onSubmit={handleForgotPassword} noValidate>
                      <FloatingInput
                        id="email-forgot"
                        type="email"
                        label="Email address"
                        value={email}
                        onChange={setEmail}
                        icon={<Mail size={15} />}
                        required
                        placeholder="name@example.com"
                        autoComplete="email"
                      />
                      <button type="submit" disabled={isLoading} className="auth-btn-primary">
                        {isLoading ? (
                          <><Loader2 size={14} className="animate-spin" /> Sending Link…</>
                        ) : (
                          <><span>Send Reset Link</span><ArrowRight size={14} /></>
                        )}
                      </button>
                    </form>

                    <button
                      type="button"
                      onClick={() => switchTab('signin')}
                      className="auth-link-sm"
                      style={{ width: '100%', textAlign: 'center', display: 'block', marginTop: 14 }}
                    >
                      ← Back to Sign In
                    </button>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* ── Footer ── */}
              <div className="auth-footer-note" style={{ marginTop: 8 }}>
                By continuing, you agree to SAVVORA&apos;s{' '}
                <a href="#" tabIndex={0}>Terms &amp; Privacy Policy</a>
              </div>

              {/* ── Trust badges ── */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 10, marginTop: 8, paddingTop: 8,
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}>
                {[
                  { icon: '🔒', label: '256-bit SSL' },
                  { icon: '🛡️', label: 'Supabase Auth' },
                  { icon: '✨', label: 'Zero-data logging' },
                ].map((b) => (
                  <div key={b.label} style={{
                    display: 'flex', alignItems: 'center', gap: 3,
                    fontSize: 9, color: 'rgba(93,101,132,0.8)', fontWeight: 600, letterSpacing: '0.02em',
                  }}>
                    <span style={{ fontSize: 10 }}>{b.icon}</span>
                    {b.label}
                  </div>
                ))}
              </div>

            </div>{/* end auth-glass-card */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
