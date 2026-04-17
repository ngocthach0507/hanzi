import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const notes = [
  {
    book_level: 1,
    lesson_number: 6,
    title_vi: "Cách ghi ngày tháng và hệ thống âm lịch",
    content_vi: "Người Trung Quốc viết ngày tháng theo thứ tự từ lớn đến nhỏ: Năm - Tháng - Ngày. Bên cạnh dương lịch, âm lịch (Nónglì) vẫn đóng vai trò cực kỳ quan trọng, quyết định ngày tổ chức các lễ hội truyền thống như Tết Nguyên Đán, Tết Trung Thu. Các mốc thời gian trong ngày cũng thường được chia rõ rệt thành buổi sáng (shàngwǔ), buổi trưa (zhōngwǔ) và buổi chiều (xiàwǔ).",
    image_path: "/hsk1_culture_l6_time_1776209932181.png"
  },
  {
    book_level: 1,
    lesson_number: 7,
    title_vi: "Văn hóa thưởng Trà của người Trung Quốc",
    content_vi: "Trà không chỉ là đồ uống mà là một nét di sản văn hóa. Người Trung Quốc có câu 'Dĩ trà hội hữu' (Dùng trà để kết giao bạn bè). Văn hóa trà đạo đòi hỏi sự tỉ mỉ từ khâu chọn trà, bộ ấm chén đến cách pha và thưởng thức. Khi có khách đến nhà, việc đầu tiên gia chủ làm luôn là pha một ấm trà ngon để đón tiếp, thể hiện sự mến khách và nhã nhặn.",
    image_path: "/hsk1_culture_l7_food_1776209946716.png"
  },
  {
    book_level: 1,
    lesson_number: 8,
    title_vi: "Từ tiền mặt đến kỷ nguyên thanh toán số",
    content_vi: "Đơn vị tiền tệ chính thức là Nhân dân tệ (Yuan). Tuy nhiên, ngày nay Trung Quốc là quốc gia dẫn đầu về thanh toán không tiền mặt. Tại các thành phố lớn, từ các trung tâm thương mại sang trọng đến các sạp hàng nhỏ ven đường, mọi người đều sử dụng mã QR (WeChat Pay hoặc Alipay) để thanh toán. Đây là một sự chuyển mình ngoạn mục của nền kinh tế hiện đại mà du khách cần lưu ý khi đến đây.",
    image_path: "/hsk1_culture_l8_money_1776209963836.png"
  },
  {
    book_level: 1,
    lesson_number: 9,
    title_vi: "Môi trường công sở và văn hóa làm việc",
    content_vi: "Trong các văn phòng hiện đại tại Trung Quốc, nhịp độ làm việc thường rất nhanh. Các tòa nhà chọc trời tại Thượng Hải, Thâm Quyến hay Bắc Kinh là nơi hội tụ của các tập đoàn công nghệ hàng đầu. Một nét văn hóa thú vị là thói quen ngủ trưa ngắn ngay tại bàn làm việc để tái tạo năng lượng. Ngoài ra, việc xây dựng mối quan hệ (Guanxi) trong kinh doanh vẫn là một yếu tố then chốt dẫn đến thành công.",
    image_path: "/hsk1_culture_l9_work_1776209979631.png"
  },
  {
    book_level: 1,
    lesson_number: 10,
    title_vi: "Hệ thống Giao thông hiện đại và Tàu cao tốc",
    content_vi: "Trung Quốc sở hữu mạng lưới tàu cao tốc (Fùxīng hào) lớn nhất thế giới, kết nối các thành phố cách nhau hàng ngàn km chỉ trong vài giờ. Đây là niềm tự hào về hạ tầng của quốc gia này. Tại các đô thị lớn, hệ thống tàu điện ngầm cực kỳ hiện đại và xe đạp công cộng là phương tiện phổ biến giúp giảm thiểu ùn tắc. Di chuyển bằng tàu cao tốc không chỉ nhanh mà còn cực kỳ đúng giờ và tiện lợi.",
    image_path: "/hsk1_culture_l10_traffic_retry_1776210058742.png"
  }
];

async function seed() {
  const { error } = await supabase.from('culture_notes').upsert(notes, { onConflict: 'book_level,lesson_number' });
  if (error) console.error(error);
  else console.log('Successfully seeded HSK 1 culture notes (Lessons 6-10)!');
}

seed();
