"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Gift, 
  CheckCircle, 
  CreditCard, 
  Smartphone, 
  Sparkles, 
  Tag, 
  Truck, 
  ShieldCheck,
  ChevronRight,
  Heart
} from 'lucide-react';
import { KeychainStore, CartItem, Order, subscribeToStore } from '../../services/keychainStore';
import { ConfettiEffect } from '../../components/ConfettiEffect';

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  // Gift wrapping state
  const [giftWrapping, setGiftWrapping] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [upiApp, setUpiApp] = useState('Google Pay');

  // Address Form
  const [address, setAddress] = useState({
    fullName: 'Aarav Sharma',
    street: '42 MG Road, Indiranagar',
    city: 'Bengaluru',
    zip: '560038',
    phone: '+91 98765 43210'
  });

  // Success State
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const loadCart = () => {
    setCart(KeychainStore.getCart());
  };

  useEffect(() => {
    loadCart();
    const unsubscribe = subscribeToStore(loadCart);
    return () => unsubscribe();
  }, []);

  const handleUpdateQuantity = (id: string, delta: number) => {
    const item = cart.find((c) => c.id === id);
    if (item) {
      KeychainStore.updateCartQuantity(id, item.quantity + delta);
    }
  };

  const handleRemove = (id: string) => {
    KeychainStore.removeFromCart(id);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const cleanCode = couponCode.trim().toUpperCase();
    if (cleanCode === 'KAWAII20') {
      setAppliedDiscountPercent(20);
      setAppliedCouponCode('KAWAII20');
    } else if (cleanCode === 'APPLELOVE') {
      setAppliedDiscountPercent(15);
      setAppliedCouponCode('APPLELOVE');
    } else if (cleanCode === 'KEYCHAIN10') {
      setAppliedDiscountPercent(10);
      setAppliedCouponCode('KEYCHAIN10');
    } else {
      setCouponError('Invalid coupon code. Try "KAWAII20" for 20% off!');
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.customConfig ? item.customConfig.calculatedPrice : item.product.price) * item.quantity, 0);
  const discountAmount = Math.round((subtotal * appliedDiscountPercent) / 100);
  const giftWrapFee = giftWrapping ? 49 : 0;
  const shippingFee = subtotal > 499 ? 0 : 40;
  const finalTotal = Math.max(0, subtotal - discountAmount + giftWrapFee + shippingFee);

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    const newOrder: Order = {
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      totalAmount: finalTotal,
      discountApplied: discountAmount,
      giftWrapping,
      giftMessage: giftWrapping ? giftMessage : undefined,
      paymentMethod: paymentMethod === 'upi' ? `UPI (${upiApp})` : 'Credit / Debit Card',
      shippingAddress: address,
      status: 'Processing',
      trackingNumber: `TRACK-KW-${Math.floor(10000 + Math.random() * 90000)}`,
      estimatedDelivery: '2 Business Days'
    };

    KeychainStore.addOrder(newOrder);
    KeychainStore.clearCart();
    setOrderSuccess(newOrder);
    setShowConfetti(true);
  };

  return (
    <div className="min-h-screen bg-background text-gray-900 font-sans pb-20">
      <ConfettiEffect trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Navigation Header */}
      <header className="sticky top-0 z-30 glass-apple border-b border-pink-200 py-4 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-extrabold text-gray-700 hover:text-pink-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
          <span className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-pink-500" /> One-Page Checkout
          </span>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            🔒 256-Bit SSL Encrypted
          </span>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-8">
        
        {/* If Order Successfully Placed Modal Screen */}
        {orderSuccess ? (
          <div className="max-w-xl mx-auto glass-apple rounded-4xl p-8 border border-pink-200 text-center space-y-6 shadow-2xl my-12 animate-in fade-in">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-pink-500/30">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <span className="badge-kawaii px-3 py-1 rounded-full text-xs font-bold uppercase">Order Placed Successfully!</span>
              <h1 className="text-3xl font-extrabold text-gray-900 mt-2">Thank You, {orderSuccess.shippingAddress.fullName}!</h1>
              <p className="text-xs text-gray-600 mt-1 font-medium">Your handmade keychain is now scheduled for express laser crafting.</p>
            </div>

            <div className="glass-floating rounded-3xl p-5 text-left space-y-3 border border-pink-200 text-xs">
              <div className="flex justify-between font-bold text-gray-900 pb-2 border-b border-gray-100">
                <span>Order ID: {orderSuccess.id}</span>
                <span className="text-pink-600 font-mono">{orderSuccess.trackingNumber}</span>
              </div>
              <p><strong>Payment Method:</strong> {orderSuccess.paymentMethod}</p>
              <p><strong>Delivery Address:</strong> {orderSuccess.shippingAddress.street}, {orderSuccess.shippingAddress.city}</p>
              <p><strong>Estimated Delivery:</strong> {orderSuccess.estimatedDelivery}</p>
              <div className="pt-2 border-t border-gray-100 flex justify-between font-black text-sm text-gray-900">
                <span>Total Amount Paid:</span>
                <span>₹{orderSuccess.totalAmount}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/account"
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-extrabold text-xs uppercase tracking-wider text-center shadow-md"
              >
                Track Order Status
              </Link>
              <Link
                href="/"
                className="flex-1 py-3.5 rounded-2xl glass-apple hover:bg-white text-gray-800 font-extrabold text-xs uppercase tracking-wider text-center border border-pink-200"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : cart.length === 0 ? (
          
          /* Empty Cart State */
          <div className="max-w-md mx-auto text-center py-20 space-y-4">
            <div className="w-20 h-20 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Your Cart is Empty</h2>
            <p className="text-xs text-gray-500 font-medium">Explore our handcrafted keychains or build a custom name keychain!</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-3xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-md"
            >
              Start Shopping <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        ) : (

          /* Shopping Cart & One Page Checkout Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Side: Items & Checkout Form (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* 1. Shopping Cart Items List */}
              <div className="glass-apple rounded-4xl p-6 border border-pink-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h2 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-pink-500" /> Shopping Cart ({cart.length} Items)
                  </h2>
                  <span className="text-xs font-semibold text-gray-500">Apple Glassmorphism Layout</span>
                </div>

                <div className="space-y-4">
                  {cart.map((item) => {
                    const price = item.customConfig ? item.customConfig.calculatedPrice : item.product.price;
                    return (
                      <div key={item.id} className="flex items-center gap-4 p-3 rounded-2xl glass-floating border border-pink-100">
                        <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-xs truncate">{item.product.name}</h3>
                          {item.customConfig ? (
                            <p className="text-[10px] text-pink-600 font-semibold truncate">
                              Engraved Text: "{item.customConfig.text}" ({item.customConfig.baseMaterial})
                            </p>
                          ) : (
                            <span className="text-[10px] text-gray-400">{item.product.category}</span>
                          )}
                          <div className="text-xs font-black text-gray-900 mt-1">₹{price}</div>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-gray-200">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-lg bg-pink-50 text-pink-700 font-bold flex items-center justify-center"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-extrabold text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, +1)}
                            className="w-6 h-6 rounded-lg bg-pink-50 text-pink-700 font-bold flex items-center justify-center"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(item.id)}
                          className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Gift Wrapping Option */}
              <div className="glass-apple rounded-4xl p-6 border border-pink-200 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={giftWrapping}
                    onChange={(e) => setGiftWrapping(e.target.checked)}
                    className="rounded text-pink-500 focus:ring-pink-400"
                  />
                  <Gift className="w-5 h-5 text-pink-600" />
                  <span className="text-xs font-extrabold text-gray-900">Add Signature Kawaii Gift Ribbon & Card (+₹49)</span>
                </label>

                {giftWrapping && (
                  <input
                    type="text"
                    placeholder="Enter custom gift message (e.g. Happy Birthday Mia! 💖)"
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl glass-input-apple text-xs font-medium"
                  />
                )}
              </div>

              {/* 3. Delivery Address Form */}
              <div className="glass-apple rounded-4xl p-6 border border-pink-200 space-y-4">
                <h3 className="font-extrabold text-gray-900 text-sm uppercase tracking-wider flex items-center gap-2">
                  <Truck className="w-4 h-4 text-pink-500" /> Shipping & Delivery Address
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-gray-600 font-bold mb-1">Full Name</label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl glass-input-apple font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-bold mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl glass-input-apple font-medium"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-gray-600 font-bold mb-1">Street Address</label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl glass-input-apple font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-bold mb-1">City / State</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl glass-input-apple font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-bold mb-1">Pincode</label>
                    <input
                      type="text"
                      value={address.zip}
                      onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl glass-input-apple font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Payment Gateway Options */}
              <div className="glass-apple rounded-4xl p-6 border border-pink-200 space-y-4">
                <h3 className="font-extrabold text-gray-900 text-sm uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-pink-500" /> Select Payment Gateway
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-4 rounded-3xl border text-left transition-all flex flex-col justify-between ${
                      paymentMethod === 'upi'
                        ? 'bg-gradient-to-br from-pink-500 to-rose-400 text-white border-pink-500 shadow-md'
                        : 'bg-white/80 text-gray-800 border-gray-200 hover:bg-pink-50'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mb-2" />
                    <div>
                      <span className="font-extrabold text-xs block">UPI Payment</span>
                      <span className="text-[10px] opacity-90">Google Pay, PhonePe, Paytm</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-3xl border text-left transition-all flex flex-col justify-between ${
                      paymentMethod === 'card'
                        ? 'bg-gradient-to-br from-pink-500 to-rose-400 text-white border-pink-500 shadow-md'
                        : 'bg-white/80 text-gray-800 border-gray-200 hover:bg-pink-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mb-2" />
                    <div>
                      <span className="font-extrabold text-xs block">Credit / Debit Card</span>
                      <span className="text-[10px] opacity-90">Visa, Mastercard, RuPay</span>
                    </div>
                  </button>
                </div>

                {paymentMethod === 'upi' && (
                  <div className="flex items-center gap-2 pt-2">
                    {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => setUpiApp(app)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                          upiApp === app
                            ? 'bg-pink-100 text-pink-700 border-pink-400'
                            : 'bg-white text-gray-600 border-gray-200'
                        }`}
                      >
                        {app}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right Side: Order Summary & Pay Button (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="glass-floating rounded-4xl p-6 border border-pink-300 shadow-xl space-y-4">
                <h3 className="font-extrabold text-gray-900 text-base flex items-center justify-between pb-3 border-b border-gray-200">
                  <span>Order Summary</span>
                  <span className="text-xs font-bold text-pink-600">{cart.length} Items</span>
                </h3>

                {/* Coupon Code Input Form */}
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Enter Coupon (e.g. KAWAII20)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-2xl glass-input-apple text-xs font-bold uppercase"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-2xl bg-gray-900 hover:bg-black text-white text-xs font-extrabold"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedCouponCode && (
                    <span className="text-[10px] text-emerald-600 font-bold block">
                      ✓ Coupon {appliedCouponCode} applied ({appliedDiscountPercent}% OFF)!
                    </span>
                  )}
                  {couponError && (
                    <span className="text-[10px] text-rose-500 font-bold block">{couponError}</span>
                  )}
                </form>

                {/* Price Breakdown Table */}
                <div className="space-y-2.5 text-xs text-gray-600 pt-2 border-t border-gray-100 font-medium">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-bold text-gray-900">₹{subtotal}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount ({appliedDiscountPercent}%)</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}

                  {giftWrapping && (
                    <div className="flex justify-between text-pink-600 font-bold">
                      <span>Kawaii Gift Wrapping</span>
                      <span>+₹49</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping Charges</span>
                    <span className="font-bold text-gray-900">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                  </div>

                  <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline text-base font-black text-gray-900">
                    <span>Total Amount</span>
                    <span className="text-2xl text-pink-600">₹{finalTotal}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  className="w-full py-4 rounded-3xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-pink-500/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Place Order & Pay ₹{finalTotal}
                </button>

                <p className="text-[10px] text-center text-gray-400 font-medium">
                  Includes 100% Satisfaction Guarantee & Express Dispatch.
                </p>
              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}
