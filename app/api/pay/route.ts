import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  return NextResponse.json({ status: "ok", message: "SePay API is active" });
}

export async function POST(request: Request) {
  console.log("===> SEPAY API START <===");
  
  try {
    const authData = await auth();
    const userId = authData.userId;
    console.log("DEBUG: userId =", userId);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { planType, amount } = body;

    // 1. Kiểm tra xem người dùng đã có đơn hàng pending chưa
    const { data: existingSub } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    let paymentRef = "";
    
    // Nếu đã có đơn pending, giữ nguyên mã cũ để khách không bị nhầm
    if (existingSub && existingSub.status === 'pending_payment' && existingSub.payment_ref) {
      paymentRef = existingSub.payment_ref;
      console.log(`[PAY] Reusing existing ref: ${paymentRef} for user ${userId}`);
    } else {
      // Tạo mã mới 8 chữ số (xác suất trùng 1/100 triệu)
      const randomSuffix = Math.floor(10000000 + Math.random() * 90000000);
      paymentRef = `DH${randomSuffix}`;
      console.log(`[PAY] Generated new 8-digit ref: ${paymentRef} for user ${userId}`);
    }

    // Thông tin tài khoản nhận tiền
    const bankId = process.env.SEPAY_BANK_ID || "mbbank";
    const accountNo = process.env.SEPAY_ACCOUNT_NO || "8386113666999";
    const accountName = process.env.SEPAY_ACCOUNT_NAME || "PHAM NGOC THACH";

    // Tạo URL ảnh QR VietQR
    const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact.jpg?amount=${amount}&addInfo=${paymentRef}&accountName=${encodeURIComponent(accountName)}`;

    // Lưu/Cập nhật thông tin thanh toán
    const { error: dbError } = await supabaseAdmin.from('subscriptions').upsert({
      user_id: userId,
      payment_ref: paymentRef,
      status: existingSub?.status === 'active' ? 'active' : 'pending_payment',
      plan: planType.toLowerCase()
    }, { onConflict: 'user_id' });

    if (dbError) {
      console.error("Supabase DB Error:", dbError);
      throw dbError;
    }

    // 2. [TỰ ĐỘNG ĐỐI SOÁT BÙ] Kiểm tra xem mã này đã có tiền về trong bảng unmatched chưa
    const { data: unmatched } = await supabaseAdmin
      .from('unmatched_payments')
      .select('*')
      .eq('payment_ref', paymentRef)
      .eq('status', 'pending')
      .maybeSingle();

    if (unmatched) {
      console.log(`[PAY] AUTO-CLAIM: Found unmatched payment for ${paymentRef}! Activating now.`);
      
      // Kích hoạt luôn
      await supabaseAdmin.from('subscriptions').update({
        status: 'active',
        plan: planType.toLowerCase(),
        sepay_ref: unmatched.sepay_payload?.id || "AUTO_CLAIMED"
      }).eq('user_id', userId);

      // Đánh dấu đã nhận tiền
      await supabaseAdmin.from('unmatched_payments').update({
        status: 'claimed'
      }).eq('id', unmatched.id);
    }

    // Trả về dữ liệu cho Frontend hiển thị Modal
    return NextResponse.json({
      success: true,
      data: {
        bankId,
        accountNo,
        accountName,
        amount,
        paymentRef,
        qrUrl
      }
    });
  } catch (error: any) {
    console.error("SEPAY_API_ERROR:", error);
    return NextResponse.json({ 
      error: error.message || "Internal Server Error"
    }, { status: 500 });
  }
}
