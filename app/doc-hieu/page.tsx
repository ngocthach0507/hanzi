"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  ChevronRight, 
  Clock, 
  BarChart3,
  BookOpen,
  Loader2,
  Tag,
  Lock
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';

interface ReadingCard {
  id: string;
  level: number;
  title_zh: string;
  title_vi: string;
  topic: string;
  grammar_focus: string[];
}

const TOPIC_COLOR: Record<string, string> = {
  'Giao tiếp': 'bg-blue-50 text-blue-600',
  'Gia đình': 'bg-pink-50 text-pink-600',
  'Đời sống': 'bg-green-50 text-green-600',
  'Mua sắm': 'bg-purple-50 text-purple-600',
  'Thời gian': 'bg-indigo-50 text-indigo-600',
  'Du lịch': 'bg-sky-50 text-sky-600',
  'Ẩm thực': 'bg-orange-50 text-orange-600',
  'Sức khỏe': 'bg-red-50 text-red-600',
  'Thời tiết': 'bg-cyan-50 text-cyan-600',
  'Hoạt động ngoài trời': 'bg-emerald-50 text-emerald-600',
};

export default function ReadingList() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [activeLevel, setActiveLevel] = useState(1);
  const [readings, setReadings] = useState<ReadingCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    async function fetchReadings() {
      if (!isUserLoaded) return;
      setLoading(true);

      // Check Premium status
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

      try {
        const res = await fetch(`/api/readings?level=${activeLevel}`);
        if (res.ok) {
          const data = await res.json();
          setReadings(Array.isArray(data) ? data : []);
        } else {
          setReadings([]);
        }
      } catch {
        setReadings([]);
      }
      setLoading(false);
    }
    fetchReadings();
  }, [activeLevel, isUserLoaded, user]);

  return (
    <div className="py-16 px-4 md:px-12 bg-slate-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
            <Link href="/" className="hover:text-[#FF5E3A] transition-colors">Trang chủ</Link>
            <ChevronRight size={12} strokeWidth={3} />
            <span className="text-slate-600">Luyện kỹ năng đọc</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">
                Kỹ năng <span className="text-[#FF5E3A]">Đọc hiểu</span>
              </h1>
              <p className="text-slate-500 text-lg font-medium leading-relaxed">
                Bài đọc được biên soạn từ nội dung HSK thực tế — kèm bài tập <strong>trắc nghiệm đọc hiểu</strong> và <strong>ngữ pháp điền chỗ trống</strong>.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white px-6 py-3 rounded-2xl text-[11px] font-black text-slate-500 flex items-center gap-2 shadow-sm border border-slate-100 uppercase tracking-widest">
                <BarChart3 size={16} className="text-blue-500" />
                {loading ? '...' : readings.length} BÀI VIẾT
              </div>
            </div>
          </div>
        </div>

        {/* Level Filters */}
        <div className="flex gap-3 mb-16 overflow-x-auto no-scrollbar pb-4">
          {[1, 2, 3, 4, 5, 6].map((l) => (
            <button 
              key={l}
              onClick={() => setActiveLevel(l)}
              className={`px-10 py-4 rounded-2xl text-sm font-black transition-all whitespace-nowrap shadow-sm border-2 ${
                activeLevel === l 
                ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                : 'bg-white text-slate-400 border-white hover:border-orange-200 hover:text-slate-900'
              }`}
            >
              Cấp độ {l}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-24">
            <Loader2 size={40} className="animate-spin text-[#D85A30]" />
          </div>
        )}

        {/* Readings Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {readings.map((read, index) => {
              const topicColor = TOPIC_COLOR[read.topic] || 'bg-slate-50 text-slate-600';
              const isFree = index < 2; // Chỉ 2 bài đầu miễn phí
              const canAccess = isFree || isPro;

              const Content = (
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${canAccess ? 'bg-blue-50 text-blue-600 group-hover:bg-[#FF5E3A] group-hover:text-white group-hover:shadow-lg group-hover:shadow-orange-200' : 'bg-slate-100 text-slate-400'}`}>
                      {canAccess ? <FileText size={24} /> : <Lock size={24} />}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl ${canAccess ? topicColor : 'bg-slate-100 text-slate-400'}`}>
                      {read.topic}
                    </span>
                  </div>

                  <h3 className={`text-2xl font-black mb-2 transition-colors leading-tight ${canAccess ? 'text-slate-900 group-hover:text-[#FF5E3A]' : 'text-slate-400'}`}>
                    {read.title_zh}
                  </h3>
                  <p className="text-slate-400 font-black text-[11px] uppercase tracking-widest mb-6">{read.title_vi}</p>

                  {/* Grammar focus tags */}
                  {read.grammar_focus?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {read.grammar_focus.slice(0, 2).map((g, i) => (
                        <span key={i} className={`text-[10px] font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 border uppercase tracking-wider ${canAccess ? 'text-[#FF5E3A] bg-orange-50 border-orange-100' : 'text-slate-400 bg-slate-50 border-slate-100'}`}>
                          <Tag size={10} strokeWidth={3} /> {g}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto">
                    {/* Exercise types */}
                    <div className="flex gap-2 mb-6">
                      <div className={`flex items-center gap-2 text-[9px] font-black px-3 py-2 rounded-xl uppercase tracking-widest ${canAccess ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                        ✅ Trắc nghiệm
                      </div>
                      <div className={`flex items-center gap-2 text-[9px] font-black px-3 py-2 rounded-xl uppercase tracking-widest ${canAccess ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'}`}>
                        💡 Ngữ pháp
                      </div>
                    </div>
                    <div className={`flex items-center justify-between pt-6 border-t font-black text-sm uppercase tracking-widest ${canAccess ? 'text-[#FF5E3A] border-slate-100' : 'text-slate-400 border-slate-100'}`}>
                      {canAccess ? 'Đọc ngay' : '🔒 Nâng cấp PREMIUM'}
                      <ChevronRight size={18} strokeWidth={3} className={`transition-transform ${canAccess ? 'translate-x-0 group-hover:translate-x-2' : ''}`} />
                    </div>
                  </div>
                </div>
              );

              return canAccess ? (
                <Link 
                  key={read.id}
                  href={`/doc-hieu/hsk${read.level}/${read.id}`}
                  className="group bg-white rounded-[2.5rem] border border-white p-8 hover:shadow-2xl hover:shadow-orange-100/30 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full shadow-sm"
                >
                  {Content}
                </Link>
              ) : (
                <div 
                  key={read.id}
                  className="bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 p-8 flex flex-col h-full opacity-60 grayscale relative overflow-hidden group cursor-pointer"
                >
                  <Link href="/nang-cap" className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/40 backdrop-blur-[4px]">
                    <span className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-2xl text-xs uppercase tracking-widest">HỌC PREMIUM NGAY</span>
                  </Link>
                  {Content}
                </div>
              );
            })}

            {readings.length === 0 && (
              <div className="col-span-full py-24 text-center border-2 border-dashed border-gray-100 rounded-[40px] bg-gray-50/50">
                <BookOpen size={64} className="mx-auto text-gray-200 mb-6" />
                <h3 className="text-xl font-bold text-gray-400">Nội dung đang được biên soạn</h3>
                <p className="text-gray-400 text-sm mt-2">Vui lòng quay lại sau để trải nghiệm bài viết HSK {activeLevel}!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
