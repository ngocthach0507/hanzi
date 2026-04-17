import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const DATA_PATH = 'tài liệu hsk/hội thoại/hsk2-dialogues/hsk2_dialogues.json';

async function importDialogues() {
  console.log('--- HSK 2 Dialogue Importer ---');
  
  if (!fs.existsSync(DATA_PATH)) {
    console.error(`Error: File not found at ${DATA_PATH}`);
    return;
  }

  const rawData = fs.readFileSync(DATA_PATH, 'utf8');
  const data = JSON.parse(rawData);

  const texts = [];

  for (const lesson of data.lessons) {
    console.log(`Processing HSK 2 Lesson ${lesson.lesson}: ${lesson.title_zh}`);
    
    for (const text of lesson.texts) {
      texts.push({
        book_level: 2,
        lesson_number: lesson.lesson,
        text_number: text.text_no,
        type: 'dialogue',
        scene_zh: text.scene_zh,
        scene_en: text.scene_en,
        scene_vi: text.scene_vi || text.scene_en,
        audio_ref: text.audio_ref,
        content: JSON.stringify(text.lines)
      });
    }
  }

  console.log(`Prepared ${texts.length} HSK 2 dialogues. Inserting/Upserting...`);

  const { error } = await supabase
    .from('texts')
    .upsert(texts, { onConflict: 'book_level,lesson_number,text_number' });

  if (error) {
    console.error('Error during upsert:', error.message);
  } else {
    console.log('Successfully imported HSK 2 dialogues!');
  }
}

importDialogues();
