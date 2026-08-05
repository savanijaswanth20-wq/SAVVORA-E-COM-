const http = require('http');
const fs = require('fs');

const PORT = 3000;

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en" class="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SAVVORA – Complete Luxury Product Lineup</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap">
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            savBlack: '#111827',
            savWhite: '#FFFFFF',
            savBlue: '#2563EB',
            savGray: '#F8FAFC',
            savBorder: '#E5E7EB',
            savMuted: '#6B7280'
          },
          fontFamily: { sans: ['Inter', '-apple-system', 'sans-serif'] }
        }
      }
    }
  </script>
  <style>
    body { background-color: #FFFFFF; color: #111827; font-family: 'Inter', sans-serif; transition: background-color 0.3s, color 0.3s; }
    .dark body { background-color: #111827; color: #FFFFFF; }
    .nav-pill {
      height: 44px;
      padding: 0 20px;
      border-radius: 9999px;
      background-color: #F8FAFC;
      border: 1px solid #E5E7EB;
      color: #111827;
      font-size: 12px;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
      transition: all 0.3s ease;
    }
    .dark .nav-pill { background-color: #1F2937; border-color: #374151; color: #FFFFFF; }
    .nav-pill.active { background-color: #111827; color: #FFFFFF; border-color: #111827; }
    .dark .nav-pill.active { background-color: #2563EB; border-color: #2563EB; }
    .product-card {
      background-color: #F8FAFC;
      border: 1px solid #E5E7EB;
      border-radius: 20px;
      padding: 16px;
      transition: all 0.3s ease;
    }
    .dark .product-card {
      background-color: #1F2937;
      border-color: #374151;
    }
    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.12);
    }
  </style>
</head>
<body class="min-h-screen pb-16">  <!-- Header Navigation -->
  <header class="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#111827]/90 backdrop-blur-xl border-b border-gray-200/80 dark:border-gray-800">
    <div class="max-w-[1280px] mx-auto px-4 lg:px-8 py-3.5 flex items-center justify-between gap-6">
      
      <!-- Logo: Blue Circle with Interlocking Hexagon 'S' Emblem -->
      <div class="flex items-center gap-3 cursor-pointer" onclick="showView('home')">
        <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-md shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 8L12 5L7 8V12.5L12 15.5L17 12.5" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7 16L12 19L17 16V11.5L12 8.5L7 11.5" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="flex flex-col">
          <span class="font-extrabold text-xl tracking-wider text-gray-900 dark:text-white uppercase font-sans leading-none">SAVVORA</span>
          <span class="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">LUXURY STOREFRONT</span>
        </div>
      </div>

      <!-- Search Bar with AI Sparkle -->
      <div class="flex-1 max-w-lg relative hidden sm:block">
        <i data-lucide="search" class="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"></i>
        <input type="text" placeholder="Search for products, brands and more..." class="w-full pl-11 pr-10 py-2.5 rounded-full bg-gray-100/90 dark:bg-gray-800/90 text-xs font-medium border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-savBlack dark:text-white" />
        <span class="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 cursor-pointer">
          <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
        </span>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <button onclick="toggleAuthModal()" class="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md flex items-center gap-2 transition-all">
          <i data-lucide="user" class="w-4 h-4"></i>
          <span>Sign In</span>
        </button>
        <div onclick="showView('account')" class="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-savBlack dark:text-white hover:bg-gray-200 transition-all cursor-pointer">
          <i data-lucide="user" class="w-4 h-4"></i>
        </div>
        <div onclick="showView('cart')" class="relative p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-savBlack dark:text-white hover:bg-gray-200 transition-all cursor-pointer">
          <i data-lucide="shopping-bag" class="w-4 h-4"></i>
          <span class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shadow-md">2</span>
        </div>
        <button onclick="toggleTheme()" class="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-savBlack dark:text-white hover:bg-gray-200 transition-all">
          <i data-lucide="moon" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  </header>

  <!-- Main Container -->
            <span>Shop Now</span>
            <i data-lucide="arrow-right" class="w-4 h-4 text-savBlue"></i>
          </button>
          <button onclick="document.getElementById('products')?.scrollIntoView({behavior: 'smooth'})" class="px-7 py-3.5 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white text-savBlack dark:text-white border border-savBorder dark:border-gray-700 font-extrabold text-xs uppercase tracking-wider shadow-xs transition-all">
            Explore Collection
          </button>
        </div>

        <!-- Trust Badges -->
        <div class="pt-3 flex items-center justify-center gap-6 text-[11px] font-bold text-gray-500 dark:text-gray-400">
          <span class="flex items-center gap-1.5"><i data-lucide="check-circle" class="w-3.5 h-3.5 text-blue-500"></i> Genuine Warranty</span>
          <span class="flex items-center gap-1.5"><i data-lucide="truck" class="w-3.5 h-3.5 text-blue-500"></i> Free Express Shipping</span>
          <span class="flex items-center gap-1.5"><i data-lucide="shield-check" class="w-3.5 h-3.5 text-blue-500"></i> Secure Checkout</span>
        </div>
      </div>
    </section>

    <!-- Complete Products Lineup Grid (All Preserved) -->
    <section class="space-y-6 my-10">
      <div class="flex justify-between items-center">
        <div>
          <span class="text-xs font-bold text-savBlue uppercase tracking-wider">SAVVORA Complete Lineup</span>
          <h2 class="text-3xl font-black text-savBlack dark:text-white tracking-tight">All Storefront Products</h2>
        </div>
        <span class="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">⚡ Live Stock Available</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <!-- Card 1 -->
        <div class="product-card flex flex-col justify-between">
          <div class="w-full h-56 rounded-[16px] overflow-hidden relative bg-white dark:bg-black border border-savBorder">
            <img src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80" class="w-full h-full object-cover" />
            <span class="absolute top-3 left-3 px-3 py-0.5 rounded-full bg-savBlue text-white text-[10px] font-black uppercase">BESTSELLER</span>
          </div>
          <div class="mt-4 space-y-2">
            <h3 class="font-extrabold text-savBlack dark:text-white text-sm">Wireless Active ANC Noise-Canceling Earbuds</h3>
            <div class="flex items-center gap-1 text-xs text-amber-500 font-bold">
              <span>★★★★☆</span>
              <span class="text-savMuted">(4.8)</span>
            </div>
            <div class="pt-2 border-t border-savBorder flex items-center justify-between">
              <span class="text-lg font-black text-savBlack dark:text-white">₹2,999</span>
              <button onclick="triggerConfetti()" class="px-5 py-2.5 rounded-full bg-savBlack text-white text-xs font-bold flex items-center gap-1.5">
                <i data-lucide="shopping-bag" class="w-3.5 h-3.5 text-savBlue"></i> Add to Cart
              </button>
            </div>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="product-card flex flex-col justify-between">
          <div class="w-full h-56 rounded-[16px] overflow-hidden relative bg-white dark:bg-black border border-savBorder">
            <img src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80" class="w-full h-full object-cover" />
            <span class="absolute top-3 left-3 px-3 py-0.5 rounded-full bg-savBlue text-white text-[10px] font-black uppercase">NEW</span>
          </div>
          <div class="mt-4 space-y-2">
            <h3 class="font-extrabold text-savBlack dark:text-white text-sm">iPhone 15 Pro Max Titanium</h3>
            <div class="flex items-center gap-1 text-xs text-amber-500 font-bold">
              <span>★★★★★</span>
              <span class="text-savMuted">(4.9)</span>
            </div>
            <div class="pt-2 border-t border-savBorder flex items-center justify-between">
              <span class="text-lg font-black text-savBlack dark:text-white">₹1,34,900</span>
              <button onclick="triggerConfetti()" class="px-5 py-2.5 rounded-full bg-savBlack text-white text-xs font-bold flex items-center gap-1.5">
                <i data-lucide="shopping-bag" class="w-3.5 h-3.5 text-savBlue"></i> Add to Cart
              </button>
            </div>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="product-card flex flex-col justify-between">
          <div class="w-full h-56 rounded-[16px] overflow-hidden relative bg-white dark:bg-black border border-savBorder">
            <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80" class="w-full h-full object-cover" />
            <span class="absolute top-3 left-3 px-3 py-0.5 rounded-full bg-savBlue text-white text-[10px] font-black uppercase">BESTSELLER</span>
          </div>
          <div class="mt-4 space-y-2">
            <h3 class="font-extrabold text-savBlack dark:text-white text-sm">MacBook Pro 16" M3 Max</h3>
            <div class="flex items-center gap-1 text-xs text-amber-500 font-bold">
              <span>★★★★★</span>
              <span class="text-savMuted">(5.0)</span>
            </div>
            <div class="pt-2 border-t border-savBorder flex items-center justify-between">
              <span class="text-lg font-black text-savBlack dark:text-white">₹3,49,900</span>
              <button onclick="triggerConfetti()" class="px-5 py-2.5 rounded-full bg-savBlack text-white text-xs font-bold flex items-center gap-1.5">
                <i data-lucide="shopping-bag" class="w-3.5 h-3.5 text-savBlue"></i> Add to Cart
              </button>
            </div>
          </div>
        </div>

        <!-- Card 4 -->
        <div class="product-card flex flex-col justify-between">
          <div class="w-full h-56 rounded-[16px] overflow-hidden relative bg-white dark:bg-black border border-savBorder">
            <img src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80" class="w-full h-full object-cover" />
            <span class="absolute top-3 left-3 px-3 py-0.5 rounded-full bg-savBlue text-white text-[10px] font-black uppercase">TRENDING</span>
          </div>
          <div class="mt-4 space-y-2">
            <h3 class="font-extrabold text-savBlack dark:text-white text-sm">AirPods Max Space Gray</h3>
            <div class="flex items-center gap-1 text-xs text-amber-500 font-bold">
              <span>★★★★☆</span>
              <span class="text-savMuted">(4.8)</span>
            </div>
            <div class="pt-2 border-t border-savBorder flex items-center justify-between">
              <span class="text-lg font-black text-savBlack dark:text-white">₹59,900</span>
              <button onclick="triggerConfetti()" class="px-5 py-2.5 rounded-full bg-savBlack text-white text-xs font-bold flex items-center gap-1.5">
                <i data-lucide="shopping-bag" class="w-3.5 h-3.5 text-savBlue"></i> Add to Cart
              </button>
            </div>
          </div>
        </div>

        <!-- Card 5 -->
        <div class="product-card flex flex-col justify-between">
          <div class="w-full h-56 rounded-[16px] overflow-hidden relative bg-white dark:bg-black border border-savBorder">
            <img src="https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80" class="w-full h-full object-cover" />
            <span class="absolute top-3 left-3 px-3 py-0.5 rounded-full bg-savBlue text-white text-[10px] font-black uppercase">NEW</span>
          </div>
          <div class="mt-4 space-y-2">
            <h3 class="font-extrabold text-savBlack dark:text-white text-sm">Apple Watch Ultra 2 Titanium</h3>
            <div class="flex items-center gap-1 text-xs text-amber-500 font-bold">
              <span>★★★★★</span>
              <span class="text-savMuted">(4.9)</span>
            </div>
            <div class="pt-2 border-t border-savBorder flex items-center justify-between">
              <span class="text-lg font-black text-savBlack dark:text-white">₹89,900</span>
              <button onclick="triggerConfetti()" class="px-5 py-2.5 rounded-full bg-savBlack text-white text-xs font-bold flex items-center gap-1.5">
                <i data-lucide="shopping-bag" class="w-3.5 h-3.5 text-savBlue"></i> Add to Cart
              </button>
            </div>
          </div>
        </div>

        <!-- Card 6 -->
        <div class="product-card flex flex-col justify-between">
          <div class="w-full h-56 rounded-[16px] overflow-hidden relative bg-white dark:bg-black border border-savBorder">
            <img src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80" class="w-full h-full object-cover" />
            <span class="absolute top-3 left-3 px-3 py-0.5 rounded-full bg-savBlue text-white text-[10px] font-black uppercase">BESTSELLER</span>
          </div>
          <div class="mt-4 space-y-2">
            <h3 class="font-extrabold text-savBlack dark:text-white text-sm">Keychron Q1 Pro Mechanical Keyboard</h3>
            <div class="flex items-center gap-1 text-xs text-amber-500 font-bold">
              <span>★★★★★</span>
              <span class="text-savMuted">(4.9)</span>
            </div>
            <div class="pt-2 border-t border-savBorder flex items-center justify-between">
              <span class="text-lg font-black text-savBlack dark:text-white">₹18,900</span>
              <button onclick="triggerConfetti()" class="px-5 py-2.5 rounded-full bg-savBlack text-white text-xs font-bold flex items-center gap-1.5">
                <i data-lucide="shopping-bag" class="w-3.5 h-3.5 text-savBlue"></i> Add to Cart
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>

  </main>

  <!-- AUTHENTICATION MODAL -->
  <div id="authModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
    <div class="w-full max-w-md bg-white rounded-[28px] p-8 border border-gray-200 relative space-y-6 shadow-2xl">
      <button onclick="toggleAuthModal()" class="absolute top-6 right-6 p-2 rounded-full bg-gray-100 text-gray-500 hover:text-slate-900 hover:bg-gray-200">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>

      <div class="text-center space-y-1">
        <span class="text-xs font-bold text-gray-400 uppercase">Welcome to</span>
        <h2 class="text-2xl font-black text-slate-900 uppercase">SAVVORA</h2>
      </div>

      <button onclick="simulateGoogleLogin()" class="w-full py-3.5 px-4 rounded-full bg-white border border-gray-200 font-extrabold text-xs text-slate-900 hover:bg-gray-50 flex items-center justify-center gap-3 shadow-sm">
        <span>Continue with Google</span>
      </button>

      <div class="relative flex items-center justify-center my-2">
        <div class="border-t border-gray-200 w-full"></div>
        <span class="bg-white px-3 text-[10px] font-black uppercase text-gray-400 absolute">OR</span>
      </div>

      <div class="space-y-3">
        <label class="block text-xs font-bold text-gray-500">Phone Number</label>
        <div class="flex gap-2">
          <span class="px-3.5 py-3 rounded-2xl bg-gray-100 font-extrabold text-xs text-slate-700">+91</span>
          <input type="tel" placeholder="98765 43210" class="flex-1 px-4 py-3 rounded-2xl bg-gray-100 border border-gray-200 text-xs font-bold text-slate-900" />
        </div>
        <button onclick="simulatePhoneLogin()" class="w-full py-3.5 rounded-full bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider hover:bg-slate-800">
          Send OTP
        </button>
      </div>

      <p class="text-center text-[10px] text-gray-400">By continuing, you agree to Terms & Privacy Policy</p>
    </div>
  </div>

  <script>
    lucide.createIcons();
    function toggleTheme() { document.documentElement.classList.toggle('dark'); }
    function triggerConfetti() { confetti({ particleCount: 100, spread: 70 }); }
    function toggleAuthModal() {
      document.getElementById('authModal').classList.toggle('hidden');
    }
    function showView(viewName) {
      if (viewName === 'account' || viewName === 'cart') {
        toggleAuthModal();
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    function simulateGoogleLogin() {
      alert("Signed in successfully via Google (Aarav Sharma)!");
      toggleAuthModal();
    }
    function simulatePhoneLogin() {
      alert("OTP sent to mobile number! Verification code: 123456");
      toggleAuthModal();
    }
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(HTML_CONTENT);
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
