import bcrypt from 'bcryptjs';
import type Database from 'better-sqlite3';
import { SEED_SACH, SEED_SACH_TACGIA, SEED_TACGIA } from '../src/database/seedBooks';
import { SEED_HUONGDAN } from '../src/database/seedGuideData';
import { SEED_NGANHHOC } from '../src/database/seedMajors';
import {
  SEED_CAUHINHCONG,
  SEED_TINTUC,
  SEED_TUSACHCHUYENDE,
} from '../src/database/seedPortalData';
import {
  createSeedBookRequests,
  createSeedBookings,
  SEED_PHONGHOP,
} from '../src/database/seedRooms';
import { todayIsoDate } from '../src/lib/businessRules';

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

export function migrateAndSeedPortalTables(db: Database.Database): void {
  ensureColumn(db, 'SACH', 'MaNganh', "TEXT NOT NULL DEFAULT 'CNTT'");
  ensureColumn(db, 'SACH', 'NgonNgu', "TEXT NOT NULL DEFAULT 'Tiếng Việt'");
  ensureColumn(db, 'SACH', 'NguonTaiLieu', "TEXT NOT NULL DEFAULT 'Giáo trình UIT'");
  ensureColumn(db, 'SACH', 'ChuDe', 'TEXT');
  ensureColumn(db, 'SACH', 'NoiBat', 'INTEGER NOT NULL DEFAULT 0');
  ensureColumn(db, 'SACH', 'MaKeSach', "TEXT NOT NULL DEFAULT 'T1-CNTT-01'");
  ensureColumn(db, 'SACH', 'AnhBia', 'TEXT');
  ensureColumn(db, 'SACH', 'MoTa', 'TEXT');

  ensureColumn(db, 'THAMSO', 'TienPhatMoiNgay', 'REAL NOT NULL DEFAULT 1000');
  ensureColumn(db, 'THAMSO', 'SoLanGiaHanToiDa', 'INTEGER NOT NULL DEFAULT 2');
  ensureColumn(db, 'CHITIETPHIEUMUON', 'SoLanGiaHan', 'INTEGER NOT NULL DEFAULT 0');

  db.exec(`
    CREATE TABLE IF NOT EXISTS DATTRUOC (
      MaDatTruoc TEXT PRIMARY KEY,
      MaSach TEXT NOT NULL,
      MaDocGia TEXT NOT NULL,
      NgayDat TEXT NOT NULL,
      TrangThai TEXT NOT NULL CHECK (TrangThai IN ('Đang chờ', 'Đã giữ chỗ', 'Đã hủy', 'Hoàn tất')),
      FOREIGN KEY (MaSach) REFERENCES SACH(MaSach) ON DELETE CASCADE,
      FOREIGN KEY (MaDocGia) REFERENCES DOCGIA(MaDocGia) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS PHONGHOP (
      MaPhong TEXT PRIMARY KEY,
      TenPhong TEXT NOT NULL,
      Tang TEXT NOT NULL,
      SucChua INTEGER NOT NULL,
      TrangThietBi TEXT NOT NULL,
      TrangThai TEXT NOT NULL CHECK (TrangThai IN ('Sẵn sàng', 'Bảo trì'))
    );

    CREATE TABLE IF NOT EXISTS DATPHONG (
      MaDatPhong TEXT PRIMARY KEY,
      MaPhong TEXT NOT NULL,
      NguoiDat TEXT NOT NULL,
      MaSoSV TEXT NOT NULL,
      Email TEXT NOT NULL,
      NgayDat TEXT NOT NULL,
      KhungGio TEXT NOT NULL,
      MucDich TEXT NOT NULL,
      TrangThai TEXT NOT NULL CHECK (TrangThai IN ('Đã xác nhận', 'Đã hủy'))
    );

    CREATE TABLE IF NOT EXISTS YEUCAUTAILIEU (
      MaYeuCau TEXT PRIMARY KEY,
      TenTaiLieu TEXT NOT NULL,
      TacGia TEXT NOT NULL,
      MaNganh TEXT NOT NULL,
      NguoiGui TEXT NOT NULL,
      Email TEXT NOT NULL,
      LyDo TEXT NOT NULL,
      NgayGui TEXT NOT NULL,
      TrangThai TEXT NOT NULL CHECK (TrangThai IN ('Đang tiếp nhận', 'Đã duyệt bổ sung', 'Đã có trong kho'))
    );
  `);

  const runSync = db.transaction(() => {
    const insertAuthor = db.prepare('INSERT OR IGNORE INTO TACGIA (TenTacGia) VALUES (?)');
    const getAuthorId = db.prepare('SELECT MaTacGia FROM TACGIA WHERE TenTacGia = ?');
    const authorNameBySeedId = new Map(SEED_TACGIA.map((t) => [t.MaTacGia, t.TenTacGia]));

    for (const tg of SEED_TACGIA) {
      insertAuthor.run(tg.TenTacGia);
    }

    const existingBook = db.prepare('SELECT MaSach FROM SACH WHERE MaSach = ?');
    const insertBook = db.prepare(
      `INSERT INTO SACH (MaSach, TenSach, MaTheLoai, NamXuatBan, NhaXuatBan, NgayNhap, TriGia, MaNganh, NgonNgu, NguonTaiLieu, ChuDe, NoiBat, MaKeSach, AnhBia, MoTa)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const updateBookMeta = db.prepare(
      `UPDATE SACH SET MaNganh = ?, NgonNgu = ?, NguonTaiLieu = ?, ChuDe = ?, NoiBat = ?, MaKeSach = ?, AnhBia = ?, MoTa = ? WHERE MaSach = ?`
    );
    const linkBookAuthor = db.prepare(
      'INSERT OR IGNORE INTO SACH_TACGIA (MaSach, MaTacGia) VALUES (?, ?)'
    );

    for (const s of SEED_SACH) {
      const exists = existingBook.get(s.MaSach);
      if (!exists) {
        insertBook.run(
          s.MaSach,
          s.TenSach,
          s.MaTheLoai,
          s.NamXuatBan,
          s.NhaXuatBan,
          s.NgayNhap,
          s.TriGia,
          s.MaNganh || 'CNTT',
          s.NgonNgu || 'Tiếng Việt',
          s.NguonTaiLieu || 'Giáo trình UIT',
          s.ChuDe ?? null,
          s.NoiBat ? 1 : 0,
          s.MaKeSach || 'T1-CNTT-01',
          s.AnhBia ?? null,
          s.MoTa ?? null
        );
        const rels = SEED_SACH_TACGIA.filter((r) => r.MaSach === s.MaSach);
        for (const rel of rels) {
          const name = authorNameBySeedId.get(rel.MaTacGia);
          const row = name ? (getAuthorId.get(name) as { MaTacGia: number } | undefined) : undefined;
          if (row) linkBookAuthor.run(s.MaSach, row.MaTacGia);
        }
      } else {
        updateBookMeta.run(
          s.MaNganh || 'CNTT',
          s.NgonNgu || 'Tiếng Việt',
          s.NguonTaiLieu || 'Giáo trình UIT',
          s.ChuDe ?? null,
          s.NoiBat ? 1 : 0,
          s.MaKeSach || 'T1-CNTT-01',
          s.AnhBia ?? null,
          s.MoTa ?? null,
          s.MaSach
        );
      }
    }

    db.prepare(`DELETE FROM PHONGHOP WHERE MaPhong IN ('P301', 'P302')`).run();
    const roomCount = (db.prepare('SELECT COUNT(*) as cnt FROM PHONGHOP').get() as { cnt: number }).cnt;
    if (roomCount === 0) {
      const insRoom = db.prepare(
        'INSERT INTO PHONGHOP (MaPhong, TenPhong, Tang, SucChua, TrangThietBi, TrangThai) VALUES (?, ?, ?, ?, ?, ?)'
      );
      for (const p of SEED_PHONGHOP) {
        insRoom.run(p.MaPhong, p.TenPhong, p.Tang, p.SucChua, p.TrangThietBi, p.TrangThai);
      }
      const today = todayIsoDate();
      const insBooking = db.prepare(
        `INSERT OR IGNORE INTO DATPHONG (MaDatPhong, MaPhong, NguoiDat, MaSoSV, Email, NgayDat, KhungGio, MucDich, TrangThai)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      );
      for (const b of createSeedBookings(today)) {
        insBooking.run(b.MaDatPhong, b.MaPhong, b.NguoiDat, b.MaSoSV, b.Email, b.NgayDat, b.KhungGio, b.MucDich, b.TrangThai);
      }
      const insReq = db.prepare(
        `INSERT OR IGNORE INTO YEUCAUTAILIEU (MaYeuCau, TenTaiLieu, TacGia, MaNganh, NguoiGui, Email, LyDo, NgayGui, TrangThai)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      );
      for (const y of createSeedBookRequests(today)) {
        insReq.run(y.MaYeuCau, y.TenTaiLieu, y.TacGia, y.MaNganh, y.NguoiGui, y.Email, y.LyDo, y.NgayGui, y.TrangThai);
      }
    }

    // Migrate TAIKHOAN CHECK constraint to allow HEAD_LIBRARIAN and seed phutrach@uit.edu.vn
    const tkSqlRow = db
      .prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'TAIKHOAN'")
      .get() as { sql?: string } | undefined;
    if (tkSqlRow?.sql && !tkSqlRow.sql.includes('HEAD_LIBRARIAN')) {
      db.exec(`
        PRAGMA foreign_keys = OFF;
        CREATE TABLE TAIKHOAN_NEW (
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
        INSERT INTO TAIKHOAN_NEW (MaTaiKhoan, TenDangNhap, MatKhauHash, HoTen, VaiTro, MaDocGia, TrangThai, NgayTao)
        SELECT MaTaiKhoan, TenDangNhap, MatKhauHash, HoTen, VaiTro, MaDocGia, TrangThai, NgayTao FROM TAIKHOAN;
        DROP TABLE TAIKHOAN;
        ALTER TABLE TAIKHOAN_NEW RENAME TO TAIKHOAN;
        PRAGMA foreign_keys = ON;
      `);
    }

    const hasHead = db
      .prepare("SELECT 1 FROM TAIKHOAN WHERE TenDangNhap = 'phutrach@uit.edu.vn'")
      .get();
    if (!hasHead) {
      const seedPass = process.env.DEMO_SEED_PASSWORD || 'UitLib@2026';
      const hash = bcrypt.hashSync(seedPass, 10);
      db.prepare(
        `INSERT INTO TAIKHOAN (TenDangNhap, MatKhauHash, HoTen, VaiTro, MaDocGia, TrangThai, NgayTao)
         VALUES ('phutrach@uit.edu.vn', ?, 'PGS.TS. Trần Minh Tuấn', 'HEAD_LIBRARIAN', NULL, 'ACTIVE', ?)`
      ).run(hash, todayIsoDate());
    }

    // Portal News & Events table (CRUD for ADMIN & HEAD_LIBRARIAN)
    db.exec(`
      CREATE TABLE IF NOT EXISTS PORTAL_TINTUC (
        id TEXT PRIMARY KEY,
        tieuDe TEXT NOT NULL,
        ngayDang TEXT NOT NULL,
        chuyenMuc TEXT NOT NULL,
        hinhAnh TEXT,
        duongDan TEXT,
        tomTat TEXT NOT NULL
      );
    `);
    const newsCount = (db.prepare('SELECT COUNT(*) as cnt FROM PORTAL_TINTUC').get() as { cnt: number }).cnt;
    if (newsCount === 0) {
      const insNews = db.prepare(
        `INSERT OR IGNORE INTO PORTAL_TINTUC (id, tieuDe, ngayDang, chuyenMuc, hinhAnh, duongDan, tomTat)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      );
      for (const n of SEED_TINTUC) {
        insNews.run(n.id, n.tieuDe, n.ngayDang, n.chuyenMuc, n.hinhAnh ?? null, n.duongDan ?? null, n.tomTat);
      }
    }

    // Majors, Thematic Shelves & Portal Metadata (config + guide) in SQLite
    db.exec(`
      CREATE TABLE IF NOT EXISTS NGANHHOC (
        MaNganh TEXT PRIMARY KEY,
        TenNganh TEXT NOT NULL,
        Khoa TEXT NOT NULL,
        BacDaoTao TEXT,
        MauSac TEXT,
        Icon TEXT,
        HinhAnh TEXT,
        ChuongTrinhJson TEXT NOT NULL,
        MoTaNgan TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS TUSACH_CHUYENDE (
        id TEXT PRIMARY KEY,
        tenTuSach TEXT NOT NULL,
        moTa TEXT NOT NULL,
        soTaiLieuMinhHoa INTEGER NOT NULL DEFAULT 0,
        accentColor TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS PORTAL_META (
        key TEXT PRIMARY KEY,
        valueJson TEXT NOT NULL
      );
    `);

    const majorCount = (db.prepare('SELECT COUNT(*) as cnt FROM NGANHHOC').get() as { cnt: number }).cnt;
    if (majorCount === 0) {
      const insMajor = db.prepare(
        `INSERT OR IGNORE INTO NGANHHOC (MaNganh, TenNganh, Khoa, BacDaoTao, MauSac, Icon, HinhAnh, ChuongTrinhJson, MoTaNgan)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      );
      for (const m of SEED_NGANHHOC) {
        insMajor.run(
          m.MaNganh,
          m.TenNganh,
          m.Khoa,
          m.BacDaoTao ?? null,
          m.MauSac ?? null,
          m.Icon ?? null,
          m.HinhAnh ?? null,
          JSON.stringify(m.ChuongTrinh),
          m.MoTaNgan
        );
      }
    }

    const shelfCount = (db.prepare('SELECT COUNT(*) as cnt FROM TUSACH_CHUYENDE').get() as { cnt: number }).cnt;
    if (shelfCount === 0) {
      const insShelf = db.prepare(
        `INSERT OR IGNORE INTO TUSACH_CHUYENDE (id, tenTuSach, moTa, soTaiLieuMinhHoa, accentColor)
         VALUES (?, ?, ?, ?, ?)`
      );
      for (const s of SEED_TUSACHCHUYENDE) {
        insShelf.run(s.id, s.tenTuSach, s.moTa, s.soTaiLieuMinhHoa, s.accentColor);
      }
    }

    const insMeta = db.prepare('INSERT OR IGNORE INTO PORTAL_META (key, valueJson) VALUES (?, ?)');
    insMeta.run('config', JSON.stringify(SEED_CAUHINHCONG));
    insMeta.run('guide', JSON.stringify(SEED_HUONGDAN));
  });

  runSync();
}

