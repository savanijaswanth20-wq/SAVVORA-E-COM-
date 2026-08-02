"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Heart, User, ShoppingBag } from 'lucide-react';
import { KeychainStore, subscribeToStore } from '../types/store';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const updateCounts = () => {
      const cart = KeychainStore.getCart();
      setCartCount(cart.reduce((sum, i) => sum + i.quantity, 0));
      const wishlist = KeychainStore.getWishlist();
      setWishlistCount(wishlist.length);
    };

    updateCounts();
    const unsubscribe = subscribeToStore(updateCounts);
    return () => unsubscribe();
  }, []);

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Explore', href: '/products', icon: Grid },
    { label: 'Cart', href: '/cart', icon: ShoppingBag, badge: cartCount },
    { label: 'Saved', href: '/account?tab=wishlist', icon: Heart, badge: wishlistCount },
    { label: 'Account', href: '/account', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-[58px] bg-white/90 dark:bg-[#111827]/90 backdrop-blur-xl border-t border-gray-200/80 dark:border-gray-800 flex items-center justify-around px-1 shadow-lg lg:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] relative transition-colors ${
              isActive ? 'text-[#2563EB] font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-[#2563EB]'
            }`}
          >
            <Icon className="w-[21px] h-[21px]" />
            <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
            {item.badge && item.badge > 0 ? (
              <span className="absolute top-1.5 right-1/4 min-w-[15px] h-[15px] px-1 rounded-full bg-[#2563EB] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                {item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
};
