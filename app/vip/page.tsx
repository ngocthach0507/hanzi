"use client";

import React from 'react';
import { 
  Crown, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  MessageSquare, 
  FileText, 
  PlayCircle, 
  Headphones,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function VIPUpgradePage() {
  const plans = [
    {
      name: 'Gói Tháng',
      price: '199.000đ',
      duration: '/tháng',
      description: 'Phù hợp để trải nghiệm đầy đủ tính năng trong thời gian ngắn.',
      features: [
        'Mở khóa 100% bài học HSK 1-6',
        'Luyện hội thoại AI không giới hạn',
        'Kho đề thi thử 2026 đầy đủ',
        'Giải thích ngữ pháp chuyên sâu'
      ],
      color: 'bg-white',
      buttonColor: 'bg-gray-900',
      popular: false
    },
    {
      name: 'Gói Năm',
      price: '990.000đ',
      duration: '/năm',
      description: 'Lựa chọn tiết kiệm nhất cho lộ trình học dài hạn.',
      features: [
        'Toàn bộ quyền lợi gói Tháng',
        'Tải tài liệu PDF độc quyền',
        'Hỗ trợ ưu tiên từ giáo viên',
        'Tiết kiệm 60% so với gói tháng'
      ],
      color: 'bg-orange-50 border-orange-200',
      buttonColor: 'bg-orange-500',
      popular: true
    },
    {
      name: 'Vĩnh Viễn',
      price: '2.490.000đ',
      duration: '',
      description: 'Sở hữu trọn đời, cập nhật nội dung mới mãi mãi.',
      features: [
        'Toàn bộ quyền lợi gói Năm',
        'Không bao giờ phải gia hạn',
        'Cập nhật HSK 7-9 miễn phí',
        'Tặng áo thun Hanzi độc quyền'
      ],
      color: 'bg-gray-900 text-white',
      buttonColor: 'bg-white text-gray-900',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans overflow-hidden">
      {/* Hero Section */}
      <div className="relative pt-20 pb-32 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-orange-400 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-orange-100 animate-bounce">
            <Crown size={16} /> Đặc quyền dành riêng cho bạn
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter leading-tight">
            Nâng tầm trải nghiệm cùng <span className="text-orange-500">Hanzi VIP</span>
          </h1>
          <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Mở khóa toàn bộ kho tàng kiến thức HSK 3.0, luyện phản xạ AI và chinh phục chứng chỉ quốc tế nhanh gấp 3 lần.
          </p>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative p-10 rounded-[48px] border-2 transition-all hover:scale-[1.02] flex flex-col ${plan.color} ${plan.popular ? 'shadow-2xl shadow-orange-200' : 'border-gray-50'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                  Phổ biến nhất
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-black mb-2 uppercase tracking-widest opacity-80">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                  <span className="text-sm font-bold opacity-60">{plan.duration}</span>
                </div>
                <p className={`mt-4 text-sm font-medium leading-relaxed ${plan.name === 'Vĩnh Viễn' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className={plan.name === 'Vĩnh Viễn' ? 'text-orange-400' : 'text-orange-500'} />
                    <span className="text-sm font-bold leading-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-5 rounded-3xl font-black text-sm transition-all hover:shadow-xl active:scale-95 ${plan.buttonColor}`}>
                ĐĂNG KÝ NGAY
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Why VIP? */}
      <div className="bg-gray-50 py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tighter">Tại sao nên học VIP?</h2>
            <p className="text-gray-500 font-medium">Những tính năng giúp bạn bứt phá điểm số HSK trong thời gian ngắn nhất.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <MessageSquare size={28} />
              </div>
              <h4 className="text-lg font-black mb-3">Hội thoại AI 24/7</h4>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">Luyện nói mọi lúc mọi nơi với AI thông minh, sửa lỗi phát âm ngay lập tức.</p>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <FileText size={28} />
              </div>
              <h4 className="text-lg font-black mb-3">1000+ Đề thi thử</h4>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">Kho đề thi mô phỏng sát thực tế, cập nhật liên tục theo chuẩn HSK 3.0 mới nhất.</p>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck size={28} />
              </div>
              <h4 className="text-lg font-black mb-3">Lộ trình bài bản</h4>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">Hệ thống bài học từ dễ đến khó, giúp bạn xây dựng nền tảng vững chắc.</p>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles size={28} />
              </div>
              <h4 className="text-lg font-black mb-3">Không quảng cáo</h4>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">Trải nghiệm học tập mượt mà, tập trung hoàn toàn vào việc chinh phục ngôn ngữ.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-5xl mx-auto px-4 py-32 text-center">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-16 md:p-24 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter leading-tight">Sẵn sàng để trở thành <br/><span className="text-orange-500">Bậc thầy tiếng Trung?</span></h2>
            <p className="text-gray-400 mb-12 max-w-xl mx-auto font-medium text-lg">
              Tham gia cùng +10,000 học viên khác đang bứt phá mỗi ngày trên Hanzi.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <button className="bg-orange-500 text-white px-12 py-6 rounded-full font-black text-xl hover:bg-orange-600 transition-all shadow-xl hover:-translate-y-1 active:scale-95 flex items-center gap-3">
                Nâng cấp VIP ngay <ArrowRight size={24} />
              </button>
              <Link href="/" className="text-gray-400 font-bold hover:text-white transition-colors">
                Trở về Trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer minimal */}
      <div className="py-12 border-t border-gray-50 text-center">
        <p className="text-gray-400 text-sm font-bold">© 2026 Hanzi.io.vn — Một sản phẩm của Tiếng Trung Hongdou</p>
      </div>
    </div>
  );
}
