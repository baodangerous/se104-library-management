import type { BaoCaoBM71Response, BaoCaoBM72Response } from '../types/library';
import { downloadCsvFile } from '../lib/utils';
import { apiRequest } from './apiClient';
import { formatDateVn } from './rules/dateUtils';

export const reportService = {
  async getBM71(thang: number, nam: number): Promise<BaoCaoBM71Response> {
    return apiRequest<BaoCaoBM71Response>(
      `/baocao/bm71?thang=${encodeURIComponent(thang)}&nam=${encodeURIComponent(nam)}`
    );
  },

  async getBM72(ngay: string): Promise<BaoCaoBM72Response> {
    return apiRequest<BaoCaoBM72Response>(
      `/baocao/bm72?ngay=${encodeURIComponent(ngay)}`
    );
  },

  exportBM71Csv(bm71: BaoCaoBM71Response): void {
    downloadCsvFile(
      `UIT_ThongKe_TheLoai_Thang${bm71.thang}_${bm71.nam}.csv`,
      ['STT', 'Mã thể loại', 'Tên thể loại', 'Số lượt mượn', 'Tỉ lệ (%)'],
      [
        ...bm71.rows.map((r, idx) => [idx + 1, r.MaTheLoai, r.TenTheLoai, r.SoLuotMuon, `${r.TiLe}%`]),
        ['', '', 'Tổng cộng', bm71.tongSoLuotMuon, bm71.tongSoLuotMuon > 0 ? '100%' : '0%'],
      ]
    );
  },

  exportBM72Csv(bm72: BaoCaoBM72Response): void {
    downloadCsvFile(
      `UIT_SachTraTre_${bm72.ngay}.csv`,
      ['STT', 'Mã sách', 'Tên sách', 'Mã độc giả', 'Họ tên', 'Ngày mượn', 'Hạn trả', 'Ngày trả', 'Ngày trễ', 'Tiền phạt', 'Trạng thái'],
      bm72.rows.map((r, idx) => [
        idx + 1,
        r.MaSach,
        r.TenSach,
        r.MaDocGia,
        r.HoTenDocGia,
        formatDateVn(r.NgayMuon),
        formatDateVn(r.HanTra),
        r.NgayTra ? formatDateVn(r.NgayTra) : 'Chưa trả',
        r.SoNgayTraTre,
        r.TienPhatDuKien,
        r.TrangThai,
      ])
    );
  },
};
