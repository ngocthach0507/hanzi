import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkReadings() {
  console.log('--- Checking Readings in Database ---');
  const { count, error } = await supabase
    .from('readings')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log(`Total Readings on Web: ${count}`);
  }
}

checkReadings();
