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
