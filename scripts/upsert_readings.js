const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables.');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY in .env.local.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const DATA_DIR = path.join(__dirname, '../data');

const LEVEL_FILES = [
  { level: 1, filename: 'readings-hsk1.json' },
  { level: 2, filename: 'readings-hsk2.json' },
  { level: 3, filename: 'readings-hsk3.json' }
];

function joinArticleField(article, field) {
  if (!Array.isArray(article.content)) return '';
  return article.content
    .map((line) => (typeof line[field] === 'string' ? line[field].trim() : ''))
    .filter(Boolean)
    .join('\n');
}

function mapArticleToRow(article) {
  return {
    hsk_level: article.level,
    title_vi: article.title_vi || '',
    content_zh: joinArticleField(article, 'zh'),
    content_pinyin: joinArticleField(article, 'py'),
    content_vi: joinArticleField(article, 'vi'),
    questions: article.questions || {},
    new_words: article.vocabulary || [],
    is_free: typeof article.is_free === 'boolean' ? article.is_free : false,
    order_num: typeof article.lesson_ref === 'number' ? article.lesson_ref : null,
  };
}

async function importLevel({ level, filename }) {
  const filePath = path.join(DATA_DIR, filename);

  if (!fs.existsSync(filePath)) {
    console.warn(`⚠ File not found: ${filename}. Skipping HSK ${level}.`);
    return;
  }

  let raw;
  try {
    raw = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error(`❌ Failed to read ${filename}:`, err.message);
    return;
  }

  let articles;
  try {
    articles = JSON.parse(raw);
  } catch (err) {
    console.error(`❌ Invalid JSON in ${filename}: ${err.message}`);
    console.error('Please fix the JSON file before running the import again.');
    return;
  }

  if (!Array.isArray(articles)) {
    console.error(`❌ Expected an array in ${filename}. Got ${typeof articles}.`);
    return;
  }

  console.log(`\n--- HSK ${level}: Preparing ${articles.length} articles from ${filename} ---`);
  const rows = articles.map(mapArticleToRow);

  console.log(`🧹 Clearing existing readings with hsk_level = ${level}`);
  const { error: deleteError } = await supabase.from('readings').delete().eq('hsk_level', level);
  if (deleteError) {
    console.error(`❌ Failed to clear HSK ${level} readings:`, deleteError.message);
    return;
  }

  for (let i = 0; i < rows.length; i += 20) {
    const batch = rows.slice(i, i + 20);
    const { error } = await supabase.from('readings').insert(batch, { returning: 'minimal' });
    if (error) {
      console.error(`❌ Upsert error on HSK ${level} batch ${i}:`, error.message);
      return;
    }
    console.log(`✅ Inserted ${Math.min(20, rows.length - i)} rows for HSK ${level}`);
  }
}

async function main() {
  console.log('🚀 Starting readings sync to Supabase');
  for (const levelFile of LEVEL_FILES) {
    await importLevel(levelFile);
  }
  console.log('\n🎉 Reading sync complete.');
}

main().catch((err) => {
  console.error('💥 Fatal error:', err);
  process.exit(1);
});
