#!/usr/bin/env node
/**
 * scripts/import-vocab.js
 * Import toàn bộ từ vựng HSK 1, 2, 3 vào Supabase
 * Usage: node scripts/import-vocab.js
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const path = require('path')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY  // Service key (không phải anon key)
)

const DATA_DIR = path.join(__dirname, '../data')

async function importBatch(table, rows, batchSize = 50) {
  let inserted = 0
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize)
    const { error } = await supabase.from(table).upsert(batch)
    if (error) {
      console.error(`  ❌ Batch ${i}–${i+batchSize}:`, error.message)
    } else {
      inserted += batch.length
      process.stdout.write(`  ✓ ${inserted}/${rows.length}\r`)
    }
  }
  console.log(`  ✅ ${table}: ${inserted} records`)
}

async function importVocabFromBook(filename, bookLevel) {
  const book = require(path.join(DATA_DIR, filename))
  const allWords = []

  for (const lesson of book.lessons) {
    for (const word of lesson.vocabulary) {
      allWords.push({
        book_level:     bookLevel,
        lesson_number:  lesson.lesson,
        word_number:    word.no,
        hanzi:          word.hanzi,
        pinyin:         word.pinyin,
        part_of_speech: word.pos || null,
        meaning_en:     word.en || null,
        hsk_level:      bookLevel,
      })
    }
  }

  console.log(`\n📚 HSK ${bookLevel}: ${allWords.length} từ vựng`)
  await importBatch('vocabulary', allWords)
}

async function main() {
  console.log('🚀 Bắt đầu import từ vựng HSK 1, 2, 3...\n')

  // Import books metadata
  const books = [
    { level:1, title_zh:'新HSK教程1', title_vi:'Tân HSK Giáo Trình 1', title_en:'New HSK Course 1', total_lessons:15, total_words:196, total_grammar:40, hours_min:30, hours_max:36, color_hex:'#E53E3E' },
    { level:2, title_zh:'新HSK教程2', title_vi:'Tân HSK Giáo Trình 2', title_en:'New HSK Course 2', total_lessons:15, total_words:213, total_grammar:45, hours_min:30, hours_max:45, color_hex:'#DD6B20' },
    { level:3, title_zh:'新HSK教程3', title_vi:'Tân HSK Giáo Trình 3', title_en:'New HSK Course 3', total_lessons:18, total_words:283, total_grammar:63, hours_min:54, hours_max:72, color_hex:'#D69E2E' },
  ]
  console.log('📖 Importing books...')
  await importBatch('books', books)

  // Import lessons
  const hsk1 = require(path.join(DATA_DIR, 'hsk1_vocabulary.json'))
  const hsk2 = require(path.join(DATA_DIR, 'hsk2_vocabulary.json'))
  const hsk3 = require(path.join(DATA_DIR, 'hsk3_vocabulary.json'))

  const allLessons = []
  for (const book of [hsk1, hsk2, hsk3]) {
    const level = parseInt(book.metadata.book.match(/\d/)[0])
    for (const lesson of book.lessons) {
      allLessons.push({
        book_level:     level,
        lesson_number:  lesson.lesson,
        title_zh:       lesson.title_zh,
        title_en:       lesson.title_en,
        word_count:     lesson.word_count,
        is_free:        lesson.lesson <= 3,
      })
    }
  }
  console.log('\n📝 Importing lessons...')
  await importBatch('lessons', allLessons)

  // Import vocabulary
  await importVocabFromBook('hsk1_vocabulary.json', 1)
  await importVocabFromBook('hsk2_vocabulary.json', 2)
  await importVocabFromBook('hsk3_vocabulary.json', 3)

  console.log('\n🎉 Import hoàn tất!')
  console.log('   HSK 1: 15 bài, 196 từ')
  console.log('   HSK 2: 15 bài, 213 từ')
  console.log('   HSK 3: 18 bài, 283 từ')
  console.log('   Tổng:  48 bài, 692 từ')
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
