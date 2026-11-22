import assert from 'node:assert/strict';
import test from 'node:test';
import { bookService } from '../../services/bookService';
import { serviceRequestService } from '../../services/serviceRequestService';
import { settingsService } from '../../services/settingsService';
import { resetDb } from '../../database/dbEngine';
import { buildLocalBotReply } from './libBotEngine';

test('UIT LibBot: diacritic-insensitive major search returns real ATTT books', async () => {
  resetDb();
  const [books, params, rooms] = await Promise.all([
    bookService.listPublic(),
    settingsService.getParams(),
    serviceRequestService.listRooms(),
  ]);

  const reply = buildLocalBotReply('Tim sach an toan thong tin', { books, params, rooms });
  assert.equal(reply.intent, 'BOOK_SEARCH');
  assert.ok(reply.books.length >= 3);
  assert.ok(reply.books.every((b) => b.MaNganh === 'ATTT'));
  assert.ok(reply.books.some((b) => b.TenSach.includes('CompTIA Security+')));
});

test('UIT LibBot: reads live THAMSO dynamically when Admin changes regulations', async () => {
  resetDb();
  await settingsService.updateParams({
    TuoiToiThieu: 17,
    TuoiToiDa: 60,
    ThoiHanThe: 12,
    KhoangCachNamXuatBan: 10,
    SoSachMuonToiDa: 8,
    SoNgayMuonToiDa: 14,
  });

  const [books, params, rooms] = await Promise.all([
    bookService.listPublic(),
    settingsService.getParams(),
    serviceRequestService.listRooms(),
  ]);

  const reply = buildLocalBotReply('Quy dinh muon toi da may cuon va phat tre han bao nhieu?', {
    books,
    params,
    rooms,
  });
  assert.equal(reply.intent, 'REGULATIONS');
  assert.match(reply.text, /8 quyển/);
  assert.match(reply.text, /14 ngày/);
  assert.match(reply.text, /17 đến 60 tuổi/);
  assert.match(reply.text, /12 tháng/);
  assert.match(reply.text, /1\.000đ/);
});

test('UIT LibBot: available books query returns only currently available books', async () => {
  resetDb();
  const [books, params, rooms] = await Promise.all([
    bookService.listPublic(),
    settingsService.getParams(),
    serviceRequestService.listRooms(),
  ]);

  const reply = buildLocalBotReply('Sách nào đang có sẵn?', { books, params, rooms });
  assert.equal(reply.intent, 'AVAILABLE_BOOKS');
  assert.ok(reply.books.length > 0);
  assert.ok(reply.books.every((b) => b.TinhTrang === 'Có sẵn'));
});

test('UIT LibBot: hours and services query returns UIT hours and Services shortcut', async () => {
  resetDb();
  const [books, params, rooms] = await Promise.all([
    bookService.listPublic(),
    settingsService.getParams(),
    serviceRequestService.listRooms(),
  ]);

  const reply = buildLocalBotReply('Gio mo cua thu vien va dat phong hop nhom', {
    books,
    params,
    rooms,
  });
  assert.ok(reply.intent === 'HOURS' || reply.intent === 'SERVICES');
  assert.match(reply.text, /07:30 – 18:00/);
  assert.match(reply.text, /\(028\) 372 51993/);
  assert.ok(reply.actions.some((a) => a.targetTab === 'services'));
});
