"use client";

import React from 'react';
import Link from 'next/link';
import { BookOpen, Crown, ChevronDown } from 'lucide-react';

export default function AppNavbar() {
  return (
    <nav className="w-full h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
      <Link href="/" className="text-2xl font-black text-brand tracking-tighter hover:opacity-80 transition-opacity">
        hanzi.io.vn
      </Link>
      
      <div className="hidden md:flex items-center gap-8">
        <div className="relative group">
          <Link href="/giao-trinh" className="flex items-center gap-1.5 text-sm font-extrabold text-gray-700 hover:text-red-500 transition-colors">
            <BookOpen className="w-4 h-4" />
            📖 HSK 3.0
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">NEW</span>
            <ChevronDown className="w-3 h-3 opacity-30" />
          </Link>
          
          {/* Simple Dropdown on Hover */}
          <div className="absolute top-full left-0 pt-4 hidden group-hover:block transition-all">
            <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl p-4 w-64 grid gap-2">
              <Link href="/giao-trinh/hsk1" className="flex items-center justify-between p-3 hover:bg-red-50 rounded-xl transition-colors group/item">
                <span className="text-sm font-bold text-gray-700 group-hover/item:text-red-500">📗 HSK 1 — Cơ bản</span>
                <ChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
              </Link>
              <Link href="/giao-trinh/hsk2" className="flex items-center justify-between p-3 hover:bg-orange-50 rounded-xl transition-colors group/item">
                <span className="text-sm font-bold text-gray-700 group-hover/item:text-orange-500">📘 HSK 2 — Trung cấp</span>
                <ChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
              </Link>
              <Link href="/giao-trinh/hsk3" className="flex items-center justify-between p-3 hover:bg-yellow-50 rounded-xl transition-colors group/item">
                <span className="text-sm font-bold text-gray-700 group-hover/item:text-yellow-600">📙 HSK 3 — Nâng cao</span>
                <ChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>
        
        <Link href="/tu-vung-chu-de" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">Từ vựng</Link>
        <Link href="/hoi-thoai" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">Hội thoại</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/nang-cap" className="flex flex-col items-end group">
          <div className="bg-[#FFD700] hover:bg-[#FFC700] text-gray-900 px-5 py-2 rounded-full text-sm font-black flex items-center gap-2 shadow-lg shadow-yellow-100 transition-all active:scale-95">
            <Crown className="w-4 h-4" />
            Nâng cấp
          </div>
          <span className="text-[10px] font-bold text-yellow-600 mr-2 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">từ 99k/tháng</span>
        </Link>
        
        <Link href="/profile" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors border border-gray-200">
          <User className="w-5 h-5 text-gray-500" />
        </Link>
      </div>
    </nav>
  );
}

// Sub-component icons (shorthand for common ones used above)
const ChevronRight = ({ className, style }: { className?: string, style?: any }) => (
  <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

const User = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

