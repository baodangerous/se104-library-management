import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import fs from 'node:fs';
import path from 'node:path';
import { addDaysIso, addMonthsIso, todayIsoDate } from '../src/lib/businessRules';
import { migrateOperationalTables } from './migrateOperational';
import { migrateAndSeedPortalTables } from './migratePortal';

const DATA_DIR = path.resolve(process.cwd(), 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

export const DB_PATH = path.join(DATA_DIR, 'uit_library.sqlite');

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function getSeedPassword(): string {
  return process.env.SEED_DEMO_PASSWORD?.trim() || 'Uit@2026';
}

export function initSchema(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS LOAIDOCGIA (
      MaLoaiDocGia TEXT PRIMARY KEY,
      TenLoaiDocGia TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS DOCGIA (
      MaDocGia TEXT PRIMARY KEY,
      HoTen TEXT NOT NULL,
      MaLoaiDocGia TEXT NOT NULL,
      NgaySinh TEXT NOT NULL,
      DiaChi TEXT NOT NULL,
      Email TEXT NOT NULL,
      NgayLapThe TEXT NOT NULL,
      NgayHetHan TEXT NOT NULL,
      TongNo REAL NOT NULL DEFAULT 0 CHECK (TongNo >= 0),
      FOREIGN KEY (MaLoaiDocGia) REFERENCES LOAIDOCGIA(MaLoaiDocGia)
    );

    CREATE TABLE IF NOT EXISTS THELOAI (
      MaTheLoai TEXT PRIMARY KEY,
      TenTheLoai TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS TACGIA (
      MaTacGia INTEGER PRIMARY KEY AUTOINCREMENT,
      TenTacGia TEXT NOT NULL UNIQUE
    );

    -- SACH intentionally omits TinhTrang; book status is dynamically derived from CHITIETPHIEUMUON & CHITIETPHIEUTRA
    CREATE TABLE IF NOT EXISTS SACH (
      MaSach TEXT PRIMARY KEY,
      TenSach TEXT NOT NULL,
      MaTheLoai TEXT NOT NULL,
      NamXuatBan INTEGER NOT NULL,
      NhaXuatBan TEXT NOT NULL,
      NgayNhap TEXT NOT NULL,
      TriGia REAL NOT NULL CHECK (TriGia >= 0),
      FOREIGN KEY (MaTheLoai) REFERENCES THELOAI(MaTheLoai)
    );

    CREATE TABLE IF NOT EXISTS SACH_TACGIA (
      MaSachTacGia INTEGER PRIMARY KEY AUTOINCREMENT,
      MaSach TEXT NOT NULL,
      MaTacGia INTEGER NOT NULL,
      UNIQUE (MaSach, MaTacGia),
      FOREIGN KEY (MaSach) REFERENCES SACH(MaSach) ON DELETE CASCADE,
      FOREIGN KEY (MaTacGia) REFERENCES TACGIA(MaTacGia)
    );

    CREATE TABLE IF NOT EXISTS PHIEUMUON (
      MaPhieuMuon TEXT PRIMARY KEY,
      MaDocGia TEXT NOT NULL,
      NgayMuon TEXT NOT NULL,
      FOREIGN KEY (MaDocGia) REFERENCES DOCGIA(MaDocGia)
    );

    CREATE TABLE IF NOT EXISTS CHITIETPHIEUMUON (
      MaChiTietMuon INTEGER PRIMARY KEY AUTOINCREMENT,
      MaPhieuMuon TEXT NOT NULL,
      MaSach TEXT NOT NULL,
      HanTra TEXT NOT NULL,
      UNIQUE (MaPhieuMuon, MaSach),
      FOREIGN KEY (MaPhieuMuon) REFERENCES PHIEUMUON(MaPhieuMuon) ON DELETE CASCADE,
      FOREIGN KEY (MaSach) REFERENCES SACH(MaSach)
    );

    CREATE TABLE IF NOT EXISTS PHIEUTRA (
      MaPhieuTra TEXT PRIMARY KEY,
      MaDocGia TEXT NOT NULL,
      NgayTra TEXT NOT NULL,
      TongTienPhat REAL NOT NULL DEFAULT 0 CHECK (TongTienPhat >= 0),
      FOREIGN KEY (MaDocGia) REFERENCES DOCGIA(MaDocGia)
    );

    CREATE TABLE IF NOT EXISTS CHITIETPHIEUTRA (
      MaChiTietTra INTEGER PRIMARY KEY AUTOINCREMENT,
      MaPhieuTra TEXT NOT NULL,
      MaChiTietMuon INTEGER NOT NULL UNIQUE,
      TienPhat REAL NOT NULL DEFAULT 0 CHECK (TienPhat >= 0),
      FOREIGN KEY (MaPhieuTra) REFERENCES PHIEUTRA(MaPhieuTra) ON DELETE CASCADE,
      FOREIGN KEY (MaChiTietMuon) REFERENCES CHITIETPHIEUMUON(MaChiTietMuon)
    );

    CREATE TABLE IF NOT EXISTS PHIEUTHUTIENPHAT (
      MaPhieuThu TEXT PRIMARY KEY,
      MaDocGia TEXT NOT NULL,
      NgayThu TEXT NOT NULL,
      TongNoTruocThu REAL NOT NULL CHECK (TongNoTruocThu >= 0),
      SoTienThu REAL NOT NULL CHECK (SoTienThu > 0),
      ConLai REAL NOT NULL CHECK (ConLai >= 0),
      FOREIGN KEY (MaDocGia) REFERENCES DOCGIA(MaDocGia)
    );

    CREATE TABLE IF NOT EXISTS THAMSO (
      MaThamSo INTEGER PRIMARY KEY CHECK (MaThamSo = 1),
      TuoiToiThieu INTEGER NOT NULL DEFAULT 18,
      TuoiToiDa INTEGER NOT NULL DEFAULT 55,
      ThoiHanThe INTEGER NOT NULL DEFAULT 6,
      KhoangCachNamXuatBan INTEGER NOT NULL DEFAULT 8,
      SoSachMuonToiDa INTEGER NOT NULL DEFAULT 5,
      SoNgayMuonToiDa INTEGER NOT NULL DEFAULT 4
    );

    CREATE TABLE IF NOT EXISTS TAIKHOAN (
      MaTaiKhoan INTEGER PRIMARY KEY AUTOINCREMENT,
      TenDangNhap TEXT NOT NULL UNIQUE,
      MatKhauHash TEXT NOT NULL,
      HoTen TEXT NOT NULL,
      VaiTro TEXT NOT NULL CHECK (VaiTro IN ('ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN', 'READER')),
      MaDocGia TEXT,
      TrangThai TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (TrangThai IN ('ACTIVE', 'LOCKED')),
      NgayTao TEXT NOT NULL,
      FOREIGN KEY (MaDocGia) REFERENCES DOCGIA(MaDocGia) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS NHATKYTHAOTAC (
      MaNhatKy INTEGER PRIMARY KEY AUTOINCREMENT,
      ThoiGian TEXT NOT NULL,
      MaTaiKhoan INTEGER,
      TenDangNhap TEXT NOT NULL,
      VaiTro TEXT NOT NULL,
      HanhDong TEXT NOT NULL,
      BangTacDong TEXT NOT NULL,
      ChiTiet TEXT NOT NULL
    );
  `);
}

export function writeAuditLog(entry: {
  MaTaiKhoan: number | null;
  TenDangNhap: string;
  VaiTro: string;
  HanhDong: string;
  BangTacDong: string;
  ChiTiet: string;
}): void {
  db.prepare(
    `INSERT INTO NHATKYTHAOTAC (ThoiGian, MaTaiKhoan, TenDangNhap, VaiTro, HanhDong, BangTacDong, ChiTiet)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(
    new Date().toISOString(),
    entry.MaTaiKhoan,
    entry.TenDangNhap,
    entry.VaiTro,
    entry.HanhDong,
    entry.BangTacDong,
    entry.ChiTiet
  );
}

export function seedInitialData(): void {
  const existingParams = db.prepare('SELECT COUNT(*) as cnt FROM THAMSO').get() as { cnt: number };
  if (existingParams.cnt > 0) return;

  const today = todayIsoDate();
  const currentYear = Number(today.slice(0, 4));
  const seedPassHash = bcrypt.hashSync(getSeedPassword(), 10);

  const runSeed = db.transaction(() => {
    // 1. THAMSO (MaThamSo = 1)
    db.prepare(
      `INSERT INTO THAMSO (MaThamSo, TuoiToiThieu, TuoiToiDa, ThoiHanThe, KhoangCachNamXuatBan, SoSachMuonToiDa, SoNgayMuonToiDa)
       VALUES (1, 18, 55, 6, 8, 5, 4)`
    ).run();

    // 2. LOAIDOCGIA
    const insertLoaiDG = db.prepare(
      'INSERT INTO LOAIDOCGIA (MaLoaiDocGia, TenLoaiDocGia) VALUES (?, ?)'
    );
    insertLoaiDG.run('X', 'Sinh viên/Học viên (X)');
    insertLoaiDG.run('Y', 'Giảng viên/Cán bộ (Y)');

    // 3. THELOAI
    const insertTheLoai = db.prepare(
      'INSERT INTO THELOAI (MaTheLoai, TenTheLoai) VALUES (?, ?)'
    );
    insertTheLoai.run('A', 'Giáo trình CNTT (A)');
    insertTheLoai.run('B', 'Tài liệu tham khảo (B)');
    insertTheLoai.run('C', 'Luận văn & Nghiên cứu (C)');

    // 4. TACGIA
    const authors = [
      'PGS.TS. Đỗ Phúc',
      'TS. Vũ Thanh Nguyên',
      'PGS.TS. Nguyễn Hoàng Tú Anh',
      'TS. Nguyễn Gia Tuấn Anh',
      'Ian Sommerville',
      'Thomas H. Cormen',
      'Abraham Silberschatz',
      'Robert C. Martin',
      'Martin Kleppmann',
      'Andrew S. Tanenbaum',
      'Nguyễn Văn A (HVCH UIT)',
      'Trần Minh Quân (HVCH UIT)',
    ];
    const insertTacGia = db.prepare('INSERT INTO TACGIA (TenTacGia) VALUES (?)');
    const authorIds = new Map<string, number>();
    for (const name of authors) {
      const info = insertTacGia.run(name);
      authorIds.set(name, Number(info.lastInsertRowid));
    }

    // 5. DOCGIA (anchored relative to today for live status)
    const insertDocGia = db.prepare(
      `INSERT INTO DOCGIA (MaDocGia, HoTen, MaLoaiDocGia, NgaySinh, DiaChi, Email, NgayLapThe, NgayHetHan, TongNo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    const cardStartRecent = addMonthsIso(today, -2);
    const cardEndRecent = addMonthsIso(cardStartRecent, 6);
    const cardStartOld = addMonthsIso(today, -8);
    const cardEndExpired = addMonthsIso(cardStartOld, 6);

    insertDocGia.run(
      'DG001',
      'Nguyễn Minh Khôi',
      'X',
      '2004-05-14',
      'KTX Khu B ĐHQG-HCM, TP. Thủ Đức',
      '22520101@gm.uit.edu.vn',
      cardStartRecent,
      cardEndRecent,
      0
    );
    insertDocGia.run(
      'DG002',
      'Trần Thảo Vy',
      'X',
      '2004-09-22',
      'KTX Khu A ĐHQG-HCM, Linh Trung, Thủ Đức',
      '22520214@gm.uit.edu.vn',
      cardStartRecent,
      cardEndRecent,
      3000 // Remaining debt after partial fine payment
    );
    insertDocGia.run(
      'DG003',
      'Lê Hoàng Nam',
      'X',
      '2005-02-10',
      '24 Võ Văn Ngân, TP. Thủ Đức, TP.HCM',
      '23520389@gm.uit.edu.vn',
      cardStartRecent,
      cardEndRecent,
      0
    );
    insertDocGia.run(
      'DG004',
      'Phạm Gia Huy',
      'X',
      '2003-11-03',
      '118 Kha Vạn Cân, TP. Thủ Đức, TP.HCM',
      '21520412@gm.uit.edu.vn',
      cardStartOld,
      cardEndExpired, // Expired card for BM4 rule 1 testing
      5000
    );
    insertDocGia.run(
      'DG005',
      'Võ Ngọc Hân',
      'X',
      '2006-03-18',
      'Khu phố 6, Linh Trung, TP. Thủ Đức',
      '24520520@gm.uit.edu.vn',
      addMonthsIso(today, -1),
      addMonthsIso(addMonthsIso(today, -1), 6),
      0
    );
    insertDocGia.run(
      'DG006',
      'TS. Đặng Quốc Bảo',
      'Y',
      '1984-07-19',
      'Khoa Công nghệ Phần mềm, UIT – ĐHQG-HCM',
      'baodq@uit.edu.vn',
      addMonthsIso(today, -1),
      addMonthsIso(addMonthsIso(today, -1), 6),
      0
    );
    insertDocGia.run(
      'DG007',
      'ThS. Huỳnh Thị Mỹ Linh',
      'Y',
      '1990-12-08',
      'Khoa Khoa học Máy tính, UIT – ĐHQG-HCM',
      'linhhtm@uit.edu.vn',
      cardStartRecent,
      cardEndRecent,
      0
    );

    // 6. SACH & SACH_TACGIA
    const insertSach = db.prepare(
      `INSERT INTO SACH (MaSach, TenSach, MaTheLoai, NamXuatBan, NhaXuatBan, NgayNhap, TriGia)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    const insertSachTG = db.prepare(
      'INSERT INTO SACH_TACGIA (MaSach, MaTacGia) VALUES (?, ?)'
    );

    const books: {
      id: string;
      title: string;
      cat: string;
      year: number;
      pub: string;
      inDate: string;
      price: number;
      authors: string[];
    }[] = [
      {
        id: 'S001',
        title: 'Nhập môn Công nghệ Phần mềm (SE104)',
        cat: 'A',
        year: currentYear - 2,
        pub: 'NXB ĐHQG-HCM',
        inDate: addMonthsIso(today, -4),
        price: 115000,
        authors: ['TS. Vũ Thanh Nguyên', 'Ian Sommerville'],
      },
      {
        id: 'S002',
        title: 'Cấu trúc Dữ liệu và Giải thuật (IT003)',
        cat: 'A',
        year: currentYear - 3,
        pub: 'NXB ĐHQG-HCM',
        inDate: addMonthsIso(today, -4),
        price: 135000,
        authors: ['Thomas H. Cormen', 'PGS.TS. Đỗ Phúc'],
      },
      {
        id: 'S003',
        title: 'Hệ Điều Hành – Operating System Concepts',
        cat: 'A',
        year: currentYear - 2,
        pub: 'Wiley / ĐHQG-HCM',
        inDate: addMonthsIso(today, -3),
        price: 210000,
        authors: ['Abraham Silberschatz'],
      },
      {
        id: 'S004',
        title: 'Cơ sở Dữ liệu Nâng cao & Khai phá Dữ liệu',
        cat: 'A',
        year: currentYear - 1,
        pub: 'NXB ĐHQG-HCM',
        inDate: addMonthsIso(today, -3),
        price: 148000,
        authors: ['PGS.TS. Đỗ Phúc'],
      },
      {
        id: 'S005',
        title: 'Mạng Máy Tính – Computer Networks',
        cat: 'A',
        year: currentYear - 3,
        pub: 'Pearson Education',
        inDate: addMonthsIso(today, -5),
        price: 245000,
        authors: ['Andrew S. Tanenbaum'],
      },
      {
        id: 'S006',
        title: 'Clean Code – Mã sạch trong Kỹ thuật Phần mềm',
        cat: 'B',
        year: currentYear - 4,
        pub: 'Prentice Hall',
        inDate: addMonthsIso(today, -3),
        price: 280000,
        authors: ['Robert C. Martin'],
      },
      {
        id: 'S007',
        title: 'Designing Data-Intensive Applications',
        cat: 'B',
        year: currentYear - 2,
        pub: "O'Reilly Media",
        inDate: addMonthsIso(today, -2),
        price: 390000,
        authors: ['Martin Kleppmann'],
      },
      {
        id: 'S008',
        title: 'Kiến trúc Phần mềm & Mẫu Thiết kế Hiện đại',
        cat: 'B',
        year: currentYear - 1,
        pub: 'NXB Khoa học và Kỹ thuật',
        inDate: addMonthsIso(today, -2),
        price: 195000,
        authors: ['TS. Vũ Thanh Nguyên'],
      },
      {
        id: 'S009',
        title: 'Trí tuệ Nhân tạo & Xử lý Ngôn ngữ Tự nhiên',
        cat: 'B',
        year: currentYear - 1,
        pub: 'NXB ĐHQG-HCM',
        inDate: addMonthsIso(today, -2),
        price: 175000,
        authors: ['PGS.TS. Nguyễn Hoàng Tú Anh'],
      },
      {
        id: 'S010',
        title: 'Phân tích Thiết kế Hệ thống Thông tin',
        cat: 'A',
        year: currentYear - 2,
        pub: 'NXB ĐHQG-HCM',
        inDate: addMonthsIso(today, -1),
        price: 125000,
        authors: ['TS. Nguyễn Gia Tuấn Anh'],
      },
      {
        id: 'S011',
        title: 'Luận văn ThS: Hệ thống Gợi ý Tài liệu Học thuật tại UIT',
        cat: 'C',
        year: currentYear - 1,
        pub: 'Thư viện Trường ĐH CNTT',
        inDate: addMonthsIso(today, -2),
        price: 95000,
        authors: ['Nguyễn Văn A (HVCH UIT)', 'PGS.TS. Đỗ Phúc'],
      },
      {
        id: 'S012',
        title: 'Luận văn ThS: Phát hiện Bất thường Lưu lượng Mạng SDN',
        cat: 'C',
        year: currentYear,
        pub: 'Thư viện Trường ĐH CNTT',
        inDate: addMonthsIso(today, -1),
        price: 95000,
        authors: ['Trần Minh Quân (HVCH UIT)'],
      },
      {
        id: 'S013',
        title: 'An toàn Thông tin & Mật mã học Ứng dụng',
        cat: 'B',
        year: currentYear - 2,
        pub: 'NXB Thông tin và Truyền thông',
        inDate: addMonthsIso(today, -1),
        price: 165000,
        authors: ['TS. Nguyễn Gia Tuấn Anh'],
      },
      {
        id: 'S014',
        title: 'Thực hành Kiểm thử Phần mềm Tự động (SE113)',
        cat: 'A',
        year: currentYear,
        pub: 'NXB ĐHQG-HCM',
        inDate: addDaysIso(today, -15),
        price: 110000,
        authors: ['TS. Vũ Thanh Nguyên'],
      },
    ];

    for (const b of books) {
      insertSach.run(b.id, b.title, b.cat, b.year, b.pub, b.inDate, b.price);
      for (const authorName of b.authors) {
        const aid = authorIds.get(authorName);
        if (aid) insertSachTG.run(b.id, aid);
      }
    }

    // 7. Historical & active loans/returns/fines
    const insertPM = db.prepare(
      'INSERT INTO PHIEUMUON (MaPhieuMuon, MaDocGia, NgayMuon) VALUES (?, ?, ?)'
    );
    const insertCTPM = db.prepare(
      'INSERT INTO CHITIETPHIEUMUON (MaPhieuMuon, MaSach, HanTra) VALUES (?, ?, ?)'
    );
    const insertPT = db.prepare(
      'INSERT INTO PHIEUTRA (MaPhieuTra, MaDocGia, NgayTra, TongTienPhat) VALUES (?, ?, ?, ?)'
    );
    const insertCTPT = db.prepare(
      'INSERT INTO CHITIETPHIEUTRA (MaPhieuTra, MaChiTietMuon, TienPhat) VALUES (?, ?, ?)'
    );
    const insertPThu = db.prepare(
      `INSERT INTO PHIEUTHUTIENPHAT (MaPhieuThu, MaDocGia, NgayThu, TongNoTruocThu, SoTienThu, ConLai)
       VALUES (?, ?, ?, ?, ?, ?)`
    );

    // Loan 1 (2 months ago - returned on time)
    const d1 = addMonthsIso(today, -2);
    insertPM.run('PM001', 'DG001', d1);
    const ct1 = Number(insertCTPM.run('PM001', 'S001', addDaysIso(d1, 4)).lastInsertRowid);
    const ct2 = Number(insertCTPM.run('PM001', 'S006', addDaysIso(d1, 4)).lastInsertRowid);
    insertPT.run('PT001', 'DG001', addDaysIso(d1, 3), 0);
    insertCTPT.run('PT001', ct1, 0);
    insertCTPT.run('PT001', ct2, 0);

    // Loan 2 (1 month ago - returned on time by lecturer)
    const d2 = addMonthsIso(today, -1);
    insertPM.run('PM002', 'DG006', d2);
    const ct3 = Number(insertCTPM.run('PM002', 'S007', addDaysIso(d2, 4)).lastInsertRowid);
    const ct4 = Number(insertCTPM.run('PM002', 'S011', addDaysIso(d2, 4)).lastInsertRowid);
    insertPT.run('PT002', 'DG006', addDaysIso(d2, 4), 0);
    insertCTPT.run('PT002', ct3, 0);
    insertCTPT.run('PT002', ct4, 0);

    // Loan 3 (12 days ago - DG002 returned 5 days late -> 5,000 fine -> paid 2,000 -> remaining 3,000)
    const d3 = addDaysIso(today, -12);
    insertPM.run('PM003', 'DG002', d3);
    const ct5 = Number(insertCTPM.run('PM003', 'S002', addDaysIso(d3, 4)).lastInsertRowid);
    insertPT.run('PT003', 'DG002', addDaysIso(d3, 9), 5000);
    insertCTPT.run('PT003', ct5, 5000);
    insertPThu.run('PTH001', 'DG002', addDaysIso(d3, 10), 5000, 2000, 3000);

    // Loan 4 (this month - returned on time)
    const d4 = addDaysIso(today, -7);
    insertPM.run('PM004', 'DG005', d4);
    const ct6 = Number(insertCTPM.run('PM004', 'S009', addDaysIso(d4, 4)).lastInsertRowid);
    const ct7 = Number(insertCTPM.run('PM004', 'S012', addDaysIso(d4, 4)).lastInsertRowid);
    insertPT.run('PT004', 'DG005', addDaysIso(d4, 3), 0);
    insertCTPT.run('PT004', ct6, 0);
    insertCTPT.run('PT004', ct7, 0);

    // Loan 5 (Active ON-TIME loan for DG001 - borrowed yesterday)
    const d5 = addDaysIso(today, -1);
    insertPM.run('PM005', 'DG001', d5);
    insertCTPM.run('PM005', 'S001', addDaysIso(d5, 4));
    insertCTPM.run('PM005', 'S007', addDaysIso(d5, 4));

    // Loan 6 (Active OVERDUE loan for DG003 - borrowed 9 days ago, HanTra = 5 days ago)
    const d6 = addDaysIso(today, -9);
    insertPM.run('PM006', 'DG003', d6);
    insertCTPM.run('PM006', 'S003', addDaysIso(d6, 4));

    // Loan 7 (Active ON-TIME loan for DG007 - borrowed 2 days ago)
    const d7 = addDaysIso(today, -2);
    insertPM.run('PM007', 'DG007', d7);
    insertCTPM.run('PM007', 'S011', addDaysIso(d7, 4));

    // 8. TAIKHOAN (3 UIT roles, bcrypt hashed)
    const insertTK = db.prepare(
      `INSERT INTO TAIKHOAN (TenDangNhap, MatKhauHash, HoTen, VaiTro, MaDocGia, TrangThai, NgayTao)
       VALUES (?, ?, ?, ?, ?, 'ACTIVE', ?)`
    );
    insertTK.run('admin@uit.edu.vn', seedPassHash, 'Quản trị viên Hệ thống UIT', 'ADMIN', null, today);
    insertTK.run('thuthu@uit.edu.vn', seedPassHash, 'Nguyễn Thị Thu Hà', 'LIBRARIAN', null, today);
    insertTK.run('22520101@gm.uit.edu.vn', seedPassHash, 'Nguyễn Minh Khôi', 'READER', 'DG001', today);

    // 9. Initial NHATKYTHAOTAC
    writeAuditLog({
      MaTaiKhoan: 1,
      TenDangNhap: 'admin@uit.edu.vn',
      VaiTro: 'ADMIN',
      HanhDong: 'KHOI_TAO_HE_THONG',
      BangTacDong: 'THAMSO',
      ChiTiet: 'Khởi tạo cơ sở dữ liệu mẫu Thư viện Trường ĐH CNTT (UIT – ĐHQG-HCM) theo chuẩn SE104.',
    });
    writeAuditLog({
      MaTaiKhoan: 2,
      TenDangNhap: 'thuthu@uit.edu.vn',
      VaiTro: 'LIBRARIAN',
      HanhDong: 'LAP_PHIEU_MUON',
      BangTacDong: 'PHIEUMUON',
      ChiTiet: 'Lập phiếu mượn PM005 cho độc giả Nguyễn Minh Khôi (DG001) gồm 2 quyển sách.',
    });
    writeAuditLog({
      MaTaiKhoan: 2,
      TenDangNhap: 'thuthu@uit.edu.vn',
      VaiTro: 'LIBRARIAN',
      HanhDong: 'THU_TIEN_PHAT',
      BangTacDong: 'PHIEUTHUTIENPHAT',
      ChiTiet: 'Lập phiếu thu PTH001 thu 2.000 ₫ tiền phạt của độc giả Trần Thảo Vy (DG002).',
    });
  });

  runSeed();
}

export function generateNextId(
  table: 'DOCGIA' | 'SACH' | 'PHIEUMUON' | 'PHIEUTRA' | 'PHIEUTHUTIENPHAT',
  column: string,
  prefix: string
): string {
  const rows = db.prepare(`SELECT ${column} as id FROM ${table}`).all() as { id: string }[];
  let maxNum = 0;
  const re = new RegExp(`^${prefix}(\\d+)$`);
  for (const r of rows) {
    const m = re.exec(r.id);
    if (m) {
      const n = Number(m[1]);
      if (n > maxNum) maxNum = n;
    }
  }
  return `${prefix}${String(maxNum + 1).padStart(3, '0')}`;
}

// Initialize schema and seed immediately on module load
initSchema();
seedInitialData();
migrateAndSeedPortalTables(db);
migrateOperationalTables(db, getSeedPassword());
