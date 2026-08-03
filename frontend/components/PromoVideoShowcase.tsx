"use client";

import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, Maximize, Film } from 'lucide-react';

export const PromoVideoShowcase: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <section className="relative rounded-2xl sm:rounded-3xl overflow-hidden my-4 sm:my-6 bg-[#0B0B10] text-white border border-gray-800 shadow-2xl p-4 sm:p-6 lg:p-8">
      
      {/* Background Ambient Glows */}
      <div className="absolute -top-24 left-1/3 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/3 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>CINEMATIC STORE PROMO</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>SAVVORA Luxury Store Showcase</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 font-extrabold text-xs">
            20s 4K 60FPS Promo
          </span>
        </div>
      </div>

      {/* Video Container - 16:9 Aspect Ratio */}
      <div className="relative z-10 w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-black/80 border border-white/15 shadow-2xl group">
        
        {/* HTML5 Video Element */}
        <video
          ref={videoRef}
          src="/savvora_promo.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Video Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 sm:p-6 pointer-events-none">
          <div className="flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/20">
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span>SAVVORA Cinematic Video</span>
            </div>
            <button
              onClick={toggleFullScreen}
              className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all active:scale-95"
              title="Full Screen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Bar Controls */}
          <div className="flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg transition-all active:scale-95 border border-blue-400/30"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <button
                onClick={toggleMute}
                className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all active:scale-95"
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-gray-400" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
              </button>
            </div>

            <div className="text-xs font-bold text-gray-300 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
              {isMuted ? '🔇 Muted (Click sound icon for audio)' : '🔊 Audio Active'}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};
