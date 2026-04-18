# SESSION CONTEXT — Hanzi.io.vn Learning Platform
> Cập nhật lần cuối: 2026-04-18 | Phiên làm việc 077c41cb

---

## 🗂 TỔNG QUAN DỰ ÁN

**Tên dự án:** Hanzi.io.vn — Web học tiếng Trung HSK  
**Tech stack:** Next.js (App Router) + TypeScript + Supabase + TailwindCSS  
**Dev server:** `npm run dev` → `http://localhost:3001`  
**Workspace:** `d:\antigravity\bán hàng web học tiếng trung\`

---

## 🏗 CẤU TRÚC THƯ MỤC QUAN TRỌNG

```
app/
  bo-thu/page.tsx         ← Trang 214 bộ thủ (giản thể + phồn thể)
  luong-tu/page.tsx       ← Trang lượng từ (measure words) — vừa build xong
  luyen-viet/page.tsx     ← Luyện viết HanziWriter — hỗ trợ thêm từ tùy ý + VI→ZH
  luyen-thi/page.tsx      ← Trang danh sách đề thi
  luyen-thi/[level]/page.tsx
  luyen-thi/[level]/[id]/page.tsx  ← Trang làm bài thi
  hoi-thoai/              ← Hội thoại HSK1/2/3
  luyen-nghe/             ← Luyện nghe (có exercises)
  giao-trinh/             ← Giáo trình HSK
  tu-vung-hsk/            ← Trang từ vựng HSK 3.0 chuyên sâu (MỚI)

constants/
  radicals.ts             ← 214 bộ thủ, interface có cả char (giản) + charTrad (phồn)

data/
  measure-words.json      ← 15 lượng từ có ví dụ + category + is_free
  grammar-hsk1.json       ← Ngữ pháp HSK1 (có exercises: reorder/fill/qa)
  grammar-hsk2.json
  grammar-hsk3.json
  hsk1-vocabulary.json
  hsk2-vocabulary.json
  hsk3-vocabulary.json

tài liệu hsk/
  đề thi/hsk_exams_generated.json  ← 120 đề thi (40/level)
  ngữ pháp/
  hội thoại/

scripts/
  import-exams.mjs        ← Import đề thi vào Supabase

generate_hsk_exams.js     ← Sinh 120 đề thi (40 × HSK1/2/3)
vocab_vi_map.json         ← Map hanzi → meaning_vi từ Supabase
```

---

## 🗄 DATABASE SUPABASE

**File cấu hình:** `.env.local`  
**Biến cần thiết:**
```
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

**Bảng chính:**
| Bảng | Mô tả |
|------|-------|
| `exams` | 120 đề thi HSK1/2/3 (đã import) |
| `vocabulary` | Từ vựng có cột `meaning_vi`, `hanzi`, `pinyin` |
| `lessons` | Bài học theo cấp độ |
| `grammar` | Ngữ pháp + exercises |

**Import đề thi:**
```powershell
node generate_hsk_exams.js
node scripts/import-exams.mjs
```
> ⚠ Dùng từng lệnh riêng, KHÔNG dùng `&&` trong PowerShell

---

## ✅ CÔNG VIỆC ĐÃ HOÀN THÀNH (phiên này)

### Đề thi HSK (2026 chuẩn)
- [x] Tạo 120 đề (40 HSK1 + 40 HSK2 + 40 HSK3) — cấu trúc 2026
- [x] Sửa lỗi tiếng Anh lẫn vào đề → dùng `vocab_vi_map.json`
- [x] Sửa lỗi font chữ chồng chéo → dynamic text scaling
- [x] Sửa grammar distractor bị reversed → lấy pattern từ list thật
- [x] Import vào Supabase thành công
- [x] Mở khoá tất cả đề (bỏ `is_free` lock) để test

### Bộ thủ (`/bo-thu`)
- [x] Thêm trường `charTrad` vào interface `Radical`
- [x] Bổ sung phồn thể cho đủ 214 bộ thủ
- [x] UI hiển thị 2 dạng side-by-side: giản thể (xanh) + phồn thể (cam)
- [x] Nếu 2 dạng giống nhau → hiện nhãn `= Phồn thể`

### Luyện viết (`/luyen-viet`)
- [x] Danh sách chữ động (useState thay vì hardcode)
- [x] Nút `+` mở input thêm chữ:
  - Tab **Tiếng Trung**: nhập thẳng chữ Hán
  - Tab **Tiếng Việt → Dịch**: gọi MyMemory API, preview kết quả, chọn thêm
- [x] Nút ❌ xoá chữ khỏi danh sách (hover)
- [x] TTS button hoạt động (Web Speech API, zh-CN)
- [x] Error overlay khi HanziWriter không có data cho chữ

### Lượng từ (`/luong-tu`)
- [x] Trang đầy đủ từ `data/measure-words.json`
- [x] Card mỗi lượng từ: chữ to + pinyin + nghĩa + nhóm màu riêng
- [x] Filter theo 15 danh mục + search + toggle Free
- [x] Accordion ví dụ (4 câu/từ)
- [x] TTS click to speak
- [x] Banner cú pháp + mẹo học

### Từ vựng HSK 3.0 (`/tu-vung-hsk`) — **MỚI BUILD**
- [x] Trang liệt kê từ vựng theo HSK 1-6 (HSK 3.0 Syllabus 2026)
- [x] Popup chi tiết Dictionary Style (Tabs: Từ vựng, Hán tự, Ví dụ, Ngữ pháp, Luyện tập)
- [x] Tích hợp HanziWriter xem stroke order trực quan
- [x] Hệ thống luyện tập tự động: 7 câu hỏi/từ (MCQ, Audio, Reorder, Fill-blank, Writing)
- [x] Ghi chú cá nhân (Local Storage) + Từ ghép/liên quan
- [x] Patch dữ liệu ví dụ/nghĩa Việt cho HSK 1 qua script `patch-vocab-examples.mjs`

---

## 🔧 CÁCH CHẠY LỆNH (PowerShell đặc biệt)

```powershell
# ĐÚNG — chạy từng lệnh
node generate_hsk_exams.js
node scripts/import-exams.mjs

# SAI — không chạy được trong PowerShell cũ
node generate_hsk_exams.js && node scripts/import-exams.mjs
```

---

## 📋 VIỆC CÒN LẠI / TODO

### Ưu tiên cao
- [ ] **Re-enable paywall** sau khi test xong: restore `is_free` logic trong `app/luyen-thi/[level]/page.tsx`
- [ ] Kiểm tra thực tế đề thi HSK2, HSK3 (chọn random vài đề xem chất lượng câu)
- [ ] Trang `/luong-tu` — thêm data nhiều hơn (hiện chỉ có 15 lượng từ)

### Ưu tiên trung bình
- [ ] `app/luyen-nghe/` — hội thoại: bài tập Fill-blank + Reorder đang hoạt động, cần xác nhận HSK1 full
- [ ] Phần giải thích sau khi làm xong đề thi (`explanation` field)
- [ ] Mobile responsive cho trang đề thi

### Ưu tiên thấp
- [ ] Trang `/luyen-de-thpt` — xem nội dung
- [ ] Trang `/mau-cau` — xem có TODO không
- [ ] Trang `/dich` — xem trạng thái

---

## 💡 DESIGN SYSTEM

**Brand color:** `#D85A30` (orange)  
**Font:** Inter (Google Fonts)  
**Border radius pattern:** `rounded-[28px]` / `rounded-[32px]` / `rounded-[40px]`  
**Dark card:** `bg-[#1F2937]` text-white  
**Background:** `bg-[#F9FAFB]` hoặc `bg-[#FAFBFD]`

---

## 🔑 THƯ VIỆN & API ĐỆ TAM

| Thư viện/API | Mục đích | Ghi chú |
|---|---|---|
| `HanziWriter` | Luyện viết stroke order | npm package, data từ Make Me a Hanzi |
| `MyMemory API` | Dịch Việt → Trung | Free, không cần key: `https://api.mymemory.translated.net/get?q=...&langpair=vi|zh` |
| `Web Speech API` | TTS phát âm | `lang='zh-CN'`, rate=0.8 |
| `Supabase` | Database + Auth | Xem `.env.local` |

---

## 📁 FILES QUAN TRỌNG CẦN XEM LẠI

| File | Lý do |
|------|-------|
| `generate_hsk_exams.js` | Script sinh đề — đã fix nhiều bug, cần review logic Reading section |
| `app/luyen-thi/[level]/[id]/page.tsx` | Dynamic font scaling + quiz UI |
| `constants/radicals.ts` | 214 radical với charTrad — cần verify phồn thể accuracy |
| `data/measure-words.json` | 15 lượng từ — cần mở rộng thêm |
| `vocab_vi_map.json` | Map 818 từ Hán → nghĩa Việt từ Supabase |
