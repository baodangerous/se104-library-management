import { SEED_HUONGDAN } from '../database/seedGuideData';
import { SEED_NGANHHOC } from '../database/seedMajors';
import {
  SEED_CAUHINHCONG,
  SEED_TINTUC,
  SEED_TUSACHCHUYENDE,
} from '../database/seedPortalData';
import type {
  LibraryGuideData,
  LibraryPortalConfig,
  NganhHoc,
  TinHoatDong,
  TuSachChuyenDe,
} from '../types/portal';
import { apiRequest } from './apiClient';

export const portalService = {
  listMajors(): NganhHoc[] {
    return SEED_NGANHHOC;
  },

  getMajorByCode(maNganh?: string): NganhHoc | undefined {
    if (!maNganh) return undefined;
    return SEED_NGANHHOC.find((m) => m.MaNganh === maNganh);
  },

  getMajorName(maNganh?: string): string {
    if (!maNganh) return 'Chung';
    return SEED_NGANHHOC.find((m) => m.MaNganh === maNganh)?.TenNganh || maNganh;
  },

  getMajorImage(maNganh?: string): string {
    const code = maNganh || 'CNTT';
    const major = SEED_NGANHHOC.find((m) => m.MaNganh === code);
    return major?.HinhAnh || `/resources/majors/${code}.jpg`;
  },

  listNews(): TinHoatDong[] {
    return SEED_TINTUC;
  },

  async listNewsAsync(): Promise<TinHoatDong[]> {
    return apiRequest<TinHoatDong[]>('/public/tintuc');
  },

  async createNews(payload: Omit<TinHoatDong, 'id'>): Promise<TinHoatDong> {
    return apiRequest<TinHoatDong>('/tintuc', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateNews(id: string, payload: Partial<Omit<TinHoatDong, 'id'>>): Promise<TinHoatDong> {
    return apiRequest<TinHoatDong>(`/tintuc/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async removeNews(id: string): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/tintuc/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  listThematicShelves(): TuSachChuyenDe[] {
    return SEED_TUSACHCHUYENDE;
  },

  getConfig(): LibraryPortalConfig {
    return SEED_CAUHINHCONG;
  },

  getGuide(): LibraryGuideData {
    return SEED_HUONGDAN;
  },

  async getPublicStats(): Promise<{ roomCount: number; readerCount: number }> {
    return apiRequest<{ roomCount: number; readerCount: number }>('/public/stats');
  },
};
