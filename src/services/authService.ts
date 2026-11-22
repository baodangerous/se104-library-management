import type { AuthUser, UserRole } from '../types/library';
import { appendAuditLog, loadDb, mutateDb, setCurrentActor } from './storage';

const SESSION_KEY = 'uit_library_session_v1';

interface StoredSession {
  userId: number;
  mode: 'portal' | 'workspace';
}

function saveStoredSession(session: StoredSession | null): void {
  try {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return;
    if (!session) {
      window.localStorage.removeItem(SESSION_KEY);
    } else {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  } catch {
    // Ignore storage errors in restricted environments
  }
}

function readStoredSession(): StoredSession | null {
  try {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return null;
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredSession>;
    if (typeof parsed.userId !== 'number') return null;
    return {
      userId: parsed.userId,
      mode: parsed.mode === 'workspace' ? 'workspace' : 'portal',
    };
  } catch {
    return null;
  }
}

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
  restoreSession(): { user: AuthUser; mode: 'portal' | 'workspace' } | null {
    const saved = readStoredSession();
    if (!saved) return null;
    const db = loadDb();
    const row = db.TAIKHOAN.find(
      (acc) => acc.MaTaiKhoan === saved.userId && acc.TrangThai === 'ACTIVE'
    );
    if (!row) {
      saveStoredSession(null);
      setCurrentActor(null);
      return null;
    }
    const user = toAuthUser(row);
    setCurrentActor(user);
    return { user, mode: saved.mode };
  },

  saveMode(userId: number, mode: 'portal' | 'workspace'): void {
    saveStoredSession({ userId, mode });
  },

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
      saveStoredSession({ userId: user.MaTaiKhoan, mode: 'workspace' });
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
      saveStoredSession({ userId: user.MaTaiKhoan, mode: 'workspace' });
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
    saveStoredSession(null);
  },
};
