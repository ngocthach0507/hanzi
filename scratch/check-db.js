import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkDatabase() {
  console.log('--- Database Sync Status ---');
  
  // Count Dialogues (texts table)
  const { count: textCount, error: textError } = await supabase
    .from('texts')
    .select('*', { count: 'exact', head: true });
    
  // Count Lessons
  const { count: lessonCount, error: lessonError } = await supabase
    .from('lessons')
    .select('*', { count: 'exact', head: true });

  // Count Grammar
  const { count: grammarCount, error: grammarError } = await supabase
    .from('grammar_points')
    .select('*', { count: 'exact', head: true });

  console.log(`Dialogues (texts): ${textCount}`);
  console.log(`Lessons: ${lessonCount}`);
  console.log(`Grammar Points: ${grammarCount}`);
  
  if (textError) console.error('Text Error:', textError.message);
}

checkDatabase();
