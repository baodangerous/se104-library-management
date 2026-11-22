import bcrypt from 'bcryptjs';
import { Router, type Response } from 'express';
import { z } from 'zod';
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
} from '../src/lib/businessRules';
import type { AuthUser, ThamSo, UserRole } from '../src/types/library';
import {
  requireAuth,
  requireRole,
  signToken,
  type AuthenticatedRequest,
} from './auth';
import { db, generateNextId, getSeedPassword, writeAuditLog } from './db';

export const apiRouter = Router();

function getThamSo(): ThamSo {
  return db.prepare('SELECT * FROM THAMSO WHERE MaThamSo = 1').get() as ThamSo;
}

function getBooksWithStatus(filters?: {
  q?: string;
  maTheLoai?: string;
  tinhTrang?: string;
}) {
  const rows = db
    .prepare(
      `SELECT
        s.MaSach,
        s.TenSach,
        s.MaTheLoai,
        tl.TenTheLoai,
        s.NamXuatBan,
        s.NhaXuatBan,
        s.NgayNhap,
        s.TriGia,
        (
          SELECT GROUP_CONCAT(tg.TenTacGia, ', ')
          FROM SACH_TACGIA st
          JOIN TACGIA tg ON tg.MaTacGia = st.MaTacGia
          WHERE st.MaSach = s.MaSach
        ) AS TacGiaJoined,
        (
          SELECT GROUP_CONCAT(tg.MaTacGia, ',')
          FROM SACH_TACGIA st
          JOIN TACGIA tg ON tg.MaTacGia = st.MaTacGia
          WHERE st.MaSach = s.MaSach
        ) AS TacGiaIdsJoined,
        CASE
          WHEN EXISTS (
            SELECT 1
            FROM CHITIETPHIEUMUON ct
            LEFT JOIN CHITIETPHIEUTRA tr ON tr.MaChiTietMuon = ct.MaChiTietMuon
            WHERE ct.MaSach = s.MaSach AND tr.MaChiTietTra IS NULL
          ) THEN 'Đang mượn'
          ELSE 'Có sẵn'
        END AS TinhTrang,
        (
          SELECT dg.HoTen
          FROM CHITIETPHIEUMUON ct
          JOIN PHIEUMUON pm ON pm.MaPhieuMuon = ct.MaPhieuMuon
          JOIN DOCGIA dg ON dg.MaDocGia = pm.MaDocGia
          LEFT JOIN CHITIETPHIEUTRA tr ON tr.MaChiTietMuon = ct.MaChiTietMuon
          WHERE ct.MaSach = s.MaSach AND tr.MaChiTietTra IS NULL
          LIMIT 1
        ) AS NguoiDangMuon,
        (
          SELECT ct.HanTra
          FROM CHITIETPHIEUMUON ct
          LEFT JOIN CHITIETPHIEUTRA tr ON tr.MaChiTietMuon = ct.MaChiTietMuon
          WHERE ct.MaSach = s.MaSach AND tr.MaChiTietTra IS NULL
          LIMIT 1
        ) AS HanTraHienTai
      FROM SACH s
      JOIN THELOAI tl ON tl.MaTheLoai = s.MaTheLoai
      ORDER BY s.MaSach ASC`
    )
    .all() as Array<{
    MaSach: string;
    TenSach: string;
    MaTheLoai: string;
    TenTheLoai: string;
    NamXuatBan: number;
    NhaXuatBan: string;
    NgayNhap: string;
    TriGia: number;
    TacGiaJoined: string | null;
    TacGiaIdsJoined: string | null;
    TinhTrang: 'Có sẵn' | 'Đang mượn';
    NguoiDangMuon: string | null;
    HanTraHienTai: string | null;
  }>;

  let result = rows.map((r) => ({
    MaSach: r.MaSach,
    TenSach: r.TenSach,
    MaTheLoai: r.MaTheLoai,
    TenTheLoai: r.TenTheLoai,
    NamXuatBan: r.NamXuatBan,
    NhaXuatBan: r.NhaXuatBan,
    NgayNhap: r.NgayNhap,
    TriGia: r.TriGia,
    TacGiaList: r.TacGiaJoined ? r.TacGiaJoined.split(', ') : [],
    TacGiaIds: r.TacGiaIdsJoined
      ? r.TacGiaIdsJoined.split(',').map((n) => Number(n))
      : [],
    TinhTrang: r.TinhTrang,
    NguoiDangMuon: r.NguoiDangMuon,
    HanTraHienTai: r.HanTraHienTai,
  }));

  if (filters?.q && filters.q.trim()) {
    const kw = filters.q.trim().toLowerCase();
    result = result.filter(
      (b) =>
        b.MaSach.toLowerCase().includes(kw) ||
        b.TenSach.toLowerCase().includes(kw) ||
        b.NhaXuatBan.toLowerCase().includes(kw) ||
        b.TenTheLoai.toLowerCase().includes(kw) ||
        b.TacGiaList.some((a) => a.toLowerCase().includes(kw))
    );
  }
  if (filters?.maTheLoai && filters.maTheLoai !== 'ALL') {
    result = result.filter((b) => b.MaTheLoai === filters.maTheLoai);
  }
  if (filters?.tinhTrang && filters.tinhTrang !== 'ALL') {
    result = result.filter((b) => b.TinhTrang === filters.tinhTrang);
  }
  return result;
}

function sendZodError(res: Response, err: z.ZodError) {
  const firstMsg = err.issues[0]?.message || 'Dữ liệu đầu vào không hợp lệ.';
  res.status(400).json({ error: firstMsg });
}

/* ===========================
 * AUTH ROUTES
 * =========================== */

const loginSchema = z.object({
  TenDangNhap: z.string().trim().min(1, 'Vui lòng nhập tên đăng nhập hoặc email UIT.'),
  MatKhau: z.string().min(1, 'Vui lòng nhập mật khẩu.'),
});

apiRouter.post('/auth/login', (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return sendZodError(res, parsed.error);

  const { TenDangNhap, MatKhau } = parsed.data;
  const row = db
    .prepare(
      `SELECT MaTaiKhoan, TenDangNhap, MatKhauHash, HoTen, VaiTro, MaDocGia, TrangThai
       FROM TAIKHOAN WHERE LOWER(TenDangNhap) = LOWER(?)`
    )
    .get(TenDangNhap) as (AuthUser & { MatKhauHash: string }) | undefined;

  if (!row || !bcrypt.compareSync(MatKhau, row.MatKhauHash)) {
    res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không chính xác.' });
    return;
  }
  if (row.TrangThai !== 'ACTIVE') {
    res.status(403).json({ error: 'Tài khoản này đang bị khóa.' });
    return;
  }

  const user: AuthUser = {
    MaTaiKhoan: row.MaTaiKhoan,
    TenDangNhap: row.TenDangNhap,
    HoTen: row.HoTen,
    VaiTro: row.VaiTro,
    MaDocGia: row.MaDocGia,
    TrangThai: row.TrangThai,
  };
  const token = signToken(user);

  writeAuditLog({
    MaTaiKhoan: user.MaTaiKhoan,
    TenDangNhap: user.TenDangNhap,
    VaiTro: user.VaiTro,
    HanhDong: 'DANG_NHAP',
    BangTacDong: 'TAIKHOAN',
    ChiTiet: `Đăng nhập thành công với vai trò ${user.VaiTro}.`,
  });

  res.json({ token, user });
});

apiRouter.post('/auth/demo-login', (req, res) => {
  const roleSchema = z.object({ role: z.enum(['ADMIN', 'LIBRARIAN', 'READER']) });
  const parsed = roleSchema.safeParse(req.body);
  if (!parsed.success) return sendZodError(res, parsed.error);

  const row = db
    .prepare(
      `SELECT MaTaiKhoan, TenDangNhap, HoTen, VaiTro, MaDocGia, TrangThai
       FROM TAIKHOAN WHERE VaiTro = ? AND TrangThai = 'ACTIVE' ORDER BY MaTaiKhoan ASC LIMIT 1`
    )
    .get(parsed.data.role) as AuthUser | undefined;

  if (!row) {
    res.status(404).json({ error: 'Không tìm thấy tài khoản thử nghiệm cho vai trò này.' });
    return;
  }

  const token = signToken(row);
  writeAuditLog({
    MaTaiKhoan: row.MaTaiKhoan,
    TenDangNhap: row.TenDangNhap,
    VaiTro: row.VaiTro,
    HanhDong: 'DANG_NHAP',
    BangTacDong: 'TAIKHOAN',
    ChiTiet: `Đăng nhập nhanh thử nghiệm với vai trò ${row.VaiTro}.`,
  });
  res.json({ token, user: row });
});

apiRouter.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
  res.json({ user: req.user });
});

/* ===========================
 * PUBLIC OPAC CATALOG SEARCH (GUEST)
 * =========================== */

apiRouter.get('/public/sach', (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q : '';
  const maTheLoai = typeof req.query.maTheLoai === 'string' ? req.query.maTheLoai : 'ALL';
  const tinhTrang = typeof req.query.tinhTrang === 'string' ? req.query.tinhTrang : 'ALL';
  const books = getBooksWithStatus({ q, maTheLoai, tinhTrang }).map((b) => ({
    ...b,
    NguoiDangMuon: null,
  }));
  res.json(books);
});

apiRouter.get('/public/theloai', (_req, res) => {
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

apiRouter.get(
  '/dashboard/summary',
  requireAuth,
  requireRole('ADMIN', 'LIBRARIAN'),
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
 * BM1: LOAIDOCGIA & DOCGIA
 * =========================== */

apiRouter.get('/loaidocgia', requireAuth, (_req, res) => {
  const rows = db.prepare('SELECT * FROM LOAIDOCGIA ORDER BY MaLoaiDocGia ASC').all();
  res.json(rows);
});

apiRouter.get(
  '/docgia',
  requireAuth,
  requireRole('ADMIN', 'LIBRARIAN'),
  (req, res) => {
    const today = todayIsoDate();
    const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';
    const loai = typeof req.query.loai === 'string' ? req.query.loai : 'ALL';

    let rows = db
      .prepare(
        `SELECT
          dg.*,
          ldg.TenLoaiDocGia,
          (
            SELECT COUNT(*)
            FROM CHITIETPHIEUMUON ct
            JOIN PHIEUMUON pm ON pm.MaPhieuMuon = ct.MaPhieuMuon
            LEFT JOIN CHITIETPHIEUTRA tr ON tr.MaChiTietMuon = ct.MaChiTietMuon
            WHERE pm.MaDocGia = dg.MaDocGia AND tr.MaChiTietTra IS NULL
          ) AS SoSachDangMuon,
          (
            SELECT COUNT(*)
            FROM CHITIETPHIEUMUON ct
            JOIN PHIEUMUON pm ON pm.MaPhieuMuon = ct.MaPhieuMuon
            LEFT JOIN CHITIETPHIEUTRA tr ON tr.MaChiTietMuon = ct.MaChiTietMuon
            WHERE pm.MaDocGia = dg.MaDocGia AND tr.MaChiTietTra IS NULL AND ct.HanTra < ?
          ) AS SoSachQuaHan
        FROM DOCGIA dg
        JOIN LOAIDOCGIA ldg ON ldg.MaLoaiDocGia = dg.MaLoaiDocGia
        ORDER BY dg.MaDocGia ASC`
      )
      .all(today) as any[];

    if (q) {
      rows = rows.filter(
        (r) =>
          r.MaDocGia.toLowerCase().includes(q) ||
          r.HoTen.toLowerCase().includes(q) ||
          r.Email.toLowerCase().includes(q) ||
          r.DiaChi.toLowerCase().includes(q)
      );
    }
    if (loai && loai !== 'ALL') {
      rows = rows.filter((r) => r.MaLoaiDocGia === loai);
    }
    res.json(rows);
  }
);

const readerBodySchema = z.object({
  HoTen: z.string().trim().min(2, 'Họ tên độc giả phải có ít nhất 2 ký tự.'),
  MaLoaiDocGia: z.string().trim().min(1, 'Vui lòng chọn loại độc giả.'),
  NgaySinh: z.string().trim(),
  DiaChi: z.string().trim().min(2, 'Vui lòng nhập địa chỉ.'),
  Email: z.string().trim().email('Email không đúng định dạng.'),
  NgayLapThe: z.string().trim().optional(),
});

apiRouter.post(
  '/docgia',
  requireAuth,
  requireRole('ADMIN', 'LIBRARIAN'),
  (req: AuthenticatedRequest, res) => {
    const parsed = readerBodySchema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);

    const data = parsed.data;
    const ngayLapThe = data.NgayLapThe || todayIsoDate();
    const loaiExists = db
      .prepare('SELECT 1 FROM LOAIDOCGIA WHERE MaLoaiDocGia = ?')
      .get(data.MaLoaiDocGia);
    if (!loaiExists) {
      res.status(400).json({ error: 'Loại độc giả không tồn tại.' });
      return;
    }

    const thamSo = getThamSo();
    const check = validateReaderCard(data.NgaySinh, ngayLapThe, thamSo);
    if (!check.valid || !check.ngayHetHan) {
      res.status(400).json({ error: check.error });
      return;
    }

    const maDocGia = generateNextId('DOCGIA', 'MaDocGia', 'DG');
    db.prepare(
      `INSERT INTO DOCGIA (MaDocGia, HoTen, MaLoaiDocGia, NgaySinh, DiaChi, Email, NgayLapThe, NgayHetHan, TongNo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`
    ).run(
      maDocGia,
      data.HoTen,
      data.MaLoaiDocGia,
      data.NgaySinh,
      data.DiaChi,
      data.Email,
      ngayLapThe,
      check.ngayHetHan
    );

    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'LAP_THE_DOC_GIA',
      BangTacDong: 'DOCGIA',
      ChiTiet: `Lập thẻ độc giả ${maDocGia} – ${data.HoTen} (Hết hạn: ${check.ngayHetHan}).`,
    });

    const created = db
      .prepare(
        `SELECT dg.*, ldg.TenLoaiDocGia FROM DOCGIA dg
         JOIN LOAIDOCGIA ldg ON ldg.MaLoaiDocGia = dg.MaLoaiDocGia
         WHERE dg.MaDocGia = ?`
      )
      .get(maDocGia);
    res.status(201).json(created);
  }
);

apiRouter.put(
  '/docgia/:id',
  requireAuth,
  requireRole('ADMIN', 'LIBRARIAN'),
  (req: AuthenticatedRequest, res) => {
    const id = req.params.id;
    const existing = db.prepare('SELECT * FROM DOCGIA WHERE MaDocGia = ?').get(id) as any;
    if (!existing) {
      res.status(404).json({ error: 'Không tìm thấy độc giả.' });
      return;
    }

    const parsed = readerBodySchema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);
    const data = parsed.data;
    const thamSo = getThamSo();

    // Validate age at original NgayLapThe; preserve existing NgayHetHan unless NgayLapThe changed
    const ngayLapThe = data.NgayLapThe || existing.NgayLapThe;
    const check = validateReaderCard(data.NgaySinh, ngayLapThe, thamSo);
    if (!check.valid || !check.ngayHetHan) {
      res.status(400).json({ error: check.error });
      return;
    }
    const ngayHetHan =
      ngayLapThe === existing.NgayLapThe ? existing.NgayHetHan : check.ngayHetHan;

    db.prepare(
      `UPDATE DOCGIA
       SET HoTen = ?, MaLoaiDocGia = ?, NgaySinh = ?, DiaChi = ?, Email = ?, NgayLapThe = ?, NgayHetHan = ?
       WHERE MaDocGia = ?`
    ).run(
      data.HoTen,
      data.MaLoaiDocGia,
      data.NgaySinh,
      data.DiaChi,
      data.Email,
      ngayLapThe,
      ngayHetHan,
      id
    );

    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'CAP_NHAT_DOC_GIA',
      BangTacDong: 'DOCGIA',
      ChiTiet: `Cập nhật thông tin độc giả ${id} – ${data.HoTen}.`,
    });

    const updated = db
      .prepare(
        `SELECT dg.*, ldg.TenLoaiDocGia FROM DOCGIA dg
         JOIN LOAIDOCGIA ldg ON ldg.MaLoaiDocGia = dg.MaLoaiDocGia
         WHERE dg.MaDocGia = ?`
      )
      .get(id);
    res.json(updated);
  }
);

apiRouter.delete(
  '/docgia/:id',
  requireAuth,
  requireRole('ADMIN', 'LIBRARIAN'),
  (req: AuthenticatedRequest, res) => {
    const id = req.params.id;
    const existing = db.prepare('SELECT * FROM DOCGIA WHERE MaDocGia = ?').get(id) as any;
    if (!existing) {
      res.status(404).json({ error: 'Không tìm thấy độc giả.' });
      return;
    }

    const loanCnt = (
      db.prepare('SELECT COUNT(*) AS cnt FROM PHIEUMUON WHERE MaDocGia = ?').get(id) as {
        cnt: number;
      }
    ).cnt;
    const fineCnt = (
      db
        .prepare('SELECT COUNT(*) AS cnt FROM PHIEUTHUTIENPHAT WHERE MaDocGia = ?')
        .get(id) as { cnt: number }
    ).cnt;

    if (loanCnt > 0 || fineCnt > 0 || existing.TongNo > 0) {
      res.status(400).json({
        error:
          'Không thể xóa độc giả đã có lịch sử mượn/trả hoặc còn công nợ tiền phạt trong hệ thống.',
      });
      return;
    }

    db.prepare('DELETE FROM DOCGIA WHERE MaDocGia = ?').run(id);
    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'XOA_DOC_GIA',
      BangTacDong: 'DOCGIA',
      ChiTiet: `Xóa thẻ độc giả ${id} – ${existing.HoTen}.`,
    });
    res.json({ success: true });
  }
);

/* ===========================
 * BM2 & BM3: THELOAI, TACGIA, SACH
 * =========================== */

apiRouter.get('/theloai', requireAuth, (_req, res) => {
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

apiRouter.get('/tacgia', requireAuth, (_req, res) => {
  const rows = db.prepare('SELECT * FROM TACGIA ORDER BY TenTacGia ASC').all();
  res.json(rows);
});

apiRouter.get('/sach', requireAuth, (req, res) => {
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

apiRouter.post(
  '/sach',
  requireAuth,
  requireRole('ADMIN', 'LIBRARIAN'),
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
    const tx = db.transaction(() => {
      db.prepare(
        `INSERT INTO SACH (MaSach, TenSach, MaTheLoai, NamXuatBan, NhaXuatBan, NgayNhap, TriGia)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).run(
        maSach,
        data.TenSach,
        data.MaTheLoai,
        data.NamXuatBan,
        data.NhaXuatBan,
        ngayNhap,
        data.TriGia
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

apiRouter.put(
  '/sach/:id',
  requireAuth,
  requireRole('ADMIN', 'LIBRARIAN'),
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

    const tx = db.transaction(() => {
      db.prepare(
        `UPDATE SACH
         SET TenSach = ?, MaTheLoai = ?, NamXuatBan = ?, NhaXuatBan = ?, NgayNhap = ?, TriGia = ?
         WHERE MaSach = ?`
      ).run(
        data.TenSach,
        data.MaTheLoai,
        data.NamXuatBan,
        data.NhaXuatBan,
        ngayNhap,
        data.TriGia,
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

apiRouter.delete(
  '/sach/:id',
  requireAuth,
  requireRole('ADMIN', 'LIBRARIAN'),
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

/* ===========================
 * BM4: PHIEUMUON (CHO MƯỢN SÁCH)
 * =========================== */

apiRouter.get(
  '/phieumuon',
  requireAuth,
  requireRole('ADMIN', 'LIBRARIAN'),
  (_req, res) => {
    const loans = db
      .prepare(
        `SELECT pm.MaPhieuMuon, pm.MaDocGia, dg.HoTen AS HoTenDocGia, pm.NgayMuon
         FROM PHIEUMUON pm
         JOIN DOCGIA dg ON dg.MaDocGia = pm.MaDocGia
         ORDER BY pm.NgayMuon DESC, pm.MaPhieuMuon DESC`
      )
      .all() as any[];

    const detailStmt = db.prepare(
      `SELECT
        ct.MaChiTietMuon,
        ct.MaPhieuMuon,
        ct.MaSach,
        s.TenSach,
        tl.TenTheLoai,
        pm.NgayMuon,
        ct.HanTra,
        pt.NgayTra,
        tr.TienPhat,
        CASE WHEN tr.MaChiTietTra IS NOT NULL THEN 1 ELSE 0 END AS DaTra
       FROM CHITIETPHIEUMUON ct
       JOIN PHIEUMUON pm ON pm.MaPhieuMuon = ct.MaPhieuMuon
       JOIN SACH s ON s.MaSach = ct.MaSach
       JOIN THELOAI tl ON tl.MaTheLoai = s.MaTheLoai
       LEFT JOIN CHITIETPHIEUTRA tr ON tr.MaChiTietMuon = ct.MaChiTietMuon
       LEFT JOIN PHIEUTRA pt ON pt.MaPhieuTra = tr.MaPhieuTra
       WHERE ct.MaPhieuMuon = ?
       ORDER BY ct.MaChiTietMuon ASC`
    );

    const enriched = loans.map((pm) => ({
      ...pm,
      ChiTiet: (detailStmt.all(pm.MaPhieuMuon) as any[]).map((d) => ({
        ...d,
        DaTra: Boolean(d.DaTra),
      })),
    }));
    res.json(enriched);
  }
);

const createLoanSchema = z.object({
  MaDocGia: z.string().trim().min(1, 'Vui lòng chọn độc giả.'),
  NgayMuon: z.string().trim().optional(),
  MaSachList: z.array(z.string().trim().min(1)).min(1, 'Vui lòng chọn ít nhất 1 sách.'),
});

apiRouter.post(
  '/phieumuon',
  requireAuth,
  requireRole('ADMIN', 'LIBRARIAN'),
  (req: AuthenticatedRequest, res) => {
    const parsed = createLoanSchema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);

    const { MaDocGia, MaSachList } = parsed.data;
    const ngayMuon = parsed.data.NgayMuon || todayIsoDate();

    try {
      const result = db.transaction(() => {
        const reader = db
          .prepare('SELECT * FROM DOCGIA WHERE MaDocGia = ?')
          .get(MaDocGia) as any;
        if (!reader) {
          throw new Error('Không tìm thấy độc giả.');
        }

        const activeLoans = db
          .prepare(
            `SELECT ct.MaSach, s.TenSach, ct.HanTra
             FROM CHITIETPHIEUMUON ct
             JOIN PHIEUMUON pm ON pm.MaPhieuMuon = ct.MaPhieuMuon
             JOIN SACH s ON s.MaSach = ct.MaSach
             LEFT JOIN CHITIETPHIEUTRA tr ON tr.MaChiTietMuon = ct.MaChiTietMuon
             WHERE pm.MaDocGia = ? AND tr.MaChiTietTra IS NULL`
          )
          .all(MaDocGia) as { MaSach: string; TenSach: string; HanTra: string }[];

        const allBooks = getBooksWithStatus();
        const bookMap = new Map(allBooks.map((b) => [b.MaSach, b]));
        const requestedBooks: {
          MaSach: string;
          TenSach: string;
          TinhTrang: 'Có sẵn' | 'Đang mượn';
        }[] = [];

        for (const maSach of MaSachList) {
          const found = bookMap.get(maSach);
          if (!found) {
            throw new Error(`Không tìm thấy sách có mã ${maSach}.`);
          }
          requestedBooks.push({
            MaSach: found.MaSach,
            TenSach: found.TenSach,
            TinhTrang: found.TinhTrang,
          });
        }

        const thamSo = getThamSo();
        const check = validateBorrowEligibility({
          ngayMuon,
          ngayLapThe: reader.NgayLapThe,
          ngayHetHan: reader.NgayHetHan,
          activeLoans,
          requestedBooks,
          thamSo,
        });

        if (!check.valid || !check.hanTra) {
          throw new Error(check.error || 'Không đủ điều kiện cho mượn sách.');
        }

        const maPhieuMuon = generateNextId('PHIEUMUON', 'MaPhieuMuon', 'PM');
        db.prepare(
          'INSERT INTO PHIEUMUON (MaPhieuMuon, MaDocGia, NgayMuon) VALUES (?, ?, ?)'
        ).run(maPhieuMuon, MaDocGia, ngayMuon);

        const insertDetail = db.prepare(
          'INSERT INTO CHITIETPHIEUMUON (MaPhieuMuon, MaSach, HanTra) VALUES (?, ?, ?)'
        );
        for (const book of requestedBooks) {
          insertDetail.run(maPhieuMuon, book.MaSach, check.hanTra);
        }

        writeAuditLog({
          MaTaiKhoan: req.user!.MaTaiKhoan,
          TenDangNhap: req.user!.TenDangNhap,
          VaiTro: req.user!.VaiTro,
          HanhDong: 'LAP_PHIEU_MUON',
          BangTacDong: 'PHIEUMUON',
          ChiTiet: `Lập phiếu mượn ${maPhieuMuon} cho ${reader.HoTen} (${MaDocGia}): ${requestedBooks.length} sách, hạn trả ${check.hanTra}.`,
        });

        return {
          MaPhieuMuon: maPhieuMuon,
          MaDocGia,
          HoTenDocGia: reader.HoTen,
          NgayMuon: ngayMuon,
          HanTra: check.hanTra,
          SoLuongSach: requestedBooks.length,
        };
      })();

      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err?.message || 'Không thể lập phiếu mượn.' });
    }
  }
);

/* ===========================
 * BM5: PHIEUTRA (NHẬN TRẢ SÁCH)
 * =========================== */

apiRouter.get(
  '/docgia/:id/dang-muon',
  requireAuth,
  requireRole('ADMIN', 'LIBRARIAN'),
  (req, res) => {
    const rows = db
      .prepare(
        `SELECT
          ct.MaChiTietMuon,
          ct.MaPhieuMuon,
          ct.MaSach,
          s.TenSach,
          tl.TenTheLoai,
          pm.NgayMuon,
          ct.HanTra
         FROM CHITIETPHIEUMUON ct
         JOIN PHIEUMUON pm ON pm.MaPhieuMuon = ct.MaPhieuMuon
         JOIN SACH s ON s.MaSach = ct.MaSach
         JOIN THELOAI tl ON tl.MaTheLoai = s.MaTheLoai
         LEFT JOIN CHITIETPHIEUTRA tr ON tr.MaChiTietMuon = ct.MaChiTietMuon
         WHERE pm.MaDocGia = ? AND tr.MaChiTietTra IS NULL
         ORDER BY ct.HanTra ASC`
      )
      .all(req.params.id);
    res.json(rows);
  }
);

apiRouter.get(
  '/phieutra',
  requireAuth,
  requireRole('ADMIN', 'LIBRARIAN'),
  (_req, res) => {
    const returns = db
      .prepare(
        `SELECT pt.MaPhieuTra, pt.MaDocGia, dg.HoTen AS HoTenDocGia, pt.NgayTra, pt.TongTienPhat
         FROM PHIEUTRA pt
         JOIN DOCGIA dg ON dg.MaDocGia = pt.MaDocGia
         ORDER BY pt.NgayTra DESC, pt.MaPhieuTra DESC`
      )
      .all() as any[];

    const detailStmt = db.prepare(
      `SELECT
        tr.MaChiTietTra,
        tr.MaPhieuTra,
        tr.MaChiTietMuon,
        ct.MaSach,
        s.TenSach,
        pm.NgayMuon,
        ct.HanTra,
        tr.TienPhat
       FROM CHITIETPHIEUTRA tr
       JOIN CHITIETPHIEUMUON ct ON ct.MaChiTietMuon = tr.MaChiTietMuon
       JOIN PHIEUMUON pm ON pm.MaPhieuMuon = ct.MaPhieuMuon
       JOIN SACH s ON s.MaSach = ct.MaSach
       WHERE tr.MaPhieuTra = ?`
    );

    const enriched = returns.map((pt) => ({
      ...pt,
      ChiTiet: (detailStmt.all(pt.MaPhieuTra) as any[]).map((d) => ({
        ...d,
        SoNgayTraTre: Math.max(0, diffDaysIso(pt.NgayTra, d.HanTra)),
      })),
    }));
    res.json(enriched);
  }
);

const createReturnSchema = z.object({
  MaDocGia: z.string().trim().min(1, 'Vui lòng chọn độc giả.'),
  NgayTra: z.string().trim().optional(),
  MaChiTietMuonList: z
    .array(z.coerce.number().int().positive())
    .min(1, 'Vui lòng chọn ít nhất 1 sách cần trả.'),
});

apiRouter.post(
  '/phieutra',
  requireAuth,
  requireRole('ADMIN', 'LIBRARIAN'),
  (req: AuthenticatedRequest, res) => {
    const parsed = createReturnSchema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);

    const { MaDocGia, MaChiTietMuonList } = parsed.data;
    const ngayTra = parsed.data.NgayTra || todayIsoDate();
    if (!isValidIsoDate(ngayTra)) {
      res.status(400).json({ error: 'Ngày trả không hợp lệ.' });
      return;
    }

    try {
      const result = db.transaction(() => {
        const reader = db
          .prepare('SELECT * FROM DOCGIA WHERE MaDocGia = ?')
          .get(MaDocGia) as any;
        if (!reader) throw new Error('Không tìm thấy độc giả.');

        const uniqueIds = Array.from(new Set(MaChiTietMuonList));
        const itemsToReturn: {
          MaChiTietMuon: number;
          MaSach: string;
          TenSach: string;
          NgayMuon: string;
          HanTra: string;
          SoNgayTraTre: number;
          TienPhat: number;
        }[] = [];

        let tongTienPhat = 0;

        for (const maCTM of uniqueIds) {
          const row = db
            .prepare(
              `SELECT ct.MaChiTietMuon, ct.MaSach, s.TenSach, pm.MaDocGia, pm.NgayMuon, ct.HanTra,
                      tr.MaChiTietTra
               FROM CHITIETPHIEUMUON ct
               JOIN PHIEUMUON pm ON pm.MaPhieuMuon = ct.MaPhieuMuon
               JOIN SACH s ON s.MaSach = ct.MaSach
               LEFT JOIN CHITIETPHIEUTRA tr ON tr.MaChiTietMuon = ct.MaChiTietMuon
               WHERE ct.MaChiTietMuon = ?`
            )
            .get(maCTM) as any;

          if (!row) throw new Error(`Không tìm thấy chi tiết mượn #${maCTM}.`);
          if (row.MaDocGia !== MaDocGia) {
            throw new Error(`Sách "${row.TenSach}" không thuộc phiếu mượn của độc giả này.`);
          }
          if (row.MaChiTietTra !== null) {
            throw new Error(`Sách "${row.TenSach}" đã được trả trước đó.`);
          }
          if (diffDaysIso(ngayTra, row.NgayMuon) < 0) {
            throw new Error(
              `Ngày trả (${ngayTra}) không được nhỏ hơn ngày mượn (${row.NgayMuon}) của sách "${row.TenSach}".`
            );
          }

          const { soNgayTraTre, tienPhat } = calculateReturnFine(row.HanTra, ngayTra);
          tongTienPhat += tienPhat;
          itemsToReturn.push({
            MaChiTietMuon: row.MaChiTietMuon,
            MaSach: row.MaSach,
            TenSach: row.TenSach,
            NgayMuon: row.NgayMuon,
            HanTra: row.HanTra,
            SoNgayTraTre: soNgayTraTre,
            TienPhat: tienPhat,
          });
        }

        const maPhieuTra = generateNextId('PHIEUTRA', 'MaPhieuTra', 'PT');
        db.prepare(
          'INSERT INTO PHIEUTRA (MaPhieuTra, MaDocGia, NgayTra, TongTienPhat) VALUES (?, ?, ?, ?)'
        ).run(maPhieuTra, MaDocGia, ngayTra, tongTienPhat);

        const insertCTPT = db.prepare(
          'INSERT INTO CHITIETPHIEUTRA (MaPhieuTra, MaChiTietMuon, TienPhat) VALUES (?, ?, ?)'
        );
        for (const item of itemsToReturn) {
          insertCTPT.run(maPhieuTra, item.MaChiTietMuon, item.TienPhat);
        }

        // Accumulate fine into DOCGIA.TongNo in the same ACID transaction
        const newTongNo = reader.TongNo + tongTienPhat;
        db.prepare('UPDATE DOCGIA SET TongNo = ? WHERE MaDocGia = ?').run(
          newTongNo,
          MaDocGia
        );

        writeAuditLog({
          MaTaiKhoan: req.user!.MaTaiKhoan,
          TenDangNhap: req.user!.TenDangNhap,
          VaiTro: req.user!.VaiTro,
          HanhDong: 'LAP_PHIEU_TRA',
          BangTacDong: 'PHIEUTRA',
          ChiTiet: `Nhận trả ${itemsToReturn.length} sách (${maPhieuTra}) từ ${reader.HoTen} (${MaDocGia}). Tiền phạt kỳ này: ${tongTienPhat.toLocaleString('vi-VN')} ₫; Tổng nợ mới: ${newTongNo.toLocaleString('vi-VN')} ₫.`,
        });

        return {
          MaPhieuTra: maPhieuTra,
          MaDocGia,
          HoTenDocGia: reader.HoTen,
          NgayTra: ngayTra,
          TongTienPhat: tongTienPhat,
          TongNoMoi: newTongNo,
          ChiTiet: itemsToReturn,
        };
      })();

      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err?.message || 'Không thể lập phiếu trả sách.' });
    }
  }
);

/* ===========================
 * BM6: PHIEUTHUTIENPHAT (THU TIỀN PHẠT)
 * =========================== */

apiRouter.get(
  '/phieuthu',
  requireAuth,
  requireRole('ADMIN', 'LIBRARIAN'),
  (_req, res) => {
    const rows = db
      .prepare(
        `SELECT p.*, dg.HoTen AS HoTenDocGia
         FROM PHIEUTHUTIENPHAT p
         JOIN DOCGIA dg ON dg.MaDocGia = p.MaDocGia
         ORDER BY p.NgayThu DESC, p.MaPhieuThu DESC`
      )
      .all();
    res.json(rows);
  }
);

const createFineReceiptSchema = z.object({
  MaDocGia: z.string().trim().min(1, 'Vui lòng chọn độc giả.'),
  NgayThu: z.string().trim().optional(),
  SoTienThu: z.coerce.number().positive('Số tiền thu phải lớn hơn 0.'),
});

apiRouter.post(
  '/phieuthu',
  requireAuth,
  requireRole('ADMIN', 'LIBRARIAN'),
  (req: AuthenticatedRequest, res) => {
    const parsed = createFineReceiptSchema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);

    const { MaDocGia, SoTienThu } = parsed.data;
    const ngayThu = parsed.data.NgayThu || todayIsoDate();
    if (!isValidIsoDate(ngayThu)) {
      res.status(400).json({ error: 'Ngày thu không hợp lệ.' });
      return;
    }

    try {
      const result = db.transaction(() => {
        const reader = db
          .prepare('SELECT * FROM DOCGIA WHERE MaDocGia = ?')
          .get(MaDocGia) as any;
        if (!reader) throw new Error('Không tìm thấy độc giả.');

        const check = validateFinePayment(reader.TongNo, SoTienThu);
        if (!check.valid || check.conLai === undefined) {
          throw new Error(check.error);
        }

        const maPhieuThu = generateNextId('PHIEUTHUTIENPHAT', 'MaPhieuThu', 'PTH');
        db.prepare(
          `INSERT INTO PHIEUTHUTIENPHAT (MaPhieuThu, MaDocGia, NgayThu, TongNoTruocThu, SoTienThu, ConLai)
           VALUES (?, ?, ?, ?, ?, ?)`
        ).run(maPhieuThu, MaDocGia, ngayThu, reader.TongNo, SoTienThu, check.conLai);

        db.prepare('UPDATE DOCGIA SET TongNo = ? WHERE MaDocGia = ?').run(
          check.conLai,
          MaDocGia
        );

        writeAuditLog({
          MaTaiKhoan: req.user!.MaTaiKhoan,
          TenDangNhap: req.user!.TenDangNhap,
          VaiTro: req.user!.VaiTro,
          HanhDong: 'THU_TIEN_PHAT',
          BangTacDong: 'PHIEUTHUTIENPHAT',
          ChiTiet: `Lập phiếu thu ${maPhieuThu} cho ${reader.HoTen} (${MaDocGia}): thu ${SoTienThu.toLocaleString('vi-VN')} ₫, còn lại ${check.conLai.toLocaleString('vi-VN')} ₫.`,
        });

        return {
          MaPhieuThu: maPhieuThu,
          MaDocGia,
          HoTenDocGia: reader.HoTen,
          NgayThu: ngayThu,
          TongNoTruocThu: reader.TongNo,
          SoTienThu,
          ConLai: check.conLai,
        };
      })();

      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err?.message || 'Không thể lập phiếu thu tiền phạt.' });
    }
  }
);

/* ===========================
 * BM7.1 & BM7.2: BÁO CÁO THỐNG KÊ
 * =========================== */

apiRouter.get(
  '/baocao/bm71',
  requireAuth,
  requireRole('ADMIN', 'LIBRARIAN'),
  (req, res) => {
    const today = todayIsoDate();
    const thang = Number(req.query.thang) || Number(today.slice(5, 7));
    const nam = Number(req.query.nam) || Number(today.slice(0, 4));
    if (!Number.isInteger(thang) || thang < 1 || thang > 12) {
      res.status(400).json({ error: 'Tháng báo cáo không hợp lệ (1–12).' });
      return;
    }
    if (!Number.isInteger(nam) || nam < 2000 || nam > 2100) {
      res.status(400).json({ error: 'Năm báo cáo không hợp lệ.' });
      return;
    }

    const ym = `${nam}-${String(thang).padStart(2, '0')}`;
    const rawRows = db
      .prepare(
        `SELECT
          tl.MaTheLoai,
          tl.TenTheLoai,
          COALESCE(COUNT(m.MaChiTietMuon), 0) AS SoLuotMuon
         FROM THELOAI tl
         LEFT JOIN SACH s ON s.MaTheLoai = tl.MaTheLoai
         LEFT JOIN (
           SELECT ct.MaChiTietMuon, ct.MaSach
           FROM CHITIETPHIEUMUON ct
           JOIN PHIEUMUON pm ON pm.MaPhieuMuon = ct.MaPhieuMuon
           WHERE substr(pm.NgayMuon, 1, 7) = ?
         ) m ON m.MaSach = s.MaSach
         GROUP BY tl.MaTheLoai, tl.TenTheLoai
         ORDER BY SoLuotMuon DESC, tl.MaTheLoai ASC`
      )
      .all(ym) as { MaTheLoai: string; TenTheLoai: string; SoLuotMuon: number }[];

    const computed = computeCategoryReportPercentages(rawRows);
    res.json({
      thang,
      nam,
      tongSoLuotMuon: computed.tongSoLuotMuon,
      rows: computed.rows,
    });
  }
);

apiRouter.get(
  '/baocao/bm72',
  requireAuth,
  requireRole('ADMIN', 'LIBRARIAN'),
  (req, res) => {
    const ngay =
      typeof req.query.ngay === 'string' && isValidIsoDate(req.query.ngay)
        ? req.query.ngay
        : todayIsoDate();

    // Books currently overdue (unreturned as of `ngay` with HanTra < ngay) OR returned late on/before `ngay`
    // Specifically: unreturned and overdue on `ngay`, PLUS returned late on `ngay`
    const unreturnedOverdue = db
      .prepare(
        `SELECT
          ct.MaChiTietMuon,
          ct.MaSach,
          s.TenSach,
          pm.MaDocGia,
          dg.HoTen AS HoTenDocGia,
          pm.NgayMuon,
          ct.HanTra,
          NULL AS NgayTra
         FROM CHITIETPHIEUMUON ct
         JOIN PHIEUMUON pm ON pm.MaPhieuMuon = ct.MaPhieuMuon
         JOIN SACH s ON s.MaSach = ct.MaSach
         JOIN DOCGIA dg ON dg.MaDocGia = pm.MaDocGia
         LEFT JOIN CHITIETPHIEUTRA tr ON tr.MaChiTietMuon = ct.MaChiTietMuon
         WHERE tr.MaChiTietTra IS NULL AND ct.HanTra < ?`
      )
      .all(ngay) as any[];

    const returnedLateOnDate = db
      .prepare(
        `SELECT
          ct.MaChiTietMuon,
          ct.MaSach,
          s.TenSach,
          pm.MaDocGia,
          dg.HoTen AS HoTenDocGia,
          pm.NgayMuon,
          ct.HanTra,
          pt.NgayTra,
          tr.TienPhat
         FROM CHITIETPHIEUTRA tr
         JOIN PHIEUTRA pt ON pt.MaPhieuTra = tr.MaPhieuTra
         JOIN CHITIETPHIEUMUON ct ON ct.MaChiTietMuon = tr.MaChiTietMuon
         JOIN PHIEUMUON pm ON pm.MaPhieuMuon = ct.MaPhieuMuon
         JOIN SACH s ON s.MaSach = ct.MaSach
         JOIN DOCGIA dg ON dg.MaDocGia = pm.MaDocGia
         WHERE pt.NgayTra <= ? AND tr.TienPhat > 0
         ORDER BY pt.NgayTra DESC`
      )
      .all(ngay) as any[];

    const rows = [
      ...unreturnedOverdue.map((r) => {
        const { soNgayTraTre, tienPhat } = calculateReturnFine(r.HanTra, ngay);
        return {
          ...r,
          SoNgayTraTre: soNgayTraTre,
          TienPhatDuKien: tienPhat,
          TrangThai: 'Chưa trả (Quá hạn)' as const,
        };
      }),
      ...returnedLateOnDate.map((r) => {
        const { soNgayTraTre } = calculateReturnFine(r.HanTra, r.NgayTra);
        return {
          MaChiTietMuon: r.MaChiTietMuon,
          MaSach: r.MaSach,
          TenSach: r.TenSach,
          MaDocGia: r.MaDocGia,
          HoTenDocGia: r.HoTenDocGia,
          NgayMuon: r.NgayMuon,
          HanTra: r.HanTra,
          NgayTra: r.NgayTra,
          SoNgayTraTre: soNgayTraTre,
          TienPhatDuKien: r.TienPhat,
          TrangThai: 'Đã trả trễ' as const,
        };
      }),
    ].sort((a, b) => b.SoNgayTraTre - a.SoNgayTraTre);

    const tongTienPhat = rows.reduce((s, r) => s + r.TienPhatDuKien, 0);
    res.json({
      ngay,
      tongSoSachTre: rows.length,
      tongTienPhat,
      rows,
    });
  }
);

/* ===========================
 * QĐ8: THAMSO & THELOAI (ADMIN)
 * =========================== */

apiRouter.get('/thamso', requireAuth, (_req, res) => {
  res.json(getThamSo());
});

const thamSoSchema = z.object({
  TuoiToiThieu: z.coerce.number().int(),
  TuoiToiDa: z.coerce.number().int(),
  ThoiHanThe: z.coerce.number().int(),
  KhoangCachNamXuatBan: z.coerce.number().int(),
  SoSachMuonToiDa: z.coerce.number().int(),
  SoNgayMuonToiDa: z.coerce.number().int(),
});

apiRouter.put(
  '/thamso',
  requireAuth,
  requireRole('ADMIN'),
  (req: AuthenticatedRequest, res) => {
    const parsed = thamSoSchema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);

    const check = validateRegulationParams(parsed.data);
    if (!check.valid) {
      res.status(400).json({ error: check.error });
      return;
    }

    const d = parsed.data;
    // Only update MaThamSo = 1; never modify existing DOCGIA.NgayHetHan or CHITIETPHIEUMUON.HanTra
    db.prepare(
      `UPDATE THAMSO
       SET TuoiToiThieu = ?, TuoiToiDa = ?, ThoiHanThe = ?,
           KhoangCachNamXuatBan = ?, SoSachMuonToiDa = ?, SoNgayMuonToiDa = ?
       WHERE MaThamSo = 1`
    ).run(
      d.TuoiToiThieu,
      d.TuoiToiDa,
      d.ThoiHanThe,
      d.KhoangCachNamXuatBan,
      d.SoSachMuonToiDa,
      d.SoNgayMuonToiDa
    );

    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'THAY_DOI_QUY_DINH',
      BangTacDong: 'THAMSO',
      ChiTiet: `Cập nhật QĐ8: Tuổi [${d.TuoiToiThieu}-${d.TuoiToiDa}], Hạn thẻ ${d.ThoiHanThe} tháng, NXB <= ${d.KhoangCachNamXuatBan} năm, Mượn tối đa ${d.SoSachMuonToiDa} sách / ${d.SoNgayMuonToiDa} ngày.`,
    });

    res.json(getThamSo());
  }
);

const categorySchema = z.object({
  MaTheLoai: z
    .string()
    .trim()
    .min(1, 'Mã thể loại không được để trống.')
    .max(10, 'Mã thể loại tối đa 10 ký tự.')
    .regex(/^[A-Za-z0-9_-]+$/, 'Mã thể loại chỉ gồm chữ cái không dấu và số.'),
  TenTheLoai: z.string().trim().min(2, 'Tên thể loại phải có ít nhất 2 ký tự.'),
});

apiRouter.post(
  '/theloai',
  requireAuth,
  requireRole('ADMIN'),
  (req: AuthenticatedRequest, res) => {
    const parsed = categorySchema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);

    const code = parsed.data.MaTheLoai.toUpperCase();
    const exists = db.prepare('SELECT 1 FROM THELOAI WHERE MaTheLoai = ?').get(code);
    if (exists) {
      res.status(400).json({ error: `Mã thể loại "${code}" đã tồn tại.` });
      return;
    }

    db.prepare('INSERT INTO THELOAI (MaTheLoai, TenTheLoai) VALUES (?, ?)').run(
      code,
      parsed.data.TenTheLoai
    );

    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'THEM_THE_LOAI',
      BangTacDong: 'THELOAI',
      ChiTiet: `Thêm thể loại sách ${code} – ${parsed.data.TenTheLoai}.`,
    });

    res.status(201).json({ MaTheLoai: code, TenTheLoai: parsed.data.TenTheLoai, SoLuongSach: 0 });
  }
);

apiRouter.put(
  '/theloai/:id',
  requireAuth,
  requireRole('ADMIN'),
  (req: AuthenticatedRequest, res) => {
    const id = req.params.id;
    const schema = z.object({
      TenTheLoai: z.string().trim().min(2, 'Tên thể loại phải có ít nhất 2 ký tự.'),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);

    const exists = db.prepare('SELECT 1 FROM THELOAI WHERE MaTheLoai = ?').get(id);
    if (!exists) {
      res.status(404).json({ error: 'Không tìm thấy thể loại.' });
      return;
    }

    db.prepare('UPDATE THELOAI SET TenTheLoai = ? WHERE MaTheLoai = ?').run(
      parsed.data.TenTheLoai,
      id
    );
    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'CAP_NHAT_THE_LOAI',
      BangTacDong: 'THELOAI',
      ChiTiet: `Đổi tên thể loại ${id} thành "${parsed.data.TenTheLoai}".`,
    });
    res.json({ MaTheLoai: id, TenTheLoai: parsed.data.TenTheLoai });
  }
);

apiRouter.delete(
  '/theloai/:id',
  requireAuth,
  requireRole('ADMIN'),
  (req: AuthenticatedRequest, res) => {
    const id = req.params.id;
    const existing = db
      .prepare('SELECT * FROM THELOAI WHERE MaTheLoai = ?')
      .get(id) as any;
    if (!existing) {
      res.status(404).json({ error: 'Không tìm thấy thể loại.' });
      return;
    }

    // QĐ8: Strictly forbid deleting a category that has books
    const bookCnt = (
      db.prepare('SELECT COUNT(*) AS cnt FROM SACH WHERE MaTheLoai = ?').get(id) as {
        cnt: number;
      }
    ).cnt;
    if (bookCnt > 0) {
      res.status(400).json({
        error: `Không thể xóa thể loại "${existing.TenTheLoai}" vì đang có ${bookCnt} đầu sách thuộc thể loại này (QĐ8).`,
      });
      return;
    }

    db.prepare('DELETE FROM THELOAI WHERE MaTheLoai = ?').run(id);
    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'XOA_THE_LOAI',
      BangTacDong: 'THELOAI',
      ChiTiet: `Xóa thể loại sách ${id} – ${existing.TenTheLoai}.`,
    });
    res.json({ success: true });
  }
);

/* ===========================
 * ADMIN: TAIKHOAN, NHATKY, BACKUP/RESTORE
 * =========================== */

apiRouter.get('/taikhoan', requireAuth, requireRole('ADMIN'), (_req, res) => {
  const rows = db
    .prepare(
      `SELECT MaTaiKhoan, TenDangNhap, HoTen, VaiTro, MaDocGia, TrangThai, NgayTao
       FROM TAIKHOAN ORDER BY MaTaiKhoan ASC`
    )
    .all();
  res.json(rows);
});

const createAccountSchema = z.object({
  TenDangNhap: z.string().trim().min(3, 'Tên đăng nhập tối thiểu 3 ký tự.'),
  MatKhau: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự.'),
  HoTen: z.string().trim().min(2, 'Họ tên tối thiểu 2 ký tự.'),
  VaiTro: z.enum(['ADMIN', 'LIBRARIAN', 'READER']),
  MaDocGia: z.string().trim().nullable().optional(),
});

apiRouter.post(
  '/taikhoan',
  requireAuth,
  requireRole('ADMIN'),
  (req: AuthenticatedRequest, res) => {
    const parsed = createAccountSchema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);

    const d = parsed.data;
    const exists = db
      .prepare('SELECT 1 FROM TAIKHOAN WHERE LOWER(TenDangNhap) = LOWER(?)')
      .get(d.TenDangNhap);
    if (exists) {
      res.status(400).json({ error: 'Tên đăng nhập đã tồn tại trong hệ thống.' });
      return;
    }

    const maDocGia = d.VaiTro === 'READER' && d.MaDocGia ? d.MaDocGia : null;
    if (maDocGia) {
      const dgExists = db.prepare('SELECT 1 FROM DOCGIA WHERE MaDocGia = ?').get(maDocGia);
      if (!dgExists) {
        res.status(400).json({ error: 'Mã độc giả liên kết không tồn tại.' });
        return;
      }
    }

    const hash = bcrypt.hashSync(d.MatKhau, 10);
    const info = db
      .prepare(
        `INSERT INTO TAIKHOAN (TenDangNhap, MatKhauHash, HoTen, VaiTro, MaDocGia, TrangThai, NgayTao)
         VALUES (?, ?, ?, ?, ?, 'ACTIVE', ?)`
      )
      .run(d.TenDangNhap, hash, d.HoTen, d.VaiTro, maDocGia, todayIsoDate());

    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'TAO_TAI_KHOAN',
      BangTacDong: 'TAIKHOAN',
      ChiTiet: `Tạo tài khoản ${d.TenDangNhap} với vai trò ${d.VaiTro}.`,
    });

    const created = db
      .prepare(
        `SELECT MaTaiKhoan, TenDangNhap, HoTen, VaiTro, MaDocGia, TrangThai, NgayTao
         FROM TAIKHOAN WHERE MaTaiKhoan = ?`
      )
      .get(info.lastInsertRowid);
    res.status(201).json(created);
  }
);

const updateAccountSchema = z.object({
  HoTen: z.string().trim().min(2).optional(),
  VaiTro: z.enum(['ADMIN', 'LIBRARIAN', 'READER']).optional(),
  MaDocGia: z.string().trim().nullable().optional(),
  TrangThai: z.enum(['ACTIVE', 'LOCKED']).optional(),
  MatKhauMoi: z.string().min(6, 'Mật khẩu mới tối thiểu 6 ký tự.').optional(),
});

apiRouter.put(
  '/taikhoan/:id',
  requireAuth,
  requireRole('ADMIN'),
  (req: AuthenticatedRequest, res) => {
    const id = Number(req.params.id);
    const existing = db
      .prepare('SELECT * FROM TAIKHOAN WHERE MaTaiKhoan = ?')
      .get(id) as any;
    if (!existing) {
      res.status(404).json({ error: 'Không tìm thấy tài khoản.' });
      return;
    }

    const parsed = updateAccountSchema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);
    const d = parsed.data;

    if (id === req.user!.MaTaiKhoan && d.TrangThai === 'LOCKED') {
      res.status(400).json({ error: 'Không thể tự khóa tài khoản Quản trị viên đang đăng nhập.' });
      return;
    }
    if (id === req.user!.MaTaiKhoan && d.VaiTro && d.VaiTro !== 'ADMIN') {
      res.status(400).json({ error: 'Không thể tự hạ quyền tài khoản Quản trị viên đang đăng nhập.' });
      return;
    }

    const nextHoTen = d.HoTen ?? existing.HoTen;
    const nextVaiTro: UserRole = d.VaiTro ?? existing.VaiTro;
    const nextTrangThai = d.TrangThai ?? existing.TrangThai;
    const nextMaDocGia =
      nextVaiTro === 'READER'
        ? d.MaDocGia !== undefined
          ? d.MaDocGia
          : existing.MaDocGia
        : null;
    const nextHash = d.MatKhauMoi
      ? bcrypt.hashSync(d.MatKhauMoi, 10)
      : existing.MatKhauHash;

    db.prepare(
      `UPDATE TAIKHOAN
       SET HoTen = ?, VaiTro = ?, MaDocGia = ?, TrangThai = ?, MatKhauHash = ?
       WHERE MaTaiKhoan = ?`
    ).run(nextHoTen, nextVaiTro, nextMaDocGia, nextTrangThai, nextHash, id);

    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'CAP_NHAT_TAI_KHOAN',
      BangTacDong: 'TAIKHOAN',
      ChiTiet: `Cập nhật tài khoản ${existing.TenDangNhap} (Vai trò: ${nextVaiTro}, Trạng thái: ${nextTrangThai}).`,
    });

    const updated = db
      .prepare(
        `SELECT MaTaiKhoan, TenDangNhap, HoTen, VaiTro, MaDocGia, TrangThai, NgayTao
         FROM TAIKHOAN WHERE MaTaiKhoan = ?`
      )
      .get(id);
    res.json(updated);
  }
);

apiRouter.delete(
  '/taikhoan/:id',
  requireAuth,
  requireRole('ADMIN'),
  (req: AuthenticatedRequest, res) => {
    const id = Number(req.params.id);
    if (id === req.user!.MaTaiKhoan) {
      res.status(400).json({ error: 'Không thể tự xóa tài khoản đang đăng nhập.' });
      return;
    }
    const existing = db
      .prepare('SELECT * FROM TAIKHOAN WHERE MaTaiKhoan = ?')
      .get(id) as any;
    if (!existing) {
      res.status(404).json({ error: 'Không tìm thấy tài khoản.' });
      return;
    }

    db.prepare('DELETE FROM TAIKHOAN WHERE MaTaiKhoan = ?').run(id);
    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'XOA_TAI_KHOAN',
      BangTacDong: 'TAIKHOAN',
      ChiTiet: `Xóa tài khoản ${existing.TenDangNhap} (${existing.VaiTro}).`,
    });
    res.json({ success: true });
  }
);

apiRouter.get('/nhatky', requireAuth, requireRole('ADMIN'), (req, res) => {
  const limit = Math.min(200, Math.max(10, Number(req.query.limit) || 100));
  const rows = db
    .prepare('SELECT * FROM NHATKYTHAOTAC ORDER BY MaNhatKy DESC LIMIT ?')
    .all(limit);
  res.json(rows);
});

apiRouter.get('/hethong/backup', requireAuth, requireRole('ADMIN'), (req: AuthenticatedRequest, res) => {
  const snapshot = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    exportedBy: req.user!.TenDangNhap,
    tables: {
      THAMSO: db.prepare('SELECT * FROM THAMSO').all(),
      LOAIDOCGIA: db.prepare('SELECT * FROM LOAIDOCGIA').all(),
      DOCGIA: db.prepare('SELECT * FROM DOCGIA').all(),
      THELOAI: db.prepare('SELECT * FROM THELOAI').all(),
      TACGIA: db.prepare('SELECT * FROM TACGIA').all(),
      SACH: db.prepare('SELECT * FROM SACH').all(),
      SACH_TACGIA: db.prepare('SELECT * FROM SACH_TACGIA').all(),
      PHIEUMUON: db.prepare('SELECT * FROM PHIEUMUON').all(),
      CHITIETPHIEUMUON: db.prepare('SELECT * FROM CHITIETPHIEUMUON').all(),
      PHIEUTRA: db.prepare('SELECT * FROM PHIEUTRA').all(),
      CHITIETPHIEUTRA: db.prepare('SELECT * FROM CHITIETPHIEUTRA').all(),
      PHIEUTHUTIENPHAT: db.prepare('SELECT * FROM PHIEUTHUTIENPHAT').all(),
    },
  };

  writeAuditLog({
    MaTaiKhoan: req.user!.MaTaiKhoan,
    TenDangNhap: req.user!.TenDangNhap,
    VaiTro: req.user!.VaiTro,
    HanhDong: 'SAO_LUU_DU_LIEU',
    BangTacDong: 'HE_THONG',
    ChiTiet: 'Xuất bản sao lưu toàn bộ 12 bảng nghiệp vụ thư viện (JSON).',
  });

  res.json(snapshot);
});

const restoreSchema = z.object({
  version: z.string(),
  tables: z.object({
    THAMSO: z.array(z.record(z.string(), z.any())).length(1),
    LOAIDOCGIA: z.array(z.record(z.string(), z.any())),
    DOCGIA: z.array(z.record(z.string(), z.any())),
    THELOAI: z.array(z.record(z.string(), z.any())),
    TACGIA: z.array(z.record(z.string(), z.any())),
    SACH: z.array(z.record(z.string(), z.any())),
    SACH_TACGIA: z.array(z.record(z.string(), z.any())),
    PHIEUMUON: z.array(z.record(z.string(), z.any())),
    CHITIETPHIEUMUON: z.array(z.record(z.string(), z.any())),
    PHIEUTRA: z.array(z.record(z.string(), z.any())),
    CHITIETPHIEUTRA: z.array(z.record(z.string(), z.any())),
    PHIEUTHUTIENPHAT: z.array(z.record(z.string(), z.any())),
  }),
});

apiRouter.post(
  '/hethong/restore',
  requireAuth,
  requireRole('ADMIN'),
  (req: AuthenticatedRequest, res) => {
    const parsed = restoreSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Tập tin sao lưu không đúng định dạng cấu trúc 12 bảng SE104.' });
      return;
    }

    const t = parsed.data.tables;
    try {
      db.transaction(() => {
        // Clear dependent tables in reverse FK order (preserve TAIKHOAN & NHATKYTHAOTAC)
        db.prepare('DELETE FROM CHITIETPHIEUTRA').run();
        db.prepare('DELETE FROM PHIEUTRA').run();
        db.prepare('DELETE FROM CHITIETPHIEUMUON').run();
        db.prepare('DELETE FROM PHIEUMUON').run();
        db.prepare('DELETE FROM PHIEUTHUTIENPHAT').run();
        db.prepare('DELETE FROM SACH_TACGIA').run();
        db.prepare('DELETE FROM SACH').run();
        db.prepare('DELETE FROM TACGIA').run();
        db.prepare('DELETE FROM THELOAI').run();
        db.prepare('UPDATE TAIKHOAN SET MaDocGia = NULL').run();
        db.prepare('DELETE FROM DOCGIA').run();
        db.prepare('DELETE FROM LOAIDOCGIA').run();
        db.prepare('DELETE FROM THAMSO').run();

        const ts = t.THAMSO[0];
        db.prepare(
          `INSERT INTO THAMSO (MaThamSo, TuoiToiThieu, TuoiToiDa, ThoiHanThe, KhoangCachNamXuatBan, SoSachMuonToiDa, SoNgayMuonToiDa)
           VALUES (1, ?, ?, ?, ?, ?, ?)`
        ).run(
          Number(ts.TuoiToiThieu),
          Number(ts.TuoiToiDa),
          Number(ts.ThoiHanThe),
          Number(ts.KhoangCachNamXuatBan),
          Number(ts.SoSachMuonToiDa),
          Number(ts.SoNgayMuonToiDa)
        );

        const insLDG = db.prepare('INSERT INTO LOAIDOCGIA (MaLoaiDocGia, TenLoaiDocGia) VALUES (?, ?)');
        for (const r of t.LOAIDOCGIA) insLDG.run(String(r.MaLoaiDocGia), String(r.TenLoaiDocGia));

        const insDG = db.prepare(
          `INSERT INTO DOCGIA (MaDocGia, HoTen, MaLoaiDocGia, NgaySinh, DiaChi, Email, NgayLapThe, NgayHetHan, TongNo)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        );
        for (const r of t.DOCGIA) {
          insDG.run(
            String(r.MaDocGia),
            String(r.HoTen),
            String(r.MaLoaiDocGia),
            String(r.NgaySinh),
            String(r.DiaChi),
            String(r.Email),
            String(r.NgayLapThe),
            String(r.NgayHetHan),
            Number(r.TongNo)
          );
        }

        const insTL = db.prepare('INSERT INTO THELOAI (MaTheLoai, TenTheLoai) VALUES (?, ?)');
        for (const r of t.THELOAI) insTL.run(String(r.MaTheLoai), String(r.TenTheLoai));

        const insTG = db.prepare('INSERT INTO TACGIA (MaTacGia, TenTacGia) VALUES (?, ?)');
        for (const r of t.TACGIA) insTG.run(Number(r.MaTacGia), String(r.TenTacGia));

        const insSach = db.prepare(
          `INSERT INTO SACH (MaSach, TenSach, MaTheLoai, NamXuatBan, NhaXuatBan, NgayNhap, TriGia)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        );
        for (const r of t.SACH) {
          insSach.run(
            String(r.MaSach),
            String(r.TenSach),
            String(r.MaTheLoai),
            Number(r.NamXuatBan),
            String(r.NhaXuatBan),
            String(r.NgayNhap),
            Number(r.TriGia)
          );
        }

        const insSTG = db.prepare(
          'INSERT INTO SACH_TACGIA (MaSachTacGia, MaSach, MaTacGia) VALUES (?, ?, ?)'
        );
        for (const r of t.SACH_TACGIA) {
          insSTG.run(Number(r.MaSachTacGia), String(r.MaSach), Number(r.MaTacGia));
        }

        const insPM = db.prepare(
          'INSERT INTO PHIEUMUON (MaPhieuMuon, MaDocGia, NgayMuon) VALUES (?, ?, ?)'
        );
        for (const r of t.PHIEUMUON) {
          insPM.run(String(r.MaPhieuMuon), String(r.MaDocGia), String(r.NgayMuon));
        }

        const insCTPM = db.prepare(
          'INSERT INTO CHITIETPHIEUMUON (MaChiTietMuon, MaPhieuMuon, MaSach, HanTra) VALUES (?, ?, ?, ?)'
        );
        for (const r of t.CHITIETPHIEUMUON) {
          insCTPM.run(
            Number(r.MaChiTietMuon),
            String(r.MaPhieuMuon),
            String(r.MaSach),
            String(r.HanTra)
          );
        }

        const insPT = db.prepare(
          'INSERT INTO PHIEUTRA (MaPhieuTra, MaDocGia, NgayTra, TongTienPhat) VALUES (?, ?, ?, ?)'
        );
        for (const r of t.PHIEUTRA) {
          insPT.run(
            String(r.MaPhieuTra),
            String(r.MaDocGia),
            String(r.NgayTra),
            Number(r.TongTienPhat)
          );
        }

        const insCTPT = db.prepare(
          'INSERT INTO CHITIETPHIEUTRA (MaChiTietTra, MaPhieuTra, MaChiTietMuon, TienPhat) VALUES (?, ?, ?, ?)'
        );
        for (const r of t.CHITIETPHIEUTRA) {
          insCTPT.run(
            Number(r.MaChiTietTra),
            String(r.MaPhieuTra),
            Number(r.MaChiTietMuon),
            Number(r.TienPhat)
          );
        }

        const insPThu = db.prepare(
          `INSERT INTO PHIEUTHUTIENPHAT (MaPhieuThu, MaDocGia, NgayThu, TongNoTruocThu, SoTienThu, ConLai)
           VALUES (?, ?, ?, ?, ?, ?)`
        );
        for (const r of t.PHIEUTHUTIENPHAT) {
          insPThu.run(
            String(r.MaPhieuThu),
            String(r.MaDocGia),
            String(r.NgayThu),
            Number(r.TongNoTruocThu),
            Number(r.SoTienThu),
            Number(r.ConLai)
          );
        }

        // Re-link demo reader account to DG001 if present
        const dg001 = db.prepare('SELECT 1 FROM DOCGIA WHERE MaDocGia = ?').get('DG001');
        if (dg001) {
          db.prepare(
            "UPDATE TAIKHOAN SET MaDocGia = 'DG001' WHERE TenDangNhap = '22520101@gm.uit.edu.vn'"
          ).run();
        }
      })();

      writeAuditLog({
        MaTaiKhoan: req.user!.MaTaiKhoan,
        TenDangNhap: req.user!.TenDangNhap,
        VaiTro: req.user!.VaiTro,
        HanhDong: 'KHOI_PHUC_DU_LIEU',
        BangTacDong: 'HE_THONG',
        ChiTiet: `Khôi phục dữ liệu từ bản sao lưu (${t.SACH.length} đầu sách, ${t.DOCGIA.length} độc giả).`,
      });

      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({
        error: `Khôi phục dữ liệu thất bại: ${err?.message || 'Dữ liệu vi phạm ràng buộc khóa ngoại.'}`,
      });
    }
  }
);

/* ===========================
 * READER PORTAL (STRICTLY SCOPED TO LOGGED-IN READER)
 * =========================== */

apiRouter.get(
  '/reader/profile',
  requireAuth,
  requireRole('READER'),
  (req: AuthenticatedRequest, res) => {
    const maDocGia = req.user!.MaDocGia;
    if (!maDocGia) {
      res.json({
        docGia: null,
        lichSuMuon: [],
        phieuThuPhat: [],
        thamSo: getThamSo(),
      });
      return;
    }

    const docGia = db
      .prepare(
        `SELECT dg.*, ldg.TenLoaiDocGia
         FROM DOCGIA dg
         JOIN LOAIDOCGIA ldg ON ldg.MaLoaiDocGia = dg.MaLoaiDocGia
         WHERE dg.MaDocGia = ?`
      )
      .get(maDocGia);

    const lichSuMuon = db
      .prepare(
        `SELECT
          ct.MaChiTietMuon,
          ct.MaPhieuMuon,
          ct.MaSach,
          s.TenSach,
          tl.TenTheLoai,
          pm.NgayMuon,
          ct.HanTra,
          pt.NgayTra,
          tr.TienPhat,
          CASE WHEN tr.MaChiTietTra IS NOT NULL THEN 1 ELSE 0 END AS DaTra
         FROM CHITIETPHIEUMUON ct
         JOIN PHIEUMUON pm ON pm.MaPhieuMuon = ct.MaPhieuMuon
         JOIN SACH s ON s.MaSach = ct.MaSach
         JOIN THELOAI tl ON tl.MaTheLoai = s.MaTheLoai
         LEFT JOIN CHITIETPHIEUTRA tr ON tr.MaChiTietMuon = ct.MaChiTietMuon
         LEFT JOIN PHIEUTRA pt ON pt.MaPhieuTra = tr.MaPhieuTra
         WHERE pm.MaDocGia = ?
         ORDER BY pm.NgayMuon DESC, ct.MaChiTietMuon DESC`
      )
      .all(maDocGia)
      .map((r: any) => ({ ...r, DaTra: Boolean(r.DaTra) }));

    const phieuThuPhat = db
      .prepare(
        `SELECT * FROM PHIEUTHUTIENPHAT
         WHERE MaDocGia = ?
         ORDER BY NgayThu DESC, MaPhieuThu DESC`
      )
      .all(maDocGia);

    res.json({
      docGia,
      lichSuMuon,
      phieuThuPhat,
      thamSo: getThamSo(),
    });
  }
);

// Export password helper check only in non-prod if needed by internal tests
export { getSeedPassword };
