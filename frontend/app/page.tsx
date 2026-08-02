"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { MegaMenu } from '../components/MegaMenu';
import { HeroBanner } from '../components/HeroBanner';
import { FlashSaleBanner } from '../components/FlashSaleBanner';
import { ProductCard } from '../components/ProductCard';
import { CategoryBar } from '../components/CategoryBar';
import { SkeletonCard, SkeletonHero } from '../components/SkeletonCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { CartDrawer } from '../components/CartDrawer';
import { AIRecommendationModal } from '../components/AIRecommendationModal';
import { CustomerReviews } from '../components/CustomerReviews';
import { InstagramGallery } from '../components/InstagramGallery';
import { KeychainStore, KeychainProduct, subscribeToStore, UserProfile } from '../types/store';
import { Sparkles, History, ShoppingBag, CheckCircle2, ShieldCheck, Truck, RotateCcw, Bot, Flame, ArrowRight, Award } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [products, setProducts] = useState<KeychainProduct[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<KeychainProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<KeychainProduct | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'featured' | 'bestseller'>('all');

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

  const recommendedProducts = user?.preferences?.length
    ? products.filter((p) => user.preferences?.includes(p.categoryId) || user.preferences?.includes(p.category.toLowerCase()))
    : products.slice(0, 4);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedCategory && selectedCategory !== 'new' && selectedCategory !== 'bestseller') {
      return matchesSearch && p.categoryId === selectedCategory;
    }
    if (activeTab === 'bestseller') return matchesSearch && (p.badge === 'BESTSELLER' || p.rating >= 4.9);
    if (activeTab === 'featured') return matchesSearch && (p.badge === 'FEATURED' || p.badge === 'HOT');
    return matchesSearch;
  });

  const firstName = user ? user.fullName.split(' ')[0] : '';

  const categoriesList = [
    { id: 'custom-keychains', name: 'Custom Keychains', icon: '🔑', count: '12+ Styles', bg: 'from-[#2563EB]/10 to-[#6366F1]/10' },
    { id: 'audio', name: 'Studio Sound', icon: '🎧', count: '8+ Products', bg: 'from-[#8B5CF6]/10 to-[#EC4899]/10' },
    { id: 'phone-accessories', name: 'MagSafe Gear', icon: '⚡', count: '15+ Accessories', bg: 'from-amber-500/10 to-rose-500/10' },
    { id: 'gifts', name: 'Gift Bundles', icon: '🎁', count: 'Personalized Sets', bg: 'from-emerald-500/10 to-teal-500/10' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0d16] text-[#111827] dark:text-white font-sans transition-colors duration-300 pb-20 lg:pb-0">
      
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

      <main className="max-w-[1240px] mx-auto px-3 sm:px-4 lg:px-8 space-y-6">
        
        {/* Personalized User Welcome Header */}
        {user && (
          <div className="mt-2 sm:mt-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-purple-50/50 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-purple-950/20 border border-blue-200/60 dark:border-blue-800/40 text-gray-900 dark:text-white shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-md">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.fullName} className="w-11 h-11 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-xs" />
                ) : (
                  <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#6366F1] text-white flex items-center justify-center text-lg font-black border-2 border-white shadow-xs">
                    {firstName.charAt(0).toUpperCase()}
                  </div>
                )}
                {user.profileCompleted && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute -bottom-1 -right-1 bg-white dark:bg-black rounded-full" />
                )}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB]">
                    Personalized Feed
                  </span>
                </div>
                <h1 className="text-base sm:text-xl font-black tracking-tight text-[#111827] dark:text-white">
                  👋 Welcome back, {firstName}!
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Explore custom recommendations &amp; track active orders.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/account?tab=orders"
                className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-extrabold text-xs border border-gray-200 dark:border-gray-700 shadow-xs hover:bg-gray-50 transition-colors"
              >
                Track Orders
              </Link>
            </div>
          </div>
        )}

        {/* Category Navigation Bar (Horizontal Scroll Chips) */}
        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => setSelectedCategory(catId)}
        />

        {/* Hero Banner Showcase (Max Height 220px) */}
        <HeroBanner />

        {/* Main Storefront & Featured Product Grid (Immediately after Hero) */}
        <section id="products" className="space-y-4 pt-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-800 pb-3">
            <div>
              <span className="text-xs font-black text-[#2563EB] uppercase tracking-wider">Curated Storefront</span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                Featured Lineup ({filteredProducts.length})
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 p-1 rounded-full text-xs font-bold">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1 rounded-full transition-colors ${
                  activeTab === 'all'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('featured')}
                className={`px-3.5 py-1 rounded-full transition-colors ${
                  activeTab === 'featured'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
                }`}
              >
                Featured
              </button>
              <button
                onClick={() => setActiveTab('bestseller')}
                className={`px-3.5 py-1 rounded-full transition-colors ${
                  activeTab === 'bestseller'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
                }`}
              >
                Best Sellers
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
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

        {/* Flash Sale Banner (Max Height 200px) */}
        <FlashSaleBanner />

        {/* Recommended For You Section */}
        {user && recommendedProducts.length > 0 && (
          <section className="space-y-4 p-4 sm:p-6 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-[#2563EB] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Tailored For You
                </span>
                <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight">
                  Recommended For {user.fullName.split(' ')[0]}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
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

        {/* Browsing History / Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <section className="space-y-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border border-gray-200/80 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" /> Browsing History
                </span>
                <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight">
                  Recently Viewed ({recentlyViewed.length})
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
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

        {/* Customer Testimonials & Reviews */}
        <CustomerReviews />

        {/* Payment Architecture Support Badges UI */}
        <section className="my-6 py-4 px-4 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800">
          <p className="text-center text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
            Supported 100% Secure Checkout Methods
          </p>
          <div className="flex items-center justify-center flex-wrap gap-4 text-xs font-extrabold text-gray-700 dark:text-gray-300">
            <span className="px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center gap-1.5 shadow-xs">
              ⚡ Instant UPI (GPay/PhonePe/Paytm)
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center gap-1.5 shadow-xs">
              💳 Razorpay Secured
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center gap-1.5 shadow-xs">
              🚚 Cash on Delivery Available
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center gap-1.5 shadow-xs">
              🔒 Stripe Global Payment Gateway
            </span>
          </div>
        </section>

        {/* Instagram Gallery & Community */}
        <InstagramGallery />

      </main>

      {/* Modals & Drawers */}
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

    </div>
  );
}
