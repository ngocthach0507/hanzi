"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  ChevronRight, 
  Clock, 
  Trophy, 
  History, 
  PlayCircle,
  BarChart3,
  ShieldCheck,
  Zap,
  GraduationCap,
  Lock
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';

const thptExams = [
  { id: 1, name: 'Đề thi THPT Quốc gia 2023', year: '2023', questions: 50, time: '60 phút', difficulty: 'Vừa', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', isFree: true },
  { id: 2, name: 'Đề minh họa Bộ GD&ĐT 2024', year: '2024', questions: 50, time: '60 phút', difficulty: 'Khó', color: 'bg-purple-50 text-purple-600 border-purple-100' },
  { id: 3, name: 'Đề khảo sát chuyên Thái Bình', year: '2024', questions: 50, time: '60 phút', difficulty: 'Cực khó', color: 'bg-rose-50 text-rose-600 border-rose-100' },
  { id: 4, name: 'Đề thi các năm (Tổng hợp)', year: '2020-2022', questions: 50, time: '60 phút', difficulty: 'Vừa', color: 'bg-blue-50 text-blue-600 border-blue-100' },
];

export default function LuyenDeTHPTPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
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
    }
    checkSubscription();
  }, [isUserLoaded, user]);

  return (
    <div className="py-12 px-4 md:px-8 bg-[#F9FAFB] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-[#D85A30]">Trang chủ</Link>
            <ChevronRight size={14} />
            <span className="text-gray-600 font-medium font-bold">Luyện thi tốt nghiệp THPT</span>
          </nav>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight flex items-center gap-4">
                 <GraduationCap size={48} className="text-blue-600" />
                 Luyện thi THPT Quốc Gia
              </h1>
              <p className="text-gray-500 font-medium">
                Ngân hàng đề thi thử THPT Quốc gia môn Tiếng Trung phong phú nhất. 
                Giúp các sĩ tử làm quen với cấu trúc đề, rèn luyện kỹ năng và tự tin đạt điểm 9, 10.
              </p>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 text-center shadow-lg shadow-gray-200/50">
                 <div className="text-3xl font-black text-blue-600">50+</div>
                 <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Đề thi mới</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
           {[
              { icon: <Zap />, title: 'Giải đề cực tốc', desc: 'Hệ thống thi online mượt mà' },
              { icon: <ShieldCheck />, title: 'Chuẩn cấu trúc', desc: 'Bám sát ma trận của Bộ' },
              { icon: <BarChart3 />, title: 'Phân tích điểm', desc: 'Biết ngay hạng của bạn' },
              { icon: <History />, title: 'Lời giải chi tiết', desc: 'Giải thích cặn kẽ từng câu' },
           ].map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col items-center text-center group cursor-default">
                 <div className="p-4 bg-gray-50 text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all rounded-2xl mb-4 shadow-inner">
                    {f.icon}
                 </div>
                 <h3 className="text-sm font-black text-gray-900 mb-1">{f.title}</h3>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{f.desc}</p>
              </div>
           ))}
        </div>

        <h2 className="text-2xl font-black text-gray-900 mb-8 border-l-4 border-blue-600 pl-4">Đề thi mới nhất 2024</h2>

        {/* Exam Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {thptExams.map((exam) => {
              const canAccess = exam.isFree || isPremium;

              return (
                <div 
                  key={exam.id} 
                  className={`bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8 group relative overflow-hidden transition-all duration-300 ${
                    canAccess ? 'card-hover' : 'opacity-80'
                  }`}
                >
                   {!canAccess && (
                      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href="/nang-cap" className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl flex items-center gap-2">
                          <Lock size={16} /> MỞ KHÓA PREMIUM
                        </Link>
                      </div>
                   )}

                   <div className={`w-32 h-32 rounded-3xl flex flex-col items-center justify-center flex-shrink-0 transition-transform ${exam.color} ${canAccess ? 'group-hover:scale-110' : ''}`}>
                      {canAccess ? <FileText size={40} /> : <Lock size={40} />}
                      <span className="text-[10px] font-black mt-2 uppercase tracking-widest">{exam.year}</span>
                   </div>
                   
                   <div className="flex-1 text-center md:text-left">
                      <h3 className={`text-2xl font-black mb-2 transition-colors leading-tight ${canAccess ? 'text-gray-900 group-hover:text-blue-600' : 'text-gray-400'}`}>
                        {exam.name}
                      </h3>
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                         <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                            <Clock size={16} /> {exam.time}
                         </span>
                         <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                            <FileText size={16} /> {exam.questions} Câu hỏi
                         </span>
                         <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest ${canAccess ? 'text-orange-500 bg-orange-50' : 'text-gray-300 bg-gray-50'}`}>
                            {exam.difficulty}
                         </span>
                      </div>
                      
                      {canAccess ? (
                        <Link 
                          href={`/luyen-thi/hsk1/1`} // Reusing the same exam interface for mock
                          className="inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-black transition-all hover:scale-105 active:scale-95"
                        >
                           Vào phòng thi <PlayCircle size={20} />
                        </Link>
                      ) : (
                        <div className="inline-flex items-center gap-3 bg-gray-200 text-gray-400 px-10 py-4 rounded-2xl font-black text-sm cursor-not-allowed">
                           Khóa Premium <Lock size={20} />
                        </div>
                      )}
                   </div>
                </div>
              );
           })}
        </div>
      </div>
    </div>
  );
}
