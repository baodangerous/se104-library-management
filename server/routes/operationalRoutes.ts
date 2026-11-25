import { Router } from 'express';
import { z } from 'zod';
import { addMonthsIso, todayIsoDate } from '../../src/lib/businessRules';
import {
  requireAuth,
  requirePermission,
  requireRole,
  type AuthenticatedRequest,
} from '../auth';
import { db, writeAuditLog } from '../db';
import { getThamSo, sendZodError } from './shared';

export const operationalRouter = Router();

function nextPrefixedId(table: string, col: string, prefix: string, pad = 3): string {
  const rows = db.prepare(`SELECT ${col} AS id FROM ${table}`).all() as Array<{ id: string }>;
  let maxNum = 0;
  const re = new RegExp(`^${prefix}(\\d+)$`);
  for (const r of rows) {
    const m = re.exec(r.id);
    if (m) maxNum = Math.max(maxNum, Number(m[1]));
  }
  return `${prefix}${String(maxNum + 1).padStart(pad, '0')}`;
}

/* ===========================
 * 1. CHI NHÁNH & KỆ SÁCH
 * =========================== */
operationalRouter.get('/ops/branches', (_req, res) => {
  const branches = db.prepare('SELECT * FROM CHINHANH ORDER BY MaCN ASC').all();
  const shelves = db
    .prepare(
      `SELECT k.*, c.TenCN FROM KESACH k JOIN CHINHANH c ON c.MaCN = k.MaCN ORDER BY k.MaCN, k.MaKe`
    )
    .all();
  res.json({ branches, shelves });
});

operationalRouter.post(
  '/ops/branches',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN'),
  (req: AuthenticatedRequest, res) => {
    const schema = z.object({
      MaCN: z.string().trim().min(2).max(10),
      TenCN: z.string().trim().min(2),
      DiaChi: z.string().trim().min(2),
      SDT: z.string().trim().min(6),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);
    const d = parsed.data;
    const exists = db.prepare('SELECT 1 FROM CHINHANH WHERE MaCN = ?').get(d.MaCN);
    if (exists) {
      res.status(400).json({ error: `Mã chi nhánh ${d.MaCN} đã tồn tại.` });
      return;
    }
    db.prepare('INSERT INTO CHINHANH (MaCN, TenCN, DiaChi, SDT) VALUES (?, ?, ?, ?)').run(
      d.MaCN,
      d.TenCN,
      d.DiaChi,
      d.SDT
    );
    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'THEM_CHI_NHANH',
      BangTacDong: 'CHINHANH',
      ChiTiet: `Thêm chi nhánh ${d.MaCN} – ${d.TenCN}.`,
    });
    res.status(201).json(d);
  }
);

operationalRouter.post(
  '/ops/shelves',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN', 'CATALOGER'),
  (req: AuthenticatedRequest, res) => {
    const schema = z.object({
      MaKe: z.string().trim().min(2).max(15),
      MaCN: z.string().trim().min(2),
      ViTri: z.string().trim().min(2),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);
    const d = parsed.data;
    db.prepare('INSERT OR REPLACE INTO KESACH (MaKe, MaCN, ViTri) VALUES (?, ?, ?)').run(
      d.MaKe,
      d.MaCN,
      d.ViTri
    );
    res.status(201).json(d);
  }
);

/* ===========================
 * 2. BẢN SAO VẬT LÝ & LỊCH SỬ
 * =========================== */
operationalRouter.get('/ops/copies', requireAuth, (req, res) => {
  const maSach = typeof req.query.maSach === 'string' ? req.query.maSach.trim() : '';
  const maCN = typeof req.query.maCN === 'string' ? req.query.maCN.trim() : '';
  const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';

  let sql = `
    SELECT b.*, s.TenSach, c.TenCN, k.ViTri AS ViTriKe
    FROM BANSAO b
    JOIN SACH s ON s.MaSach = b.MaSach
    JOIN CHINHANH c ON c.MaCN = b.MaCN
    LEFT JOIN KESACH k ON k.MaKe = b.MaKe
    WHERE 1=1
  `;
  const params: unknown[] = [];
  if (maSach) {
    sql += ' AND b.MaSach = ?';
    params.push(maSach);
  }
  if (maCN && maCN !== 'ALL') {
    sql += ' AND b.MaCN = ?';
    params.push(maCN);
  }
  sql += ' ORDER BY b.MaBanSao ASC LIMIT 300';
  let rows = db.prepare(sql).all(...params) as Array<Record<string, unknown>>;
  if (q) {
    rows = rows.filter(
      (r) =>
        String(r.MaBanSao).toLowerCase().includes(q) ||
        String(r.MaSach).toLowerCase().includes(q) ||
        String(r.TenSach).toLowerCase().includes(q)
    );
  }
  res.json(rows);
});

operationalRouter.post(
  '/ops/copies',
  requireAuth,
  requirePermission('COPY_MANAGE'),
  (req: AuthenticatedRequest, res) => {
    const schema = z.object({
      MaSach: z.string().trim().min(1),
      MaCN: z.string().trim().min(1),
      MaKe: z.string().trim().nullable().optional(),
      SoLuong: z.coerce.number().int().min(1).max(20).default(1),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);
    const d = parsed.data;

    const existingCount = (
      db.prepare('SELECT COUNT(*) AS cnt FROM BANSAO WHERE MaSach = ?').get(d.MaSach) as {
        cnt: number;
      }
    ).cnt;
    const today = todayIsoDate();
    const created: string[] = [];

    const tx = db.transaction(() => {
      const ins = db.prepare(
        `INSERT INTO BANSAO (MaBanSao, MaSach, MaCN, MaKe, TinhTrang, NgayNhap)
         VALUES (?, ?, ?, ?, 'Sẵn sàng', ?)`
      );
      const insHist = db.prepare(
        `INSERT INTO LICHSUTRANGTHAIBANSAO (MaBanSao, TrangThaiCu, TrangThaiMoi, ChiNhanhCu, ChiNhanhMoi, ThoiGian, NguoiThucHien, LyDo)
         VALUES (?, NULL, 'Sẵn sàng', NULL, ?, ?, ?, 'Nhập thêm bản sao mới')`
      );
      for (let i = 1; i <= d.SoLuong; i++) {
        const code = `BS-${d.MaSach}-${String(existingCount + i).padStart(2, '0')}`;
        ins.run(code, d.MaSach, d.MaCN, d.MaKe || null, today);
        insHist.run(code, d.MaCN, new Date().toISOString(), req.user!.TenDangNhap);
        created.push(code);
      }
    });
    tx();

    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'THEM_BAN_SAO',
      BangTacDong: 'BANSAO',
      ChiTiet: `Tạo ${created.length} bản sao (${created.join(', ')}) cho sách ${d.MaSach} tại ${d.MaCN}.`,
    });

    res.status(201).json({ created });
  }
);

operationalRouter.patch(
  '/ops/copies/:maBanSao',
  requireAuth,
  requirePermission('COPY_MANAGE', 'RETURN_PROCESS'),
  (req: AuthenticatedRequest, res) => {
    const schema = z.object({
      TinhTrang: z.enum(['Sẵn sàng', 'Đang mượn', 'Đang sửa', 'Chờ thanh lý', 'Đã thanh lý', 'Thất lạc']),
      MaKe: z.string().trim().nullable().optional(),
      LyDo: z.string().trim().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);

    const existing = db
      .prepare('SELECT * FROM BANSAO WHERE MaBanSao = ?')
      .get(req.params.maBanSao) as { MaBanSao: string; MaCN: string; TinhTrang: string; MaKe: string | null } | undefined;
    if (!existing) {
      res.status(404).json({ error: 'Không tìm thấy bản sao.' });
      return;
    }

    const d = parsed.data;
    db.prepare('UPDATE BANSAO SET TinhTrang = ?, MaKe = ? WHERE MaBanSao = ?').run(
      d.TinhTrang,
      d.MaKe !== undefined ? d.MaKe : existing.MaKe,
      existing.MaBanSao
    );
    db.prepare(
      `INSERT INTO LICHSUTRANGTHAIBANSAO (MaBanSao, TrangThaiCu, TrangThaiMoi, ChiNhanhCu, ChiNhanhMoi, ThoiGian, NguoiThucHien, LyDo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      existing.MaBanSao,
      existing.TinhTrang,
      d.TinhTrang,
      existing.MaCN,
      existing.MaCN,
      new Date().toISOString(),
      req.user!.TenDangNhap,
      d.LyDo || 'Cập nhật trạng thái bản sao'
    );

    res.json({ ok: true });
  }
);

operationalRouter.get('/ops/copies/:maBanSao/history', requireAuth, (req, res) => {
  const rows = db
    .prepare(
      `SELECT * FROM LICHSUTRANGTHAIBANSAO WHERE MaBanSao = ? ORDER BY MaLichSu DESC`
    )
    .all(req.params.maBanSao);
  res.json(rows);
});

/* ===========================
 * 3. VÒNG ĐỜI THẺ THƯ VIỆN
 * =========================== */
operationalRouter.get('/ops/cards/:maDocGia', requireAuth, (req, res) => {
  const rows = db
    .prepare('SELECT * FROM THETHUVIEN WHERE MaDocGia = ? ORDER BY NgayLap DESC, MaThe DESC')
    .all(req.params.maDocGia);
  res.json(rows);
});

operationalRouter.post(
  '/ops/cards/:maDocGia/renew',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN', 'READER'),
  (req: AuthenticatedRequest, res) => {
    const maDocGia = req.params.maDocGia;
    if (req.user!.VaiTro === 'READER' && req.user!.MaDocGia !== maDocGia) {
      res.status(403).json({ error: 'Bạn chỉ có thể gia hạn thẻ của chính mình.' });
      return;
    }

    const reader = db.prepare('SELECT * FROM DOCGIA WHERE MaDocGia = ?').get(maDocGia) as
      | { MaDocGia: string; HoTen: string; NgayHetHan: string; TongNo: number }
      | undefined;
    if (!reader) {
      res.status(404).json({ error: 'Không tìm thấy độc giả.' });
      return;
    }
    if (reader.TongNo > 0) {
      res.status(400).json({ error: `Độc giả đang còn nợ phạt ${reader.TongNo.toLocaleString('vi-VN')} ₫. Vui lòng thanh toán trước khi gia hạn thẻ.` });
      return;
    }
    const today = todayIsoDate();
    const overdueCount = (
      db
        .prepare(
          `SELECT COUNT(*) AS cnt FROM CHITIETPHIEUMUON ct
           JOIN PHIEUMUON pm ON pm.MaPhieuMuon = ct.MaPhieuMuon
           LEFT JOIN CHITIETPHIEUTRA tr ON tr.MaChiTietMuon = ct.MaChiTietMuon
           WHERE pm.MaDocGia = ? AND tr.MaChiTietTra IS NULL AND ct.HanTra < ?`
        )
        .get(maDocGia, today) as { cnt: number }
    ).cnt;
    if (overdueCount > 0) {
      res.status(400).json({ error: `Độc giả còn ${overdueCount} tài liệu quá hạn chưa trả. Không thể gia hạn thẻ.` });
      return;
    }

    const thamSo = getThamSo();
    const baseDate = reader.NgayHetHan > today ? reader.NgayHetHan : today;
    const newExpiry = addMonthsIso(baseDate, thamSo.ThoiHanThe);

    db.prepare('UPDATE DOCGIA SET NgayHetHan = ? WHERE MaDocGia = ?').run(newExpiry, maDocGia);
    db.prepare(
      `UPDATE THETHUVIEN SET NgayHetHan = ? WHERE MaDocGia = ? AND TrangThai = 'Đang dùng'`
    ).run(newExpiry, maDocGia);

    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'GIA_HAN_THE',
      BangTacDong: 'THETHUVIEN',
      ChiTiet: `Gia hạn thẻ độc giả ${maDocGia} (${reader.HoTen}) đến ${newExpiry}.`,
    });

    res.json({ MaDocGia: maDocGia, NgayHetHan: newExpiry });
  }
);

operationalRouter.post(
  '/ops/cards/:maDocGia/lock',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN'),
  (req: AuthenticatedRequest, res) => {
    const schema = z.object({
      LyDoKhoa: z.string().trim().min(3, 'Vui lòng nhập lý do khoá thẻ.'),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);

    const maDocGia = req.params.maDocGia;
    db.prepare(
      `UPDATE THETHUVIEN SET TrangThai = 'Đã khoá', LyDoKhoa = ? WHERE MaDocGia = ? AND TrangThai = 'Đang dùng'`
    ).run(parsed.data.LyDoKhoa, maDocGia);

    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'KHOA_THE',
      BangTacDong: 'THETHUVIEN',
      ChiTiet: `Khoá thẻ độc giả ${maDocGia}. Lý do: ${parsed.data.LyDoKhoa}.`,
    });
    res.json({ ok: true });
  }
);

operationalRouter.post(
  '/ops/cards/:maDocGia/report-lost',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN', 'READER'),
  (req: AuthenticatedRequest, res) => {
    const maDocGia = req.params.maDocGia;
    if (req.user!.VaiTro === 'READER' && req.user!.MaDocGia !== maDocGia) {
      res.status(403).json({ error: 'Bạn chỉ có thể báo mất thẻ của chính mình.' });
      return;
    }

    const reader = db.prepare('SELECT * FROM DOCGIA WHERE MaDocGia = ?').get(maDocGia) as
      | { MaDocGia: string; HoTen: string; NgayHetHan: string }
      | undefined;
    if (!reader) {
      res.status(404).json({ error: 'Không tìm thấy độc giả.' });
      return;
    }

    const today = todayIsoDate();
    const newCardId = `TV-${maDocGia}-${Date.now().toString().slice(-4)}`;

    const tx = db.transaction(() => {
      db.prepare(
        `UPDATE THETHUVIEN SET TrangThai = 'Đã báo mất', LyDoKhoa = 'Độc giả báo mất thẻ'
         WHERE MaDocGia = ? AND TrangThai = 'Đang dùng'`
      ).run(maDocGia);
      db.prepare(
        `INSERT INTO THETHUVIEN (MaThe, MaDocGia, NgayLap, NgayHetHan, TrangThai, LyDoKhoa)
         VALUES (?, ?, ?, ?, 'Đang dùng', NULL)`
      ).run(newCardId, maDocGia, today, reader.NgayHetHan);
    });
    tx();

    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'BAO_MAT_CAP_LAI_THE',
      BangTacDong: 'THETHUVIEN',
      ChiTiet: `Khoá thẻ cũ và cấp thẻ mới ${newCardId} cho độc giả ${maDocGia} (${reader.HoTen}).`,
    });

    res.status(201).json({ MaTheMoi: newCardId, NgayHetHan: reader.NgayHetHan });
  }
);

/* ===========================
 * 4. MA TRẬN PHÂN QUYỀN & PHẠM VI CHI NHÁNH
 * =========================== */
operationalRouter.get(
  '/ops/permissions/matrix',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN'),
  (_req, res) => {
    const permissions = db.prepare('SELECT * FROM QUYEN ORDER BY NhomChucNang, MaQuyen').all();
    const rolePermissions = db.prepare('SELECT * FROM VAITROQUYEN').all();
    const branchScopes = db.prepare('SELECT * FROM PHAMVICHINHANH').all();
    const branches = db.prepare('SELECT * FROM CHINHANH ORDER BY MaCN').all();
    res.json({ permissions, rolePermissions, branchScopes, branches });
  }
);

operationalRouter.put(
  '/ops/permissions/role',
  requireAuth,
  requireRole('ADMIN'),
  (req: AuthenticatedRequest, res) => {
    const schema = z.object({
      MaVaiTro: z.enum(['ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN', 'CATALOGER', 'READER']),
      MaQuyen: z.string().trim().min(1),
      enabled: z.boolean(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);
    const d = parsed.data;

    if (d.enabled) {
      db.prepare('INSERT OR IGNORE INTO VAITROQUYEN (MaVaiTro, MaQuyen) VALUES (?, ?)').run(
        d.MaVaiTro,
        d.MaQuyen
      );
    } else {
      db.prepare('DELETE FROM VAITROQUYEN WHERE MaVaiTro = ? AND MaQuyen = ?').run(
        d.MaVaiTro,
        d.MaQuyen
      );
    }

    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'CAP_NHAT_PHAN_QUYEN',
      BangTacDong: 'VAITROQUYEN',
      ChiTiet: `${d.enabled ? 'Cấp' : 'Thu hồi'} quyền ${d.MaQuyen} cho vai trò ${d.MaVaiTro}.`,
    });
    res.json({ ok: true });
  }
);

operationalRouter.put(
  '/ops/permissions/branch-scope',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN'),
  (req: AuthenticatedRequest, res) => {
    const schema = z.object({
      MaTaiKhoan: z.number().int().positive(),
      MaCN: z.string().trim().min(1),
      enabled: z.boolean(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);
    const d = parsed.data;

    if (d.enabled) {
      db.prepare('INSERT OR IGNORE INTO PHAMVICHINHANH (MaTaiKhoan, MaCN) VALUES (?, ?)').run(
        d.MaTaiKhoan,
        d.MaCN
      );
    } else {
      db.prepare('DELETE FROM PHAMVICHINHANH WHERE MaTaiKhoan = ? AND MaCN = ?').run(
        d.MaTaiKhoan,
        d.MaCN
      );
    }
    res.json({ ok: true });
  }
);

/* ===========================
 * 5. LỊCH SỬ CẤU HÌNH (QĐ31)
 * =========================== */
operationalRouter.get(
  '/ops/regulations/history',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN'),
  (_req, res) => {
    const rows = db
      .prepare('SELECT * FROM LICHSUCAUHINH ORDER BY MaLichSuCauHinh DESC LIMIT 100')
      .all();
    res.json(rows);
  }
);

/* ===========================
 * 6. BỔ SUNG & MUA SẮM TÀI LIỆU
 * =========================== */
operationalRouter.get(
  '/ops/acquisitions',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN', 'CATALOGER', 'LIBRARIAN'),
  (_req, res) => {
    const plans = db.prepare('SELECT * FROM KEHOACHMUASAM ORDER BY NgayBatDau DESC').all();
    const suppliers = db.prepare('SELECT * FROM NHACUNGCAP ORDER BY MaNCC ASC').all();
    const rawOrders = db
      .prepare(
        `SELECT d.*, k.TenKeHoach, n.TenNCC
         FROM DONDATMUA d
         JOIN KEHOACHMUASAM k ON k.MaKeHoach = d.MaKeHoach
         JOIN NHACUNGCAP n ON n.MaNCC = d.MaNCC
         ORDER BY d.NgayDat DESC, d.MaDonDatMua DESC`
      )
      .all() as Array<Record<string, unknown>>;

    const orders = rawOrders.map((o) => {
      const items = db
        .prepare('SELECT *, (SoLuongDat * DonGia) AS ThanhTien FROM CHITIETDONDATMUA WHERE MaDonDatMua = ?')
        .all(o.MaDonDatMua) as Array<{ ThanhTien: number }>;
      const TongTien = items.reduce((sum, it) => sum + Number(it.ThanhTien || 0), 0);
      return { ...o, ChiTiet: items, TongTien };
    });

    const receipts = db
      .prepare('SELECT * FROM PHIEUTIEPNHAN ORDER BY NgayNhan DESC, MaPhieuTiepNhan DESC')
      .all();
    const suggestions = db
      .prepare('SELECT * FROM YEUCAUTAILIEU ORDER BY NgayGui DESC')
      .all();

    res.json({ plans, suppliers, orders, receipts, suggestions });
  }
);

operationalRouter.post(
  '/ops/acquisitions/plans',
  requireAuth,
  requirePermission('ACQ_PLAN_APPROVE'),
  (req: AuthenticatedRequest, res) => {
    const schema = z.object({
      TenKeHoach: z.string().trim().min(3),
      NganSach: z.coerce.number().positive(),
      NgayBatDau: z.string().trim().min(8),
      NgayKetThuc: z.string().trim().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);
    const d = parsed.data;
    const id = nextPrefixedId('KEHOACHMUASAM', 'MaKeHoach', 'KH2026-');
    db.prepare(
      `INSERT INTO KEHOACHMUASAM (MaKeHoach, TenKeHoach, NganSach, NganSachDaDung, NgayBatDau, NgayKetThuc, NguoiDuyet)
       VALUES (?, ?, ?, 0, ?, ?, ?)`
    ).run(id, d.TenKeHoach, d.NganSach, d.NgayBatDau, d.NgayKetThuc || null, req.user!.TenDangNhap);
    res.status(201).json({ MaKeHoach: id });
  }
);

operationalRouter.post(
  '/ops/acquisitions/suppliers',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN', 'CATALOGER'),
  (req: AuthenticatedRequest, res) => {
    const schema = z.object({
      TenNCC: z.string().trim().min(2),
      DiaChi: z.string().trim().optional(),
      SDT: z.string().trim().optional(),
      Email: z.string().trim().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);
    const d = parsed.data;
    const id = nextPrefixedId('NHACUNGCAP', 'MaNCC', 'NCC', 2);
    db.prepare('INSERT INTO NHACUNGCAP (MaNCC, TenNCC, DiaChi, SDT, Email) VALUES (?, ?, ?, ?, ?)').run(
      id,
      d.TenNCC,
      d.DiaChi || null,
      d.SDT || null,
      d.Email || null
    );
    res.status(201).json({ MaNCC: id });
  }
);

operationalRouter.post(
  '/ops/acquisitions/orders',
  requireAuth,
  requireRole('HEAD_LIBRARIAN', 'CATALOGER'),
  (req: AuthenticatedRequest, res) => {
    const schema = z.object({
      MaKeHoach: z.string().trim().min(1),
      MaNCC: z.string().trim().min(1),
      ChiTiet: z
        .array(
          z.object({
            TenTaiLieuDat: z.string().trim().min(2),
            SoLuongDat: z.coerce.number().int().positive(),
            DonGia: z.coerce.number().nonnegative(),
          })
        )
        .min(1),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);
    const d = parsed.data;

    const plan = db.prepare('SELECT * FROM KEHOACHMUASAM WHERE MaKeHoach = ?').get(d.MaKeHoach) as
      | { MaKeHoach: string; NganSach: number; NganSachDaDung: number }
      | undefined;
    if (!plan) {
      res.status(404).json({ error: 'Không tìm thấy kế hoạch mua sắm.' });
      return;
    }

    const totalCost = d.ChiTiet.reduce((sum, it) => sum + it.SoLuongDat * it.DonGia, 0);
    const remainingBudget = plan.NganSach - plan.NganSachDaDung;
    if (totalCost > remainingBudget) {
      res.status(400).json({
        error: `Tổng giá trị đơn (${totalCost.toLocaleString('vi-VN')} ₫) vượt ngân sách còn lại (${remainingBudget.toLocaleString('vi-VN')} ₫) (QĐ37).`,
      });
      return;
    }

    const orderId = nextPrefixedId('DONDATMUA', 'MaDonDatMua', 'DM2026-');
    const today = todayIsoDate();

    const tx = db.transaction(() => {
      db.prepare(
        `INSERT INTO DONDATMUA (MaDonDatMua, MaKeHoach, MaNCC, NgayDat, TrangThai, NguoiLap)
         VALUES (?, ?, ?, ?, 'Đã gửi', ?)`
      ).run(orderId, d.MaKeHoach, d.MaNCC, today, req.user!.TenDangNhap);
      const insLine = db.prepare(
        `INSERT INTO CHITIETDONDATMUA (MaDonDatMua, TenTaiLieuDat, SoLuongDat, DonGia) VALUES (?, ?, ?, ?)`
      );
      for (const line of d.ChiTiet) {
        insLine.run(orderId, line.TenTaiLieuDat, line.SoLuongDat, line.DonGia);
      }
      db.prepare(
        'UPDATE KEHOACHMUASAM SET NganSachDaDung = NganSachDaDung + ? WHERE MaKeHoach = ?'
      ).run(totalCost, d.MaKeHoach);
    });
    tx();

    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'LAP_DON_DAT_MUA',
      BangTacDong: 'DONDATMUA',
      ChiTiet: `Tạo đơn đặt mua ${orderId} (${totalCost.toLocaleString('vi-VN')} ₫) thuộc kế hoạch ${d.MaKeHoach}.`,
    });
    res.status(201).json({ MaDonDatMua: orderId, TongTien: totalCost });
  }
);

operationalRouter.post(
  '/ops/acquisitions/receive',
  requireAuth,
  requirePermission('ACQ_RECEIVE'),
  (req: AuthenticatedRequest, res) => {
    const schema = z.object({
      MaDonDatMua: z.string().trim().min(1),
      SoLuongThucNhan: z.coerce.number().int().min(0),
      TinhTrangHang: z.enum(['Đạt', 'Thiếu', 'Thừa', 'Lỗi chất lượng']),
      GhiChuChenhLech: z.string().trim().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);
    const d = parsed.data;

    const order = db.prepare('SELECT * FROM DONDATMUA WHERE MaDonDatMua = ?').get(d.MaDonDatMua);
    if (!order) {
      res.status(404).json({ error: 'Không tìm thấy đơn đặt mua.' });
      return;
    }

    const totalOrdered = (
      db
        .prepare('SELECT COALESCE(SUM(SoLuongDat), 0) AS total FROM CHITIETDONDATMUA WHERE MaDonDatMua = ?')
        .get(d.MaDonDatMua) as { total: number }
    ).total;

    const receiptId = nextPrefixedId('PHIEUTIEPNHAN', 'MaPhieuTiepNhan', 'PTN2026-');
    const newOrderStatus =
      d.SoLuongThucNhan >= totalOrdered && d.TinhTrangHang === 'Đạt'
        ? 'Đã nhận đủ'
        : 'Đã nhận một phần';

    const tx = db.transaction(() => {
      db.prepare(
        `INSERT INTO PHIEUTIEPNHAN (MaPhieuTiepNhan, MaDonDatMua, NgayNhan, SoLuongThucNhan, TinhTrangHang, GhiChuChenhLech, NguoiTiepNhan)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).run(
        receiptId,
        d.MaDonDatMua,
        todayIsoDate(),
        d.SoLuongThucNhan,
        d.TinhTrangHang,
        d.GhiChuChenhLech || null,
        req.user!.TenDangNhap
      );
      db.prepare('UPDATE DONDATMUA SET TrangThai = ? WHERE MaDonDatMua = ?').run(
        newOrderStatus,
        d.MaDonDatMua
      );
    });
    tx();

    res.status(201).json({ MaPhieuTiepNhan: receiptId, TrangThaiDon: newOrderStatus });
  }
);

/* ===========================
 * 7. ĐIỀU CHUYỂN TÀI LIỆU (7 BƯỚC - QĐ29)
 * =========================== */
operationalRouter.get('/ops/transfers', requireAuth, (_req, res) => {
  const rows = db
    .prepare(
      `SELECT p.*, s.TenSach, g.TenCN AS TenChiNhanhGui, n.TenCN AS TenChiNhanhNhan
       FROM PHIEUDIEUCHUYEN p
       JOIN BANSAO b ON b.MaBanSao = p.MaBanSao
       JOIN SACH s ON s.MaSach = b.MaSach
       JOIN CHINHANH g ON g.MaCN = p.ChiNhanhGui
       JOIN CHINHANH n ON n.MaCN = p.ChiNhanhNhan
       ORDER BY p.NgayLap DESC, p.SoPhieuDC DESC`
    )
    .all() as Array<Record<string, unknown>>;

  const withHistory = rows.map((r) => ({
    ...r,
    LichSu: db
      .prepare('SELECT * FROM LICHSUDIEUCHUYEN WHERE SoPhieuDC = ? ORDER BY MaLichSu ASC')
      .all(r.SoPhieuDC),
  }));
  res.json(withHistory);
});

operationalRouter.post(
  '/ops/transfers',
  requireAuth,
  requirePermission('TRANSFER_CREATE'),
  (req: AuthenticatedRequest, res) => {
    const schema = z.object({
      MaBanSao: z.string().trim().min(1),
      ChiNhanhNhan: z.string().trim().min(1),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);
    const d = parsed.data;

    const copy = db.prepare('SELECT * FROM BANSAO WHERE MaBanSao = ?').get(d.MaBanSao) as
      | { MaBanSao: string; MaCN: string; TinhTrang: string }
      | undefined;
    if (!copy) {
      res.status(404).json({ error: 'Không tìm thấy bản sao.' });
      return;
    }
    if (copy.MaCN === d.ChiNhanhNhan) {
      res.status(400).json({ error: 'Chi nhánh nhận phải khác chi nhánh hiện tại của bản sao.' });
      return;
    }
    if (copy.TinhTrang !== 'Sẵn sàng') {
      res.status(400).json({ error: `Bản sao đang ở trạng thái "${copy.TinhTrang}", không thể điều chuyển.` });
      return;
    }

    const id = nextPrefixedId('PHIEUDIEUCHUYEN', 'SoPhieuDC', 'DC2026-');
    const today = todayIsoDate();

    const tx = db.transaction(() => {
      db.prepare(
        `INSERT INTO PHIEUDIEUCHUYEN (SoPhieuDC, MaBanSao, ChiNhanhGui, ChiNhanhNhan, TrangThai, NgayLap, NguoiLap)
         VALUES (?, ?, ?, ?, 'Chờ duyệt', ?, ?)`
      ).run(id, copy.MaBanSao, copy.MaCN, d.ChiNhanhNhan, today, req.user!.TenDangNhap);
      db.prepare(
        `INSERT INTO LICHSUDIEUCHUYEN (SoPhieuDC, TrangThaiCu, TrangThaiMoi, ThoiGian, NguoiThucHien)
         VALUES (?, NULL, 'Chờ duyệt', ?, ?)`
      ).run(id, new Date().toISOString(), req.user!.TenDangNhap);
    });
    tx();

    res.status(201).json({ SoPhieuDC: id });
  }
);

operationalRouter.post(
  '/ops/transfers/:soPhieu/transition',
  requireAuth,
  (req: AuthenticatedRequest, res) => {
    const schema = z.object({
      nextStatus: z.enum([
        'Đã duyệt',
        'Từ chối',
        'Đang vận chuyển',
        'Đã xuất kho',
        'Đã nhập kho',
        'Hoàn tất',
        'Thất lạc',
      ]),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);

    const transfer = db
      .prepare('SELECT * FROM PHIEUDIEUCHUYEN WHERE SoPhieuDC = ?')
      .get(req.params.soPhieu) as
      | {
          SoPhieuDC: string;
          MaBanSao: string;
          ChiNhanhGui: string;
          ChiNhanhNhan: string;
          TrangThai: string;
        }
      | undefined;
    if (!transfer) {
      res.status(404).json({ error: 'Không tìm thấy phiếu điều chuyển.' });
      return;
    }

    const { nextStatus } = parsed.data;
    if (
      (nextStatus === 'Đã duyệt' || nextStatus === 'Từ chối') &&
      req.user!.VaiTro !== 'HEAD_LIBRARIAN'
    ) {
      res.status(403).json({ error: 'Chỉ Quản lý thư viện mới có quyền duyệt/từ chối điều chuyển.' });
      return;
    }

    const today = todayIsoDate();
    const tx = db.transaction(() => {
      if (nextStatus === 'Đã duyệt') {
        db.prepare(
          'UPDATE PHIEUDIEUCHUYEN SET TrangThai = ?, NgayDuyet = ?, NguoiDuyet = ? WHERE SoPhieuDC = ?'
        ).run(nextStatus, today, req.user!.TenDangNhap, transfer.SoPhieuDC);
      } else if (nextStatus === 'Đã xuất kho') {
        db.prepare('UPDATE PHIEUDIEUCHUYEN SET TrangThai = ?, NgayXuatKho = ? WHERE SoPhieuDC = ?').run(
          nextStatus,
          today,
          transfer.SoPhieuDC
        );
      } else if (nextStatus === 'Đã nhập kho' || nextStatus === 'Hoàn tất') {
        // QĐ29: ONLY update BANSAO.MaCN when received at destination branch!
        db.prepare('UPDATE PHIEUDIEUCHUYEN SET TrangThai = ?, NgayNhapKho = ? WHERE SoPhieuDC = ?').run(
          nextStatus,
          today,
          transfer.SoPhieuDC
        );
        db.prepare('UPDATE BANSAO SET MaCN = ? WHERE MaBanSao = ?').run(
          transfer.ChiNhanhNhan,
          transfer.MaBanSao
        );
        db.prepare(
          `INSERT INTO LICHSUTRANGTHAIBANSAO (MaBanSao, TrangThaiCu, TrangThaiMoi, ChiNhanhCu, ChiNhanhMoi, ThoiGian, NguoiThucHien, LyDo)
           VALUES (?, 'Sẵn sàng', 'Sẵn sàng', ?, ?, ?, ?, ?)`
        ).run(
          transfer.MaBanSao,
          transfer.ChiNhanhGui,
          transfer.ChiNhanhNhan,
          new Date().toISOString(),
          req.user!.TenDangNhap,
          `Hoàn tất nhập kho điều chuyển ${transfer.SoPhieuDC}`
        );
      } else if (nextStatus === 'Thất lạc') {
        db.prepare('UPDATE PHIEUDIEUCHUYEN SET TrangThai = ? WHERE SoPhieuDC = ?').run(
          nextStatus,
          transfer.SoPhieuDC
        );
        db.prepare("UPDATE BANSAO SET TinhTrang = 'Thất lạc' WHERE MaBanSao = ?").run(
          transfer.MaBanSao
        );
      } else {
        db.prepare('UPDATE PHIEUDIEUCHUYEN SET TrangThai = ? WHERE SoPhieuDC = ?').run(
          nextStatus,
          transfer.SoPhieuDC
        );
      }

      db.prepare(
        `INSERT INTO LICHSUDIEUCHUYEN (SoPhieuDC, TrangThaiCu, TrangThaiMoi, ThoiGian, NguoiThucHien)
         VALUES (?, ?, ?, ?, ?)`
      ).run(
        transfer.SoPhieuDC,
        transfer.TrangThai,
        nextStatus,
        new Date().toISOString(),
        req.user!.TenDangNhap
      );
    });
    tx();

    res.json({ SoPhieuDC: transfer.SoPhieuDC, TrangThai: nextStatus });
  }
);

/* ===========================
 * 8. KIỂM KÊ, THANH LÝ & BỒI THƯỜNG
 * =========================== */
operationalRouter.get('/ops/inventory', requireAuth, (_req, res) => {
  const sessions = db
    .prepare(
      `SELECT b.*, c.TenCN FROM BIENBANKIEMKE b JOIN CHINHANH c ON c.MaCN = b.MaCN ORDER BY b.NgayKiemKe DESC`
    )
    .all() as Array<Record<string, unknown>>;
  const withItems = sessions.map((s) => ({
    ...s,
    ChiTiet: db
      .prepare(
        `SELECT ct.*, sa.TenSach, (ct.SoLuongThucTe - ct.SoLuongHeThong) AS ChenhLech
         FROM CHITIETKIEMKE ct JOIN SACH sa ON sa.MaSach = ct.MaSach WHERE ct.MaBBKK = ?`
      )
      .all(s.MaBBKK),
  }));
  const disposals = db
    .prepare(
      `SELECT p.*, s.TenSach FROM PHIEUTHANHLY p
       JOIN BANSAO b ON b.MaBanSao = p.MaBanSao
       JOIN SACH s ON s.MaSach = b.MaSach
       ORDER BY p.NgayLap DESC`
    )
    .all();
  const compensations = db
    .prepare(
      `SELECT bt.*, dg.HoTen AS HoTenDocGia, s.TenSach FROM PHIEUBOITHUONG bt
       JOIN DOCGIA dg ON dg.MaDocGia = bt.MaDocGia
       JOIN BANSAO b ON b.MaBanSao = bt.MaBanSao
       JOIN SACH s ON s.MaSach = b.MaSach
       ORDER BY bt.NgayLap DESC`
    )
    .all();
  res.json({ sessions: withItems, disposals, compensations });
});

operationalRouter.post(
  '/ops/inventory',
  requireAuth,
  requirePermission('INVENTORY_COUNT'),
  (req: AuthenticatedRequest, res) => {
    const schema = z.object({
      MaCN: z.string().trim().min(1),
      ChiTiet: z
        .array(
          z.object({
            MaSach: z.string().trim().min(1),
            SoLuongThucTe: z.coerce.number().int().min(0),
          })
        )
        .min(1),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);
    const d = parsed.data;

    const id = nextPrefixedId('BIENBANKIEMKE', 'MaBBKK', 'KK2026-');
    const tx = db.transaction(() => {
      db.prepare(
        `INSERT INTO BIENBANKIEMKE (MaBBKK, MaCN, NgayKiemKe, NguoiThucHien, TrangThai)
         VALUES (?, ?, ?, ?, 'Chờ duyệt')`
      ).run(id, d.MaCN, todayIsoDate(), req.user!.TenDangNhap);

      const countStmt = db.prepare(
        "SELECT COUNT(*) AS cnt FROM BANSAO WHERE MaSach = ? AND MaCN = ? AND TinhTrang != 'Đã thanh lý'"
      );
      const insLine = db.prepare(
        'INSERT INTO CHITIETKIEMKE (MaBBKK, MaSach, SoLuongHeThong, SoLuongThucTe) VALUES (?, ?, ?, ?)'
      );
      for (const item of d.ChiTiet) {
        const sysCount = (countStmt.get(item.MaSach, d.MaCN) as { cnt: number }).cnt;
        insLine.run(id, item.MaSach, sysCount, item.SoLuongThucTe);
      }
    });
    tx();
    res.status(201).json({ MaBBKK: id });
  }
);

operationalRouter.post(
  '/ops/inventory/:maBBKK/approve',
  requireAuth,
  requirePermission('INVENTORY_APPROVE'),
  (req: AuthenticatedRequest, res) => {
    if (req.user!.VaiTro !== 'HEAD_LIBRARIAN') {
      res.status(403).json({ error: 'Chỉ Quản lý thư viện mới có quyền duyệt điều chỉnh tồn kho.' });
      return;
    }
    db.prepare("UPDATE BIENBANKIEMKE SET TrangThai = 'Đã duyệt điều chỉnh' WHERE MaBBKK = ?").run(
      req.params.maBBKK
    );
    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'DUYET_KIEM_KE',
      BangTacDong: 'BIENBANKIEMKE',
      ChiTiet: `Phê duyệt điều chỉnh tồn kho biên bản ${req.params.maBBKK}.`,
    });
    res.json({ ok: true });
  }
);

operationalRouter.post(
  '/ops/disposals',
  requireAuth,
  requirePermission('DISPOSAL_PROPOSE'),
  (req: AuthenticatedRequest, res) => {
    const schema = z.object({
      MaBanSao: z.string().trim().min(1),
      LyDo: z.string().trim().min(3),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);
    const d = parsed.data;
    const id = nextPrefixedId('PHIEUTHANHLY', 'SoPhieuTL', 'TL2026-');
    db.prepare(
      `INSERT INTO PHIEUTHANHLY (SoPhieuTL, MaBanSao, LyDo, NgayLap, TrangThai, NguoiDeXuat)
       VALUES (?, ?, ?, ?, 'Chờ duyệt', ?)`
    ).run(id, d.MaBanSao, d.LyDo, todayIsoDate(), req.user!.TenDangNhap);
    res.status(201).json({ SoPhieuTL: id });
  }
);

operationalRouter.post(
  '/ops/disposals/:soPhieu/decision',
  requireAuth,
  requirePermission('DISPOSAL_APPROVE'),
  (req: AuthenticatedRequest, res) => {
    if (req.user!.VaiTro !== 'HEAD_LIBRARIAN') {
      res.status(403).json({ error: 'Chỉ Quản lý thư viện mới có quyền duyệt thanh lý (QĐ tách biệt quyền duyệt).' });
      return;
    }
    const schema = z.object({ decision: z.enum(['Đã duyệt', 'Từ chối']) });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);

    const row = db
      .prepare('SELECT * FROM PHIEUTHANHLY WHERE SoPhieuTL = ?')
      .get(req.params.soPhieu) as { SoPhieuTL: string; MaBanSao: string } | undefined;
    if (!row) {
      res.status(404).json({ error: 'Không tìm thấy phiếu thanh lý.' });
      return;
    }

    const today = todayIsoDate();
    const tx = db.transaction(() => {
      db.prepare(
        'UPDATE PHIEUTHANHLY SET TrangThai = ?, NgayThanhLy = ?, NguoiDuyet = ? WHERE SoPhieuTL = ?'
      ).run(parsed.data.decision, today, req.user!.TenDangNhap, row.SoPhieuTL);
      if (parsed.data.decision === 'Đã duyệt') {
        db.prepare("UPDATE BANSAO SET TinhTrang = 'Đã thanh lý' WHERE MaBanSao = ?").run(row.MaBanSao);
      }
    });
    tx();
    res.json({ ok: true });
  }
);

operationalRouter.post(
  '/ops/compensations',
  requireAuth,
  requireRole('HEAD_LIBRARIAN', 'LIBRARIAN'),
  (req: AuthenticatedRequest, res) => {
    const schema = z.object({
      MaDocGia: z.string().trim().min(1),
      MaBanSao: z.string().trim().min(1),
      LoaiSuCo: z.enum(['Mất', 'Hư hỏng']),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);
    const d = parsed.data;

    const copy = db
      .prepare(
        `SELECT b.MaBanSao, s.TriGia FROM BANSAO b JOIN SACH s ON s.MaSach = b.MaSach WHERE b.MaBanSao = ?`
      )
      .get(d.MaBanSao) as { MaBanSao: string; TriGia: number } | undefined;
    if (!copy) {
      res.status(404).json({ error: 'Không tìm thấy bản sao.' });
      return;
    }

    const feeRate = 0.2;
    const phiXuLy = Math.round(copy.TriGia * feeRate);
    const tongBoiThuong = copy.TriGia + phiXuLy;
    const id = nextPrefixedId('PHIEUBOITHUONG', 'SoPhieuBT', 'BT2026-');

    const tx = db.transaction(() => {
      db.prepare(
        `INSERT INTO PHIEUBOITHUONG (SoPhieuBT, MaDocGia, MaBanSao, LoaiSuCo, TriGiaTaiLieu, PhiXuLy, TongBoiThuong, NgayLap, TrangThai)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Chưa thu')`
      ).run(id, d.MaDocGia, d.MaBanSao, d.LoaiSuCo, copy.TriGia, phiXuLy, tongBoiThuong, todayIsoDate());
      db.prepare('UPDATE DOCGIA SET TongNo = TongNo + ? WHERE MaDocGia = ?').run(
        tongBoiThuong,
        d.MaDocGia
      );
      db.prepare("UPDATE BANSAO SET TinhTrang = 'Chờ thanh lý' WHERE MaBanSao = ?").run(d.MaBanSao);
    });
    tx();

    res.status(201).json({ SoPhieuBT: id, TongBoiThuong: tongBoiThuong });
  }
);

/* ===========================
 * 9. ĐỐI SOÁT TÀI CHÍNH, ĐIỀU CHỈNH & THANH TOÁN TRỰC TUYẾN
 * =========================== */
operationalRouter.get(
  '/ops/finance/reconcile',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN'),
  (_req, res) => {
    const totalSystemCash = (
      db.prepare('SELECT COALESCE(SUM(SoTienThu), 0) AS total FROM PHIEUTHUTIENPHAT').get() as {
        total: number;
      }
    ).total;
    const totalOnline = (
      db
        .prepare("SELECT COALESCE(SUM(SoTien), 0) AS total FROM GIAODICHTHANHTOAN WHERE TrangThai = 'Thành công'")
        .get() as { total: number }
    ).total;
    const totalApprovedAdjustments = (
      db
        .prepare("SELECT COALESCE(SUM(SoTienDieuChinh), 0) AS total FROM PHIEUDIEUCHINH WHERE TrangThai = 'Đã duyệt'")
        .get() as { total: number }
    ).total;

    const onlineTransactions = db
      .prepare(
        `SELECT g.*, dg.HoTen AS HoTenDocGia FROM GIAODICHTHANHTOAN g
         JOIN DOCGIA dg ON dg.MaDocGia = g.MaDocGia ORDER BY g.ThoiGianGD DESC`
      )
      .all();
    const adjustments = db
      .prepare('SELECT * FROM PHIEUDIEUCHINH ORDER BY NgayLap DESC, MaPhieuDieuChinh DESC')
      .all();

    res.json({
      totalSystemCash,
      totalOnline,
      totalApprovedAdjustments,
      netReconciled: totalSystemCash + totalOnline + totalApprovedAdjustments,
      onlineTransactions,
      adjustments,
    });
  }
);

operationalRouter.post(
  '/ops/finance/adjustments',
  requireAuth,
  requireRole('HEAD_LIBRARIAN', 'LIBRARIAN'),
  (req: AuthenticatedRequest, res) => {
    const schema = z.object({
      LoaiChungTu: z.enum(['PhieuPhat', 'PhieuBoiThuong', 'GiaoDichThanhToan']),
      MaChungTuGoc: z.string().trim().min(2),
      SoTienDieuChinh: z.coerce.number(),
      LyDo: z.string().trim().min(4),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);
    const d = parsed.data;
    const id = nextPrefixedId('PHIEUDIEUCHINH', 'MaPhieuDieuChinh', 'PDC2026-');
    db.prepare(
      `INSERT INTO PHIEUDIEUCHINH (MaPhieuDieuChinh, LoaiChungTu, MaChungTuGoc, SoTienDieuChinh, LyDo, NguoiLap, NgayLap, TrangThai)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Chờ duyệt')`
    ).run(id, d.LoaiChungTu, d.MaChungTuGoc, d.SoTienDieuChinh, d.LyDo, req.user!.TenDangNhap, todayIsoDate());
    res.status(201).json({ MaPhieuDieuChinh: id });
  }
);

operationalRouter.post(
  '/ops/finance/adjustments/:maPhieu/decision',
  requireAuth,
  requirePermission('FINANCE_ADJUST_APPROVE'),
  (req: AuthenticatedRequest, res) => {
    if (req.user!.VaiTro !== 'HEAD_LIBRARIAN') {
      res.status(403).json({ error: 'Chỉ Quản lý thư viện mới có quyền duyệt phiếu điều chỉnh tài chính.' });
      return;
    }
    const schema = z.object({ decision: z.enum(['Đã duyệt', 'Từ chối']) });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);
    db.prepare('UPDATE PHIEUDIEUCHINH SET TrangThai = ?, NguoiDuyet = ? WHERE MaPhieuDieuChinh = ?').run(
      parsed.data.decision,
      req.user!.TenDangNhap,
      req.params.maPhieu
    );
    res.json({ ok: true });
  }
);

operationalRouter.post(
  '/ops/finance/online-pay',
  requireAuth,
  (req: AuthenticatedRequest, res) => {
    const schema = z.object({
      MaDocGia: z.string().trim().min(1),
      KenhThanhToan: z.enum(['VNPay', 'Momo', 'ZaloPay']),
      SoTien: z.coerce.number().positive(),
      MaGD_CongThanhToan: z.string().trim().min(4),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);
    const d = parsed.data;

    if (req.user!.VaiTro === 'READER' && req.user!.MaDocGia !== d.MaDocGia) {
      res.status(403).json({ error: 'Bạn chỉ có thể thanh toán công nợ của chính mình.' });
      return;
    }

    // Idempotency guard (TC36-02)
    const dup = db
      .prepare('SELECT MaGD FROM GIAODICHTHANHTOAN WHERE MaGD_CongThanhToan = ?')
      .get(d.MaGD_CongThanhToan) as { MaGD: string } | undefined;
    if (dup) {
      res.status(409).json({ error: `Giao dịch cổng thanh toán ${d.MaGD_CongThanhToan} đã được ghi nhận trước đó.` });
      return;
    }

    const reader = db.prepare('SELECT MaDocGia, TongNo FROM DOCGIA WHERE MaDocGia = ?').get(d.MaDocGia) as
      | { MaDocGia: string; TongNo: number }
      | undefined;
    if (!reader) {
      res.status(404).json({ error: 'Không tìm thấy độc giả.' });
      return;
    }
    if (d.SoTien > reader.TongNo) {
      res.status(400).json({ error: 'Số tiền thanh toán vượt quá tổng nợ hiện tại.' });
      return;
    }

    const maGD = `GD${Date.now()}`;
    const tx = db.transaction(() => {
      db.prepare(
        `INSERT INTO GIAODICHTHANHTOAN (MaGD, MaDocGia, KenhThanhToan, MaGD_CongThanhToan, SoTien, TrangThai, ThoiGianGD)
         VALUES (?, ?, ?, ?, ?, 'Thành công', ?)`
      ).run(maGD, d.MaDocGia, d.KenhThanhToan, d.MaGD_CongThanhToan, d.SoTien, new Date().toISOString());
      db.prepare('UPDATE DOCGIA SET TongNo = MAX(0, TongNo - ?) WHERE MaDocGia = ?').run(
        d.SoTien,
        d.MaDocGia
      );
    });
    tx();

    res.status(201).json({ MaGD: maGD, ConLai: Math.max(0, reader.TongNo - d.SoTien) });
  }
);

/* ===========================
 * 10. NGOẠI LỆ MƯỢN VƯỢT ĐỊNH MỨC
 * =========================== */
operationalRouter.get('/ops/overrides', requireAuth, (req: AuthenticatedRequest, res) => {
  const rows =
    req.user!.VaiTro === 'READER'
      ? db
          .prepare(
            `SELECT n.*, dg.HoTen AS HoTenDocGia FROM NGOAILEMUON n
             JOIN DOCGIA dg ON dg.MaDocGia = n.MaDocGia WHERE n.MaDocGia = ? ORDER BY n.NgayTao DESC`
          )
          .all(req.user!.MaDocGia)
      : db
          .prepare(
            `SELECT n.*, dg.HoTen AS HoTenDocGia FROM NGOAILEMUON n
             JOIN DOCGIA dg ON dg.MaDocGia = n.MaDocGia ORDER BY n.NgayTao DESC`
          )
          .all();
  res.json(rows);
});

operationalRouter.post('/ops/overrides', requireAuth, (req: AuthenticatedRequest, res) => {
  const schema = z.object({
    MaDocGia: z.string().trim().min(1),
    SoLuongThem: z.coerce.number().int().min(1).max(10),
    LyDo: z.string().trim().min(4),
    HanApDung: z.string().trim().min(8),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return sendZodError(res, parsed.error);
  const d = parsed.data;
  const id = nextPrefixedId('NGOAILEMUON', 'MaNgoaiLe', 'NL2026-');
  db.prepare(
    `INSERT INTO NGOAILEMUON (MaNgoaiLe, MaDocGia, SoLuongThem, LyDo, HanApDung, TrangThai, NgayTao)
     VALUES (?, ?, ?, ?, ?, 'Chờ duyệt', ?)`
  ).run(id, d.MaDocGia, d.SoLuongThem, d.LyDo, d.HanApDung, todayIsoDate());
  res.status(201).json({ MaNgoaiLe: id });
});

operationalRouter.post(
  '/ops/overrides/:maNgoaiLe/decision',
  requireAuth,
  requirePermission('LOAN_OVERRIDE_APPROVE'),
  (req: AuthenticatedRequest, res) => {
    if (req.user!.VaiTro !== 'HEAD_LIBRARIAN') {
      res.status(403).json({ error: 'Chỉ Quản lý thư viện mới có quyền phê duyệt ngoại lệ mượn.' });
      return;
    }
    const schema = z.object({ decision: z.enum(['Đã duyệt', 'Từ chối']) });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);
    db.prepare('UPDATE NGOAILEMUON SET TrangThai = ?, NguoiDuyet = ? WHERE MaNgoaiLe = ?').run(
      parsed.data.decision,
      req.user!.TenDangNhap,
      req.params.maNgoaiLe
    );
    const ov = db
      .prepare('SELECT MaDocGia, SoLuongThem, HanApDung FROM NGOAILEMUON WHERE MaNgoaiLe = ?')
      .get(req.params.maNgoaiLe) as { MaDocGia: string; SoLuongThem: number; HanApDung: string } | undefined;
    if (ov) {
      db.prepare(
        `INSERT INTO THONGBAO (MaDocGia, LoaiTB, TieuDe, NoiDung, KenhGui, ThoiGianGui, DaDoc)
         VALUES (?, 'Ngoại lệ mượn', ?, ?, 'App', ?, 0)`
      ).run(
        ov.MaDocGia,
        `Yêu cầu mượn vượt định mức: ${parsed.data.decision}`,
        `Yêu cầu mượn thêm ${ov.SoLuongThem} tài liệu (hạn ${ov.HanApDung}) đã được ${parsed.data.decision.toLowerCase()}.`,
        new Date().toISOString()
      );
    }
    res.json({ ok: true });
  }
);

/* ===========================
 * 11. ĐÁNH GIÁ & TÀI NGUYÊN SỐ
 * =========================== */
operationalRouter.get('/ops/books/:maSach/extras', (req, res) => {
  const reviews = db
    .prepare(
      `SELECT d.*, dg.HoTen AS HoTenDocGia FROM DANHGIA d
       JOIN DOCGIA dg ON dg.MaDocGia = d.MaDocGia WHERE d.MaSach = ? ORDER BY d.MaDanhGia DESC`
    )
    .all(req.params.maSach);
  const digital = db
    .prepare('SELECT * FROM TAINGUYENSO WHERE MaSach = ?')
    .get(req.params.maSach) ?? null;
  const copies = db
    .prepare(
      `SELECT b.*, c.TenCN, k.ViTri AS ViTriKe FROM BANSAO b
       JOIN CHINHANH c ON c.MaCN = b.MaCN
       LEFT JOIN KESACH k ON k.MaKe = b.MaKe
       WHERE b.MaSach = ? ORDER BY b.MaBanSao`
    )
    .all(req.params.maSach);
  const courses = db
    .prepare(
      `SELECT m.MaMon, m.TenMon, m.MaNganh, m.HocKy, sm.BatBuoc
       FROM SACH_MONHOC sm JOIN MONHOC m ON m.MaMon = sm.MaMon
       WHERE sm.MaSach = ? ORDER BY sm.BatBuoc DESC, m.MaMon ASC`
    )
    .all(req.params.maSach);
  res.json({ reviews, digital, copies, courses });
});

operationalRouter.post('/ops/books/:maSach/reviews', requireAuth, (req: AuthenticatedRequest, res) => {
  const maDocGia = req.user!.MaDocGia;
  if (!maDocGia) {
    res.status(403).json({ error: 'Chỉ tài khoản độc giả mới có thể gửi đánh giá tài liệu.' });
    return;
  }
  const schema = z.object({
    SoSao: z.coerce.number().int().min(1).max(5),
    NoiDung: z.string().trim().min(3),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return sendZodError(res, parsed.error);

  db.prepare(
    `INSERT INTO DANHGIA (MaDocGia, MaSach, SoSao, NoiDung, NgayDanhGia) VALUES (?, ?, ?, ?, ?)`
  ).run(maDocGia, req.params.maSach, parsed.data.SoSao, parsed.data.NoiDung, todayIsoDate());

  res.status(201).json({ ok: true });
});

