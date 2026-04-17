import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const logId = crypto.randomUUID();
  console.log(`[WEBHOOK ${logId}] START - Received at ${new Date().toISOString()}`);

  try {
    if (!supabaseAdmin) {
      console.error(`[WEBHOOK ${logId}] CRITICAL: supabaseAdmin is not initialized.`);
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const payload = await request.json();
    console.log(`[WEBHOOK ${logId}] Payload:`, JSON.stringify(payload));

    // SePay payload format: { content: "DH123456...", amount: 119000, ... }
    const content = String(payload.content || "");
    const amount = Number(payload.transferAmount || payload.amount || 0);
    const referenceCode = String(payload.referenceCode || "");
    
    // Tìm mã đơn hàng trong nội dung chuyển khoản (Ví dụ: DH811524)
    const orderMatch = content.match(/DH\d+/);
    const paymentRef = orderMatch ? orderMatch[0] : (referenceCode !== "" ? referenceCode : null);

    if (!paymentRef) {
      const msg = "No payment reference found in content or referenceCode";
      console.error(`[WEBHOOK ${logId}] ${msg}`);
      await supabaseAdmin.from('webhook_errors').insert({
        log_id: logId,
        payload,
        error: msg
      });
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    console.log(`[WEBHOOK ${logId}] Processing reference: ${paymentRef}, Amount: ${amount}`);

    // 1. Tìm đơn hàng tương ứng trong DB
    const { data: subscription, error: fetchError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('payment_ref', paymentRef)
      .maybeSingle();

    if (fetchError || !subscription) {
      const msg = `Subscription not found for ref: ${paymentRef}`;
      console.error(`[WEBHOOK ${logId}] ${msg}`, fetchError);
      await supabaseAdmin.from('webhook_errors').insert({
        log_id: logId,
        payload,
        error: msg + (fetchError ? ': ' + fetchError.message : '')
      });
      return NextResponse.json({ error: msg }, { status: 404 });
    }

    // 2. Cập nhật trạng thái Premium
    // Logic: 119k/tháng, 480k/6 tháng, 680k/1 năm, 999k/vĩnh viễn
    let daysToAdd = 30;
    let plan = 'premium_1_month';

    if (amount >= 900000) {
      daysToAdd = 3650; 
      plan = 'premium_lifetime';
    } else if (amount >= 600000) {
      daysToAdd = 365;
      plan = 'premium_1_year';
    } else if (amount >= 400000) {
      daysToAdd = 180;
      plan = 'premium_6_months';
    }

    const currentExpiry = subscription.expires_at ? new Date(subscription.expires_at) : new Date();
    const baseDate = currentExpiry > new Date() ? currentExpiry : new Date();
    const newExpiry = new Date(baseDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

    const { error: updateError } = await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'active',
        plan: plan,
        sepay_ref: String(payload.id || ""),
        expires_at: newExpiry.toISOString(),
      })
      .eq('payment_ref', paymentRef);

    if (updateError) {
      const msg = `DB Update failed: ${updateError.message}`;
      console.error(`[WEBHOOK ${logId}] ${msg}`);
      await supabaseAdmin.from('webhook_errors').insert({
        log_id: logId,
        payload,
        error: msg
      });
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    console.log(`[WEBHOOK ${logId}] SUCCESS: Activated ${paymentRef} for user ${subscription.user_id}`);
    return NextResponse.json({ success: true, logId });

  } catch (err: any) {
    console.error(`[WEBHOOK ${logId}] Unexpected Error:`, err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
