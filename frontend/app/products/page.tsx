"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { ProductCard } from '../../components/ProductCard';
import { QuickViewModal } from '../../components/QuickViewModal';
import { CartDrawer } from '../../components/CartDrawer';
import { KeychainStore, KeychainProduct, subscribeToStore } from '../../types/store';
import { Search, SlidersHorizontal, ArrowLeft, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<KeychainProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceMax, setPriceMax] = useState<number>(150000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState<KeychainProduct | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const ITEMS_PER_PAGE = 6;

  const loadData = () => {
    setProducts(KeychainStore.getProducts());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToStore(loadData);
    return () => unsubscribe();
  }, []);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = p.price <= priceMax;
    const matchesStock = !inStockOnly || p.stock > 0;
    return matchesCategory && matchesSearch && matchesPrice && matchesStock;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark text-apple-dark dark:text-white font-sans pb-16 transition-colors duration-300">
      
      <Navbar
        onOpenCartDrawer={() => setIsCartOpen(true)}
        onSearchChange={(q) => setSearchQuery(q)}
      />

      <main className="max-w-[1200px] mx-auto px-4 lg:px-8 pt-8">
        
        {/* Header Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-apple-gray mb-4 font-semibold">
          <Link href="/" className="hover:text-apple-blue">Home</Link>
          <span>/</span>
          <span className="text-apple-dark dark:text-white">Products Catalog</span>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">All Products Catalog</h1>
            <p className="text-xs text-apple-gray mt-1 font-medium">Browse our full range of Apple tech and custom handmade keychains.</p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-apple-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-apple-surface dark:bg-apple-surface-dark border border-apple-border dark:border-apple-border-dark text-xs font-medium focus:outline-none focus:border-apple-blue"
            />
          </div>
        </div>

        {/* Filter Controls Toolbar */}
        <div className="glass-apple dark:bg-apple-surface-dark rounded-apple p-4 border border-apple-border dark:border-apple-border-dark mb-8 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-apple-blue" />
            <span>Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-black border border-apple-border dark:border-apple-border-dark text-apple-dark dark:text-white font-bold"
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="custom-name">Custom Keychains</option>
              <option value="couple">Couple Sets</option>
              <option value="audio">Audio & Acoustics</option>
              <option value="photo">Photo Keepsakes</option>
              <option value="limited">Limited Edition</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded text-apple-blue focus:ring-apple-blue"
            />
            <span>In Stock Only</span>
          </label>

          <div className="text-apple-gray">
            Showing {filteredProducts.length} Items
          </div>
        </div>

        {/* Products Grid */}
        {paginatedProducts.length === 0 ? (
          <div className="text-center py-20 text-apple-gray text-xs font-medium">
            No products match your filter criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onQuickView={(p) => setQuickViewProduct(p)}
                onAddToCartSuccess={() => setIsCartOpen(true)}
              />
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-full bg-apple-surface dark:bg-apple-surface-dark border border-apple-border dark:border-apple-border-dark disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-extrabold px-4">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-full bg-apple-surface dark:bg-apple-surface-dark border border-apple-border dark:border-apple-border-dark disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </main>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => window.location.href = '/checkout'}
      />

    </div>
  );
}
