import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const placeholderImg = "/hsk1_culture_l15_beijing_1776210155403.png"; // Defaulting to the beautiful Beijing image

const notes = [
  {
    book_level: 2,
    lesson_number: 1,
    title_vi: "Đặc sản Vịt quay Bắc Kinh",
    content_vi: "Vịt quay Bắc Kinh (Běijīng kǎoyā) là món ăn biểu tượng của thủ đô Trung Quốc. Lớp da vịt mỏng, giòn, được tẩm ướp cầu kỳ và quay trong lò đặc biệt. Khi ăn, thịt vịt được thái lát mỏng, cuộn trong bánh tráng cùng hành lá, dưa chuột và chấm nước sốt ngọt. Đây không chỉ là một bữa ăn, mà là một trải nghiệm nghệ thuật ẩm thực đã tồn tại hàng trăm năm, thường được dùng để chiêu đãi khách quý.",
    image_path: "/hsk2_culture_l1_duck_1776210920019.png"
  },
  {
    book_level: 2,
    lesson_number: 2,
    title_vi: "Văn hóa Taxi và Ứng dụng gọi xe",
    content_vi: "Tại Trung Quốc, việc bắt taxi (dǎchē) rất thuận tiện. Những chiếc xe màu xanh, vàng hay đỏ là hình ảnh quen thuộc trên đường phố. Tuy nhiên, ngày nay hầu hết người dân đều sử dụng ứng dụng gọi xe (như Didi Chuxing). Phương thức này không chỉ giúp bạn biết trước giá tiền mà còn đảm bảo tính an toàn và minh bạch. Khi bắt taxi truyền thống, bạn nên yêu cầu tài xế bật đồng hồ (jìchéngqì) để trả đúng giá.",
    image_path: placeholderImg
  },
  {
    book_level: 2,
    lesson_number: 3,
    title_vi: "Tây An - Cố đô ngàn năm lịch sử",
    content_vi: "Tây An, thủ phủ tỉnh Thiểm Tây, là một trong những cố đô vĩ đại nhất của Trung Quốc. Đây là điểm khởi đầu của Con đường tơ lụa và là nơi tọa lạc của Đội quân Đất nung (Bīngmǎyǒng) nổi tiếng thế giới. Đến với Tây An, du khách không chỉ được chiêm ngưỡng những di tích lịch sử hùng vĩ mà còn được thưởng thức nền ẩm thực đường phố đặc sắc tại khu phố Hồi giáo, mang đậm dấu ấn văn hóa Trung Á.",
    image_path: placeholderImg
  },
  {
    book_level: 2,
    lesson_number: 4,
    title_vi: "Ý nghĩa của màu sắc trong văn hóa Trung Hoa",
    content_vi: "Trong mắt người Trung Quốc, màu sắc mang những thông điệp tâm linh mạnh mẽ. Màu đỏ (hóngsè) tượng trưng cho may mắn, hạnh phúc và thành công, thường xuất hiện trong đám cưới và lễ Tết. Ngược lại, màu trắng (báisè) truyền thống thường gắn liền với tang tóc và sự chia ly. Hiểu được ý nghĩa này sẽ giúp bạn chọn trang phục và quà tặng tinh tế hơn khi giao tiếp với người bản xứ.",
    image_path: placeholderImg
  },
  {
    book_level: 2,
    lesson_number: 5,
    title_vi: "Nghi thức khi đến thăm nhà người Trung Quốc",
    content_vi: "Khi được mời đến nhà (zuòkè), việc mang theo một món quà nhỏ như trái cây, bánh kẹo hay trà là một cử chỉ đẹp. Hãy nhớ đưa quà bằng cả hai tay để thể hiện sự tôn trọng. Khi vào nhà, bạn thường sẽ được chủ nhà chuẩn bị dép đi trong nhà. Trong bữa cơm, không nên cắm đũa thẳng đứng vào bát cơm vì hình ảnh này gợi nhớ đến bát hương cúng người quá cố. Sự quan sát và ý tứ sẽ giúp bạn ghi điểm tuyệt đối trong lòng gia chủ.",
    image_path: placeholderImg
  },
  {
    book_level: 2,
    lesson_number: 6,
    title_vi: "Sợi mì trường thọ trong ngày sinh nhật",
    content_vi: "Trong ngày sinh nhật của người Trung Quốc, thay vì chỉ có bánh kem hiện đại, một bát Mì trường thọ (chángshòumiàn) là món ăn không thể thiếu. Sợi mì được làm rất dài và không được cắt đứt khi nấu, tượng trưng cho lời chúc sống lâu, khỏe mạnh. Người ăn cũng nên cố gắng ăn hết sợi mì mà không làm đứt đoạn để trọn vẹn ý nghĩa của lời chúc.",
    image_path: placeholderImg
  },
  {
    book_level: 2,
    lesson_number: 7,
    title_vi: "Sức hút của môn bóng rổ tại Trung Quốc",
    content_vi: "Bóng rổ là một trong những môn thể thao phổ biến nhất tại Trung Quốc, đặc biệt là trong giới trẻ. Tầm ảnh hưởng của tượng đài Yao Ming đã đưa NBA trở thành giải đấu được theo dõi nhiều nhất. Tại bất kỳ trường học hay khu dân cư nào, bạn cũng dễ dàng bắt gặp những sân bóng rổ đông đúc. Chơi thể thao không chỉ để rèn luyện sức khỏe mà còn là cách để các bạn trẻ kết nối và xây dựng tình bạn.",
    image_path: placeholderImg
  },
  {
    book_level: 2,
    lesson_number: 8,
    title_vi: "Văn hóa 'Quan hệ' và sự giúp đỡ lẫn nhau",
    content_vi: "Khái niệm 'Quan hệ' (Guānxì) đóng vai trò then chốt trong đời sống xã hội và kinh doanh tại Trung Quốc. Nó dựa trên sự tin tưởng và giúp đỡ lẫn nhau giữa bạn bè, người thân. Khi bạn giúp đỡ ai đó, bạn đang xây dựng một 'quỹ ân nghĩa'. Người Trung Quốc tin rằng sự kết nối chặt chẽ giữa người với người sẽ giúp mọi công việc trở nên suôn sẻ và thuận lợi hơn.",
    image_path: placeholderImg
  },
  {
    book_level: 2,
    lesson_number: 9,
    title_vi: "Trà sữa và Cà phê trong đời sống hiện đại",
    content_vi: "Dù trà truyền thống vẫn giữ vị thế độc tôn, nhưng Trà sữa (nǎichá) và Cà phê đã trở thành một phần không thể thiếu trong nhịp sống hối hả của giới trẻ sành điệu. Các quán cà phê hiện đại mọc lên khắp nơi, từ các thương hiệu lớn đến các tiệm nhỏ decor đầy nghệ thuật. Việc hẹn hò 'đi cà phê' hay order một ly trà sữa vào buổi chiều đã trở thành một thói quen thư giãn phổ biến của dân văn phòng và sinh viên.",
    image_path: placeholderImg
  },
  {
    book_level: 2,
    lesson_number: 10,
    title_vi: "Áp lực thi cử và tinh thần hiếu học",
    content_vi: "Trung Quốc là quốc gia có truyền thống hiếu học hàng nghìn năm. Các kỳ thi, đặc biệt là kỳ thi đại học (Gāokǎo), được ví như 'trận chiến' quyết định tương lai. Học sinh thường dành rất nhiều thời gian để ôn luyện, đọc sách và viết bài tập mỗi ngày. Tinh thần 'học, học nữa, học mãi' luôn được các bậc phụ huynh khuyến khích để con em mình có một sự nghiệp thành đạt và cuộc sống ổn định.",
    image_path: placeholderImg
  },
  {
    book_level: 2,
    lesson_number: 11,
    title_vi: "Khám phá 'Bát đại thái hệ' (8 nền ẩm thực lớn)",
    content_vi: "Ẩm thực Trung Quốc không chỉ có một màu sắc. Nó được chia thành 8 trường phái lớn như: Xuyên (Tứ Xuyên), Lỗ (Sơn Đông), Tô (Giang Tô), Quảng (Quảng Đông)... Mỗi vùng miền đều có khẩu vị riêng, từ cay nồng nhiệt đới đến thanh đạm tinh tế. Người Trung Quốc tin rằng ăn uống là cách tốt nhất để hiểu về văn hóa của mỗi vùng đất.",
    image_path: placeholderImg
  },
  {
    book_level: 2,
    lesson_number: 12,
    title_vi: "Khác biệt khí hậu giữa hai miền Nam - Bắc",
    content_vi: "Vỗn dĩ diện tích rộng lớn, khí hậu Trung Quốc có sự phân hóa cực kỳ rõ rệt. Miền Bắc có mùa đông lạnh giá, tuyết rơi dày và cần có hệ thống sưởi ấm trong nhà. Miền Nam lại có khí hậu ẩm ướt, mưa nhiều và mùa đông dịu nhẹ hơn. Sự khác biệt này không chỉ ảnh hưởng đến lối sống, trang phục mà còn định hình nên đặc trưng tính cách và phong tục tập quán của người dân mỗi miền.",
    image_path: placeholderImg
  },
  {
    book_level: 2,
    lesson_number: 13,
    title_vi: "Học ngoại ngữ và khái niệm 'Thể diện'",
    content_vi: "Việc học tiếng Trung hay bất kỳ ngoại ngữ nào đều được người Trung Quốc coi trọng. Trong giao tiếp, khái niệm 'Thể diện' (Miànzi) rất quan trọng. Khi khen ngợi ai đó (ví dụ như khen họ nói tiếng Trung giỏi), bạn đang 'cho' họ thể diện. Điều này giúp không khí giao tiếp trở nên hài hòa và thân thiện hơn. Sự khiêm tốn đáp lại lời khen cũng là một nét văn hóa ứng xử tinh tế.",
    image_path: placeholderImg
  },
  {
    book_level: 2,
    lesson_number: 14,
    title_vi: "Tết Nguyên Đán - Lễ hội quan trọng nhất",
    content_vi: "Tết Nguyên Đán (Chūnjié) là dịp lễ thiêng liêng nhất, là lúc 'Xuân vận' - cuộc di dân lớn nhất thế giới khi mọi người đều trở về quê hương. Bữa cơm tất niên đêm giao thừa là thời khắc đoàn tụ của cả gia đình. Những phong tục như dán câu đối đỏ, đốt pháo hoa (ở vùng nông thôn) và mừng tuổi bằng phong bao lì xì mang ý nghĩa xua đuổi điều không may và đón chào một năm mới bình an, thịnh vượng.",
    image_path: placeholderImg
  },
  {
    book_level: 2,
    lesson_number: 15,
    title_vi: "Trung Quốc trong mắt bạn bè quốc tế",
    content_vi: "Với sự phát triển không ngừng, Trung Quốc ngày càng thu hút đông đảo sinh viên và khách du lịch từ khắp nơi trên thế giới. Sự hiếu khách, hạ tầng hiện đại cùng những di sản văn hóa đồ sộ luôn để lại ấn tượng khó quên. Việc quay lại Trung Quốc nhiều lần để khám phá thêm những vùng đất mới đã trở thành mong muốn của rất nhiều bạn bè quốc tế yêu mến quốc gia nghìn năm văn hiến này.",
    image_path: placeholderImg
  }
];

async function seed() {
  const { error } = await supabase.from('culture_notes').upsert(notes, { onConflict: 'book_level,lesson_number' });
  if (error) console.error(error);
  else console.log('Successfully seeded all 15 HSK 2 culture notes!');
}

seed();
