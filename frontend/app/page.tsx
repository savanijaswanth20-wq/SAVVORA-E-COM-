"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { CategoryBar } from '../components/CategoryBar';
import { HeroBanner } from '../components/HeroBanner';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { CartDrawer } from '../components/CartDrawer';
import { AIRecommendationModal } from '../components/AIRecommendationModal';
import { FlashSaleBanner } from '../components/FlashSaleBanner';
import { KeychainStore, KeychainProduct, subscribeToStore, UserProfile } from '../types/store';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw, Bot, User, CheckCircle2, History, ShoppingBag } from 'lucide-react';

import { MegaMenu } from '../components/MegaMenu';

export default function HomePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [products, setProducts] = useState<KeychainProduct[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<KeychainProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<KeychainProduct | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

  const loadData = () => {
    setUser(KeychainStore.getUser());
    setProducts(KeychainStore.getProducts());
    setRecentlyViewed(KeychainStore.getRecentlyViewed());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToStore(loadData);
    return () => unsubscribe();
  }, []);

  const handleProductQuickView = (prod: KeychainProduct) => {
    KeychainStore.addRecentlyViewed(prod);
    setQuickViewProduct(prod);
  };

  // Filter products for personalized recommendation section
  const recommendedProducts = user?.preferences?.length
    ? products.filter((p) => user.preferences?.includes(p.categoryId) || user.preferences?.includes(p.category.toLowerCase()))
    : products.slice(0, 3);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedCategory === 'new') return matchesSearch;
    if (selectedCategory === 'bestseller') return matchesSearch && (p.badge === 'BESTSELLER' || p.rating >= 4.9);
    if (selectedCategory === 'electronics') return matchesSearch && p.categoryId === 'electronics';
    if (selectedCategory === 'fashion') return matchesSearch && (p.categoryId === 'custom-name' || p.categoryId === 'accessories');
    if (selectedCategory === 'home') return matchesSearch && p.categoryId === 'accessories';
    return matchesSearch;
  });

  const firstName = user ? user.fullName.split(' ')[0] : '';

  return (
    <div className="min-h-screen bg-white dark:bg-[#111827] text-[#111827] dark:text-white font-sans pb-16 transition-colors duration-300">
      
      <Navbar
        onOpenCartDrawer={() => setIsCartOpen(true)}
        onSearchChange={(q) => setSearchQuery(q)}
      />

      {/* Multi-Column Mega Menu Navigation Bar */}
      <MegaMenu
        onSelectCategory={(catId, subCat) => {
          setSelectedCategory(catId);
          if (subCat) {
            setSearchQuery(subCat);
          }
        }}
      />

      <main className="max-w-[1200px] mx-auto px-4 lg:px-8">
        
        {/* Personalized Greeting Hero Banner for Logged-In User */}
        {user && (
          <div className="my-6 p-6 md:p-8 rounded-[32px] bg-gradient-to-r from-blue-900 via-[#1E3A8A] to-[#111827] text-white shadow-2xl relative overflow-hidden border border-blue-800/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5 z-10">
              <div className="relative">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.fullName} className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-500/40 shadow-md" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-black ring-4 ring-blue-500/40 shadow-md">
                    {firstName.charAt(0).toUpperCase()}
                  </div>
                )}
                {user.profileCompleted && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 absolute -bottom-1 -right-1 bg-black rounded-full" />
                )}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-200">
                    Amazon / Flipkart-Style Feed
                  </span>
                  {!user.profileCompleted && (
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/30 border border-amber-400/30 text-amber-200">
                      Profile Incomplete
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                  👋 Welcome back, {firstName}!
                </h1>
                <p className="text-xs md:text-sm text-blue-200 font-medium">
                  Discover today's best deals and continue shopping.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 z-10 w-full md:w-auto">
              <a
                href="#products"
                className="px-6 py-3.5 rounded-2xl bg-white text-blue-900 font-black text-xs uppercase tracking-wider shadow-lg hover:bg-blue-50 transition-all text-center flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-blue-600" /> [ Continue Shopping ]
              </a>
            </div>
          </div>
        )}

        {/* Category Pill Navigation Bar (44px pills) */}
        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => setSelectedCategory(catId)}
        />

        {/* Hero Banner */}
        <HeroBanner />

        {/* Flash Sale Banner (Active deals) */}
        <FlashSaleBanner />

        {/* Brand Marquee */}
        <section className="py-6 border-y border-[#E5E7EB] dark:border-gray-800 my-8 flex items-center justify-around flex-wrap gap-6 text-xs font-extrabold tracking-widest text-gray-400 uppercase">
          <span>Apple</span><span>Stripe</span><span>Nike</span><span>Sony</span><span>Bang & Olufsen</span><span>Leica</span><span>Keychron</span>
        </section>

        {/* Recommended For You Section for Authenticated Users */}
        {user && recommendedProducts.length > 0 && (
          <section className="space-y-6 my-10 p-6 rounded-[28px] bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-[#2563EB] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Personalized Selection
                </span>
                <h2 className="text-2xl font-black text-[#111827] dark:text-white tracking-tight">
                  Recommended For {user.fullName.split(' ')[0]} ({recommendedProducts.length})
                </h2>
              </div>
              <span className="text-xs font-bold text-gray-400">Based on your preferences</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedProducts.map((p) => (
                <ProductCard
                  key={`rec-${p.id}`}
                  product={p}
                  onQuickView={(prod) => handleProductQuickView(prod)}
                  onAddToCartSuccess={() => setIsCartOpen(true)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Recently Viewed Products Section */}
        {recentlyViewed.length > 0 && (
          <section className="space-y-6 my-10 p-6 rounded-[28px] bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-4 h-4" /> Browsing History
                </span>
                <h2 className="text-2xl font-black text-[#111827] dark:text-white tracking-tight">
                  Recently Viewed Items ({recentlyViewed.length})
                </h2>
              </div>
              <span className="text-xs font-bold text-gray-400">Items you checked recently</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentlyViewed.map((p) => (
                <ProductCard
                  key={`recent-${p.id}`}
                  product={p}
                  onQuickView={(prod) => handleProductQuickView(prod)}
                  onAddToCartSuccess={() => setIsCartOpen(true)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Product Cards Grid */}
        <section id="products" className="space-y-6 my-10">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold text-[#2563EB] uppercase tracking-wider">Curated Storefront</span>
              <h2 className="text-3xl font-black text-[#111827] dark:text-white tracking-tight">
                Featured Lineup ({filteredProducts.length})
              </h2>
            </div>

            <button
              onClick={() => setIsAIOpen(true)}
              className="px-4 py-2 rounded-full bg-[#2563EB]/10 text-[#2563EB] font-extrabold text-xs flex items-center gap-2 hover:bg-[#2563EB]/20 transition-colors"
            >
              <Bot className="w-4 h-4" /> Ask AI Stylist
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={(prod) => handleProductQuickView(prod)}
                onAddToCartSuccess={() => setIsCartOpen(true)}
              />
            ))}
          </div>
        </section>

        {/* Value Proposition Badges */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16">
          <div className="p-6 rounded-[20px] bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[#2563EB]/10 text-[#2563EB]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-sm text-[#111827] dark:text-white">Express 24h Delivery</h3>
              <p className="text-xs text-gray-500 font-medium">Free shipping on all premium orders over ₹999.</p>
            </div>
          </div>

          <div className="p-6 rounded-[20px] bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[#2563EB]/10 text-[#2563EB]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-sm text-[#111827] dark:text-white">1 Year Official Warranty</h3>
              <p className="text-xs text-gray-500 font-medium">100% authentic materials and certified hardware.</p>
            </div>
          </div>

          <div className="p-6 rounded-[20px] bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[#2563EB]/10 text-[#2563EB]">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-sm text-[#111827] dark:text-white">Hassle-Free 30-Day Returns</h3>
              <p className="text-xs text-gray-500 font-medium">Instant refund with zero questions asked.</p>
            </div>
          </div>
        </section>

      </main>

      {/* Floating AI Shopping Assistant Badge Button */}
      <button
        onClick={() => setIsAIOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-5 py-3.5 rounded-full bg-[#111827] text-white shadow-2xl hover:scale-105 transition-all flex items-center gap-2 border border-gray-700"
      >
        <Bot className="w-5 h-5 text-[#2563EB]" />
        <span className="text-xs font-black uppercase tracking-wider">AI Assistant</span>
      </button>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => window.location.href = '/checkout'}
      />

      <AIRecommendationModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
      />

      <footer className="mt-20 border-t border-[#E5E7EB] dark:border-gray-800 py-10 text-center text-xs text-gray-500">
        <p>© 2026 SAVVORA Inc. All rights reserved. Designed in Nike × Stripe × Apple Aesthetic System.</p>
      </footer>

    </div>
  );
}
