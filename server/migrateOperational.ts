import bcrypt from 'bcryptjs';
import type Database from 'better-sqlite3';
import { addDaysIso, todayIsoDate } from '../src/lib/businessRules';

function ensureColumn(
  db: Database.Database,
  table: string,
  column: string,
  definition: string
): void {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
  if (!cols.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

export function migrateOperationalTables(
  db: Database.Database,
  seedPassword: string
): void {
  const today = todayIsoDate();

  // 1. Upgrade TAIKHOAN CHECK constraint to allow CATALOGER if needed
  const tkTable = db
    .prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'TAIKHOAN'")
    .get() as { sql: string } | undefined;

  if (tkTable && !tkTable.sql.includes('CATALOGER')) {
    db.pragma('foreign_keys = OFF');
    db.exec(`
      CREATE TABLE TAIKHOAN_NEW (
        MaTaiKhoan INTEGER PRIMARY KEY AUTOINCREMENT,
        TenDangNhap TEXT NOT NULL UNIQUE,
        MatKhauHash TEXT NOT NULL,
        HoTen TEXT NOT NULL,
        VaiTro TEXT NOT NULL CHECK (VaiTro IN ('ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN', 'CATALOGER', 'READER')),
        MaDocGia TEXT,
        TrangThai TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (TrangThai IN ('ACTIVE', 'LOCKED')),
        NgayTao TEXT NOT NULL,
        MaCN TEXT DEFAULT 'CN01',
        FOREIGN KEY (MaDocGia) REFERENCES DOCGIA(MaDocGia) ON DELETE SET NULL
      );
      INSERT INTO TAIKHOAN_NEW (MaTaiKhoan, TenDangNhap, MatKhauHash, HoTen, VaiTro, MaDocGia, TrangThai, NgayTao)
      SELECT MaTaiKhoan, TenDangNhap, MatKhauHash, HoTen, VaiTro, MaDocGia, TrangThai, NgayTao FROM TAIKHOAN;
      DROP TABLE TAIKHOAN;
      ALTER TABLE TAIKHOAN_NEW RENAME TO TAIKHOAN;
    `);
    db.pragma('foreign_keys = ON');
  } else {
    ensureColumn(db, 'TAIKHOAN', 'MaCN', "TEXT DEFAULT 'CN01'");
  }

  // 2. Extend LOAIDOCGIA with configurable limits (QĐ1)
  ensureColumn(db, 'LOAIDOCGIA', 'TuoiToiThieu', 'INTEGER NOT NULL DEFAULT 16');
  ensureColumn(db, 'LOAIDOCGIA', 'TuoiToiDa', 'INTEGER NOT NULL DEFAULT 60');
  ensureColumn(db, 'LOAIDOCGIA', 'ThoiHanThe_Thang', 'INTEGER NOT NULL DEFAULT 6');
  ensureColumn(db, 'LOAIDOCGIA', 'SoTaiLieuToiDa', 'INTEGER NOT NULL DEFAULT 5');
  ensureColumn(db, 'LOAIDOCGIA', 'SoNgayMuonToiDa', 'INTEGER NOT NULL DEFAULT 4');

  // 3. Extend THAMSO with compensation & receiving discrepancy thresholds (QĐ18, QĐ28)
  ensureColumn(db, 'THAMSO', 'TiLePhiXuLy', 'REAL NOT NULL DEFAULT 20');
  ensureColumn(db, 'THAMSO', 'NguongChenhLechNhanHang', 'REAL NOT NULL DEFAULT 10');

  // 4. Create all operational tables from QLTV spec
  db.exec(`
    CREATE TABLE IF NOT EXISTS CHINHANH (
      MaCN TEXT PRIMARY KEY,
      TenCN TEXT NOT NULL,
      DiaChi TEXT NOT NULL,
      SDT TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS KESACH (
      MaKe TEXT PRIMARY KEY,
      MaCN TEXT NOT NULL,
      ViTri TEXT NOT NULL,
      FOREIGN KEY (MaCN) REFERENCES CHINHANH(MaCN)
    );

    CREATE TABLE IF NOT EXISTS BANSAO (
      MaBanSao TEXT PRIMARY KEY,
      MaSach TEXT NOT NULL,
      MaCN TEXT NOT NULL,
      MaKe TEXT,
      TinhTrang TEXT NOT NULL CHECK (TinhTrang IN ('Sẵn sàng', 'Đang mượn', 'Đang sửa', 'Chờ thanh lý', 'Đã thanh lý', 'Thất lạc')),
      NgayNhap TEXT NOT NULL,
      FOREIGN KEY (MaSach) REFERENCES SACH(MaSach) ON DELETE CASCADE,
      FOREIGN KEY (MaCN) REFERENCES CHINHANH(MaCN),
      FOREIGN KEY (MaKe) REFERENCES KESACH(MaKe)
    );

    CREATE TABLE IF NOT EXISTS LICHSUTRANGTHAIBANSAO (
      MaLichSu INTEGER PRIMARY KEY AUTOINCREMENT,
      MaBanSao TEXT NOT NULL,
      TrangThaiCu TEXT,
      TrangThaiMoi TEXT NOT NULL,
      ChiNhanhCu TEXT,
      ChiNhanhMoi TEXT,
      ThoiGian TEXT NOT NULL,
      NguoiThucHien TEXT,
      LyDo TEXT,
      FOREIGN KEY (MaBanSao) REFERENCES BANSAO(MaBanSao) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS THETHUVIEN (
      MaThe TEXT PRIMARY KEY,
      MaDocGia TEXT NOT NULL,
      NgayLap TEXT NOT NULL,
      NgayHetHan TEXT NOT NULL,
      TrangThai TEXT NOT NULL CHECK (TrangThai IN ('Đang dùng', 'Đã khoá', 'Đã báo mất')),
      LyDoKhoa TEXT,
      FOREIGN KEY (MaDocGia) REFERENCES DOCGIA(MaDocGia) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS QUYEN (
      MaQuyen TEXT PRIMARY KEY,
      TenQuyen TEXT NOT NULL,
      NhomChucNang TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS VAITROQUYEN (
      MaVaiTro TEXT NOT NULL,
      MaQuyen TEXT NOT NULL,
      PRIMARY KEY (MaVaiTro, MaQuyen),
      FOREIGN KEY (MaQuyen) REFERENCES QUYEN(MaQuyen) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS PHAMVICHINHANH (
      MaTaiKhoan INTEGER NOT NULL,
      MaCN TEXT NOT NULL,
      PRIMARY KEY (MaTaiKhoan, MaCN),
      FOREIGN KEY (MaTaiKhoan) REFERENCES TAIKHOAN(MaTaiKhoan) ON DELETE CASCADE,
      FOREIGN KEY (MaCN) REFERENCES CHINHANH(MaCN) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS LICHSUCAUHINH (
      MaLichSuCauHinh INTEGER PRIMARY KEY AUTOINCREMENT,
      MaCauHinh TEXT NOT NULL,
      GiaTri TEXT NOT NULL,
      NgayHieuLuc TEXT NOT NULL,
      NgayHetHieuLuc TEXT,
      NguoiThayDoi TEXT,
      LyDoThayDoi TEXT
    );

    CREATE TABLE IF NOT EXISTS KEHOACHMUASAM (
      MaKeHoach TEXT PRIMARY KEY,
      TenKeHoach TEXT NOT NULL,
      NganSach REAL NOT NULL CHECK (NganSach >= 0),
      NganSachDaDung REAL NOT NULL DEFAULT 0 CHECK (NganSachDaDung >= 0),
      NgayBatDau TEXT NOT NULL,
      NgayKetThuc TEXT,
      NguoiDuyet TEXT
    );

    CREATE TABLE IF NOT EXISTS NHACUNGCAP (
      MaNCC TEXT PRIMARY KEY,
      TenNCC TEXT NOT NULL,
      DiaChi TEXT,
      SDT TEXT,
      Email TEXT
    );

    CREATE TABLE IF NOT EXISTS DONDATMUA (
      MaDonDatMua TEXT PRIMARY KEY,
      MaKeHoach TEXT NOT NULL,
      MaNCC TEXT NOT NULL,
      NgayDat TEXT NOT NULL,
      TrangThai TEXT NOT NULL CHECK (TrangThai IN ('Nháp', 'Đã gửi', 'Đã nhận một phần', 'Đã nhận đủ', 'Huỷ')),
      NguoiLap TEXT,
      FOREIGN KEY (MaKeHoach) REFERENCES KEHOACHMUASAM(MaKeHoach),
      FOREIGN KEY (MaNCC) REFERENCES NHACUNGCAP(MaNCC)
    );

    CREATE TABLE IF NOT EXISTS CHITIETDONDATMUA (
      MaChiTietDat INTEGER PRIMARY KEY AUTOINCREMENT,
      MaDonDatMua TEXT NOT NULL,
      TenTaiLieuDat TEXT NOT NULL,
      SoLuongDat INTEGER NOT NULL CHECK (SoLuongDat > 0),
      DonGia REAL NOT NULL CHECK (DonGia >= 0),
      FOREIGN KEY (MaDonDatMua) REFERENCES DONDATMUA(MaDonDatMua) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS PHIEUTIEPNHAN (
      MaPhieuTiepNhan TEXT PRIMARY KEY,
      MaDonDatMua TEXT NOT NULL,
      NgayNhan TEXT NOT NULL,
      SoLuongThucNhan INTEGER NOT NULL CHECK (SoLuongThucNhan >= 0),
      TinhTrangHang TEXT NOT NULL CHECK (TinhTrangHang IN ('Đạt', 'Thiếu', 'Thừa', 'Lỗi chất lượng')),
      GhiChuChenhLech TEXT,
      NguoiTiepNhan TEXT,
      FOREIGN KEY (MaDonDatMua) REFERENCES DONDATMUA(MaDonDatMua)
    );

    CREATE TABLE IF NOT EXISTS PHIEUDIEUCHUYEN (
      SoPhieuDC TEXT PRIMARY KEY,
      MaBanSao TEXT NOT NULL,
      ChiNhanhGui TEXT NOT NULL,
      ChiNhanhNhan TEXT NOT NULL,
      TrangThai TEXT NOT NULL CHECK (TrangThai IN ('Nháp', 'Chờ duyệt', 'Đã duyệt', 'Đang vận chuyển', 'Đã xuất kho', 'Đã nhập kho', 'Hoàn tất', 'Thất lạc', 'Từ chối')),
      NgayLap TEXT NOT NULL,
      NgayDuyet TEXT,
      NgayXuatKho TEXT,
      NgayNhapKho TEXT,
      NguoiLap TEXT,
      NguoiDuyet TEXT,
      FOREIGN KEY (MaBanSao) REFERENCES BANSAO(MaBanSao),
      FOREIGN KEY (ChiNhanhGui) REFERENCES CHINHANH(MaCN),
      FOREIGN KEY (ChiNhanhNhan) REFERENCES CHINHANH(MaCN)
    );

    CREATE TABLE IF NOT EXISTS LICHSUDIEUCHUYEN (
      MaLichSu INTEGER PRIMARY KEY AUTOINCREMENT,
      SoPhieuDC TEXT NOT NULL,
      TrangThaiCu TEXT,
      TrangThaiMoi TEXT NOT NULL,
      ThoiGian TEXT NOT NULL,
      NguoiThucHien TEXT,
      FOREIGN KEY (SoPhieuDC) REFERENCES PHIEUDIEUCHUYEN(SoPhieuDC) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS BIENBANKIEMKE (
      MaBBKK TEXT PRIMARY KEY,
      MaCN TEXT NOT NULL,
      NgayKiemKe TEXT NOT NULL,
      NguoiThucHien TEXT,
      TrangThai TEXT NOT NULL DEFAULT 'Chờ duyệt' CHECK (TrangThai IN ('Chờ duyệt', 'Đã duyệt điều chỉnh')),
      FOREIGN KEY (MaCN) REFERENCES CHINHANH(MaCN)
    );

    CREATE TABLE IF NOT EXISTS CHITIETKIEMKE (
      MaBBKK TEXT NOT NULL,
      MaSach TEXT NOT NULL,
      SoLuongHeThong INTEGER NOT NULL,
      SoLuongThucTe INTEGER NOT NULL,
      PRIMARY KEY (MaBBKK, MaSach),
      FOREIGN KEY (MaBBKK) REFERENCES BIENBANKIEMKE(MaBBKK) ON DELETE CASCADE,
      FOREIGN KEY (MaSach) REFERENCES SACH(MaSach)
    );

    CREATE TABLE IF NOT EXISTS PHIEUTHANHLY (
      SoPhieuTL TEXT PRIMARY KEY,
      MaBanSao TEXT NOT NULL,
      LyDo TEXT NOT NULL,
      NgayLap TEXT NOT NULL,
      NgayThanhLy TEXT,
      TrangThai TEXT NOT NULL DEFAULT 'Chờ duyệt' CHECK (TrangThai IN ('Chờ duyệt', 'Đã duyệt', 'Từ chối')),
      NguoiDeXuat TEXT,
      NguoiDuyet TEXT,
      FOREIGN KEY (MaBanSao) REFERENCES BANSAO(MaBanSao)
    );

    CREATE TABLE IF NOT EXISTS PHIEUBOITHUONG (
      SoPhieuBT TEXT PRIMARY KEY,
      MaDocGia TEXT NOT NULL,
      MaBanSao TEXT NOT NULL,
      LoaiSuCo TEXT NOT NULL CHECK (LoaiSuCo IN ('Mất', 'Hư hỏng')),
      TriGiaTaiLieu REAL NOT NULL,
      PhiXuLy REAL NOT NULL,
      TongBoiThuong REAL NOT NULL,
      NgayLap TEXT NOT NULL,
      TrangThai TEXT NOT NULL DEFAULT 'Chưa thu' CHECK (TrangThai IN ('Chưa thu', 'Đã thu')),
      FOREIGN KEY (MaDocGia) REFERENCES DOCGIA(MaDocGia),
      FOREIGN KEY (MaBanSao) REFERENCES BANSAO(MaBanSao)
    );

    CREATE TABLE IF NOT EXISTS GIAODICHTHANHTOAN (
      MaGD TEXT PRIMARY KEY,
      MaDocGia TEXT NOT NULL,
      KenhThanhToan TEXT NOT NULL CHECK (KenhThanhToan IN ('VNPay', 'Momo', 'ZaloPay')),
      MaGD_CongThanhToan TEXT NOT NULL UNIQUE,
      SoTien REAL NOT NULL CHECK (SoTien > 0),
      TrangThai TEXT NOT NULL CHECK (TrangThai IN ('Thành công', 'Thất bại', 'Đang xử lý')),
      ThoiGianGD TEXT NOT NULL,
      FOREIGN KEY (MaDocGia) REFERENCES DOCGIA(MaDocGia)
    );

    CREATE TABLE IF NOT EXISTS PHIEUDIEUCHINH (
      MaPhieuDieuChinh TEXT PRIMARY KEY,
      LoaiChungTu TEXT NOT NULL CHECK (LoaiChungTu IN ('PhieuPhat', 'PhieuBoiThuong', 'GiaoDichThanhToan')),
      MaChungTuGoc TEXT NOT NULL,
      SoTienDieuChinh REAL NOT NULL,
      LyDo TEXT NOT NULL,
      NguoiLap TEXT,
      NguoiDuyet TEXT,
      NgayLap TEXT NOT NULL,
      TrangThai TEXT NOT NULL DEFAULT 'Chờ duyệt' CHECK (TrangThai IN ('Chờ duyệt', 'Đã duyệt', 'Từ chối'))
    );

    CREATE TABLE IF NOT EXISTS NGOAILEMUON (
      MaNgoaiLe TEXT PRIMARY KEY,
      MaDocGia TEXT NOT NULL,
      SoLuongThem INTEGER NOT NULL CHECK (SoLuongThem > 0 AND SoLuongThem <= 10),
      LyDo TEXT NOT NULL,
      HanApDung TEXT NOT NULL,
      TrangThai TEXT NOT NULL DEFAULT 'Chờ duyệt' CHECK (TrangThai IN ('Chờ duyệt', 'Đã duyệt', 'Từ chối')),
      NguoiDuyet TEXT,
      NgayTao TEXT NOT NULL,
      FOREIGN KEY (MaDocGia) REFERENCES DOCGIA(MaDocGia)
    );

    CREATE TABLE IF NOT EXISTS DANHGIA (
      MaDanhGia INTEGER PRIMARY KEY AUTOINCREMENT,
      MaDocGia TEXT NOT NULL,
      MaSach TEXT NOT NULL,
      SoSao INTEGER NOT NULL CHECK (SoSao >= 1 AND SoSao <= 5),
      NoiDung TEXT NOT NULL,
      NgayDanhGia TEXT NOT NULL,
      FOREIGN KEY (MaDocGia) REFERENCES DOCGIA(MaDocGia),
      FOREIGN KEY (MaSach) REFERENCES SACH(MaSach) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS TAINGUYENSO (
      MaTNS TEXT PRIMARY KEY,
      MaSach TEXT NOT NULL UNIQUE,
      DuongDanFile TEXT NOT NULL,
      DinhDangFile TEXT NOT NULL,
      SoLuotMuonDongThoi INTEGER NOT NULL DEFAULT 5,
      ThoiHanDRM_Ngay INTEGER NOT NULL DEFAULT 7,
      FOREIGN KEY (MaSach) REFERENCES SACH(MaSach) ON DELETE CASCADE
    );
  `);

  const runSeed = db.transaction(() => {
    // Seed 5th role: CATALOGER + ensure HEAD_LIBRARIAN exists
    const passHash = bcrypt.hashSync(seedPassword, 10);
    const insAccount = db.prepare(
      `INSERT OR IGNORE INTO TAIKHOAN (TenDangNhap, MatKhauHash, HoTen, VaiTro, MaDocGia, TrangThai, NgayTao, MaCN)
       VALUES (?, ?, ?, ?, ?, 'ACTIVE', ?, ?)`
    );
    insAccount.run('head@uit.edu.vn', passHash, 'Đỗ Thị Thanh Tuyền', 'HEAD_LIBRARIAN', null, today, 'CN01');
    insAccount.run('bienmuc@uit.edu.vn', passHash, 'Trần Minh Biên Mục', 'CATALOGER', null, today, 'CN01');

    // Seed LOAIDOCGIA KH + configurable limits
    db.prepare(
      `INSERT OR IGNORE INTO LOAIDOCGIA (MaLoaiDocGia, TenLoaiDocGia, TuoiToiThieu, TuoiToiDa, ThoiHanThe_Thang, SoTaiLieuToiDa, SoNgayMuonToiDa)
       VALUES ('KH', 'Bạn đọc ngoài trường (KH)', 16, 60, 6, 3, 4)`
    ).run();
    db.prepare(`UPDATE LOAIDOCGIA SET SoTaiLieuToiDa = 5, SoNgayMuonToiDa = 4, TuoiToiThieu = 16, TuoiToiDa = 60 WHERE MaLoaiDocGia = 'X'`).run();
    db.prepare(`UPDATE LOAIDOCGIA SET SoTaiLieuToiDa = 10, SoNgayMuonToiDa = 14, TuoiToiThieu = 22, TuoiToiDa = 60 WHERE MaLoaiDocGia = 'Y'`).run();

    // Seed Branches & Shelves
    const insBranch = db.prepare(
      'INSERT OR IGNORE INTO CHINHANH (MaCN, TenCN, DiaChi, SDT) VALUES (?, ?, ?, ?)'
    );
    insBranch.run('CN01', 'Thư viện Trung tâm UIT (Cơ sở chính)', 'Tòa nhà A, Khu phố 6, P. Linh Trung, TP. Thủ Đức', '(028) 3725 2002');
    insBranch.run('CN02', 'Thư viện Cơ sở 2 (Khu Đô thị ĐHQG)', 'Nhà E, Khu Công nghệ cao / ĐHQG-HCM', '(028) 3725 2003');

    const insShelf = db.prepare('INSERT OR IGNORE INTO KESACH (MaKe, MaCN, ViTri) VALUES (?, ?, ?)');
    insShelf.run('KE01-A1', 'CN01', 'Tầng 1 – Dãy A – Kệ CNTT & Giáo trình');
    insShelf.run('KE01-B2', 'CN01', 'Tầng 2 – Dãy B – Kệ Luận văn & Nghiên cứu');
    insShelf.run('KE02-A1', 'CN02', 'Tầng 1 – Dãy A – Kệ Sách tham khảo');

    // Seed THETHUVIEN for existing DOCGIA if empty
    const cardCount = (db.prepare('SELECT COUNT(*) as cnt FROM THETHUVIEN').get() as { cnt: number }).cnt;
    if (cardCount === 0) {
      const readers = db.prepare('SELECT MaDocGia, NgayLapThe, NgayHetHan FROM DOCGIA').all() as Array<{
        MaDocGia: string;
        NgayLapThe: string;
        NgayHetHan: string;
      }>;
      const insCard = db.prepare(
        `INSERT OR IGNORE INTO THETHUVIEN (MaThe, MaDocGia, NgayLap, NgayHetHan, TrangThai, LyDoKhoa)
         VALUES (?, ?, ?, ?, 'Đang dùng', NULL)`
      );
      for (const r of readers) {
        insCard.run(`TV-${r.MaDocGia}`, r.MaDocGia, r.NgayLapThe, r.NgayHetHan);
      }
    }

    // Seed BANSAO (1-2 physical copies per book) if empty
    const copyCount = (db.prepare('SELECT COUNT(*) as cnt FROM BANSAO').get() as { cnt: number }).cnt;
    if (copyCount === 0) {
      const books = db
        .prepare(
          `SELECT s.MaSach, s.NgayNhap,
            CASE WHEN EXISTS (
              SELECT 1 FROM CHITIETPHIEUMUON ct
              LEFT JOIN CHITIETPHIEUTRA tr ON tr.MaChiTietMuon = ct.MaChiTietMuon
              WHERE ct.MaSach = s.MaSach AND tr.MaChiTietTra IS NULL
            ) THEN 'Đang mượn' ELSE 'Sẵn sàng' END AS TinhTrang
           FROM SACH s`
        )
        .all() as Array<{ MaSach: string; NgayNhap: string; TinhTrang: string }>;

      const insCopy = db.prepare(
        `INSERT OR IGNORE INTO BANSAO (MaBanSao, MaSach, MaCN, MaKe, TinhTrang, NgayNhap)
         VALUES (?, ?, ?, ?, ?, ?)`
      );
      books.forEach((b, idx) => {
        insCopy.run(`BS-${b.MaSach}-01`, b.MaSach, 'CN01', idx % 3 === 0 ? 'KE01-B2' : 'KE01-A1', b.TinhTrang, b.NgayNhap);
        if (idx % 4 === 0) {
          insCopy.run(`BS-${b.MaSach}-02`, b.MaSach, 'CN02', 'KE02-A1', 'Sẵn sàng', b.NgayNhap);
        }
      });
    }

    // Seed Granular Permissions (QUYEN & VAITROQUYEN)
    const permissions: Array<[string, string, string]> = [
      ['CATALOG_VIEW', 'Tra cứu tài liệu & bản sao', 'Danh mục tài liệu'],
      ['CATALOG_EDIT', 'Biên mục tài liệu & danh mục dùng chung', 'Danh mục tài liệu'],
      ['COPY_MANAGE', 'Quản lý bản sao vật lý & kệ sách', 'Danh mục tài liệu'],
      ['READER_MANAGE', 'Quản lý hồ sơ độc giả & thẻ thư viện', 'Độc giả & Thẻ'],
      ['CARD_LOCK', 'Khoá / mở khoá thẻ độc giả', 'Độc giả & Thẻ'],
      ['LOAN_CREATE', 'Cho mượn & gia hạn tài liệu', 'Lưu thông'],
      ['RETURN_PROCESS', 'Nhận trả & xử lý sự cố tài liệu', 'Lưu thông'],
      ['LOAN_OVERRIDE_APPROVE', 'Phê duyệt mượn vượt định mức', 'Lưu thông'],
      ['ACQ_REQUEST', 'Gửi đề xuất bổ sung tài liệu', 'Bổ sung tài liệu'],
      ['ACQ_PLAN_APPROVE', 'Duyệt đề xuất & kế hoạch mua sắm', 'Bổ sung tài liệu'],
      ['ACQ_RECEIVE', 'Tiếp nhận hàng theo đơn đặt mua', 'Bổ sung tài liệu'],
      ['TRANSFER_CREATE', 'Lập yêu cầu điều chuyển chi nhánh', 'Điều chuyển'],
      ['TRANSFER_APPROVE', 'Phê duyệt phiếu điều chuyển', 'Điều chuyển'],
      ['TRANSFER_WAREHOUSE', 'Xác nhận xuất kho / nhập kho', 'Điều chuyển'],
      ['INVENTORY_COUNT', 'Thực hiện kiểm kê chi nhánh', 'Kiểm kê & Thanh lý'],
      ['INVENTORY_APPROVE', 'Duyệt điều chỉnh tồn kho sau kiểm kê', 'Kiểm kê & Thanh lý'],
      ['DISPOSAL_PROPOSE', 'Đề xuất thanh lý bản sao hỏng/mất', 'Kiểm kê & Thanh lý'],
      ['DISPOSAL_APPROVE', 'Phê duyệt thanh lý tài liệu', 'Kiểm kê & Thanh lý'],
      ['FINANCE_COLLECT', 'Thu tiền phạt & bồi thường', 'Tài chính'],
      ['FINANCE_RECONCILE', 'Đối soát thu - chi theo kỳ', 'Tài chính'],
      ['FINANCE_ADJUST_APPROVE', 'Duyệt phiếu điều chỉnh chứng từ tài chính', 'Tài chính'],
      ['REGULATION_EDIT', 'Cấu hình quy định nghiệp vụ', 'Quản trị & Cấu hình'],
      ['ACCOUNT_MANAGE', 'Quản lý tài khoản & phân quyền', 'Quản trị & Cấu hình'],
      ['AUDIT_VIEW', 'Xem nhật ký thao tác hệ thống', 'Quản trị & Cấu hình'],
      ['BACKUP_MANAGE', 'Sao lưu & khôi phục dữ liệu', 'Quản trị & Cấu hình'],
    ];

    const insPerm = db.prepare('INSERT OR IGNORE INTO QUYEN (MaQuyen, TenQuyen, NhomChucNang) VALUES (?, ?, ?)');
    for (const [id, name, group] of permissions) {
      insPerm.run(id, name, group);
    }

    const rolePermCount = (db.prepare('SELECT COUNT(*) as cnt FROM VAITROQUYEN').get() as { cnt: number }).cnt;
    if (rolePermCount === 0) {
      const roleMap: Record<string, string[]> = {
        READER: ['CATALOG_VIEW', 'ACQ_REQUEST'],
        LIBRARIAN: [
          'CATALOG_VIEW', 'READER_MANAGE', 'LOAN_CREATE', 'RETURN_PROCESS',
          'TRANSFER_CREATE', 'TRANSFER_WAREHOUSE', 'INVENTORY_COUNT',
          'DISPOSAL_PROPOSE', 'FINANCE_COLLECT',
        ],
        CATALOGER: [
          'CATALOG_VIEW', 'CATALOG_EDIT', 'COPY_MANAGE', 'ACQ_RECEIVE',
          'TRANSFER_WAREHOUSE', 'INVENTORY_COUNT', 'DISPOSAL_PROPOSE',
        ],
        HEAD_LIBRARIAN: permissions.map((p) => p[0]).filter((id) => id !== 'BACKUP_MANAGE'),
        ADMIN: [
          'CATALOG_VIEW', 'REGULATION_EDIT', 'ACCOUNT_MANAGE', 'AUDIT_VIEW', 'BACKUP_MANAGE',
        ],
      };
      const insRolePerm = db.prepare('INSERT OR IGNORE INTO VAITROQUYEN (MaVaiTro, MaQuyen) VALUES (?, ?)');
      for (const [role, perms] of Object.entries(roleMap)) {
        for (const p of perms) {
          insRolePerm.run(role, p);
        }
      }
    }

    // Seed Branch Scopes for staff
    const staff = db.prepare("SELECT MaTaiKhoan, VaiTro FROM TAIKHOAN WHERE VaiTro != 'READER'").all() as Array<{
      MaTaiKhoan: number;
      VaiTro: string;
    }>;
    const insScope = db.prepare('INSERT OR IGNORE INTO PHAMVICHINHANH (MaTaiKhoan, MaCN) VALUES (?, ?)');
    for (const s of staff) {
      insScope.run(s.MaTaiKhoan, 'CN01');
      if (s.VaiTro === 'ADMIN' || s.VaiTro === 'HEAD_LIBRARIAN' || s.VaiTro === 'CATALOGER') {
        insScope.run(s.MaTaiKhoan, 'CN02');
      }
    }

    // Seed Effective-dated Config History
    const cfgHistCount = (db.prepare('SELECT COUNT(*) as cnt FROM LICHSUCAUHINH').get() as { cnt: number }).cnt;
    if (cfgHistCount === 0) {
      const insCfgHist = db.prepare(
        `INSERT INTO LICHSUCAUHINH (MaCauHinh, GiaTri, NgayHieuLuc, NgayHetHieuLuc, NguoiThayDoi, LyDoThayDoi)
         VALUES (?, ?, ?, ?, ?, ?)`
      );
      insCfgHist.run('MUC_PHAT_MOI_NGAY', '1000', '2026-01-01', null, 'admin@uit.edu.vn', 'Khởi tạo quy định năm học 2026');
      insCfgHist.run('SO_SACH_MUON_TOI_DA', '5', '2026-01-01', null, 'admin@uit.edu.vn', 'Định mức chuẩn sinh viên UIT');
      insCfgHist.run('SO_NGAY_MUON_TOI_DA', '4', '2026-01-01', null, 'admin@uit.edu.vn', 'Thời hạn mượn chuẩn theo QĐ16');
      insCfgHist.run('TI_LE_PHI_XU_LY', '20', '2026-01-01', null, 'admin@uit.edu.vn', 'Phí xử lý bồi thường 20% theo QĐ18');
    }

    // Seed Acquisitions (Suppliers, Plan, Order)
    const supCount = (db.prepare('SELECT COUNT(*) as cnt FROM NHACUNGCAP').get() as { cnt: number }).cnt;
    if (supCount === 0) {
      const insSup = db.prepare('INSERT INTO NHACUNGCAP (MaNCC, TenNCC, DiaChi, SDT, Email) VALUES (?, ?, ?, ?, ?)');
      insSup.run('NCC01', 'NXB Đại học Quốc gia TP.HCM', 'Khu phố 6, P. Linh Trung, TP. Thủ Đức', '02837242160', 'nxb@vnuhcm.edu.vn');
      insSup.run('NCC02', 'Công ty Phát hành sách Fahasa', '60-62 Lê Lợi, Q.1, TP.HCM', '02838225796', 'kinhdoanh@fahasa.com');
      insSup.run('NCC03', "O'Reilly Academic Books", 'Sebastopol, CA (Distributor VN)', '02839100888', 'academic@oreilly-vn.org');

      db.prepare(
        `INSERT INTO KEHOACHMUASAM (MaKeHoach, TenKeHoach, NganSach, NganSachDaDung, NgayBatDau, NgayKetThuc, NguoiDuyet)
         VALUES ('KH2026-HK1', 'Kế hoạch bổ sung Giáo trình & Tham khảo HK1 2026', 85000000, 12500000, ?, ?, 'head@uit.edu.vn')`
      ).run(addDaysIso(today, -30), addDaysIso(today, 90));

      db.prepare(
        `INSERT INTO DONDATMUA (MaDonDatMua, MaKeHoach, MaNCC, NgayDat, TrangThai, NguoiLap)
         VALUES ('DM2026-001', 'KH2026-HK1', 'NCC01', ?, 'Đã gửi', 'head@uit.edu.vn')`
      ).run(addDaysIso(today, -10));

      db.prepare(
        `INSERT INTO CHITIETDONDATMUA (MaDonDatMua, TenTaiLieuDat, SoLuongDat, DonGia)
         VALUES ('DM2026-001', 'Designing Data-Intensive Applications (2nd Ed)', 10, 850000),
                ('DM2026-001', 'Giáo trình Kiến trúc Máy tính & Hợp ngữ UIT', 20, 200000)`
      ).run();
    }

    // Seed Transfers
    const trfCount = (db.prepare('SELECT COUNT(*) as cnt FROM PHIEUDIEUCHUYEN').get() as { cnt: number }).cnt;
    if (trfCount === 0) {
      const sampleCopy = db.prepare("SELECT MaBanSao FROM BANSAO WHERE MaCN = 'CN01' AND TinhTrang = 'Sẵn sàng' LIMIT 1").get() as { MaBanSao: string } | undefined;
      if (sampleCopy) {
        db.prepare(
          `INSERT INTO PHIEUDIEUCHUYEN (SoPhieuDC, MaBanSao, ChiNhanhGui, ChiNhanhNhan, TrangThai, NgayLap, NguoiLap)
           VALUES ('DC2026-001', ?, 'CN01', 'CN02', 'Chờ duyệt', ?, 'thuthu@uit.edu.vn')`
        ).run(sampleCopy.MaBanSao, addDaysIso(today, -1));
        db.prepare(
          `INSERT INTO LICHSUDIEUCHUYEN (SoPhieuDC, TrangThaiCu, TrangThaiMoi, ThoiGian, NguoiThucHien)
           VALUES ('DC2026-001', NULL, 'Chờ duyệt', ?, 'thuthu@uit.edu.vn')`
        ).run(new Date().toISOString());
      }
    }

    // Seed Digital Resources & Book Reviews for flagship books
    const tnsCount = (db.prepare('SELECT COUNT(*) as cnt FROM TAINGUYENSO').get() as { cnt: number }).cnt;
    if (tnsCount === 0) {
      const sampleBooks = db.prepare('SELECT MaSach FROM SACH LIMIT 5').all() as Array<{ MaSach: string }>;
      const insTns = db.prepare(
        `INSERT OR IGNORE INTO TAINGUYENSO (MaTNS, MaSach, DuongDanFile, DinhDangFile, SoLuotMuonDongThoi, ThoiHanDRM_Ngay)
         VALUES (?, ?, ?, 'PDF', 5, 7)`
      );
      sampleBooks.forEach((b, i) => {
        insTns.run(`TNS-${String(i + 1).padStart(3, '0')}`, b.MaSach, `/digital-vault/${b.MaSach}.pdf`);
      });

      const insReview = db.prepare(
        `INSERT INTO DANHGIA (MaDocGia, MaSach, SoSao, NoiDung, NgayDanhGia)
         VALUES (?, ?, ?, ?, ?)`
      );
      if (sampleBooks[0]) {
        insReview.run('DG001', sampleBooks[0].MaSach, 5, 'Tài liệu bám sát đề cương môn học UIT, ví dụ dễ hiểu và đầy đủ.', addDaysIso(today, -3));
      }
    }
  });

  runSeed();
}
