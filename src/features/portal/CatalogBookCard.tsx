import * as React from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';
import { BookCoverFrame } from './BookCoverFrame';
import type { Sach } from '../../types/library';

interface CatalogBookCardProps {
  book: Sach;
  onSelect: (book: Sach) => void;
}

const BOOK_GRADIENTS: Record<string, string> = {
  ATTT: 'from-[#7f1d1d] via-[#b91c1c] to-[#0a1f4d]',
  KTPM: 'from-[#0a1f4d] via-[#1556d6] to-[#3a86ff]',
  TTNT: 'from-[#4c1d95] via-[#7c3aed] to-[#1e1b4b]',
  KHMT: 'from-[#1e3a8a] via-[#2563eb] to-[#0a1f4d]',
  KHDL: 'from-[#164e63] via-[#0891b2] to-[#0a1f4d]',
  TKVM: 'from-[#581c87] via-[#7e22ce] to-[#0a1f4d]',
  KTMT: 'from-[#7c2d12] via-[#c2410c] to-[#0a1f4d]',
  MMT: 'from-[#064e3b] via-[#059669] to-[#0a1f4d]',
  TTDPT: 'from-[#831843] via-[#be185d] to-[#0a1f4d]',
};

export function CatalogBookCard({ book, onSelect }: CatalogBookCardProps) {
  const isAvailable = book.TinhTrang === 'Có sẵn';
  const grad = BOOK_GRADIENTS[book.MaNganh || ''] || 'from-[#0a1f4d] via-[#1556d6] to-[#0284c7]';

  return (
    <button
      type="button"
      onClick={() => onSelect(book)}
      className="text-left bg-white border border-slate-200 hover:border-[#1556d6]/60 rounded-xl overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-900">
        <BookCoverFrame
          src={book.AnhBia}
          alt={book.TenSach}
          fallbackGradient={grad}
          fallbackTitle={book.TenSach}
          isThesis={book.NguonTaiLieu === 'Luận văn UIT' || book.MaTheLoai === 'C'}
          author={book.TacGiaList[0]}
          year={book.NamXuatBan}
        />
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
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#0054A6] transition-colors">
            {book.TenSach}
          </h3>
          <p className="text-xs text-slate-600 line-clamp-1">{book.TacGiaList.join(', ')}</p>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px]">
          <span className="font-medium text-slate-500 truncate">
            {book.TenNganh || book.TenTheLoai}
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
