import type { DocGia, LoaiDocGia, ThamSo } from '../types/library';
import { apiRequest } from './apiClient';
import { matchesVietnameseSearch } from './rules/searchUtils';

export interface ReaderInput {
  HoTen: string;
  MaLoaiDocGia: string;
  NgaySinh: string;
  DiaChi: string;
  Email: string;
  NgayLapThe: string;
}

export const readerService = {
  async list(search = '', loai = 'ALL'): Promise<DocGia[]> {
    let rows = await apiRequest<DocGia[]>('/docgia');
    if (search.trim()) {
      rows = rows.filter((r) =>
        matchesVietnameseSearch(search, [r.MaDocGia, r.HoTen, r.Email, r.DiaChi])
      );
    }
    if (loai && loai !== 'ALL') {
      rows = rows.filter((r) => r.MaLoaiDocGia === loai);
    }
    return rows;
  },

  async listTypes(): Promise<LoaiDocGia[]> {
    return apiRequest<LoaiDocGia[]>('/loaidocgia');
  },

  async getParams(): Promise<ThamSo> {
    return apiRequest<ThamSo>('/thamso');
  },

  async create(payload: ReaderInput): Promise<DocGia> {
    return apiRequest<DocGia>('/docgia', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async update(maDocGia: string, payload: ReaderInput): Promise<DocGia> {
    return apiRequest<DocGia>(`/docgia/${encodeURIComponent(maDocGia)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async renewCard(maDocGia: string): Promise<DocGia> {
    return apiRequest<DocGia>(`/docgia/${encodeURIComponent(maDocGia)}/giahan`, {
      method: 'POST',
    });
  },

  async remove(maDocGia: string): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/docgia/${encodeURIComponent(maDocGia)}`, {
      method: 'DELETE',
    });
  },
};
