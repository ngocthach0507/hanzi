import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function findByTime() {
  console.log('--- SEARCHING FOR USERS ACTIVE AROUND 12:00 VN TIME ---');
  // 12:00 VN = 05:00 UTC
  const { data, error } = await supabase
    .from('user_progress')
    .select('user_id, completed_at')
    .gte('completed_at', '2026-04-18T04:30:00Z')
    .lte('completed_at', '2026-04-18T05:30:00Z');

  if (data && data.length > 0) {
    console.log('Users active around that time:', [...new Set(data.map(d => d.user_id))]);
  } else {
    console.log('No activity found around 12:00 VN time.');
    
    // Let's just list ALL users who had ANY activity today
    const { data: allToday } = await supabase
      .from('user_progress')
      .select('user_id, completed_at')
      .gte('completed_at', '2026-04-18T00:00:00Z');
    
    const uniqueToday = [...new Set(allToday?.map(d => d.user_id) || [])];
    console.log('Users active today:', uniqueToday);
    
    for (const uid of uniqueToday) {
       const { data: sub } = await supabase.from('subscriptions').select('*').eq('user_id', uid).maybeSingle();
       console.log(`User ${uid} subscription:`, sub);
    }
  }
}

findByTime();
