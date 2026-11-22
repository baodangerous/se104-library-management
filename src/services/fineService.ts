import type { PhieuThuTienPhat } from '../types/library';
import { validateFinePayment } from './rules/circulationRules';
import { formatVnd } from './rules/dateUtils';
import { appendAuditLog, loadDb, mutateDb, nextPrefixedId } from '../database/dbEngine';

export function listFineReceiptsSync(): PhieuThuTienPhat[] {
  const db = loadDb();
  return [...db.PHIEUTHUTIENPHAT]
    .sort(
      (a, b) =>
        b.NgayThu.localeCompare(a.NgayThu) || b.MaPhieuThu.localeCompare(a.MaPhieuThu)
    )
    .map((p) => ({
      ...p,
      HoTenDocGia: db.DOCGIA.find((d) => d.MaDocGia === p.MaDocGia)?.HoTen || p.MaDocGia,
    }));
}

export function createFineReceiptSync(payload: {
  MaDocGia: string;
  NgayThu: string;
  SoTienThu: number;
}): PhieuThuTienPhat {
  return mutateDb((db) => {
    const reader = db.DOCGIA.find((d) => d.MaDocGia === payload.MaDocGia);
    if (!reader) throw new Error('Không tìm thấy thẻ độc giả.');
    const check = validateFinePayment(reader.TongNo, payload.SoTienThu);
    if (!check.valid || check.conLai === undefined) throw new Error(check.error);
    const receipt: PhieuThuTienPhat = {
      MaPhieuThu: nextPrefixedId(db.PHIEUTHUTIENPHAT.map((p) => p.MaPhieuThu), 'PTT'),
      MaDocGia: reader.MaDocGia,
      HoTenDocGia: reader.HoTen,
      NgayThu: payload.NgayThu,
      TongNoTruocThu: reader.TongNo,
      SoTienThu: payload.SoTienThu,
      ConLai: check.conLai,
    };
    db.PHIEUTHUTIENPHAT.push(receipt);
    reader.TongNo = check.conLai;
    appendAuditLog(
      db,
      'THU_PHAT',
      'PHIEUTHUTIENPHAT',
      `Thu ${formatVnd(receipt.SoTienThu)} của ${reader.HoTen}, còn lại ${formatVnd(receipt.ConLai)}.`
    );
    return receipt;
  });
}
