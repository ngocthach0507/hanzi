# HANZI GLOBAL - Hướng dẫn thiết lập dự án Quốc tế (Clone từ Hanzi.io.vn)

Tài liệu này dành cho Agent hoặc Developer thực hiện việc chuyển đổi mã nguồn từ phiên bản Việt Nam sang phiên bản Quốc tế (Tiếng Anh).

## ⚠️ NGUYÊN TẮC VÀNG: KHÔNG XUNG ĐỘT DỮ LIỆU
Tuyệt đối KHÔNG sử dụng chung các tài khoản kết nối của phiên bản Việt Nam. Mọi dịch vụ phải được tạo mới hoàn toàn để đảm bảo dữ liệu học viên và bài viết không bị trộn lẫn.

---

## BƯỚC 1: CHUẨN BỊ MÃ NGUỒN (LOCAL)
1.  **Copy thư mục:** Sao chép toàn bộ thư mục dự án hiện tại sang một vị trí mới trên máy tính.
2.  **Làm sạch Git:** Xóa thư mục `.git` cũ để ngắt kết nối với Repository cũ.
3.  **Khởi tạo Git mới:**
    ```bash
    git init
    git add .
    git commit -m "initial: global version core from hanzi-vn"
    ```

## BƯỚC 2: THIẾT LẬP TÀI KHOẢN MỚI (ISOLATION)
Để web mới chạy độc lập, cần đăng ký/tạo mới các tài khoản sau:
1.  **Supabase:** Tạo Project mới (ví dụ: `hanzi-global-db`).
2.  **Clerk (Auth):** Tạo Application mới để quản lý người dùng quốc tế.
3.  **Netlify:** Tạo Site mới để Deploy từ Repo mới.

## BƯỚC 3: CẬP NHẬT BIẾN MÔI TRƯỜNG (.env)
Mở file `.env.local` và thay thế toàn bộ mã cũ bằng mã từ các tài khoản mới vừa tạo:
*   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...`
*   `CLERK_SECRET_KEY=...`
*   `NEXT_PUBLIC_SUPABASE_URL=...`
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`

## BƯỚC 4: DI CƯ DỮ LIỆU (DATABASE MIGRATION)
Agent cần hỗ trợ User chạy các lệnh SQL trong **SQL Editor** của Supabase mới để tạo lại cấu trúc bảng:
1.  Tạo bảng `profiles` (thông tin người dùng).
2.  Tạo bảng `blog_posts` (với các cột SEO đã cập nhật).
3.  Tạo các bảng dữ liệu học tập (Vocab, Grammar, Reading).

## BƯỚC 5: LỘ TRÌNH QUỐC TẾ HÓA (LOCALIZATION)
1.  **Dịch UI:** Tìm kiếm các chuỗi ký tự Tiếng Việt trong thư mục `components/` và `app/` để chuyển sang Tiếng Anh.
2.  **Dịch Dữ liệu:** Thực hiện dịch nội dung trong các file JSON hoặc trực tiếp trong Database (Nghĩa của từ, giải thích ngữ pháp).
3.  **Thanh toán:** Thay thế `PayOS` (Việt Nam) bằng `Stripe` hoặc `PayPal` để nhận thanh toán quốc tế.

---

## 🛠 GHI CHÚ CHO AGENT TIẾP THEO
*   Hãy bắt đầu bằng việc kiểm tra file `.env.local` xem đã được cập nhật mã mới chưa.
*   Ưu tiên triển khai thư viện `next-intl` nếu User muốn chạy cả 2 ngôn ngữ song song trên cùng một domain.
*   Luôn kiểm tra tính đúng đắn của đường dẫn (URL) vì web quốc tế có thể sử dụng cấu trúc `/en/...`.
