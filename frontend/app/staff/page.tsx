"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Package, 
  Users, 
  AlertTriangle, 
  ArrowLeft,
  Truck,
  Boxes,
  CheckCircle,
  Search,
  RefreshCw,
  Clock,
  LogOut,
  Edit3
} from 'lucide-react';
import { KeychainStore, KeychainProduct, Order, subscribeToStore, UserProfile } from '../../types/store';
import { AuthModal } from '../../components/AuthModal';

export default function StaffPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'customers'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<KeychainProduct[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = () => {
    setOrders(KeychainStore.getOrders());
    setProducts(KeychainStore.getProducts());
    setUser(KeychainStore.getUser());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToStore(loadData);
    return () => unsubscribe();
  }, []);

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    KeychainStore.saveOrders(updatedOrders);
  };

  const handleUpdateStock = (productId: string, currentStock: number, delta: number) => {
    KeychainStore.updateProductStock(productId, Math.max(0, currentStock + delta));
  };

  const handleLogout = () => {
    KeychainStore.logoutUser();
    setUser(null);
  };

  // Mock list of registered customers for staff directory
  const mockCustomers = [
    { id: 'usr-1', name: 'Aarav Sharma', email: 'aarav.sharma@gmail.com', phone: '+91 98765 43210', totalOrders: 4, joinedDate: '2026-01-15' },
    { id: 'usr-2', name: 'Priya Patel', email: 'priya.patel@gmail.com', phone: '+91 98123 45678', totalOrders: 2, joinedDate: '2026-03-20' },
    { id: 'usr-3', name: 'Rohan Mehta', email: 'rohan.mehta@yahoo.com', phone: '+91 97654 32109', totalOrders: 7, joinedDate: '2025-11-05' },
    { id: 'usr-4', name: 'Ananya Verma', email: 'ananya.v@gmail.com', phone: '+91 99887 76655', totalOrders: 1, joinedDate: '2026-06-12' },
  ];

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.shippingAddress?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#111827] text-[#111827] dark:text-white font-sans pb-16">
      
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 dark:bg-[#111827]/80 border-b border-[#E5E7EB] dark:border-gray-800 py-4 px-6 lg:px-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2.5 rounded-full bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700">
            <ArrowLeft className="w-4 h-4 text-[#111827] dark:text-white" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-[#111827] dark:text-white">
                SAVVORA Staff Portal
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase">
                Staff Operations
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">Order fulfillment, inventory replenishment & customer management.</p>
          </div>
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-500">
              Staff: <strong className="text-[#111827] dark:text-white">{user.fullName || user.email}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 font-extrabold text-xs flex items-center gap-1.5 border border-rose-200"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAuthOpen(true)}
            className="px-5 py-2.5 rounded-full bg-[#2563EB] text-white font-extrabold text-xs shadow-md"
          >
            Staff Login
          </button>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-[1400px] mx-auto px-4 lg:px-8 pt-8 space-y-6">
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-[24px] bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-gray-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-[#2563EB] flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Orders</p>
              <h3 className="text-2xl font-black text-[#111827] dark:text-white">
                {orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length}
              </h3>
            </div>
          </div>

          <div className="p-6 rounded-[24px] bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-gray-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-500 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Low Stock Alerts</p>
              <h3 className="text-2xl font-black text-[#111827] dark:text-white">
                {products.filter(p => p.stock < 10).length} Items
              </h3>
            </div>
          </div>

          <div className="p-6 rounded-[24px] bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-gray-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-500 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Customers</p>
              <h3 className="text-2xl font-black text-[#111827] dark:text-white">
                {mockCustomers.length}
              </h3>
            </div>
          </div>
        </div>

        {/* Tab Header & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-[#1F2937] p-3 rounded-[24px] border border-[#E5E7EB] dark:border-gray-800">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'bg-[#111827] dark:bg-[#2563EB] text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Update Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTab === 'inventory'
                  ? 'bg-[#111827] dark:bg-[#2563EB] text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Boxes className="w-4 h-4" /> Manage Inventory ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTab === 'customers'
                  ? 'bg-[#111827] dark:bg-[#2563EB] text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Users className="w-4 h-4" /> View Customers ({mockCustomers.length})
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders or items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 text-xs font-bold text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>

        {/* Tab 1: Orders Management */}
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-[#1F2937] rounded-[24px] border border-[#E5E7EB] dark:border-gray-800 p-6 space-y-4">
            <h2 className="text-lg font-black text-[#111827] dark:text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#2563EB]" /> Customer Orders Management
            </h2>

            {filteredOrders.length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center font-medium">No orders found matching your search.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] dark:border-gray-700 text-gray-400 font-bold uppercase">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Total Amount</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Current Status</th>
                      <th className="pb-3 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] dark:divide-gray-800 font-bold">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#F8FAFC] dark:hover:bg-gray-800/50">
                        <td className="py-4 font-mono text-[#2563EB]">{order.id}</td>
                        <td className="py-4">
                          <p className="text-[#111827] dark:text-white">{order.shippingAddress?.fullName || 'Customer'}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{order.shippingAddress?.city}</p>
                        </td>
                        <td className="py-4 text-[#111827] dark:text-white">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                        <td className="py-4 text-gray-400">{new Date(order.date).toLocaleDateString()}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400' :
                            order.status === 'Processing' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                            className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 font-bold text-xs focus:border-[#2563EB]"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Inventory Management */}
        {activeTab === 'inventory' && (
          <div className="bg-white dark:bg-[#1F2937] rounded-[24px] border border-[#E5E7EB] dark:border-gray-800 p-6 space-y-4">
            <h2 className="text-lg font-black text-[#111827] dark:text-white flex items-center gap-2">
              <Boxes className="w-5 h-5 text-[#2563EB]" /> Inventory & Stock Adjustments
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E5E7EB] dark:border-gray-700 text-gray-400 font-bold uppercase">
                    <th className="pb-3">Product Name</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Stock Count</th>
                    <th className="pb-3">Stock Status</th>
                    <th className="pb-3 text-right">Adjust Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-gray-800 font-bold">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-[#F8FAFC] dark:hover:bg-gray-800/50">
                      <td className="py-4 flex items-center gap-3">
                        <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <p className="text-[#111827] dark:text-white">{prod.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{prod.sku}</p>
                        </div>
                      </td>
                      <td className="py-4 text-gray-500">{prod.category}</td>
                      <td className="py-4 text-[#111827] dark:text-white">₹{prod.price.toLocaleString('en-IN')}</td>
                      <td className="py-4 font-extrabold text-sm">{prod.stock}</td>
                      <td className="py-4">
                        {prod.stock < 10 ? (
                          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400 text-[10px] font-black uppercase">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-[10px] font-black uppercase">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleUpdateStock(prod.id, prod.stock, -5)}
                            className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-white text-xs font-black"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => handleUpdateStock(prod.id, prod.stock, -1)}
                            className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-white text-xs font-black"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => handleUpdateStock(prod.id, prod.stock, 5)}
                            className="px-2.5 py-1 rounded-lg bg-[#2563EB] text-white hover:bg-blue-600 text-xs font-black"
                          >
                            +5
                          </button>
                          <button
                            onClick={() => handleUpdateStock(prod.id, prod.stock, 20)}
                            className="px-2.5 py-1 rounded-lg bg-[#2563EB] text-white hover:bg-blue-600 text-xs font-black"
                          >
                            +20
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Customer Directory */}
        {activeTab === 'customers' && (
          <div className="bg-white dark:bg-[#1F2937] rounded-[24px] border border-[#E5E7EB] dark:border-gray-800 p-6 space-y-4">
            <h2 className="text-lg font-black text-[#111827] dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#2563EB]" /> Registered Customer Directory
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E5E7EB] dark:border-gray-700 text-gray-400 font-bold uppercase">
                    <th className="pb-3">Customer Name</th>
                    <th className="pb-3">Email Address</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Joined Date</th>
                    <th className="pb-3 text-right">Total Orders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-gray-800 font-bold">
                  {mockCustomers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-[#F8FAFC] dark:hover:bg-gray-800/50">
                      <td className="py-4 text-[#111827] dark:text-white">{cust.name}</td>
                      <td className="py-4 text-gray-500">{cust.email}</td>
                      <td className="py-4 font-mono text-gray-400">{cust.phone}</td>
                      <td className="py-4 text-gray-400">{cust.joinedDate}</td>
                      <td className="py-4 text-right font-black text-[#2563EB]">{cust.totalOrders} Orders</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(u) => setUser(u)}
      />
    </div>
  );
}
