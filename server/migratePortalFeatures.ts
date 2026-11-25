import type Database from 'better-sqlite3';

export function migratePortalFeatures(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS MONHOC (
      MaMon TEXT PRIMARY KEY,
      TenMon TEXT NOT NULL,
      MaNganh TEXT NOT NULL,
      HocKy TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS SACH_MONHOC (
      MaSach TEXT NOT NULL,
      MaMon TEXT NOT NULL,
      BatBuoc INTEGER NOT NULL DEFAULT 1,
      PRIMARY KEY (MaSach, MaMon),
      FOREIGN KEY (MaSach) REFERENCES SACH(MaSach) ON DELETE CASCADE,
      FOREIGN KEY (MaMon) REFERENCES MONHOC(MaMon) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS THONGBAO (
      MaTB INTEGER PRIMARY KEY AUTOINCREMENT,
      MaDocGia TEXT NOT NULL,
      LoaiTB TEXT NOT NULL,
      TieuDe TEXT NOT NULL,
      NoiDung TEXT NOT NULL,
      KenhGui TEXT NOT NULL DEFAULT 'App',
      ThoiGianGui TEXT NOT NULL,
      DaDoc INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (MaDocGia) REFERENCES DOCGIA(MaDocGia) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS LUOTDOCSO (
      MaLuotDoc INTEGER PRIMARY KEY AUTOINCREMENT,
      MaTNS TEXT NOT NULL,
      MaDocGia TEXT NOT NULL,
      ThoiGianMo TEXT NOT NULL,
      HanDRM TEXT NOT NULL,
      FOREIGN KEY (MaTNS) REFERENCES TAINGUYENSO(MaTNS) ON DELETE CASCADE,
      FOREIGN KEY (MaDocGia) REFERENCES DOCGIA(MaDocGia) ON DELETE CASCADE
    );
  `);

  const runSeed = db.transaction(() => {
    const courses: Array<[string, string, string, string]> = [
      ['SE104', 'Nhập môn Công nghệ phần mềm', 'KTPM', 'HK1'],
      ['CS112', 'Phân tích và Thiết kế Thuật toán', 'KHMT', 'HK1'],
      ['NT106', 'Lập trình Mạng căn bản', 'MMT', 'HK2'],
      ['IS201', 'Phân tích và Thiết kế Hệ thống Thông tin', 'HTTT', 'HK1'],
      ['IT001', 'Nhập môn Lập trình', 'CNTT', 'HK1'],
      ['CS221', 'Xử lý Ngôn ngữ Tự nhiên', 'TTNT', 'HK2'],
      ['NT101', 'An toàn Mạng máy tính', 'ATTT', 'HK1'],
      ['DS102', 'Học máy Thống kê', 'KHDL', 'HK2'],
    ];

    const insCourse = db.prepare(
      'INSERT OR IGNORE INTO MONHOC (MaMon, TenMon, MaNganh, HocKy) VALUES (?, ?, ?, ?)'
    );
    for (const [ma, ten, nganh, hk] of courses) {
      insCourse.run(ma, ten, nganh, hk);
    }

    const linkCount = (db.prepare('SELECT COUNT(*) AS cnt FROM SACH_MONHOC').get() as { cnt: number }).cnt;
    if (linkCount === 0) {
      const books = db.prepare('SELECT MaSach, MaNganh FROM SACH ORDER BY MaSach ASC').all() as Array<{
        MaSach: string;
        MaNganh: string;
      }>;
      const insLink = db.prepare(
        'INSERT OR IGNORE INTO SACH_MONHOC (MaSach, MaMon, BatBuoc) VALUES (?, ?, ?)'
      );
      for (const [maMon, _ten, nganh] of courses) {
        const matched = books.filter((b) => b.MaNganh === nganh).slice(0, 4);
        const fallback = matched.length > 0 ? matched : books.slice(0, 3);
        fallback.forEach((b, idx) => {
          insLink.run(b.MaSach, maMon, idx === 0 ? 1 : 0);
        });
      }
    }

    const notifCount = (db.prepare('SELECT COUNT(*) AS cnt FROM THONGBAO').get() as { cnt: number }).cnt;
    if (notifCount === 0) {
      db.prepare(
        `INSERT INTO THONGBAO (MaDocGia, LoaiTB, TieuDe, NoiDung, KenhGui, ThoiGianGui, DaDoc)
         VALUES ('DG001', 'Nhắc hạn', 'Chào mừng đến với Cổng Thư viện Số UIT', 'Bạn có thể sử dụng thẻ QR điện tử, xuất trích dẫn IEEE/BibTeX và đọc tài nguyên số DRM ngay trên cổng.', 'App', ?, 0)`
      ).run(new Date().toISOString());
    }

    const s001 = db.prepare("SELECT MaSach FROM SACH WHERE MaSach = 'S001'").get();
    if (s001) {
      db.prepare(
        `INSERT OR IGNORE INTO TAINGUYENSO (MaTNS, MaSach, DuongDanFile, DinhDangFile, SoLuotMuonDongThoi, ThoiHanDRM_Ngay)
         VALUES ('TNS-S001', 'S001', '/digital-vault/S001.pdf', 'PDF', 5, 7)`
      ).run();
    }
  });

  runSeed();
}
