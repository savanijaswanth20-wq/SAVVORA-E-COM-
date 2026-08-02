"use client";

import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-gray-800 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between h-full overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-32 sm:h-44 lg:h-56 rounded-lg sm:rounded-xl bg-gray-200 dark:bg-gray-800 shrink-0" />

      {/* Text Details Skeleton */}
      <div className="mt-2.5 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="w-16 h-2.5 bg-gray-200 dark:bg-gray-800 rounded-full" />
          <div className="w-full h-3.5 bg-gray-200 dark:bg-gray-800 rounded-md" />
          <div className="w-3/4 h-3.5 bg-gray-200 dark:bg-gray-800 rounded-md" />
          <div className="w-12 h-3 bg-gray-200 dark:bg-gray-800 rounded-full mt-1" />
        </div>

        {/* Price & CTA Button Skeleton */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-16 h-4 bg-gray-200 dark:bg-gray-800 rounded-md" />
            <div className="w-10 h-3 bg-gray-200 dark:bg-gray-800 rounded-md" />
          </div>
          <div className="w-full h-9 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonHero: React.FC = () => {
  return (
    <div className="w-full h-[220px] rounded-2xl sm:rounded-3xl bg-gray-200 dark:bg-gray-800 animate-pulse my-2 sm:my-3" />
  );
};
