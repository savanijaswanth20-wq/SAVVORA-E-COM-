const http = require('http');
const fs = require('fs');

const PORT = 3000;

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en" class="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SAVVORA – Premium Shopping Experience | Apple × Stripe × Nike UI</title>
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
      items-center;
      gap: 8px;
      white-space: nowrap;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .dark .nav-pill {
      background-color: #1F2937;
      border-color: #374151;
      color: #FFFFFF;
    }
    .nav-pill:hover {
      background-color: #FFFFFF;
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.15);
    }
    .dark .nav-pill:hover {
      background-color: #111827;
    }
    .nav-pill.active {
      background-color: #111827;
      color: #FFFFFF;
      border-color: #111827;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
    }
    .dark .nav-pill.active {
      background-color: #2563EB;
      border-color: #2563EB;
    }
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

  <!-- Header Navigation: SAVVORA | Search Products... | 👤 ❤️ 🛒 -->
  <header class="sticky top-0 z-40 w-full bg-white/80 dark:bg-[#111827]/80 backdrop-blur-xl border-b border-savBorder dark:border-gray-800">
    <div class="max-w-[1200px] mx-auto px-4 lg:px-8 py-3.5 flex items-center justify-between gap-6">
      
      <!-- Logo: ◎ SAVVORA -->
      <div class="flex items-center gap-2.5 cursor-pointer" onclick="showView('home')">
        <div class="w-9 h-9 rounded-full bg-savBlue text-white flex items-center justify-center font-black shadow-md shadow-savBlue/20 text-lg">
          ◎
        </div>
        <div class="flex flex-col">
          <span class="font-extrabold text-xl tracking-wider text-savBlack dark:text-white uppercase font-sans">
            SAVVORA
          </span>
          <span class="text-[9px] font-bold text-savMuted uppercase tracking-widest -mt-1">
            LUXURY STOREFRONT
          </span>
        </div>
      </div>

      <!-- Floating Search Bar -->
      <div class="flex-1 max-w-md relative hidden sm:block">
        <i data-lucide="search" class="w-4 h-4 text-savMuted absolute left-4 top-1/2 -translate-y-1/2"></i>
        <input type="text" placeholder="Search Products..." class="w-full pl-11 pr-4 py-2.5 rounded-full bg-savGray dark:bg-gray-800 text-xs font-medium border border-savBorder dark:border-gray-700 text-savBlack dark:text-white focus:outline-none focus:border-savBlue" />
      </div>

      <!-- Actions: 👤 ❤️ 🛒 Theme -->
      <div class="flex items-center gap-3">
        <div onclick="showView('account')" class="p-2.5 rounded-full bg-savGray dark:bg-gray-800 text-savBlack dark:text-white border border-savBorder dark:border-gray-700 cursor-pointer" title="User Profile 👤">
          <i data-lucide="user" class="w-4 h-4"></i>
        </div>
        <div onclick="showView('account')" class="relative p-2.5 rounded-full bg-savGray dark:bg-gray-800 text-savBlack dark:text-white border border-savBorder dark:border-gray-700 cursor-pointer" title="Wishlist ❤️">
          <i data-lucide="heart" class="w-4 h-4"></i>
        </div>
        <div onclick="showView('cart')" class="relative p-2.5 rounded-full bg-savBlue text-white shadow-md shadow-savBlue/20 cursor-pointer" title="Shopping Cart 🛒">
          <i data-lucide="shopping-bag" class="w-4 h-4"></i>
          <span class="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-savBlue text-[10px] font-black flex items-center justify-center shadow-md">2</span>
        </div>
        <button onclick="toggleTheme()" class="p-2.5 rounded-full bg-savGray dark:bg-gray-800 text-savBlack dark:text-white border border-savBorder dark:border-gray-700">
          <i data-lucide="moon" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  </header>

  <!-- Main Container -->
  <main class="max-w-[1200px] mx-auto px-4 lg:px-8 mt-6">

    <!-- Category Pill Navigation Bar (44px Pills) -->
    <div className="my-4 overflow-x-auto no-scrollbar">
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

    <!-- Hero Banner matching Wireframe -->
    <section class="rounded-[28px] overflow-hidden my-6 bg-savGray dark:bg-gray-800 border border-savBorder dark:border-gray-700 p-8 sm:p-14 text-center shadow-sm relative">
      <div class="max-w-2xl mx-auto space-y-4">
        <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-savBlue/10 text-savBlue text-xs font-black uppercase">
          <i data-lucide="sparkles" class="w-4 h-4"></i> Premium Shopping Experience
        </span>
        <h1 class="text-4xl sm:text-5xl font-black text-savBlack dark:text-white tracking-tight">
          Up to 70% OFF on Electronics
        </h1>
        <p class="text-xs sm:text-sm text-savMuted font-medium">
          Explore smartphones, mechanical keyboards, audio acoustics, and luxury handcrafted accessories.
        </p>
        <div class="pt-2">
          <button onclick="triggerConfetti()" class="px-8 py-3.5 rounded-full bg-savBlack hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 mx-auto">
            <span>Shop Now</span> <i data-lucide="arrow-right" class="w-4 h-4 text-savBlue"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- Product Cards Grid matching Wireframe -->
    <section class="space-y-6 my-10">
      <div class="flex justify-between items-center">
        <div>
          <span class="text-xs font-bold text-savBlue uppercase tracking-wider">SAVVORA Curated</span>
          <h2 class="text-3xl font-black text-savBlack dark:text-white tracking-tight">Featured Products</h2>
        </div>
        <span class="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">⚡ Live Stock Available</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <!-- Card 1 -->
        <div class="product-card flex flex-col justify-between">
          <div class="w-full h-56 rounded-[16px] overflow-hidden relative bg-white dark:bg-black border border-savBorder">
            <img src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80" class="w-full h-full object-cover" />
            <span class="absolute top-3 left-3 px-3 py-0.5 rounded-full bg-savBlue text-white text-[10px] font-black uppercase">NEW</span>
          </div>
          <div class="mt-4 space-y-2">
            <h3 class="font-extrabold text-savBlack dark:text-white text-sm">Wireless Earbuds & Headphones</h3>
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
            <span class="absolute top-3 left-3 px-3 py-0.5 rounded-full bg-savBlue text-white text-[10px] font-black uppercase">BESTSELLER</span>
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
            <img src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80" class="w-full h-full object-cover" />
            <span class="absolute top-3 left-3 px-3 py-0.5 rounded-full bg-savBlue text-white text-[10px] font-black uppercase">TRENDING</span>
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

  <!-- Footer -->
  <footer class="mt-20 border-t border-savBorder dark:border-gray-800 py-10 text-center text-xs text-savMuted">
    <p>© 2026 SAVVORA Inc. All rights reserved. Designed in Apple × Stripe × Nike UI Design System.</p>
  </footer>

  <script>
    lucide.createIcons();
    function toggleTheme() {
      document.documentElement.classList.toggle('dark');
    }
    function triggerConfetti() {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
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
