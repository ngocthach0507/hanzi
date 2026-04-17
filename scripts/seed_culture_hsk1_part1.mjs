import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const notes = [
  {
    book_level: 1,
    lesson_number: 1,
    title_vi: "Văn hóa Chào hỏi của người Trung Quốc",
    content_vi: "Người Trung Quốc rất coi trọng lễ nghĩa trong chào hỏi. Câu chào phổ biến nhất là 'Nǐ hǎo' (Chào bạn). Khi chào người lớn tuổi hoặc cấp trên, họ thường dùng 'Nín hǎo' để thể hiện sự tôn trọng. Một nét đặc trưng khác là hành động hơi cúi đầu khi chào. Trong môi trường công sở hiện đại, bắt tay đã trở nên phổ biến, nhưng vẫn nên đợi người lớn tuổi hoặc phụ nữ chủ động đưa tay trước.",
    image_path: "/hsk1_culture_l1_greeting_1776209252433.png"
  },
  {
    book_level: 1,
    lesson_number: 2,
    title_vi: "Cách thể hiện lòng biết ơn và sự khiêm tốn",
    content_vi: "'Xièxie' là cách nói cảm ơn phổ biến nhất. Tuy nhiên, trong văn hóa Trung Hoa, việc nhận quà hoặc lời khen thường đi kèm với sự khiêm tốn. Khi ai đó cảm ơn bạn, thay vì chỉ nói 'Không có gì', người Trung Quốc thường dùng 'Bú kèqi' (Đừng khách sáo) hoặc 'Méishì' (Không có việc gì đâu). Đặc biệt, khi nhận quà, người ta thường dùng cả hai tay để thể hiện sự trân trọng đối với người tặng.",
    image_path: "/hsk1_culture_l2_thanks_1776209270683.png"
  },
  {
    book_level: 1,
    lesson_number: 3,
    title_vi: "Ý nghĩa và cấu trúc Tên người Trung Quốc",
    content_vi: "Tên người Trung Quốc thường có cấu trúc: Họ trước - Tên sau. Họ thường chỉ có một chữ (như Vương, Lý, Trương), và tên có một hoặc hai chữ. Mỗi cái tên đều mang một ý nghĩa sâu sắc, gửi gắm ước nguyện của cha mẹ. Chẳng hạn, tên 'Đông' (Dōng) tượng trưng cho phương Đông, 'Bình' (Píng) tượng trưng cho sự bình an. Ngoài ra, con dấu (tiếng Trung gọi là 'Yìnzhāng') vẫn được dùng rộng rãi như một chữ ký chính thức trong nhiều giao dịch quan trọng.",
    image_path: "/hsk1_culture_l3_names_retry_1776209290169.png"
  },
  {
    book_level: 1,
    lesson_number: 4,
    title_vi: "Gia đình - Cốt lõi của xã hội Trung Hoa",
    content_vi: "Gia đình là tế bào quan trọng nhất trong xã hội Trung Quốc. Chữ 'Hiếu' (Xiào) luôn được đặt lên hàng đầu, thể hiện sự kính trọng và chăm sóc đối với cha mẹ, ông bà. Những gia đình 'tứ đại đồng đường' (bốn thế hệ chung sống) từng rất phổ biến và vẫn là biểu tượng của sự phúc đức, sum vầy. Trong các dịp lễ Tết, bữa cơm tất niên là thời khắc thiêng liêng nhất để mọi thành viên trở về đoàn tụ.",
    image_path: "/hsk1_culture_l4_family_retry_1776209306627.png"
  },
  {
    book_level: 1,
    lesson_number: 5,
    title_vi: "Quan niệm về tuổi tác và các dịp mừng thọ",
    content_vi: "Ở Trung Quốc, tuổi tác thường gắn liền với sự thông thái và địa vị xã hội. Những dịp mừng thọ (60, 70, 80 tuổi...) được tổ chức rất trang trọng. Hình ảnh 'Trái đào trường thọ' (Shoutao) là biểu tượng không thể thiếu trong các bữa tiệc này, tượng trưng cho lời chúc sống lâu trăm tuổi. Ngoài ra, người Trung Quốc còn có cách tính tuổi mụ (tuổi ảo), tính thêm một tuổi ngay từ khi đứa trẻ mới chào đời.",
    image_path: "/hsk1_culture_l5_age_retry_1776209321902.png"
  }
];

async function seed() {
  const { error } = await supabase.from('culture_notes').upsert(notes, { onConflict: 'book_level,lesson_number' });
  if (error) console.error(error);
  else console.log('Successfully seeded 5 HSK 1 culture notes!');
}

seed();
