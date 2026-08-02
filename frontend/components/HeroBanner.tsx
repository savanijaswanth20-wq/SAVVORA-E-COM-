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
      titleSuffix: ' on Flagship Tech & Sound',
      desc: 'Discover Apple Titanium lineup, acoustic studio headphones, and customized luxury keychains with express delivery.',
      primaryBtnText: 'Shop New Arrivals',
      primaryBtnHref: '/products?filter=bestseller',
      accentColor: 'from-[#2563EB] via-[#6366F1] to-[#8B5CF6]',
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
      titleSuffix: ' Acrylic Keychains',
      desc: 'Personalized engraved acrylic keychains, kawaii charms, and custom initial name tags handcrafted in our Studio.',
      primaryBtnText: 'Build Custom Keychain',
      primaryBtnHref: '/products?category=custom-keychains',
      accentColor: 'from-amber-500 via-rose-500 to-indigo-600',
      tagIcon: Sparkles,
      productImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      price: '₹499',
      originalPrice: '₹999',
      rating: 5.0,
    },
    {
      badge: 'APPLE & SAMSUNG ACCESSORIES',
      titlePrefix: 'MagSafe ',
      highlight: 'Leather & Titanium',
      titleSuffix: ' Wireless Gear',
      desc: 'Pro desktop acoustic stands, wireless magnetic chargers, and premium genuine leather wallets for flagship devices.',
      primaryBtnText: 'Explore Accessories',
      primaryBtnHref: '/products?category=phone-accessories',
      accentColor: 'from-emerald-500 via-teal-500 to-blue-600',
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
    <section className="relative rounded-2xl sm:rounded-3xl overflow-hidden my-2 sm:my-3 bg-gray-950 text-white border border-gray-800/80 shadow-xl p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[320px] lg:min-h-[420px]">
      
      {/* Background Animated Aurora Mesh */}
      <div className="aurora-mesh-ambient" />

      {/* Floating Particles Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0d16]/60 via-transparent to-[#0a0d16]/40 pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
        
        {/* Left Column: Text & CTA */}
        <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-4"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-sm">
                <TagIcon className="w-3 h-3 text-amber-400" />
                <span>{slide.badge}</span>
              </div>

              {/* Headline */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                {slide.titlePrefix}
                <span className={`bg-gradient-to-r ${slide.accentColor} bg-clip-text text-transparent`}>
                  {slide.highlight}
                </span>
                {slide.titleSuffix}
              </h1>

              {/* Description — full, no clamp */}
              <p className="text-sm text-gray-300 font-medium max-w-lg leading-relaxed mx-auto lg:mx-0">
                {slide.desc}
              </p>

              {/* Price strip */}
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <span className="text-2xl font-black text-white">{slide.price}</span>
                <span className="text-sm font-semibold text-gray-400 line-through">{slide.originalPrice}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-black uppercase tracking-wider">
                  Save {Math.round((1 - parseInt(slide.price.replace(/[^0-9]/g,'')) / parseInt(slide.originalPrice.replace(/[^0-9]/g,''))) * 100)}%
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(slide.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-300">{slide.rating} · Verified Purchases</span>
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center justify-center lg:justify-start gap-3 flex-wrap pt-1">
                <Link
                  href={slide.primaryBtnHref}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#2563EB] hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 hover:scale-[1.03] active:scale-[0.97] transition-all"
                >
                  <span>{slide.primaryBtnText}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-1 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-extrabold text-xs uppercase tracking-wider backdrop-blur-md transition-all"
                >
                  Explore All
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-4 justify-center lg:justify-start pt-1">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Authentic</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>Express Delivery</span>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

        </div>

        {/* Right Column: Full Product Card */}
        <div className="lg:col-span-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.92, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.92, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[360px]"
            >
              {/* Product Card */}
              <div className="relative rounded-3xl overflow-hidden bg-white/8 backdrop-blur-2xl border border-white/15 shadow-2xl">
                
                {/* Product Image */}
                <div className="relative h-56 sm:h-64 lg:h-72 overflow-hidden bg-gray-900/60">
                  <img
                    src={slide.productImage}
                    alt={slide.badge}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/50 via-transparent to-transparent" />

                  {/* Rating badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-black flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{slide.rating}</span>
                  </div>

                  {/* Sale badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wide">
                    SALE
                  </div>
                </div>

                {/* Card Bottom */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Featured Item</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-white">{slide.price}</span>
                        <span className="text-xs font-semibold text-gray-500 line-through">{slide.originalPrice}</span>
                      </div>
                    </div>
                    <Link
                      href={slide.primaryBtnHref}
                      className="shrink-0 px-4 py-2.5 rounded-xl bg-white text-gray-950 font-black text-xs hover:bg-gray-100 active:scale-95 transition-all shadow-sm"
                    >
                      Buy Now
                    </Link>
                  </div>

                  {/* Stars row */}
                  <div className="flex items-center gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(slide.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-700'}`} />
                    ))}
                    <span className="text-[10px] font-bold text-gray-400 ml-1">{slide.rating} stars</span>
                  </div>
                </div>

              </div>

              {/* Glow effect beneath card */}
              <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-gradient-to-r ${slide.accentColor} opacity-20 blur-2xl rounded-full pointer-events-none`} />
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Slide Navigation Controls */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-8 z-20 flex items-center gap-2">
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/15"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'w-7 bg-blue-500' : 'w-2 bg-white/25 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/15"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </section>
  );
};
