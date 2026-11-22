import type { ThamSo } from '../../types/library';
import { addMonthsIso, calculateAgeAtDate, isValidIsoDate } from './dateUtils';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * BM1: Validate reader age at card issuance date and compute NgayHetHan.
 */
export function validateReaderCard(
  ngaySinh: string,
  ngayLapThe: string,
  thamSo: Pick<ThamSo, 'TuoiToiThieu' | 'TuoiToiDa' | 'ThoiHanThe'>
): ValidationResult & { tuoi?: number; ngayHetHan?: string } {
  if (!isValidIsoDate(ngaySinh)) {
    return { valid: false, error: 'Ngày sinh không hợp lệ (định dạng YYYY-MM-DD).' };
  }
  if (!isValidIsoDate(ngayLapThe)) {
    return { valid: false, error: 'Ngày lập thẻ không hợp lệ (định dạng YYYY-MM-DD).' };
  }
  const tuoi = calculateAgeAtDate(ngaySinh, ngayLapThe);
  if (tuoi < thamSo.TuoiToiThieu || tuoi > thamSo.TuoiToiDa) {
    return {
      valid: false,
      tuoi,
      error: `Tuổi độc giả tại ngày lập thẻ (${tuoi} tuổi) phải từ ${thamSo.TuoiToiThieu} đến ${thamSo.TuoiToiDa} tuổi theo quy định thư viện.`,
    };
  }
  return {
    valid: true,
    tuoi,
    ngayHetHan: addMonthsIso(ngayLapThe, thamSo.ThoiHanThe),
  };
}

/**
 * BM2: Validate book publication year gap relative to NgayNhap.
 */
export function validateBookIntake(
  namXuatBan: number,
  ngayNhap: string,
  triGia: number,
  thamSo: Pick<ThamSo, 'KhoangCachNamXuatBan'>
): ValidationResult {
  if (!isValidIsoDate(ngayNhap)) {
    return { valid: false, error: 'Ngày nhập sách không hợp lệ.' };
  }
  if (!Number.isInteger(namXuatBan) || namXuatBan < 1900) {
    return { valid: false, error: 'Năm xuất bản không hợp lệ.' };
  }
  if (typeof triGia !== 'number' || Number.isNaN(triGia) || triGia < 0) {
    return { valid: false, error: 'Trị giá sách phải là số không âm.' };
  }
  const namNhap = Number(ngayNhap.slice(0, 4));
  if (namXuatBan > namNhap) {
    return {
      valid: false,
      error: `Năm xuất bản (${namXuatBan}) không được lớn hơn năm nhập (${namNhap}).`,
    };
  }
  const gap = namNhap - namXuatBan;
  if (gap > thamSo.KhoangCachNamXuatBan) {
    return {
      valid: false,
      error: `Chỉ tiếp nhận sách xuất bản trong vòng ${thamSo.KhoangCachNamXuatBan} năm so với năm nhập (sách này cách ${gap} năm).`,
    };
  }
  return { valid: true };
}

/**
 * QĐ8: Validate library regulation parameter updates.
 */
export function validateRegulationParams(
  params: Omit<ThamSo, 'MaThamSo'>
): ValidationResult {
  const {
    TuoiToiThieu,
    TuoiToiDa,
    ThoiHanThe,
    KhoangCachNamXuatBan,
    SoSachMuonToiDa,
    SoNgayMuonToiDa,
  } = params;

  const ints = [
    TuoiToiThieu,
    TuoiToiDa,
    ThoiHanThe,
    KhoangCachNamXuatBan,
    SoSachMuonToiDa,
    SoNgayMuonToiDa,
  ];
  if (ints.some((v) => !Number.isInteger(v) || v <= 0)) {
    return { valid: false, error: 'Tất cả tham số quy định phải là số nguyên dương.' };
  }
  if (TuoiToiThieu >= TuoiToiDa) {
    return { valid: false, error: 'Tuổi tối thiểu phải nhỏ hơn tuổi tối đa.' };
  }
  if (TuoiToiDa > 120) {
    return { valid: false, error: 'Tuổi tối đa không hợp lý (tối đa 120).' };
  }
  return { valid: true };
}
