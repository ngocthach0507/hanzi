# 🚀 HƯỚNG DẪN XÂY DỰNG HANZI.IO.VN — TỪNG BƯỚC
## Dùng Cursor AI + Next.js (Không cần biết code)

---

## TỔNG QUAN

Bạn sẽ xây dựng một web học tiếng Trung giống HiHSK với:
- ✅ Từ vựng HSK 1–6 (có ảnh, audio, ví dụ câu)
- ✅ 8 loại bài tập mỗi bài
- ✅ Hệ thống đăng nhập / đăng ký
- ✅ Thu phí (freemium: 3 bài miễn phí, còn lại PRO)
- ✅ Dashboard theo dõi tiến độ
- ✅ Bảng xếp hạng, streak

**Thời gian:** 2–3 tuần
**Chi phí:** ~$20/tháng (Vercel Pro + database)

---

## BƯỚC 1: CÀI ĐẶT MÔI TRƯỜNG (30 phút)

### 1.1 Cài Node.js
- Vào https://nodejs.org → Tải bản LTS (nút màu xanh lá)
- Chạy file cài đặt, next-next-finish
- Kiểm tra: mở Terminal/CMD gõ `node --version` → phải ra số như v20.x.x

### 1.2 Cài Cursor AI (Editor thay thế VS Code có AI)
- Vào https://cursor.com → Download
- Cài đặt, mở lên, đăng nhập bằng Google
- Đây là nơi bạn sẽ ra lệnh bằng tiếng Việt để AI code

### 1.3 Tạo tài khoản các dịch vụ cần thiết
Tạo tài khoản (miễn phí) tại:
- [ ] https://github.com (lưu code)
- [ ] https://vercel.com (host web, miễn phí)
- [ ] https://supabase.com (database miễn phí 500MB)
- [ ] https://clerk.com (đăng nhập/đăng ký, miễn phí 10k users)

---

## BƯỚC 2: TẠO DỰ ÁN (15 phút)

### 2.1 Mở Cursor, mở Terminal trong Cursor (Ctrl+`)

Gõ lần lượt các lệnh sau:

```bash
npx create-next-app@latest hanzi-io-vn
```

Khi hỏi, chọn:
- TypeScript: **Yes**
- ESLint: **Yes**
- Tailwind CSS: **Yes**
- src/ directory: **No**
- App Router: **Yes**
- customize import alias: **No**

```bash
cd hanzi-io-vn
npm install @clerk/nextjs @supabase/supabase-js lucide-react
npm run dev
```

Mở trình duyệt vào http://localhost:3000 → thấy trang Next.js mặc định là OK.

---

## BƯỚC 3: CẤU HÌNH (1 tiếng)

### 3.1 Tạo file .env.local trong thư mục dự án
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx (lấy từ clerk.com)
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
```

### 3.2 Lấy keys từng dịch vụ

**Clerk (Auth):**
1. Vào clerk.com → Create application
2. Tên: hanzi.io.vn → Create
3. Chọn "Next.js" → Copy 2 keys vào .env.local

**Supabase (Database):**
1. Vào supabase.com → New project
2. Tên: hanzi-db, đặt mật khẩu mạnh, chọn Singapore
3. Settings → API → Copy URL và anon key vào .env.local

---

## BƯỚC 4: RA LỆNH CHO CURSOR AI TẠO DATABASE (30 phút)

Trong Cursor, nhấn **Ctrl+L** (mở chat AI), rồi paste lệnh sau:

```
Tạo schema database cho Supabase với các bảng sau:

1. vocabulary: id, hanzi, pinyin, meaning_vi, part_of_speech, hsk_level (1-6), lesson_number, example_zh, example_pinyin, example_vi, image_url, audio_url, order_in_lesson

2. lessons: id, level (1-6), lesson_number, title, word_count, is_free (boolean)

3. user_progress: id, user_id, lesson_id, status (not_started/learning/completed), score, completed_at

4. user_vocabulary: id, user_id, vocab_id, ease_factor, interval_days, next_review, repetitions, rating (hard/ok/easy)

5. user_streaks: id, user_id, current_streak, longest_streak, last_active_date

6. subscriptions: id, user_id, plan (free/pro), expires_at, payment_ref

Tạo file SQL để chạy trong Supabase SQL Editor.
```

Cursor sẽ tạo ra file SQL. Copy nội dung đó vào Supabase → SQL Editor → Run.

---

## BƯỚC 5: RA LỆNH CHO CURSOR TẠO GIAO DIỆN (2-3 ngày)

Dưới đây là các lệnh theo thứ tự, paste từng cái vào Cursor chat:

### LỆNH 1: Cấu trúc thư mục + Layout chính
```
Tạo layout chính cho web học tiếng Trung hanzi.io.vn với Next.js App Router và Tailwind CSS.

Yêu cầu:
- Navbar 2 hàng giống HiHSK:
  + Hàng trên: logo "hanzi.io.vn" (màu đỏ #D85A30), ô tìm kiếm, nút Google Play + App Store, Liên hệ, Đăng nhập, Đăng ký (xanh navy)
  + Hàng dưới: Trang chủ, GT hán ngữ, Luyện tập (dropdown: Luyện dịch/Sắp xếp câu/Sửa câu sai/Điền từ/Hỏi đáp), Từ vựng (dropdown: Từ vựng HSK 3.0/Từ vựng HSK/Từ vựng chủ đề/Mẫu câu), Hội thoại, Đọc hiểu, Bộ thủ, Luyện thi, Dịch, nút Nâng cấp (vàng gradient)
- Footer đầy đủ màu tối
- Responsive mobile với hamburger menu
- Dùng Clerk cho auth (đã cài)
- Màu chủ đạo: #D85A30 (đỏ cam), trắng, xanh navy
```

### LỆNH 2: Trang từ vựng HSK (danh sách bài)
```
Tạo trang /tu-vung/hsk1 liệt kê danh sách 50 bài học HSK 1.

Mỗi bài hiển thị:
- Số bài, tiêu đề "Bài X", số từ (10 từ)
- Trạng thái: Chưa học / Đang học / Đã xong / 🔒 PRO
- Progress bar phần trăm hoàn thành
- Nút "Bắt đầu" hoặc biểu tượng khóa

Layout: grid 2 cột trên desktop, 1 cột mobile
Freemium: Bài 1-3 miễn phí, bài 4-50 cần PRO (hiện overlay khóa)

Lấy dữ liệu từ Supabase bảng lessons, filter by level=1
Lấy progress từ bảng user_progress, join với Clerk user id
```

### LỆNH 3: Trang bài học từ vựng (hiển thị từ)
```
Tạo trang /tu-vung/hsk1/1 hiển thị nội dung Bài 1.

Layout giống HiHSK:
- Header: "Bài 1 - 10 từ vựng"
- Tabs điều hướng bài tập: Từ vựng | Chọn nghĩa | Chọn phiên âm | Chọn từ | Điền từ | Luyện nghe | Tổng hợp | Flashcard | Nhập từ
- Danh sách từ vựng dạng card:
  + STT, ảnh minh họa (blur nếu chưa tải)
  + Chữ Hán lớn (font serif)
  + Pinyin màu đỏ
  + Loại từ (badge: Động từ / Danh từ / Tính từ...)
  + Nghĩa tiếng Việt
  + Câu ví dụ (có phân tách từng chữ với pinyin trên đầu)
  + Nút phát âm 🔊
- Sidebar bên phải: danh sách 50 bài, highlight bài hiện tại
- Nút điều hướng: Bài trước / Bài sau
- Nút "Luyện tập" → vào trang bài tập

Lấy từ Supabase bảng vocabulary, filter by hsk_level=1 AND lesson_number=1
```

### LỆNH 4: Bài tập Chọn nghĩa
```
Tạo trang /tu-vung/hsk1/1/chon-nghia - bài tập trắc nghiệm chọn nghĩa tiếng Việt.

Giao diện:
- Thanh tiến độ trên cùng (ví dụ: 3/10)
- Hiển thị chữ Hán lớn + pinyin
- 4 đáp án nghĩa tiếng Việt
- Khi chọn đúng: highlight xanh + "+10 điểm" animation
- Khi chọn sai: highlight đỏ, highlight đáp án đúng xanh + giải thích
- Nút "Tiếp theo" sau khi trả lời
- Kết thúc: màn hình kết quả (X/10 đúng, điểm, thời gian, nút "Làm lại" và "Bài tiếp theo")

Logic:
- Lấy 10 từ của bài từ Supabase
- Random thứ tự câu hỏi
- 4 đáp án: 1 đúng + 3 sai random từ cùng level
- Lưu kết quả vào user_vocabulary (SRS data)
```

### LỆNH 5: Bài tập Flashcard
```
Tạo trang /tu-vung/hsk1/1/flashcard - bài tập flashcard với hiệu ứng lật thẻ.

Giao diện:
- Thẻ lớn chính giữa, có hiệu ứng flip 3D khi click
- Mặt trước: Chữ Hán + Pinyin + nút phát âm
- Mặt sau: Nghĩa tiếng Việt + câu ví dụ + ảnh
- 3 nút đánh giá: "Khó 😅" | "Ổn 🙂" | "Dễ 😄"
- Progress: X/10 thẻ
- Animation lật thẻ mượt mà (CSS transform rotateY)

SRS Logic (SM-2 algorithm):
- Khó: interval = 1 ngày, ease_factor giảm
- Ổn: interval nhân 1.5
- Dễ: interval nhân ease_factor (mặc định 2.5)
- Lưu vào user_vocabulary: ease_factor, interval_days, next_review
```

### LỆNH 6: Bài tập Điền từ
```
Tạo trang /tu-vung/hsk1/1/dien-tu - bài tập điền từ còn thiếu.

Giao diện:
- Hiển thị câu ví dụ với 1 từ bị ẩn thay bằng [ ___ ]
- Ô input để gõ chữ Hán hoặc pinyin
- Gợi ý: số nét, pinyin mờ (có thể toggle)
- Keyboard ảo Pinyin bên dưới (optional)
- Khi submit: so sánh string, chấp nhận cả chữ Hán lẫn pinyin
- Highlight đúng/sai + giải thích
```

### LỆNH 7: Dashboard người dùng
```
Tạo trang /dashboard sau khi đăng nhập.

Hiển thị:
- Greeting: "Chào [Tên]! Tiếp tục học nhé 🔥"
- Streak: số ngày học liên tiếp + calendar heatmap 30 ngày
- Thống kê: tổng từ đã học / số bài hoàn thành / % độ chính xác / giờ học
- "Bài học hôm nay": 3 bài gợi ý (bài tiếp theo + bài cần ôn)
- "Từ cần ôn hôm nay": danh sách từ SRS due today
- Bảng xếp hạng tuần: top 10 user nhiều XP nhất
- Tiến độ từng cấp độ HSK (progress bar)
```

### LỆNH 8: Trang Nâng cấp (Paywall)
```
Tạo trang /nang-cap - trang thanh toán.

Layout:
- Hero: "Mở khóa toàn bộ hanzi.io.vn"
- Toggle Tháng / Năm (năm tiết kiệm 30%)
- 3 gói: Miễn phí / Pro 99k/tháng / Pro+Live 199k/tháng
- Feature comparison table
- Banner "Nâng cấp tài khoản" giống HiHSK (nền xanh dương, icon vương miện)
- Khi user truy cập bài PRO: hiện modal blur với CTA nâng cấp

Tích hợp PayOS:
- Nút thanh toán → gọi PayOS API tạo payment link
- Webhook nhận kết quả → update subscriptions table
- Sau thanh toán: redirect về /dashboard với thông báo thành công
```

---

## BƯỚC 6: NẠP DỮ LIỆU TỪ VỰNG (Quan trọng nhất)

### 6.1 Ra lệnh cho Cursor tạo script import dữ liệu
```
Tạo script Node.js để import dữ liệu từ vựng HSK vào Supabase.

Script đọc file vocabulary.json và insert vào bảng vocabulary với các trường:
hanzi, pinyin, meaning_vi, part_of_speech, hsk_level, lesson_number, 
example_zh, example_pinyin, example_vi, order_in_lesson

Chạy: node scripts/import-vocab.js
```

### 6.2 Tạo file vocabulary.json với dữ liệu thật
Ra lệnh tiếp cho Cursor:
```
Tạo file data/hsk1-vocabulary.json với 100 từ HSK 1 đầu tiên.
Mỗi từ có đủ: hanzi, pinyin, meaning_vi, part_of_speech, hsk_level=1, 
lesson_number (1-10), example_zh, example_pinyin, example_vi, order_in_lesson

Bắt đầu với các từ: 爱, 爱好, 八, 爸爸, 吧, 白, 白天, 百, 班, 半...
(tiếp tục đến 100 từ theo chuẩn HSK 1)
```

---

## BƯỚC 7: DEPLOY LÊN INTERNET (30 phút)

### 7.1 Đưa code lên GitHub
Trong Terminal Cursor:
```bash
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/TEN_BAN_CUA_BAN/hanzi-io-vn.git
git push -u origin main
```

### 7.2 Deploy lên Vercel
1. Vào vercel.com → Add New Project
2. Chọn repo GitHub vừa tạo → Import
3. Thêm tất cả biến trong .env.local vào Environment Variables
4. Deploy → Vercel tự build và cho URL

### 7.3 Gắn tên miền hanzi.io.vn
1. Mua domain tại tenten.vn hoặc inet.vn (~200k/năm)
2. Trong Vercel → Settings → Domains → Add hanzi.io.vn
3. Vercel cho DNS records → copy vào nhà đăng ký domain
4. Chờ 10-30 phút → web sống

---

## BƯỚC 8: TÍCH HỢP THANH TOÁN VIỆT NAM

### 8.1 Đăng ký PayOS
1. Vào payos.vn → Đăng ký tài khoản doanh nghiệp
2. Cung cấp CCCD + thông tin tài khoản ngân hàng
3. Được cấp: Client ID, API Key, Checksum Key
4. Thêm vào .env.local

### 8.2 Ra lệnh Cursor tích hợp PayOS
```
Tích hợp PayOS vào trang /nang-cap.

Khi user click "Đăng ký Pro":
1. Gọi POST /api/payment/create với amount=99000, planType="pro"
2. API route tạo PayOS payment link
3. Redirect user đến PayOS checkout
4. Webhook /api/payment/webhook nhận kết quả
5. Nếu thành công: update bảng subscriptions, gửi email xác nhận
6. Redirect về /dashboard?upgraded=true

Dùng thư viện: npm install @payos/node
```

---

## BƯỚC 9: AUDIO TỪ VỰNG (Text-to-Speech)

Ra lệnh Cursor:
```
Tạo API route /api/tts/[hanzi] dùng Google Text-to-Speech API để phát âm chữ Hán.

Hoặc dùng: responsivevoice.js (miễn phí) để phát âm client-side.
Language code tiếng Trung: zh-CN

Thêm nút 🔊 vào mỗi từ vựng, khi click gọi API này.
```

---

## BƯỚC 10: KIỂM TRA VÀ LAUNCH

### Checklist trước khi ra mắt:
- [ ] Đăng ký / Đăng nhập hoạt động
- [ ] Hiển thị từ vựng đúng cấp độ
- [ ] 5 loại bài tập hoạt động
- [ ] Freemium gate: bài 4+ hiện khóa cho user free
- [ ] Thanh toán PayOS hoạt động (test mode)
- [ ] Thanh toán PayOS (live mode)
- [ ] Mobile responsive OK
- [ ] Trang /nang-cap hấp dẫn
- [ ] Email chào mừng sau đăng ký

---

## PHỤ LỤC: KHO NỘI DUNG ĐẦY ĐỦ

Xem file: `data/vocabulary-hsk1.json` (được tạo cùng tài liệu này)

### Nguồn bổ sung nội dung:
1. **Ảnh minh họa**: Dùng Unsplash API (miễn phí) - search keyword tiếng Anh
2. **Audio**: Google TTS hoặc ResponsiveVoice (miễn phí)
3. **Ví dụ câu thêm**: Yêu cầu Claude/GPT tạo thêm ví dụ câu
4. **Bài đọc hiểu**: Dùng Claude để viết bài đọc theo cấp độ
5. **Hội thoại**: Dùng Claude tạo dialogue mẫu theo tình huống

### Cấu trúc nội dung theo cấp độ:
| Cấp | Từ vựng | Số bài | Loại bài tập |
|-----|---------|--------|--------------|
| HSK 1 | 500 từ | 50 bài | 8 loại |
| HSK 2 | 800 từ | 80 bài | 8 loại |
| HSK 3 | 1200 từ | 120 bài | 8 loại |
| HSK 4 | 1200 từ | 120 bài | 8 loại |
| HSK 5 | 1300 từ | 130 bài | 8 loại |
| HSK 6 | 5000 từ | 200 bài | 8 loại |

---

## LƯU Ý QUAN TRỌNG

1. **Cursor Chat**: Mỗi lần ra lệnh, đính kèm file liên quan để AI hiểu context
2. **Khi bị lỗi**: Copy thông báo lỗi dán vào Cursor chat hỏi "Lỗi này fix thế nào?"
3. **Không xóa code cũ**: Luôn dùng git commit trước khi thay đổi lớn
4. **Test từng bước**: Sau mỗi lệnh Cursor, test ngay trên localhost:3000

---

*Tổng thời gian ước tính: 2–3 tuần làm việc bán thời gian*
*Chi phí hàng tháng sau launch: Vercel $0-20 + Supabase $0-25 + Clerk $0*
