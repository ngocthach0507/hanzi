const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const USER_ID = 'user_3CUdc4d1odDh0S7NVcGwLi8edc4'; // ID THẬT TRÊN LIVE
const PAYMENT_REF = 'DH811524';
const AMOUNT = 119000;

async function autoActivate() {
  console.log(`--- TIẾN HÀNH TỰ ĐỘNG KÍCH HOẠT CHO ${USER_ID} ---`);
  
  // 1. Tạo bản ghi pending nếu chưa có
  console.log("1. Tạo bản ghi đơn hàng...");
  const { error: upsertError } = await supabaseAdmin.from('subscriptions').upsert({
    user_id: USER_ID,
    payment_ref: PAYMENT_REF,
    status: 'pending_payment',
    plan: 'premium_1_month'
  }, { onConflict: 'user_id' });

  if (upsertError) {
    console.error("Lỗi tạo đơn hàng:", upsertError);
    return;
  }

  // 2. Chạy logic kích hoạt (giống Webhook)
  console.log("2. Khớp thanh toán và mở khóa...");
  let daysToAdd = 30; // 119k = 1 month
  const newExpiry = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);

  const { error: updateError } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'active',
      plan: 'premium_1_month',
      sepay_ref: 'SYNC_AUTO_FIX_REAL_ID',
      expires_at: newExpiry.toISOString()
    })
    .eq('user_id', USER_ID);

  if (updateError) {
    console.error("Lỗi kích hoạt:", updateError);
  } else {
    console.log("===> KÍCH HOẠT THÀNH CÔNG CHO ID THẬT!");
  }
}

autoActivate();
