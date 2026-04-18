const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSub() {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('payment_ref', 'DH261367');
  
  if (error) {
    console.error('Error fetching DH261367:', error);
  } else {
    console.log('Subscription with payment_ref DH261367:', data);
  }

  const { data: allData, error: allErr } = await supabase
    .from('subscriptions')
    .select('payment_ref, status, plan')
    .limit(10);
    
  if (allErr) {
    console.error('Error fetching recent:', allErr);
  } else {
    console.log('Recent 10 subscriptions:', allData);
  }
}

checkSub();
