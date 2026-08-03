"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Clock, Zap, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      badge: 'FLAGSHIP 2026 COLLECTION',
      titlePrefix: 'Up to ',
      highlight: '70% OFF',
      titleSuffix: ' on Flagship Tech',
      desc: 'Discover Apple Titanium lineup, acoustic studio headphones, and handcrafted luxury accessories.',
      primaryBtnText: 'Shop New Arrivals',
      primaryBtnHref: '/products?filter=bestseller',
      accentGradient: 'from-blue-400 via-indigo-300 to-purple-300',
      tagIcon: Flame,
      productImage: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&auto=format&fit=crop&q=80',
      price: '₹14,999',
      originalPrice: '₹24,999',
      rating: 4.9,
    },
    {
      badge: 'SAVVORA STUDIO EXCLUSIVE',
      titlePrefix: 'Custom ',
      highlight: 'Handcrafted',
      titleSuffix: ' Keychains',
      desc: 'Personalized engraved acrylic keychains, kawaii charms, and custom initial name tags.',
      primaryBtnText: 'Build Custom Keychain',
      primaryBtnHref: '/products?category=custom-keychains',
      accentGradient: 'from-amber-300 via-rose-300 to-pink-300',
      tagIcon: Sparkles,
      productImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      price: '₹499',
      originalPrice: '₹999',
      rating: 5.0,
    },
    {
      badge: 'MAGSAFE & APPLE GEAR',
      titlePrefix: 'MagSafe ',
      highlight: 'Leather & Titanium',
      titleSuffix: ' Wireless Gear',
      desc: 'Pro acoustic stands, wireless magnetic chargers, and genuine leather wallets for flagship devices.',
      primaryBtnText: 'Explore Accessories',
      primaryBtnHref: '/products?category=phone-accessories',
      accentGradient: 'from-emerald-300 via-teal-200 to-cyan-300',
      tagIcon: Zap,
      productImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&auto=format&fit=crop&q=80',
      price: '₹2,499',
      originalPrice: '₹4,999',
      rating: 4.8,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];
  const TagIcon = slide.tagIcon;

  return (
    <section className="relative rounded-2xl sm:rounded-3xl overflow-hidden my-2 sm:my-4 bg-[#0a0f1d] text-white border border-gray-800 shadow-2xl p-4 sm:p-6 lg:p-8 min-h-[260px] sm:min-h-[300px]">
      
      {/* Background Cinematic Video Loop */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-35 pointer-events-none filter brightness-90 contrast-110 scale-105 transition-opacity duration-700"
        src="/savvora_promo.mp4"
      />
      
      {/* Dark Overlay Gradient for Optimal Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1d]/95 via-[#0a0f1d]/85 to-[#0a0f1d]/60 pointer-events-none" />

      {/* Glow Ambient Lights */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Layout */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-12 gap-4 sm:gap-8 items-center">
        
        {/* Main Content Area */}
        <div className="col-span-12 sm:col-span-7 lg:col-span-7 space-y-3 sm:space-y-4 text-left">
          
          {/* Top Row: Badge + Carousel Controls */}
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-sm">
              <TagIcon className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="text-white">{slide.badge}</span>
            </div>

            {/* Slide Navigation Controls - Compact Header Alignment */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center border border-white/20 transition-colors active:scale-95"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              
              <div className="flex items-center gap-1">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentSlide ? 'w-5 bg-blue-400' : 'w-1.5 bg-white/40'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center border border-white/20 transition-colors active:scale-95"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="space-y-3"
            >
              {/* Headline - High Contrast White & Bright Gradient */}
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-black tracking-tight leading-tight text-white">
                <span className="text-white">{slide.titlePrefix}</span>
                <span className={`bg-gradient-to-r ${slide.accentGradient} bg-clip-text text-transparent drop-shadow-sm`}>
                  {slide.highlight}
                </span>
                <span className="text-white">{slide.titleSuffix}</span>
              </h1>

              {/* Description - Bright White-Gray */}
              <p className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed max-w-xl">
                {slide.desc}
              </p>

              {/* Price Strip */}
              <div className="flex items-center gap-2.5 pt-0.5">
                <span className="text-lg sm:text-2xl font-black text-white">{slide.price}</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-400 line-through">{slide.originalPrice}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 text-[10px] sm:text-xs font-black uppercase">
                  Save {Math.round((1 - parseInt(slide.price.replace(/[^0-9]/g,'')) / parseInt(slide.originalPrice.replace(/[^0-9]/g,''))) * 100)}%
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 pt-1 flex-wrap">
                <Link
                  href={slide.primaryBtnHref}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/40 border border-blue-400/30 transition-all"
                >
                  <span>{slide.primaryBtnText}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-white text-gray-950 hover:bg-gray-100 active:scale-95 font-extrabold text-xs uppercase tracking-wider shadow-md transition-all"
                >
                  <span>Explore All</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-4 pt-1 text-gray-300 text-[10px] sm:text-xs font-bold">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-gray-200">100% Authentic</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-400">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-gray-200">Express Delivery</span>
                </div>
                <div className="hidden xs:flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400 shrink-0" />
                  <span className="text-gray-200">{slide.rating} Rating</span>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

        </div>

        {/* Right Column Showcase Product Card - Desktop & Tablet */}
        <div className="hidden sm:flex col-span-5 lg:col-span-5 items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-[280px]"
            >
              <div className="relative rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 p-3 shadow-2xl">
                <div className="relative h-44 rounded-xl overflow-hidden mb-2 bg-gray-900">
                  <img
                    src={slide.productImage}
                    alt={slide.badge}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 border border-white/20 text-white text-[10px] font-black flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{slide.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest block">Featured Item</span>
                    <span className="text-base font-black text-white">{slide.price}</span>
                  </div>
                  <Link
                    href={slide.primaryBtnHref}
                    className="px-3 py-1.5 rounded-lg bg-white text-gray-950 font-black text-xs hover:bg-gray-100 transition-colors shadow-sm"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </section>
  );
};
