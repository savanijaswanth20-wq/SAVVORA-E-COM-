"use client";

import React, { useRef, useEffect } from 'react';

export const HeroBanner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays automatically on mobile and desktop
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay handled
      });
    }
  }, []);

  return (
    <section className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden my-2 sm:my-4 bg-[#0B0B10] text-white border border-gray-800/80 shadow-2xl aspect-video">
      
      {/* 100% Uncropped 16:9 Promotional Video Player */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        // @ts-expect-error - webkit inline attribute for iOS Safari compatibility
        webkit-playsinline="true"
        x5-playsinline="true"
        className="w-full h-full object-contain bg-[#0B0B10]"
        src="/savvora_promo.mp4"
      />

    </section>
  );
};
