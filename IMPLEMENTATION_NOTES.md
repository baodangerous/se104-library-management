# IMPLEMENTATION_NOTES.md — Ghi chú cài đặt & vận hành

## 1. Kiến trúc thực tế (Full-Stack End-to-End)
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4 (`src/`).
- **Backend**: Express REST API + JWT (`Bearer` token) + `bcryptjs` + Zod validation (`server/`).
- **Database**: SQLite (`better-sqlite3`, file `data/uit_library.sqlite`) với khởi tạo tự động và migration idempotent qua `server/db.ts`, `server/migratePortal.ts`, và `server/migrateOperational.ts`.

## 2. Tài khoản trải nghiệm (5 vai trò)
Mật khẩu mặc định cho tất cả tài khoản seed: `Uit@2026` (hoặc dùng nút đăng nhập nhanh trên `LoginModal`):
- **ADMIN**: `admin@uit.edu.vn`
- **HEAD_LIBRARIAN**: `head@uit.edu.vn`
- **LIBRARIAN**: `thuthu@uit.edu.vn`
- **CATALOGER**: `bienmuc@uit.edu.vn`
- **READER**: `22520101@gm.uit.edu.vn`

## 3. Các điểm lưu ý & tích hợp mô phỏng
- **Cổng thanh toán trực tuyến (`VNPay`, `Momo`, `ZaloPay`)**: Xử lý giao dịch thật trên SQLite (`GIAODICHTHANHTOAN` + cập nhật `DOCGIA.TongNo` + kiểm tra trùng mã `MaGD_CongThanhToan`), phần xác thực cổng thanh toán bên thứ ba được mô phỏng nội bộ.
- **Tài nguyên số (`TAINGUYENSO`)**: Lưu metadata DRM (định dạng, số lượt đồng thời, thời hạn đọc) gắn với đầu sách thật trong SQLite; tệp PDF vật lý không lưu trên CDN ngoài.

## 4. Cách chạy & kiểm thử
```bash
npm install
npm run dev      # Khởi chạy Express API + Vite dev server tại http://localhost:3000
npm run lint     # Kiểm tra TypeScript (tsc --noEmit)
npm run build    # Build production bundle
npm test         # Chạy kiểm thử tích hợp API & SQLite (tests/rbac-and-sync.test.ts)
```
