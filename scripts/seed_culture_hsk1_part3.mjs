import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const notes = [
  {
    book_level: 1,
    lesson_number: 11,
    title_vi: "Bốn mùa và niềm cảm hứng từ Thiên nhiên",
    content_vi: "Trung Quốc là quốc gia rộng lớn với khí hậu đa dạng. Miền Bắc có bốn mùa rõ rệt, trong khi miền Nam thường ấm áp hơn. Trong văn hóa Trung Hoa, mỗi mùa đều mang một ý nghĩa triết học riêng. Ví dụ, mùa xuân tượng trưng cho sự khởi đầu và hy vọng. Người Trung Quốc có thói quen theo dõi dự báo thời tiết rất kỹ để chuẩn bị trang phục phù hợp, thể hiện lối sống cẩn trọng và hài hòa với tự nhiên.",
    image_path: "/hsk1_culture_l11_weather_1776210094162.png"
  },
  {
    book_level: 1,
    lesson_number: 12,
    title_vi: "Định hướng không gian và văn hóa chỉ đường",
    content_vi: "Tại các thành phố lớn ở Trung Quốc, hệ thống tên đường thường gắn liền với các phương hướng chính: Đông (Dōng), Tây (Xī), Nam (Nán), Bắc (Běi). Chẳng hạn, 'Trường An Nhai' nằm ở trục Đông-Tây trung tâm Bắc Kinh. Khi hỏi đường, người dân địa phương rất nhiệt tình. Ngày nay, các ứng dụng bản đồ di động như Baidu Maps hay Gaode Maps đã trở nên không thể thiếu, giúp mọi việc định vị trở nên dễ dàng và chính xác tuyệt đối.",
    image_path: "/hsk1_culture_l12_map_1776210110113.png"
  },
  {
    book_level: 1,
    lesson_number: 13,
    title_vi: "Bàn tiệc xoay và Văn hóa ẩm thực cộng đồng",
    content_vi: "Bữa ăn của người Trung Quốc đề cao tính cộng đồng. Các món ăn thường được đặt trên một bàn tròn lớn có mặt xoay (Lazy Susan) ở giữa để mọi người có thể dễ dàng sẻ chia. Việc mời khách ăn cơm là một nghi thức xã giao quan trọng. Khi gọi món, gia chủ thường chọn số lượng món ăn phong phú và đảm bảo có sự cân bằng giữa các loại thực phẩm nhằm thể hiện sự hiếu khách và mong muốn niềm vui trọn vẹn.",
    image_path: "/hsk1_culture_l13_restaurant_1776210127139.png"
  },
  {
    book_level: 1,
    lesson_number: 14,
    title_vi: "Dưỡng sinh và Y học cổ truyền Trung Hoa",
    content_vi: "Sức khỏe đối với người Trung Quốc không chỉ là không có bệnh mà là sự cân bằng giữa âm và dương. Những thói quen như uống trà thảo mộc, tập dưỡng sinh hay sử dụng các bài thuốc từ thảo dược thiên nhiên đã tồn tại hàng ngàn năm. Đây được gọi là Trung y (TCM). Người Trung Quốc tin rằng 'Phòng bệnh hơn chữa bệnh', vì thế việc duy trì một lối sống điều độ và tinh thần thư thái luôn được đặt lên hàng đầu.",
    image_path: "/hsk1_culture_l14_health_1776210141381.png"
  },
  {
    book_level: 1,
    lesson_number: 15,
    title_vi: "Bắc Kinh - Sự giao thoa giữa Quá khứ và Tương lai",
    content_vi: "Bắc Kinh không chỉ là thủ đô mà còn là trung tâm văn hóa, lịch sử vĩ đại nhất của Trung Quốc. Hình ảnh Tử Cấm Thành (Gugong) rực rỡ dưới nắng vàng là biểu tượng cho quyền lực và mỹ thuật của các triều đại xưa. Tuy nhiên, đan xen giữa những bức tường cổ kính là các công trình kiến trúc hiện đại và hệ thống giao thông thông minh. Đến với Bắc Kinh là đến với một vùng đất mà bạn có thể cảm nhận được nhịp thở của lịch sử hàng ngàn năm hòa quyện cùng sự phát triển thần tốc của tương lai.",
    image_path: "/hsk1_culture_l15_beijing_1776210155403.png"
  }
];

async function seed() {
  const { error } = await supabase.from('culture_notes').upsert(notes, { onConflict: 'book_level,lesson_number' });
  if (error) console.error(error);
  else console.log('Successfully seeded HSK 1 culture notes (Lessons 11-15)!');
}

seed();
