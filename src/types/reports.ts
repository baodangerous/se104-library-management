export interface BaoCaoBM71Row {
  MaTheLoai: string;
  TenTheLoai: string;
  SoLuotMuon: number;
  TiLe: number;
}

export interface BaoCaoBM71Response {
  thang: number;
  nam: number;
  tongSoLuotMuon: number;
  rows: BaoCaoBM71Row[];
}

export interface BaoCaoBM72Row {
  MaChiTietMuon: number;
  MaSach: string;
  TenSach: string;
  MaDocGia: string;
  HoTenDocGia: string;
  NgayMuon: string;
  HanTra: string;
  NgayTra: string | null;
  SoNgayTraTre: number;
  TienPhatDuKien: number;
  TrangThai: 'Chưa trả (Quá hạn)' | 'Đã trả trễ';
}

export interface BaoCaoBM72Response {
  ngay: string;
  tongSoSachTre: number;
  tongTienPhat: number;
  rows: BaoCaoBM72Row[];
}

export interface DashboardSummary {
  tongSach: number;
  sachCoSan: number;
  sachDangMuon: number;
  tongDocGia: number;
  docGiaConHan: number;
  sachQuaHan: number;
  tongNoHienHanh: number;
  luotMuonThangNay: number;
  muonTheoTheLoai: BaoCaoBM71Row[];
  xuHuongMuon6Thang: { thang: string; soLuotMuon: number; soLuotTra: number }[];
  giaoDichGanDay: {
    loai: 'MUON' | 'TRA' | 'THU_PHAT';
    maPhieu: string;
    tenDocGia: string;
    ngay: string;
    moTa: string;
  }[];
}
