import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { GoldParticles } from "../components/GoldParticles";
import { GlossyCard } from "../components/GlossyCard";

interface ProductItem {
  id: number;
  title: string;
  category: string;
  price: string;
  badge: string;
  badgeColor: string;
  gradient: string;
  icon: string;
  xOffset: number;
  yOffset: number;
  zOffset: number;
  rotDeg: number;
}

const PRODUCTS: ProductItem[] = [
  {
    id: 1,
    title: "Pro Flagship Ultra",
    category: "Smartphones",
    price: "₹69,999",
    badge: "NEW",
    badgeColor: "bg-blue-600",
    gradient: "from-blue-600 to-indigo-900",
    icon: "📱",
    xOffset: -380,
    yOffset: -160,
    zOffset: 0,
    rotDeg: -6,
  },
  {
    id: 2,
    title: "M3 Max Studio Book",
    category: "Laptops",
    price: "₹149,999",
    badge: "BESTSELLER",
    badgeColor: "bg-amber-500 text-black",
    gradient: "from-amber-600 to-purple-900",
    icon: "💻",
    xOffset: 0,
    yOffset: -180,
    zOffset: 20,
    rotDeg: 2,
  },
  {
    id: 3,
    title: "Pro Noise-Canceling Earbuds",
    category: "Earbuds",
    price: "₹4,999",
    badge: "TRENDING",
    badgeColor: "bg-emerald-500",
    gradient: "from-emerald-600 to-teal-900",
    icon: "🎧",
    xOffset: 380,
    yOffset: -160,
    zOffset: -10,
    rotDeg: 5,
  },
  {
    id: 4,
    title: "Hi-Fi Studio Headphones",
    category: "Headphones",
    price: "₹12,999",
    badge: "30% OFF",
    badgeColor: "bg-rose-600",
    gradient: "from-rose-600 to-pink-900",
    icon: "🎵",
    xOffset: -380,
    yOffset: 160,
    zOffset: 10,
    rotDeg: 4,
  },
  {
    id: 5,
    title: "Custom Acrylic Keychain",
    category: "Keychains",
    price: "₹499",
    badge: "SAVVORA ORIGINAL",
    badgeColor: "bg-amber-400 text-slate-950 font-black",
    gradient: "from-yellow-500 via-orange-500 to-purple-600",
    icon: "✨",
    xOffset: 0,
    yOffset: 180,
    zOffset: 30,
    rotDeg: -3,
  },
  {
    id: 6,
    title: "MagSafe Tech Pouch",
    category: "Accessories",
    price: "₹1,999",
    badge: "HOT ITEM",
    badgeColor: "bg-cyan-600",
    gradient: "from-cyan-600 to-blue-900",
    icon: "⚡",
    xOffset: 380,
    yOffset: 160,
    zOffset: -5,
    rotDeg: -5,
  },
];

export const Scene4ProductWall: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Parallax camera rotation and movement
  const cameraX = Math.sin(frame * 0.03) * 60;
  const cameraY = Math.cos(frame * 0.03) * 30;
  const cameraZoom = interpolate(frame, [0, 150], [0.92, 1.05]);

  return (
    <div
      className="relative w-full h-full bg-[#0B0B10] flex items-center justify-center overflow-hidden font-sans text-white"
      style={{
        perspective: "1200px",
      }}
    >
      {/* Dynamic Glow background */}
      <div className="absolute w-[1200px] h-[800px] bg-gradient-to-r from-blue-600/25 via-purple-600/20 to-amber-500/20 rounded-full blur-[160px] pointer-events-none" />
      <GoldParticles count={35} color="#F5B301" />

      {/* Floating Wall Title */}
      <div className="absolute top-10 z-20 text-center space-y-1">
        <span className="text-sm font-extrabold tracking-[0.3em] uppercase text-amber-400">
          CURATED CATALOGUE
        </span>
        <h2 className="text-4xl font-black tracking-wider uppercase text-white">
          EXPLORE PREMIUM COLLECTIONS
        </h2>
      </div>

      {/* 3D Wall Parallax Container */}
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{
          transform: `scale(${cameraZoom}) translateX(${cameraX}px) translateY(${cameraY}px)`,
          transformStyle: "preserve-3d",
        }}
      >
        {PRODUCTS.map((prod, index) => {
          const delay = index * 8;
          const cardSpring = spring({
            frame: frame - delay,
            fps,
            config: { damping: 14, stiffness: 90 },
          });

          const scale = interpolate(cardSpring, [0, 1], [0.6, 1]);
          const opacity = interpolate(frame, [delay, delay + 20], [0, 1], {
            extrapolateRight: "clamp",
          });

          // Parallax floating shift per card
          const floatY = Math.sin(frame * 0.05 + index) * 15;
          const rotY = Math.sin(frame * 0.04 + index) * 8;

          return (
            <div
              key={prod.id}
              className="absolute w-80 h-72"
              style={{
                left: `calc(50% - 160px + ${prod.xOffset}px)`,
                top: `calc(50% - 144px + ${prod.yOffset + floatY}px)`,
                transform: `scale(${scale}) rotate(${prod.rotDeg + rotY}deg) translateZ(${prod.zOffset}px)`,
                opacity,
                transformStyle: "preserve-3d",
              }}
            >
              <GlossyCard glowColor="blue" className="w-full h-full p-5 flex flex-col justify-between">
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase shadow ${prod.badgeColor}`}
                  >
                    {prod.badge}
                  </span>
                  <span className="text-2xl">{prod.icon}</span>
                </div>

                {/* Product Graphic Visual */}
                <div
                  className={`w-full h-32 rounded-xl bg-gradient-to-tr ${prod.gradient} border border-white/20 flex items-center justify-center shadow-inner my-2`}
                >
                  <span className="text-4xl filter drop-shadow-lg">{prod.icon}</span>
                </div>

                {/* Info */}
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {prod.category}
                    </p>
                    <p className="text-base font-extrabold text-white truncate max-w-[170px]">
                      {prod.title}
                    </p>
                  </div>
                  <span className="text-lg font-black text-amber-400">
                    {prod.price}
                  </span>
                </div>
              </GlossyCard>
            </div>
          );
        })}
      </div>
    </div>
  );
};
