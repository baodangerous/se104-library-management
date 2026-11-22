import type { LichDatPhong, PhongHop, YeuCauTaiLieu } from '../types/portal';
import { todayIsoDate } from './rules/dateUtils';
import { appendAuditLog, loadDb, mutateDb, nextPrefixedId } from './storage';

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
    return loadDb().PHONGHOP;
  },

  async listRoomBookings(ngayDat?: string): Promise<LichDatPhong[]> {
    const db = loadDb();
    const list = ngayDat
      ? db.DATPHONG.filter((b) => b.NgayDat === ngayDat)
      : db.DATPHONG;
    return [...list].sort((a, b) => b.NgayDat.localeCompare(a.NgayDat));
  },

  async createRoomBooking(payload: RoomBookingInput): Promise<LichDatPhong> {
    return mutateDb((db) => {
      const room = db.PHONGHOP.find((p) => p.MaPhong === payload.MaPhong);
      if (!room) throw new Error('Không tìm thấy phòng họp nhóm.');
      if (room.TrangThai !== 'Sẵn sàng') {
        throw new Error('Phòng họp này hiện đang bảo trì.');
      }
      const conflict = db.DATPHONG.some(
        (b) =>
          b.TrangThai === 'Đã xác nhận' &&
          b.MaPhong === payload.MaPhong &&
          b.NgayDat === payload.NgayDat &&
          b.KhungGio === payload.KhungGio
      );
      if (conflict) {
        throw new Error(
          `${room.TenPhong} đã có nhóm đặt trong khung giờ ${payload.KhungGio} ngày ${payload.NgayDat}.`
        );
      }
      const booking: LichDatPhong = {
        MaDatPhong: nextPrefixedId(db.DATPHONG.map((b) => b.MaDatPhong), 'DP'),
        MaPhong: room.MaPhong,
        TenPhong: room.TenPhong,
        NguoiDat: payload.NguoiDat.trim(),
        MaSoSV: payload.MaSoSV.trim(),
        Email: payload.Email.trim(),
        NgayDat: payload.NgayDat,
        KhungGio: payload.KhungGio,
        MucDich: payload.MucDich.trim() || 'Thảo luận nhóm học tập',
        TrangThai: 'Đã xác nhận',
      };
      db.DATPHONG.unshift(booking);
      appendAuditLog(
        db,
        'DAT_PHONG',
        'PHONGHOP',
        `${booking.NguoiDat} (${booking.MaSoSV}) đặt ${room.TenPhong} lúc ${booking.KhungGio} ngày ${booking.NgayDat}.`
      );
      return booking;
    });
  },

  async cancelRoomBooking(maDatPhong: string): Promise<{ success: boolean }> {
    return mutateDb((db) => {
      const target = db.DATPHONG.find((b) => b.MaDatPhong === maDatPhong);
      if (!target) throw new Error('Không tìm thấy lịch đặt phòng.');
      target.TrangThai = 'Đã hủy';
      appendAuditLog(db, 'HUY_DAT_PHONG', 'PHONGHOP', `Hủy lịch đặt phòng ${maDatPhong}.`);
      return { success: true };
    });
  },

  async listBookRequests(): Promise<YeuCauTaiLieu[]> {
    return [...loadDb().YEUCAUTAILIEU];
  },

  async createBookRequest(payload: BookRequestInput): Promise<YeuCauTaiLieu> {
    return mutateDb((db) => {
      if (!payload.TenTaiLieu.trim() || !payload.NguoiGui.trim()) {
        throw new Error('Vui lòng nhập tên tài liệu và họ tên người yêu cầu.');
      }
      const req: YeuCauTaiLieu = {
        MaYeuCau: nextPrefixedId(db.YEUCAUTAILIEU.map((y) => y.MaYeuCau), 'YC'),
        TenTaiLieu: payload.TenTaiLieu.trim(),
        TacGia: payload.TacGia.trim() || 'Chưa rõ tác giả',
        MaNganh: payload.MaNganh || 'CNTT',
        NguoiGui: payload.NguoiGui.trim(),
        Email: payload.Email.trim(),
        LyDo: payload.LyDo.trim() || 'Phục vụ học tập và nghiên cứu tại UIT',
        NgayGui: todayIsoDate(),
        TrangThai: 'Đang tiếp nhận',
      };
      db.YEUCAUTAILIEU.unshift(req);
      appendAuditLog(db, 'YEU_CAU_SACH', 'YEUCAUTAILIEU', `${req.NguoiGui} đề xuất bổ sung "${req.TenTaiLieu}".`);
      return req;
    });
  },
};
