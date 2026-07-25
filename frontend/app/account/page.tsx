"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  CreditCard, 
  Bell, 
  Award, 
  FileText, 
  ArrowLeft, 
  CheckCircle, 
  Truck, 
  Clock, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Gift
} from 'lucide-react';
import { KeychainStore, Order, KeychainProduct, subscribeToStore } from '../../services/keychainStore';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'rewards' | 'notifications'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>([]);
  const [products, setProducts] = useState<KeychainProduct[]>([]);
  const [rewardPoints, setRewardPoints] = useState(450);

  const loadData = () => {
    setOrders(KeychainStore.getOrders());
    setWishlistProductIds(KeychainStore.getWishlist());
    setProducts(KeychainStore.getProducts());
    setRewardPoints(KeychainStore.getRewardPoints());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToStore(loadData);
    return () => unsubscribe();
  }, []);

  const wishlistProducts = products.filter((p) => wishlistProductIds.includes(p.id));

  const handleRedeemPoints = (pts: number) => {
    if (KeychainStore.redeemRewardPoints(pts)) {
      alert(`Success! Redeemed ${pts} reward points for ₹${pts} off coupon code: REWARD${pts}`);
    } else {
      alert('Insufficient points balance!');
    }
  };

  return (
    <div className="min-h-screen bg-background text-gray-900 font-sans pb-20">
      
      {/* Header */}
      <header className="sticky top-0 z-30 glass-apple border-b border-pink-200 py-4 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-extrabold text-gray-700 hover:text-pink-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
          <span className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
            <User className="w-4 h-4 text-pink-500" /> Apple ID Customer Profile
          </span>
          <span className="text-xs font-bold text-pink-600 badge-kawaii px-3 py-1 rounded-full">
            VIP Member
          </span>
        </div>
      </header>

      {/* Main Profile Layout */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-8">
        
        {/* Top Profile Summary Card */}
        <div className="glass-floating rounded-4xl p-6 md:p-8 border border-pink-300 shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-pink-500/20 border-2 border-white">
              💖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-gray-900">Aarav Sharma</h1>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-extrabold px-2 py-0.5 rounded-full">Verified</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">aarav.sharma@example.com • Member since 2024</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-center">
            <div className="px-4 py-2 rounded-2xl glass-apple border border-pink-200">
              <span className="text-[10px] text-gray-500 font-bold uppercase block">Reward Points</span>
              <span className="text-xl font-black text-pink-600">{rewardPoints} PTS</span>
            </div>
            <div className="px-4 py-2 rounded-2xl glass-apple border border-pink-200">
              <span className="text-[10px] text-gray-500 font-bold uppercase block">Total Orders</span>
              <span className="text-xl font-black text-gray-900">{orders.length}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation & Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation Sidebar (4 cols) */}
          <div className="lg:col-span-4 glass-apple rounded-4xl p-4 border border-pink-200 space-y-1">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full p-3.5 rounded-2xl text-xs font-bold text-left transition-all flex items-center justify-between ${
                activeTab === 'orders' ? 'bg-pink-500 text-white shadow-md' : 'text-gray-700 hover:bg-pink-50'
              }`}
            >
              <span className="flex items-center gap-2.5"><ShoppingBag className="w-4 h-4" /> Order History ({orders.length})</span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full p-3.5 rounded-2xl text-xs font-bold text-left transition-all flex items-center justify-between ${
                activeTab === 'wishlist' ? 'bg-pink-500 text-white shadow-md' : 'text-gray-700 hover:bg-pink-50'
              }`}
            >
              <span className="flex items-center gap-2.5"><Heart className="w-4 h-4" /> Saved Wishlist ({wishlistProducts.length})</span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            <button
              onClick={() => setActiveTab('rewards')}
              className={`w-full p-3.5 rounded-2xl text-xs font-bold text-left transition-all flex items-center justify-between ${
                activeTab === 'rewards' ? 'bg-pink-500 text-white shadow-md' : 'text-gray-700 hover:bg-pink-50'
              }`}
            >
              <span className="flex items-center gap-2.5"><Award className="w-4 h-4" /> Rewards & Loyalty</span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full p-3.5 rounded-2xl text-xs font-bold text-left transition-all flex items-center justify-between ${
                activeTab === 'addresses' ? 'bg-pink-500 text-white shadow-md' : 'text-gray-700 hover:bg-pink-50'
              }`}
            >
              <span className="flex items-center gap-2.5"><MapPin className="w-4 h-4" /> Saved Addresses</span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>
          </div>

          {/* Right Main Content Panel (8 cols) */}
          <div className="lg:col-span-8">
            
            {/* Tab 1: Orders History */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-pink-500" /> My Orders & Shipment Tracking
                </h2>

                {orders.map((ord) => (
                  <div key={ord.id} className="glass-apple rounded-4xl p-6 border border-pink-200 space-y-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100 text-xs">
                      <div>
                        <span className="font-extrabold text-gray-900">{ord.id}</span>
                        <span className="text-gray-400 ml-2 font-medium">Placed on {ord.date}</span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 font-extrabold text-[10px]">
                        Status: {ord.status}
                      </span>
                    </div>

                    {/* Timeline status indicator */}
                    <div className="flex items-center justify-between py-2 text-[10px] font-bold text-gray-500">
                      <div className="flex items-center gap-1 text-emerald-600"><CheckCircle className="w-3.5 h-3.5" /> Order Placed</div>
                      <div className="flex items-center gap-1 text-emerald-600"><Sparkles className="w-3.5 h-3.5" /> Laser Engraved</div>
                      <div className="flex items-center gap-1 text-pink-600"><Truck className="w-3.5 h-3.5 animate-bounce" /> Shipped ({ord.trackingNumber})</div>
                      <div className="flex items-center gap-1 text-gray-400"><Clock className="w-3.5 h-3.5" /> {ord.estimatedDelivery}</div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-white/60">
                          <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">{item.product.name}</p>
                            <span className="text-[10px] text-gray-500">Qty: {item.quantity}</span>
                          </div>
                          <span className="text-xs font-black text-gray-900">₹{item.product.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer & Invoice */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => alert(`Downloading official PDF Invoice for ${ord.id}...`)}
                        className="text-pink-600 font-bold flex items-center gap-1 hover:underline"
                      >
                        <FileText className="w-4 h-4" /> Download PDF Invoice
                      </button>
                      <div className="text-right">
                        <span className="text-gray-500 font-medium block">Total Paid</span>
                        <span className="text-base font-black text-gray-900">₹{ord.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" /> My Saved Wishlist ({wishlistProducts.length})
                </h2>

                {wishlistProducts.length === 0 ? (
                  <div className="glass-apple rounded-4xl p-8 text-center text-xs text-gray-500">
                    No saved keychains in your wishlist yet!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistProducts.map((p) => (
                      <div key={p.id} className="glass-kawaii-card rounded-3xl p-4 flex items-center gap-4">
                        <img src={p.image} alt={p.name} className="w-20 h-20 rounded-2xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-xs truncate">{p.name}</h3>
                          <span className="text-xs font-black text-pink-600">₹{p.price}</span>
                          <button
                            onClick={() => {
                              KeychainStore.addToCart(p);
                              alert('Added to cart!');
                            }}
                            className="mt-2 px-3 py-1.5 rounded-xl bg-pink-500 text-white text-[10px] font-bold block"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Rewards */}
            {activeTab === 'rewards' && (
              <div className="space-y-6">
                <div className="glass-floating rounded-4xl p-6 border border-pink-300 text-center space-y-3">
                  <Award className="w-12 h-12 text-pink-500 mx-auto" />
                  <h2 className="text-2xl font-black text-gray-900">Kawaii VIP Rewards Club</h2>
                  <p className="text-xs text-gray-600 font-medium">Earn 1 point for every ₹10 spent. Convert points into discount coupons!</p>
                  <div className="text-3xl font-black text-pink-600">{rewardPoints} Available Points</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="glass-apple rounded-3xl p-5 border border-pink-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-gray-900 text-xs">₹100 Off Discount Coupon</h4>
                      <span className="text-[10px] text-gray-500">Requires 100 Points</span>
                    </div>
                    <button
                      onClick={() => handleRedeemPoints(100)}
                      className="px-4 py-2 rounded-xl bg-pink-500 text-white text-xs font-bold shadow-sm"
                    >
                      Redeem
                    </button>
                  </div>

                  <div className="glass-apple rounded-3xl p-5 border border-pink-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-gray-900 text-xs">₹300 Off Discount Coupon</h4>
                      <span className="text-[10px] text-gray-500">Requires 300 Points</span>
                    </div>
                    <button
                      onClick={() => handleRedeemPoints(300)}
                      className="px-4 py-2 rounded-xl bg-pink-500 text-white text-xs font-bold shadow-sm"
                    >
                      Redeem
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Addresses */}
            {activeTab === 'addresses' && (
              <div className="glass-apple rounded-4xl p-6 border border-pink-200 space-y-4">
                <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-pink-500" /> Saved Delivery Addresses
                </h2>
                <div className="p-4 rounded-2xl bg-white border border-pink-200 text-xs space-y-1">
                  <span className="font-bold text-gray-900 block">Default Shipping Address</span>
                  <p className="text-gray-600 font-medium">Aarav Sharma • +91 98765 43210</p>
                  <p className="text-gray-500">42 MG Road, Indiranagar, Bengaluru, KA - 560038</p>
                </div>
              </div>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}
