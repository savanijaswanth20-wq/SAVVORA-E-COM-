"use client";

import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Smartphone, 
  Shirt, 
  Home, 
  Heart, 
  Dumbbell, 
  BookOpen, 
  ShoppingBag, 
  Tag, 
  Award 
} from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
}

const NAV_PILLS = [
  { id: 'new', label: 'New Arrivals', icon: Sparkles },
  { id: 'bestseller', label: 'Best Sellers', icon: Flame },
  { id: 'electronics', label: 'Electronics', icon: Smartphone },
  { id: 'fashion', label: 'Fashion', icon: Shirt },
  { id: 'home', label: 'Home & Kitchen', icon: Home },
  { id: 'beauty', label: 'Beauty', icon: Heart },
  { id: 'sports', label: 'Sports', icon: Dumbbell },
  { id: 'books', label: 'Books', icon: BookOpen },
  { id: 'grocery', label: 'Grocery', icon: ShoppingBag },
  { id: 'deals', label: 'Deals', icon: Tag },
  { id: 'brands', label: 'Brands', icon: Award },
];

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div id="categories" className="my-6 scroll-mt-24">
      <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
        {NAV_PILLS.map((pill) => {
          const Icon = pill.icon;
          const isActive = selectedCategory === pill.id;

          return (
            <button
              key={pill.id}
              onClick={() => onSelectCategory(pill.id)}
              className={`h-[44px] px-5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all duration-300 flex items-center gap-2 border ${
                isActive
                  ? 'bg-[#111827] text-white border-[#111827] shadow-md scale-105'
                  : 'bg-[#F8FAFC] dark:bg-gray-800 text-[#111827] dark:text-white border-[#E5E7EB] dark:border-gray-700 hover:bg-white hover:shadow-md'
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
