import fs from 'fs';
import path from 'path';

const DATA_PATH = 'tài liệu hsk/hội thoại/hsk2-dialogues/hsk2_dialogues.json';

const translations = {
  // Lesson Titles
  "She treated us to Peking Duck": "Cô ấy mời chúng tôi ăn Vịt quay Bắc Kinh",
  "Let's take a taxi to Peking University instead": "Hay là bắt taxi đi Đại học Bắc Kinh đi",
  "I want to visit Xi'an": "Tôi muốn đi du lịch Tây An",
  "You look pretty good in red": "Bạn mặc màu đỏ trông rất đẹp",
  "Visiting a Chinese friend's home for the first time": "Lần đầu tiên đến nhà bạn Trung Quốc chơi",
  "Happy birthday, Xiaoxue!": "Chúc mừng sinh nhật Tiểu Tuyết!",
  "He plays basketball very well": "Anh ấy chơi bóng rổ rất giỏi",
  "I've been learning Chinese for two months": "Tôi đã học tiếng Trung được hai tháng rồi",
  "The girl dancing is so pretty!": "Cô gái đang nhảy múa thật là xinh đẹp!",
  "Is the math test very difficult?": "Bài kiểm tra Toán có khó lắm không?",
  "He is older than me": "Anh ấy lớn tuổi hơn tôi",
  "I'm feeling a bit under the weather": "Tôi cảm thấy hơi khó chịu trong người (ốm)",
  "What did the doctor say?": "Bác sĩ đã nói gì?",
  "Is this your first visit to China?": "Đây có phải lần đầu bạn đến Trung Quốc không?",
  "Everything is ready": "Mọi khảo đã sẵn sàng",

  // Scenes
  "At the airport, Wang Yixue picked up Bai Jiayue and Annie.": "Tại sân bay, Vương Y Tuyết đón Bạch Gia Nguyệt và Anny.",
  "In Wang Yixue's car, the three were chatting.": "Trong xe của Vương Y Tuyết, ba người đang trò chuyện.",
  "In Wang Yixue's car, Bai Jiayue received a phone call.": "Trên xe của Vương Y Tuyết, Bạch Gia Nguyệt nhận được một cuộc điện thoại.",
  "In Wang Yixue's car, Bai Jiayue received a call from Chen Tianzhong.": "Trên xe của Vương Y Tuyết, Bạch Gia Nguyệt nhận được điện thoại từ Trần Thiên Trung.",
  "At the hotel reception, Bai Jiayue and Annie asked the receptionist for information.": "Tại quầy lễ tân khách sạn, Bạch Gia Nguyệt và Anny hỏi nhân viên phục vụ.",
  "At Peking University campus, Bai Jiayue and Annie were touring.": "Tại khuôn viên Đại học Bắc Kinh, Bạch Gia Nguyệt và Anny đang tham quan.",
  "At the doorway, Liu Ming came home very late.": "Tại cửa nhà, Lưu Minh đi làm về rất muộn.",
  "In the living room, Liu Ming and Wang Yixue were chatting.": "Trong phòng khách, Lưu Minh và Vương Y Tuyết đang trò chuyện.",
  "In the living room, Wang Yixue suggested going to Xi'an.": "Trong phòng khách, Vương Y Tuyết đề nghị đi Tây An.",
  "At the shopping mall entrance, Wang Yixue and Liu Xiaoxue were chatting.": "Tại cổng trung tâm thương mại, Vương Y Tuyết và Lưu Tiểu Tuyết đang trò chuyện.",
  "In the shopping mall, Wang Yixue and Liu Xiaoxue were shopping for clothes.": "Trong trung tâm thương mại, Vương Y Tuyết và Lưu Tiểu Tuyết đang xem quần áo.",
  "In the shopping mall, Wang Yixue and Liu Xiaoxue were shopping for schoolbags.": "Trong trung tâm thương mại, Vương Y Tuyết và Lưu Tiểu Tuyết đang xem cặp sách.",
  "Downstairs in the hotel, Annie was calling Bai Jiayue.": "Dưới lầu khách sạn, Anny gọi điện cho Bạch Gia Nguyệt.",
  "At Wang Yixue's home, Bai Jiayue and Annie were visiting.": "Tại nhà Vương Y Tuyết, Bạch Gia Nguyệt và Anny đến làm khách.",
  "At Wang Yixue's home, Bai Jiayue and Annie were having a meal.": "Tại nhà Vương Y Tuyết, Bạch Gia Nguyệt và Anny đang ăn cơm.",
  "At home, Liu Ming and Wang Yixue were chatting.": "Ở nhà, Lưu Minh và Vương Y Tuyết đang trò chuyện.",
  "In the living room, Liu Ming's family celebrated Liu Xiaoxue's birthday.": "Trong phòng khách, gia đình Lưu Minh tổ chức sinh nhật cho Lưu Tiểu Tuyết.",
  "In the living room, Liu Ming's family were celebrating the birthday.": "Trong phòng khách, gia đình Lưu Minh đang đón sinh nhật.",
  "In the classroom, Annie and Chen Tianzhong were chatting.": "Trong lớp học, Anny và Trần Thiên Trung đang trò chuyện.",
  "On campus, Annie and Chen Tianzhong were chatting as they walked.": "Trong khuôn viên trường, Anny và Trần Thiên Trung vừa đi vừa trò chuyện.",
  "At the basketball court, Annie and Chen Tianzhong were watching a game.": "Tại sân bóng rổ, Anny và Trần Thiên Trung đang xem thi đấu.",

  // Lines
  "Excuse me, are you Ms. Wang Yifei's cousin?": "Cho hỏi, cô có phải là chị gái của cô giáo Vương Nhất Phi không?",
  "Yes, you two must be her students, right?": "Đúng vậy, hai em chắc là học sinh của em ấy nhỉ?",
  "Exactly. I'm Bai Jiayue, and this is Annie.": "Đúng ạ. Em là Bạch Gia Nguyệt, còn đây là Anny.",
  "Hello, I'm Wang Yixue. Yifei called me and asked me to pick you up.": "Chào các em, chị là Vương Y Tuyết. Nhất Phi đã gọi điện cho chị nhờ đón các em.",
  "You're welcome.": "Đừng khách khí.",
  "Is this your first visit to Beijing?": "Đây là lần đầu tiên các em đến Bắc Kinh à?",
  "Yes, it's the first time for both of us.": "Vâng, cả hai chúng em đều là lần đầu.",
  "No, we're here for sightseeing.": "Vâng, chúng em đến để du lịch.",
  "I'm not busy these days. If you need anything, just let me know.": "Mấy ngày tới chị không bận lắm, có việc gì cứ tìm chị nhé.",
  "Okay, thank you.": "Vâng, cảm ơn chị.",
  "Hello Jiayue, do you have time tomorrow? I need a favor.": "Alo, Gia Nguyệt à, ngày mai bạn có thời gian không? Mình muốn nhờ bạn chút việc.",
  "Sorry Tianzhong, I'm already in Beijing.": "Xin lỗi Thiên Trung, mình đã đến Bắc Kinh rồi.",
  "When did you get there?": "Bạn đến đó từ khi nào thế?",
  "I arrived this morning.": "Mình đến vào sáng nay.",
  "You can ask Li Wen for help—he's still at school.": "Bạn có thể nhờ Lý Văn giúp, cậu ấy vẫn còn ở trường đấy.",
  "Okay, then I'll give him a call. Goodbye!": "Được, vậy mình sẽ gọi cho cậu ấy. Tạm biệt!",
  "Excuse me, is there a bus from here to Peking University?": "Cho hỏi, ở đây có xe buýt đi Đại học Bắc Kinh không?",
  "Yes, but the bus stop is a bit far.": "Có, nhưng bến xe hơi xa một chút.",
  "Is it easy to get a taxi around here?": "Ở đây có dễ bắt taxi không ạ?",
  "Yes, it is.": "Có, dễ lắm.",
  "Thank you. Annie, let's take a taxi instead.": "Cảm ơn ạ. Anny à, chúng mình bắt taxi đi đi.",
  "Okay, no problem.": "Được, không vấn đề gì.",
  "It's so crowded on campus!": "Trong trường đông người thật đấy!",
  "Yeah, Peking University has over 40,000 students.": "Đúng vậy, Đại học Bắc Kinh có hơn 40.000 sinh viên cơ đấy!",
  "How do you know that?": "Sao bạn biết hay thế?",
  "I read it online. It also says there are over 3,000 international students.": "Mình đọc trên mạng đấy, trên mạng còn nói có hơn 3.000 sinh viên nước ngoài nữa.",
  "I'd love to study here too. There's a classroom over there. Let's go have a look.": "MÌnh cũng muốn đến đây học. Đằng kia có một phòng học, chúng mình qua xem thử đi.",
  "You're back so late today!": "Hôm nay về muộn thế!",
  "I had too much work to do, and I hadn't finished it when it was time to get off work.": "Công việc nhiều quá, lúc hết giờ làm vẫn chưa xong.",
  "Dinner's ready. Come and eat.": "Cơm nấu xong cả rồi, qua ăn thôi.",
  "I'd like to take a break and have a glass of water first.": "Mình muốn nghỉ một lát, uống ly nước đã.",
  "Okay.": "Được.",
  "Why don't we find some time to go on a trip?": "Chúng mình tìm lúc nào đó đi du lịch đi, thấy sao?",
  "Great! I also really want to go traveling with you.": "Hay quá, mình cũng rất muốn cùng nhau đi chơi.",
  "Where do you want to go?": "Bạn muốn đi đâu?",
  "I haven't figured it out yet.": "Mình vẫn chưa nghĩ ra.",
  "Think about it further. Once you've decided, I'll buy the tickets.": "Vậy bạn nghĩ thêm đi, nghĩ xong mình sẽ đi mua vé.",
  "Have an apple. I've already washed them. They're on the table. Help yourself.": "Ăn táo đi, mình rửa sạch cả rồi. Ở trên bàn đấy, bạn tự lấy nhé.",
  "I'm going to wash my hands. By the way, how about taking a trip to Xi'an?": "Mình đi rửa tay đã. Đúng rồi, chúng mình đi Tây An du lịch được không?",
  "Why do you want to go to Xi'an?": "Tại sao lại muốn đi Tây An?",
  "I read some introductions online—it's a great time to visit Xi'an!": "Mình xem giới thiệu trên mạng, đi Tây An tầm này rất tuyệt!",
  "Mom, have we been to this shopping mall before?": "Mẹ ơi, chúng mình đã từng đến trung tâm thương mại này chưa?",
  "No, it just opened recently.": "Chưa, cái này mới mở đấy.",
  "Let's go inside and have a look.": "Chúng mình vào trong xem đi.",
  "Sure! What do you want to buy?": "Được chứ! Con muốn mua gì nào?",
  "I want to buy a pair of pants.": "Con muốn mua một chiếc quần.",
  "No problem.": "Không thành vấn đề.",
  "Mom, I want to buy this pair of white pants.": "Mẹ ơi, con muốn mua chiếc quần màu trắng này.",
  "You already have lots of white clothes. Why do you want to buy something white again?": "Con có nhiều quần áo trắng rồi mà, sao lại mua màu trắng nữa?",
  "Because I like white!": "Vì con thích màu trắng mà!",
  "I don't think this white one looks very good. Why don't you try that red one?": "Mẹ thấy cái màu trắng này không đẹp lắm, con thử cái màu đỏ kia xem.",
  "I've never worn red before. Does red look good?": "Con chưa mặc màu đỏ bao giờ, màu đỏ đẹp không mẹ?",
  "That's exactly why you should try it!": "Chính vì chưa mặc nên mới phải thử chứ!",
  "Mom, I want to buy a new schoolbag.": "Mẹ ơi, con muốn mua một chiếc cặp sách mới.",
  "Okay. They're selling schoolbags over there. Let's go take a look.": "Được, đằng kia bán cặp sách, chúng mình qua xem nhé.",
  "So many beautiful ones! Red, green, black—which one do you want?": "Nhiều cặp sách đẹp quá! Đỏ, xanh lá, đen, con muốn mua cái nào?",
  "The green one.": "Cái màu xanh lá ạ.",
  "Not bad. I think the green one looks better too.": "Không tệ, mẹ cũng thấy cái màu xanh lá đẹp hơn.",
  "Jiayue, come down quickly. It's our first time visiting a Chinese friend's home. Don't be late.": "Gia Nguyệt, xuống nhanh đi, lần đầu đến nhà bạn Trung Quốc chơi, đừng để muộn đấy.",
  "We still have time. Come on up.": "Vẫn còn thời gian mà, bạn lên đây đi.",
  "I'm not going up. I'll wait downstairs. Hurry up.": "Mình không lên nữa đâu, đứng dưới này đợi bạn. Bạn nhanh lên nhé.",
  "It's fine. Sister Yixue said we just need to get there before 11 o'clock.": "Không sao đâu, chị Y Tuyết bảo trước 11 giờ đến là được.",
  "Jiayue, Annie, come on in! These are the children's grandfather and grandmother.": "Gia Nguyệt, Anny, vào đi! Đây là ông nội và bà nội của bọn trẻ.",
  "Hello!": "Chào ông bà ạ!",
  "These gifts are for you.": "Đây là quà tặng ông bà ạ.",
  "You're too kind! You didn't have to bring so many gifts.": "Các cháu khách sáo quá, mang nhiều quà thế này!",
  "Sister Yixue, here's a gift we prepared for the children.": "Chị Y Tuyết, đây là quà chúng em chuẩn bị cho các cháu.",
  "Thank you! Please make yourselves at home and have a seat!": "Cảm ơn các em! Đừng khách sáo, mau ngồi đi!",
  "It's already 12 o'clock. Let's eat.": "12 giờ rồi, chúng mình ăn cơm thôi.",
  "There are so many delicious dishes. You're really too kind!": "Nhiều món ngon quá, chị khách sáo quá ạ!",
  "I cooked all of these myself. Please help yourselves.": "Đều là chị tự làm đấy, các em ăn nhiều vào nhé.",
  "The bubble tea tastes amazing. Did you make it yourself?": "Trà sữa cũng ngon lắm, là chị tự làm ạ?",
  "No, Grandpa bought it. It's from the mall ahead. After eating, you can come with me to check it out.": "Không, trà sữa là ông nội mua đấy. Ở trung tâm thương mại phía trước ấy, ăn xong các em đi cùng chị qua đó xem.",
  "Tomorrow is our daughter's birthday.": "Ngày mai là sinh nhật con gái rồi đấy.",
  "I would have totally forgotten. What should we get her as a gift?": "Em không nói là anh quên bẵng đi mất. Chúng mình chuẩn bị quà gì cho con nhỉ?",
  "She likes drawing. How about some color pens?": "Con bé thích vẽ tranh, em thấy bút vẽ thế nào?",
  "Let's get her color pens! And I'll also get her a big birthday cake.": "Tặng bút vẽ đi! Vậy anh mua cho con thêm một cái bánh sinh nhật thật to nữa.",
  "Happy birthday, Xiaoxue!": "Sinh nhật vui vẻ, Tiểu Tuyết!",
  "Happy birthday, sister!": "Sinh nhật vui vẻ, chị nhé!",
  "Xiaoxue, here's a gift from dad and mom. Go ahead and open it.": "Tiểu Tuyết, đây là quà bố mẹ tặng con. Mở ra xem đi.",
  "Color pens! I love them! What would you like to draw?": "Bút vẽ! Con thích lắm! Vậy con muốn vẽ gì nào?",
  "Our home! With dad, mom, my little brother, and our black dog, white cat, and all the others.": "Vẽ nhà mình! Có bố, mẹ, em trai, và cả con chó màu đen, con mèo màu trắng nữa.",
  "Then I'll draw a sister in white clothes.": "Vậy thì em sẽ vẽ một người chị mặc quần áo trắng.",
  "Xiaoxue, take a look at all the delicious food we have today.": "Tiểu Tuyết, xem hôm nay có món gì ngon nào.",
  "Long noodles and a big cake. Look, there's fish, meat, and other dishes too — all your favorites.": "Mì trường thọ nè, bánh kem to nè. Con xem, còn có cá, có thịt, toàn món con thích ăn đấy.",
  "Thank you, Dad and Mom!": "Cảm ơn bố mẹ ạ!",
  "Go call your brother to come eat. After dinner, we'll go out and have some fun!": "Mau gọi em qua ăn cơm đi con, ăn xong chúng mình còn đi chơi nữa.",
  "Birthdays are so wonderful!": "Sinh nhật thật là thích!",
  "That's right. On your birthday, enjoy good food and have lots of fun.": "Đúng vậy, sinh nhật thì phải ăn ngon và chơi thật vui vào.",
  "Annie, when did you get back from Beijing?": "Anny, bạn từ Bắc Kinh về từ khi nào thế?",
  "Yesterday afternoon. Tianzhong, why do you rush out as soon as class ends?": "Chiều hôm qua. Thiên Trung, sao bạn vừa tan học đã chạy ngay ra ngoài thế?",
  "I made an appointment with my classmates to play basketball together.": "Mình hẹn với bạn cùng lớp rồi, cùng nhau đi đánh bóng rổ.",
  "I want to join you too.": "Mình cũng muốn chơi cùng các bạn.",
  "No problem, let's go!": "Không vấn đề gì, đi thôi!",
  "Tianzhong, do you really like playing basketball?": "Thiên Trung, có phải bạn rất thích đánh bóng rổ không?",
  "Exactly. I'm learning to play football too.": "Đúng rồi. Mình còn đang học đá bóng nữa.",
};

async function addViTranslations() {
  console.log('--- HSK 2 Vietnamese Localization ---');
  
  const rawData = fs.readFileSync(DATA_PATH, 'utf8');
  const data = JSON.parse(rawData);

  data.lessons.forEach(l => {
    // Translate lesson title
    if (translations[l.title_en]) {
      l.title_vi = translations[l.title_en];
    } else {
        l.title_vi = l.title_en;
    }

    l.texts.forEach(t => {
      // Translate scene
      if (translations[t.scene_en]) {
        t.scene_vi = translations[t.scene_en];
      } else {
          t.scene_vi = t.scene_en;
      }

      // Translate lines
      t.lines.forEach(line => {
        if (translations[line.en]) {
          line.vi = translations[line.en];
        }
      });
    });
  });

  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
  console.log('HSK 2 Vietnamese translations applied to JSON!');
}

addViTranslations();
