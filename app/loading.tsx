"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-24 h-24 border-4 border-gray-100 rounded-full"></div>
        
        {/* Spinning Ring */}
        <div className="absolute inset-0 border-4 border-t-[#D85A30] border-transparent rounded-full animate-spin"></div>
        
        {/* Icon in Center */}
        <div className="absolute inset-0 flex items-center justify-center text-[#D85A30]">
           <Loader2 size={32} className="animate-pulse" />
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] animate-pulse">
          Đang tải dữ liệu...
        </p>
      </div>
    </div>
  );
}
