import json
import os

path = r'd:\antigravity\bán hàng web học tiếng trung\data\readings-hsk1.json'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_content = {
    "r1-l2-gioithieu": {
        "content": [
            { "zh": "李文是北京人，他是一名大学生。", "vi": "Lý Văn là người Bắc Kinh, anh ấy là một sinh viên đại học." },
            { "zh": "今天他在学校遇到了白家月。", "vi": "Hôm nay anh ấy gặp Bạch Gia Nguyệt ở trường." },
            { "zh": "白家月是法国人，她也在北京学习中文。", "vi": "Bạch Gia Nguyệt là người Pháp, cô ấy cũng đang học tiếng Trung ở Bắc Kinh." },
            { "zh": "白家月的老师叫王一飞，她是一个很好的中国老师。", "vi": "Giáo viên của Bạch Gia Nguyệt tên là Vương Nhất Phi, cô ấy là một giáo viên Trung Quốc rất tốt." },
            { "zh": "王老师问白家月：「你叫什么名字？」", "vi": "Cô Vương hỏi Bạch Gia Nguyệt: 'Em tên là gì?'" },
            { "zh": "白家月说：「我叫白家月，很高兴认识您。」", "vi": "Bạch Gia Nguyệt nói: 'Em tên là Bạch Gia Nguyệt, rất vui được biết cô.'" },
            { "zh": "李文和白家月现在是好朋友。", "vi": "Lý Văn và Bạch Gia Nguyệt bây giờ là những người bạn tốt." }
        ],
        "vocabulary": [
            { "zh": "大学生", "py": "dàxuéshēng", "vi": "sinh viên đại học" },
            { "zh": "中国人", "py": "Zhōngguórén", "vi": "người Trung Quốc" },
            { "zh": "名字", "py": "míngzi", "vi": "tên" },
            { "zh": "朋友", "py": "péngyou", "vi": "bạn bè" },
            { "zh": "老师", "py": "lǎoshī", "vi": "giáo viên" },
            { "zh": "认识", "py": "rènshi", "vi": "quen biết" }
        ],
        "questions": {
            "comprehension": [
                { "q_zh": "李文和白家月是在哪里遇到的？", "q_vi": "Lý Văn và Bạch Gia Nguyệt gặp nhau ở đâu?", "options": ["在医院", "在学校", "在超市", "在咖啡馆"], "answer": 1 },
                { "q_zh": "白家月来北京做什么？", "q_vi": "Bạch Gia Nguyệt đến Bắc Kinh làm gì?", "options": ["工作", "旅行", "学习中文", "买东西"], "answer": 2 },
                { "q_zh": "王一飞是谁？", "q_vi": "Vương Nhất Phi là ai?", "options": ["学生", "中文老师", "李文的姐姐", "店员"], "answer": 1 }
            ]
        }
    },
    "r1-l4-jiating": {
        "content": [
            { "zh": "王一雪是一个快乐的妈妈。", "vi": "Vương Nhất Tuyết là một người mẹ hạnh phúc." },
            { "zh": "她有两个可爱的孩子，一个儿子和一个女儿。", "vi": "Cô ấy có hai người con đáng yêu, một con trai và một con gái." },
            { "zh": "儿子今年五岁了，名字叫王小龙。", "vi": "Con trai năm nay 5 tuổi, tên là Vương Tiểu Long." },
            { "zh": "女儿今年十二岁，名字叫王小凤。", "vi": "Con gái năm nay 12 tuổi, tên là Vương Tiểu Phượng." },
            { "zh": "今天早晨，王一雪在门口遇到了邻居陈天中。", "vi": "Sáng nay, Vương Nhất Tuyết gặp người hàng xóm Trần Thiên Trung ở cửa." },
            { "zh": "陈天中客气地说：「王小姐，你好！你家有几口人？」", "vi": "Trần Thiên Trung lịch sự nói: 'Chào chị Vương! Nhà chị có mấy người?'" },
            { "zh": "王一雪笑着回答：「我家有四口人。我还有一个好朋友叫杨同乐，他家也有四口人。」", "vi": "Vương Nhất Tuyết cười trả lời: 'Nhà tôi có bốn người. Tôi còn có một người bạn tốt là Dương Đồng Lạc, nhà anh ấy cũng có bốn người.'" }
        ],
        "vocabulary": [
            { "zh": "孩子", "py": "háizi", "vi": "đứa trẻ / con" },
            { "zh": "儿子", "py": "érzi", "vi": "con trai" },
            { "zh": "女儿", "py": "nǚ'ér", "vi": "con gái" },
            { "zh": "哥哥", "py": "gēgē", "vi": "anh trai" },
            { "zh": "妹妹", "py": "mèimei", "vi": "em gái" },
            { "zh": "邻居", "py": "línjū", "vi": "hàng xóm" }
        ],
        "questions": {
            "comprehension": [
                { "q_zh": "王一雪的儿子叫什么名字？", "q_vi": "Con trai của Vương Nhất Tuyết tên là gì?", "options": ["王一雪", "王小龙", "王小凤", "陈天中"], "answer": 1 },
                { "q_zh": "王一雪的女儿今年多大了？", "q_vi": "Con gái của Vương Nhất Tuyết năm nay bao nhiêu tuổi?", "options": ["五岁", "四岁", "十二岁", "十岁"], "answer": 2 },
                { "q_zh": "谁是王一雪的邻居？", "q_vi": "Ai là hàng xóm của Vương Nhất Tuyết?", "options": ["李文", "陈天中", "杨同乐", "老师"], "answer": 1 }
            ]
        }
    },
    "r1-l5-xiuxi": {
        "content": [
            { "zh": "今天是星期日，天气很好，刘明在家里休息。", "vi": "Hôm nay là chủ nhật, thời tiết rất đẹp, Lưu Minh đang nghỉ ngơi tại nhà." },
            { "zh": "今天是九月八号，也是他好朋友杨同乐的生日。", "vi": "Hôm nay là ngày 8 tháng 9, cũng là sinh nhật của người bạn tốt Dương Đồng Lạc." },
            { "zh": "杨同乐非常会做饭，他正在家里做面条儿和饺子。", "vi": "Dương Đồng Lạc rất biết nấu ăn, anh ấy đang nấu mì và sủi cảo tại nhà." },
            { "zh": "刘明不想去外面吃饭，他想去杨同乐家喝一点儿酒，吃饺子。", "vi": "Lưu Minh không muốn đi ăn bên ngoài, anh ấy muốn đến nhà Dương Đồng Lạc uống chút rượu và ăn sủi cảo." },
            { "zh": "王一雪给杨同乐打电话问：「你会做什么好吃的？」", "vi": "Vương Nhất Tuyết gọi điện cho Dương Đồng Lạc hỏi: 'Anh biết nấu món gì ngon không?'" },
            { "zh": "杨同乐笑着说：「我今天做了很多饺子，欢迎你们来我家玩！」", "vi": "Dương Đồng Lạc cười nói: 'Hôm nay tôi làm rất nhiều sủi cảo, chào mừng mọi người đến nhà tôi chơi!'" }
        ],
        "vocabulary": [
            { "zh": "休息", "py": "xiūxi", "vi": "nghỉ ngơi" },
            { "zh": "星期日", "py": "xīngqīrì", "vi": "chủ nhật" },
            { "zh": "做饭", "py": "zuò fàn", "vi": "nấu ăn" },
            { "zh": "面条儿", "py": "miàntiáor", "vi": "mì" },
            { "zh": "饺子", "py": "jiǎozi", "vi": "sủi cảo" },
            { "zh": "欢迎", "py": "huānyíng", "vi": "chào mừng" }
        ],
        "questions": {
            "comprehension": [
                { "q_zh": "刘明今天在哪里休息？", "q_vi": "Hôm nay Lưu Minh nghỉ ngơi ở đâu?", "options": ["在医院", "在学校", "在家里", "在超市"], "answer": 2 },
                { "q_zh": "九月八号是谁的生日？", "q_vi": "Ngày 8 tháng 9 là sinh nhật của ai?", "options": ["刘明", "杨同乐", "王一雪", "老师"], "answer": 1 },
                { "q_zh": "杨同乐今天做了什么好吃的？", "q_vi": "Hôm nay Dương Đồng Lạc nấu món gì ngon?", "options": ["米饭", "面包", "面条儿和饺子", "苹果"], "answer": 2 }
            ]
        }
    },
    "r1-l6-chaoshi": {
        "content": [
            { "zh": "白家月和陈天中是好同学，他们今天想去超市买点儿东西。", "vi": "Bạch Gia Nguyệt và Trần Thiên Trung là bạn cùng lớp, hôm nay họ muốn đi siêu thị mua ít đồ." },
            { "zh": "白家月想买一些牛奶和苹果，陈天中想买一个新杯子。", "vi": "Bạch Gia Nguyệt muốn mua sữa và táo, Trần Thiên Trung muốn mua một cái cốc mới." },
            { "zh": "白家月问陈天中：「超市里有面包吗？」", "vi": "Bạch Gia Nguyệt hỏi Trần Thiên Trung: 'Trong siêu thị có bánh mì không?'" },
            { "zh": "陈天中说：「有，那里的面包非常好吃。」", "vi": "Trần Thiên Trung nói: 'Có, bánh mì ở đó rất ngon.'" },
            { "zh": "后来，他们在超市遇到了王一雪一家，他们正要去饭店吃晚饭。", "vi": "Sau đó, họ gặp gia đình Vương Nhất Tuyết ở siêu thị, họ đang định đi ăn tối ở nhà hàng." },
            { "zh": "王一雪说：「那家饭店的包子非常好吃，推荐你们也去试试！」", "vi": "Vương Nhất Tuyết nói: 'Bánh bao ở nhà hàng đó rất ngon, đề xuất các bạn cũng đi thử xem!'" }
        ],
        "vocabulary": [
            { "zh": "超市", "py": "chāoshì", "vi": "siêu thị" },
            { "zh": "牛奶", "py": "niúnǎi", "vi": "sữa" },
            { "zh": "包子", "py": "bāozi", "vi": "bánh bao" },
            { "zh": "杯子", "py": "bēizi", "vi": "cốc, ly" },
            { "zh": "东西", "py": "dōngxi", "vi": "đồ đạc" },
            { "zh": "晚饭", "py": "wǎnfàn", "vi": "bữa tối" }
        ],
        "questions": {
            "comprehension": [
                { "q_zh": "白家月在超市想买什么？", "q_vi": "Bạch Gia Nguyệt muốn mua gì ở siêu thị?", "options": ["杯子", "牛奶和苹果", "面条儿", "包子"], "answer": 1 },
                { "q_zh": "谁想买一个新杯子？", "q_vi": "Ai muốn mua một cái cốc mới?", "options": ["白家月", "王一雪", "陈天中", "刘明"], "answer": 2 },
                { "q_zh": "王一雪推荐他们吃什么？", "q_vi": "Vương Nhất Tuyết đề xuất họ ăn gì?", "options": ["饺子", "包子", "面条儿", "面包"], "answer": 1 }
            ]
        }
    },
    "r1-l7-shijian": {
        "content": [
            { "zh": "早上八点四十，安妮给白家月打了一个电话。", "vi": "Tám giờ bốn mươi sáng, Annie gọi điện cho Bạch Gia Nguyệt." },
            { "zh": "安妮问：「现在几点？你上午有课吗？」", "vi": "Annie hỏi: 'Bây giờ mấy giờ? Sáng nay cậu có tiết không?'" },
            { "zh": "白家月说：「现在快九点了。我十点十分有课。」", "vi": "Bạch Gia Nguyệt nói: 'Bây giờ gần chín giờ rồi. Tớ mười giờ mười có tiết.'" },
            { "zh": "安妮说：「那我们下午两点在电影院见吧。」", "vi": "Annie nói: 'Thế chúng mình chiều hai giờ gặp nhau ở rạp chiếu phim nhé.'" },
            { "zh": "白家月想了想说：「今天下午我不想去，我还有事，明天见吧。」", "vi": "Bạch Gia Nguyệt nghĩ một lúc rồi nói: 'Chiều nay tớ không muốn đi, tớ còn có việc, để mai gặp nhé.'" }
        ],
        "questions": {
            "comprehension": [
                { "q_zh": "安妮几点给白家月打电话？", "q_vi": "Annie gọi điện cho Bạch Gia Nguyệt lúc mấy giờ?", "options": ["八点四十", "十点十分", "下午两点", "九点"], "answer": 0 },
                { "q_zh": "白家月下午想和安妮见面吗？", "q_vi": "Bạch Gia Nguyệt chiều nay có muốn gặp Annie không?", "options": ["想", "不想", "不知道", "已经见了"], "answer": 1 }
            ]
        }
    },
    "r1-l8-yiyuan": {
        "content": [
            { "zh": "刘明是一名医生，他在一家大医院工作。", "vi": "Lưu Minh là một bác sĩ, anh ấy làm việc ở một bệnh viện lớn." },
            { "zh": "他在医院认识了胡医生。", "vi": "Anh ấy quen bác sĩ Hồ ở bệnh viện." },
            { "zh": "胡医生的爸爸也在医院工作，他也是一名很忙的医生。", "vi": "Bố của bác sĩ Hồ cũng làm việc ở bệnh viện, ông cũng là một bác sĩ rất bận rộn." },
            { "zh": "胡医生家有两个医生，他们都很喜欢帮助病人。", "vi": "Nhà bác sĩ Hồ có hai bác sĩ, họ đều rất thích giúp đỡ bệnh nhân." },
            { "zh": "在王一飞老师家里，房间外有一只非常漂亮的小猫。", "vi": "Ở nhà cô giáo Vương Nhất Phi, bên ngoài phòng có một chú mèo nhỏ rất đẹp." },
            { "zh": "小猫正躲在桌子下面，可爱极了。", "vi": "Chú mèo đang trốn dưới gầm bàn, cực kỳ đáng yêu." }
        ],
        "questions": {
            "comprehension": [
                { "q_zh": "刘明在哪里工作？", "q_vi": "Lưu Minh làm việc ở đâu?", "options": ["学校", "医院", "餐厅", "超市"], "answer": 1 },
                { "q_zh": "胡医生的爸爸做什么工作？", "q_vi": "Bố của bác sĩ Hồ làm gì?", "options": ["老师", "医生", "司机", "学生"], "answer": 1 },
                { "q_zh": "小猫躲在哪里？", "q_vi": "Chú mèo trốn ở đâu?", "options": ["桌子上面", "椅子下面", "桌子下面", "门后面"], "answer": 2 }
            ]
        }
    },
    "r1-l9-xuexiao": {
        "content": [
            { "zh": "学校前边有一家电影院，那里非常漂亮。", "vi": "Phía trước trường học có một rạp chiếu phim, nơi đó rất đẹp." },
            { "zh": "李文说：「既然明天上午我在学校学习，我们明天晚上一起去看电影吧。」", "vi": "Lý Văn nói: 'Vì sáng mai tớ học ở trường, tối mai chúng mình cùng đi xem phim nhé.'" },
            { "zh": "白家月问：「我们几点见面？」李文说：「七点在电影院外边见。」", "vi": "Bạch Gia Nguyệt hỏi: 'Chúng mình gặp nhau lúc mấy giờ?' Lý Văn nói: 'Bảy giờ gặp bên ngoài rạp chiếu phim.'" },
            { "zh": "陈天中把他的中文书落在教室的椅子上了。", "vi": "Trần Thiên Trung để quên cuốn sách tiếng Trung trên ghế trong phòng học." },
            { "zh": "这是他买的第二本中文书，他非常希望能快点找到它。", "vi": "Đây là cuốn sách tiếng Trung thứ hai anh ấy mua, anh ấy rất hy vọng có thể nhanh chóng tìm thấy nó." }
        ],
        "questions": {
            "comprehension": [
                { "q_zh": "电影院在哪里？", "q_vi": "Rạp chiếu phim ở đâu?", "options": ["学校后边", "学校前边", "学校里边", "学校外边"], "answer": 1 },
                { "q_zh": "李文明天上午做什么？", "q_vi": "Sáng mai Lý Văn làm gì?", "options": ["看电影", "去超市", "在学校学习", "去医院"], "answer": 2 },
                { "q_zh": "陈天中的书在哪里？", "q_vi": "Sách của Trần Thiên Trung ở đâu?", "options": ["在电影院", "在书店", "在教室椅子上", "在家里"], "answer": 2 }
            ]
        }
    },
    "r1-l10-goumai": {
        "content": [
            { "zh": "今天王一雪去菜市场买水果。", "vi": "Hôm nay Vương Nhất Tuyết đi chợ mua trái cây." },
            { "zh": "她问售货员：「苹果多少钱一斤？」", "vi": "Cô ấy hỏi người bán hàng: 'Táo bao nhiêu tiền một cân?'" },
            { "zh": "售货员客气地回答：「苹果三块五一斤，这儿的苹果真便宜。」", "vi": "Người bán hàng lịch sự trả lời: 'Táo ba tệ rưỡi một cân, táo ở đây rẻ thật.'" },
            { "zh": "王一雪买了三斤，给了售货员十块钱。", "vi": "Vương Nhất Tuyết mua ba cân, đưa cho người bán mười tệ." },
            { "zh": "后来，她又去商场给孩子买了一件衣服，衣服漂亮极了，只要一百元。", "vi": "Sau đó, cô ấy lại đến trung tâm thương mại mua một bộ quần áo cho con, quần áo đẹp cực kỳ, chỉ có một trăm tệ." }
        ],
        "questions": {
            "comprehension": [
                { "q_zh": "王一雪去菜市场买什么？", "q_vi": "Vương Nhất Tuyết đi chợ mua gì?", "options": ["衣服", "水果", "书", "牛奶"], "answer": 1 },
                { "q_zh": "这儿的苹果贵吗？", "q_vi": "Táo ở đây có đắt không?", "options": ["很贵", "非常贵", "真便宜", "不知道"], "answer": 2 }
            ]
        }
    },
    "r1-l11-daxue": {
        "content": [
            { "zh": "李文还在大学里学习，他是一名学医的大二学生。", "vi": "Lý Văn vẫn đang học đại học, anh ấy là sinh viên năm hai ngành y." },
            { "zh": "他的学习非常忙，每天都有很多课。", "vi": "Việc học của anh ấy rất bận rộn, ngày nào cũng có nhiều tiết." },
            { "zh": "星期六早晨，王一雪问刘小雪：「你弟弟起床了吗？」", "vi": "Sáng thứ Bảy, Vương Nhất Tuyết hỏi Lưu Tiểu Tuyết: 'Em trai cháu dậy chưa?'" },
            { "zh": "刘小雪小声说：「他还在睡觉呢，还没起床。」", "vi": "Lưu Tiểu Tuyết nói nhỏ: 'Em ấy vẫn đang ngủ, chưa ngủ dậy ạ.'" },
            { "zh": "此时，刘明已经去医院加班了，医生们工作真的很辛苦。", "vi": "Lúc này, Lưu Minh đã đi làm thêm ở bệnh viện rồi, các bác sĩ làm việc thật sự vất vả." }
        ]
    },
    "r1-l12-tianqi": {
        "content": [
            { "zh": "昨天的天气非常冷，下雪了，而且下午还下了一阵雨。", "vi": "Thời tiết hôm qua rất lạnh, đã có tuyết rơi, và buổi chiều còn có một trận mưa." },
            { "zh": "王一雪给王一飞打电话问：「你那边的天气怎么样？」", "vi": "Vương Nhất Tuyết gọi điện cho Vương Nhất Phi hỏi: 'Thời tiết bên phía em thế nào?'" },
            { "zh": "王一飞说：「我觉得天气太不好了，我都有点儿感冒了。」", "vi": "Vương Nhất Phi nói: 'Chị thấy thời tiết không tốt chút nào, chị hơi bị cảm rồi.'" },
            { "zh": "杨同乐昨天也没能去公司上班，他去医院看病了。", "vi": "Dương Đồng Lạc hôm qua cũng không thể đến công ty làm việc, anh ấy đi khám bệnh ở bệnh viện rồi." },
            { "zh": "医生告诉他：「要多喝些热水，吃点儿药，一定要好好休息。」", "vi": "Bác sĩ bảo anh ấy: 'Phải uống nhiều nước nóng, uống chút thuốc, nhất định phải nghỉ ngơi cho tốt.'" }
        ]
    },
    "r1-l13-canguan": {
        "content": [
            { "zh": "中午，王一雪走进一家咖啡馆。", "vi": "Buổi trưa, Vương Nhất Tuyết bước vào một quán cà phê." },
            { "zh": "服务员礼貌地说：「欢迎光临！请问您想喝点儿什么？」", "vi": "Nhân viên lịch sự nói: 'Chào mừng quý khách! Xin hỏi cô muốn uống gì ạ?'" },
            { "zh": "王一雪说：「请给我一杯牛奶，还要一个面包和鸡蛋。」", "vi": "Vương Nhất Tuyết nói: 'Vui lòng cho tôi một ly sữa, thêm một cái bánh mì và trứng nữa.'" },
            { "zh": "在另一家餐馆里，刘明点了很多饺子，他非常喜欢吃这里的中国菜。", "vi": "Ở một nhà hàng khác, Lưu Minh gọi rất nhiều sủi cảo, anh ấy cực kỳ thích ăn đồ Trung Quốc ở đây." },
            { "zh": "吃完饭后，刘明还要了一杯茶，慢慢地喝着，感觉非常舒服。", "vi": "Sau khi ăn xong, Lưu Minh còn gọi thêm một tách trà, từ từ thưởng thức, cảm thấy rất thoải mái." }
        ]
    },
    "r1-l14-huoche": {
        "content": [
            { "zh": "白家月和陈天中在讨论上星期的学校旅行。", "vi": "Bạch Gia Nguyệt và Trần Thiên Trung đang thảo luận về chuyến dã ngoại của trường tuần trước." },
            { "zh": "陈天中说：「虽然坐了很久的火车，但是一点儿也不累。」", "vi": "Trần Thiên Trung nói: 'Mặc dù đi tàu hỏa rất lâu, nhưng tớ chẳng thấy mệt chút nào.'" },
            { "zh": "「火车开的时候，我看了一些电影，有些人还在睡觉呢。」", "vi": "'Khi tàu chạy, tớ đã xem một số bộ phim, một số người khác thì vẫn đang ngủ.'" },
            { "zh": "白家月高兴地拿出手机说：「你看，这上面有很多漂亮的照片。」", "vi": "Bạch Gia Nguyệt vui vẻ lấy điện thoại ra nói: 'Cậu xem này, trên này có rất nhiều ảnh đẹp.'" },
            { "zh": "他们都觉得这次旅行真的非常有意思。", "vi": "Họ đều cảm thấy chuyến đi này thật sự rất thú vị." }
        ]
    },
    "r1-l15-beijing": {
        "content": [
            { "zh": "李文今年邀请白家月和安妮去他北京的家里做客。", "vi": "Năm nay Lý Văn mời Bạch Gia Nguyệt và Annie đến nhà anh ấy ở Bắc Kinh chơi." },
            { "zh": "李文说：「去年我去了西安，那里有很多好吃的东西。」", "vi": "Lý Văn nói: 'Năm ngoái tớ đi Tây An, ở đó có rất nhiều món ngon.'" },
            { "zh": "「今年我妈妈准备了很多北京菜，请你们一定要来。」", "vi": "'Năm nay mẹ tớ đã chuẩn bị rất nhiều món Bắc Kinh, mời các bạn nhất định phải qua nhé.'" },
            { "zh": "安妮兴奋地说：「太好了！我们要去北京旅游了！」", "vi": "Annie phấn khích nói: 'Tuyệt quá! Chúng mình sắp được đi du hành Bắc Kinh rồi!'" },
            { "zh": "王一飞老师也说：「到机场后，我姐姐可以开车去接你们。」", "vi": "Cô giáo Vương Nhất Phi cũng nói: 'Sau khi đến sân bay, chị gái cô có thể lái xe đến đón các em.'" }
        ]
    }
}

for item in data:
    item_id = item['id']
    if item_id in new_content:
        # Update content (removing py from content lines since UI generates it)
        item['content'] = new_content[item_id]['content']
        # Update vocabulary if exists
        if 'vocabulary' in new_content[item_id]:
            item['vocabulary'] = new_content[item_id]['vocabulary']
        # Update questions if exists
        if 'questions' in new_content[item_id]:
            item['questions']['comprehension'] = new_content[item_id]['questions']['comprehension']
        # Remove old py fields if present to cleanup
        for line in item['content']:
            if 'py' in line:
                del line['py']
        if 'vocabulary' in item:
            for v in item['vocabulary']:
                if 'py' in v:
                    # Let's keep py for vocabulary as it's useful for study
                    pass

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("HSK 1 readings refreshed successfully.")
