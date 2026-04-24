-- Migration: Tạo bảng leads cho Hanzi.io.vn
-- Chạy lệnh này trong Supabase Dashboard > SQL Editor

CREATE TABLE IF NOT EXISTS public.leads (
  id          BIGSERIAL PRIMARY KEY,
  email       TEXT NOT NULL UNIQUE,
  source      TEXT DEFAULT 'lesson_gate',
  hsk_level   INTEGER DEFAULT 1,
  current_lesson INTEGER DEFAULT 1,
  status      TEXT DEFAULT 'welcome_series',
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index để tìm kiếm nhanh theo email và updated_at
CREATE INDEX IF NOT EXISTS leads_email_idx ON public.leads(email);
CREATE INDEX IF NOT EXISTS leads_updated_at_idx ON public.leads(updated_at DESC);
CREATE INDEX IF NOT EXISTS leads_source_idx ON public.leads(source);

-- Tự động cập nhật updated_at khi có thay đổi
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at_trigger
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) - chỉ service key mới đọc được
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Policy cho service role (backend)
CREATE POLICY "Service role can do everything" ON public.leads
  FOR ALL USING (auth.role() = 'service_role');

-- Thêm vài dữ liệu mẫu để test MCP
INSERT INTO public.leads (email, source, hsk_level, status) VALUES
  ('test1@example.com', 'lesson_gate', 1, 'welcome_series'),
  ('test2@example.com', 'landing_page', 2, 'active'),
  ('test3@example.com', 'zalo', 1, 'welcome_series')
ON CONFLICT (email) DO NOTHING;
