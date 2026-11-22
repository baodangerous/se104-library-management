import { Router } from "express";
import bcrypt from "bcryptjs";
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
import type { AuthUser, UserRole } from "../../src/types/library";
import { requireAuth, requireRole, signToken, type AuthenticatedRequest } from "../auth";
import { db, generateNextId, getSeedPassword, writeAuditLog } from "../db";
import { getThamSo, getBooksWithStatus, sendZodError } from "./shared";

export const router = Router();
/* ===========================
 * BM4: PHIEUMUON (CHO MƯỢN SÁCH)
 * =========================== */

router.get(
  '/phieumuon',
  requireAuth,
  requireRole('ADMIN', 'LIBRARIAN'),
  (_req, res) => {
    const loans = db
      .prepare(
        `SELECT pm.MaPhieuMuon, pm.MaDocGia, dg.HoTen AS HoTenDocGia, pm.NgayMuon
         FROM PHIEUMUON pm
         JOIN DOCGIA dg ON dg.MaDocGia = pm.MaDocGia
         ORDER BY pm.NgayMuon DESC, pm.MaPhieuMuon DESC`
      )
      .all() as any[];

    const detailStmt = db.prepare(
      `SELECT
        ct.MaChiTietMuon,
        ct.MaPhieuMuon,
        ct.MaSach,
        s.TenSach,
        tl.TenTheLoai,
        pm.NgayMuon,
        ct.HanTra,
        pt.NgayTra,
        tr.TienPhat,
        COALESCE(ct.SoLanGiaHan, 0) AS SoLanGiaHan,
        CASE WHEN tr.MaChiTietTra IS NOT NULL THEN 1 ELSE 0 END AS DaTra
       FROM CHITIETPHIEUMUON ct
       JOIN PHIEUMUON pm ON pm.MaPhieuMuon = ct.MaPhieuMuon
       JOIN SACH s ON s.MaSach = ct.MaSach
       JOIN THELOAI tl ON tl.MaTheLoai = s.MaTheLoai
       LEFT JOIN CHITIETPHIEUTRA tr ON tr.MaChiTietMuon = ct.MaChiTietMuon
       LEFT JOIN PHIEUTRA pt ON pt.MaPhieuTra = tr.MaPhieuTra
       WHERE ct.MaPhieuMuon = ?
       ORDER BY ct.MaChiTietMuon ASC`
    );

    const enriched = loans.map((pm) => ({
      ...pm,
      ChiTiet: (detailStmt.all(pm.MaPhieuMuon) as any[]).map((d) => ({
        ...d,
        DaTra: Boolean(d.DaTra),
      })),
    }));
    res.json(enriched);
  }
);

const createLoanSchema = z.object({
  MaDocGia: z.string().trim().min(1, 'Vui lòng chọn độc giả.'),
  NgayMuon: z.string().trim().optional(),
  MaSachList: z.array(z.string().trim().min(1)).min(1, 'Vui lòng chọn ít nhất 1 sách.'),
});

router.post(
  '/phieumuon',
  requireAuth,
  requireRole('ADMIN', 'LIBRARIAN'),
  (req: AuthenticatedRequest, res) => {
    const parsed = createLoanSchema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);

    const { MaDocGia, MaSachList } = parsed.data;
    const ngayMuon = parsed.data.NgayMuon || todayIsoDate();

    try {
      const result = db.transaction(() => {
        const reader = db
          .prepare('SELECT * FROM DOCGIA WHERE MaDocGia = ?')
          .get(MaDocGia) as any;
        if (!reader) {
          throw new Error('Không tìm thấy độc giả.');
        }

        const activeLoans = db
          .prepare(
            `SELECT ct.MaSach, s.TenSach, ct.HanTra
             FROM CHITIETPHIEUMUON ct
             JOIN PHIEUMUON pm ON pm.MaPhieuMuon = ct.MaPhieuMuon
             JOIN SACH s ON s.MaSach = ct.MaSach
             LEFT JOIN CHITIETPHIEUTRA tr ON tr.MaChiTietMuon = ct.MaChiTietMuon
             WHERE pm.MaDocGia = ? AND tr.MaChiTietTra IS NULL`
          )
          .all(MaDocGia) as { MaSach: string; TenSach: string; HanTra: string }[];

        const allBooks = getBooksWithStatus();
        const bookMap = new Map(allBooks.map((b) => [b.MaSach, b]));
        const requestedBooks: {
          MaSach: string;
          TenSach: string;
          TinhTrang: 'Có sẵn' | 'Đang mượn';
        }[] = [];

        for (const maSach of MaSachList) {
          const found = bookMap.get(maSach);
          if (!found) {
            throw new Error(`Không tìm thấy sách có mã ${maSach}.`);
          }
          requestedBooks.push({
            MaSach: found.MaSach,
            TenSach: found.TenSach,
            TinhTrang: found.TinhTrang,
          });
        }

        const thamSo = getThamSo();
        const check = validateBorrowEligibility({
          ngayMuon,
          ngayLapThe: reader.NgayLapThe,
          ngayHetHan: reader.NgayHetHan,
          activeLoans,
          requestedBooks,
          thamSo,
        });

        if (!check.valid || !check.hanTra) {
          throw new Error(check.error || 'Không đủ điều kiện cho mượn sách.');
        }

        const maPhieuMuon = generateNextId('PHIEUMUON', 'MaPhieuMuon', 'PM');
        db.prepare(
          'INSERT INTO PHIEUMUON (MaPhieuMuon, MaDocGia, NgayMuon) VALUES (?, ?, ?)'
        ).run(maPhieuMuon, MaDocGia, ngayMuon);

        const insertDetail = db.prepare(
          'INSERT INTO CHITIETPHIEUMUON (MaPhieuMuon, MaSach, HanTra) VALUES (?, ?, ?)'
        );
        for (const book of requestedBooks) {
          insertDetail.run(maPhieuMuon, book.MaSach, check.hanTra);
        }

        writeAuditLog({
          MaTaiKhoan: req.user!.MaTaiKhoan,
          TenDangNhap: req.user!.TenDangNhap,
          VaiTro: req.user!.VaiTro,
          HanhDong: 'LAP_PHIEU_MUON',
          BangTacDong: 'PHIEUMUON',
          ChiTiet: `Lập phiếu mượn ${maPhieuMuon} cho ${reader.HoTen} (${MaDocGia}): ${requestedBooks.length} sách, hạn trả ${check.hanTra}.`,
        });

        return {
          MaPhieuMuon: maPhieuMuon,
          MaDocGia,
          HoTenDocGia: reader.HoTen,
          NgayMuon: ngayMuon,
          HanTra: check.hanTra,
          SoLuongSach: requestedBooks.length,
        };
      })();

      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err?.message || 'Không thể lập phiếu mượn.' });
    }
  }
);

/* ===========================
 * BM5: PHIEUTRA (NHẬN TRẢ SÁCH)
 * =========================== */

router.get(
  '/docgia/:id/dang-muon',
  requireAuth,
  requireRole('ADMIN', 'LIBRARIAN'),
  (req, res) => {
    const rows = db
      .prepare(
        `SELECT
          ct.MaChiTietMuon,
          ct.MaPhieuMuon,
          ct.MaSach,
          s.TenSach,
          tl.TenTheLoai,
          pm.NgayMuon,
          ct.HanTra
         FROM CHITIETPHIEUMUON ct
         JOIN PHIEUMUON pm ON pm.MaPhieuMuon = ct.MaPhieuMuon
         JOIN SACH s ON s.MaSach = ct.MaSach
         JOIN THELOAI tl ON tl.MaTheLoai = s.MaTheLoai
         LEFT JOIN CHITIETPHIEUTRA tr ON tr.MaChiTietMuon = ct.MaChiTietMuon
         WHERE pm.MaDocGia = ? AND tr.MaChiTietTra IS NULL
         ORDER BY ct.HanTra ASC`
      )
      .all(req.params.id);
    res.json(rows);
  }
);

router.get(
  '/phieutra',
  requireAuth,
  requireRole('ADMIN', 'LIBRARIAN'),
  (_req, res) => {
    const returns = db
      .prepare(
        `SELECT pt.MaPhieuTra, pt.MaDocGia, dg.HoTen AS HoTenDocGia, pt.NgayTra, pt.TongTienPhat
         FROM PHIEUTRA pt
         JOIN DOCGIA dg ON dg.MaDocGia = pt.MaDocGia
         ORDER BY pt.NgayTra DESC, pt.MaPhieuTra DESC`
      )
      .all() as any[];

    const detailStmt = db.prepare(
      `SELECT
        tr.MaChiTietTra,
        tr.MaPhieuTra,
        tr.MaChiTietMuon,
        ct.MaSach,
        s.TenSach,
        pm.NgayMuon,
        ct.HanTra,
        tr.TienPhat
       FROM CHITIETPHIEUTRA tr
       JOIN CHITIETPHIEUMUON ct ON ct.MaChiTietMuon = tr.MaChiTietMuon
       JOIN PHIEUMUON pm ON pm.MaPhieuMuon = ct.MaPhieuMuon
       JOIN SACH s ON s.MaSach = ct.MaSach
       WHERE tr.MaPhieuTra = ?`
    );

    const enriched = returns.map((pt) => ({
      ...pt,
      ChiTiet: (detailStmt.all(pt.MaPhieuTra) as any[]).map((d) => ({
        ...d,
        SoNgayTraTre: Math.max(0, diffDaysIso(pt.NgayTra, d.HanTra)),
      })),
    }));
    res.json(enriched);
  }
);

const createReturnSchema = z.object({
  MaDocGia: z.string().trim().min(1, 'Vui lòng chọn độc giả.'),
  NgayTra: z.string().trim().optional(),
  MaChiTietMuonList: z
    .array(z.coerce.number().int().positive())
    .min(1, 'Vui lòng chọn ít nhất 1 sách cần trả.'),
});

router.post(
  '/phieutra',
  requireAuth,
  requireRole('ADMIN', 'LIBRARIAN'),
  (req: AuthenticatedRequest, res) => {
    const parsed = createReturnSchema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);

    const { MaDocGia, MaChiTietMuonList } = parsed.data;
    const ngayTra = parsed.data.NgayTra || todayIsoDate();
    if (!isValidIsoDate(ngayTra)) {
      res.status(400).json({ error: 'Ngày trả không hợp lệ.' });
      return;
    }

    try {
      const result = db.transaction(() => {
        const reader = db
          .prepare('SELECT * FROM DOCGIA WHERE MaDocGia = ?')
          .get(MaDocGia) as any;
        if (!reader) throw new Error('Không tìm thấy độc giả.');

        const uniqueIds = Array.from(new Set(MaChiTietMuonList));
        const itemsToReturn: {
          MaChiTietMuon: number;
          MaSach: string;
          TenSach: string;
          NgayMuon: string;
          HanTra: string;
          SoNgayTraTre: number;
          TienPhat: number;
        }[] = [];

        let tongTienPhat = 0;

        for (const maCTM of uniqueIds) {
          const row = db
            .prepare(
              `SELECT ct.MaChiTietMuon, ct.MaSach, s.TenSach, pm.MaDocGia, pm.NgayMuon, ct.HanTra,
                      tr.MaChiTietTra
               FROM CHITIETPHIEUMUON ct
               JOIN PHIEUMUON pm ON pm.MaPhieuMuon = ct.MaPhieuMuon
               JOIN SACH s ON s.MaSach = ct.MaSach
               LEFT JOIN CHITIETPHIEUTRA tr ON tr.MaChiTietMuon = ct.MaChiTietMuon
               WHERE ct.MaChiTietMuon = ?`
            )
            .get(maCTM) as any;

          if (!row) throw new Error(`Không tìm thấy chi tiết mượn #${maCTM}.`);
          if (row.MaDocGia !== MaDocGia) {
            throw new Error(`Sách "${row.TenSach}" không thuộc phiếu mượn của độc giả này.`);
          }
          if (row.MaChiTietTra !== null) {
            throw new Error(`Sách "${row.TenSach}" đã được trả trước đó.`);
          }
          if (diffDaysIso(ngayTra, row.NgayMuon) < 0) {
            throw new Error(
              `Ngày trả (${ngayTra}) không được nhỏ hơn ngày mượn (${row.NgayMuon}) của sách "${row.TenSach}".`
            );
          }

          const { soNgayTraTre, tienPhat } = calculateReturnFine(row.HanTra, ngayTra);
          tongTienPhat += tienPhat;
          itemsToReturn.push({
            MaChiTietMuon: row.MaChiTietMuon,
            MaSach: row.MaSach,
            TenSach: row.TenSach,
            NgayMuon: row.NgayMuon,
            HanTra: row.HanTra,
            SoNgayTraTre: soNgayTraTre,
            TienPhat: tienPhat,
          });
        }

        const maPhieuTra = generateNextId('PHIEUTRA', 'MaPhieuTra', 'PT');
        db.prepare(
          'INSERT INTO PHIEUTRA (MaPhieuTra, MaDocGia, NgayTra, TongTienPhat) VALUES (?, ?, ?, ?)'
        ).run(maPhieuTra, MaDocGia, ngayTra, tongTienPhat);

        const insertCTPT = db.prepare(
          'INSERT INTO CHITIETPHIEUTRA (MaPhieuTra, MaChiTietMuon, TienPhat) VALUES (?, ?, ?)'
        );
        for (const item of itemsToReturn) {
          insertCTPT.run(maPhieuTra, item.MaChiTietMuon, item.TienPhat);
        }

        // Auto-hold returned books for waiting reservations
        const heldReservations: Array<{ MaSach: string; HoTenDocGia: string }> = [];
        for (const item of itemsToReturn) {
          const waiting = db
            .prepare(
              `SELECT dt.MaDatTruoc, dg.HoTen
               FROM DATTRUOC dt JOIN DOCGIA dg ON dg.MaDocGia = dt.MaDocGia
               WHERE dt.MaSach = ? AND dt.TrangThai = 'Đang chờ'
               ORDER BY dt.NgayDat ASC, dt.MaDatTruoc ASC LIMIT 1`
            )
            .get(item.MaSach) as { MaDatTruoc: string; HoTen: string } | undefined;
          if (waiting) {
            db.prepare(`UPDATE DATTRUOC SET TrangThai = 'Đã giữ chỗ' WHERE MaDatTruoc = ?`).run(waiting.MaDatTruoc);
            heldReservations.push({ MaSach: item.MaSach, HoTenDocGia: waiting.HoTen });
          }
        }

        // Accumulate fine into DOCGIA.TongNo in the same ACID transaction
        const newTongNo = reader.TongNo + tongTienPhat;
        db.prepare('UPDATE DOCGIA SET TongNo = ? WHERE MaDocGia = ?').run(
          newTongNo,
          MaDocGia
        );

        writeAuditLog({
          MaTaiKhoan: req.user!.MaTaiKhoan,
          TenDangNhap: req.user!.TenDangNhap,
          VaiTro: req.user!.VaiTro,
          HanhDong: 'LAP_PHIEU_TRA',
          BangTacDong: 'PHIEUTRA',
          ChiTiet: `Nhận trả ${itemsToReturn.length} sách (${maPhieuTra}) từ ${reader.HoTen} (${MaDocGia}). Tiền phạt kỳ này: ${tongTienPhat.toLocaleString('vi-VN')} ₫; Tổng nợ mới: ${newTongNo.toLocaleString('vi-VN')} ₫.`,
        });

        return {
          MaPhieuTra: maPhieuTra,
          MaDocGia,
          HoTenDocGia: reader.HoTen,
          NgayTra: ngayTra,
          TongTienPhat: tongTienPhat,
          TongNoMoi: newTongNo,
          ChiTiet: itemsToReturn,
          HeldReservations: heldReservations,
        };
      })();

      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err?.message || 'Không thể lập phiếu trả sách.' });
    }
  }
);

/* ===========================
 * BM6: PHIEUTHUTIENPHAT (THU TIỀN PHẠT)
 * =========================== */

router.get(
  '/phieuthu',
  requireAuth,
  requireRole('ADMIN', 'LIBRARIAN'),
  (_req, res) => {
    const rows = db
      .prepare(
        `SELECT p.*, dg.HoTen AS HoTenDocGia
         FROM PHIEUTHUTIENPHAT p
         JOIN DOCGIA dg ON dg.MaDocGia = p.MaDocGia
         ORDER BY p.NgayThu DESC, p.MaPhieuThu DESC`
      )
      .all();
    res.json(rows);
  }
);

const createFineReceiptSchema = z.object({
  MaDocGia: z.string().trim().min(1, 'Vui lòng chọn độc giả.'),
  NgayThu: z.string().trim().optional(),
  SoTienThu: z.coerce.number().positive('Số tiền thu phải lớn hơn 0.'),
});

router.post(
  '/phieuthu',
  requireAuth,
  requireRole('ADMIN', 'LIBRARIAN'),
  (req: AuthenticatedRequest, res) => {
    const parsed = createFineReceiptSchema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);

    const { MaDocGia, SoTienThu } = parsed.data;
    const ngayThu = parsed.data.NgayThu || todayIsoDate();
    if (!isValidIsoDate(ngayThu)) {
      res.status(400).json({ error: 'Ngày thu không hợp lệ.' });
      return;
    }

    try {
      const result = db.transaction(() => {
        const reader = db
          .prepare('SELECT * FROM DOCGIA WHERE MaDocGia = ?')
          .get(MaDocGia) as any;
        if (!reader) throw new Error('Không tìm thấy độc giả.');

        const check = validateFinePayment(reader.TongNo, SoTienThu);
        if (!check.valid || check.conLai === undefined) {
          throw new Error(check.error);
        }

        const maPhieuThu = generateNextId('PHIEUTHUTIENPHAT', 'MaPhieuThu', 'PTH');
        db.prepare(
          `INSERT INTO PHIEUTHUTIENPHAT (MaPhieuThu, MaDocGia, NgayThu, TongNoTruocThu, SoTienThu, ConLai)
           VALUES (?, ?, ?, ?, ?, ?)`
        ).run(maPhieuThu, MaDocGia, ngayThu, reader.TongNo, SoTienThu, check.conLai);

        db.prepare('UPDATE DOCGIA SET TongNo = ? WHERE MaDocGia = ?').run(
          check.conLai,
          MaDocGia
        );

        writeAuditLog({
          MaTaiKhoan: req.user!.MaTaiKhoan,
          TenDangNhap: req.user!.TenDangNhap,
          VaiTro: req.user!.VaiTro,
          HanhDong: 'THU_TIEN_PHAT',
          BangTacDong: 'PHIEUTHUTIENPHAT',
          ChiTiet: `Lập phiếu thu ${maPhieuThu} cho ${reader.HoTen} (${MaDocGia}): thu ${SoTienThu.toLocaleString('vi-VN')} ₫, còn lại ${check.conLai.toLocaleString('vi-VN')} ₫.`,
        });

        return {
          MaPhieuThu: maPhieuThu,
          MaDocGia,
          HoTenDocGia: reader.HoTen,
          NgayThu: ngayThu,
          TongNoTruocThu: reader.TongNo,
          SoTienThu,
          ConLai: check.conLai,
        };
      })();

      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err?.message || 'Không thể lập phiếu thu tiền phạt.' });
    }
  }
);

