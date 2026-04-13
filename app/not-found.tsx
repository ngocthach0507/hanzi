"use client";

import React from 'react';
import Link from 'next/link';
import { Search, Home, ArrowLeft, Ghost } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      {/* Animated Icon */}
      <div className="relative mb-12">
        <div className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center animate-bounce">
          <Ghost size={64} className="text-[#D85A30]" />
        </div>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-gray-100 rounded-[100%] blur-sm animate-pulse"></div>
      </div>

      <h1 className="text-8xl font-black text-gray-900 mb-4 tracking-tighter">404</h1>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Ồ! Trang này không tồn tại</h2>
      
      <p className="text-gray-500 max-w-md mx-auto mb-12 font-medium leading-relaxed">
        Có vẻ như bạn đã đi lạc vào một vùng kiến thức chưa được khám phá. 
        Đừng lo lắng, hãy quay lại trang chủ để tiếp tục hành trình học Tiếng Trung nhé!
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link 
          href="/"
          className="flex-1 bg-[#D85A30] text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-xl shadow-orange-200"
        >
          <Home size={20} /> Về trang chủ
        </Link>
        
        <button 
          onClick={() => window.history.back()}
          className="flex-1 bg-white text-gray-800 border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={20} /> Quay lại
        </button>
      </div>

      <div className="mt-20 relative max-w-sm w-full">
         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
         <input 
           type="text" 
           placeholder="Tìm nội dung khác..."
           className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-orange-100 outline-none"
         />
      </div>
    </div>
  );
}
