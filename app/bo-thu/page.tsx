"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Shapes, 
  ChevronRight, 
  Search, 
  Filter, 
  Info,
  Layers,
  Star,
  BookOpen,
  X,
  Volume2
} from 'lucide-react';

import { radicals, Radical } from '../../constants/radicals';

export default function RadicalsList() {
  const [activeStrokes, setActiveStrokes] = useState<number | 'all'>('all');
  const [selectedRadical, setSelectedRadical] = useState<Radical | null>(null);

  const filteredRadicals = useMemo(() => {
    if (!radicals || !Array.isArray(radicals)) return [];
    return activeStrokes === 'all' 
      ? radicals 
      : radicals.filter(r => r && r.strokes === activeStrokes);
  }, [activeStrokes]);

  const strokeCounts = useMemo(() => {
    if (!radicals || !Array.isArray(radicals)) return [];
    return Array.from(new Set(radicals.map(r => r?.strokes).filter(Boolean))).sort((a, b) => (a as number) - (b as number));
  }, []);

  if (!radicals || radicals.length === 0) {
    return <div className="p-20 text-center">Đang tải dữ liệu bộ thủ...</div>;
  }

  return (
    <div className="py-12 px-4 md:px-8 bg-[#F9FAFB] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
            <ChevronRight size={14} />
            <span className="text-gray-600 font-medium">214 Bộ thủ Hán ngữ</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Thư viện Bộ thủ</h1>
              <p className="text-gray-500">
                Tìm hiểu 214 bộ thủ cơ bản trong tiếng Trung. Mỗi bộ thủ được minh họa bằng một từ có nghĩa, kèm pinyin và ví dụ câu để bạn học chính xác hơn.
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
               <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Shapes size={24} /></div>
               <div>
                  <div className="text-lg font-black text-gray-900">214</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bộ thủ chuẩn</div>
               </div>
            </div>
          </div>
        </div>

        {/* Stoke Filter */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-gray-100">
          <button 
            onClick={() => setActiveStrokes('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeStrokes === 'all' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white text-gray-400 hover:text-gray-900'}`}
          >
            Tất cả
          </button>
          {strokeCounts.map((s) => (
            <button 
              key={String(s)}
              onClick={() => setActiveStrokes(s as number)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeStrokes === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white text-gray-400 border border-transparent hover:border-blue-100 hover:text-blue-600'}`}
            >
              {s} Nét
            </button>
          ))}
        </div>

        {/* Radicals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredRadicals.map((r) => (
            <div 
              key={r.id} 
              onClick={() => setSelectedRadical(r)}
              className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer flex flex-col items-center relative"
            >
              {/* Title Section */}
              <div className="text-center mb-8">
                <div className="text-3xl font-black text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">Bộ {r.hanViet || '...'}</div>
                <div className="text-base text-gray-400 font-bold italic">({r.meaning || '...'})</div>
              </div>

              {/* Characters Section */}
              <div className="flex gap-4 justify-center mb-10">
                {[r.char, ...(r.variants || [])].filter(Boolean).slice(0, 2).map((v, i) => (
                  <div key={i} className="relative w-28 h-28 border border-gray-200 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden">
                    {/* Grid lines */}
                    <div className="absolute inset-0 pointer-events-none opacity-40">
                      <div className="absolute top-1/2 left-0 w-full border-t border-gray-300 border-dashed -translate-y-1/2"></div>
                      <div className="absolute top-0 left-1/2 h-full border-l border-gray-300 border-dashed -translate-x-1/2"></div>
                    </div>
                    <div className="text-6xl font-black text-gray-900 relative z-10">{v}</div>
                  </div>
                ))}
                {(!r.variants || r.variants.length === 0) && (
                   <div className="w-28 h-28 border border-gray-100 border-dashed rounded-2xl flex items-center justify-center">
                      <div className="text-[10px] text-gray-300 font-bold uppercase tracking-widest text-center px-4">Không có biến thể</div>
                   </div>
                )}
              </div>

              {/* Examples Section */}
              <div className="flex gap-10 justify-center w-full pt-8 border-t border-gray-50">
                {(r.exampleWords || (r.examples || []).slice(0, 2).map(ex => ({char: ex, pinyin: ''}))).map((ex, i) => (
                  <div key={i} className="flex flex-col items-center group/ex">
                    <div className="text-sm font-bold text-gray-400 mb-1 tracking-tighter">{ex.pinyin || '...'}</div>
                    <div className="text-4xl font-medium text-gray-800 group-hover/ex:scale-125 transition-transform">{ex.char}</div>
                  </div>
                ))}
              </div>

              {/* ID Badge */}
              <div className="absolute top-6 right-8 text-[10px] font-black text-gray-200 tracking-widest">
                #{r.id}
              </div>
            </div>
          ))}
        </div>

        {/* Info card */}
        <div className="mt-20 bg-gray-900 text-white rounded-[50px] p-12 flex flex-col md:flex-row items-center gap-12 shadow-2xl">
          <div className="w-28 h-28 bg-blue-600 rounded-[35px] flex items-center justify-center flex-shrink-0 shadow-2xl shadow-blue-900/50">
            <Info size={48} />
          </div>
          <div>
            <h3 className="text-3xl font-black mb-4">
              Tại sao nên học Bộ thủ?
            </h3>
            <p className="text-gray-400 text-lg leading-relaxed max-w-4xl">
              Bộ thủ là "chìa khóa" để giải mã tiếng Trung. Mỗi chữ Hán thường được ghép từ một bộ thủ chỉ nghĩa và một phần chỉ thanh. 
              Hiểu rõ 214 bộ thủ giúp bạn đoán nghĩa từ mới, ghi nhớ mặt chữ lâu hơn và tra từ điển dễ dàng.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
               <button className="bg-blue-600 px-8 py-3 rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-500/20">
                  Tải tài liệu 214 Bộ thủ (PDF)
               </button>
               <button className="bg-white/5 border border-white/10 px-8 py-3 rounded-2xl text-sm font-bold hover:bg-white/10 transition-all">
                  Kiểm tra kiến thức bộ thủ
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Radical Detail Modal */}
      {selectedRadical && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/80 backdrop-blur-md"
          onClick={() => setSelectedRadical(null)}
        >
          <div 
            className="bg-white rounded-[50px] max-w-xl w-full shadow-2xl overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedRadical(null)}
              className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center bg-gray-50 rounded-2xl text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all"
            >
              <X size={24} />
            </button>

            <div className="p-12">
              <div className="flex flex-col items-center text-center">
                <div className="text-xs font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-xl uppercase tracking-[0.2em] mb-6">
                  Bộ thủ thứ {selectedRadical.id} • {selectedRadical.strokes} nét
                </div>

                <div className="text-5xl font-black text-gray-900 mb-2">Bộ {selectedRadical.hanViet || '...'}</div>
                <div className="text-xl text-gray-400 font-bold mb-10">({selectedRadical.meaning || '...'})</div>

                <div className="flex gap-6 justify-center mb-12">
                  {[selectedRadical.char, ...(selectedRadical.variants || [])].filter(Boolean).map((v, i) => (
                    <div key={i} className="relative w-36 h-36 border border-gray-200 rounded-[30px] bg-gray-50 flex items-center justify-center shadow-inner">
                      <div className="absolute inset-0 pointer-events-none opacity-40">
                        <div className="absolute top-1/2 left-0 w-full border-t border-gray-300 border-dashed -translate-y-1/2"></div>
                        <div className="absolute top-0 left-1/2 h-full border-l border-gray-300 border-dashed -translate-x-1/2"></div>
                      </div>
                      <div className="text-7xl font-black text-gray-900 relative z-10">{v}</div>
                    </div>
                  ))}
                </div>

                <div className="w-full bg-gray-50 rounded-[40px] p-8 border border-gray-100 text-left">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="p-2 bg-blue-600 text-white rounded-lg"><BookOpen size={18}/></div>
                     <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Ví dụ minh họa</span>
                  </div>

                  {/* Hiển thị các ô ví dụ (ưu tiên exampleWords, fallback về examples) */}
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    {(selectedRadical.exampleWords || (selectedRadical.examples || []).slice(0, 2).map(ex => ({char: ex, pinyin: ''}))).map((ex, i) => (
                      <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center group/modal-ex hover:border-blue-200 transition-all">
                        <div className="text-sm font-bold text-blue-500 mb-1 h-5">{ex.pinyin || ''}</div>
                        <div className="text-5xl font-black text-gray-900 mb-2 group-hover/modal-ex:scale-110 transition-transform">{ex.char}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Ví dụ {i+1}</div>
                      </div>
                    ))}
                  </div>

                  {selectedRadical.detail && (
                    <div className="border-t border-gray-200 pt-8">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-3xl font-black text-gray-900">{selectedRadical.detail.word}</div>
                          <div className="text-blue-600 font-bold">{selectedRadical.detail.pinyin}</div>
                        </div>
                        <div className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Từ vựng HSK</div>
                      </div>
                      <div className="text-gray-600 mb-6 font-medium">{selectedRadical.detail.meaning}</div>
                      
                      <div className="bg-white p-6 rounded-3xl border border-gray-100 italic">
                         <div className="text-gray-900 font-bold mb-1 text-lg">{selectedRadical.detail.sentence}</div>
                         <div className="text-gray-400 text-sm mb-2">{selectedRadical.detail.sentencePy}</div>
                         <div className="text-gray-500 text-sm">"{selectedRadical.detail.sentenceVi}"</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
