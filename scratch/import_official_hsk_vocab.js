const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const VOCAB_MAP_PATH = path.join(process.cwd(), 'vocab_vi_map.json');
const DATA_DIR = path.join(process.cwd(), 'tài liệu hsk/hsk_database');

const vocabViMap = JSON.parse(fs.readFileSync(VOCAB_MAP_PATH, 'utf8'));

async function importVocab() {
  console.log('🚀 Starting HSK Vocabulary Import (Official Curriculum)...');

  const files = [
    { name: 'hsk1_vocabulary.json', level: 1 },
    { name: 'hsk2_vocabulary.json', level: 2 },
    { name: 'hsk3_vocabulary.json', level: 3 }
  ];

  // 1. Xóa dữ liệu cũ của HSK 1-3 để đảm bảo sạch sẽ
  console.log('🧹 Clearing old HSK 1-3 vocabulary...');
  await supabase.from('vocabulary').delete().in('book_level', [1, 2, 3]);
  await supabase.from('lessons').delete().in('book_level', [1, 2, 3]);

  for (const fileInfo of files) {
    const filePath = path.join(DATA_DIR, fileInfo.name);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ File not found: ${filePath}`);
      continue;
    }

    const book = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const level = fileInfo.level;
    
    console.log(`\n📚 Processing HSK ${level}...`);

    const allWords = [];
    const allLessons = [];

    for (const lesson of book.lessons) {
      // Chuẩn bị dữ liệu bài học
      allLessons.push({
        book_level: level,
        lesson_number: lesson.lesson,
        title_zh: lesson.title_zh,
        title_en: lesson.title_en,
        is_free: lesson.lesson <= 3
      });

      // Chuẩn bị dữ liệu từ vựng
      for (const word of lesson.vocabulary) {
        const meaningVi = vocabViMap[word.hanzi] || "";
        
        allWords.push({
          book_level: level,
          lesson_number: lesson.lesson,
          word_number: word.no,
          hanzi: word.hanzi,
          pinyin: word.pinyin,
          meaning_vi: meaningVi,
          meaning_en: word.en || null,
          part_of_speech: mapPos(word.pos),
          hsk_level: level
        });
      }
    }

    // Insert Lessons
    console.log(`   - Inserting ${allLessons.length} lessons...`);
    const { error: lessonError } = await supabase.from('lessons').upsert(allLessons, { onConflict: 'book_level,lesson_number' });
    if (lessonError) console.error('   ❌ Lesson Error:', lessonError.message);

    // Insert Vocab in batches
    console.log(`   - Inserting ${allWords.length} words...`);
    const batchSize = 50;
    for (let i = 0; i < allWords.length; i += batchSize) {
      const batch = allWords.slice(i, i + batchSize);
      const { error: vocabError } = await supabase.from('vocabulary').insert(batch);
      if (vocabError) console.error(`   ❌ Vocab Batch ${i} Error:`, vocabError.message);
    }
  }

  console.log('\n✅ Import completed successfully!');
}

function mapPos(pos) {
  if (!pos) return null;
  const map = {
    'n.': 'Danh từ',
    'v.': 'Động từ',
    'adj.': 'Tính từ',
    'adv.': 'Trạng từ',
    'pron.': 'Đại từ',
    'num.': 'Số từ',
    'm.': 'Lượng từ',
    'conj.': 'Liên từ',
    'prep.': 'Giới từ',
    'part.': 'Trợ từ',
    'int.': 'Thán từ',
    'suf.': 'Hậu tố',
    'pref.': 'Tiền tố',
    'mod.': 'Động từ năng nguyện'
  };
  return map[pos.toLowerCase()] || pos;
}

importVocab();
