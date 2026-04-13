"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function UpgradePage() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  
  // Trạng thái thanh toán (SePay)
  const [paymentInfo, setPaymentInfo] = useState<{
    qrUrl: string;
    accountNo: string;
    accountName: string;
    amount: number;
    paymentRef: string;
    bankId: string;
  } | null>(null);

  const handleUpgrade = async (planName: string, amount: number) => {
    if (!isLoaded) return;
    
    if (!userId) {
      router.push("/dang-nhap");
      return;
    }

    try {
      setLoadingPlan(planName);
      
      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType: planName,
          amount: amount
        })
      });
      
      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        alert(`Lỗi phản hồi hệ thống (HTML):\n${text.substring(0, 200)}...`);
        return;
      }

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

  const closePaymentModal = () => {
    setPaymentInfo(null);
    // Có thể chuyển hướng về dashboard nếu cần
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-wider text-orange-600 uppercase bg-orange-100 rounded-full">
            👑 Nâng cấp tài khoản
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Mở khóa toàn bộ tiềm năng
          </h1>
          <p className="text-gray-600 text-lg">
            Chọn gói phù hợp để bắt đầu hành trình chinh phục tiếng Trung của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Gói PRO */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">PRO</h3>
                <div className="flex items-baseline mt-2">
                  <span className="text-4xl font-black text-gray-900">690.000đ</span>
                  <span className="text-gray-500 ml-1">/năm</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-8 italic">Học tập chuyên sâu không giới hạn toàn bộ tính năng.</p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center text-gray-700">✅ Mở khóa HSK 1-6</li>
              <li className="flex items-center text-gray-700">✅ 8 dạng bài tập</li>
              <li className="flex items-center text-gray-700">✅ Phát âm AI</li>
              <li className="flex items-center text-gray-700">✅ Không quảng cáo</li>
            </ul>
            <button
              onClick={() => handleUpgrade('PRO', 690000)}
              disabled={loadingPlan !== null}
              className="w-full py-4 px-6 rounded-2xl bg-orange-600 text-white font-bold text-lg hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200 disabled:opacity-50"
            >
              {loadingPlan === 'PRO' ? 'ĐANG XỬ LÝ...' : 'NÂNG CẤP NGAY'}
            </button>
          </div>

          {/* Gói PRO + LIVE */}
          <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 shadow-xl relative overflow-hidden transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-widest">Phổ biến nhất</div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">PRO + LIVE</h3>
                <div className="flex items-baseline mt-2 text-white">
                  <span className="text-4xl font-black">199.000đ</span>
                  <span className="text-gray-400 ml-1">/tháng</span>
                </div>
              </div>
            </div>
            <p className="text-gray-400 mb-8 italic">Học cùng giáo viên và cộng đồng qua group kín.</p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center text-gray-300">✅ Tất cả gói PRO</li>
              <li className="flex items-center text-gray-300">✅ 2 buổi Live/tuần</li>
              <li className="flex items-center text-gray-300">✅ Học 1-1</li>
              <li className="flex items-center text-gray-300">✅ Tài liệu PDF</li>
            </ul>
            <button
              onClick={() => handleUpgrade('PRO_LIVE', 199000)}
              disabled={loadingPlan !== null}
              className="w-full py-4 px-6 rounded-2xl bg-white text-gray-900 font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg disabled:opacity-50"
            >
              {loadingPlan === 'PRO_LIVE' ? 'ĐANG XỬ LÝ...' : 'NÂNG CẤP NGAY'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal Thanh toán SePay - Thiết kế Premium */}
      {paymentInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-orange-600 p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-1">Thanh toán chuyển khoản</h3>
              <p className="text-orange-100 text-sm">Quét mã QR để nâng cấp tài khoản tự động</p>
            </div>
            
            <div className="p-8">
              <div className="flex justify-center mb-8">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-orange-100 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <img 
                    src={paymentInfo.qrUrl} 
                    alt="VietQR" 
                    className="relative w-64 h-64 rounded-2xl border-4 border-white shadow-sm"
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-3xl p-6 mb-8 space-y-4">
                <div className="flex justify-between items-center pb-3 border-bottom border-gray-200">
                  <span className="text-gray-500 text-sm">Chủ tài khoản</span>
                  <span className="font-bold text-gray-900 uppercase">{paymentInfo.accountName}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-y border-gray-200">
                  <span className="text-gray-500 text-sm">Số tài khoản (MBBank)</span>
                  <span className="font-bold text-gray-900 text-lg tracking-wider">{paymentInfo.accountNo}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-y border-gray-200">
                  <span className="text-gray-500 text-sm">Nội dung bắt buộc</span>
                  <span className="bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full font-black text-xl border-2 border-orange-200">
                    {paymentInfo.paymentRef}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3">
                  <span className="text-gray-500 text-sm">Số tiền cần chuyển</span>
                  <span className="text-2xl font-black text-orange-600">
                    {paymentInfo.amount.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={closePaymentModal}
                  className="w-full py-4 rounded-2xl bg-gray-900 text-white font-bold hover:bg-black transition-all"
                >
                  TÔI ĐÃ CHUYỂN KHOẢN
                </button>
                <p className="text-center text-xs text-gray-400">
                  ⚠️ Vui lòng giữ nguyên nội dung chuyển khoản để hệ thống tự động kích hoạt sau 1-3 phút.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
