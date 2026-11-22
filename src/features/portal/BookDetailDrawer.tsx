import { BookOpen, Building2, Calendar, Globe, MapPin, Network, User, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { formatDateVN, formatVnd } from '../../lib/utils';
import type { Sach } from '../../types/library';

interface BookDetailDrawerProps {
  book: Sach | null;
  onClose: () => void;
  onOpenKnowledgeMap: (book: Sach) => void;
}

export function BookDetailDrawer({
  book,
  onClose,
  onOpenKnowledgeMap,
}: BookDetailDrawerProps) {
  if (!book) return null;

  const isAvailable = book.TinhTrang === 'Có sẵn';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-label={`Chi tiết tài liệu ${book.TenSach}`}
        className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-br from-[#003B73] to-[#0054A6] text-white flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-sky-200">
              <span className="font-mono font-semibold text-white">{book.MaSach}</span>
              <span>·</span>
              <span>{book.NguonTaiLieu || book.TenTheLoai}</span>
            </div>
            <h2 className="text-lg font-bold leading-snug">{book.TenSach}</h2>
            <p className="text-xs text-sky-100">{book.TacGiaList.join(', ')}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng chi tiết tài liệu"
            className="p-1.5 rounded-lg text-sky-100 hover:text-white hover:bg-white/15 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Status Strip */}
          <div
            className={`rounded-xl border p-4 flex items-center justify-between gap-3 ${
              isAvailable
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/70 border-amber-200 text-amber-900'
            }`}
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-wider opacity-75">
                Tình trạng lưu thông
              </p>
              <p className="text-sm font-bold mt-0.5">
                {isAvailable ? 'Có sẵn tại kho mở' : 'Đang có độc giả mượn'}
              </p>
              {!isAvailable && book.HanTraHienTai ? (
                <p className="text-xs mt-1">
                  Dự kiến hoàn trả: <strong>{formatDateVN(book.HanTraHienTai)}</strong>
                </p>
              ) : null}
            </div>
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                isAvailable
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-600 text-white'
              }`}
            >
              {book.TinhTrang}
            </span>
          </div>

          {book.MoTa ? (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Giới thiệu tóm tắt
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">{book.MoTa}</p>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-3 text-sm">
            <InfoRow icon={BookOpen} label="Thể loại" value={book.TenTheLoai} />
            <InfoRow
              icon={Building2}
              label="Ngành học liên kết"
              value={book.TenNganh || 'Công nghệ thông tin'}
            />
            <InfoRow
              icon={User}
              label="Tác giả"
              value={book.TacGiaList.join(', ')}
            />
            <InfoRow
              icon={Calendar}
              label="Xuất bản"
              value={`${book.NhaXuatBan} · Năm ${book.NamXuatBan}`}
            />
            <InfoRow
              icon={Globe}
              label="Ngôn ngữ"
              value={book.NgonNgu || 'Tiếng Việt'}
            />
            <InfoRow
              icon={MapPin}
              label="Vị trí kệ sách"
              value={book.MaKeSach || 'Tầng 1 – Kho đọc mở'}
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Ngày tiếp nhận: {formatDateVN(book.NgayNhap)}</span>
            <span>Giá bìa: {formatVnd(book.TriGia)}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-2.5">
          <Button
            variant="primary"
            className="flex-1 gap-2"
            onClick={() => onOpenKnowledgeMap(book)}
          >
            <Network className="w-4 h-4" />
            Xem trên Bản đồ Tri thức
          </Button>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </aside>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
      <Icon className="w-4 h-4 text-[#0054A6] shrink-0 mt-0.5" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-900 mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}
