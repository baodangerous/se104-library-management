import type { AuthUser, UserRole } from '../types/library';
import { apiRequest, getAuthToken, setAuthToken } from './apiClient';

const SESSION_KEY = 'uit_library_session_v2';

interface StoredSession {
  user: AuthUser;
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
    // Ignore storage errors
  }
}

function readStoredSession(): StoredSession | null {
  try {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return null;
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredSession>;
    if (!parsed.user || typeof parsed.user.MaTaiKhoan !== 'number') return null;
    return {
      user: parsed.user,
      mode: parsed.mode === 'workspace' ? 'workspace' : 'portal',
    };
  } catch {
    return null;
  }
}

export const authService = {
  restoreSession(): { user: AuthUser; mode: 'portal' | 'workspace' } | null {
    const token = getAuthToken();
    const saved = readStoredSession();
    if (!token || !saved) {
      saveStoredSession(null);
      setAuthToken(null);
      return null;
    }
    return saved;
  },

  async verifySession(): Promise<AuthUser | null> {
    if (!getAuthToken()) return null;
    try {
      const res = await apiRequest<{ user: AuthUser }>('/auth/me');
      const current = readStoredSession();
      saveStoredSession({ user: res.user, mode: current?.mode ?? 'portal' });
      return res.user;
    } catch {
      this.logout();
      return null;
    }
  },

  saveMode(userId: number, mode: 'portal' | 'workspace'): void {
    const current = readStoredSession();
    if (current && current.user.MaTaiKhoan === userId) {
      saveStoredSession({ user: current.user, mode });
    }
  },

  async login(tenDangNhap: string, matKhau: string): Promise<AuthUser> {
    const res = await apiRequest<{ token: string; user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ TenDangNhap: tenDangNhap.trim(), MatKhau: matKhau }),
    });
    setAuthToken(res.token);
    saveStoredSession({ user: res.user, mode: 'workspace' });
    return res.user;
  },

  async demoLogin(role: UserRole): Promise<AuthUser> {
    const res = await apiRequest<{ token: string; user: AuthUser }>('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
    setAuthToken(res.token);
    saveStoredSession({ user: res.user, mode: 'workspace' });
    return res.user;
  },

  logout(): void {
    setAuthToken(null);
    saveStoredSession(null);
  },
};
