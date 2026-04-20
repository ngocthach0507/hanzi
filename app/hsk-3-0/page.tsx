import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Brain, 
  BookOpen, 
  Trophy, 
  Target,
  ChevronRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "HSK 3.0 là gì? So sánh HSK 2.0 & 3.0 và Lộ trình 9 cấp độ mới nhất | Hanzi",
  description: "Chuẩn HSK 3.0 (2026) có gì mới? So sánh chi tiết HSK 6 cấp và 9 cấp. Lộ trình học 11,092 từ vựng, 144 bài hội thoại chuẩn quốc tế dành riêng cho người Việt.",
  openGraph: {
    title: "HSK 3.0 là gì? Mọi điều cần biết về chuẩn tiếng Trung mới 2026",
    description: "Khám phá lộ trình chinh phục 9 cấp độ HSK 3.0 chuẩn 2026 tại Hanzi.io.vn.",
    images: ['https://hanzi.io.vn/og-hsk30.jpg'],
  },
};

export default function HSK30Landing() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "HSK 3.0 là gì?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "HSK 3.0 là tiêu chuẩn đánh giá năng lực Hán ngữ mới nhất của Trung Quốc, được chia làm 9 cấp độ thay vì 6 cấp độ như trước đây."
                }
              },
              {
                "@type": "Question",
                "name": "Khi nào HSK 3.0 chính thức áp dụng tại Việt Nam?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Theo lộ trình, chuẩn HSK 3.0 sẽ bắt đầu được áp dụng rộng rãi từ tháng 7/2026."
                }
              },
              {
                "@type": "Question",
                "name": "Tôi có thể dùng tài liệu HSK cũ để thi HSK 3.0 không?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Rất khó, vì lượng từ vựng và cấu trúc ngữ pháp của chuẩn 3.0 tăng lên đáng kể (gấp đôi chuẩn cũ)."
                }
              }
            ]
          })
        }}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-orange-50/50 to-white -z-10"></div>
        <div className="absolute top-20 right-[-10%] w-[600px] h-[600px] bg-orange-200/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-[#D85A30] rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8 animate-bounce">
            <Sparkles size={16} fill="currentColor" /> First in Vietnam
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 tracking-tighter leading-tight">
            Chinh phục <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D85A30] to-[#FF8C00]">HSK 3.0</span><br />
            Chuẩn giáo trình 2026
          </h1>
          
          <p className="max-w-3xl mx-auto text-xl text-gray-500 font-medium leading-relaxed mb-12">
            Đừng để bản thân bị tụt hậu. Hanzi.io.vn là nền tảng duy nhất tại Việt Nam tích hợp trọn bộ 
            nội dung học tập theo chuẩn HSK 3.0 mới nhất — Hiệu lực chính thức từ tháng 7/2026.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/giao-trinh/hsk1/bai-1" className="w-full sm:w-auto px-12 py-5 bg-gray-900 text-white rounded-[24px] font-black text-lg shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3">
              HỌC MIỄN PHÍ NGAY <ArrowRight size={20} />
            </Link>
            <Link href="#so-sanh" className="w-full sm:w-auto px-12 py-5 bg-white text-gray-900 border-2 border-gray-100 rounded-[24px] font-black text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-3">
              TÌM HIỂU HSK 3.0 <Zap size={20} fill="currentColor" />
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
             {[
               { label: '9 Cấp độ', desc: 'Từ cơ bản đến chuyên gia', icon: <Target className="text-blue-500" /> },
               { label: '144 Hội thoại', desc: '100% bản chuẩn HSK', icon: <BookOpen className="text-green-500" /> },
               { label: '11,092 Từ vựng', desc: 'Đầy đủ pinyin & dịch', icon: <Zap className="text-yellow-500" /> },
               { label: 'Interactive', desc: 'Luyện tập 3D thực tế', icon: <Brain className="text-purple-500" /> },
             ].map((stat, i) => (
               <div key={i} className="text-center">
                  <div className="w-12 h-12 bg-white shadow-lg rounded-2xl flex items-center justify-center mx-auto mb-4">{stat.icon}</div>
                  <div className="font-black text-gray-900">{stat.label}</div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{stat.desc}</div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Why HSK 3.0 Section */}
      <section className="py-24 bg-gray-50" id="so-sanh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">
                Tại sao bạn cần chuyển sang <span className="text-[#D85A30]">HSK 3.0</span> ngay hôm nay?
              </h2>
              <div className="space-y-6">
                {[
                  { title: 'Tiêu chuẩn quốc tế mới', text: 'HSK 3.0 (2026) thay thế hoàn toàn chuẩn 2.0 cũ với 9 cấp độ chi tiết hơn.' },
                  { title: 'Tăng cường kỹ năng thực tế', text: 'Tập trung vào giao tiếp, đọc hiểu và viết thay vì chỉ học thuộc lòng.' },
                  { title: 'Lợi thế khi du học & việc làm', text: 'Chứng chỉ HSK 3.0 sẽ là yêu cầu bắt buộc tại các trường đại học Trung Quốc từ 2026.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-6 bg-white rounded-3xl shadow-sm border border-gray-100 group hover:border-orange-200 transition-all">
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#D85A30] group-hover:scale-110 transition-transform">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
               <div className="absolute -inset-4 bg-gradient-to-tr from-orange-400 to-yellow-300 rounded-[48px] blur-2xl opacity-20"></div>
               <div className="relative bg-white p-12 rounded-[48px] shadow-2xl border border-gray-100">
                  <h3 className="text-2xl font-black text-gray-900 mb-8 text-center uppercase tracking-[0.1em]">Bảng so sánh lộ trình</h3>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <span className="font-black text-gray-500">Tiêu chí</span>
                        <span className="font-black text-gray-900">HSK 2.0 (Cũ)</span>
                        <span className="font-black text-[#D85A30]">HSK 3.0 (Mới)</span>
                     </div>
                     {[
                       ['Số cấp độ', '6 Cấp', '9 Cấp (3 Sơ - 3 Trung - 3 Cao)'],
                       ['Từ vựng', '5,000 từ', '11,092 từ'],
                       ['Hán tự', '2,663 chữ', '3,000 chữ'],
                       ['Kỹ năng', 'Nghe, Đọc, Viết', 'Nghe, Nói, Đọc, Viết, Dịch'],
                     ].map((row, i) => (
                       <div key={i} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0">
                          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{row[0]}</span>
                          <span className="text-sm font-bold text-gray-400">{row[1]}</span>
                          <span className="text-sm font-black text-gray-900">{row[2]}</span>
                       </div>
                     ))}
                  </div>
                  <div className="mt-8 p-6 bg-orange-50 rounded-3xl text-center">
                     <p className="text-[#D85A30] font-black text-sm italic">"HSK 3.0 không chỉ là kỳ thi, đó là tiêu chuẩn ngôn ngữ toàn diện."</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Trải nghiệm học tập <span className="text-[#D85A30]">Đẳng cấp</span></h2>
          <p className="text-gray-500 font-medium text-lg">Chúng tôi không chỉ cung cấp dữ liệu, chúng tôi cung cấp giải pháp ghi nhớ vĩnh viễn.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
           {[
             { title: 'Database Độc quyền', text: '144 bài hội thoại HSK 3.0 đầy đủ pinyin, dịch nghĩa và audio chuẩn.', icon: <ShieldCheck className="text-green-500" /> },
             { title: 'Luyện tập Interactive', desc: 'Không còn những trang giấy tĩnh. Flashcard, Quiz và bài tập điền từ 3D giúp bạn nhớ từ vựng ngay lập tức.', icon: < Zap className="text-orange-500" /> },
             { title: 'Lộ trình Cá nhân hóa', text: 'Hệ thống tự động theo dõi tiến độ và gợi ý các bài học phù hợp với trình độ của bạn.', icon: <Award className="text-blue-500" /> },
           ].map((feature, i) => (
             <div key={i} className="p-10 bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-orange-100 transition-all group">
                <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-orange-50 transition-colors">
                   {feature.icon}
                </div>
                <h4 className="text-2xl font-black text-gray-900 mb-4">{feature.title}</h4>
                <p className="text-gray-500 font-medium leading-relaxed">{feature.text || feature.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-gray-900 rounded-[56px] p-12 md:p-24 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-20"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-10"></div>
           
           <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight relative z-10">
              Bắt đầu hành trình <br /> <span className="text-[#D85A30]">HSK 3.0</span> của bạn ngay
           </h2>
           <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto relative z-10 font-medium">
              Đăng ký tài khoản miễn phí để truy cập kho từ vựng HSK 1 và trải nghiệm công cụ học tập tiên tiến nhất Việt Nam.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
              <Link href="/tu-vung-hsk" className="w-full sm:w-auto px-12 py-5 bg-[#D85A30] text-white rounded-[24px] font-black text-lg hover:scale-105 transition-all shadow-xl shadow-orange-900/20">
                 HỌC THỬ NGAY
              </Link>
              <Link href="/nang-cap" className="w-full sm:w-auto px-12 py-5 bg-white/10 text-white rounded-[24px] font-black text-lg hover:bg-white/20 transition-all border border-white/10 backdrop-blur-md">
                 NÂNG CẤP PREMIUM
              </Link>
           </div>
        </div>
      </section>

      {/* Footer / FAQ Schema trigger */}
      <section className="py-24 border-t border-gray-100">
         <div className="max-w-4xl mx-auto px-4">
            <h3 className="text-2xl font-black text-gray-900 mb-12 text-center uppercase tracking-widest">Câu hỏi thường gặp (FAQ)</h3>
            <div className="space-y-4">
               {[
                 { q: 'HSK 3.0 là gì?', a: 'HSK 3.0 là tiêu chuẩn đánh giá năng lực Hán ngữ mới nhất của Trung Quốc, được chia làm 9 cấp độ thay vì 6 cấp độ như trước đây.' },
                 { q: 'Khi nào HSK 3.0 chính thức áp dụng tại Việt Nam?', a: 'Theo lộ trình, chuẩn HSK 3.0 sẽ bắt đầu được áp dụng rộng rãi từ tháng 7/2026.' },
                 { q: 'Tôi có thể dùng tài liệu HSK cũ để thi HSK 3.0 không?', a: 'Rất khó, vì lượng từ vựng và cấu trúc ngữ pháp của chuẩn 3.0 tăng lên đáng kể (gấp đôi chuẩn cũ).' }
               ].map((item, i) => (
                 <div key={i} className="p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-gray-200 transition-all cursor-pointer group">
                    <div className="flex items-center justify-between">
                       <h5 className="font-black text-gray-900">{item.q}</h5>
                       <ChevronRight size={20} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="mt-4 text-gray-500 font-medium text-sm leading-relaxed">{item.a}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
}
