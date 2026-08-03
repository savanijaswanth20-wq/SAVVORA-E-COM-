import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { GoldParticles } from "../components/GoldParticles";
import { LightSweep } from "../components/LightSweep";

const TRUST_BADGES = [
  { label: "100% Authentic", icon: "🛡️" },
  { label: "Express Delivery", icon: "⚡" },
  { label: "Secure Payment", icon: "🔒" },
  { label: "Easy Returns", icon: "🔄" },
];

export const Scene5OutroCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Trust badges sequence (0 to 45 frames)
  const trustOpacity = interpolate(frame, [0, 15, 45, 55], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  // URL Reveal sequence (starts at frame 45)
  const urlSpring = spring({
    frame: frame - 45,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const urlY = interpolate(urlSpring, [0, 1], [60, 0]);
  const urlOpacity = interpolate(frame, [45, 65], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Logo reform (starts at frame 50)
  const logoSpring = spring({
    frame: frame - 50,
    fps,
    config: { damping: 12, stiffness: 110 },
  });

  // Final Fade Out (starts at frame 105 to 120)
  const fadeOutOpacity = interpolate(frame, [105, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Camera Slow Zoom
  const cameraZoom = interpolate(frame, [0, 120], [0.98, 1.06]);

  return (
    <div
      className="relative w-full h-full bg-[#0B0B10] flex flex-col items-center justify-center p-12 overflow-hidden font-sans text-white"
      style={{
        opacity: fadeOutOpacity,
        transform: `scale(${cameraZoom})`,
      }}
    >
      {/* Intense Blue Ambient Glow */}
      <div className="absolute w-[1100px] h-[1100px] rounded-full bg-radial-gradient from-blue-600/35 via-indigo-600/20 to-transparent blur-[160px] pointer-events-none" />
      <GoldParticles count={40} color="#F5B301" />

      {/* Part A: 4 Trust Badges Horizontal Banner */}
      <div
        className="absolute z-10 flex items-center justify-center space-x-8"
        style={{
          opacity: trustOpacity,
        }}
      >
        {TRUST_BADGES.map((badge, idx) => {
          const badgeSpring = spring({
            frame: frame - idx * 6,
            fps,
            config: { damping: 12, stiffness: 100 },
          });

          return (
            <div
              key={badge.label}
              className="px-8 py-5 rounded-2xl glass-panel border border-white/20 flex items-center space-x-4 shadow-2xl blue-glow"
              style={{
                transform: `scale(${badgeSpring})`,
              }}
            >
              <span className="text-3xl">{badge.icon}</span>
              <span className="text-xl font-extrabold tracking-wide uppercase text-white">
                {badge.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Part B: URL & Reformed SVJ Logo CTA */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center space-y-8">
        {/* Reformed SVJ Logo */}
        <div
          className="relative w-36 h-36 rounded-3xl bg-gradient-to-br from-[#1E202E] via-[#12131C] to-[#0A0B10] border-2 border-amber-400 flex items-center justify-center shadow-2xl overflow-hidden gold-glow"
          style={{
            transform: `scale(${logoSpring})`,
            opacity: urlOpacity,
          }}
        >
          <svg
            width="90"
            height="90"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 30 C 20 15, 80 15, 80 30 C 80 45, 20 55, 20 70 C 20 85, 80 85, 80 70"
              stroke="url(#goldGradient2)"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M50 20 L 50 80"
              stroke="url(#blueGradient2)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="goldGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF1B8" />
                <stop offset="100%" stopColor="#F5B301" />
              </linearGradient>
              <linearGradient id="blueGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
            </defs>
          </svg>
          <LightSweep startFrame={60} durationInFrames={40} />
        </div>

        {/* Brand Tagline */}
        <div
          style={{
            transform: `translateY(${urlY}px)`,
            opacity: urlOpacity,
          }}
          className="space-y-3"
        >
          <h2 className="text-2xl font-bold tracking-[0.3em] uppercase text-amber-400">
            ELEVATE YOUR LUXURY LIFESTYLE
          </h2>

          {/* Website URL Box */}
          <div className="px-12 py-5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 border-2 border-white/30 shadow-2xl blue-glow flex items-center space-x-3">
            <span className="text-4xl font-extrabold tracking-wider text-white">
              savvora-e-com.onrender.com
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
