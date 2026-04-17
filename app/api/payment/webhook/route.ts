import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function parseAmount(value: unknown) {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }

  if (typeof value === "string") {
    const digits = value.replace(/[^\d]/g, "");
    const parsed = Number(digits);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  return 0;
}

function extractPaymentReference(body: any) {
  const content = String(body.content || body.memo || body.message || body.description || body.paymentRef || body.payment_ref || "").toUpperCase().trim();
  const match = content.match(/DH\d{6}/);
  return match ? match[0] : content;
}

export async function GET() {
  return NextResponse.json({ 
    status: "ok", 
    message: "SePay Webhook is listening",
    adminInitialized: !!supabaseAdmin
  });
}

export async function POST(request: Request) {
  console.log("===> SEPAY WEBHOOK RECEIVED <===");
  
  try {
    const body = await request.json();
    const bodyStr = JSON.stringify(body);
    console.log("WEBHOOK_DATA:", bodyStr);
    
    const tType = String(body.transferType || body.type || body.transactionType || "").toLowerCase();
    const tAmount = parseAmount(body.transferAmount ?? body.amount ?? body.value ?? 0);
    const extractedRef = extractPaymentReference(body);

    console.log(`PROCESSING: Ref=${extractedRef}, Amount=${tAmount}, Type=${tType}`);

    if (tType === "in" || tAmount > 0) {
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
        
        let daysToAdd = 0;
        if (tAmount >= 680000) daysToAdd = 365;
        else if (tAmount >= 480000) daysToAdd = 180;
        else if (tAmount >= 280000) daysToAdd = 90;
        else if (tAmount >= 110000) daysToAdd = 30;
        else if (tAmount > 0) daysToAdd = 30;
        else daysToAdd = 0;

        if (daysToAdd > 0) {
          const isCurrentlyActive = subData.expires_at ? new Date(subData.expires_at) > new Date() : false;
          const baseDate = isCurrentlyActive ? new Date(subData.expires_at) : new Date();
          const newExpiry = new Date(baseDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

          let newPlan = subData.plan;
          if (daysToAdd >= 365) newPlan = "premium_1_year";
          else if (daysToAdd >= 180) newPlan = "premium_6_months";
          else if (daysToAdd >= 90) newPlan = "premium_3_months";
          else if (daysToAdd >= 30) newPlan = "premium_1_month";

          const { error: updateError } = await supabaseAdmin
            .from('subscriptions')
            .update({
              status: 'active',
              plan: newPlan,
              sepay_ref: body.id || body.paymentRef || body.payment_ref || "WEBHOOK_AUTO",
              expires_at: newExpiry.toISOString()
            })
            .eq('user_id', subData.user_id);

          if (updateError) {
            console.error(`[WEBHOOK_ERROR] Failed to update sub for ${subData.user_id}:`, updateError);
          } else {
            const expiryDate = newExpiry.toLocaleDateString('vi-VN');
            console.log(`[WEBHOOK_SUCCESS] Activated Premium for ${subData.user_id}. Amount: ${tAmount}, Days: ${daysToAdd}, Expires: ${expiryDate}`);
          }
        } else {
          console.warn(`[WEBHOOK_IGNORE] Amount too small or invalid: ${tAmount}`);
        }
      } else {
        console.warn("NO_MATCH_FOUND_FOR:", extractedRef);
      }
    }

    return NextResponse.json({ success: true, message: "Webhook processed" });
  } catch (error: any) {
    console.error("WEBHOOK_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
