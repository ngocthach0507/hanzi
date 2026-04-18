import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function findUser() {
  console.log('--- SEARCHING FOR NEW USERS ---');
  // Clerk users are usually synced or we check progress
  const { data, error } = await supabase
    .from('user_progress')
    .select('user_id, completed_at')
    .order('completed_at', { ascending: false })
    .limit(50);

  if (data) {
    const uniqueUsers = [...new Set(data.map(d => d.user_id))];
    console.log('Unique active users recently:', uniqueUsers);
    
    // Check their subscriptions
    const { data: subs } = await supabase
      .from('subscriptions')
      .select('*')
      .in('user_id', uniqueUsers);
    
    console.log('Subscriptions for these users:');
    subs.forEach(s => console.log(s));
  }
}

findUser();
