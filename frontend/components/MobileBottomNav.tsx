"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Sparkles, Heart, User, ShoppingBag } from 'lucide-react';
import { KeychainStore } from '../types/store';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const cartCount = KeychainStore.useCartCount();
  const wishlistCount = KeychainStore.useWishlistCount();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Explore', href: '/products', icon: Grid },
    { label: 'Saved', href: '/account?tab=wishlist', icon: Heart, badge: wishlistCount },
    { label: 'Account', href: '/account', icon: User },
  ];

  return (
    <div className="fixed bottom-3 left-3 right-3 z-40 lg:hidden">
      <div className="bg-white/85 dark:bg-[#111827]/85 backdrop-blur-xl border border-gray-200/80 dark:border-gray-800/80 rounded-full px-4 py-2.5 shadow-2xl flex items-center justify-between">
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 transition-colors ${
                isActive ? 'text-[#2563EB] font-bold' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}

        {/* Center Floating Cart Button */}
        <Link
          href="/cart"
          className="relative -top-4 w-12 h-12 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#6366F1] text-white flex items-center justify-center shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-transform"
          aria-label="View Cart"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-sm animate-pulse">
              {cartCount}
            </span>
          )}
        </Link>

        {navItems.slice(2).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 relative transition-colors ${
                isActive ? 'text-[#2563EB] font-bold' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
              {item.badge && item.badge > 0 ? (
                <span className="absolute top-0 right-3 w-2 h-2 rounded-full bg-rose-500"></span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
