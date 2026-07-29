"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  CreditCard, 
  Bell, 
  Settings, 
  LogOut, 
  ArrowLeft,
  Truck,
  CheckCircle,
  Plus,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { KeychainStore, UserProfile, Order, KeychainProduct, subscribeToStore } from '../../types/store';
import { AuthModal } from '../../components/AuthModal';

export default function AccountDashboardPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'addresses' | 'payments' | 'notifications' | 'settings'>('profile');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<KeychainProduct[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const loadData = () => {
    const u = KeychainStore.getUser();
    setUser(u);
    setOrders(KeychainStore.getOrders());

    const wIds = KeychainStore.getWishlist();
    const allProds = KeychainStore.getProducts();
    setWishlistProducts(allProds.filter((p) => wIds.includes(p.id)));
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToStore(loadData);
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    KeychainStore.logoutUser();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#111827] text-[#111827] dark:text-white font-sans pb-16 transition-colors duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 dark:bg-[#111827]/80 border-b border-[#E5E7EB] dark:border-gray-800 py-4 px-6 lg:px-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2.5 rounded-full bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700">
            <ArrowLeft className="w-4 h-4 text-[#111827] dark:text-white" />
          </Link>
          <div>
            <h1 className="text-lg font-black tracking-tight text-[#111827] dark:text-white">
              SAVVORA Account Center
            </h1>
            <p className="text-xs text-gray-500 font-medium">Manage profile, track orders, saved addresses & settings.</p>
          </div>
        </div>

        {user ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 font-extrabold text-xs flex items-center gap-1.5 border border-rose-200"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        ) : (
          <button
            onClick={() => setIsAuthOpen(true)}
            className="px-5 py-2.5 rounded-full bg-[#2563EB] text-white font-extrabold text-xs shadow-md"
          >
            Sign In / Register
          </button>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-[1200px] mx-auto px-4 lg:px-8 pt-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation Tabs */}
        <aside className="w-full md:w-64 space-y-1">
          {[
            { id: 'profile', label: 'My Profile', icon: User },
            { id: 'orders', label: `My Orders (${orders.length})`, icon: Package },
            { id: 'wishlist', label: `Wishlist (${wishlistProducts.length})`, icon: Heart },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
            { id: 'payments', label: 'Payments', icon: CreditCard },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center gap-3 transition-all ${
                  isActive
                    ? 'bg-[#111827] text-white shadow-md'
                    : 'bg-[#F8FAFC] dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900 border border-[#E5E7EB] dark:border-gray-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563EB]' : 'text-gray-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {user && (
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center gap-3 text-rose-600 bg-rose-50 dark:bg-rose-950 border border-rose-200 mt-4"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          )}
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-[#F8FAFC] dark:bg-[#1F2937] rounded-[28px] p-6 sm:p-8 border border-[#E5E7EB] dark:border-gray-700 space-y-6">
              <h2 className="text-xl font-black text-[#111827] dark:text-white">👤 My Profile</h2>
              
              {user ? (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-black border border-[#E5E7EB]">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.fullName} className="w-16 h-16 rounded-full object-cover border-2 border-[#2563EB]" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[#2563EB] text-white text-2xl font-black flex items-center justify-center">
                      {user.fullName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-extrabold text-base text-[#111827] dark:text-white">{user.fullName}</h3>
                    <p className="text-xs text-gray-500 font-mono">{user.email || user.phone}</p>
                    <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-[10px] font-black uppercase">
                      Verified via {user.loginProvider}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 space-y-3">
                  <p className="text-xs text-gray-500 font-bold">You are not signed in. Sign in for express checkout & order tracking.</p>
                  <button onClick={() => setIsAuthOpen(true)} className="px-6 py-3 rounded-full bg-[#2563EB] text-white font-extrabold text-xs shadow-md">
                    Sign In with Google / OTP
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-[#F8FAFC] dark:bg-[#1F2937] rounded-[28px] p-6 sm:p-8 border border-[#E5E7EB] dark:border-gray-700 space-y-4">
              <h2 className="text-xl font-black text-[#111827] dark:text-white">📦 My Orders</h2>
              {orders.map((ord) => (
                <div key={ord.id} className="p-4 rounded-2xl bg-white dark:bg-black border border-[#E5E7EB] space-y-2 text-xs">
                  <div className="flex justify-between font-bold">
                    <span>Order ID: {ord.id}</span>
                    <span className="text-[#2563EB] font-mono">{ord.status}</span>
                  </div>
                  <p className="text-gray-500">Tracking: {ord.trackingNumber} ({ord.estimatedDelivery})</p>
                  <div className="pt-2 border-t border-[#E5E7EB] flex justify-between font-black">
                    <span>Total Amount:</span>
                    <span className="text-[#2563EB]">₹{ord.totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="bg-[#F8FAFC] dark:bg-[#1F2937] rounded-[28px] p-6 sm:p-8 border border-[#E5E7EB] dark:border-gray-700 space-y-4">
              <h2 className="text-xl font-black text-[#111827] dark:text-white">❤️ Wishlist Saved Items</h2>
              {wishlistProducts.length === 0 ? (
                <p className="text-xs text-gray-500 font-medium">Your wishlist is currently empty.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistProducts.map((p) => (
                    <div key={p.id} className="p-3 rounded-2xl bg-white dark:bg-black border border-[#E5E7EB] flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <span className="font-bold block text-[#111827] dark:text-white truncate max-w-[140px]">{p.name}</span>
                          <span className="font-black text-[#2563EB]">₹{p.price.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                      <button onClick={() => KeychainStore.addToCart(p)} className="px-3 py-1.5 rounded-full bg-[#111827] text-white font-bold text-[10px]">Add</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="bg-[#F8FAFC] dark:bg-[#1F2937] rounded-[28px] p-6 sm:p-8 border border-[#E5E7EB] dark:border-gray-700 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-[#111827] dark:text-white">📍 Saved Delivery Addresses</h2>
                <button className="px-3 py-1.5 rounded-full bg-[#2563EB] text-white font-bold text-xs flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Address
                </button>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-black border border-[#2563EB] text-xs space-y-1">
                <span className="font-extrabold text-[#111827] dark:text-white block">Aarav Sharma (Home)</span>
                <p className="text-gray-500">42 MG Road, Indiranagar, Bengaluru, Karnataka - 560038</p>
                <p className="text-gray-500">Phone: +91 98765 43210</p>
              </div>
            </div>
          )}

        </div>

      </main>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(u) => setUser(u)}
      />

    </div>
  );
}
