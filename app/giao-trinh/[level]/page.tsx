"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { ChevronRight, Lock, CheckCircle2, Book, ArrowRight, Crown, Star, ShieldCheck } from 'lucide-react';

export default function LessonList() {
  const params = useParams();
  const { user, isLoaded: isUserLoaded } = useUser();
  const levelParam = params.level?.toString() || 'hsk1';
  const numericLevel = parseInt(levelParam.replace('hsk', '') || '1');

  const [lessons, setLessons] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<Set<number>>(new Set());
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  // Identify theme colors based on HSK level
  const theme = {
    color: numericLevel === 1 ? 'text-hsk1' : numericLevel === 2 ? 'text-hsk2' : 'text-hsk3',
    bg: numericLevel === 1 ? 'bg-hsk1' : numericLevel === 2 ? 'bg-hsk2' : 'bg-hsk3',
    lightBg: numericLevel === 1 ? 'bg-hsk1-light' : numericLevel === 2 ? 'bg-hsk2-light' : 'bg-hsk3-light',
    border: numericLevel === 1 ? 'border-red-100' : numericLevel === 2 ? 'border-orange-100' : 'border-yellow-100',
    shadow: numericLevel === 1 ? 'shadow-red-100' : numericLevel === 2 ? 'shadow-orange-100' : 'shadow-yellow-100',
  };

  useEffect(() => {
    if (!isUserLoaded) return;

    async function fetchData() {
      try {
        setLoading(true);
        const userId = user?.id;

        // 1. Fetch Lessons for this HSK level from the new 'lessons' table
        const { data: lessonsData } = await supabase
          .from('lessons')
          .select('*')
          .eq('book_level', numericLevel)
          .order('lesson_number', { ascending: true });

        // 2. Fetch User Progress
        if (userId) {
          const { data: progressData } = await supabase
            .from('user_progress')
            .select('lesson_number')
            .eq('user_id', userId)
            .eq('book_level', numericLevel)
            .eq('status', 'completed');
          
          setUserProgress(new Set(progressData?.map(p => p.lesson_number) || []));

          // 3. Fetch Subscription Status via Secure API
          try {
            const res = await fetch('/api/user/subscription');
            const data = await res.json();
            if (data.isPro) {
              setIsPro(true);
            }
          } catch (err) {
            console.error("Failed to check subscription:", err);
          }
        }

        setLessons(lessonsData || []);
      } catch (err) {
        console.error('Error fetching lesson list:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [numericLevel, isUserLoaded, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className={`w-12 h-12 border-4 ${theme.color} border-t-transparent rounded-full animate-spin mb-4`}></div>
        <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Đang nạp bài học HSK {numericLevel}...</p>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 md:px-8 bg-white min-h-screen font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            "name": `Giáo trình HSK ${numericLevel} chuẩn 3.0`,
            "description": `Lộ trình học tiếng Trung HSK ${numericLevel} chuẩn 3.0 mới nhất. Bao gồm từ vựng, ngữ pháp, hội thoại và luyện nghe.`,
            "provider": {
              "@type": "Organization",
              "name": "Hanzi.io.vn",
              "sameAs": "https://hanzi.io.vn"
            },
            "courseCode": `HSK${numericLevel}`,
            "educationalLevel": `HSK ${numericLevel}`
          })
        }}
      />
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-12 font-bold uppercase tracking-widest">
          <Link href="/" className="hover:text-brand transition-colors">Trang chủ</Link>
          <ChevronRight size={12} />
          <Link href="/giao-trinh" className="hover:text-brand transition-colors">Giáo trình</Link>
          <ChevronRight size={12} />
          <span className="text-gray-900">HSK {numericLevel}</span>
        </nav>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="flex-1">
             <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${theme.lightBg} ${theme.color} text-[10px] font-black mb-6 uppercase tracking-[0.2em] border border-current shadow-sm`}>
                <ShieldCheck size={14} />
                Chương trình chuẩn HSK 3.0
             </div>
             <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tighter">Bài học HSK {numericLevel}</h1>
             <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
               Lộ trình {lessons.length} bài học trọng tâm được thiết kế khoa học giúp bạn ghi nhớ lâu và ứng dụng thực tế ngay lập tức.
             </p>
          </div>
          <div className="flex gap-4">
             <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 flex flex-col items-center min-w-[140px]">
                <span className="text-4xl font-black text-gray-900">{lessons.length}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 text-center">Tổng bài học</span>
             </div>
          </div>
        </div>

        {/* Lesson List Grid */}
        <div className="grid grid-cols-1 gap-4">
          {lessons.map((lesson) => {
            const isGuest = !user?.id;
            const isCompleted = userProgress.has(lesson.lesson_number);
            
            // Logic mở khóa mới (Conversion Funnel):
            // 1. Khách (Chưa đăng nhập): Chỉ xem được 1 bài đầu
            // 2. Thành viên (Đã đăng nhập, chưa mua Pro): Xem được 3 bài đầu
            // 3. Pro: Xem tất cả
            let isUnlocked = false;
            let lockReason = "";

            if (isPro) {
              isUnlocked = true;
            } else if (!isGuest) {
              if (lesson.lesson_number <= 3) {
                isUnlocked = true;
              } else {
                lockReason = "Yêu cầu Premium";
              }
            } else {
              if (lesson.lesson_number <= 1) {
                isUnlocked = true;
              } else {
                lockReason = "Đăng ký miễn phí";
              }
            }

            return (
              <div 
                key={lesson.id}
                className={`group relative bg-white p-6 md:p-8 rounded-[2.5rem] border-2 transition-all flex items-center gap-6 md:gap-8 ${
                  !isUnlocked ? 'border-gray-50 opacity-80' : `border-transparent hover:border-gray-100 hover:bg-gray-50/50 ${theme.shadow}`
                }`}
              >
                {/* Number Circle */}
                <div className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-[2rem] flex flex-col items-center justify-center transition-all ${
                  isUnlocked ? `${theme.bg} text-white shadow-xl` : 'bg-gray-100 text-gray-400'
                }`}>
                  <span className="text-[10px] uppercase font-black opacity-60">BÀI</span>
                  <span className="text-2xl md:text-3xl font-black leading-none">{lesson.lesson_number}</span>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`text-xl md:text-2xl font-black text-gray-900 truncate leading-tight ${!isUnlocked ? 'blur-[2px]' : ''}`}>
                       {lesson.title_zh}
                    </h3>
                  </div>
                  <p className={`text-gray-500 font-bold mb-4 ${!isUnlocked ? 'blur-[1px]' : ''}`}>{lesson.title_vi}</p>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    {isUnlocked ? (
                       <>
                         <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Star size={12} className={theme.color} />
                            HSK 3.0 Standard
                         </div>
                         {isCompleted && (
                           <div className="flex items-center gap-1 text-[10px] font-black text-green-600 uppercase bg-green-50 px-2 py-1 rounded-lg">
                              <CheckCircle2 size={10} /> ĐÃ HOÀN THÀNH
                           </div>
                         )}
                         {lesson.is_free && (
                           <div className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded-lg">Miễn phí</div>
                         )}
                       </>
                    ) : (
                      <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${lockReason === "Yêu cầu Premium" ? 'text-orange-500' : 'text-blue-500'}`}>
                        <Lock size={12} /> {lockReason === "Yêu cầu Premium" ? 'Mở khóa với Premium' : 'Đăng ký để học tiếp'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex-shrink-0 group">
                  {isUnlocked ? (
                    <Link 
                      href={`/giao-trinh/hsk${numericLevel}/bai-${lesson.lesson_number}`}
                      className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-gray-900 text-white flex items-center justify-center text-xl hover:scale-110 active:scale-90 transition-all shadow-xl group-hover:rotate-[-10deg]`}
                    >
                      <ArrowRight size={28} strokeWidth={3} />
                    </Link>
                  ) : (
                    <Link 
                      href={isGuest ? "/dang-ky" : "/nang-cap"} 
                      className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all ${
                        lockReason === "Yêu cầu Premium" ? 'bg-orange-50 text-orange-500 hover:bg-orange-100' : 'bg-blue-50 text-blue-500 hover:bg-blue-100'
                      }`}
                    >
                      <Lock size={28} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pro Banner - Section Footer */}
        {!isPro && (
          <div className="mt-24 text-center bg-gray-900 p-10 md:p-24 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10">
               <Crown size={64} className="mx-auto mb-8 text-yellow-500 animate-pulse" />
               <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Chinh phục HSK {numericLevel} bứt phá!</h2>
               <p className="text-gray-400 mb-12 max-w-2xl mx-auto text-xl leading-relaxed font-medium">
                 Mở khóa toàn bộ bài học, luyện tập thi thử và nhận sự hỗ trợ đặc biệt từ AI Tiểu Ngữ 24/7.
               </p>
               <Link href="/nang-cap" className="inline-flex items-center gap-4 bg-white text-gray-900 px-12 py-6 rounded-full font-black text-2xl hover:bg-yellow-400 transition-all shadow-xl hover:-translate-y-1 active:scale-95">
                  NÂNG CẤP PREMIUM NGAY
               </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

