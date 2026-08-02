"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
  Plus,
  Camera,
  Upload,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Search,
  Lock,
  Gift,
  HelpCircle,
  Moon,
  Sun,
  Globe,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Copy,
  Smartphone,
  Check,
  Key,
  Shield,
  FileText,
  Truck,
  RotateCcw,
  XCircle,
  ShoppingBag,
  Star,
  Download,
  Share2,
  Eye,
  RefreshCw,
  MessageSquare,
  HelpCircle as QuestionIcon,
  AlertTriangle,
  Info,
  Sliders,
  Sparkles,
  Zap,
  CheckSquare
} from 'lucide-react';
import { KeychainStore, UserProfile, Order, KeychainProduct, subscribeToStore } from '../../types/store';
import { SupabaseAuthService } from '../../services/supabase/auth';
import { AuthModal } from '../../components/AuthModal';
import { InvoiceViewer, InvoiceData } from '../../components/InvoiceViewer';

type SettingsSection = 
  | 'account' 
  | 'orders' 
  | 'shopping' 
  | 'addresses' 
  | 'payments' 
  | 'notifications' 
  | 'rewards' 
  | 'preferences' 
  | 'privacy' 
  | 'help'
  | 'logout';

function AccountSettingsContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as SettingsSection) || 'account';

  const [activeSection, setActiveSection] = useState<SettingsSection>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<KeychainProduct[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<KeychainProduct[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Invoice Viewer Modal State
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // 2FA & Password States
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [securityForm, setSecurityForm] = useState({ currentPass: '', newPass: '', confirmPass: '' });
  const [securityMsg, setSecurityMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Avatar Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Address Management State
  const [addresses, setAddresses] = useState([
    { id: 'addr-1', name: 'Aarav Sharma', type: 'Home', street: '42 MG Road, Indiranagar', city: 'Bengaluru', state: 'Karnataka', zip: '560038', phone: '+91 98765 43210', isDefault: true },
    { id: 'addr-2', name: 'Aarav Sharma', type: 'Office', street: 'Tech Park Tower 3, Whitefield', city: 'Bengaluru', state: 'Karnataka', zip: '560066', phone: '+91 98765 43210', isDefault: false }
  ]);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddr, setNewAddr] = useState({ name: '', type: 'Home', street: '', city: '', state: '', zip: '', phone: '' });

  // Notifications Toggles
  const [notifs, setNotifs] = useState({
    orderUpdates: true,
    promotions: true,
    priceDropAlerts: true,
    backInStock: true,
    emailNotifs: true,
    smsNotifs: true,
    pushNotifs: true
  });

  // Preferences State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currency, setCurrency] = useState('INR (₹)');
  const [language, setLanguage] = useState('English');
  const [highContrast, setHighContrast] = useState(false);

  // Gift Card & Wallet
  const [walletBalance] = useState(500); // ₹500 Savvora Cash
  const [giftCardCode, setGiftCardCode] = useState('');
  const [giftCardMsg, setGiftCardMsg] = useState<string | null>(null);

  // Copy Feedback
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const tabParam = searchParams.get('tab') as SettingsSection;
    if (tabParam) setActiveSection(tabParam);
  }, [searchParams]);

  const loadData = () => {
    const u = KeychainStore.getUser();
    setUser(u);
    if (u) {
      setEditName(u.fullName || '');
      setEditEmail(u.email || '');
      setEditPhone(u.phone || '');
    }
    setOrders(KeychainStore.getOrders());

    const wIds = KeychainStore.getWishlist();
    const allProds = KeychainStore.getProducts();
    setWishlistProducts(allProds.filter((p) => wIds.includes(p.id)));
    setRecentlyViewed(KeychainStore.getRecentlyViewed());
    setTheme(KeychainStore.getTheme());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToStore(loadData);
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

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    setAvatarMessage(null);

    try {
      const publicUrl = await SupabaseAuthService.uploadAvatar(file);
      if (user) {
        const updatedUser = { ...user, avatar: publicUrl };
        KeychainStore.setUser(updatedUser);
        setUser(updatedUser);
      }
      setAvatarMessage({ type: 'success', text: 'Profile photo updated successfully!' });
    } catch (err: any) {
      setAvatarMessage({ type: 'error', text: err.message || 'Failed to upload avatar.' });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfile = () => {
    if (!user) return;
    const updated = {
      ...user,
      fullName: editName,
      email: editEmail || user.email,
      phone: editPhone || user.phone,
      profileCompleted: true
    };
    KeychainStore.setUser(updated);
    setUser(updated);
    setIsEditingProfile(false);
    setAvatarMessage({ type: 'success', text: 'Profile information updated successfully!' });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!securityForm.newPass || securityForm.newPass !== securityForm.confirmPass) {
      setSecurityMsg({ type: 'error', text: 'New passwords do not match!' });
      return;
    }
    setSecurityMsg({ type: 'success', text: 'Password updated successfully!' });
    setSecurityForm({ currentPass: '', newPass: '', confirmPass: '' });
    setTimeout(() => setSecurityMsg(null), 3000);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.name || !newAddr.street || !newAddr.city) return;
    const created = {
      ...newAddr,
      id: `addr-${Date.now()}`,
      isDefault: addresses.length === 0
    };
    setAddresses([...addresses, created]);
    setShowAddAddressModal(false);
    setNewAddr({ name: '', type: 'Home', street: '', city: '', state: '', zip: '', phone: '' });
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const handleRedeemGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftCardCode.trim()) return;
    setGiftCardMsg(`Gift Card "${giftCardCode.toUpperCase()}" redeemed! ₹500 added to Savvora Cash balance.`);
    setGiftCardCode('');
    setTimeout(() => setGiftCardMsg(null), 4000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleViewInvoice = (ord: Order) => {
    const inv: InvoiceData = {
      orderNumber: ord.id,
      orderDate: ord.date,
      customerName: user?.fullName || 'Aarav Sharma',
      customerPhone: user?.phone || '+91 98765 43210',
      shippingAddress: {
        street: ord.shippingAddress?.street || '42 MG Road',
        city: ord.shippingAddress?.city || 'Bengaluru',
        state: ord.shippingAddress?.state || 'Karnataka',
        zip: ord.shippingAddress?.zip || '560038'
      },
      paymentMethod: ord.paymentMethod || 'Razorpay Gateway',
      paymentStatus: 'completed',
      transactionId: `TXN-${ord.id}`,
      items: ord.items.map(i => ({
        name: i.product.name,
        sku: i.product.sku || 'SKU-SAV-101',
        price: i.product.price,
        quantity: i.quantity,
        total: i.product.price * i.quantity
      })),
      subtotal: ord.totalAmount,
      discount: 0,
      shippingFee: 0,
      totalAmount: ord.totalAmount
    };
    setInvoiceData(inv);
    setShowInvoiceModal(true);
  };

  const SECTIONS = [
    { id: 'account', label: 'Account & Profile', icon: User, desc: 'Profile, photo & 2FA' },
    { id: 'orders', label: 'My Orders', icon: Package, count: orders.length, desc: 'Tracking & GST Invoices' },
    { id: 'shopping', label: 'Shopping', icon: Heart, count: wishlistProducts.length, desc: 'Wishlist & Recently Viewed' },
    { id: 'addresses', label: 'Addresses', icon: MapPin, count: addresses.length, desc: 'Delivery locations' },
    { id: 'payments', label: 'Payments', icon: CreditCard, desc: 'Saved UPI, Cards & Wallet' },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Email, SMS & Alerts' },
    { id: 'rewards', label: 'Rewards & Referrals', icon: Gift, desc: 'Coins, Coupons & Refer' },
    { id: 'preferences', label: 'Preferences', icon: Settings, desc: 'Theme, Language & Currency' },
    { id: 'privacy', label: 'Privacy & Security', icon: Lock, desc: 'Sessions & Data Export' },
    { id: 'help', label: 'Help & Support', icon: HelpCircle, desc: '24/7 Hotline & FAQs' },
    { id: 'logout', label: 'Logout', icon: LogOut, desc: 'Sign out of account' },
  ];

  const filteredSections = searchQuery.trim()
    ? SECTIONS.filter(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()) || s.desc.toLowerCase().includes(searchQuery.toLowerCase()))
    : SECTIONS;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0d16] text-gray-900 dark:text-white font-sans pb-20 transition-colors duration-300">
      
      {/* Invoice Viewer Modal */}
      <InvoiceViewer isOpen={showInvoiceModal} onClose={() => setShowInvoiceModal(false)} invoice={invoiceData} />

      {/* Sticky Apple Header */}
      <header className="sticky top-0 z-30 backdrop-blur-2xl bg-white/90 dark:bg-[#0a0d16]/90 border-b border-gray-200/80 dark:border-gray-800/80 px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm sm:text-base font-black tracking-tight text-gray-900 dark:text-white">
              SAVVORA Account Settings
            </h1>
            <p className="text-[10px] text-gray-400 font-bold hidden xs:block">Manage profile, orders, saved cards &amp; security</p>
          </div>
        </div>

        {/* Live Search Within Settings */}
        <div className="relative flex-1 max-w-[240px]">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search settings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[34px] pl-8 pr-3 rounded-full bg-gray-100 dark:bg-gray-900 text-xs font-medium border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white outline-none focus:border-blue-600 transition-colors"
          />
        </div>

        {user ? (
          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-extrabold text-[11px] flex items-center gap-1 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 transition-colors shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Logout</span>
          </button>
        ) : (
          <button
            onClick={() => setIsAuthOpen(true)}
            className="px-4 py-1.5 rounded-full bg-[#2563EB] text-white font-extrabold text-[11px] shadow-sm hover:bg-blue-600 transition-colors shrink-0"
          >
            Sign In
          </button>
        )}
      </header>

      {/* Main Grid Layout */}
      <main className="max-w-[1240px] mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 flex flex-col md:flex-row gap-4 sm:gap-6">
        
        {/* Navigation Sidebar / Mobile Chips */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="flex md:flex-col overflow-x-auto scrollbar-none gap-1.5 md:space-y-1 pb-1 md:pb-0">
            {filteredSections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;

              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    if (sec.id === 'logout') {
                      handleLogout();
                    } else {
                      setActiveSection(sec.id as any);
                    }
                  }}
                  className={`px-3 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition-all whitespace-nowrap shrink-0 min-h-[40px] ${
                    sec.id === 'logout'
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-900 hover:bg-rose-100'
                      : isActive
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md'
                      : 'bg-gray-50 dark:bg-gray-900/60 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200/80 dark:border-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${sec.id === 'logout' ? 'text-rose-600' : isActive ? 'text-[#2563EB]' : 'text-gray-400'}`} />
                    <span>{sec.label}</span>
                  </div>
                  {sec.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ml-2 ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                    }`}>
                      {sec.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content Container */}
        <div className="flex-1 min-w-0">
          
          {/* SECTION 1: ACCOUNT (Profile, Photo, Edit, Password, Email/Phone Verification, 2FA) */}
          {activeSection === 'account' && (
            <div className="p-4 sm:p-6 rounded-2xl bg-gray-50/70 dark:bg-gray-900/50 border border-gray-200/80 dark:border-gray-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" /> Account &amp; Security Profile
                </h2>
                {user && (
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold flex items-center gap-1 hover:bg-gray-100 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-blue-600" /> {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                  </button>
                )}
              </div>

              {user ? (
                <div className="space-y-4">
                  {/* Profile Header Card & Photo Upload */}
                  <div className="p-4 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative group">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.fullName} className="w-16 h-16 rounded-full object-cover border-2 border-blue-600" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-[#2563EB] text-white text-2xl font-black flex items-center justify-center border-2 border-blue-400">
                          {user.fullName.charAt(0)}
                        </div>
                      )}
                      
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                        className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#2563EB] text-white shadow-md hover:bg-blue-600 transition-all"
                        title="Upload Photo"
                      >
                        {isUploadingAvatar ? (
                          <Upload className="w-3 h-3 animate-spin" />
                        ) : (
                          <Camera className="w-3 h-3" />
                        )}
                      </button>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>

                    <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
                      <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-1.5 justify-center sm:justify-start">
                        <span>{user.fullName}</span>
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                      </h3>
                      <p className="text-xs text-gray-400 font-mono truncate">{user.email || user.phone || 'No email registered'}</p>
                      
                      <div className="flex flex-wrap gap-1.5 pt-1 justify-center sm:justify-start">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Email Verified
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase">
                          Via {user.loginProvider}
                        </span>
                      </div>
                    </div>
                  </div>

                  {avatarMessage && (
                    <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                      avatarMessage.type === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-200'
                        : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 border border-rose-200'
                    }`}>
                      {avatarMessage.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                      <span>{avatarMessage.text}</span>
                    </div>
                  )}

                  {/* Profile Edit Form */}
                  {isEditingProfile ? (
                    <div className="p-4 rounded-xl bg-white dark:bg-black border border-blue-500/40 space-y-3">
                      <h4 className="font-bold text-xs text-gray-900 dark:text-white">Edit Profile Details</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block font-bold text-gray-400 mb-1 text-[10px] uppercase">Full Name</label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-medium outline-none focus:border-blue-600"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-400 mb-1 text-[10px] uppercase">Email Address</label>
                          <input
                            type="email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-medium outline-none focus:border-blue-600"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block font-bold text-gray-400 mb-1 text-[10px] uppercase">Phone Number</label>
                          <input
                            type="text"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-medium outline-none focus:border-blue-600"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={handleSaveProfile}
                          className="px-4 py-2 rounded-full bg-[#2563EB] text-white text-xs font-bold hover:bg-blue-600 transition-colors"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setIsEditingProfile(false)}
                          className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 space-y-0.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Full Name</span>
                        <p className="font-extrabold text-gray-900 dark:text-white">{user.fullName}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 space-y-0.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Email Address</span>
                        <p className="font-extrabold text-gray-900 dark:text-white truncate">{user.email || 'Not provided'}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 space-y-0.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</span>
                        <p className="font-extrabold text-gray-900 dark:text-white">{user.phone || 'Not provided'}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 space-y-0.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Account ID</span>
                        <p className="font-mono text-[11px] font-bold text-gray-900 dark:text-white truncate">{user.id}</p>
                      </div>
                    </div>
                  )}

                  {/* Two-Factor Authentication (2FA) & Change Password */}
                  <div className="p-4 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-gray-900 dark:text-white block">Two-Factor Authentication (2FA)</span>
                        <span className="text-[10px] text-gray-400">Secure your account with SMS / OTP verification</span>
                      </div>
                      <button
                        onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                        className={`px-3 py-1.5 rounded-full font-bold text-[10px] uppercase transition-colors ${
                          is2FAEnabled ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {is2FAEnabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>

                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">Change Password</h4>
                      <form onSubmit={handlePasswordChange} className="space-y-2">
                        <input
                          type="password"
                          placeholder="Current Password"
                          value={securityForm.currentPass}
                          onChange={(e) => setSecurityForm({ ...securityForm, currentPass: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none text-xs"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="password"
                            placeholder="New Password"
                            value={securityForm.newPass}
                            onChange={(e) => setSecurityForm({ ...securityForm, newPass: e.target.value })}
                            className="px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none text-xs"
                          />
                          <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={securityForm.confirmPass}
                            onChange={(e) => setSecurityForm({ ...securityForm, confirmPass: e.target.value })}
                            className="px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none text-xs"
                          />
                        </div>
                        <button type="submit" className="px-4 py-1.5 rounded-full bg-[#2563EB] text-white font-extrabold text-xs">
                          Update Password
                        </button>
                        {securityMsg && (
                          <p className={`text-[10px] font-bold ${securityMsg.type === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {securityMsg.text}
                          </p>
                        )}
                      </form>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center py-8 space-y-3">
                  <p className="text-xs text-gray-400 font-bold">You are not signed in. Sign in to access your profile &amp; security.</p>
                  <button onClick={() => setIsAuthOpen(true)} className="px-6 py-2.5 rounded-full bg-[#2563EB] text-white font-extrabold text-xs shadow-md hover:bg-blue-600 transition-colors">
                    Sign In with Email / Google
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: ORDERS (My Orders, Track, Cancel, Return/Refund, Download Invoice) */}
          {activeSection === 'orders' && (
            <div className="p-4 sm:p-6 rounded-2xl bg-gray-50/70 dark:bg-gray-900/50 border border-gray-200/80 dark:border-gray-800 space-y-3">
              <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" /> Orders, Tracking &amp; Invoices ({orders.length})
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-10 space-y-2 text-gray-400">
                  <Package className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-700" />
                  <p className="text-xs font-bold">No order history available.</p>
                </div>
              ) : (
                orders.map((ord) => (
                  <div key={ord.id} className="p-3.5 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-gray-900 dark:text-white">Ref: #{ord.id}</span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 text-[10px] font-black uppercase">
                        {ord.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-500 text-[11px]">
                      <Truck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Track: <strong>{ord.trackingNumber}</strong> ({ord.estimatedDelivery})</span>
                    </div>

                    {/* Actions: Download Invoice, Return & Refund, Cancel */}
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between flex-wrap gap-2">
                      <span className="font-black text-blue-600">₹{ord.totalAmount.toLocaleString('en-IN')}</span>
                      
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleViewInvoice(ord)}
                          className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-[10px] flex items-center gap-1 hover:bg-gray-200"
                        >
                          <FileText className="w-3 h-3 text-blue-500" /> Download Invoice
                        </button>
                        <button
                          onClick={() => alert(`Return request initiated for Order #${ord.id}. Courier pickup will be scheduled.`)}
                          className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-[10px] flex items-center gap-1 hover:bg-gray-200"
                        >
                          <RotateCcw className="w-3 h-3 text-amber-500" /> Return &amp; Refund
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* SECTION 3: SHOPPING (Wishlist, Saved Items, Recently Viewed, Buy Again, Reviews) */}
          {activeSection === 'shopping' && (
            <div className="p-4 sm:p-6 rounded-2xl bg-gray-50/70 dark:bg-gray-900/50 border border-gray-200/80 dark:border-gray-800 space-y-4">
              <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" /> Shopping &amp; Wishlist ({wishlistProducts.length})
              </h2>

              {/* Wishlist Items */}
              <div className="space-y-2">
                <h3 className="font-bold text-xs text-gray-900 dark:text-white">Saved Wishlist Items</h3>
                {wishlistProducts.length === 0 ? (
                  <p className="text-xs text-gray-400 font-bold">Your wishlist is currently empty.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {wishlistProducts.map((p) => (
                      <div key={p.id} className="p-2.5 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 flex items-center justify-between gap-2 text-xs">
                        <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 dark:text-white truncate">{p.name}</h4>
                          <span className="font-black text-blue-600 text-xs">₹{p.price.toLocaleString('en-IN')}</span>
                        </div>
                        <button
                          onClick={() => KeychainStore.addToCart(p)}
                          className="px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-extrabold text-[10px] shrink-0"
                        >
                          Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recently Viewed Items */}
              {recentlyViewed.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                  <h3 className="font-bold text-xs text-gray-900 dark:text-white">Recently Viewed Products</h3>
                  <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                    {recentlyViewed.map((p) => (
                      <div key={`recent-${p.id}`} className="p-2 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 min-w-[130px] space-y-1 text-center shrink-0">
                        <img src={p.image} alt={p.name} className="w-16 h-16 rounded-lg object-cover mx-auto" />
                        <span className="font-bold text-[10px] block truncate text-gray-900 dark:text-white">{p.name}</span>
                        <span className="text-[10px] font-black text-blue-600">₹{p.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 4: ADDRESSES (Manage, Add New, Set Default) */}
          {activeSection === 'addresses' && (
            <div className="p-4 sm:p-6 rounded-2xl bg-gray-50/70 dark:bg-gray-900/50 border border-gray-200/80 dark:border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" /> Saved Delivery Locations ({addresses.length})
                </h2>
                <button
                  onClick={() => setShowAddAddressModal(!showAddAddressModal)}
                  className="px-3 py-1.5 rounded-full bg-[#2563EB] text-white text-xs font-bold flex items-center gap-1 hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Address
                </button>
              </div>

              {/* Add Address Form Modal */}
              {showAddAddressModal && (
                <form onSubmit={handleAddAddress} className="p-3.5 rounded-xl bg-white dark:bg-black border border-blue-500/40 space-y-2.5 text-xs">
                  <h4 className="font-bold text-gray-900 dark:text-white">Add Delivery Address</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={newAddr.name}
                      onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                      className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none text-xs"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                      className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none text-xs"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={newAddr.street}
                      onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                      className="sm:col-span-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none text-xs"
                      required
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={newAddr.city}
                      onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                      className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none text-xs"
                      required
                    />
                    <input
                      type="text"
                      placeholder="ZIP / PIN Code"
                      value={newAddr.zip}
                      onChange={(e) => setNewAddr({ ...newAddr, zip: e.target.value })}
                      className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none text-xs"
                      required
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button type="submit" className="px-4 py-1.5 rounded-full bg-[#2563EB] text-white font-bold text-xs">Save Address</button>
                    <button type="button" onClick={() => setShowAddAddressModal(false)} className="px-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-bold">Cancel</button>
                  </div>
                </form>
              )}

              {/* Address Cards */}
              <div className="space-y-2.5">
                {addresses.map((a) => (
                  <div key={a.id} className="p-3.5 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-gray-900 dark:text-white">{a.name}</span>
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[9px] font-black uppercase">
                          {a.type}
                        </span>
                        {a.isDefault ? (
                          <span className="text-[9px] font-black text-blue-600 uppercase">Default</span>
                        ) : (
                          <button onClick={() => handleSetDefaultAddress(a.id)} className="text-[9px] font-bold text-gray-400 hover:text-blue-600 underline">Set Default</button>
                        )}
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">{a.street}, {a.city}, {a.state} - {a.zip}</p>
                      <p className="text-gray-400 text-[11px]">Phone: {a.phone}</p>
                    </div>
                    <button onClick={() => handleDeleteAddress(a.id)} className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: PAYMENTS (UPI, Cards, Gift Cards, Wallet Balance) */}
          {activeSection === 'payments' && (
            <div className="p-4 sm:p-6 rounded-2xl bg-gray-50/70 dark:bg-gray-900/50 border border-gray-200/80 dark:border-gray-800 space-y-4">
              <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" /> Saved Payment Methods &amp; Wallet
              </h2>

              {/* Wallet Balance Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between shadow-md">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider block opacity-90">Savvora Cash Wallet Balance</span>
                  <span className="text-2xl font-black">₹{walletBalance.toLocaleString('en-IN')}</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">Instant Checkout</span>
              </div>

              {/* Redeem Gift Card */}
              <form onSubmit={handleRedeemGiftCard} className="p-3 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 flex items-center gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Enter Gift Card Voucher Code"
                  value={giftCardCode}
                  onChange={(e) => setGiftCardCode(e.target.value)}
                  className="flex-1 bg-transparent font-mono uppercase font-bold text-gray-900 dark:text-white outline-none"
                />
                <button type="submit" className="px-3.5 py-1.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-extrabold">Redeem</button>
              </form>

              {giftCardMsg && <p className="text-emerald-500 font-bold text-xs">{giftCardMsg}</p>}

              {/* Saved Methods List */}
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div>
                      <span className="font-extrabold text-gray-900 dark:text-white block">Google Pay / PhonePe UPI</span>
                      <span className="text-gray-400 text-[10px]">aarav.sharma@okicici</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md uppercase">Default</span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <span className="font-extrabold text-gray-900 dark:text-white block">HDFC Bank Debit Card</span>
                      <span className="text-gray-400 text-[10px]">•••• •••• •••• 4092</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">Verified</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: NOTIFICATIONS (Order updates, Promos, Price drop, Back in stock, Email, SMS, Push) */}
          {activeSection === 'notifications' && (
            <div className="p-4 sm:p-6 rounded-2xl bg-gray-50/70 dark:bg-gray-900/50 border border-gray-200/80 dark:border-gray-800 space-y-3">
              <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" /> Notification Preferences &amp; Channels
              </h2>

              <div className="space-y-2 text-xs">
                {[
                  { key: 'orderUpdates', title: 'Order Tracking & Dispatch Alerts', desc: 'Real-time courier tracking updates' },
                  { key: 'promotions', title: 'Promotional Offers & Weekend Sales', desc: 'Exclusive VIP subscriber discounts' },
                  { key: 'priceDropAlerts', title: 'Price Drop Alerts', desc: 'Alerts when wishlist item prices decrease' },
                  { key: 'backInStock', title: 'Back in Stock Notifications', desc: 'Alerts when sold-out items return' },
                  { key: 'emailNotifs', title: 'Email Notifications Channel', desc: 'Order receipts & invoice summaries via email' },
                  { key: 'smsNotifs', title: 'SMS Text Alerts', desc: 'Instant OTP & OTP delivery text messages' },
                  { key: 'pushNotifs', title: 'Browser Push Notifications', desc: 'Live browser notifications for flash deals' },
                ].map((item) => (
                  <div key={item.key} className="p-3 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 flex items-center justify-between gap-3">
                    <div>
                      <span className="font-extrabold text-gray-900 dark:text-white block">{item.title}</span>
                      <span className="text-[10px] text-gray-400">{item.desc}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={(notifs as any)[item.key]}
                      onChange={(e) => setNotifs({ ...notifs, [item.key]: e.target.checked })}
                      className="w-4 h-4 accent-blue-600 cursor-pointer shrink-0"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 7: REWARDS (Coupons, Reward Points, Referral Program) */}
          {activeSection === 'rewards' && (
            <div className="p-4 sm:p-6 rounded-2xl bg-gray-50/70 dark:bg-gray-900/50 border border-gray-200/80 dark:border-gray-800 space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 text-white flex items-center justify-between shadow-lg">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider block opacity-90">Savvora Loyalty Balance</span>
                  <div className="text-2xl font-black flex items-center gap-1.5">
                    <Gift className="w-6 h-6 text-amber-300" />
                    <span>450 Coins</span>
                  </div>
                  <span className="text-[10px] font-bold opacity-80 block mt-0.5">₹450 instant checkout discount available</span>
                </div>
              </div>

              {/* Refer & Earn */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 space-y-1.5 text-xs">
                <span className="font-extrabold text-gray-900 dark:text-white block">Referral Program — Refer &amp; Earn ₹200</span>
                <p className="text-gray-400 text-[11px]">Share your referral link with friends. Get ₹200 in Savvora Coins when they place their first order!</p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 font-mono font-bold text-blue-600">SAVVORA-REF-AARAV</span>
                  <button onClick={() => handleCopyCode('SAVVORA-REF-AARAV')} className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-[10px]">
                    {copiedCode === 'SAVVORA-REF-AARAV' ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              </div>

              {/* Coupons List */}
              <div className="space-y-2 text-xs">
                <h3 className="font-bold text-gray-900 dark:text-white">Active Promo Coupons</h3>
                {[
                  { code: 'APPLE20', discount: '20% OFF', desc: 'Valid on Apple titanium accessories & sound gear' },
                  { code: 'LINEAR15', discount: '15% OFF', desc: 'Valid on handcrafted custom acrylic keychains' },
                ].map((c) => (
                  <div key={c.code} className="p-3 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-mono font-black text-blue-600 text-sm block">{c.code}</span>
                      <span className="text-[10px] text-gray-400">{c.desc}</span>
                    </div>
                    <button
                      onClick={() => handleCopyCode(c.code)}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-[10px] flex items-center gap-1"
                    >
                      {copiedCode === c.code ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode === c.code ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 8: PREFERENCES (Language, Currency, Dark Mode, Theme, Accessibility) */}
          {activeSection === 'preferences' && (
            <div className="p-4 sm:p-6 rounded-2xl bg-gray-50/70 dark:bg-gray-900/50 border border-gray-200/80 dark:border-gray-800 space-y-3 text-xs">
              <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" /> System &amp; Display Preferences
              </h2>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-gray-900 dark:text-white block">Theme Mode</span>
                    <span className="text-[10px] text-gray-400">Switch between light &amp; dark styling</span>
                  </div>
                  <button
                    onClick={() => {
                      const next = KeychainStore.toggleTheme();
                      setTheme(next);
                    }}
                    className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-blue-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                    <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-gray-900 dark:text-white block">Preferred Language</span>
                    <span className="text-[10px] text-gray-400">Website interface language</span>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-900 dark:text-white outline-none"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi (हिंदी)</option>
                    <option value="Tamil">Tamil (தமிழ்)</option>
                    <option value="Telugu">Telugu (తెలుగు)</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-gray-900 dark:text-white block">Display Currency</span>
                    <span className="text-[10px] text-gray-400">Prices converted automatically</span>
                  </div>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-900 dark:text-white outline-none"
                  >
                    <option value="INR (₹)">INR (₹)</option>
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-gray-900 dark:text-white block">High Contrast Mode</span>
                    <span className="text-[10px] text-gray-400">Enhance text contrast for accessibility</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={highContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 9: PRIVACY & SECURITY (Login activity, Active devices, Privacy, Delete, Download data) */}
          {activeSection === 'privacy' && (
            <div className="p-4 sm:p-6 rounded-2xl bg-gray-50/70 dark:bg-gray-900/50 border border-gray-200/80 dark:border-gray-800 space-y-4 text-xs">
              <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" /> Privacy, Devices &amp; Data Control
              </h2>

              <div className="space-y-3">
                {/* Active Devices */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 space-y-2">
                  <h4 className="font-bold text-gray-900 dark:text-white">Active Device Sessions</h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white block">Chrome Browser (Windows 11)</span>
                        <span className="text-[10px] text-gray-400">Bengaluru, India · Active Now</span>
                      </div>
                      <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md uppercase">This Device</span>
                    </div>
                  </div>
                </div>

                {/* Download My Data */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-gray-900 dark:text-white block">Download Account Data</span>
                    <span className="text-[10px] text-gray-400">Export profile, order history, and saved addresses as JSON</span>
                  </div>
                  <button
                    onClick={() => alert("Your data export has been queued. A download link will be emailed to your registered address.")}
                    className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-[10px] flex items-center gap-1"
                  >
                    <Download className="w-3 h-3 text-blue-500" /> Export JSON
                  </button>
                </div>

                {/* Delete Account */}
                <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-1.5">
                  <span className="font-extrabold text-rose-600 dark:text-rose-400 block">Delete Account (Danger Zone)</span>
                  <p className="text-[10px] text-gray-500">Permanently delete your SAVVORA account, order history, and saved rewards. This action cannot be undone.</p>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to permanently delete your account? All data will be removed.")) {
                        handleLogout();
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-extrabold text-[10px]"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 10: HELP & SUPPORT (Helpline, Live Chat, FAQs, Report Problem, Terms, Privacy Policy) */}
          {activeSection === 'help' && (
            <div className="p-4 sm:p-6 rounded-2xl bg-gray-50/70 dark:bg-gray-900/50 border border-gray-200/80 dark:border-gray-800 space-y-4 text-xs">
              <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" /> Help, FAQs &amp; Support Center
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 space-y-1">
                  <span className="font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-blue-600" /> 24/7 Helpline
                  </span>
                  <p className="text-gray-400 text-[11px]">+91 1800-SAVVORA (1800-728-8672)</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 space-y-1">
                  <span className="font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-blue-600" /> Email Support
                  </span>
                  <p className="text-gray-400 text-[11px]">support@savvora.com</p>
                </div>
              </div>

              {/* FAQs Accordion */}
              <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h3>
                {[
                  { q: 'How do I track my order shipment?', a: 'Go to "My Orders" tab and click on the tracking number. Live BlueDart tracking will open.' },
                  { q: 'What is the return & replacement policy?', a: 'We offer a 7-day hassle-free replacement on all titanium accessories & handcrafted keychains.' },
                  { q: 'How do I redeem my Savvora Coins?', a: 'Loyalty coins are automatically applied at checkout to give instant discounts.' },
                ].map((faq, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 space-y-1">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between font-bold text-gray-900 dark:text-white text-left"
                    >
                      <span>{faq.q}</span>
                      <span className="text-blue-600 font-mono text-sm">{openFaq === i ? '−' : '+'}</span>
                    </button>
                    {openFaq === i && <p className="text-gray-400 text-[11px] pt-1 leading-relaxed">{faq.a}</p>}
                  </div>
                ))}
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

export default function AccountSettingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-[#0a0d16] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-[#2563EB] border-t-transparent animate-spin" />
      </div>
    }>
      <AccountSettingsContent />
    </Suspense>
  );
}
