import type { DatTruoc } from '../types/portal';
import { apiRequest } from './apiClient';

export const reservationService = {
  async list(): Promise<DatTruoc[]> {
    return apiRequest<DatTruoc[]>('/dattruoc');
  },

  async listByBook(maSach: string): Promise<DatTruoc[]> {
    const rows = await apiRequest<DatTruoc[]>('/dattruoc');
    return rows.filter(
      (r) => r.MaSach === maSach && (r.TrangThai === 'Đang chờ' || r.TrangThai === 'Đã giữ chỗ')
    );
  },

  async create(maSach: string, maDocGia: string): Promise<DatTruoc> {
    return apiRequest<DatTruoc>('/dattruoc', {
      method: 'POST',
      body: JSON.stringify({ MaSach: maSach, MaDocGia: maDocGia }),
    });
  },

  async cancel(maDatTruoc: string): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/dattruoc/${encodeURIComponent(maDatTruoc)}/cancel`, {
      method: 'PATCH',
    });
  },
};
