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
      const { data: subData, error: findError } = await supabaseAdmin
        .from('subscriptions')
        .select('user_id, plan, status')
        .eq('payment_ref', extractedRef)
        .maybeSingle();

      if (findError) {
        console.error("FIND_SUB_ERROR:", findError);
      }

      if (subData) {
        console.log(`MATCH_FOUND: User ${subData.user_id}, Current Status: ${subData.status}`);
        
        // 4. XÁC ĐỊNH GÓI DỰA TRÊN SỐ TIỀN THỰC NHẬN
        let daysToAdd = 30;
        if (tAmount >= 900000) daysToAdd = 365;
        else if (tAmount >= 450000) daysToAdd = 180;
        else if (tAmount >= 200000) daysToAdd = 90;
        else daysToAdd = 30;

        // 5. CẬP NHẬT TRẠNG THÁI
        const { error: updateError } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'active',
            sepay_ref: body.id || body.paymentRef || "WEBHOOK_AUTO",
            activated_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString()
          })
          .eq('user_id', subData.user_id);

        if (updateError) {
          console.error("UPDATE_STATUS_ERROR:", updateError);
        } else {
          console.log(`SUCCESS: Activated Premium for ${subData.user_id} (${daysToAdd} days)`);
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
