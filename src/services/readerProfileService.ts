import type {
  ChiTietPhieuMuon,
  DocGia,
  PhieuThuTienPhat,
  ThamSo,
} from '../types/library';
import type { LibraryDatabase } from './dbSchema';
import { hydrateReaders } from './readerService';
import { appendAuditLog, getCurrentActor, loadDb, saveDb } from './storage';

export interface ReaderProfileData {
  docGia: DocGia | null;
  lichSuMuon: ChiTietPhieuMuon[];
  phieuThuPhat: PhieuThuTienPhat[];
  thamSo: ThamSo;
}

export function buildReaderProfile(): ReaderProfileData {
  const db = loadDb();
  const actor = getCurrentActor();
  const maDocGia = actor?.MaDocGia || db.DOCGIA[0]?.MaDocGia || null;
  const docGia = hydrateReaders(db).find((d) => d.MaDocGia === maDocGia) || null;
  if (!docGia) {
    return { docGia: null, lichSuMuon: [], phieuThuPhat: [], thamSo: db.THAMSO[0] };
  }
  const loanMap = new Map(
    db.PHIEUMUON.filter((p) => p.MaDocGia === docGia.MaDocGia).map((p) => [p.MaPhieuMuon, p])
  );
  const lichSuMuon: ChiTietPhieuMuon[] = db.CHITIETPHIEUMUON.filter((ct) =>
    loanMap.has(ct.MaPhieuMuon)
  ).map((ct) => {
    const s = db.SACH.find((b) => b.MaSach === ct.MaSach);
    const tr = db.CHITIETPHIEUTRA.find((t) => t.MaChiTietMuon === ct.MaChiTietMuon);
    const pt = tr ? db.PHIEUTRA.find((p) => p.MaPhieuTra === tr.MaPhieuTra) : undefined;
    return {
      MaChiTietMuon: ct.MaChiTietMuon,
      MaPhieuMuon: ct.MaPhieuMuon,
      MaSach: ct.MaSach,
      TenSach: s?.TenSach || ct.MaSach,
      NgayMuon: loanMap.get(ct.MaPhieuMuon)!.NgayMuon,
      HanTra: ct.HanTra,
      NgayTra: pt?.NgayTra ?? null,
      TienPhat: tr?.TienPhat ?? null,
      DaTra: Boolean(tr),
    };
  });
  const phieuThuPhat = db.PHIEUTHUTIENPHAT.filter((p) => p.MaDocGia === docGia.MaDocGia);
  return { docGia, lichSuMuon, phieuThuPhat, thamSo: db.THAMSO[0] };
}

export function buildBackupSnapshot(): Record<string, unknown> {
  const db = loadDb();
  return {
    version: '2.0',
    exportedAt: new Date().toISOString(),
    tables: {
      LOAIDOCGIA: db.LOAIDOCGIA,
      DOCGIA: db.DOCGIA,
      THELOAI: db.THELOAI,
      TACGIA: db.TACGIA,
      SACH: db.SACH,
      SACH_TACGIA: db.SACH_TACGIA,
      PHIEUMUON: db.PHIEUMUON,
      CHITIETPHIEUMUON: db.CHITIETPHIEUMUON,
      PHIEUTRA: db.PHIEUTRA,
      CHITIETPHIEUTRA: db.CHITIETPHIEUTRA,
      PHIEUTHUTIENPHAT: db.PHIEUTHUTIENPHAT,
      THAMSO: db.THAMSO,
      PHONGHOP: db.PHONGHOP,
    },
  };
}

export function applyBackupSnapshot(snapshot: Record<string, unknown>): { success: boolean } {
  const tables = snapshot.tables as Partial<LibraryDatabase> | undefined;
  if (!tables || !Array.isArray(tables.SACH) || !Array.isArray(tables.THAMSO)) {
    throw new Error('Tệp sao lưu không hợp lệ.');
  }
  const db = loadDb();
  const merged: LibraryDatabase = { ...db, ...tables };
  appendAuditLog(merged, 'KHOI_PHUC', 'HETHONG', 'Khôi phục dữ liệu từ bản sao lưu JSON.');
  saveDb(merged);
  return { success: true };
}
