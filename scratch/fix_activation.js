import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function manageOrders() {
  // 1. Activate DH261367
  console.log('--- ACTIVATING DH261367 ---');
  const { data: orderToActivate, error: fetchErr } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('payment_ref', 'DH261367')
    .maybeSingle();

  if (orderToActivate) {
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // Giả sử 1 năm hoặc theo plan

    await supabase.from('subscriptions').update({
      status: 'active',
      expires_at: expiresAt.toISOString(),
      plan: 'premium_1_year' // Hoặc giữ nguyên plan cũ nếu có
    }).eq('payment_ref', 'DH261367');
    console.log('✅ Activated DH261367');
  } else {
    console.log('❌ DH261367 not found!');
  }

  // 2. Revert the others
  const others = ['DH663141', 'DH953397', 'DH792893', 'DH782491'];
  console.log('--- REVERTING OTHERS ---');
  for (const ref of others) {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'pending_payment',
        expires_at: null,
        plan: 'free'
      })
      .eq('payment_ref', ref);
    
    if (!error) console.log(`🔄 Reverted ${ref} to pending/free`);
  }
}

manageOrders();
