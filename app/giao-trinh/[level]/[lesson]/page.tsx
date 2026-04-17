"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  ChevronLeft, BookOpen, MessageCircle, Star, Palette, Headphones, 
  Layers, PenTool, ClipboardCheck, LayoutList, Volume2, Info, CheckCircle2, 
  Zap, Play, ArrowRight, Save, RefreshCcw
} from 'lucide-react';
import GrammarPractice from '@/components/GrammarPractice';
import ConversationPractice from '@/components/ConversationPractice';
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
  const [practiceOpen, setPracticeOpen] = useState<Record<string, boolean>>({});
  const [data, setData] = useState({
    vocabulary: [] as any[],
    texts: [] as any[],
    grammar: [] as any[],
    lessonInfo: null as any,
    culture: null as any
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In-tab dialogue practice state
  const [practicingDialogue, setPracticingDialogue] = useState<any>(null);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(true);
  
  // New Listening Player state
  const [listeningDialogue, setListeningDialogue] = useState<any>(null);
  const [currentListeningLineIndex, setCurrentListeningLineIndex] = useState(-1);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const lineRefs = React.useRef<(HTMLDivElement | null)[]>([]);

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
        const [vocabRes, textRes, grammarRes, lessonInfoRes, cultureRes] = await Promise.all([
          supabase.from('vocabulary').select('*').eq('book_level', numericLevel).eq('lesson_number', numericLesson).order('word_number'),
          supabase.from('texts').select('*').eq('book_level', numericLevel).eq('lesson_number', numericLesson).order('text_number'),
          supabase.from('grammar_points').select('*').eq('book_level', numericLevel).eq('lesson_number', numericLesson).order('point_number'),
          supabase.from('lessons').select('*').eq('book_level', numericLevel).eq('lesson_number', numericLesson).maybeSingle(),
          supabase.from('culture_notes').select('*').eq('book_level', numericLevel).eq('lesson_number', numericLesson)
        ]);

        if (vocabRes.error) throw vocabRes.error;

        setData({
          vocabulary: vocabRes.data || [],
          texts: (textRes.data || []).map(t => {
            try {
              const parsed = typeof t.content === 'string' ? JSON.parse(t.content) : t.content;
              // Normalize fields (pinyin -> py, speaker -> role)
              const normalizedContent = Array.isArray(parsed) ? parsed.map((m: any, idx: number) => {
                // Determine role: Use 'role' if exists, otherwise map speaker to A/B based on unique speakers
                const speakers = Array.from(new Set(parsed.map((ln: any) => ln.speaker)));
                const role = m.role || (m.speaker === speakers[0] ? 'A' : 'B');
                
                return {
                  ...m,
                  role: role,
                  py: m.pinyin || m.py,
                  vi: m.vi || m.en 
                };
              }) : parsed;
              return { ...t, content: normalizedContent };
            } catch (e) {
              return t;
            }
          }),
          grammar: grammarRes.data || [],
          lessonInfo: lessonInfoRes.data,
          culture: cultureRes.data?.[0] || null
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
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopListeningPlayback = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCurrentListeningLineIndex(-1);
  };

  const startListeningPlayback = (dialogue: any) => {
    if (!dialogue || !Array.isArray(dialogue.content)) return;
    
    stopListeningPlayback();
    setListeningDialogue(dialogue);
    
    let index = 0;
    const playLine = (idx: number) => {
      if (idx >= dialogue.content.length) {
        // Finished the dialogue
        setCurrentListeningLineIndex(-1);
        return;
      }
      
      setCurrentListeningLineIndex(idx);
      const line = dialogue.content[idx];
      const utterance = new SpeechSynthesisUtterance(line.zh);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      
      utterance.onend = () => {
        playLine(idx + 1);
      };

      utterance.onerror = (event) => {
        console.error('SpeechSynthesis error:', event);
        setCurrentListeningLineIndex(-1);
      };
      
      window.speechSynthesis.speak(utterance);
    };
    
    playLine(0);
  };

  // Auto-scroll effect for listening player
  useEffect(() => {
    if (currentListeningLineIndex >= 0 && lineRefs.current[currentListeningLineIndex]) {
      lineRefs.current[currentListeningLineIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentListeningLineIndex]);

  // Clean up speech on unmount or tab change
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeTab]);

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
            
            {/* TABS NAVIGATION (As seen in image 5) */}
            <nav className="flex items-center gap-2 p-1.5 rounded-[2rem] bg-gray-50/80 backdrop-blur-md border border-gray-100 mb-10 overflow-x-auto no-scrollbar scroll-smooth">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 rounded-[1.5rem] text-xs font-black transition-all whitespace-nowrap ${
                      isActive 
                        ? `${theme.bg} text-white shadow-xl shadow-current/20` 
                        : 'text-gray-400 hover:text-gray-600 hover:bg-white'
                    }`}
                  >
                    {tab.icon}
                    {tab.name.toUpperCase()}
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

              {/* 2. TEXT (DIALOGUE/READING) TAB - UNIFIED VIEW */}
              {activeTab === 'text' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white rounded-[4rem] p-10 md:p-16 border border-gray-100 shadow-sm relative overflow-hidden">
                    {/* Decorative Background Element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
                    
                    <div className="relative z-10 space-y-16">
                      {data.texts.length > 0 ? data.texts.map((text, idx) => (
                        <div key={text.id} className={`${idx !== 0 ? 'pt-16 border-t border-dashed border-gray-100' : ''}`}>
                          <div className="mb-10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className={`w-12 h-12 rounded-2xl ${theme.lightBg} ${theme.color} flex items-center justify-center font-black`}>
                                  {idx + 1}
                               </div>
                               <div>
                                  <h2 className="text-2xl font-black text-gray-900 mb-1">{text.scene_zh}</h2>
                                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{text.scene_vi}</p>
                               </div>
                            </div>
                            <button 
                               onClick={() => {
                                 if (Array.isArray(text.content)) {
                                   const fullText = text.content.map((m: any) => m.zh).join(', ');
                                   speak(fullText);
                                 }
                               }}
                               className={`w-14 h-14 rounded-full ${theme.bg} text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all`}
                            >
                               <Play fill="white" size={20} />
                            </button>
                          </div>

                          <div className="space-y-10">
                            {Array.isArray(text.content) ? text.content.map((msg: any, mIdx: number) => (
                              <div key={mIdx} className={`flex items-start gap-6 group`}>
                                <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${msg.role === 'A' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'}`}>
                                  {msg.role}
                                </div>
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center gap-3">
                                    <p className="text-2xl font-black text-gray-900 tracking-tight leading-relaxed select-all">{msg.zh}</p>
                                    <button onClick={() => speak(msg.zh)} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 rounded-lg transition-all text-gray-400 hover:text-gray-900">
                                      <Volume2 size={16} />
                                    </button>
                                  </div>
                                  <p className={`text-md font-bold italic opacity-60 ${theme.color}`}>{msg.py}</p>
                                  <p className="text-gray-500 text-lg leading-relaxed">{msg.vi || msg.en}</p>
                                </div>
                              </div>
                            )) : null}
                          </div>
                        </div>
                      )) : (
                        <EmptyState message="Nội dung bài học đang được cập nhật..." />
                      )}
                    </div>
                  </div>
                </div>
              )}


              {/* 3. GRAMMAR TAB */}
              {activeTab === 'grammar' && (
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
                    {/* Persistent Tab Header */}
                    <div className="mb-12 border-b-2 border-gray-100 pb-4">
                       <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.3em]">Chi tiết ngữ pháp</h2>
                    </div>

                    <div className="space-y-20">
                       {data.grammar.map((g, gi) => (
                          <div key={g.id} className="relative">
                             {/* Point Header Section */}
                             <div className="mb-8">
                                <div className="flex items-center gap-4 mb-4">
                                   <span className={`flex-shrink-0 w-8 h-8 rounded-lg ${theme.bg} text-white flex items-center justify-center text-xs font-black shadow-lg shadow-current/20`}>
                                      {gi + 1}
                                   </span>
                                   <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                                      {g.title_zh}
                                   </h3>
                                </div>
                                <p className="text-lg font-medium text-gray-600 leading-relaxed pl-12">
                                   {g.explanation_vi}
                                </p>
                             </div>
                             
                             {/* Cấu trúc (Formula) Section */}
                             {g.formula && (
                                <div className="pl-12 mb-10">
                                   <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Cấu trúc:</h4>
                                   <div className={`bg-gray-50/50 p-6 md:p-8 rounded-[1.5rem] border border-transparent border-l-[6px] ${numericLevel === 1 ? 'border-l-red-500' : numericLevel === 2 ? 'border-l-orange-500' : 'border-l-yellow-500'} relative group`}>
                                      <div className="text-xl md:text-2xl font-black text-gray-800 tracking-tighter leading-tight italic">
                                         - {g.formula}
                                      </div>
                                   </div>
                                </div>
                             )}

                             {/* Ví dụ (Examples) Section */}
                             <div className="pl-12">
                                <div className="flex items-center justify-between mb-6">
                                   <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Ví dụ:</h4>
                                   {/* Grammar Legend */}
                                   <div className="flex gap-4 text-[10px] font-bold uppercase tracking-tighter">
                                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span><span className="text-blue-600">Chủ ngữ</span></div>
                                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span><span className="text-rose-600">Vị ngữ</span></div>
                                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="text-emerald-600">Tân ngữ</span></div>
                                   </div>
                                </div>
                                
                                <div className="space-y-10">
                                   {Array.isArray(g.examples) && g.examples.map((ex: any, ei: number) => (
                                      <div key={ei} className="flex gap-4 group">
                                         <button 
                                            onClick={() => speak(ex.zh)}
                                            className={`flex-shrink-0 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-white hover:shadow-md hover:text-gray-900 transition-all border border-transparent hover:border-gray-100 mt-1`}
                                         >
                                            <Volume2 size={18} />
                                         </button>
                                         <div className="flex-1">
                                            {/* Chinese text block */}
                                            <div className="flex flex-wrap items-end gap-x-0.5 gap-y-4 mb-2">
                                               {ex.analysis ? (
                                                  ex.analysis.map((seg: any, si: number) => (
                                                     <div key={si} className="flex flex-col items-center group/seg">
                                                        <span className={`text-2xl font-black tracking-tight leading-none ${
                                                           seg.role === 'S' ? 'text-blue-600' : 
                                                           seg.role === 'V' ? 'text-rose-600' : 
                                                           seg.role === 'O' ? 'text-emerald-600' : 
                                                           seg.role === 'P' ? 'text-purple-600' : 
                                                           'text-gray-900'
                                                        }`}>
                                                           {seg.text}
                                                        </span>
                                                        <span className={`text-[8px] font-black uppercase opacity-0 group-hover/seg:opacity-100 transition-opacity mt-1 ${
                                                           seg.role === 'S' ? 'text-blue-400' : 
                                                           seg.role === 'V' ? 'text-rose-400' : 
                                                           seg.role === 'O' ? 'text-emerald-400' : 
                                                           seg.role === 'P' ? 'text-purple-400' : 
                                                           'text-transparent'
                                                        }`}>
                                                           {seg.label || ''}
                                                        </span>
                                                     </div>
                                                  ))
                                               ) : (
                                                  <span className="text-2xl font-black text-gray-900 tracking-tight leading-none">
                                                     {ex.zh}
                                                  </span>
                                               )}
                                            </div>

                                            {ex.py && (
                                               <div className={`text-md font-bold italic mb-1 ${theme.color} opacity-60`}>
                                                  {ex.py}
                                               </div>
                                            )}
                                            <div className="text-gray-500 font-medium text-lg leading-relaxed">
                                               {ex.vi}
                                            </div>
                                         </div>
                                      </div>
                                   ))}
                                </div>
                             </div>

                              {/* Exercise Section (Integrated with new style) */}
                              <div className="mt-14 pl-12">
                                 <button
                                    onClick={() => setPracticeOpen({ ...practiceOpen, [g.id]: !practiceOpen[g.id] })}
                                    className={`w-full py-4 rounded-2xl border-2 font-black transition-all flex items-center justify-center gap-2 group ${
                                       practiceOpen[g.id] 
                                       ? 'bg-gray-900 border-gray-900 text-white' 
                                       : `bg-white ${theme.border} ${theme.color} hover:shadow-lg active:scale-95`
                                    }`}
                                 >
                                    <RefreshCcw size={18} className={`${practiceOpen[g.id] ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                                    {practiceOpen[g.id] ? 'ĐANG LUYỆN TẬP...' : 'BẮT ĐẦU LUYỆN TẬP (Vận dụng)'}
                                 </button>

                                 {practiceOpen[g.id] && (
                                    <div className="animate-in zoom-in-95 duration-300">
                                       <GrammarPractice 
                                          exercises={g.exercises} 
                                          theme={{
                                             bg: theme.bg,
                                             lightBg: theme.lightBg,
                                             color: theme.color,
                                             border: theme.border
                                          }} 
                                       />
                                    </div>
                                 )}
                              </div>

                              {/* Separator for points */}
                              {gi < data.grammar.length - 1 && (
                                 <div className="my-20 h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
                              )}
                          </div>
                       ))}
                    </div>
                    {data.grammar.length === 0 && <EmptyState message="Bài này không có điểm ngữ pháp mới." />}
                 </div>
              )}

               {/* 4. CONVERSATION TAB - IN-TAB PRACTICE */}
               {activeTab === 'conversation' && (
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {!practicingDialogue ? (
                      <div className="bg-white rounded-[3rem] border border-gray-100 p-8 md:p-12">
                         <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                            <Layers className={theme.color} /> Chọn đoạn hội thoại để luyện tập
                         </h3>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {data.texts.map((text, idx) => (
                               <button 
                                  key={text.id}
                                  onClick={() => {
                                    setPracticingDialogue(text);
                                    setActiveRole(null);
                                  }}
                                  className="group bg-gray-50 p-8 rounded-[2rem] border border-transparent hover:border-brand hover:bg-white transition-all hover:scale-[1.05] hover:shadow-2xl flex flex-col items-center text-center"
                               >
                                  <div className={`w-16 h-16 rounded-2xl ${theme.lightBg} ${theme.color} flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform`}>
                                     <MessageCircle size={32} />
                                  </div>
                                  <h4 className="font-black text-gray-800 mb-2">Đoạn {idx + 1}</h4>
                                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                                    {text.scene_vi || text.scene_en || 'Giao tiếp thông thường'}
                                  </p>
                               </button>
                            ))}
                            {data.texts.length === 0 && <div className="col-span-full py-12 text-center text-gray-400">Đang cập nhật...</div>}
                         </div>
                      </div>
                    ) : (
                      <ConversationPractice 
                        dialogue={practicingDialogue} 
                        theme={theme} 
                        onBack={() => {
                          setPracticingDialogue(null);
                          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                            window.speechSynthesis.cancel();
                          }
                        }} 
                      />
                    )}
                 </div>
               )}

               {/* 5. LISTEN TAB - INTEGRATED PLAYER */}
                {activeTab === 'listen' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                     {!listeningDialogue ? (
                       <div className="bg-white rounded-[3rem] border border-gray-100 p-12 overflow-hidden relative">
                          <div className="absolute top-0 right-0 p-8 opacity-5">
                             <Headphones size={120} />
                          </div>
                          <h3 className="text-2xl font-black text-gray-900 mb-10">Luyện nghe hội thoại bài học</h3>
                          
                          <div className="space-y-6">
                             {data.texts.map((text, idx) => (
                                <div key={text.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl group hover:bg-white border border-transparent hover:border-gray-100 transition-all">
                                   <div className="flex items-center gap-6">
                                      <div className={`w-12 h-12 rounded-xl ${theme.lightBg} ${theme.color} flex items-center justify-center font-black`}>{idx+1}</div>
                                      <div>
                                         <div className="font-black text-gray-800">Nghe đoạn đối thoại {idx + 1}</div>
                                         <div className="text-xs text-gray-400 font-medium italic">{text.scene_zh}</div>
                                      </div>
                                   </div>
                                   <button 
                                      onClick={() => startListeningPlayback(text)}
                                      className={`w-12 h-12 rounded-full ${theme.bg} text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg`}
                                   >
                                      <Play fill="white" size={18} />
                                   </button>
                                </div>
                             ))}
                             
                             <div className="mt-10 pt-8 border-t border-gray-100">
                                <div className="text-xs font-black text-gray-300 uppercase tracking-widest mb-4">Hoặc làm bài tập nghe từ vựng</div>
                                <Link 
                                   href={`/giao-trinh/hsk${level}/bai-${lesson}/luyen-nghe`}
                                   className="flex items-center gap-2 text-[#D85A30] font-black group"
                                >
                                   BẮT ĐẦU QUIZ NGHE <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                </Link>
                             </div>
                          </div>
                       </div>
                     ) : (
                       <div className="bg-white rounded-[3rem] border border-gray-100 p-8 md:p-12 animate-in zoom-in-95 duration-300">
                          {/* Player Header */}
                          <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-50">
                            <button 
                              onClick={() => {
                                stopListeningPlayback();
                                setListeningDialogue(null);
                              }}
                              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#1F2937] text-[10px] font-black transition-all"
                            >
                              <ChevronLeft size={14} className="stroke-[3]" /> DANH SÁCH
                            </button>
                            <div className="text-center">
                               <h3 className="text-xl font-black text-gray-900 line-clamp-1">{listeningDialogue.scene_zh}</h3>
                               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{listeningDialogue.scene_vi}</p>
                            </div>
                            <button 
                              onClick={() => setShowTranslation(!showTranslation)}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${showTranslation ? theme.bg + ' text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}
                            >
                              {showTranslation ? 'Ẩn dịch' : 'Hiện dịch'}
                            </button>
                          </div>

                          {/* Player Content (Scrolling) */}
                          <div 
                            ref={scrollContainerRef}
                            className="space-y-6 max-h-[500px] overflow-y-auto px-4 custom-scrollbar"
                          >
                            {listeningDialogue.content.map((line: any, idx: number) => {
                              const isActive = idx === currentListeningLineIndex;
                              return (
                                <div 
                                  key={idx}
                                  ref={el => { lineRefs.current[idx] = el; }}
                                  className={`p-6 rounded-3xl transition-all duration-300 ${isActive ? `${theme.lightBg} border-2 ${theme.border} scale-[1.02] shadow-xl` : 'bg-white opacity-40 grayscale-0 border-2 border-transparent'}`}
                                >
                                  <div className="flex items-center gap-4 mb-2">
                                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] ${line.role === 'A' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                        {line.role}
                                     </div>
                                     <div className={`text-2xl font-black ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {line.zh}
                                     </div>
                                  </div>
                                  <p className={`text-sm font-bold italic mb-2 ${theme.color} ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                                    {line.py}
                                  </p>
                                  {showTranslation && (
                                    <p className={`text-md font-medium text-gray-500 leading-relaxed ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                                      {line.vi || line.en}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Player Controls */}
                          <div className="mt-8 pt-8 border-t border-gray-100 flex justify-center">
                             <button 
                                onClick={() => startListeningPlayback(listeningDialogue)}
                                className={`flex items-center gap-3 px-10 py-4 rounded-2xl ${theme.bg} text-white font-black shadow-2xl hover:scale-110 active:scale-95 transition-all`}
                             >
                                <Play fill="white" size={24} /> PHÁT LẠI TOÀN BỘ
                             </button>
                          </div>
                       </div>
                     )}
                   </div>
                )}

                {/* 6. CULTURE TAB */}
                {activeTab === 'culture' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {data.culture ? (
                      <div className="bg-white rounded-[4rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700 group">
                         {/* Large Feature Illustration */}
                         <div className="relative h-[25rem] md:h-[40rem] overflow-hidden">
                            <img 
                               src={data.culture.image_path} 
                               alt={data.culture.title_vi}
                               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-12 md:p-20">
                               <div className="flex items-center gap-4 mb-6">
                                  <div className="w-12 h-1 bg-white rounded-full"></div>
                                  <span className="text-white font-black uppercase tracking-[0.3em] text-[10px] opacity-80">Kiến thức văn hóa</span>
                               </div>
                               <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight drop-shadow-2xl">
                                  {data.culture.title_vi}
                               </h2>
                            </div>
                         </div>
                         
                         {/* Content Section */}
                         <div className="p-12 md:p-20 bg-[#fafafa]">
                            <div className="max-w-4xl mx-auto space-y-10">
                               <div className="flex items-start gap-8">
                                  <div className="w-16 h-16 rounded-3xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                                     <Palette className={theme.color} size={32} />
                                  </div>
                                  <div className="space-y-8">
                                     <div className="prose prose-xl prose-gray font-medium leading-relaxed text-gray-600">
                                        {data.culture.content_vi.split('\n\n').map((paragraph: string, pIdx: number) => (
                                          <p key={pIdx} className="mb-6">{paragraph}</p>
                                        ))}
                                     </div>
                                     
                                     <div className={`inline-block p-1 px-4 rounded-full bg-white border ${theme.border} text-[10px] font-black ${theme.color} uppercase tracking-widest`}>
                                        Xiaoyu AI biên soạn
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-[3rem] border border-gray-100 p-20 text-center">
                          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                              <Palette className="text-gray-300" size={40} />
                          </div>
                          <h3 className="text-2xl font-black text-gray-900 mb-4">Tính năng đang phát triển</h3>
                          <p className="text-gray-500 max-w-md mx-auto">Xiaoyu AI đang chuẩn bị nội dung văn hóa đặc sắc cho bài học này. Bạn vui lòng quay lại sau nhé!</p>
                      </div>
                    )}
                  </div>
                )}

                {/* OTHER TABS (Placeholder) */}
                {['flashcard', 'write', 'quiz', 'summary'].includes(activeTab) && (
                 <div className="bg-white rounded-[3rem] border border-gray-100 p-24 text-center">
                    <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-8 text-gray-300">
                       {TABS.find(t => t.id === activeTab)?.icon}
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 mb-4">Tính năng {TABS.find(t => t.id === activeTab)?.name}</h3>
                    <p className="text-gray-400 max-w-xs mx-auto text-lg mb-10">Bạn đã sẵn sàng rèn luyện kỹ năng {TABS.find(t => t.id === activeTab)?.name} cùng Xiaoyu AI chưa?</p>
                    <button 
                       onClick={() => {
                         const routeMap: Record<string, string> = {
                           'listen': 'luyen-nghe',
                           'flashcard': 'flashcard',
                           'quiz': 'chon-nghia',
                           'write': 'nhap-tu',
                           'summary': 'tong-hop'
                         };
                         const subroute = routeMap[activeTab];
                         if (subroute) {
                           router.push(`/giao-trinh/hsk${level}/bai-${lesson}/${subroute}`);
                         }
                       }}
                       className={`${theme.bg} text-white px-12 py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-110 active:scale-95 transition-all`}
                    >
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
                         const maxLessons = numericLevel === 3 ? 18 : 15;
                         return (num <= maxLessons) ? (
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
