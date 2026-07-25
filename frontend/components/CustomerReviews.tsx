"use client";

import React, { useState } from 'react';
import { Star, CheckCircle, Heart, ThumbsUp, Sparkles } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'Ananya Roy',
    city: 'Mumbai',
    rating: 5,
    date: '2 days ago',
    comment: 'Ordered the Polaroid Memory Keychain for my boyfriend with our anniversary date. The glassmorphism acrylic finish looks identical to Apple store quality! Arrived in 48 hours in cute gift wrap.',
    productName: 'Polaroid Memory Photo Keychain',
    photo: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300&auto=format&fit=crop&q=80',
    likes: 42
  },
  {
    id: 2,
    name: 'Kavya Sharma',
    city: 'Bengaluru',
    rating: 5,
    date: '1 week ago',
    comment: 'The magnetic couple keychains snap together so satisfyingly! We put them on our college bags and everyone asked where we got them. 10/10 kawaii packaging!',
    productName: 'Matching Magnet Couple Keychains',
    photo: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&auto=format&fit=crop&q=80',
    likes: 38
  },
  {
    id: 3,
    name: 'Rohan Verma',
    city: 'Delhi',
    rating: 5,
    date: '2 weeks ago',
    comment: 'The custom keychain builder on this website is super smooth. I live-previewed the font, added sparkles and bear charms. Price updated instantly. Ultra fast shipping!',
    productName: 'Custom Engraved Name Keychain',
    photo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    likes: 56
  }
];

export const CustomerReviews: React.FC = () => {
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const filteredReviews = filterRating 
    ? REVIEWS.filter((r) => r.rating === filterRating)
    : REVIEWS;

  return (
    <section className="my-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full badge-kawaii text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" /> Real Verified Reviews
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Loved By 10,000+ Kawaii Lovers
          </h2>
        </div>

        {/* Rating Filter Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterRating(null)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              filterRating === null
                ? 'bg-pink-500 text-white border-pink-500'
                : 'glass-apple text-gray-700 border-gray-200'
            }`}
          >
            All Reviews
          </button>
          <button
            onClick={() => setFilterRating(5)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1 border ${
              filterRating === 5
                ? 'bg-pink-500 text-white border-pink-500'
                : 'glass-apple text-gray-700 border-gray-200'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 5 Stars
          </button>
        </div>
      </div>

      {/* Reviews Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredReviews.map((rev) => (
          <div key={rev.id} className="glass-kawaii-card rounded-3xl p-6 flex flex-col justify-between border border-pink-200">
            <div>
              {/* Star Rating & Verified Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Verified Buyer
                </span>
              </div>

              {/* Comment Text */}
              <p className="text-xs text-gray-700 italic leading-relaxed mb-4">
                "{rev.comment}"
              </p>
            </div>

            {/* Customer & Product Footer */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={rev.photo} alt={rev.name} className="w-10 h-10 rounded-2xl object-cover border border-pink-200" />
                <div>
                  <h4 className="font-extrabold text-gray-900 text-xs">{rev.name}</h4>
                  <span className="text-[10px] text-gray-400 font-medium">{rev.city} • {rev.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full">
                <ThumbsUp className="w-3 h-3" /> {rev.likes}
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
