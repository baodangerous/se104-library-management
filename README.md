# HỆ THỐNG QUẢN LÝ THƯ VIỆN

**Đồ án môn học SE104.R11 – Nhập môn Công nghệ phần mềm**  
Trường Đại học Công nghệ Thông tin – Đại học Quốc gia TP. Hồ Chí Minh (UIT – ĐHQG-HCM)

---

## 1. Thông tin chung

| Hạng mục | Nội dung |
| :--- | :--- |
| **Đề tài** | Quản lý Thư viện |
| **Môn học** | SE104.R11 – Nhập môn Công nghệ phần mềm |
| **Giảng viên hướng dẫn** | TS. Đỗ Thị Thanh Tuyền |
| **Nhóm thực hiện** | Nhóm 19 |

### Danh sách thành viên Nhóm 19


| STT | Họ và tên | MSSV |
| :---: | :--- | :---: |
| 1 | Lâm Chí Dĩnh | 23520291 |
| 2 | Nguyễn Lê Bảo Đăng | 23520230 |
| 3 | Nguyễn Hoàng Lộc | 23520858 |
| 4 | Nguyễn Thị Minh Thư | 23521543 |
| 5 | Nguyễn Trường Vũ | 23521812 |

---

## 2. Thông tin học phần và Mục tiêu môn học

### Thông tin học phần

| Thuộc tính | Giá trị |
| :--- | :--- |
| **Số tín chỉ** | 4 (Lý thuyết: 3 · Thực hành: 1) |
| **Môn học trước** | IT002, IT004 |
| **Môn học tiên quyết** | Không |
| **Hệ số điểm** | Quá trình: `0.3` · Đồ án: `0.7` (Lý thuyết, Thực hành, Đồ án) |

### Mục tiêu môn học

1. Tổng quan về Công nghệ phần mềm.
2. Xác định và mô hình hóa yêu cầu phần mềm.
3. Thiết kế phần mềm.
4. Cài đặt phần mềm.
5. Kiểm thử và bảo trì.
6. Thực hiện đồ án môn học theo quy trình kỹ nghệ phần mềm chuẩn.

---

## 3. Giới thiệu bài toán và Quy trình thực hiện

### 3.1. Bài toán cần giải quyết

Hệ thống được xây dựng nhằm tin học hóa toàn diện quy trình nghiệp vụ tại thư viện đại học, giải quyết các bài toán cốt lõi:

- **Quản lý độc giả và thẻ thư viện:** Lập thẻ mới, kiểm tra điều kiện độ tuổi hợp lệ, tự động tính ngày hết hạn thẻ, hỗ trợ gia hạn thẻ và theo dõi công nợ cá nhân.
- **Quản lý kho sách và tra cứu học liệu:** Tiếp nhận sách mới theo quy định khoảng cách năm xuất bản, chuẩn hóa tác giả – thể loại – ngành học, xác định trạng thái sách (`Có sẵn` / `Đang mượn`) động từ dữ liệu lưu thông thay vì lưu cứng.
- **Quản lý lưu thông (Mượn – Trả – Gia hạn – Thu phạt):** Kiểm tra đồng thời các điều kiện cho mượn (hạn thẻ, tình trạng sách, sách quá hạn, số lượng mượn tối đa), hỗ trợ gia hạn trực tuyến khi chưa quá hạn, tính tiền phạt trả trễ theo ngày, lập biên lai thu tiền phạt và cập nhật công nợ nhất quán.
- **Thống kê và báo cáo:** Tổng hợp tình hình mượn sách theo thể loại (tháng/năm), thống kê sách trả trễ theo ngày và hỗ trợ xuất/in biểu mẫu.
- **Cổng tra cứu và dịch vụ trực tuyến:** Hỗ trợ sinh viên tra cứu không dấu (`Ctrl+K`), khám phá bản đồ tri thức liên kết ngành học – thể loại – sách – tác giả, đặt phòng học nhóm theo khung giờ và đề xuất bổ sung tài liệu.

### 3.2. Quy trình thực hiện các công việc chính

1. **Xác định và mô hình hóa yêu cầu phần mềm:** Khảo sát nghiệp vụ quản lý thư viện, phân tích tác nhân (`ADMIN`, `LIBRARIAN`, `READER`, khách tra cứu), xây dựng danh sách yêu cầu chức năng và phi chức năng, mô hình hóa Use Case và luồng nghiệp vụ.
2. **Thiết kế hệ thống:** Phân tách kiến trúc phân lớp rõ ràng giữa tầng giao diện (`features/`), tầng dịch vụ nghiệp vụ (`services/`), tầng quy tắc (`services/rules/`) và tầng lưu trữ (`database/`), đảm bảo khả năng bảo trì và mở rộng sang kiến trúc client–server.
3. **Thiết kế dữ liệu:** Chuẩn hóa mô hình dữ liệu quan hệ gồm 12 bảng nghiệp vụ cốt lõi và các bảng mở rộng hệ thống:
   - *12 bảng cốt lõi:* `LOAIDOCGIA`, `DOCGIA`, `THELOAI`, `TACGIA`, `SACH` (không lưu cột `TinhTrang`), `SACH_TACGIA`, `PHIEUMUON`, `CHITIETPHIEUMUON`, `PHIEUTRA`, `CHITIETPHIEUTRA`, `PHIEUTHUTIENPHAT`, `THAMSO`.
   - *Bảng mở rộng:* `TAIKHOAN`, `NHATKYTHAOTAC`, `NGANHHOC`, `PHONGHOP`, `DATPHONG`, `YEUCAUTAILIEU`, `TINTUC`, `TUSACHCHUYENDE`, `CAUHINHCONG`.
4. **Thiết kế giao diện:** Thiết kế giao diện 2 lớp gồm Cổng thông tin công khai (Public Portal) và Không gian làm việc phân quyền (Workspace), đảm bảo tính nhất quán, trực quan và khả năng truy cập theo vai trò.
5. **Cài đặt:** Hiện thực mã nguồn bằng TypeScript, React, Tailwind CSS, Vite và Express; tập trung toàn bộ dữ liệu vào `src/database/dbEngine.ts` và `src/database/seedData.ts`, tách module theo nguyên tắc đơn trách nhiệm.
6. **Kiểm chứng:** Kiểm tra kiểu tĩnh (`tsc --noEmit`), kiểm thử đóng gói sản phẩm (`vite build`) và viết kiểm thử đơn vị (`node:test`) cho toàn bộ quy tắc nghiệp vụ (lập thẻ, tiếp nhận sách, điều kiện mượn, gia hạn sách/thẻ, tính phạt, thu phạt, báo cáo, đặt phòng).

---

## 4. Công nghệ sử dụng

| Thành phần | Công nghệ |
| :--- | :--- |
| **Giao diện người dùng** | React 19, TypeScript, Tailwind CSS 4, Radix UI, Lucide Icons |
| **Biểu đồ & Đồ thị** | Recharts, React Force Graph 2D |
| **Bảng dữ liệu & Validation** | TanStack React Table, Zod |
| **Công cụ đóng gói & Máy chủ** | Vite 8, Express, Better-SQLite3 (backend API) |
| **Kiểm thử** | `node:test`, `tsx` |

---

## 5. Cấu trúc thư mục dự án

```text
src/
├── database/          # Cơ sở dữ liệu tập trung (schema.ts, dbEngine.ts, seedData.ts, ...)
├── services/          # Tầng dịch vụ nghiệp vụ và truy xuất dữ liệu
│   └── rules/         # Các hàm kiểm tra quy tắc nghiệp vụ thuần (pure functions)
├── features/
│   ├── portal/        # Cổng tra cứu công khai, 12 ngành đào tạo, Knowledge Map, Dịch vụ
│   ├── workspace/     # Không gian làm việc phân quyền (Dashboard, Độc giả, Sách, Mượn/Trả, Phạt, Báo cáo, Hệ thống)
│   └── chatbot/       # Trợ lý tra cứu học liệu và quy định thư viện
├── components/ui/     # Hệ thống thành phần giao diện dùng chung
├── types/             # Định nghĩa kiểu dữ liệu TypeScript
└── lib/               # Tiện ích và bộ kiểm thử quy tắc nghiệp vụ
```

---

## 6. Hướng dẫn cài đặt và kiểm chứng

### Yêu cầu môi trường

- Node.js phiên bản `>= 20`
- npm

### Cài đặt và khởi chạy

```bash
# Cài đặt các gói phụ thuộc
npm install --legacy-peer-deps

# Khởi chạy môi trường phát triển
npm run dev
```

Truy cập ứng dụng tại địa chỉ `http://localhost:3000`.

### Kiểm tra mã nguồn và chạy kiểm thử

```bash
# Kiểm tra kiểu tĩnh TypeScript
npm run lint

# Đóng gói bản production
npm run build

# Chạy bộ kiểm thử đơn vị
npx tsx --test src/lib/businessRules.test.ts src/features/chatbot/libBotEngine.test.ts src/services/knowledgeMapService.test.ts
```
