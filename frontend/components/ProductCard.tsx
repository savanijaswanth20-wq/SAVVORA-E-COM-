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
      className="bg-[#F8FAFC] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-gray-700 rounded-[20px] p-4 flex flex-col justify-between relative group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      onClick={() => onQuickView && onQuickView(product)}
    >
      {/* Top Product Image */}
      <div className="w-full h-56 rounded-[16px] overflow-hidden relative bg-white dark:bg-black border border-gray-100 dark:border-gray-800">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Wishlist Heart */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-black/90 flex items-center justify-center transition-transform hover:scale-110 shadow-sm ${
            isWishlisted ? 'text-rose-500' : 'text-gray-600 dark:text-gray-300'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        {product.badge && (
          <span className="absolute top-3 left-3 px-3 py-0.5 rounded-full bg-[#2563EB] text-white text-[10px] font-black uppercase">
            {product.badge}
          </span>
        )}
      </div>

      {/* Content Section matching Wireframe */}
      <div className="mt-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Title */}
          <h3 className="font-extrabold text-[#111827] dark:text-white text-sm group-hover:text-[#2563EB] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Star Rating ★★★★☆ (4.8) */}
          <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-1">
            <div className="flex items-center">
              {[...Array(4)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
              <Star className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="ml-1 text-gray-500 text-[11px]">({product.rating})</span>
          </div>
        </div>

        {/* Price & Add to Cart Button */}
        <div className="pt-2 border-t border-[#E5E7EB] dark:border-gray-700 space-y-2">
          <div className="text-lg font-black text-[#111827] dark:text-white">
            ₹{product.price.toLocaleString("en-IN")}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`w-full py-2.5 rounded-full font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 ${
              isAdded
                ? 'bg-emerald-500 text-white'
                : 'bg-[#111827] hover:bg-black text-white'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-[#2563EB]" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
