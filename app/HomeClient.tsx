"use client";

import React, { useState } from 'react';
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
  ChevronRight,
  X,
  Mail
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';

export default function HomeClient() {
  const { user } = useUser();
  const [isBetaModalOpen, setIsBetaModalOpen] = useState(false);
  
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
          <button 
            onClick={() => setIsBetaModalOpen(true)}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-[#D85A30] text-[11px] font-black mb-8 shadow-[0_0_15px_rgba(216,90,48,0.1)] hover:shadow-[0_0_20px_rgba(216,90,48,0.3)] hover:scale-105 transition-all animate-bounce-slow"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D85A30]"></span>
            </span>
            <span className="bg-[#D85A30] p-0.5 px-2 rounded text-white text-[9px] font-black">TRẢI NGHIỆM</span>
            CHƯƠNG TRÌNH TRẢI NGHIỆM MIỄN PHÍ — CÙNG HANZI HOÀN THIỆN
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
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
            <Link href="/giao-trinh" className="group bg-[#D85A30] hover:bg-[#B54825] text-white px-8 py-4 md:px-16 md:py-6 rounded-3xl font-black text-xl md:text-2xl shadow-2xl shadow-orange-200 transition-all active:scale-95 flex flex-col items-center gap-1 border-4 border-orange-100/50">
              <div className="flex items-center gap-3 text-center">
                🚀 HỌC MIỄN PHÍ NGAY <ArrowRight className="w-6 h-6 md:w-[28px] md:h-[28px] group-hover:translate-x-1 transition-transform" />
              </div>
              <span className="text-[9px] md:text-[10px] font-bold opacity-80 uppercase tracking-widest text-center mt-1">Khám phá lộ trình HSK 3.0 phù hợp với bạn</span>
            </Link>

            {/* DEMO BUTTON */}
            <button 
              onClick={() => {
                const videoSection = document.getElementById('features-demo');
                if (videoSection) videoSection.scrollIntoView({ behavior: 'smooth' });
                else alert('Video Demo đang được đội ngũ Hongdou hoàn thiện. Bạn hãy trải nghiệm trực tiếp qua nút "Học thử" nhé!');
              }}
              className="px-8 py-4 md:px-10 md:py-6 bg-white text-gray-900 border-2 border-gray-100 rounded-3xl font-black text-lg md:text-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3 shadow-sm w-full sm:w-auto"
            >
              Xem Demo <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
            </button>
          </div>
          
          <div className="mt-16 flex flex-wrap items-center justify-center gap-12 opacity-100">
             <div className="flex flex-col items-center gap-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-50 min-w-[200px]">
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-[#D85A30]" />
                </div>
                <span className="text-2xl font-black text-slate-900">144 Bài</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">HSK 3.0 (Cập nhật hàng tuần)</span>
             </div>
             <div className="flex flex-col items-center gap-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-50 min-w-[200px]">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                  <Award size={20} className="text-green-600" />
                </div>
                <span className="text-2xl font-black text-slate-900">Cam kết</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Đầu ra từ 0 → HSK 3</span>
             </div>
             <div className="flex flex-col items-center gap-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-50 min-w-[200px]">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <MessageCircle size={20} className="text-blue-600" />
                </div>
                <span className="text-2xl font-black text-slate-900">Hỗ trợ 1-1</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Qua Zalo trong bản Beta</span>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION: EXPERT TEAM */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">Bảo chứng <span className="text-[#D85A30]">Chất lượng</span></h2>
            <p className="text-slate-500 font-medium text-lg mt-4 max-w-2xl mx-auto">
              Nội dung trên Hanzi được nghiên cứu và biên soạn trực tiếp bởi đội ngũ chuyên gia học thuật hàng đầu từ hệ sinh thái Tiếng Trung Hongdou.
            </p>
          </div>

          <div className="bg-slate-50 rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-sm relative overflow-hidden">
             {/* Background decorative elements */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
             
             <div className="relative z-10 grid sm:grid-cols-2 gap-8 lg:gap-12">
                <div className="flex gap-4">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-[#D85A30]">
                      <Users size={24} />
                   </div>
                   <div>
                      <h3 className="font-black text-slate-900 text-lg mb-2">Thạc sỹ & Cử nhân xuất sắc</h3>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed">
                        Đội ngũ học thuật tốt nghiệp từ các trường Đại học Sư phạm hàng đầu tại Trung Quốc (ĐH Sư phạm Hoa Đông,...) và Việt Nam (ĐHQGHN).
                      </p>
                   </div>
                </div>

                <div className="flex gap-4">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-blue-500">
                      <Award size={24} />
                   </div>
                   <div>
                      <h3 className="font-black text-slate-900 text-lg mb-2">Dày dặn kinh nghiệm</h3>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed">
                        Hơn 8 năm kinh nghiệm đào tạo Hán ngữ chuyên sâu và luyện thi HSK/HSKK cao cấp, từng đồng hành cùng hàng ngàn học viên đỗ đạt.
                      </p>
                   </div>
                </div>

                <div className="flex gap-4">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-green-500">
                      <BookText size={24} />
                   </div>
                   <div>
                      <h3 className="font-black text-slate-900 text-lg mb-2">Chuyên gia chuẩn HSK 3.0</h3>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed">
                        Nghiên cứu và phân tích sâu sắc tiêu chuẩn HSK 3.0 mới nhất, đảm bảo giáo trình cung cấp luôn chuẩn xác, khoa học và đi trước thời đại.
                      </p>
                   </div>
                </div>

                <div className="flex gap-4">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-purple-500">
                      <ShieldCheck size={24} />
                   </div>
                   <div>
                      <h3 className="font-black text-slate-900 text-lg mb-2">Bảo chứng chất lượng</h3>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed">
                        Mọi bài học, từ vựng, và cấu trúc ngữ pháp trên hệ thống đều được kiểm duyệt gắt gao nhiều vòng trước khi xuất bản tới tay người dùng.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION: REAL DEMO - AI WRITING PREVIEW */}
      <section id="features-demo" className="py-24 px-4 bg-slate-900 overflow-hidden">
         <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
               <div className="space-y-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[#D85A30] text-[10px] font-black uppercase tracking-widest border border-white/10">
                     <Sparkles size={12} fill="#D85A30" /> CÔNG NGHỆ ĐỘC QUYỀN
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                     Nhận diện chữ viết tay <br />
                     <span className="text-[#D85A30]">Chính xác từng nét vẽ</span>
                  </h2>
                  <p className="text-slate-400 font-medium text-lg leading-relaxed">
                     Không chỉ là gõ phím. Hanzi giúp bạn làm chủ 214 bộ thủ và cách viết Hán tự chuẩn xác nhất thông qua công nghệ AI nhận diện nét vẽ thời gian thực.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                     <div className="flex items-center gap-2 text-white/80 font-bold text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div> Đếm nét vẽ
                     </div>
                     <div className="flex items-center gap-2 text-white/80 font-bold text-sm">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div> Sửa lỗi sai ngay lập tức
                     </div>
                     <div className="flex items-center gap-2 text-white/80 font-bold text-sm">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div> Hiển thị thứ tự nét (Stroke Order)
                     </div>
                  </div>
               </div>

               <div className="relative group">
                  {/* REAL-LOOKING APP MOCKUP */}
                  <div className="bg-[#1A1F2E] rounded-[3rem] p-4 md:p-6 shadow-2xl border-4 border-white/10 relative z-10 transform lg:rotate-2 group-hover:rotate-0 transition-transform duration-700">
                     <div className="bg-white rounded-[2rem] overflow-hidden aspect-video relative">
                        {/* SIMULATED AI STROKE - SEQUENTIAL DRAWING */}
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                           <div className="relative w-48 h-48 border-2 border-dashed border-gray-200 flex items-center justify-center">
                              <span className="text-8xl text-gray-100 font-serif opacity-30">汉</span>
                              {/* Animated SVG Strokes for '汉' */}
                              <svg className="absolute inset-0 w-full h-full p-4 pointer-events-none" viewBox="0 0 100 100">
                                 {/* Dot 1 (Top Left) */}
                                 <path d="M25 35 Q30 35 32 40" fill="none" stroke="#D85A30" strokeWidth="4" strokeLinecap="round" className="animate-stroke stroke-delay-1" />
                                 {/* Dot 2 (Middle Left) */}
                                 <path d="M22 55 Q27 55 29 60" fill="none" stroke="#D85A30" strokeWidth="4" strokeLinecap="round" className="animate-stroke stroke-delay-2" />
                                 {/* Dot 3 (Bottom Left - Ti) */}
                                 <path d="M20 85 L35 70" fill="none" stroke="#D85A30" strokeWidth="4" strokeLinecap="round" className="animate-stroke stroke-delay-3" />
                                 {/* Right Side - Top (Heng-Pie) */}
                                 <path d="M45 35 L85 35 L45 85" fill="none" stroke="#D85A30" strokeWidth="4" strokeLinecap="round" className="animate-stroke stroke-delay-4" />
                                 {/* Right Side - Diagonal (Na) */}
                                 <path d="M55 50 L85 85" fill="none" stroke="#D85A30" strokeWidth="4" strokeLinecap="round" className="animate-stroke stroke-delay-5" />
                              </svg>
                           </div>
                        </div>
                        {/* UI Overlay */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                           <div className="px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-full text-white text-[8px] font-black uppercase">HSK 1: Bài 1</div>
                           <div className="flex gap-2">
                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                           </div>
                        </div>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full text-[10px] font-black shadow-lg animate-pulse">
                           KẾT QUẢ: CHÍNH XÁC! ✨
                        </div>
                     </div>
                  </div>
                  {/* Decorative Glow */}
                  <div className="absolute -inset-10 bg-[#D85A30]/20 blur-[100px] rounded-full opacity-50"></div>
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
            Khám phá lộ trình giáo trình HSK 3.0 mới nhất. 
            Không cần đăng ký, bắt đầu học ngay.
          </p>
          <Link href="/giao-trinh" className="inline-flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white px-8 py-4 md:px-12 md:py-5 rounded-2xl font-black text-lg md:text-xl shadow-2xl transition-all active:scale-95 w-full sm:w-auto">
            HỌC MIỄN PHÍ NGAY <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* BETA ACCESS MODAL */}
      {isBetaModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto scrollbar-hide">
          <div className="flex min-h-full items-center justify-center p-4 md:p-10">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300 transition-opacity" onClick={() => setIsBetaModalOpen(false)}></div>
            <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 border border-orange-100 my-8 md:my-12 overflow-hidden">
              {/* Header with Background */}
              <div className="relative h-32 bg-gradient-to-br from-[#FF5E3A] to-[#D85A30] p-8 overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                 <div className="relative z-10 flex items-center gap-4 pr-8">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30 animate-bounce-slow shrink-0">
                       <Zap size={24} className="text-white fill-white" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">Trải nghiệm Miễn phí</h3>
                      <p className="text-white/70 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Cùng xây dựng cộng đồng học HSK 3.0</p>
                    </div>
                 </div>
                 <button onClick={() => setIsBetaModalOpen(false)} className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-white/20 rounded-full hover:bg-white/40 text-white transition-all z-10"><X size={20} /></button>
              </div>

              <div className="p-6 md:p-10">
                <div className="space-y-6">
                  <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                     <p className="text-slate-800 font-bold text-sm leading-relaxed text-center">
                       Hanzi đang trong giai đoạn phát triển và mong muốn nhận được ý kiến đóng góp từ cộng đồng. Chúng tôi dành tặng <span className="text-[#D85A30]">Quyền trải nghiệm Premium Miễn phí</span> cho tất cả các bạn tham gia thử nghiệm!
                     </p>
                  </div>

                  <div className="space-y-5">
                     <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                           <Sparkles className="text-blue-600 w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-base font-black text-slate-900 mb-1">1. Mở khóa toàn bộ tính năng</p>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            Đăng ký tài khoản và gửi email tới <span className="font-black text-[#D85A30]">xiaohongdouht@gmail.com</span> với tiêu đề <span className="font-black italic">"Trải nghiệm Hanzi - [Email của bạn]"</span> để Admin kích hoạt gói Premium miễn phí.
                          </p>
                        </div>
                     </div>

                     <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
                           <MessageCircle className="text-green-600 w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-base font-black text-slate-900 mb-1">2. Kiểm tra & Báo lỗi</p>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            Hãy sử dụng Hanzi như công cụ học tập hằng ngày. Nếu gặp lỗi hiển thị, sai đáp án hay có ý tưởng hay, đừng ngần ngại gửi Email hoặc nhắn tin đóng góp cho tụi mình nhé!
                          </p>
                        </div>
                     </div>

                     <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 border border-rose-100">
                           <svg className="w-5 h-5 text-rose-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        </div>
                        <div>
                          <p className="text-base font-black text-slate-900 mb-1">3. Ủng hộ tinh thần (Tùy tâm)</p>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            Team duy trì máy chủ tự túc. Nếu dự án giúp ích được cho lộ trình học HSK của bạn, một lời động viên hay một phần "ủng hộ tinh thần" nhỏ sẽ là động lực cực kỳ to lớn đối với team!
                          </p>
                        </div>
                     </div>
                  </div>

                  <div className="pt-6 flex flex-col sm:flex-row gap-3">
                     <a 
                       href="mailto:xiaohongdouht@gmail.com?subject=Đăng ký Trải nghiệm Hanzi&body=Chào Admin, mình đã tạo tài khoản và muốn đăng ký trải nghiệm Full tính năng. Email của mình là: " 
                       className="flex-1 bg-[#D85A30] hover:bg-[#B54825] text-white px-6 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-100 transition-all active:scale-95"
                     >
                       <Mail size={18} /> GỬI EMAIL ĐĂNG KÝ
                     </a>
                     <button 
                       onClick={() => setIsBetaModalOpen(false)}
                       className="px-6 py-4 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all"
                     >
                       ĐỂ SAU
                     </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
