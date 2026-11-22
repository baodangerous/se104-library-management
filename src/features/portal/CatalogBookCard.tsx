import { MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Sach } from '../../types/library';

interface CatalogBookCardProps {
  book: Sach;
  onSelect: (book: Sach) => void;
}

export function CatalogBookCard({ book, onSelect }: CatalogBookCardProps) {
  const isAvailable = book.TinhTrang === 'Có sẵn';

  return (
    <button
      type="button"
      onClick={() => onSelect(book)}
      className="text-left bg-white border border-slate-200 hover:border-[#0054A6]/50 rounded-xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-mono font-semibold text-slate-500">{book.MaSach}</span>
          <span
            className={cn(
              'px-2 py-0.5 rounded font-semibold text-[11px]',
              isAvailable
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            )}
          >
            {book.TinhTrang}
          </span>
        </div>
        <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
          {book.TenSach}
        </h3>
        <p className="text-xs text-slate-600 line-clamp-1">{book.TacGiaList.join(', ')}</p>
        <p className="text-[11px] text-slate-500">
          {book.NhaXuatBan} · {book.NamXuatBan} · {book.NgonNgu || 'Tiếng Việt'}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        <span className="text-[#0054A6] font-medium truncate">
          {book.TenNganh || book.TenTheLoai}
        </span>
        <span className="inline-flex items-center gap-1 text-slate-400 font-mono text-[11px] shrink-0">
          <MapPin className="w-3 h-3" />
          {book.MaKeSach || 'Kho mở'}
        </span>
      </div>
    </button>
  );
}
