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
  Smartphone, 
  ChevronDown,
  ExternalLink,
  Menu,
  X,
  Zap,
  LayoutDashboard,
  GraduationCap,
  Crown,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { UserButton, SignInButton, useUser } from '@clerk/nextjs';

export default function AppNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<null | 'intro' | 'teacher'>(null);
  const { user, isLoaded } = useUser();
  const [isPro, setIsPro] = useState(false);

  React.useEffect(() => {
    if (!isLoaded || !user) return;

    const checkSub = async () => {
      try {
        const res = await fetch('/api/user/subscription');
        const data = await res.json();
        setIsPro(Boolean(data.isPro));
      } catch (err) {
        console.error("Failed to check subscription:", err);
      }
    };

    checkSub();
    window.addEventListener('focus', checkSub);
    return () => window.removeEventListener('focus', checkSub);
  }, [user, isLoaded]);

  const subNavItems = [
    { label: 'Giáo trình HSK 3.0', icon: <Book className="w-4 h-4" />, href: '/hsk-3-0', color: 'text-red-500', hoverBg: 'hover:bg-red-50', hoverBorder: 'hover:border-red-500' },
    { 
      label: 'Luyện tập', 
      icon: <Dumbbell className="w-4 h-4" />, 
      href: '/luyen-tap',
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
        { label: 'Từ vựng HSK', href: '/tu-vung-hsk' },
      ]
    },
    { label: 'Hội thoại', icon: <MessageCircle className="w-4 h-4" />, href: '/hoi-thoai', color: 'text-orange-500', hoverBg: 'hover:bg-orange-50', hoverBorder: 'hover:border-orange-500' },
    { label: 'Đọc hiểu', icon: <FileText className="w-4 h-4" />, href: '/doc-hieu', color: 'text-purple-500', hoverBg: 'hover:bg-purple-50', hoverBorder: 'hover:border-purple-500' },
    { label: 'Bộ thủ', icon: <LayoutGrid className="w-4 h-4" />, href: '/bo-thu', color: 'text-pink-500', hoverBg: 'hover:bg-pink-50', hoverBorder: 'hover:border-pink-500' },
    { label: 'Luyện thi', icon: <ClipboardList className="w-4 h-4" />, href: '/luyen-thi', color: 'text-amber-500', hoverBg: 'hover:bg-amber-50', hoverBorder: 'hover:border-amber-500' },
  ];

  return (
    <header className="w-full bg-white/80 backdrop-blur-xl sticky top-0 z-[60] border-b border-slate-100 font-sans transition-all">
      {/* ROW 1: TOP HEADER */}
      <div className="px-4 md:px-12 py-4 flex items-center justify-between max-w-[1600px] mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl md:text-3xl font-black text-[#FF5E3A] tracking-tighter hover:scale-105 transition-transform">
            hanzi.io.vn
          </Link>
          <div className="hidden xl:flex items-center gap-8 ml-4">
            <button onClick={() => setActiveModal('intro')} className="text-[11px] font-black text-slate-500 hover:text-[#FF5E3A] uppercase tracking-widest transition-colors">Về Hanzi</button>
            <button onClick={() => setActiveModal('teacher')} className="text-[11px] font-black text-slate-500 hover:text-[#FF5E3A] uppercase tracking-widest transition-colors">Khóa học Online</button>
            <Link href="/blog" className="text-[11px] font-black text-slate-500 hover:text-[#FF5E3A] uppercase tracking-widest transition-colors">Blog</Link>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <div className="hidden lg:flex items-center bg-slate-100/50 rounded-2xl px-4 py-2 w-72 border border-transparent focus-within:border-orange-200 focus-within:bg-white transition-all shadow-sm">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input type="text" placeholder="Tìm kiếm khóa học..." className="bg-transparent text-sm w-full outline-none text-slate-700 font-bold" />
          </div>

          <Link href="/hsk-3-0" className="hidden md:flex items-center gap-2 text-xs font-black text-slate-700 hover:text-[#FF5E3A] relative py-2 px-4 bg-slate-50 rounded-xl transition-all hover:bg-orange-50">
            📚 HSK 3.0
            <span className="bg-[#FF5E3A] text-white text-[8px] px-1.5 py-0.5 rounded-full font-black animate-pulse">NEW</span>
          </Link>

          {isPro ? (
            <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-2xl text-xs font-black shadow-xl ring-4 ring-slate-100">
              <Crown size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="hidden sm:inline">PREMIUM</span>
            </div>
          ) : (
            <Link href="/nang-cap" className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-orange-400 to-[#FF5E3A] text-white px-5 py-2.5 rounded-2xl text-xs font-black shadow-xl shadow-orange-100 hover:scale-105 transition-all">
              <Zap className="w-4 h-4 fill-white" />
              NÂNG CẤP
            </Link>
          )}

          <div className="flex items-center gap-2">
            {!isLoaded ? (
              <div className="w-10 h-10 bg-slate-100 animate-pulse rounded-2xl"></div>
            ) : user ? (
              <UserButton appearance={{ elements: { userButtonAvatarBox: "w-10 h-10 border-2 border-orange-100 hover:border-[#FF5E3A] transition-all shadow-md rounded-2xl" } }}>
                <UserButton.MenuItems>
                  <UserButton.Link label="Dashboard" href="/dashboard" labelIcon={<LayoutDashboard className="w-4 h-4" />} />
                </UserButton.MenuItems>
              </UserButton>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <SignInButton mode="modal">
                  <button className="text-sm font-black text-slate-400 hover:text-slate-900 transition-colors">Đăng nhập</button>
                </SignInButton>
                <Link href="/dang-ky" className="bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-2xl text-xs font-black shadow-xl transition-all active:scale-95">
                   ĐĂNG KÝ MIỄN PHÍ
                </Link>
              </div>
            )}
            <button className="md:hidden p-3 text-slate-700 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all active:scale-90" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP SUB-NAV */}
      <div className="hidden md:block border-b border-gray-50 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <ul className="flex items-center justify-between">
            {subNavItems.map((item, idx) => (
              <li key={idx} className="relative group">
                <Link href={item.href} className={`flex items-center gap-2 px-3 py-3 text-sm font-bold text-gray-500 transition-all border-b-2 border-transparent ${item.hoverBorder} hover:text-gray-900 ${item.hoverBg}`}>
                  <span className={`${item.color}`}>{item.icon}</span>
                  {item.label}
                  {item.dropdown && <ChevronDown className="w-3 h-3 opacity-30" />}
                </Link>
                {item.dropdown && (
                  <div className="absolute top-full left-0 hidden group-hover:block w-48 bg-white border border-gray-100 shadow-xl rounded-b-xl overflow-hidden py-1">
                    {item.dropdown.map((sub, sIdx) => (
                      <Link key={sIdx} href={sub.href} className="block px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-red-50 hover:text-red-600">{sub.label}</Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className={`absolute top-0 right-0 h-full w-[85%] max-w-[400px] bg-white shadow-2xl transition-transform duration-300 ease-out transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="relative p-6 bg-gradient-to-br from-red-600 to-orange-500 text-white overflow-hidden">
             <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all"><X size={20} /></button>
             {user ? (
               <div className="flex flex-col gap-4">
                  <img src={user.imageUrl} alt={user.fullName || ""} className="w-16 h-16 rounded-2xl border-2 border-white/50 shadow-lg object-cover" />
                  <div>
                    <h3 className="text-xl font-black">{user.fullName}</h3>
                    <p className="text-white/70 text-xs font-medium">{user.primaryEmailAddress?.emailAddress}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-lg text-[10px] font-black uppercase">
                       {isPro ? <><Crown size={12} className="text-yellow-300" /> Tài khoản Premium</> : 'Thành viên miễn phí'}
                    </div>
                  </div>
               </div>
             ) : (
               <div className="py-4">
                  <h3 className="text-xl font-black mb-4">Chào mừng đến với Hanzi!</h3>
                  <div className="flex gap-2">
                    <SignInButton mode="modal"><button className="flex-1 bg-white text-red-600 py-2.5 rounded-xl font-black text-sm">Đăng nhập</button></SignInButton>
                    <Link href="/dang-ky" className="flex-1 bg-red-700 text-white py-2.5 rounded-xl font-black text-sm text-center">Đăng ký</Link>
                  </div>
               </div>
             )}
          </div>
          <div className="flex-1 h-[calc(100%-180px)] overflow-y-auto p-4 space-y-6">
             <div className="space-y-1">
                <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Học tập & Luyện tập</p>
                {subNavItems.map((item, idx) => (
                  <Link key={idx} href={item.href} className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 text-gray-700 group transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.hoverBg}`}><span className={item.color}>{item.icon}</span></div>
                       <span className="font-black text-sm">{item.label}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300" />
                  </Link>
                ))}
             </div>
             <div className="space-y-1">
                <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Khám phá Hanzi</p>
                <button onClick={() => { setActiveModal('intro'); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-4 p-3.5 rounded-2xl hover:bg-gray-50 text-gray-700">
                   <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 text-gray-500"><BookOpen size={18} /></div>
                   <span className="font-black text-sm">Về chúng tôi</span>
                </button>
                <button onClick={() => { setActiveModal('teacher'); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-4 p-3.5 rounded-2xl hover:bg-gray-50 text-gray-700">
                   <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 text-gray-500"><GraduationCap size={18} /></div>
                   <span className="font-black text-sm">Học với giáo viên</span>
                </button>
                <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center gap-4 p-3.5 rounded-2xl hover:bg-gray-50 text-gray-700">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 text-gray-500"><Book className="w-4 h-4" /></div>
                    <span className="font-black text-sm">Blog & Cẩm nang</span>
                 </Link>
             </div>
          </div>
          {!isPro && (
            <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-100 bg-gray-50/50">
               <Link href="/nang-cap" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 rounded-2xl font-black shadow-xl">
                  <Zap size={18} className="fill-white" /> NÂNG CẤP PREMIUM NGAY
               </Link>
            </div>
          )}
        </div>
      </div>

      {/* Modal Portals */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveModal(null)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all"><X size={20} /></button>
            <div className="p-8">
              {activeModal === 'intro' ? (
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-6"><Book className="text-red-500 w-6 h-6" /></div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Về hệ sinh thái Hanzi</h3>
                  <div className="h-1 w-12 bg-red-500"></div>
                  <div className="text-gray-600 font-medium leading-relaxed pt-2 space-y-4">
                    <p>
                      Hanzi.io.vn là sản phẩm tâm huyết thuộc hệ sinh thái **Tiếng Trung Hongdou**. Chúng tôi ra đời với sứ mệnh xóa bỏ rào cản ngôn ngữ cho người Việt bằng công nghệ AI tiên tiến.
                    </p>
                    <p>
                      Hiện tại Hanzi tập trung hoàn thiện lộ trình **HSK 3.0 (9 cấp độ)** - tiêu chuẩn mới nhất của thế giới. Mọi nội dung đều được đội ngũ chuyên gia của Hongdou biên soạn thực chiến.
                    </p>
                    <a href="https://applychina.io.vn" target="_blank" className="inline-flex items-center gap-2 text-red-600 font-black text-xs uppercase hover:underline">
                      Hệ sinh thái du học: APPLYCHINA.IO.VN <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6"><GraduationCap className="text-blue-500 w-6 h-6" /></div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Học cùng Giáo viên</h3>
                  <div className="h-1 w-12 bg-blue-500"></div>
                  <div className="text-gray-600 font-medium leading-relaxed pt-2 space-y-4">
                    <p>
                      Ngoài việc tự học trên App, bạn có thể tham gia các lớp học trực tuyến (Online) hoặc trực tiếp (Offline tại Hà Nội) cùng đội ngũ giảng viên chuyên môn cao tại Hongdou.
                    </p>
                    <p>
                      Lộ trình học được thiết kế cá nhân hóa, cam kết đầu ra chuẩn HSK 3.0 mới nhất.
                    </p>
                    <div className="grid grid-cols-1 gap-3 pt-4">
                      <a href="https://zalo.me/0969969696" target="_blank" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100 group">
                        <span className="font-bold text-gray-900 group-hover:text-blue-600">Tư vấn lớp Online</span>
                        <ArrowRight size={16} />
                      </a>
                      <a href="https://zalo.me/0969969696" target="_blank" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-red-50 transition-all border border-transparent hover:border-red-100 group">
                        <span className="font-bold text-gray-900 group-hover:text-red-600">Lớp Offline tại Hà Nội</span>
                        <ArrowRight size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


