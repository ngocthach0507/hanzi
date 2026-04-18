import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function activateBoth() {
  const refs = ['DH953397', 'DH792893'];
  console.log('--- ACTIVATING BOTH POTENTIAL ACCOUNTS ---');
  
  for (const ref of refs) {
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // Gói 1 năm

    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        expires_at: expiresAt.toISOString(),
        plan: 'premium_1_year'
      })
      .eq('payment_ref', ref);

    if (!error) {
      console.log(`✅ Activated ${ref} until ${expiresAt.toLocaleDateString()}`);
    } else {
      console.error(`❌ Failed to activate ${ref}:`, error);
    }
  }
}

activateBoth();
