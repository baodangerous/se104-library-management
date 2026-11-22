import { portalService } from './portalService';
import type { Sach, TacGia, ThamSo, TheLoai } from '../types/library';
import type { NgonNguSach, NguonTaiLieu } from '../types/portal';
import { apiRequest, getAuthToken } from './apiClient';
import { matchesVietnameseSearch } from './rules/searchUtils';

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

function applyClientFilters(books: Sach[], filters?: BookSearchFilters): Sach[] {
  let rows = books.map((b) => ({
    ...b,
    TenNganh: b.TenNganh || portalService.getMajorName(b.MaNganh),
  }));
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
}

export const bookService = {
  async list(filters?: BookSearchFilters): Promise<Sach[]> {
    const endpoint =
      !filters?.hideBorrowerName && getAuthToken() ? '/sach' : '/public/sach';
    const raw = await apiRequest<Sach[]>(endpoint);
    return applyClientFilters(raw, filters);
  },

  async listPublic(filters?: BookSearchFilters): Promise<Sach[]> {
    const raw = await apiRequest<Sach[]>('/public/sach');
    return applyClientFilters(raw, { ...filters, hideBorrowerName: true });
  },

  async listCategories(): Promise<TheLoai[]> {
    return apiRequest<TheLoai[]>('/public/theloai');
  },

  async listPublicCategories(): Promise<TheLoai[]> {
    return apiRequest<TheLoai[]>('/public/theloai');
  },

  async getParams(): Promise<ThamSo> {
    return apiRequest<ThamSo>('/thamso');
  },

  async getPublicParams(): Promise<ThamSo> {
    return apiRequest<ThamSo>('/public/thamso');
  },

  async create(payload: BookInput): Promise<Sach> {
    return apiRequest<Sach>('/sach', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async update(maSach: string, payload: BookInput): Promise<Sach> {
    return apiRequest<Sach>(`/sach/${encodeURIComponent(maSach)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async remove(maSach: string): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/sach/${encodeURIComponent(maSach)}`, {
      method: 'DELETE',
    });
  },

  async listAuthors(): Promise<(TacGia & { SoLuongSach?: number })[]> {
    return apiRequest<(TacGia & { SoLuongSach?: number })[]>('/tacgia');
  },

  async createAuthor(TenTacGia: string): Promise<TacGia & { SoLuongSach?: number }> {
    return apiRequest<TacGia & { SoLuongSach?: number }>('/tacgia', {
      method: 'POST',
      body: JSON.stringify({ TenTacGia }),
    });
  },

  async updateAuthor(id: number, TenTacGia: string): Promise<TacGia & { SoLuongSach?: number }> {
    return apiRequest<TacGia & { SoLuongSach?: number }>(`/tacgia/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ TenTacGia }),
    });
  },

  async removeAuthor(id: number): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/tacgia/${id}`, {
      method: 'DELETE',
    });
  },
};
