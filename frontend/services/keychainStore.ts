export interface UserAddress {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  isDefault?: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  avatar?: string;
  loginProvider: 'Google' | 'Phone';
  addresses: UserAddress[];
}

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
  customizable?: boolean;
}

export interface CartItem {
  id: string;
  product: KeychainProduct;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  discountApplied: number;
  giftWrapping: boolean;
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
    description: 'Apple-designed dynamic driver provides high-fidelity audio with Active Noise Cancellation.',
    features: ['High-Fidelity Audio', 'Active Noise Cancellation', 'Spatial Audio'],
    material: 'Anodized Aluminum & Mesh',
    deliveryDays: 'Express Tomorrow'
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
    description: 'Precision laser-engraved personalized acrylic keychain with gold flake border.',
    features: ['Laser Engraved', 'Scratch Resistant Acrylic', 'Gold Plated Ring'],
    material: 'Premium Pastel Acrylic',
    deliveryDays: '3 Business Days'
  }
];

const LOCAL_STORAGE_KEYS = {
  CART: 'savvora_cart',
  WISHLIST: 'savvora_wishlist',
  ORDERS: 'savvora_orders',
  PRODUCTS: 'savvora_products',
  THEME: 'savvora_theme',
  USER: 'savvora_user_profile',
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
  getUser(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
    if (!stored) return null;
    try { return JSON.parse(stored); } catch { return null; }
  },

  setUser(user: UserProfile | null) {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    }
    notifyListeners();
  },

  logoutUser() {
    this.setUser(null);
  },

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

  addToCart(product: KeychainProduct) {
    const cart = this.getCart();
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: `cart-${Date.now()}`,
        product,
        quantity: 1
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
        items: [{ id: '1', product: INITIAL_PRODUCTS[0], quantity: 1 }],
        totalAmount: 134900,
        discountApplied: 0,
        giftWrapping: true,
        paymentMethod: 'UPI (Google Pay)',
        shippingAddress: {
          fullName: 'Aarav Sharma',
          street: '42 MG Road, Indiranagar',
          city: 'Bengaluru',
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
    notifyListeners();
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
