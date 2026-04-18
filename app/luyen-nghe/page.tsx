"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  Headphones, 
  ChevronRight, 
  Star, 
  Play, 
  BookOpen, 
  Zap, 
  Loader2,
  Trophy,
  ArrowRight,
  ChevronLeft,
  Lock
} from 'lucide-react';

// --- Level Data ---
const HSK_LEVELS = [
  { 
    id: 1, 
    title: 'HSK 1', 
    subtitle: 'Nhập môn & Làm quen', 
    desc: 'Bắt đầu hành trình với những âm thanh cơ bản, từ vựng thông dụng nhất.',
    lessonCount: 15,
    color: 'text-hsk1',
    bg: 'bg-hsk1',
    lightBg: 'bg-hsk1-light',
    accent: 'border-red-100',
    free: true
  },
  { 
    id: 2, 
    title: 'HSK 2', 
    subtitle: 'Giao tiếp Cơ bản', 
    desc: 'Mở rộng khả năng nghe hiểu các tình huống giao tiếp hàng ngày đơn giản.',
    lessonCount: 15,
    color: 'text-hsk2',
    bg: 'bg-hsk2',
    lightBg: 'bg-hsk2-light',
    accent: 'border-orange-100',
    free: false
  },
  { 
    id: 3, 
    title: 'HSK 3', 
    subtitle: 'Nâng cao Kỹ năng', 
    desc: 'Thử thách bản thân với các đoạn hội thoại dài và phức tạp hơn.',
    lessonCount: 18,
    color: 'text-hsk3',
    bg: 'bg-hsk3',
    lightBg: 'bg-hsk3-light',
    accent: 'border-yellow-100',
    free: false
  }
];

export default function LuyenNgheHub() {
  const { user, isLoaded: userLoaded } = useUser();
  const [isPro, setIsPro] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkPro() {
      if (user) {
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('plan, status, expires_at')
          .eq('user_id', user.id)
          .single();
        
        if (subData && subData.plan && subData.plan !== 'free' && subData.status === 'active' &&
            (subData.expires_at ? new Date(subData.expires_at) > new Date() : false)) {
          setIsPro(true);
        }
      }
    }
    checkPro();
  }, [user]);

  useEffect(() => {
    if (selectedLevel) {
      fetchLessons(selectedLevel);
    }
  }, [selectedLevel]);

  async function fetchLessons(level: number) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('book_level', level)
        .order('lesson_number', { ascending: true });

      if (error) throw error;
      setLessons(data || []);
    } catch (err) {
      console.error('Error fetching lessons:', err);
    } finally {
      setLoading(false);
    }
  }

  const currentLevelInfo = HSK_LEVELS.find(l => l.id === selectedLevel);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 font-sans">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-24 px-4 overflow-hidden bg-mesh">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-100/20 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-slate-100 rounded-full shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
             <Headphones size={18} className="text-[#FF5E3A]" strokeWidth={3} />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Kỹ năng Nghe hiểu</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
             Luyện Nghe <span className="text-[#FF5E3A]">Phản Xạ</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
             Hệ thống bài tập nghe chuẩn bản ngữ theo lộ trình HSK 3.0. 
             Giúp bạn rèn luyện đôi tai thính và phản xạ ngôn ngữ tức thì.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {!selectedLevel ? (
          /* --- LEVEL SELECTION GRID --- */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            {HSK_LEVELS.map((level) => {
              const locked = !level.free && !isPro;
              return (
                <button 
                  key={level.id}
                  onClick={() => {
                    if (locked) {
                      window.location.href = '/nang-cap';
                    } else {
                      setSelectedLevel(level.id);
                    }
                  }}
                  className={`path-card group featured ${locked ? 'opacity-80 grayscale' : ''}`}
                >
                   <div className={`level-badge ${level.bg === 'bg-hsk1' ? 'bg-red-100 text-red-600' : level.bg === 'bg-hsk2' ? 'bg-orange-100 text-orange-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {locked ? 'KHÓA PREMIUM' : `CẤP ĐỘ ${level.id}`}
                   </div>
                   
                   <div className={`path-icon ${level.lightBg} ${level.color}`}>
                      {locked ? <Lock size={28} /> : <span className="text-4xl font-black">{level.id}</span>}
                   </div>
                   
                   <h2 className="text-3xl font-black text-slate-900 mb-2 group-hover:text-[#FF5E3A] transition-colors">{level.title}</h2>
                   <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">
                     {level.subtitle}
                   </p>
                   <p className="text-slate-500 font-medium leading-relaxed mb-10 h-20 overflow-hidden line-clamp-3">
                     {locked ? 'Vui lòng nâng cấp gói Premium để truy cập lộ trình nghe hiểu nâng cao của cấp độ này.' : level.desc}
                   </p>
                   
                   <div className="flex items-center justify-between mt-auto w-full">
                      <div className="flex items-center gap-2">
                         <BookOpen size={16} className="text-slate-300" />
                         <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{level.lessonCount} BÀI HỌC</span>
                      </div>
                      <div className={`w-12 h-12 rounded-2xl ${locked ? 'bg-slate-200' : level.bg} text-white flex items-center justify-center shadow-lg group-hover:translate-x-2 transition-transform`}>
                         {locked ? <ArrowRight size={20} strokeWidth={3} /> : <ChevronRight size={20} strokeWidth={3} />}
                      </div>
                   </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* --- LESSONS LIST VIEW --- */
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-12">
               <button 
                 onClick={() => setSelectedLevel(null)}
                 className="flex items-center gap-2 text-sm font-black text-gray-400 hover:text-gray-900 transition-colors"
               >
                 <ChevronLeft size={20} /> QUAY LẠI CHỌN CẤP ĐỘ
               </button>
               <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${currentLevelInfo?.lightBg} ${currentLevelInfo?.color} flex items-center justify-center font-black`}>
                    {selectedLevel}
                  </div>
                  <h2 className="text-3xl font-black text-gray-900">{currentLevelInfo?.title} - Danh sách bài luyện tập</h2>
               </div>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center">
                 <Loader2 size={48} className={`animate-spin ${currentLevelInfo?.color} mb-4`} />
                 <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Đang tải dữ liệu bài học...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {lessons.map((lesson) => (
                  <Link 
                    key={lesson.id} 
                    href={`/giao-trinh/hsk${selectedLevel}/bai-${lesson.lesson_number}/luyen-nghe`}
                    className="group bg-white p-8 rounded-[2.5rem] border border-white hover:border-orange-100 hover:shadow-2xl hover:shadow-orange-100/20 transition-all flex items-center justify-between gap-6 shadow-sm"
                  >
                    <div className="flex items-center gap-6">
                       <span className={`w-14 h-14 rounded-2xl ${currentLevelInfo?.lightBg} ${currentLevelInfo?.color} flex items-center justify-center text-xl font-black shadow-inner group-hover:scale-110 transition-transform`}>
                         {lesson.lesson_number}
                       </span>
                       <div>
                          <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-[#FF5E3A] transition-colors">{lesson.title_zh}</h3>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{lesson.title_vi}</p>
                       </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-[#FF5E3A] group-hover:text-white transition-all shadow-sm">
                       <Play size={16} fill="currentColor" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- SIDE ACCENTS --- */}
      <div className="fixed bottom-10 right-10 flex flex-col gap-4">
         <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
            <Zap size={24} className="text-yellow-400" />
         </div>
      </div>
    </div>
  );
}
