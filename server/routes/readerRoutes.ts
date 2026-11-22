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
 * BM1: LOAIDOCGIA & DOCGIA
 * =========================== */

router.get('/loaidocgia', requireAuth, (_req, res) => {
  const rows = db.prepare('SELECT * FROM LOAIDOCGIA ORDER BY MaLoaiDocGia ASC').all();
  res.json(rows);
});

router.get(
  '/docgia',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN'),
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

router.post(
  '/docgia',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN'),
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

router.put(
  '/docgia/:id',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN'),
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

router.delete(
  '/docgia/:id',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN'),
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

