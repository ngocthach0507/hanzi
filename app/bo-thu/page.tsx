"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Shapes, 
  ChevronRight, 
  Search, 
  Filter, 
  Info,
  Layers,
  Star,
  BookOpen
} from 'lucide-react';

// Mock data for initial radicals
const radicals = [
  { id: 1, char: '一', pinyin: 'yī', meaning: 'nhất (số 1)', strokes: 1, examples: ['一', '丁', '七'] },
  { id: 2, char: '丨', pinyin: 'gǔn', meaning: 'côn (nét sổ)', strokes: 1, examples: ['中', '丰'] },
  { id: 3, char: '丶', pinyin: 'zhǔ', meaning: 'chủ (điểm)', strokes: 1, examples: ['丸', '丹'] },
  { id: 4, char: '丿', pinyin: 'piě', meaning: 'phiệt (nét phẩy)', strokes: 1, examples: ['久', '义'] },
  { id: 5, char: '乙', pinyin: 'yǐ', meaning: 'ất (vị trí thứ 2)', strokes: 1, examples: ['也', '乞'] },
  { id: 6, char: '亅', pinyin: 'jué', meaning: 'quyết (nét móc)', strokes: 1, examples: ['了', '予'] },
  { id: 7, char: '二', pinyin: 'èr', meaning: 'nhị (số 2)', strokes: 2, examples: ['于', '云'] },
  { id: 8, char: '人', pinyin: 'rén', meaning: 'nhân (người)', strokes: 2, examples: ['今', '从'] },
  { id: 9, char: '儿', pinyin: 'ér', meaning: 'nhi (trẻ con)', strokes: 2, examples: ['兄', '兆'] },
  { id: 10, char: '入', pinyin: 'rù', meaning: 'nhập (vào)', strokes: 2, examples: ['全', '内'] },
];

export default function RadicalsList() {
  const [activeStrokes, setActiveStrokes] = useState<number | 'all'>('all');

  const filteredRadicals = activeStrokes === 'all' 
    ? radicals 
    : radicals.filter(r => r.strokes === activeStrokes);

  return (
    <div className="py-12 px-4 md:px-8 bg-[#F9FAFB] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-[#D85A30]">Trang chủ</Link>
            <ChevronRight size={14} />
            <span className="text-gray-600 font-medium">214 Bộ thủ Hán ngữ</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Thư viện Bộ thủ</h1>
              <p className="text-gray-500">
                Tìm hiểu 214 bộ thủ cơ bản trong tiếng Trung. Hiểu về bộ thủ giúp bạn 
                nhận diện ý nghĩa và cách viết của hàng ngàn chữ Hán một cách logic.
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
               <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><Shapes size={24} /></div>
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
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeStrokes === 'all' ? 'bg-[#D85A30] text-white' : 'bg-white text-gray-400 hover:text-gray-900'}`}
          >
            Tất cả
          </button>
          {[1, 2, 3, 4, 5, 6, 7].map((s) => (
            <button 
              key={s}
              onClick={() => setActiveStrokes(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeStrokes === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white text-gray-400 border border-transparent hover:border-blue-100 hover:text-blue-600'}`}
            >
              {s} Nét
            </button>
          ))}
          <span className="hidden md:inline-flex px-4 py-2 text-xs font-bold text-gray-300">... up to 17 nét</span>
        </div>

        {/* Radicals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredRadicals.map((r) => (
            <div 
              key={r.id} 
              className="bg-white p-6 rounded-[32px] border border-gray-100 card-hover flex flex-col items-center group relative overflow-hidden"
            >
              <div className="text-6xl font-black text-gray-900 mb-4 group-hover:scale-110 transition-transform">{r.char}</div>
              <div className="text-sm font-bold text-[#D85A30] mb-1">{r.pinyin}</div>
              <div className="text-xs text-gray-500 font-medium text-center mb-6 line-clamp-1 px-2">{r.meaning}</div>
              
              <div className="w-full pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-300 uppercase">{r.strokes} nét</span>
                <div className="flex gap-1">
                  {r.examples.map(ex => (
                    <span key={ex} className="w-6 h-6 bg-gray-50 rounded-md flex items-center justify-center text-[10px] font-bold text-gray-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover Badge */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Star size={16} className="text-gray-200 hover:text-yellow-400 cursor-pointer" />
              </div>
            </div>
          ))}
        </div>

        {/* Info card */}
        <div className="mt-16 bg-[#1F2937] text-white rounded-[40px] p-10 flex flex-col md:flex-row items-center gap-10">
          <div className="w-24 h-24 bg-orange-600 rounded-[30px] flex items-center justify-center flex-shrink-0 shadow-2xl shadow-orange-900/50">
            <Info size={48} />
          </div>
          <div>
            <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
              Tại sao nên học Bộ thủ?
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
              Bộ thủ là thành phần cấu tạo nên chữ Hán. Có tất cả 214 bộ thủ. 
              Mỗi chữ Hán thường bao gồm một bộ thủ chỉ ý nghĩa và một phần chỉ âm thanh. 
              Ví dụ: Bộ **氵 (thủy)** luôn liên quan đến nước (Hà, Hải, Giang...). 
              Học bộ thủ sẽ giúp bạn đoán được nghĩa của từ ngay cả khi chưa gặp bao giờ.
            </p>
            <div className="mt-6 flex gap-4">
               <button className="bg-orange-600 px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-orange-700 transition-colors">
                  Tải bảng bộ thủ PDF
               </button>
               <button className="bg-white/10 px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-white/20 transition-colors">
                  Luyện tập nhận diện bộ thủ
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
