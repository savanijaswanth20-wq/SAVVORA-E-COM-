"use client";

import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="card-apple-hover p-4 animate-pulse space-y-4">
      <div className="w-full h-60 rounded-[16px] bg-apple-border/40 dark:bg-white/10" />
      <div className="space-y-2">
        <div className="w-1/3 h-3 bg-apple-border/40 dark:bg-white/10 rounded" />
        <div className="w-3/4 h-5 bg-apple-border/40 dark:bg-white/10 rounded" />
        <div className="w-full h-4 bg-apple-border/40 dark:bg-white/10 rounded" />
      </div>
      <div className="pt-3 border-t border-apple-border dark:border-apple-border-dark flex justify-between items-center">
        <div className="w-20 h-6 bg-apple-border/40 dark:bg-white/10 rounded" />
        <div className="w-16 h-8 bg-apple-border/40 dark:bg-white/10 rounded-full" />
      </div>
    </div>
  );
};
