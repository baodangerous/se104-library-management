import type {
  NhatKyThaoTac,
  TaiKhoan,
  ThamSo,
  TheLoai,
  UserRole,
} from '../types/library';
import {
  applyBackupSnapshot,
  buildBackupSnapshot,
  buildReaderProfile,
  type ReaderProfileData,
} from './readerProfileService';
import { validateRegulationParams } from './rules/catalogRules';
import { todayIsoDate } from './rules/dateUtils';
import {
  appendAuditLog,
  getCurrentActor,
  loadDb,
  mutateDb,
  nextNumericId,
} from '../database/dbEngine';

export type { ReaderProfileData };

export const adminService = {
  async getParams(): Promise<ThamSo> {
    return loadDb().THAMSO[0];
  },

  async updateParams(payload: Omit<ThamSo, 'MaThamSo'>): Promise<ThamSo> {
    return mutateDb((db) => {
      const check = validateRegulationParams(payload);
      if (!check.valid) throw new Error(check.error);
      db.THAMSO[0] = { MaThamSo: 1, ...payload };
      appendAuditLog(
        db,
        'CAP_NHAT_QUY_DINH',
        'THAMSO',
        `Cập nhật tham số: tuổi ${payload.TuoiToiThieu}-${payload.TuoiToiDa}, thẻ ${payload.ThoiHanThe} tháng, mượn tối đa ${payload.SoSachMuonToiDa} quyển/${payload.SoNgayMuonToiDa} ngày.`
      );
      return db.THAMSO[0];
    });
  },

  async listCategories(): Promise<TheLoai[]> {
    const db = loadDb();
    return db.THELOAI.map((tl) => ({
      ...tl,
      SoLuongSach: db.SACH.filter((s) => s.MaTheLoai === tl.MaTheLoai).length,
    }));
  },

  async createCategory(payload: { MaTheLoai: string; TenTheLoai: string }): Promise<TheLoai> {
    return mutateDb((db) => {
      const code = payload.MaTheLoai.trim().toUpperCase();
      if (db.THELOAI.some((c) => c.MaTheLoai === code)) {
        throw new Error(`Mã thể loại "${code}" đã tồn tại.`);
      }
      const created: TheLoai = { MaTheLoai: code, TenTheLoai: payload.TenTheLoai.trim(), SoLuongSach: 0 };
      db.THELOAI.push(created);
      appendAuditLog(db, 'THEM_THELOAI', 'THELOAI', `Thêm thể loại ${code} – ${created.TenTheLoai}.`);
      return created;
    });
  },

  async updateCategory(maTheLoai: string, tenTheLoai: string): Promise<TheLoai> {
    return mutateDb((db) => {
      const cat = db.THELOAI.find((c) => c.MaTheLoai === maTheLoai);
      if (!cat) throw new Error('Không tìm thấy thể loại.');
      cat.TenTheLoai = tenTheLoai.trim();
      appendAuditLog(db, 'SUA_THELOAI', 'THELOAI', `Đổi tên thể loại ${maTheLoai} thành "${cat.TenTheLoai}".`);
      return cat;
    });
  },

  async deleteCategory(maTheLoai: string): Promise<{ success: boolean }> {
    return mutateDb((db) => {
      const refCount = db.SACH.filter((s) => s.MaTheLoai === maTheLoai).length;
      if (refCount > 0) {
        throw new Error(`Không thể xóa thể loại này vì đang có ${refCount} đầu sách thuộc thể loại.`);
      }
      db.THELOAI = db.THELOAI.filter((c) => c.MaTheLoai !== maTheLoai);
      appendAuditLog(db, 'XOA_THELOAI', 'THELOAI', `Xóa thể loại ${maTheLoai}.`);
      return { success: true };
    });
  },

  async listAccounts(): Promise<TaiKhoan[]> {
    return loadDb().TAIKHOAN.map(({ MatKhauDemo: _pw, ...acc }) => acc);
  },

  async createAccount(payload: {
    TenDangNhap: string;
    MatKhau: string;
    HoTen: string;
    VaiTro: UserRole;
    MaDocGia: string | null;
  }): Promise<TaiKhoan> {
    return mutateDb((db) => {
      if (db.TAIKHOAN.some((a) => a.TenDangNhap.toLowerCase() === payload.TenDangNhap.trim().toLowerCase())) {
        throw new Error('Tên đăng nhập đã tồn tại.');
      }
      const row = {
        MaTaiKhoan: nextNumericId(db.TAIKHOAN.map((a) => a.MaTaiKhoan)),
        TenDangNhap: payload.TenDangNhap.trim(),
        HoTen: payload.HoTen.trim(),
        VaiTro: payload.VaiTro,
        MaDocGia: payload.VaiTro === 'READER' ? payload.MaDocGia : null,
        TrangThai: 'ACTIVE' as const,
        NgayTao: todayIsoDate(),
        MatKhauDemo: payload.MatKhau,
      };
      db.TAIKHOAN.push(row);
      appendAuditLog(db, 'TAO_TAIKHOAN', 'TAIKHOAN', `Tạo tài khoản ${row.TenDangNhap} (${row.VaiTro}).`);
      const { MatKhauDemo: _pw, ...safe } = row;
      return safe;
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
    return mutateDb((db) => {
      const row = db.TAIKHOAN.find((a) => a.MaTaiKhoan === maTaiKhoan);
      if (!row) throw new Error('Không tìm thấy tài khoản.');
      if (payload.HoTen) row.HoTen = payload.HoTen.trim();
      if (payload.VaiTro) row.VaiTro = payload.VaiTro;
      if (payload.TrangThai) row.TrangThai = payload.TrangThai;
      if (payload.MaDocGia !== undefined) row.MaDocGia = payload.MaDocGia;
      if (payload.MatKhauMoi) row.MatKhauDemo = payload.MatKhauMoi;
      appendAuditLog(db, 'SUA_TAIKHOAN', 'TAIKHOAN', `Cập nhật tài khoản ${row.TenDangNhap}.`);
      const { MatKhauDemo: _pw, ...safe } = row;
      return safe;
    });
  },

  async deleteAccount(maTaiKhoan: number): Promise<{ success: boolean }> {
    return mutateDb((db) => {
      const actor = getCurrentActor();
      if (actor?.MaTaiKhoan === maTaiKhoan) {
        throw new Error('Không thể tự xóa tài khoản đang đăng nhập.');
      }
      db.TAIKHOAN = db.TAIKHOAN.filter((a) => a.MaTaiKhoan !== maTaiKhoan);
      appendAuditLog(db, 'XOA_TAIKHOAN', 'TAIKHOAN', `Xóa tài khoản #${maTaiKhoan}.`);
      return { success: true };
    });
  },

  async listAuditLogs(limit = 150): Promise<NhatKyThaoTac[]> {
    return loadDb().NHATKYTHAOTAC.slice(0, limit);
  },

  async exportBackup(): Promise<Record<string, unknown>> {
    return buildBackupSnapshot();
  },

  async restoreBackup(snapshot: Record<string, unknown>): Promise<{ success: boolean }> {
    return applyBackupSnapshot(snapshot);
  },

  async getReaderProfile(): Promise<ReaderProfileData> {
    return buildReaderProfile();
  },
};
