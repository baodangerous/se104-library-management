import type { Sach, ThamSo, TheLoai } from '../types/library';
import type { NgonNguSach, NguonTaiLieu } from '../types/portal';
import { hydrateBooks, linkBookAuthors } from './bookHydrator';
import { validateBookIntake } from './rules/catalogRules';
import { matchesVietnameseSearch } from './rules/searchUtils';
import { appendAuditLog, loadDb, mutateDb, nextPrefixedId } from './storage';

export interface BookInput {
  TenSach: string;
  MaTheLoai: string;
  NamXuatBan: number;
  NhaXuatBan: string;
  NgayNhap: string;
  TriGia: number;
  TacGiaList: string[];
  MaNganh?: string;
  NgonNgu?: NgonNguSach;
  NguonTaiLieu?: NguonTaiLieu;
  ChuDe?: string;
  NoiBat?: boolean;
  MaKeSach?: string;
  MoTa?: string;
}

export interface BookSearchFilters {
  q?: string;
  maTheLoai?: string;
  maNganh?: string;
  nguon?: string;
  ngonNgu?: string;
  tinhTrang?: string;
  chuDe?: string;
  noiBat?: boolean;
  hideBorrowerName?: boolean;
}

export const bookService = {
  async list(filters?: BookSearchFilters): Promise<Sach[]> {
    const db = loadDb();
    let rows = hydrateBooks(db, Boolean(filters?.hideBorrowerName));
    if (filters?.q?.trim()) {
      rows = rows.filter((b) =>
        matchesVietnameseSearch(filters.q!, [
          b.MaSach,
          b.TenSach,
          b.NhaXuatBan,
          b.TenTheLoai,
          b.TenNganh,
          b.MaNganh,
          b.MoTa,
          ...b.TacGiaList,
        ])
      );
    }
    if (filters?.maTheLoai && filters.maTheLoai !== 'ALL') {
      rows = rows.filter((b) => b.MaTheLoai === filters.maTheLoai);
    }
    if (filters?.maNganh && filters.maNganh !== 'ALL') {
      rows = rows.filter((b) => b.MaNganh === filters.maNganh);
    }
    if (filters?.nguon && filters.nguon !== 'ALL') {
      rows = rows.filter((b) => b.NguonTaiLieu === filters.nguon);
    }
    if (filters?.ngonNgu && filters.ngonNgu !== 'ALL') {
      rows = rows.filter((b) => b.NgonNgu === filters.ngonNgu);
    }
    if (filters?.tinhTrang && filters.tinhTrang !== 'ALL') {
      rows = rows.filter((b) => b.TinhTrang === filters.tinhTrang);
    }
    if (filters?.chuDe && filters.chuDe !== 'ALL') {
      rows = rows.filter((b) => b.ChuDe === filters.chuDe);
    }
    if (filters?.noiBat) {
      rows = rows.filter((b) => b.NoiBat);
    }
    return rows;
  },

  async listPublic(filters?: BookSearchFilters): Promise<Sach[]> {
    return this.list({ ...filters, hideBorrowerName: true });
  },

  async listCategories(): Promise<TheLoai[]> {
    const db = loadDb();
    return db.THELOAI.map((tl) => ({
      ...tl,
      SoLuongSach: db.SACH.filter((s) => s.MaTheLoai === tl.MaTheLoai).length,
    }));
  },

  async listPublicCategories(): Promise<TheLoai[]> {
    return this.listCategories();
  },

  async getParams(): Promise<ThamSo> {
    return loadDb().THAMSO[0];
  },

  async create(payload: BookInput): Promise<Sach> {
    return mutateDb((db) => {
      const check = validateBookIntake(payload.NamXuatBan, payload.NgayNhap, payload.TriGia, db.THAMSO[0]);
      if (!check.valid) throw new Error(check.error);
      const maSach = nextPrefixedId(db.SACH.map((s) => s.MaSach), 'S');
      db.SACH.push({
        MaSach: maSach,
        TenSach: payload.TenSach.trim(),
        MaTheLoai: payload.MaTheLoai,
        NamXuatBan: payload.NamXuatBan,
        NhaXuatBan: payload.NhaXuatBan.trim(),
        NgayNhap: payload.NgayNhap,
        TriGia: payload.TriGia,
        MaNganh: payload.MaNganh || 'CNTT',
        NgonNgu: payload.NgonNgu || 'Tiếng Việt',
        NguonTaiLieu:
          payload.NguonTaiLieu ||
          (payload.MaTheLoai === 'A' ? 'Giáo trình UIT' : payload.MaTheLoai === 'C' ? 'Luận văn UIT' : 'Sách Tiếng Việt'),
        ChuDe: payload.ChuDe,
        NoiBat: payload.NoiBat,
        MaKeSach: payload.MaKeSach || 'T1-MOI-01',
        MoTa: payload.MoTa,
      });
      linkBookAuthors(db, maSach, payload.TacGiaList);
      appendAuditLog(db, 'THEM_SACH', 'SACH', `Tiếp nhận sách mới ${maSach}: ${payload.TenSach}`);
      return hydrateBooks(db).find((b) => b.MaSach === maSach)!;
    });
  },

  async update(maSach: string, payload: BookInput): Promise<Sach> {
    return mutateDb((db) => {
      const idx = db.SACH.findIndex((s) => s.MaSach === maSach);
      if (idx === -1) throw new Error('Không tìm thấy đầu sách cần cập nhật.');
      const check = validateBookIntake(payload.NamXuatBan, payload.NgayNhap, payload.TriGia, db.THAMSO[0]);
      if (!check.valid) throw new Error(check.error);
      db.SACH[idx] = {
        ...db.SACH[idx],
        TenSach: payload.TenSach.trim(),
        MaTheLoai: payload.MaTheLoai,
        NamXuatBan: payload.NamXuatBan,
        NhaXuatBan: payload.NhaXuatBan.trim(),
        NgayNhap: payload.NgayNhap,
        TriGia: payload.TriGia,
        MaNganh: payload.MaNganh || db.SACH[idx].MaNganh,
        NgonNgu: payload.NgonNgu || db.SACH[idx].NgonNgu,
        NguonTaiLieu: payload.NguonTaiLieu || db.SACH[idx].NguonTaiLieu,
      };
      linkBookAuthors(db, maSach, payload.TacGiaList);
      appendAuditLog(db, 'SUA_SACH', 'SACH', `Cập nhật thông tin sách ${maSach}.`);
      return hydrateBooks(db).find((b) => b.MaSach === maSach)!;
    });
  },

  async remove(maSach: string): Promise<{ success: boolean }> {
    return mutateDb((db) => {
      if (db.CHITIETPHIEUMUON.some((c) => c.MaSach === maSach)) {
        throw new Error('Không thể xóa sách đã phát sinh lịch sử mượn/trả.');
      }
      db.SACH = db.SACH.filter((s) => s.MaSach !== maSach);
      db.SACH_TACGIA = db.SACH_TACGIA.filter((l) => l.MaSach !== maSach);
      appendAuditLog(db, 'XOA_SACH', 'SACH', `Xóa đầu sách ${maSach}.`);
      return { success: true };
    });
  },
};
