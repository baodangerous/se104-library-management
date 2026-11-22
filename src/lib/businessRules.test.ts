import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addDaysIso,
  addMonthsIso,
  calculateAgeAtDate,
  calculateReturnFine,
  computeCategoryReportPercentages,
  validateBookIntake,
  validateBorrowEligibility,
  validateFinePayment,
  validateLoanRenewal,
  validateReaderCard,
  validateRegulationParams,
} from './businessRules';

const DEFAULT_THAMSO = {
  TuoiToiThieu: 18,
  TuoiToiDa: 55,
  ThoiHanThe: 6,
  KhoangCachNamXuatBan: 8,
  SoSachMuonToiDa: 5,
  SoNgayMuonToiDa: 4,
};

test('BM1: validates exact age boundaries and computes NgayHetHan accurately', () => {
  // Exact 18th birthday -> valid
  const exact18 = validateReaderCard('2008-11-21', '2026-11-21', DEFAULT_THAMSO);
  assert.equal(exact18.valid, true);
  assert.equal(exact18.tuoi, 18);
  assert.equal(exact18.ngayHetHan, '2027-05-21');

  // 1 day before 18th birthday -> 17 years old -> invalid
  const under18 = validateReaderCard('2008-11-22', '2026-11-21', DEFAULT_THAMSO);
  assert.equal(under18.valid, false);
  assert.equal(under18.tuoi, 17);

  // Over 55 -> invalid
  const over55 = validateReaderCard('1970-01-01', '2026-11-21', DEFAULT_THAMSO);
  assert.equal(over55.valid, false);
  assert.equal(calculateAgeAtDate('1970-01-01', '2026-11-21'), 56);

  // End-of-month clamping (Aug 31 + 6 months -> Feb 28 in non-leap year)
  assert.equal(addMonthsIso('2026-08-31', 6), '2027-02-28');
});

test('BM2: validates publication year gap <= KhoangCachNamXuatBan and <= NamNhap', () => {
  assert.equal(validateBookIntake(2018, '2026-05-10', 120000, DEFAULT_THAMSO).valid, true);
  assert.equal(validateBookIntake(2026, '2026-05-10', 120000, DEFAULT_THAMSO).valid, true);
  // 9 years gap -> rejected
  assert.equal(validateBookIntake(2017, '2026-05-10', 120000, DEFAULT_THAMSO).valid, false);
  // Future publication year -> rejected
  assert.equal(validateBookIntake(2027, '2026-05-10', 120000, DEFAULT_THAMSO).valid, false);
  // Negative price -> rejected
  assert.equal(validateBookIntake(2024, '2026-05-10', -1000, DEFAULT_THAMSO).valid, false);
});

test('BM4: enforces all 4 borrow eligibility rules and sets HanTra = NgayMuon + SoNgayMuonToiDa', () => {
  const baseInput = {
    ngayMuon: '2026-11-21',
    ngayLapThe: '2026-09-01',
    ngayHetHan: '2027-03-01',
    activeLoans: [],
    requestedBooks: [{ MaSach: 'S001', TenSach: 'Nhập môn CNPM', TinhTrang: 'Có sẵn' as const }],
    thamSo: DEFAULT_THAMSO,
  };

  // Valid case
  const ok = validateBorrowEligibility(baseInput);
  assert.equal(ok.valid, true);
  assert.equal(ok.hanTra, '2026-11-25');
  assert.equal(addDaysIso('2026-11-21', 4), '2026-11-25');

  // Rule 1: Expired card
  const expired = validateBorrowEligibility({ ...baseInput, ngayHetHan: '2026-11-20' });
  assert.equal(expired.valid, false);

  // Rule 2: Overdue active loan
  const overdue = validateBorrowEligibility({
    ...baseInput,
    activeLoans: [{ MaSach: 'S099', TenSach: 'Hệ điều hành', HanTra: '2026-11-18' }],
  });
  assert.equal(overdue.valid, false);

  // Rule 3: Book already borrowed
  const unavailable = validateBorrowEligibility({
    ...baseInput,
    requestedBooks: [{ MaSach: 'S002', TenSach: 'Cơ sở dữ liệu', TinhTrang: 'Đang mượn' }],
  });
  assert.equal(unavailable.valid, false);

  // Rule 4: Exceeds max 5 books
  const tooMany = validateBorrowEligibility({
    ...baseInput,
    activeLoans: [
      { MaSach: 'S10', TenSach: 'B1', HanTra: '2026-11-24' },
      { MaSach: 'S11', TenSach: 'B2', HanTra: '2026-11-24' },
      { MaSach: 'S12', TenSach: 'B3', HanTra: '2026-11-24' },
      { MaSach: 'S13', TenSach: 'B4', HanTra: '2026-11-24' },
    ],
    requestedBooks: [
      { MaSach: 'S01', TenSach: 'New 1', TinhTrang: 'Có sẵn' },
      { MaSach: 'S02', TenSach: 'New 2', TinhTrang: 'Có sẵn' },
    ],
  });
  assert.equal(tooMany.valid, false);
});

test('BM5: calculates overdue days and 1,000 VND/day fine', () => {
  // Returned early or on time
  assert.deepEqual(calculateReturnFine('2026-11-25', '2026-11-24'), {
    soNgayTraTre: 0,
    tienPhat: 0,
  });
  assert.deepEqual(calculateReturnFine('2026-11-25', '2026-11-25'), {
    soNgayTraTre: 0,
    tienPhat: 0,
  });
  // Returned 6 days late
  assert.deepEqual(calculateReturnFine('2026-11-15', '2026-11-21'), {
    soNgayTraTre: 6,
    tienPhat: 6000,
  });
});

test('BM6: validates fine payment boundaries and computes ConLai', () => {
  assert.equal(validateFinePayment(0, 1000).valid, false);
  assert.equal(validateFinePayment(10000, 0).valid, false);
  assert.equal(validateFinePayment(10000, -500).valid, false);
  assert.equal(validateFinePayment(10000, 15000).valid, false);

  const partial = validateFinePayment(10000, 4000);
  assert.equal(partial.valid, true);
  assert.equal(partial.conLai, 6000);

  const full = validateFinePayment(10000, 10000);
  assert.equal(full.valid, true);
  assert.equal(full.conLai, 0);
});

test('BM7.1 & QD8: computes category percentages and validates regulation parameters', () => {
  const report = computeCategoryReportPercentages([
    { MaTheLoai: 'A', TenTheLoai: 'Giáo trình CNTT', SoLuotMuon: 6 },
    { MaTheLoai: 'B', TenTheLoai: 'Tài liệu tham khảo', SoLuotMuon: 3 },
    { MaTheLoai: 'C', TenTheLoai: 'Luận văn & Nghiên cứu', SoLuotMuon: 1 },
  ]);
  assert.equal(report.tongSoLuotMuon, 10);
  assert.equal(report.rows[0].TiLe, 60);
  assert.equal(report.rows[1].TiLe, 30);
  assert.equal(report.rows[2].TiLe, 10);

  assert.equal(validateRegulationParams(DEFAULT_THAMSO).valid, true);
  assert.equal(
    validateRegulationParams({ ...DEFAULT_THAMSO, TuoiToiThieu: 60, TuoiToiDa: 55 }).valid,
    false
  );
});

test('UIT Renewal: validates non-overdue active loan renewal up to 2 times', () => {
  const base = {
    today: '2026-11-22',
    hanTra: '2026-11-25',
    ngayHetHanThe: '2027-03-01',
    daTra: false,
    soLanGiaHan: 0,
    soNgayMuonToiDa: 4,
  };

  const ok = validateLoanRenewal(base);
  assert.equal(ok.valid, true);
  assert.equal(ok.newHanTra, '2026-11-29');

  assert.equal(validateLoanRenewal({ ...base, daTra: true }).valid, false);
  assert.equal(validateLoanRenewal({ ...base, ngayHetHanThe: '2026-11-21' }).valid, false);
  assert.equal(validateLoanRenewal({ ...base, today: '2026-11-26' }).valid, false);
  assert.equal(validateLoanRenewal({ ...base, soLanGiaHan: 2 }).valid, false);
});
