import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const full = searchParams.get('full') === 'true';

    const authData = await auth();
    const userId = authData.userId;

    if (!userId) {
      return NextResponse.json({ isPro: false });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ isPro: false, error: "Admin not initialized" });
    }

    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error("Sub API Error:", error);
      return NextResponse.json({ isPro: false, error: error.message });
    }

    let currentData = data;

    // --- TỰ ĐỘNG ĐỐI SOÁT BÙ (AUTO-CLAIM) ---
    // Nếu đang chờ thanh toán, kiểm tra xem tiền đã về bảng unmatched chưa
    if (currentData && currentData.status === 'pending_payment' && currentData.payment_ref) {
      const { data: unmatched } = await supabaseAdmin
        .from('unmatched_payments')
        .select('*')
        .eq('payment_ref', currentData.payment_ref)
        .eq('status', 'pending')
        .maybeSingle();

      if (unmatched) {
        console.log(`[SUB API] Auto-claiming payment ${currentData.payment_ref} for user ${userId}`);
        
        // 1. Xác định thời gian cộng thêm dựa trên số tiền
        let daysToAdd = 30;
        let plan = 'premium_1_month';
        const amount = Number(unmatched.amount || 0);

        if (amount >= 900000) { daysToAdd = 3650; plan = 'premium_lifetime'; }
        else if (amount >= 600000) { daysToAdd = 365; plan = 'premium_1_year'; }
        else if (amount >= 400000) { daysToAdd = 180; plan = 'premium_6_months'; }

        const newExpiry = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);

        // 2. Cập nhật Subscription
        const { data: updatedSub } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'active',
            plan: plan,
            expires_at: newExpiry.toISOString(),
            sepay_ref: unmatched.sepay_payload?.id || "AUTO_CLAIM_SUB_API"
          })
          .eq('user_id', userId)
          .select()
          .single();

        if (updatedSub) {
          currentData = updatedSub;
          // 3. Đánh dấu đã nhận tiền
          await supabaseAdmin.from('unmatched_payments').update({ status: 'claimed' }).eq('id', unmatched.id);
        }
      }
    }
    // ----------------------------------------

    // Logic xác định Pro: 
    // - Có dữ liệu
    // - Plan không phải 'free' và không rỗng
    // - Status là 'active'
    // - Chưa hết hạn (hoặc là gói vĩnh viễn)
    const isPro = !!(
      currentData && 
      currentData.plan && 
      currentData.plan !== 'free' && 
      currentData.status === 'active' && 
      (currentData.expires_at ? new Date(currentData.expires_at) > new Date() : (currentData.plan?.includes('lifetime')))
    );

    if (full) {
      return NextResponse.json({ isPro, data: currentData });
    }

    if (isPro) {
      return NextResponse.json({ isPro: true, plan: currentData.plan });
    }

    return NextResponse.json({ isPro: false, status: currentData?.status || 'none' });
  } catch (err: any) {
    console.error("Sub API Catch:", err);
    return NextResponse.json({ isPro: false });
  }
}
