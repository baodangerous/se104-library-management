<div align="center">

# 📚 Thư viện Trường Đại học Công nghệ Thông tin (UIT – ĐHQG-HCM)

**Hệ thống Cổng Tra cứu Học liệu Mở & Quản trị Thư viện Thông minh**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

*Đồ án môn học **SE104.R11 – Nhập môn Công nghệ phần mềm** · Trường Đại học Công nghệ Thông tin (UIT – ĐHQG-HCM)*

</div>

---

## 🎓 Thông tin Đồ án & Nhóm thực hiện

| Thông tin | Chi tiết |
| :--- | :--- |
| **Đề tài** | **Quản lý Thư viện (Thư viện Trường ĐH Công nghệ Thông tin – UIT)** |
| **Môn học** | `SE104.R11` – Nhập môn Công nghệ phần mềm |
| **Giảng viên hướng dẫn** | **TS. Đỗ Thị Thanh Tuyền** |
| **Nhóm thực hiện** | **Nhóm 19** |

### 👥 Thành viên Nhóm 19 *(sắp xếp theo thứ tự bảng chữ cái Tiếng Việt)*

| STT | Họ và tên | MSSV |
| :---: | :--- | :---: |
| 1 | **Lâm Chí Dĩnh** | `23520291` |
| 2 | **Nguyễn Lê Bảo Đăng** | `23520230` |
| 3 | **Nguyễn Hoàng Lộc** | `23520858` |
| 4 | **Nguyễn Thị Minh Thư** | `23521543` |
| 5 | **Nguyễn Trường Vũ** | `23521812` |

---

## ✨ Tính năng nổi bật

### 1. 🌐 Cổng thông tin Công khai (Public Portal)
- **Tìm kiếm thông minh (`Ctrl + K` / `Cmd + K`):** Tra cứu tiếng Việt không dấu theo nhan đề, tác giả, nhà xuất bản, mã ngành và vị trí kệ sách; hỗ trợ lọc đa chiều và sắp xếp kết quả.
- **CSDL 12 Ngành đào tạo UIT:** Phân loại học liệu trực quan theo 12 ngành học (Thiết kế Vi mạch, An toàn Thông tin, Khoa học Dữ liệu, Trí tuệ Nhân tạo, Kỹ thuật Phần mềm, v.v.) kèm màu sắc và chương trình đào tạo.
- **Bản đồ Tri thức (Knowledge Map):** Đồ thị tương tác 2D kết nối `Ngành học ↔ Thể loại ↔ Sách ↔ Tác giả`, bấm vào node để xem chi tiết tài liệu.
- **Dịch vụ trực tuyến:** Đặt lịch phòng học nhóm (kiểm tra trùng khung giờ, chặn ngày quá khứ) và gửi đề xuất bổ sung tài liệu mới.

### 2. 🛠️ Không gian Làm việc Phân quyền (Workspace)
- **Phân quyền theo vai trò:** `ADMIN` (Quản trị hệ thống, tham số quy định, tài khoản, nhật ký, sao lưu), `LIBRARIAN` (Độc giả, kho sách, mượn/trả, thu phạt, báo cáo), `READER` (Cổng độc giả cá nhân).
- **Nghiệp vụ Lưu thông & Gia hạn chuẩn UIT:**
  - Lập thẻ độc giả tự động kiểm tra độ tuổi và tính ngày hết hạn; hỗ trợ **gia hạn thẻ**.
  - Tiếp nhận sách mới kiểm tra khoảng cách năm xuất bản; tình trạng `Có sẵn` / `Đang mượn` được tính động từ lịch sử mượn trả.
  - Cho mượn sách kiểm tra đủ 4 điều kiện (hạn thẻ, sách quá hạn, tình trạng sách, hạn mức tối đa).
  - **Gia hạn sách trực tuyến** (tối đa 2 lần cho sách đang mượn chưa quá hạn và thẻ còn hiệu lực).
  - Nhận trả sách & tính tiền phạt tự động (`1.000đ/ngày/quyển` quá hạn), thu tiền phạt và cập nhật công nợ.
- **Báo cáo & Thống kê:** Biểu đồ `Recharts`, thống kê lượt mượn theo thể loại, thống kê sách trả trễ và xuất dữ liệu.

### 3. 🤖 Trợ lý Ảo Thư viện (`UIT LibBot`)
- Đọc dữ liệu trực tiếp từ cơ sở dữ liệu (`SACH`, `THAMSO`, `PHONGHOP`, `NGANHHOC`) theo thời gian thực.
- Trả về thẻ sách tương tác, lịch phục vụ và quy định thư viện tự động cập nhật khi Quản trị viên thay đổi tham số.

---

## 🏗️ Kiến trúc & Cơ sở dữ liệu

Toàn bộ dữ liệu được tập trung tại **`src/database/`** với 16+ bảng chuẩn hóa (đồng bộ `localStorage` qua `dbEngine.ts` và khởi tạo từ `seedData.ts`):

<details>
<summary><b>📂 Xem cấu trúc thư mục & sơ đồ bảng dữ liệu</b></summary>

```text
src/
├── database/          # Cơ sở dữ liệu tập trung (schema.ts, dbEngine.ts, seedData.ts, ...)
├── services/          # Tầng nghiệp vụ & truy xuất dữ liệu (bookService, circulationService, portalService, ...)
├── features/
│   ├── portal/        # Giao diện cổng tra cứu công khai, 12 ngành UIT, Knowledge Map, Đặt phòng
│   ├── workspace/     # Không gian làm việc phân quyền (Dashboard, Độc giả, Sách, Mượn/Trả, Phạt, Báo cáo)
│   └── chatbot/       # Widget & engine trợ lý UIT LibBot
├── components/ui/     # Các thành phần UI tái sử dụng
└── lib/               # Tiện ích & kiểm thử quy tắc nghiệp vụ
```

- **12 bảng cốt lõi:** `LOAIDOCGIA`, `DOCGIA`, `THELOAI`, `TACGIA`, `SACH` *(không lưu cột `TinhTrang`)*, `SACH_TACGIA`, `PHIEUMUON`, `CHITIETPHIEUMUON`, `PHIEUTRA`, `CHITIETPHIEUTRA`, `PHIEUTHUTIENPHAT`, `THAMSO`.
- **Bảng mở rộng:** `TAIKHOAN`, `NHATKYTHAOTAC`, `NGANHHOC`, `PHONGHOP`, `DATPHONG`, `YEUCAUTAILIEU`, `TINTUC`, `TUSACHCHUYENDE`, `CAUHINHCONG`.

</details>

---

## 🚀 Hướng dẫn cài đặt & chạy dự án

### Yêu cầu môi trường
- **Node.js** `>= 20` và **npm**

### Cài đặt & Khởi chạy

```bash
# 1. Cài đặt thư viện
npm install --legacy-peer-deps

# 2. Chạy ứng dụng ở chế độ phát triển
npm run dev
```

Mở trình duyệt tại `http://localhost:3000`.

### Kiểm tra chất lượng mã nguồn

```bash
# Kiểm tra TypeScript
npm run lint

# Build production
npm run build

# Chạy bộ kiểm thử đơn vị (Unit Tests)
npx tsx --test src/lib/businessRules.test.ts src/features/chatbot/libBotEngine.test.ts src/services/knowledgeMapService.test.ts
```

---

## 🔑 Tài khoản trải nghiệm nhanh

Trong modal **Đăng nhập** trên cổng thư viện, bạn có thể bấm trực tiếp 3 nút chọn nhanh vai trò (`Admin`, `Thủ thư`, `Sinh viên`) hoặc sử dụng thông tin mẫu:

| Vai trò | Tên đăng nhập | Mật khẩu |
| :--- | :--- | :--- |
| **Quản trị viên (`ADMIN`)** | `admin@uit.edu.vn` | `admin123` |
| **Thủ thư (`LIBRARIAN`)** | `thuthu@uit.edu.vn` | `thuthu123` |
| **Độc giả (`READER`)** | `22520101@gm.uit.edu.vn` | `docgia123` |

---

<div align="center">

Made with ❤️ by **Nhóm 19 – SE104.R11 (UIT – ĐHQG-HCM)**

</div>
