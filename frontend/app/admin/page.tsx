"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Plus, 
  ArrowLeft,
  Truck,
  ShieldCheck,
  Tag,
  Users2,
  FileBarChart,
  Boxes,
  Edit3,
  UserCheck,
  Key
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { KeychainStore, KeychainProduct, Order, SUPPLIERS_LIST, EMPLOYEES_LIST, subscribeToStore } from '../../services/keychainStore';

const SALES_GRAPH_DATA = [
  { time: '09:00', sales: 12400 },
  { time: '11:00', sales: 24500 },
  { time: '13:00', sales: 38200 },
  { time: '15:00', sales: 54100 },
  { time: '17:00', sales: 68900 },
  { time: '19:00', sales: 79500 },
  { time: '21:00', sales: 85400 },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'inventory' | 'orders' | 'suppliers' | 'employees' | 'users' | 'reports'>('analytics');
  const [products, setProducts] = useState<KeychainProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // User RBAC Management state
  const [usersList, setUsersList] = useState([
    { id: 'usr-1', name: 'Aarav Sharma', email: 'aarav.sharma@gmail.com', role: 'customer', status: 'Active' },
    { id: 'usr-2', name: 'Vikram Malhotra', email: 'vikram.admin@savvora.com', role: 'admin', status: 'Active' },
    { id: 'usr-[#3]', name: 'Neha Gupta', email: 'neha.staff@savvora.com', role: 'staff', status: 'Active' },
    { id: 'usr-4', name: 'Priya Patel', email: 'priya.patel@gmail.com', role: 'customer', status: 'Active' },
    { id: 'usr-5', name: 'Rajesh Kumar', email: 'rajesh.staff@savvora.com', role: 'staff', status: 'Active' },
  ]);

  const [newProd, setNewProd] = useState({
    name: '',
    category: 'Electronics',
    categoryId: 'electronics',
    price: '',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    description: 'Luxury Apple ecosystem product.'
  });

  const loadData = () => {
    setProducts(KeychainStore.getProducts());
    setOrders(KeychainStore.getOrders());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToStore(loadData);
    return () => unsubscribe();
  }, []);

  const handleUpdateStock = (productId: string, currentStock: number, delta: number) => {
    KeychainStore.updateProductStock(productId, currentStock + delta);
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const created: KeychainProduct = {
      id: `prod-apple-${Date.now()}`,
      name: newProd.name,
      category: newProd.category,
      categoryId: newProd.categoryId,
      price: Number(newProd.price),
      rating: 5.0,
      reviewCount: 1,
      stock: Number(newProd.stock),
      sku: `APL-NEW-${Date.now().toString().slice(-4)}`,
      image: newProd.image,
      badge: 'NEW',
      description: newProd.description,
      features: ['Apple Design', '1 Year Warranty'],
      material: 'Anodized Aluminum',
      deliveryDays: 'Express Tomorrow'
    };

    KeychainStore.saveProducts([created, ...KeychainStore.getProducts()]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark text-apple-dark dark:text-white font-sans flex flex-col pb-16 transition-colors duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 dark:bg-black/70 border-b border-apple-border dark:border-apple-border-dark py-4 px-6 lg:px-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 rounded-full bg-apple-surface dark:bg-apple-surface-dark text-apple-dark dark:text-white border border-apple-border dark:border-apple-border-dark">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-extrabold text-apple-dark dark:text-white flex items-center gap-2">
              SAVVORA Enterprise Admin Portal <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-apple-blue text-white">Super Admin</span>
            </h1>
            <p className="text-xs text-apple-gray font-medium">Manage products, orders, inventory, user roles (RBAC) & sales metrics.</p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-full bg-apple-blue hover:bg-apple-blue-hover text-white font-extrabold text-xs shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </header>

      {/* Main Admin Area */}
      <main className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-8 flex-1 w-full space-y-8">
        
        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'analytics', label: 'Analytics & Revenue' },
            { id: 'inventory', label: `Inventory Stock (${products.length})` },
            { id: 'orders', label: `Orders (${orders.length})` },
            { id: 'users', label: `User Roles (RBAC)` },
            { id: 'suppliers', label: 'Warehouse & Suppliers' },
            { id: 'employees', label: 'Employees' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all border ${
                activeTab === t.id
                  ? 'bg-apple-blue text-white border-apple-blue shadow-md'
                  : 'bg-apple-surface dark:bg-apple-surface-dark text-apple-gray border-apple-border dark:border-apple-border-dark hover:text-apple-dark'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="glass-apple dark:bg-apple-surface-dark rounded-apple p-6 border border-apple-border dark:border-apple-border-dark shadow-apple-soft">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider">Today's Revenue</span>
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-apple-dark dark:text-white">₹85,400</div>
                <span className="text-xs text-emerald-600 font-bold mt-2 inline-flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs yesterday
                </span>
              </div>

              <div className="glass-apple dark:bg-apple-surface-dark rounded-apple p-6 border border-apple-border dark:border-apple-border-dark shadow-apple-soft">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-extrabold text-apple-blue uppercase tracking-wider">Orders</span>
                  <div className="p-2.5 rounded-xl bg-apple-blue/10 text-apple-blue">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-apple-dark dark:text-white">{orders.length + 124}</div>
                <span className="text-xs text-apple-gray font-semibold mt-2 block">12 pending processing</span>
              </div>

              <div className="glass-apple dark:bg-apple-surface-dark rounded-apple p-6 border border-apple-border dark:border-apple-border-dark shadow-apple-soft">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-extrabold text-purple-600 uppercase tracking-wider">Products</span>
                  <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-apple-dark dark:text-white">{products.length}</div>
                <span className="text-xs text-purple-600 font-bold mt-2 block">Active in 5 categories</span>
              </div>

              <div className="glass-apple dark:bg-apple-surface-dark rounded-apple p-6 border border-apple-border dark:border-apple-border-dark shadow-apple-soft">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-extrabold text-amber-500 uppercase tracking-wider">Customers</span>
                  <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-500">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-apple-dark dark:text-white">4,120</div>
                <span className="text-xs text-amber-500 font-bold mt-2 block">+48 new this week</span>
              </div>

            </div>

            {/* Recharts Analytics Chart */}
            <div className="glass-apple dark:bg-apple-surface-dark rounded-apple p-6 border border-apple-border dark:border-apple-border-dark">
              <h3 className="text-base font-extrabold text-apple-dark dark:text-white mb-4">Intraday Sales Revenue Accumulation</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SALES_GRAPH_DATA}>
                    <defs>
                      <linearGradient id="appleBlueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0071E3" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#0071E3" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#6E6E73" fontSize={12} tickLine={false} />
                    <YAxis stroke="#6E6E73" fontSize={12} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                    <Tooltip formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']} />
                    <Area type="monotone" dataKey="sales" stroke="#0071E3" strokeWidth={3} fillOpacity={1} fill="url(#appleBlueGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Inventory */}
        {activeTab === 'inventory' && (
          <div className="glass-apple dark:bg-apple-surface-dark rounded-apple p-6 border border-apple-border dark:border-apple-border-dark space-y-4">
            <h2 className="text-base font-extrabold text-apple-dark dark:text-white">Inventory Stock Control</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="uppercase text-apple-gray border-b border-apple-border dark:border-apple-border-dark bg-apple-surface dark:bg-black">
                  <tr>
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-apple-border dark:divide-apple-border-dark">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-apple-surface dark:hover:bg-black transition-colors">
                      <td className="py-3 px-4 font-bold text-apple-dark dark:text-white flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                        <span>{p.name}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-apple-blue font-bold">{p.sku}</td>
                      <td className="py-3 px-4 font-black text-apple-dark dark:text-white">₹{p.price.toLocaleString("en-IN")}</td>
                      <td className="py-3 px-4 font-bold">
                        <span className={p.stock <= 5 ? 'text-rose-500' : 'text-emerald-600'}>{p.stock} Units</span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button onClick={() => handleUpdateStock(p.id, p.stock, -1)} className="px-2.5 py-1 rounded bg-apple-surface dark:bg-black text-xs font-bold border border-apple-border">-1</button>
                        <button onClick={() => handleUpdateStock(p.id, p.stock, +5)} className="px-2.5 py-1 rounded bg-apple-blue text-white text-xs font-bold">+5 Restock</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: User Roles (RBAC) */}
        {activeTab === 'users' && (
          <div className="glass-apple dark:bg-apple-surface-dark rounded-apple p-6 border border-apple-border dark:border-apple-border-dark space-y-4">
            <h2 className="text-base font-extrabold text-apple-dark dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-apple-blue" /> User Management & RBAC Permissions
            </h2>
            <p className="text-xs text-apple-gray font-medium">Assign user roles between Admin, Staff, and Customer to control application access levels.</p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="uppercase text-apple-gray border-b border-apple-border dark:border-apple-border-dark bg-apple-surface dark:bg-black">
                  <tr>
                    <th className="py-3 px-4">User Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Current Role</th>
                    <th className="py-3 px-4">Account Status</th>
                    <th className="py-3 px-4 text-right">Assign Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-apple-border dark:divide-apple-border-dark font-bold">
                  {usersList.map((usr) => (
                    <tr key={usr.id} className="hover:bg-apple-surface dark:hover:bg-black transition-colors">
                      <td className="py-3 px-4 text-apple-dark dark:text-white">{usr.name}</td>
                      <td className="py-3 px-4 font-mono text-apple-gray">{usr.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          usr.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400' :
                          usr.role === 'staff' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400' :
                          'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        }`}>
                          {usr.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-emerald-600">{usr.status}</td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={usr.role}
                          onChange={(e) => handleRoleChange(usr.id, e.target.value)}
                          className="px-3 py-1.5 rounded-xl bg-white dark:bg-black border border-apple-border dark:border-apple-border-dark font-bold text-xs focus:border-apple-blue"
                        >
                          <option value="customer">Customer</option>
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Warehouse & Suppliers */}
        {activeTab === 'suppliers' && (
          <div className="glass-apple dark:bg-apple-surface-dark rounded-apple p-6 border border-apple-border dark:border-apple-border-dark space-y-4">
            <h2 className="text-base font-extrabold text-apple-dark dark:text-white">Warehouse & Supply Chain Partners</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SUPPLIERS_LIST.map((sup) => (
                <div key={sup.id} className="p-4 rounded-2xl bg-white dark:bg-black border border-apple-border dark:border-apple-border-dark space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs text-apple-dark dark:text-white">{sup.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">{sup.status}</span>
                  </div>
                  <p className="text-xs text-apple-gray font-medium">Category: {sup.category}</p>
                  <p className="text-[11px] font-mono text-apple-blue">{sup.contact}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Employees */}
        {activeTab === 'employees' && (
          <div className="glass-apple dark:bg-apple-surface-dark rounded-apple p-6 border border-apple-border dark:border-apple-border-dark space-y-4">
            <h2 className="text-base font-extrabold text-apple-dark dark:text-white">Employee Roster</h2>
            <div className="space-y-2">
              {EMPLOYEES_LIST.map((emp) => (
                <div key={emp.id} className="p-3.5 rounded-2xl bg-white dark:bg-black border border-apple-border dark:border-apple-border-dark flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-apple-dark dark:text-white block">{emp.name} ({emp.role})</span>
                    <span className="text-apple-gray font-mono">{emp.email}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-apple-blue/10 text-apple-blue font-bold text-[10px]">Verified</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md glass-apple dark:bg-apple-surface-dark rounded-4xl p-6 border border-apple-border dark:border-apple-border-dark shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-apple-dark dark:text-white">Add New Storefront Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-apple-gray font-bold mb-1">Product Title</label>
                <input type="text" required value={newProd.name} onChange={(e) => setNewProd({ ...newProd, name: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white dark:bg-black border border-apple-border text-apple-dark dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-apple-gray font-bold mb-1">Price (₹)</label>
                  <input type="number" required value={newProd.price} onChange={(e) => setNewProd({ ...newProd, price: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white dark:bg-black border border-apple-border text-apple-dark dark:text-white" />
                </div>
                <div>
                  <label className="block text-apple-gray font-bold mb-1">Stock Level</label>
                  <input type="number" required value={newProd.stock} onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })} className="w-full px-3 py-2 rounded-xl bg-white dark:bg-black border border-apple-border text-apple-dark dark:text-white" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded-xl glass-apple text-apple-gray">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-apple-blue text-white font-bold">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
