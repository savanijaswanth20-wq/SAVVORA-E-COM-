"use client";

import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Eye, Star, Check, Sparkles } from 'lucide-react';
import { KeychainProduct, KeychainStore, subscribeToStore } from '../types/store';

interface ProductCardProps {
  product: KeychainProduct;
  onQuickView?: (product: KeychainProduct) => void;
  onAddToCartSuccess?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCartSuccess,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const checkWishlist = () => {
    const list = KeychainStore.getWishlist();
    setIsWishlisted(list.includes(product.id));
  };

  useEffect(() => {
    checkWishlist();
    const unsubscribe = subscribeToStore(checkWishlist);
    return () => unsubscribe();
  }, [product.id]);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = KeychainStore.toggleWishlist(product.id);
    setIsWishlisted(updated);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    KeychainStore.addToCart(product);
    setIsAdded(true);
    if (onAddToCartSuccess) onAddToCartSuccess();
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Calculate fake original price for luxury discount badge
  const discountPercent = product.badge ? 30 : 20;
  const originalPrice = Math.round(product.price * (1 + discountPercent / 100));

  return (
    <div
      className="group relative bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800 rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex flex-col justify-between cursor-pointer hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1.5 transition-all duration-300 h-full overflow-hidden"
      onClick={() => onQuickView && onQuickView(product)}
    >
      {/* Product Image Container */}
      <div className="w-full h-44 sm:h-52 lg:h-60 rounded-xl sm:rounded-2xl overflow-hidden relative bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 shrink-0">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />

        {/* Floating Quick View Overlay Button */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView && onQuickView(product);
            }}
            className="pointer-events-auto px-4 py-2 rounded-full bg-white/90 dark:bg-black/90 text-gray-900 dark:text-white text-xs font-black flex items-center gap-1.5 shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-all duration-300"
          >
            <Eye className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Quick View</span>
          </button>
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label="Add to wishlist"
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-md flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-110 shadow-sm ${
            isWishlisted ? 'text-rose-500' : 'text-gray-600 dark:text-gray-300 hover:text-rose-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Discount & Feature Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          {product.badge && (
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#6366F1] text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
              {product.badge}
            </span>
          )}
          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
            {discountPercent}% OFF
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="mt-3 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
            {product.category || 'Luxury Collection'}
          </span>
          
          <h3 className="font-extrabold text-gray-900 dark:text-white text-xs sm:text-sm group-hover:text-[#2563EB] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-1.5">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300 dark:text-gray-700'
                  }`}
                />
              ))}
            </div>
            <span className="ml-1 text-gray-500 dark:text-gray-400 text-[10px]">({product.rating})</span>
          </div>
        </div>

        {/* Color Swatch Dots Preview */}
        <div className="flex items-center gap-1.5 py-1">
          {['bg-blue-600', 'bg-purple-600', 'bg-amber-500', 'bg-emerald-500'].map((color, idx) => (
            <span
              key={idx}
              className={`w-2.5 h-2.5 rounded-full ${color} ring-1 ring-white dark:ring-gray-900 opacity-80 hover:opacity-100 hover:scale-125 transition-all`}
            />
          ))}
          <span className="text-[9px] font-bold text-gray-400 ml-1">+Variants</span>
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-semibold text-gray-400 line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`w-full py-2.5 rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
              isAdded
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-gray-900 dark:bg-[#2563EB] hover:bg-black dark:hover:bg-blue-600 text-white shadow-blue-500/10'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-blue-400 dark:text-white" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
