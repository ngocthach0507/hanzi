import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  console.log("===> SEPAY WEBHOOK RECEIVED <===");
  
  try {
    const body = await request.json();
    const bodyStr = JSON.stringify(body);
    console.log("WEBHOOK_DATA:", bodyStr);
    
    // 1. CHẤP NHẬN CẢ "IN" VÀ "in"
    const tType = (body.transferType || "").toLowerCase();
    const tAmount = Number(body.transferAmount || 0);
    const tContent = (body.content || "").toUpperCase().trim();

    if (tType === "in" || tAmount > 0) {
      // 2. TRÍCH XUẤT MÃ ĐƠN HÀNG (FORGIVING PARSING)
      const match = tContent.match(/DH\d{6}/);
      const extractedRef = match ? match[0] : tContent;
      
      console.log(`PROCESSING: Ref=${extractedRef}, Amount=${tAmount}`);

      // 3. TÌM KIẾM DỄ TÍNH (THỬ CẢ payment_ref VÀ user_id NẾU CẦN)
      if (!supabaseAdmin) {
        console.error("[CRITICAL] supabaseAdmin is not initialized. Check SUPABASE_SERVICE_KEY.");
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
      }

      const { data: subData, error: findError } = await supabaseAdmin
        .from('subscriptions')
        .select('user_id, plan, status, expires_at')
        .eq('payment_ref', extractedRef)
        .maybeSingle();

      if (findError) {
        console.error("FIND_SUB_ERROR:", findError);
      }

      if (subData) {
        console.log(`MATCH_FOUND: User ${subData.user_id}, Current Status: ${subData.status}`);
        
        // 4. XÁC ĐỊNH GÓI DỰA TRÊN SỐ TIỀN THỰC NHẬN
        let daysToAdd = 0;
        if (tAmount >= 680000) daysToAdd = 365;
        else if (tAmount >= 480000) daysToAdd = 180;
        else if (tAmount >= 280000) daysToAdd = 90;
        else if (tAmount >= 110000) daysToAdd = 30;
        else if (tAmount > 0) daysToAdd = 30; // Min 30 days for any positive amount
        else daysToAdd = 0;

        if (daysToAdd > 0) {
          // 5. CẬP NHẬT TRẠNG THÁI (Gia hạn nếu đã có gói)
          const currentExpiry = subData.expires_at ? new Date(subData.expires_at) : new Date();
          const baseDate = currentExpiry > new Date() ? currentExpiry : new Date();
          const newExpiry = new Date(baseDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

          const { error: updateError } = await supabaseAdmin
            .from('subscriptions')
            .update({
              status: 'active',
              plan: subData.plan === 'free' ? 'pro' : subData.plan, // Update from free to pro
              sepay_ref: body.id || body.paymentRef || "WEBHOOK_AUTO",
              activated_at: new Date().toISOString(),
              expires_at: newExpiry.toISOString()
            })
            .eq('user_id', subData.user_id);

          if (updateError) {
            console.error(`[WEBHOOK_ERROR] Failed to update sub for ${subData.user_id}:`, updateError);
          } else {
            const expiryDate = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN');
            console.log(`[WEBHOOK_SUCCESS] Activated Premium for ${subData.user_id}. Amount: ${tAmount}, Days: ${daysToAdd}, Expires: ${expiryDate}`);
          }
        } else {
          console.warn(`[WEBHOOK_IGNORE] Amount too small or invalid: ${tAmount}`);
        }
      } else {
        // LOG LỖI VÀO DATABASE ĐỂ CHÚNG TA XEM ĐƯỢC
        console.warn("NO_MATCH_FOUND_FOR:", extractedRef);
        // Lưu tạm vào bảng subscriptions một bản ghi lỗi để admin biết (nếu cần)
      }
    }

    // SePay yêu cầu phản hồi JSON thành công
    return NextResponse.json({ success: true, message: "Webhook processed" });
  } catch (error: any) {
    console.error("WEBHOOK_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
