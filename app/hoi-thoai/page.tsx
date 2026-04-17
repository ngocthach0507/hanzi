"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Search, MessageSquare, Users, PlayCircle, Lock, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';

// Helper for topics based on lesson titles (mental map)
const getTopic = (lesson: number) => {
  if (lesson <= 3) return 'greeting';
  if (lesson <= 6) return 'family';
  if (lesson <= 9) return 'daily';
  return 'shopping';
};

export default function ConversationList() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [activeLevel, setActiveLevel] = useState(1);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);

  React.useEffect(() => {
    async function fetchConvs() {
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
            (subData.expires_at ? new Date(subData.expires_at) > new Date() : true)) {
          setIsPro(true);
        }
      }

      const { data, error } = await supabase
        .from('texts')
        .select('*')
        .eq('book_level', activeLevel)
        .eq('type', 'dialogue')
        .order('lesson_number', { ascending: true })
        .order('text_number', { ascending: true });

      if (!error && data) {
        setConversations(data.map(d => {
          // Parse lines to check how many roles
          let rolesCount = 2;
          try {
            const lines = JSON.parse(d.content);
            const roles = new Set(lines.map((l: any) => l.speaker));
            rolesCount = roles.size;
          } catch(e) {}

          return {
            id: d.id,
            level: d.book_level,
            lesson: d.lesson_number,
            text_no: d.text_number,
            title: `Bài ${d.lesson_number}.${d.text_number}: ${d.scene_vi || d.scene_zh || 'Hội thoại'}`,
            zh: d.scene_zh,
            vi: d.scene_vi,
            topic: getTopic(d.lesson_number),
            difficulty: d.book_level <= 2 ? 'Dễ' : 'Trung bình',
            isFree: d.lesson_number <= 2, // Chỉ cho dùng thử 2 bài đầu
            rolesCount
          };
        }));
      }
      setLoading(false);
    }
    fetchConvs();
  }, [activeLevel, isUserLoaded, user]);

  const filteredConvs = conversations;

  return (
    <div className="py-12 px-4 md:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-[#D85A30]">Trang chủ</Link>
            <ChevronRight size={14} />
            <span className="text-gray-600 font-medium">Hội thoại thực thực tế</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-xl">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Hội thoại Tiếng Trung</h1>
              <p className="text-gray-500">
                Luyện kỹ năng nghe và phản xạ qua các tình huống giao tiếp đời thực. 
                Sử dụng AI để đối thoại trực tiếp và cải thiện phát âm.
              </p>
            </div>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm chủ đề hội thoại..." 
                className="pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-orange-200 outline-none w-full md:w-64 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Level Selector */}
        <div className="flex gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
          {[1, 2, 3, 4, 5, 6].map((l) => (
            <button 
              key={l}
              onClick={() => setActiveLevel(l)}
              className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeLevel === l 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'bg-white text-gray-500 border border-gray-100 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              HSK {l}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConvs.map((conv) => (
            <div 
              key={conv.id}
              className={`bg-white rounded-[32px] border border-gray-100 p-8 card-hover relative flex flex-col ${!conv.isFree ? 'opacity-90' : ''}`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-orange-50 text-[#D85A30] rounded-2xl">
                  <MessageSquare size={24} />
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${conv.difficulty === 'Dễ' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {conv.difficulty}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">{conv.topic}</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#D85A30] transition-colors">{conv.title}</h3>
              <p className="text-gray-400 text-sm font-medium mb-8 italic">{conv.zh}</p>

              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                  <Users size={14} className="text-blue-500" /> {conv.rolesCount || 2} vai diễn
                </div>
                
                {(conv.isFree || isPro) ? (
                  <Link 
                    href={`/hoi-thoai/hsk${conv.level}/${conv.id}`}
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#D85A30] transition-colors"
                  >
                    Học ngay <PlayCircle size={16} />
                  </Link>
                ) : (
                  <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                    <Lock size={16} /> 🔒 PREMIUM
                  </div>
                )}
              </div>

              {conv.status === 'completed' && (
                <div className="absolute top-4 right-4 text-green-500">
                  <CheckCircle2 size={24} fill="currentColor" className="text-green-50" />
                </div>
              )}
            </div>
          ))}
          
          {/* Empty state placeholder if no conversations */}
          {filteredConvs.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-[32px] border border-dashed border-gray-200">
              <div className="text-gray-300 mb-4"><MessageSquare size={64} className="mx-auto opacity-20" /></div>
              <h3 className="text-xl font-bold text-gray-400">Đang cập nhật nội dung...</h3>
              <p className="text-gray-300">Chúng tôi đang biên soạn các đoạn hội thoại cho cấp độ này.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
