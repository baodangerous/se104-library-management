import * as React from 'react';
import { BookCopy, DoorOpen, GraduationCap, IdCard, Network, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardBody } from '../../../components/ui/card';
import { adminService, type ReaderProfileData } from '../../../services/adminService';
import { circulationService } from '../../../services/circulationService';
import { reservationService } from '../../../services/reservationService';
import { diffDaysIso, formatDateVn, todayIsoDate } from '../../../services/rules/dateUtils';
import type { Sach } from '../../../types/library';
import type { DatTruoc } from '../../../types/portal';
import { FeaturedBooksCarousel } from '../../portal/FeaturedBooksCarousel';
import type { NavPageId } from '../layout/navConfig';
import { ReaderCardSummary } from './ReaderCardSummary';
import { ReaderHistoryTables } from './ReaderHistoryTables';
import { ReaderReservationsCard } from './ReaderReservationsCard';

export function ReaderPortalPage({
  books = [],
  onSelectBook,
  onNavigate,
}: {
  books?: Sach[];
  onSelectBook?: (book: Sach) => void;
  onNavigate: (page: NavPageId) => void;
}) {
  const [data, setData] = React.useState<ReaderProfileData | null>(null);
  const [reservations, setReservations] = React.useState<DatTruoc[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadProfile = React.useCallback(() => {
    setLoading(true);
    Promise.all([adminService.getReaderProfile(), reservationService.list()])
      .then(([profile, resList]) => {
        setData(profile);
        setReservations(resList);
      })
      .catch((err) =>
        toast.error(err instanceof Error ? err.message : 'Lỗi tải hồ sơ độc giả')
      )
      .finally(() => setLoading(false));
  }, []);

  async function handleCancelReservation(maDatTruoc: string) {
    try {
      await reservationService.cancel(maDatTruoc);
      toast.success(`Đã hủy phiếu đặt trước ${maDatTruoc}.`);
      loadProfile();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể hủy đặt trước.');
    }
  }

  React.useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function handleRenewLoan(maChiTietMuon: number) {
    try {
      const res = await circulationService.renewLoanItem(maChiTietMuon);
      toast.success(
        `Gia hạn sách thành công đến ${formatDateVn(res.HanTraMoi)} (lần ${res.SoLanGiaHan}/2).`
      );
      loadProfile();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể gia hạn sách.');
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        Đang tải thông tin thẻ độc giả...
      </div>
    );
  }

  if (!data || !data.docGia) {
    return (
      <Card>
        <CardBody className="py-10 text-center text-sm text-slate-500">
          Tài khoản chưa được liên kết với thẻ độc giả. Vui lòng liên hệ Quầy Thủ thư UIT.
        </CardBody>
      </Card>
    );
  }

  const today = todayIsoDate();
  const activeLoans = data.lichSuMuon.filter((l) => !l.DaTra);
  const overdueLoans = activeLoans.filter((l) => diffDaysIso(today, l.HanTra) > 0);
  const isExpired = diffDaysIso(data.docGia.NgayHetHan, today) < 0;
  const featuredBooks = React.useMemo(
    () =>
      [...books]
        .sort((a, b) => Number(Boolean(b.AnhBia)) - Number(Boolean(a.AnhBia)))
        .slice(0, 12),
    [books]
  );

  return (
    <div className="space-y-6">
      {/* Vibrant Student Portal Hero Banner */}
      <section
        className="relative overflow-hidden rounded-2xl border border-[#1556d6]/30 shadow-lg p-6 sm:p-8 text-white"
        style={{
          background: 'linear-gradient(135deg, #030a24 0%, #0a2b86 58%, #1556d6 100%)',
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="pointer-events-none absolute -top-24 -right-20 w-72 h-72 rounded-full bg-[#4de1ff]/15 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 w-64 h-64 rounded-full bg-[#6366f1]/20 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 border border-white/20 font-medium text-[#8fefff]">
                <IdCard className="w-3.5 h-3.5" />
                Thẻ {data.docGia.MaDocGia}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                  isExpired
                    ? 'bg-rose-500/25 text-rose-100 border border-rose-300/30'
                    : 'bg-emerald-500/25 text-emerald-100 border border-emerald-300/30'
                }`}
              >
                {isExpired ? 'Thẻ hết hạn' : 'Đang hoạt động'} · HSD {formatDateVn(data.docGia.NgayHetHan)}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Xin chào, <span className="text-[#4de1ff]">{data.docGia.HoTen}</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#c3d6fa]">
              Tra cứu học liệu, gia hạn sách trực tuyến, đặt trước tài liệu, đăng ký phòng học nhóm A2.01 / A2.02 và theo dõi công nợ cá nhân.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('books')}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white text-[#0054A6] font-semibold text-xs shadow-sm hover:bg-sky-50 transition-colors cursor-pointer"
            >
              <BookCopy className="w-4 h-4 shrink-0" />
              <span>Tra cứu &amp; Đặt trước</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('reader-services')}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-semibold text-xs backdrop-blur-xs transition-colors cursor-pointer"
            >
              <DoorOpen className="w-4 h-4 shrink-0 text-[#4de1ff]" />
              <span>Đặt phòng &amp; Yêu cầu</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('reader-majors')}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/12 hover:bg-white/22 border border-white/20 text-white font-medium text-xs backdrop-blur-xs transition-colors cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 shrink-0 text-[#4de1ff]" />
              <span>Tài liệu theo ngành</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('knowledge-map')}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/12 hover:bg-white/22 border border-white/20 text-white font-medium text-xs backdrop-blur-xs transition-colors cursor-pointer"
            >
              <Network className="w-4 h-4 shrink-0 text-[#4de1ff]" />
              <span>Bản đồ tri thức</span>
            </button>
          </div>
        </div>
      </section>

      <ReaderCardSummary
        docGia={data.docGia}
        thamSo={data.thamSo}
        activeCount={activeLoans.length}
        overdueCount={overdueLoans.length}
        isExpired={isExpired}
      />

      {featuredBooks.length > 0 && onSelectBook ? (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0054A6] px-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gợi ý giáo trình &amp; tài liệu nổi bật — bấm để xem chi tiết hoặc đặt trước</span>
          </div>
          <FeaturedBooksCarousel
            books={featuredBooks}
            onSelectBook={onSelectBook}
            onViewAll={() => onNavigate('books')}
          />
        </div>
      ) : null}

      <ReaderHistoryTables
        lichSuMuon={data.lichSuMuon}
        phieuThuPhat={data.phieuThuPhat}
        today={today}
        isCardExpired={isExpired}
        onRenewLoan={handleRenewLoan}
      />

      <ReaderReservationsCard
        reservations={reservations}
        onCancel={handleCancelReservation}
      />
    </div>
  );
}
