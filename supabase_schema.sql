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
