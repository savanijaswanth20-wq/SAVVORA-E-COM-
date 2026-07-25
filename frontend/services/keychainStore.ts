export interface KeychainProduct {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  image: string;
  secondaryImage?: string;
  badge?: 'NEW' | 'BESTSELLER' | 'TRENDING' | 'LIMITED' | '20% OFF';
  description: string;
  features: string[];
  material: string;
  deliveryDays: string;
  videoUrl?: string;
  customizable?: boolean;
}

export interface CustomKeychainConfig {
  id?: string;
  text: string;
  font: string;
  textColor: string;
  baseMaterial: 'acrylic' | 'resin' | 'rosegold' | 'silicone' | 'leather';
  baseColor: string;
  emojiCharms: string[];
  photoUrl?: string;
  calculatedPrice: number;
}

export interface CartItem {
  id: string;
  product: KeychainProduct;
  quantity: number;
  customConfig?: CustomKeychainConfig;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minAmount: number;
  description: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  discountApplied: number;
  giftWrapping: boolean;
  giftMessage?: string;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    zip: string;
    phone: string;
  };
  status: 'Processing' | 'Preparing' | 'Shipped' | 'Delivered';
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  contact: string;
  status: 'Active' | 'Pending';
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'Active' | 'Offline';
}

// Apple Luxury Storefront Catalog
export const INITIAL_PRODUCTS: KeychainProduct[] = [
  {
    id: 'prod-01',
    name: 'iPhone 15 Pro Max Titanium',
    category: 'Smartphones',
    categoryId: 'electronics',
    price: 134900,
    originalPrice: 159900,
    rating: 4.9,
    reviewCount: 1420,
    stock: 12,
    sku: 'APL-IP15PM-256',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    badge: 'NEW',
    description: 'Forged in titanium with A17 Pro chip, customizable Action button, and versatile 48MP camera system.',
    features: ['Aerospace Titanium', 'A17 Pro Chip', '48MP Camera System', 'USB-C Connector'],
    material: 'Titanium & Ceramic Shield',
    deliveryDays: 'Express Tomorrow'
  },
  {
    id: 'prod-02',
    name: 'MacBook Pro 16" M3 Max',
    category: 'Laptops',
    categoryId: 'electronics',
    price: 349900,
    originalPrice: 399900,
    rating: 5.0,
    reviewCount: 890,
    stock: 6,
    sku: 'APL-MBP16-M3M',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    badge: 'BESTSELLER',
    description: 'Liquid Retina XDR display with M3 Max chip featuring up to 16-core CPU and 40-core GPU.',
    features: ['M3 Max Processor', '128GB Unified Memory', 'Liquid Retina XDR', '22-Hour Battery'],
    material: 'Anodized Space Black Aluminum',
    deliveryDays: '2 Business Days'
  },
  {
    id: 'prod-03',
    name: 'AirPods Max Space Gray',
    category: 'Wireless Earbuds',
    categoryId: 'audio',
    price: 59900,
    originalPrice: 69900,
    rating: 4.8,
    reviewCount: 2150,
    stock: 15,
    sku: 'APL-APM-SG',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    badge: 'TRENDING',
    description: 'Apple-designed dynamic driver provides high-fidelity audio with Active Noise Cancellation & Spatial Audio.',
    features: ['High-Fidelity Audio', 'Active Noise Cancellation', 'Personalized Spatial Audio', '20 Hour Battery'],
    material: 'Anodized Aluminum & Mesh',
    deliveryDays: 'Express Tomorrow'
  },
  {
    id: 'prod-04',
    name: 'Apple Watch Ultra 2 Titanium',
    category: 'Smart Watches',
    categoryId: 'electronics',
    price: 89900,
    originalPrice: 99900,
    rating: 4.9,
    reviewCount: 640,
    stock: 8,
    sku: 'APL-AWU2-49',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
    badge: 'NEW',
    description: 'The ultimate sports watch with S9 SiP, double tap gesture, brightest display ever, and precision GPS.',
    features: ['49mm Titanium Case', '3000 Nits Brightness', 'Precision Dual GPS', '36-Hour Battery'],
    material: 'Titanium & Sapphire Crystal',
    deliveryDays: 'Express Tomorrow'
  },
  {
    id: 'prod-05',
    name: 'Keychron Q1 Pro Mechanical Keyboard',
    category: 'Mechanical Keyboards',
    categoryId: 'gaming',
    price: 18900,
    originalPrice: 22900,
    rating: 4.9,
    reviewCount: 310,
    stock: 10,
    sku: 'KCH-Q1P-RGB',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    badge: 'BESTSELLER',
    description: 'Full aluminum QMK/VIA wireless custom mechanical keyboard with hot-swappable double-gasket design.',
    features: ['CNC Aluminum Body', 'Bluetooth 5.1 & Type-C', 'Hot-Swappable Switches', 'RGB Backlight'],
    material: 'Solid Aircraft-Grade Aluminum',
    deliveryDays: '2 Business Days'
  },
  {
    id: 'prod-06',
    name: 'Logitech MX Master 3S Wireless Mouse',
    category: 'Desk Setup Accessories',
    categoryId: 'gaming',
    price: 9995,
    originalPrice: 11995,
    rating: 4.9,
    reviewCount: 3420,
    stock: 20,
    sku: 'LOG-MXM3S-GR',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
    badge: 'TRENDING',
    description: 'An iconic quiet click ergonomic mouse with 8K DPI track-on-glass sensor and MagSpeed electromagnetic scrolling.',
    features: ['Quiet Clicks', '8K DPI Track-on-Glass', 'MagSpeed Scrolling', 'Multi-Device Flow'],
    material: 'Recycled Soft-Touch Matte Resin',
    deliveryDays: 'Express Tomorrow'
  },
  {
    id: 'prod-07',
    name: 'Bellroy Classic Leather Backpack 20L',
    category: 'Premium Backpacks',
    categoryId: 'accessories',
    price: 16900,
    originalPrice: 19900,
    rating: 4.8,
    reviewCount: 412,
    stock: 7,
    sku: 'BEL-BP20L-BLK',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    badge: 'NEW',
    description: 'Clean minimalist commuter backpack with padded 16" laptop sleeve, lumbar support, and environmentally certified leather.',
    features: ['16" Padded Laptop Pocket', 'Water-Resistant Weave', 'Premium LWG Leather', 'Key Clip Tether'],
    material: 'Recycled Fabric & LWG Leather',
    deliveryDays: '3 Business Days'
  },
  {
    id: 'prod-08',
    name: 'Bang & Olufsen Beosound Explore',
    category: 'Bluetooth Speakers',
    categoryId: 'audio',
    price: 19900,
    originalPrice: 24900,
    rating: 4.9,
    reviewCount: 520,
    stock: 9,
    sku: 'BNO-BSE-GRN',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
    badge: 'LIMITED',
    description: 'Ultra-durable waterproof outdoor Bluetooth speaker crafted with tough Type II anodized aluminum.',
    features: ['360-Degree Sound', 'IP67 Dust & Waterproof', '27-Hour Battery', 'Carabiner Clip'],
    material: 'Type II Anodized Aluminum',
    deliveryDays: '2 Business Days'
  },
  {
    id: 'kc-01',
    name: 'Custom Engraved Name Keychain',
    category: 'Custom Keychains',
    categoryId: 'custom-name',
    price: 349,
    originalPrice: 499,
    rating: 4.9,
    reviewCount: 328,
    stock: 15,
    sku: 'KC-NAME-01',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    badge: 'BESTSELLER',
    description: 'Precision laser-engraved personalized acrylic keychain with gold flake border and charm accents.',
    features: ['Laser Engraved', 'Scratch Resistant Acrylic', 'Gold Plated Ring', 'Free Gift Box'],
    material: 'Premium Pastel Acrylic',
    deliveryDays: '3 Business Days',
    customizable: true
  },
  {
    id: 'kc-02',
    name: 'Polaroid Memory Photo Keychain',
    category: 'Custom Keychains',
    categoryId: 'photo',
    price: 399,
    originalPrice: 599,
    rating: 5.0,
    reviewCount: 215,
    stock: 10,
    sku: 'KC-PHOTO-02',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
    badge: 'TRENDING',
    description: 'Encase your favourite polaroid memory photo inside a crystal clear glassmorphic acrylic frame with soft tassels.',
    features: ['Double Sided Photo', 'UV Protective Coating', 'Soft Tassel', 'Water Resistant'],
    material: 'High-Translucency Resin',
    deliveryDays: '2 Business Days',
    customizable: true
  },
  {
    id: 'kc-03',
    name: 'Matching Magnet Couple Keychains',
    category: 'Custom Keychains',
    categoryId: 'couple',
    price: 599,
    originalPrice: 799,
    rating: 4.9,
    reviewCount: 412,
    stock: 14,
    sku: 'KC-COUPLE-03',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    badge: 'BESTSELLER',
    description: 'Cute matching half-heart magnetic keychains for couples that snap together when brought close.',
    features: ['Strong Neodymium Magnets', 'Rose Gold Finish', 'Custom Date Engraving', 'Velvet Pouch'],
    material: 'Zinc Alloy & Enamel',
    deliveryDays: '3 Business Days'
  }
];

export const SUPPLIERS_LIST: Supplier[] = [
  { id: 'sup-1', name: 'Precision Resin Crafts Ltd', category: 'Epoxy & Acrylics', contact: 'supply@resin.com', status: 'Active' },
  { id: 'sup-2', name: 'Tokyo Kawaii Hardware Inc', category: 'Clasps & Charms', contact: 'tokyo@kawaii.jp', status: 'Active' },
  { id: 'sup-3', name: 'Apple Authorized Logistics', category: 'Express Shipping', contact: 'dispatch@apple.com', status: 'Active' }
];

export const EMPLOYEES_LIST: Employee[] = [
  { id: 'emp-1', name: 'Aarav Sharma', role: 'Head of Crafting & Storefront', email: 'aarav@kawaiicraft.com', status: 'Active' },
  { id: 'emp-2', name: 'Mia Patel', role: 'Inventory & Warehouse Lead', email: 'mia@kawaiicraft.com', status: 'Active' },
  { id: 'emp-3', name: 'Rohan Verma', role: 'Customer Success Specialist', email: 'rohan@kawaiicraft.com', status: 'Active' }
];

const LOCAL_STORAGE_KEYS = {
  CART: 'apple_store_cart',
  WISHLIST: 'apple_store_wishlist',
  ORDERS: 'apple_store_orders',
  PRODUCTS: 'apple_store_products',
  POINTS: 'apple_store_points',
  THEME: 'apple_store_theme',
};

type Listener = () => void;
const listeners: Set<Listener> = new Set();

export const subscribeToStore = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = () => {
  listeners.forEach((l) => l());
};

export const KeychainStore = {
  getProducts(): KeychainProduct[] {
    if (typeof window === 'undefined') return INITIAL_PRODUCTS;
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
    if (!stored) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    try { return JSON.parse(stored); } catch { return INITIAL_PRODUCTS; }
  },

  saveProducts(products: KeychainProduct[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    notifyListeners();
  },

  updateProductStock(productId: string, newStock: number) {
    const products = this.getProducts().map((p) =>
      p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p
    );
    this.saveProducts(products);
  },

  getCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.CART);
    return stored ? JSON.parse(stored) : [];
  },

  saveCart(cart: CartItem[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(cart));
    notifyListeners();
  },

  addToCart(product: KeychainProduct, customConfig?: CustomKeychainConfig) {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id && JSON.stringify(item.customConfig) === JSON.stringify(customConfig)
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        product,
        quantity: 1,
        customConfig
      });
    }
    this.saveCart(cart);
  },

  removeFromCart(cartItemId: string) {
    const cart = this.getCart().filter((item) => item.id !== cartItemId);
    this.saveCart(cart);
  },

  updateCartQuantity(cartItemId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(cartItemId);
      return;
    }
    const cart = this.getCart().map((item) =>
      item.id === cartItemId ? { ...item, quantity } : item
    );
    this.saveCart(cart);
  },

  clearCart() {
    this.saveCart([]);
  },

  getWishlist(): string[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.WISHLIST);
    return stored ? JSON.parse(stored) : [];
  },

  toggleWishlist(productId: string) {
    const list = this.getWishlist();
    const exists = list.includes(productId);
    const updated = exists ? list.filter((id) => id !== productId) : [...list, productId];
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEYS.WISHLIST, JSON.stringify(updated));
    }
    notifyListeners();
    return !exists;
  },

  getOrders(): Order[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
    return stored ? JSON.parse(stored) : [
      {
        id: 'ORD-APL-8819',
        date: '2026-07-24',
        items: [
          { id: '1', product: INITIAL_PRODUCTS[0], quantity: 1 },
          { id: '2', product: INITIAL_PRODUCTS[8], quantity: 1 }
        ],
        totalAmount: 135249,
        discountApplied: 500,
        giftWrapping: true,
        giftMessage: 'Congratulations on your new Apple tech!',
        paymentMethod: 'UPI (Google Pay)',
        shippingAddress: {
          fullName: 'Aarav Sharma',
          street: '42 MG Road, Indiranagar',
          city: 'Bengaluru, KA',
          zip: '560038',
          phone: '+91 98765 43210'
        },
        status: 'Shipped',
        trackingNumber: 'TRK-APPLE-99120',
        estimatedDelivery: 'Tomorrow, 5:00 PM'
      }
    ];
  },

  addOrder(order: Order) {
    const orders = [order, ...this.getOrders()];
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    }
    this.addRewardPoints(Math.floor(order.totalAmount / 100));
    notifyListeners();
  },

  updateOrderStatus(orderId: string, status: Order['status']) {
    const orders = this.getOrders().map((o) =>
      o.id === orderId ? { ...o, status } : o
    );
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    }
    notifyListeners();
  },

  getRewardPoints(): number {
    if (typeof window === 'undefined') return 850;
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.POINTS);
    return stored ? parseInt(stored, 10) : 850;
  },

  addRewardPoints(pts: number) {
    const current = this.getRewardPoints();
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEYS.POINTS, (current + pts).toString());
    }
    notifyListeners();
  },

  redeemRewardPoints(pts: number): boolean {
    const current = this.getRewardPoints();
    if (current >= pts) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEYS.POINTS, (current - pts).toString());
      }
      notifyListeners();
      return true;
    }
    return false;
  },

  getTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light';
    return (localStorage.getItem(LOCAL_STORAGE_KEYS.THEME) as 'light' | 'dark') || 'light';
  },

  toggleTheme(): 'light' | 'dark' {
    const current = this.getTheme();
    const next = current === 'light' ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, next);
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    notifyListeners();
    return next;
  }
};
