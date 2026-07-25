"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Truck, FileText, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { KeychainStore, Order } from '../../services/keychainStore';
import { ConfettiEffect } from '../../components/ConfettiEffect';

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const orders = KeychainStore.getOrders();
    if (orders.length > 0) {
      setOrder(orders[0]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark text-apple-dark dark:text-white font-sans py-16 px-4">
      <ConfettiEffect trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      <div className="max-w-xl mx-auto glass-apple dark:bg-apple-surface-dark rounded-4xl p-8 border border-apple-border dark:border-apple-border-dark text-center space-y-6 shadow-2xl">
        
        <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase">
            Order Confirmed!
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2 text-apple-dark dark:text-white">
            Thank You For Your Purchase!
          </h1>
          <p className="text-xs text-apple-gray mt-1 font-medium">
            Your order has been sent to our express dispatch hub.
          </p>
        </div>

        {order && (
          <div className="glass-floating rounded-3xl p-5 text-left space-y-3 border border-apple-border text-xs">
            <div className="flex justify-between font-bold border-b border-apple-border pb-2">
              <span>Order ID: {order.id}</span>
              <span className="text-apple-blue font-mono">{order.trackingNumber}</span>
            </div>
            <p><strong>Shipping Address:</strong> {order.shippingAddress.street}, {order.shippingAddress.city}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
            <p><strong>Estimated Delivery:</strong> {order.estimatedDelivery}</p>
            <div className="pt-2 border-t border-apple-border flex justify-between font-black text-sm">
              <span>Total Paid:</span>
              <span className="text-apple-blue">₹{order.totalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            href="/account?tab=orders"
            className="w-full sm:flex-1 py-3.5 rounded-full bg-apple-blue text-white font-extrabold text-xs uppercase tracking-wider text-center shadow-md"
          >
            Track Order Status
          </Link>
          <Link
            href="/"
            className="w-full sm:flex-1 py-3.5 rounded-full glass-apple text-apple-dark dark:text-white font-extrabold text-xs uppercase tracking-wider text-center border border-apple-border"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
