const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkSchema() {
  const { data: books, error: be } = await supabase.from('books').select('*').limit(1);
  const { data: lessons, error: le } = await supabase.from('lessons').select('*').limit(1);
  const { data: vocab, error: ve } = await supabase.from('vocabulary').select('*').limit(1);

  console.log('--- TABLE SCHEMA CHECK ---');
  if (be) console.log('BOOKS columns:', Object.keys(books[0] || { note: 'no data' })); else console.log('BOOKS error:', be?.message);
  if (le) console.log('LESSONS columns:', Object.keys(lessons[0] || { note: 'no data' })); else console.log('LESSONS error:', le?.message);
  if (ve) console.log('VOCAB columns:', Object.keys(vocab[0] || { note: 'no data' })); else console.log('VOCAB error:', ve?.message);
}

checkSchema();
