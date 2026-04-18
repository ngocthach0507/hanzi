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
  ArrowRight,
  CheckCircle2,
  Star,
  X,
  Crown
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';

export default function Home() {
  const { user } = useUser();
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
      <section className="relative pt-24 pb-20 px-4 bg-mesh overflow-hidden">
        {/* Floating elements for visual depth */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-100/20 rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-red-100 text-[#FF5E3A] text-[11px] font-black mb-8 shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
            <span className="bg-[#FF5E3A] p-0.5 px-1.5 rounded text-white text-[9px] font-black">NEW</span>
            TÂN HSK 3.0 — GIÁO TRÌNH CHÍNH THỨC MỚI NHẤT 2026
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight text-slate-900">
            Chinh phục <span className="text-[#FF5E3A]">Tiếng Trung</span><br />
            Chuẩn <span className="relative inline-block">
              HSK 3.0
              <span className="absolute bottom-2 left-0 w-full h-3 bg-orange-400/20 -z-10"></span>
            </span> mới nhất
          </h1>
          
          <p className="text-slate-500 font-medium mb-12 max-w-2xl mx-auto leading-relaxed text-lg md:text-xl">
            Nền tảng duy nhất được thiết kế chuyên biệt cho giáo trình HSK 3.0. 
            Cập nhật liên tục, lộ trình rõ ràng, học hiệu quả gấp 3 lần.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/giao-trinh" className="group bg-[#FF5E3A] hover:bg-[#D85A30] text-white px-10 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-orange-200 transition-all active:scale-95 flex items-center gap-3">
              Bắt đầu học ngay <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="bg-white/80 backdrop-blur-md hover:bg-white text-slate-800 px-10 py-5 rounded-2xl font-black text-lg border-2 border-slate-100 transition-all flex items-center gap-2 shadow-sm group">
              Xem Demo <Zap size={20} className="group-hover:text-yellow-500 transition-colors" />
            </button>
          </div>
          
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
             <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-black text-slate-900">5.000+</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Học viên tin dùng</span>
             </div>
             <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
             <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-black text-slate-900">120+</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bài giảng 3.0</span>
             </div>
             <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
             <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-black text-slate-900">AI</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trợ lý học tập</span>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION: PATHWAYS */}
      <section className="py-24 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">Lộ trình học chuẩn HSK 3.0</h2>
            <p className="text-slate-400 font-bold max-w-2xl mx-auto">Chọn cấp độ phù hợp để bắt đầu hành trình chinh phục tiếng Trung của bạn.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {hskLevels.map((l) => (
              <Link key={l.level} href={`/giao-trinh/hsk${l.level}`} className="path-card group featured">
                <div className={`level-badge ${l.labelBg} ${l.labelText}`}>
                  {l.label}
                </div>
                <div className={`path-icon ${l.bgColor} ${l.color}`}>
                  <span className="text-4xl font-black">{l.level}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-[#FF5E3A] transition-colors">{l.title}</h3>
                <p className="text-slate-500 font-medium mb-6 text-sm leading-relaxed">{l.stats}</p>
                <div className="mt-auto flex items-center gap-2 text-sm font-black text-slate-900">
                  Chi tiết lộ trình <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURES GRID */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">Hệ sinh thái học tập</h2>
              <p className="text-slate-400 font-bold mt-2">Tích hợp đầy đủ các công cụ hỗ trợ người học toàn diện.</p>
            </div>
            <Link href="/giao-trinh" className="text-sm font-black text-[#FF5E3A] flex items-center gap-2 hover:underline">
              XEM TẤT CẢ <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((f, i) => (
              <Link key={i} href={f.href} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-100/20 transition-all group">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-orange-50 transition-colors flex items-center justify-center">
                    {f.icon}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${f.color === 'red' ? 'bg-red-50 text-red-500' : f.color === 'blue' ? 'bg-blue-50 text-blue-500' : 'bg-slate-100 text-slate-500'}`}>
                    {f.count}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-[#FF5E3A] transition-colors">{f.title}</h3>
                <p className="text-sm font-medium text-slate-400 leading-relaxed">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION: PDF DOWNLOAD */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900 rounded-[4rem] p-10 md:p-20 text-white flex flex-col lg:flex-row items-center gap-12 overflow-hidden relative shadow-2xl">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-[100px] -mr-48 -mt-48"></div>
            
            <div className="flex-1 text-center lg:text-left relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-white/10">
                🎁 MIỄN PHÍ TÀI LIỆU
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">
                Ebook Tổng hợp<br />
                <span className="text-[#FF5E3A]">1200 Từ vựng</span> 3.0
              </h2>
              <p className="text-slate-400 font-medium text-lg mb-10 leading-relaxed max-w-xl">
                Bộ tài liệu PDF chính thức bao gồm Hán tự, Pinyin, nghĩa và ví dụ chuẩn xác nhất cho HSK 1-2-3.
              </p>
              {user ? (
                <Link href="/dashboard" className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95">
                  TẢI EBOOK NGAY <ChevronRight size={20} />
                </Link>
              ) : (
                <Link href="/dang-ky" className="inline-flex items-center gap-3 bg-[#FF5E3A] hover:bg-[#D85A30] text-white px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95">
                  ĐĂNG KÝ TẢI NGAY <ChevronRight size={20} />
                </Link>
              )}
            </div>
            
            <div className="lg:w-1/3 relative z-10">
              <div className="w-64 h-80 bg-white rounded-[3rem] p-8 shadow-2xl rotate-3 flex flex-col items-center justify-center text-slate-900 relative">
                 <div className="w-16 h-16 bg-[#FF5E3A] rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-orange-200">
                    <FileText size={32} />
                 </div>
                 <div className="text-center">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">EBOOK 3.0</div>
                    <div className="text-xl font-black leading-tight">HSK 1-3 Complete Kit</div>
                 </div>
                 <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-slate-900 px-4 py-2 rounded-xl font-black text-xs shadow-lg -rotate-12">
                    HOT 2026
                 </div>
              </div>
              {/* Stack effect */}
              <div className="absolute inset-0 bg-orange-500/20 rounded-[3rem] -rotate-3 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="pb-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tighter">Bắt đầu ngay hôm nay?</h2>
          <p className="text-slate-400 font-medium text-lg mb-12">
            Đừng bỏ lỡ cơ hội tiếp cận nền tảng học tập tiên phong chuẩn HSK 3.0. 
            Miễn phí đăng ký - Hiệu quả tức thì.
          </p>
          <Link href="/giao-trinh" className="inline-flex items-center gap-3 bg-slate-900 hover:bg-black text-white px-12 py-5 rounded-2xl font-black text-xl shadow-2xl transition-all active:scale-95">
            MỞ KHÓA BÀI HỌC <ArrowRight size={24} />
          </Link>
        </div>
      </section>

      {/* SECTION: PRICING (PUBLIC) */}
      <section className="py-24 px-4 bg-slate-50" id="pricing">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">Bảng giá công khai</h2>
            <p className="text-slate-400 font-bold max-w-2xl mx-auto">Lựa chọn gói học phù hợp với mục tiêu của bạn.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col">
              <div className="mb-8">
                <h3 className="text-xl font-black text-gray-900 mb-2">Học viên Free</h3>
                <div className="text-4xl font-black text-gray-900">0đ<span className="text-sm text-gray-400 font-bold">/vĩnh viễn</span></div>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-sm font-bold text-gray-600">
                  <CheckCircle2 size={18} className="text-green-500" /> Bảng phát âm Pinyin
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-gray-600">
                  <CheckCircle2 size={18} className="text-green-500" /> Sổ tay cá nhân (100 từ)
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-gray-600">
                  <CheckCircle2 size={18} className="text-green-500" /> Học thử Bài 1 mọi cấp độ
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-gray-600 opacity-50">
                  <X size={18} className="text-gray-300" /> Luyện đề thi HSK
                </li>
              </ul>
              <Link href="/dang-ky" className="w-full py-4 bg-gray-100 text-gray-900 rounded-2xl font-black text-center hover:bg-gray-200 transition-all">
                ĐĂNG KÝ NGAY
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-gray-900 p-10 rounded-[40px] border-4 border-orange-500/20 shadow-2xl flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-orange-500 text-white px-6 py-2 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest">PHỔ BIẾN NHẤT</div>
              <div className="mb-8">
                <h3 className="text-xl font-black text-white mb-2">HSK 3.0 Premium</h3>
                <div className="text-4xl font-black text-white">489.000đ<span className="text-sm text-gray-400 font-bold">/6 tháng</span></div>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-sm font-bold text-gray-300">
                  <Crown size={18} className="text-yellow-400" /> Mở khóa toàn bộ 144 bài HSK
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-gray-300">
                  <Crown size={18} className="text-yellow-400" /> Nhận diện chữ viết tay AI
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-gray-300">
                  <Crown size={18} className="text-yellow-400" /> Luyện 120+ đề thi chuẩn 2026
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-gray-300">
                  <Crown size={18} className="text-yellow-400" /> Loại bỏ hoàn toàn quảng cáo
                </li>
              </ul>
              <Link href="/nang-cap" className="w-full py-4 bg-[#FF5E3A] text-white rounded-2xl font-black text-center hover:bg-[#D85A30] transition-all shadow-xl shadow-orange-900/20">
                NÂNG CẤP NGAY
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: DEMO (TRIAL) */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
             <div className="lg:w-1/2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                   🕹️ TRẢI NGHIỆM THỰC TẾ
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">Học thử không cần <br /> <span className="text-[#FF5E3A]">Đăng ký</span></h2>
                <p className="text-gray-500 text-lg font-medium mb-10 leading-relaxed">
                   Chúng tôi tin rằng trải nghiệm thực tế là cách tốt nhất để bạn đánh giá hiệu quả. 
                   Thử ngay các tính năng cao cấp của Hanzi hoàn toàn miễn phí.
                </p>
                <div className="space-y-4 mb-10">
                   {[
                     { title: 'Luyện nghe bối cảnh', desc: 'Audio chuẩn native, 3 tốc độ.' },
                     { title: 'Viết chữ Hán AI', desc: 'Sửa lỗi nét ngay lập tức.' },
                     { title: 'Flashcard SRS', desc: 'Công nghệ lặp lại ngắt quãng.' },
                   ].map((item, i) => (
                     <div key={i} className="flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0 mt-1"><CheckCircle2 size={14} /></div>
                        <div>
                           <div className="font-black text-gray-900">{item.title}</div>
                           <div className="text-sm text-gray-400 font-medium">{item.desc}</div>
                        </div>
                     </div>
                   ))}
                </div>
                <Link href="/giao-trinh/hsk1/bai-1" className="inline-flex items-center gap-2 text-[#FF5E3A] font-black uppercase tracking-widest hover:translate-x-2 transition-transform">
                   Bắt đầu bài 1 ngay <ArrowRight size={20} />
                </Link>
             </div>
             
             <div className="lg:w-1/2 relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-[40px] blur-2xl opacity-10"></div>
                <div className="relative bg-gray-900 rounded-[40px] p-4 shadow-2xl overflow-hidden aspect-video group cursor-pointer">
                   <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" alt="Demo Video" className="w-full h-full object-cover rounded-[32px] opacity-40 group-hover:scale-105 transition-transform duration-700" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all">
                         <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-gray-900 border-b-[10px] border-b-transparent ml-2"></div>
                      </div>
                   </div>
                   <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                      <div className="flex items-center justify-between text-white">
                         <div>
                            <div className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Đang xem</div>
                            <div className="font-black">Tính năng Luyện viết AI</div>
                         </div>
                         <div className="text-xs font-black bg-red-500 px-2 py-1 rounded">LIVE</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION: TESTIMONIALS (SOCIAL PROOF) */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">Học viên nói gì về Hanzi?</h2>
            <p className="text-slate-400 font-bold max-w-2xl mx-auto">Những câu chuyện thành công thực tế từ cộng đồng học viên Tiếng Trung Hongdou.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Nguyễn Minh Anh', level: 'HSK 4 (285/300)', text: 'Nhờ Hanzi mà mình đã nắm vững 500 từ vựng HSK 3.0 chỉ trong 2 tháng. Giao diện cực kỳ Wow và dễ dùng.', avatar: 'MA' },
              { name: 'Trần Hoàng Nam', level: 'HSK 3 (290/300)', text: 'Thích nhất là phần luyện viết và đề thi chấm tự động. Rất sát với thực tế đi thi tại viện Khổng Tử.', avatar: 'HN' },
              { name: 'Lê Thu Trang', level: 'HSK 5 (270/300)', text: 'Mình đã thử nhiều app nhưng chỉ Hanzi mới có giáo trình HSK 3.0 chuẩn nhất hiện nay. Rất đáng đồng tiền bát gạo!', avatar: 'TT' },
            ].map((t, i) => (
              <div key={i} className="p-10 bg-white rounded-[40px] border border-transparent hover:border-orange-100 shadow-sm hover:shadow-2xl transition-all">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center font-black text-[#D85A30]">{t.avatar}</div>
                   <div>
                      <div className="font-black text-gray-900">{t.name}</div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.level} Certified</div>
                   </div>
                </div>
                <p className="text-gray-600 font-medium leading-relaxed italic">"{t.text}"</p>
                <div className="mt-6 flex gap-1">
                   {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-yellow-400 text-yellow-400" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
