"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  BookOpen, 
  Activity, 
  Search, 
  Star,
  RotateCw,
  X,
  PlayCircle
} from 'lucide-react';

export default function TopicLessonContent() {
  const params = useParams();
  const topic = params.topic?.toString() || 'nghe-nghiep';
  const lesson = params.lesson?.toString() || '1';

  const [activeTab, setActiveTab] = useState('Từ vựng');

  // Mock data for topic vocabulary
  const words = [
    { id: 1, hanzi: '医生', pinyin: 'yīshēng', meaning: 'bác sĩ', type: 'danh từ', ex_zh: '我哥哥是一名医生。', ex_pinyin: 'Wǒ gēge shì yī míng yīshēng.', ex_vi: 'Anh trai tôi là một bác sĩ.' },
    { id: 2, hanzi: '老师', pinyin: 'lǎoshī', meaning: 'giáo viên', type: 'danh từ', ex_zh: '老师好！', ex_pinyin: 'Lǎoshī hǎo!', ex_vi: 'Chào thầy giáo!' },
    { id: 3, hanzi: '学生', pinyin: 'xuésheng', meaning: 'học sinh', type: 'danh từ', ex_zh: '他是一个好学生。', ex_pinyin: 'Tā shì yī gè hǎo xuésheng.', ex_vi: 'Cậu ấy là một học sinh giỏi.' },
    { id: 4, hanzi: '工人', pinyin: 'gōngrén', meaning: 'công nhân', type: 'danh từ', ex_zh: '爸爸是工厂的工人。', ex_pinyin: 'Bàba shì gōngchǎng de gōngrén.', ex_vi: 'Bố là công nhân nhà máy.' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Context Bar */}
      <div className="bg-white border-b border-gray-100 py-4 px-4 md:px-8 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/tu-vung-chu-de/${topic}`} className="text-gray-400 hover:text-[#D85A30] transition-colors">
              <ChevronLeft size={24} />
            </Link>
            <div>
              <h1 className="text-lg font-black text-gray-900 leading-tight capitalize">{topic.replace('-', ' ')} - Bài {lesson}</h1>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                <span className="text-orange-500">Chủ đề mở rộng</span>
                <span className="opacity-30">•</span>
                <span>{words.length} từ vựng</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-orange-50 text-[#D85A30] rounded-xl text-xs font-bold hover:bg-orange-100 transition-colors">
              <PlayCircle size={16} /> Luyện nghe toàn bộ
            </button>
            <button className="p-2.5 text-gray-300 hover:text-yellow-500 transition-colors">
              <Star size={22} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Module Tabs */}
        <div className="flex items-center gap-1 bg-white p-1.5 rounded-[24px] border border-gray-100 mb-10 overflow-x-auto no-scrollbar shadow-sm">
          {['Từ vựng', 'Luyện tập', 'Flashcard', 'Kiểm tra'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[120px] py-3.5 rounded-[18px] text-sm font-bold transition-all ${
                activeTab === tab 
                ? 'bg-[#1F2937] text-white shadow-lg' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content View */}
        {activeTab === 'Từ vựng' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {words.map((word) => (
              <div key={word.id} className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-start relative group card-hover">
                <div className="flex w-full justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-blue-500 mb-2 uppercase tracking-widest">{word.type}</span>
                    <h3 className="text-5xl font-black text-gray-900 mb-2">{word.hanzi}</h3>
                    <span className="text-lg font-bold text-[#D85A30] tracking-wide">{word.pinyin}</span>
                  </div>
                  <button className="w-14 h-14 bg-gray-50 hover:bg-[#D85A30] hover:text-white text-[#D85A30] rounded-full flex items-center justify-center transition-all active:scale-90">
                    <Volume2 size={24} />
                  </button>
                </div>

                <div className="w-full h-px bg-gray-50 mb-6 font-bold text-gray-200">---------------------------------</div>
                
                <div className="w-full">
                  <div className="text-xl font-bold text-gray-800 mb-4">{word.meaning}</div>
                  <div className="bg-[#FDF7F4] p-5 rounded-2xl border-l-4 border-[#D85A30]/30 min-h-[100px] flex flex-col justify-center">
                    <p className="text-gray-900 font-medium mb-1">{word.ex_zh}</p>
                    <p className="text-[10px] font-bold text-gray-400 italic mb-2 uppercase tracking-tighter">{word.ex_pinyin}</p>
                    <p className="text-sm text-gray-600">{word.ex_vi}</p>
                  </div>
                </div>

                <button className="absolute top-6 right-20 text-gray-200 hover:text-yellow-400 transition-colors">
                  <Star size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Action Call for practice */}
        <div className="mt-12 text-center">
          <button className="gradient-premium text-white px-12 py-5 rounded-[24px] font-black text-xl shadow-2xl shadow-orange-200 hover:scale-105 transition-transform flex items-center gap-3 mx-auto">
            <Activity size={24} /> Bắt đầu luyện tập
          </button>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-100 py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href={`/tu-vung-chu-de/${topic}/${parseInt(lesson) - 1}`} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">
            <ChevronLeft size={18} /> Bài trước
          </Link>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === parseInt(lesson) ? 'bg-[#D85A30] w-6' : 'bg-gray-200'} transition-all`}></div>
            ))}
          </div>
          <Link href={`/tu-vung-chu-de/${topic}/${parseInt(lesson) + 1}`} className="flex items-center gap-2 text-sm font-bold text-[#D85A30] hover:text-orange-700 transition-colors">
            Bài tiếp theo <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
