"use client";

import React, { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative rounded-2xl sm:rounded-3xl overflow-hidden my-2 sm:my-4 bg-black text-white border border-gray-800 shadow-2xl aspect-[16/7] sm:aspect-[21/9] min-h-[220px] sm:min-h-[300px]">
      
      {/* Full Hero Video Player */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="w-full h-full object-cover"
        src="/savvora_promo.mp4"
      />

      {/* Sound Toggle Control Badge */}
      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 z-20 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 text-xs font-extrabold flex items-center gap-2 transition-all active:scale-95 shadow-xl"
        title={isMuted ? "Unmute Video Sound" : "Mute Video Sound"}
      >
        {isMuted ? (
          <>
            <VolumeX className="w-4 h-4 text-gray-400" />
            <span>Unmute</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>Mute</span>
          </>
        )}
      </button>

    </section>
  );
};
