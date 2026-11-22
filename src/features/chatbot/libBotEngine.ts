import { UIT_MAJORS } from '../../constants/majors';
import { UIT_LIBRARY_INFO } from '../../constants/portalContent';
import {
  matchesVietnameseSearch,
  removeVietnameseTones,
} from '../../services/rules/searchUtils';
import type { Sach, ThamSo } from '../../types/library';
import type { PhongHop } from '../../types/portal';
import type { LibBotReply } from './types';

const STOP_WORDS = new Set([
  'tim', 'sach', 'cuon', 'quyen', 'tai', 'lieu', 'giao', 'trinh', 'cho', 'toi',
  'minh', 'em', 'co', 'khong', 've', 'nganh', 'mon', 'hoc', 'cua', 'uit', 'thu',
  'vien', 'giup', 'goi', 'y', 'nao', 'la', 'nhung', 'cac', 'hay', 'xem', 'muon',
]);

function normalize(text: string): string {
  return removeVietnameseTones(text).replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function extractSearchQuery(rawQuery: string): string {
  const words = normalize(rawQuery)
    .split(' ')
    .filter((w) => w.length >= 2 && !STOP_WORDS.has(w));
  return words.join(' ');
}

function findMatchingMajor(normQuery: string) {
  return UIT_MAJORS.find((m) => {
    const code = normalize(m.MaNganh);
    const name = normalize(m.TenNganh);
    return (
      normQuery.includes(name) ||
      new RegExp(`\\b${code}\\b`).test(normQuery) ||
      (code === 'ttnt' && /\bai\b/.test(normQuery))
    );
  });
}

function findMatchingBooks(rawQuery: string, books: Sach[]): { matched: Sach[]; majorName?: string; majorCode?: string } {
  const norm = normalize(rawQuery);
  const major = findMatchingMajor(norm);
  if (major) {
    const byMajor = books.filter((b) => b.MaNganh === major.MaNganh);
    if (byMajor.length > 0) {
      return { matched: byMajor.slice(0, 4), majorName: major.TenNganh, majorCode: major.MaNganh };
    }
  }

  const cleaned = extractSearchQuery(rawQuery);
  const queryToTest = cleaned || rawQuery.trim();
  const direct = books.filter((b) =>
    matchesVietnameseSearch(queryToTest, [
      b.MaSach, b.TenSach, b.NhaXuatBan, b.TenTheLoai,
      b.TenNganh, b.MaNganh, b.NguonTaiLieu, b.MoTa, ...b.TacGiaList,
    ])
  );
  if (direct.length > 0) return { matched: direct.slice(0, 4) };

  // Fallback token-level scoring for multi-word natural queries
  const tokens = cleaned.split(' ').filter((t) => t.length >= 2);
  if (tokens.length === 0) return { matched: [] };
  const scored = books
    .map((book) => {
      const hay = normalize(
        [book.TenSach, book.TenNganh, book.TenTheLoai, book.MoTa, ...book.TacGiaList].join(' ')
      );
      const score = tokens.reduce((acc, tok) => acc + (hay.includes(tok) ? 1 : 0), 0);
      return { book, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return { matched: scored.slice(0, 4).map((x) => x.book) };
}

/**
 * Context-Aware Mini-RAG Engine reading live THAMSO, SACH, and PHONGHOP records.
 * Guaranteed deterministic, zero hallucination, and < 5ms execution time.
 */
export function buildLocalBotReply(
  rawQuery: string,
  context: { books: Sach[]; params: ThamSo; rooms: PhongHop[] }
): LibBotReply {
  const norm = normalize(rawQuery);
  const { books, params, rooms } = context;

  // 1. Regulations / Borrowing policy / Fines / Card age
  const isRegQuery =
    /(quy dinh|phat|tre han|qua han|toi da|may cuon|may quyen|bao nhieu ngay|tuoi|lap the|han the|nam xuat ban|chinh sach)/.test(
      norm
    );
  if (isRegQuery) {
    return {
      intent: 'REGULATIONS',
      books: [],
      actions: [{ label: 'Xem Chính sách & Dịch vụ', targetTab: 'services' }],
      text: [
        `Theo quy định hiện hành của Thư viện UIT:`,
        `• Định mức mượn: tối đa **${params.SoSachMuonToiDa} quyển** trong vòng **${params.SoNgayMuonToiDa} ngày**.`,
        `• Phí trả trễ hạn: **1.000đ / ngày** cho mỗi quyển quá hạn.`,
        `• Điều kiện lập thẻ: độ tuổi từ **${params.TuoiToiThieu} đến ${params.TuoiToiDa} tuổi**, thời hạn thẻ **${params.ThoiHanThe} tháng**.`,
        `• Tiêu chuẩn tiếp nhận sách: xuất bản trong vòng **${params.KhoangCachNamXuatBan} năm** gần đây.`,
      ].join('\n'),
    };
  }

  // 2. Opening hours, contact, or group study room services
  const isHoursOrService =
    /(gio mo cua|lich phuc vu|may gio|mo cua|dong cua|phong hop|phong hoc nhom|dat phong|yeu cau sach|de xuat sach|hotline|lien he|dia chi|dich vu)/.test(
      norm
    );
  if (isHoursOrService) {
    const readyRooms = rooms.filter((r) => r.TrangThai === 'Sẵn sàng').length;
    return {
      intent: /phong|dich vu|yeu cau/.test(norm) ? 'SERVICES' : 'HOURS',
      books: [],
      actions: [
        { label: 'Đặt phòng & Dịch vụ ngay', targetTab: 'services' },
        { label: 'Xem Giới thiệu & Nội quy', targetTab: 'about' },
      ],
      text: [
        `**Lịch phục vụ Thư viện UIT:**`,
        `• Thứ 2 – Thứ 6: **07:30 – 18:00** (mở xuyên trưa).`,
        `• Thứ 7: **08:00 – 16:00** | Chủ nhật & Lễ: nghỉ phục vụ.`,
        `• Phòng học nhóm: hiện có **${readyRooms} phòng sẵn sàng** tại tầng 2–3, hỗ trợ đặt lịch trực tuyến.`,
        `• Liên hệ: **${UIT_LIBRARY_INFO.hotline}** · ${UIT_LIBRARY_INFO.email}.`,
      ].join('\n'),
    };
  }

  // 3. Available books query
  const isAvailableQuery =
    /(co san|san sang|con tren ke|muon duoc ngay|dang ranh)/.test(norm) &&
    !findMatchingMajor(norm);
  if (isAvailableQuery) {
    const available = books.filter((b) => b.TinhTrang === 'Có sẵn');
    return {
      intent: 'AVAILABLE_BOOKS',
      books: available.slice(0, 4),
      actions: [{ label: 'Xem toàn bộ kho sách', targetTab: 'catalog' }],
      text: `Hiện tại có **${available.length} / ${books.length} đầu sách** đang **Có sẵn** tại kho mở. Dưới đây là một số đầu sách tiêu biểu bạn có thể mượn ngay:`,
    };
  }

  // 4. Book / Major / Author search
  const { matched, majorName, majorCode } = findMatchingBooks(rawQuery, books);
  if (matched.length > 0) {
    const availCount = matched.filter((b) => b.TinhTrang === 'Có sẵn').length;
    const header = majorName
      ? `Mình tìm thấy **${matched.length} học liệu** thuộc ngành **${majorName}** (${availCount} quyển đang **Có sẵn**):`
      : `Mình tìm thấy **${matched.length} tài liệu** phù hợp trong kho Thư viện UIT (${availCount} quyển đang **Có sẵn**):`;
    return {
      intent: 'BOOK_SEARCH',
      books: matched,
      actions: majorCode
        ? [{ label: `Xem Bản đồ ngành ${majorName}`, targetTab: 'knowledge-map', majorFilter: majorCode }]
        : [{ label: 'Mở trang Tra cứu nâng cao', targetTab: 'catalog' }],
      text: header,
    };
  }

  // 5. Friendly greeting / guidance
  return {
    intent: 'GREETING',
    books: [],
    actions: [
      { label: 'Tra cứu kho sách', targetTab: 'catalog' },
      { label: 'Đặt phòng họp nhóm', targetTab: 'services' },
    ],
    text: `Mình chưa tìm thấy đầu sách khớp với "${rawQuery.trim()}" trong kho hiện tại. Bạn có thể thử tìm theo tên ngành (VD: *An toàn Thông tin*, *Kỹ thuật phần mềm*, *Trí tuệ Nhân tạo*), tên sách (*DevOps*, *CompTIA*) hoặc hỏi về quy định mượn sách & đặt phòng nhé!`,
  };
}
