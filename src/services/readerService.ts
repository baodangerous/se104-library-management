import type { DocGia, LoaiDocGia, ThamSo } from '../types/library';
import type { LibraryDatabase } from '../database/schema';
import { validateReaderCard } from './rules/catalogRules';
import { addMonthsIso, diffDaysIso, todayIsoDate } from './rules/dateUtils';
import { matchesVietnameseSearch } from './rules/searchUtils';
import { appendAuditLog, loadDb, mutateDb, nextPrefixedId } from '../database/dbEngine';

export interface ReaderInput {
  HoTen: string;
  MaLoaiDocGia: string;
  NgaySinh: string;
  DiaChi: string;
  Email: string;
  NgayLapThe: string;
}

export function hydrateReaders(db: LibraryDatabase): DocGia[] {
  const today = todayIsoDate();
  const returnedIds = new Set(db.CHITIETPHIEUTRA.map((t) => t.MaChiTietMuon));
  return db.DOCGIA.map((dg) => {
    const loai = db.LOAIDOCGIA.find((l) => l.MaLoaiDocGia === dg.MaLoaiDocGia);
    const readerLoanIds = new Set(
      db.PHIEUMUON.filter((pm) => pm.MaDocGia === dg.MaDocGia).map((pm) => pm.MaPhieuMuon)
    );
    const activeItems = db.CHITIETPHIEUMUON.filter(
      (ct) => readerLoanIds.has(ct.MaPhieuMuon) && !returnedIds.has(ct.MaChiTietMuon)
    );
    const overdueCount = activeItems.filter((ct) => diffDaysIso(today, ct.HanTra) > 0).length;
    return {
      ...dg,
      TenLoaiDocGia: loai?.TenLoaiDocGia || dg.MaLoaiDocGia,
      SoSachDangMuon: activeItems.length,
      SoSachQuaHan: overdueCount,
    };
  });
}

export const readerService = {
  async list(search = '', loai = 'ALL'): Promise<DocGia[]> {
    const db = loadDb();
    let rows = hydrateReaders(db);
    if (search.trim()) {
      rows = rows.filter((r) =>
        matchesVietnameseSearch(search, [r.MaDocGia, r.HoTen, r.Email, r.DiaChi])
      );
    }
    if (loai && loai !== 'ALL') {
      rows = rows.filter((r) => r.MaLoaiDocGia === loai);
    }
    return rows;
  },

  async listTypes(): Promise<LoaiDocGia[]> {
    return loadDb().LOAIDOCGIA;
  },

  async getParams(): Promise<ThamSo> {
    return loadDb().THAMSO[0];
  },

  async create(payload: ReaderInput): Promise<DocGia> {
    return mutateDb((db) => {
      const check = validateReaderCard(payload.NgaySinh, payload.NgayLapThe, db.THAMSO[0]);
      if (!check.valid || !check.ngayHetHan) throw new Error(check.error);
      const maDocGia = nextPrefixedId(db.DOCGIA.map((d) => d.MaDocGia), 'DG');
      db.DOCGIA.push({
        MaDocGia: maDocGia,
        HoTen: payload.HoTen.trim(),
        MaLoaiDocGia: payload.MaLoaiDocGia,
        NgaySinh: payload.NgaySinh,
        DiaChi: payload.DiaChi.trim(),
        Email: payload.Email.trim(),
        NgayLapThe: payload.NgayLapThe,
        NgayHetHan: check.ngayHetHan,
        TongNo: 0,
      });
      appendAuditLog(db, 'LAP_THE', 'DOCGIA', `Lập thẻ độc giả ${maDocGia}: ${payload.HoTen}`);
      return hydrateReaders(db).find((d) => d.MaDocGia === maDocGia)!;
    });
  },

  async update(maDocGia: string, payload: ReaderInput): Promise<DocGia> {
    return mutateDb((db) => {
      const idx = db.DOCGIA.findIndex((d) => d.MaDocGia === maDocGia);
      if (idx === -1) throw new Error('Không tìm thấy thẻ độc giả.');
      const current = db.DOCGIA[idx];
      const check = validateReaderCard(payload.NgaySinh, payload.NgayLapThe, db.THAMSO[0]);
      if (!check.valid || !check.ngayHetHan) throw new Error(check.error);
      const nextExpiry =
        payload.NgayLapThe === current.NgayLapThe ? current.NgayHetHan : check.ngayHetHan;
      db.DOCGIA[idx] = {
        ...current,
        HoTen: payload.HoTen.trim(),
        MaLoaiDocGia: payload.MaLoaiDocGia,
        NgaySinh: payload.NgaySinh,
        DiaChi: payload.DiaChi.trim(),
        Email: payload.Email.trim(),
        NgayLapThe: payload.NgayLapThe,
        NgayHetHan: nextExpiry,
      };
      appendAuditLog(db, 'SUA_DOCGIA', 'DOCGIA', `Cập nhật thẻ độc giả ${maDocGia}.`);
      return hydrateReaders(db).find((d) => d.MaDocGia === maDocGia)!;
    });
  },

  async renewCard(maDocGia: string): Promise<DocGia> {
    return mutateDb((db) => {
      const idx = db.DOCGIA.findIndex((d) => d.MaDocGia === maDocGia);
      if (idx === -1) throw new Error('Không tìm thấy thẻ độc giả.');
      const current = db.DOCGIA[idx];
      const today = todayIsoDate();
      const baseDate = diffDaysIso(current.NgayHetHan, today) >= 0 ? current.NgayHetHan : today;
      const nextExpiry = addMonthsIso(baseDate, db.THAMSO[0].ThoiHanThe);
      db.DOCGIA[idx] = {
        ...current,
        NgayHetHan: nextExpiry,
      };
      appendAuditLog(
        db,
        'GIA_HAN_THE',
        'DOCGIA',
        `Gia hạn thẻ độc giả ${maDocGia} (${current.HoTen}) đến ${nextExpiry}.`
      );
      return hydrateReaders(db).find((d) => d.MaDocGia === maDocGia)!;
    });
  },

  async remove(maDocGia: string): Promise<{ success: boolean }> {
    return mutateDb((db) => {
      const hasLoans = db.PHIEUMUON.some((pm) => pm.MaDocGia === maDocGia);
      if (hasLoans) {
        throw new Error('Không thể xóa độc giả đã phát sinh lịch sử mượn sách.');
      }
      db.DOCGIA = db.DOCGIA.filter((d) => d.MaDocGia !== maDocGia);
      appendAuditLog(db, 'XOA_DOCGIA', 'DOCGIA', `Xóa thẻ độc giả ${maDocGia}.`);
      return { success: true };
    });
  },
};
