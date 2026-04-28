"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ChevronRight, 
  BookOpen, 
  PlayCircle, 
  Lock, 
  ArrowLeft,
  Star,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';

export default function TopicLessonList() {
  const params = useParams();
  const topicSlug = params.topic?.toString() || '';
  const { user, isLoaded: isUserLoaded } = useUser();
  const [isPremium, setIsPremium] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function checkSubscription() {
      if (!isUserLoaded) return;
      
      if (user) {
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('plan, status, expires_at')
          .eq('user_id', user.id)
          .single();
        
        if (subData && subData.plan && subData.plan !== 'free' && subData.status === 'active' &&
            (subData.expires_at ? new Date(subData.expires_at) > new Date() : false)) {
          setIsPremium(true);
        }
      }
      setLoading(false);
    }
    checkSubscription();
  }, [isUserLoaded, user]);

  const lessons = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: `Bài ${i + 1}: Từ vựng mở rộng ${i + 1}`,
    word_count: 15,
    is_free: i < 2,
    progress: i === 0 ? 100 : 0,
    status: i === 0 ? 'completed' : (i < 2 ? 'available' : 'locked')
  }));

  return (
    <div className="py-8 px-4 md:px-8 bg-[#F9FAFB] min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Navigation */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/tu-vung-chu-de" className="hover:text-[#D85A30] transition-colors">Tất cả chủ đề</Link>
          <ChevronRight size={14} />
          <span className="text-gray-600 font-semibold uppercase">{topicSlug.replace('-', ' ')}</span>
        </nav>

        {/* Header */}
        <div className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[40px] border border-gray-100 shadow-sm mb-8 md:mb-12 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-2xl md:text-5xl font-black text-gray-900 mb-4 capitalize">
              Chủ đề: {topicSlug.replace('-', ' ')}
            </h1>
            <p className="text-sm md:text-lg text-gray-500 max-w-lg mb-6 md:mb-8">
              Khám phá hệ thống từ vựng chuyên sâu về {topicSlug.replace('-', ' ')} để nâng cao khả năng giao tiếp của bạn.
            </p>
            <div className="flex gap-10">
              <div className="flex flex-col">
                <span className="text-2xl font-black text-gray-900">10</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bài học</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-[#D85A30]">150</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Từ vựng</span>
              </div>
            </div>
          </div>
          {/* Decorative Background Icon */}
          <div className="absolute top-1/2 -right-8 -translate-y-1/2 text-[180px] opacity-10 select-none">
            🎨
          </div>
        </div>

        {/* Lesson List */}
        <div className="space-y-4">
          {lessons.map((lesson) => {
            const canAccess = lesson.is_free || isPremium;
            return (
              <div 
                key={lesson.id}
                className={`group bg-white p-6 rounded-3xl border border-gray-100 transition-all flex items-center justify-between ${!canAccess ? 'opacity-80' : 'hover:shadow-lg hover:border-orange-100'}`}
              >
                <div className="flex items-center gap-4 md:gap-6">
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-lg md:text-xl ${canAccess ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-300'}`}>
                    {lesson.id}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm md:text-base text-gray-900 mb-1">{lesson.title}</h3>
                    <div className="flex items-center gap-4 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-tighter">
                      <span className="flex items-center gap-1"><BookOpen size={10} md:size={12} /> {lesson.word_count} từ vựng</span>
                      {lesson.status === 'completed' && <span className="flex items-center gap-1 text-green-500"><CheckCircle2 size={10} md:size={12} /> Đã thuộc</span>}
                    </div>
                  </div>
                </div>

                {canAccess ? (
                  <Link 
                    href={`/tu-vung-chu-de/${topicSlug}/${lesson.id}`}
                    className="bg-gray-50 group-hover:bg-[#D85A30] group-hover:text-white text-gray-900 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-base font-bold flex items-center gap-2 transition-all shadow-inner"
                  >
                    Bắt đầu <PlayCircle size={16} md:size={18} />
                  </Link>
                ) : (
                  <div className="flex flex-col items-end gap-1">
                    <div className="bg-gray-50 text-gray-300 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-base font-bold flex items-center gap-2">
                      <Lock size={16} md:size={18} /> Khóa
                    </div>
                    <span className="text-[8px] md:text-[10px] font-black text-gray-300 uppercase mr-1 md:mr-2">Cần tài khoản PREMIUM</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
