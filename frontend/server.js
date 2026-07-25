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
<body class="min-h-screen pb-16">

  <!-- Header Navigation -->
  <header class="sticky top-0 z-40 w-full bg-white/80 dark:bg-[#111827]/80 backdrop-blur-xl border-b border-savBorder dark:border-gray-800">
    <div class="max-w-[1200px] mx-auto px-4 lg:px-8 py-3.5 flex items-center justify-between gap-6">
      
      <!-- Logo: ◎ SAVVORA -->
      <div class="flex items-center gap-2.5 cursor-pointer" onclick="showView('home')">
        <div class="w-9 h-9 rounded-full bg-savBlue text-white flex items-center justify-center font-black shadow-md text-lg">
          ◎
        </div>
        <div class="flex flex-col">
          <span class="font-extrabold text-xl tracking-wider text-savBlack dark:text-white uppercase font-sans">SAVVORA</span>
          <span class="text-[9px] font-bold text-savMuted uppercase tracking-widest -mt-1">LUXURY STOREFRONT</span>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="flex-1 max-w-md relative hidden sm:block">
        <i data-lucide="search" class="w-4 h-4 text-savMuted absolute left-4 top-1/2 -translate-y-1/2"></i>
        <input type="text" placeholder="Search Products..." class="w-full pl-11 pr-4 py-2.5 rounded-full bg-savGray dark:bg-gray-800 text-xs font-medium border border-savBorder dark:border-gray-700 text-savBlack dark:text-white" />
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <button onclick="toggleAuthModal()" class="px-4 py-2 rounded-full bg-savBlue text-white font-extrabold text-xs shadow-md">
          Sign In
        </button>
        <div onclick="showView('account')" class="p-2.5 rounded-full bg-savGray dark:bg-gray-800 text-savBlack dark:text-white border border-savBorder dark:border-gray-700 cursor-pointer">
          <i data-lucide="user" class="w-4 h-4"></i>
        </div>
        <div onclick="showView('cart')" class="relative p-2.5 rounded-full bg-savBlue text-white shadow-md cursor-pointer">
          <i data-lucide="shopping-bag" class="w-4 h-4"></i>
          <span class="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-savBlue text-[10px] font-black flex items-center justify-center shadow-md">2</span>
        </div>
        <button onclick="toggleTheme()" class="p-2.5 rounded-full bg-savGray dark:bg-gray-800 text-savBlack dark:text-white border border-savBorder">
          <i data-lucide="moon" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  </header>

  <!-- Main Container -->
  <main class="max-w-[1200px] mx-auto px-4 lg:px-8 mt-6">

    <!-- Category Pill Navigation Bar (44px Pills) -->
    <div class="my-4 overflow-x-auto">
      <div class="flex items-center gap-3 overflow-x-auto pb-2">
        <button class="nav-pill active flex items-center gap-2"><i data-lucide="sparkles" class="w-4 h-4 text-savBlue"></i> New Arrivals</button>
        <button class="nav-pill flex items-center gap-2"><i data-lucide="flame" class="w-4 h-4 text-savBlue"></i> Best Sellers</button>
        <button class="nav-pill flex items-center gap-2"><i data-lucide="smartphone" class="w-4 h-4 text-savBlue"></i> Electronics</button>
        <button class="nav-pill flex items-center gap-2"><i data-lucide="shirt" class="w-4 h-4 text-savBlue"></i> Fashion</button>
        <button class="nav-pill flex items-center gap-2"><i data-lucide="home" class="w-4 h-4 text-savBlue"></i> Home & Kitchen</button>
        <button class="nav-pill flex items-center gap-2"><i data-lucide="heart" class="w-4 h-4 text-savBlue"></i> Beauty</button>
        <button class="nav-pill flex items-center gap-2"><i data-lucide="dumbbell" class="w-4 h-4 text-savBlue"></i> Sports</button>
        <button class="nav-pill flex items-center gap-2"><i data-lucide="book-open" class="w-4 h-4 text-savBlue"></i> Books</button>
        <button class="nav-pill flex items-center gap-2"><i data-lucide="shopping-bag" class="w-4 h-4 text-savBlue"></i> Grocery</button>
        <button class="nav-pill flex items-center gap-2"><i data-lucide="tag" class="w-4 h-4 text-savBlue"></i> Deals</button>
        <button class="nav-pill flex items-center gap-2"><i data-lucide="award" class="w-4 h-4 text-savBlue"></i> Brands</button>
      </div>
    </div>

    <!-- Hero Banner -->
    <section class="rounded-[28px] overflow-hidden my-6 bg-savGray dark:bg-gray-800 border border-savBorder dark:border-gray-700 p-8 sm:p-14 text-center shadow-sm relative">
      <div class="max-w-2xl mx-auto space-y-4">
        <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-savBlue/10 text-savBlue text-xs font-black uppercase">
          <i data-lucide="sparkles" class="w-4 h-4"></i> Premium Shopping Experience
        </span>
        <h1 class="text-4xl sm:text-5xl font-black text-savBlack dark:text-white tracking-tight">
          Up to 70% OFF on Electronics
        </h1>
        <div class="pt-2">
          <button onclick="triggerConfetti()" class="px-8 py-3.5 rounded-full bg-savBlack text-white font-extrabold text-xs uppercase tracking-wider shadow-lg mx-auto">
            Shop Now
          </button>
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
  <div id="authModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
    <div class="w-full max-w-md bg-white dark:bg-[#1F2937] rounded-[28px] p-8 border border-savBorder relative space-y-6">
      <button onclick="toggleAuthModal()" class="absolute top-6 right-6 p-2 rounded-full bg-savGray text-gray-500">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>

      <div class="text-center space-y-1">
        <span class="text-xs font-bold text-gray-400 uppercase">Welcome to</span>
        <h2 class="text-2xl font-black text-savBlack dark:text-white uppercase">SAVVORA</h2>
      </div>

      <button onclick="simulateGoogleLogin()" class="w-full py-3.5 px-4 rounded-full bg-white border border-savBorder font-extrabold text-xs text-savBlack hover:bg-gray-50 flex items-center justify-center gap-3 shadow-sm">
        <span>Continue with Google</span>
      </button>

      <div class="relative flex items-center justify-center my-2">
        <div class="border-t border-savBorder w-full"></div>
        <span class="bg-white dark:bg-[#1F2937] px-3 text-[10px] font-black uppercase text-gray-400 absolute">OR</span>
      </div>

      <div class="space-y-3">
        <label class="block text-xs font-bold text-gray-500">Phone Number</label>
        <div class="flex gap-2">
          <span class="px-3.5 py-3 rounded-2xl bg-savGray font-extrabold text-xs">+91</span>
          <input type="tel" placeholder="98765 43210" class="flex-1 px-4 py-3 rounded-2xl bg-savGray border text-xs font-bold text-savBlack" />
        </div>
        <button onclick="simulatePhoneLogin()" class="w-full py-3.5 rounded-full bg-savBlack text-white font-extrabold text-xs uppercase tracking-wider">
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
