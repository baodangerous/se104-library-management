import type {
  DashboardSummary,
  PhieuMuon,
  PhieuThuTienPhat,
  PhieuTra,
} from '../types/library';
import { hydrateBooks } from './bookHydrator';
import { buildDashboardSummary } from './dashboardMetrics';
import { createFineReceiptSync, listFineReceiptsSync } from './fineService';
import { calculateReturnFine, validateBorrowEligibility } from './rules/circulationRules';
import { formatVnd } from './rules/dateUtils';
import { appendAuditLog, loadDb, mutateDb, nextNumericId, nextPrefixedId } from './storage';

export interface ActiveBorrowedItem {
  MaChiTietMuon: number;
  MaPhieuMuon: string;
  MaSach: string;
  TenSach: string;
  TenTheLoai: string;
  NgayMuon: string;
  HanTra: string;
}

export const circulationService = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    return buildDashboardSummary();
  },

  async listLoans(): Promise<PhieuMuon[]> {
    const db = loadDb();
    return [...db.PHIEUMUON]
      .sort((a, b) => b.NgayMuon.localeCompare(a.NgayMuon) || b.MaPhieuMuon.localeCompare(a.MaPhieuMuon))
      .map((pm) => {
        const reader = db.DOCGIA.find((d) => d.MaDocGia === pm.MaDocGia);
        const chiTiet = db.CHITIETPHIEUMUON.filter((c) => c.MaPhieuMuon === pm.MaPhieuMuon).map((ct) => {
          const sach = db.SACH.find((s) => s.MaSach === ct.MaSach);
          const tr = db.CHITIETPHIEUTRA.find((t) => t.MaChiTietMuon === ct.MaChiTietMuon);
          const pt = tr ? db.PHIEUTRA.find((p) => p.MaPhieuTra === tr.MaPhieuTra) : undefined;
          return {
            MaChiTietMuon: ct.MaChiTietMuon,
            MaPhieuMuon: ct.MaPhieuMuon,
            MaSach: ct.MaSach,
            TenSach: sach?.TenSach || ct.MaSach,
            NgayMuon: pm.NgayMuon,
            HanTra: ct.HanTra,
            NgayTra: pt?.NgayTra ?? null,
            TienPhat: tr?.TienPhat ?? null,
            DaTra: Boolean(tr),
          };
        });
        return { ...pm, HoTenDocGia: reader?.HoTen || pm.MaDocGia, ChiTiet: chiTiet };
      });
  },

  async createLoan(payload: {
    MaDocGia: string;
    NgayMuon: string;
    MaSachList: string[];
  }): Promise<{ MaPhieuMuon: string; HanTra: string }> {
    return mutateDb((db) => {
      const reader = db.DOCGIA.find((d) => d.MaDocGia === payload.MaDocGia);
      if (!reader) throw new Error('Không tìm thấy thẻ độc giả.');
      const books = hydrateBooks(db);
      const returnedIds = new Set(db.CHITIETPHIEUTRA.map((t) => t.MaChiTietMuon));
      const readerLoans = new Set(db.PHIEUMUON.filter((p) => p.MaDocGia === reader.MaDocGia).map((p) => p.MaPhieuMuon));
      const activeLoans = db.CHITIETPHIEUMUON.filter(
        (ct) => readerLoans.has(ct.MaPhieuMuon) && !returnedIds.has(ct.MaChiTietMuon)
      ).map((ct) => ({
        MaSach: ct.MaSach,
        TenSach: db.SACH.find((s) => s.MaSach === ct.MaSach)?.TenSach || ct.MaSach,
        HanTra: ct.HanTra,
      }));
      const requestedBooks = payload.MaSachList.map((id) => {
        const b = books.find((item) => item.MaSach === id);
        if (!b) throw new Error(`Không tìm thấy mã sách ${id}.`);
        return { MaSach: b.MaSach, TenSach: b.TenSach, TinhTrang: b.TinhTrang };
      });
      const check = validateBorrowEligibility({
        ngayMuon: payload.NgayMuon,
        ngayLapThe: reader.NgayLapThe,
        ngayHetHan: reader.NgayHetHan,
        activeLoans,
        requestedBooks,
        thamSo: db.THAMSO[0],
      });
      if (!check.valid || !check.hanTra) throw new Error(check.error);

      const maPhieuMuon = nextPrefixedId(db.PHIEUMUON.map((p) => p.MaPhieuMuon), 'PM');
      db.PHIEUMUON.push({ MaPhieuMuon: maPhieuMuon, MaDocGia: reader.MaDocGia, NgayMuon: payload.NgayMuon });
      for (const maSach of payload.MaSachList) {
        db.CHITIETPHIEUMUON.push({
          MaChiTietMuon: nextNumericId(db.CHITIETPHIEUMUON.map((c) => c.MaChiTietMuon)),
          MaPhieuMuon: maPhieuMuon,
          MaSach: maSach,
          HanTra: check.hanTra,
        });
      }
      appendAuditLog(db, 'CHO_MUON', 'PHIEUMUON', `Lập phiếu mượn ${maPhieuMuon} cho ${reader.HoTen} (${payload.MaSachList.length} sách).`);
      return { MaPhieuMuon: maPhieuMuon, HanTra: check.hanTra };
    });
  },

  async listReaderActiveLoans(maDocGia: string): Promise<ActiveBorrowedItem[]> {
    const db = loadDb();
    const returnedIds = new Set(db.CHITIETPHIEUTRA.map((t) => t.MaChiTietMuon));
    const pmMap = new Map(db.PHIEUMUON.filter((p) => p.MaDocGia === maDocGia).map((p) => [p.MaPhieuMuon, p]));
    return db.CHITIETPHIEUMUON.filter((ct) => pmMap.has(ct.MaPhieuMuon) && !returnedIds.has(ct.MaChiTietMuon)).map((ct) => {
      const s = db.SACH.find((b) => b.MaSach === ct.MaSach);
      const tl = db.THELOAI.find((c) => c.MaTheLoai === s?.MaTheLoai);
      return {
        MaChiTietMuon: ct.MaChiTietMuon,
        MaPhieuMuon: ct.MaPhieuMuon,
        MaSach: ct.MaSach,
        TenSach: s?.TenSach || ct.MaSach,
        TenTheLoai: tl?.TenTheLoai || '',
        NgayMuon: pmMap.get(ct.MaPhieuMuon)!.NgayMuon,
        HanTra: ct.HanTra,
      };
    });
  },

  async listReturns(): Promise<PhieuTra[]> {
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
  },

  async createReturn(payload: {
    MaDocGia: string;
    NgayTra: string;
    MaChiTietMuonList: number[];
  }): Promise<{ MaPhieuTra: string; TongTienPhat: number; TongNoMoi: number }> {
    return mutateDb((db) => {
      const reader = db.DOCGIA.find((d) => d.MaDocGia === payload.MaDocGia);
      if (!reader) throw new Error('Không tìm thấy thẻ độc giả.');
      const maPhieuTra = nextPrefixedId(db.PHIEUTRA.map((p) => p.MaPhieuTra), 'PT');
      let tongPhat = 0;
      const details: { MaChiTietMuon: number; TienPhat: number }[] = [];
      for (const ctId of payload.MaChiTietMuonList) {
        if (db.CHITIETPHIEUTRA.some((t) => t.MaChiTietMuon === ctId)) throw new Error('Sách này đã được trả trước đó.');
        const ct = db.CHITIETPHIEUMUON.find((c) => c.MaChiTietMuon === ctId);
        if (!ct) throw new Error('Không tìm thấy chi tiết phiếu mượn.');
        const { tienPhat } = calculateReturnFine(ct.HanTra, payload.NgayTra);
        tongPhat += tienPhat;
        details.push({ MaChiTietMuon: ctId, TienPhat: tienPhat });
      }
      db.PHIEUTRA.push({ MaPhieuTra: maPhieuTra, MaDocGia: reader.MaDocGia, NgayTra: payload.NgayTra, TongTienPhat: tongPhat });
      for (const d of details) {
        db.CHITIETPHIEUTRA.push({
          MaChiTietTra: nextNumericId(db.CHITIETPHIEUTRA.map((t) => t.MaChiTietTra)),
          MaPhieuTra: maPhieuTra,
          MaChiTietMuon: d.MaChiTietMuon,
          TienPhat: d.TienPhat,
        });
      }
      reader.TongNo += tongPhat;
      appendAuditLog(db, 'NHAN_TRA', 'PHIEUTRA', `Lập phiếu trả ${maPhieuTra} (${details.length} sách, phạt ${formatVnd(tongPhat)}).`);
      return { MaPhieuTra: maPhieuTra, TongTienPhat: tongPhat, TongNoMoi: reader.TongNo };
    });
  },

  async listFineReceipts(): Promise<PhieuThuTienPhat[]> {
    return listFineReceiptsSync();
  },

  async createFineReceipt(payload: { MaDocGia: string; NgayThu: string; SoTienThu: number }): Promise<PhieuThuTienPhat> {
    return createFineReceiptSync(payload);
  },
};
