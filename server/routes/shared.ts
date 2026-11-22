import { Router, type Response } from "express";
import { z } from "zod";
import {
  calculateReturnFine,
  computeCategoryReportPercentages,
  diffDaysIso,
  isValidIsoDate,
  todayIsoDate,
  validateBookIntake,
  validateBorrowEligibility,
  validateFinePayment,
  validateReaderCard,
  validateRegulationParams,
} from "../../src/lib/businessRules";
import type { AuthUser, ThamSo, UserRole } from "../../src/types/library";
import { requireAuth, requireRole, signToken, type AuthenticatedRequest } from "../auth";
import { db, generateNextId, getSeedPassword, writeAuditLog } from "../db";

export function getThamSo(): ThamSo {
  return db.prepare("SELECT * FROM THAMSO WHERE MaThamSo = 1").get() as ThamSo;
}

export function getBooksWithStatus(filters?: {
  q?: string;
  maTheLoai?: string;
  tinhTrang?: string;
}) {
  const rows = db
    .prepare(
      `SELECT
        s.MaSach,
        s.TenSach,
        s.MaTheLoai,
        tl.TenTheLoai,
        s.NamXuatBan,
        s.NhaXuatBan,
        s.NgayNhap,
        s.TriGia,
        s.MaNganh,
        s.NgonNgu,
        s.NguonTaiLieu,
        s.ChuDe,
        s.NoiBat,
        s.MaKeSach,
        s.AnhBia,
        s.MoTa,
        (
          SELECT GROUP_CONCAT(tg.TenTacGia, ', ')
          FROM SACH_TACGIA st
          JOIN TACGIA tg ON tg.MaTacGia = st.MaTacGia
          WHERE st.MaSach = s.MaSach
        ) AS TacGiaJoined,
        (
          SELECT GROUP_CONCAT(tg.MaTacGia, ',')
          FROM SACH_TACGIA st
          JOIN TACGIA tg ON tg.MaTacGia = st.MaTacGia
          WHERE st.MaSach = s.MaSach
        ) AS TacGiaIdsJoined,
        CASE
          WHEN EXISTS (
            SELECT 1
            FROM CHITIETPHIEUMUON ct
            LEFT JOIN CHITIETPHIEUTRA tr ON tr.MaChiTietMuon = ct.MaChiTietMuon
            WHERE ct.MaSach = s.MaSach AND tr.MaChiTietTra IS NULL
          ) THEN 'Đang mượn'
          ELSE 'Có sẵn'
        END AS TinhTrang,
        (
          SELECT dg.HoTen
          FROM CHITIETPHIEUMUON ct
          JOIN PHIEUMUON pm ON pm.MaPhieuMuon = ct.MaPhieuMuon
          JOIN DOCGIA dg ON dg.MaDocGia = pm.MaDocGia
          LEFT JOIN CHITIETPHIEUTRA tr ON tr.MaChiTietMuon = ct.MaChiTietMuon
          WHERE ct.MaSach = s.MaSach AND tr.MaChiTietTra IS NULL
          LIMIT 1
        ) AS NguoiDangMuon,
        (
          SELECT ct.HanTra
          FROM CHITIETPHIEUMUON ct
          LEFT JOIN CHITIETPHIEUTRA tr ON tr.MaChiTietMuon = ct.MaChiTietMuon
          WHERE ct.MaSach = s.MaSach AND tr.MaChiTietTra IS NULL
          LIMIT 1
        ) AS HanTraHienTai
      FROM SACH s
      JOIN THELOAI tl ON tl.MaTheLoai = s.MaTheLoai
      ORDER BY s.MaSach ASC`
    )
    .all() as Array<{
    MaSach: string;
    TenSach: string;
    MaTheLoai: string;
    TenTheLoai: string;
    NamXuatBan: number;
    NhaXuatBan: string;
    NgayNhap: string;
    TriGia: number;
    MaNganh: string | null;
    NgonNgu: string | null;
    NguonTaiLieu: string | null;
    ChuDe: string | null;
    NoiBat: number;
    MaKeSach: string | null;
    AnhBia: string | null;
    MoTa: string | null;
    TacGiaJoined: string | null;
    TacGiaIdsJoined: string | null;
    TinhTrang: 'Có sẵn' | 'Đang mượn';
    NguoiDangMuon: string | null;
    HanTraHienTai: string | null;
  }>;

  let result = rows.map((r) => ({
    MaSach: r.MaSach,
    TenSach: r.TenSach,
    MaTheLoai: r.MaTheLoai,
    TenTheLoai: r.TenTheLoai,
    NamXuatBan: r.NamXuatBan,
    NhaXuatBan: r.NhaXuatBan,
    NgayNhap: r.NgayNhap,
    TriGia: r.TriGia,
    MaNganh: r.MaNganh || 'CNTT',
    NgonNgu: r.NgonNgu || 'Tiếng Việt',
    NguonTaiLieu: r.NguonTaiLieu || 'Giáo trình UIT',
    ChuDe: r.ChuDe || undefined,
    NoiBat: Boolean(r.NoiBat),
    MaKeSach: r.MaKeSach || 'T1-CNTT-01',
    AnhBia: r.AnhBia || undefined,
    MoTa: r.MoTa || undefined,
    TacGiaList: r.TacGiaJoined ? r.TacGiaJoined.split(', ') : [],
    TacGiaIds: r.TacGiaIdsJoined
      ? r.TacGiaIdsJoined.split(',').map((n) => Number(n))
      : [],
    TinhTrang: r.TinhTrang,
    NguoiDangMuon: r.NguoiDangMuon,
    HanTraHienTai: r.HanTraHienTai,
  }));

  if (filters?.q && filters.q.trim()) {
    const kw = filters.q.trim().toLowerCase();
    result = result.filter(
      (b) =>
        b.MaSach.toLowerCase().includes(kw) ||
        b.TenSach.toLowerCase().includes(kw) ||
        b.NhaXuatBan.toLowerCase().includes(kw) ||
        b.TenTheLoai.toLowerCase().includes(kw) ||
        b.TacGiaList.some((a) => a.toLowerCase().includes(kw))
    );
  }
  if (filters?.maTheLoai && filters.maTheLoai !== 'ALL') {
    result = result.filter((b) => b.MaTheLoai === filters.maTheLoai);
  }
  if (filters?.tinhTrang && filters.tinhTrang !== 'ALL') {
    result = result.filter((b) => b.TinhTrang === filters.tinhTrang);
  }
  return result;
}

export function sendZodError(res: Response, err: z.ZodError) {
  const firstMsg = err.issues[0]?.message || 'Dữ liệu đầu vào không hợp lệ.';
  res.status(400).json({ error: firstMsg });
}
export { z };
