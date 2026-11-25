import { Router } from 'express';
import {
  computeCategoryReportPercentages,
  diffDaysIso,
  isValidIsoDate,
  todayIsoDate,
} from '../src/lib/businessRules';
import { validateLoanRenewal } from '../src/services/rules/circulationRules';
import { requireAuth, requireRole, type AuthenticatedRequest } from './auth';
import { db, writeAuditLog } from './db';

export const portalRouter = Router();

function nextCode(table: string, col: string, prefix: string): string {
  const rows = db.prepare(`SELECT ${col} as id FROM ${table}`).all() as Array<{ id: string }>;
  const re = new RegExp(`^${prefix}(\\d+)$`);
  let max = 0;
  for (const r of rows) {
    const m = re.exec(r.id);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return `${prefix}${String(max + 1).padStart(3, '0')}`;
}

portalRouter.get('/public/stats', (_req, res) => {
  const rooms = (db.prepare('SELECT COUNT(*) as c FROM PHONGHOP').get() as { c: number }).c;
  const readers = (db.prepare('SELECT COUNT(*) as c FROM DOCGIA').get() as { c: number }).c;
  res.json({ roomCount: rooms, readerCount: readers });
});

portalRouter.get('/public/thamso', (_req, res) => {
  res.json(db.prepare('SELECT * FROM THAMSO WHERE MaThamSo = 1').get());
});

portalRouter.get('/public/rooms', (_req, res) => {
  res.json(db.prepare('SELECT * FROM PHONGHOP ORDER BY MaPhong ASC').all());
});

portalRouter.get('/public/datphong', (req, res) => {
  const ngayDat = typeof req.query.ngayDat === 'string' ? req.query.ngayDat : '';
  const rows = ngayDat
    ? db.prepare(
        `SELECT dp.*, ph.TenPhong FROM DATPHONG dp JOIN PHONGHOP ph ON ph.MaPhong = dp.MaPhong WHERE dp.NgayDat = ? ORDER BY dp.NgayDat DESC`
      ).all(ngayDat)
    : db.prepare(
        `SELECT dp.*, ph.TenPhong FROM DATPHONG dp JOIN PHONGHOP ph ON ph.MaPhong = dp.MaPhong ORDER BY dp.NgayDat DESC`
      ).all();
  res.json(rows);
});

portalRouter.post('/public/datphong', (req, res) => {
  const { MaPhong, NguoiDat, MaSoSV, Email, NgayDat, KhungGio, MucDich } = req.body ?? {};
  if (!isValidIsoDate(NgayDat)) return res.status(400).json({ error: 'Ngày đặt phòng không hợp lệ.' });
  if (diffDaysIso(NgayDat, todayIsoDate()) < 0) {
    return res.status(400).json({ error: 'Không thể đặt phòng cho ngày trong quá khứ.' });
  }
  const room = db.prepare('SELECT * FROM PHONGHOP WHERE MaPhong = ?').get(MaPhong) as
    | { MaPhong: string; TenPhong: string; TrangThai: string }
    | undefined;
  if (!room) return res.status(404).json({ error: 'Không tìm thấy phòng họp nhóm.' });
  if (room.TrangThai !== 'Sẵn sàng') return res.status(400).json({ error: 'Phòng họp này hiện đang bảo trì.' });
  const conflict = db.prepare(
    `SELECT 1 FROM DATPHONG WHERE TrangThai IN ('Chờ duyệt', 'Đã xác nhận') AND MaPhong = ? AND NgayDat = ? AND KhungGio = ?`
  ).get(MaPhong, NgayDat, KhungGio);
  if (conflict) {
    return res.status(409).json({ error: `${room.TenPhong} đã có nhóm đặt trong khung giờ ${KhungGio} ngày ${NgayDat}.` });
  }
  const maDatPhong = nextCode('DATPHONG', 'MaDatPhong', 'DP');
  db.prepare(
    `INSERT INTO DATPHONG (MaDatPhong, MaPhong, NguoiDat, MaSoSV, Email, NgayDat, KhungGio, MucDich, TrangThai)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Chờ duyệt')`
  ).run(maDatPhong, room.MaPhong, String(NguoiDat || '').trim(), String(MaSoSV || '').trim(), String(Email || '').trim(), NgayDat, KhungGio, String(MucDich || '').trim() || 'Thảo luận nhóm học tập');
  res.status(201).json({
    MaDatPhong: maDatPhong, MaPhong: room.MaPhong, TenPhong: room.TenPhong,
    NguoiDat: String(NguoiDat || '').trim(), MaSoSV: String(MaSoSV || '').trim(),
    Email: String(Email || '').trim(), NgayDat, KhungGio,
    MucDich: String(MucDich || '').trim() || 'Thảo luận nhóm học tập', TrangThai: 'Chờ duyệt',
  });
});

portalRouter.patch('/public/datphong/:id/cancel', (req, res) => {
  const info = db.prepare(`UPDATE DATPHONG SET TrangThai = 'Đã hủy' WHERE MaDatPhong = ?`).run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Không tìm thấy lịch đặt phòng.' });
  res.json({ success: true });
});

portalRouter.patch(
  '/datphong/:id/status',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN'),
  (req: AuthenticatedRequest, res) => {
    const allowed = ['Chờ duyệt', 'Đã xác nhận', 'Đã hủy'];
    const trangThai = String(req.body?.TrangThai || '');
    if (!allowed.includes(trangThai)) {
      return res.status(400).json({ error: 'Trạng thái đặt phòng không hợp lệ.' });
    }
    const info = db
      .prepare('UPDATE DATPHONG SET TrangThai = ? WHERE MaDatPhong = ?')
      .run(trangThai, req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Không tìm thấy lịch đặt phòng.' });
    writeAuditLog({
      MaTaiKhoan: req.user?.MaTaiKhoan ?? null,
      TenDangNhap: req.user?.TenDangNhap ?? 'system',
      VaiTro: req.user?.VaiTro ?? 'LIBRARIAN',
      HanhDong: 'DUYET_DAT_PHONG',
      BangTacDong: 'DATPHONG',
      ChiTiet: `Cập nhật lịch đặt phòng ${req.params.id} → "${trangThai}".`,
    });
    res.json({ success: true, TrangThai: trangThai });
  }
);

portalRouter.get('/public/yeucausach', (_req, res) => {
  res.json(db.prepare('SELECT * FROM YEUCAUTAILIEU ORDER BY NgayGui DESC, MaYeuCau DESC').all());
});

portalRouter.post('/public/yeucausach', (req, res) => {
  const { TenTaiLieu, TacGia, MaNganh, NguoiGui, Email, LyDo } = req.body ?? {};
  if (!String(TenTaiLieu || '').trim() || !String(NguoiGui || '').trim()) {
    return res.status(400).json({ error: 'Vui lòng nhập tên tài liệu và họ tên người yêu cầu.' });
  }
  const maYeuCau = nextCode('YEUCAUTAILIEU', 'MaYeuCau', 'YC');
  const ngayGui = todayIsoDate();
  db.prepare(
    `INSERT INTO YEUCAUTAILIEU (MaYeuCau, TenTaiLieu, TacGia, MaNganh, NguoiGui, Email, LyDo, NgayGui, TrangThai)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Đang tiếp nhận')`
  ).run(maYeuCau, String(TenTaiLieu).trim(), String(TacGia || '').trim() || 'Chưa rõ tác giả', MaNganh || 'CNTT', String(NguoiGui).trim(), String(Email || '').trim(), String(LyDo || '').trim() || 'Phục vụ học tập và nghiên cứu tại UIT', ngayGui);
  res.status(201).json({
    MaYeuCau: maYeuCau, TenTaiLieu: String(TenTaiLieu).trim(), TacGia: String(TacGia || '').trim() || 'Chưa rõ tác giả',
    MaNganh: MaNganh || 'CNTT', NguoiGui: String(NguoiGui).trim(), Email: String(Email || '').trim(),
    LyDo: String(LyDo || '').trim() || 'Phục vụ học tập và nghiên cứu tại UIT', NgayGui: ngayGui, TrangThai: 'Đang tiếp nhận',
  });
});

portalRouter.patch(
  '/yeucausach/:id/status',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN'),
  (req: AuthenticatedRequest, res) => {
    const allowed = ['Đang tiếp nhận', 'Đã duyệt mua', 'Đã bổ sung'];
    const trangThai = String(req.body?.TrangThai || '');
    if (!allowed.includes(trangThai)) {
      return res.status(400).json({ error: 'Trạng thái không hợp lệ.' });
    }
    const info = db
      .prepare('UPDATE YEUCAUTAILIEU SET TrangThai = ? WHERE MaYeuCau = ?')
      .run(trangThai, req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Không tìm thấy yêu cầu.' });
    writeAuditLog({
      MaTaiKhoan: req.user?.MaTaiKhoan ?? null,
      TenDangNhap: req.user?.TenDangNhap ?? 'system',
      VaiTro: req.user?.VaiTro ?? 'LIBRARIAN',
      HanhDong: 'DUYET_YEU_CAU_SACH',
      BangTacDong: 'YEUCAUTAILIEU',
      ChiTiet: `Cập nhật trạng thái yêu cầu ${req.params.id} → "${trangThai}".`,
    });
    res.json({ success: true, TrangThai: trangThai });
  }
);

portalRouter.get('/dattruoc', requireAuth, (req: AuthenticatedRequest, res) => {
  const rows = db.prepare(
    `SELECT dt.*, s.TenSach, dg.HoTen as HoTenDocGia
     FROM DATTRUOC dt JOIN SACH s ON s.MaSach = dt.MaSach JOIN DOCGIA dg ON dg.MaDocGia = dt.MaDocGia
     ${req.user?.VaiTro === 'READER' && req.user.MaDocGia ? 'WHERE dt.MaDocGia = ?' : ''}
     ORDER BY dt.NgayDat DESC, dt.MaDatTruoc DESC`
  ).all(...(req.user?.VaiTro === 'READER' && req.user.MaDocGia ? [req.user.MaDocGia] : []));
  res.json(rows);
});

portalRouter.post('/dattruoc', requireAuth, (req: AuthenticatedRequest, res) => {
  const maSach = String(req.body?.MaSach || '');
  const maDocGia = req.user?.VaiTro === 'READER' && req.user.MaDocGia ? req.user.MaDocGia : String(req.body?.MaDocGia || '');
  const book = db.prepare('SELECT MaSach, TenSach FROM SACH WHERE MaSach = ?').get(maSach) as { MaSach: string; TenSach: string } | undefined;
  if (!book) return res.status(404).json({ error: 'Không tìm thấy đầu sách.' });
  const reader = db.prepare('SELECT MaDocGia, HoTen FROM DOCGIA WHERE MaDocGia = ?').get(maDocGia) as { MaDocGia: string; HoTen: string } | undefined;
  if (!reader) return res.status(404).json({ error: 'Không tìm thấy thẻ độc giả.' });
  const dup = db.prepare(
    `SELECT 1 FROM DATTRUOC WHERE MaSach = ? AND MaDocGia = ? AND TrangThai IN ('Đang chờ', 'Đã giữ chỗ')`
  ).get(maSach, maDocGia);
  if (dup) return res.status(409).json({ error: 'Bạn đã có yêu cầu đặt trước đang hoạt động cho đầu sách này.' });
  const isBorrowed = db.prepare(
    `SELECT 1 FROM CHITIETPHIEUMUON ct LEFT JOIN CHITIETPHIEUTRA tr ON tr.MaChiTietMuon = ct.MaChiTietMuon WHERE ct.MaSach = ? AND tr.MaChiTietTra IS NULL`
  ).get(maSach);
  const trangThai = isBorrowed ? 'Đang chờ' : 'Đã giữ chỗ';
  const maDatTruoc = nextCode('DATTRUOC', 'MaDatTruoc', 'DT');
  const ngayDat = todayIsoDate();
  db.prepare(`INSERT INTO DATTRUOC (MaDatTruoc, MaSach, MaDocGia, NgayDat, TrangThai) VALUES (?, ?, ?, ?, ?)`)
    .run(maDatTruoc, maSach, maDocGia, ngayDat, trangThai);
  writeAuditLog({
    MaTaiKhoan: req.user?.MaTaiKhoan ?? null, TenDangNhap: req.user?.TenDangNhap ?? 'system',
    VaiTro: req.user?.VaiTro ?? 'READER', HanhDong: 'DAT_TRUOC', BangTacDong: 'DATTRUOC',
    ChiTiet: `${reader.HoTen} (${maDocGia}) đặt trước sách ${maSach} (${trangThai}).`,
  });
  res.status(201).json({ MaDatTruoc: maDatTruoc, MaSach: maSach, TenSach: book.TenSach, MaDocGia: maDocGia, HoTenDocGia: reader.HoTen, NgayDat: ngayDat, TrangThai: trangThai });
});

portalRouter.patch('/dattruoc/:id/cancel', requireAuth, (req: AuthenticatedRequest, res) => {
  const info = db.prepare(`UPDATE DATTRUOC SET TrangThai = 'Đã hủy' WHERE MaDatTruoc = ?`).run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Không tìm thấy phiếu đặt trước.' });
  writeAuditLog({
    MaTaiKhoan: req.user?.MaTaiKhoan ?? null, TenDangNhap: req.user?.TenDangNhap ?? 'system',
    VaiTro: req.user?.VaiTro ?? 'READER', HanhDong: 'HUY_DAT_TRUOC', BangTacDong: 'DATTRUOC', ChiTiet: `Hủy đặt trước ${req.params.id}.`,
  });
  res.json({ success: true });
});

portalRouter.post('/phieumuon/renew', requireAuth, (req: AuthenticatedRequest, res) => {
  const maChiTietMuon = Number(req.body?.MaChiTietMuon);
  const ngayGiaHan = typeof req.body?.NgayGiaHan === 'string' ? req.body.NgayGiaHan : todayIsoDate();
  const row = db.prepare(
    `SELECT ct.MaChiTietMuon, ct.MaSach, ct.HanTra, COALESCE(ct.SoLanGiaHan, 0) as SoLanGiaHan,
            pm.MaDocGia, dg.NgayHetHan, tr.MaChiTietTra
     FROM CHITIETPHIEUMUON ct
     JOIN PHIEUMUON pm ON pm.MaPhieuMuon = ct.MaPhieuMuon
     JOIN DOCGIA dg ON dg.MaDocGia = pm.MaDocGia
     LEFT JOIN CHITIETPHIEUTRA tr ON tr.MaChiTietMuon = ct.MaChiTietMuon
     WHERE ct.MaChiTietMuon = ?`
  ).get(maChiTietMuon) as { MaChiTietMuon: number; MaSach: string; HanTra: string; SoLanGiaHan: number; MaDocGia: string; NgayHetHan: string; MaChiTietTra: number | null } | undefined;
  if (!row) return res.status(404).json({ error: 'Không tìm thấy chi tiết phiếu mượn.' });
  if (req.user?.VaiTro === 'READER' && req.user.MaDocGia !== row.MaDocGia) {
    return res.status(403).json({ error: 'Bạn chỉ có thể gia hạn sách của chính mình.' });
  }
  const thamSo = db.prepare('SELECT * FROM THAMSO WHERE MaThamSo = 1').get() as any;
  const check = validateLoanRenewal({
    today: ngayGiaHan, hanTra: row.HanTra, ngayHetHanThe: row.NgayHetHan,
    daTra: Boolean(row.MaChiTietTra), soLanGiaHan: row.SoLanGiaHan,
    soNgayMuonToiDa: thamSo.SoNgayMuonToiDa,
  });
  if (!check.valid || !check.newHanTra) return res.status(400).json({ error: check.error });
  const soLanMoi = row.SoLanGiaHan + 1;
  db.prepare('UPDATE CHITIETPHIEUMUON SET HanTra = ?, SoLanGiaHan = ? WHERE MaChiTietMuon = ?')
    .run(check.newHanTra, soLanMoi, maChiTietMuon);
  res.json({ MaChiTietMuon: maChiTietMuon, HanTraMoi: check.newHanTra, SoLanGiaHan: soLanMoi });
});

portalRouter.get('/reader/profile', requireAuth, (req: AuthenticatedRequest, res) => {
  const maDocGia = req.user?.MaDocGia || (db.prepare('SELECT MaDocGia FROM DOCGIA LIMIT 1').get() as { MaDocGia?: string } | undefined)?.MaDocGia;
  const docGia = maDocGia ? db.prepare('SELECT d.*, l.TenLoaiDocGia FROM DOCGIA d JOIN LOAIDOCGIA l ON l.MaLoaiDocGia = d.MaLoaiDocGia WHERE d.MaDocGia = ?').get(maDocGia) : null;
  const lichSuMuon = maDocGia ? db.prepare(
    `SELECT ct.MaChiTietMuon, ct.MaPhieuMuon, ct.MaSach, s.TenSach, pm.NgayMuon, ct.HanTra,
            pt.NgayTra, tr.TienPhat, CASE WHEN tr.MaChiTietTra IS NOT NULL THEN 1 ELSE 0 END as DaTra,
            COALESCE(ct.SoLanGiaHan, 0) as SoLanGiaHan
     FROM CHITIETPHIEUMUON ct
     JOIN PHIEUMUON pm ON pm.MaPhieuMuon = ct.MaPhieuMuon
     JOIN SACH s ON s.MaSach = ct.MaSach
     LEFT JOIN CHITIETPHIEUTRA tr ON tr.MaChiTietMuon = ct.MaChiTietMuon
     LEFT JOIN PHIEUTRA pt ON pt.MaPhieuTra = tr.MaPhieuTra
     WHERE pm.MaDocGia = ? ORDER BY pm.NgayMuon DESC`
  ).all(maDocGia).map((r: any) => ({ ...r, DaTra: Boolean(r.DaTra) })) : [];
  const phieuThuPhat = maDocGia ? db.prepare('SELECT * FROM PHIEUTHUTIENPHAT WHERE MaDocGia = ? ORDER BY NgayThu DESC').all(maDocGia) : [];
  const thamSo = db.prepare('SELECT * FROM THAMSO WHERE MaThamSo = 1').get();
  res.json({ docGia, lichSuMuon, phieuThuPhat, thamSo });
});

portalRouter.get('/dashboard/summary', requireAuth, requireRole('ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN'), (_req, res) => {
  const today = todayIsoDate();
  const tongSach = (db.prepare('SELECT COUNT(*) as c FROM SACH').get() as { c: number }).c;
  const sachDangMuon = (db.prepare('SELECT COUNT(DISTINCT ct.MaSach) as c FROM CHITIETPHIEUMUON ct LEFT JOIN CHITIETPHIEUTRA tr ON tr.MaChiTietMuon = ct.MaChiTietMuon WHERE tr.MaChiTietTra IS NULL').get() as { c: number }).c;
  const readers = db.prepare('SELECT MaDocGia, NgayHetHan, TongNo FROM DOCGIA').all() as Array<{ MaDocGia: string; NgayHetHan: string; TongNo: number }>;
  const sachQuaHan = (db.prepare('SELECT COUNT(*) as c FROM CHITIETPHIEUMUON ct LEFT JOIN CHITIETPHIEUTRA tr ON tr.MaChiTietMuon = ct.MaChiTietMuon WHERE tr.MaChiTietTra IS NULL AND ct.HanTra < ?').get(today) as { c: number }).c;
  const luotMuonThangNay = (db.prepare('SELECT COUNT(*) as c FROM CHITIETPHIEUMUON ct JOIN PHIEUMUON pm ON pm.MaPhieuMuon = ct.MaPhieuMuon WHERE pm.NgayMuon LIKE ?').get(`${today.slice(0, 7)}%`) as { c: number }).c;
  const catRaw = db.prepare('SELECT tl.MaTheLoai, tl.TenTheLoai, COUNT(ct.MaChiTietMuon) as SoLuotMuon FROM THELOAI tl LEFT JOIN SACH s ON s.MaTheLoai = tl.MaTheLoai LEFT JOIN CHITIETPHIEUMUON ct ON ct.MaSach = s.MaSach GROUP BY tl.MaTheLoai').all() as Array<{ MaTheLoai: string; TenTheLoai: string; SoLuotMuon: number }>;
  const nowDt = new Date();
  const xuHuongMuon6Thang = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(nowDt.getFullYear(), nowDt.getMonth() - (5 - i), 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    return {
      thang: `T${d.getMonth() + 1}/${String(d.getFullYear()).slice(-2)}`,
      soLuotMuon: (db.prepare('SELECT COUNT(*) as c FROM CHITIETPHIEUMUON ct JOIN PHIEUMUON pm ON pm.MaPhieuMuon = ct.MaPhieuMuon WHERE pm.NgayMuon LIKE ?').get(`${ym}%`) as { c: number }).c,
      soLuotTra: (db.prepare('SELECT COUNT(*) as c FROM CHITIETPHIEUTRA tr JOIN PHIEUTRA pt ON pt.MaPhieuTra = tr.MaPhieuTra WHERE pt.NgayTra LIKE ?').get(`${ym}%`) as { c: number }).c,
    };
  });
  const recentLoans = db.prepare(
    `SELECT 'MUON' as loai, pm.MaPhieuMuon as maPhieu, dg.HoTen as tenDocGia, pm.NgayMuon as ngay,
            ('Mượn ' || (SELECT COUNT(*) FROM CHITIETPHIEUMUON c WHERE c.MaPhieuMuon = pm.MaPhieuMuon) || ' quyển sách') as moTa
     FROM PHIEUMUON pm JOIN DOCGIA dg ON dg.MaDocGia = pm.MaDocGia
     ORDER BY pm.NgayMuon DESC, pm.MaPhieuMuon DESC LIMIT 5`
  ).all() as Array<{ loai: 'MUON'; maPhieu: string; tenDocGia: string; ngay: string; moTa: string }>;
  const recentReturns = db.prepare(
    `SELECT 'TRA' as loai, pt.MaPhieuTra as maPhieu, dg.HoTen as tenDocGia, pt.NgayTra as ngay,
            ('Trả sách · Phạt ' || CAST(ROUND(pt.TongTienPhat) AS INTEGER) || ' đ') as moTa
     FROM PHIEUTRA pt JOIN DOCGIA dg ON dg.MaDocGia = pt.MaDocGia
     ORDER BY pt.NgayTra DESC, pt.MaPhieuTra DESC LIMIT 5`
  ).all() as Array<{ loai: 'TRA'; maPhieu: string; tenDocGia: string; ngay: string; moTa: string }>;
  const recentFines = db.prepare(
    `SELECT 'THU_PHAT' as loai, p.MaPhieuThu as maPhieu, dg.HoTen as tenDocGia, p.NgayThu as ngay,
            ('Thu ' || CAST(ROUND(p.SoTienThu) AS INTEGER) || ' đ · Còn nợ ' || CAST(ROUND(p.ConLai) AS INTEGER) || ' đ') as moTa
     FROM PHIEUTHUTIENPHAT p JOIN DOCGIA dg ON dg.MaDocGia = p.MaDocGia
     ORDER BY p.NgayThu DESC, p.MaPhieuThu DESC LIMIT 5`
  ).all() as Array<{ loai: 'THU_PHAT'; maPhieu: string; tenDocGia: string; ngay: string; moTa: string }>;
  const giaoDichGanDay = [...recentLoans, ...recentReturns, ...recentFines]
    .sort((a, b) => b.ngay.localeCompare(a.ngay))
    .slice(0, 8);

  res.json({
    tongSach, sachCoSan: tongSach - sachDangMuon, sachDangMuon, tongDocGia: readers.length,
    docGiaConHan: readers.filter((r) => diffDaysIso(r.NgayHetHan, today) >= 0).length,
    sachQuaHan, tongNoHienHanh: readers.reduce((s, r) => s + r.TongNo, 0), luotMuonThangNay,
    muonTheoTheLoai: computeCategoryReportPercentages(catRaw).rows, xuHuongMuon6Thang, giaoDichGanDay,
  });
});

/* ===========================
 * PORTAL NEWS & EVENTS CRUD (ADMIN & HEAD_LIBRARIAN)
 * =========================== */

portalRouter.get('/public/tintuc', (_req, res) => {
  const rows = db.prepare('SELECT * FROM PORTAL_TINTUC ORDER BY rowid DESC').all();
  res.json(rows);
});

portalRouter.get('/public/nganhhoc', (_req, res) => {
  const rows = db.prepare('SELECT * FROM NGANHHOC ORDER BY rowid ASC').all() as Array<any>;
  res.json(
    rows.map((r) => ({
      MaNganh: r.MaNganh,
      TenNganh: r.TenNganh,
      Khoa: r.Khoa,
      BacDaoTao: r.BacDaoTao ?? undefined,
      MauSac: r.MauSac ?? undefined,
      Icon: r.Icon ?? undefined,
      HinhAnh: r.HinhAnh ?? undefined,
      ChuongTrinh: JSON.parse(r.ChuongTrinhJson || '[]'),
      MoTaNgan: r.MoTaNgan,
    }))
  );
});

portalRouter.get('/public/tusach', (_req, res) => {
  const rows = db.prepare('SELECT * FROM TUSACH_CHUYENDE ORDER BY rowid ASC').all();
  res.json(rows);
});

portalRouter.get('/public/portal-bundle', (_req, res) => {
  const majorRows = db.prepare('SELECT * FROM NGANHHOC ORDER BY rowid ASC').all() as Array<any>;
  const majors = majorRows.map((r) => ({
    MaNganh: r.MaNganh,
    TenNganh: r.TenNganh,
    Khoa: r.Khoa,
    BacDaoTao: r.BacDaoTao ?? undefined,
    MauSac: r.MauSac ?? undefined,
    Icon: r.Icon ?? undefined,
    HinhAnh: r.HinhAnh ?? undefined,
    ChuongTrinh: JSON.parse(r.ChuongTrinhJson || '[]'),
    MoTaNgan: r.MoTaNgan,
  }));
  const news = db.prepare('SELECT * FROM PORTAL_TINTUC ORDER BY rowid DESC').all();
  const shelves = db.prepare('SELECT * FROM TUSACH_CHUYENDE ORDER BY rowid ASC').all();
  const cfgRow = db.prepare("SELECT valueJson FROM PORTAL_META WHERE key = 'config'").get() as { valueJson: string } | undefined;
  const guideRow = db.prepare("SELECT valueJson FROM PORTAL_META WHERE key = 'guide'").get() as { valueJson: string } | undefined;
  res.json({
    majors,
    news,
    shelves,
    config: cfgRow ? JSON.parse(cfgRow.valueJson) : null,
    guide: guideRow ? JSON.parse(guideRow.valueJson) : null,
  });
});

portalRouter.post(
  '/tintuc',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN'),
  (req: AuthenticatedRequest, res) => {
    const { tieuDe, ngayDang, chuyenMuc, hinhAnh, duongDan, tomTat } = req.body ?? {};
    if (!tieuDe || String(tieuDe).trim().length < 4) {
      return res.status(400).json({ error: 'Tiêu đề bài viết phải có ít nhất 4 ký tự.' });
    }
    if (!tomTat || String(tomTat).trim().length < 6) {
      return res.status(400).json({ error: 'Tóm tắt bài viết phải có ít nhất 6 ký tự.' });
    }
    const id = `news-${Date.now()}`;
    const todayParts = todayIsoDate().split('-');
    const defaultDate = `${todayParts[2]}/${todayParts[1]}/${todayParts[0]}`;
    const finalDate = String(ngayDang || '').trim() || defaultDate;
    const cat = String(chuyenMuc || '').trim() || 'Tin hoạt động';
    const img = hinhAnh ? String(hinhAnh).trim() : null;
    const link = duongDan ? String(duongDan).trim() : null;

    db.prepare(
      `INSERT INTO PORTAL_TINTUC (id, tieuDe, ngayDang, chuyenMuc, hinhAnh, duongDan, tomTat)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(id, String(tieuDe).trim(), finalDate, cat, img, link, String(tomTat).trim());

    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'DANG_TIN_TUC',
      BangTacDong: 'PORTAL_TINTUC',
      ChiTiet: `Đăng bài "${String(tieuDe).trim()}" (${cat}).`,
    });

    res.status(201).json(db.prepare('SELECT * FROM PORTAL_TINTUC WHERE id = ?').get(id));
  }
);

portalRouter.put(
  '/tintuc/:id',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN'),
  (req: AuthenticatedRequest, res) => {
    const existing = db.prepare('SELECT * FROM PORTAL_TINTUC WHERE id = ?').get(req.params.id) as any;
    if (!existing) return res.status(404).json({ error: 'Không tìm thấy bài đăng.' });

    const { tieuDe, ngayDang, chuyenMuc, hinhAnh, duongDan, tomTat } = req.body ?? {};
    const nextTitle = tieuDe !== undefined ? String(tieuDe).trim() : existing.tieuDe;
    const nextSummary = tomTat !== undefined ? String(tomTat).trim() : existing.tomTat;
    if (nextTitle.length < 4 || nextSummary.length < 6) {
      return res.status(400).json({ error: 'Tiêu đề hoặc tóm tắt bài viết quá ngắn.' });
    }

    db.prepare(
      `UPDATE PORTAL_TINTUC
       SET tieuDe = ?, ngayDang = ?, chuyenMuc = ?, hinhAnh = ?, duongDan = ?, tomTat = ?
       WHERE id = ?`
    ).run(
      nextTitle,
      ngayDang !== undefined ? String(ngayDang).trim() : existing.ngayDang,
      chuyenMuc !== undefined ? String(chuyenMuc).trim() : existing.chuyenMuc,
      hinhAnh !== undefined ? (String(hinhAnh).trim() || null) : existing.hinhAnh,
      duongDan !== undefined ? (String(duongDan).trim() || null) : existing.duongDan,
      nextSummary,
      req.params.id
    );

    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'CAP_NHAT_TIN_TUC',
      BangTacDong: 'PORTAL_TINTUC',
      ChiTiet: `Cập nhật bài viết ${req.params.id}: "${nextTitle}".`,
    });

    res.json(db.prepare('SELECT * FROM PORTAL_TINTUC WHERE id = ?').get(req.params.id));
  }
);

portalRouter.delete(
  '/tintuc/:id',
  requireAuth,
  requireRole('ADMIN', 'HEAD_LIBRARIAN'),
  (req: AuthenticatedRequest, res) => {
    const existing = db.prepare('SELECT * FROM PORTAL_TINTUC WHERE id = ?').get(req.params.id) as any;
    if (!existing) return res.status(404).json({ error: 'Không tìm thấy bài đăng.' });

    db.prepare('DELETE FROM PORTAL_TINTUC WHERE id = ?').run(req.params.id);
    writeAuditLog({
      MaTaiKhoan: req.user!.MaTaiKhoan,
      TenDangNhap: req.user!.TenDangNhap,
      VaiTro: req.user!.VaiTro,
      HanhDong: 'XOA_TIN_TUC',
      BangTacDong: 'PORTAL_TINTUC',
      ChiTiet: `Xóa bài viết "${existing.tieuDe}".`,
    });
    res.json({ success: true });
  }
);
