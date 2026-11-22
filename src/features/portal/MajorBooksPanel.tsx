import { GraduationCap, MapPin, Network } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';
import type { Sach } from '../../types/library';
import type { NganhHoc } from '../../types/portal';

interface MajorBooksPanelProps {
  major: NganhHoc;
  books: Sach[];
  onSelectBook: (book: Sach) => void;
  onExploreMajorInMap: (maNganh: string) => void;
}

export function MajorBooksPanel({
  major,
  books,
  onSelectBook,
  onExploreMajorInMap,
}: MajorBooksPanelProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#0054A6] font-semibold">
            <GraduationCap className="w-4 h-4" />
            <span>{major.Khoa}</span>
            <span>·</span>
            <span>{major.ChuongTrinh.join(' / ')}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">{major.TenNganh}</h2>
          <p className="text-xs text-slate-600 max-w-2xl">{major.MoTaNgan}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 shrink-0"
          onClick={() => onExploreMajorInMap(major.MaNganh)}
        >
          <Network className="w-4 h-4 text-[#0054A6]" />
          Mở Bản đồ Tri thức ngành này
        </Button>
      </div>

      {books.length === 0 ? (
        <p className="text-sm text-slate-500 py-6 text-center">
          Hiện chưa có học liệu riêng cho ngành này trên danh mục mở.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {books.map((book) => (
            <button
              key={book.MaSach}
              type="button"
              onClick={() => onSelectBook(book)}
              className="text-left p-4 rounded-xl border border-slate-200 hover:border-[#0054A6]/50 bg-slate-50/50 hover:bg-white transition-all cursor-pointer flex items-start justify-between gap-3"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="font-mono font-semibold text-slate-600">{book.MaSach}</span>
                  <span>·</span>
                  <span>{book.NguonTaiLieu || book.TenTheLoai}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">{book.TenSach}</h3>
                <p className="text-xs text-slate-600 truncate">
                  {book.TacGiaList.join(', ')} · {book.NamXuatBan}
                </p>
                <p className="text-[11px] text-slate-400 inline-flex items-center gap-1 pt-0.5">
                  <MapPin className="w-3 h-3" />
                  {book.MaKeSach || 'Kho đọc mở'}
                </p>
              </div>
              <span
                className={cn(
                  'px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0',
                  book.TinhTrang === 'Có sẵn'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                )}
              >
                {book.TinhTrang}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
