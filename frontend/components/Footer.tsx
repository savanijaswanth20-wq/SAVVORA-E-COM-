"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Truck, RotateCcw, Lock, ArrowUp, Send, Heart,
  Instagram, Twitter, Facebook, Youtube, Globe, ChevronRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-12 border-t border-gray-800/80 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-600/10 filter blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Trust Value Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-gray-800/80">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">100% Authentic</h4>
              <p className="text-[11px] text-gray-400 font-medium">Guaranteed original items</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Express Delivery</h4>
              <p className="text-[11px] text-gray-400 font-medium">Pan-India fast shipping</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Easy Returns</h4>
              <p className="text-[11px] text-gray-400 font-medium">Hassle-free 7-day policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Secure Payment</h4>
              <p className="text-[11px] text-gray-400 font-medium">256-Bit SSL protection</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-gray-800/80">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                S
              </span>
              <span className="text-xl font-black text-white tracking-tight uppercase">SAVVORA</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              SAVVORA is India’s premier destination for handcrafted acrylic keychains, bespoke studio accessories, flagship audio gear, and personalized luxury gifts.
            </p>
            
            {/* Newsletter */}
            <div className="pt-2">
              <h5 className="text-xs font-black text-white uppercase tracking-wider mb-2">Subscribe for VIP Deals</h5>
              {subscribed ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  ✓ Thank you for subscribing! Check your inbox for 10% off.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-xs font-medium text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <span>Join</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4">Shop Categories</h4>
            <ul className="space-y-2.5 text-xs font-medium text-gray-400">
              <li><Link href="/products?category=custom-keychains" className="hover:text-white transition-colors">Custom Keychains</Link></li>
              <li><Link href="/products?category=audio" className="hover:text-white transition-colors">Studio Audio &amp; Sound</Link></li>
              <li><Link href="/products?category=phone-accessories" className="hover:text-white transition-colors">Mobile Accessories</Link></li>
              <li><Link href="/products?category=gifts" className="hover:text-white transition-colors">Personalized Gift Bundles</Link></li>
              <li><Link href="/products?filter=bestseller" className="hover:text-white transition-colors">Best Sellers</Link></li>
            </ul>
          </div>

          {/* Account & Support */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4">Account &amp; Help</h4>
            <ul className="space-y-2.5 text-xs font-medium text-gray-400">
              <li><Link href="/account?tab=profile" className="hover:text-white transition-colors">My Account</Link></li>
              <li><Link href="/account?tab=orders" className="hover:text-white transition-colors">Track Orders</Link></li>
              <li><Link href="/account?tab=wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
              <li><Link href="/staff" className="hover:text-white transition-colors">Staff Portal</Link></li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-xs font-medium text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About SAVVORA</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Return Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-1.5">
            <span>&copy; {new Date().getFullYear()} SAVVORA Inc. Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>in India.</span>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a href="#" className="w-8 h-8 rounded-full bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white flex items-center justify-center transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white flex items-center justify-center transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white flex items-center justify-center transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <button
              onClick={scrollToTop}
              title="Scroll to Top"
              className="ml-2 w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
