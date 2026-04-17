# 🚀 HANZI.IO.VN - BIÊN BẢN BÀN GIAO CÔNG VIỆC (HANDOVER)

**Ngày cập nhật:** 15/04/2026
**Trạng thái dự án:** Đã hoàn thiện toàn bộ dữ liệu HSK 1 & 2, triển khai module Văn hóa cao cấp.

---

## 📌 1. TỔNG QUAN BỐI CẢNH (CONTEXT)
- **Mục tiêu:** Xây dựng nền tảng học tiếng Trung "all-in-one" với trải nghiệm Wow factor. Giao diện cực kỳ hiện đại, sử dụng 3D Illustrations và các hiệu ứng chuyển cảnh mượt mà.
- **Ngôn ngữ:** Giao diện và nội dung học tập **100% Tiếng Việt**.
- **Tech Stack:** Next.js (App Router), Supabase, Clerk Auth, Tailwind CSS, Web Speech API (TTS).

---

## ✅ 2. CÔNG VIỆC ĐÃ HOÀN THÀNH (LATEST UPDATES - 15/04)
### a. Số hóa & Địa phương hóa (Localization)
- **HSK 1 & 2:** Đã bản địa hóa 100% nội dung (Tiêu đề bài học, ngữ cảnh, lời thoại hội thoại). Không còn nội dung tiếng Anh trong các lesson.
- **Database Sync:** Đã nạp 45 đoạn hội thoại HSK 2 vào bảng `texts`.
- **Sửa lỗi:** Fix lỗi ReferenceError trong logic fetch dữ liệu giúp trang lesson load ổn định hơn.

### b. Module Văn hóa (Culture Module) - **MỚI**
- **Dữ liệu:** Đã biên soạn nội dung văn hóa cho **30 bài học** (HSK 1 & 2).
- **Hình ảnh:** Đã tạo **16 hình ảnh 3D minh họa cao cấp** (15 bài HSK 1 + Bài 1 HSK 2). Các bài còn lại của HSK 2 đang dùng placeholder (do giới hạn quota AI).
- **UI:** Tab Văn hóa thiết kế theo phong cách tạp chí, có Hero image và nội dung trình bày chuyên nghiệp.

### c. Trình phát Nghe (Listening Player) - **MỚI**
- **Tính năng:** Tự động phát âm thanh theo từng dòng, làm nổi bật (highlight) dòng đang đọc, và **tự động cuộn (auto-scroll)** để dòng đang học luôn ở chính giữa màn hình.
- **Công nghệ:** Sử dụng Web Speech API kết hợp với logic đệ quy để đồng bộ âm thanh và chữ.

### d. Hội thoại Tương tác (Conversation Practice)
- **Tính năng:** Cho phép chọn vai (A hoặc B) để luyện nói. Tích hợp ngay trong tab bài học, không cần chuyển trang.

---

## 🛠️ 3. LƯU Ý KỸ THUẬT (CRITICAL NOTES)
- **Database Mới:**
    - Bảng `culture_notes`: Lưu tiêu đề, nội dung văn hóa và đường dẫn ảnh minh họa (`image_path`).
    - Bảng `texts`: Cột `content` lưu JSON string chứa các dòng hội thoại (speaker, zh, py, vi).
- **Logic Fetch:** Hàm `fetchAllData` trong `page.tsx` sử dụng `Promise.all` và `maybeSingle()` để tối ưu tốc độ và tránh lỗi crash khi thiếu metadata.
- **Image Assets:** Toàn bộ ảnh 3D được lưu tại thư mục gốc của project (as public assets).

---

## 📝 4. VIỆC CẦN LÀM TIẾP THEO (NEXT STEPS)
1. **HSK 3 Localization:** Bắt đầu nạp và dịch dữ liệu cho HSK 3 (hiện tại mới xong 1 & 2).
2. **Hình ảnh HSK 2:** Bổ sung 14 ảnh minh họa còn lại cho HSK 2 khi hạn mức AI được reset.
3. **Module Bài tập (Quiz/Writing):** Hiện tại tab Luyện nghe và Viết cho từng bài đang ở dạng placeholder "Bắt đầu ngay" trỏ về các sub-route. Cần hoàn thiện logic chấm điểm cho các trang này.
4. **Tích hợp Audio thực:** Cân nhắc chuyển từ TTS (Web Speech) sang file âm thanh gốc (`audio_ref` trong DB) nếu có dữ liệu.

---

## 💡 5. PHONG CÁCH LÀM VIỆC (WORKING STYLE)
- **Thẩm mỹ:** Ưu tiên bo góc cực lớn (`rounded-[3rem]`), bóng đổ mềm (`shadow-sm` đến `shadow-2xl`), và các micro-interaction (`animate-in`).
- **Nội dung:** Văn phong tiếng Việt cần thân thiện, chuyên nghiệp nhưng gần gũi ( Xiaoyu AI Coach).

---
**Ghi chú cho Agent tiếp theo:** 
Dự án đã có khung frontend rất mạnh. Hãy tập trung vào việc **làm giàu dữ liệu HSK 3** và **hoàn thiện các con số trong Dashboard** để người dùng thấy được tiến độ học tập. Đọc `walkthrough.md` để xem các bản ghi màn hình/ảnh chụp các tính năng mới nhất.
