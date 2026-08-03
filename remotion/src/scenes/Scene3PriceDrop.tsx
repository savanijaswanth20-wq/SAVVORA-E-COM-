import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { GoldParticles } from "../components/GoldParticles";

export const Scene3PriceDrop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Price strike-through spring
  const priceOldSpring = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.8, stiffness: 100 },
  });

  const strikeWidth = interpolate(frame, [15, 35], [0, 100], {
    extrapolateRight: "clamp",
  });

  // Arrow drop
  const arrowSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 10, stiffness: 150 },
  });
  const arrowY = interpolate(arrowSpring, [0, 1], [-40, 0]);

  // New price pop spring
  const priceNewSpring = spring({
    frame: frame - 35,
    fps,
    config: { damping: 12, mass: 0.7, stiffness: 140 },
  });

  // Badge explosion spring
  const badgeExplodeSpring = spring({
    frame: frame - 50,
    fps,
    config: { damping: 8, mass: 0.6, stiffness: 160 },
  });

  // Dynamic Camera Zoom
  const cameraZoom = interpolate(frame, [0, 90], [0.95, 1.15]);

  return (
    <div
      className="relative w-full h-full bg-[#0B0B10] flex flex-col items-center justify-center p-12 overflow-hidden font-sans text-white"
      style={{
        transform: `scale(${cameraZoom})`,
      }}
    >
      {/* Background Radial Glow */}
      <div className="absolute w-[1000px] h-[1000px] rounded-full bg-radial-gradient from-blue-600/30 via-amber-500/20 to-transparent blur-[140px] pointer-events-none" />
      <GoldParticles count={40} color="#F5B301" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6">
        {/* Header Label */}
        <div className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600/30 to-amber-500/30 border border-amber-400/40 text-amber-300 font-extrabold text-lg tracking-widest uppercase shadow-lg backdrop-blur-md">
          UNBEATABLE SAVVORA PRICE
        </div>

        {/* Price Strike-Through Block */}
        <div
          className="relative flex items-center justify-center"
          style={{
            transform: `scale(${priceOldSpring})`,
            opacity: interpolate(frame, [0, 15], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          <span className="text-7xl font-extrabold text-slate-500 tracking-wider">
            ₹999
          </span>
          {/* Animated Strike Line */}
          <div
            className="absolute h-3 bg-red-600 rounded-full shadow-lg"
            style={{
              width: `${strikeWidth}%`,
              boxShadow: "0 0 20px rgba(220, 38, 38, 0.8)",
            }}
          />
        </div>

        {/* Animated Drop Arrow */}
        <div
          className="text-6xl text-amber-400 font-black my-2"
          style={{
            transform: `translateY(${arrowY}px)`,
            opacity: interpolate(frame, [25, 40], [0, 1], {
              extrapolateRight: "clamp",
            }),
            filter: "drop-shadow(0 0 20px rgba(245, 179, 1, 0.8))",
          }}
        >
          ↓
        </div>

        {/* New Price Pop */}
        <div
          className="relative"
          style={{
            transform: `scale(${priceNewSpring})`,
            opacity: interpolate(frame, [35, 50], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          <h2
            className="text-9xl font-black tracking-tight"
            style={{
              background:
                "linear-gradient(180deg, #FFFFFF 0%, #F5B301 60%, #EAB308 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 15px 40px rgba(245, 179, 1, 0.5))",
            }}
          >
            ₹499
          </h2>
        </div>

        {/* SAVE 50% Exploding Badge */}
        <div
          className="mt-6"
          style={{
            transform: `scale(${badgeExplodeSpring})`,
            opacity: interpolate(frame, [50, 65], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div className="relative px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black text-4xl shadow-2xl gold-glow border-2 border-white uppercase tracking-wider flex items-center space-x-3">
            <span>🔥</span>
            <span>SAVE 50% OFF</span>
            <span>🔥</span>
          </div>
        </div>
      </div>
    </div>
  );
};
