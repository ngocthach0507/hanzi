const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listAll() {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*');
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log(`Total subscriptions: ${data.length}`);
  console.log(JSON.stringify(data, null, 2));
}

listAll();
