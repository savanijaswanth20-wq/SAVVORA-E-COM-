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
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-[60px] bg-white/92 dark:bg-[#0a0d16]/92 backdrop-blur-2xl border-t border-gray-200/80 dark:border-gray-800/80 flex items-center justify-around px-1 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden bottom-nav-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== '/' && !item.href.startsWith('#') && pathname.startsWith(item.href));
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 h-full relative transition-all duration-200 gap-0.5 ${
              isActive ? 'text-[#2563EB]' : 'text-gray-400 dark:text-gray-500 hover:text-[#2563EB]'
            }`}
          >
            {/* Active indicator bar */}
            {isActive && (
              <span className="absolute top-0 w-6 h-0.5 rounded-b-full bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
            )}

            {/* Icon with slight scale on active */}
            <div className={`relative transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
              <Icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.5 : 2} />
              
              {/* Cart badge */}
              {item.badge && item.badge > 0 ? (
                <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-[#2563EB] text-white text-[8px] font-black flex items-center justify-center shadow-sm leading-none">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              ) : null}
            </div>

            <span className={`text-[11px] font-semibold tracking-tight leading-none ${isActive ? 'font-bold' : ''}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
