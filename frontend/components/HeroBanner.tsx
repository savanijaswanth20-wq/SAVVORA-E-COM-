"use client";

import React from 'react';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

export const HeroBanner: React.FC = () => {
  return (
    <section className="relative rounded-[28px] overflow-hidden my-6 bg-[#F8FAFC] dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 p-8 sm:p-14 shadow-sm flex items-center justify-center text-center">
      
      {/* Background Soft Glow Orbs */}
      <div className="absolute -top-10 -right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Subtitle Badge */}
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> Premium Shopping Experience
        </span>

        {/* Massive Headline */}
        <h1 className="text-4xl sm:text-6xl font-black text-[#111827] dark:text-white tracking-tight leading-tight">
          Up to 70% OFF on Electronics
        </h1>

        {/* Small Description */}
        <p className="text-sm sm:text-base text-gray-500 font-medium max-w-xl mx-auto">
          Explore smartphones, mechanical keyboards, noise-canceling headphones, and luxury handcrafted accessories.
        </p>

        {/* Shop Now Primary Button */}
        <div className="pt-2">
          <Link
            href="#products"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-[#111827] hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-black/10 hover:scale-105 transition-all"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-4 h-4 text-[#2563EB]" />
          </Link>
        </div>

      </div>
    </section>
  );
};
