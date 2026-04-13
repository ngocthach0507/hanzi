"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ClipboardList, 
  ChevronRight, 
  Clock, 
  Trophy, 
  History, 
  PlayCircle,
  BarChart3,
  ShieldCheck,
  Zap
} from 'lucide-react';

const hskExams = [
  { level: 1, name: 'HSK 1', exams: 12, questions: 40, time: '35 phút', difficulty: 'Cơ bản', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { level: 2, name: 'HSK 2', exams: 15, questions: 60, time: '50 phút', difficulty: 'Cơ bản', color: 'bg-green-50 text-green-600 border-green-100' },
  { level: 3, name: 'HSK 3', exams: 10, questions: 80, time: '85 phút', difficulty: 'Trung bình', color: 'bg-orange-50 text-orange-600 border-orange-100' },
  { level: 4, name: 'HSK 4', exams: 10, questions: 100, time: '105 phút', difficulty: 'Trung bình', color: 'bg-purple-50 text-purple-600 border-purple-100' },
  { level: 5, name: 'HSK 5', exams: 13, questions: 100, time: '120 phút', difficulty: 'Nâng cao', color: 'bg-red-50 text-red-600 border-red-100' },
  { level: 6, name: 'HSK 6', exams: 13, questions: 101, time: '135 phút', difficulty: 'Chuyên gia', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
];

export default function LuyenThiHome() {
  return (
    <div className="py-12 px-4 md:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-[#D85A30]">Trang chủ</Link>
            <ChevronRight size={14} />
            <span className="text-gray-600 font-medium">Trung tâm Luyện thi</span>
          </nav>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Thư viện Đề thi HSK</h1>
              <p className="text-gray-500">
                Hệ thống đề thi mô phỏng chính xác cấu trúc đề thi HSK thật. 
                Tự động chấm điểm, phân tích lỗi sai và ước lượng cấp độ của bạn ngay lập tức.
              </p>
            </div>
            
            <div className="flex gap-4">
              <Link href="/dashboard/history" className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 hover:border-blue-400 transition-all shadow-sm">
                <History size={18} className="text-blue-500" /> Lịch sử thi
              </Link>
              <div className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl text-sm font-bold shadow-xl">
                <Trophy size={18} className="text-yellow-400" /> Rank: Sơ cấp
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-5">
            <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl"><Zap size={24} /></div>
            <div>
              <div className="text-sm font-bold text-gray-900">Chấm điểm AI</div>
              <div className="text-xs text-gray-400 mt-1">Kết quả ngay sau 1 giây</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-5">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><BarChart3 size={24} /></div>
            <div>
              <div className="text-sm font-bold text-gray-900">Phân tích chuyên sâu</div>
              <div className="text-xs text-gray-400 mt-1">Tìm ra điểm yếu cần cải thiện</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-5">
            <div className="p-4 bg-green-50 text-green-600 rounded-2xl"><ShieldCheck size={24} /></div>
            <div>
              <div className="text-sm font-bold text-gray-900">Chuẩn HSK 3.0</div>
              <div className="text-xs text-gray-400 mt-1">Cập nhật đề thi mới nhất 2024</div>
            </div>
          </div>
        </div>

        {/* Exam Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hskExams.map((exam) => (
            <div key={exam.level} className="bg-white rounded-[40px] border border-gray-100 overflow-hidden card-hover flex flex-col group h-full">
              <div className={`p-8 ${exam.color} flex items-center justify-between`}>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{exam.difficulty}</div>
                  <h3 className="text-3xl font-black">{exam.name}</h3>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                  <ClipboardList size={32} />
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="grid grid-cols-2 gap-y-6 mb-8">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-gray-900">{exam.exams} Đề</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Đã nạp</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-gray-900">{exam.time}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Thời gian</span>
                  </div>
                </div>

                <div className="mt-auto space-y-4">
                  <Link 
                    href={`/luyen-thi/hsk${exam.level}`}
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl group-hover:scale-[1.02]"
                  >
                    Bắt đầu luyện tập <PlayCircle size={18} />
                  </Link>
                  <button className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-100 transition-all border border-gray-100">
                    <History size={16} /> Xem lịch sử đề {exam.name}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
