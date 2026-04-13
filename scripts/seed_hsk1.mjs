import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Tải biến môi trường từ .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Thiếu cấu hình Supabase URL hoặc Service Key!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedHSK1() {
  console.log("🚀 Bắt đầu nạp nội dung HSK1 (Bài 1-5)...");

  // 1. Cập nhật tiêu đề bài học
  const lessons = [
    { hsk_level: 1, lesson_number: 1, title: "Chào hỏi (Hello)", is_free: true },
    { hsk_level: 1, lesson_number: 2, title: "Tên bạn là gì? (What's your name?)", is_free: true },
    { hsk_level: 1, lesson_number: 3, title: "Gia đình tôi (My Family)", is_free: true },
    { hsk_level: 1, lesson_number: 4, title: "Bây giờ là mấy giờ? (What time is it?)", is_free: false },
    { hsk_level: 1, lesson_number: 5, title: "Mua sắm (Shopping)", is_free: false }
  ];

  for (const lesson of lessons) {
    const { error } = await supabase
      .from('lessons')
      .upsert(lesson, { onConflict: 'hsk_level,lesson_number' });
    if (error) console.error(`Lỗi cập nhật bài ${lesson.lesson_number}:`, error);
  }

  // 2. Nạp từ vựng cho Bài 1: Chào hỏi
  const vocab_lesson1 = [
    { hanzi: "你", pinyin: "nǐ", meaning_vi: "bạn, anh, chị", hsk_level: 1, lesson_number: 1, example_zh: "你好", example_vi: "Chào bạn" },
    { hanzi: "好", pinyin: "hǎo", meaning_vi: "tốt, đẹp, khỏe", hsk_level: 1, lesson_number: 1, example_zh: "你好吗？", example_vi: "Bạn khỏe không?" },
    { hanzi: "您", pinyin: "nín", meaning_vi: "ông, bà, ngài (kính trọng)", hsk_level: 1, lesson_number: 1, example_zh: "老师，您好", example_vi: "Chào thầy (cô) ạ" },
    { hanzi: "老师", pinyin: "lǎoshī", meaning_vi: "thầy giáo, cô giáo", hsk_level: 1, lesson_number: 1, example_zh: "王老师", example_vi: "Thầy giáo Vương" },
    { hanzi: "们", pinyin: "men", meaning_vi: "(hậu tố số nhiều)", hsk_level: 1, lesson_number: 1, example_zh: "你们好", example_vi: "Chào các bạn" }
  ];

  // Nạp từ vựng cho Bài 2: Tên bạn là gì?
  const vocab_lesson2 = [
    { hanzi: "叫", pinyin: "jiào", meaning_vi: "tên là, gọi là", hsk_level: 1, lesson_number: 2, example_zh: "我叫王明", example_vi: "Tôi tên là Vương Minh" },
    { hanzi: "什么", pinyin: "shénme", meaning_vi: "cái gì", hsk_level: 1, lesson_number: 2, example_zh: "这是什么？", example_vi: "Đây là cái gì?" },
    { hanzi: "名字", pinyin: "míngzi", meaning_vi: "tên", hsk_level: 1, lesson_number: 2, example_zh: "什么名字？", example_vi: "Tên là gì?" },
    { hanzi: "我", pinyin: "wǒ", meaning_vi: "tôi, mình, tớ", hsk_level: 1, lesson_number: 2, example_zh: "我是学生", example_vi: "Tôi là học sinh" },
    { hanzi: "是", pinyin: "shì", meaning_vi: "là", hsk_level: 1, lesson_number: 2, example_zh: "你是老板吗？", example_vi: "Bạn là ông chủ sao?" }
  ];

  const all_vocab = [...vocab_lesson1, ...vocab_lesson2];

  // Xóa từ vựng cũ để tránh trùng lặp
  await supabase.from('vocabulary').delete().in('hanzi', all_vocab.map(v => v.hanzi));

  const { error: vError } = await supabase
    .from('vocabulary')
    .insert(all_vocab);

  if (vError) console.error("Lỗi nạp từ vựng:", vError);
  else console.log("✅ Nạp xong từ vựng Bài 1 & 2!");

  console.log("🎉 Hoàn thành nạp nội dung mẫu!");
}

seedHSK1();
