"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Quote, 
  ChevronRight, 
  Search, 
  Info, 
  Volume2, 
  BookOpen, 
  MessageSquare,
  PlayCircle,
  BarChart3,
  Star
} from 'lucide-react';

const patterns = [
  { id: 1, structure: 'A 是 B', name: 'Mẫu câu "Là"', grammar: 'Dùng để định nghĩa, giới thiệu hoặc khẳng định sự vật.', sample: '我是学生。', pinyin: 'Wǒ shì xuésheng.', vi: 'Tôi là học sinh.' },
  { id: 2, structure: 'A 有 B', name: 'Mẫu câu "Có"', grammar: 'Dùng để chỉ sự sở hữu hoặc sự tồn tại.', sample: '我有三本书。', pinyin: 'Wǒ yǒu sān běn shū.', vi: 'Tôi có 3 quyển sách.' },
  { id: 3, structure: 'A + 呢？', name: 'Cấu trúc "Còn...?"', grammar: 'Dùng để đặt câu hỏi tỉnh lược khi đã đề cập đến đối tượng trước đó.', sample: '我很好，你呢？', pinyin: 'Wǒ hěn hǎo, nǐ ne?', vi: 'Tôi rất khỏe, còn bạn?' },
  { id: 4, structure: 'A + 不 + A', name: 'Câu hỏi chính phản', grammar: 'Dùng để hỏi một cách trực tiếp bằng cách lặp lại khẳng định và phủ định.', sample: '你去不去学校？', pinyin: 'Nǐ qù bú qù xuéxiào?', vi: 'Bạn có đi học không?' },
  { id: 5, structure: '太 + Adj + 了', name: 'Cấu trúc "Cực kỳ/Quá"', grammar: 'Dùng để nhấn mạnh mức độ cao của tính chất.', sample: '太好了！', pinyin: 'Tài hǎo le!', vi: 'Tốt quá rồi!' },
];

export default function SentencePatternsPage() {
  return (
    <div className="py-12 px-4 md:px-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-[#D85A30]">Trang chủ</Link>
            <ChevronRight size={14} />
            <span className="text-gray-600 font-medium">Cấu trúc & Mẫu câu</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Mẫu câu Tiếng Trung</h1>
              <p className="text-gray-500 font-medium">
                Tổng hợp 70+ cấu trúc ngữ pháp và mẫu câu giao tiếp từ cơ bản đến nâng cao. 
                Giúp bạn nói và viết tiếng Trung chuẩn xác như người bản xứ.
              </p>
            </div>
            <div className="flex items-center gap-3">
               <div className="bg-orange-50 px-5 py-3 rounded-2xl border border-orange-100 flex items-center gap-3">
                  <BarChart3 size={20} className="text-[#D85A30]" />
                  <div className="text-sm font-black text-gray-900 leading-none">70+ Cấu trúc</div>
               </div>
            </div>
          </div>
        </div>

        {/* Patterns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {patterns.map((p) => (
            <div 
              key={p.id} 
              className="bg-white rounded-[40px] border border-gray-100 p-8 card-hover flex flex-col group relative overflow-hidden shadow-sm"
            >
              <div className="flex items-center justify-between mb-8">
                 <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                    <Quote size={24} />
                 </div>
                 <button className="text-gray-200 hover:text-yellow-400 transition-colors">
                    <Star size={20} />
                 </button>
              </div>

              <div className="mb-6">
                 <div className="text-3xl font-black text-gray-900 mb-2 font-serif">{p.structure}</div>
                 <h3 className="text-sm font-bold text-[#D85A30] uppercase tracking-widest">{p.name}</h3>
              </div>

              <div className="p-5 bg-gray-50 rounded-2xl mb-8 flex-1 border-l-4 border-blue-400">
                 <div className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-2 flex items-center gap-1">
                    <Info size={12} /> Ghi chú ngữ pháp
                 </div>
                 <p className="text-xs text-gray-600 leading-relaxed font-medium">{p.grammar}</p>
              </div>

              <div className="space-y-4">
                 <div className="text-xs font-bold text-gray-300 uppercase tracking-widest">Ví dụ minh họa</div>
                 <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm relative overflow-hidden group/ex">
                    <div className="text-xl font-black text-gray-800 mb-1">{p.sample}</div>
                    <div className="text-[10px] font-bold text-gray-400 mb-2 italic uppercase">{p.pinyin}</div>
                    <div className="text-sm text-gray-600">{p.vi}</div>
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover/ex:bg-orange-50 group-hover/ex:text-[#D85A30] transition-all active:scale-90">
                       <Volume2 size={20} />
                    </button>
                 </div>
              </div>

              <button className="mt-8 flex items-center justify-between text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#D85A30] transition-colors">
                 Học chi tiết <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Upgrade Banner */}
        <div className="mt-16 gradient-premium rounded-[50px] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-orange-200 relative overflow-hidden">
           <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black mb-6">Nâng cấp tư duy ngữ pháp đỉnh cao</h2>
              <p className="opacity-80 max-w-xl text-lg">
                Sở hữu trọn bộ 300+ mẫu câu cao cấp dành cho kỳ thi HSK 5, 6 và giao tiếp thương mại chuyên sâu. 
                Kèm theo hệ thống bài tập thực hành AI chấm điểm.
              </p>
              <div className="mt-8 flex gap-4">
                 <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-xs font-bold">
                    <CheckCircle2 size={16} /> Update hàng tuần
                 </div>
                 <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-xs font-bold">
                    <CheckCircle2 size={16} /> Bài tập độc quyền
                 </div>
              </div>
           </div>
           <button className="relative z-10 whitespace-nowrap bg-white text-[#D85A30] px-12 py-6 rounded-[24px] font-black text-2xl hover:scale-110 transition-transform shadow-2xl shadow-black/20 active:scale-95">
              👑 Đăng ký PRO
           </button>
           
           {/* Abstract shapes */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>
      </div>
    </div>
  );
}

function CheckCircle2({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  );
}
