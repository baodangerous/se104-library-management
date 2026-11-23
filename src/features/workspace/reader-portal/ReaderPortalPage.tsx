import * as React from 'react';
import { BookCopy, DoorOpen, GraduationCap, Network } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { Card, CardBody } from '../../../components/ui/card';
import { adminService, type ReaderProfileData } from '../../../services/adminService';
import { circulationService } from '../../../services/circulationService';
import { reservationService } from '../../../services/reservationService';
import { diffDaysIso, formatDateVn, todayIsoDate } from '../../../services/rules/dateUtils';
import type { DatTruoc } from '../../../types/portal';
import type { NavPageId } from '../layout/navConfig';
import { ReaderCardSummary } from './ReaderCardSummary';
import { ReaderHistoryTables } from './ReaderHistoryTables';
import { ReaderReservationsCard } from './ReaderReservationsCard';

export function ReaderPortalPage({ onNavigate }: { onNavigate: (page: NavPageId) => void }) {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Cổng thông tin Độc giả UIT</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi trạng thái thẻ, danh sách sách đang mượn, lịch sử trả và công nợ cá nhân.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => onNavigate('reader-services')}>
            <DoorOpen className="w-4 h-4" /> Đặt phòng &amp; Yêu cầu
          </Button>
          <Button variant="outline" size="sm" onClick={() => onNavigate('reader-majors')}>
            <GraduationCap className="w-4 h-4" /> Tài liệu theo ngành
          </Button>
          <Button variant="outline" size="sm" onClick={() => onNavigate('knowledge-map')}>
            <Network className="w-4 h-4" /> Bản đồ tri thức
          </Button>
          <Button size="sm" onClick={() => onNavigate('books')}>
            <BookCopy className="w-4 h-4" /> Tra cứu &amp; Đặt trước
          </Button>
        </div>
      </div>

      <ReaderCardSummary
        docGia={data.docGia}
        thamSo={data.thamSo}
        activeCount={activeLoans.length}
        overdueCount={overdueLoans.length}
        isExpired={isExpired}
      />

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
