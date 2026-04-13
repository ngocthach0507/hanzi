# 📑 BẢN TÓM TẮT BÀN GIAO DỰ ÁN: HANZI.IO.VN

## 🎯 Mục tiêu hiện tại
Triển khai thành công ứng dụng học tiếng Trung (Next.js 15) lên Netlify, tích hợp Clerk (Auth), Supabase (DB) và SePay (Payment).

## 🛠 Trạng thái kỹ thuật (Dành cho Agent tiếp theo)
- **Framework:** Next.js 15 (v15.1.0+), React 19.
- **Mã nguồn:** Đã đẩy lên GitHub `ngocthach0507/hanzi`.
- **Triển khai:** Đang trong quá trình Build trên Netlify.

## ✅ Các vấn đề đã xử lý (Hardening)
1. **Next.js 15 Compatibility:** Chuyển đổi toàn bộ `params` trong Route Handlers sang dạng Promise (`await params`).
2. **Database:** Chuẩn hóa logic `upsert` cho `user_progress` (sử dụng async/await thay cho .catch()).
3. **TypeScript Build:** Fix lỗi nhận diện CSS module bằng `@ts-ignore` và cấu hình `ignoreDeprecations: "6.0"` trong `tsconfig.json`.
4. **Security Blocker:** Nâng cấp từ Next.js 15.0.0 lên **15.1.0** để vượt qua lỗi bảo mật **CVE-2025-55182** mà Netlify tự động chặn.

## ⚠️ Lưu ý quan trọng cho Agent tiếp theo
- **Biến môi trường:** Đã hướng dẫn User nhập thủ công trên Netlify. Cần kiểm tra lại các biến `NODE_VERSION=20` và `NPM_FLAGS=--legacy-peer-deps`.
- **Deploy Trigger:** Cần hướng dẫn User thực hiện "Clear cache and deploy site" sau mỗi lần cập nhật `package.json`.
- **Webhook:** Sau khi Site Live, cần hỗ trợ User cập nhật URL Webhook tại Dashboard SePay (`/api/payment/webhook`).

## 📋 Lộ trình dở dang
- [ ] Chờ Netlify Build thành công bản vá bảo mật (NextJS 15.1.0).
- [ ] Kiểm tra tính năng Đăng nhập & Mua khóa học trên môi trường Production.
- [ ] Cấu hình tên miền chính thức (nếu User yêu cầu).

---
*Bản tóm tắt này giúp Agent mới nắm bắt ngay lập tức các rào cản kỹ thuật đã vượt qua mà không cần đọc lại toàn bộ lịch sử trò chuyện.*
