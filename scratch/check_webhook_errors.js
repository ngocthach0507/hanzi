const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkErrors() {
  const { data, error } = await supabase
    .from('webhook_errors')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);
  
  if (error) {
    console.error('Error fetching webhook_errors:', error);
    return;
  }
  
  console.log('Recent Webhook Errors:');
  data.forEach(err => {
    console.log(`[${err.created_at}] Error: ${err.error}`);
    console.log(`Payload: ${JSON.stringify(err.payload)}`);
    console.log('---');
  });
}

checkErrors();
