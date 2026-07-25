"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { CategoryBar } from '../components/CategoryBar';
import { HeroBanner } from '../components/HeroBanner';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { CartDrawer } from '../components/CartDrawer';
import { AIRecommendationModal } from '../components/AIRecommendationModal';
import { KeychainStore, KeychainProduct, subscribeToStore } from '../services/keychainStore';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw, Bot } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<KeychainProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<KeychainProduct | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

  const loadData = () => {
    setProducts(KeychainStore.getProducts());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToStore(loadData);
    return () => unsubscribe();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedCategory === 'new') return matchesSearch;
    if (selectedCategory === 'bestseller') return matchesSearch && (p.badge === 'BESTSELLER' || p.rating >= 4.9);
    if (selectedCategory === 'electronics') return matchesSearch && p.categoryId === 'electronics';
    if (selectedCategory === 'fashion') return matchesSearch && (p.categoryId === 'custom-name' || p.categoryId === 'accessories');
    if (selectedCategory === 'home') return matchesSearch && p.categoryId === 'accessories';
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#111827] text-[#111827] dark:text-white font-sans pb-16 transition-colors duration-300">
      
      <Navbar
        onOpenCartDrawer={() => setIsCartOpen(true)}
        onSearchChange={(q) => setSearchQuery(q)}
      />

      <main className="max-w-[1200px] mx-auto px-4 lg:px-8">
        
        {/* Category Pill Navigation Bar (44px pills) */}
        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => setSelectedCategory(catId)}
        />

        {/* Hero Banner */}
        <HeroBanner />

        {/* Brand Marquee */}
        <section className="py-6 border-y border-[#E5E7EB] dark:border-gray-800 my-8 flex items-center justify-around flex-wrap gap-6 text-xs font-extrabold tracking-widest text-gray-400 uppercase">
          <span>Apple</span><span>Stripe</span><span>Nike</span><span>Sony</span><span>Bang & Olufsen</span><span>Leica</span><span>Keychron</span>
        </section>

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
                onQuickView={(prod) => setQuickViewProduct(prod)}
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
