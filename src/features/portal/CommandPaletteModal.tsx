import * as React from 'react';
import { BookOpen, Compass, Search, Sparkles } from 'lucide-react';
import { ModalDialog } from '../../components/ui/dialog';
import { matchesVietnameseSearch } from '../../services/rules/searchUtils';
import type { Sach } from '../../types/library';
import type { PortalTabId } from '../../types/portal';

interface CommandPaletteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  books: Sach[];
  onSelectBook: (book: Sach) => void;
  onSelectTab: (tab: PortalTabId) => void;
}

const PAGE_LINKS: Array<{ tab: PortalTabId; label: string; hint: string }> = [
  { tab: 'home', label: 'Trang chủ & Hướng dẫn không gian', hint: '#/' },
  { tab: 'catalog', label: 'Tra cứu danh mục & Sách mới', hint: '#/catalog' },
  { tab: 'majors', label: 'CSDL 12 ngành đào tạo UIT', hint: '#/majors' },
  { tab: 'knowledge-map', label: 'Bản đồ Tri thức Học liệu', hint: '#/knowledge-map' },
  { tab: 'services', label: 'Đặt phòng học nhóm & Đề xuất sách', hint: '#/services' },
  { tab: 'about', label: 'Giới thiệu, Lịch phục vụ & Nội quy', hint: '#/about' },
];

export function CommandPaletteModal({
  open,
  onOpenChange,
  books,
  onSelectBook,
  onSelectTab,
}: CommandPaletteModalProps) {
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const matchedBooks = React.useMemo(() => {
    if (!query.trim()) return books.slice(0, 5);
    return books
      .filter((b) =>
        matchesVietnameseSearch(query, [b.MaSach, b.TenSach, b.TenNganh, ...b.TacGiaList])
      )
      .slice(0, 6);
  }, [books, query]);

  const matchedPages = React.useMemo(() => {
    if (!query.trim()) return PAGE_LINKS;
    return PAGE_LINKS.filter((p) => matchesVietnameseSearch(query, [p.label, p.hint]));
  }, [query]);

  return (
    <ModalDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Tìm kiếm nhanh (Ctrl + K)"
      description="Tìm nhanh đầu sách, trang chức năng hoặc mở Bản đồ Tri thức UIT."
      maxWidthClass="max-w-xl"
    >
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Gõ tên sách, mã sách (VD: S001), ngành học hoặc tên trang..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1556d6]/25"
          />
        </div>

        {matchedBooks.length > 0 ? (
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-1">
              Tài liệu ({matchedBooks.length})
            </p>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {matchedBooks.map((book) => (
                <button
                  key={book.MaSach}
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    onSelectBook(book);
                  }}
                  className="w-full px-3.5 py-2.5 text-left hover:bg-slate-50 flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <BookOpen className="w-4 h-4 text-[#0054A6] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        <span className="font-mono text-slate-500 mr-1.5">{book.MaSach}</span>
                        {book.TenSach}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {book.TacGiaList.join(', ')} · {book.MaKeSach || 'Kho mở'}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                      book.TinhTrang === 'Có sẵn'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {book.TinhTrang}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {matchedPages.length > 0 ? (
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-1">
              Điều hướng nhanh
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {matchedPages.map((p) => (
                <button
                  key={p.tab}
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    onSelectTab(p.tab);
                  }}
                  className="px-3 py-2 rounded-lg border border-slate-200 hover:border-[#1556d6]/50 text-left flex items-center justify-between gap-2 cursor-pointer"
                >
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-800 truncate">
                    {p.tab === 'knowledge-map' ? (
                      <Sparkles className="w-3.5 h-3.5 text-[#0054A6] shrink-0" />
                    ) : (
                      <Compass className="w-3.5 h-3.5 text-[#0054A6] shrink-0" />
                    )}
                    <span className="truncate">{p.label}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">{p.hint}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </ModalDialog>
  );
}
