"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ChevronLeft, 
  Volume2, 
  Settings, 
  BookOpen, 
  PlayCircle,
  Smartphone,
  CheckCircle2,
  Users,
  MessageCircle,
  Languages,
  RotateCw,
  Loader2
} from 'lucide-react';

import { supabase } from '@/lib/supabase';

export default function ConversationDetail() {
  const params = useParams();
  const id = params.id?.toString();
  const level = params.level?.toString() || 'hsk1';

  const [showTranslation, setShowTranslation] = useState(true);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [conversation, setConversation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function fetchDetail() {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('texts')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        try {
          const lines = JSON.parse(data.content);
          const roles = Array.from(new Set(lines.map((l: any) => l.speaker))) as string[];
          
          setConversation({
            title: `Bài ${data.lesson_number}.${data.text_number}`,
            zh_title: data.scene_zh,
            vi_title: data.scene_vi,
            content: lines.map((l: any, idx: number) => ({
              role: l.speaker,
              name: l.speaker,
              zh: l.zh,
              pinyin: l.pinyin || l.py,
              vi: l.vi || l.en // Use Vietnamese translation from script
            })),
            roles: roles,
            vocabulary: [] // Can be expanded later if we have vocab mapping
          });
        } catch (e) {
          console.error("Error parsing content:", e);
        }
      }
      setLoading(false);
    }
    fetchDetail();
  }, [id]);

  const playSound = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 size={48} className="animate-spin text-[#D85A30]" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 font-bold">Không tìm thấy nội dung hội thoại.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FB] min-h-screen">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-100 py-4 px-4 md:px-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/hoi-thoai" className="text-gray-400 hover:text-orange-600 transition-colors">
              <ChevronLeft size={24} />
            </Link>
            <div>
              <h1 className="text-lg font-black text-gray-900 leading-tight">{conversation.title}</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{conversation.zh_title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowTranslation(!showTranslation)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${showTranslation ? 'bg-orange-600 text-white shadow-lg' : 'bg-gray-100 text-gray-500'}`}
            >
              <Languages size={16} /> {showTranslation ? 'Ẩn dịch' : 'Hiện dịch'}
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Chat Area (2/3) */}
          <div className="lg:w-2/3 flex flex-col gap-6">
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-6 md:p-10 min-h-[600px] flex flex-col">
              <div className="space-y-8 flex-1">
                {conversation.content.map((line, idx) => {
                  const isA = line.role === 'A';
                  return (
                    <div 
                      key={idx} 
                      className={`flex items-start gap-4 ${isA ? 'flex-row' : 'flex-row-reverse'}`}
                    >
                      <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-black text-[10px] ${idx % 2 === 0 ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                        {line.name.substring(0, 2)}
                      </div>
                      <div className={`flex flex-col max-w-[80%] ${isA ? 'items-start' : 'items-end'}`}>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 px-1">
                          {line.name}
                        </div>
                        <div 
                          className={`p-6 rounded-[30px] shadow-sm relative group cursor-pointer active:scale-[0.98] transition-all ${
                            isA 
                            ? 'bg-blue-50 border border-blue-100 rounded-tl-none text-gray-900' 
                            : 'bg-white border border-gray-100 rounded-tr-none text-gray-900 text-right'
                          }`}
                        >
                          <div className="text-2xl font-black mb-1">{line.zh}</div>
                          <div className="text-xs font-bold text-gray-400 mb-3">{line.pinyin}</div>
                          {showTranslation && (
                            <div className="text-sm text-gray-500 italic border-t border-gray-200/50 pt-3 mt-3">
                              {line.vi}
                            </div>
                          )}
                          <button 
                            onClick={() => playSound(line.zh)}
                            className="absolute -right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-orange-500 transition-opacity hover:scale-110 active:scale-95"
                          >
                            <Volume2 size={24} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Interaction Footer for Roleplay */}
              <div className="mt-12 pt-8 border-t border-gray-50 flex flex-col items-center">
                <div className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Chế độ luyện phản xạ</div>
                <div className="flex flex-wrap justify-center gap-4">
                  {conversation.roles.map((role: string, index: number) => (
                    <button 
                      key={role}
                      onClick={() => setActiveRole(role)}
                      className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all ${activeRole === role ? 'bg-[#D85A30] text-white shadow-xl translate-y-1' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#D85A30]'}`}
                    >
                      <Users size={20} /> Nhập vai {role}
                    </button>
                  ))}
                </div>
                {activeRole && (
                  <div className="mt-6 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <p className="text-sm font-bold text-orange-600">Đã sẵn sàng! Hãy nhấn "Bắt đầu" để hội thoại với {conversation.roles.filter((r:string) => r !== activeRole)[0] || 'AI'}.</p>
                    <button 
                      onClick={() => playSound(conversation.content.find((c:any) => c.role !== activeRole)?.zh || '')}
                      className="mt-4 w-16 h-16 bg-[#D85A30] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95"
                    >
                      <PlayCircle size={32} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Area (1/3) */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 sticky top-28">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <BookOpen size={24} className="text-orange-500" />
                Từ vựng trong bài
              </h3>
              
              <div className="space-y-4">
                {conversation.vocabulary.map((v, i) => (
                  <div key={i} className="group p-5 rounded-3xl border border-gray-50 flex items-center justify-between hover:bg-orange-50 hover:border-orange-100 transition-all cursor-pointer">
                    <div>
                      <div className="text-2xl font-black text-gray-900">{v.zh}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#D85A30]">{v.pinyin}</span>
                        <span className="text-xs text-gray-400 font-medium">{v.vi}</span>
                      </div>
                    </div>
                    <button className="p-2 text-gray-300 group-hover:text-[#D85A30] transition-colors">
                      <Volume2 size={20} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-6 bg-[#1F2937] rounded-3xl text-white">
                <div className="flex items-center gap-2 mb-4">
                  <RotateCw size={18} className="text-orange-400" />
                  <span className="text-xs font-bold uppercase tracking-widest">Gợi ý ôn tập</span>
                </div>
                <p className="text-xs opacity-70 leading-relaxed">
                  Nghe lại hội thoại ít nhất 3 lần để ghi nhớ ngữ điệu. 
                  Sau đó hãy dùng chế độ **Nhập vai** để luyện tập phản xạ cùng Lan nhé!
                </p>
              </div>

              <Link 
                href="/hoi-thoai"
                className="mt-8 w-full py-4 rounded-2xl border-2 border-dashed border-gray-100 text-gray-400 text-sm font-bold flex items-center justify-center gap-2 hover:border-[#D85A30] hover:text-[#D85A30] transition-all"
              >
                Trang mục lục hội thoại
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
