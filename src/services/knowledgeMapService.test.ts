import assert from 'node:assert/strict';
import test from 'node:test';
import { bookService } from './bookService';
import { circulationService } from './circulationService';
import { buildKnowledgeGraph } from './knowledgeMapService';
import { removeVietnameseTones } from './rules/searchUtils';
import { serviceRequestService } from './serviceRequestService';
import { resetDb } from './storage';

test('Vietnamese diacritic-insensitive search matches accented titles from ASCII queries', async () => {
  resetDb();
  assert.equal(removeVietnameseTones('Trí tuệ Nhân tạo & Đô thị'), 'tri tue nhan tao & do thi');
  const found = await bookService.listPublic({ q: 'tri tue nhan tao' });
  assert.ok(found.some((b) => b.MaSach === 'S008'));
  const sec = await bookService.listPublic({ q: 'comptia security' });
  assert.ok(sec.some((b) => b.MaSach === 'S001'));
});

test('KnowledgeMap connects UIT Majors, Categories, Books, and Authors cleanly', async () => {
  resetDb();
  const books = await bookService.listPublic();
  const categories = await bookService.listPublicCategories();
  const full = buildKnowledgeGraph(books, categories);

  assert.ok(full.nodes.some((n) => n.id === 'MAJOR:ATTT'));
  assert.ok(full.nodes.some((n) => n.id === 'BOOK:S001'));
  assert.ok(full.nodes.some((n) => n.id === 'CAT:B'));
  assert.ok(full.nodes.some((n) => n.id === 'AUTHOR:Mike Chapple'));
  assert.ok(full.links.some((l) => l.source === 'MAJOR:ATTT' && l.target === 'BOOK:S001'));

  const filtered = buildKnowledgeGraph(books, categories, { majorFilter: 'ATTT' });
  assert.ok(filtered.nodes.filter((n) => n.type === 'MAJOR').every((n) => n.id === 'MAJOR:ATTT'));
});

test('ServiceRequestService books study rooms and prevents double-booking same slot', async () => {
  resetDb();
  const booking = await serviceRequestService.createRoomBooking({
    MaPhong: 'P202',
    NguoiDat: 'Trần Văn Bình',
    MaSoSV: '22520999',
    Email: '22520999@gm.uit.edu.vn',
    NgayDat: '2026-12-01',
    KhungGio: '08:00 – 10:00',
    MucDich: 'Học nhóm Thiết kế Vi mạch',
  });
  assert.equal(booking.TrangThai, 'Đã xác nhận');

  await assert.rejects(
    () =>
      serviceRequestService.createRoomBooking({
        MaPhong: 'P202',
        NguoiDat: 'Người khác',
        MaSoSV: '22520888',
        Email: '22520888@gm.uit.edu.vn',
        NgayDat: '2026-12-01',
        KhungGio: '08:00 – 10:00',
        MucDich: 'Trùng giờ',
      }),
    /đã có nhóm đặt/
  );
});

test('CirculationService enforces borrow rules, dynamic book status, return fine, and fine payment', async () => {
  resetDb();
  const loan = await circulationService.createLoan({
    MaDocGia: 'DG002',
    NgayMuon: '2026-11-21',
    MaSachList: ['S002'],
  });
  assert.equal(loan.HanTra, '2026-11-25');

  const booksAfterLoan = await bookService.listPublic({ q: 'Learning DevOps' });
  assert.equal(booksAfterLoan[0]?.TinhTrang, 'Đang mượn');

  const active = await circulationService.listReaderActiveLoans('DG002');
  const ret = await circulationService.createReturn({
    MaDocGia: 'DG002',
    NgayTra: '2026-11-28',
    MaChiTietMuonList: [active[0].MaChiTietMuon],
  });
  assert.equal(ret.TongTienPhat, 3000);
  assert.equal(ret.TongNoMoi, 3000);

  const receipt = await circulationService.createFineReceipt({
    MaDocGia: 'DG002',
    NgayThu: '2026-11-28',
    SoTienThu: 2000,
  });
  assert.equal(receipt.ConLai, 1000);
});
