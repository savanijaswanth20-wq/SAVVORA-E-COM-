"use client";

import React, { useState } from 'react';
import { X, CheckCircle, Truck, CreditCard, Smartphone, ShieldCheck, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { KeychainStore, CartItem, Order } from '../services/keychainStore';
import { ConfettiEffect } from './ConfettiEffect';

interface MultiStepCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MultiStepCheckout: React.FC<MultiStepCheckoutProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [address, setAddress] = useState({
    fullName: 'Aarav Sharma',
    street: '42 MG Road, Indiranagar',
    city: 'Bengaluru',
    zip: '560038',
    phone: '+91 98765 43210'
  });
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  if (!isOpen) return null;

  const cart = KeychainStore.getCart();
  const subtotal = cart.reduce((sum, i) => sum + (i.customConfig ? i.customConfig.calculatedPrice : i.product.price) * i.quantity, 0);

  const handleCompleteOrder = () => {
    const newOrder: Order = {
      id: `ORD-APL-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      totalAmount: subtotal,
      discountApplied: 0,
      giftWrapping: true,
      paymentMethod: paymentMethod === 'upi' ? 'UPI (Google Pay)' : 'Credit Card',
      shippingAddress: address,
      status: 'Processing',
      trackingNumber: `TRK-APPLE-${Math.floor(10000 + Math.random() * 90000)}`,
      estimatedDelivery: 'Express 24h Delivery'
    };

    KeychainStore.addOrder(newOrder);
    KeychainStore.clearCart();
    setPlacedOrder(newOrder);
    setStep(4);
    setShowConfetti(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
      <ConfettiEffect trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      <div className="w-full max-w-2xl glass-apple dark:bg-apple-surface-dark rounded-4xl p-6 sm:p-8 border border-apple-border dark:border-apple-border-dark shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-apple-surface dark:bg-apple-surface-dark text-apple-dark dark:text-white flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step Indicator Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-apple-border dark:border-apple-border-dark mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center ${
                  step === s
                    ? 'bg-apple-blue text-white shadow-md'
                    : step > s
                    ? 'bg-emerald-500 text-white'
                    : 'bg-apple-surface dark:bg-apple-surface-dark text-apple-gray'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
              <span className="text-xs font-bold text-apple-gray hidden sm:inline">
                {s === 1 ? 'Address' : s === 2 ? 'Shipping' : s === 3 ? 'Payment' : 'Receipt'}
              </span>
            </div>
          ))}
        </div>

        {/* STEP 1: Address */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-base text-apple-dark dark:text-white">1. Shipping Address Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-apple-gray mb-1">Full Name</label>
                <input
                  type="text"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black border border-apple-border dark:border-apple-border-dark text-apple-dark dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-apple-gray mb-1">Phone Number</label>
                <input
                  type="text"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black border border-apple-border dark:border-apple-border-dark text-apple-dark dark:text-white font-medium"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-bold text-apple-gray mb-1">Street Address</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black border border-apple-border dark:border-apple-border-dark text-apple-dark dark:text-white font-medium"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-full bg-apple-blue text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-4"
            >
              <span>Continue to Shipping</span> <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Shipping */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-base text-apple-dark dark:text-white">2. Select Shipping & Delivery</h3>
            <div className="space-y-2">
              <div className="p-4 rounded-2xl bg-white dark:bg-black border border-apple-blue flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-xs text-apple-dark dark:text-white block">Apple Express Shipping</span>
                  <span className="text-[10px] text-apple-gray">Guaranteed Delivery in 24 Hours</span>
                </div>
                <span className="text-xs font-black text-emerald-600">FREE</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-6 rounded-full glass-apple text-apple-dark dark:text-white font-bold text-xs"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 rounded-full bg-apple-blue text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>Continue to Payment</span> <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Payment */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-base text-apple-dark dark:text-white">3. Payment Method</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-2xl border text-left font-bold text-xs ${
                  paymentMethod === 'upi' ? 'bg-apple-blue text-white border-apple-blue' : 'bg-white dark:bg-black text-apple-dark dark:text-white border-apple-border dark:border-apple-border-dark'
                }`}
              >
                <Smartphone className="w-5 h-5 mb-2" />
                <span>UPI (GPay / PhonePe)</span>
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border text-left font-bold text-xs ${
                  paymentMethod === 'card' ? 'bg-apple-blue text-white border-apple-blue' : 'bg-white dark:bg-black text-apple-dark dark:text-white border-apple-border dark:border-apple-border-dark'
                }`}
              >
                <CreditCard className="w-5 h-5 mb-2" />
                <span>Credit / Debit Card</span>
              </button>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={() => setStep(2)}
                className="py-3 px-6 rounded-full glass-apple text-apple-dark dark:text-white font-bold text-xs"
              >
                Back
              </button>
              <button
                onClick={handleCompleteOrder}
                className="flex-1 py-3.5 rounded-full bg-apple-blue text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Pay ₹{subtotal} & Complete Order
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Success Receipt */}
        {step === 4 && placedOrder && (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-apple-dark dark:text-white">Order Confirmed!</h3>
            <p className="text-xs text-apple-gray font-medium">Thank you, {placedOrder.shippingAddress.fullName}. Your order {placedOrder.id} has been placed.</p>
            <button
              onClick={onClose}
              className="py-3 px-8 rounded-full bg-apple-blue text-white text-xs font-extrabold"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
