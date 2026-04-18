-- Tạo bảng lưu trữ các thanh toán chưa khớp mã
CREATE TABLE IF NOT EXISTS unmatched_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_ref TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  sepay_payload JSONB,
  status TEXT DEFAULT 'pending', -- pending, claimed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Thêm index để tìm kiếm nhanh
CREATE INDEX IF NOT EXISTS idx_unmatched_payment_ref ON unmatched_payments(payment_ref);
