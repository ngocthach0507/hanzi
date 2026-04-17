const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkVocab() {
  const { data, error } = await supabase
    .from('vocabulary')
    .select('book_level, lesson_number, count')
    .select('book_level, lesson_number', { count: 'exact' });

  if (error) {
    console.error('Error fetching vocab:', error);
    return;
  }

  // Group by level and lesson
  const stats = {};
  const { data: all } = await supabase.from('vocabulary').select('hsk_level, lesson_number');
  
  all.forEach(v => {
    const key = `HSK ${v.hsk_level} L${v.lesson_number}`;
    stats[key] = (stats[key] || 0) + 1;
  });

  console.log('Vocabulary counts by lesson:');
  Object.keys(stats).sort().forEach(key => {
    if (stats[key] < 12) {
      console.log(`${key}: ${stats[key]} words (LESS THAN 12!)`);
    } else {
      console.log(`${key}: ${stats[key]} words`);
    }
  });
}

checkVocab();
