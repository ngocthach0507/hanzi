"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  ChevronRight, 
  Clock, 
  BarChart3,
  BookOpen,
  Loader2,
  Tag
} from 'lucide-react';

interface ReadingCard {
  id: string;
  level: number;
  title_zh: string;
  title_vi: string;
  topic: string;
  grammar_focus: string[];
}

const TOPIC_COLOR: Record<string, string> = {
  'Giao tiếp': 'bg-blue-50 text-blue-600',
  'Gia đình': 'bg-pink-50 text-pink-600',
  'Đời sống': 'bg-green-50 text-green-600',
  'Mua sắm': 'bg-purple-50 text-purple-600',
  'Thời gian': 'bg-indigo-50 text-indigo-600',
  'Du lịch': 'bg-sky-50 text-sky-600',
  'Ẩm thực': 'bg-orange-50 text-orange-600',
  'Sức khỏe': 'bg-red-50 text-red-600',
  'Thời tiết': 'bg-cyan-50 text-cyan-600',
  'Hoạt động ngoài trời': 'bg-emerald-50 text-emerald-600',
};

export default function ReadingList() {
  const [activeLevel, setActiveLevel] = useState(1);
  const [readings, setReadings] = useState<ReadingCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReadings() {
      setLoading(true);
      try {
        const res = await fetch(`/api/readings?level=${activeLevel}`);
        if (res.ok) {
          const data = await res.json();
          setReadings(Array.isArray(data) ? data : []);
        } else {
          setReadings([]);
        }
      } catch {
        setReadings([]);
      }
      setLoading(false);
    }
    fetchReadings();
  }, [activeLevel]);

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
                Bài đọc được biên soạn từ nội dung HSK thực tế — kèm bài tập <strong>trắc nghiệm đọc hiểu</strong> và <strong>ngữ pháp điền chỗ trống</strong>.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-50 px-4 py-2 rounded-xl text-xs font-bold text-gray-500 flex items-center gap-2">
                <BarChart3 size={16} className="text-blue-500" />
                {loading ? '...' : readings.length} bài viết
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
              className={`px-8 py-3.5 rounded-[20px] text-sm font-bold transition-all whitespace-nowrap ${
                activeLevel === l 
                ? 'bg-[#1F2937] text-white shadow-xl' 
                : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-300 hover:text-gray-900'
              }`}
            >
              Cấp độ {l}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-24">
            <Loader2 size={40} className="animate-spin text-[#D85A30]" />
          </div>
        )}

        {/* Readings Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {readings.map((read) => {
              const topicColor = TOPIC_COLOR[read.topic] || 'bg-gray-50 text-gray-600';
              return (
                <Link 
                  key={read.id}
                  href={`/doc-hieu/hsk${read.level}/${read.id}`}
                  className="group bg-white rounded-[32px] border border-gray-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <FileText size={24} />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl ${topicColor}`}>
                      {read.topic}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-gray-900 mb-1 group-hover:text-[#D85A30] transition-colors">{read.title_zh}</h3>
                  <p className="text-gray-500 font-bold text-sm mb-5">{read.title_vi}</p>

                  {/* Grammar focus tags */}
                  {read.grammar_focus?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {read.grammar_focus.slice(0, 2).map((g, i) => (
                        <span key={i} className="text-[10px] font-bold text-[#D85A30] bg-orange-50 border border-orange-100 px-2 py-1 rounded-lg flex items-center gap-1">
                          <Tag size={9} /> {g}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto">
                    {/* Exercise types */}
                    <div className="flex gap-2 mb-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold bg-blue-50 text-blue-600 px-2.5 py-1.5 rounded-lg">
                        ✅ Trắc nghiệm
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold bg-amber-50 text-amber-600 px-2.5 py-1.5 rounded-lg">
                        💡 Ngữ pháp
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 font-black text-sm text-[#D85A30]">
                      Đọc ngay
                      <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}

            {readings.length === 0 && (
              <div className="col-span-full py-24 text-center border-2 border-dashed border-gray-100 rounded-[40px] bg-gray-50/50">
                <BookOpen size={64} className="mx-auto text-gray-200 mb-6" />
                <h3 className="text-xl font-bold text-gray-400">Nội dung đang được biên soạn</h3>
                <p className="text-gray-400 text-sm mt-2">Vui lòng quay lại sau để trải nghiệm bài viết HSK {activeLevel}!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
