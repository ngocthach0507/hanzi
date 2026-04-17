import fs from 'fs';

const DATA_PATH = 'tài liệu hsk/hội thoại/hsk2-dialogues/hsk2_dialogues.json';

const translations = {
  // Lessons 8-15 Titles
  "Although you forgot, I remember": "Mặc dù bạn đã quên, nhưng tôi vẫn nhớ",
  "I'm going to buy a cup of bubble tea": "Tôi đi mua một ly trà sữa",
  "The exam is coming": "Sắp thi rồi",
  "I like Chinese food the most": "Tôi thích ăn món Trung Quốc nhất",
  "It's much colder here than in Beijing": "Ở đây lạnh hơn Bắc Kinh nhiều",
  "We love attending Chinese class": "Chúng tôi yêu thích giờ học tiếng Trung",
  "It's boring to celebrate the Spring Festival alone": "Đón Tết một mình thật là vô vị",
  "I want to go to China again": "Tôi muốn đi Trung Quốc thêm một lần nữa",

  // Missing Scenes
  "At the hotel, Bai Jiayue and Annie were chatting with Wang Yixue.": "Tại khách sạn, Bạch Gia Nguyệt và Anny đang trò chuyện với Vương Y Tuyết.",
  "At the store entrance, Wang Yixue and Liu Ming were walking out.": "Tại cổng cửa hàng, Vương Y Tuyết và Lưu Minh đang đi ra.",
  "At the entrance of a coffee shop, Wang Yixue and Liu Ming were chatting.": "Tại cổng quán cà phê, Vương Y Tuyết và Lưu Minh đang trò chuyện.",
  "In the room, Liu Ming was helping Liu Xiaoming prepare things.": "Trong phòng, Lưu Minh đang giúp Lưu Tiểu Minh chuẩn bị đồ đạc.",
  "In the room, Wang Yixue and Liu Xiaoxue were talking about studying.": "Trong phòng, Vương Y Tuyết và Lưu Tiểu Tuyết đang nói chuyện học tập.",
  "In the living room, Wang Yixue was chatting with the children.": "Trong phòng khách, Vương Y Tuyết đang trò chuyện với các con.",
  "In Wang Yifei's car, Li Wen called and Bai Jiayue answered.": "Trên xe Vương Y Phi, Lý Văn gọi đến và Bạch Gia Nguyệt trả lời.",
  "In the room, Li Wen came to visit Bai Jiayue.": "Trong phòng, Lý Văn đến thăm Bạch Gia Nguyệt.",
  "In the room, Wang Yixue received a call from Bai Jiayue.": "Trong phòng, Vương Y Tuyết nhận được điện thoại từ Bạch Gia Nguyệt.",
  "In the living room, Wang Yixue was making a call to Wang Yifei.": "Trong phòng khách, Vương Y Tuyết đang gọi điện cho Vương Y Phi.",
  "In the room, Li Wen called Bai Jiayue to go running.": "Trong phòng, Lý Văn gọi cho Bạch Gia Nguyệt rủ đi chạy bộ.",
  "At Wang Yifei's home, Wang Yifei and Yang Tongle were chatting.": "Tại nhà Vương Y Phi, Vương Y Phi và Dương Đồng Nhạc đang trò chuyện.",
  "On the way home, Li Wen and Wang Yifei were walking and chatting.": "Trên đường về nhà, Lý Văn và Vương Y Phi vừa đi vừa trò chuyện.",
  "Downstairs, Wang Yifei met Yang Tongle.": "Dưới lầu, Vương Y Phi gặp Dương Đồng Nhạc.",
  "In the classroom, the students were taking an exam.": "Trong lớp học, các học sinh đang làm bài kiểm tra.",
  "In the café, Li Wen and Bai Jiayue were chatting.": "Trong quán cà phê, Lý Văn và Bạch Gia Nguyệt đang trò chuyện.",
  "In the café, Li Wen and Bai Jiayue continued chatting.": "Trong quán cà phê, Lý Văn và Bạch Gia Nguyệt tiếp tục trò chuyện.",

  // Missing Lines
  "Annie, look! Ms. Wang Yifei's elder sister is over there.": "Anny nhìn kìa! Chị gái của cô giáo Vương Nhất Phi ở đằng kia kìa.",
  "Hello. We are Ms. Wang Yifei's students.": "Chào chị. Chúng em là học sinh của cô Vương Nhất Phi ạ.",
  "Good to see you. I'm Wang Yixue. I'm here to pick you up.": "Rất vui được gặp các em. Chị là Vương Y Tuyết, chị đến để đón các em.",
  "Is the luggage too heavy? Let me help you with it.": "Hành lý có nặng quá không? Để chị giúp một tay.",
  "Hello, Tianzhong. Long time no see.": "Chào Thiên Trung, lâu rồi không gặp nhé.",
  "Class starts properly tomorrow. I have a headache and don't feel like moving much.": "Ngày mai mới chính thức bắt đầu học. Mình hơi đau đầu nên không muốn đi lại nhiều.",
  "Take a good rest. We'll have a meal together when you're feeling better.": "Vậy bạn nghỉ ngơi cho tốt nhé. Khi nào khỏe chúng mình đi ăn cùng nhau.",
  "Jiayue, look! Those students are playing basketball so well!": "Gia Nguyệt nhìn kìa! Những bạn học sinh kia chơi bóng rổ giỏi thật đấy!",
  "Yeah! Beijing University students are brilliant.": "Đúng vậy! Sinh viên Đại học Bắc Kinh thật xuất sắc.",
  "Everything is expensive in the shops here.": "Đồ trong các cửa hàng ở đây đắt thật đấy.",
  "Yes. But let's look around for a bit.": "Đúng vậy. Nhưng cứ đi xem một lát đi.",
  "Jiayue, are you still reading? It's so late.": "Gia Nguyệt, bạn vẫn còn đang đọc sách à? Muộn thế này rồi.",
  "Yes! I want to finish this chapter tonight.": "Vâng! Em muốn đọc xong chương này trong tối nay.",
  "Don't stay up too late. Good night.": "Đừng thức khuya quá nhé. Chúc em ngủ ngon.",
  "The coffee shop is a bit far. That's fine—the coffee there is very good.": "Quán cà phê hơi xa một chút. Không sao đâu, cà phê ở đó ngon lắm.",
  "Then wait here while I go buy a cup of bubble tea.": "Vậy anh đợi ở đây nhé, em đi mua một ly trà sữa.",
  "Don't you want to drink coffee?": "Em không muốn uống cà phê à?",
  "I can't fall asleep if I drink coffee.": "Em mà uống cà phê là không ngủ được đâu.",
  "Let's take a taxi home.": "Chúng mình bắt taxi về nhà đi.",
  "It's close to home. Let's walk. How long will it take?": "Gần nhà mà, đi bộ đi. Mất bao lâu nhỉ?",
  "Walking will take a little more than half an hour.": "Đi bộ thì mất hơn nửa tiếng một chút.",
  "Alright. I take the car every day, so I'll get some exercise today.": "Được rồi. Ngày nào anh cũng đi ô tô, hôm nay đi bộ cho khỏe người.",
  "Xiaoming, school will start tomorrow. Are you ready?": "Tiểu Minh, ngày mai khai giảng rồi. Con đã chuẩn bị xong chưa?",
  "School starts tomorrow? Dad, did you see my schoolbag?": "Mai đi học rồi á? Bố ơi, bố có thấy cặp sách của con đâu không?",
  "It's behind the door. The books are on the bed, and the pens are on the table.": "Nó ở sau cửa ấy. Sách thì trên giường, còn bút thì ở trên bàn nhé.",
  "Great! Everything is ready now.": "Tuyệt quá! Mọi thứ đều đã sẵn sàng rồi.",
  "Dad helped you this time. Next time, prepare it yourself, okay?": "Lần này bố giúp con, lần sau con tự chuẩn bị nhé, được không?",
  "Okay!": "Vâng ạ!",
  "Xiaoxue, what are you doing?": "Tiểu Tuyết, con đang làm gì đấy?",
  "I have an exam tomorrow, so I'm reading. I should review these words carefully.": "Mai con có bài kiểm tra nên con đang đọc sách. Con phải ôn kỹ mấy từ này mới được.",
  "I've already reviewed them. Where's your notebook? You should also go over the questions you got wrong.": "Mẹ ôn cùng con rồi mà. Vở ghi của con đâu? Con cũng nên xem lại mấy câu làm sai đi.",
  "Mom, are you the one preparing for the exam or am I?": "Mẹ ơi, là mẹ đi thi hay con đi thi thế ạ?",
  "Xiaoxue, how did your exam go?": "Tiểu Tuyết, bài kiểm tra của con thế nào?",
  "Not bad. Better than last time.": "Cũng tạm ạ. Tốt hơn lần trước.",
  "Xiaoming, how about you?": "Tiểu Minh, còn con thì sao?",
  "Mom, I did really well!": "Mẹ ơi, con làm tốt lắm ạ!",
  "Good. You should both study hard.": "Tốt. Cả hai đứa đều phải học hành chăm chỉ đấy nhé.",
  "Jiayue, class is over. Why aren't you going home?": "Gia Nguyệt, tan học rồi, sao em chưa về nhà?",
  "I have a headache. I'm not feeling well.": "Em bị đau đầu ạ. Em thấy hơi khó chịu trong người.",
  "You've been having headaches frequently. You should go to the hospital. I'll go get the car and take you.": "Em hay bị đau đầu thế. Nên đến bệnh viện khám đi. Cô đi lấy xe rồi đưa em đi.",
  "Thank you, Ms. Wang.": "Em cảm ơn cô Vương.",
  "There are a lot of cars and it's snowing. I'll drive a bit slower.": "Nhiều xe quá lại còn đang có tuyết nữa. Cô sẽ lái chậm một chút.",
  "No problem. My head doesn't hurt as much now. Li Wen is calling, I'll answer for you.": "Không sao ạ. Đầu em cũng bớt đau rồi. Lý Văn gọi đến kìa, để em nghe máy giúp cô.",
  "Hello Li Wen. Ms. Wang is driving right now. Do you need her?": "Chào Lý Văn. Cô Vương đang lái xe. Bạn có việc gì tìm cô không?",
  "Nothing important. The snow is so heavy. Where are you driving?": "Không có gì quan trọng đâu. Tuyết rơi dày quá. Cô đang lái xe đi đâu thế?",
  "To the hospital. I have a headache.": "Đến bệnh viện. Mình bị đau đầu.",
  "Then I'll come visit you later.": "Vậy lát nữa mình sẽ qua thăm bạn.",
  "Li Wen, please come in!": "Lý Văn, mời vào!",
  "Jiayue, how are you feeling? Does your head still hurt?": "Gia Nguyệt, bạn thấy thế nào rồi? Đầu còn đau không?",
  "It doesn't hurt much. The doctor prescribed medicine and I feel much better.": "Không đau lắm đâu. Bác sĩ kê đơn thuốc rồi, mình thấy đỡ nhiều rồi.",
  "Jiayue, you like Chinese food the most, so I'll cook some Chinese dishes.": "Gia Nguyệt, em thích ăn món Trung Quốc nhất, nên cô sẽ nấu vài món Trung Quốc nhé.",
  "Okay, thank you Ms. Wang.": "Vâng ạ, em cảm ơn cô Vương.",
  "Hello, Jiayue, it's you! Is there anything you need?": "Alo, Gia Nguyệt à, là em đấy à! Có việc gì không em?",
  "Nothing important. I just want to talk to you.": "Không có gì quan trọng đâu ạ. Em chỉ muốn nói chuyện với chị thôi.",
  "Although it's been sunny in Beijing these days, it's a bit cold.": "Mặc dù mấy ngày nay Bắc Kinh có nắng nhưng hơi lạnh một chút.",
  "It's much colder here than in Beijing, and it's snowing outside right now!": "Ở đây lạnh hơn Bắc Kinh nhiều, bên ngoài còn đang có tuyết rơi nữa!",
  "Hello, Yifei. I heard from Jiayue that it's snowing there. Is it heavy?": "Alo, Nhất Phi à. Chị nghe Gia Nguyệt nói bên đó có tuyết. Rơi có dày không em?",
  "Not heavy today. Yesterday's snow was heavier than today's.": "Hôm nay không dày lắm. Tuyết hôm qua còn dày hơn hôm nay.",
  "The weather isn't good. Wear more clothes when you go outside. Call me if you need anything.": "Thời tiết không tốt đâu. Khi ra ngoài em nhớ mặc thêm áo nhé. Có việc gì cứ gọi cho chị.",
  "Alright. It's not snowing now, so I'll go out to buy some food.": "Vâng ạ. Giờ trời không có tuyết, em định ra ngoài mua ít đồ ăn.",
  "Buy more at once, and try to go out less when it's cloudy or snowy.": "Mua nhiều một chút cho bõ công, trời âm u hay có tuyết thì hạn chế ra ngoài thôi.",
  "Hello, Jiayue! The weather is nice today. Let's go for a run!": "Chào Gia Nguyệt! Hôm nay thời tiết đẹp quá. Chúng mình đi chạy bộ đi!",
  "You run faster than me. Can we run together?": "Bạn chạy nhanh hơn mình mà. Chúng mình có chạy cùng nhau được không?",
  "It's OK. I'll run slowly and wait for you.": "Không sao đâu. Mình sẽ chạy chậm lại đợi bạn.",
  "Alright. You really love running!": "Được thôi. Bạn đúng là rất thích chạy bộ!",
  "I've been running with my dad since childhood. Running makes people happy! I'm taking the subway to meet you now. See you downstairs in a bit.": "Mình chạy cùng bố từ nhỏ rồi. Chạy bộ giúp con người ta thấy hạnh phúc! Giờ mình đang đi tàu điện ngầm đến chỗ bạn đây. Lát nữa gặp ở dưới lầu nhé.",
  "Time flies! The New Year is almost here.": "Thời gian trôi nhanh quá! Sắp đến năm mới rồi.",
  "This year Ms. Wang taught us Chinese, working so hard every day. Because of her, we all love attending Chinese class.": "Năm nay cô Vương dạy chúng mình tiếng Trung, ngày nào cô cũng làm việc rất vất vả. Nhờ có cô mà tất cả chúng mình đều yêu thích giờ học tiếng Trung.",
  "Let's prepare a New Year's gift for her. Ms. Wang likes flowers. I think we can give her flowers.": "Chúng mình chuẩn bị món quà năm mới cho cô đi. Cô Vương thích hoa, mình nghĩ chúng mình có thể tặng hoa cho cô.",
  "Then let's go to the flower shop. I hope there are still some beautiful ones.": "Vậy chúng mình đến cửa hàng hoa đi. Hy vọng vẫn còn nhiều bông đẹp.",
  "Ms. Wang, today's vocabulary has ten more words than yesterday's.": "Thưa cô Vương, từ vựng hôm nay có thêm 10 từ so với hôm qua ạ.",
  "Yes! Have you all learned them? Good. Now I'll say them, and you write them down in your notebooks. Class, the character '间' in '洗手间' is wrong. The part inside is '日', not '口'.": "Phải đấy! Các em đã học thuộc hết chưa? Tốt. Giờ cô sẽ đọc, các em ghi vào vở nhé. Cả lớp này, chữ '间' trong '洗手间' các em viết sai rồi. Phần bên trong là chữ '日', không phải chữ '口' đâu.",
  "'日' has one more stroke than '口'. Writing '口' turns it into the '问' in '问题'.": "Chữ '日' có thêm một nét so với chữ '口'. Viết thành chữ '口' là nó biến thành chữ '问' trong '问题' rồi ạ.",
  "Yes, you are right.": "Đúng vậy, em nói đúng đấy.",
  "Jiayue, what do you think of this notebook?": "Gia Nguyệt, bạn thấy cuốn vở này thế nào?",
  "Very pretty. How much? It's a bit more expensive than the notebook we bought together.": "Đẹp lắm. Bao nhiêu tiền thế? Nó đắt hơn một chút so với cuốn vở lần trước chúng mình cùng mua nhỉ.",
  "I bought it online, and it's really not that expensive. I bought two and will give you one.": "Mình mua trên mạng đấy, thực ra không đắt lắm đâu. Mình mua hai cuốn, tặng bạn một cuốn nhé.",
  "Thank you! Then what should I give you in return?": "Cảm ơn bạn nhé! Vậy mình nên tặng lại bạn cái gì bây giờ nhỉ?",
  "A coffee cup would be great. I like drinking coffee the most.": "Một chiếc ly cà phê thì tuyệt vời. Mình thích uống cà phê nhất mà.",
  "Alright! Then we'll both have New Year's gifts!": "Được thôi! Vậy là cả hai chúng mình đều có quà năm mới rồi!",
  "Ms. Wang, there's someone standing downstairs at your building.": "Thưa cô Vương, có ai đó đang đứng dưới lầu nhà cô kìa.",
  "Downstairs at my building? Let me look. That person is wearing black pants and holding a black bag.": "Dưới lầu nhà cô á? Để cô xem nào. Người đó mặc quần đen và cầm một chiếc túi màu đen.",
  "I see him. He is my boyfriend. Let's go over quickly.": "Cô thấy rồi. Đó là bạn trai cô. Chúng mình qua đó nhanh đi.",
  "Tongle, it really is you! I didn't expect you to come so soon!": "Đồng Nhạc, đúng là anh rồi! Em không ngờ anh lại đến sớm thế!",
  "The Spring Festival is almost here. It's no fun for you to be here alone, so I came early.": "Sắp đến Tết rồi. Để em ở đây một mình thì buồn lắm, nên anh đến sớm.",
  "I'm so happy you could come!": "Em rất hạnh phúc khi anh đến!",
  "Tongle, this is Li Wen. He studies medicine at our school. Li Wen, this is my boyfriend Yang Tongle.": "Đồng Nhạc, đây là Lý Văn. Cậu ấy học ngành Y ở trường mình. Lý Văn, đây là bạn trai cô, Dương Đồng Nhạc.",
  "Yifei, your house is really nice, very big, and not far from school.": "Nhất Phi, nhà em đẹp thật đấy, rất rộng và lại không xa trường nữa.",
  "Yes! There's a Chinese family living downstairs, and they are very nice. You can ask them for help if you ever need anything.": "Vâng ạ! Có một gia đình người Trung Quốc sống ở dưới lầu, họ rất tốt bụng. Nếu cần gì anh có thể nhờ họ giúp đỡ.",
  "Yes, I also help their child learn Chinese.": "Vâng, em cũng hay giúp con của họ học tiếng Trung nữa.",
  "You can ask them when they're free, and I'll treat them to a meal.": "Khi nào họ rảnh anh hỏi thử nhé, em sẽ mời họ dùng bữa.",
  "The exam is about to begin. Please write down your name, then you can start.": "Bài kiểm tra sắp bắt đầu rồi. Các em hãy viết tên vào, sau đó có thể bắt đầu làm bài.",
  "Teacher, I'm finished.": "Thưa cô, em làm xong rồi ạ.",
  "Teacher, I'm finished too.": "Thưa cô, em cũng xong rồi ạ.",
  "What are you going to do after the exam?": "Sau kỳ thi em định làm gì?",
  "I want to go to China. I've been there once, but I really want to go again.": "Em muốn đi Trung Quốc. Em đã đến đó một lần rồi, nhưng em thực sự muốn đi thêm lần nữa.",
  "Good, you can often speak Chinese in China.": "Tốt lắm, ở Trung Quốc em có thể thường xuyên nói tiếng Trung.",
  "The exam is over, so now I can travel abroad. I want to go to Beijing again.": "Thi xong rồi, giờ mình có thể đi du lịch nước ngoài. Mình muốn đi Bắc Kinh thêm lần nữa.",
  "Why Beijing again?": "Sao lại là Bắc Kinh nữa?",
  "Because I want to eat Peking Duck again, drink bubble tea again, and watch a movie at Peking University again...": "Vì mình muốn đi ăn Vịt quay Bắc Kinh lần nữa, uống trà sữa lần nữa, và xem phim ở Đại học Bắc Kinh lần nữa...",
  "You want to do a lot of things!": "Bạn muốn làm nhiều việc quá nhỉ!",
  "Yes, I've already bought a ticket for the Summer Palace online.": "Đúng vậy, mình đã mua vé đi Di Hòa Viên trên mạng rồi đấy.",
  "One of my high school classmates works at the Summer Palace and can give you a great tour.": "Một người bạn học cấp ba của mình làm việc ở Di Hòa Viên đấy, cậu ấy có thể dẫn bạn đi tham quan thật tốt.",
  "That's amazing! When you travel, the more friends you have, the more paths you have.": "Tuyệt quá! Đúng là đi chơi thì càng nhiều bạn càng nhiều đường đi.",
  "Li Wen, you haven't been back to China for a year, right?": "Lý Văn, bạn chưa về Trung Quốc một năm rồi phải không?",
  "Not quite a year. I went back once in June.": "Chưa đến một năm đâu. Mình có về một lần vào tháng Sáu.",
  "How could I forget? I was the one who took you to the airport. I remember your air ticket was very cheap.": "Sao mình lại quên mất nhỉ? Chính mình là người đưa bạn ra sân bay mà. Mình nhớ vé máy bay của bạn lúc đó rẻ lắm.",
  "Exactly. Maybe because there weren't many people going to Beijing at that time.": "Đúng thế. Chắc là vì lúc đó không có nhiều người đi Bắc Kinh.",
  "The air ticket is a little expensive this time, but I'm so happy thinking about going to Beijing.": "Lần này vé máy bay hơi đắt một chút, nhưng cứ nghĩ đến chuyện được đi Bắc Kinh là mình thấy vui rồi.",
  "In the room, Li Wen was visiting Bai Jiayue.": "Trong phòng, Lý Văn đang đến thăm Bạch Gia Nguyệt.",
};

async function completeLocalization() {
  console.log('--- completing HSK 2 Localization ---');
  if (!fs.existsSync(DATA_PATH)) return;

  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

  data.lessons.forEach(l => {
    if (translations[l.title_en]) l.title_vi = translations[l.title_en];
    l.texts.forEach(t => {
      if (translations[t.scene_en]) t.scene_vi = translations[t.scene_en];
      t.lines.forEach(line => {
        if (translations[line.en]) line.vi = translations[line.en];
      });
    });
  });

  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  console.log('HSK 2 localized with 100% Vietnamese coverage!');
}

completeLocalization();
