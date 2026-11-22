export type {
  BaoCaoBM71Response,
  BaoCaoBM71Row,
  BaoCaoBM72Response,
  BaoCaoBM72Row,
  DashboardSummary,
} from './reports';

export type UserRole = 'ADMIN' | 'LIBRARIAN' | 'READER';

export interface AuthUser {
  MaTaiKhoan: number;
  TenDangNhap: string;
  HoTen: string;
  VaiTro: UserRole;
  MaDocGia: string | null;
  TrangThai: 'ACTIVE' | 'LOCKED';
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
