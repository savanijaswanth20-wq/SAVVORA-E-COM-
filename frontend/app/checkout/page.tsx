"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { MultiStepCheckout } from '../../components/MultiStepCheckout';

export default function CheckoutPage() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark text-apple-dark dark:text-white font-sans pb-20 transition-colors duration-300">
      
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 dark:bg-black/70 border-b border-apple-border dark:border-apple-border-dark py-4 px-6">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <Link href="/cart" className="flex items-center gap-2 text-xs font-bold text-apple-gray hover:text-apple-blue">
            <ArrowLeft className="w-4 h-4" /> Return to Cart
          </Link>
          <span className="font-extrabold text-sm text-apple-dark dark:text-white">Savvora Express Checkout</span>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-10 text-center space-y-6">
        <div className="p-8 glass-apple dark:bg-apple-surface-dark rounded-4xl border border-apple-border dark:border-apple-border-dark shadow-2xl">
          <h1 className="text-2xl font-black mb-2">Secure Checkout</h1>
          <p className="text-xs text-apple-gray mb-6">Complete your payment using Razorpay (UPI, Credit/Debit Card, Net Banking) or Cash on Delivery.</p>

          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="py-4 px-8 rounded-full bg-apple-blue text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 hover:opacity-90 transition-opacity"
          >
            Launch Checkout Portal
          </button>
        </div>
      </main>

      <MultiStepCheckout isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </div>
  );
}
