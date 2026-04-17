"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { 
  Flame, 
  Book, 
  CheckCircle2, 
  Target, 
  Award, 
  Crown, 
  Clock, 
  Zap, 
  TrendingUp, 
  ChevronRight, 
  Star,
  Settings,
  Mail,
  Calendar,
  GraduationCap,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState<any[]>([]);
  const [nextLesson, setNextLesson] = useState<any>(null);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [levelProgress, setLevelProgress] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0 });
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

        // 3. Fetch Progress (Completed Lessons) - Grouped by level
        const { data: progressStats } = await supabase
          .from('user_progress')
          .select('book_level, content_id')
          .eq('user_id', userId)
          .eq('content_type', 'lesson')
          .eq('status', 'completed');

        const levelCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
        progressStats?.forEach((p: any) => {
          if (p.book_level) levelCounts[p.book_level] = (levelCounts[p.book_level] || 0) + 1;
        });

        const totalCompleted = progressStats?.length || 0;

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
          .order('book_level', { ascending: true })
          .order('lesson_number', { ascending: true });

        const completedIds = new Set(progressStats?.map(p => p.content_id) || []);
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
          { label: 'Ngày học (Streak)', value: streakData?.current_streak || 0, icon: <Flame className="w-5 h-5" />, color: 'text-orange-600 bg-orange-50' },
          { label: 'Từ đã học', value: wordsCount || 0, icon: <Book className="w-5 h-5" />, color: 'text-blue-600 bg-blue-50' },
          { label: 'Bài hoàn thành', value: totalCompleted, icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-green-600 bg-green-50' },
          { label: 'Tổng XP', value: streakData?.total_xp || 0, icon: <Award className="w-5 h-5" />, color: 'text-purple-600 bg-purple-50' },
        ]);
        setLevelProgress(levelCounts);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isLoaded, user]);

  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    if (subscription?.expires_at) {
      const expiry = new Date(subscription.expires_at);
      const now = new Date();
      const diff = expiry.getTime() - now.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      setDaysLeft(days > 0 ? days : 0);
    }
  }, [subscription]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">Đang đồng bộ dữ liệu Hán ngữ...</p>
      </div>
    );
  }

  const isPro = subscription?.plan && 
                subscription.plan !== 'free' && 
                subscription?.status === 'active' && 
                (subscription.expires_at ? new Date(subscription.expires_at) > new Date() : false);

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      {/* Top Profile Banner */}
      <div className="relative h-48 md:h-60 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] overflow-hidden rounded-b-[2rem] md:rounded-b-[3rem]"></div>
        <div className="absolute -bottom-10 md:-bottom-12 left-6 md:left-20 z-10">
          <div className="relative">
            <img 
              src={user?.imageUrl} 
              alt={user?.fullName || 'User'} 
              className="w-28 h-28 md:w-40 md:h-40 rounded-[2rem] md:rounded-[3rem] border-4 md:border-8 border-white shadow-2xl object-cover"
            />
            {isPro && (
              <div className="absolute top-0 -right-1 md:-right-2 bg-yellow-400 text-white p-1.5 md:p-2 rounded-full shadow-lg border-2 md:border-4 border-white">
                <Crown className="w-4 h-4 md:w-5 md:h-5 fill-current" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: User Info & Stats */}
          <div className="lg:col-span-4 space-y-6 md:space-y-8">
            <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 p-6 md:p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-1">{user?.fullName}</h2>
                <div className="flex items-center gap-2 text-gray-400 text-xs md:text-sm font-medium">
                  <Mail className="w-3.5 h-3.5 md:w-4 md:h-4" /> {user?.primaryEmailAddress?.emailAddress}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-50">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px] md:text-[10px]">Thành viên từ</span>
                  <span className="text-gray-700 font-bold">{new Date(user?.createdAt || '').toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px] md:text-[10px]">Loại tài khoản</span>
                  <span className={`px-2 py-0.5 rounded-md font-black text-[9px] md:text-[10px] uppercase ${isPro ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-50 text-gray-500'}`}>
                    {isPro ? 'Premium' : 'Miễn phí'}
                  </span>
                </div>
                {isPro && daysLeft !== null && (
                  <div className="flex items-center justify-between text-xs pt-2">
                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px] md:text-[10px]">Thời gian còn lại</span>
                    <span className={`font-black flex items-center gap-1 ${daysLeft <= 3 ? 'text-red-600 animate-pulse' : 'text-green-600'}`}>
                      <Clock className="w-3 h-3" /> {daysLeft} ngày
                    </span>
                  </div>
                )}
                {!isPro && subscription?.expires_at && (
                  <div className="flex flex-col gap-1 text-[10px] pt-2">
                    <span className="text-red-500 font-bold uppercase tracking-widest italic">Hết hạn vào:</span>
                    <span className="text-gray-400 font-medium">{new Date(subscription.expires_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                )}
              </div>

              <Link href="/nang-cap" className="mt-8 block w-full bg-black text-white py-4 rounded-2xl font-black text-center text-sm shadow-xl shadow-gray-200 hover:scale-[1.02] transition-transform active:scale-95">
                {isPro ? 'Quản lý tài khoản' : '🚀 Nâng cấp Premium'}
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {stats.map((s, i) => (
                <div key={i} className="bg-white p-4 md:p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center md:items-start text-center md:text-left">
                  <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                    {s.icon}
                  </div>
                  <div className="text-lg md:text-xl font-black text-gray-900 leading-none">{s.value}</div>
                  <div className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Leaderboard Card */}
            <div className="bg-[#18181B] text-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Award className="w-16 h-16 md:w-24 md:h-24" />
              </div>
              <h3 className="text-base md:text-lg font-black mb-6 flex items-center gap-2">
                <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" /> Bảng xếp hạng
              </h3>
              <div className="space-y-4">
                {leaderboard.map((u, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-2xl border ${u.name === (user?.firstName || 'Bạn') ? 'bg-white/10 border-white/20' : 'bg-transparent border-transparent'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-gray-500 w-4">#{u.pos}</span>
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-[9px] md:text-[10px] overflow-hidden">
                        {u.avatar ? <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" /> : u.initials}
                      </div>
                      <span className="text-xs md:text-sm font-bold truncate max-w-[80px] md:max-w-none">{u.name}</span>
                    </div>
                    <span className="text-[9px] md:text-[10px] font-black text-red-400">{u.xp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Learning Content */}
          <div className="lg:col-span-8 space-y-6 md:space-y-8">
            
            {/* Suggested Next Step */}
            <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border-2 border-red-50 p-6 md:p-8 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Zap className="w-24 h-24 md:w-32 md:h-32 text-red-600" />
              </div>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider mb-4">
                    <TrendingUp className="w-3 h-3" /> Gợi ý học tiếp theo
                  </div>
                  {nextLesson ? (
                    <>
                      <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2">
                        HSK {nextLesson.book_level} - Bài {nextLesson.lesson_number}
                      </h3>
                      <p className="text-gray-500 text-sm md:text-base font-medium mb-6">Chủ đề: <span className="text-gray-800 font-bold">{nextLesson.title}</span></p>
                      <Link 
                        href={`/giao-trinh/hsk${nextLesson.book_level}/${nextLesson.lesson_number}`}
                        className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-red-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-red-100 hover:bg-red-700 transition-all active:scale-95"
                      >
                        Học ngay bây giờ <ChevronRight className="w-5 h-5" />
                      </Link>
                    </>
                  ) : (
                    <p className="text-gray-500 font-bold italic">Bạn đã hoàn thành tất cả các bài học. Chúc mừng!</p>
                  )}
                </div>
                
                <div className="bg-gray-50 p-6 rounded-[1.5rem] md:rounded-[2rem] text-center w-full md:w-[200px] border border-gray-100">
                  <div className="text-2xl md:text-3xl font-black text-gray-900 mb-1">{reviewsCount}</div>
                  <div className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 leading-none">Từ cần ôn tập</div>
                  <Link 
                    href="/tu-vung-chu-de"
                    className="block w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold text-xs hover:bg-gray-50 transition-colors"
                  >
                    Ôn tập ngay
                  </Link>
                </div>
              </div>
            </div>

            {/* Learning Roadmap / Progress */}
            <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 p-6 md:p-8 shadow-sm">
              <h3 className="text-lg md:text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <Target className="w-5 h-5 md:w-6 md:h-6 text-red-600" /> Lộ trình học tập cá nhân
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {[
                  { level: 1, name: 'HSK 3.0 quyển 1', lessons: 15, color: 'red', desc: 'Nền tảng cơ bản', href: '/giao-trinh/hsk1' },
                  { level: 2, name: 'HSK 3.0 quyển 2', lessons: 15, color: 'blue', desc: 'Giao tiếp thông dụng', href: '/giao-trinh/hsk2' },
                  { level: 3, name: 'HSK 3.0 quyển 3', lessons: 18, color: 'green', desc: 'Thành thạo trung cấp', href: '/giao-trinh/hsk3' },
                ].map((item, idx) => {
                  const completed = levelProgress[item.level] || 0;
                  const percent = Math.min(100, Math.round((completed / item.lessons) * 100));
                  
                  return (
                    <Link key={idx} href={item.href}>
                      <div className="relative group p-6 rounded-3xl bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-gray-100 transition-all cursor-pointer h-full flex flex-col">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center font-black text-lg mb-4 bg-${item.color}-50 text-${item.color}-600`}>
                          {item.level}
                        </div>
                        <h4 className="text-base md:text-lg font-black text-gray-900">{item.name}</h4>
                        <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase mb-6">{item.desc}</p>
                        
                        <div className="space-y-2 mb-4 mt-auto">
                          <div className="flex justify-between text-[9px] md:text-[10px] font-black text-gray-700">
                            <span>{percent}%</span>
                            <span>{completed}/{item.lessons} bài</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-${item.color}-500 transition-all duration-1000`} 
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-red-600 flex items-center gap-1 group-hover:gap-2 transition-all mt-2">
                          Chi tiết lộ trình <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Additional Features / Course Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                  <GraduationCap className="w-6 h-6 text-red-600" /> Thông tin khóa học
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                    <ShieldCheck className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <div className="text-sm font-bold text-gray-900">Chứng chỉ HSK 3.0</div>
                      <p className="text-xs text-gray-500 font-medium">Bạn đang theo học lộ trình HSK 3.0 mới nhất chuẩn 2026.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                    <LayoutDashboard className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <div className="text-sm font-bold text-gray-900">Tài liệu không giới hạn</div>
                      <p className="text-xs text-gray-500 font-medium">Truy cập hơn 1000+ từ vựng và bài tập hội thoại.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-red-100 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity"></div>
                 <h3 className="text-lg font-black mb-4">Bạn cần giúp đỡ?</h3>
                 <p className="text-sm text-white/80 font-medium mb-6">Đội ngũ giáo viên của Tiếng Trung Hongdou luôn sẵn sàng hỗ trợ bạn 24/7.</p>
                 <a 
                   href="https://zalo.me/0932712601" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="block w-full bg-white text-red-600 py-4 rounded-2xl font-black text-center text-sm shadow-xl hover:scale-[1.02] transition-all relative z-20"
                 >
                    Kết nối với Giáo viên (Zalo)
                 </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
