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

let cachedMajors: NganhHoc[] = SEED_NGANHHOC;
let cachedNews: TinHoatDong[] = SEED_TINTUC;
let cachedShelves: TuSachChuyenDe[] = SEED_TUSACHCHUYENDE;
let cachedConfig: LibraryPortalConfig = SEED_CAUHINHCONG;
let cachedGuide: LibraryGuideData = SEED_HUONGDAN;
let hydrated = false;

export const portalService = {
  async hydrateFromServer(): Promise<void> {
    if (hydrated) return;
    try {
      const bundle = await apiRequest<{
        majors?: NganhHoc[];
        news?: TinHoatDong[];
        shelves?: TuSachChuyenDe[];
        config?: LibraryPortalConfig | null;
        guide?: LibraryGuideData | null;
      }>('/public/portal-bundle');
      if (bundle.majors?.length) cachedMajors = bundle.majors;
      if (bundle.news?.length) cachedNews = bundle.news;
      if (bundle.shelves?.length) cachedShelves = bundle.shelves;
      if (bundle.config) cachedConfig = bundle.config;
      if (bundle.guide) cachedGuide = bundle.guide;
      hydrated = true;
    } catch {
      // Keep fallback data if backend unreachable
    }
  },

  listMajors(): NganhHoc[] {
    return cachedMajors;
  },

  getMajorByCode(maNganh?: string): NganhHoc | undefined {
    if (!maNganh) return undefined;
    return cachedMajors.find((m) => m.MaNganh === maNganh);
  },

  getMajorName(maNganh?: string): string {
    if (!maNganh) return 'Chung';
    return cachedMajors.find((m) => m.MaNganh === maNganh)?.TenNganh || maNganh;
  },

  getMajorImage(maNganh?: string): string {
    const code = maNganh || 'CNTT';
    const major = cachedMajors.find((m) => m.MaNganh === code);
    return major?.HinhAnh || `/resources/majors/${code}.jpg`;
  },

  listNews(): TinHoatDong[] {
    return cachedNews;
  },

  async listNewsAsync(): Promise<TinHoatDong[]> {
    const rows = await apiRequest<TinHoatDong[]>('/public/tintuc');
    cachedNews = rows;
    return rows;
  },

  async createNews(payload: Omit<TinHoatDong, 'id'>): Promise<TinHoatDong> {
    const created = await apiRequest<TinHoatDong>('/tintuc', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    cachedNews = [created, ...cachedNews];
    return created;
  },

  async updateNews(id: string, payload: Partial<Omit<TinHoatDong, 'id'>>): Promise<TinHoatDong> {
    const updated = await apiRequest<TinHoatDong>(`/tintuc/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    cachedNews = cachedNews.map((n) => (n.id === id ? updated : n));
    return updated;
  },

  async removeNews(id: string): Promise<{ success: boolean }> {
    const res = await apiRequest<{ success: boolean }>(`/tintuc/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    cachedNews = cachedNews.filter((n) => n.id !== id);
    return res;
  },

  listThematicShelves(): TuSachChuyenDe[] {
    return cachedShelves;
  },

  getConfig(): LibraryPortalConfig {
    return cachedConfig;
  },

  getGuide(): LibraryGuideData {
    return cachedGuide;
  },

  async getPublicStats(): Promise<{ roomCount: number; readerCount: number }> {
    return apiRequest<{ roomCount: number; readerCount: number }>('/public/stats');
  },
};
