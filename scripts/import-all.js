const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Requires Service Role Key for bypass RLS
);

const DATA_DIR = path.join(__dirname, '../data');

async function importTable(table, filename, clearWhere = null) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ File not found: ${filename}, skipping ${table}`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (clearWhere) {
    console.log(`🧹 Clearing ${table} entries...`);
    // Use a more aggressive delete to ensure all records are gone
    if (Object.keys(clearWhere).length === 0) {
      await supabase.from(table).delete().neq('id', 0);
    } else {
      await supabase.from(table).delete().match(clearWhere);
    }
  }

  console.log(`📥 Importing ${data.length} records into ${table}...`);
  
  for (let i = 0; i < data.length; i += 50) {
    const batch = data.slice(i, i + 50);
    const { error } = await supabase.from(table).insert(batch);
    if (error) {
      console.error(`❌ Error in ${table} batch ${i}:`, error.message);
    } else {
      console.log(`✅ ${table}: ${i + Math.min(50, data.length - i)} records`);
    }
  }
}

async function main() {
  console.log('🚀 Starting Data Import Process...');

  // Vocabulary
  await importTable('vocabulary', 'hsk1-vocabulary.json', { book_level: 1 });
  await importTable('vocabulary', 'hsk2-vocabulary.json', { book_level: 2 });
  await importTable('vocabulary', 'vocab-hsk1-l1-5.json');
  await importTable('vocabulary', 'topic-vocabulary.json');

  // Topics
  await importTable('topics', 'topics.json', {}); // Empty match clears all

  // Texts / Dialogues
  await importTable('texts', 'texts-hsk1.json', {});

  // Others
  await importTable('conversations', 'conversations.json', {});
  await importTable('readings', 'readings.json', {});
  await importTable('radicals', 'radicals.json', {});
  await importTable('sentence_patterns', 'sentence-patterns.json', {});
  await importTable('measure_words', 'measure-words.json', {});
  await importTable('exams', 'exams.json', {});

  console.log('🎉 Import hoàn tất!');
}

main().catch(error => {
  console.error('💥 Fatal Import Error:', error);
  process.exit(1);
});
