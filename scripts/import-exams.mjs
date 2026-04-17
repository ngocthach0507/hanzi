import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Loading exams JSON...");
  const jsonPath = path.join(process.cwd(), 'tài liệu hsk', 'đề thi', 'hsk_exams_generated.json');
  
  if (!fs.existsSync(jsonPath)) {
    console.error("File not found:", jsonPath);
    return;
  }
  
  const exams = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`Found ${exams.length} exams in JSON.`);

  console.log("Emptying the existing exams table...");
  const { error: deleteError } = await supabase.from('exams').delete().gte('id', 1);
  if (deleteError) {
    console.error("Failed to empty exams table:", deleteError.message);
    return;
  }
  console.log("Exams table emptied.");

  console.log("Inserting new exams...");
  let count = 0;
  for (const exam of exams) {
    // stringify questions before insert if needed, but supabase js handles JSON/JSONB natively
    const { error: insertError } = await supabase.from('exams').insert({
      id: exam.id,
      title: exam.title,
      type: exam.type,
      hsk_level: exam.hsk_level,
      duration_minutes: exam.duration_minutes,
      questions: exam.questions,
      is_free: exam.is_free,
      order_num: exam.order_num
    });

    if (insertError) {
      console.error(`Failed to insert exam ${exam.id}:`, insertError.message);
    } else {
      process.stdout.write(`\rInserted ${++count} of ${exams.length} exams.`);
    }
  }

  console.log("\nDone!");
}

run();
