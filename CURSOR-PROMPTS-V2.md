# 📋 BỘ LỆNH CURSOR AI — HANZI.IO.VN (PHIÊN BẢN ĐẦY ĐỦ)
## 11 mục chính + Data sẵn sàng chạy

---

## ═══════════════════════════════════
## NHÓM A: SETUP BAN ĐẦU (làm trước)
## ═══════════════════════════════════

### [A1] Khởi tạo dự án (chạy trong Terminal)
```bash
npx create-next-app@latest hanzi-io-vn --typescript --tailwind --app --no-src-dir --import-alias "@/*"
cd hanzi-io-vn
npm install @clerk/nextjs @supabase/supabase-js lucide-react clsx
```

---

### [A2] Tạo cấu trúc thư mục + file rỗng
```
Tạo cấu trúc thư mục đầy đủ cho dự án Next.js hanzi.io.vn với 11 mục học:

app/
  layout.tsx
  page.tsx                          ← Trang chủ (landing)
  (auth)/dang-nhap/page.tsx
  (auth)/dang-ky/page.tsx
  dashboard/page.tsx
  
  giao-trinh/page.tsx               ← Mục 1: Giáo trình HSK
  giao-trinh/hsk[level]/page.tsx
  giao-trinh/hsk[level]/[lesson]/page.tsx
  giao-trinh/hsk[level]/[lesson]/chon-nghia/page.tsx
  giao-trinh/hsk[level]/[lesson]/chon-pinyin/page.tsx
  giao-trinh/hsk[level]/[lesson]/dien-tu/page.tsx
  giao-trinh/hsk[level]/[lesson]/luyen-nghe/page.tsx
  giao-trinh/hsk[level]/[lesson]/flashcard/page.tsx
  giao-trinh/hsk[level]/[lesson]/nhap-tu/page.tsx

  tu-vung-chu-de/page.tsx           ← Mục 2: Từ vựng chủ đề
  tu-vung-chu-de/[topic]/page.tsx
  tu-vung-chu-de/[topic]/[lesson]/page.tsx

  hoi-thoai/page.tsx                ← Mục 3: Hội thoại
  hoi-thoai/[level]/page.tsx
  hoi-thoai/[level]/[id]/page.tsx

  doc-hieu/page.tsx                 ← Mục 4: Đọc hiểu
  doc-hieu/[level]/page.tsx
  doc-hieu/[level]/[id]/page.tsx

  luyen-thi/page.tsx                ← Mục 5: Luyện thi
  luyen-thi/[level]/page.tsx

  bo-thu/page.tsx                   ← Mục 6: Bộ thủ
  bo-thu/[group]/page.tsx

  dich/page.tsx                     ← Mục 7: Dịch
  mau-cau/page.tsx                  ← Mục 8: Mẫu câu
  luyen-viet/page.tsx               ← Mục 9: Luyện viết
  luong-tu/page.tsx                 ← Mục 10: Lượng từ
  luyen-de-thpt/page.tsx            ← Mục 11: Luyện đề THPT

  nang-cap/page.tsx

  api/
    payment/create/route.ts
    payment/webhook/route.ts
    tts/route.ts
    vocabulary/[id]/rate/route.ts
    progress/update/route.ts

components/
  Navbar.tsx
  Footer.tsx
  VocabCard.tsx
  FlashCard.tsx
  QuizChoice.tsx
  ProgressBar.tsx
  LessonSidebar.tsx
  UpgradeBanner.tsx
  LockOverlay.tsx
  AudioButton.tsx
  BreadCrumb.tsx
  CategoryCard.tsx    ← Card dùng cho trang chủ danh mục
  LevelBadge.tsx

lib/
  supabase.ts
  types.ts
  srs.ts
  utils.ts

data/                ← Tất cả JSON data (xem file data riêng)

Tạo tất cả file với nội dung "export default function Page() { return <div>TODO</div> }"
```

---

### [A3] Schema database Supabase đầy đủ
```sql
-- Chạy trong Supabase SQL Editor

-- ══════════════════════════════════
-- BẢNG 1: TỪ VỰNG MASTER
-- ══════════════════════════════════
CREATE TABLE vocabulary (
  id SERIAL PRIMARY KEY,
  hanzi TEXT NOT NULL,
  pinyin TEXT NOT NULL,
  meaning_vi TEXT NOT NULL,
  part_of_speech TEXT,
  hsk_level INTEGER CHECK (hsk_level BETWEEN 1 AND 6),
  lesson_number INTEGER,
  order_in_lesson INTEGER DEFAULT 0,
  topic TEXT,                  -- null nếu là HSK vocab, có giá trị nếu là chủ đề
  topic_lesson INTEGER,        -- bài trong topic
  example_zh TEXT,
  example_pinyin TEXT,
  example_vi TEXT,
  image_url TEXT,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════
-- BẢNG 2: BÀI HỌC HSK
-- ══════════════════════════════════
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  hsk_level INTEGER NOT NULL,
  lesson_number INTEGER NOT NULL,
  title TEXT,
  word_count INTEGER DEFAULT 10,
  is_free BOOLEAN DEFAULT FALSE,
  UNIQUE(hsk_level, lesson_number)
);

-- Seed: 50 bài HSK1 (bài 1-3 free), 80 bài HSK2, ...
INSERT INTO lessons (hsk_level, lesson_number, title, word_count, is_free)
SELECT 1, g, 'Bài '||g, CASE WHEN g=50 THEN 7 ELSE 10 END, g<=3
FROM generate_series(1,50) g;

INSERT INTO lessons (hsk_level, lesson_number, title, word_count, is_free)
SELECT 2, g, 'Bài '||g, 10, g<=3
FROM generate_series(1,80) g;

-- ══════════════════════════════════
-- BẢNG 3: CHỦ ĐỀ TỪ VỰNG
-- ══════════════════════════════════
CREATE TABLE topics (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name_vi TEXT NOT NULL,
  name_zh TEXT,
  description TEXT,
  icon TEXT,
  lesson_count INTEGER,
  word_count INTEGER,
  is_free BOOLEAN DEFAULT FALSE,
  order_num INTEGER
);

-- ══════════════════════════════════
-- BẢNG 4: HỘI THOẠI
-- ══════════════════════════════════
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  hsk_level INTEGER NOT NULL,
  title_vi TEXT NOT NULL,
  title_zh TEXT,
  topic TEXT,              -- 'greeting' | 'shopping' | 'family'...
  difficulty TEXT,
  content JSONB,           -- [{role:'A', zh:'...', pinyin:'...', vi:'...'}]
  vocabulary JSONB,        -- key vocab trong đoạn hội thoại
  is_free BOOLEAN DEFAULT FALSE,
  order_num INTEGER
);

-- ══════════════════════════════════
-- BẢNG 5: ĐỌC HIỂU
-- ══════════════════════════════════
CREATE TABLE readings (
  id SERIAL PRIMARY KEY,
  hsk_level INTEGER NOT NULL,
  title_vi TEXT NOT NULL,
  content_zh TEXT NOT NULL,
  content_pinyin TEXT,
  content_vi TEXT,
  questions JSONB,         -- [{q:'...', options:[...], answer:0}]
  new_words JSONB,
  is_free BOOLEAN DEFAULT FALSE,
  order_num INTEGER
);

-- ══════════════════════════════════
-- BẢNG 6: BỘ THỦ
-- ══════════════════════════════════
CREATE TABLE radicals (
  id SERIAL PRIMARY KEY,
  character TEXT NOT NULL,
  pinyin TEXT,
  meaning_vi TEXT,
  stroke_count INTEGER,
  group_name TEXT,         -- 'Con người' | 'Thiên nhiên' | 'Động vật'...
  example_chars JSONB,     -- [{char:'你', meaning:'bạn'}]
  memory_tip TEXT,
  order_num INTEGER
);

-- ══════════════════════════════════
-- BẢNG 7: MẪU CÂU
-- ══════════════════════════════════
CREATE TABLE sentence_patterns (
  id SERIAL PRIMARY KEY,
  pattern_zh TEXT NOT NULL,
  pattern_vi TEXT NOT NULL,
  usage TEXT,
  hsk_level INTEGER,
  topic TEXT,
  examples JSONB,          -- [{zh:'...', pinyin:'...', vi:'...'}]
  is_free BOOLEAN DEFAULT FALSE,
  order_num INTEGER
);

-- ══════════════════════════════════
-- BẢNG 8: LƯỢNG TỪ
-- ══════════════════════════════════
CREATE TABLE measure_words (
  id SERIAL PRIMARY KEY,
  character TEXT NOT NULL,
  pinyin TEXT NOT NULL,
  meaning_vi TEXT NOT NULL,
  used_for TEXT,           -- 'dùng cho sách vở, tài liệu'
  examples JSONB,          -- [{zh:'一本书', vi:'một cuốn sách'}]
  category TEXT,
  is_free BOOLEAN DEFAULT FALSE
);

-- ══════════════════════════════════
-- BẢNG 9: ĐỀ THI (Luyện thi + THPT)
-- ══════════════════════════════════
CREATE TABLE exams (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,      -- 'hsk' | 'thpt'
  hsk_level INTEGER,
  duration_minutes INTEGER DEFAULT 90,
  questions JSONB NOT NULL, -- [{type:'single', q:'...', options:[...], answer:0, explain:'...'}]
  is_free BOOLEAN DEFAULT FALSE,
  order_num INTEGER
);

-- ══════════════════════════════════
-- BẢNG 10: USER DATA
-- ══════════════════════════════════
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  content_type TEXT NOT NULL,  -- 'lesson'|'topic'|'conversation'|'reading'|'exam'
  content_id INTEGER NOT NULL,
  status TEXT DEFAULT 'not_started',
  score INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, content_type, content_id)
);

CREATE TABLE user_vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  vocab_id INTEGER REFERENCES vocabulary(id),
  ease_factor FLOAT DEFAULT 2.5,
  interval_days INTEGER DEFAULT 1,
  repetitions INTEGER DEFAULT 0,
  next_review DATE DEFAULT CURRENT_DATE,
  last_rating TEXT,
  UNIQUE(user_id, vocab_id)
);

CREATE TABLE user_streaks (
  user_id TEXT PRIMARY KEY,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE,
  total_xp INTEGER DEFAULT 0,
  total_words INTEGER DEFAULT 0
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  plan TEXT DEFAULT 'free',
  expires_at TIMESTAMPTZ,
  payment_ref TEXT,
  status TEXT DEFAULT 'active'
);

-- Public read policies
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE radicals ENABLE ROW LEVEL SECURITY;
ALTER TABLE sentence_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE measure_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON vocabulary FOR SELECT USING (TRUE);
CREATE POLICY "public_read" ON lessons FOR SELECT USING (TRUE);
CREATE POLICY "public_read" ON topics FOR SELECT USING (TRUE);
CREATE POLICY "public_read" ON conversations FOR SELECT USING (TRUE);
CREATE POLICY "public_read" ON readings FOR SELECT USING (TRUE);
CREATE POLICY "public_read" ON radicals FOR SELECT USING (TRUE);
CREATE POLICY "public_read" ON sentence_patterns FOR SELECT USING (TRUE);
CREATE POLICY "public_read" ON measure_words FOR SELECT USING (TRUE);
CREATE POLICY "public_read" ON exams FOR SELECT USING (TRUE);
```

---

## ═══════════════════════════════════
## NHÓM B: TRANG CHỦ & NAVBAR
## ═══════════════════════════════════

### [B1] Navbar 2 hàng đầy đủ
```
Tạo components/Navbar.tsx cho hanzi.io.vn.

HÀNG TRÊN:
- Logo "hanzi.io.vn" màu #D85A30, font-bold, text-xl
- Ô tìm kiếm: icon kính lúp + placeholder "Tìm kiếm..." rounded-full bg-gray-100
- Nút "▶ Google Play" + "🍎 App Store" nền đen text trắng rounded-lg text-sm
- "✉ Liên hệ" text link
- "→ Đăng nhập" border button
- "👤 Đăng ký" bg-blue-600 text trắng button

HÀNG DƯỚI (bg-white border-b):
🏠 Trang chủ | 📖 GT hán ngữ | 🔊 Luyện tập ▾ | 📋 Từ vựng ▾ | 💬 Hội thoại | 📰 Đọc hiểu | ⊞ Bộ thủ | 📝 Luyện thi | 🆕 Luyện thi mới | 🔤 Dịch | 👑 Nâng cấp (vàng gradient)

DROPDOWN Luyện tập (hover):
- 🌐 Luyện dịch / Dịch câu Trung-Việt
- ↕ Sắp xếp câu / Sắp xếp từ thành câu đúng
- ✗ Sửa câu sai / Tìm và sửa lỗi ngữ pháp
- Aa Điền từ / Điền từ còn thiếu vào câu
- 💬 Hỏi đáp / Luyện phản xạ hội thoại Q&A

DROPDOWN Từ vựng (hover):
- 🔥 Từ vựng HSK 3.0 / Bộ lesson mới chuẩn HSK 3.0 → /giao-trinh
- 📚 Từ vựng HSK / Học theo bài và cấp độ → /giao-trinh
- 🗂 Từ vựng chủ đề / Theo chủ đề giao tiếp → /tu-vung-chu-de
- ❝❞ Mẫu câu / Mẫu câu theo chủ đề → /mau-cau

Dùng Clerk: <UserButton/> khi logged in, ẩn nút đăng nhập/ký.
Sticky + backdrop-blur-sm. Mobile: hamburger.
```

### [B2] Trang chủ — Grid 11 mục
```
Tạo file app/page.tsx — Trang chủ landing của hanzi.io.vn.

Sau hero section, có section "Khám phá tất cả tính năng" với grid 3 cột:

Mỗi card có:
- Icon trong ô vuông bo góc (màu pastel khác nhau)
- Tên mục (font-bold)
- Mô tả ngắn
- "X bài" màu accent
- Mũi tên → khi hover

11 mục theo đúng ảnh:
1. 📖 Giáo trình HSK — Học theo chuẩn HSK quốc tế từ cấp 1-6 — 150 bài — /giao-trinh
2. 📋 Từ vựng chủ đề — Hệ thống từ vựng phân loại theo chủ đề — 80 bài — /tu-vung-chu-de
3. 💬 Hội thoại — Luyện hội thoại với các tình huống giao tiếp — 120 bài — /hoi-thoai
4. 📰 Đọc hiểu — Nâng cao khả năng đọc từ cơ bản đến nâng cao — 90 bài — /doc-hieu
5. 📝 Luyện thi — Đề thi thử HSK với hệ thống chấm điểm tự động — 60 bài — /luyen-thi
6. ⊞ Bộ thủ — Học 214 bộ thủ giúp nhận biết và viết chữ Hán — 30 bài — /bo-thu
7. 🔤 Dịch — Công cụ dịch thông minh với từ điển tích hợp — 40 bài — /dich
8. ❝❞ Mẫu câu — Học mẫu câu tiếng Trung qua các chủ đề — 70 bài — /mau-cau
9. ✍ Luyện viết — Luyện viết chữ Hán chuẩn nét, hướng dẫn đếm nét sai — 50 bài — /luyen-viet
10. 〒 Lượng từ — Học các loại lượng từ phổ biến kèm ví dụ cụ thể — 45 bài — /luong-tu
11. 📄 Luyện đề THPT — Luyện đề thi THPT online chấm điểm tự động — 10 bài — /luyen-de-thpt

Icon màu pastel: mỗi card một màu (blue/orange/green/purple/red/teal/yellow/pink...)
Hover: card nâng lên nhẹ (shadow-md, translateY-1)
Số bài: màu accent của card đó
```

---

## ═══════════════════════════════════
## NHÓM C: MỤC 1 — GIÁO TRÌNH HSK
## ═══════════════════════════════════

### [C1] Trang tổng quan giáo trình
```
Tạo app/giao-trinh/page.tsx

Hiển thị 6 cấp độ HSK dạng card lớn:
- Icon chữ Hán đặc trưng (你/朋/努/机/经/哲)
- Badge cấp độ + độ khó (Cơ bản/Trung bình/Nâng cao/Chuyên gia)
- Số bài + thời gian ước tính
- 3 từ ví dụ của cấp đó
- Nút "Vào học →"

Data:
HSK1: 你好/谢谢/再见 | 15 bài | 2-3 tháng | Cơ bản
HSK2: 朋友/学习/工作 | 15 bài | 3-4 tháng | Cơ bản  
HSK3: 努力/帮助/旅游 | 10 bài | 4-5 tháng | Trung bình
HSK4: 机会/环境/发展 | 10 bài | 6-8 tháng | Trung bình
HSK5: 经济/政治/文化 | 13 bài | 8-12 tháng | Nâng cao
HSK6: 哲学/艺术/科学 | 13 bài | 12+ tháng | Chuyên gia
```

### [C2] Danh sách bài học HSK
```
Tạo app/giao-trinh/hsk[level]/page.tsx (dynamic route, level=1..6)

Layout:
- Breadcrumb: Trang chủ > Giáo trình HSK > HSK {level}
- Header: "Từ vựng HSK {level}" + mô tả
- Stats: X Bài học · X Từ vựng
- Filter tabs: Tất cả | Đã xong | Đang học | Chưa mở
- Grid 2 cột danh sách bài:
  Mỗi ô: số bài | "Bài X - 10 từ" | status | progress bar % | nút Bắt đầu hoặc 🔒PRO

Freemium: bài 1-3 free → bài 4+ cần PRO (hiện icon khóa + overlay khi click)
Data từ Supabase: SELECT * FROM lessons WHERE hsk_level = level ORDER BY lesson_number
User progress từ Clerk userId
```

### [C3] Nội dung bài học
```
Tạo app/giao-trinh/hsk[level]/[lesson]/page.tsx

Layout 2 cột:
- MAIN (2/3): 
  Header: "Bài {lesson} - 10 từ vựng"
  Tabs: Từ vựng | Chọn nghĩa | Chọn phiên âm | Chọn từ tiếng Trung | Điền từ | Luyện nghe | Flashcard | Nhập từ
  
  Danh sách từ: mỗi card:
  - STT | Ảnh mờ-blur loading | Chữ Hán to | Pinyin đỏ | Badge loại từ
  - Nghĩa tiếng Việt | Câu ví dụ có pinyin nhỏ trên đầu từng chữ | 🔊 nút nghe
  
- SIDEBAR (1/3): danh sách bài 1-50, highlight bài hiện tại, bài lock có 🔒

Footer: ← Bài trước | Bài sau → | nút float "Luyện tập →"

Data: SELECT * FROM vocabulary WHERE hsk_level={level} AND lesson_number={lesson} ORDER BY order_in_lesson
```

### [C4] Bài tập Quiz (Chọn nghĩa)
```
Tạo app/giao-trinh/hsk[level]/[lesson]/chon-nghia/page.tsx — Client component

State: currentIndex, score, answers, isAnswered, selectedOption

UI:
- Progress bar X/10 + XP hiện tại
- Chữ Hán lớn text-7xl + pinyin text-xl text-red-500
- Grid 2x2 bốn nút đáp án
- Khi đúng: nút xanh + "+10 XP" float animation + âm thanh ding
- Khi sai: nút đỏ + nút đúng xanh + giải thích
- Delay 1.5s → câu tiếp
- Kết quả: icon trophy + điểm + % + nút Làm lại / Bài tiếp theo

Logic:
- Shuffle 10 từ
- Mỗi câu: 1 đáp án đúng + 3 sai random từ cùng hsk_level
- POST /api/progress/update khi xong
```

### [C5] Flashcard SRS
```
Tạo app/giao-trinh/hsk[level]/[lesson]/flashcard/page.tsx — Client component

UI:
- Progress X/10
- Thẻ lớn có hiệu ứng flip 3D (CSS perspective + rotateY):
  Mặt trước: Chữ Hán text-8xl + nút 🔊
  Mặt sau: Pinyin đỏ + Nghĩa tiếng Việt + Ví dụ câu
- Hint: "Nhấn Space hoặc click thẻ để lật"
- Sau khi lật: 3 nút đánh giá
  [😅 Khó] bg-red-50    → interval 1 ngày
  [🙂 Ổn]  bg-yellow-50 → interval * 1.5
  [😄 Dễ]  bg-green-50  → interval * easeFactor

Keyboard: Space=lật, 1=Khó, 2=Ổn, 3=Dễ

SRS trong lib/srs.ts:
export function calculateSRS(ef: number, interval: number, reps: number, rating: 'hard'|'ok'|'easy') {
  if (rating === 'hard') return { ef: Math.max(1.3, ef-0.2), interval: 1, reps: 0 }
  const newReps = reps + 1
  const newInterval = reps === 0 ? 1 : reps === 1 ? 6 : Math.round(interval * ef)
  const newEf = rating === 'easy' ? ef + 0.1 : ef
  return { ef: newEf, interval: newInterval, reps: newReps }
}

PATCH /api/vocabulary/[id]/rate với { rating, userId }
```

---

## ═══════════════════════════════════
## NHÓM D: MỤC 2 — TỪ VỰNG CHỦ ĐỀ
## ═══════════════════════════════════

### [D1] Trang tổng quan chủ đề
```
Tạo app/tu-vung-chu-de/page.tsx

Header: "Từ vựng tiếng Trung theo chủ đề" + "62 Chủ đề · 1080 Từ vựng · 64 Bài học"

Grid 3 cột các chủ đề. Mỗi card:
- Icon emoji lớn trong ô màu
- Tên chủ đề (VD: "Nghề nghiệp")
- Mô tả ngắn
- "X bài · Y từ"
- Nút "Khám phá →"

10 chủ đề từ data/topics.json (file riêng):
nghề-nghiệp | quần-áo | con-vật | rau-củ-quả | cơ-thể-người | giao-thông | đồ-ăn | tết | trường-học | gia-đình | màu-sắc | số-đếm | ...

Lấy data từ Supabase bảng topics ORDER BY order_num
```

### [D2] Bài học chủ đề
```
Tạo app/tu-vung-chu-de/[topic]/page.tsx

Giống C2 nhưng filter theo topic thay vì hsk_level.
Hiển thị breadcrumb: Trang chủ > Từ vựng chủ đề > {topicName}

app/tu-vung-chu-de/[topic]/[lesson]/page.tsx
Giống C3 nhưng query: WHERE topic={topic} AND topic_lesson={lesson}
```

---

## ═══════════════════════════════════
## NHÓM E: MỤC 3 — HỘI THOẠI
## ═══════════════════════════════════

### [E1] Trang hội thoại
```
Tạo app/hoi-thoai/page.tsx

Header: "Luyện tập hội thoại" + stats: 670 bài · 6 cấp độ · 5000+ từ

6 card cấp độ (HSK 1-6):
HSK1: "Giao tiếp cơ bản" | Chào hỏi, Giới thiệu, Gia đình, Thời gian
HSK2: "Hội thoại thông dụng" | Mua sắm, Nhà hàng, Giao thông, Thời tiết
HSK3: "Giao tiếp nâng cao" | Công việc, Sở thích, Du lịch, Sức khỏe
HSK4: "Hội thoại chuyên sâu" | Giáo dục, Văn hóa, Công nghệ, Môi trường
HSK5: "Thảo luận chuyên nghiệp" | Kinh tế, Chính trị, Khoa học, Lịch sử
HSK6: "Giao tiếp thành thạo" | Văn học, Triết học, Nghệ thuật, Thành ngữ

Mỗi card: badge level + tên + tag chủ đề + thời gian ước tính + nút "Bắt đầu học"

Section dưới: Lộ trình học (6 bước theo chuỗi)
```

### [E2] Nội dung hội thoại
```
Tạo app/hoi-thoai/[level]/[id]/page.tsx

Hiển thị đoạn hội thoại:
- Tiêu đề + chủ đề + cấp độ badge
- Đoạn hội thoại dạng chat bubble:
  Người A (bên trái, bg-blue-50): chữ Hán + pinyin nhỏ + dịch Việt
  Người B (bên phải, bg-gray-50): tương tự
- Nút 🔊 cạnh mỗi dòng để nghe
- Bảng từ vựng mới trong bài
- Bài tập: điền vào chỗ trống trong đoạn hội thoại

Data từ Supabase bảng conversations, field content là JSONB array
```

---

## ═══════════════════════════════════
## NHÓM F: MỤC 4 — ĐỌC HIỂU
## ═══════════════════════════════════

### [F1] Trang đọc hiểu
```
Tạo app/doc-hieu/page.tsx và app/doc-hieu/[level]/page.tsx

Danh sách bài đọc theo cấp độ HSK.
Mỗi bài: tiêu đề | cấp độ | số câu hỏi | thời gian đọc ước tính | preview câu đầu

app/doc-hieu/[level]/[id]/page.tsx:
- Đoạn văn tiếng Trung (có thể toggle xem pinyin)
- Từ vựng mới: hover vào từ nào → popup nghĩa
- Bài tập trắc nghiệm 5-10 câu
- Kết quả: X/10 đúng + giải thích từng câu

Data từ Supabase bảng readings
```

---

## ═══════════════════════════════════
## NHÓM G: MỤC 5 — LUYỆN THI HSK
## ═══════════════════════════════════

### [G1] Trang luyện thi
```
Tạo app/luyen-thi/page.tsx

Header: "Luyện thi HSK" + mô tả

Cards 6 cấp độ, mỗi card: badge HSK + số đề + thời gian thi + nút "Làm đề"

app/luyen-thi/[level]/page.tsx: danh sách đề theo cấp
app/luyen-thi/[level]/[examId]/page.tsx: giao diện thi:
- Đồng hồ đếm ngược (90 phút)
- Sidebar danh sách câu: xanh=đã làm, xám=chưa làm, đỏ=đánh dấu
- Câu hỏi nhiều lựa chọn + nghe audio (nếu có)
- Submit → trang kết quả: tổng điểm + phân tích từng phần
```

---

## ═══════════════════════════════════
## NHÓM H: MỤC 6 — BỘ THỦ
## ═══════════════════════════════════

### [H1] Trang bộ thủ
```
Tạo app/bo-thu/page.tsx

Header: "Bộ thủ Hán tự" + "214 Bộ thủ · 63 Bài tập · 7 Chủ đề"

Showcase: 4 chữ Hán lớn (人水木火) animated

Filter tabs: Con người | Thiên nhiên | Động vật | Hành động | Phương hướng | Đồ vật | Biểu tượng

Grid các nhóm bộ thủ:
- Tên nhóm + mô tả
- Số bài tập
- Progress bar
- Nút "Bắt đầu"

app/bo-thu/[group]/page.tsx:
Grid các bộ thủ trong nhóm.
Mỗi card: Chữ Hán lớn + pinyin + nghĩa + ví dụ chữ chứa bộ thủ này + memory tip
Click card → xem chi tiết + bài tập nhận biết
```

---

## ═══════════════════════════════════
## NHÓM I: MỤC 7 — DỊCH
## ═══════════════════════════════════

### [I1] Trang dịch
```
Tạo app/dich/page.tsx — Client component

Layout 2 cột:
- Cột trái: Textarea nhập text (Trung hoặc Việt)
  Toggle ngôn ngữ: 🇨🇳 Trung ↔ 🇻🇳 Việt
  Nút 🔊 phát âm + nút 📋 copy
- Cột phải: Kết quả dịch
  Text dịch lớn
  Bảng từ điển: click từng chữ → nghĩa + ví dụ
  Nút "Thêm vào từ vựng của tôi"

API: POST /api/translate { text, from, to }
Dùng: MyMemory API (miễn phí) hoặc LibreTranslate
Fallback nếu không có API key: gọi Anthropic Claude API

Lịch sử dịch: lưu localStorage 20 câu gần nhất
```

---

## ═══════════════════════════════════
## NHÓM J: MỤC 8 — MẪU CÂU
## ═══════════════════════════════════

### [J1] Trang mẫu câu
```
Tạo app/mau-cau/page.tsx

Header: "Mẫu câu tiếng Trung" + filter theo chủ đề + HSK level

Mỗi mẫu câu card:
- Pattern: "Subject + 是 + Object" màu xanh lớn
- Nghĩa: "Chủ ngữ + là + Tân ngữ"
- Usage: giải thích khi dùng
- 3 ví dụ câu (zh + pinyin + vi)
- Nút "Luyện tập" → quiz điền từ theo pattern

Data từ bảng sentence_patterns
```

---

## ═══════════════════════════════════
## NHÓM K: MỤC 9 — LUYỆN VIẾT
## ═══════════════════════════════════

### [K1] Trang luyện viết chữ Hán
```
Tạe app/luyen-viet/page.tsx và app/luyen-viet/[hanzi]/page.tsx

Trang danh sách: grid chữ Hán cần luyện viết, filter theo HSK level

Trang luyện viết 1 chữ:
- Chữ mờ làm nền hướng dẫn
- Canvas vẽ với cảm ứng/chuột
- Hiển thị thứ tự nét (stroke order animation) bằng SVG path
- Đếm số nét: đúng=xanh, sai=đỏ
- Nút: Xóa | Xem mẫu (animation) | Kiểm tra
- Sau kiểm tra: AI/heuristic score 0-100 + nhận xét

Dùng thư viện hanzi-writer (npm install hanzi-writer) để:
- Hiển thị animation stroke order
- Gợi ý nét tiếp theo
```

---

## ═══════════════════════════════════
## NHÓM L: MỤC 10 — LƯỢNG TỪ
## ═══════════════════════════════════

### [L1] Trang lượng từ
```
Tạo app/luong-tu/page.tsx

Header: "Lượng từ tiếng Trung" + mô tả

Filter theo nhóm: Người & vật | Đồ dùng | Thực phẩm | Thời gian | Địa điểm | Khác

Mỗi lượng từ card:
- Chữ Hán lớn (本/个/张/条...) + Pinyin
- Nghĩa: "dùng cho sách vở, tài liệu dạng tờ"
- 3-4 ví dụ: 一本书/两本杂志/三本词典
- Nút 🔊 nghe phát âm
- Nút "Luyện tập" → quiz ghép đúng lượng từ với danh từ

Data từ bảng measure_words
```

---

## ═══════════════════════════════════
## NHÓM M: MỤC 11 — LUYỆN ĐỀ THPT
## ═══════════════════════════════════

### [M1] Trang luyện đề THPT
```
Tạo app/luyen-de-thpt/page.tsx

Header: "Luyện đề thi THPT Tiếng Trung" + badge "Mới"

Danh sách đề: năm + loại đề + số câu + thời gian

app/luyen-de-thpt/[examId]/page.tsx:
Giao diện thi 60 phút:
- Đồng hồ đếm ngược
- 50 câu hỏi dạng trắc nghiệm
- Submit → kết quả theo từng phần (Phần 1: Nghe / Phần 2: Đọc / Phần 3: Viết)
- Phân tích điểm: điểm qua/không qua + gợi ý ôn tập

Data từ bảng exams WHERE type='thpt'
```

---

## ═══════════════════════════════════
## NHÓM N: DASHBOARD & THANH TOÁN
## ═══════════════════════════════════

### [N1] Dashboard
```
Tạo app/dashboard/page.tsx — Server component, require auth

Lấy từ Supabase:
- user_streaks, user_progress, user_vocabulary

Layout:
- Greeting + streak fire 🔥
- 4 stat cards: Streak | Từ đã học | Bài hoàn thành | % chính xác
- Calendar heatmap 30 ngày (ô màu xanh = có học)
- "Bài hôm nay": 3 gợi ý (bài tiếp theo + bài cần ôn)
- "Từ cần ôn": danh sách SRS due today → nút "Ôn ngay"
- Progress 11 mục (progress bar % hoàn thành từng mục)
- Bảng xếp hạng tuần: top 5
```

### [N2] Trang nâng cấp + Paywall
```
Tạo app/nang-cap/page.tsx

UPGRADE BANNER COMPONENT (dùng nhiều nơi):
- Nền xanh gradient đậm
- Icon 👑 vàng to
- "Nâng cấp tài khoản"
- "Bạn cần nâng cấp để truy cập nội dung này"
- List: ∞ Truy cập không giới hạn | 🤖 AI tutor | 📈 Theo dõi tiến độ
- Nút "👑 Nâng cấp ngay" trắng lớn  
- "Chỉ từ 99.000đ/tháng"

TRANG PRICING:
Toggle Tháng/Năm

MIỄN PHÍ: 0₫ | 3 bài/mục free | Flashcard | Trắc nghiệm cơ bản
PRO (highlight đỏ "Phổ biến"): 99k/tháng hoặc 69k/tháng(năm) | Tất cả bài | 8 bài tập/bài | SRS | AI TTS
PRO+LIVE: 199k/tháng | Tất cả Pro + Live class 2 buổi/tuần + Giáo viên bản ngữ

Tích hợp PayOS: POST /api/payment/create → redirect PayOS URL
```

### [N3] API Routes cần thiết
```
Tạo các API routes sau:

1. app/api/progress/update/route.ts
POST { userId, contentType, contentId, score, status }
→ UPSERT vào user_progress
→ Cập nhật user_streaks (streak + XP)
→ Return { success: true }

2. app/api/vocabulary/[id]/rate/route.ts  
PATCH { userId, rating: 'hard'|'ok'|'easy' }
→ Tính SRS mới dùng lib/srs.ts
→ UPSERT vào user_vocabulary
→ Return { nextReview, interval }

3. app/api/tts/route.ts
POST { text: string }
→ Nếu có GOOGLE_TTS_KEY: gọi Google TTS API
→ Không có key: return { provider: 'browser', text }
Client fallback: window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))

4. app/api/payment/create/route.ts
POST { plan, cycle }
→ Tính amount (pro-monthly=99000, pro-yearly=828000, live-monthly=199000)
→ Gọi PayOS createPaymentLink
→ Return { paymentUrl }

5. app/api/payment/webhook/route.ts
POST (từ PayOS)
→ Verify checksum
→ Update subscriptions table
→ Return 200
```

---

## ═══════════════════════════════════
## NHÓM O: IMPORT DATA
## ═══════════════════════════════════

### [O1] Script import tất cả data
```
Tạo file scripts/import-all.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY  // Service key (không phải anon key)
)

async function importData(table, file, clearWhere = null) {
  const data = require(`../data/${file}`)
  if (clearWhere) await supabase.from(table).delete().match(clearWhere)
  for (let i = 0; i < data.length; i += 50) {
    const { error } = await supabase.from(table).insert(data.slice(i, i+50))
    if (error) console.error(`Error ${table} batch ${i}:`, error.message)
  }
  console.log(`✅ ${table}: ${data.length} records`)
}

async function main() {
  await importData('vocabulary', 'hsk1-vocabulary.json', { hsk_level: 1 })
  await importData('vocabulary', 'hsk2-vocabulary.json', { hsk_level: 2 })
  await importData('topics', 'topics.json')
  await importData('vocabulary', 'topic-vocabulary.json', { topic: 'nghe-nghiep' })
  await importData('conversations', 'conversations.json')
  await importData('readings', 'readings.json')
  await importData('radicals', 'radicals.json')
  await importData('sentence_patterns', 'sentence-patterns.json')
  await importData('measure_words', 'measure-words.json')
  await importData('exams', 'exams.json')
  console.log('🎉 Import hoàn tất!')
}

main().catch(console.error)

Chạy: node scripts/import-all.js
```

---

## ═══════════════════════════════════
## NHÓM P: SỬA LỖI THƯỜNG GẶP
## ═══════════════════════════════════

### [P1] Lỗi TypeScript
```
File này báo lỗi TypeScript: [paste lỗi]
Fix lỗi type, không thay đổi logic.
```

### [P2] Lỗi Supabase không load data
```
Trang này không hiển thị data từ Supabase.
Kiểm tra: kết nối client, query đúng table/column, RLS policy, console.log debug.
```

### [P3] Responsive mobile
```
Fix responsive cho [component] trên mobile 375px. Dùng Tailwind sm: md: lg: breakpoints.
```

### [P4] Thêm loading skeleton
```
Thêm loading skeleton (Suspense + loading.tsx) cho trang [tên trang].
Dùng animate-pulse, bg-gray-200 placeholder.
```

---
*Thứ tự: A1→A2→A3→B1→B2→C1→C2→C3→C4→C5→D1→E1→F1→G1→H1→I1→J1→K1→L1→M1→N1→N2→N3→O1*
*Sau O1: chạy node scripts/import-all.js để nạp toàn bộ data*
