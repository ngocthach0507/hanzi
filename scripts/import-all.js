const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const DATA_DIR = path.join(__dirname, '../data');

async function importTable(table, filename, clearWhere = null, onConflict = 'id') {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ File not found: ${filename}, skipping ${table}`);
    return;
  }

  console.log(`\n--- Importing ${table} from ${filename} ---`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (clearWhere) {
    console.log(`🧹 Clearing ${table} entries with condition:`, clearWhere);
    if (Object.keys(clearWhere).length === 0) {
      // Do nothing instead of full clear to avoid losing progress
      console.log(`  (Skip full clear to preserve user progress)`);
    } else {
      const { error: delError } = await supabase.from(table).delete().match(clearWhere);
      if (delError) console.error(`❌ Error clearing ${table}:`, delError.message);
    }
  }

  console.log(`📥 Inserting ${data.length} records into ${table}...`);
  for (let i = 0; i < data.length; i += 50) {
    const batch = data.slice(i, i + 50);
    const { error } = await supabase.from(table).upsert(batch, { onConflict });
    if (error) {
      console.error(`❌ Error in ${table} batch ${i}:`, error.message);
    } else {
      console.log(`✅ ${table}: ${i + Math.min(50, data.length - i)} records`);
    }
  }
}

async function main() {
  console.log('🚀 Starting Data Import Process (V3 Spec)...');

  // 1. Books (Base for levels)
  await importTable('books', 'books.json', {});

  // 2. Lessons
  await importTable('lessons', 'lessons-hsk1.json', { book_level: 1 }, 'book_level,lesson_number');
  await importTable('lessons', 'lessons-hsk2.json', { book_level: 2 }, 'book_level,lesson_number');
  await importTable('lessons', 'lessons-hsk3.json', { book_level: 3 }, 'book_level,lesson_number');

  // 3. Vocabulary
  // console.log(`🧹 Clearing all vocabulary entries...`);
  // const { error: delVocabError } = await supabase.from('vocabulary').delete().neq('id', 0);
  // if (delVocabError) console.error(`❌ Error clearing vocabulary:`, delVocabError.message);

  const vConflict = 'book_level,lesson_number,word_number';
  await importTable('vocabulary', 'hsk1-vocabulary.json', null, vConflict);
  await importTable('vocabulary', 'hsk2-vocabulary.json', null, vConflict);
  await importTable('vocabulary', 'hsk3-vocabulary.json', null, vConflict);
  await importTable('vocabulary', 'topic-vocabulary.json', null, 'hanzi'); // Assuming hanzi is unique for topics

  // New Targeted Cleanup Step
  console.log(`\n🧹 Performing targeted cleanup of residual items...`);
  const levels = [1, 2, 3];
  for (const level of levels) {
    const vocabFile = path.join(DATA_DIR, `hsk${level}-vocabulary.json`);
    if (fs.existsSync(vocabFile)) {
      const newVocab = JSON.parse(fs.readFileSync(vocabFile, 'utf8'));
      const lessonCounts = {};
      newVocab.forEach(w => {
        lessonCounts[w.lesson_number] = Math.max(lessonCounts[w.lesson_number] || 0, w.word_number);
      });

      for (const [lesson, count] of Object.entries(lessonCounts)) {
        const { error: cleanupError } = await supabase
          .from('vocabulary')
          .delete()
          .eq('book_level', level)
          .eq('lesson_number', parseInt(lesson))
          .gt('word_number', count);
        
        if (cleanupError) console.error(`  ❌ Cleanup Level ${level} Lesson ${lesson} Error:`, cleanupError.message);
        else console.log(`  ✓ Level ${level} Lesson ${lesson}: Residuals cleared (> word ${count})`);
      }
    }
  }


  // 4. Topics
  await importTable('topics', 'topics.json', {});

  // 5. Texts / Dialogues
  console.log(`🧹 Clearing texts entries...`);
  await supabase.from('texts').delete().neq('id', 0);
  await importTable('texts', 'texts-hsk1.json');
  await importTable('texts', 'texts-hsk2.json');
  await importTable('texts', 'texts-hsk3.json');

  // 6. Grammar Points
  console.log(`🧹 Clearing grammar_points entries...`);
  await supabase.from('grammar_points').delete().neq('id', 0);
  await importTable('grammar_points', 'grammar-hsk1.json');
  await importTable('grammar_points', 'grammar-hsk2.json');
  await importTable('grammar_points', 'grammar-hsk3.json');

  // 7. Others
  await importTable('conversations', 'conversations.json', {});
  await importTable('readings', 'readings.json', {});
  await importTable('radicals', 'radicals.json', {});
  await importTable('sentence_patterns', 'sentence-patterns.json', {});
  await importTable('measure_words', 'measure-words.json', {});
  await importTable('exams', 'exams.json', {});

  console.log('\n🎉 Import hoàn tất!');
}

main().catch(error => {
  console.error('💥 Fatal Import Error:', error);
  process.exit(1);
});
