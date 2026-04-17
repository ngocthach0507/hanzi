import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function importGrammar(filename) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ File not found: ${filename}`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`📥 Inserting ${data.length} grammar points from ${filename}...`);

  for (let i = 0; i < data.length; i += 50) {
    const batch = data.slice(i, i + 50);
    const { error } = await supabase.from('grammar_points').upsert(batch);
    if (error) {
      console.error(`❌ Error in batch ${i}:`, error.message);
    } else {
      console.log(`✅ Progress: ${i + Math.min(50, data.length - i)} items`);
    }
  }
}

async function main() {
  console.log('🚀 Starting Grammar Refresh...');

  // 1. Clear all existing grammar points
  console.log('🧹 Clearing grammar_points table...');
  const { error: delError } = await supabase.from('grammar_points').delete().neq('id', 0);
  if (delError) {
    console.error('❌ Error clearing table:', delError.message);
    return;
  }

  // 2. Import new data
  await importGrammar('grammar-hsk1.json');
  await importGrammar('grammar-hsk2.json');
  await importGrammar('grammar-hsk3.json');

  console.log('\n🎉 Grammar refresh hoàn tất!');
}

main().catch(console.error);
