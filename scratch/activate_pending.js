import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function scanAndActivate() {
  console.log('--- SCANNING PENDING SUBSCRIPTIONS ---');
  
  const { data: pending, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('status', 'pending_payment');

  if (error) {
    console.error('Error fetching pending subs:', error);
    return;
  }

  if (!pending || pending.length === 0) {
    console.log('No pending subscriptions found.');
    return;
  }

  console.log(`Found ${pending.length} pending subscriptions:`);
  pending.forEach(sub => {
    console.log(`- User: ${sub.user_id}, Plan: ${sub.plan}, Ref: ${sub.payment_ref}`);
  });

  // Since the user asked to activate, I will proceed to activate them.
  // We'll set them to a default 1 month if not specified, or use the plan they chose.
  
  for (const sub of pending) {
    console.log(`Activating sub for ${sub.user_id}...`);
    
    let daysToAdd = 30;
    if (sub.plan?.includes('6_month')) daysToAdd = 180;
    else if (sub.plan?.includes('12_month') || sub.plan?.includes('1_year')) daysToAdd = 365;
    else if (sub.plan?.includes('lifetime')) daysToAdd = 3650;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + daysToAdd);

    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        expires_at: expiresAt.toISOString(),
        plan: sub.plan.startsWith('premium_') ? sub.plan : `premium_${sub.plan}`
      })
      .eq('user_id', sub.user_id);

    if (updateError) {
      console.error(`Failed to activate ${sub.user_id}:`, updateError);
    } else {
      console.log(`✅ Activated ${sub.user_id} until ${expiresAt.toLocaleDateString()}`);
    }
  }
}

scanAndActivate();
