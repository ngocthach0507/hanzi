import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkPendingActivity() {
  const users = [
    'user_3CUuKL5U6rcmnspqL4KpKkJ4e4S',
    'user_3CVuglOzuoGjFoEthHwA38jpWFb',
    'user_3CW5G1o0Cq0tO0tQRvsoipqm16i',
    'user_3CWMZQanF5Qq7quIqoelti59tHa'
  ];

  console.log('--- CHECKING PENDING USERS ACTIVITY ---');
  for (const uid of users) {
    const { data: progress } = await supabase
      .from('user_progress')
      .select('completed_at')
      .eq('user_id', uid)
      .order('completed_at', { ascending: false })
      .limit(1);
    
    console.log(`User ${uid}: Last activity ${progress?.[0]?.completed_at || 'Never'}`);
  }
}

checkPendingActivity();
