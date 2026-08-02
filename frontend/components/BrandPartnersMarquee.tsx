"use client";

import React from 'react';

const BRANDS = ['Apple', 'Sony', 'Bang & Olufsen', 'Leica', 'Nomad', 'Bellroy', 'Sennheiser'];

export const BrandPartnersMarquee: React.FC = () => {
  return (
    <section className="my-4 py-3 border-y border-apple-border dark:border-apple-border-dark">
      <p className="text-center text-[10px] font-bold text-apple-gray uppercase tracking-widest mb-2">
        Certified Brand Partners
      </p>
      <div className="flex items-center gap-6 overflow-x-auto scrollbar-none whitespace-nowrap px-3 opacity-80 justify-start sm:justify-around">
        {BRANDS.map((brand, idx) => (
          <span key={idx} className="text-xs font-extrabold tracking-wider text-apple-dark dark:text-white uppercase font-sans shrink-0 hover:text-[#2563EB] transition-colors">
            {brand}
          </span>
        ))}
      </div>
    </section>
  );
};
