"use client";

import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';
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

  const discountPercent = product.badge ? 30 : 20;
  const originalPrice = Math.round(product.price * (1 + discountPercent / 100));

  return (
    <div
      className="group relative bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800 rounded-xl p-2 flex flex-col justify-between cursor-pointer hover:shadow-lg hover:shadow-blue-500/8 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
      onClick={() => onQuickView && onQuickView(product)}
    >
      {/* Product Image — 120px on mobile, 140px on sm, 180px on lg */}
      <div className="w-full h-[120px] sm:h-[140px] lg:h-[180px] rounded-lg overflow-hidden relative bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 shrink-0">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          width="200"
          height="120"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Quick View overlay — desktop only hover */}
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex items-center justify-center pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView && onQuickView(product);
            }}
            className="pointer-events-auto px-2.5 py-1 rounded-full bg-white/90 dark:bg-black/90 text-gray-900 dark:text-white text-[10px] font-black flex items-center gap-1 shadow-md transform translate-y-1.5 group-hover:translate-y-0 transition-all duration-200"
          >
            <Eye className="w-2.5 h-2.5 text-[#2563EB]" />
            <span>Quick View</span>
          </button>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label="Add to wishlist"
          className={`absolute top-1.5 right-1.5 z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-md flex items-center justify-center transition-all duration-150 active:scale-90 shadow-xs ${
            isWishlisted ? 'text-rose-500' : 'text-gray-500 dark:text-gray-300 hover:text-rose-500'
          }`}
        >
          <Heart className={`w-3 h-3 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Badges */}
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-0.5 items-start">
          {product.badge && (
            <span className="px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#6366F1] text-white text-[7px] sm:text-[8px] font-black uppercase tracking-wider shadow-xs">
              {product.badge}
            </span>
          )}
          <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[7px] sm:text-[8px] font-black uppercase tracking-wider shadow-xs">
            {discountPercent}% OFF
          </span>
        </div>
      </div>

      {/* Product Content */}
      <div className="mt-1.5 flex-1 flex flex-col justify-between space-y-1">
        <div>
          <span className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-wider block truncate">
            {product.category || 'Luxury'}
          </span>

          <h3 className="font-extrabold text-gray-900 dark:text-white text-[11px] sm:text-xs group-hover:text-[#2563EB] transition-colors line-clamp-2 leading-tight mt-0.5">
            {product.name}
          </h3>

          {/* Compact Rating Row */}
          <div className="flex items-center gap-0.5 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 ${
                  i < Math.floor(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-200 dark:text-gray-700'
                }`}
              />
            ))}
            <span className="ml-0.5 text-gray-400 text-[8px] font-bold">({product.rating})</span>
          </div>
        </div>

        {/* Price & Cart Button */}
        <div className="pt-1 border-t border-gray-100 dark:border-gray-800 space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-[9px] sm:text-[10px] font-semibold text-gray-400 line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`w-full h-[34px] sm:h-[38px] rounded-lg font-extrabold text-[10px] sm:text-[11px] transition-all flex items-center justify-center gap-1 active:scale-95 ${
              isAdded
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-900 dark:bg-[#2563EB] hover:bg-black dark:hover:bg-blue-600 text-white'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3 h-3" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3 text-blue-400 dark:text-white" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
