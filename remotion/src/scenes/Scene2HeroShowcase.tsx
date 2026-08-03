import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { GoldParticles } from "../components/GoldParticles";
import { GlossyCard } from "../components/GlossyCard";
import { LightSweep } from "../components/LightSweep";

export const Scene2HeroShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance springs
  const heroCardScale = spring({
    frame,
    fps,
    config: { damping: 16, mass: 0.9, stiffness: 90 },
  });

  const headlineY = interpolate(
    spring({ frame: frame - 10, fps, config: { damping: 14 } }),
    [0, 1],
    [50, 0]
  );
  const headlineOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const descY = interpolate(
    spring({ frame: frame - 20, fps, config: { damping: 14 } }),
    [0, 1],
    [30, 0]
  );
  const descOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  const buttonScale = spring({
    frame: frame - 30,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  const rightCardX = interpolate(
    spring({ frame: frame - 15, fps, config: { damping: 15 } }),
    [0, 1],
    [100, 0]
  );
  const rightCardOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Gradient animation on "Handcrafted"
  const gradientShift = (frame * 3) % 360;

  // Floating card float motion
  const cardFloatY = Math.sin(frame * 0.08) * 12;

  // Subtle camera pan/zoom
  const cameraZoom = interpolate(frame, [0, 150], [1.02, 1.07]);

  return (
    <div
      className="relative w-full h-full bg-[#0B0B10] flex items-center justify-center p-16 overflow-hidden font-sans text-white"
      style={{
        transform: `scale(${cameraZoom})`,
      }}
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/3 w-[900px] h-[600px] bg-gradient-to-r from-blue-600/30 via-indigo-600/20 to-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <GoldParticles count={30} color="#F5B301" />

      {/* Main Hero Container Panel */}
      <div
        className="w-full max-w-7xl relative z-10 glass-panel rounded-3xl p-14 border border-white/15 shadow-2xl flex flex-col justify-between"
        style={{
          transform: `scale(${heroCardScale})`,
          background:
            "linear-gradient(135deg, rgba(17,19,30,0.85) 0%, rgba(10,11,18,0.92) 100%)",
        }}
      >
        <LightSweep startFrame={10} durationInFrames={60} />

        {/* Top Header Pill */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-extrabold tracking-wider uppercase text-amber-400 flex items-center space-x-2">
            <span className="text-amber-400">⚡</span>
            <span>SAVVORA STUDIO EXCLUSIVE</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
              &lt;
            </div>
            <div className="w-6 h-1.5 rounded-full bg-blue-500" />
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
              &gt;
            </div>
          </div>
        </div>

        {/* Hero Grid layout */}
        <div className="grid grid-cols-12 gap-10 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="col-span-7 space-y-6">
            <h1
              className="text-6xl font-black tracking-tight leading-tight"
              style={{
                transform: `translateY(${headlineY}px)`,
                opacity: headlineOpacity,
              }}
            >
              Custom{" "}
              <span
                className="inline-block font-extrabold"
                style={{
                  background: `linear-gradient(${gradientShift}deg, #F5B301 0%, #FF6B6B 50%, #4834DF 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 25px rgba(245,179,1,0.5))",
                }}
              >
                Handcrafted
              </span>{" "}
              Keychains
            </h1>

            <p
              className="text-xl text-slate-300 font-medium leading-relaxed max-w-xl"
              style={{
                transform: `translateY(${descY}px)`,
                opacity: descOpacity,
              }}
            >
              Personalized engraved acrylic keychains, kawaii charms, and custom
              initial name tags handcrafted with luxury precision.
            </p>

            {/* Price & Badges */}
            <div className="flex items-center space-x-4 pt-2">
              <span className="text-4xl font-extrabold text-white">₹499</span>
              <span className="text-2xl text-slate-500 line-through font-semibold">
                ₹999
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-sm">
                SAVE 50%
              </span>
            </div>

            {/* Action Buttons */}
            <div
              className="flex items-center space-x-5 pt-4"
              style={{
                transform: `scale(${buttonScale})`,
              }}
            >
              <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-extrabold text-lg shadow-lg blue-glow flex items-center space-x-3">
                <span>BUILD CUSTOM KEYCHAIN</span>
                <span className="text-xl">→</span>
              </button>
              <button className="px-8 py-4 rounded-xl bg-white text-slate-900 font-extrabold text-lg shadow-md hover:bg-slate-100">
                EXPLORE ALL
              </button>
            </div>
          </div>

          {/* Right Column: Floating Product Preview Card */}
          <div
            className="col-span-5 relative"
            style={{
              transform: `translateX(${rightCardX}px) translateY(${cardFloatY}px)`,
              opacity: rightCardOpacity,
            }}
          >
            <GlossyCard glowColor="blue" className="p-6">
              {/* Product Visual Container */}
              <div className="relative w-full h-72 rounded-xl overflow-hidden bg-gradient-to-tr from-amber-500 via-purple-600 to-blue-500 p-1 flex items-center justify-center shadow-inner">
                {/* Rating Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-400 font-bold text-sm flex items-center space-x-1">
                  <span>★</span>
                  <span>5.0</span>
                </div>

                {/* Keychain Graphic Mockup */}
                <div className="relative flex flex-col items-center justify-center text-center p-6 bg-black/40 backdrop-blur-sm rounded-lg w-full h-full border border-white/20">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center font-extrabold text-3xl text-black shadow-2xl mb-3 border-2 border-white">
                    SVJ
                  </div>
                  <span className="text-xs font-bold tracking-widest text-amber-300 uppercase">
                    Luxury Acrylic Charm
                  </span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between mt-6">
                <div>
                  <p className="text-xs font-extrabold tracking-wider text-slate-400 uppercase">
                    FEATURED ITEM
                  </p>
                  <p className="text-2xl font-black text-white">₹499</p>
                </div>
                <button className="px-6 py-2.5 rounded-lg bg-white text-slate-900 font-extrabold text-sm shadow">
                  Buy Now
                </button>
              </div>
            </GlossyCard>
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div className="flex items-center space-x-8 pt-8 mt-6 border-t border-white/10 text-sm font-semibold text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-400">✓</span>
            <span>100% Authentic</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-blue-400">⚡</span>
            <span>Express Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};
