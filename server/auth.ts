import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from './db';
import type { AuthUser, UserRole } from '../src/types/library';

function resolveJwtSecret(): string {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.trim().length >= 16) {
    return process.env.JWT_SECRET.trim();
  }
  const secretFile = path.resolve(process.cwd(), 'data', '.jwt_secret');
  try {
    if (fs.existsSync(secretFile)) {
      const stored = fs.readFileSync(secretFile, 'utf8').trim();
      if (stored.length >= 32) return stored;
    }
    const generated = crypto.randomBytes(32).toString('hex');
    fs.mkdirSync(path.dirname(secretFile), { recursive: true });
    fs.writeFileSync(secretFile, generated, { mode: 0o600 });
    return generated;
  } catch {
    return crypto.randomBytes(32).toString('hex');
  }
}

const JWT_SECRET = resolveJwtSecret();

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

interface TokenPayload {
  sub: number;
  role: UserRole;
  username: string;
}

export function signToken(user: AuthUser): string {
  const payload: TokenPayload = {
    sub: user.MaTaiKhoan,
    role: user.VaiTro,
    username: user.TenDangNhap,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Vui lòng đăng nhập để tiếp tục.' });
    return;
  }
  const token = authHeader.slice('Bearer '.length).trim();
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as TokenPayload;
    const user = db
      .prepare(
        `SELECT MaTaiKhoan, TenDangNhap, HoTen, VaiTro, MaDocGia, TrangThai, MaCN
         FROM TAIKHOAN WHERE MaTaiKhoan = ?`
      )
      .get(decoded.sub) as AuthUser | undefined;

    if (!user) {
      res.status(401).json({ error: 'Tài khoản không tồn tại hoặc đã bị xóa.' });
      return;
    }
    if (user.TrangThai !== 'ACTIVE') {
      res.status(403).json({ error: 'Tài khoản hiện đang bị khóa. Liên hệ Quản trị viên.' });
      return;
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ.' });
  }
}

export function hasPermission(role: UserRole, maQuyen: string): boolean {
  const row = db
    .prepare('SELECT 1 FROM VAITROQUYEN WHERE MaVaiTro = ? AND MaQuyen = ?')
    .get(role, maQuyen);
  return Boolean(row);
}

export function hasBranchScope(maTaiKhoan: number, maCN: string): boolean {
  const rows = db
    .prepare('SELECT MaCN FROM PHAMVICHINHANH WHERE MaTaiKhoan = ?')
    .all(maTaiKhoan) as Array<{ MaCN: string }>;
  if (rows.length === 0) return true;
  return rows.some((r) => r.MaCN === maCN);
}

export function requireRole(...roles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Chưa xác thực người dùng.' });
      return;
    }
    if (!roles.includes(req.user.VaiTro)) {
      res.status(403).json({
        error: 'Bạn không có quyền truy cập chức năng này.',
      });
      return;
    }
    next();
  };
}

export function requirePermission(...permissions: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Chưa xác thực người dùng.' });
      return;
    }
    const ok = permissions.some((p) => hasPermission(req.user!.VaiTro, p));
    if (!ok) {
      res.status(403).json({
        error: `Bạn không có quyền thực hiện thao tác này (${permissions.join(' / ')}).`,
      });
      return;
    }
    next();
  };
}
