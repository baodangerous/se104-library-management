export type {
  BaoCaoBM71Response,
  BaoCaoBM71Row,
  BaoCaoBM72Response,
  BaoCaoBM72Row,
  DashboardSummary,
} from './reports';

export type UserRole = 'ADMIN' | 'HEAD_LIBRARIAN' | 'LIBRARIAN' | 'CATALOGER' | 'READER';

export interface AuthUser {
  MaTaiKhoan: number;
  TenDangNhap: string;
  HoTen: string;
  VaiTro: UserRole;
  MaDocGia: string | null;
  TrangThai: 'ACTIVE' | 'LOCKED';
  MaCN?: string | null;
}

export interface LoaiDocGia {
  MaLoaiDocGia: string;
  TenLoaiDocGia: string;
}

export interface DocGia {
  MaDocGia: string;
  HoTen: string;
  MaLoaiDocGia: string;
  TenLoaiDocGia?: string;
  NgaySinh: string;
  DiaChi: string;
  Email: string;
  NgayLapThe: string;
  NgayHetHan: string;
  TongNo: number;
  SoSachDangMuon?: number;
  SoSachQuaHan?: number;
}

export interface TheLoai {
  MaTheLoai: string;
  TenTheLoai: string;
  SoLuongSach?: number;
}

export interface TacGia {
  MaTacGia: number;
  TenTacGia: string;
}

export interface Sach {
  MaSach: string;
  TenSach: string;
  MaTheLoai: string;
  TenTheLoai: string;
  NamXuatBan: number;
  NhaXuatBan: string;
  NgayNhap: string;
  TriGia: number;
  TacGiaList: string[];
  TacGiaIds?: number[];
  TinhTrang: 'Có sẵn' | 'Đang mượn';
  NguoiDangMuon?: string | null;
  HanTraHienTai?: string | null;
  MaNganh?: string;
  TenNganh?: string;
  NgonNgu?: 'Tiếng Việt' | 'Tiếng Anh';
  NguonTaiLieu?: 'Giáo trình UIT' | 'Luận văn UIT' | 'Sách Tiếng Việt' | 'Sách Ngoại văn';
  ChuDe?: string;
  NoiBat?: boolean;
  MaKeSach?: string;
  MoTa?: string;
  AnhBia?: string;
}

export interface ChiTietPhieuMuon {
  MaChiTietMuon: number;
  MaPhieuMuon: string;
  MaSach: string;
  TenSach: string;
  TenTheLoai?: string;
  TacGiaList?: string[];
  NgayMuon: string;
  HanTra: string;
  NgayTra: string | null;
  TienPhat: number | null;
  DaTra: boolean;
  SoLanGiaHan?: number;
}

export interface PhieuMuon {
  MaPhieuMuon: string;
  MaDocGia: string;
  HoTenDocGia: string;
  NgayMuon: string;
  ChiTiet: ChiTietPhieuMuon[];
}

export interface ChiTietPhieuTra {
  MaChiTietTra: number;
  MaPhieuTra: string;
  MaChiTietMuon: number;
  MaSach: string;
  TenSach: string;
  NgayMuon: string;
  HanTra: string;
  SoNgayTraTre: number;
  TienPhat: number;
}

export interface PhieuTra {
  MaPhieuTra: string;
  MaDocGia: string;
  HoTenDocGia: string;
  NgayTra: string;
  TongTienPhat: number;
  ChiTiet: ChiTietPhieuTra[];
}

export interface PhieuThuTienPhat {
  MaPhieuThu: string;
  MaDocGia: string;
  HoTenDocGia?: string;
  NgayThu: string;
  TongNoTruocThu: number;
  SoTienThu: number;
  ConLai: number;
}

export interface ThamSo {
  MaThamSo: number;
  TuoiToiThieu: number;
  TuoiToiDa: number;
  ThoiHanThe: number;
  KhoangCachNamXuatBan: number;
  SoSachMuonToiDa: number;
  SoNgayMuonToiDa: number;
}

export interface TaiKhoan {
  MaTaiKhoan: number;
  TenDangNhap: string;
  HoTen: string;
  VaiTro: UserRole;
  MaDocGia: string | null;
  TrangThai: 'ACTIVE' | 'LOCKED';
  NgayTao: string;
}

export interface NhatKyThaoTac {
  MaNhatKy: number;
  ThoiGian: string;
  MaTaiKhoan: number | null;
  TenDangNhap: string;
  VaiTro: string;
  HanhDong: string;
  BangTacDong: string;
  ChiTiet: string;
}

export interface ChiNhanh {
  MaCN: string;
  TenCN: string;
  DiaChi: string;
  SDT: string;
}

export interface KeSach {
  MaKe: string;
  MaCN: string;
  TenCN?: string;
  ViTri: string;
}

export type BanSaoStatus =
  | 'Sẵn sàng'
  | 'Đang mượn'
  | 'Đang sửa'
  | 'Chờ thanh lý'
  | 'Đã thanh lý'
  | 'Thất lạc';

export interface BanSao {
  MaBanSao: string;
  MaSach: string;
  TenSach?: string;
  MaCN: string;
  TenCN?: string;
  MaKe: string | null;
  ViTriKe?: string;
  TinhTrang: BanSaoStatus;
  NgayNhap: string;
}

export interface LichSuTrangThaiBanSao {
  MaLichSu: number;
  MaBanSao: string;
  TrangThaiCu: string | null;
  TrangThaiMoi: string;
  ChiNhanhCu: string | null;
  ChiNhanhMoi: string | null;
  ThoiGian: string;
  NguoiThucHien: string | null;
  LyDo: string | null;
}

export interface TheThuVien {
  MaThe: string;
  MaDocGia: string;
  NgayLap: string;
  NgayHetHan: string;
  TrangThai: 'Đang dùng' | 'Đã khoá' | 'Đã báo mất';
  LyDoKhoa: string | null;
}

export interface QuyenItem {
  MaQuyen: string;
  TenQuyen: string;
  NhomChucNang: string;
}

export interface VaiTroQuyen {
  MaVaiTro: UserRole;
  MaQuyen: string;
}

export interface PhamViChiNhanh {
  MaTaiKhoan: number;
  MaCN: string;
}

export interface LichSuCauHinh {
  MaLichSuCauHinh: number;
  MaCauHinh: string;
  GiaTri: string;
  NgayHieuLuc: string;
  NgayHetHieuLuc: string | null;
  NguoiThayDoi: string | null;
  LyDoThayDoi: string | null;
}

export interface KeHoachMuaSam {
  MaKeHoach: string;
  TenKeHoach: string;
  NganSach: number;
  NganSachDaDung: number;
  NgayBatDau: string;
  NgayKetThuc: string | null;
  NguoiDuyet: string | null;
}

export interface NhaCungCap {
  MaNCC: string;
  TenNCC: string;
  DiaChi: string | null;
  SDT: string | null;
  Email: string | null;
}

export interface ChiTietDonDatMua {
  MaChiTietDat?: number;
  MaDonDatMua?: string;
  TenTaiLieuDat: string;
  SoLuongDat: number;
  DonGia: number;
  ThanhTien?: number;
}

export interface DonDatMua {
  MaDonDatMua: string;
  MaKeHoach: string;
  TenKeHoach?: string;
  MaNCC: string;
  TenNCC?: string;
  NgayDat: string;
  TrangThai: 'Nháp' | 'Đã gửi' | 'Đã nhận một phần' | 'Đã nhận đủ' | 'Huỷ';
  NguoiLap: string | null;
  ChiTiet: ChiTietDonDatMua[];
  TongTien: number;
}

export interface PhieuTiepNhan {
  MaPhieuTiepNhan: string;
  MaDonDatMua: string;
  NgayNhan: string;
  SoLuongThucNhan: number;
  TinhTrangHang: 'Đạt' | 'Thiếu' | 'Thừa' | 'Lỗi chất lượng';
  GhiChuChenhLech: string | null;
  NguoiTiepNhan: string | null;
}

export type TransferStatus =
  | 'Nháp'
  | 'Chờ duyệt'
  | 'Đã duyệt'
  | 'Đang vận chuyển'
  | 'Đã xuất kho'
  | 'Đã nhập kho'
  | 'Hoàn tất'
  | 'Thất lạc'
  | 'Từ chối';

export interface PhieuDieuChuyen {
  SoPhieuDC: string;
  MaBanSao: string;
  TenSach?: string;
  ChiNhanhGui: string;
  TenChiNhanhGui?: string;
  ChiNhanhNhan: string;
  TenChiNhanhNhan?: string;
  TrangThai: TransferStatus;
  NgayLap: string;
  NgayDuyet: string | null;
  NgayXuatKho: string | null;
  NgayNhapKho: string | null;
  NguoiLap: string | null;
  NguoiDuyet: string | null;
  LichSu?: Array<{
    MaLichSu: number;
    TrangThaiCu: string | null;
    TrangThaiMoi: string;
    ThoiGian: string;
    NguoiThucHien: string | null;
  }>;
}

export interface BienBanKiemKe {
  MaBBKK: string;
  MaCN: string;
  TenCN?: string;
  NgayKiemKe: string;
  NguoiThucHien: string | null;
  TrangThai: 'Chờ duyệt' | 'Đã duyệt điều chỉnh';
  ChiTiet: Array<{
    MaSach: string;
    TenSach?: string;
    SoLuongHeThong: number;
    SoLuongThucTe: number;
    ChenhLech: number;
  }>;
}

export interface PhieuThanhLy {
  SoPhieuTL: string;
  MaBanSao: string;
  TenSach?: string;
  LyDo: string;
  NgayLap: string;
  NgayThanhLy: string | null;
  TrangThai: 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối';
  NguoiDeXuat: string | null;
  NguoiDuyet: string | null;
}

export interface PhieuBoiThuong {
  SoPhieuBT: string;
  MaDocGia: string;
  HoTenDocGia?: string;
  MaBanSao: string;
  TenSach?: string;
  LoaiSuCo: 'Mất' | 'Hư hỏng';
  TriGiaTaiLieu: number;
  PhiXuLy: number;
  TongBoiThuong: number;
  NgayLap: string;
  TrangThai: 'Chưa thu' | 'Đã thu';
}

export interface GiaoDichThanhToan {
  MaGD: string;
  MaDocGia: string;
  KenhThanhToan: 'VNPay' | 'Momo' | 'ZaloPay';
  MaGD_CongThanhToan: string;
  SoTien: number;
  TrangThai: 'Thành công' | 'Thất bại' | 'Đang xử lý';
  ThoiGianGD: string;
}

export interface PhieuDieuChinh {
  MaPhieuDieuChinh: string;
  LoaiChungTu: 'PhieuPhat' | 'PhieuBoiThuong' | 'GiaoDichThanhToan';
  MaChungTuGoc: string;
  SoTienDieuChinh: number;
  LyDo: string;
  NguoiLap: string | null;
  NguoiDuyet: string | null;
  NgayLap: string;
  TrangThai: 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối';
}

export interface NgoaiLeMuon {
  MaNgoaiLe: string;
  MaDocGia: string;
  HoTenDocGia?: string;
  SoLuongThem: number;
  LyDo: string;
  HanApDung: string;
  TrangThai: 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối';
  NguoiDuyet: string | null;
  NgayTao: string;
}

export interface DanhGiaSach {
  MaDanhGia: number;
  MaDocGia: string;
  HoTenDocGia?: string;
  MaSach: string;
  SoSao: number;
  NoiDung: string;
  NgayDanhGia: string;
}

export interface TaiNguyenSo {
  MaTNS: string;
  MaSach: string;
  DuongDanFile: string;
  DinhDangFile: string;
  SoLuotMuonDongThoi: number;
  ThoiHanDRM_Ngay: number;
}
