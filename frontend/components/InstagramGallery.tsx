"use client";

import React from 'react';
import { Instagram, Heart, Sparkles } from 'lucide-react';

const INSTA_POSTS = [
  { id: 1, image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80', likes: '1.2k', handle: '@kawaii.crafts' },
  { id: 2, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80', likes: '2.4k', handle: '@kawaii.crafts' },
  { id: 3, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80', likes: '980', handle: '@kawaii.crafts' },
  { id: 4, image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=600&auto=format&fit=crop&q=80', likes: '3.1k', handle: '@kawaii.crafts' },
];

export const InstagramGallery: React.FC = () => {
  return (
    <section className="my-16 text-center">
      <div className="max-w-xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full badge-kawaii text-xs font-bold uppercase tracking-wider mb-2">
          <Instagram className="w-3.5 h-3.5 text-rose-600" /> #KawaiiCraftStudio
        </span>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Follow Our Instagram Feed
        </h2>
        <p className="text-xs text-gray-600 mt-1 font-medium">
          Tag @kawaii.crafts on Instagram to get featured on our website gallery!
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {INSTA_POSTS.map((post) => (
          <div key={post.id} className="relative group rounded-3xl overflow-hidden glass-apple p-2 border border-pink-200 shadow-md">
            <div className="w-full h-56 rounded-2xl overflow-hidden relative">
              <img src={post.image} alt="Insta Post" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-pink-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-extrabold text-xs">
                <Heart className="w-5 h-5 fill-white text-white animate-bounce" />
                <span>{post.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
