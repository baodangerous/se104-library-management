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
 * BM7.1 & BM7.2: BÁO CÁO THỐNG KÊ
 * =========================== */

router.get(
  '/baocao/bm71',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN'),
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

router.get(
  '/baocao/bm72',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN'),
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

router.get('/thamso', requireAuth, (_req, res) => {
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

router.put(
  '/thamso',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN'),
  (req: AuthenticatedRequest, res) => {
    const parsed = thamSoSchema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);

    const check = validateRegulationParams(parsed.data);
    if (!check.valid) {
      res.status(400).json({ error: check.error });
      return;
    }

    const prev = getThamSo();
    const d = parsed.data;
    const today = todayIsoDate();
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

    const trackConfigChange = (key: string, oldVal: number, newVal: number, reason: string) => {
      if (oldVal === newVal) return;
      db.prepare(
        `UPDATE LICHSUCAUHINH SET NgayHetHieuLuc = ? WHERE MaCauHinh = ? AND NgayHetHieuLuc IS NULL`
      ).run(today, key);
      db.prepare(
        `INSERT INTO LICHSUCAUHINH (MaCauHinh, GiaTri, NgayHieuLuc, NgayHetHieuLuc, NguoiThayDoi, LyDoThayDoi)
         VALUES (?, ?, ?, NULL, ?, ?)`
      ).run(key, String(newVal), today, req.user!.TenDangNhap, reason);
    };
    trackConfigChange('SO_SACH_MUON_TOI_DA', prev.SoSachMuonToiDa, d.SoSachMuonToiDa, 'Cập nhật định mức mượn tối đa');
    trackConfigChange('SO_NGAY_MUON_TOI_DA', prev.SoNgayMuonToiDa, d.SoNgayMuonToiDa, 'Cập nhật số ngày mượn tối đa');
    trackConfigChange('THOI_HAN_THE_THANG', prev.ThoiHanThe, d.ThoiHanThe, 'Cập nhật thời hạn thẻ thư viện');

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

router.post(
  '/theloai',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN'),
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

router.put(
  '/theloai/:id',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN'),
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

router.delete(
  '/theloai/:id',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN'),
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

router.get('/taikhoan', requireAuth, requireRole('ADMIN', 'HEAD_LIBRARIAN'), (req: AuthenticatedRequest, res) => {
  const isHead = req.user!.VaiTro === 'HEAD_LIBRARIAN';
  const rows = isHead
    ? db
        .prepare(
          `SELECT MaTaiKhoan, TenDangNhap, HoTen, VaiTro, MaDocGia, TrangThai, NgayTao
           FROM TAIKHOAN WHERE VaiTro IN ('LIBRARIAN', 'READER') ORDER BY MaTaiKhoan ASC`
        )
        .all()
    : db
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
  VaiTro: z.enum(['ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN', 'CATALOGER', 'READER']),
  MaDocGia: z.string().trim().nullable().optional(),
});

router.post(
  '/taikhoan',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN'),
  (req: AuthenticatedRequest, res) => {
    const parsed = createAccountSchema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);

    const d = parsed.data;
    if (req.user!.VaiTro === 'HEAD_LIBRARIAN' && !['LIBRARIAN', 'CATALOGER', 'READER'].includes(d.VaiTro)) {
      res.status(403).json({
        error: 'Phụ trách thư viện chỉ được phép tạo tài khoản Chuyên viên thư viện, Biên mục hoặc Độc giả.',
      });
      return;
    }
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
  VaiTro: z.enum(['ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN', 'READER']).optional(),
  MaDocGia: z.string().trim().nullable().optional(),
  TrangThai: z.enum(['ACTIVE', 'LOCKED']).optional(),
  MatKhauMoi: z.string().min(6, 'Mật khẩu mới tối thiểu 6 ký tự.').optional(),
});

router.put(
  '/taikhoan/:id',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN'),
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

    if (req.user!.VaiTro === 'HEAD_LIBRARIAN') {
      if (!['LIBRARIAN', 'READER'].includes(existing.VaiTro)) {
        res.status(403).json({
          error: 'Phụ trách thư viện không được chỉnh sửa tài khoản Quản trị viên hoặc Phụ trách khác.',
        });
        return;
      }
      if (d.VaiTro && !['LIBRARIAN', 'READER'].includes(d.VaiTro)) {
        res.status(403).json({
          error: 'Phụ trách thư viện chỉ được phân quyền Chuyên viên thư viện hoặc Độc giả.',
        });
        return;
      }
    }

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

router.delete(
  '/taikhoan/:id',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN'),
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
    if (
      req.user!.VaiTro === 'HEAD_LIBRARIAN' &&
      !['LIBRARIAN', 'READER'].includes(existing.VaiTro)
    ) {
      res.status(403).json({
        error: 'Phụ trách thư viện chỉ được xóa tài khoản Chuyên viên thư viện hoặc Độc giả.',
      });
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

router.get('/nhatky', requireAuth, requireRole('ADMIN', 'HEAD_LIBRARIAN'), (req, res) => {
  const limit = Math.min(200, Math.max(10, Number(req.query.limit) || 100));
  const rows = db
    .prepare('SELECT * FROM NHATKYTHAOTAC ORDER BY MaNhatKy DESC LIMIT ?')
    .all(limit);
  res.json(rows);
});

router.get('/hethong/backup', requireAuth, requireRole('ADMIN'), (req: AuthenticatedRequest, res) => {
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

router.post(
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

router.get(
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

