-- ═══════════════════════════════════════════════════════════════
-- DATABASE: hanzi.io.vn — HSK Vocabulary Full Schema + Seed
-- Source: 新HSK教程 1, 2, 3 (New HSK Course 1/2/3)
-- Publisher: 外语教学与研究出版社 (FLTRP), 2026
-- Extracted by: image analysis of scanned PDFs
-- ═══════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────
-- TABLE 1: books
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS books (
  id            SERIAL PRIMARY KEY,
  level         INTEGER NOT NULL UNIQUE,
  title_zh      TEXT NOT NULL,
  title_vi      TEXT NOT NULL,
  title_en      TEXT,
  total_lessons INTEGER,
  total_words   INTEGER,
  total_grammar INTEGER,
  hours_min     INTEGER,
  hours_max     INTEGER,
  color_hex     TEXT DEFAULT '#E53E3E'
);

INSERT INTO books (level,title_zh,title_vi,title_en,total_lessons,total_words,total_grammar,hours_min,hours_max,color_hex)
VALUES
(1,'新HSK教程1','Tân HSK Giáo Trình 1','New HSK Course 1',15,196,40,30,36,'#E53E3E'),
(2,'新HSK教程2','Tân HSK Giáo Trình 2','New HSK Course 2',15,213,45,30,45,'#DD6B20'),
(3,'新HSK教程3','Tân HSK Giáo Trình 3','New HSK Course 3',18,283,63,54,72,'#D69E2E')
ON CONFLICT (level) DO NOTHING;

-- ──────────────────────────────────────────────
-- TABLE 2: lessons
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lessons (
  id            SERIAL PRIMARY KEY,
  book_level    INTEGER NOT NULL,
  lesson_number INTEGER NOT NULL,
  title_zh      TEXT NOT NULL,
  title_en      TEXT,
  word_count    INTEGER,
  is_free       BOOLEAN DEFAULT FALSE,
  UNIQUE (book_level, lesson_number)
);

-- HSK 1 (bài 1-3 miễn phí)
INSERT INTO lessons (book_level,lesson_number,title_zh,title_en,word_count,is_free) VALUES
(1,1,'AI小语，你好！','Hello, AI Xiaoyu!',12,TRUE),
(1,2,'我叫李文','My name is Li Wen',15,TRUE),
(1,3,'我是中国人','I''m Chinese',18,TRUE),
(1,4,'我有两个孩子','I have two children',13,FALSE),
(1,5,'今天我休息','I''m off today',22,FALSE),
(1,6,'你的手机号是多少？','What''s your phone number?',22,FALSE),
(1,7,'我晚上六点半下班','I''ll finish work at 6:30 in the evening',27,FALSE),
(1,8,'我爸爸也在医院工作','My father also works at a hospital',23,FALSE),
(1,9,'我明天上午在学校学习','I''ll be studying at school tomorrow morning',23,FALSE),
(1,10,'这儿的苹果真便宜！','The apples here are really affordable!',23,FALSE),
(1,11,'我读大学呢','I''m studying at university',25,FALSE),
(1,12,'昨天下雪了','It snowed yesterday',24,FALSE),
(1,13,'请给我一杯茶','I''ll have a cup of tea, please',20,FALSE),
(1,14,'我看了一个电影','I watched a movie',26,FALSE),
(1,15,'大兴机场见！','See you at Daxing Airport!',17,FALSE)
ON CONFLICT (book_level,lesson_number) DO NOTHING;

-- HSK 2
INSERT INTO lessons (book_level,lesson_number,title_zh,title_en,word_count,is_free) VALUES
(2,1,'她请我们吃了北京烤鸭','She treated us to Peking Duck',10,TRUE),
(2,2,'还是打车去北大吧','Let''s take a taxi to Peking University instead',13,TRUE),
(2,3,'我想去西安旅游','I want to visit Xi''an',14,TRUE),
(2,4,'你穿红色的很好看','You look pretty good in red',14,FALSE),
(2,5,'第一次去中国朋友家','Visiting a Chinese friend''s home for the first time',14,FALSE),
(2,6,'小雪，生日快乐！','Happy birthday, Xiaoxue!',14,FALSE),
(2,7,'他篮球打得很好','He plays basketball very well',14,FALSE),
(2,8,'虽然你忘了，但是我记得','Even though you forgot, I remembered',14,FALSE),
(2,9,'我去买杯奶茶','I''m going to buy a cup of bubble tea',14,FALSE),
(2,10,'就要考试了','The exam is coming',14,FALSE),
(2,11,'我最喜欢吃中国菜','I like Chinese food the most',14,FALSE),
(2,12,'这里比北京冷多了','It''s much colder here than in Beijing',14,FALSE),
(2,13,'我们爱上中文课','We love attending Chinese class',14,FALSE),
(2,14,'一个人过年多没意思啊','It''s boring to celebrate the Spring Festival alone',14,FALSE),
(2,15,'我想再去一次中国','I want to go to China again',15,FALSE)
ON CONFLICT (book_level,lesson_number) DO NOTHING;

-- HSK 3
INSERT INTO lessons (book_level,lesson_number,title_zh,title_en,word_count,is_free) VALUES
(3,1,'我们去机场接你们','We will pick you up at the airport',16,TRUE),
(3,2,'你们想吃什么就点什么','You can order whatever you feel like',18,TRUE),
(3,3,'这个小区挺好的','This neighborhood is pretty nice',16,TRUE),
(3,4,'这家宾馆跟别的都不一样','This hotel is unlike any other',16,FALSE),
(3,5,'这样的照片才好看','Photos like these are the best',16,FALSE),
(3,6,'高铁上还可以点外卖','You can even order takeout on a high-speed train',16,FALSE),
(3,7,'那条裙子比短裤还好看','That skirt looks better than the shorts',16,FALSE),
(3,8,'今天我出院了','Today I was discharged from the hospital',16,FALSE),
(3,9,'打不好没关系','It doesn''t matter if you don''t play well',14,FALSE),
(3,10,'你明天再把书还给我','You can return the book to me tomorrow',16,FALSE),
(3,11,'看来我没办法解决这个问题','It seems I can''t solve this problem',16,FALSE),
(3,12,'这个季节天气变化很快','The weather changes rapidly in this season',16,FALSE),
(3,13,'我的新邻居来自英国','My new neighbors come from the UK',16,FALSE),
(3,14,'这本书被别人借走了','This book is checked out',16,FALSE),
(3,15,'我是半个南京人','I am basically half a Nanjing local',16,FALSE),
(3,16,'我听说有的熊猫出国了','I heard that some pandas have gone abroad',14,FALSE),
(3,17,'我要多向认真的人学习','I will learn from people who are careful',16,FALSE),
(3,18,'我学会了包饺子','I''ve learned how to make jiaozi',16,FALSE)
ON CONFLICT (book_level,lesson_number) DO NOTHING;

-- ──────────────────────────────────────────────
-- TABLE 3: vocabulary
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vocabulary (
  id              SERIAL PRIMARY KEY,
  book_level      INTEGER NOT NULL,
  lesson_number   INTEGER NOT NULL,
  word_number     INTEGER NOT NULL,
  hanzi           TEXT NOT NULL,
  pinyin          TEXT NOT NULL,
  part_of_speech  TEXT,
  meaning_en      TEXT,
  meaning_vi      TEXT,
  hsk_level       INTEGER,
  topic           TEXT,
  example_zh      TEXT,
  example_pinyin  TEXT,
  example_vi      TEXT,
  audio_url       TEXT,
  UNIQUE (book_level, lesson_number, word_number)
);

-- NOTE: Full vocabulary data is in JSON files:
--   hsk1_vocabulary.json  (15 lessons, 196 words + detailed data)
--   hsk2_vocabulary.json  (15 lessons, 213 words)
--   hsk3_vocabulary.json  (18 lessons, 283 words)
--
-- Import via: node scripts/import-vocab.js
-- Or use Supabase CSV import

-- ──────────────────────────────────────────────
-- TABLE 4: grammar_points
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS grammar_points (
  id            SERIAL PRIMARY KEY,
  book_level    INTEGER NOT NULL,
  lesson_number INTEGER NOT NULL,
  point_number  INTEGER NOT NULL,
  title_zh      TEXT NOT NULL,
  title_en      TEXT,
  formula       TEXT,
  explanation_vi TEXT,
  examples      JSONB,
  UNIQUE (book_level, lesson_number, point_number)
);

-- ──────────────────────────────────────────────
-- TABLE 5: user data (progress / SRS)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_progress (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       TEXT NOT NULL,
  book_level    INTEGER,
  lesson_number INTEGER,
  content_type  TEXT DEFAULT 'lesson',
  status        TEXT DEFAULT 'not_started',
  score         INTEGER DEFAULT 0,
  completed_at  TIMESTAMPTZ,
  UNIQUE (user_id, book_level, lesson_number, content_type)
);

CREATE TABLE IF NOT EXISTS user_vocabulary (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       TEXT NOT NULL,
  vocab_id      INTEGER REFERENCES vocabulary(id),
  ease_factor   FLOAT DEFAULT 2.5,
  interval_days INTEGER DEFAULT 1,
  repetitions   INTEGER DEFAULT 0,
  next_review   DATE DEFAULT CURRENT_DATE,
  last_rating   TEXT,
  UNIQUE (user_id, vocab_id)
);

CREATE TABLE IF NOT EXISTS user_streaks (
  user_id       TEXT PRIMARY KEY,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active   DATE,
  total_xp      INTEGER DEFAULT 0,
  total_words   INTEGER DEFAULT 0
);

-- ──────────────────────────────────────────────
-- INDEXES
-- ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_vocab_level_lesson ON vocabulary(book_level, lesson_number);
CREATE INDEX IF NOT EXISTS idx_vocab_hanzi ON vocabulary(hanzi);
CREATE INDEX IF NOT EXISTS idx_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_uservocab_review ON user_vocabulary(user_id, next_review);

-- ──────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ──────────────────────────────────────────────
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "public_read_books" ON books FOR SELECT USING (TRUE);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "public_read_lessons" ON lessons FOR SELECT USING (TRUE);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "public_read_vocab" ON vocabulary FOR SELECT USING (TRUE);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "user_own_progress" ON user_progress USING (user_id = auth.jwt()->>'sub');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "user_own_vocab" ON user_vocabulary USING (user_id = auth.jwt()->>'sub');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "user_own_streak" ON user_streaks USING (user_id = auth.jwt()->>'sub');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
