import * as React from 'react';
import { ArrowRight, BookMarked, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Sach } from '../../types/library';

interface FeaturedBooksCarouselProps {
  books: Sach[];
  onSelectBook: (book: Sach) => void;
  onViewAll: () => void;
}

const SPINE_GRADIENTS = [
  'from-[#003B73] to-[#0054A6]',
  'from-[#0F4C81] to-[#0284C7]',
  'from-[#1E3A5F] to-[#2563EB]',
  'from-[#0F766E] to-[#0054A6]',
];

export function FeaturedBooksCarousel({
  books,
  onSelectBook,
  onViewAll,
}: FeaturedBooksCarouselProps) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  const scrollByCards = (direction: -1 | 1) => {
    scrollerRef.current?.scrollBy({ left: direction * 300, behavior: 'smooth' });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Sách mới &amp; Học liệu CNTT nổi bật
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tuyển chọn giáo trình UIT và ấn phẩm ngoại văn mới nhập kho đọc mở
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            aria-label="Sách trước"
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#0054A6] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            aria-label="Sách tiếp theo"
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#0054A6] cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onViewAll}
            className="hidden sm:inline-flex items-center gap-1 ml-2 text-xs font-semibold text-[#0054A6] hover:underline cursor-pointer"
          >
            Xem toàn bộ
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth"
      >
        {books.map((book, idx) => {
          const isAvailable = book.TinhTrang === 'Có sẵn';
          const grad = SPINE_GRADIENTS[idx % SPINE_GRADIENTS.length];
          return (
            <button
              key={book.MaSach}
              type="button"
              onClick={() => onSelectBook(book)}
              className="snap-start shrink-0 w-64 text-left bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-[#0054A6]/50 rounded-xl overflow-hidden transition-all hover:shadow-md cursor-pointer flex flex-col group"
            >
              {/* Crisp Typographic Academic Book Cover */}
              <div
                className={`h-32 bg-gradient-to-br ${grad} p-4 text-white flex flex-col justify-between relative`}
              >
                <div className="flex items-center justify-between gap-2 text-[11px] text-sky-100">
                  <span className="font-mono font-semibold">{book.MaSach}</span>
                  <span className="px-2 py-0.5 rounded bg-white/15 text-white font-medium">
                    {book.NgonNgu === 'Tiếng Anh' ? 'Ngoại văn' : 'Tiếng Việt'}
                  </span>
                </div>
                <div className="flex items-end justify-between gap-2">
                  <p className="text-sm font-bold leading-snug line-clamp-2">
                    {book.TenSach}
                  </p>
                  <BookMarked className="w-4 h-4 text-sky-200/80 shrink-0 mb-0.5" />
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-[#0054A6] truncate">
                    {book.TenNganh || book.TenTheLoai}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-1">
                    {book.TacGiaList.join(', ')}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {book.NhaXuatBan} · {book.NamXuatBan}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">
                    {book.MaKeSach || 'Kho mở'}
                  </span>
                  <span
                    className={`font-semibold ${
                      isAvailable ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {book.TinhTrang}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
