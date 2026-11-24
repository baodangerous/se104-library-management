import * as React from 'react';
import { BookmarkPlus, BookOpen, Building2, Calendar, FileDown, Globe, MapPin, Network, Star, User, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { formatDateVN, formatVnd } from '../../lib/utils';
import { operationalService } from '../../services/operationalService';
import { reservationService } from '../../services/reservationService';
import type { AuthUser, BanSao, DanhGiaSach, Sach, TaiNguyenSo } from '../../types/library';

interface BookDetailDrawerProps {
  book: Sach | null;
  user?: AuthUser | null;
  onClose: () => void;
  onOpenKnowledgeMap: (book: Sach) => void;
  onRequireLogin?: () => void;
}

export function BookDetailDrawer({
  book,
  user,
  onClose,
  onOpenKnowledgeMap,
  onRequireLogin,
}: BookDetailDrawerProps) {
  const [reserving, setReserving] = React.useState(false);
  const [copies, setCopies] = React.useState<BanSao[]>([]);
  const [digital, setDigital] = React.useState<TaiNguyenSo | null>(null);
  const [reviews, setReviews] = React.useState<DanhGiaSach[]>([]);
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState('');

  React.useEffect(() => {
    if (!book) return;
    operationalService
      .getBookExtras(book.MaSach)
      .then((res) => {
        setCopies(res.copies);
        setDigital(res.digital);
        setReviews(res.reviews);
      })
      .catch(() => {});
  }, [book]);

  React.useEffect(() => {
    if (!book) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [book, onClose]);

  if (!book) return null;

  const isAvailable = book.TinhTrang === 'Có sẵn';

  async function handleReserve() {
    if (!book) return;
    if (!user?.MaDocGia) {
      toast.info('Vui lòng đăng nhập tài khoản Độc giả để đặt trước sách.');
      onRequireLogin?.();
      return;
    }
    setReserving(true);
    try {
      const res = await reservationService.create(book.MaSach, user.MaDocGia);
      toast.success(`Đã đặt trước ${book.MaSach} (${res.TrangThai}).`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể đặt trước sách.');
    } finally {
      setReserving(false);
    }
  }

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

          <div className="grid grid-cols-1 gap-2.5 text-sm">
            {[
              { icon: BookOpen, label: 'Thể loại', value: book.TenTheLoai },
              { icon: Building2, label: 'Ngành học liên kết', value: book.TenNganh || 'Công nghệ thông tin' },
              { icon: User, label: 'Tác giả', value: book.TacGiaList.join(', ') },
              { icon: Calendar, label: 'Xuất bản', value: `${book.NhaXuatBan} · Năm ${book.NamXuatBan}` },
              { icon: Globe, label: 'Ngôn ngữ', value: book.NgonNgu || 'Tiếng Việt' },
              { icon: MapPin, label: 'Vị trí kệ sách', value: book.MaKeSach || 'Tầng 1 – Kho đọc mở' },
            ].map((row) => {
              const Icon = row.icon;
              return (
                <div key={row.label} className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
                  <Icon className="w-4 h-4 text-[#0054A6] shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-500">{row.label}</p>
                    <p className="text-sm font-medium text-slate-900 mt-0.5 break-words">{row.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Ngày tiếp nhận: {formatDateVN(book.NgayNhap)}</span>
            <span>Giá bìa: {formatVnd(book.TriGia)}</span>
          </div>

          {digital && (
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between gap-2">
              <div className="text-xs">
                <p className="font-semibold text-[#0054A6] flex items-center gap-1.5">
                  <FileDown className="w-3.5 h-3.5" /> Tài nguyên số ({digital.DinhDangFile})
                </p>
                <p className="text-slate-600 mt-0.5">
                  DRM {digital.ThoiHanDRM_Ngay} ngày · Tối đa {digital.SoLuotMuonDongThoi} lượt đồng thời
                </p>
              </div>
              <span className="text-[11px] font-mono text-sky-700 bg-white px-2 py-1 rounded border border-sky-200">
                {digital.MaTNS}
              </span>
            </div>
          )}

          {copies.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-700">Bản sao vật lý ({copies.length})</p>
              <div className="space-y-1">
                {copies.map((c) => (
                  <div key={c.MaBanSao} className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div>
                      <span className="font-mono font-semibold text-slate-800">{c.MaBanSao}</span>
                      <span className="text-slate-500 ml-2">{c.MaCN}</span>
                    </div>
                    <span className={c.TinhTrang === 'Sẵn sàng' ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>
                      {c.TinhTrang}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-700">Đánh giá độc giả ({reviews.length})</p>
            {reviews.map((rv) => (
              <div key={rv.MaDanhGia} className="p-2.5 rounded-lg bg-slate-50 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{rv.HoTenDocGia || rv.MaDocGia}</span>
                  <span className="text-amber-500 flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400" /> {rv.SoSao}/5
                  </span>
                </div>
                <p className="text-slate-600">{rv.NoiDung}</p>
              </div>
            ))}
            {user?.MaDocGia && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!comment.trim()) return;
                  try {
                    await operationalService.submitBookReview(book.MaSach, { SoSao: rating, NoiDung: comment });
                    toast.success('Đã gửi đánh giá tài liệu.');
                    setComment('');
                    const refreshed = await operationalService.getBookExtras(book.MaSach);
                    setReviews(refreshed.reviews);
                  } catch (err) {
                    toast.error(err instanceof Error ? err.message : 'Không thể gửi đánh giá.');
                  }
                }}
                className="flex gap-1.5 pt-1"
              >
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="h-8 px-2 rounded-lg border border-slate-200 text-xs bg-white"
                >
                  {[5, 4, 3, 2, 1].map((s) => (
                    <option key={s} value={s}>{s}★</option>
                  ))}
                </select>
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Viết nhận xét..."
                  className="flex-1 h-8 px-2.5 rounded-lg border border-slate-200 text-xs"
                />
                <Button type="submit" size="sm" variant="outline" className="h-8 text-xs">Gửi</Button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            className="flex-1 gap-1.5"
            disabled={reserving}
            onClick={handleReserve}
          >
            <BookmarkPlus className="w-4 h-4" />
            {reserving ? 'Đang đặt...' : 'Đặt trước sách'}
          </Button>
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={() => onOpenKnowledgeMap(book)}
          >
            <Network className="w-4 h-4" />
            Bản đồ
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </aside>
    </div>
  );
}
