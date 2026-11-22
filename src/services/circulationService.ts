import type {
  DashboardSummary,
  PhieuMuon,
  PhieuThuTienPhat,
  PhieuTra,
} from '../types/library';
import { hydrateBooks } from './bookHydrator';
import { buildDashboardSummary } from './dashboardMetrics';
import { createFineReceiptSync, listFineReceiptsSync } from './fineService';
import {
  createReturnSync,
  listReturnsSync,
  renewLoanItemSync,
} from './returnService';
import { validateBorrowEligibility } from './rules/circulationRules';
import { todayIsoDate } from './rules/dateUtils';
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
            SoLanGiaHan: ct.SoLanGiaHan ?? 0,
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
    return listReturnsSync();
  },

  async createReturn(payload: {
    MaDocGia: string;
    NgayTra: string;
    MaChiTietMuonList: number[];
  }): Promise<{ MaPhieuTra: string; TongTienPhat: number; TongNoMoi: number }> {
    return createReturnSync(payload);
  },

  async renewLoanItem(
    maChiTietMuon: number,
    ngayGiaHan: string = todayIsoDate()
  ): Promise<{ MaChiTietMuon: number; HanTraMoi: string; SoLanGiaHan: number }> {
    return renewLoanItemSync(maChiTietMuon, ngayGiaHan);
  },

  async listFineReceipts(): Promise<PhieuThuTienPhat[]> {
    return listFineReceiptsSync();
  },

  async createFineReceipt(payload: { MaDocGia: string; NgayThu: string; SoTienThu: number }): Promise<PhieuThuTienPhat> {
    return createFineReceiptSync(payload);
  },
};
