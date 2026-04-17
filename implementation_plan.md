# Implementation Plan — Nâng cấp module Đọc hiểu HSK

## Mục tiêu
- Chuyển nội dung bài đọc HSK từ các câu rời rạc sang các đoạn văn ngắn, câu chuyện tự nhiên.
- Đảm bảo mỗi dòng có trường `py` (Pinyin) đầy đủ.
- Đồng bộ dữ liệu mới lên Supabase qua script `scripts/upsert_readings.js`.

## Phạm vi
- `data/readings-hsk1.json`
- `data/readings-hsk2.json`
- `scripts/upsert_readings.js`

## Bước thực hiện
1. Kiểm tra dữ liệu hiện tại của `readings-hsk1.json` và `readings-hsk2.json`.
2. Viết lại `content` cho mỗi bài đọc theo hướng câu chuyện/đoạn văn, vẫn giữ nguyên ngữ cảnh HSK tương ứng.
3. Bổ sung trường `py` cho tất cả các dòng nếu còn thiếu.
4. Cập nhật `questions` và `vocabulary` để phù hợp với nội dung mới.
5. Chạy script `node scripts/upsert_readings.js` để đẩy nội dung vào Supabase.
6. Kiểm tra frontend:
   - `/doc-hieu/[level]/[id]`
   - Hiển thị Ruby pinyin
   - Toggle bản dịch tiếng Việt

## Ghi chú quan trọng
- Tập tin `data/readings-hsk1.json` hiện tại chứa phần bị hỏng/gián đoạn ở giữa file. Cần sửa lại file này trước khi chạy import cho HSK1.
- `data/readings-hsk2.json` đã được kiểm tra và hợp lệ.

## Lệnh kiểm tra
- `npm run upsert-readings`

## Kết quả mong đợi
- Dữ liệu của HSK2 (và HSK1 nếu file được sửa) được lưu vào Supabase.
- Trang đọc hiểu hiển thị nội dung mới với pinyin và bản dịch đúng.
