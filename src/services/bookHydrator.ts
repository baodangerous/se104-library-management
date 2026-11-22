import type { Sach } from '../types/library';
import type { LibraryDatabase } from '../database/schema';
import { nextNumericId } from '../database/dbEngine';

export function hydrateBooks(db: LibraryDatabase, hideBorrowerName = false): Sach[] {
  const returnedIds = new Set(db.CHITIETPHIEUTRA.map((t) => t.MaChiTietMuon));
  const activeLoanByBook = new Map<string, { MaPhieuMuon: string; HanTra: string }>();
  for (const ct of db.CHITIETPHIEUMUON) {
    if (!returnedIds.has(ct.MaChiTietMuon)) {
      activeLoanByBook.set(ct.MaSach, { MaPhieuMuon: ct.MaPhieuMuon, HanTra: ct.HanTra });
    }
  }

  return db.SACH.map((s) => {
    const cat = db.THELOAI.find((c) => c.MaTheLoai === s.MaTheLoai);
    const authorLinks = db.SACH_TACGIA.filter((l) => l.MaSach === s.MaSach);
    const authors = authorLinks
      .map((l) => db.TACGIA.find((tg) => tg.MaTacGia === l.MaTacGia))
      .filter((tg): tg is { MaTacGia: number; TenTacGia: string } => Boolean(tg));

    const active = activeLoanByBook.get(s.MaSach);
    let borrowerName: string | null = null;
    if (active && !hideBorrowerName) {
      const pm = db.PHIEUMUON.find((p) => p.MaPhieuMuon === active.MaPhieuMuon);
      borrowerName = db.DOCGIA.find((d) => d.MaDocGia === pm?.MaDocGia)?.HoTen ?? null;
    }

    const major = db.NGANHHOC.find((m) => m.MaNganh === s.MaNganh);
    return {
      ...s,
      TenTheLoai: cat?.TenTheLoai || s.MaTheLoai,
      TenNganh: major?.TenNganh || s.MaNganh || 'Chung',
      TacGiaList: authors.map((a) => a.TenTacGia),
      TacGiaIds: authors.map((a) => a.MaTacGia),
      TinhTrang: active ? 'Đang mượn' : 'Có sẵn',
      NguoiDangMuon: borrowerName,
      HanTraHienTai: active?.HanTra ?? null,
    };
  });
}

export function linkBookAuthors(
  db: LibraryDatabase,
  maSach: string,
  authorNames: string[]
): void {
  db.SACH_TACGIA = db.SACH_TACGIA.filter((l) => l.MaSach !== maSach);
  const uniqueNames = Array.from(new Set(authorNames.map((n) => n.trim()).filter(Boolean)));
  for (const name of uniqueNames) {
    let tg = db.TACGIA.find((t) => t.TenTacGia.toLowerCase() === name.toLowerCase());
    if (!tg) {
      tg = { MaTacGia: nextNumericId(db.TACGIA.map((t) => t.MaTacGia)), TenTacGia: name };
      db.TACGIA.push(tg);
    }
    db.SACH_TACGIA.push({
      MaSachTacGia: nextNumericId(db.SACH_TACGIA.map((l) => l.MaSachTacGia)),
      MaSach: maSach,
      MaTacGia: tg.MaTacGia,
    });
  }
}
