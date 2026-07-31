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
  onAddToCartSuccess 
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

  return (
    <div 
      className="bg-[#F8FAFC] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-gray-700 rounded-[16px] sm:rounded-[20px] p-2.5 sm:p-4 flex flex-col justify-between relative group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full"
      onClick={() => onQuickView && onQuickView(product)}
    >
      {/* Top Product Image */}
      <div className="w-full h-36 sm:h-48 lg:h-56 rounded-[12px] sm:rounded-[16px] overflow-hidden relative bg-white dark:bg-black border border-gray-100 dark:border-gray-800 flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Wishlist Heart Touch Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label="Add to wishlist"
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-10 w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-white/90 dark:bg-black/90 flex items-center justify-center transition-transform active:scale-95 hover:scale-110 shadow-sm ${
            isWishlisted ? 'text-rose-500' : 'text-gray-600 dark:text-gray-300'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        {product.badge && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 sm:px-3 py-0.5 rounded-full bg-[#2563EB] text-white text-[9px] sm:text-[10px] font-black uppercase">
            {product.badge}
          </span>
        )}
      </div>

      {/* Content Section matching Wireframe */}
      <div className="mt-2.5 sm:mt-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
        <div>
          {/* Title */}
          <h3 className="font-extrabold text-[#111827] dark:text-white text-xs sm:text-sm group-hover:text-[#2563EB] transition-colors line-clamp-2 sm:line-clamp-1 leading-snug">
            {product.name}
          </h3>

          {/* Star Rating ★★★★☆ (4.8) */}
          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-amber-500 font-bold mt-1">
            <div className="flex items-center">
              {[...Array(4)].map((_, i) => (
                <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
              ))}
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
            </div>
            <span className="ml-0.5 text-gray-500 text-[10px] sm:text-[11px]">({product.rating})</span>
          </div>
        </div>

        {/* Price & Add to Cart Button */}
        <div className="pt-2 border-t border-[#E5E7EB] dark:border-gray-700 space-y-1.5 sm:space-y-2">
          <div className="text-sm sm:text-lg font-black text-[#111827] dark:text-white">
            ₹{product.price.toLocaleString("en-IN")}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`w-full min-h-[40px] sm:min-h-[44px] py-2 sm:py-2.5 rounded-full font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
              isAdded
                ? 'bg-emerald-500 text-white'
                : 'bg-[#111827] dark:bg-apple-blue hover:bg-black text-white'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-[#2563EB] dark:text-white" /> <span className="hidden min-[360px]:inline">Add to Cart</span><span className="min-[360px]:hidden">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
