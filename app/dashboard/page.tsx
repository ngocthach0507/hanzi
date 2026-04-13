"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';

// Sử dụng SVG hoặc Emoji để đảm bảo tính ổn định tuyệt đối
const Icons = {
  Flame: () => <span>🔥</span>,
  Book: () => <span>📚</span>,
  Check: () => <span>✅</span>,
  Target: () => <span>🎯</span>,
  Award: () => <span>🏆</span>,
  Crown: () => <span>👑</span>,
  Clock: () => <span>🕒</span>,
  Zap: () => <span>⚡</span>,
  Chart: () => <span>📈</span>,
  ArrowRight: () => <span>→</span>,
  Star: () => <span>⭐</span>
};

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState<any[]>([]);
  const [nextLesson, setNextLesson] = useState<any>(null);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    async function fetchData() {
      try {
        setLoading(true);
        const userId = user.id;

        // 1. Fetch Subscription Status
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', userId)
          .single();
        setSubscription(subData);

        // 2. Fetch Streak & Total Stats
        const { data: streakData } = await supabase
          .from('user_streaks')
          .select('*')
          .eq('user_id', userId)
          .single();

        // 3. Fetch Progress (Completed Lessons)
        const { count: completedCount } = await supabase
          .from('user_progress')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('content_type', 'lesson')
          .eq('status', 'completed');

        // 4. Fetch Learned Words
        const { count: wordsCount } = await supabase
          .from('user_vocabulary')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        // 5. Fetch Reviews Due Today
        const { count: dueCount } = await supabase
          .from('user_vocabulary')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .lte('next_review', new Date().toISOString().split('T')[0]);

        setReviewsCount(dueCount || 0);

        // 6. Fetch Next Lesson logic
        const { data: allLessons } = await supabase
          .from('lessons')
          .select('*')
          .order('hsk_level', { ascending: true })
          .order('lesson_number', { ascending: true });

        const { data: userProgress } = await supabase
          .from('user_progress')
          .select('content_id')
          .eq('user_id', userId)
          .eq('content_type', 'lesson')
          .eq('status', 'completed');

        const completedIds = new Set(userProgress?.map(p => p.content_id) || []);
        const next = allLessons?.find(l => !completedIds.has(l.id));
        setNextLesson(next || allLessons?.[0]);

        // 7. Leaderboard (Global Top XP)
        const { data: topUsers } = await supabase
          .from('user_streaks')
          .select('user_id, total_xp')
          .order('total_xp', { ascending: false })
          .limit(5);
        
        const mockNames = ['Khánh An', 'Hoàng Minh', 'Ngọc Lan', 'Thế Anh', 'Quỳnh Trâm'];
        setLeaderboard(topUsers?.map((u, i) => ({
          name: u.user_id === userId ? (user.firstName || 'Bạn') : mockNames[i],
          xp: `${u.total_xp} XP`,
          pos: i + 1,
          avatar: u.user_id === userId ? user.imageUrl : null,
          initials: mockNames[i].split(' ').map(n => n[0]).join('')
        })) || []);

        setStats([
          { label: 'Ngày học (Streak)', value: streakData?.current_streak || 0, icon: <Icons.Flame />, color: 'text-orange-600 bg-orange-50' },
          { label: 'Từ đã học', value: wordsCount || 0, icon: <Icons.Book />, color: 'text-blue-600 bg-blue-50' },
          { label: 'Bài hoàn thành', value: completedCount || 0, icon: <Icons.Check />, color: 'text-green-600 bg-green-50' },
          { label: 'Tổng XP', value: streakData?.total_xp || 0, icon: <Icons.Award />, color: 'text-purple-600 bg-purple-50' },
        ]);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isLoaded, user]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Đang tải dữ liệu học tập...</p>
      </div>
    );
  }

  const isPro = subscription?.plan?.toLowerCase().includes('pro') && subscription?.status === 'active';

  return (
    <div className="py-12 px-4 md:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <h1 className="text-4xl font-black text-gray-900 tracking-tight">Chào mừng, {user?.firstName || 'học viên'}! 👋</h1>
               {isPro ? (
                 <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-black uppercase rounded-full border border-yellow-200 shadow-sm">
                    <Icons.Crown /> PRO member
                 </span>
               ) : (
                 <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-black uppercase rounded-full border border-gray-200">
                    Học viên tự do
                 </span>
               )}
            </div>
            <p className="text-gray-500 font-medium">Bạn đã sẵn sàng để trở thành bậc thầy Hán ngữ chưa?</p>
          </div>
          
          <div className="flex flex-col gap-3">
             <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 flex items-center justify-between gap-6 shadow-sm">
                <div className="flex items-center gap-3">
                   <Icons.Flame />
                   <span className="text-lg font-black text-gray-900">{stats[0]?.value || 0} Ngày Streak</span>
                </div>
             </div>
             {!isPro && (
               <Link href="/nang-cap" className="bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold text-center hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200 text-sm">
                  🚀 Nâng cấp PRO ngay
               </Link>
             )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className={`p-4 rounded-2xl mb-4 text-2xl ${s.color}`}>
                {s.icon}
              </div>
              <div className="text-2xl font-black text-gray-900 mb-1">{s.value}</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Area (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Today's Tasks */}
            <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                    <Icons.Zap /> Bài học hôm nay
                 </h3>
              </div>
              
              <div className="space-y-4">
                 {nextLesson ? (
                   <Link href={`/giao-trinh/hsk${nextLesson.hsk_level}/${nextLesson.lesson_number}`}>
                    <div className="group bg-gray-50 p-6 rounded-3xl flex items-center justify-between hover:bg-orange-50 transition-all cursor-pointer border border-transparent hover:border-orange-100">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-xl text-orange-600 shadow-sm">
                            {nextLesson.lesson_number < 10 ? `0${nextLesson.lesson_number}` : nextLesson.lesson_number}
                          </div>
                          <div>
                              <div className="text-sm font-bold text-gray-900 mb-1">
                                HSK {nextLesson.hsk_level} - Bài {nextLesson.lesson_number}: {nextLesson.title}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase">
                                <Icons.Chart /> Bài học tiếp theo
                              </div>
                          </div>
                        </div>
                        <Icons.ArrowRight />
                    </div>
                   </Link>
                 ) : (
                   <div className="p-8 text-center text-gray-400 italic">
                      Bạn đã hoàn thành tất cả bài học hiện có. Quay lại sau nhé!
                   </div>
                 )}

                 <div className="group bg-gray-50 p-6 rounded-3xl flex items-center justify-between hover:bg-blue-50 transition-all cursor-pointer border border-transparent hover:border-blue-100">
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                          <Icons.Book />
                       </div>
                       <div>
                          <div className="text-sm font-bold text-gray-900 mb-1">Ôn tập từ vựng chuẩn SRS</div>
                          <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase">
                             <Icons.Clock /> {reviewsCount} từ đến hạn ôn tập
                          </div>
                       </div>
                    </div>
                    <Icons.ArrowRight />
                 </div>
              </div>
            </div>

            {/* Heatmap Placeholder */}
            <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm overflow-x-auto">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                     <Icons.Star /> Hoạt động 30 ngày qua
                  </h3>
               </div>
               <div className="flex gap-1.5 h-32 items-end justify-between min-w-[500px] px-2">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className="flex-1 group relative">
                       <div 
                         className={`w-full rounded-t-lg transition-all ${i > 25 ? 'bg-orange-500 h-16' : (i > 15 ? 'bg-orange-200 h-8' : 'bg-gray-100 h-4')}`}
                       ></div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Right Area (1/3) */}
          <div className="space-y-8">
             {/* Progress Tracks */}
             <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm">
                <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                   <Icons.Target /> Tiến độ lộ trình
                </h3>
                <div className="space-y-6">
                   {[
                      { name: 'HSK 1', progress: Math.min(100, Math.round((stats[2]?.value / 50) * 100)), color: 'bg-blue-500' },
                      { name: 'HSK 2', progress: 0, color: 'bg-orange-500' },
                      { name: 'HSK 3', progress: 0, color: 'bg-green-500' },
                   ].map((m, i) => (
                      <div key={i} className="space-y-2">
                         <div className="flex justify-between text-xs font-bold text-gray-700">
                            <span>{m.name}</span>
                            <span>{m.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
                             <div className={`${m.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${m.progress}%` }}></div>
                          </div>
                      </div>
                   ))}
                </div>
             </div>

             {/* Leaderboard */}
             <div className="bg-[#1F2937] text-white rounded-[40px] p-8 shadow-xl">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-xl font-black flex items-center gap-3">
                      <Icons.Award /> Bảng xếp hạng
                   </h3>
                </div>
                <div className="space-y-4">
                   {leaderboard.map((u, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                         <div className="flex items-center gap-4">
                            <span className="text-sm font-black text-gray-500 w-4">#{u.pos}</span>
                            <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center font-bold text-xs overflow-hidden">
                              {u.avatar ? <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" /> : u.initials}
                            </div>
                            <div className="text-sm font-bold truncate max-w-[80px]">{u.name}</div>
                         </div>
                         <div className="text-xs font-black text-orange-400">{u.xp}</div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
