import * as React from 'react';
import { BookOpen, Filter, RotateCcw, Search } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { UIT_MAJORS } from '../../constants/majors';
import { THEMATIC_SHELVES } from '../../constants/portalContent';
import { cn } from '../../lib/utils';
import { bookService } from '../../services/bookService';
import type { Sach, TheLoai } from '../../types/library';
import type { NguonTaiLieu } from '../../types/portal';
import { CatalogBookCard } from './CatalogBookCard';

const SOURCE_TABS: Array<{ value: 'ALL' | NguonTaiLieu; label: string }> = [
  { value: 'ALL', label: 'Tất cả nguồn' },
  { value: 'Giáo trình UIT', label: 'Giáo trình UIT' },
  { value: 'Luận văn UIT', label: 'Luận văn UIT' },
  { value: 'Sách Tiếng Việt', label: 'Sách Tiếng Việt' },
  { value: 'Sách Ngoại văn', label: 'Sách Ngoại văn' },
];

export interface CatalogFilterState {
  q: string;
  nguon: string;
  maTheLoai: string;
  maNganh: string;
  ngonNgu: string;
  tinhTrang: string;
  chuDe: string;
}

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
        return list.sort((a, b) => b.NgayNhap.localeCompare(a.NgayNhap));
    }
  }, [books, sortBy]);

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

  const activeTheme = THEMATIC_SHELVES.find((t) => t.id === filters.chuDe);

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

        <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-4">
          {SOURCE_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => update({ nguon: tab.value })}
              className={cn(
                'px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
                filters.nguon === tab.value
                  ? 'bg-[#0054A6] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filters.q}
                onChange={(e) => update({ q: e.target.value })}
                placeholder="Nhập từ khóa tìm kiếm (VD: CompTIA, DevOps, Giai thuat, Bao mat...)"
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0054A6]/20 focus:border-[#0054A6]"
              />
            </div>
            <Button variant="outline" onClick={resetAll} className="gap-1.5 shrink-0">
              <RotateCcw className="w-3.5 h-3.5" />
              Đặt lại bộ lọc
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <select aria-label="Lọc theo thể loại" value={filters.maTheLoai} onChange={(e) => update({ maTheLoai: e.target.value })} className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700">
              <option value="ALL">Tất cả thể loại</option>
              {categories.map((c) => <option key={c.MaTheLoai} value={c.MaTheLoai}>{c.TenTheLoai}</option>)}
            </select>
            <select aria-label="Lọc theo ngành đào tạo" value={filters.maNganh} onChange={(e) => update({ maNganh: e.target.value })} className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700">
              <option value="ALL">Tất cả 12 ngành UIT</option>
              {UIT_MAJORS.map((m) => <option key={m.MaNganh} value={m.MaNganh}>{m.TenNganh}</option>)}
            </select>
            <select aria-label="Lọc theo ngôn ngữ" value={filters.ngonNgu} onChange={(e) => update({ ngonNgu: e.target.value })} className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700">
              <option value="ALL">Mọi ngôn ngữ</option>
              <option value="Tiếng Việt">Tiếng Việt</option>
              <option value="Tiếng Anh">Tiếng Anh</option>
            </select>
            <select aria-label="Lọc theo tình trạng sách" value={filters.tinhTrang} onChange={(e) => update({ tinhTrang: e.target.value })} className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700">
              <option value="ALL">Mọi tình trạng</option>
              <option value="Có sẵn">Có sẵn</option>
              <option value="Đang mượn">Đang mượn</option>
            </select>
          </div>

          {activeTheme ? (
            <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-lg bg-[#0054A6]/8 text-xs text-[#0054A6]">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Filter className="w-3.5 h-3.5" />
                Đang lọc theo tủ sách: <strong>{activeTheme.tenTuSach}</strong>
              </span>
              <button type="button" onClick={() => update({ chuDe: 'ALL' })} className="font-semibold hover:underline cursor-pointer">
                Bỏ lọc
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-slate-500">Đang tải danh mục học liệu...</div>
      ) : books.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-2">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-800">Không tìm thấy tài liệu phù hợp</p>
          <p className="text-xs text-slate-500">Thử đổi từ khóa không dấu hoặc đặt lại bộ lọc để xem toàn bộ kho sách.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedBooks.map((book) => (
            <CatalogBookCard key={book.MaSach} book={book} onSelect={onSelectBook} />
          ))}
        </div>
      )}
    </div>
  );
}
