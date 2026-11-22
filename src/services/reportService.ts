import type { BaoCaoBM71Response, BaoCaoBM72Response, BaoCaoBM72Row } from '../types/library';
import { downloadCsvFile } from '../lib/utils';
import {
  calculateReturnFine,
  computeCategoryReportPercentages,
} from './rules/circulationRules';
import { diffDaysIso, formatDateVn } from './rules/dateUtils';
import { loadDb } from './storage';

export const reportService = {
  async getBM71(thang: number, nam: number): Promise<BaoCaoBM71Response> {
    const db = loadDb();
    const ymPrefix = `${nam}-${String(thang).padStart(2, '0')}`;
    const validLoanIds = new Set(
      db.PHIEUMUON.filter((pm) => pm.NgayMuon.startsWith(ymPrefix)).map((pm) => pm.MaPhieuMuon)
    );
    const rawRows = db.THELOAI.map((tl) => ({
      MaTheLoai: tl.MaTheLoai,
      TenTheLoai: tl.TenTheLoai,
      SoLuotMuon: db.CHITIETPHIEUMUON.filter((ct) => {
        if (!validLoanIds.has(ct.MaPhieuMuon)) return false;
        const sach = db.SACH.find((s) => s.MaSach === ct.MaSach);
        return sach?.MaTheLoai === tl.MaTheLoai;
      }).length,
    }));
    const { tongSoLuotMuon, rows } = computeCategoryReportPercentages(rawRows);
    return { thang, nam, tongSoLuotMuon, rows };
  },

  async getBM72(ngay: string): Promise<BaoCaoBM72Response> {
    const db = loadDb();
    const rows: BaoCaoBM72Row[] = [];

    for (const ct of db.CHITIETPHIEUMUON) {
      const pm = db.PHIEUMUON.find((p) => p.MaPhieuMuon === ct.MaPhieuMuon);
      if (!pm || diffDaysIso(ngay, pm.NgayMuon) < 0) continue;
      const tr = db.CHITIETPHIEUTRA.find((t) => t.MaChiTietMuon === ct.MaChiTietMuon);
      const pt = tr ? db.PHIEUTRA.find((p) => p.MaPhieuTra === tr.MaPhieuTra) : undefined;
      const sach = db.SACH.find((s) => s.MaSach === ct.MaSach);
      const docGia = db.DOCGIA.find((d) => d.MaDocGia === pm.MaDocGia);

      if (pt && diffDaysIso(ngay, pt.NgayTra) >= 0) {
        const fine = calculateReturnFine(ct.HanTra, pt.NgayTra);
        if (fine.soNgayTraTre > 0) {
          rows.push({
            MaChiTietMuon: ct.MaChiTietMuon,
            MaSach: ct.MaSach,
            TenSach: sach?.TenSach || ct.MaSach,
            MaDocGia: pm.MaDocGia,
            HoTenDocGia: docGia?.HoTen || pm.MaDocGia,
            NgayMuon: pm.NgayMuon,
            HanTra: ct.HanTra,
            NgayTra: pt.NgayTra,
            SoNgayTraTre: fine.soNgayTraTre,
            TienPhatDuKien: tr?.TienPhat ?? fine.tienPhat,
            TrangThai: 'Đã trả trễ',
          });
        }
      } else {
        const fine = calculateReturnFine(ct.HanTra, ngay);
        if (fine.soNgayTraTre > 0) {
          rows.push({
            MaChiTietMuon: ct.MaChiTietMuon,
            MaSach: ct.MaSach,
            TenSach: sach?.TenSach || ct.MaSach,
            MaDocGia: pm.MaDocGia,
            HoTenDocGia: docGia?.HoTen || pm.MaDocGia,
            NgayMuon: pm.NgayMuon,
            HanTra: ct.HanTra,
            NgayTra: null,
            SoNgayTraTre: fine.soNgayTraTre,
            TienPhatDuKien: fine.tienPhat,
            TrangThai: 'Chưa trả (Quá hạn)',
          });
        }
      }
    }

    rows.sort((a, b) => b.SoNgayTraTre - a.SoNgayTraTre);
    return {
      ngay,
      tongSoSachTre: rows.length,
      tongTienPhat: rows.reduce((sum, r) => sum + r.TienPhatDuKien, 0),
      rows,
    };
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
