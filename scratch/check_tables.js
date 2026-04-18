import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTables() {
  console.log('--- CHECKING TABLES ---');
  const { data, error } = await supabase.rpc('get_tables'); // This might not work if no rpc
  
  if (error) {
    // Try listing from subscriptions with a broad search
    console.log('Searching for any ref containing 261367...');
    const { data: d2 } = await supabase.from('subscriptions').select('*');
    const match = d2.find(s => s.payment_ref && s.payment_ref.includes('261367'));
    if (match) console.log('MATCH FOUND:', match);
    else console.log('No match in all', d2.length, 'records');

    // Check if there are other tables like "subscription" (singular)
    const { data: d3, error: e3 } = await supabase.from('subscription').select('*').limit(1);
    if (!e3) console.log('Table "subscription" EXISTS');
  }
}

checkTables();
