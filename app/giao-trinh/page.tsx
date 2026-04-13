"use client";

import React from 'react';
import Link from 'next/link';
import { Book, Clock, Star, ArrowRight, Shield, Crown, CheckCircle2, BookOpen } from 'lucide-react';

const hskLevels = [
  {
    level: 1,
    char: '你',
    name: 'HSK 1',
    zhTitle: '新HSK教程 1',
    difficulty: 'Cơ bản',
    words: ['你好', '谢谢', '北京'],
    lessons: 15,
    vocabCount: 300,
    duration: '2-3 tháng',
    color: 'text-hsk1',
    bgColor: 'bg-hsk1-light',
    borderColor: 'border-red-100',
    btnBg: 'bg-hsk1 hover:bg-red-600 shadow-red-200'
  },
  {
    level: 2,
    char: '朋',
    name: 'HSK 2',
    zhTitle: '新HSK教程 2',
    difficulty: 'Sơ cấp',
    words: ['漂亮', '学习', '运动'],
    lessons: 15,
    vocabCount: 500,
    duration: '3-4 tháng',
    color: 'text-hsk2',
    bgColor: 'bg-hsk2-light',
    borderColor: 'border-orange-100',
    btnBg: 'bg-hsk2 hover:bg-orange-600 shadow-orange-200'
  },
  {
    level: 3,
    char: '努',
    name: 'HSK 3',
    zhTitle: '新HSK教程 3',
    difficulty: 'Trung cấp',
    words: ['努力', '发现', '其实'],
    lessons: 18,
    vocabCount: 1000,
    duration: '4-6 tháng',
    color: 'text-hsk3',
    bgColor: 'bg-hsk3-light',
    borderColor: 'border-yellow-100',
    btnBg: 'bg-hsk3 hover:bg-yellow-600 shadow-yellow-200'
  }
];

export default function GiaoTrinhOverview() {
  return (
    <div className="py-16 px-4 md:px-8 bg-white min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-red-500 text-xs font-black uppercase tracking-widest mb-6">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
            Chương trình HSK 3.0 — Chuẩn 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">Lộ trình chinh phục HSK</h1>
          <p className="text-gray-500 max-w-2xl text-xl leading-relaxed">
            Học tập theo bộ giáo trình chính thức duy nhất do Hanban/CTI phê duyệt. 
            Tích hợp công nghệ nhận diện giọng nói và Flashcard SRS.
          </p>
        </div>

        {/* Level Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          {hskLevels.map((hsk) => (
            <div key={hsk.level} className={`relative flex flex-col h-full bg-white rounded-[3rem] border-2 ${hsk.borderColor} overflow-hidden hover:shadow-2xl transition-all duration-500 group`}>
              {/* Card Header */}
              <div className={`p-10 ${hsk.bgColor} relative overflow-hidden`}>
                 <div className="absolute top-0 right-0 text-9xl font-black opacity-5 translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-700">
                    {hsk.char}
                 </div>
                 <div className="relative z-10">
                    <div className="text-sm font-black uppercase tracking-widest opacity-60 mb-2 truncate">{hsk.zhTitle}</div>
                    <div className={`text-5xl font-black mb-2 ${hsk.color}`}>{hsk.name}</div>
                    <div className="flex items-center gap-2 text-gray-600 font-bold">
                       <Shield size={14} className={hsk.color} />
                       {hsk.difficulty}
                    </div>
                 </div>
              </div>

              {/* Card Body */}
              <div className="p-10 flex-1 flex flex-col">
                 <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="flex flex-col gap-1">
                       <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thời lượng</div>
                       <div className="flex items-center gap-1.5 font-black text-gray-800">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {hsk.duration}
                       </div>
                    </div>
                    <div className="flex flex-col gap-1">
                       <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nội dung</div>
                       <div className="flex items-center gap-1.5 font-black text-gray-800">
                          <BookOpen className="w-4 h-4 text-gray-400" />
                          {hsk.lessons} bài học
                       </div>
                    </div>
                 </div>

                 <div className="mb-10 flex-1">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Từ vựng mục tiêu</div>
                    <div className="flex flex-wrap gap-2">
                       {hsk.words.map(w => (
                          <span key={w} className="px-4 py-2 bg-gray-50 rounded-2xl text-sm font-bold text-gray-800 border border-gray-100 group-hover:bg-white transition-colors">
                             {w}
                          </span>
                       ))}
                       <span className={`px-4 py-2 rounded-2xl text-sm font-black ${hsk.bgColor} ${hsk.color}`}>
                          +{hsk.vocabCount} từ
                       </span>
                    </div>
                 </div>

                 <Link 
                    href={`/giao-trinh/hsk${hsk.level}`} 
                    className={`w-full py-5 rounded-[2rem] text-white font-black text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-xl ${hsk.btnBg}`}
                 >
                    BẮT ĐẦU NGAY <ArrowRight size={20} strokeWidth={3} />
                 </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Upgrade */}
        <div className="bg-gray-900 rounded-[4rem] p-10 md:p-20 text-white relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
           <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="max-w-xl text-center lg:text-left">
                 <div className="inline-flex items-center gap-2 text-orange-400 mb-6 underline decoration-wavy underline-offset-4">
                    <Crown size={20} />
                    <span className="text-xs font-black uppercase tracking-[0.3em]">Đặc quyền Membership</span>
                 </div>
                 <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Mở khóa 100% nội dung HSK 3.0 chuyên sâu</h2>
                 <p className="text-gray-400 text-lg leading-relaxed">
                    Nâng cấp tài khoản để truy cập đầy đủ bài thi thử, giải thích ngữ pháp chi tiết của Xiaoyu AI và hệ thống Flashcard không giới hạn.
                 </p>
                 <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
                    {['Bài thi thử AI', 'Hội thoại bối cảnh', 'Chỉnh sửa phát âm'].map(item => (
                       <div key={item} className="flex items-center gap-2 text-sm font-bold text-gray-300">
                          <CheckCircle2 size={16} className="text-green-500" />
                          {item}
                       </div>
                    ))}
                 </div>
              </div>
              <Link href="/nang-cap" className="w-full lg:w-auto bg-orange-600 hover:bg-orange-700 text-white px-14 py-7 rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-orange-900/50 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3">
                 NÂNG CẤP PRO <Crown size={24} />
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}

