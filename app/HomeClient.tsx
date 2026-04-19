"use client";

import React from 'react';
import Link from 'next/link';
import { 
  BookText, 
  LayoutGrid, 
  MessageSquare, 
  Zap, 
  Languages, 
  FileText, 
  PenTool,
  Check,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Award,
  Users,
  MessageCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';

export default function HomeClient() {
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

  return (
    <>
      {/* SECTION 1: HERO HSK 3.0 - CONSOLIDATED CTA */}
      <section className="relative pt-12 pb-24 px-4 bg-mesh overflow-hidden">
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-100/20 rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-[#D85A30] text-[11px] font-black mb-8 shadow-sm">
            <span className="bg-[#D85A30] p-0.5 px-2 rounded text-white text-[9px] font-black animate-pulse">LIVE BETA</span>
            CHƯƠNG TRÌNH BETA — MIỄN PHÍ CHO 100 HỌC VIÊN ĐẦU TIÊN
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight text-slate-900">
            Học Tiếng Trung <span className="text-[#D85A30]">HSK 3.0</span><br />
            Lộ trình thực chiến cho người Việt
          </h1>
          
          <p className="text-slate-500 font-medium mb-12 max-w-2xl mx-auto leading-relaxed text-lg md:text-xl">
            Nền tảng học thông minh từ hệ sinh thái <strong>Tiếng Trung Hongdou</strong>. 
            Học thử ngay Bài 1 (Cấp độ 1-3) hoàn toàn miễn phí, không cần tài khoản.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {/* CONSOLIDATED PRIMARY CTA */}
            <Link href="/giao-trinh/hsk1/bai-1" className="group bg-[#D85A30] hover:bg-[#B54825] text-white px-16 py-6 rounded-3xl font-black text-2xl shadow-2xl shadow-orange-200 transition-all active:scale-95 flex flex-col items-center gap-1 border-4 border-orange-100/50">
              <div className="flex items-center gap-3">
                🚀 HỌC THỬ BÀI 1 NGAY <ArrowRight size={28} className="group-hover:translate-x-1 transition-transform" />
              </div>
              <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Không cần đăng ký • Hoàn thành trong 5 phút</span>
            </Link>

            {/* DEMO BUTTON */}
            <button 
              onClick={() => {
                const videoSection = document.getElementById('features-demo');
                if (videoSection) videoSection.scrollIntoView({ behavior: 'smooth' });
                else alert('Video Demo đang được đội ngũ Hongdou hoàn thiện. Bạn hãy trải nghiệm trực tiếp qua nút "Học thử" nhé!');
              }}
              className="px-10 py-6 bg-white text-gray-900 border-2 border-gray-100 rounded-3xl font-black text-xl hover:bg-gray-50 transition-all flex items-center gap-3 shadow-sm"
            >
              Xem Demo <Sparkles size={20} className="text-orange-400" />
            </button>
          </div>
          
          <div className="mt-16 flex flex-wrap items-center justify-center gap-12 opacity-100">
             <div className="flex flex-col items-center gap-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
                <span className="text-3xl font-black text-slate-900">HSK 1-3</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lộ trình hiện tại</span>
             </div>
             <div className="flex flex-col items-center gap-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
                <span className="text-3xl font-black text-slate-900">100%</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chuẩn HSK 3.0 mới</span>
             </div>
             <div className="flex flex-col items-center gap-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
                <span className="text-3xl font-black text-slate-900">Hongdou</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Đội ngũ biên soạn</span>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION: REAL TEACHER INFO (REPLACING FAKE TRUST SIGNALS) */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/5] bg-gray-100 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1544717297-fa154da09f5b?q=80&w=2070&auto=format&fit=crop" 
                  alt="Giáo viên Hongdou" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl max-w-xs">
                <h3 className="text-xl font-black mb-2 uppercase">Đội ngũ Hongdou</h3>
                <p className="text-sm text-slate-400 font-medium">Giảng viên từ các trường Đại học ngôn ngữ hàng đầu, cam kết nội dung chuẩn thực chiến.</p>
              </div>
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Không có học viên "ảo", <br />
                chỉ có <span className="text-[#D85A30]">kết quả thật.</span>
              </h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Hanzi không dùng những con số "5.000+" hay "48.000" ảo. Chúng tôi tập trung vào 100 học viên đầu tiên trong giai đoạn Beta để tinh chỉnh trải nghiệm tốt nhất.
              </p>
              <div className="space-y-6">
                {[
                  'Nội dung do đội ngũ Tiếng Trung Hongdou trực tiếp biên soạn.',
                  'Hệ thống AI nhận diện chữ viết tay độc quyền cho người Việt.',
                  'Lộ trình bám sát 100% chuẩn HSK 3.0 (9 cấp độ) mới nhất.'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center mt-1 shrink-0">
                      <Check size={14} className="text-green-600" />
                    </div>
                    <span className="font-bold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: FEATURES GRID - REMOVED "XEM TẤT CẢ" */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">Hệ sinh thái học tập</h2>
            <p className="text-slate-400 font-bold mt-2">Mọi công cụ bạn cần để làm chủ tiếng Trung.</p>
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
                <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-[#D85A30] transition-colors">{f.title}</h3>
                <p className="text-sm font-medium text-slate-400 leading-relaxed">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: EBOOK - SMALLER, SECONDARY CTA */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center gap-8 overflow-hidden relative border border-white/5">
            <div className="flex-1 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 border border-white/10">
                🎁 TẶNG EBOOK 3.0
              </div>
              <h2 className="text-2xl md:text-4xl font-black mb-4 leading-tight">
                Bộ <span className="text-[#D85A30]">1200 Từ vựng</span> HSK 1-3
              </h2>
              <p className="text-slate-400 font-medium text-sm mb-6 max-w-md">
                Tài liệu PDF tổng hợp đầy đủ Hán tự, Pinyin, nghĩa và ví dụ chuẩn xác nhất cho giáo trình mới.
              </p>
              
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
                  if (!email) return;
                  
                  try {
                    await fetch('/api/leads', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email, source: 'ebook_landing' })
                    });
                    alert('Hanzi đã nhận email của bạn! Hãy kiểm tra hộp thư (bao gồm cả thư rác) để nhận Ebook nhé.');
                    (e.target as HTMLFormElement).reset();
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="flex flex-col sm:flex-row gap-3 max-w-md"
              >
                <input 
                  name="email"
                  type="email" 
                  required
                  placeholder="Email của bạn" 
                  className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D85A30]"
                />
                <button type="submit" className="inline-flex items-center justify-center gap-3 bg-[#D85A30] hover:bg-[#B54825] text-white px-8 py-4 rounded-xl font-black text-sm transition-all shadow-xl active:scale-95 whitespace-nowrap">
                  NHẬN EBOOK <ChevronRight size={16} />
                </button>
              </form>
            </div>
            
            <div className="md:w-1/4 relative z-10 hidden md:block">
              <div className="w-40 h-52 bg-white rounded-[2rem] p-6 shadow-2xl rotate-6 flex flex-col items-center justify-center text-slate-900">
                 <div className="w-12 h-12 bg-[#D85A30] rounded-xl flex items-center justify-center text-white mb-4">
                    <FileText size={24} />
                 </div>
                 <div className="text-center">
                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">EBOOK 3.0</div>
                    <div className="text-sm font-black leading-tight">HSK 1-3 Kit</div>
                 </div>
              </div>
            </div>
        </div>
      </section>

      {/* SECTION: PRICING - ORIGINAL 4 PLANS */}
      <section id="pricing" className="py-24 px-4 bg-slate-50 border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">Chọn gói phù hợp với <span className="text-blue-600">nhịp học</span> của bạn</h2>
            <p className="text-slate-500 font-medium flex items-center justify-center gap-2">
              <ShieldCheck size={18} className="text-green-500" /> Không giới hạn tính năng ở mọi gói
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {/* GÓI 1 THÁNG */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 flex flex-col h-full hover:shadow-xl transition-all">
              <div className="mb-8">
                <h3 className="text-blue-600 font-black text-sm uppercase tracking-widest mb-4">Gói 1 tháng</h3>
                <div className="text-slate-400 text-[10px] font-bold uppercase mb-2">Toàn bộ tính năng Premium</div>
                <div className="text-3xl font-black text-slate-900">119.000đ</div>
                <div className="text-[10px] text-slate-400 font-bold mt-1">~119.000đ/tháng</div>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {['Loại bỏ quảng cáo', 'Giáo trình Hán ngữ', 'Luyện đề thi HSK', 'Kiểm tra từ vựng', 'Học bài nghe HSK', 'Bài hội thoại theo chủ đề', 'Nhận diện chữ viết tay'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-500 font-medium text-[11px]">
                    <Check size={14} className="text-slate-300" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/nang-cap" className="w-full py-4 bg-slate-50 text-slate-900 rounded-2xl font-black text-xs text-center hover:bg-slate-100 transition-all">CHỌN GÓI NÀY</Link>
            </div>

            {/* GÓI 3 THÁNG */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 flex flex-col h-full hover:shadow-xl transition-all">
              <div className="mb-8">
                <h3 className="text-blue-600 font-black text-sm uppercase tracking-widest mb-4">Gói 3 tháng</h3>
                <div className="text-slate-400 text-[10px] font-bold uppercase mb-2">Toàn bộ tính năng Premium</div>
                <div className="text-3xl font-black text-slate-900 mb-2">289.000đ <span className="text-xs text-slate-300 line-through">357.000đ</span></div>
                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-500 text-white text-[9px] font-black rounded-md mb-2">-19% <span className="opacity-80">Tiết kiệm 68.000đ</span></div>
                <div className="text-[10px] text-slate-400 font-bold mt-1">~96.333đ/tháng</div>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {['Loại bỏ quảng cáo', 'Giáo trình Hán ngữ', 'Luyện đề thi HSK', 'Kiểm tra từ vựng', 'Học bài nghe HSK', 'Bài hội thoại theo chủ đề', 'Nhận diện chữ viết tay'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-500 font-medium text-[11px]">
                    <Check size={14} className="text-slate-300" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/nang-cap" className="w-full py-4 bg-slate-50 text-slate-900 rounded-2xl font-black text-xs text-center hover:bg-slate-100 transition-all">CHỌN GÓI NÀY</Link>
            </div>

            {/* GÓI 6 THÁNG (POPULAR) */}
            <div className="bg-white rounded-[2.5rem] p-8 border-2 border-blue-500 flex flex-col h-full shadow-2xl shadow-blue-100 relative scale-105 z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-400 to-orange-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1 whitespace-nowrap">
                <Sparkles size={10} fill="white" /> PHỔ BIẾN NHẤT
              </div>
              <div className="mb-8">
                <h3 className="text-blue-600 font-black text-sm uppercase tracking-widest mb-4">Gói 6 tháng</h3>
                <div className="text-slate-400 text-[10px] font-bold uppercase mb-2">Toàn bộ tính năng Premium</div>
                <div className="text-4xl font-black text-[#D85A30] mb-2">489.000đ <span className="text-xs text-slate-300 line-through">714.000đ</span></div>
                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-500 text-white text-[9px] font-black rounded-md mb-2">32% <span className="opacity-80">Tiết kiệm 225.000đ</span></div>
                <div className="text-[10px] text-slate-400 font-bold mt-1">~81.500đ/tháng</div>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {['Loại bỏ quảng cáo', 'Giáo trình Hán ngữ', 'Luyện đề thi HSK', 'Kiểm tra từ vựng', 'Học bài nghe HSK', 'Bài hội thoại theo chủ đề', 'Nhận diện chữ viết tay'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-bold text-[11px]">
                    <Check size={14} className="text-blue-500" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/nang-cap" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs text-center transition-all shadow-lg shadow-blue-200 uppercase tracking-widest">ĐĂNG KÝ NGAY</Link>
            </div>

            {/* GÓI 1 NĂM */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 flex flex-col h-full hover:shadow-xl transition-all">
              <div className="mb-8">
                <h3 className="text-blue-600 font-black text-sm uppercase tracking-widest mb-4">Gói 1 năm</h3>
                <div className="text-slate-400 text-[10px] font-bold uppercase mb-2">Toàn bộ tính năng Premium</div>
                <div className="text-3xl font-black text-slate-900 mb-2">689.000đ <span className="text-xs text-slate-300 line-through">1.428.000đ</span></div>
                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-500 text-white text-[9px] font-black rounded-md mb-2">-52% <span className="opacity-80">Tiết kiệm 739.000đ</span></div>
                <div className="text-[10px] text-slate-400 font-bold mt-1">~57.417đ/tháng</div>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {['Loại bỏ quảng cáo', 'Giáo trình Hán ngữ', 'Luyện đề thi HSK', 'Kiểm tra từ vựng', 'Học bài nghe HSK', 'Bài hội thoại theo chủ đề', 'Nhận diện chữ viết tay'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-500 font-medium text-[11px]">
                    <Check size={14} className="text-slate-300" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/nang-cap" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs text-center hover:bg-black transition-all">CHỌN GÓI NÀY</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA - REPEAT PRIMARY */}
      <section className="py-24 px-4 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tighter">Sẵn sàng để thử ngay?</h2>
          <p className="text-slate-400 font-medium text-lg mb-12">
            Trải nghiệm Bài 1 giáo trình HSK 3.0 mới nhất trong 5 phút. 
            Không cần đăng ký, không cần cam kết.
          </p>
          <Link href="/giao-trinh/hsk1/bai-1" className="inline-flex items-center gap-3 bg-slate-900 hover:bg-black text-white px-12 py-5 rounded-2xl font-black text-xl shadow-2xl transition-all active:scale-95">
            HỌC BÀI 1 NGAY <ArrowRight size={24} />
          </Link>
        </div>
      </section>
    </>
  );
}
