import { Router } from 'express';
import { z } from 'zod';
import { addDaysIso, todayIsoDate } from '../../src/lib/businessRules';
import { requireAuth, requireRole, type AuthenticatedRequest } from '../auth';
import { db, writeAuditLog } from '../db';
import { sendZodError } from './shared';

export const portalFeaturesRouter = Router();

/* ===========================
 * 1. TỦ SÁCH MÔN HỌC UIT (COURSE RESERVES)
 * =========================== */
portalFeaturesRouter.get('/public/courses', (_req, res) => {
  const courses = db
    .prepare(
      `SELECT m.*,
        (SELECT COUNT(*) FROM SACH_MONHOC sm WHERE sm.MaMon = m.MaMon) AS SoTaiLieu
       FROM MONHOC m ORDER BY m.MaMon ASC`
    )
    .all() as Array<{ MaMon: string; TenMon: string; MaNganh: string; HocKy: string; SoTaiLieu: number }>;

  const links = db
    .prepare(
      `SELECT sm.MaMon, sm.MaSach, sm.BatBuoc, s.TenSach, s.AnhBia
       FROM SACH_MONHOC sm
       JOIN SACH s ON s.MaSach = sm.MaSach
       ORDER BY sm.BatBuoc DESC, s.TenSach ASC`
    )
    .all() as Array<{ MaMon: string; MaSach: string; BatBuoc: number; TenSach: string; AnhBia: string | null }>;

  const map = new Map<string, typeof links>();
  for (const l of links) {
    const arr = map.get(l.MaMon) || [];
    arr.push(l);
    map.set(l.MaMon, arr);
  }

  res.json(
    courses.map((c) => ({
      ...c,
      TaiLieu: map.get(c.MaMon) || [],
    }))
  );
});

portalFeaturesRouter.post(
  '/ops/courses/link',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN', 'CATALOGER'),
  (req: AuthenticatedRequest, res) => {
    const schema = z.object({
      MaSach: z.string().trim().min(1),
      MaMon: z.string().trim().min(2),
      BatBuoc: z.boolean().default(true),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return sendZodError(res, parsed.error);
    const d = parsed.data;

    db.prepare(
      'INSERT OR REPLACE INTO SACH_MONHOC (MaSach, MaMon, BatBuoc) VALUES (?, ?, ?)'
    ).run(d.MaSach, d.MaMon, d.BatBuoc ? 1 : 0);

    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'GAN_MON_HOC',
      BangTacDong: 'SACH_MONHOC',
      ChiTiet: `Gắn tài liệu ${d.MaSach} vào môn học ${d.MaMon} (${d.BatBuoc ? 'Bắt buộc' : 'Tham khảo'}).`,
    });
    res.status(201).json({ ok: true });
  }
);

portalFeaturesRouter.delete(
  '/ops/courses/link',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN', 'CATALOGER'),
  (req: AuthenticatedRequest, res) => {
    const maSach = String(req.query.maSach || '');
    const maMon = String(req.query.maMon || '');
    db.prepare('DELETE FROM SACH_MONHOC WHERE MaSach = ? AND MaMon = ?').run(maSach, maMon);
    res.json({ ok: true });
  }
);

/* ===========================
 * 2. TRÍCH DẪN HỌC THUẬT & CHUẨN MARC21 / DUBLIN CORE
 * =========================== */
portalFeaturesRouter.get('/public/books/:maSach/export', (req, res) => {
  const format = String(req.query.format || 'bibtex').toLowerCase();
  const book = db
    .prepare(
      `SELECT s.*, tl.TenTheLoai,
        (SELECT GROUP_CONCAT(tg.TenTacGia, '; ') FROM SACH_TACGIA st JOIN TACGIA tg ON tg.MaTacGia = st.MaTacGia WHERE st.MaSach = s.MaSach) AS TacGiaJoined
       FROM SACH s
       JOIN THELOAI tl ON tl.MaTheLoai = s.MaTheLoai
       WHERE s.MaSach = ?`
    )
    .get(req.params.maSach) as
    | {
        MaSach: string;
        TenSach: string;
        TenTheLoai: string;
        NamXuatBan: number;
        NhaXuatBan: string;
        MaNganh: string | null;
        NgonNgu: string | null;
        MoTa: string | null;
        TacGiaJoined: string | null;
      }
    | undefined;

  if (!book) {
    res.status(404).json({ error: 'Không tìm thấy tài liệu.' });
    return;
  }

  const authors = (book.TacGiaJoined || 'UIT Library').split('; ').filter(Boolean);
  const authorBib = authors.join(' and ');
  const authorComma = authors.join(', ');
  const citeKey = `UIT_${book.MaSach}_${book.NamXuatBan}`;

  if (format === 'bibtex') {
    const content = `@book{${citeKey},\n  title = {${book.TenSach}},\n  author = {${authorBib}},\n  publisher = {${book.NhaXuatBan}},\n  year = {${book.NamXuatBan}},\n  note = {UIT Library Catalog ID: ${book.MaSach}}\n}`;
    res.json({ format: 'bibtex', content });
    return;
  }

  if (format === 'ieee') {
    const content = `${authorComma}, "${book.TenSach}," ${book.NhaXuatBan}, ${book.NamXuatBan}. [UIT Library ID: ${book.MaSach}].`;
    res.json({ format: 'ieee', content });
    return;
  }

  if (format === 'apa') {
    const content = `${authorComma} (${book.NamXuatBan}). *${book.TenSach}*. ${book.NhaXuatBan}.`;
    res.json({ format: 'apa', content });
    return;
  }

  if (format === 'dublincore') {
    const content = JSON.stringify(
      {
        'dc:identifier': book.MaSach,
        'dc:title': book.TenSach,
        'dc:creator': authors,
        'dc:publisher': book.NhaXuatBan,
        'dc:date': String(book.NamXuatBan),
        'dc:subject': [book.TenTheLoai, book.MaNganh || 'CNTT'],
        'dc:language': book.NgonNgu === 'Tiếng Anh' ? 'en' : 'vi',
        'dc:description': book.MoTa || '',
      },
      null,
      2
    );
    res.json({ format: 'dublincore', content });
    return;
  }

  // MARC21 structured record
  const marc21 = {
    leader: '00000nam a2200000 i 4500',
    fields: [
      { '001': book.MaSach },
      { '041': { subfields: [{ a: book.NgonNgu === 'Tiếng Anh' ? 'eng' : 'vie' }] } },
      { '100': { subfields: [{ a: authors[0] || 'UIT' }] } },
      { '245': { subfields: [{ a: book.TenSach }] } },
      { '264': { subfields: [{ b: book.NhaXuatBan }, { c: String(book.NamXuatBan) }] } },
      { '650': { subfields: [{ a: book.TenTheLoai }] } },
    ],
  };
  res.json({ format: 'marc21', content: JSON.stringify(marc21, null, 2) });
});

/* ===========================
 * 3. THÔNG BÁO ĐỘC GIẢ (THONGBAO)
 * =========================== */
portalFeaturesRouter.get('/notifications', requireAuth, (req: AuthenticatedRequest, res) => {
  const maDocGia = req.user!.MaDocGia;
  if (!maDocGia) {
    res.json({ unreadCount: 0, items: [] });
    return;
  }
  const items = db
    .prepare('SELECT * FROM THONGBAO WHERE MaDocGia = ? ORDER BY MaTB DESC LIMIT 30')
    .all(maDocGia) as Array<{ DaDoc: number }>;
  const unreadCount = items.filter((i) => !i.DaDoc).length;
  res.json({ unreadCount, items });
});

portalFeaturesRouter.patch('/notifications/:id/read', requireAuth, (req: AuthenticatedRequest, res) => {
  const maDocGia = req.user!.MaDocGia;
  if (!maDocGia) {
    res.status(403).json({ error: 'Chỉ áp dụng cho độc giả.' });
    return;
  }
  db.prepare('UPDATE THONGBAO SET DaDoc = 1 WHERE MaTB = ? AND MaDocGia = ?').run(
    Number(req.params.id),
    maDocGia
  );
  res.json({ ok: true });
});

portalFeaturesRouter.post('/notifications/read-all', requireAuth, (req: AuthenticatedRequest, res) => {
  const maDocGia = req.user!.MaDocGia;
  if (!maDocGia) {
    res.status(403).json({ error: 'Chỉ áp dụng cho độc giả.' });
    return;
  }
  db.prepare('UPDATE THONGBAO SET DaDoc = 1 WHERE MaDocGia = ?').run(maDocGia);
  res.json({ ok: true });
});

/* ===========================
 * 4. ĐỌC TÀI NGUYÊN SỐ DRM (TAINGUYENSO + LUOTDOCSO)
 * =========================== */
portalFeaturesRouter.post('/ops/books/:maSach/digital-open', requireAuth, (req: AuthenticatedRequest, res) => {
  const maDocGia = req.user!.MaDocGia || `STAFF-${req.user!.MaTaiKhoan}`;
  const tns = db
    .prepare('SELECT * FROM TAINGUYENSO WHERE MaSach = ?')
    .get(req.params.maSach) as
    | {
        MaTNS: string;
        MaSach: string;
        DuongDanFile: string;
        DinhDangFile: string;
        SoLuotMuonDongThoi: number;
        ThoiHanDRM_Ngay: number;
      }
    | undefined;

  if (!tns) {
    res.status(404).json({ error: 'Tài liệu này chưa có phiên bản số hóa DRM.' });
    return;
  }

  const book = db
    .prepare('SELECT MaSach, TenSach, MoTa, NhaXuatBan, NamXuatBan FROM SACH WHERE MaSach = ?')
    .get(req.params.maSach) as {
    MaSach: string;
    TenSach: string;
    MoTa: string | null;
    NhaXuatBan: string;
    NamXuatBan: number;
  };

  const today = todayIsoDate();
  const activeCount = (
    db
      .prepare('SELECT COUNT(*) AS cnt FROM LUOTDOCSO WHERE MaTNS = ? AND HanDRM >= ?')
      .get(tns.MaTNS, today) as { cnt: number }
  ).cnt;

  if (activeCount >= tns.SoLuotMuonDongThoi) {
    res.status(429).json({
      error: `Tài nguyên số ${tns.MaTNS} đã đạt tối đa ${tns.SoLuotMuonDongThoi} lượt đọc đồng thời.`,
    });
    return;
  }

  const hanDRM = addDaysIso(today, tns.ThoiHanDRM_Ngay);
  if (req.user!.MaDocGia) {
    db.prepare(
      'INSERT INTO LUOTDOCSO (MaTNS, MaDocGia, ThoiGianMo, HanDRM) VALUES (?, ?, ?, ?)'
    ).run(tns.MaTNS, req.user!.MaDocGia, new Date().toISOString(), hanDRM);
  }

  res.status(201).json({
    MaTNS: tns.MaTNS,
    DinhDangFile: tns.DinhDangFile,
    HanDRM: hanDRM,
    Watermark: `UIT-DRM · ${req.user!.HoTen} (${maDocGia})`,
    ActiveReaders: activeCount + 1,
    MaxConcurrent: tns.SoLuotMuonDongThoi,
    PreviewText:
      book.MoTa ||
      `${book.TenSach} — ${book.NhaXuatBan} (${book.NamXuatBan}). Tài liệu học tập lưu hành nội bộ Trường ĐH CNTT – ĐHQG-HCM.`,
  });
});

/* ===========================
 * 5. TÌM KIẾM LIÊN THƯ VIỆN QUỐC TẾ (OPENALEX FEDERATED DISCOVERY)
 * =========================== */
portalFeaturesRouter.get('/public/scholar-search', async (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  if (!q) {
    res.json({ source: 'openalex', results: [] });
    return;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  try {
    const url = `https://api.openalex.org/works?search=${encodeURIComponent(q)}&per-page=5&select=id,title,publication_year,cited_by_count,doi,primary_location,authorships`;
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'UIT-Library-Portal/1.0 (mailto:thuvien@uit.edu.vn)' },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = (await resp.json()) as {
      results?: Array<{
        id: string;
        title: string;
        publication_year?: number;
        cited_by_count?: number;
        doi?: string;
        primary_location?: { source?: { display_name?: string } };
        authorships?: Array<{ author?: { display_name?: string } }>;
      }>;
    };
    const results = (data.results || []).map((w) => ({
      id: w.id,
      title: w.title,
      year: w.publication_year ?? null,
      citedBy: w.cited_by_count ?? 0,
      doi: w.doi || w.id,
      venue: w.primary_location?.source?.display_name || 'OpenAlex Open Research',
      authors: (w.authorships || [])
        .slice(0, 3)
        .map((a) => a.author?.display_name)
        .filter(Boolean)
        .join(', '),
    }));
    res.json({ source: 'openalex', results });
  } catch {
    res.json({ source: 'offline-fallback', results: [] });
  } finally {
    clearTimeout(timer);
  }
});
