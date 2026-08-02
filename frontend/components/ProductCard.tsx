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
      className="group relative bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between cursor-pointer hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden"
      onClick={() => onQuickView && onQuickView(product)}
    >
      {/* Product Image Container (Compact h-32 on mobile) */}
      <div className="w-full h-32 sm:h-44 lg:h-56 rounded-lg sm:rounded-xl overflow-hidden relative bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 shrink-0">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width="200"
          height="128"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Floating Quick View Overlay Button */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView && onQuickView(product);
            }}
            className="pointer-events-auto px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/90 text-gray-900 dark:text-white text-[11px] font-black flex items-center gap-1 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
          >
            <Eye className="w-3 h-3 text-[#2563EB]" />
            <span>Quick View</span>
          </button>
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label="Add to wishlist"
          className={`absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-md flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-110 shadow-xs ${
            isWishlisted ? 'text-rose-500' : 'text-gray-600 dark:text-gray-300 hover:text-rose-500'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Discount & Feature Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          {product.badge && (
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#6366F1] text-white text-[8px] sm:text-[9px] font-black uppercase tracking-wider shadow-xs">
              {product.badge}
            </span>
          )}
          <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[8px] sm:text-[9px] font-black uppercase tracking-wider shadow-xs">
            {discountPercent}% OFF
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="mt-2 flex-1 flex flex-col justify-between space-y-1.5">
        <div>
          <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5 truncate">
            {product.category || 'Luxury Collection'}
          </span>
          
          <h3 className="font-extrabold text-gray-900 dark:text-white text-[11px] sm:text-xs group-hover:text-[#2563EB] transition-colors line-clamp-1 sm:line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mt-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-2.5 h-2.5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300 dark:text-gray-700'
                  }`}
                />
              ))}
            </div>
            <span className="ml-0.5 text-gray-500 dark:text-gray-400 text-[9px]">({product.rating})</span>
          </div>
        </div>

        {/* Color Swatch Dots Preview (Hidden on mobile to save vertical space) */}
        <div className="hidden xs:flex items-center gap-1 py-0.5">
          {['bg-blue-600', 'bg-purple-600', 'bg-amber-500', 'bg-emerald-500'].map((color, idx) => (
            <span
              key={idx}
              className={`w-2 h-2 rounded-full ${color} ring-1 ring-white dark:ring-gray-900 opacity-80`}
            />
          ))}
          <span className="text-[8px] font-bold text-gray-400 ml-0.5">+Vars</span>
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-1.5 border-t border-gray-100 dark:border-gray-800 space-y-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] font-semibold text-gray-400 line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`w-full py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl font-extrabold text-[11px] sm:text-xs shadow-xs transition-all flex items-center justify-center gap-1 active:scale-95 min-h-[36px] ${
              isAdded
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-gray-900 dark:bg-[#2563EB] hover:bg-black dark:hover:bg-blue-600 text-white shadow-blue-500/10'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-blue-400 dark:text-white" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
