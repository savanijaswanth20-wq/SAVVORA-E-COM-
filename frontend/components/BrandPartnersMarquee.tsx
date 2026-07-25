"use client";

import React from 'react';

const BRANDS = ['Apple', 'Sony', 'Bang & Olufsen', 'Leica', 'Nomad', 'Bellroy', 'Sennheiser'];

export const BrandPartnersMarquee: React.FC = () => {
  return (
    <section className="my-16 py-8 border-y border-apple-border dark:border-apple-border-dark">
      <p className="text-center text-xs font-bold text-apple-gray uppercase tracking-widest mb-6">
        Trusted Brand Partners & Certified Accessories
      </p>
      <div className="flex items-center justify-around flex-wrap gap-8 opacity-70">
        {BRANDS.map((brand, idx) => (
          <span key={idx} className="text-sm font-extrabold tracking-tight text-apple-dark dark:text-white uppercase font-sans hover:opacity-100 transition-opacity">
            {brand}
          </span>
        ))}
      </div>
    </section>
  );
};
