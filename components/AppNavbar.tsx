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
  X,
  Zap,
  LayoutDashboard,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { UserButton, SignInButton, useUser } from '@clerk/nextjs';

export default function AppNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<null | 'intro' | 'teacher'>(null);
  const { user, isLoaded } = useUser();

  const subNavItems = [
    { label: 'Giáo trình HSK 3.0', icon: <Book className="w-4 h-4" />, href: '/giao-trinh', color: 'text-red-500', hoverBg: 'hover:bg-red-50', hoverBorder: 'hover:border-red-500' },
    { 
      label: 'Luyện tập', 
      icon: <Dumbbell className="w-4 h-4" />, 
      href: '#',
      color: 'text-blue-500',
      hoverBg: 'hover:bg-blue-50',
      hoverBorder: 'hover:border-blue-500',
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
      color: 'text-green-500',
      hoverBg: 'hover:bg-green-50',
      hoverBorder: 'hover:border-green-500',
      dropdown: [
        { label: 'Từ vựng chủ đề', href: '/tu-vung-chu-de' },
        { label: 'Từ vựng HSK', href: '/giao-trinh' },
        { label: 'Lượng từ', href: '/luong-tu' },
      ]
    },
    { label: 'Hội thoại', icon: <MessageCircle className="w-4 h-4" />, href: '/hoi-thoai', color: 'text-orange-500', hoverBg: 'hover:bg-orange-50', hoverBorder: 'hover:border-orange-500' },
    { label: 'Đọc hiểu', icon: <FileText className="w-4 h-4" />, href: '/doc-hieu', color: 'text-purple-500', hoverBg: 'hover:bg-purple-50', hoverBorder: 'hover:border-purple-500' },
    { label: 'Bộ thủ', icon: <LayoutGrid className="w-4 h-4" />, href: '/bo-thu', color: 'text-pink-500', hoverBg: 'hover:bg-pink-50', hoverBorder: 'hover:border-pink-500' },
    { label: 'Luyện thi', icon: <ClipboardList className="w-4 h-4" />, href: '/luyen-thi', color: 'text-amber-500', hoverBg: 'hover:bg-amber-50', hoverBorder: 'hover:border-amber-500' },
  ];

  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-sm font-sans">
      {/* ROW 1: TOP HEADER */}
      <div className="border-b border-gray-100 px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-black text-red-500 tracking-tighter">
            hanzi.io.vn
          </Link>
          
          <div className="hidden xl:flex items-center gap-6 ml-4">
            <button 
              onClick={() => setActiveModal('intro')}
              className="text-xs font-black text-gray-800 hover:text-red-500 uppercase tracking-widest whitespace-nowrap transition-colors"
            >
              Giới thiệu
            </button>
            <button 
              onClick={() => setActiveModal('teacher')}
              className="text-xs font-black text-gray-800 hover:text-red-500 uppercase tracking-widest whitespace-nowrap transition-colors"
            >
              Học với giáo viên
            </button>
          </div>
          
          {/* Global Search Bar */}
          <div className="hidden lg:flex items-center bg-gray-100 rounded-lg px-3 py-1.5 w-64 border border-transparent focus-within:border-red-200 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Tìm kiếm khóa học..." 
              className="bg-transparent text-sm w-full outline-none text-gray-700 font-bold"
            />
          </div>
        </div>
        
        {/* Modal Portals */}
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveModal(null)}></div>
            <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all"
              >
                <X size={20} />
              </button>
              
              <div className="p-8">
                {activeModal === 'intro' ? (
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                      <Book className="text-red-500 w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 uppercase">Về Hanzi.io.vn</h3>
                    <div className="h-1 w-12 bg-red-500"></div>
                    <p className="text-gray-600 font-medium leading-relaxed pt-2">
                       Hanzi.io.vn là sản phẩm thuộc hệ sinh thái Tiếng Trung Hongdou. Từ thực tế giảng dạy nhiều năm, chúng tôi xây dựng nền tảng này để hỗ trợ học viên tiếp cận với giáo trình HSK 3.0 (chuẩn 2026) một cách hiệu quả nhất. Đây chính là bước đệm vững chắc nhất để bạn hiện thực hóa giấc mơ du học.
                    </p>
                    <div className="pt-4 p-4 bg-red-50 rounded-2xl border border-red-100/50">
                       <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Dành cho bạn muốn du học</p>
                       <a href="https://applychina.io.vn" target="_blank" className="text-red-600 font-black text-sm uppercase hover:underline flex items-center gap-2">
                          Tìm trường & Học bổng: applychina.io.vn →
                       </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                      <MessageCircle className="text-blue-500 w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 uppercase">Học cùng giáo viên</h3>
                    <div className="h-1 w-12 bg-blue-500"></div>
                    <p className="text-gray-600 font-medium leading-relaxed pt-2">
                       Ngoài nền tảng tự học, Tiếng Trung Hongdou cung cấp các chương trình đào tạo chuyên sâu cùng giảng viên. Với lộ trình cá nhân hóa sát theo giáo trình HSK 3.0 mới nhất, chúng tôi cam kết giúp bạn chinh phục mục tiêu ngôn ngữ nhanh hơn gấp 3 lần.
                    </p>
                    <div className="grid grid-cols-1 gap-3 pt-6">
                       <a href="https://tiengtrunghongdou.io.vn/" target="_blank" className="bg-blue-600 text-white p-4 rounded-2xl font-black text-center shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                          <Zap size={18} /> Đăng ký học Online
                       </a>
                       <a href="https://tiengtrunghongdou.io.vn/" target="_blank" className="border-2 border-gray-100 p-4 rounded-2xl font-black text-center text-gray-600 hover:bg-gray-50 transition-all">
                          Tìm hiểu khóa Offline
                       </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* App Buttons */}
          <div className="hidden sm:flex items-center gap-2 mr-4">
            <div className="bg-black/5 text-gray-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-not-allowed grayscale">
              <Smartphone className="w-3.5 h-3.5" />
              <div className="flex flex-col leading-none">
                <span className="text-[8px] uppercase font-bold opacity-70">Coming soon</span>
                <span className="text-[10px] font-black tracking-tight">Google Play</span>
              </div>
            </div>
            <div className="bg-black/5 text-gray-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-not-allowed grayscale">
              <Smartphone className="w-3.5 h-3.5" />
              <div className="flex flex-col leading-none">
                <span className="text-[8px] uppercase font-bold opacity-70">Coming soon</span>
                <span className="text-[10px] font-black tracking-tight">App Store</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/" className="hidden md:flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-red-500">
              🏠 Trang chủ
            </Link>
            
            <Link href="/giao-trinh" className="flex items-center gap-1.5 text-sm font-bold text-gray-700 hover:text-red-500 relative py-1 px-2 bg-gray-50 rounded-lg group">
              📚 HSK 3.0
              <span className="bg-red-500 text-white text-[9px] px-1 rounded-sm animate-pulse">NEW</span>
            </Link>

            <Link href="/nang-cap" className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-black shadow-lg shadow-orange-100 hover:scale-105 transition-all animate-shimmer bg-[length:200%_100%]">
              <Zap className="w-4 h-4 fill-white" />
              NÂNG CẤP PREMIUM
            </Link>

            <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

            {!isLoaded ? (
              <div className="w-8 h-8 bg-gray-100 animate-pulse rounded-full"></div>
            ) : user ? (
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9 border-2 border-red-100 hover:border-red-400 transition-all shadow-sm"
                  }
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link 
                    label="Hồ sơ cá nhân" 
                    href="/dashboard" 
                    labelIcon={<LayoutDashboard className="w-4 h-4" />} 
                  />
                </UserButton.MenuItems>
              </UserButton>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="text-sm font-bold text-gray-500 hover:text-gray-900">
                    Đăng nhập
                  </button>
                </SignInButton>
                <Link href="/dang-ky" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-blue-100 transition-all active:scale-95">
                  Đăng ký
                </Link>
              </>
            )}
            
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
                  className={`flex items-center gap-2 px-3 py-3 text-sm font-bold text-gray-500 transition-all border-b-2 border-transparent ${item.hoverBorder} hover:text-gray-900 ${item.hoverBg}`}
                >
                  <span className={`${item.color}`}>{item.icon}</span>
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
          <div className="space-y-4">
             {/* Info links in mobile menu too */}
             <div className="grid grid-cols-2 gap-2 border-b border-gray-50 pb-4">
                <button onClick={() => { setActiveModal('intro'); setIsMobileMenuOpen(false); }} className="p-3 bg-gray-50 rounded-xl text-xs font-black uppercase text-gray-800">Giới thiệu</button>
                <button onClick={() => { setActiveModal('teacher'); setIsMobileMenuOpen(false); }} className="p-3 bg-gray-50 rounded-xl text-xs font-black uppercase text-gray-800">Học giáo viên</button>
             </div>
            {subNavItems.map((item, idx) => (
              <Link 
                key={idx} 
                href={item.href} 
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 text-sm font-bold text-gray-700"
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

