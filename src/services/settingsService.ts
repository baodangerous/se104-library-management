import type { ThamSo } from '../types/library';
import { adminService } from './adminService';
import { loadDb } from './storage';

/**
 * Settings Repository reading/updating live library policy parameters (THAMSO).
 */
export const settingsService = {
  async getParams(): Promise<ThamSo> {
    return loadDb().THAMSO[0];
  },

  getParamsSync(): ThamSo {
    return loadDb().THAMSO[0];
  },

  async updateParams(payload: Omit<ThamSo, 'MaThamSo'>): Promise<ThamSo> {
    return adminService.updateParams(payload);
  },
};
