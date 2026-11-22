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
import { createRateLimiter } from "../security";
const loginLimiter = createRateLimiter({ windowMs: 60_000, max: 15, message: "Quá nhiều lần thử đăng nhập. Vui lòng đợi 1 phút." });

export const router = Router();
/* ===========================
 * AUTH ROUTES
 * =========================== */

const loginSchema = z.object({
  TenDangNhap: z.string().trim().min(1, 'Vui lòng nhập tên đăng nhập hoặc email UIT.'),
  MatKhau: z.string().min(1, 'Vui lòng nhập mật khẩu.'),
});

router.post('/auth/login', loginLimiter, (req, res) => {
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

router.post('/auth/demo-login', (req, res) => {
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

router.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
  res.json({ user: req.user });
});

