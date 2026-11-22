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
  NgonNguSach,
  NguonTaiLieu,
  PhongHop,
  YeuCauTaiLieu,
} from '../types/portal';

/**
 * Raw persisted row shapes mirroring the 12 core relational tables
 * + TAIKHOAN + NHATKYTHAOTAC + PHONGHOP (+ service request tables).
 * Note: SACH intentionally does NOT store TinhTrang.
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
  TAIKHOAN: TaiKhoanRow[];
  NHATKYTHAOTAC: NhatKyThaoTac[];
  PHONGHOP: PhongHop[];
  DATPHONG: LichDatPhong[];
  YEUCAUTAILIEU: YeuCauTaiLieu[];
}
