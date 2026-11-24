import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import {
  calculateReturnFine,
  computeCategoryReportPercentages,
  diffDaysIso,
  isValidIsoDate,
  todayIsoDate,
  validateBookIntake,
  validateBorrowEligibility,
  validateFinePayment,
  validateReaderCard,
  validateRegulationParams,
} from "../../src/lib/businessRules";
import type { AuthUser, UserRole } from "../../src/types/library";
import { requireAuth, requireRole, signToken, type AuthenticatedRequest } from "../auth";
import { db, generateNextId, getSeedPassword, writeAuditLog } from "../db";
import { getThamSo, getBooksWithStatus, sendZodError } from "./shared";

export const router = Router();
/* ===========================
 * PUBLIC OPAC CATALOG SEARCH (GUEST)
 * =========================== */

router.get('/public/sach', (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q : '';
  const maTheLoai = typeof req.query.maTheLoai === 'string' ? req.query.maTheLoai : 'ALL';
  const tinhTrang = typeof req.query.tinhTrang === 'string' ? req.query.tinhTrang : 'ALL';
  const books = getBooksWithStatus({ q, maTheLoai, tinhTrang }).map((b) => ({
    ...b,
    NguoiDangMuon: null,
  }));
  res.json(books);
});

router.get('/public/theloai', (_req, res) => {
  const rows = db
    .prepare(
      `SELECT tl.MaTheLoai, tl.TenTheLoai, COUNT(s.MaSach) AS SoLuongSach
       FROM THELOAI tl
       LEFT JOIN SACH s ON s.MaTheLoai = tl.MaTheLoai
       GROUP BY tl.MaTheLoai, tl.TenTheLoai
       ORDER BY tl.MaTheLoai ASC`
    )
    .all();
  res.json(rows);
});

/* ===========================
 * DASHBOARD SUMMARY (ADMIN & LIBRARIAN)
 * =========================== */

router.get(
  '/dashboard/summary',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN'),
  (_req, res) => {
    const today = todayIsoDate();
    const books = getBooksWithStatus();
    const tongSach = books.length;
    const sachDangMuon = books.filter((b) => b.TinhTrang === 'Đang mượn').length;
    const sachCoSan = tongSach - sachDangMuon;

    const readerStats = db
      .prepare(
        `SELECT
          COUNT(*) AS tongDocGia,
          SUM(CASE WHEN NgayHetHan >= ? THEN 1 ELSE 0 END) AS docGiaConHan,
          COALESCE(SUM(TongNo), 0) AS tongNoHienHanh
         FROM DOCGIA`
      )
      .get(today) as {
      tongDocGia: number;
      docGiaConHan: number;
      tongNoHienHanh: number;
    };

    const overdueCount = (
      db
        .prepare(
          `SELECT COUNT(*) AS cnt
           FROM CHITIETPHIEUMUON ct
           LEFT JOIN CHITIETPHIEUTRA tr ON tr.MaChiTietMuon = ct.MaChiTietMuon
           WHERE tr.MaChiTietTra IS NULL AND ct.HanTra < ?`
        )
        .get(today) as { cnt: number }
    ).cnt;

    const currentYearMonth = today.slice(0, 7);
    const luotMuonThangNay = (
      db
        .prepare(
          `SELECT COUNT(*) AS cnt
           FROM CHITIETPHIEUMUON ct
           JOIN PHIEUMUON pm ON pm.MaPhieuMuon = ct.MaPhieuMuon
           WHERE substr(pm.NgayMuon, 1, 7) = ?`
        )
        .get(currentYearMonth) as { cnt: number }
    ).cnt;

    // Category loan counts (all-time or current month; let's show all-time breakdown for richer overview)
    const rawCat = db
      .prepare(
        `SELECT tl.MaTheLoai, tl.TenTheLoai, COUNT(ct.MaChiTietMuon) AS SoLuotMuon
         FROM THELOAI tl
         LEFT JOIN SACH s ON s.MaTheLoai = tl.MaTheLoai
         LEFT JOIN CHITIETPHIEUMUON ct ON ct.MaSach = s.MaSach
         GROUP BY tl.MaTheLoai, tl.TenTheLoai
         ORDER BY SoLuotMuon DESC, tl.MaTheLoai ASC`
      )
      .all() as { MaTheLoai: string; TenTheLoai: string; SoLuotMuon: number }[];
    const muonTheoTheLoai = computeCategoryReportPercentages(rawCat).rows;

    // Last 6 months borrow vs return trend
    const xuHuongMuon6Thang: { thang: string; soLuotMuon: number; soLuotTra: number }[] = [];
    const curY = Number(today.slice(0, 4));
    const curM = Number(today.slice(5, 7));
    for (let i = 5; i >= 0; i--) {
      const totalM = curY * 12 + (curM - 1) - i;
      const y = Math.floor(totalM / 12);
      const m = (totalM % 12) + 1;
      const ym = `${y}-${String(m).padStart(2, '0')}`;
      const mCnt = (
        db
          .prepare(
            `SELECT COUNT(*) AS cnt FROM CHITIETPHIEUMUON ct
             JOIN PHIEUMUON pm ON pm.MaPhieuMuon = ct.MaPhieuMuon
             WHERE substr(pm.NgayMuon, 1, 7) = ?`
          )
          .get(ym) as { cnt: number }
      ).cnt;
      const rCnt = (
        db
          .prepare(
            `SELECT COUNT(*) AS cnt FROM CHITIETPHIEUTRA ct
             JOIN PHIEUTRA pt ON pt.MaPhieuTra = ct.MaPhieuTra
             WHERE substr(pt.NgayTra, 1, 7) = ?`
          )
          .get(ym) as { cnt: number }
      ).cnt;
      xuHuongMuon6Thang.push({
        thang: `T${m}/${String(y).slice(2)}`,
        soLuotMuon: mCnt,
        soLuotTra: rCnt,
      });
    }

    // Recent transactions across PM, PT, PTH
    const recentLoans = db
      .prepare(
        `SELECT 'MUON' AS loai, pm.MaPhieuMuon AS maPhieu, dg.HoTen AS tenDocGia, pm.NgayMuon AS ngay,
                'Mượn ' || COUNT(ct.MaChiTietMuon) || ' quyển sách' AS moTa
         FROM PHIEUMUON pm
         JOIN DOCGIA dg ON dg.MaDocGia = pm.MaDocGia
         LEFT JOIN CHITIETPHIEUMUON ct ON ct.MaPhieuMuon = pm.MaPhieuMuon
         GROUP BY pm.MaPhieuMuon
         ORDER BY pm.NgayMuon DESC, pm.MaPhieuMuon DESC LIMIT 5`
      )
      .all() as any[];

    const recentReturns = db
      .prepare(
        `SELECT 'TRA' AS loai, pt.MaPhieuTra AS maPhieu, dg.HoTen AS tenDocGia, pt.NgayTra AS ngay,
                CASE WHEN pt.TongTienPhat > 0
                     THEN 'Trả sách (phạt ' || CAST(pt.TongTienPhat AS INTEGER) || ' ₫)'
                     ELSE 'Trả sách đúng hạn' END AS moTa
         FROM PHIEUTRA pt
         JOIN DOCGIA dg ON dg.MaDocGia = pt.MaDocGia
         ORDER BY pt.NgayTra DESC, pt.MaPhieuTra DESC LIMIT 5`
      )
      .all() as any[];

    const recentFines = db
      .prepare(
        `SELECT 'THU_PHAT' AS loai, p.MaPhieuThu AS maPhieu, dg.HoTen AS tenDocGia, p.NgayThu AS ngay,
                'Thu ' || CAST(p.SoTienThu AS INTEGER) || ' ₫ (còn nợ ' || CAST(p.ConLai AS INTEGER) || ' ₫)' AS moTa
         FROM PHIEUTHUTIENPHAT p
         JOIN DOCGIA dg ON dg.MaDocGia = p.MaDocGia
         ORDER BY p.NgayThu DESC, p.MaPhieuThu DESC LIMIT 5`
      )
      .all() as any[];

    const giaoDichGanDay = [...recentLoans, ...recentReturns, ...recentFines]
      .sort((a, b) => (b.ngay > a.ngay ? 1 : b.ngay < a.ngay ? -1 : 0))
      .slice(0, 8);

    res.json({
      tongSach,
      sachCoSan,
      sachDangMuon,
      tongDocGia: readerStats.tongDocGia,
      docGiaConHan: readerStats.docGiaConHan || 0,
      sachQuaHan: overdueCount,
      tongNoHienHanh: readerStats.tongNoHienHanh || 0,
      luotMuonThangNay,
      muonTheoTheLoai,
      xuHuongMuon6Thang,
      giaoDichGanDay,
    });
  }
);

/* ===========================
 * BM2 & BM3: THELOAI, TACGIA, SACH
 * =========================== */

router.get('/theloai', requireAuth, (_req, res) => {
  const rows = db
    .prepare(
      `SELECT tl.MaTheLoai, tl.TenTheLoai, COUNT(s.MaSach) AS SoLuongSach
       FROM THELOAI tl
       LEFT JOIN SACH s ON s.MaTheLoai = tl.MaTheLoai
       GROUP BY tl.MaTheLoai, tl.TenTheLoai
       ORDER BY tl.MaTheLoai ASC`
    )
    .all();
  res.json(rows);
});

router.get('/tacgia', requireAuth, (_req, res) => {
  const rows = db
    .prepare(
      `SELECT tg.*, COUNT(st.MaSach) AS SoLuongSach
       FROM TACGIA tg
       LEFT JOIN SACH_TACGIA st ON st.MaTacGia = tg.MaTacGia
       GROUP BY tg.MaTacGia, tg.TenTacGia
       ORDER BY tg.TenTacGia ASC`
    )
    .all();
  res.json(rows);
});

const authorBodySchema = z.object({
  TenTacGia: z.string().trim().min(2, 'Tên tác giả tối thiểu 2 ký tự.'),
});

router.post(
  '/tacgia',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN', 'CATALOGER'),
  (req: AuthenticatedRequest, res) => {
    const parsed = authorBodySchema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);
    const name = parsed.data.TenTacGia;
    const dup = db.prepare('SELECT MaTacGia FROM TACGIA WHERE LOWER(TenTacGia) = LOWER(?)').get(name);
    if (dup) {
      res.status(400).json({ error: 'Tác giả này đã tồn tại trong hệ thống.' });
      return;
    }
    const info = db.prepare('INSERT INTO TACGIA (TenTacGia) VALUES (?)').run(name);
    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'THEM_TAC_GIA',
      BangTacDong: 'TACGIA',
      ChiTiet: `Thêm tác giả "${name}" (#${info.lastInsertRowid}).`,
    });
    res.status(201).json({ MaTacGia: Number(info.lastInsertRowid), TenTacGia: name, SoLuongSach: 0 });
  }
);

router.put(
  '/tacgia/:id',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN', 'CATALOGER'),
  (req: AuthenticatedRequest, res) => {
    const id = Number(req.params.id);
    const existing = db.prepare('SELECT * FROM TACGIA WHERE MaTacGia = ?').get(id) as
      | { MaTacGia: number; TenTacGia: string }
      | undefined;
    if (!existing) {
      res.status(404).json({ error: 'Không tìm thấy tác giả.' });
      return;
    }
    const parsed = authorBodySchema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);
    const name = parsed.data.TenTacGia;
    const dup = db
      .prepare('SELECT MaTacGia FROM TACGIA WHERE LOWER(TenTacGia) = LOWER(?) AND MaTacGia != ?')
      .get(name, id);
    if (dup) {
      res.status(400).json({ error: 'Tên tác giả đã trùng với tác giả khác.' });
      return;
    }
    db.prepare('UPDATE TACGIA SET TenTacGia = ? WHERE MaTacGia = ?').run(name, id);
    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'CAP_NHAT_TAC_GIA',
      BangTacDong: 'TACGIA',
      ChiTiet: `Đổi tên tác giả #${id}: "${existing.TenTacGia}" → "${name}".`,
    });
    const count = (
      db.prepare('SELECT COUNT(*) AS cnt FROM SACH_TACGIA WHERE MaTacGia = ?').get(id) as { cnt: number }
    ).cnt;
    res.json({ MaTacGia: id, TenTacGia: name, SoLuongSach: count });
  }
);

router.delete(
  '/tacgia/:id',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN'),
  (req: AuthenticatedRequest, res) => {
    const id = Number(req.params.id);
    const existing = db.prepare('SELECT * FROM TACGIA WHERE MaTacGia = ?').get(id) as
      | { MaTacGia: number; TenTacGia: string }
      | undefined;
    if (!existing) {
      res.status(404).json({ error: 'Không tìm thấy tác giả.' });
      return;
    }
    const used = (
      db.prepare('SELECT COUNT(*) AS cnt FROM SACH_TACGIA WHERE MaTacGia = ?').get(id) as { cnt: number }
    ).cnt;
    if (used > 0) {
      res.status(400).json({
        error: `Không thể xóa tác giả đang gắn với ${used} đầu sách. Hãy cập nhật lại sách trước.`,
      });
      return;
    }
    db.prepare('DELETE FROM TACGIA WHERE MaTacGia = ?').run(id);
    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'XOA_TAC_GIA',
      BangTacDong: 'TACGIA',
      ChiTiet: `Xóa tác giả #${id} – "${existing.TenTacGia}".`,
    });
    res.json({ success: true });
  }
);

router.get('/sach', requireAuth, (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q : undefined;
  const maTheLoai = typeof req.query.maTheLoai === 'string' ? req.query.maTheLoai : undefined;
  const tinhTrang = typeof req.query.tinhTrang === 'string' ? req.query.tinhTrang : undefined;
  res.json(getBooksWithStatus({ q, maTheLoai, tinhTrang }));
});

const bookBodySchema = z.object({
  TenSach: z.string().trim().min(2, 'Tên sách phải có ít nhất 2 ký tự.'),
  MaTheLoai: z.string().trim().min(1, 'Vui lòng chọn thể loại sách.'),
  NamXuatBan: z.coerce.number().int('Năm xuất bản phải là số nguyên.'),
  NhaXuatBan: z.string().trim().min(2, 'Vui lòng nhập nhà xuất bản.'),
  NgayNhap: z.string().trim().optional(),
  TriGia: z.coerce.number().min(0, 'Trị giá sách phải lớn hơn hoặc bằng 0.'),
  TacGiaList: z
    .array(z.string().trim().min(1))
    .min(1, 'Vui lòng nhập ít nhất 1 tác giả.'),
});

function upsertBookAuthors(maSach: string, tacGiaNames: string[]): void {
  db.prepare('DELETE FROM SACH_TACGIA WHERE MaSach = ?').run(maSach);
  const findAuthor = db.prepare(
    'SELECT MaTacGia FROM TACGIA WHERE LOWER(TenTacGia) = LOWER(?)'
  );
  const createAuthor = db.prepare('INSERT INTO TACGIA (TenTacGia) VALUES (?)');
  const linkAuthor = db.prepare(
    'INSERT OR IGNORE INTO SACH_TACGIA (MaSach, MaTacGia) VALUES (?, ?)'
  );

  for (const rawName of tacGiaNames) {
    const name = rawName.trim();
    if (!name) continue;
    let row = findAuthor.get(name) as { MaTacGia: number } | undefined;
    if (!row) {
      const info = createAuthor.run(name);
      row = { MaTacGia: Number(info.lastInsertRowid) };
    }
    linkAuthor.run(maSach, row.MaTacGia);
  }
}

router.post(
  '/sach',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN', 'CATALOGER'),
  (req: AuthenticatedRequest, res) => {
    const parsed = bookBodySchema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);

    const data = parsed.data;
    const ngayNhap = data.NgayNhap || todayIsoDate();
    const catExists = db
      .prepare('SELECT 1 FROM THELOAI WHERE MaTheLoai = ?')
      .get(data.MaTheLoai);
    if (!catExists) {
      res.status(400).json({ error: 'Thể loại sách không tồn tại.' });
      return;
    }

    const thamSo = getThamSo();
    const check = validateBookIntake(data.NamXuatBan, ngayNhap, data.TriGia, thamSo);
    if (!check.valid) {
      res.status(400).json({ error: check.error });
      return;
    }

    const maSach = generateNextId('SACH', 'MaSach', 'S');
    const meta = req.body ?? {};
    const tx = db.transaction(() => {
      db.prepare(
        `INSERT INTO SACH (MaSach, TenSach, MaTheLoai, NamXuatBan, NhaXuatBan, NgayNhap, TriGia, MaNganh, NgonNgu, NguonTaiLieu, ChuDe, NoiBat, MaKeSach, AnhBia, MoTa)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        maSach,
        data.TenSach,
        data.MaTheLoai,
        data.NamXuatBan,
        data.NhaXuatBan,
        ngayNhap,
        data.TriGia,
        meta.MaNganh || 'CNTT',
        meta.NgonNgu || 'Tiếng Việt',
        meta.NguonTaiLieu || 'Giáo trình UIT',
        meta.ChuDe ?? null,
        meta.NoiBat ? 1 : 0,
        meta.MaKeSach || 'T1-MOI-01',
        meta.AnhBia ?? null,
        meta.MoTa ?? null
      );
      upsertBookAuthors(maSach, data.TacGiaList);
    });
    tx();

    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'TIEP_NHAN_SACH',
      BangTacDong: 'SACH',
      ChiTiet: `Tiếp nhận sách mới ${maSach} – "${data.TenSach}" (NXB ${data.NamXuatBan}).`,
    });

    const created = getBooksWithStatus().find((b) => b.MaSach === maSach);
    res.status(201).json(created);
  }
);

router.put(
  '/sach/:id',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN', 'CATALOGER'),
  (req: AuthenticatedRequest, res) => {
    const id = req.params.id;
    const existing = db.prepare('SELECT * FROM SACH WHERE MaSach = ?').get(id) as any;
    if (!existing) {
      res.status(404).json({ error: 'Không tìm thấy đầu sách.' });
      return;
    }

    const parsed = bookBodySchema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);
    const data = parsed.data;
    const ngayNhap = data.NgayNhap || existing.NgayNhap;
    const thamSo = getThamSo();

    const check = validateBookIntake(data.NamXuatBan, ngayNhap, data.TriGia, thamSo);
    if (!check.valid) {
      res.status(400).json({ error: check.error });
      return;
    }

    const meta = req.body ?? {};
    const tx = db.transaction(() => {
      db.prepare(
        `UPDATE SACH
         SET TenSach = ?, MaTheLoai = ?, NamXuatBan = ?, NhaXuatBan = ?, NgayNhap = ?, TriGia = ?,
             MaNganh = COALESCE(?, MaNganh), NgonNgu = COALESCE(?, NgonNgu),
             NguonTaiLieu = COALESCE(?, NguonTaiLieu), ChuDe = COALESCE(?, ChuDe),
             MaKeSach = COALESCE(?, MaKeSach), MoTa = COALESCE(?, MoTa)
         WHERE MaSach = ?`
      ).run(
        data.TenSach,
        data.MaTheLoai,
        data.NamXuatBan,
        data.NhaXuatBan,
        ngayNhap,
        data.TriGia,
        meta.MaNganh ?? null,
        meta.NgonNgu ?? null,
        meta.NguonTaiLieu ?? null,
        meta.ChuDe ?? null,
        meta.MaKeSach ?? null,
        meta.MoTa ?? null,
        id
      );
      upsertBookAuthors(id, data.TacGiaList);
    });
    tx();

    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'CAP_NHAT_SACH',
      BangTacDong: 'SACH',
      ChiTiet: `Cập nhật thông tin sách ${id} – "${data.TenSach}".`,
    });

    const updated = getBooksWithStatus().find((b) => b.MaSach === id);
    res.json(updated);
  }
);

router.delete(
  '/sach/:id',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN'),
  (req: AuthenticatedRequest, res) => {
    const id = req.params.id;
    const existing = db.prepare('SELECT * FROM SACH WHERE MaSach = ?').get(id) as any;
    if (!existing) {
      res.status(404).json({ error: 'Không tìm thấy đầu sách.' });
      return;
    }
    const loanCnt = (
      db.prepare('SELECT COUNT(*) AS cnt FROM CHITIETPHIEUMUON WHERE MaSach = ?').get(id) as {
        cnt: number;
      }
    ).cnt;
    if (loanCnt > 0) {
      res.status(400).json({
        error: 'Không thể xóa sách đã từng được mượn để bảo toàn lịch sử lưu thông.',
      });
      return;
    }

    db.prepare('DELETE FROM SACH WHERE MaSach = ?').run(id);
    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'XOA_SACH',
      BangTacDong: 'SACH',
      ChiTiet: `Xóa sách ${id} – "${existing.TenSach}".`,
    });
    res.json({ success: true });
  }
);

