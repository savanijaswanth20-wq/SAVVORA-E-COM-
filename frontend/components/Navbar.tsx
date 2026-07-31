"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Sun, 
  Moon, 
  User, 
  X,
  Menu,
  ChevronDown,
  Sparkles,
  MapPin,
  Bell,
  LogOut,
  LogIn
} from 'lucide-react';
import { KeychainStore, subscribeToStore, KeychainProduct, UserProfile } from '../types/store';
import { SupabaseAuthService } from '../services/supabase/auth';
import { AuthModal } from './AuthModal';
import { CompleteProfileModal } from './CompleteProfileModal';

interface NavbarProps {
  onOpenCartDrawer?: () => void;
  onSearchChange?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCartDrawer, onSearchChange }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [products, setProducts] = useState<KeychainProduct[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCompleteProfileOpen, setIsCompleteProfileOpen] = useState(false);

  const updateState = () => {
    setUser(KeychainStore.getUser());
    const cart = KeychainStore.getCart();
    setCartCount(cart.reduce((sum, i) => sum + i.quantity, 0));

    const wishlist = KeychainStore.getWishlist();
    setWishlistCount(wishlist.length);

    setProducts(KeychainStore.getProducts());
    setTheme(KeychainStore.getTheme());
  };

  useEffect(() => {
    updateState();
    const unsubscribe = subscribeToStore(updateState);
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await SupabaseAuthService.signOut();
    } catch (err) {
      console.warn("Sign out error:", err);
    }
    KeychainStore.logoutUser();
    setUser(null);
  };

  const handleToggleTheme = () => {
    const next = KeychainStore.toggleTheme();
    setTheme(next);
  };

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    if (onSearchChange) onSearchChange(val);
  };

  const suggestions = searchQuery.trim()
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/75 dark:bg-black/75 border-b border-apple-border dark:border-apple-border-dark transition-colors duration-300">
      
      {/* Top Header Bar matching SAVVORA Layout Wireframe */}
      <div className="max-w-[1200px] mx-auto px-3 sm:px-4 lg:px-8 py-3 flex items-center justify-between gap-2 sm:gap-6">
        
        {/* SVJ Luxury Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <img
            src="/images/svj-logo.png"
            alt="SVJ Logo"
            className="w-10 h-10 sm:w-11 sm:h-11 object-contain transition-all duration-400 group-hover:scale-105 group-hover:-rotate-2 drop-shadow-[0_0_18px_rgba(255,215,0,0.45)]"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-base sm:text-xl tracking-wider text-apple-dark dark:text-white uppercase font-sans leading-none">
              SAVVORA
            </span>
            <span className="text-[8px] sm:text-[9px] font-bold text-amber-500 dark:text-amber-400 uppercase tracking-widest mt-0.5">
              SVJ LUXURY STOREFRONT
            </span>
          </div>
        </Link>


        {/* Center Floating Search Bar */}
        <div className="flex-1 max-w-md relative hidden sm:block">
          <Search className="w-4 h-4 text-apple-gray absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Products..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="w-full pl-11 pr-10 py-2.5 rounded-full bg-apple-surface dark:bg-apple-surface-dark text-xs font-medium border border-apple-border dark:border-apple-border-dark text-apple-dark dark:text-white focus:outline-none focus:border-apple-blue transition-colors"
          />

          {/* Autocomplete Dropdown */}
          {isSearchFocused && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 glass-apple rounded-2xl p-3 shadow-2xl z-50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-apple-blue px-2 block mb-2">Instant Search</span>
              <div className="space-y-1 max-h-56 overflow-y-auto">
                {suggestions.map((p) => (
                  <Link
                    key={p.id}
                    href="#products"
                    onClick={() => setIsSearchFocused(false)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-apple-surface dark:hover:bg-apple-surface-dark transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                      <span className="text-xs font-bold text-apple-dark dark:text-white truncate">{p.name}</span>
                    </div>
                    <span className="text-xs font-black text-apple-blue">₹{p.price.toLocaleString("en-IN")}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Actions: 👤 ❤️ 🛒 Menu */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          
          {/* Flipkart-Style User Profile & Account Dropdown 👤 */}
          <div className="relative group">
            <Link
              href="/account"
              className="p-2 sm:p-2.5 rounded-full bg-apple-surface dark:bg-apple-surface-dark text-apple-dark dark:text-white border border-apple-border dark:border-apple-border-dark hover:scale-105 transition-all flex items-center gap-1.5"
              title="My Account"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.fullName} className="w-4 h-4 rounded-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-[#2563EB]" />
              )}
              <span className="text-xs font-bold hidden sm:inline max-w-[110px] truncate">
                {user ? `Hi, ${user.fullName.split(' ')[0]}` : 'Account'}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-400 group-hover:rotate-180 transition-transform hidden sm:inline" />
            </Link>

            {/* Flipkart-Style Account Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#1F2937] rounded-2xl p-2 shadow-2xl border border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50">
              <div className="p-3 border-b border-gray-100 dark:border-gray-700 mb-1 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    {user ? 'Welcome back,' : 'Welcome to SAVVORA'}
                  </span>
                  <span className="text-xs font-black text-[#111827] dark:text-white truncate block max-w-[170px]">
                    {user ? user.fullName : 'Customer Account'}
                  </span>
                </div>
                {!user && (
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="px-3 py-1 rounded-full bg-[#2563EB] text-white text-[10px] font-extrabold shadow-sm hover:bg-blue-600 transition-colors"
                  >
                    Login
                  </button>
                )}
              </div>

              <div className="space-y-0.5 font-bold text-xs">
                {/* 1. My Profile */}
                <Link href="/account?tab=profile" className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors">
                  <User className="w-4 h-4 text-[#2563EB]" />
                  <span>My Profile</span>
                </Link>

                {/* 2. My Orders */}
                <Link href="/account?tab=orders" className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors">
                  <ShoppingBag className="w-4 h-4 text-emerald-500" />
                  <span>My Orders</span>
                </Link>

                {/* 3. Wishlist */}
                <Link href="/account?tab=wishlist" className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Wishlist</span>
                  </div>
                  {wishlistCount > 0 && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-rose-500 text-white">{wishlistCount}</span>
                  )}
                </Link>

                {/* 4. Addresses */}
                <Link href="/account?tab=addresses" className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span>Addresses</span>
                </Link>

                {/* 5. Notifications */}
                <Link href="/account?tab=notifications" className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors">
                  <Bell className="w-4 h-4 text-purple-500" />
                  <span>Notifications</span>
                </Link>

                {/* 6. Logout */}
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 transition-colors mt-1 border-t border-gray-100 dark:border-gray-700"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 text-[#2563EB] transition-colors mt-1 border-t border-gray-100 dark:border-gray-700"
                  >
                    <LogIn className="w-4 h-4 text-[#2563EB]" />
                    <span>Sign In / Register</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Wishlist ❤️ */}
          <Link
            href="/account?tab=wishlist"
            className="relative p-2.5 rounded-full bg-apple-surface dark:bg-apple-surface-dark text-apple-dark dark:text-white border border-apple-border dark:border-apple-border-dark hover:scale-105 transition-all"
            title="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Shopping Cart Bag 🛒 */}
          <button
            onClick={onOpenCartDrawer}
            className="relative p-2.5 rounded-full bg-apple-blue text-white shadow-md shadow-apple-blue/20 hover:bg-apple-blue-hover hover:scale-105 transition-all flex items-center justify-center"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-apple-blue text-[10px] font-black flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={handleToggleTheme}
            className="p-2.5 rounded-full bg-apple-surface dark:bg-apple-surface-dark text-apple-dark dark:text-white border border-apple-border dark:border-apple-border-dark hover:scale-105 transition-all"
            title="Toggle Light / Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-apple-dark" />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="md:hidden p-2 rounded-xl text-apple-dark dark:text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>

      </div>

      {/* Mobile Search Bar (Visible on mobile viewports below 640px) */}
      <div className="px-4 pb-3 sm:hidden">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-apple-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products, brands..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-apple-surface dark:bg-apple-surface-dark text-xs font-medium border border-apple-border dark:border-apple-border-dark text-apple-dark dark:text-white focus:outline-none focus:border-apple-blue"
          />
        </div>
      </div>

      {/* Mobile Drawer Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-apple-border dark:border-apple-border-dark bg-white/95 dark:bg-[#0a0d16]/95 backdrop-blur-xl px-4 py-5 space-y-4 animate-fade-in shadow-2xl">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-apple-surface dark:bg-apple-surface-dark">
            <div className="flex items-center gap-3">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.fullName} className="w-9 h-9 rounded-full object-cover" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
              )}
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Account</span>
                <span className="text-xs font-black text-[#111827] dark:text-white truncate max-w-[160px] block">
                  {user ? user.fullName : 'Guest User'}
                </span>
              </div>
            </div>
            {user ? (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-500 text-xs font-extrabold"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAuthOpen(true);
                }}
                className="px-4 py-1.5 rounded-full bg-[#2563EB] text-white text-xs font-extrabold"
              >
                Login / Register
              </button>
            )}
          </div>

          <div className="space-y-1 text-sm font-bold">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-apple-surface dark:hover:bg-apple-surface-dark text-[#111827] dark:text-white"
            >
              <span>Home Storefront</span>
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-apple-surface dark:hover:bg-apple-surface-dark text-[#111827] dark:text-white"
            >
              <span>All Products Catalogue</span>
            </Link>
            <Link
              href="/account?tab=orders"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-apple-surface dark:hover:bg-apple-surface-dark text-[#111827] dark:text-white"
            >
              <span>My Orders</span>
              <ShoppingBag className="w-4 h-4 text-emerald-500" />
            </Link>
            <Link
              href="/account?tab=wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-apple-surface dark:hover:bg-apple-surface-dark text-[#111827] dark:text-white"
            >
              <span>Wishlist ({wishlistCount})</span>
              <Heart className="w-4 h-4 text-rose-500" />
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-apple-surface dark:hover:bg-apple-surface-dark text-[#2563EB]"
            >
              <span>Admin Dashboard</span>
            </Link>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(u, isNewUser) => {
          setUser(u);
          if (isNewUser || !u.profileCompleted) {
            setIsCompleteProfileOpen(true);
          }
        }}
      />

      <CompleteProfileModal
        isOpen={isCompleteProfileOpen}
        user={user}
        onClose={() => setIsCompleteProfileOpen(false)}
        onSuccess={(updated) => setUser(updated)}
      />

    </header>
  );
};
