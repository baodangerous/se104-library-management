import type { ThamSo } from '../types/library';
import { adminService } from './adminService';

export const settingsService = {
  async getParams(): Promise<ThamSo> {
    return adminService.getParams();
  },

  async updateParams(payload: Omit<ThamSo, 'MaThamSo'>): Promise<ThamSo> {
    return adminService.updateParams(payload);
  },
};
