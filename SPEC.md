# HanziPro – Tài liệu Spec Đầy Đủ cho Developer / AI Agent
> Phiên bản: 1.0 | Ngày: 2025

---

## 1. TỔNG QUAN DỰ ÁN

**HanziPro** là nền tảng học tiếng Trung trực tuyến có thu phí dành cho người Việt Nam.  
Mô hình kinh doanh: Freemium + Subscription (tháng/năm) + Live Class

### Stack đề xuất
| Lớp | Công nghệ gợi ý |
|-----|-----------------|
| Frontend | Next.js 14 (App Router) + TailwindCSS |
| Backend  | Node.js + Express hoặc Next.js API Routes |
| Database | PostgreSQL (user data) + Redis (session/cache) |
| Auth     | NextAuth.js (Google, Facebook, Email OTP) |
| Payment  | Stripe (thẻ QT) + PayOS (VNPay/Momo/ZaloPay) |
| Storage  | AWS S3 hoặc Cloudflare R2 (audio, video, ảnh) |
| AI       | OpenAI Whisper (speech recognition) + GPT-4o (AI tutor) |
| Video    | Mux hoặc Cloudflare Stream |
| Email    | Resend hoặc SendGrid |
| Hosting  | Vercel (FE) + Railway/Render (BE) |

---

## 2. CẤU TRÚC FILE DỰ ÁN

```
hanzipro/
├── index.html              ← Landing page (đã có)
├── css/
│   └── style.css           ← Stylesheet chính (đã có)
├── js/
│   └── main.js             ← JavaScript chính (đã có)
├── pages/                  ← Các trang cần tạo thêm
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── lesson.html
│   ├── vocabulary.html
│   ├── progress.html
│   ├── settings.html
│   └── blog.html
└── assets/
    ├── icons/
    ├── images/
    └── audio/
```

---

## 3. CÁC TRANG CẦN XÂY DỰNG

### 3.1 Trang Đăng ký / Đăng nhập (`register.html`, `login.html`)
- Form email + mật khẩu
- Đăng ký qua Google / Facebook
- Gửi OTP xác nhận email
- Sau đăng ký: chuyển đến bài kiểm tra đầu vào

### 3.2 Bài kiểm tra đầu vào (`test.html`)
- 20 câu trắc nghiệm (Pinyin, từ vựng, ngữ pháp)
- Thời gian: 10 phút
- Kết quả → phân loại cấp độ tự động → tạo lộ trình

### 3.3 Dashboard (`dashboard.html`)
Cần hiển thị:
- Streak hàng ngày + huy hiệu
- Bài học hôm nay (do AI tạo ra)
- Tiến độ lộ trình (% hoàn thành)
- Từ cần ôn tập hôm nay (SRS)
- Bảng xếp hạng tuần
- Thống kê: từ đã học, giờ học, độ chính xác

### 3.4 Trang bài học (`lesson.html`)
Cấu trúc một bài học (khoảng 15–20 phút):
1. Giới thiệu từ mới (flashcard, 5–10 từ)
2. Nghe và lặp lại (audio + nhận diện giọng nói)
3. Trắc nghiệm (8–10 câu)
4. Luyện viết (2–3 chữ Hán)
5. Hội thoại mẫu (đọc + dịch)
6. Tổng kết + điểm XP

### 3.5 Kho từ vựng (`vocabulary.html`)
- Danh sách tất cả từ đã học
- Filter: cấp độ HSK, chủ đề, trạng thái (thành thạo/đang học/cần ôn)
- Tạo bộ flashcard tùy chỉnh
- Export sang Anki

### 3.6 Tiến độ (`progress.html`)
- Biểu đồ học tập (Chart.js): từ/tuần, độ chính xác
- Streak calendar (GitHub-style heatmap)
- Lịch sử bài học
- Dự đoán ngày đạt mục tiêu

### 3.7 Live Class
- Lịch các buổi học (calendar)
- Đăng ký chỗ (tối đa 6 người/buổi)
- Video call (tích hợp Daily.co hoặc Zoom SDK)
- Ghi chú sau buổi học

---

## 4. DATABASE SCHEMA (PostgreSQL)

```sql
-- Users
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  name        TEXT,
  avatar_url  TEXT,
  level       TEXT DEFAULT 'beginner', -- beginner | elementary | intermediate | advanced
  hsk_target  INTEGER DEFAULT 2,
  streak      INTEGER DEFAULT 0,
  last_active DATE,
  plan        TEXT DEFAULT 'free', -- free | pro | live
  plan_expires_at TIMESTAMP,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Lessons
CREATE TABLE lessons (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE,
  level       TEXT, -- hsk1 | hsk2 | ... | hsk6 | business
  order_num   INTEGER,
  duration_min INTEGER,
  xp_reward   INTEGER DEFAULT 10,
  content     JSONB, -- structured lesson content
  created_at  TIMESTAMP DEFAULT NOW()
);

-- User progress
CREATE TABLE user_lessons (
  user_id     UUID REFERENCES users(id),
  lesson_id   UUID REFERENCES lessons(id),
  completed   BOOLEAN DEFAULT FALSE,
  score       INTEGER, -- 0-100
  completed_at TIMESTAMP,
  PRIMARY KEY (user_id, lesson_id)
);

-- Vocabulary (master list)
CREATE TABLE vocabulary (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hanzi       TEXT NOT NULL,
  pinyin      TEXT NOT NULL,
  meaning_vi  TEXT NOT NULL,
  hsk_level   INTEGER, -- 1-6
  topic       TEXT, -- family | food | work | ...
  audio_url   TEXT,
  example_zh  TEXT,
  example_vi  TEXT
);

-- User vocabulary (SRS data)
CREATE TABLE user_vocabulary (
  user_id     UUID REFERENCES users(id),
  vocab_id    UUID REFERENCES vocabulary(id),
  ease_factor FLOAT DEFAULT 2.5,
  interval    INTEGER DEFAULT 1, -- days
  repetitions INTEGER DEFAULT 0,
  due_date    DATE DEFAULT CURRENT_DATE,
  mastery     TEXT DEFAULT 'new', -- new | learning | review | mastered
  PRIMARY KEY (user_id, vocab_id)
);

-- Subscriptions
CREATE TABLE subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  plan            TEXT, -- pro | live
  billing_cycle   TEXT, -- monthly | yearly
  amount          INTEGER, -- VND cents
  payment_method  TEXT, -- stripe | payos
  payment_ref     TEXT,
  started_at      TIMESTAMP DEFAULT NOW(),
  expires_at      TIMESTAMP,
  status          TEXT DEFAULT 'active' -- active | cancelled | expired
);

-- Live classes
CREATE TABLE live_classes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id  UUID REFERENCES users(id),
  title       TEXT,
  level       TEXT,
  max_students INTEGER DEFAULT 6,
  scheduled_at TIMESTAMP,
  duration_min INTEGER DEFAULT 60,
  meeting_url TEXT,
  status      TEXT DEFAULT 'scheduled' -- scheduled | live | completed | cancelled
);

CREATE TABLE live_class_enrollments (
  class_id    UUID REFERENCES live_classes(id),
  user_id     UUID REFERENCES users(id),
  enrolled_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (class_id, user_id)
);

-- Daily streaks
CREATE TABLE daily_activities (
  user_id     UUID REFERENCES users(id),
  date        DATE NOT NULL,
  xp_earned   INTEGER DEFAULT 0,
  words_learned INTEGER DEFAULT 0,
  lessons_done  INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, date)
);
```

---

## 5. API ENDPOINTS

### Auth
```
POST /api/auth/register       { email, password, name }
POST /api/auth/login          { email, password }
POST /api/auth/google         { token }
POST /api/auth/otp/send       { email }
POST /api/auth/otp/verify     { email, otp }
POST /api/auth/logout
GET  /api/auth/me
```

### Lessons
```
GET  /api/lessons             ?level=hsk2&page=1
GET  /api/lessons/:id
GET  /api/lessons/today       → AI-generated daily lessons for user
POST /api/lessons/:id/start
POST /api/lessons/:id/complete  { score, answers }
```

### Vocabulary / SRS
```
GET  /api/vocab/due           → words due for review today (SRS)
GET  /api/vocab/search        ?q=家&level=hsk1
POST /api/vocab/:id/rate      { rating: 'hard'|'ok'|'easy' }  → updates SRS
GET  /api/vocab/stats         → mastery breakdown
```

### Speech Recognition
```
POST /api/speech/evaluate     multipart: { audio: blob, target_text: string }
Response: { score: 85, tones: [...], feedback: string }
```

### Progress
```
GET  /api/progress            → overall stats
GET  /api/progress/streak     → streak data
GET  /api/progress/heatmap    ?year=2025
GET  /api/progress/leaderboard
```

### Payments
```
POST /api/payments/create     { plan, billing_cycle, method }
POST /api/payments/verify     { ref }  → webhook handler
GET  /api/payments/history
POST /api/payments/cancel
```

### Live Classes
```
GET  /api/classes             ?upcoming=true
GET  /api/classes/:id
POST /api/classes/:id/enroll
POST /api/classes/:id/cancel-enrollment
```

---

## 6. TÍNH NĂNG AI CẦN TÍCH HỢP

### 6.1 Speech Recognition & Scoring
```javascript
// Dùng OpenAI Whisper để transcribe âm thanh
// So sánh với target_text
// Dùng algorithm để score từng âm tiết và thanh điệu

const evaluatePronunciation = async (audioBlob, targetText) => {
  // 1. Upload audio → Whisper → transcript
  // 2. So sánh transcript vs targetText (Levenshtein distance)
  // 3. Tone detection (cần model riêng hoặc API bên thứ 3)
  // 4. Return score 0-100 + feedback
};
```

### 6.2 AI Lesson Generator
```
Dùng GPT-4o để:
- Phân tích lịch sử học của user
- Tạo bài tập cá nhân hóa
- Giải thích ngữ pháp
- Tạo câu ví dụ mới
```

### 6.3 SRS Algorithm (SM-2)
```javascript
function calculateNextReview(easeFactor, interval, repetitions, rating) {
  // rating: 0=fail, 1=hard, 2=ok, 3=easy
  if (rating < 1) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions++;
    easeFactor = Math.max(1.3, easeFactor + 0.1 - (3-rating)*(0.08+(3-rating)*0.02));
  }
  return { easeFactor, interval, repetitions, dueDate: addDays(new Date(), interval) };
}
```

---

## 7. GIAO DIỆN CẦN THIẾT KẾ THÊM

### Dashboard UI elements:
- Streak fire animation (CSS/Lottie)
- Progress ring (SVG)
- Leaderboard table với avatar
- Today's lesson card với CTA nổi bật

### Lesson UI:
- Flashcard với flip animation (CSS transform)
- Audio waveform visualizer khi luyện nói
- Canvas cho luyện viết chữ Hán (đã có base trong main.js)
- Multiple choice với feedback animation

### Mobile-first:
- Tất cả màn hình cần responsive tốt trên 375px+
- Hỗ trợ swipe gesture cho flashcard
- Bottom navigation bar trên mobile

---

## 8. CHIẾN LƯỢC CHUYỂN ĐỔI NGƯỜI DÙNG

### Funnel:
```
Trang chủ → Demo miễn phí → Đăng ký (email) → 7 ngày thử đầy đủ → Thanh toán
```

### Trigger email sau đăng ký:
- Ngày 1: Chào mừng + hướng dẫn bắt đầu
- Ngày 3: "Bạn đã học được X từ — tiến độ tốt!"
- Ngày 5: "Chỉ còn 2 ngày thử — nâng cấp để không mất tiến độ"
- Ngày 7: "Hết thời gian thử — ưu đãi 20% nếu đăng ký hôm nay"
- Ngày 10 (nếu chưa trả): "Chúng tôi lưu lộ trình của bạn — quay lại bất cứ lúc nào"

### Gamification giữ chân:
- Streak (mất streak = động lực đăng ký để bảo vệ streak)
- Bảng xếp hạng (social pressure)
- Huy hiệu thành tích
- XP và level

---

## 9. KIỂM SOÁT TRUY CẬP (FEATURE GATING)

| Tính năng | Free | Pro | Pro+Live |
|-----------|------|-----|----------|
| Bài học cơ bản HSK 1 | 5/ngày | Không giới hạn | Không giới hạn |
| Từ vựng HSK 1 (300 từ) | ✓ | ✓ | ✓ |
| Tất cả HSK 1–6 | ✗ | ✓ | ✓ |
| Luyện phát âm AI | ✗ | ✓ | ✓ |
| Lộ trình AI cá nhân | ✗ | ✓ | ✓ |
| Video tương tác | ✗ | ✓ | ✓ |
| Offline (app) | ✗ | ✓ | ✓ |
| Live class | ✗ | ✗ | ✓ |
| Luyện thi HSK | ✗ | ✓ | ✓ |
| Chứng chỉ | ✗ | ✗ | ✓ |

---

## 10. CHẠY LOCAL (FILE HTML TĨNH)

Không cần server để xem giao diện:
```bash
# Option 1: Python
cd hanzipro
python3 -m http.server 8080

# Option 2: Node.js
npx serve .

# Option 3: VS Code Live Server extension
# Mở index.html → click "Go Live"
```

Mở trình duyệt: http://localhost:8080

---

## 11. TODO LIST CHO DEVELOPER

### Phase 1 – MVP (4–6 tuần)
- [ ] Thiết lập Next.js project
- [ ] Auth (email + Google)
- [ ] Database + migration
- [ ] Bài học tĩnh (hardcode JSON, không cần CMS)
- [ ] Flashcard + Quiz UI
- [ ] Hệ thống SRS cơ bản
- [ ] Trang thanh toán (PayOS)
- [ ] Dashboard đơn giản

### Phase 2 – Growth (4–6 tuần tiếp)
- [ ] Luyện phát âm AI (Whisper)
- [ ] AI lộ trình cá nhân (GPT-4o)
- [ ] Bảng xếp hạng + streak
- [ ] Email automation
- [ ] App mobile (React Native hoặc Expo)

### Phase 3 – Scale
- [ ] Live class (Daily.co)
- [ ] Video học tập (Mux)
- [ ] Admin CMS để thêm bài học
- [ ] Analytics dashboard
- [ ] Affiliate program

---

*Tài liệu này đủ để giao cho developer/AI agent bắt đầu build.*
*File HTML/CSS/JS trong thư mục hanzipro/ là prototype đầy đủ có thể chạy ngay.*
