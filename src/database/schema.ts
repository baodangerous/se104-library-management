import type {
  DocGia,
  LoaiDocGia,
  NhatKyThaoTac,
  PhieuThuTienPhat,
  TacGia,
  TaiKhoan,
  ThamSo,
  TheLoai,
} from '../types/library';
import type {
  LichDatPhong,
  LibraryGuideData,
  LibraryPortalConfig,
  NganhHoc,
  NgonNguSach,
  NguonTaiLieu,
  PhongHop,
  TinHoatDong,
  TuSachChuyenDe,
  YeuCauTaiLieu,
} from '../types/portal';

/**
 * Centralized 16+ normalized table schema in src/database/.
 * Note: SACH intentionally omits TinhTrang; availability is computed dynamically
 * from CHITIETPHIEUMUON & CHITIETPHIEUTRA.
 */
export interface SachRow {
  MaSach: string;
  TenSach: string;
  MaTheLoai: string;
  NamXuatBan: number;
  NhaXuatBan: string;
  NgayNhap: string;
  TriGia: number;
  MaNganh: string;
  NgonNgu: NgonNguSach;
  NguonTaiLieu: NguonTaiLieu;
  ChuDe?: string;
  NoiBat?: boolean;
  MaKeSach?: string;
  MoTa?: string;
  AnhBia?: string;
}

export interface SachTacGiaRow {
  MaSachTacGia: number;
  MaSach: string;
  MaTacGia: number;
}

export interface PhieuMuonRow {
  MaPhieuMuon: string;
  MaDocGia: string;
  NgayMuon: string;
}

export interface ChiTietPhieuMuonRow {
  MaChiTietMuon: number;
  MaPhieuMuon: string;
  MaSach: string;
  HanTra: string;
  SoLanGiaHan?: number;
}

export interface PhieuTraRow {
  MaPhieuTra: string;
  MaDocGia: string;
  NgayTra: string;
  TongTienPhat: number;
}

export interface ChiTietPhieuTraRow {
  MaChiTietTra: number;
  MaPhieuTra: string;
  MaChiTietMuon: number;
  TienPhat: number;
}

export interface TaiKhoanRow extends TaiKhoan {
  MatKhauDemo: string;
}

export interface LibraryDatabase {
  // 12 core tables
  LOAIDOCGIA: LoaiDocGia[];
  DOCGIA: DocGia[];
  THELOAI: TheLoai[];
  TACGIA: TacGia[];
  SACH: SachRow[];
  SACH_TACGIA: SachTacGiaRow[];
  PHIEUMUON: PhieuMuonRow[];
  CHITIETPHIEUMUON: ChiTietPhieuMuonRow[];
  PHIEUTRA: PhieuTraRow[];
  CHITIETPHIEUTRA: ChiTietPhieuTraRow[];
  PHIEUTHUTIENPHAT: PhieuThuTienPhat[];
  THAMSO: ThamSo[];
  // Extended system & UIT Portal tables
  TAIKHOAN: TaiKhoanRow[];
  NHATKYTHAOTAC: NhatKyThaoTac[];
  NGANHHOC: NganhHoc[];
  PHONGHOP: PhongHop[];
  DATPHONG: LichDatPhong[];
  YEUCAUTAILIEU: YeuCauTaiLieu[];
  TINTUC: TinHoatDong[];
  TUSACHCHUYENDE: TuSachChuyenDe[];
  CAUHINHCONG: LibraryPortalConfig;
  HUONGDAN: LibraryGuideData;
}

