"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  ChevronLeft, BookOpen, MessageCircle, Star, Palette, Headphones, 
  Layers, PenTool, ClipboardCheck, LayoutList, Volume2, Info, CheckCircle2, 
  Zap, Play, ArrowRight, Save
} from 'lucide-react';
import { calculateNextReview } from '@/lib/srs';

// --- Tab Types ---
const TABS = [
  { id: 'vocab', name: 'Từ vựng', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'text', name: 'Bài đọc', icon: <MessageCircle className="w-5 h-5" /> },
  { id: 'grammar', name: 'Ngữ pháp', icon: <Info className="w-5 h-5" /> },
  { id: 'conversation', name: 'Hội thoại', icon: <Layers className="w-5 h-5" /> },
  { id: 'culture', name: 'Văn hóa', icon: <Palette className="w-5 h-5" /> },
  { id: 'listen', name: 'Luyện nghe', icon: <Headphones className="w-5 h-5" /> },
  { id: 'flashcard', name: 'Flashcard', icon: <Zap className="w-5 h-5" /> },
  { id: 'write', name: 'Luyện viết', icon: <PenTool className="w-5 h-5" /> },
  { id: 'quiz', name: 'Quiz', icon: <ClipboardCheck className="w-5 h-5" /> },
  { id: 'summary', name: 'Tổng kết', icon: <LayoutList className="w-5 h-5" /> },
];

export default function LessonDetail() {
  const params = useParams();
  const router = useRouter();
  const level = params?.level?.toString().replace('hsk', '') || '1';
  const lesson = params?.lesson?.toString().replace('bai-', '') || '1';
  const numericLevel = parseInt(level) || 1;
  const numericLesson = parseInt(lesson) || 1;

  const [activeTab, setActiveTab] = useState('vocab');
  const [data, setData] = useState({
    vocabulary: [] as any[],
    texts: [] as any[],
    grammar: [] as any[],
    lessonInfo: null as any
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Theme based on level
  const theme = {
    color: numericLevel === 1 ? 'text-hsk1' : numericLevel === 2 ? 'text-hsk2' : 'text-hsk3',
    bg: numericLevel === 1 ? 'bg-hsk1' : numericLevel === 2 ? 'bg-hsk2' : 'bg-hsk3',
    lightBg: numericLevel === 1 ? 'bg-hsk1-light' : numericLevel === 2 ? 'bg-hsk2-light' : 'bg-hsk3-light',
    border: numericLevel === 1 ? 'border-red-100' : numericLevel === 2 ? 'border-orange-100' : 'border-yellow-100',
    ring: numericLevel === 1 ? 'ring-red-100' : numericLevel === 2 ? 'ring-orange-100' : 'ring-yellow-100',
  };

  useEffect(() => {
    async function fetchAllData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch everything in parallel
        const [vocabRes, textRes, grammarRes, lessonInfoRes] = await Promise.all([
          supabase.from('vocabulary').select('*').eq('book_level', numericLevel).eq('lesson_number', numericLesson).order('word_number'),
          supabase.from('texts').select('*').eq('book_level', numericLevel).eq('lesson_number', numericLesson).order('text_number'),
          supabase.from('grammar_points').select('*').eq('book_level', numericLevel).eq('lesson_number', numericLesson).order('point_number'),
          supabase.from('lessons').select('*').eq('book_level', numericLevel).eq('lesson_number', numericLesson).single()
        ]);

        if (vocabRes.error) throw vocabRes.error;

        setData({
          vocabulary: vocabRes.data || [],
          texts: textRes.data || [],
          grammar: grammarRes.data || [],
          lessonInfo: lessonInfoRes.data
        });
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (numericLevel && numericLesson) fetchAllData();
  }, [numericLevel, numericLesson]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className={`w-14 h-14 border-4 ${theme.color} border-t-transparent rounded-full animate-spin mb-6`}></div>
        <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">Xiaoyu AI đang chuẩn bị bài học...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* --- TOP STICKY HEADER --- */}
      <header className="fixed top-16 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 h-20 flex items-center px-4 md:px-12">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => router.back()} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all active:scale-90">
              <ChevronLeft className="text-gray-400" />
            </button>
            <div className="min-w-0">
               <h1 className="text-xl md:text-2xl font-black text-gray-900 truncate tracking-tighter">
                  Bài {lesson}: {data.lessonInfo?.title_zh || 'Đang tải...'}
               </h1>
               <div className="flex items-center gap-2">
                 <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${theme.lightBg} ${theme.color}`}>HSK {level}</span>
                 <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{data.lessonInfo?.title_vi}</span>
               </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-3">
             <div className="text-right">
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Tiến độ bài học</div>
                <div className="w-32 h-2 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                   <div className={`h-full ${theme.bg} w-1/3 rounded-full`}></div>
                </div>
             </div>
             <div className={`w-12 h-12 rounded-2xl ${theme.lightBg} ${theme.color} flex items-center justify-center font-black`}>
               33%
             </div>
          </div>
        </div>
      </header>

      <div className="pt-36 pb-20 max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* --- MAIN CONTENT AREA --- */}
          <main className="lg:w-3/4">
            
            {/* TABS NAVIGATION (Glassmorphism) */}
            <nav className="flex items-center gap-2 p-1.5 rounded-[2rem] bg-gray-50/80 backdrop-blur-md border border-gray-100 mb-10 overflow-x-auto no-scrollbar scroll-smooth">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 rounded-[1.5rem] text-xs font-black transition-all whitespace-nowrap whitespace-nowrap ${
                      isActive 
                        ? `${theme.bg} text-white shadow-xl shadow-current/20` 
                        : 'text-gray-400 hover:text-gray-600 hover:bg-white'
                    }`}
                  >
                    {tab.icon}
                    {tab.name}
                  </button>
                );
              })}
            </nav>

            {/* TAB CONTENT RENDERER */}
            <div className="relative min-h-[500px]">
              {/* 1. VOCABULARY TAB */}
              {activeTab === 'vocab' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {data.vocabulary.length > 0 ? (
                    data.vocabulary.map((v, i) => (
                      <div key={v.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 hover:border-gray-200 hover:shadow-2xl hover:shadow-gray-100/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-8 group">
                         <div className="flex items-start gap-8">
                            <span className="text-sm font-black text-gray-200 mt-3">{i + 1 < 10 ? `0${i+1}` : i+1}</span>
                            <div>
                               <div className="flex items-baseline gap-4 mb-3">
                                  <h3 className="text-5xl font-black text-gray-900 tracking-tighter group-hover:text-brand transition-colors">{v.hanzi}</h3>
                                  <span className={`text-xl font-bold italic font-serif ${theme.color}`}>{v.pinyin}</span>
                                  {v.part_of_speech && <span className="text-xs bg-gray-100 text-gray-400 px-2 py-1 rounded-lg uppercase font-black">{v.part_of_speech}</span>}
                               </div>
                               <p className="text-2xl text-gray-600 font-bold mb-4">{v.meaning_vi}</p>
                               {v.example_zh && (
                                 <div className="pl-4 border-l-4 border-gray-100 space-y-1">
                                    <p className="text-gray-800 font-medium">{v.example_zh}</p>
                                    <p className="text-gray-400 text-sm italic">{v.example_pinyin}</p>
                                    <p className="text-gray-400 text-sm">{v.example_vi}</p>
                                 </div>
                               )}
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                            <button onClick={() => speak(v.hanzi)} className={`w-16 h-16 rounded-full ${theme.lightBg} ${theme.color} flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-inner`}>
                               <Volume2 size={32} />
                            </button>
                            <button className="w-16 h-16 rounded-full bg-gray-50 text-gray-300 flex items-center justify-center hover:bg-yellow-50 hover:text-yellow-500 transition-all shadow-inner">
                               <Zap size={32} />
                            </button>
                         </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState message="Nội dung từ vựng đang cập nhật" />
                  )}
                </div>
              )}

              {/* 2. TEXT (DIALOGUE/READING) TAB */}
              {activeTab === 'text' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   {data.texts.map((text, idx) => (
                      <div key={text.id} className="bg-gray-50/50 rounded-[4rem] p-10 md:p-16 border border-gray-100">
                         <div className="mb-10 flex items-center justify-between">
                            <div>
                               <h2 className="text-3xl font-black text-gray-900 mb-2">{text.scene_zh || `Đoạn văn ${idx + 1}`}</h2>
                               <p className="text-gray-500 font-bold">{text.scene_vi}</p>
                            </div>
                            <button className={`w-16 h-16 rounded-full ${theme.bg} text-white flex items-center justify-center shadow-2xl`}>
                               <Play fill="white" size={24} />
                            </button>
                         </div>

                         <div className="space-y-10">
                            {Array.isArray(text.content) ? text.content.map((msg: any, mIdx: number) => (
                               <div key={mIdx} className={`flex flex-col ${msg.role === 'B' ? 'items-end' : 'items-start'}`}>
                                  <div className={`max-w-[85%] md:max-w-[70%] text-2xl p-8 rounded-[2.5rem] shadow-sm ${
                                     msg.role === 'B' 
                                      ? `${theme.bg} text-white rounded-tr-none shadow-${theme.color}/20` 
                                      : 'bg-white text-gray-900 rounded-tl-none border border-gray-100'
                                  }`}>
                                     <p className="font-black mb-2">{msg.zh}</p>
                                     <p className={`text-base font-bold italic opacity-70 ${msg.role === 'B' ? 'text-white' : theme.color}`}>{msg.py}</p>
                                     <div className={`h-px w-full my-4 ${msg.role === 'B' ? 'bg-white/20' : 'bg-gray-100'}`}></div>
                                     <p className={`text-base font-medium ${msg.role === 'B' ? 'text-white/80' : 'text-gray-500'}`}>{msg.vi}</p>
                                  </div>
                               </div>
                            )) : <p className="text-center text-gray-400 italic">Nội dung hội thoại chưa sẵn sàng</p>}
                         </div>
                      </div>
                   ))}
                   {data.texts.length === 0 && <EmptyState message="Hãy quay lại sau, bài đọc đang được chuẩn bị." />}
                </div>
              )}

              {/* 3. GRAMMAR TAB */}
              {activeTab === 'grammar' && (
                 <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {data.grammar.map((g, gi) => (
                       <div key={g.id} className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm">
                          <div className={`px-10 py-8 ${theme.lightBg} flex items-center justify-between`}>
                             <div className="flex items-center gap-4">
                                <span className={`w-10 h-10 rounded-full ${theme.bg} text-white flex items-center justify-center font-black`}>{gi+1}</span>
                                <h3 className={`text-2xl font-black ${theme.color}`}>{g.title_zh}</h3>
                             </div>
                             <CheckCircle2 className="text-green-500" />
                          </div>
                          <div className="p-10">
                             <p className="text-xl font-bold text-gray-800 mb-8 leading-relaxed">{g.explanation_vi}</p>
                             
                             {g.formula && (
                                <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 mb-8 flex items-center gap-4 relative overflow-hidden group">
                                   <div className={`absolute left-0 top-0 bottom-0 w-2 ${theme.bg}`}></div>
                                   <Zap size={24} className={theme.color} />
                                   <div>
                                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Cấu trúc / Công thức</div>
                                      <div className="text-2xl font-black text-gray-900 tracking-tighter">{g.formula}</div>
                                   </div>
                                </div>
                             )}

                             <div className="space-y-6">
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ví dụ minh họa</div>
                                {Array.isArray(g.examples) && g.examples.map((ex: any, ei: number) => (
                                   <div key={ei} className="p-6 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-gray-100/50">
                                      <p className="text-xl font-black text-gray-800 mb-1">{ex.zh}</p>
                                      <p className={`text-sm font-bold italic mb-2 ${theme.color}`}>{ex.py}</p>
                                      <p className="text-sm font-medium text-gray-500">{ex.vi}</p>
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    ))}
                    {data.grammar.length === 0 && <EmptyState message="Bài này không có điểm ngữ pháp mới." />}
                 </div>
              )}

              {/* OTHER TABS (Placeholder) */}
              {['conversation', 'culture', 'listen', 'flashcard', 'write', 'quiz', 'summary'].includes(activeTab) && (
                <div className="bg-white rounded-[3rem] border border-gray-100 p-24 text-center">
                    <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-8 text-gray-300">
                       {TABS.find(t => t.id === activeTab)?.icon}
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 mb-4">Tính năng {TABS.find(t => t.id === activeTab)?.name}</h3>
                    <p className="text-gray-400 max-w-xs mx-auto text-lg mb-10">Bạn đã sẵn sàng rèn luyện kỹ năng {TABS.find(t => t.id === activeTab)?.name} cùng Xiaoyu AI chưa?</p>
                    <button className={`${theme.bg} text-white px-12 py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-2xl`}>
                       BẮT ĐẦU NGAY 🚀
                    </button>
                </div>
              )}
            </div>

          </main>

          {/* --- SIDEBAR / LESSON MAP --- */}
          <aside className="lg:w-1/4">
             <div className="sticky top-44 space-y-6">
                <div className="bg-gray-900 rounded-[3rem] p-8 text-white shadow-2xl overflow-hidden relative group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-brand/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                   <div className="relative z-10">
                      <h4 className="text-xs font-black uppercase tracking-widest text-brand mb-4">Xiaoyu AI Coach</h4>
                      <p className="text-sm text-gray-400 leading-relaxed font-medium">
                        "Chào bạn! Hãy học hết phần Từ vựng và Ngữ pháp để mở khóa bài hội thoại nhé. Cố lên!"
                      </p>
                      <button className="mt-6 flex items-center gap-2 text-xs font-black hover:text-brand transition-colors">
                         XEM GỢI Ý <ArrowRight size={14} />
                      </button>
                   </div>
                </div>

                <div className="bg-white rounded-[3rem] border border-gray-100 p-8 shadow-sm">
                   <h4 className="font-black text-gray-900 mb-8 uppercase tracking-tighter text-lg">Mục lục khóa học</h4>
                   <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {Array.from({ length: 47 }, (_, i) => {
                         const num = i + 1;
                         const isCurrent = num === numericLesson;
                         return (numericLevel === 1 || num <= 15) ? (
                            <Link 
                               key={num} 
                               href={`/giao-trinh/hsk${level}/bai-${num}`}
                               className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                                  isCurrent 
                                   ? `${theme.border} ${theme.lightBg} ${theme.color} ring-2 ${theme.ring}` 
                                   : 'border-transparent bg-gray-50 text-gray-400 hover:bg-white hover:border-gray-100'
                               }`}
                            >
                               <span className="text-xs font-black">Bài {num < 10 ? `0${num}` : num}</span>
                               {isCurrent && <div className={`w-2 h-2 rounded-full ${theme.bg} animate-pulse`}></div>}
                            </Link>
                         ) : null;
                      })}
                   </div>
                </div>
             </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-[3rem] border-2 border-dashed border-gray-100 p-24 text-center">
       <div className="text-5xl mb-6">🏝️</div>
       <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">{message}</p>
    </div>
  );
}
