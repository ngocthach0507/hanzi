"use client";

import React from 'react';

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm animate-pulse">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl mb-6"></div>
      <div className="h-6 bg-gray-100 rounded-lg w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-50 rounded-lg w-full mb-2"></div>
      <div className="h-4 bg-gray-50 rounded-lg w-5/6"></div>
    </div>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-6 animate-pulse">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-100 rounded w-1/4"></div>
            <div className="h-3 bg-gray-50 rounded w-1/2"></div>
          </div>
          <div className="w-20 h-8 bg-gray-50 rounded-xl"></div>
        </div>
      ))}
    </div>
  );
}

export function VocabGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
