const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkRecentSubs() {
  console.log("--- KIỂM TRA ĐĂNG KÝ GẦN ĐÂY ---");
  
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error("Lỗi truy vấn:", error);
    return;
  }

  console.table(data.map(s => ({
    user_id: s.user_id,
    plan: s.plan,
    status: s.status,
    ref: s.payment_ref,
    expires: s.expires_at,
    created: s.created_at
  })));
}

checkRecentSubs();
