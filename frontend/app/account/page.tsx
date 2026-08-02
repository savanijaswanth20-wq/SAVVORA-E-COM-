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
  DollarSign,
  ChevronRight,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Copy,
  ExternalLink,
  Smartphone,
  Check,
  Key,
  Shield,
  FileText,
  Truck
} from 'lucide-[#lucide-react]' ? 'lucide-react' : 'lucide-react';
import { KeychainStore, UserProfile, Order, KeychainProduct, subscribeToStore } from '../../types/store';
import { SupabaseAuthService } from '../../services/supabase/auth';
import { AuthModal } from '../../components/AuthModal';
import { InvoiceViewer } from '../../components/InvoiceViewer';

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
  | 'help';

function AccountSettingsContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as SettingsSection) || 'account';

  const [activeSection, setActiveSection] = useState<SettingsSection>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<KeychainProduct[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');

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

  // Notifications Toggle State
  const [notifs, setNotifs] = useState({
    orderUpdates: true,
    promotions: true,
    whatsappAlerts: true,
    emailDigest: false
  });

  // Preferences State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currency, setCurrency] = useState('INR (₹)');
  const [language, setLanguage] = useState('English');

  // Password Security Form
  const [securityForm, setSecurityForm] = useState({ currentPass: '', newPass: '', confirmPass: '' });
  const [securityMsg, setSecurityMsg] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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
      setAvatarMessage({ type: 'success', text: 'Profile picture updated successfully!' });
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
    setAvatarMessage({ type: 'success', text: 'Profile details saved successfully!' });
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

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const SECTIONS = [
    { id: 'account', label: 'Account & Profile', icon: User, desc: 'Personal info & avatar' },
    { id: 'orders', label: 'My Orders', icon: Package, count: orders.length, desc: 'Track & view invoices' },
    { id: 'shopping', label: 'Wishlist & Saved', icon: Heart, count: wishlistProducts.length, desc: 'Saved favorite items' },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin, count: addresses.length, desc: 'Shipping locations' },
    { id: 'payments', label: 'Payment Options', icon: CreditCard, desc: 'UPI, cards & COD' },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'SMS, WhatsApp & Email' },
    { id: 'rewards', label: 'Rewards & Coins', icon: Gift, desc: '450 Coins available' },
    { id: 'preferences', label: 'Preferences', icon: Settings, desc: 'Theme & Currency' },
    { id: 'privacy', label: 'Privacy & Security', icon: Lock, desc: 'Password & 2FA' },
    { id: 'help', label: 'Help & Support', icon: HelpCircle, desc: 'FAQs & 24/7 Support' },
  ];

  const filteredSections = searchQuery.trim()
    ? SECTIONS.filter(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()) || s.desc.toLowerCase().includes(searchQuery.toLowerCase()))
    : SECTIONS;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0d16] text-gray-900 dark:text-white font-sans pb-20 transition-colors duration-300">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 backdrop-blur-2xl bg-white/85 dark:bg-[#0a0d16]/85 border-b border-gray-200/80 dark:border-gray-800/80 px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm sm:text-base font-black tracking-tight text-gray-900 dark:text-white">
              Customer Settings
            </h1>
            <p className="text-[10px] text-gray-400 font-bold hidden xs:block">SAVVORA Store Account &amp; Preferences</p>
          </div>
        </div>

        {/* Search within Settings */}
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

      {/* Main Container */}
      <main className="max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 flex flex-col md:flex-row gap-4 sm:gap-6">
        
        {/* Navigation Sidebar / Mobile Horizontal Chips */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="flex md:flex-col overflow-x-auto scrollbar-none gap-1.5 md:space-y-1 pb-1 md:pb-0">
            {filteredSections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;

              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id as any)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition-all whitespace-nowrap shrink-0 min-h-[40px] ${
                    isActive
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md'
                      : 'bg-gray-50 dark:bg-gray-900/60 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200/80 dark:border-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563EB]' : 'text-gray-400'}`} />
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

        {/* Main Section Content Card */}
        <div className="flex-1 min-w-0">
          
          {/* SECTION 1: ACCOUNT & PROFILE */}
          {activeSection === 'account' && (
            <div className="p-4 sm:p-6 rounded-2xl bg-gray-50/70 dark:bg-gray-900/50 border border-gray-200/80 dark:border-gray-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" /> Account &amp; Profile Details
                </h2>
                {user && (
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold flex items-center gap-1 hover:bg-gray-100"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-blue-600" /> {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                  </button>
                )}
              </div>

              {user ? (
                <div className="space-y-4">
                  {/* User Profile Glass Card */}
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
                        title="Upload Avatar"
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
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase">
                          Verified via {user.loginProvider}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase">
                          Customer
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
                      <h4 className="font-bold text-xs text-gray-900 dark:text-white">Edit Account Details</h4>
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
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Account User ID</span>
                        <p className="font-mono text-[11px] font-bold text-gray-900 dark:text-white truncate">{user.id}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 space-y-3">
                  <p className="text-xs text-gray-400 font-bold">You are not signed in. Sign in to access your profile &amp; express checkout.</p>
                  <button onClick={() => setIsAuthOpen(true)} className="px-6 py-2.5 rounded-full bg-[#2563EB] text-white font-extrabold text-xs shadow-md hover:bg-blue-600 transition-colors">
                    Sign In with Email / Google
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: MY ORDERS */}
          {activeSection === 'orders' && (
            <div className="p-4 sm:p-6 rounded-2xl bg-gray-50/70 dark:bg-gray-900/50 border border-gray-200/80 dark:border-gray-800 space-y-3">
              <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" /> My Orders &amp; Invoices ({orders.length})
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-10 space-y-2 text-gray-400">
                  <Package className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-700" />
                  <p className="text-xs font-bold">No orders placed yet.</p>
                </div>
              ) : (
                orders.map((ord) => (
                  <div key={ord.id} className="p-3.5 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-gray-900 dark:text-white">Order: #{ord.id}</span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 text-[10px] font-black uppercase">
                        {ord.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-[11px]">
                      <Truck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{ord.trackingNumber} ({ord.estimatedDelivery})</span>
                    </div>
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between font-black">
                      <span className="text-gray-500">Total: <strong className="text-blue-600">₹{ord.totalAmount.toLocaleString('en-IN')}</strong></span>
                      <span className="text-[10px] text-gray-400 font-normal">{ord.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* SECTION 3: WISHLIST */}
          {activeSection === 'shopping' && (
            <div className="p-4 sm:p-6 rounded-2xl bg-gray-50/70 dark:bg-gray-900/50 border border-gray-200/80 dark:border-gray-800 space-y-3">
              <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" /> Wishlist Saved Items ({wishlistProducts.length})
              </h2>

              {wishlistProducts.length === 0 ? (
                <div className="text-center py-10 space-y-2 text-gray-400">
                  <Heart className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-700" />
                  <p className="text-xs font-bold">Your wishlist is currently empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {wishlistProducts.map((p) => (
                    <div key={p.id} className="p-2.5 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 flex items-center justify-between gap-2.5 text-xs">
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
          )}

          {/* SECTION 4: SAVED ADDRESSES */}
          {activeSection === 'addresses' && (
            <div className="p-4 sm:p-6 rounded-2xl bg-gray-50/70 dark:bg-gray-900/50 border border-gray-200/80 dark:border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" /> Saved Delivery Addresses ({addresses.length})
                </h2>
                <button
                  onClick={() => setShowAddAddressModal(!showAddAddressModal)}
                  className="px-3 py-1.5 rounded-full bg-[#2563EB] text-white text-xs font-bold flex items-center gap-1 hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New
                </button>
              </div>

              {/* Add Address Form */}
              {showAddAddressModal && (
                <form onSubmit={handleAddAddress} className="p-3.5 rounded-xl bg-white dark:bg-black border border-blue-500/40 space-y-2.5 text-xs">
                  <h4 className="font-bold text-gray-900 dark:text-white">Add Delivery Location</h4>
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

              {/* Address List */}
              <div className="space-y-2.5">
                {addresses.map((a) => (
                  <div key={a.id} className="p-3.5 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-gray-900 dark:text-white">{a.name}</span>
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[9px] font-black uppercase">
                          {a.type}
                        </span>
                        {a.isDefault && <span className="text-[9px] font-black text-blue-600 uppercase">Default</span>}
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

          {/* SECTION 5: PAYMENTS */}
          {activeSection === 'payments' && (
            <div className="p-4 sm:p-6 rounded-2xl bg-gray-50/70 dark:bg-gray-900/50 border border-gray-200/80 dark:border-gray-800 space-y-3">
              <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" /> Saved Payment Methods
              </h2>

              <div className="space-y-2.5 text-xs">
                <div className="p-3.5 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div>
                      <span className="font-extrabold text-gray-900 dark:text-white block">Google Pay / UPI</span>
                      <span className="text-gray-400 text-[10px]">aarav.sharma@okicici</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md uppercase">Default</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 flex items-center justify-between">
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

          {/* SECTION 6: NOTIFICATIONS */}
          {activeSection === 'notifications' && (
            <div className="p-4 sm:p-6 rounded-2xl bg-gray-50/70 dark:bg-gray-900/50 border border-gray-200/80 dark:border-gray-800 space-y-3">
              <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" /> Notification Preferences
              </h2>

              <div className="space-y-2 text-xs">
                {[
                  { key: 'orderUpdates', title: 'Order Tracking & Delivery Alerts', desc: 'Real-time SMS & email notifications when orders ship' },
                  { key: 'whatsappAlerts', title: 'WhatsApp Instant Updates', desc: 'Receive order receipt & dispatch updates directly on WhatsApp' },
                  { key: 'promotions', title: 'Promotional Offers & Flash Sales', desc: 'Exclusive VIP member discounts and weekend sales' },
                  { key: 'emailDigest', title: 'Weekly Trend Digest', desc: 'Curated recommendations & style guides' },
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

          {/* SECTION 7: REWARDS & COINS */}
          {activeSection === 'rewards' && (
            <div className="p-4 sm:p-6 rounded-2xl bg-gray-50/70 dark:bg-gray-900/50 border border-gray-200/80 dark:border-gray-800 space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 text-white flex items-center justify-between shadow-lg">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider block opacity-90">Savvora Loyalty Balance</span>
                  <div className="text-2xl font-black flex items-center gap-1.5">
                    <Gift className="w-6 h-6 text-amber-300" />
                    <span>450 Coins</span>
                  </div>
                  <span className="text-[10px] font-bold opacity-80 block mt-0.5">Equivalent to ₹450 instant discount on checkout</span>
                </div>
              </div>

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

          {/* SECTION 8: PREFERENCES */}
          {activeSection === 'preferences' && (
            <div className="p-4 sm:p-6 rounded-2xl bg-gray-50/70 dark:bg-gray-900/50 border border-gray-200/80 dark:border-gray-800 space-y-3 text-xs">
              <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" /> System Preferences
              </h2>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-gray-900 dark:text-white block">Theme Mode</span>
                    <span className="text-[10px] text-gray-400">Switch between light &amp; dark luxury styling</span>
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
                    <span className="font-extrabold text-gray-900 dark:text-white block">Display Currency</span>
                    <span className="text-[10px] text-gray-400">Indian Rupee (INR ₹)</span>
                  </div>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-900 dark:text-white outline-none"
                  >
                    <option value="INR (₹)">INR (₹)</option>
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 9: PRIVACY & SECURITY */}
          {activeSection === 'privacy' && (
            <div className="p-4 sm:p-6 rounded-2xl bg-gray-50/70 dark:bg-gray-900/50 border border-gray-200/80 dark:border-gray-800 space-y-3 text-xs">
              <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" /> Privacy &amp; Account Security
              </h2>

              <div className="p-3.5 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 space-y-2.5">
                <h4 className="font-bold text-gray-900 dark:text-white">Change Account Password</h4>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={securityForm.currentPass}
                  onChange={(e) => setSecurityForm({ ...securityForm, currentPass: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none text-xs"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={securityForm.newPass}
                  onChange={(e) => setSecurityForm({ ...securityForm, newPass: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none text-xs"
                />
                <button
                  onClick={() => {
                    setSecurityMsg('Password updated securely.');
                    setTimeout(() => setSecurityMsg(null), 3000);
                  }}
                  className="px-4 py-2 rounded-full bg-[#2563EB] text-white font-extrabold text-xs"
                >
                  Update Password
                </button>
                {securityMsg && <p className="text-emerald-500 font-bold text-[10px]">{securityMsg}</p>}
              </div>
            </div>
          )}

          {/* SECTION 10: HELP & SUPPORT */}
          {activeSection === 'help' && (
            <div className="p-4 sm:p-6 rounded-2xl bg-gray-50/70 dark:bg-gray-900/50 border border-gray-200/80 dark:border-gray-800 space-y-3 text-xs">
              <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" /> Help &amp; Support Center
              </h2>

              <div className="space-y-2">
                <div className="p-3.5 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 space-y-1">
                  <span className="font-extrabold text-gray-900 dark:text-white block">24/7 Customer Hotline</span>
                  <p className="text-gray-400 text-[11px]">Toll-Free: +91 1800-SAVVORA (1800-728-8672)</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-black border border-gray-200/80 dark:border-gray-800 space-y-1">
                  <span className="font-extrabold text-gray-900 dark:text-white block">Email Support</span>
                  <p className="text-gray-400 text-[11px]">support@savvora.com (Response within 2 hours)</p>
                </div>
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
