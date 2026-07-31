"use client";

import React from 'react';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

export const HeroBanner: React.FC = () => {
  return (
    <section className="relative rounded-[20px] sm:rounded-[28px] overflow-hidden my-4 sm:my-6 bg-gradient-to-br from-blue-50/80 via-sky-50/50 to-slate-50 dark:from-slate-900 dark:via-blue-950/40 dark:to-gray-900 border border-blue-100 dark:border-blue-900/30 p-5 sm:p-10 lg:p-14 text-center shadow-sm">
      
      {/* Background Soft Glow Orbs */}
      <div className="absolute -top-12 -right-12 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-sky-300/25 rounded-full blur-3xl pointer-events-none" />
      
      {/* Backdrop Dots Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.06] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto space-y-3.5 sm:space-y-5 z-10">
        
        {/* Subtitle Badge */}
        <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-200/60 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-xs">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" /> Premium Shopping Experience
        </span>

        {/* Headline */}
        <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black text-[#111827] dark:text-white tracking-tight leading-tight">
          Up to <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">70% OFF</span> on Electronics
        </h1>

        {/* Small Description */}
        <p className="text-xs sm:text-base text-gray-600 dark:text-gray-300 font-medium max-w-xl mx-auto leading-relaxed">
          Explore smartphones, mechanical keyboards, noise-canceling headphones, and luxury handcrafted accessories.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
          <Link
            href="#products"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#111827] dark:bg-apple-blue hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-900/10 min-h-[44px] hover:scale-[1.02] transition-all"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-4 h-4 text-[#2563EB] dark:text-white" />
          </Link>
          <Link
            href="#products"
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white text-[#111827] dark:text-white border border-[#E5E7EB] dark:border-gray-700 font-extrabold text-xs uppercase tracking-wider shadow-xs min-h-[44px] transition-all"
          >
            Explore Collection
          </Link>
        </div>

      </div>
    </section>
  );
};
