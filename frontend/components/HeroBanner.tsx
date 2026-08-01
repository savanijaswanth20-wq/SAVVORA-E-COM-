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
    <section className="relative rounded-3xl sm:rounded-[32px] overflow-hidden my-4 sm:my-6 bg-gray-950 text-white border border-gray-800/80 shadow-2xl p-6 sm:p-10 lg:p-12 min-h-[460px] flex items-center justify-center">
      
      {/* Background Animated Aurora Mesh */}
      <div className="aurora-mesh-ambient" />

      {/* Floating Particles Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Text & CTA */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-4"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
                <TagIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>{slide.badge}</span>
              </div>

              {/* Headline */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">
                {slide.titlePrefix}
                <span className={`bg-gradient-to-r ${slide.accentColor} bg-clip-text text-transparent`}>
                  {slide.highlight}
                </span>
                {slide.titleSuffix}
              </h1>

              {/* Description */}
              <p className="text-xs sm:text-base text-gray-300 font-medium max-w-xl leading-relaxed mx-auto lg:mx-0">
                {slide.desc}
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex items-center justify-center lg:justify-start gap-3 sm:gap-4 flex-wrap">
                <Link
                  href={slide.primaryBtnHref}
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#2563EB] hover:bg-blue-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>{slide.primaryBtnText}</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-extrabold text-xs uppercase tracking-wider backdrop-blur-md transition-all"
                >
                  Explore All
                </Link>
              </div>

              {/* Trust Features */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-[11px] font-bold text-gray-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Genuine</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>Express Dispatch</span>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

        </div>

        {/* Right Column: 3D Floating Featured Card */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotate: -2 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-sm"
            >
              {/* Product Card Glass Outer Container */}
              <div className="relative rounded-3xl overflow-hidden bg-white/10 backdrop-blur-2xl border border-white/20 p-4 shadow-2xl shimmer-reflection">
                
                <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden mb-4 bg-gray-900">
                  <img
                    src={slide.productImage}
                    alt={slide.badge}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-black flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{slide.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between px-1">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Featured Item</span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-xl font-black text-white">{slide.price}</span>
                      <span className="text-xs font-semibold text-gray-400 line-through">{slide.originalPrice}</span>
                    </div>
                  </div>

                  <Link
                    href={slide.primaryBtnHref}
                    className="px-4 py-2 rounded-xl bg-white text-gray-950 font-black text-xs hover:bg-gray-200 transition-colors shadow-sm"
                  >
                    Buy Now
                  </Link>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Slide Navigation Controls */}
      <div className="absolute bottom-4 right-6 z-20 hidden sm:flex items-center gap-2">
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all ${
                i === currentSlide ? 'w-6 bg-blue-500' : 'w-2 bg-white/30'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </section>
  );
};
