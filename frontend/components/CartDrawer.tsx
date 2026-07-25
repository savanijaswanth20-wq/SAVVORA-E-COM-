"use client";

import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { KeychainStore, CartItem, subscribeToStore } from '../services/keychainStore';
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
      <div className="w-full max-w-md h-full glass-apple dark:bg-apple-surface-dark p-6 border-l border-apple-border dark:border-apple-border-dark flex flex-col justify-between shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-apple-border dark:border-apple-border-dark">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-apple-blue" />
            <h2 className="text-base font-extrabold text-apple-dark dark:text-white">Shopping Cart Bag</h2>
            <span className="text-xs text-apple-gray font-bold">({cart.length})</span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-apple-surface dark:bg-apple-surface-dark text-apple-dark dark:text-white flex items-center justify-center border border-apple-border dark:border-apple-border-dark"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-apple-gray text-xs space-y-2 font-medium">
              <ShoppingBag className="w-10 h-10 mx-auto text-apple-gray opacity-40" />
              <p>Your bag is empty.</p>
            </div>
          ) : (
            cart.map((item) => {
              const price = item.customConfig ? item.customConfig.calculatedPrice : item.product.price;
              return (
                <div key={item.id} className="p-3 rounded-2xl bg-white dark:bg-black border border-apple-border dark:border-apple-border-dark flex items-center gap-3">
                  <img src={item.product.image} alt={item.product.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xs text-apple-dark dark:text-white truncate">{item.product.name}</h3>
                    <span className="text-[10px] text-apple-gray font-medium">Qty: {item.quantity}</span>
                    <div className="text-xs font-black text-apple-blue mt-0.5">₹{price * item.quantity}</div>
                  </div>

                  <div className="flex items-center gap-1 bg-apple-surface dark:bg-apple-surface-dark rounded-xl p-1 border border-apple-border dark:border-apple-border-dark">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, -1)}
                      className="w-5 h-5 rounded bg-white dark:bg-black text-apple-dark dark:text-white text-xs font-bold flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-4 text-center text-xs font-bold text-apple-dark dark:text-white">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, +1)}
                      className="w-5 h-5 rounded bg-white dark:bg-black text-apple-dark dark:text-white text-xs font-bold flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => KeychainStore.removeFromCart(item.id)}
                    className="text-apple-gray hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-apple-border dark:border-apple-border-dark space-y-3">
            
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Coupon (e.g. APPLE20)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-black border border-apple-border dark:border-apple-border-dark text-xs font-bold uppercase text-apple-dark dark:text-white"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-apple-dark dark:bg-white text-white dark:text-apple-dark text-xs font-bold"
              >
                Apply
              </button>
            </form>

            <div className="space-y-1.5 text-xs text-apple-gray font-medium">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-apple-dark dark:text-white">₹{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-apple-dark dark:text-white pt-2 border-t border-apple-border dark:border-apple-border-dark">
                <span>Total</span>
                <span className="text-apple-blue">₹{finalTotal}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 rounded-full bg-apple-blue hover:bg-apple-blue-hover text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-apple-blue/20 flex items-center justify-center gap-2"
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
