import * as React from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';
import { portalService } from '../../services/portalService';
import type { Sach } from '../../types/library';

interface CatalogBookCardProps {
  book: Sach;
  onSelect: (book: Sach) => void;
}

export function CatalogBookCard({ book, onSelect }: CatalogBookCardProps) {
  const isAvailable = book.TinhTrang === 'Có sẵn';
  const majorArtwork = portalService.getMajorImage(book.MaNganh);
  const [imgSrc, setImgSrc] = React.useState(book.AnhBia || majorArtwork);

  React.useEffect(() => {
    setImgSrc(book.AnhBia || portalService.getMajorImage(book.MaNganh));
  }, [book.AnhBia, book.MaNganh]);

  return (
    <button
      type="button"
      onClick={() => onSelect(book)}
      className="text-left bg-white border border-slate-200 hover:border-[#0054A6]/60 rounded-xl overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
    >
      {/* Visual Cover Strip */}
      <div className="relative w-full aspect-[35/24] overflow-hidden bg-slate-900">
        <img
          src={imgSrc}
          alt={book.TenSach}
          onError={() => setImgSrc(majorArtwork)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent" />
        <span
          className={cn(
            'absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full font-semibold text-[11px] shadow-xs backdrop-blur-xs',
            isAvailable ? 'bg-emerald-600/95 text-white' : 'bg-amber-600/95 text-white'
          )}
        >
          {book.TinhTrang}
        </span>
        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full font-mono font-semibold text-[10px] bg-slate-900/75 text-white backdrop-blur-xs">
          {book.MaSach}
        </span>
        <p className="absolute bottom-2.5 left-3 right-3 text-xs font-semibold text-white/95 truncate drop-shadow-xs">
          {book.TenNganh || book.TenTheLoai}
        </p>
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
          <span className="font-medium text-slate-500 truncate">
            {book.NhaXuatBan} · {book.NamXuatBan}
          </span>
          <span className="inline-flex items-center gap-1 text-[#0054A6] font-mono font-semibold shrink-0">
            <MapPin className="w-3 h-3" />
            {book.MaKeSach || 'Kho mở'}
          </span>
        </div>
      </div>
    </button>
  );
}
