import * as React from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Sach } from '../../types/library';

interface CatalogBookCardProps {
  book: Sach;
  onSelect: (book: Sach) => void;
}

const COVER_GRADIENTS: Record<string, string> = {
  ATTT: 'from-rose-600 via-red-700 to-slate-900',
  KTPM: 'from-[#0054A6] via-blue-700 to-slate-900',
  TTNT: 'from-violet-600 via-purple-700 to-slate-900',
  KHMT: 'from-blue-600 via-indigo-700 to-slate-900',
  KHDL: 'from-cyan-600 via-teal-700 to-slate-900',
  TKVM: 'from-purple-600 via-indigo-800 to-slate-900',
  KTMT: 'from-orange-600 via-amber-700 to-slate-900',
  MMT: 'from-emerald-600 via-teal-700 to-slate-900',
  TTDPT: 'from-pink-600 via-rose-700 to-slate-900',
};

export function CatalogBookCard({ book, onSelect }: CatalogBookCardProps) {
  const isAvailable = book.TinhTrang === 'Có sẵn';
  const [imgError, setImgError] = React.useState(false);
  const showCoverImg = Boolean(book.AnhBia && !imgError);
  const grad = COVER_GRADIENTS[book.MaNganh || ''] || 'from-[#0054A6] via-sky-700 to-slate-900';

  return (
    <button
      type="button"
      onClick={() => onSelect(book)}
      className="text-left bg-white border border-slate-200 hover:border-[#0054A6]/60 rounded-xl overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
    >
      {/* Visual Cover Strip */}
      <div className="relative h-36 w-full overflow-hidden bg-slate-100">
        {showCoverImg ? (
          <img
            src={book.AnhBia}
            alt={book.TenSach}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={cn('w-full h-full bg-gradient-to-br p-4 flex flex-col justify-between text-white', grad)}>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/15 backdrop-blur-xs self-start">
              {book.MaNganh || book.MaTheLoai} · {book.NamXuatBan}
            </span>
            <p className="text-xs font-bold leading-snug line-clamp-2 drop-shadow-xs">
              {book.TenSach}
            </p>
          </div>
        )}
        <span
          className={cn(
            'absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full font-semibold text-[11px] shadow-xs backdrop-blur-xs',
            isAvailable
              ? 'bg-emerald-600/95 text-white'
              : 'bg-amber-600/95 text-white'
          )}
        >
          {book.TinhTrang}
        </span>
        {book.NoiBat ? (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full font-semibold text-[10px] bg-slate-900/75 text-white backdrop-blur-xs">
            Tiêu biểu
          </span>
        ) : null}
      </div>

      {/* Concise Metadata */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#0054A6] transition-colors">
            {book.TenSach}
          </h3>
          <p className="text-xs text-slate-600 line-clamp-1">{book.TacGiaList.join(', ')}</p>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px]">
          <span className="font-mono font-semibold text-[#0054A6] truncate">
            {book.MaSach} · {book.NgonNgu || 'TV'}
          </span>
          <span className="inline-flex items-center gap-1 text-slate-500 font-mono shrink-0">
            <MapPin className="w-3 h-3" />
            {book.MaKeSach || 'Kho mở'}
          </span>
        </div>
      </div>
    </button>
  );
}
