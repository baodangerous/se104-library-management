import type { DashboardSummary } from '../types/library';
import { hydrateBooks } from './bookHydrator';
import { hydrateReaders } from './readerService';
import { computeCategoryReportPercentages } from './rules/circulationRules';
import { diffDaysIso, formatVnd, todayIsoDate } from './rules/dateUtils';
import { loadDb } from '../database/dbEngine';

export function buildDashboardSummary(): DashboardSummary {
  const db = loadDb();
  const today = todayIsoDate();
  const books = hydrateBooks(db);
  const readers = hydrateReaders(db);
  const sachDangMuon = books.filter((b) => b.TinhTrang === 'Đang mượn').length;
  const sachQuaHan = readers.reduce((sum, r) => sum + (r.SoSachQuaHan || 0), 0);

  const nowYearMonth = today.slice(0, 7);
  const luotMuonThangNay = db.CHITIETPHIEUMUON.filter((ct) => {
    const pm = db.PHIEUMUON.find((p) => p.MaPhieuMuon === ct.MaPhieuMuon);
    return pm?.NgayMuon.startsWith(nowYearMonth);
  }).length;

  const catRaw = db.THELOAI.map((tl) => ({
    MaTheLoai: tl.MaTheLoai,
    TenTheLoai: tl.TenTheLoai,
    SoLuotMuon: db.CHITIETPHIEUMUON.filter((ct) => {
      const s = db.SACH.find((b) => b.MaSach === ct.MaSach);
      return s?.MaTheLoai === tl.MaTheLoai;
    }).length,
  }));
  const muonTheoTheLoai = computeCategoryReportPercentages(catRaw).rows;

  const nowDt = new Date();
  const xuHuongMuon6Thang = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(nowDt.getFullYear(), nowDt.getMonth() - (5 - i), 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = `T${d.getMonth() + 1}/${String(d.getFullYear()).slice(-2)}`;
    const soLuotMuon = db.CHITIETPHIEUMUON.filter((ct) => {
      const pm = db.PHIEUMUON.find((p) => p.MaPhieuMuon === ct.MaPhieuMuon);
      return pm?.NgayMuon.startsWith(ym);
    }).length;
    const soLuotTra = db.CHITIETPHIEUTRA.filter((tr) => {
      const pt = db.PHIEUTRA.find((p) => p.MaPhieuTra === tr.MaPhieuTra);
      return pt?.NgayTra.startsWith(ym);
    }).length;
    return { thang: label, soLuotMuon, soLuotTra };
  });

  const giaoDichGanDay = [
    ...db.PHIEUMUON.map((pm) => ({
      loai: 'MUON' as const,
      maPhieu: pm.MaPhieuMuon,
      tenDocGia: db.DOCGIA.find((d) => d.MaDocGia === pm.MaDocGia)?.HoTen || pm.MaDocGia,
      ngay: pm.NgayMuon,
      moTa: `Mượn ${db.CHITIETPHIEUMUON.filter((c) => c.MaPhieuMuon === pm.MaPhieuMuon).length} quyển sách`,
    })),
    ...db.PHIEUTRA.map((pt) => ({
      loai: 'TRA' as const,
      maPhieu: pt.MaPhieuTra,
      tenDocGia: db.DOCGIA.find((d) => d.MaDocGia === pt.MaDocGia)?.HoTen || pt.MaDocGia,
      ngay: pt.NgayTra,
      moTa: `Trả sách · Phạt ${formatVnd(pt.TongTienPhat)}`,
    })),
    ...db.PHIEUTHUTIENPHAT.map((p) => ({
      loai: 'THU_PHAT' as const,
      maPhieu: p.MaPhieuThu,
      tenDocGia: db.DOCGIA.find((d) => d.MaDocGia === p.MaDocGia)?.HoTen || p.MaDocGia,
      ngay: p.NgayThu,
      moTa: `Thu ${formatVnd(p.SoTienThu)} · Còn nợ ${formatVnd(p.ConLai)}`,
    })),
  ]
    .sort((a, b) => b.ngay.localeCompare(a.ngay))
    .slice(0, 8);

  return {
    tongSach: books.length,
    sachCoSan: books.length - sachDangMuon,
    sachDangMuon,
    tongDocGia: readers.length,
    docGiaConHan: readers.filter((r) => diffDaysIso(r.NgayHetHan, today) >= 0).length,
    sachQuaHan,
    tongNoHienHanh: readers.reduce((sum, r) => sum + r.TongNo, 0),
    luotMuonThangNay,
    muonTheoTheLoai,
    xuHuongMuon6Thang,
    giaoDichGanDay,
  };
}
