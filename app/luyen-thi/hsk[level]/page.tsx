"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ChevronRight, 
  FileText, 
  Clock, 
  BarChart3, 
  ShieldCheck, 
  PlayCircle,
  Lock,
  History,
  Info
} from 'lucide-react';

export default function ExamListByLevel() {
  const params = useParams();
  const level = params.level?.toString().replace('hsk', '') || '1';
  const numericLevel = parseInt(level);

  const exams = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Đề thi thử HSK ${level} - Số ${i + 1}`,
    code: `HSK${level}-2024-${i+1}`,
    time: numericLevel === 1 ? '35 phút' : '50 phút',
    questions: numericLevel === 1 ? 40 : 60,
    isFree: i < 3,
    status: i === 0 ? '85/100' : (i < 2 ? 'In progress' : 'Not started')
  }));

  return (
    <div className="py-8 px-4 md:px-8 bg-[#F9FAFB] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-[#D85A30]">Trang chủ</Link>
          <ChevronRight size={14} />
          <Link href="/luyen-thi" className="hover:text-[#D85A30]">Luyện thi HSK</Link>
          <ChevronRight size={14} />
          <span className="text-gray-600 font-semibold uppercase">HSK {level}</span>
        </nav>

        {/* Header */}
        <div className="bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-sm mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
              <ShieldCheck size={14} /> Ngân hàng đề thi chuẩn 2024
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Luyện đề HSK {level}</h1>
            <p className="text-gray-500 max-w-lg">
              Tổng hợp {exams.length} đề thi thử sát với cấu trúc đề thi chính thức của HSK {level}. 
              Cải thiện kỹ năng quản lý thời gian và phản xạ làm bài.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 text-center min-w-[120px]">
              <div className="text-2xl font-black text-gray-900">{exams.length}</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase mt-1">Tổng đề</div>
            </div>
            <div className="p-6 bg-green-50 rounded-3xl border border-green-100 text-center min-w-[120px]">
              <div className="text-2xl font-black text-green-600">3</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase mt-1">Đã làm</div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div 
              key={exam.id}
              className={`bg-white p-6 rounded-[32px] border transition-all flex flex-col h-full relative group ${!exam.isFree ? 'opacity-80' : 'hover:shadow-md hover:border-blue-100'}`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  <FileText size={24} />
                </div>
                {exam.status === 'Not started' ? (
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full italic">Mới</span>
                ) : (
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${exam.status.includes('/') ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                    {exam.status}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-black text-gray-900 mb-2 leading-tight">{exam.name}</h3>
              <p className="text-xs text-gray-400 font-bold uppercase mb-8">Mã đề: {exam.code}</p>

              <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                    <Clock size={14} className="text-orange-400" /> {exam.time}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                    <BarChart3 size={14} className="text-blue-500" /> {exam.questions} câu
                  </div>
                </div>
                
                {exam.isFree ? (
                  <Link 
                    href={`/luyen-thi/hsk${level}/${exam.id}`}
                    className="p-3 bg-gray-900 text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-gray-200 group-hover:scale-110 active:scale-95"
                  >
                    <PlayCircle size={20} />
                  </Link>
                ) : (
                  <div className="flex items-center gap-1.5 text-gray-300 font-black text-xs uppercase cursor-not-allowed">
                    <Lock size={14} /> 🔒 PRO
                  </div>
                )}
              </div>

              {/* Locked Overlay for Premium items */}
              {!exam.isFree && (
                <div className="absolute inset-0 rounded-[32px] bg-white/10 backdrop-blur-[1px] cursor-pointer">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 border border-gray-700 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 hover:opacity-100 transition-opacity">
                    Mở khóa ngay
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info card */}
        <div className="mt-16 bg-[#FFF9F5] border border-orange-100 p-8 rounded-[40px] flex items-start gap-6">
          <div className="p-4 bg-orange-500 text-white rounded-[20px] shadow-lg shadow-orange-200">
            <Info size={32} />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Cấu trúc đề thi HSK {level} 2024</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-3xl">
              Đề thi HSK {level} mới nhất bao gồm 2 phần chính: **Nghe hiểu** và **Đọc hiểu**. 
              Bạn cần đạt ít nhất 180/300 điểm đối với HSK 3-6 để vượt qua. 
              Hãy đảm bảo tai nghe hoạt động tốt trước khi bắt đầu phần thi Nghe nhé!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
