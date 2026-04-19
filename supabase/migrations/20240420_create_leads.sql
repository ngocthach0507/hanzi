
-- Tạo bảng leads để lưu trữ khách hàng tiềm năng từ phễu Trial-First
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    source TEXT DEFAULT 'lesson_gate', -- Nguồn: landing, lesson_gate, ebook...
    status TEXT DEFAULT 'welcome_series', -- welcome_series, nurturing, paid, inactive
    current_lesson INT DEFAULT 1,
    hsk_level INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}' -- Lưu tên, tỉnh thành nếu có
);

-- Index để tìm kiếm nhanh
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Policy: Chỉ service role mới có quyền đọc ghi (bảo mật)
CREATE POLICY "Service role can do everything" ON public.leads
    FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');
