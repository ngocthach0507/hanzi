-- Chạy lệnh này trong Supabase SQL Editor để sửa lỗi lưu tiến độ học tập
-- Địa chỉ: https://supabase.com/dashboard/project/_/sql

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_own_progress_select" ON user_progress;
CREATE POLICY "users_own_progress_select" ON user_progress
  FOR SELECT USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "users_own_progress_insert" ON user_progress;
CREATE POLICY "users_own_progress_insert" ON user_progress
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "users_own_progress_update" ON user_progress;
CREATE POLICY "users_own_progress_update" ON user_progress
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Kiểm tra xem bảng đã có RLS chưa
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'user_progress';
