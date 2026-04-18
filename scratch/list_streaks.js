import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function findNewUsers() {
  console.log('--- ALL USER STREAKS ---');
  const { data, error } = await supabase
    .from('user_streaks')
    .select('*');

  if (data) {
    data.forEach(d => console.log(d));
  }
}

findNewUsers();
