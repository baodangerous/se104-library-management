import * as React from 'react';
import { ArrowRight, BookMarked, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Sach } from '../../types/library';

interface FeaturedBooksCarouselProps {
  books: Sach[];
  onSelectBook: (book: Sach) => void;
  onViewAll: () => void;
}

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
        {books.map((book) => {
          const isAvailable = book.TinhTrang === 'Có sẵn';
          const coverSrc = book.AnhBia || `/resources/majors/${book.MaNganh || 'CNTT'}.svg`;
          return (
            <button
              key={book.MaSach}
              type="button"
              onClick={() => onSelectBook(book)}
              className="snap-start shrink-0 w-64 text-left bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-[#0054A6]/50 rounded-xl overflow-hidden transition-all hover:shadow-md cursor-pointer flex flex-col group"
            >
              {/* Visual Cover */}
              <div className="h-36 relative overflow-hidden bg-slate-900">
                <img
                  src={coverSrc}
                  alt={book.TenSach}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                <div className="absolute top-2.5 inset-x-3 flex items-center justify-between gap-2 text-[11px]">
                  <span className="font-mono font-semibold px-2 py-0.5 rounded bg-slate-900/75 text-white backdrop-blur-xs">
                    {book.MaSach}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/20 text-white font-medium backdrop-blur-xs">
                    {book.NgonNgu === 'Tiếng Anh' ? 'Ngoại văn' : 'Tiếng Việt'}
                  </span>
                </div>
                <div className="absolute bottom-2.5 inset-x-3 flex items-end justify-between gap-2 text-white">
                  <p className="text-xs font-bold leading-snug line-clamp-2 drop-shadow-xs">
                    {book.TenSach}
                  </p>
                  <BookMarked className="w-4 h-4 text-sky-300 shrink-0 mb-0.5" />
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
