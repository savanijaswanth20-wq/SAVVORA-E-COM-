"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Search, ShoppingBag, User } from 'lucide-react';
import { KeychainStore, subscribeToStore } from '../types/store';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCounts = () => {
      const cart = KeychainStore.getCart();
      setCartCount(cart.reduce((sum, i) => sum + i.quantity, 0));
    };

    updateCounts();
    const unsubscribe = subscribeToStore(updateCounts);
    return () => unsubscribe();
  }, []);

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Categories', href: '#categories', icon: Grid },
    { label: 'Search', href: '#search', icon: Search },
    { label: 'Cart', href: '/cart', icon: ShoppingBag, badge: cartCount },
    { label: 'Account', href: '/account', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-[56px] bg-white/90 dark:bg-[#0a0d16]/90 backdrop-blur-xl border-t border-gray-200/80 dark:border-gray-800 flex items-center justify-around px-1 shadow-2xl lg:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== '/' && !item.href.startsWith('#') && pathname.startsWith(item.href));
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 h-full relative transition-all duration-300 ${
              isActive ? 'text-[#2563EB] font-black' : 'text-gray-500 dark:text-gray-400 hover:text-[#2563EB]'
            }`}
          >
            {isActive && (
              <span className="absolute top-0 w-8 h-1 rounded-b-full bg-[#2563EB] shadow-[0_0_8px_#2563eb]" />
            )}
            <Icon className="w-[19px] h-[19px]" />
            <span className="text-[9.5px] mt-0.5 font-bold tracking-tight">{item.label}</span>
            {item.badge && item.badge > 0 ? (
              <span className="absolute top-1 right-1/4 min-w-[15px] h-[15px] px-1 rounded-full bg-[#2563EB] text-white text-[8.5px] font-black flex items-center justify-center shadow-xs">
                {item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
};
