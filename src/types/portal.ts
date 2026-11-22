export type NguonTaiLieu =
  | 'Giáo trình UIT'
  | 'Luận văn UIT'
  | 'Sách Tiếng Việt'
  | 'Sách Ngoại văn';

export type NgonNguSach = 'Tiếng Việt' | 'Tiếng Anh';

export type ChuongTrinhDaoTao = 'ĐH chính quy' | 'CT Tiếng Anh' | 'Sau ĐH';

export type PortalTabId =
  | 'home'
  | 'catalog'
  | 'majors'
  | 'knowledge-map'
  | 'services'
  | 'about';

export interface NganhHoc {
  MaNganh: string;
  TenNganh: string;
  Khoa: string;
  BacDaoTao?: string;
  MauSac?: string;
  Icon?: string;
  HinhAnh?: string;
  ChuongTrinh: ChuongTrinhDaoTao[];
  MoTaNgan: string;
}

export interface PhongHop {
  MaPhong: string;
  TenPhong: string;
  Tang: string;
  SucChua: number;
  TrangThietBi: string;
  TrangThai: 'Sẵn sàng' | 'Bảo trì';
}

export interface LichDatPhong {
  MaDatPhong: string;
  MaPhong: string;
  TenPhong: string;
  NguoiDat: string;
  MaSoSV: string;
  Email: string;
  NgayDat: string;
  KhungGio: string;
  MucDich: string;
  TrangThai: 'Đã xác nhận' | 'Đã hủy';
}

export interface YeuCauTaiLieu {
  MaYeuCau: string;
  TenTaiLieu: string;
  TacGia: string;
  MaNganh: string;
  NguoiGui: string;
  Email: string;
  LyDo: string;
  NgayGui: string;
  TrangThai: 'Đang tiếp nhận' | 'Đã duyệt mua' | 'Đã bổ sung';
}

export interface TinHoatDong {
  id: string;
  tieuDe: string;
  ngayDang: string;
  chuyenMuc: string;
  tomTat: string;
  hinhAnh?: string;
  duongDan?: string;
}

export interface TuSachChuyenDe {
  id: string;
  tenTuSach: string;
  moTa: string;
  soTaiLieuMinhHoa: number;
  accentColor: string;
}

export interface LibraryFloorZone {
  id: string;
  tenKhuVuc: string;
  moTaNgan: string;
  icon: string;
  badge: string;
}

export interface LibraryFloorGuide {
  id: 'ground' | 'floor2';
  tenTang: string;
  tieuDe: string;
  anhChinh: string;
  boSuuTap: Array<{ src: string; caption: string }>;
  khuVuc: LibraryFloorZone[];
}

export interface LibraryGuideData {
  tang: LibraryFloorGuide[];
  noiQuyTrucQuan: Array<{ id: string; tieuDe: string; nhan: string; icon: string }>;
  lienKetDatPhong: Array<{ id: string; tieuDe: string; moTa: string; url: string; loai: 'internal' | 'external' }>;
}

export interface DatTruoc {
  MaDatTruoc: string;
  MaSach: string;
  TenSach: string;
  MaDocGia: string;
  HoTenDocGia: string;
  NgayDat: string;
  TrangThai: 'Đang chờ' | 'Đã giữ chỗ' | 'Đã nhận' | 'Đã hủy';
}

export interface LibraryPortalConfig {
  tenDonVi: string;
  tenNgan: string;
  hotline: string;
  email: string;
  diaChi: string;
  gioMoCuaNgan: string;
  gioMoCuaChiTiet: Array<{ thu: string; gio: string; ghiChu: string }>;
  khungGioDatPhong: string[];
  noiQuyThuVien: string[];
}
