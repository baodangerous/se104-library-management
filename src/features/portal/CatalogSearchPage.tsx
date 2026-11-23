import * as React from 'react';
import { BookOpen } from 'lucide-react';
import { bookService } from '../../services/bookService';
import { portalService } from '../../services/portalService';
import type { Sach, TheLoai } from '../../types/library';
import { CatalogBookCard } from './CatalogBookCard';
import { CatalogFilterBar, type CatalogFilterState } from './CatalogFilterBar';

export type { CatalogFilterState };

interface CatalogSearchPageProps {
  categories: TheLoai[];
  filters: CatalogFilterState;
  onChangeFilters: (next: CatalogFilterState) => void;
  onSelectBook: (book: Sach) => void;
}

export function CatalogSearchPage({
  categories,
  filters,
  onChangeFilters,
  onSelectBook,
}: CatalogSearchPageProps) {
  const [books, setBooks] = React.useState<Sach[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [sortBy, setSortBy] = React.useState<'newest' | 'available' | 'title' | 'year'>('newest');
  const [page, setPage] = React.useState(1);
  const PAGE_SIZE = 24;

  const majors = React.useMemo(() => portalService.listMajors(), []);
  const themes = React.useMemo(() => portalService.listThematicShelves(), []);

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    bookService
      .listPublic(filters)
      .then((rows) => {
        if (active) setBooks(rows);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [filters]);

  const sortedBooks = React.useMemo(() => {
    const list = [...books];
    switch (sortBy) {
      case 'available':
        return list.sort((a, b) => {
          if (a.TinhTrang === b.TinhTrang) return a.TenSach.localeCompare(b.TenSach, 'vi');
          return a.TinhTrang === 'Có sẵn' ? -1 : 1;
        });
      case 'title':
        return list.sort((a, b) => a.TenSach.localeCompare(b.TenSach, 'vi'));
      case 'year':
        return list.sort((a, b) => b.NamXuatBan - a.NamXuatBan);
      case 'newest':
      default:
        return list.sort((a, b) => {
          const imgDiff = Number(Boolean(b.AnhBia)) - Number(Boolean(a.AnhBia));
          if (imgDiff !== 0) return imgDiff;
          return b.NgayNhap.localeCompare(a.NgayNhap);
        });
    }
  }, [books, sortBy]);

  React.useEffect(() => {
    setPage(1);
  }, [books.length, sortBy, filters]);

  const totalPages = Math.max(1, Math.ceil(sortedBooks.length / PAGE_SIZE));
  const pagedBooks = React.useMemo(
    () => sortedBooks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sortedBooks, page]
  );

  const update = (patch: Partial<CatalogFilterState>) =>
    onChangeFilters({ ...filters, ...patch });

  const resetAll = () =>
    onChangeFilters({
      q: '',
      nguon: 'ALL',
      maTheLoai: 'ALL',
      maNganh: 'ALL',
      ngonNgu: 'ALL',
      tinhTrang: 'ALL',
      chuDe: 'ALL',
    });

  const activeTheme = themes.find((t) => t.id === filters.chuDe);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Tra cứu &amp; Sách mới</h1>
            <p className="text-xs text-slate-500 mt-1">
              Tìm kiếm không dấu theo nhan đề, tác giả, nhà xuất bản, mã ngành hoặc vị trí kệ sách.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <select
              aria-label="Sắp xếp kết quả"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
            >
              <option value="newest">Mới nhập gần đây</option>
              <option value="available">Sẵn sàng mượn trước</option>
              <option value="title">Nhan đề A–Z</option>
              <option value="year">Năm xuất bản mới nhất</option>
            </select>
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
              Tìm thấy <strong className="text-[#0054A6]">{books.length}</strong> tài liệu
            </span>
          </div>
        </div>

        <CatalogFilterBar
          filters={filters}
          categories={categories}
          majors={majors}
          activeTheme={activeTheme}
          onUpdate={update}
          onReset={resetAll}
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-slate-500">Đang tải danh mục học liệu...</div>
      ) : books.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-2">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-800">Không tìm thấy tài liệu phù hợp</p>
          <p className="text-xs text-slate-500">
            Thử đổi từ khóa không dấu hoặc đặt lại bộ lọc để xem toàn bộ kho sách.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pagedBooks.map((book) => (
              <CatalogBookCard key={book.MaSach} book={book} onSelect={onSelectBook} />
            ))}
          </div>
          {totalPages > 1 ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-600">
              <span>
                Trang <strong className="text-slate-900">{page}</strong> / {totalPages} · Hiển thị{' '}
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sortedBooks.length)} /{' '}
                {sortedBooks.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-default font-medium"
                >
                  Trang trước
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => {
                    setPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-default font-medium"
                >
                  Trang sau
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
