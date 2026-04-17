const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('Checking tables...');
  
  // List of tables we might be interested in
  const tables = ['lessons', 'texts', 'dialogues', 'listening_materials', 'reading_materials', 'vocabulary'];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`Table ${table}: NOT FOUND or Error (${error.message})`);
    } else {
      console.log(`Table ${table}: OK (Sample key: ${data[0] ? Object.keys(data[0]).join(', ') : 'Empty'})`);
    }
  }
}

checkSchema();
