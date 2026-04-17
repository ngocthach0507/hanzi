"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { X, User, LayoutDashboard, Sparkles, ArrowUpRight } from 'lucide-react';

export default function WelcomeModal() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Kiểm tra xem đã xem hướng dẫn chưa
      const hasSeenWelcome = localStorage.getItem('hasSeenWelcomeGuide');
      if (!hasSeenWelcome) {
        // Delay một chút để trang load xong rồi mới hiện popup cho chuyên nghiệp
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoaded, isSignedIn]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenWelcomeGuide', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100">
        {/* Nút đóng */}
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all z-10"
        >
          <X size={20} />
        </button>

        {/* Trang trí phía trên */}
        <div className="h-32 bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center rotate-12">
            <Sparkles className="text-white w-8 h-8" />
          </div>
        </div>

        <div className="p-10 pt-8 text-center">
          <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Chào mừng bạn mới! 🎉</h3>
          <p className="text-gray-500 font-medium leading-relaxed mb-8">
            Bạn có biết không? <span className="text-red-500 font-black">Hanzi.io.vn</span> có riêng một trang quản lý lộ trình dành cho bạn đấy!
          </p>

          <div className="bg-gray-50 rounded-3xl p-6 mb-8 border border-gray-100 relative group">
             <div className="flex items-start gap-4 text-left">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0 border border-gray-100 text-red-500 font-black italic">
                   <User size={20} />
                </div>
                <div>
                   <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Hướng dẫn nhanh</p>
                   <p className="text-sm font-bold text-gray-700 leading-snug">
                     Bấm vào <span className="text-red-600">Ảnh đại diện</span> ở góc trên bên phải &gt; Chọn <span className="text-blue-600 flex items-center gap-1 inline-flex">Hồ sơ cá nhân <LayoutDashboard size={14} /></span> để xem tiến trình học và gói Premium nhé!
                   </p>
                </div>
             </div>
             
             {/* Hint arrow overlay for visual cue */}
             <div className="absolute -top-12 -right-4 animate-bounce hidden md:block">
                <div className="flex flex-col items-center">
                   <span className="text-[10px] font-black text-red-500 bg-red-50 px-2 py-1 rounded-lg border border-red-100 mb-1">NÓ Ở ĐÂY NÈ!</span>
                   <ArrowUpRight className="text-red-400 rotate-45" size={24} />
                </div>
             </div>
          </div>

          <button
            onClick={handleClose}
            className="w-full py-5 rounded-2xl bg-gray-900 text-white font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95"
          >
            ĐÃ HIỂU, KHÁM PHÁ NGAY!
          </button>
        </div>
      </div>
    </div>
  );
}
