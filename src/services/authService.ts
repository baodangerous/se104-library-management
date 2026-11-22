import type { AuthUser, UserRole } from '../types/library';
import { appendAuditLog, mutateDb, setCurrentActor } from './storage';

function toAuthUser(row: {
  MaTaiKhoan: number;
  TenDangNhap: string;
  HoTen: string;
  VaiTro: UserRole;
  MaDocGia: string | null;
  TrangThai: 'ACTIVE' | 'LOCKED';
}): AuthUser {
  return {
    MaTaiKhoan: row.MaTaiKhoan,
    TenDangNhap: row.TenDangNhap,
    HoTen: row.HoTen,
    VaiTro: row.VaiTro,
    MaDocGia: row.MaDocGia,
    TrangThai: row.TrangThai,
  };
}

export const authService = {
  async login(tenDangNhap: string, matKhau: string): Promise<AuthUser> {
    return mutateDb((db) => {
      const normalized = tenDangNhap.trim().toLowerCase();
      const row = db.TAIKHOAN.find(
        (acc) => acc.TenDangNhap.toLowerCase() === normalized
      );
      if (!row || row.MatKhauDemo !== matKhau) {
        throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác.');
      }
      if (row.TrangThai !== 'ACTIVE') {
        throw new Error('Tài khoản này đang bị khóa.');
      }
      const user = toAuthUser(row);
      setCurrentActor(user);
      appendAuditLog(
        db,
        'DANG_NHAP',
        'TAIKHOAN',
        `Đăng nhập thành công (${user.TenDangNhap}).`,
        user
      );
      return user;
    });
  },

  async demoLogin(role: UserRole): Promise<AuthUser> {
    return mutateDb((db) => {
      const row = db.TAIKHOAN.find(
        (acc) => acc.VaiTro === role && acc.TrangThai === 'ACTIVE'
      );
      if (!row) {
        throw new Error('Không tìm thấy tài khoản trải nghiệm phù hợp.');
      }
      const user = toAuthUser(row);
      setCurrentActor(user);
      appendAuditLog(
        db,
        'DANG_NHAP',
        'TAIKHOAN',
        `Đăng nhập nhanh (${user.TenDangNhap}).`,
        user
      );
      return user;
    });
  },

  logout(): void {
    setCurrentActor(null);
  },
};
