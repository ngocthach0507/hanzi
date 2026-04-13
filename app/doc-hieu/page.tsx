"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  ChevronRight, 
  Search, 
  Eye, 
  Clock, 
  BarChart3,
  BookOpen,
  Lock
} from 'lucide-react';

const readings = [
  { id: 1, level: 1, title: 'Ngày nghỉ của tôi', zh: '我的假期', topic: 'Hàng ngày', difficulty: 'Cơ bản', views: 1250, length: 'Ngắn' },
  { id: 2, level: 1, title: 'Gia đình tôi', zh: '我的家人', topic: 'Gia đình', difficulty: 'Cơ bản', views: 3420, length: 'Ngắn' },
  { id: 3, level: 2, title: 'Món ăn Trung Quốc', zh: '中国菜', topic: 'Văn hóa', difficulty: 'TB-Cơ bản', views: 890, length: 'Vừa' },
  { id: 4, level: 3, title: 'Sự phát triển của công nghệ', zh: '科技的发展', topic: 'Công nghệ', difficulty: 'Trung bình', views: 560, length: 'Dài' },
];

export default function ReadingList() {
  const [activeLevel, setActiveLevel] = useState(1);
  const filteredReadings = readings.filter(r => r.level === activeLevel);

  return (
    <div className="py-12 px-4 md:px-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-[#D85A30]">Trang chủ</Link>
            <ChevronRight size={14} />
            <span className="text-gray-600 font-medium">Luyện kỹ năng đọc</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Kỹ năng Đọc hiểu</h1>
              <p className="text-gray-500">
                Cải thiện kỹ năng đọc qua các bài viết đa dạng chủ đề từ văn hóa, 
                đời sống đến công nghệ. Hỗ trợ tra từ trực tiếp và bài tập củng cố.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-50 px-4 py-2 rounded-xl text-xs font-bold text-gray-500 flex items-center gap-2">
                <BarChart3 size={16} className="text-blue-500" />
                Đang có: {readings.length} bài viết
              </div>
            </div>
          </div>
        </div>

        {/* Level Filters */}
        <div className="flex gap-2 mb-12 overflow-x-auto no-scrollbar pb-2">
          {[1, 2, 3, 4, 5, 6].map((l) => (
            <button 
              key={l}
              onClick={() => setActiveLevel(l)}
              className={`px-8 py-3.5 rounded-[20px] text-sm font-bold transition-all ${
                activeLevel === l 
                ? 'bg-[#1F2937] text-white shadow-xl' 
                : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-300 hover:text-gray-900'
              }`}
            >
              Cấp độ {l}
            </button>
          ))}
        </div>

        {/* Readings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredReadings.map((read) => (
            <Link 
              key={read.id}
              href={`/doc-hieu/hsk${read.level}/${read.id}`}
              className="group bg-white rounded-[32px] border border-gray-100 p-8 card-hover flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FileText size={24} />
                </div>
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{read.topic}</span>
              </div>

              <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-[#D85A30] transition-colors">{read.title}</h3>
              <p className="text-gray-400 font-bold text-lg mb-8 italic">{read.zh}</p>

              <div className="mt-auto space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                    <Clock size={14} className="text-orange-500" /> {read.length}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                    <Eye size={14} className="text-blue-500" /> {read.views} xem
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 font-black text-sm text-[#D85A30]">
                  Đọc ngay
                  <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}

          {filteredReadings.length === 0 && (
            <div className="col-span-full py-24 text-center border-2 border-dashed border-gray-100 rounded-[40px] bg-gray-50/50">
              <BookOpen size={64} className="mx-auto text-gray-200 mb-6" />
              <h3 className="text-xl font-bold text-gray-400">Nội dung đang được biên soạn</h3>
              <p className="text-gray-400 text-sm mt-2">Vui lòng quay lại sau để trải nghiệm bài viết HSK {activeLevel}!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
