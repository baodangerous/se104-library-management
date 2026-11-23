import assert from 'node:assert/strict';
import test from 'node:test';

const BASE = process.env.TEST_API_BASE || 'http://localhost:3000/api';

async function api<T = any>(
  path: string,
  options: { method?: string; token?: string; body?: unknown } = {}
): Promise<{ status: number; data: T }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  const res = await fetch(`${BASE}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  return { status: res.status, data };
}

async function demoLogin(role: 'ADMIN' | 'HEAD_LIBRARIAN' | 'LIBRARIAN' | 'READER') {
  const { status, data } = await api<{ token: string; user: any }>('/auth/demo-login', {
    method: 'POST',
    body: { role },
  });
  assert.equal(status, 200, `Demo login ${role} failed`);
  return data;
}

test('RBAC: 4 roles enforce strict module & hierarchy boundaries', async () => {
  const admin = await demoLogin('ADMIN');
  const head = await demoLogin('HEAD_LIBRARIAN');
  const lib = await demoLogin('LIBRARIAN');
  const reader = await demoLogin('READER');

  // 1. ADMIN sees all 4 roles and can access backup
  const adminAcc = await api<any[]>('/taikhoan', { token: admin.token });
  assert.equal(adminAcc.status, 200);
  const adminRoles = new Set(adminAcc.data.map((a) => a.VaiTro));
  assert.ok(adminRoles.has('ADMIN'));
  assert.ok(adminRoles.has('HEAD_LIBRARIAN'));
  assert.ok(adminRoles.has('LIBRARIAN'));
  assert.ok(adminRoles.has('READER'));

  const adminBackup = await api('/hethong/backup', { token: admin.token });
  assert.equal(adminBackup.status, 200);

  // 2. HEAD_LIBRARIAN sees only LIBRARIAN & READER, cannot touch ADMIN/HEAD or backup
  const headAcc = await api<any[]>('/taikhoan', { token: head.token });
  assert.equal(headAcc.status, 200);
  assert.ok(headAcc.data.every((a) => a.VaiTro === 'LIBRARIAN' || a.VaiTro === 'READER'));

  const headCreateAdmin = await api('/taikhoan', {
    method: 'POST',
    token: head.token,
    body: {
      TenDangNhap: `unauth_admin_${Date.now()}`,
      MatKhau: 'TestPass123',
      HoTen: 'Unauthorized Admin',
      VaiTro: 'ADMIN',
    },
  });
  assert.equal(headCreateAdmin.status, 403);

  const headBackup = await api('/hethong/backup', { token: head.token });
  assert.equal(headBackup.status, 403);

  const headAudit = await api('/nhatky?limit=10', { token: head.token });
  assert.equal(headAudit.status, 200);

  // 3. LIBRARIAN cannot access accounts, audit, regulations, news CUD, or delete books
  assert.equal((await api('/taikhoan', { token: lib.token })).status, 403);
  assert.equal((await api('/nhatky', { token: lib.token })).status, 403);
  assert.equal(
    (await api('/tintuc', { method: 'POST', token: lib.token, body: { tieuDe: 'Test', tomTat: 'Test 123' } }))
      .status,
    403
  );
  assert.equal((await api('/sach/S001', { method: 'DELETE', token: lib.token })).status, 403);

  // 4. READER is blocked from all staff/admin endpoints
  assert.equal((await api('/docgia', { token: reader.token })).status, 403);
  assert.equal((await api('/taikhoan', { token: reader.token })).status, 403);
  assert.equal(
    (await api('/sach', { method: 'POST', token: reader.token, body: {} })).status,
    403
  );
  assert.equal((await api('/reader/profile', { token: reader.token })).status, 200);
});

test('DB Sync: SACH <-> TACGIA <-> SACH_TACGIA & delete guard', async () => {
  const head = await demoLogin('HEAD_LIBRARIAN');
  const lib = await demoLogin('LIBRARIAN');
  const uniqueAuthor = `Tác giả Test ${Date.now()}`;

  // LIBRARIAN creates book with new author
  const createdBook = await api<any>('/sach', {
    method: 'POST',
    token: lib.token,
    body: {
      TenSach: `Sách Kiểm Thử Đồng Bộ ${Date.now()}`,
      MaTheLoai: 'A',
      NamXuatBan: 2026,
      NhaXuatBan: 'NXB ĐHQG-HCM',
      TriGia: 150000,
      TacGiaList: [uniqueAuthor],
    },
  });
  assert.equal(createdBook.status, 201);
  const maSach = createdBook.data.MaSach;

  // Verify author appears in /tacgia with SoLuongSach = 1
  const authors = await api<any[]>('/tacgia', { token: lib.token });
  const authorRow = authors.data.find((a) => a.TenTacGia === uniqueAuthor);
  assert.ok(authorRow, 'Author must be synced into TACGIA');
  assert.equal(authorRow.SoLuongSach, 1);

  // LIBRARIAN cannot edit or delete author (403)
  assert.equal(
    (await api(`/tacgia/${authorRow.MaTacGia}`, { method: 'DELETE', token: lib.token })).status,
    403
  );

  // HEAD_LIBRARIAN cannot delete author while still linked to a book (400)
  assert.equal(
    (await api(`/tacgia/${authorRow.MaTacGia}`, { method: 'DELETE', token: head.token })).status,
    400
  );

  // HEAD_LIBRARIAN deletes book -> then deletes author cleanly
  assert.equal((await api(`/sach/${maSach}`, { method: 'DELETE', token: head.token })).status, 200);
  assert.equal(
    (await api(`/tacgia/${authorRow.MaTacGia}`, { method: 'DELETE', token: head.token })).status,
    200
  );
});

test('DB Sync: PORTAL_TINTUC <-> public portal-bundle <-> audit log', async () => {
  const head = await demoLogin('HEAD_LIBRARIAN');
  const title = `Tin kiểm thử đồng bộ ${Date.now()}`;

  const created = await api<any>('/tintuc', {
    method: 'POST',
    token: head.token,
    body: {
      tieuDe: title,
      chuyenMuc: 'Sự kiện UIT',
      ngayDang: '23/11/2026',
      tomTat: 'Nội dung kiểm thử đồng bộ giữa trang quản trị và Portal.',
    },
  });
  assert.equal(created.status, 201);
  const newsId = created.data.id;

  // Appears in public portal-bundle
  const bundle = await api<any>('/public/portal-bundle');
  assert.equal(bundle.status, 200);
  assert.ok(bundle.data.news.some((n: any) => n.id === newsId && n.tieuDe === title));

  // Appears in audit log
  const audit = await api<any[]>('/nhatky?limit=10', { token: head.token });
  assert.ok(audit.data.some((log) => log.HanhDong === 'DANG_TIN_TUC' && log.ChiTiet.includes(title)));

  // Update & delete cleanly
  const updated = await api<any>(`/tintuc/${newsId}`, {
    method: 'PUT',
    token: head.token,
    body: { tieuDe: `${title} (Đã sửa)` },
  });
  assert.equal(updated.status, 200);
  assert.equal(updated.data.tieuDe, `${title} (Đã sửa)`);

  assert.equal((await api(`/tintuc/${newsId}`, { method: 'DELETE', token: head.token })).status, 200);
  const afterDel = await api<any[]>('/public/tintuc');
  assert.ok(!afterDel.data.some((n) => n.id === newsId));
});

test('DB Sync: HEAD_LIBRARIAN creates READER account -> login -> lock -> delete', async () => {
  const head = await demoLogin('HEAD_LIBRARIAN');
  const readers = await api<any[]>('/docgia', { token: head.token });
  assert.ok(readers.data.length > 0);
  const targetReader = readers.data[0];

  const username = `sv_test_${Date.now()}@gm.uit.edu.vn`;
  const password = 'UitTestPassword!1';

  const created = await api<any>('/taikhoan', {
    method: 'POST',
    token: head.token,
    body: {
      TenDangNhap: username,
      MatKhau: password,
      HoTen: 'Sinh viên Test Đồng Bộ',
      VaiTro: 'READER',
      MaDocGia: targetReader.MaDocGia,
    },
  });
  assert.equal(created.status, 201);
  const accId = created.data.MaTaiKhoan;

  // Login with newly created account & check /reader/profile sync
  const loginRes = await api<{ token: string; user: any }>('/auth/login', {
    method: 'POST',
    body: { TenDangNhap: username, MatKhau: password },
  });
  assert.equal(loginRes.status, 200);
  assert.equal(loginRes.data.user.MaDocGia, targetReader.MaDocGia);

  const profileRes = await api<any>('/reader/profile', { token: loginRes.data.token });
  assert.equal(profileRes.status, 200);
  assert.equal(profileRes.data.docGia.MaDocGia, targetReader.MaDocGia);

  // Lock account -> login must fail with 403
  const lockRes = await api<any>(`/taikhoan/${accId}`, {
    method: 'PUT',
    token: head.token,
    body: { TrangThai: 'LOCKED' },
  });
  assert.equal(lockRes.status, 200);
  assert.equal(lockRes.data.TrangThai, 'LOCKED');

  const lockedLogin = await api('/auth/login', {
    method: 'POST',
    body: { TenDangNhap: username, MatKhau: password },
  });
  assert.equal(lockedLogin.status, 403);

  // Cleanup account
  assert.equal((await api(`/taikhoan/${accId}`, { method: 'DELETE', token: head.token })).status, 200);
});

test('DB Sync: Borrow & Return updates SACH.TinhTrang in real time', async () => {
  const head = await demoLogin('HEAD_LIBRARIAN');
  const lib = await demoLogin('LIBRARIAN');

  // Create isolated test book so we never mutate seeded circulation history
  const bookRes = await api<any>('/sach', {
    method: 'POST',
    token: lib.token,
    body: {
      TenSach: `Sách Test Mượn Trả ${Date.now()}`,
      MaTheLoai: 'A',
      NamXuatBan: 2026,
      NhaXuatBan: 'NXB ĐHQG-HCM',
      TriGia: 100000,
      TacGiaList: ['Nguyễn Văn Test'],
    },
  });
  assert.equal(bookRes.status, 201);
  const maSach = bookRes.data.MaSach;
  assert.equal(bookRes.data.TinhTrang, 'Có sẵn');

  // Find an active reader with no overdue / low active loans
  const readers = await api<any[]>('/docgia', { token: lib.token });
  const activeReader = readers.data.find((r) => (r.SoSachDangMuon ?? 0) === 0 && (r.TongNo ?? 0) === 0) || readers.data[0];

  const today = new Date().toISOString().slice(0, 10);
  const loanRes = await api<any>('/phieumuon', {
    method: 'POST',
    token: lib.token,
    body: {
      MaDocGia: activeReader.MaDocGia,
      NgayMuon: today,
      MaSachList: [maSach],
    },
  });
  assert.equal(loanRes.status, 201);

  // Verify book status changed to 'Đang mượn'
  const pubDuring = await api<any[]>(`/public/sach?q=${encodeURIComponent(maSach)}`);
  assert.equal(pubDuring.data.find((b) => b.MaSach === maSach)?.TinhTrang, 'Đang mượn');

  // Return the book
  const activeItems = await api<any[]>(`/docgia/${activeReader.MaDocGia}/dang-muon`, {
    token: lib.token,
  });
  const loanItem = activeItems.data.find((i) => i.MaSach === maSach);
  assert.ok(loanItem, 'Borrowed item must appear in dang-muon list');

  const returnRes = await api<any>('/phieutra', {
    method: 'POST',
    token: lib.token,
    body: {
      MaDocGia: activeReader.MaDocGia,
      NgayTra: today,
      MaChiTietMuonList: [loanItem.MaChiTietMuon],
    },
  });
  assert.equal(returnRes.status, 201);

  // Verify book status returned to 'Có sẵn'
  const pubAfter = await api<any[]>(`/public/sach?q=${encodeURIComponent(maSach)}`);
  assert.equal(pubAfter.data.find((b) => b.MaSach === maSach)?.TinhTrang, 'Có sẵn');

  // Note: book has loan history so DELETE /sach/:id correctly protects audit integrity (400)
  const delAttempt = await api(`/sach/${maSach}`, { method: 'DELETE', token: head.token });
  assert.equal(delAttempt.status, 400);
});
