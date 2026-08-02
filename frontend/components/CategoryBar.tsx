"use client";

import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Smartphone, 
  Shirt, 
  Home, 
  Heart, 
  Headphones, 
  Laptop, 
  Gamepad2, 
  KeyRound, 
  Watch, 
  Grid 
} from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
}

const NAV_PILLS = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'electronics', label: 'Electronics', icon: Smartphone },
  { id: 'mobiles', label: 'Mobiles', icon: Smartphone },
  { id: 'fashion', label: 'Fashion', icon: Shirt },
  { id: 'keychains', label: 'Keychains', icon: KeyRound },
  { id: 'accessories', label: 'Accessories', icon: Watch },
  { id: 'audio', label: 'Audio', icon: Headphones },
  { id: 'laptop', label: 'Laptop', icon: Laptop },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'home', label: 'Home', icon: Home },
  { id: 'more', label: 'More', icon: Grid },
];

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div id="categories" className="my-2.5 scroll-mt-20">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none whitespace-nowrap -mx-3 px-3 sm:mx-0">
        {NAV_PILLS.map((pill) => {
          const Icon = pill.icon;
          const isActive = selectedCategory === pill.id;

          return (
            <button
              key={pill.id}
              onClick={() => onSelectCategory(pill.id)}
              className={`h-[38px] min-h-[38px] px-3.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 border shrink-0 ${
                isActive
                  ? 'bg-[#111827] text-white border-[#111827] shadow-sm scale-105'
                  : 'bg-[#F8FAFC] dark:bg-gray-800 text-[#111827] dark:text-white border-[#E5E7EB] dark:border-gray-700 hover:bg-white hover:shadow-xs'
              }`}
            >
              <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-[#2563EB]'}`} />
              <span>{pill.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
