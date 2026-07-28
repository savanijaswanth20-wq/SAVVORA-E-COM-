"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, CheckCircle, ShieldCheck, AlertCircle } from 'lucide-react';
import { SupabaseAuthService } from '@/services/supabase/auth';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await SupabaseAuthService.updateUserPassword(password);
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#111827] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1F2937] rounded-[28px] p-8 border border-[#E5E7EB] dark:border-gray-700 shadow-2xl space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="p-2.5 rounded-full bg-[#F8FAFC] dark:bg-gray-800 text-gray-500 hover:text-black dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">SAVVORA Security</span>
        </div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#2563EB] text-white flex items-center justify-center mx-auto shadow-md shadow-[#2563EB]/20">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-[#111827] dark:text-white tracking-tight">
            Reset Your Password
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Enter your new secure password below.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="space-y-6 text-center">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-sm font-bold flex flex-col items-center gap-2">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              <span>Password Updated Successfully!</span>
            </div>
            <Link
              href="/"
              className="w-full py-3.5 rounded-full bg-[#2563EB] hover:bg-blue-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md block text-center"
            >
              Back to Home & Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">New Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 font-extrabold text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 font-extrabold text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-[#2563EB] hover:bg-blue-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-md disabled:opacity-40 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isLoading ? 'Updating Password...' : 'Set New Password'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
