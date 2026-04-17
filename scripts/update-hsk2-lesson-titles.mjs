import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const titles = {
  1: "Cô ấy mời chúng tôi ăn Vịt quay Bắc Kinh",
  2: "Hay là bắt taxi đi Đại học Bắc Kinh đi",
  3: "Tôi muốn đi du lịch Tây An",
  4: "Bạn mặc màu đỏ trông rất đẹp",
  5: "Lần đầu tiên đến nhà bạn Trung Quốc chơi",
  6: "Chúc mừng sinh nhật Tiểu Tuyết!",
  7: "Anh ấy chơi bóng rổ rất giỏi",
  8: "Mặc dù bạn đã quên, nhưng tôi vẫn nhớ",
  9: "Tôi đi mua một ly trà sữa",
  10: "Sắp thi rồi",
  11: "Tôi thích ăn món Trung Quốc nhất",
  12: "Ở đây lạnh hơn Bắc Kinh nhiều",
  13: "Chúng tôi yêu thích giờ học tiếng Trung",
  14: "Một mình đón Tết thì thật là vô vị",
  15: "Tôi muốn đi Trung Quốc thêm một lần nữa"
};

async function updateLessonTitles() {
  console.log('--- Updating HSK 2 Lesson Titles ---');
  
  for (const [num, vi] of Object.entries(titles)) {
    console.log(`Updating Lesson ${num} -> ${vi}`);
    const { error } = await supabase
      .from('lessons')
      .update({ title_vi: vi })
      .match({ book_level: 2, lesson_number: parseInt(num) });
      
    if (error) {
      console.error(`Error updating lesson ${num}:`, error.message);
    }
  }
  
  console.log('Finished updating HSK 2 lesson titles!');
}

updateLessonTitles();
