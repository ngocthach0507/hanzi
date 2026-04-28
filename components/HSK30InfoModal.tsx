"use client";

import React from 'react';
import { 
  X, 
  Zap, 
  Target, 
  BookOpen, 
  Brain, 
  ArrowRight, 
  CheckCircle2,
  Clock,
  LayoutGrid
} from 'lucide-react';
import Link from 'next/link';

interface HSK30InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HSK30InfoModal({ isOpen, onClose }: HSK30InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] md:rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300 no-scrollbar">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all z-20"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-[#D85A30] rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              <Zap size={12} fill="currentColor" /> Cập nhật 2026
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-4">
              HSK 3.0 là gì? <br />
              <span className="text-[#D85A30]">Tiêu chuẩn mới cho Kỷ nguyên mới</span>
            </h2>
            <p className="text-slate-500 font-medium max-w-2xl text-lg">
              HSK 3.0 không chỉ là một kỳ thi, đó là hệ thống đánh giá năng lực Hán ngữ toàn diện nhất từ trước đến nay, được thiết kế để đo lường chính xác khả năng ứng dụng thực tế.
            </p>
          </div>

          {/* Key Facts Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { 
                icon: <LayoutGrid className="text-blue-500" />, 
                title: '9 Cấp độ', 
                desc: 'Chia thành 3 giai đoạn: Sơ cấp (1-3), Trung cấp (4-6) và Cao cấp (7-9).' 
              },
              { 
                icon: <Clock className="text-orange-500" />, 
                title: 'Lộ trình 2026', 
                desc: 'Áp dụng song song từ tháng 7/2026. Thay thế hoàn toàn HSK 2.0 cũ.' 
              },
              { 
                icon: <Zap className="text-yellow-500" />, 
                title: '11,092 Từ vựng', 
                desc: 'Lượng từ vựng tăng gấp đôi so với chuẩn cũ để sát với thực tế hơn.' 
              }
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  {item.icon}
                </div>
                <h4 className="font-black text-slate-900 mb-2">{item.title}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D85A30] rounded-full blur-[80px] opacity-20"></div>
            <h3 className="text-xl font-black mb-8 uppercase tracking-widest text-center">Sự khác biệt cốt lõi</h3>
            
            <div className="space-y-4">
              {[
                { label: 'Số cấp độ', old: '6 Cấp', new: '9 Cấp (3-3-3)' },
                { label: 'Kỹ năng thi', old: 'Nghe, Đọc, Viết', new: 'Nghe, Nói, Đọc, Viết, Dịch' },
                { label: 'Chữ Hán', old: '2,663 chữ', new: '3,000 chữ (Bắt buộc viết tay)' },
                { label: 'Du học', old: 'Ưu tiên HSK 4-5', new: 'Bắt buộc HSK 3.0 từ 2026' }
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_1fr] gap-4 py-4 border-b border-white/10 last:border-0 items-center">
                  <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-tighter">{row.label}</span>
                  <span className="text-sm font-bold text-slate-300 text-center">{row.old}</span>
                  <span className="text-sm font-black text-[#D85A30] text-right">{row.new}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Why it matters */}
          <div className="space-y-6 mb-12">
            <h3 className="text-2xl font-black text-slate-900 text-center mb-8">Tại sao bạn cần chuẩn bị ngay?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Yêu cầu bắt buộc để xin học bổng và visa từ 2026.',
                'Kỹ năng viết tay và dịch thuật thực tế được chú trọng.',
                'Phân loại chính xác trình độ chuyên sâu (Cấp 7-9).',
                'Tương thích hoàn toàn với khung CEFR quốc tế.'
              ].map((text, i) => (
                <div key={i} className="flex gap-3 items-start p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                  <CheckCircle2 size={18} className="text-green-500 mt-0.5 shrink-0" />
                  <p className="text-slate-600 font-medium text-sm">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/giao-trinh"
              onClick={onClose}
              className="px-8 py-4 bg-[#D85A30] text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-orange-200"
            >
              HỌC CHUẨN 3.0 NGAY <ArrowRight size={18} />
            </Link>
            <Link 
              href="/hsk-3-0"
              onClick={onClose}
              className="px-8 py-4 bg-gray-100 text-gray-900 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
            >
              XEM CHI TIẾT <BookOpen size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
