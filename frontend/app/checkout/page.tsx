"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Truck, CreditCard, Smartphone, ShieldCheck, Sparkles } from 'lucide-react';
import { KeychainStore, Order } from '../../types/store';

export default function CheckoutPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [address, setAddress] = useState({
    fullName: 'Aarav Sharma',
    street: '42 MG Road, Indiranagar',
    city: 'Bengaluru',
    zip: '560038',
    phone: '+91 98765 43210'
  });
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');

  const cart = KeychainStore.getCart();
  const subtotal = cart.reduce((sum, i) => sum + (i.customConfig ? i.customConfig.calculatedPrice : i.product.price) * i.quantity, 0);

  const handleCompleteCheckout = () => {
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
    window.location.href = `/order-success?id=${newOrder.id}`;
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark text-apple-dark dark:text-white font-sans pb-20 transition-colors duration-300">
      
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 dark:bg-black/70 border-b border-apple-border dark:border-apple-border-dark py-4 px-6">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <Link href="/cart" className="flex items-center gap-2 text-xs font-bold text-apple-gray hover:text-apple-blue">
            <ArrowLeft className="w-4 h-4" /> Return to Cart
          </Link>
          <span className="font-extrabold text-sm text-apple-dark dark:text-white">Apple Store Checkout</span>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">🔒 256-Bit SSL Encrypted</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-10">
        <div className="glass-apple dark:bg-apple-surface-dark rounded-4xl p-6 sm:p-8 border border-apple-border dark:border-apple-border-dark shadow-2xl space-y-6">
          
          {/* Progress Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-apple-border dark:border-apple-border-dark text-xs font-bold text-apple-gray">
            <span className={step === 1 ? 'text-apple-blue font-extrabold' : ''}>1. Address</span>
            <span className={step === 2 ? 'text-apple-blue font-extrabold' : ''}>2. Shipping</span>
            <span className={step === 3 ? 'text-apple-blue font-extrabold' : ''}>3. Payment</span>
          </div>

          {step === 1 && (
            <div className="space-y-4 text-xs">
              <h2 className="text-base font-extrabold text-apple-dark dark:text-white">1. Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-apple-gray mb-1">Full Name</label>
                  <input type="text" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black border border-apple-border text-apple-dark dark:text-white" />
                </div>
                <div>
                  <label className="block font-bold text-apple-gray mb-1">Phone</label>
                  <input type="text" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black border border-apple-border text-apple-dark dark:text-white" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-apple-gray mb-1">Address</label>
                  <input type="text" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-black border border-apple-border text-apple-dark dark:text-white" />
                </div>
              </div>
              <button onClick={() => setStep(2)} className="w-full py-3.5 rounded-full bg-apple-blue text-white font-extrabold text-xs uppercase tracking-wider mt-4">Continue to Shipping</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 text-xs">
              <h2 className="text-base font-extrabold text-apple-dark dark:text-white">2. Select Express Shipping</h2>
              <div className="p-4 rounded-2xl bg-white dark:bg-black border border-apple-blue flex justify-between items-center">
                <div>
                  <span className="font-bold block text-apple-dark dark:text-white">Apple Express 24h Delivery</span>
                  <span className="text-apple-gray">Guaranteed Delivery Tomorrow</span>
                </div>
                <span className="font-black text-emerald-600">FREE</span>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setStep(1)} className="py-3 px-6 rounded-full glass-apple text-apple-gray font-bold">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 py-3.5 rounded-full bg-apple-blue text-white font-extrabold text-xs uppercase">Continue to Payment</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-xs">
              <h2 className="text-base font-extrabold text-apple-dark dark:text-white">3. Choose Payment Method</h2>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setPaymentMethod('upi')} className={`p-4 rounded-2xl border text-left ${paymentMethod === 'upi' ? 'bg-apple-blue text-white border-apple-blue' : 'bg-white dark:bg-black text-apple-dark dark:text-white border-apple-border'}`}>
                  <Smartphone className="w-5 h-5 mb-1" />
                  <span className="font-bold block">UPI Payment</span>
                </button>
                <button onClick={() => setPaymentMethod('card')} className={`p-4 rounded-2xl border text-left ${paymentMethod === 'card' ? 'bg-apple-blue text-white border-apple-blue' : 'bg-white dark:bg-black text-apple-dark dark:text-white border-apple-border'}`}>
                  <CreditCard className="w-5 h-5 mb-1" />
                  <span className="font-bold block">Credit / Debit Card</span>
                </button>
              </div>
              <button onClick={handleCompleteCheckout} className="w-full py-4 rounded-full bg-apple-blue text-white font-extrabold text-xs uppercase tracking-wider mt-4">Pay ₹{subtotal} & Place Order</button>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
