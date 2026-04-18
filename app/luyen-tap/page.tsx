"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Dumbbell, 
  Volume2, 
  PenTool, 
  Languages, 
  BookOpen, 
  ArrowRight,
  Sparkles,
  Target
} from 'lucide-react';
import AppNavbar from '@/components/AppNavbar';

export default function PracticeHub() {
  const practiceModules = [
    { 
      title: 'Luyện nghe HSK', 
      desc: 'Hội thoại thực tế theo giáo trình HSK 3.0, hỗ trợ 3 tốc độ đọc.',
      icon: <Volume2 className="text-blue-500" />,
      href: '/luyen-nghe',
      badge: 'Phổ biến',
      stats: '144 bài hội thoại'
    },
    { 
      title: 'Luyện viết Hán tự', 
      desc: 'Tập viết theo thứ tự nét chuẩn (Stroke Order) với AI nhận diện.',
      icon: <PenTool className="text-yellow-500" />,
      href: '/luyen-viet',
      badge: 'Interactive',
      stats: '3000+ chữ Hán'
    },
    { 
      title: 'Dịch thuật Trung-Việt', 
      desc: 'Công cụ dịch song ngữ kèm Pinyin và giải thích ngữ pháp.',
      icon: <Languages className="text-green-500" />,
      href: '/dich',
      badge: 'Công cụ',
      stats: 'Free Forever'
    },
    { 
      title: 'Từ vựng Flashcard', 
      desc: 'Ôn tập từ vựng bằng thẻ ghi nhớ thông minh (SRS).',
      icon: <BookOpen className="text-orange-500" />,
      href: '/tu-vung-hsk',
      badge: 'Ghi nhớ',
      stats: '11,092 từ vựng'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AppNavbar />

      <main className="max-w-7xl mx-auto px-4 md:px-12 py-16">
        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-4">
             <Dumbbell size={14} fill="currentColor" /> Practice Center
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">Trung tâm <span className="text-[#D85A30]">Luyện tập</span></h1>
          <p className="text-gray-500 font-medium text-lg max-w-2xl leading-relaxed">
            Nơi tập hợp tất cả các công cụ luyện tập chuyên sâu, giúp bạn củng cố kiến thức và nâng cao kỹ năng phản xạ tiếng Trung mỗi ngày.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {practiceModules.map((m, i) => (
             <Link key={i} href={m.href} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-orange-100 transition-all group flex flex-col">
                <div className="flex items-start justify-between mb-8">
                   <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                      {m.icon}
                   </div>
                   <span className="px-3 py-1 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-lg">{m.badge}</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-[#D85A30] transition-colors">{m.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed mb-8 flex-1">
                   {m.desc}
                </p>
                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                      <Target size={14} /> {m.stats}
                   </div>
                   <div className="flex items-center gap-2 text-[#D85A30] font-black uppercase tracking-widest text-sm group-hover:translate-x-1 transition-transform">
                      Bắt đầu <ArrowRight size={18} />
                   </div>
                </div>
             </Link>
           ))}
        </div>

        {/* Coming Soon / Streak Promo */}
        <div className="mt-20 bg-gray-900 rounded-[48px] p-12 relative overflow-hidden text-center text-white">
           <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-[120px] opacity-20"></div>
           <div className="relative z-10">
              <Sparkles className="text-yellow-400 mx-auto mb-6" size={40} />
              <h2 className="text-3xl font-black mb-4">Sắp ra mắt: Gamification & Streak</h2>
              <p className="text-gray-400 max-w-xl mx-auto font-medium mb-0">
                 Hệ thống tính điểm XP, chuỗi ngày học (Streak) và bảng xếp hạng tuần đang được hoàn thiện. Hãy chuẩn bị tinh thần để thi đua cùng bạn bè nhé!
              </p>
           </div>
        </div>
      </main>
    </div>
  );
}
