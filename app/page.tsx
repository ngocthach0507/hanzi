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
  ChevronRight,
  ArrowRight
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
            <Link href="/giao-trinh" className="bg-red-500 hover:bg-red-600 text-white px-10 py-4 rounded-2xl font-black text-xl shadow-2xl shadow-red-200 transition-all active:scale-95 flex items-center gap-2">
              Bắt đầu học miễn phí <Zap size={20} fill="currentColor" />
            </Link>
            <Link href="/luyen-thi" className="bg-white hover:bg-gray-50 text-gray-800 px-10 py-4 rounded-2xl font-black border-2 border-gray-100 transition-all flex items-center gap-2">
              Thử trình độ ngay <PenTool size={20} />
            </Link>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 grayscale opacity-50 overflow-hidden">
             <div className="flex items-center gap-2 font-black text-sm text-gray-400">
                <span className="text-xl">5.000+</span> Học viên tin dùng
             </div>
             <div className="h-4 w-px bg-gray-300"></div>
             <div className="flex items-center gap-2 font-black text-sm text-gray-400 uppercase tracking-widest">
                Đào tạo chuẩn HSK 3.0
             </div>
          </div>
        </div>
      </section>

      {/* SECTION: WHY CHOOSE US? */}
      <section className="py-24 px-4 border-y border-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Tại sao chọn <span className="text-red-500">Hanzi.io.vn</span>?</h2>
            <p className="text-gray-500 font-bold max-w-xl mx-auto">Nền tảng duy nhất tập trung hoàn toàn vào chất lượng và trải nghiệm học tập chuẩn 2026.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Chuẩn HSK 3.0 mới nhất', desc: 'Dữ liệu được cập nhật liên tục từ Hanban, đảm bảo bạn luôn học đúng kiến thức mới nhất.', icon: <Zap size={32} className="text-yellow-500" /> },
              { title: 'Luyện nghe & viết AI', desc: 'Công cụ AI thông minh giúp chỉnh sửa phát âm và hướng dẫn viết chữ Hán đúng quy tắc.', icon: <Languages size={32} className="text-blue-500" /> },
              { title: 'Lộ trình cá nhân hóa', desc: 'Hệ thống tự động lưu tiến độ và nhắc nhở ôn tập giúp bạn không bao giờ bị gián đoạn.', icon: <ClipboardList size={32} className="text-green-500" /> },
            ].map((item, i) => (
              <div key={i} className="text-center md:text-left p-8 rounded-[2.5rem] bg-gray-50/50 border border-transparent hover:border-gray-200 transition-all">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6 mx-auto md:mx-0">
                  {item.icon}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
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
              <Link key={i} href={f.href} className="bg-white p-6 rounded-3xl border-2 border-gray-50 hover:border-red-200 hover:shadow-2xl transition-all group flex flex-col h-full">
                <div className="flex items-start gap-5 mb-6">
                  <div className="p-4 rounded-2xl bg-gray-50 group-hover:bg-red-50 transition-colors shadow-sm">
                    {f.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-gray-900 group-hover:text-red-500 transition-colors">{f.title}</h3>
                    <p className="text-xs font-bold text-gray-400 mt-1">{f.desc}</p>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${f.color === 'red' ? 'bg-red-50 text-red-500' : f.color === 'blue' ? 'bg-blue-50 text-blue-500' : 'bg-gray-100 text-gray-500'}`}>
                    {f.count}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-black text-gray-900 group-hover:translate-x-1 transition-transform">
                    Thử ngay <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white rounded-[4rem] p-10 md:p-16 border-2 border-dashed border-red-200 shadow-inner">
             <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-red-100 italic">
                   🆓 TÀI LIỆU MIỄN PHÍ
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">Bộ 1200 từ vựng HSK 1-3 <span className="text-red-500">Chuẩn 3.0</span></h2>
                <p className="text-gray-500 font-bold text-lg mb-8 leading-relaxed">
                   Chúng tôi đã biên soạn file PDF tổng hợp toàn bộ từ vựng, ví dụ và âm thanh theo chuẩn giáo trình mới nhất. Hoàn toàn miễn phí cho thành viên!
                </p>
                <Link href="/dang-ky" className="inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl active:scale-95">
                   ĐĂNG KÝ ĐỂ TẢI NGAY <ChevronRight size={20} strokeWidth={3} />
                </Link>
             </div>
             <div className="relative flex justify-center">
                <div className="w-64 h-80 bg-gray-50 rounded-[2.5rem] border-4 border-white shadow-2xl rotate-[-3deg] flex flex-col items-center justify-center p-8 relative group hover:rotate-0 transition-transform duration-500">
                   <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-red-200">
                      <FileText size={32} />
                   </div>
                   <div className="text-center">
                      <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">EBOOK PDF</div>
                      <div className="text-lg font-black text-gray-900 leading-tight">Tổng hợp HSK 3.0 Toàn tập</div>
                   </div>
                   <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-xl font-black text-xs shadow-lg rotate-[15deg]">
                      BẢN 2026
                   </div>
                </div>
                {/* Secondary card for stack effect */}
                <div className="absolute w-64 h-80 bg-white border border-gray-100 rounded-[2.5rem] -z-10 rotate-[6deg] opacity-50"></div>
             </div>
          </div>

          <div className="mt-20 p-12 bg-gray-900 rounded-[3rem] text-white text-center">
             <h2 className="text-3xl font-black mb-6">Sẵn sàng để giỏi tiếng Trung?</h2>
             <p className="text-gray-400 font-medium mb-10 max-w-xl mx-auto">Tham gia cùng cộng đồng hơn 5.000 học viên và trải nghiệm cách học thông minh nhất.</p>
             <Link href="/giao-trinh" className="inline-flex items-center gap-3 bg-red-500 hover:bg-red-600 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-red-900/40 transition-all active:scale-95">
                BẮT ĐẦU NGAY MIỄN PHÍ <ArrowRight size={24} />
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
