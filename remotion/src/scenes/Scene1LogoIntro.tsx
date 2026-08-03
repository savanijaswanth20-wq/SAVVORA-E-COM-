import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { GoldParticles } from "../components/GoldParticles";
import { LightSweep } from "../components/LightSweep";

export const Scene1LogoIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring animation for logo scale and entry
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 100 },
  });

  const logoOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Text animation delays
  const textTitleSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 15, stiffness: 90 },
  });

  const textSubSpring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 15, stiffness: 90 },
  });

  const textTitleY = interpolate(textTitleSpring, [0, 1], [40, 0]);
  const textTitleOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateRight: "clamp",
  });

  const textSubY = interpolate(textSubSpring, [0, 1], [30, 0]);
  const textSubOpacity = interpolate(frame, [30, 48], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Slow camera zoom
  const cameraScale = interpolate(frame, [0, 90], [0.95, 1.08]);

  // Glow pulse
  const glowIntensity = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [30, 70]
  );

  return (
    <div
      className="relative w-full h-full bg-[#0B0B10] flex flex-col items-center justify-center overflow-hidden font-sans text-white"
      style={{
        transform: `scale(${cameraScale})`,
      }}
    >
      {/* Dynamic Radial Ambient Glow */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(37,99,235,0.25) 0%, rgba(245,179,1,0.15) 40%, rgba(11,11,16,0) 70%)",
          filter: `blur(${glowIntensity}px)`,
        }}
      />

      {/* Gold Floating Particles */}
      <GoldParticles count={45} color="#F5B301" />

      {/* SVJ Logo Container */}
      <div
        className="relative mb-6 z-10 flex items-center justify-center"
        style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
        }}
      >
        <div className="relative w-44 h-44 rounded-3xl bg-gradient-to-br from-[#1E202E] via-[#12131C] to-[#0A0B10] border border-[#F5B301]/40 flex items-center justify-center shadow-2xl overflow-hidden gold-glow">
          {/* SVJ Monogram Icon */}
          <svg
            width="120"
            height="120"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 30 C 20 15, 80 15, 80 30 C 80 45, 20 55, 20 70 C 20 85, 80 85, 80 70"
              stroke="url(#goldGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M50 20 L 50 80"
              stroke="url(#blueGradient)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient
                id="goldGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#FFF1B8" />
                <stop offset="50%" stopColor="#F5B301" />
                <stop offset="100%" stopColor="#D48800" />
              </linearGradient>
              <linearGradient
                id="blueGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#93C5FD" />
                <stop offset="50%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#1E40AF" />
              </linearGradient>
            </defs>
          </svg>

          {/* Light Sweep */}
          <LightSweep startFrame={20} durationInFrames={40} />
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="z-10 text-center space-y-2">
        <h1
          className="text-7xl font-extrabold tracking-widest uppercase font-sans"
          style={{
            transform: `translateY(${textTitleY}px)`,
            opacity: textTitleOpacity,
            background:
              "linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 60%, #94A3B8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.25em",
            textShadow: "0 10px 30px rgba(0,0,0,0.8)",
          }}
        >
          SAVVORA
        </h1>
        <p
          className="text-2xl font-bold tracking-[0.4em] uppercase text-[#F5B301]"
          style={{
            transform: `translateY(${textSubY}px)`,
            opacity: textSubOpacity,
            textShadow: "0 0 20px rgba(245,179,1,0.6)",
          }}
        >
          SVJ LUXURY STORE
        </p>
      </div>

      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-radial-vignette opacity-60" />
    </div>
  );
};
