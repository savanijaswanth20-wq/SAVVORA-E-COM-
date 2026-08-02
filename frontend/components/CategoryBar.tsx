"use client";

import React from 'react';
import { 
  Sparkles, 
  Smartphone, 
  Shirt, 
  Home, 
  Headphones, 
  Laptop, 
  Gamepad2, 
  KeyRound, 
  Watch, 
  Grid,
  Zap
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
  { id: 'accessories', label: 'Accessories', icon: Watch },
  { id: 'audio', label: 'Audio', icon: Headphones },
  { id: 'laptop', label: 'Laptop', icon: Laptop },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'home', label: 'Home', icon: Home },
  { id: 'custom-keychains', label: 'Keychains', icon: KeyRound },
  { id: 'more', label: 'More', icon: Grid },
];

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div id="categories" className="my-1.5 scroll-mt-[60px]">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none whitespace-nowrap -mx-3 px-3 sm:mx-0">
        {NAV_PILLS.map((pill) => {
          const Icon = pill.icon;
          const isActive = selectedCategory === pill.id;

          return (
            <button
              key={pill.id}
              onClick={() => onSelectCategory(pill.id)}
              className={`h-[36px] min-h-[36px] px-3 rounded-full text-[11px] font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1 border shrink-0 active:scale-95 ${
                isActive
                  ? 'bg-[#111827] text-white border-[#111827] shadow-sm scale-[1.02]'
                  : 'bg-[#F8FAFC] dark:bg-gray-800 text-[#111827] dark:text-white border-[#E5E7EB] dark:border-gray-700 hover:bg-white hover:shadow-xs'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-[#2563EB]'}`} />
              <span>{pill.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
