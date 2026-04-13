"use client";

import React from 'react';
import Link from 'next/link';
import { BookOpen, Bot, Target, ChevronRight, Zap, GraduationCap, PenTool, Search, MessageSquare, BookText, FileText, ClipboardList, Languages, LayoutGrid } from 'lucide-react';

export default function Home() {
  const hskLevels = [
    { 
      level: 1, 
      title: 'HSK 1', 
      zhTitle: '新HSK教程 1',
      desc: 'Dành cho người bắt đầu hoàn toàn. Học chào hỏi, giới thiệu bản thân.',
      stats: '15 bài · 300 từ',
      tags: 'Cơ bản',
      color: '#E53E3E',
      bgColor: 'bg-[#FFF5F5]',
      borderColor: 'border-red-100'
    },
    { 
      level: 2, 
      title: 'HSK 2', 
      zhTitle: '新HSK教程 2',
      desc: 'Giao tiếp thông dụng: Mua sắm, du lịch, biểu đạt tình cảm.',
      stats: '15 bài · 200 từ mới',
      tags: 'Trung cấp',
      color: '#DD6B20',
      bgColor: 'bg-[#FFFAF0]',
      borderColor: 'border-orange-100'
    },
    { 
      level: 3, 
      title: 'HSK 3', 
      zhTitle: '新HSK教程 3',
      desc: 'Biểu đạt phức tạp, câu bị động, ngữ pháp nâng cao tự nhiên.',
      stats: '18 bài · 500 từ mới',
      tags: 'Nâng cao',
      color: '#D69E2E',
      bgColor: 'bg-[#FFFFF0]',
      borderColor: 'border-yellow-100'
    },
  ];

  const features = [
    { title: 'Giáo trình HSK', icon: <BookText className="w-5 h-5" />, href: '/giao-trinh' },
    { title: 'Từ vựng chủ đề', icon: <LayoutGrid className="w-5 h-5" />, href: '/tu-vung-chu-de' },
    { title: 'Hội thoại', icon: <MessageSquare className="w-5 h-5" />, href: '/hoi-thoai' },
    { title: 'Đọc hiểu', icon: <BookOpen className="w-5 h-5" />, href: '/doc-hieu' },
    { title: 'Luyện thi', icon: <ClipboardList className="w-5 h-5" />, href: '/luyen-thi' },
    { title: 'Bộ thủ', icon: <Zap className="w-5 h-5" />, href: '/bo-thu' },
    { title: 'Dịch thuật', icon: <Languages className="w-5 h-5" />, href: '/dich' },
    { title: 'Mẫu câu', icon: <FileText className="w-5 h-5" />, href: '/mau-cau' },
    { title: 'Luyện viết', icon: <PenTool className="w-5 h-5" />, href: '/luyen-viet' },
    { title: 'Lượng từ', icon: <Search className="w-5 h-5" />, href: '/luong-tu' },
    { title: 'Đề THPT', icon: <GraduationCap className="w-5 h-5" />, href: '/luyen-de-thpt' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-900">
      {/* SECTION 1: HERO */}
      <section className="relative pt-28 pb-20 px-4 overflow-hidden bg-gradient-to-b from-[#FFF5F1] to-white">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-red-600 text-sm font-bold mb-8 animate-bounce">
            <span className="flex h-2 w-2 rounded-full bg-red-500"></span>
            🆕 Tân HSK 3.0 — Giáo Trình Mới Nhất 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
            Chinh phục tiếng Trung theo chuẩn <span className="text-red-500">HSK 3.0</span> mới nhất
          </h1>
          <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Giáo trình Tân HSK của Hanban/CTI — bộ sách chính thức duy nhất chuẩn HSK 3.0. 
            Phương pháp học tập thông minh tích hợp AI Tiểu Ngữ.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link href="/giao-trinh" className="bg-red-500 hover:bg-red-600 text-white px-10 py-5 rounded-full text-xl font-bold shadow-2xl shadow-red-200 transition-all hover:-translate-y-1">
              Bắt đầu học HSK 3.0 →
            </Link>
            <Link href="/giao-trinh" className="bg-white hover:bg-gray-50 text-gray-800 px-10 py-5 rounded-full text-xl font-bold border-2 border-gray-100 transition-all">
              Xem giáo trình
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: WHY HSK 3.0? */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: <BookOpen className="w-8 h-8"/>, title: "Giáo trình chính thức", desc: "Bộ sách duy nhất được Hanban/CTI phê duyệt, chuẩn kiến thức cập nhật 2026." },
            { icon: <Bot className="w-8 h-8"/>, title: "Tích hợp AI", desc: "AI Tiểu Ngữ hỗ trợ luyện phát âm, giải thích ngữ pháp và gợi ý cá nhân hóa 24/7." },
            { icon: <Target className="w-8 h-8"/>, title: "Lộ trình rõ ràng", desc: "Lộ trình từ HSK 1 đến HSK 3 bền vững, tập trung vào cả 5 kỹ năng: Nghe-Nói-Đọc-Viết-Dịch." },
          ].map((item, i) => (
            <div key={i} className="p-10 rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl transition-all duration-500 group">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-red-500 mb-6 group-hover:bg-red-500 group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <h3 className="text-2xl font-black mb-4">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed text-lg">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: HSK LEVELS GRID */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Lộ trình học bài bản</h2>
            <p className="text-gray-500">Bắt đầu hành trình từ con số 0 đến thành thạo</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {hskLevels.map((level) => (
              <Link key={level.level} href={`/giao-trinh/hsk${level.level}`} className={`group relative p-8 rounded-[3rem] border-2 ${level.borderColor} ${level.bgColor} hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 overflow-hidden`}>
                <div className="relative z-10">
                  <span className="inline-block px-4 py-1 rounded-full bg-white text-xs font-bold uppercase tracking-widest mb-6 shadow-sm" style={{ color: level.color }}>
                    {level.tags}
                  </span>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-5xl font-black" style={{ color: level.color }}>{level.title}</h3>
                    <div className="text-3xl opacity-20">0{level.level}</div>
                  </div>
                  <h4 className="text-xl font-bold mb-4 text-gray-800">{level.zhTitle}</h4>
                  <p className="text-gray-600 mb-8 leading-relaxed h-14 line-clamp-2">{level.desc}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm font-bold text-gray-500">{level.stats}</span>
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:translate-x-2 transition-transform">
                      <ChevronRight style={{ color: level.color }} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: QUICK FEATURES */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {features.map((f, i) => (
                <Link key={i} href={f.href} className="flex flex-col items-center p-6 rounded-3xl border border-gray-50 hover:border-red-100 hover:bg-red-50/30 transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 mb-3 group-hover:scale-110 group-hover:text-red-500 transition-all">
                    {f.icon}
                  </div>
                  <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900">{f.title}</span>
                </Link>
              ))}
           </div>
        </div>
      </section>

      {/* SECTION 5: SOCIAL PROOF */}
      <section className="py-20 bg-gray-900 text-white overflow-hidden relative">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
          {[
            { label: "Học viên", value: "48,000+" },
            { label: "Đánh giá", value: "4.9⭐" },
            { label: "HSK 3.0", value: "100%" },
            { label: "Bài học", value: "1,000+" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-4xl md:text-5xl font-black mb-2 text-red-500">{stat.value}</div>
              <div className="text-gray-400 text-sm font-bold uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

