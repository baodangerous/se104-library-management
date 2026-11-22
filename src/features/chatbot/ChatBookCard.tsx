import { BookOpen, Eye, MapPin, Network } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Sach } from '../../types/library';

interface ChatBookCardProps {
  book: Sach;
  onInspectBook: (book: Sach) => void;
  onOpenKnowledgeMap: (book: Sach) => void;
}

const COVER_THEMES = [
  'from-[#003B73] to-[#0054A6]',
  'from-[#0F4C81] to-[#0284C7]',
  'from-[#1E3A5F] to-[#2563EB]',
  'from-[#0F766E] to-[#0054A6]',
];

function getCoverGradient(maSach: string): string {
  const num = Number(maSach.replace(/\D/g, '')) || 0;
  return COVER_THEMES[num % COVER_THEMES.length];
}

export function ChatBookCard({
  book,
  onInspectBook,
  onOpenKnowledgeMap,
}: ChatBookCardProps) {
  const isAvailable = book.TinhTrang === 'Có sẵn';

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-xs hover:border-[#0054A6]/40 transition-all flex gap-2.5">
      {/* Stylized Mini Book Cover */}
      <div
        className={cn(
          'w-12 h-16 rounded-lg bg-gradient-to-br text-white p-1.5 flex flex-col justify-between shrink-0 shadow-xs',
          getCoverGradient(book.MaSach)
        )}
      >
        <span className="text-[9px] font-mono font-bold text-sky-100 leading-none">
          {book.MaSach}
        </span>
        <BookOpen className="w-4 h-4 text-white/90 self-end" />
      </div>

      {/* Metadata & Quick Actions */}
      <div className="min-w-0 flex-1 flex flex-col justify-between gap-1.5">
        <div>
          <div className="flex items-start justify-between gap-1.5">
            <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
              {book.TenSach}
            </p>
            <span
              className={cn(
                'px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0 whitespace-nowrap',
                isAvailable
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              )}
            >
              {book.TinhTrang}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 truncate mt-0.5">
            {book.TacGiaList.join(', ')}
            {book.MaKeSach ? (
              <span className="inline-flex items-center gap-0.5 ml-1.5 font-mono text-[10px] text-slate-400">
                <MapPin className="w-2.5 h-2.5" />
                {book.MaKeSach}
              </span>
            ) : null}
          </p>
        </div>

        <div className="flex items-center gap-1.5 pt-0.5">
          <button
            type="button"
            onClick={() => onInspectBook(book)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#0054A6]/8 text-[#0054A6] hover:bg-[#0054A6] hover:text-white text-[11px] font-semibold transition-colors cursor-pointer"
          >
            <Eye className="w-3 h-3" />
            Chi tiết
          </button>
          <button
            type="button"
            onClick={() => onOpenKnowledgeMap(book)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-slate-200 text-slate-700 hover:border-[#0054A6]/50 hover:text-[#0054A6] text-[11px] font-medium transition-colors cursor-pointer"
          >
            <Network className="w-3 h-3" />
            Bản đồ
          </button>
        </div>
      </div>
    </div>
  );
}
