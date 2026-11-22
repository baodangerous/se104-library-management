import { loadDb } from '../database/dbEngine';
import type {
  LibraryPortalConfig,
  NganhHoc,
  TinHoatDong,
  TuSachChuyenDe,
} from '../types/portal';

/**
 * Centralized portal data access layer reading exclusively from src/database/dbEngine.ts.
 */
export const portalService = {
  listMajors(): NganhHoc[] {
    return loadDb().NGANHHOC;
  },

  getMajorByCode(maNganh?: string): NganhHoc | undefined {
    if (!maNganh) return undefined;
    return loadDb().NGANHHOC.find((m) => m.MaNganh === maNganh);
  },

  getMajorName(maNganh?: string): string {
    if (!maNganh) return 'Chung';
    return loadDb().NGANHHOC.find((m) => m.MaNganh === maNganh)?.TenNganh || maNganh;
  },

  listNews(): TinHoatDong[] {
    return loadDb().TINTUC;
  },

  listThematicShelves(): TuSachChuyenDe[] {
    return loadDb().TUSACHCHUYENDE;
  },

  getConfig(): LibraryPortalConfig {
    return loadDb().CAUHINHCONG;
  },
};
