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
    <section className="my-12 glass-floating rounded-4xl p-8 border border-rose-300 relative overflow-hidden bg-gradient-to-r from-pink-100/80 via-white to-purple-100/80 shadow-xl shadow-pink-500/10">
      
      {/* Background Decorative Sparkles */}
      <div className="absolute top-3 right-6 text-pink-300 opacity-40 font-bold text-6xl select-none">
        🌸
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Left Side Details */}
        <div className="space-y-2 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-black uppercase tracking-wider shadow-sm">
            <Zap className="w-4 h-4 fill-white" /> Flash Sale Active
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Save 20% Off Handmade Keychains
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-medium">
            Use code <span className="font-mono font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">KAWAII20</span> at checkout. Express crafting included!
          </p>
        </div>

        {/* Center Live Countdown Timer */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 glass-apple px-5 py-3 rounded-3xl border border-pink-200 shadow-sm">
            <Clock className="w-5 h-5 text-rose-500 animate-pulse" />
            <div className="flex items-center gap-1 font-mono font-black text-lg text-gray-900">
              <span className="w-8 text-center bg-white px-1.5 py-1 rounded-xl shadow-xs">{String(timeLeft.hours).padStart(2, '0')}</span>:
              <span className="w-8 text-center bg-white px-1.5 py-1 rounded-xl shadow-xs">{String(timeLeft.minutes).padStart(2, '0')}</span>:
              <span className="w-8 text-center bg-white px-1.5 py-1 rounded-xl shadow-xs">{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyCode}
            className="px-5 py-3.5 rounded-2xl glass-apple hover:bg-white text-gray-800 font-bold text-xs uppercase tracking-wider border border-pink-300 flex items-center gap-2 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" /> Code Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-pink-500" /> Copy Coupon
              </>
            )}
          </button>

          <Link
            href="/cart"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-pink-500/20 hover:scale-105 transition-all"
          >
            Claim Offer
          </Link>
        </div>

      </div>
    </section>
  );
};
