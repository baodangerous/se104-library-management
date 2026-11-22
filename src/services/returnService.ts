import {
  appendAuditLog,
  loadDb,
  mutateDb,
  nextNumericId,
  nextPrefixedId,
} from '../database/dbEngine';
import type { PhieuTra } from '../types/library';
import { calculateReturnFine, validateLoanRenewal } from './rules/circulationRules';
import { diffDaysIso, formatVnd, isValidIsoDate, todayIsoDate } from './rules/dateUtils';

export function listReturnsSync(): PhieuTra[] {
  const db = loadDb();
  return [...db.PHIEUTRA]
    .sort((a, b) => b.NgayTra.localeCompare(a.NgayTra) || b.MaPhieuTra.localeCompare(a.MaPhieuTra))
    .map((pt) => ({
      ...pt,
      HoTenDocGia: db.DOCGIA.find((d) => d.MaDocGia === pt.MaDocGia)?.HoTen || pt.MaDocGia,
      ChiTiet: db.CHITIETPHIEUTRA.filter((t) => t.MaPhieuTra === pt.MaPhieuTra).map((tr) => {
        const ct = db.CHITIETPHIEUMUON.find((c) => c.MaChiTietMuon === tr.MaChiTietMuon);
        const pm = db.PHIEUMUON.find((p) => p.MaPhieuMuon === ct?.MaPhieuMuon);
        const s = db.SACH.find((b) => b.MaSach === ct?.MaSach);
        const fine = ct ? calculateReturnFine(ct.HanTra, pt.NgayTra) : { soNgayTraTre: 0 };
        return {
          MaChiTietTra: tr.MaChiTietTra,
          MaPhieuTra: pt.MaPhieuTra,
          MaChiTietMuon: tr.MaChiTietMuon,
          MaSach: ct?.MaSach || '',
          TenSach: s?.TenSach || '',
          NgayMuon: pm?.NgayMuon || '',
          HanTra: ct?.HanTra || '',
          SoNgayTraTre: fine.soNgayTraTre,
          TienPhat: tr.TienPhat,
        };
      }),
    }));
}

export function createReturnSync(payload: {
  MaDocGia: string;
  NgayTra: string;
  MaChiTietMuonList: number[];
}): { MaPhieuTra: string; TongTienPhat: number; TongNoMoi: number } {
  return mutateDb((db) => {
    if (!isValidIsoDate(payload.NgayTra)) {
      throw new Error('Ngày trả không hợp lệ.');
    }
    if (!payload.MaChiTietMuonList || payload.MaChiTietMuonList.length === 0) {
      throw new Error('Vui lòng chọn ít nhất 1 quyển sách cần trả.');
    }
    const uniqueIds = new Set(payload.MaChiTietMuonList);
    if (uniqueIds.size !== payload.MaChiTietMuonList.length) {
      throw new Error('Danh sách sách trả có mục bị trùng lặp.');
    }
    const reader = db.DOCGIA.find((d) => d.MaDocGia === payload.MaDocGia);
    if (!reader) throw new Error('Không tìm thấy thẻ độc giả.');
    const maPhieuTra = nextPrefixedId(db.PHIEUTRA.map((p) => p.MaPhieuTra), 'PT');
    let tongPhat = 0;
    const details: { MaChiTietMuon: number; TienPhat: number }[] = [];
    for (const ctId of payload.MaChiTietMuonList) {
      if (db.CHITIETPHIEUTRA.some((t) => t.MaChiTietMuon === ctId)) {
        throw new Error('Sách này đã được trả trước đó.');
      }
      const ct = db.CHITIETPHIEUMUON.find((c) => c.MaChiTietMuon === ctId);
      if (!ct) throw new Error('Không tìm thấy chi tiết phiếu mượn.');
      const pm = db.PHIEUMUON.find((p) => p.MaPhieuMuon === ct.MaPhieuMuon);
      if (!pm || pm.MaDocGia !== reader.MaDocGia) {
        throw new Error('Chi tiết mượn không thuộc về độc giả đã chọn.');
      }
      if (diffDaysIso(payload.NgayTra, pm.NgayMuon) < 0) {
        throw new Error(`Ngày trả (${payload.NgayTra}) không được trước ngày mượn (${pm.NgayMuon}).`);
      }
      const { tienPhat } = calculateReturnFine(ct.HanTra, payload.NgayTra);
      tongPhat += tienPhat;
      details.push({ MaChiTietMuon: ctId, TienPhat: tienPhat });
    }
    db.PHIEUTRA.push({
      MaPhieuTra: maPhieuTra,
      MaDocGia: reader.MaDocGia,
      NgayTra: payload.NgayTra,
      TongTienPhat: tongPhat,
    });
    for (const d of details) {
      db.CHITIETPHIEUTRA.push({
        MaChiTietTra: nextNumericId(db.CHITIETPHIEUTRA.map((t) => t.MaChiTietTra)),
        MaPhieuTra: maPhieuTra,
        MaChiTietMuon: d.MaChiTietMuon,
        TienPhat: d.TienPhat,
      });
    }
    reader.TongNo += tongPhat;
    appendAuditLog(
      db,
      'NHAN_TRA',
      'PHIEUTRA',
      `Lập phiếu trả ${maPhieuTra} (${details.length} sách, phạt ${formatVnd(tongPhat)}).`
    );
    return { MaPhieuTra: maPhieuTra, TongTienPhat: tongPhat, TongNoMoi: reader.TongNo };
  });
}

export function renewLoanItemSync(
  maChiTietMuon: number,
  ngayGiaHan: string = todayIsoDate()
): { MaChiTietMuon: number; HanTraMoi: string; SoLanGiaHan: number } {
  return mutateDb((db) => {
    const ct = db.CHITIETPHIEUMUON.find((c) => c.MaChiTietMuon === maChiTietMuon);
    if (!ct) throw new Error('Không tìm thấy chi tiết phiếu mượn.');
    const pm = db.PHIEUMUON.find((p) => p.MaPhieuMuon === ct.MaPhieuMuon);
    if (!pm) throw new Error('Không tìm thấy phiếu mượn.');
    const reader = db.DOCGIA.find((d) => d.MaDocGia === pm.MaDocGia);
    if (!reader) throw new Error('Không tìm thấy thẻ độc giả.');
    const daTra = db.CHITIETPHIEUTRA.some((t) => t.MaChiTietMuon === ct.MaChiTietMuon);
    const currentRenewals = ct.SoLanGiaHan ?? 0;

    const check = validateLoanRenewal({
      today: ngayGiaHan,
      hanTra: ct.HanTra,
      ngayHetHanThe: reader.NgayHetHan,
      daTra,
      soLanGiaHan: currentRenewals,
      soNgayMuonToiDa: db.THAMSO[0].SoNgayMuonToiDa,
    });
    if (!check.valid || !check.newHanTra) {
      throw new Error(check.error);
    }

    ct.HanTra = check.newHanTra;
    ct.SoLanGiaHan = currentRenewals + 1;
    const sach = db.SACH.find((s) => s.MaSach === ct.MaSach);
    appendAuditLog(
      db,
      'GIA_HAN_SACH',
      'CHITIETPHIEUMUON',
      `Gia hạn sách "${sach?.TenSach || ct.MaSach}" (${ct.MaPhieuMuon}) cho ${reader.HoTen} đến ${check.newHanTra} (lần ${ct.SoLanGiaHan}).`
    );
    return {
      MaChiTietMuon: ct.MaChiTietMuon,
      HanTraMoi: ct.HanTra,
      SoLanGiaHan: ct.SoLanGiaHan,
    };
  });
}

