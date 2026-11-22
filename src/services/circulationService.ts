import type {
  DashboardSummary,
  PhieuMuon,
  PhieuThuTienPhat,
  PhieuTra,
} from '../types/library';
import { apiRequest } from './apiClient';
import { todayIsoDate } from './rules/dateUtils';

export interface ActiveBorrowedItem {
  MaChiTietMuon: number;
  MaPhieuMuon: string;
  MaSach: string;
  TenSach: string;
  TenTheLoai: string;
  NgayMuon: string;
  HanTra: string;
}

export const circulationService = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    return apiRequest<DashboardSummary>('/dashboard/summary');
  },

  async listLoans(): Promise<PhieuMuon[]> {
    return apiRequest<PhieuMuon[]>('/phieumuon');
  },

  async createLoan(payload: {
    MaDocGia: string;
    NgayMuon: string;
    MaSachList: string[];
  }): Promise<{ MaPhieuMuon: string; HanTra: string }> {
    return apiRequest<{ MaPhieuMuon: string; HanTra: string }>('/phieumuon', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async listReaderActiveLoans(maDocGia: string): Promise<ActiveBorrowedItem[]> {
    return apiRequest<ActiveBorrowedItem[]>(
      `/docgia/${encodeURIComponent(maDocGia)}/dangmuon`
    );
  },

  async listReturns(): Promise<PhieuTra[]> {
    return apiRequest<PhieuTra[]>('/phieutra');
  },

  async createReturn(payload: {
    MaDocGia: string;
    NgayTra: string;
    MaChiTietMuonList: number[];
  }): Promise<{
    MaPhieuTra: string;
    TongTienPhat: number;
    TongNoMoi: number;
    HeldReservations: Array<{ MaSach: string; HoTenDocGia: string }>;
  }> {
    return apiRequest('/phieutra', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async renewLoanItem(
    maChiTietMuon: number,
    ngayGiaHan: string = todayIsoDate()
  ): Promise<{ MaChiTietMuon: number; HanTraMoi: string; SoLanGiaHan: number }> {
    return apiRequest('/phieumuon/renew', {
      method: 'POST',
      body: JSON.stringify({ MaChiTietMuon: maChiTietMuon, NgayGiaHan: ngayGiaHan }),
    });
  },

  async listFineReceipts(): Promise<PhieuThuTienPhat[]> {
    return apiRequest<PhieuThuTienPhat[]>('/phieuphat');
  },

  async createFineReceipt(payload: {
    MaDocGia: string;
    NgayThu: string;
    SoTienThu: number;
  }): Promise<PhieuThuTienPhat> {
    return apiRequest<PhieuThuTienPhat>('/phieuphat', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
