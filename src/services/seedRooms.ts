import type { LichDatPhong, PhongHop, YeuCauTaiLieu } from '../types/portal';
import { addDaysIso } from './rules/dateUtils';

export const SEED_PHONGHOP: PhongHop[] = [
  {
    MaPhong: 'P201',
    TenPhong: 'Phòng học nhóm A2.01',
    Tang: 'Tầng 2 – Khu Đọc mở',
    SucChua: 6,
    TrangThietBi: 'Màn hình TV 65", bảng kính, Wi-Fi tốc độ cao',
    TrangThai: 'Sẵn sàng',
  },
  {
    MaPhong: 'P202',
    TenPhong: 'Phòng học nhóm A2.02',
    Tang: 'Tầng 2 – Khu Đọc mở',
    SucChua: 8,
    TrangThietBi: 'Máy chiếu HD, bảng trắng, ổ cắm âm bàn',
    TrangThai: 'Sẵn sàng',
  },
  {
    MaPhong: 'P301',
    TenPhong: 'Phòng Seminar Nghiên cứu A3.01',
    Tang: 'Tầng 3 – Khu Sau Đại học',
    SucChua: 12,
    TrangThietBi: 'Màn hình tương tác 75", micro hội thảo, cách âm',
    TrangThai: 'Sẵn sàng',
  },
  {
    MaPhong: 'P302',
    TenPhong: 'Phòng thảo luận Đồ án A3.02',
    Tang: 'Tầng 3 – Khu Đọc mở',
    SucChua: 6,
    TrangThietBi: 'Màn hình trình chiếu HDMI/USB-C, bảng viết',
    TrangThai: 'Sẵn sàng',
  },
];

export function createSeedBookings(today: string): LichDatPhong[] {
  return [
    {
      MaDatPhong: 'DP001',
      MaPhong: 'P201',
      TenPhong: 'Phòng học nhóm A2.01',
      NguoiDat: 'Nguyễn Minh Khôi',
      MaSoSV: '22520101',
      Email: '22520101@gm.uit.edu.vn',
      NgayDat: today,
      KhungGio: '13:30 – 15:30',
      MucDich: 'Thảo luận đồ án An toàn Thông tin',
      TrangThai: 'Đã xác nhận',
    },
  ];
}

export function createSeedBookRequests(today: string): YeuCauTaiLieu[] {
  return [
    {
      MaYeuCau: 'YC001',
      TenTaiLieu: 'System Design Interview – An Insider’s Guide (Vol. 2)',
      TacGia: 'Alex Xu, Sahn Lam',
      MaNganh: 'KTPM',
      NguoiGui: 'Trần Thị Bảo Ngọc',
      Email: '23520412@gm.uit.edu.vn',
      LyDo: 'Phục vụ môn Kiến trúc Phần mềm và ôn thi thực tập doanh nghiệp.',
      NgayGui: addDaysIso(today, -3),
      TrangThai: 'Đã duyệt mua',
    },
  ];
}
