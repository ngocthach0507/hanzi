import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

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

    // Tạo mã nội dung chuyển khoản ngẫu nhiên (Ví dụ: HZ123456)
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const paymentRef = `DH${randomSuffix}`;

    // Thông tin tài khoản nhận tiền
    const bankId = process.env.SEPAY_BANK_ID || "mbbank";
    const accountNo = process.env.SEPAY_ACCOUNT_NO || "8386113666999";
    const accountName = process.env.SEPAY_ACCOUNT_NAME || "PHAM NGOC THACH";

    // Tạo URL ảnh QR VietQR
    // Cấu trúc: https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-compact.jpg?amount=<AMOUNT>&addInfo=<CONTENT>&accountName=<NAME>
    const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact.jpg?amount=${amount}&addInfo=${paymentRef}&accountName=${encodeURIComponent(accountName)}`;

    // Lưu thông tin thanh toán chờ (Pending) vào Supabase
    try {
      await supabase.from('subscriptions').upsert({
        user_id: userId,
        payment_ref: paymentRef,
        status: 'pending_payment',
        plan: planType.toLowerCase()
      }, { onConflict: 'user_id' });
    } catch (dbError) {
      console.error("Supabase DB Error:", dbError);
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
