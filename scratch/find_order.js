import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function findOrder() {
  console.log('--- SEARCHING FOR 261367 ---');
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .ilike('payment_ref', '%261367%');

  if (data && data.length > 0) {
    console.log('Found matches:');
    data.forEach(d => console.log(d));
  } else {
    console.log('No matches found for %261367%.');
    
    // List all subscriptions to see what's there
    const { data: all } = await supabase.from('subscriptions').select('payment_ref, status').limit(20);
    console.log('Recent 20 orders:');
    all.forEach(a => console.log(a));
  }
}

findOrder();
