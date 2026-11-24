# REQUIREMENTS_TRACEABILITY.md — Ma trận truy vết 39 yêu cầu QLTV

| Nhóm YC | Nội dung nghiệp vụ | Bảng SQLite chính | API / Module | Trạng thái |
|---|---|---|---|---|
| YC 1–2, 11 | Độc giả & Vòng đời thẻ thư viện (BM1, BM2, QĐ1, QĐ2) | `DOCGIA`, `LOAIDOCGIA`, `THETHUVIEN` | `readerRoutes.ts`, `operationalRoutes.ts`, `ReadersPage`, `ReaderPortalPage` | Hoàn tất E2E |
| YC 3–5, 10 | Danh mục tài liệu, bản sao vật lý đa chi nhánh & danh mục dùng chung (BM3–BM5, QĐ3–QĐ4) | `SACH`, `TACGIA`, `THELOAI`, `CHINHANH`, `KESACH`, `BANSAO`, `LICHSUTRANGTHAIBANSAO` | `catalogRoutes.ts`, `operationalRoutes.ts`, `BooksPage`, `BookDetailDrawer` | Hoàn tất E2E |
| YC 6–7, 12, 15–16, 19 | Lưu thông: Mượn, Trả, Gia hạn, Đặt trước FIFO (BM6, BM7, QĐ16, QĐ19) | `PHIEUMUON`, `CHITIETPHIEUMUON`, `PHIEUTRA`, `CHITIETPHIEUTRA`, `DATTRUOC`, `NGOAILEMUON` | `circulationRoutes.ts`, `LoansPage`, `ReturnsPage`, `ReaderPortalPage` | Hoàn tất E2E |
| YC 8, 13, 17–18, 35–36, 38 | Tài chính: Phạt trễ hạn, Bồi thường, Thanh toán online, Đối soát & Phiếu điều chỉnh (BM8, QĐ17, QĐ18, QĐ36) | `PHIEUTHUTIENPHAT`, `PHIEUBOITHUONG`, `GIAODICHTHANHTOAN`, `PHIEUDIEUCHINH` | `circulationRoutes.ts`, `operationalRoutes.ts`, `FinesPage`, `ReaderPortalPage` | Hoàn tất E2E |
| YC 9 | Sao lưu & Khôi phục CSDL | `uit_library.sqlite` | `adminRoutes.ts` (`/hethong/backup`, `/hethong/restore`), `BackupPage` | Hoàn tất E2E |
| YC 14, 20–25 | Báo cáo thống kê BM7.1, BM7.2, Tồn kho, Công nợ | Tổng hợp từ `PHIEUMUON`, `CHITIETPHIEUMUON`, `BANSAO`, `DOCGIA` | `adminRoutes.ts`, `ReportsPage` | Hoàn tất E2E |
| YC 26–28, 33, 37, 39 | Bổ sung tài liệu: Đề xuất, Kế hoạch ngân sách (QĐ37), NCC, Đơn đặt mua, Tiếp nhận (BM26–BM28) | `YEUCAUTAILIEU`, `KEHOACHMUASAM`, `NHACUNGCAP`, `DONDATMUA`, `CHITIETDONDATMUA`, `PHIEUTIEPNHAN` | `operationalRoutes.ts`, `AcquisitionsPage` | Hoàn tất E2E |
| YC 29–30, 34 | Điều chuyển chi nhánh 7 bước (QĐ29) & Lịch sử bản sao (QĐ30) | `PHIEUDIEUCHUYEN`, `LICHSUDIEUCHUYEN`, `LICHSUTRANGTHAIBANSAO` | `operationalRoutes.ts`, `TransfersPage` | Hoàn tất E2E |
| YC 31 | Cấu hình quy định có lịch sử hiệu lực (QĐ31) | `THAMSO`, `LICHSUCAUHINH` | `adminRoutes.ts`, `operationalRoutes.ts`, `RegulationsPage` | Hoàn tất E2E |
| YC 32 | Phân quyền chi tiết 5 vai trò + Ma trận quyền + Phạm vi chi nhánh + Nhật ký | `TAIKHOAN`, `QUYEN`, `VAITROQUYEN`, `PHAMVICHINHANH`, `NHATKYTHAOTAC` | `auth.ts`, `adminRoutes.ts`, `operationalRoutes.ts`, `AccountsPage`, `AuditLogPage` | Hoàn tất E2E |
| Mở rộng | Kiểm kê & Thanh lý, Tài nguyên số DRM, Đánh giá sách, Chatbot AI, Bản đồ tri thức | `BIENBANKIEMKE`, `CHITIETKIEMKE`, `PHIEUTHANHLY`, `TAINGUYENSO`, `DANHGIA`, `SACH` | `InventoryDisposalPage`, `BookDetailDrawer`, `KnowledgeMapView`, `UitLibBotWidget` | Hoàn tất E2E |
