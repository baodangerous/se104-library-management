import type { LichDatPhong, PhongHop, YeuCauTaiLieu } from '../types/portal';
import { apiRequest } from './apiClient';

export interface RoomBookingInput {
  MaPhong: string;
  NguoiDat: string;
  MaSoSV: string;
  Email: string;
  NgayDat: string;
  KhungGio: string;
  MucDich: string;
}

export interface BookRequestInput {
  TenTaiLieu: string;
  TacGia: string;
  MaNganh: string;
  NguoiGui: string;
  Email: string;
  LyDo: string;
}

export const serviceRequestService = {
  async listRooms(): Promise<PhongHop[]> {
    return apiRequest<PhongHop[]>('/public/rooms');
  },

  async listRoomBookings(ngayDat?: string): Promise<LichDatPhong[]> {
    const query = ngayDat ? `?ngayDat=${encodeURIComponent(ngayDat)}` : '';
    return apiRequest<LichDatPhong[]>(`/public/datphong${query}`);
  },

  async createRoomBooking(payload: RoomBookingInput): Promise<LichDatPhong> {
    return apiRequest<LichDatPhong>('/public/datphong', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async cancelRoomBooking(maDatPhong: string): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(
      `/public/datphong/${encodeURIComponent(maDatPhong)}/cancel`,
      { method: 'PATCH' }
    );
  },

  async updateRoomBookingStatus(
    maDatPhong: string,
    trangThai: LichDatPhong['TrangThai']
  ): Promise<{ success: boolean; TrangThai: LichDatPhong['TrangThai'] }> {
    return apiRequest(`/datphong/${encodeURIComponent(maDatPhong)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ TrangThai: trangThai }),
    });
  },

  async listBookRequests(): Promise<YeuCauTaiLieu[]> {
    return apiRequest<YeuCauTaiLieu[]>('/public/yeucausach');
  },

  async createBookRequest(payload: BookRequestInput): Promise<YeuCauTaiLieu> {
    return apiRequest<YeuCauTaiLieu>('/public/yeucausach', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateBookRequestStatus(
    maYeuCau: string,
    trangThai: YeuCauTaiLieu['TrangThai']
  ): Promise<{ success: boolean; TrangThai: YeuCauTaiLieu['TrangThai'] }> {
    return apiRequest(`/yeucausach/${encodeURIComponent(maYeuCau)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ TrangThai: trangThai }),
    });
  },
};
