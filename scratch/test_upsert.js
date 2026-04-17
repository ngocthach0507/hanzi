const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpsert() {
  console.log('Testing upsert to user_progress...');
  const { data, error } = await supabase.from('user_progress').upsert({
    user_id: 'test_user_id',
    content_type: 'test_type',
    content_id: 9999,
    status: 'completed',
    score: 100,
    completed_at: new Date().toISOString()
  }, { onConflict: 'user_id,content_type,content_id' });

  if (error) {
    console.error('UPSERT ERROR:', JSON.stringify(error, null, 2));
  } else {
    console.log('UPSERT SUCCESS:', data);
  }
}

testUpsert();
