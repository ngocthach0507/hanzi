"use client";

import React from 'react';
import Link from 'next/link';
import { 
  BookText, 
  LayoutGrid, 
  MessageSquare, 
  BookOpen, 
  ClipboardList, 
  Zap, 
  Languages, 
  FileText, 
  PenTool,
  ChevronRight
} from 'lucide-react';

export default function Home() {
  const features = [
    { title: 'Giáo trình HSK', desc: 'Học theo chuẩn HSK 3.0 từ cấp 1-3', count: '48 bài', icon: <BookText className="w-6 h-6 text-blue-400" />, href: '/giao-trinh', color: 'blue' },
    { title: 'Từ vựng chủ đề', desc: 'Từ vựng phân theo chủ đề giao tiếp', count: '80 bài', icon: <LayoutGrid className="w-6 h-6 text-orange-400" />, href: '/tu-vung-chu-de', color: 'orange' },
    { title: 'Hội thoại', desc: 'Luyện hội thoại thực tế theo HSK', count: '120 bài', icon: <MessageSquare className="w-6 h-6 text-purple-400" />, href: '/hoi-thoai', color: 'purple' },
    { title: 'Đọc hiểu', desc: 'Nâng cao kỹ năng đọc theo cấp độ', count: '90 bài', icon: <FileText className="w-6 h-6 text-gray-500" />, href: '/doc-hieu', color: 'gray' },
    { title: 'Luyện thi', desc: 'Đề thi thử HSK + THPT chấm tự động', count: '60 đề', icon: <PenTool className="w-6 h-6 text-red-400" />, href: '/luyen-thi', color: 'red' },
    { title: 'Bộ thủ', desc: '214 bộ thủ nhận biết và viết Hán', count: '30 bài', icon: <LayoutGrid className="w-6 h-6 text-black" />, href: '/bo-thu', color: 'black' },
    { title: 'Dịch', desc: 'Công cụ dịch Trung-Việt thông minh', count: 'Miễn phí', icon: <Languages className="w-6 h-6 text-blue-500" />, href: '/dich', color: 'blue' },
    { title: 'Mẫu câu', desc: 'Mẫu câu theo chủ đề và HSK level', count: '70 bài', icon: <MessageSquare className="w-6 h-6 text-gray-800" />, href: '/mau-cau', color: 'gray' },
    { title: 'Luyện viết', desc: 'Viết chữ Hán chuẩn nét, đếm nét sai', count: '50 bài', icon: <PenTool className="w-6 h-6 text-yellow-500" />, href: '/luyen-viet', color: 'yellow' },
  ];

  const hskLevels = [
    { level: 1, title: 'Giáo trình HSK 3.0 quyển 1', stats: '15 bài học · 300 từ · 40 ngữ pháp', desc: 'Giao tiếp cơ bản hàng daily', color: 'text-red-500', bgColor: 'bg-red-50', borderColor: 'border-red-100', label: 'Cơ bản · HSK 3.0', labelBg: 'bg-red-100', labelText: 'text-red-700' },
    { level: 2, title: 'Giáo trình HSK 3.0 quyển 2', stats: '15 bài học · +200 từ · 45 ngữ pháp', desc: 'Hội thoại và du lịch', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-100', label: 'Trung cấp · HSK 3.0', labelBg: 'bg-orange-100', labelText: 'text-orange-700' },
    { level: 3, title: 'Giáo trình HSK 3.0 quyển 3', stats: '18 bài học · +500 từ · 63 ngữ pháp', desc: 'Giao tiếp tự nhiên', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-100', label: 'Nâng cao · HSK 3.0', labelBg: 'bg-yellow-100', labelText: 'text-yellow-700' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* SECTION 1: HERO HSK 3.0 */}
      <section className="pt-16 pb-12 px-4 bg-gradient-to-b from-orange-50/30 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-500 text-xs font-bold mb-6">
            <span className="bg-blue-500 p-0.5 rounded text-white text-[10px]">🆕</span>
            Tân HSK 3.0 — Giáo Trình Chính Thức Mới Nhất 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            Học tiếng Trung theo chuẩn <span className="text-red-500 uppercase">HSK 3.0</span> mới nhất
          </h1>
          <p className="text-gray-600 font-medium mb-8 max-w-2xl mx-auto leading-relaxed">
            Hệ thống tiên phong được thiết kế chuẩn theo giáo trình HSK 3.0 mới nhất từ Hanban/CTI. Hiện tại, dữ liệu đã nạp đầy đủ lộ trình từ <b>HSK 1 đến HSK 3</b>. Các cấp độ 4-9 sẽ được cập nhật liên tục ngay khi bộ sách chuẩn 3.0 được phát hành chính thức từ nhà xuất bản.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/giao-trinh" className="bg-red-500 hover:bg-red-600 text-white px-8 py-3.5 rounded-xl font-black text-lg shadow-lg shadow-red-100 transition-all active:scale-95">
              Bắt đầu học HSK 3.0 →
            </Link>
            <Link href="/giao-trinh" className="bg-white hover:bg-gray-50 text-gray-800 px-8 py-3.5 rounded-xl font-bold border-2 border-gray-100 transition-all">
              Xem giáo trình
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: HSK LEVELS */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hskLevels.map((l) => (
              <Link key={l.level} href={`/giao-trinh/hsk${l.level}`} className={`group p-8 rounded-[2rem] border-2 ${l.borderColor} ${l.bgColor} transition-all hover:shadow-xl relative overflow-hidden`}>
                <div className={`inline-block px-4 py-1 rounded-lg ${l.labelBg} ${l.labelText} text-xs font-bold mb-6`}>
                  {l.label}
                </div>
                <div className="flex justify-center mb-4">
                  <span className={`text-8xl font-black opacity-60 ${l.color}`}>{l.level}</span>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{l.title}</h3>
                  <div className="text-xs font-bold text-gray-400 mb-4">{l.stats}</div>
                  <p className="text-sm font-bold text-gray-500">{l.desc}</p>
                </div>
                <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:translate-x-1 transition-transform">
                  <ChevronRight className={`w-5 h-5 ${l.color}`} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: ALL FEATURES GRID */}
      <section className="py-16 px-4 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-black mb-10 text-gray-800">Khám phá tất cả tính năng</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Link key={i} href={f.href} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-red-200 hover:shadow-xl transition-all group">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gray-50 group-hover:bg-red-50 transition-colors">
                    {f.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-red-500 transition-colors">{f.title}</h3>
                    <p className="text-xs font-bold text-gray-400 mb-2">{f.desc}</p>
                    <span className={`text-xs font-bold ${f.color === 'red' ? 'text-red-500' : f.color === 'blue' ? 'text-blue-500' : 'text-gray-500'}`}>
                      {f.count}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
