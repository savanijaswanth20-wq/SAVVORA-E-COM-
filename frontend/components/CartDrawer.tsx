"use client";

import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { KeychainStore, CartItem, subscribeToStore } from '../types/store';
import Link from 'next/link';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onProceedToCheckout }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCode, setAppliedCode] = useState('');

  const updateCart = () => {
    setCart(KeychainStore.getCart());
  };

  useEffect(() => {
    updateCart();
    const unsubscribe = subscribeToStore(updateCart);
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleUpdateQuantity = (id: string, delta: number) => {
    const item = cart.find((c) => c.id === id);
    if (item) KeychainStore.updateCartQuantity(id, item.quantity + delta);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (clean === 'APPLE20') {
      setDiscountPercent(20);
      setAppliedCode('APPLE20');
    } else if (clean === 'LINEAR15') {
      setDiscountPercent(15);
      setAppliedCode('LINEAR15');
    } else {
      alert('Invalid Coupon. Try "APPLE20" for 20% off!');
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.customConfig ? item.customConfig.calculatedPrice : item.product.price) * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = Math.max(0, subtotal - discountAmount);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in">
      {/* Backdrop tap to close */}
      <div className="flex-1" onClick={onClose} />

      <div className="w-full max-w-[360px] sm:max-w-md h-full glass-apple dark:bg-apple-surface-dark border-l border-apple-border dark:border-apple-border-dark flex flex-col shadow-2xl">
        
        {/* Header — compact 52px */}
        <div className="flex items-center justify-between px-4 h-[52px] border-b border-apple-border dark:border-apple-border-dark shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#2563EB]" />
            <h2 className="text-sm font-extrabold text-apple-dark dark:text-white">Shopping Bag</h2>
            <span className="text-[10px] text-apple-gray font-bold">({cart.length})</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-white flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Cart Items — scrollable, fills available space */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-apple-gray space-y-3 font-medium">
              <ShoppingBag className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-700" />
              <p className="text-xs text-gray-400">Your bag is empty.</p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 rounded-full bg-[#2563EB] text-white text-xs font-bold hover:bg-blue-600 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const price = item.customConfig ? item.customConfig.calculatedPrice : item.product.price;
              return (
                <div key={item.id} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-black border border-gray-100 dark:border-gray-800">
                  {/* Product Image — 52x52 */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-[52px] h-[52px] rounded-lg object-cover shrink-0"
                  />

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[11px] text-apple-dark dark:text-white line-clamp-1 leading-tight">
                      {item.product.name}
                    </h3>
                    <div className="text-[10px] font-black text-[#2563EB] mt-0.5">
                      ₹{(price * item.quantity).toLocaleString('en-IN')}
                    </div>
                    <div className="text-[9px] text-gray-400 font-medium">
                      ₹{price.toLocaleString('en-IN')} × {item.quantity}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-900 rounded-lg p-0.5 border border-gray-200 dark:border-gray-700 shrink-0">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, -1)}
                      aria-label="Decrease quantity"
                      className="w-6 h-6 rounded flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-colors text-sm font-bold leading-none"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-[11px] font-black text-gray-900 dark:text-white leading-none">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, +1)}
                      aria-label="Increase quantity"
                      className="w-6 h-6 rounded flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-colors text-sm font-bold leading-none"
                    >
                      +
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => KeychainStore.removeFromCart(item.id)}
                    aria-label="Remove item"
                    className="p-1.5 text-gray-300 dark:text-gray-600 hover:text-rose-500 dark:hover:text-rose-500 transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Sticky Footer — coupon + summary + checkout */}
        {cart.length > 0 && (
          <div className="shrink-0 border-t border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-[#111827]/90 backdrop-blur-md px-4 py-3 space-y-2.5">
            
            {/* Coupon Code */}
            <form onSubmit={handleApplyCoupon} className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <Tag className="w-3 h-3 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-transparent text-[11px] font-bold uppercase text-gray-900 dark:text-white outline-none placeholder:text-gray-400 placeholder:normal-case placeholder:font-normal"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[11px] font-black whitespace-nowrap hover:opacity-90 active:scale-95 transition-all"
              >
                Apply
              </button>
            </form>

            {appliedCode && (
              <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3" />
                <span>"{appliedCode}" applied — {discountPercent}% off!</span>
              </div>
            )}

            {/* Price Summary */}
            <div className="space-y-1 text-[11px] text-gray-500 dark:text-gray-400 font-medium">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900 dark:text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount ({discountPercent}%)</span>
                  <span>−₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-gray-900 dark:text-white pt-1.5 border-t border-gray-100 dark:border-gray-800">
                <span>Total</span>
                <span className="text-[#2563EB]">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full h-[44px] rounded-full bg-[#2563EB] hover:bg-blue-600 active:scale-[0.98] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
