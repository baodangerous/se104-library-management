import type { LibraryDatabase } from './schema';
import { addDaysIso, addMonthsIso, todayIsoDate } from '../services/rules/dateUtils';
import { SEED_SACH, SEED_SACH_TACGIA, SEED_TACGIA, SEED_THELOAI } from './seedBooks';
import {
  SEED_CAUHINHCONG,
  SEED_NGANHHOC,
  SEED_TINTUC,
  SEED_TUSACHCHUYENDE,
} from './seedPortalData';
import { SEED_HUONGDAN } from './seedGuideData';
import { createSeedBookRequests, createSeedBookings, SEED_PHONGHOP } from './seedRooms';

export function createInitialDatabase(): LibraryDatabase {
  const today = todayIsoDate();
  const cardStart = addMonthsIso(today, -2);
  const cardEnd = addMonthsIso(cardStart, 6);
  const expiredStart = addMonthsIso(today, -8);
  const expiredEnd = addMonthsIso(expiredStart, 6);

  return {
    THAMSO: [
      {
        MaThamSo: 1,
        TuoiToiThieu: 18,
        TuoiToiDa: 55,
        ThoiHanThe: 6,
        KhoangCachNamXuatBan: 8,
        SoSachMuonToiDa: 5,
        SoNgayMuonToiDa: 4,
      },
    ],
    LOAIDOCGIA: [
      { MaLoaiDocGia: 'X', TenLoaiDocGia: 'Sinh viên / Học viên (X)' },
      { MaLoaiDocGia: 'Y', TenLoaiDocGia: 'Giảng viên / Cán bộ (Y)' },
    ],
    DOCGIA: [
      {
        MaDocGia: 'DG001',
        HoTen: 'Nguyễn Minh Khôi',
        MaLoaiDocGia: 'X',
        NgaySinh: '2004-05-14',
        DiaChi: 'KTX Khu B ĐHQG-HCM, TP. Thủ Đức',
        Email: '22520101@gm.uit.edu.vn',
        NgayLapThe: cardStart,
        NgayHetHan: cardEnd,
        TongNo: 3000,
      },
      {
        MaDocGia: 'DG002',
        HoTen: 'Trần Thị Bảo Ngọc',
        MaLoaiDocGia: 'X',
        NgaySinh: '2005-09-20',
        DiaChi: 'KTX Khu A ĐHQG-HCM, TP. Thủ Đức',
        Email: '23520412@gm.uit.edu.vn',
        NgayLapThe: cardStart,
        NgayHetHan: cardEnd,
        TongNo: 0,
      },
      {
        MaDocGia: 'DG003',
        HoTen: 'Lê Hoàng Nam',
        MaLoaiDocGia: 'X',
        NgaySinh: '2003-11-08',
        DiaChi: 'P. Linh Trung, TP. Thủ Đức',
        Email: '21520885@gm.uit.edu.vn',
        NgayLapThe: cardStart,
        NgayHetHan: cardEnd,
        TongNo: 5000,
      },
      {
        MaDocGia: 'DG004',
        HoTen: 'TS. Phạm Quốc Bảo',
        MaLoaiDocGia: 'Y',
        NgaySinh: '1986-03-12',
        DiaChi: 'Khoa Công nghệ Phần mềm – UIT',
        Email: 'baopq@uit.edu.vn',
        NgayLapThe: cardStart,
        NgayHetHan: cardEnd,
        TongNo: 0,
      },
      {
        MaDocGia: 'DG005',
        HoTen: 'Võ Gia Huy',
        MaLoaiDocGia: 'X',
        NgaySinh: '2002-07-02',
        DiaChi: 'P. Bình Thọ, TP. Thủ Đức',
        Email: '20520219@gm.uit.edu.vn',
        NgayLapThe: expiredStart,
        NgayHetHan: expiredEnd,
        TongNo: 0,
      },
    ],
    THELOAI: SEED_THELOAI,
    TACGIA: SEED_TACGIA,
    SACH: SEED_SACH,
    SACH_TACGIA: SEED_SACH_TACGIA,
    PHIEUMUON: [
      { MaPhieuMuon: 'PM001', MaDocGia: 'DG001', NgayMuon: addDaysIso(today, -32) },
      { MaPhieuMuon: 'PM002', MaDocGia: 'DG002', NgayMuon: addDaysIso(today, -15) },
      { MaPhieuMuon: 'PM003', MaDocGia: 'DG003', NgayMuon: addDaysIso(today, -9) },
      { MaPhieuMuon: 'PM004', MaDocGia: 'DG001', NgayMuon: addDaysIso(today, -1) },
    ],
    CHITIETPHIEUMUON: [
      { MaChiTietMuon: 1, MaPhieuMuon: 'PM001', MaSach: 'S005', HanTra: addDaysIso(today, -28) },
      { MaChiTietMuon: 2, MaPhieuMuon: 'PM001', MaSach: 'S006', HanTra: addDaysIso(today, -28) },
      { MaChiTietMuon: 3, MaPhieuMuon: 'PM002', MaSach: 'S008', HanTra: addDaysIso(today, -11) },
      { MaChiTietMuon: 4, MaPhieuMuon: 'PM003', MaSach: 'S003', HanTra: addDaysIso(today, -5) },
      { MaChiTietMuon: 5, MaPhieuMuon: 'PM004', MaSach: 'S001', HanTra: addDaysIso(today, 3) },
      { MaChiTietMuon: 6, MaPhieuMuon: 'PM004', MaSach: 'S009', HanTra: addDaysIso(today, 3) },
    ],
    PHIEUTRA: [
      { MaPhieuTra: 'PT001', MaDocGia: 'DG001', NgayTra: addDaysIso(today, -25), TongTienPhat: 6000 },
      { MaPhieuTra: 'PT002', MaDocGia: 'DG002', NgayTra: addDaysIso(today, -12), TongTienPhat: 0 },
    ],
    CHITIETPHIEUTRA: [
      { MaChiTietTra: 1, MaPhieuTra: 'PT001', MaChiTietMuon: 1, TienPhat: 3000 },
      { MaChiTietTra: 2, MaPhieuTra: 'PT001', MaChiTietMuon: 2, TienPhat: 3000 },
      { MaChiTietTra: 3, MaPhieuTra: 'PT002', MaChiTietMuon: 3, TienPhat: 0 },
    ],
    PHIEUTHUTIENPHAT: [
      {
        MaPhieuThu: 'PTT001',
        MaDocGia: 'DG001',
        NgayThu: addDaysIso(today, -24),
        TongNoTruocThu: 6000,
        SoTienThu: 3000,
        ConLai: 3000,
      },
    ],
    TAIKHOAN: [
      {
        MaTaiKhoan: 1,
        TenDangNhap: 'admin@uit.edu.vn',
        HoTen: 'Quản trị viên Thư viện UIT',
        VaiTro: 'ADMIN',
        MaDocGia: null,
        TrangThai: 'ACTIVE',
        NgayTao: cardStart,
        MatKhauDemo: 'admin123',
      },
      {
        MaTaiKhoan: 2,
        TenDangNhap: 'thuthu@uit.edu.vn',
        HoTen: 'Nguyễn Thị Thu Hà',
        VaiTro: 'LIBRARIAN',
        MaDocGia: null,
        TrangThai: 'ACTIVE',
        NgayTao: cardStart,
        MatKhauDemo: 'thuthu123',
      },
      {
        MaTaiKhoan: 3,
        TenDangNhap: '22520101@gm.uit.edu.vn',
        HoTen: 'Nguyễn Minh Khôi',
        VaiTro: 'READER',
        MaDocGia: 'DG001',
        TrangThai: 'ACTIVE',
        NgayTao: cardStart,
        MatKhauDemo: 'docgia123',
      },
    ],
    NHATKYTHAOTAC: [
      {
        MaNhatKy: 1,
        ThoiGian: `${today}T08:00:00`,
        MaTaiKhoan: 1,
        TenDangNhap: 'admin@uit.edu.vn',
        VaiTro: 'ADMIN',
        HanhDong: 'KHOI_TAO',
        BangTacDong: 'HETHONG',
        ChiTiet: 'Khởi tạo dữ liệu Cổng Thư viện UIT.',
      },
    ],
    NGANHHOC: SEED_NGANHHOC,
    PHONGHOP: SEED_PHONGHOP,
    DATPHONG: createSeedBookings(today),
    DATTRUOC: [
      { MaDatTruoc: 'DT001', MaSach: 'S001', TenSach: 'CompTIA Security+ Study Guide (SY0-701)', MaDocGia: 'DG002', HoTenDocGia: 'Trần Thị Bảo Ngọc', NgayDat: addDaysIso(today, -1), TrangThai: 'Đang chờ' },
      { MaDatTruoc: 'DT002', MaSach: 'S003', TenSach: 'Cryptography and Network Security: Principles and Practice', MaDocGia: 'DG001', HoTenDocGia: 'Nguyễn Minh Khôi', NgayDat: today, TrangThai: 'Đang chờ' },
    ],
    YEUCAUTAILIEU: createSeedBookRequests(today),
    TINTUC: SEED_TINTUC,
    TUSACHCHUYENDE: SEED_TUSACHCHUYENDE,
    CAUHINHCONG: SEED_CAUHINHCONG,
    HUONGDAN: SEED_HUONGDAN,
  };
}
