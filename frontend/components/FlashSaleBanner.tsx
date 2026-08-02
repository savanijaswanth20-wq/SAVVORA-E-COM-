"use client";

import React, { useState, useEffect } from 'react';
import { Zap, Copy, Check, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const FlashSaleBanner: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 42, seconds: 18 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 5, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('KAWAII20');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="my-3 sm:my-5 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 max-h-[200px] border border-gray-200 dark:border-gray-800 relative overflow-hidden bg-white dark:bg-[#131a2b] shadow-xs flex items-center">

      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 w-full relative z-10">
        
        {/* Left Side Details */}
        <div className="space-y-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
            <Zap className="w-3 h-3 fill-white" /> Flash Sale Active
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Save 20% Off Handmade Keychains
          </h2>
          <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">
            Use code <span className="font-mono font-black text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-900">KAWAII20</span> at checkout.
          </p>
        </div>

        {/* Center Live Countdown Timer */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 glass-apple px-3.5 py-1.5 rounded-2xl border border-pink-200 shadow-xs">
            <Clock className="w-4 h-4 text-rose-500 animate-pulse" />
            <div className="flex items-center gap-1 font-mono font-black text-sm text-gray-900 dark:text-white">
              <span className="w-6 text-center bg-white dark:bg-gray-800 px-1 py-0.5 rounded-lg shadow-xs">{String(timeLeft.hours).padStart(2, '0')}</span>:
              <span className="w-6 text-center bg-white dark:bg-gray-800 px-1 py-0.5 rounded-lg shadow-xs">{String(timeLeft.minutes).padStart(2, '0')}</span>:
              <span className="w-6 text-center bg-white dark:bg-gray-800 px-1 py-0.5 rounded-lg shadow-xs">{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="px-4 py-2 rounded-xl glass-apple hover:bg-white text-gray-800 dark:text-white font-bold text-xs uppercase tracking-wider border border-pink-300 flex items-center gap-1.5 transition-all min-h-[38px]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-pink-500" /> Coupon
              </>
            )}
          </button>

          <Link
            href="/cart"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-pink-500/20 hover:scale-105 transition-all min-h-[38px] flex items-center justify-center"
          >
            Claim
          </Link>
        </div>

      </div>
    </section>
  );
};
