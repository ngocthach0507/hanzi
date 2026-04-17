import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const DATA_PATH = path.join(__dirname, '../data/texts-hsk3.json');

async function importHSK3Dialogues() {
  console.log('--- HSK 3 Dialogue Importer ---');
  
  if (!fs.existsSync(DATA_PATH)) {
    console.error(`Error: File not found at ${DATA_PATH}`);
    return;
  }

  console.log(`Reading data from ${DATA_PATH}...`);
  const rawData = fs.readFileSync(DATA_PATH, 'utf8');
  const texts = JSON.parse(rawData);

  console.log(`Prepared ${texts.length} HSK 3 dialogues. Clearing old HSK 3 texts and performing Upsert...`);

  // Target clear to avoid affecting HSK 1 & 2
  const { error: clearError } = await supabase
    .from('texts')
    .delete()
    .eq('book_level', 3);

  if (clearError) {
    console.error('Error clearing old HSK 3 texts:', clearError.message);
    return;
  }

  // Upsert in batches
  for (let i = 0; i < texts.length; i += 20) {
    const batch = texts.slice(i, i + 20);
    const { error } = await supabase
      .from('texts')
      .upsert(batch, { onConflict: 'book_level,lesson_number,text_number' });

    if (error) {
      console.error(`Error during batch ${i}:`, error.message);
    } else {
      console.log(`Successfully imported batch starting at ${i}`);
    }
  }

  console.log('🎉 Successfully imported HSK 3 dialogues!');
}

importHSK3Dialogues();
