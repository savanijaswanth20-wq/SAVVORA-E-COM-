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
  loginProvider: 'Facebook' | 'Google' | 'Phone' | 'Email';
  role?: 'admin' | 'staff' | 'customer';
  addresses: UserAddress[];
  profileCompleted?: boolean;
  preferences?: string[];
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

export interface CustomKeychainConfig {
  text: string;
  font: string;
  textColor: string;
  baseMaterial: string;
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
  status: 'Pending' | 'Processing' | 'Preparing' | 'Shipped' | 'Delivered' | 'Cancelled';
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
    categoryId: 'electronics',
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
    name: 'Wireless Active ANC Noise-Canceling Earbuds',
    category: 'Wireless Earbuds',
    categoryId: 'electronics',
    price: 2999,
    originalPrice: 4999,
    rating: 4.8,
    reviewCount: 3120,
    stock: 45,
    sku: 'EAR-ANC-2999',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    badge: 'BESTSELLER',
    description: 'High performance active noise canceling wireless earbuds with deep bass response & 32 hour playback.',
    features: ['Active Noise Cancellation', '32 Hour Playback', 'IPX5 Sweatproof', 'USB-C Fast Charge'],
    material: 'Matte Touch Resin',
    deliveryDays: 'Express Tomorrow'
  },
  {
    id: 'prod-05',
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
    id: 'prod-06',
    name: 'Keychron Q1 Pro Custom Mechanical Keyboard',
    category: 'Mechanical Keyboards',
    categoryId: 'electronics',
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
    id: 'prod-07',
    name: 'Logitech MX Master 3S Ergonomic Mouse',
    category: 'Electronics',
    categoryId: 'electronics',
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
    id: 'prod-08',
    name: 'Bellroy Classic Leather Backpack 20L',
    category: 'Fashion',
    categoryId: 'fashion',
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
    id: 'prod-09',
    name: 'Bang & Olufsen Beosound Explore Speaker',
    category: 'Electronics',
    categoryId: 'electronics',
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
    category: 'Fashion',
    categoryId: 'fashion',
    price: 349,
    originalPrice: 499,
    rating: 4.9,
    reviewCount: 328,
    stock: 15,
    sku: 'KC-NAME-01',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    badge: 'BESTSELLER',
    description: 'Precision laser-engraved personalized acrylic keychain with gold flake border and charm accents.',
    features: ['Laser Engraved', 'Scratch Resistant Acrylic', 'Gold Plated Ring'],
    material: 'Premium Pastel Acrylic',
    deliveryDays: '3 Business Days'
  },
  {
    id: 'kc-02',
    name: 'Polaroid Memory Photo Keychain',
    category: 'Fashion',
    categoryId: 'fashion',
    price: 399,
    originalPrice: 599,
    rating: 5.0,
    reviewCount: 215,
    stock: 10,
    sku: 'KC-PHOTO-02',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
    badge: 'TRENDING',
    description: 'Encase your favourite polaroid memory photo inside a crystal clear glassmorphic acrylic frame with soft tassels.',
    features: ['Double Sided Photo', 'UV Protective Coating', 'Soft Tassel'],
    material: 'High-Translucency Resin',
    deliveryDays: '2 Business Days'
  },
  {
    id: 'kc-03',
    name: 'Matching Magnet Couple Keychains',
    category: 'Fashion',
    categoryId: 'fashion',
    price: 599,
    originalPrice: 799,
    rating: 4.9,
    reviewCount: 412,
    stock: 14,
    sku: 'KC-COUPLE-03',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    badge: 'BESTSELLER',
    description: 'Cute matching half-heart magnetic keychains for couples that snap together when brought close.',
    features: ['Strong Neodymium Magnets', 'Rose Gold Finish', 'Custom Date Engraving'],
    material: 'Zinc Alloy & Enamel',
    deliveryDays: '3 Business Days'
  },

  // ── Baby & Kids ────────────────────────────────────────────────────────────
  {
    id: 'bk-01',
    name: 'Lego Technic Formula E Race Car (42166)',
    category: 'Toys',
    categoryId: 'baby-kids',
    price: 3499,
    originalPrice: 4299,
    rating: 4.9,
    reviewCount: 2140,
    stock: 30,
    sku: 'LEGO-42166',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80',
    badge: 'BESTSELLER',
    description: 'Officially licensed Formula E Gen3 EVO race car with opening cockpit, detailed V engine, and authentic livery.',
    features: ['220 Pieces', 'Authentic Design', 'Ages 10+', 'Pull-Back Motor'],
    material: 'ABS Plastic',
    deliveryDays: '2 Business Days'
  },
  {
    id: 'bk-02',
    name: 'Mamy Poko Pants Extra Absorb Diapers (M 72 Count)',
    category: 'Baby Care',
    categoryId: 'baby-kids',
    price: 899,
    originalPrice: 1199,
    rating: 4.7,
    reviewCount: 8900,
    stock: 200,
    sku: 'MPK-PANT-M72',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&auto=format&fit=crop&q=80',
    badge: 'BESTSELLER',
    description: 'Extra-absorb pants diaper with Japanese Cotton top sheet for soft and dry comfort. 12-hour dryness guaranteed.',
    features: ['12-Hour Dryness', 'Japanese Cotton', 'Waistband Stretch', 'Leak-Guard Barrier'],
    material: 'Japanese Cotton & Polymer',
    deliveryDays: 'Express Tomorrow'
  },
  {
    id: 'bk-03',
    name: "Barbie Dreamhouse Playset (3-Story)",
    category: 'Toys',
    categoryId: 'baby-kids',
    price: 9999,
    originalPrice: 14999,
    rating: 4.8,
    reviewCount: 3120,
    stock: 15,
    sku: 'BBR-DREAM-3S',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80',
    badge: 'TRENDING',
    description: '3-story Barbie Dreamhouse with 8+ rooms, working elevator, pool, and 70+ accessories.',
    features: ['70+ Accessories', 'Working Slide & Pool', 'Lights & Sounds', '3 Stories'],
    material: 'ABS Plastic',
    deliveryDays: '3 Business Days'
  },
  {
    id: 'bk-04',
    name: "Funskool Cricket Set Junior (Hard Ball)",
    category: 'Sports & Toys',
    categoryId: 'baby-kids',
    price: 799,
    originalPrice: 999,
    rating: 4.5,
    reviewCount: 1450,
    stock: 60,
    sku: 'FNS-CRKT-JR',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80',
    badge: 'NEW',
    description: 'Junior cricket set with hardwood bat, hard ball, stumps & bails. Perfect for ages 6–12.',
    features: ['Hardwood Bat', 'Hard Ball Included', 'Wooden Stumps', 'Ages 6–12'],
    material: 'Hardwood & Rubber',
    deliveryDays: '2 Business Days'
  },
  {
    id: 'bk-05',
    name: 'Crocs Classic Clog Kids (Cerulean Blue)',
    category: "Kids' Footwear",
    categoryId: 'baby-kids',
    price: 1899,
    originalPrice: 2699,
    rating: 4.8,
    reviewCount: 5630,
    stock: 50,
    sku: 'CRCS-KID-CB',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    badge: 'BESTSELLER',
    description: 'Iconic kids clog with Croslite foam cushioning, ventilation ports, and easy slip-on wear.',
    features: ['Croslite Foam', 'Ventilation Ports', 'Slip-On', 'Machine Washable'],
    material: 'Croslite Foam',
    deliveryDays: 'Express Tomorrow'
  },

  // ── Home & Furniture ───────────────────────────────────────────────────────
  {
    id: 'hf-01',
    name: 'Prestige Iris 750W Mixer Grinder (3 Jars)',
    category: 'Kitchen Appliances',
    categoryId: 'home-furniture',
    price: 2299,
    originalPrice: 3499,
    rating: 4.7,
    reviewCount: 11200,
    stock: 80,
    sku: 'PRS-IRIS-750',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80',
    badge: 'BESTSELLER',
    description: '750W Prestige mixer grinder with 3 stainless steel jars for wet & dry grinding and a 5-year motor warranty.',
    features: ['750W Motor', '3 Stainless Steel Jars', '5-Year Motor Warranty', 'Speed Control'],
    material: 'Stainless Steel & ABS',
    deliveryDays: '2 Business Days'
  },
  {
    id: 'hf-02',
    name: 'Nilkamal Chester Solid Wood Single Bed',
    category: 'Bedroom Furniture',
    categoryId: 'home-furniture',
    price: 12999,
    originalPrice: 18999,
    rating: 4.6,
    reviewCount: 3400,
    stock: 12,
    sku: 'NLK-CHEST-SB',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=80',
    badge: 'NEW',
    description: 'Sheesham solid wood single bed with box storage, walnut finish, and strong hardwood frame.',
    features: ['Sheesham Wood', 'Box Storage', 'Walnut Finish', '5-Year Warranty'],
    material: 'Solid Sheesham Wood',
    deliveryDays: '7 Business Days'
  },
  {
    id: 'hf-03',
    name: 'Bombay Dyeing Microfibre Comforter (Double)',
    category: 'Bedding & Furnishing',
    categoryId: 'home-furniture',
    price: 1499,
    originalPrice: 2499,
    rating: 4.8,
    reviewCount: 6700,
    stock: 100,
    sku: 'BD-MICROCMFT-D',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80',
    badge: 'BESTSELLER',
    description: 'Ultra-soft microfibre reversible comforter with 300 GSM filling. Machine washable.',
    features: ['300 GSM Fill', 'Reversible Design', 'Machine Washable', 'Anti-Allergic'],
    material: 'Microfibre Polyester',
    deliveryDays: 'Express Tomorrow'
  },
  {
    id: 'hf-04',
    name: 'Philips LED Bulb 9W B22 (Pack of 6)',
    category: 'Home Lighting',
    categoryId: 'home-furniture',
    price: 499,
    originalPrice: 799,
    rating: 4.7,
    reviewCount: 14300,
    stock: 500,
    sku: 'PHI-LED9W-6PK',
    image: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=800&auto=format&fit=crop&q=80',
    badge: 'BESTSELLER',
    description: 'Energy-saving Philips LED 9W bulbs with 810 lumens, 6500K cool daylight, and 15000-hour lifespan.',
    features: ['9W = 60W Equivalent', '810 Lumens', '6500K Cool Daylight', '15000-Hour Life'],
    material: 'Polycarbonate',
    deliveryDays: 'Express Tomorrow'
  },
  {
    id: 'hf-05',
    name: 'Milton Thermosteel Flask 1L (Hot & Cold)',
    category: 'Kitchen Storage',
    categoryId: 'home-furniture',
    price: 799,
    originalPrice: 1299,
    rating: 4.8,
    reviewCount: 22100,
    stock: 150,
    sku: 'MLT-THERMO-1L',
    image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800&auto=format&fit=crop&q=80',
    badge: 'BESTSELLER',
    description: 'Milton thermosteel insulated flask keeps beverages hot for 24 hours or cold for 48 hours.',
    features: ['24h Hot / 48h Cold', '1000ml Capacity', 'Stainless Steel Interior', 'Leak Proof'],
    material: 'Food-Grade Stainless Steel',
    deliveryDays: 'Express Tomorrow'
  },

  // ── Sports, Books & More ───────────────────────────────────────────────────
  {
    id: 'sb-01',
    name: 'Cosco Footballer Football (Size 5)',
    category: 'Sports',
    categoryId: 'sports-books',
    price: 649,
    originalPrice: 999,
    rating: 4.6,
    reviewCount: 4500,
    stock: 75,
    sku: 'CSC-FTBL-S5',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80',
    badge: 'BESTSELLER',
    description: 'Size 5 FIFA-quality Cosco Footballer with butyl bladder, 32-panel design, and machine-stitched seams.',
    features: ['Size 5 Match Ball', '32-Panel Design', 'Butyl Bladder', 'Machine Stitched'],
    material: 'PVC & Butyl',
    deliveryDays: '2 Business Days'
  },
  {
    id: 'sb-02',
    name: 'Nivia Storm Basketball (Size 7)',
    category: 'Sports',
    categoryId: 'sports-books',
    price: 1099,
    originalPrice: 1599,
    rating: 4.7,
    reviewCount: 2870,
    stock: 40,
    sku: 'NIV-STRMBB-7',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80',
    badge: 'NEW',
    description: 'Professional rubber basketball with deep channel design for superior grip. Suitable for outdoor courts.',
    features: ['Size 7', 'Deep Channel Grip', 'Rubber Outer', 'Outdoor Use'],
    material: 'Rubber',
    deliveryDays: '2 Business Days'
  },
  {
    id: 'sb-03',
    name: 'Muscleblaze Whey Gold Protein (2 kg, Rich Chocolate)',
    category: 'Health & Nutrition',
    categoryId: 'sports-books',
    price: 4499,
    originalPrice: 5999,
    rating: 4.8,
    reviewCount: 18700,
    stock: 60,
    sku: 'MB-WGOLD-2KG',
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&auto=format&fit=crop&q=80',
    badge: 'BESTSELLER',
    description: 'MuscleBlaze Whey Gold with 25g protein per serving from 100% whey protein concentrate. Lab tested.',
    features: ['25g Protein/Serving', '0g Trans Fat', 'Lab Tested & Certified', 'Rich Chocolate Flavour'],
    material: '100% Whey Protein Concentrate',
    deliveryDays: 'Express Tomorrow'
  },
  {
    id: 'sb-04',
    name: 'Atomic Habits — James Clear (Paperback)',
    category: 'Books',
    categoryId: 'sports-books',
    price: 399,
    originalPrice: 599,
    rating: 4.9,
    reviewCount: 55000,
    stock: 300,
    sku: 'BK-ATOMICH-PB',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=80',
    badge: 'BESTSELLER',
    description: 'No. 1 International bestseller: tiny changes, remarkable results. Build good habits and break bad ones.',
    features: ['320 Pages', 'Paperback', 'English', 'National Bestseller'],
    material: 'Paper & Cardboard Cover',
    deliveryDays: 'Express Tomorrow'
  },
  {
    id: 'sb-05',
    name: 'Sony PlayStation 5 Console (Disc Edition)',
    category: 'Gaming',
    categoryId: 'sports-books',
    price: 54990,
    originalPrice: 59990,
    rating: 4.9,
    reviewCount: 9800,
    stock: 5,
    sku: 'SNY-PS5-DISC',
    image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&auto=format&fit=crop&q=80',
    badge: 'LIMITED',
    description: 'PlayStation 5 with custom 825GB SSD, ultra-high speed loading, 4K gaming, and DualSense haptic feedback.',
    features: ['Custom 825GB SSD', '4K Blu-ray Drive', 'DualSense Controller', '4K / 120fps Gaming'],
    material: 'ABS Plastic',
    deliveryDays: '2 Business Days'
  },
  {
    id: 'sb-06',
    name: 'Tata 1mg Multivitamin Daily (60 Tablets)',
    category: 'Health & Nutrition',
    categoryId: 'sports-books',
    price: 499,
    originalPrice: 699,
    rating: 4.7,
    reviewCount: 7400,
    stock: 200,
    sku: 'TATA-MVITD-60',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
    badge: 'TRENDING',
    description: 'Daily multivitamin with 23 essential nutrients, immunity booster with Vitamin C & Zinc, and antioxidants.',
    features: ['23 Nutrients', 'Vitamin C & Zinc', 'No Added Sugar', 'FSSAI Certified'],
    material: 'Pharmaceutical Grade',
    deliveryDays: 'Express Tomorrow'
  },
  {
    id: 'sb-07',
    name: 'Boldfit Yoga Mat Non-Slip 6mm (With Carry Strap)',
    category: 'Exercise & Fitness',
    categoryId: 'sports-books',
    price: 799,
    originalPrice: 1299,
    rating: 4.6,
    reviewCount: 12800,
    stock: 120,
    sku: 'BDF-YOGA-6MM',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
    badge: 'BESTSELLER',
    description: 'Non-slip 6mm thick yoga mat with carry strap, sweat-resistant texture, and eco-friendly TPE foam.',
    features: ['6mm Thickness', 'Non-Slip Surface', 'Eco TPE Foam', 'Carry Strap Included'],
    material: 'TPE Eco Foam',
    deliveryDays: 'Express Tomorrow'
  },

  // ── TVs & Appliances ───────────────────────────────────────────────────────
  {
    id: 'tv-01',
    name: 'Samsung 55" Crystal 4K UHD Smart TV (UA55CUE60)',
    category: 'Televisions',
    categoryId: 'tv-appliances',
    price: 42990,
    originalPrice: 64900,
    rating: 4.7,
    reviewCount: 7100,
    stock: 20,
    sku: 'SAM-55CUE60',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80',
    badge: 'TRENDING',
    description: '55" Crystal 4K UHD TV with Crystal Processor 4K, PurColor display, and built-in Amazon Alexa.',
    features: ['4K UHD Crystal Display', 'PurColor', 'Alexa Built-in', 'AirSlim Design'],
    material: 'Tempered Glass & ABS',
    deliveryDays: '3 Business Days'
  },
  {
    id: 'tv-02',
    name: 'LG 7 kg 5 Star Inverter Fully-Automatic Washing Machine',
    category: 'Washing Machines',
    categoryId: 'tv-appliances',
    price: 27990,
    originalPrice: 38000,
    rating: 4.7,
    reviewCount: 5200,
    stock: 10,
    sku: 'LG-7KG-FW',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80',
    badge: 'NEW',
    description: 'LG 7kg front load washing machine with 6 Motion Direct Drive, TurboWash, and 10-year motor warranty.',
    features: ['7kg Capacity', '6 Motion DD Motor', 'TurboWash', '10-Year Motor Warranty'],
    material: 'Stainless Steel Drum',
    deliveryDays: '5 Business Days'
  },

  // ── Men ───────────────────────────────────────────────────────────────────
  {
    id: 'men-01',
    name: 'US Polo Assn. Slim Fit T-Shirt (Pack of 2)',
    category: "Men's Clothing",
    categoryId: 'men',
    price: 799,
    originalPrice: 1399,
    rating: 4.6,
    reviewCount: 8900,
    stock: 200,
    sku: 'USP-TST-P2',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80',
    badge: 'BESTSELLER',
    description: "Pack of 2 slim-fit cotton crew-neck T-shirts from US Polo Assn. with embroidered logo.",
    features: ['100% Cotton', 'Slim Fit', 'Embroidered Logo', 'Machine Washable'],
    material: '100% Combed Cotton',
    deliveryDays: '2 Business Days'
  },
  {
    id: 'men-02',
    name: 'Levi\'s 511 Slim Fit Jeans (Midnight)',
    category: "Men's Clothing",
    categoryId: 'men',
    price: 2999,
    originalPrice: 4499,
    rating: 4.8,
    reviewCount: 16400,
    stock: 80,
    sku: "LEV-511-MDNT",
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80',
    badge: 'TRENDING',
    description: "Levi's 511 slim fit jeans in midnight wash with stretch denim for all-day comfort.",
    features: ['Slim Fit', 'Stretch Denim', 'Midnight Wash', 'YKK Zipper'],
    material: '99% Cotton 1% Elastane',
    deliveryDays: '2 Business Days'
  },

  // ── Women ─────────────────────────────────────────────────────────────────
  {
    id: 'wm-01',
    name: 'Libas Printed Chiffon Saree (With Blouse)',
    category: "Women's Ethnic",
    categoryId: 'women',
    price: 1299,
    originalPrice: 2499,
    rating: 4.7,
    reviewCount: 5600,
    stock: 60,
    sku: 'LIB-SAREE-CHF',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
    badge: 'NEW',
    description: 'Elegant floral-printed chiffon saree with matching unstitched blouse piece.',
    features: ['Chiffon Fabric', 'Digital Print', 'With Blouse', 'Dry Clean'],
    material: '100% Chiffon',
    deliveryDays: '3 Business Days'
  },
  {
    id: 'wm-02',
    name: 'Adidas Ultraboost 22 Running Shoes (Women)',
    category: "Women's Footwear",
    categoryId: 'women',
    price: 8999,
    originalPrice: 14999,
    rating: 4.9,
    reviewCount: 3800,
    stock: 25,
    sku: 'ADI-UB22-W',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    badge: 'TRENDING',
    description: "Women's Adidas Ultraboost 22 with BOOST midsole cushioning and Primeknit+ upper for premium run feel.",
    features: ['BOOST Midsole', 'Primeknit+ Upper', 'Continental Rubber Outsole', 'LEP System'],
    material: 'Primeknit & Rubber',
    deliveryDays: 'Express Tomorrow'
  }
];

export const SUPPLIERS_LIST = [
  {
    id: 'sup-1',
    name: 'Apple India Logistics & Supply',
    category: 'Electronics & Mobiles',
    contact: 'supply-india@apple.com',
    status: 'Verified'
  },
  {
    id: 'sup-2',
    name: 'Sony Precision Tech Ltd',
    category: 'Audio & Wearables',
    contact: 'partner@sony-audio.co.in',
    status: 'Verified'
  },
  {
    id: 'sup-3',
    name: 'Keychron Mechanical Keyboards Inc',
    category: 'Computer Peripherals',
    contact: 'b2b@keychron.in',
    status: 'Active'
  }
];

export const EMPLOYEES_LIST = [
  {
    id: 'emp-1',
    name: 'Savan Jaswanth',
    role: 'Store Owner & Admin',
    email: 'admin@savvora.com'
  },
  {
    id: 'emp-2',
    name: 'Priya Sharma',
    role: 'Inventory Manager',
    email: 'priya.inventory@savvora.com'
  },
  {
    id: 'emp-3',
    name: 'Rahul Verma',
    role: 'Customer Success & Support Lead',
    email: 'rahul.support@savvora.com'
  }
];

// Helper functions replacing KeychainStore local storage functions for components
const LOCAL_STORAGE_KEYS = {
  CART: 'savvora_cart',
  WISHLIST: 'savvora_wishlist',
  ORDERS: 'savvora_orders',
  PRODUCTS: 'savvora_products',
  THEME: 'savvora_theme',
  USER: 'savvora_user_profile',
  RECENTLY_VIEWED: 'savvora_recently_viewed',
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
    try {
      const parsed = JSON.parse(stored);
      return parsed.length >= INITIAL_PRODUCTS.length ? parsed : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
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
        id: `cart-${Date.now()}`,
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

  saveOrders(orders: Order[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    notifyListeners();
  },

  addOrder(order: Order) {
    const orders = [order, ...this.getOrders()];
    this.saveOrders(orders);
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
  },

  getRecentlyViewed(): KeychainProduct[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.RECENTLY_VIEWED);
    if (!stored) return [];
    try { return JSON.parse(stored); } catch { return []; }
  },

  addRecentlyViewed(product: KeychainProduct) {
    if (typeof window === 'undefined') return;
    const current = this.getRecentlyViewed().filter((p) => p.id !== product.id);
    const updated = [product, ...current].slice(0, 6);
    localStorage.setItem(LOCAL_STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(updated));
    notifyListeners();
  }
};
