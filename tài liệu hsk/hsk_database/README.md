# 📚 HSK VOCABULARY DATABASE — hanzi.io.vn
## Hướng dẫn đầy đủ cho agent đọc và sử dụng

---

## I. TỔNG QUAN

Database từ vựng được trích xuất **trực tiếp từ 3 file PDF sách giáo trình** bằng nhận dạng hình ảnh:

| File | Sách | Bài | Từ vựng mới | Ngữ pháp |
|------|------|-----|-------------|----------|
| `hsk1_vocabulary.json` | 新HSK教程1 (2026) | 15 bài | 196 từ | 40 điểm |
| `hsk2_vocabulary.json` | 新HSK教程2 (2026) | 15 bài | 213 từ | 45 điểm |
| `hsk3_vocabulary.json` | 新HSK教程3 (2026) | 18 bài | 283 từ | 63 điểm |
| **Tổng** | | **48 bài** | **692 từ** | **148 điểm** |

**Nguồn gốc:** NXB Ngoại ngữ (外语教学与研究出版社), 2026 — bộ giáo trình chính thức chuẩn HSK 3.0.

---

## II. CẤU TRÚC FILE JSON

### Mỗi file JSON có cấu trúc:
```json
{
  "metadata": {
    "book": "新HSK教程1 (New HSK Course 1)",
    "publisher": "外语教学与研究出版社",
    "year": 2026,
    "total_lessons": 15,
    "total_words": 196
  },
  "lessons": [
    {
      "lesson": 1,
      "title_zh": "AI小语，你好！",
      "title_en": "Hello, AI Xiaoyu!",
      "word_count": 12,
      "vocabulary": [
        {
          "no": 1,
          "hanzi": "你好",
          "pinyin": "nǐ hǎo",
          "pos": "v.",
          "en": "hello"
        }
      ]
    }
  ]
}
```

### Các trường dữ liệu:
| Trường | Ý nghĩa | Ví dụ |
|--------|---------|-------|
| `no` | Số thứ tự trong bài | 1, 2, 3... |
| `hanzi` | Chữ Hán | 你好 |
| `pinyin` | Phiên âm (có thanh điệu) | nǐ hǎo |
| `pos` | Loại từ | n. / v. / adj. / adv. / pron. / part. / mod. / conj. / prep. / m. / num. / suf. / int. |
| `en` | Nghĩa tiếng Anh | hello |

---

## III. DANH SÁCH ĐẦY ĐỦ CÁC BÀI HỌC

### HSK 1 — 15 bài (196 từ)
| Bài | Tiêu đề | Số từ | Miễn phí |
|-----|---------|-------|----------|
| 1 | AI小语，你好！ Hello, AI Xiaoyu! | 12 | ✅ |
| 2 | 我叫李文 My name is Li Wen | 15 | ✅ |
| 3 | 我是中国人 I'm Chinese | 18 | ✅ |
| 4 | 我有两个孩子 I have two children | 13 | 🔒 |
| 5 | 今天我休息 I'm off today | 22 | 🔒 |
| 6 | 你的手机号是多少？ What's your phone number? | 22 | 🔒 |
| 7 | 我晚上六点半下班 I'll finish work at 6:30 in the evening | 27 | 🔒 |
| 8 | 我爸爸也在医院工作 My father also works at a hospital | 23 | 🔒 |
| 9 | 我明天上午在学校学习 I'll be studying at school tomorrow morning | 23 | 🔒 |
| 10 | 这儿的苹果真便宜！ The apples here are really affordable! | 23 | 🔒 |
| 11 | 我读大学呢 I'm studying at university | 25 | 🔒 |
| 12 | 昨天下雪了 It snowed yesterday | 24 | 🔒 |
| 13 | 请给我一杯茶 I'll have a cup of tea, please | 20 | 🔒 |
| 14 | 我看了一个电影 I watched a movie | 26 | 🔒 |
| 15 | 大兴机场见！ See you at Daxing Airport! | 17 | 🔒 |

### HSK 2 — 15 bài (213 từ)
| Bài | Tiêu đề | Số từ | Miễn phí |
|-----|---------|-------|----------|
| 1 | 她请我们吃了北京烤鸭 She treated us to Peking Duck | 10 | ✅ |
| 2 | 还是打车去北大吧 Let's take a taxi to Peking University instead | 13 | ✅ |
| 3 | 我想去西安旅游 I want to visit Xi'an | 14 | ✅ |
| 4 | 你穿红色的很好看 You look pretty good in red | 14 | 🔒 |
| 5 | 第一次去中国朋友家 Visiting a Chinese friend's home for the first time | 14 | 🔒 |
| 6 | 小雪，生日快乐！ Happy birthday, Xiaoxue! | 14 | 🔒 |
| 7 | 他篮球打得很好 He plays basketball very well | 14 | 🔒 |
| 8 | 虽然你忘了，但是我记得 Even though you forgot, I remembered | 14 | 🔒 |
| 9 | 我去买杯奶茶 I'm going to buy a cup of bubble tea | 14 | 🔒 |
| 10 | 就要考试了 The exam is coming | 14 | 🔒 |
| 11 | 我最喜欢吃中国菜 I like Chinese food the most | 14 | 🔒 |
| 12 | 这里比北京冷多了 It's much colder here than in Beijing | 14 | 🔒 |
| 13 | 我们爱上中文课 We love attending Chinese class | 14 | 🔒 |
| 14 | 一个人过年多没意思啊 It's boring to celebrate the Spring Festival alone | 14 | 🔒 |
| 15 | 我想再去一次中国 I want to go to China again | 15 | 🔒 |

### HSK 3 — 18 bài (283 từ)
| Bài | Tiêu đề | Số từ | Miễn phí |
|-----|---------|-------|----------|
| 1 | 我们去机场接你们 We will pick you up at the airport | 16 | ✅ |
| 2 | 你们想吃什么就点什么 You can order whatever you feel like | 18 | ✅ |
| 3 | 这个小区挺好的 This neighborhood is pretty nice | 16 | ✅ |
| 4 | 这家宾馆跟别的都不一样 This hotel is unlike any other | 16 | 🔒 |
| 5 | 这样的照片才好看 Photos like these are the best | 16 | 🔒 |
| 6 | 高铁上还可以点外卖 You can even order takeout on a high-speed train | 16 | 🔒 |
| 7 | 那条裙子比短裤还好看 That skirt looks better than the shorts | 16 | 🔒 |
| 8 | 今天我出院了 Today I was discharged from the hospital | 16 | 🔒 |
| 9 | 打不好没关系 It doesn't matter if you don't play well | 14 | 🔒 |
| 10 | 你明天再把书还给我 You can return the book to me tomorrow | 16 | 🔒 |
| 11 | 看来我没办法解决这个问题 It seems I can't solve this problem | 16 | 🔒 |
| 12 | 这个季节天气变化很快 The weather changes rapidly in this season | 16 | 🔒 |
| 13 | 我的新邻居来自英国 My new neighbors come from the UK | 16 | 🔒 |
| 14 | 这本书被别人借走了 This book is checked out | 16 | 🔒 |
| 15 | 我是半个南京人 I am basically half a Nanjing local | 16 | 🔒 |
| 16 | 我听说有的熊猫出国了 I heard that some pandas have gone abroad | 14 | 🔒 |
| 17 | 我要多向认真的人学习 I will learn from people who are careful | 16 | 🔒 |
| 18 | 我学会了包饺子 I've learned how to make jiaozi | 16 | 🔒 |

---

## IV. HƯỚNG DẪN SỬ DỤNG CHO AGENT

### Cách đọc JSON (JavaScript/TypeScript):
```typescript
import hsk1 from './data/hsk1_vocabulary.json'
import hsk2 from './data/hsk2_vocabulary.json'
import hsk3 from './data/hsk3_vocabulary.json'

// Lấy từ vựng bài 2 HSK 1
const lesson2 = hsk1.lessons.find(l => l.lesson === 2)
console.log(lesson2.vocabulary)
// => [{no:1, hanzi:'请问', pinyin:'qǐngwèn', pos:'v.', en:'excuse me'}, ...]

// Lấy tất cả từ vựng HSK 1
const allHSK1Words = hsk1.lessons.flatMap(l => l.vocabulary.map(w => ({
  ...w,
  lesson: l.lesson,
  lesson_title: l.title_zh
})))

// Tìm từ theo hanzi
const findWord = (hanzi, allBooks = [hsk1, hsk2, hsk3]) => {
  for (const book of allBooks) {
    for (const lesson of book.lessons) {
      const word = lesson.vocabulary.find(w => w.hanzi === hanzi)
      if (word) return { ...word, book: book.metadata.book, lesson: lesson.lesson }
    }
  }
  return null
}
```

### Cách import vào Supabase:
```bash
# 1. Chạy schema SQL trước
# Copy nội dung schema_and_seed.sql vào Supabase SQL Editor → Run

# 2. Install dependencies
npm install @supabase/supabase-js dotenv

# 3. Đặt file data vào thư mục data/
cp hsk*_vocabulary.json /your-project/data/

# 4. Copy script import
cp import-vocab.js /your-project/scripts/

# 5. Chạy import
node scripts/import-vocab.js
```

### Query Supabase (ví dụ):
```typescript
// Lấy từ vựng bài 3 HSK 2
const { data } = await supabase
  .from('vocabulary')
  .select('*')
  .eq('book_level', 2)
  .eq('lesson_number', 3)
  .order('word_number')

// Lấy danh sách bài học HSK 1
const { data: lessons } = await supabase
  .from('lessons')
  .select('*')
  .eq('book_level', 1)
  .order('lesson_number')

// Tìm kiếm từ
const { data: words } = await supabase
  .from('vocabulary')
  .select('*')
  .ilike('hanzi', '%你%')
  .limit(20)
```

---

## V. LOẠI TỪ (PART OF SPEECH)

| Ký hiệu | Tiếng Anh | Tiếng Việt | Ví dụ |
|---------|-----------|-----------|-------|
| n. | noun | danh từ | 老师, 学生 |
| v. | verb | động từ | 去, 来, 学习 |
| adj. | adjective | tính từ | 好, 大, 漂亮 |
| adv. | adverb | phó từ | 很, 也, 都 |
| pron. | pronoun | đại từ | 我, 你, 什么 |
| part. | particle | trợ từ | 的, 了, 吗 |
| mod. | modal verb | động từ tình thái | 会, 能, 可以, 想 |
| conj. | conjunction | liên từ | 和, 但是, 因为 |
| prep. | preposition | giới từ | 在, 从, 向 |
| m. | measure word | lượng từ | 个, 本, 张 |
| num. | numeral | số từ | 一, 二, 百 |
| num.-m. | numeral-measure | số lượng từ kết hợp | 一些, 一下 |
| suf. | suffix | hậu tố | 们, 员 |
| pref. | prefix | tiền tố | 第 |
| int. | interjection | thán từ | 喂 |
| onom. | onomatopoeia | tượng thanh | (ít gặp) |

---

## VI. GHI CHÚ QUAN TRỌNG

1. **Từ có dấu `*`** trong sách gốc = từ ngoài syllabus HSK cấp đó (nhưng vẫn xuất hiện trong bài)
2. **Bài 1-3 miễn phí** mỗi cấp — từ bài 4 cần Pro
3. **Số từ mỗi bài** là số từ mới trong bài (không tính từ cũ từ bài trước)
4. **Tổng từ tích lũy**: HSK1=196 | HSK1+2=409 | HSK1+2+3=692
5. **Nghĩa tiếng Việt** chưa có trong JSON — cần bổ sung sau hoặc dùng nghĩa tiếng Anh làm cơ sở

---

## VII. CÁC FILE LIÊN QUAN

```
hsk_database/
├── README.md                  ← File này
├── hsk1_vocabulary.json       ← 15 bài, 196 từ, đầy đủ
├── hsk2_vocabulary.json       ← 15 bài, 213 từ, đầy đủ  
├── hsk3_vocabulary.json       ← 18 bài, 283 từ, đầy đủ
├── schema_and_seed.sql        ← SQL schema + seed cho Supabase
└── import-vocab.js            ← Script import tự động

Các file khác trong project:
data/
├── topics.json               ← 12 chủ đề từ vựng
├── conversations.json        ← Hội thoại mẫu
├── readings.json             ← Bài đọc hiểu
├── radicals.json             ← 20 bộ thủ quan trọng
├── sentence-patterns.json    ← 10 mẫu câu
├── measure-words.json        ← 15 lượng từ
└── exams.json                ← Đề thi mẫu
```

---

*Database xây dựng bởi phân tích trực tiếp 3 PDF sách Tân HSK Giáo Trình 1, 2, 3 (NXB Ngoại ngữ, 2026)*
*Cập nhật: 2026-04 | Phương pháp: image OCR + manual verification*
