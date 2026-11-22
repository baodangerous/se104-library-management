import type { ThamSo } from '../../types/library';
import type { ValidationResult } from './catalogRules';
import { addDaysIso, diffDaysIso, formatVnd, isValidIsoDate } from './dateUtils';

export const FINE_PER_OVERDUE_DAY = 1000;

export interface BorrowEligibilityInput {
  ngayMuon: string;
  ngayLapThe: string;
  ngayHetHan: string;
  activeLoans: { MaSach: string; TenSach: string; HanTra: string }[];
  requestedBooks: { MaSach: string; TenSach: string; TinhTrang: 'Có sẵn' | 'Đang mượn' }[];
  thamSo: Pick<ThamSo, 'SoSachMuonToiDa' | 'SoNgayMuonToiDa'>;
}

/**
 * BM4: Validate all 4 borrow eligibility rules and calculate HanTra.
 */
export function validateBorrowEligibility(
  input: BorrowEligibilityInput
): ValidationResult & { hanTra?: string } {
  const { ngayMuon, ngayLapThe, ngayHetHan, activeLoans, requestedBooks, thamSo } = input;

  if (!isValidIsoDate(ngayMuon)) {
    return { valid: false, error: 'Ngày mượn không hợp lệ.' };
  }
  if (requestedBooks.length === 0) {
    return { valid: false, error: 'Vui lòng chọn ít nhất 1 quyển sách để cho mượn.' };
  }

  const seenIds = new Set<string>();
  for (const b of requestedBooks) {
    if (seenIds.has(b.MaSach)) {
      return { valid: false, error: `Sách "${b.TenSach}" (${b.MaSach}) bị chọn trùng lặp.` };
    }
    seenIds.add(b.MaSach);
  }

  if (diffDaysIso(ngayMuon, ngayLapThe) < 0) {
    return {
      valid: false,
      error: `Ngày mượn (${ngayMuon}) không được trước ngày lập thẻ (${ngayLapThe}).`,
    };
  }
  if (diffDaysIso(ngayHetHan, ngayMuon) < 0) {
    return {
      valid: false,
      error: `Thẻ độc giả đã hết hạn từ ngày ${ngayHetHan}. Không thể lập phiếu mượn.`,
    };
  }

  const overdueLoans = activeLoans.filter((loan) => diffDaysIso(ngayMuon, loan.HanTra) > 0);
  if (overdueLoans.length > 0) {
    const first = overdueLoans[0];
    return {
      valid: false,
      error: `Độc giả đang có ${overdueLoans.length} sách mượn quá hạn chưa trả (ví dụ: "${first.TenSach}", hạn trả ${first.HanTra}).`,
    };
  }

  const unavailable = requestedBooks.filter((b) => b.TinhTrang !== 'Có sẵn');
  if (unavailable.length > 0) {
    return {
      valid: false,
      error: `Sách "${unavailable[0].TenSach}" (${unavailable[0].MaSach}) hiện đang được mượn, không thể cho mượn.`,
    };
  }

  const totalAfterBorrow = activeLoans.length + requestedBooks.length;
  if (totalAfterBorrow > thamSo.SoSachMuonToiDa) {
    return {
      valid: false,
      error: `Vượt quá số sách mượn tối đa (${thamSo.SoSachMuonToiDa} quyển). Độc giả đang giữ ${activeLoans.length} quyển và yêu cầu mượn thêm ${requestedBooks.length} quyển.`,
    };
  }

  return { valid: true, hanTra: addDaysIso(ngayMuon, thamSo.SoNgayMuonToiDa) };
}

/**
 * BM5: Calculate overdue days and fine for a returned book.
 */
export function calculateReturnFine(
  hanTra: string,
  ngayTra: string,
  finePerDay: number = FINE_PER_OVERDUE_DAY
): { soNgayTraTre: number; tienPhat: number } {
  const soNgayTraTre = Math.max(0, diffDaysIso(ngayTra, hanTra));
  return { soNgayTraTre, tienPhat: soNgayTraTre * finePerDay };
}

/**
 * BM6: Validate fine collection amount and compute remaining debt.
 */
export function validateFinePayment(
  tongNoHienTai: number,
  soTienThu: number
): ValidationResult & { conLai?: number } {
  if (tongNoHienTai <= 0) {
    return { valid: false, error: 'Độc giả hiện không có công nợ tiền phạt.' };
  }
  if (typeof soTienThu !== 'number' || Number.isNaN(soTienThu) || soTienThu <= 0) {
    return { valid: false, error: 'Số tiền thu phải lớn hơn 0.' };
  }
  if (soTienThu > tongNoHienTai) {
    return {
      valid: false,
      error: `Số tiền thu (${formatVnd(soTienThu)}) không được vượt quá tổng nợ hiện tại (${formatVnd(tongNoHienTai)}).`,
    };
  }
  return { valid: true, conLai: Math.round(tongNoHienTai - soTienThu) };
}

/**
 * BM7.1: Compute percentages safely for category loan statistics.
 */
export function computeCategoryReportPercentages<T extends { SoLuotMuon: number }>(
  rows: T[]
): { tongSoLuotMuon: number; rows: (T & { TiLe: number })[] } {
  const tongSoLuotMuon = rows.reduce((sum, r) => sum + r.SoLuotMuon, 0);
  const enriched = rows.map((r) => ({
    ...r,
    TiLe:
      tongSoLuotMuon > 0
        ? Math.round((r.SoLuotMuon / tongSoLuotMuon) * 10000) / 100
        : 0,
  }));
  return { tongSoLuotMuon, rows: enriched };
}
