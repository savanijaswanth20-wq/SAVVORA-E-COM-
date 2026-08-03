"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays automatically on mobile devices
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay handled
      });
    }
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden my-2 sm:my-4 bg-[#0B0B10] text-white border border-gray-800/80 shadow-2xl aspect-video">
      
      {/* 100% Uncropped 16:9 Promotional Video Player */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        // @ts-expect-error - webkit inline attribute for iOS Safari compatibility
        webkit-playsinline="true"
        x5-playsinline="true"
        className="w-full h-full object-contain bg-[#0B0B10]"
        src="/savvora_promo.mp4"
      />

      {/* Sound Toggle Control Badge */}
      <button
        onClick={toggleMute}
        className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 shadow-xl"
        title={isMuted ? "Unmute Video Sound" : "Mute Video Sound"}
      >
        {isMuted ? (
          <>
            <VolumeX className="w-3.5 h-3.5 text-gray-400" />
            <span>Unmute</span>
          </>
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Mute</span>
          </>
        )}
      </button>

    </section>
  );
};
