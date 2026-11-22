import { UIT_MAJORS } from '../constants/majors';
import type { Sach, TheLoai } from '../types/library';
import { bookService } from './bookService';

export type KnowledgeNodeType = 'MAJOR' | 'CATEGORY' | 'BOOK' | 'AUTHOR';

export interface KnowledgeNode {
  id: string;
  label: string;
  type: KnowledgeNodeType;
  color: string;
  val: number;
  subtitle: string;
  meta: Record<string, string>;
  book?: Sach;
}

export interface KnowledgeLink {
  source: string;
  target: string;
  relation: string;
}

export interface KnowledgeGraphData {
  nodes: KnowledgeNode[];
  links: KnowledgeLink[];
}

export const NODE_COLORS: Record<KnowledgeNodeType, string> = {
  MAJOR: '#4F46E5',
  CATEGORY: '#0054A6',
  BOOK: '#0284C7',
  AUTHOR: '#0F766E',
};

/**
 * Pure graph builder transforming UIT Majors, Categories, Books, and Authors
 * into an Obsidian-style interactive 2D force-directed Knowledge Map.
 */
export function buildKnowledgeGraph(
  books: Sach[],
  categories: TheLoai[],
  options?: { majorFilter?: string; categoryFilter?: string }
): KnowledgeGraphData {
  const majorFilter = options?.majorFilter || 'ALL';
  const categoryFilter = options?.categoryFilter || 'ALL';

  const filteredBooks = books.filter((b) => {
    if (majorFilter !== 'ALL' && b.MaNganh !== majorFilter) return false;
    if (categoryFilter !== 'ALL' && b.MaTheLoai !== categoryFilter) return false;
    return true;
  });

  const nodeMap = new Map<string, KnowledgeNode>();
  const links: KnowledgeLink[] = [];

  for (const cat of categories) {
    if (categoryFilter !== 'ALL' && cat.MaTheLoai !== categoryFilter) continue;
    const catBooks = filteredBooks.filter((b) => b.MaTheLoai === cat.MaTheLoai);
    if (catBooks.length === 0 && majorFilter !== 'ALL') continue;
    const catId = `CAT:${cat.MaTheLoai}`;
    nodeMap.set(catId, {
      id: catId,
      label: cat.TenTheLoai,
      type: 'CATEGORY',
      color: NODE_COLORS.CATEGORY,
      val: 14,
      subtitle: 'Thể loại học liệu',
      meta: {
        'Mã thể loại': cat.MaTheLoai,
        'Số đầu sách hiển thị': String(catBooks.length),
      },
    });
  }

  for (const book of filteredBooks) {
    const bookId = `BOOK:${book.MaSach}`;
    const catId = `CAT:${book.MaTheLoai}`;
    const major = UIT_MAJORS.find((m) => m.MaNganh === book.MaNganh);

    nodeMap.set(bookId, {
      id: bookId,
      label: book.TenSach,
      type: 'BOOK',
      color: book.TinhTrang === 'Có sẵn' ? '#0284C7' : '#EA580C',
      val: 9,
      subtitle: `${book.MaSach} · ${book.TinhTrang}`,
      book,
      meta: {
        'Mã sách': book.MaSach,
        'Ngành học': major?.TenNganh || book.TenNganh || 'Công nghệ thông tin',
        'Thể loại': book.TenTheLoai,
        'Ngôn ngữ': book.NgonNgu || 'Tiếng Việt',
        'Nhà xuất bản': `${book.NhaXuatBan} (${book.NamXuatBan})`,
        'Vị trí kệ': book.MaKeSach || 'Tầng 1 – Kho mở',
        'Tác giả': book.TacGiaList.join(', '),
        'Tình trạng': book.TinhTrang,
        ...(book.HanTraHienTai ? { 'Dự kiến trả': book.HanTraHienTai } : {}),
      },
    });

    if (nodeMap.has(catId)) {
      links.push({ source: catId, target: bookId, relation: 'thuộc thể loại' });
    }

    if (major) {
      const majorId = `MAJOR:${major.MaNganh}`;
      if (!nodeMap.has(majorId)) {
        const majorCount = filteredBooks.filter((b) => b.MaNganh === major.MaNganh).length;
        nodeMap.set(majorId, {
          id: majorId,
          label: major.TenNganh,
          type: 'MAJOR',
          color: NODE_COLORS.MAJOR,
          val: 13,
          subtitle: major.Khoa,
          meta: {
            'Mã ngành': major.MaNganh,
            'Đơn vị quản lý': major.Khoa,
            'Chương trình': major.ChuongTrinh.join(', '),
            'Học liệu liên kết': `${majorCount} đầu sách`,
          },
        });
      }
      links.push({ source: majorId, target: bookId, relation: 'ngành học' });
    }

    for (const authorName of book.TacGiaList) {
      const authorId = `AUTHOR:${authorName}`;
      if (!nodeMap.has(authorId)) {
        nodeMap.set(authorId, {
          id: authorId,
          label: authorName,
          type: 'AUTHOR',
          color: NODE_COLORS.AUTHOR,
          val: 6.5,
          subtitle: 'Tác giả học liệu',
          meta: {
            'Tác giả': authorName,
            'Đầu sách liên kết': String(
              filteredBooks.filter((b) => b.TacGiaList.includes(authorName)).length
            ),
          },
        });
      }
      links.push({ source: bookId, target: authorId, relation: 'tác giả' });
    }
  }

  return { nodes: Array.from(nodeMap.values()), links };
}

export const knowledgeMapService = {
  async fetchCatalog(): Promise<{ books: Sach[]; categories: TheLoai[] }> {
    const [books, categories] = await Promise.all([
      bookService.listPublic(),
      bookService.listPublicCategories(),
    ]);
    return { books, categories };
  },
};
