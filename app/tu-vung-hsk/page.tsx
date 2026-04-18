"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  ChevronRight, 
  BookOpen, 
  LayoutGrid, 
  List, 
  Filter, 
  Volume2, 
  Info,
  Lock,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import VocabDetailPopup from '@/components/VocabDetailPopup';
import { useUser } from '@clerk/nextjs';

export default function HSKVocabPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [isPremium, setIsPremium] = useState(false);
  const [activeLevel, setActiveLevel] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [words, setWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWord, setSelectedWord] = useState<any | null>(null);

  // Check subscription
  useEffect(() => {
    async function checkSubscription() {
      if (!isUserLoaded || !user) return;
      const { data } = await supabase
        .from('subscriptions')
        .select('plan, status, expires_at')
        .eq('user_id', user.id)
        .single();
      
      if (data && data.status === 'active') {
        setIsPremium(true);
      }
    }
    checkSubscription();
  }, [isUserLoaded, user]);

  // Load vocabulary
  useEffect(() => {
    async function loadVocab() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('vocabulary')
          .select('*')
          .eq('hsk_level', activeLevel)
          .order('id');

        if (error) throw error;
        setWords(data || []);
      } catch (err) {
        console.error('Error loading vocab:', err);
      } finally {
        setLoading(false);
      }
    }
    loadVocab();
  }, [activeLevel]);

  const filteredWords = words.filter(w => 
    w.hanzi.includes(searchQuery) || 
    w.pinyin.toLowerCase().includes(searchQuery.toLowerCase()) || 
    w.meaning_vi?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canAccess = (lvl: number) => {
    if (lvl === 1) return true;
    return isPremium;
  };

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden">

      {/* Premium Background Mesh */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[200px] -left-[100px] w-[600px] h-[600px] bg-orange-100/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[100px] -right-[100px] w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-[100px]"></div>
      </div>

      <main className="max-w-[1600px] mx-auto px-4 md:px-12 py-12 relative z-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 font-bold">
          <Link href="/" className="hover:text-[#D85A30] transition-colors">Trang chủ</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900">Từ vựng HSK 3.0</span>
        </nav>

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-[#D85A30] rounded-2xl text-xs font-black uppercase tracking-widest mb-4">
               <Sparkles size={14} fill="currentColor" /> HSK 3.0 Curriculum 2026
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter leading-tight">
               Kho từ vựng <span className="text-[#D85A30]">HSK 3.0</span> chuẩn nhất
            </h1>
            <p className="text-gray-500 text-lg font-medium leading-relaxed">
              Hệ thống từ vựng được trích xuất trực tiếp từ bộ giáo trình Tân HSK, 
              đầy đủ phiên âm, định nghĩa và bài tập luyện tập chuyên sâu.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
             <div className="relative w-full sm:w-96 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D85A30] transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Tìm từ vựng, phiên âm..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-white rounded-3xl border border-gray-100 shadow-sm focus:border-orange-200 focus:ring-4 focus:ring-orange-50 transition-all outline-none font-bold text-gray-700"
                />
             </div>
             <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                <button onClick={() => setViewMode('grid')} className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-orange-50 text-[#D85A30]' : 'text-gray-400 hover:text-gray-600'}`}><LayoutGrid size={20} /></button>
                <button onClick={() => setViewMode('list')} className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-orange-50 text-[#D85A30]' : 'text-gray-400 hover:text-gray-600'}`}><List size={20} /></button>
             </div>
          </div>
        </div>

        {/* Level Tabs */}
        <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-4 no-scrollbar">
           {[1, 2, 3, 4, 5, 6].map(lvl => (
             <button 
               key={lvl}
               onClick={() => setActiveLevel(lvl)}
               className={`flex-shrink-0 px-8 py-4 rounded-3xl font-black transition-all border-2 relative overflow-hidden group ${
                 activeLevel === lvl 
                   ? 'bg-gray-900 border-gray-900 text-white shadow-xl shadow-gray-200' 
                   : 'bg-white border-gray-100 text-gray-400 hover:border-orange-200 hover:text-gray-600'
               }`}
             >
                HSK {lvl}
                {!canAccess(lvl) && <Lock size={12} className="absolute top-2 right-2 text-orange-400" />}
                {activeLevel === lvl && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#D85A30]"></div>}
             </button>
           ))}
        </div>

        {/* Content */}
        {!canAccess(activeLevel) ? (
          <div className="bg-white rounded-[48px] p-20 text-center border border-gray-100 shadow-xl max-w-4xl mx-auto">
             <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-[#D85A30] mx-auto mb-8 animate-bounce">
                <Lock size={48} />
             </div>
             <h2 className="text-3xl font-black text-gray-900 mb-4">Nội dung HSK {activeLevel} dành cho Premium</h2>
             <p className="text-gray-500 mb-12 font-medium text-lg leading-relaxed">Để truy cập toàn bộ 692 từ vựng HSK 3.0 và hệ thống bài tập luyện tập, quý khách vui lòng nâng cấp tài khoản.</p>
             <Link href="/nang-cap" className="inline-flex items-center gap-4 bg-gradient-to-r from-orange-400 to-[#FF5E3A] text-white px-12 py-5 rounded-[24px] font-black shadow-2xl hover:scale-105 transition-all">
                NÂNG CẤP PREMIUM NGAY <ArrowRight size={20} />
             </Link>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
             {[1,2,3,4,5,6,7,8,9,10].map(i => (
               <div key={i} className="bg-white h-48 rounded-[32px] border border-gray-50 animate-pulse"></div>
             ))}
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6" 
            : "flex flex-col gap-4"
          }>
            {filteredWords.map((word) => (
              <div 
                key={word.id}
                onClick={() => setSelectedWord(word)}
                className={`bg-white rounded-[32px] border border-gray-100 p-6 cursor-pointer transition-all duration-300 hover:border-orange-200 hover:shadow-2xl group ${
                  viewMode === 'list' ? 'flex items-center justify-between' : ''
                }`}
              >
                 <div className={viewMode === 'list' ? 'flex items-center gap-12 flex-1' : ''}>
                    <div className="flex flex-col">
                       <div className="text-3xl font-black text-gray-900 mb-1 group-hover:text-[#D85A30] transition-colors">{word.hanzi}</div>
                       <div className="text-xs font-black text-gray-400 uppercase tracking-widest">{word.pinyin}</div>
                    </div>
                    
                    <div className={`mt-6 ${viewMode === 'list' ? 'mt-0 flex-1' : ''}`}>
                       <div className="flex items-center gap-2 mb-3">
                          <span className="bg-gray-100 text-gray-500 text-[10px] font-black px-2 py-0.5 rounded-lg uppercase">{word.part_of_speech || 'Từ'}</span>
                          <span className="text-gray-300 text-[10px] font-black">HSK {word.hsk_level}</span>
                       </div>
                       <p className="text-gray-600 font-bold line-clamp-2 leading-snug">{word.meaning_vi}</p>
                    </div>
                 </div>

                 {viewMode === 'list' ? (
                   <div className="flex items-center gap-4">
                      <button 
                        onClick={(e) => { e.stopPropagation(); playAudio(word.hanzi); }}
                        className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-[#D85A30] hover:bg-orange-50 transition-all"
                      >
                         <Volume2 size={20} />
                      </button>
                      <div className="p-3 bg-orange-50 text-[#D85A30] rounded-xl"><ChevronRight size={20} /></div>
                   </div>
                 ) : (
                   <div className="mt-8 pt-4 border-t border-gray-50 flex items-center justify-between">
                      <button 
                        onClick={(e) => { e.stopPropagation(); playAudio(word.hanzi); }}
                        className="text-gray-300 hover:text-[#D85A30] transition-colors"
                      >
                         <Volume2 size={18} />
                      </button>
                      <span className="text-[10px] font-black text-[#D85A30] opacity-0 group-hover:opacity-100 transition-opacity">CHI TIẾT & BÀI TẬP</span>
                   </div>
                 )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredWords.length === 0 && canAccess(activeLevel) && (
          <div className="py-20 text-center">
             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-6"><Info size={32} /></div>
             <p className="text-gray-500 font-bold">Không tìm thấy từ vựng phù hợp với từ khóa "{searchQuery}"</p>
          </div>
        )}
      </main>

      {/* Detail Popup */}
      {selectedWord && (
        <VocabDetailPopup 
          word={selectedWord} 
          onClose={() => setSelectedWord(null)} 
          otherWords={words}
        />
      )}

      {/* Styles for custom scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

const ArrowRight = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
);
