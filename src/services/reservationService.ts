import { appendAuditLog, loadDb, mutateDb, nextPrefixedId } from '../database/dbEngine';
import type { DatTruoc } from '../types/portal';
import { hydrateBooks } from './bookHydrator';
import { todayIsoDate } from './rules/dateUtils';

export const reservationService = {
  async list(): Promise<DatTruoc[]> {
    return [...loadDb().DATTRUOC];
  },

  async listByBook(maSach: string): Promise<DatTruoc[]> {
    return loadDb().DATTRUOC.filter(
      (r) => r.MaSach === maSach && (r.TrangThai === 'Đang chờ' || r.TrangThai === 'Đã giữ chỗ')
    );
  },

  async create(maSach: string, maDocGia: string): Promise<DatTruoc> {
    return mutateDb((db) => {
      const book = hydrateBooks(db).find((b) => b.MaSach === maSach);
      if (!book) throw new Error('Không tìm thấy đầu sách.');
      const reader = db.DOCGIA.find((d) => d.MaDocGia === maDocGia);
      if (!reader) throw new Error('Không tìm thấy thẻ độc giả.');

      const dup = db.DATTRUOC.some(
        (r) =>
          r.MaSach === maSach &&
          r.MaDocGia === maDocGia &&
          (r.TrangThai === 'Đang chờ' || r.TrangThai === 'Đã giữ chỗ')
      );
      if (dup) {
        throw new Error('Bạn đã có yêu cầu đặt trước đang hoạt động cho đầu sách này.');
      }

      const item: DatTruoc = {
        MaDatTruoc: nextPrefixedId(db.DATTRUOC.map((r) => r.MaDatTruoc), 'DT'),
        MaSach: book.MaSach,
        TenSach: book.TenSach,
        MaDocGia: reader.MaDocGia,
        HoTenDocGia: reader.HoTen,
        NgayDat: todayIsoDate(),
        TrangThai: book.TinhTrang === 'Có sẵn' ? 'Đã giữ chỗ' : 'Đang chờ',
      };
      db.DATTRUOC.unshift(item);
      appendAuditLog(
        db,
        'DAT_TRUOC',
        'DATTRUOC',
        `${reader.HoTen} (${reader.MaDocGia}) đặt trước sách ${book.MaSach} (${item.TrangThai}).`
      );
      return item;
    });
  },

  async cancel(maDatTruoc: string): Promise<{ success: boolean }> {
    return mutateDb((db) => {
      const target = db.DATTRUOC.find((r) => r.MaDatTruoc === maDatTruoc);
      if (!target) throw new Error('Không tìm thấy phiếu đặt trước.');
      target.TrangThai = 'Đã hủy';
      appendAuditLog(db, 'HUY_DAT_TRUOC', 'DATTRUOC', `Hủy đặt trước ${maDatTruoc}.`);
      return { success: true };
    });
  },
};
