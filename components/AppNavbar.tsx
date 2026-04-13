"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Book, 
  Dumbbell, 
  BookOpen, 
  MessageCircle, 
  FileText, 
  LayoutGrid, 
  ClipboardList, 
  ClipboardCheck, 
  Smartphone, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

export default function AppNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const subNavItems = [
    { label: 'GT hán ngữ', icon: <Book className="w-4 h-4" />, href: '/giao-trinh' },
    { 
      label: 'Luyện tập', 
      icon: <Dumbbell className="w-4 h-4" />, 
      href: '#',
      dropdown: [
        { label: 'Luyện nghe', href: '/luyen-nghe' },
        { label: 'Luyện viết', href: '/luyen-viet' },
        { label: 'Dịch thuật', href: '/dich' },
      ]
    },
    { 
      label: 'Từ vựng', 
      icon: <BookOpen className="w-4 h-4" />, 
      href: '/tu-vung-chu-de',
      dropdown: [
        { label: 'Từ vựng chủ đề', href: '/tu-vung-chu-de' },
        { label: 'Từ vựng HSK', href: '/tu-vung-hsk' },
        { label: 'Lượng từ', href: '/luong-tu' },
      ]
    },
    { label: 'Hội thoại', icon: <MessageCircle className="w-4 h-4" />, href: '/hoi-thoai' },
    { label: 'Đọc hiểu', icon: <FileText className="w-4 h-4" />, href: '/doc-hieu' },
    { label: 'Bộ thủ', icon: <LayoutGrid className="w-4 h-4" />, href: '/bo-thu' },
    { label: 'Luyện thi', icon: <ClipboardList className="w-4 h-4" />, href: '/luyen-thi' },
    { label: 'Luyện thi mới', icon: <ClipboardCheck className="w-4 h-4" />, href: '/luyen-thi-moi' },
  ];

  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-sm">
      {/* ROW 1: TOP HEADER */}
      <div className="border-b border-gray-100 px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-black text-red-500 tracking-tighter">
            hanzi.io.vn
          </Link>
          
          {/* Global Search Bar */}
          <div className="hidden lg:flex items-center bg-gray-100 rounded-lg px-3 py-1.5 w-64 border border-transparent focus-within:border-red-200 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Tìm kiếm khóa học..." 
              className="bg-transparent text-sm w-full outline-none text-gray-700"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* App Buttons */}
          <div className="hidden sm:flex items-center gap-2 mr-4">
            <Link href="#" className="bg-black text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:opacity-80 transition-opacity">
              <Smartphone className="w-3.5 h-3.5" />
              <div className="flex flex-col leading-none">
                <span className="text-[8px] uppercase font-bold opacity-70">Get it on</span>
                <span className="text-[10px] font-black tracking-tight">Google Play</span>
              </div>
            </Link>
            <Link href="#" className="bg-black text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:opacity-80 transition-opacity">
              <Smartphone className="w-3.5 h-3.5" />
              <div className="flex flex-col leading-none">
                <span className="text-[8px] uppercase font-bold opacity-70">Download on</span>
                <span className="text-[10px] font-black tracking-tight">App Store</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/" className="hidden md:flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-red-500">
              🏠 Trang chủ
            </Link>
            
            <Link href="/giao-trinh" className="flex items-center gap-1.5 text-sm font-bold text-gray-700 hover:text-red-500 relative py-1 px-2 bg-gray-50 rounded-lg group">
              📚 HSK 3.0
              <span className="bg-red-500 text-white text-[9px] px-1 rounded-sm animate-pulse">NEW</span>
            </Link>

            <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

            <Link href="/dang-nhap" className="text-sm font-bold text-gray-500 hover:text-gray-900">
              Đăng nhập
            </Link>
            <Link href="/dang-ky" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-blue-100 transition-all active:scale-95">
              Đăng ký
            </Link>
            
            <button className="md:hidden p-2 text-gray-500" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* ROW 2: SUB-NAVBAR (Icons) */}
      <div className="hidden md:block border-b border-gray-50 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <ul className="flex items-center justify-between">
            {subNavItems.map((item, idx) => (
              <li key={idx} className="relative group">
                <Link 
                  href={item.href} 
                  className="flex items-center gap-2 px-3 py-3 text-sm font-bold text-gray-500 hover:text-red-500 transition-colors border-b-2 border-transparent hover:border-red-500"
                >
                  <span className="text-gray-400 group-hover:text-red-500">{item.icon}</span>
                  {item.label}
                  {item.dropdown && <ChevronDown className="w-3 h-3 opacity-30" />}
                </Link>

                {item.dropdown && (
                  <div className="absolute top-full left-0 hidden group-hover:block w-48 bg-white border border-gray-100 shadow-xl rounded-b-xl overflow-hidden py-1 animate-in fade-in slide-in-from-top-1">
                    {item.dropdown.map((sub, sIdx) => (
                      <Link 
                        key={sIdx} 
                        href={sub.href} 
                        className="block px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-red-50 hover:text-red-600"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 p-4 animate-in slide-in-from-top-4">
          <div className="space-y-2">
            {subNavItems.map((item, idx) => (
              <Link 
                key={idx} 
                href={item.href} 
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-sm font-bold text-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

// Sub-component icons (shorthand for common ones used above)
const ChevronRight = ({ className, style }: { className?: string, style?: any }) => (
  <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

const User = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

