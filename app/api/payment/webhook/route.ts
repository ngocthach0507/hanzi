import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  console.log("===> SEPAY WEBHOOK RECEIVED <===");
  
  try {
    const body = await request.json();
    console.log("WEBHOOK_DATA:", body);
    
    // Dữ liệu từ SePay gửi về thường có các trường:
    // id, gateway, transactionDate, accountNumber, transferAmount, content, transferType, ...
    
    if (body.transferType === "in" || body.transferAmount > 0) {
      const amount = body.transferAmount;
      const content = (body.content || "").toUpperCase().trim();
      
      console.log(`CHECK_MATCH: Content=${content}, Amount=${amount}`);

      // Trích xuất mã DHxxxxxx từ nội dung (Regex để tìm DH theo sau là 6 chữ số)
      const match = content.match(/DH\d{6}/);
      const extractedRef = match ? match[0] : content;
      
      console.log(`EXTRACTED_REF: ${extractedRef} from ${content}`);

      // Tìm người dùng dựa trên mã đã trích xuất
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('user_id, plan')
        .eq('payment_ref', extractedRef)
        .single();

      if (subData) {
        console.log(`SUCCESS: Found matching subscription for user ${subData.user_id}`);
        
        // Xác định số ngày cộng thêm dựa trên số tiền hoặc loại gói
        let daysToAdd = 30;
        if (amount >= 600000) {
          daysToAdd = 365; // Gói 1 năm
        } else if (amount >= 400000) {
          daysToAdd = 180; // Gói 6 tháng
        } else if (amount >= 250000) {
          daysToAdd = 90;  // Gói 3 tháng
        } else {
          daysToAdd = 30;  // Gói 1 tháng
        }

        // Cập nhật trạng thái Active
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            activated_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString()
          })
          .eq('user_id', subData.user_id);

        if (updateError) {
          console.error("UPDATE_ERROR:", updateError);
        } else {
          console.log(`ACTIVATE_PREMIUM_SUCCESS: User ${subData.user_id} is now PREMIUM for ${daysToAdd} days`);
        }
      } else {
        console.warn("WARN: No matching payment_ref found for content:", content);
      }
    }

    // SePay yêu cầu phản hồi JSON thành công
    return NextResponse.json({ success: true, message: "Webhook processed" });
  } catch (error: any) {
    console.error("WEBHOOK_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
