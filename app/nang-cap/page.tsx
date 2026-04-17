"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { 
  Check, 
  X, 
  Zap, 
  Star, 
  ShieldCheck, 
  TrendingDown,
  ChevronRight,
  ClipboardCheck,
  Crown
} from "lucide-react";

const plans = [
  {
    id: "1_MONTH",
    name: "Gói 1 tháng",
    months: 1,
    price: 119000,
    originalPrice: 119000,
    savingsPercent: 0,
    savingsAmount: 0,
    description: "Toàn bộ tính năng Premium",
    isPopular: false,
    color: "blue"
  },
  {
    id: "3_MONTHS",
    name: "Gói 3 tháng",
    months: 3,
    price: 289000,
    originalPrice: 357000,
    savingsPercent: 19,
    savingsAmount: 68000,
    description: "Toàn bộ tính năng Premium",
    isPopular: false,
    color: "blue"
  },
  {
    id: "6_MONTHS",
    name: "Gói 6 tháng",
    months: 6,
    price: 489000,
    originalPrice: 714000,
    savingsPercent: 32,
    savingsAmount: 225000,
    description: "Toàn bộ tính năng Premium",
    isPopular: true,
    color: "orange"
  },
  {
    id: "12_MONTHS",
    name: "Gói 1 năm",
    months: 12,
    price: 689000,
    originalPrice: 1428000,
    savingsPercent: 52,
    savingsAmount: 739000,
    description: "Toàn bộ tính năng Premium",
    isPopular: false,
    color: "blue"
  }
];

const features = [
  { name: "Loại bỏ quảng cáo", free: false, pro: true },
  { name: "Giáo trình Hán ngữ", free: false, pro: true },
  { name: "Luyện đề thi HSK", free: false, pro: true },
  { name: "Kiểm tra từ vựng", free: false, pro: true },
  { name: "Học bài nghe HSK", free: false, pro: true },
  { name: "Bài hội thoại theo chủ đề", free: false, pro: true },
  { name: "Nhận diện chữ viết tay", free: false, pro: true },
  { name: "Học bộ thủ", free: false, pro: true },
  { name: "Kiểm tra bộ thủ", free: false, pro: true },
  { name: "Mẫu câu tiếng Trung", free: false, pro: true },
  { name: "Sổ tay cá nhân", free: true, pro: true },
  { name: "Bảng phát âm", free: true, pro: true },
];

export default function UpgradePage() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("6_MONTHS");

  // State thanh toán SePay
  const [paymentInfo, setPaymentInfo] = useState<{
    qrUrl: string;
    accountNo: string;
    accountName: string;
    amount: number;
    paymentRef: string;
    bankId: string;
  } | null>(null);

  const handleUpgrade = async (plan: any) => {
    if (!isLoaded) return;
    
    if (!userId) {
      router.push("/dang-nhap");
      return;
    }

    try {
      setLoadingPlan(plan.id);
      
      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType: plan.id,
          amount: plan.price
        })
      });
      
      const result = await response.json();

      if (result.success && result.data) {
        setPaymentInfo(result.data);
      } else {
        alert(`Lỗi hệ thống: ${result.error || "Không thể tạo mã QR"}`);
      }
    } catch (error: any) {
      console.error("Payment failed:", error);
      alert(`Lỗi kết nối: ${error.message || "Không thể kết nối"}`);
    } finally {
      setLoadingPlan(null);
    }
  };

  const closePaymentModal = async () => {
    if (paymentInfo) {
      try {
        const response = await fetch('/api/user/subscription');
        const data = await response.json();

        if (data.isPro) {
          window.location.reload();
          return;
        }
      } catch (error) {
        console.error("Failed to refresh subscription:", error);
      }
    }

    setPaymentInfo(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-blue-100 italic">
             <Crown size={14} className="animate-bounce" /> Bảng giá Premium
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            Chọn gói phù hợp với <span className="text-blue-600">nhịp học</span> của bạn
          </h1>
          <p className="text-gray-500 text-lg font-medium flex items-center justify-center gap-2">
             <ShieldCheck size={20} className="text-green-500" /> Không giới hạn tính năng ở mọi gói
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`relative bg-white rounded-[40px] p-8 border-2 transition-all duration-300 cursor-pointer flex flex-col h-full group ${
                selectedPlanId === plan.id 
                ? 'border-blue-500 shadow-2xl shadow-blue-100 scale-[1.02] z-10' 
                : 'border-gray-50 hover:border-blue-200 shadow-sm'
              } ${plan.isPopular ? 'ring-4 ring-orange-50' : ''}`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 gradient-gold text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-2">
                   <Star size={12} fill="currentColor" /> Phổ biến nhất
                </div>
              )}

              <div className="mb-8">
                <div className="text-sm font-bold text-blue-500 mb-2">{plan.name}</div>
                <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-6">{plan.description}</div>
                
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-black tracking-tighter ${plan.isPopular ? 'text-orange-600' : 'text-gray-900'}`}>
                      {plan.price.toLocaleString('vi-VN')}đ
                    </span>
                    {plan.savingsPercent > 0 && (
                      <span className="text-sm font-bold text-gray-300 line-through">
                        {plan.originalPrice.toLocaleString('vi-VN')}đ
                      </span>
                    )}
                  </div>
                  
                  {plan.savingsPercent > 0 && (
                     <div className="flex items-center gap-2 mt-4">
                        <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-md">
                          -{plan.savingsPercent}%
                        </span>
                        <span className="text-[11px] font-bold text-green-600">
                          Tiết kiệm {plan.savingsAmount.toLocaleString('vi-VN')}đ
                        </span>
                     </div>
                  )}
                  
                  <div className="mt-4 text-[13px] font-bold text-gray-400 italic">
                    ~{(Math.round(plan.price / plan.months)).toLocaleString('vi-VN')}đ/tháng
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-10">
                {features.slice(0, 7).map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    <div className="w-5 h-5 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    {f.name}
                  </div>
                ))}
                <div className="text-[10px] font-bold text-gray-300 italic">Và toàn bộ tính năng Premium còn lại...</div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpgrade(plan);
                }}
                disabled={loadingPlan === plan.id}
                className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 ${
                  selectedPlanId === plan.id
                  ? 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {loadingPlan === plan.id ? 'Đang xử lý...' : (selectedPlanId === plan.id ? 'Chọn gói này' : 'Dùng gói này')} 
                <ChevronRight size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Comparison Table Section */}
        <div className="max-w-4xl mx-auto mb-24">
          <div className="text-center mb-12">
            <div className="text-blue-500 font-black text-xs uppercase tracking-[0.3em] mb-4">Quyền lợi</div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">So sánh nhanh gói miễn phí và <span className="text-blue-600">Premium</span></h2>
          </div>

          <div className="bg-white rounded-[48px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="p-8 text-sm font-black text-gray-400 uppercase tracking-widest">Tính năng</th>
                    <th className="p-8 text-center text-sm font-black text-gray-400 uppercase tracking-widest flex flex-col items-center gap-1">
                       <Zap size={16} /> <span>Miễn phí</span>
                    </th>
                    <th className="p-8 text-center text-sm font-black text-blue-600 uppercase tracking-widest bg-blue-50/50">
                       <div className="flex flex-col items-center gap-1">
                          <Crown size={16} className="text-orange-500" /> <span>Premium</span>
                       </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {features.map((feature, i) => (
                    <tr key={i} className="hover:bg-gray-50/20 transition-colors">
                      <td className="p-6 pl-8">
                        <div className="flex items-center gap-4">
                           <div className="w-2 h-2 rounded-full bg-blue-100"></div>
                           <span className="text-sm font-bold text-gray-600">{feature.name}</span>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        {feature.free ? (
                          <div className="mx-auto w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center border border-green-200">
                             <Check size={14} strokeWidth={4} />
                          </div>
                        ) : (
                          <div className="mx-auto w-6 h-6 bg-red-50 text-red-300 rounded-full flex items-center justify-center border border-red-100">
                             <X size={14} strokeWidth={4} />
                          </div>
                        )}
                      </td>
                      <td className="p-6 text-center bg-blue-50/10">
                        <div className="mx-auto w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center shadow-md shadow-green-100">
                          <Check size={14} strokeWidth={4} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {paymentInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[50px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300 border border-gray-100">
            <div className="bg-blue-600 p-10 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]"></div>
              <h3 className="text-3xl font-black mb-2 flex items-center justify-center gap-3">
                 <ClipboardCheck size={28} /> Thanh toán
              </h3>
              <p className="text-blue-100 font-medium tracking-wide">Quét mã QR để kích hoạt Premium tự động</p>
            </div>
            
            <div className="p-10">
              <div className="flex justify-center mb-10">
                <div className="relative group p-4 bg-gray-50 rounded-[40px] border-2 border-gray-100">
                  <img 
                    src={paymentInfo.qrUrl} 
                    alt="VietQR" 
                    className="w-60 h-60 rounded-3xl"
                  />
                  <div className="absolute inset-0 rounded-[40px] ring-8 ring-blue-50/50 animate-pulse"></div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-[40px] p-8 mb-10 space-y-5 border border-gray-100 shadow-inner">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200/60">
                  <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Số tài khoản</span>
                  <span className="font-black text-gray-900 text-lg tabular-nums tracking-wider">{paymentInfo.accountNo}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-200/60">
                  <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Nội dung</span>
                  <span className="bg-blue-100 text-blue-700 px-5 py-2 rounded-full font-black text-xl border-2 border-blue-200 shadow-sm">
                    {paymentInfo.paymentRef}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Số tiền</span>
                  <span className="text-3xl font-black text-blue-600 tabular-nums">
                    {paymentInfo.amount.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={closePaymentModal}
                  className="w-full py-6 rounded-3xl bg-gray-900 text-white font-black text-lg hover:bg-black transition-all shadow-2xl active:scale-95"
                >
                  TÔI ĐÃ CHUYỂN KHOẢN
                </button>
                <div className="flex items-center justify-center gap-2 text-red-500 bg-red-50 py-3 rounded-2xl border border-red-100">
                   <TrendingDown size={16} />
                   <p className="text-center text-[11px] font-bold">Vui lòng chuyển đúng nội dung để được kích hoạt tự động</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
