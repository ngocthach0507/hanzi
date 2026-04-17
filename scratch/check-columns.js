import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function inspectData() {
  console.log('--- Inspecting Dialogues for HSK 1 ---');
  
  const { data, error } = await supabase
    .from('texts')
    .select('book_level, type, lesson_number, text_number, scene_zh')
    .eq('book_level', 1);
    
  if (error) {
    console.error(error.message);
    return;
  }

  console.log(`Total found for HSK 1: ${data.length}`);
  
  // Count by type
  const types = {};
  data.forEach(d => {
    types[d.type] = (types[d.type] || 0) + 1;
  });
  
  console.log('Breakdown by type:', types);
  
  // Sample of first 5
  console.log('Sample data (first 5):', data.slice(0, 5));
}

inspectData();
