import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const DATA_PATH = 'tài liệu hsk/hội thoại/hsk1-dialogues/hsk1_dialogues.json';

async function importDialogues() {
  console.log('--- HSK 1 Dialogue Importer ---');
  
  if (!fs.existsSync(DATA_PATH)) {
    console.error(`Error: File not found at ${DATA_PATH}`);
    return;
  }

  const rawData = fs.readFileSync(DATA_PATH, 'utf8');
  const data = JSON.parse(rawData);

  const texts = [];

  for (const lesson of data.lessons) {
    console.log(`Processing Lesson ${lesson.lesson}: ${lesson.title_zh}`);
    
    for (const text of lesson.texts) {
      texts.push({
        book_level: 1,
        lesson_number: lesson.lesson,
        text_number: text.text_no,
        type: 'dialogue',
        scene_zh: text.scene_zh,
        scene_en: text.scene_en,
        scene_vi: text.scene_vi || text.scene_en, // Use Vietnamese if available
        audio_ref: text.audio_ref,
        content: JSON.stringify(text.lines)
      });
    }
  }

  console.log(`Prepared ${texts.length} dialogues. Inserting...`);

  // We use upsert. If the UNIQUE constraint on (book_level, lesson_number) is still there,
  // this will only keep 1 text per lesson.
  const { error } = await supabase
    .from('texts')
    .upsert(texts, { onConflict: 'book_level,lesson_number,text_number' });

  if (error) {
    console.error('Error during upsert:', error.message);
    if (error.message.includes('unique_violation') || error.message.includes('duplicate key')) {
      console.log('HINT: You might need to update the UNIQUE constraint on the "texts" table.');
      console.log('Run this in Supabase SQL Editor:');
      console.log(`
        ALTER TABLE texts DROP CONSTRAINT IF EXISTS texts_book_level_lesson_number_key;
        ALTER TABLE texts ADD CONSTRAINT texts_hsk_lesson_text_unique UNIQUE (book_level, lesson_number, text_number);
      `);
    }
  } else {
    console.log('Successfully imported dialogues!');
  }
}

importDialogues();
