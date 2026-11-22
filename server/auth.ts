import crypto from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from './db';
import type { AuthUser, UserRole } from '../src/types/library';

const JWT_SECRET =
  process.env.JWT_SECRET && process.env.JWT_SECRET.trim().length >= 16
    ? process.env.JWT_SECRET.trim()
    : crypto.randomBytes(32).toString('hex');

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
        `SELECT MaTaiKhoan, TenDangNhap, HoTen, VaiTro, MaDocGia, TrangThai
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
