"use client";

import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Truck, 
  ShieldCheck, 
  ShoppingBag, 
  Heart, 
  Gift, 
  Check, 
  Sparkles,
  PlayCircle
} from 'lucide-react';
import { KeychainProduct, KeychainStore } from '../types/store';
import Link from 'next/link';

interface QuickViewModalProps {
  product: KeychainProduct | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [giftWrapping, setGiftWrapping] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const currentImage = selectedImage || product.image;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      KeychainStore.addToCart(product);
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-3xl glass-apple rounded-4xl p-6 md:p-8 border border-pink-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-700 flex items-center justify-center transition-all shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left: Product Images & Media */}
          <div className="space-y-4">
            <div className="w-full h-80 rounded-3xl overflow-hidden bg-pink-50 relative border border-white/80 shadow-md">
              <img src={currentImage} alt={product.name} className="w-full h-full object-cover" />
              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full badge-kawaii text-xs font-bold uppercase">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Image Thumbnails & Video Preview */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedImage(product.image)}
                className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all ${
                  currentImage === product.image ? 'border-pink-500 ring-2 ring-pink-300' : 'border-gray-200'
                }`}
              >
                <img src={product.image} alt="Main" className="w-full h-full object-cover" />
              </button>

              {product.secondaryImage && (
                <button
                  onClick={() => setSelectedImage(product.secondaryImage!)}
                  className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all ${
                    currentImage === product.secondaryImage ? 'border-pink-500 ring-2 ring-pink-300' : 'border-gray-200'
                  }`}
                >
                  <img src={product.secondaryImage} alt="Secondary" className="w-full h-full object-cover" />
                </button>
              )}

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 border border-pink-200 flex flex-col items-center justify-center text-[10px] text-pink-700 font-bold cursor-pointer hover:scale-105 transition-transform">
                <PlayCircle className="w-6 h-6 text-pink-500" />
                <span>3D Demo</span>
              </div>
            </div>
          </div>

          {/* Right: Product Details & Buying Actions */}
          <div className="space-y-4">
            
            {/* Category & Ratings */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="font-bold text-pink-600 uppercase tracking-wider">{product.category}</span>
              <span className="font-mono text-gray-400">SKU: {product.sku}</span>
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 leading-snug">
              {product.name}
            </h2>

            {/* Rating Stars */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1 text-gray-800">{product.rating}</span>
              </div>
              <span className="text-gray-400">({product.reviewCount} customer reviews)</span>
            </div>

            {/* Price Display */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-black text-gray-900">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-base text-gray-400 line-through font-semibold">₹{product.originalPrice}</span>
              )}
              <span className="text-xs font-bold text-emerald-600 px-2 py-0.5 rounded-full bg-emerald-50">
                In Stock ({product.stock} Units)
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              {product.description}
            </p>

            {/* Features Bullet List */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
              {product.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-700 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Quantity & Gift Wrapping Controls */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">Quantity</span>
                <div className="flex items-center gap-2 bg-white rounded-2xl p-1 border border-gray-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-xl bg-pink-50 text-pink-700 font-bold flex items-center justify-center hover:bg-pink-100"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-extrabold text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-7 h-7 rounded-xl bg-pink-50 text-pink-700 font-bold flex items-center justify-center hover:bg-pink-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Gift Wrapping Checkbox */}
              <label className="flex items-center gap-2 p-3 rounded-2xl bg-pink-50/60 border border-pink-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={giftWrapping}
                  onChange={(e) => setGiftWrapping(e.target.checked)}
                  className="rounded text-pink-500 focus:ring-pink-400"
                />
                <Gift className="w-4 h-4 text-pink-600" />
                <span className="text-xs font-bold text-gray-800">Include Complimentary Kawaii Gift Wrapping</span>
              </label>

            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`py-3.5 rounded-2xl font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 ${
                  isAdded
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 shadow-pink-500/20'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" /> Added!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Cart (₹{product.price * quantity})
                  </>
                )}
              </button>

              <Link
                href="/cart"
                onClick={() => {
                  KeychainStore.addToCart(product);
                  onClose();
                }}
                className="py-3.5 rounded-2xl bg-gray-900 hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider shadow-md text-center flex items-center justify-center"
              >
                Instant Buy
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
