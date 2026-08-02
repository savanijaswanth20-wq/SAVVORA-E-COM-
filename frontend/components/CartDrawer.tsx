"use client";

import React, { useState, useEffect } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { KeychainStore, CartItem, subscribeToStore } from '../types/store';

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
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
      {/* Backdrop tap to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Container — Higher z-index to cover bottom nav */}
      <div className="w-full max-w-[340px] sm:max-w-md h-full bg-white dark:bg-[#0a0d16] border-l border-gray-200 dark:border-gray-800 flex flex-col shadow-2xl relative z-[60]">
        
        {/* Header — Ultra Compact 44px */}
        <div className="flex items-center justify-between px-3.5 h-[44px] border-b border-gray-200 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-[#2563EB]" />
            <h2 className="text-xs font-black text-gray-900 dark:text-white">Shopping Bag</h2>
            <span className="text-[10px] text-gray-400 font-bold">({cart.length})</span>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-white flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Cart Items List — Ultra Compact Rows */}
        <div className="flex-1 overflow-y-auto px-2 py-1.5 space-y-1.5">
          {cart.length === 0 ? (
            <div className="text-center py-10 space-y-2 font-medium">
              <ShoppingBag className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-700" />
              <p className="text-[11px] text-gray-400">Your bag is empty.</p>
              <button
                onClick={onClose}
                className="mt-1 px-3 py-1.5 rounded-full bg-[#2563EB] text-white text-[11px] font-bold hover:bg-blue-600 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const price = item.customConfig ? item.customConfig.calculatedPrice : item.product.price;
              return (
                <div key={item.id} className="flex items-center gap-2 p-1.5 rounded-lg bg-gray-50/80 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800/80">
                  {/* Image 40x40 */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-10 h-10 rounded-md object-cover shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[10.5px] text-gray-900 dark:text-white truncate leading-none">
                      {item.product.name}
                    </h3>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-[10px] font-black text-[#2563EB]">
                        ₹{(price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-[8.5px] text-gray-400">
                          (₹{price.toLocaleString('en-IN')} ea)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls - Compact Inline */}
                  <div className="flex items-center gap-0.5 bg-white dark:bg-black rounded-md p-0.5 border border-gray-200 dark:border-gray-700 shrink-0">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, -1)}
                      aria-label="Decrease quantity"
                      className="w-5 h-5 rounded flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xs font-bold leading-none"
                    >
                      −
                    </button>
                    <span className="w-4 text-center text-[10px] font-black text-gray-900 dark:text-white leading-none">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, +1)}
                      aria-label="Increase quantity"
                      className="w-5 h-5 rounded flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xs font-bold leading-none"
                    >
                      +
                    </button>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => KeychainStore.removeFromCart(item.id)}
                    aria-label="Remove item"
                    className="p-1 text-gray-300 dark:text-gray-600 hover:text-rose-500 dark:hover:text-rose-500 transition-colors shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Sticky Footer — Ultra Compact */}
        {cart.length > 0 && (
          <div className="shrink-0 border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-[#0a0d16]/95 backdrop-blur-md px-3 py-2 space-y-1.5 pb-safe">
            
            {/* Coupon Code Row */}
            <form onSubmit={handleApplyCoupon} className="flex items-center gap-1.5">
              <div className="flex-1 flex items-center gap-1 px-2 h-[30px] rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <Tag className="w-3 h-3 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-transparent text-[10px] font-bold uppercase text-gray-900 dark:text-white outline-none placeholder:text-gray-400 placeholder:normal-case placeholder:font-normal"
                />
              </div>
              <button
                type="submit"
                className="h-[30px] px-2.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black whitespace-nowrap hover:opacity-90 active:scale-95 transition-all"
              >
                Apply
              </button>
            </form>

            {appliedCode && (
              <div className="flex items-center gap-1 text-emerald-600 text-[9px] font-bold">
                <ShieldCheck className="w-3 h-3" />
                <span>"{appliedCode}" applied ({discountPercent}% OFF)</span>
              </div>
            )}

            {/* Subtotal & Total Row */}
            <div className="flex items-center justify-between text-[11px] pt-0.5">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-gray-400">Subtotal:</span>
                <span className="font-bold text-gray-900 dark:text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center gap-1 font-black">
                <span className="text-gray-900 dark:text-white">Total:</span>
                <span className="text-[#2563EB] text-xs">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full h-[38px] rounded-xl bg-[#2563EB] hover:bg-blue-600 active:scale-[0.98] text-white font-extrabold text-[11px] uppercase tracking-wider shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
