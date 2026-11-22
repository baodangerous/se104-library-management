import type {
  ChiTietPhieuMuon,
  DocGia,
  NhatKyThaoTac,
  PhieuThuTienPhat,
  TaiKhoan,
  ThamSo,
  TheLoai,
  UserRole,
} from '../types/library';
import { apiRequest } from './apiClient';

export interface ReaderProfileData {
  docGia: DocGia | null;
  lichSuMuon: ChiTietPhieuMuon[];
  phieuThuPhat: PhieuThuTienPhat[];
  thamSo: ThamSo;
}

export const adminService = {
  async getParams(): Promise<ThamSo> {
    return apiRequest<ThamSo>('/thamso');
  },

  async updateParams(payload: Omit<ThamSo, 'MaThamSo'>): Promise<ThamSo> {
    return apiRequest<ThamSo>('/thamso', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async listCategories(): Promise<TheLoai[]> {
    return apiRequest<TheLoai[]>('/theloai');
  },

  async createCategory(payload: { MaTheLoai: string; TenTheLoai: string }): Promise<TheLoai> {
    return apiRequest<TheLoai>('/theloai', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateCategory(maTheLoai: string, tenTheLoai: string): Promise<TheLoai> {
    return apiRequest<TheLoai>(`/theloai/${encodeURIComponent(maTheLoai)}`, {
      method: 'PUT',
      body: JSON.stringify({ TenTheLoai: tenTheLoai }),
    });
  },

  async deleteCategory(maTheLoai: string): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/theloai/${encodeURIComponent(maTheLoai)}`, {
      method: 'DELETE',
    });
  },

  async listAccounts(): Promise<TaiKhoan[]> {
    return apiRequest<TaiKhoan[]>('/taikhoan');
  },

  async createAccount(payload: {
    TenDangNhap: string;
    MatKhau: string;
    HoTen: string;
    VaiTro: UserRole;
    MaDocGia: string | null;
  }): Promise<TaiKhoan> {
    return apiRequest<TaiKhoan>('/taikhoan', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateAccount(
    maTaiKhoan: number,
    payload: {
      HoTen?: string;
      VaiTro?: UserRole;
      TrangThai?: 'ACTIVE' | 'LOCKED';
      MaDocGia?: string | null;
      MatKhauMoi?: string;
    }
  ): Promise<TaiKhoan> {
    return apiRequest<TaiKhoan>(`/taikhoan/${maTaiKhoan}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteAccount(maTaiKhoan: number): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/taikhoan/${maTaiKhoan}`, {
      method: 'DELETE',
    });
  },

  async listAuditLogs(limit = 150): Promise<NhatKyThaoTac[]> {
    return apiRequest<NhatKyThaoTac[]>(`/nhatky?limit=${limit}`);
  },

  async exportBackup(): Promise<Record<string, unknown>> {
    return apiRequest<Record<string, unknown>>('/hethong/backup');
  },

  async restoreBackup(snapshot: Record<string, unknown>): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>('/hethong/restore', {
      method: 'POST',
      body: JSON.stringify(snapshot),
    });
  },

  async getReaderProfile(): Promise<ReaderProfileData> {
    return apiRequest<ReaderProfileData>('/reader/profile');
  },
};
