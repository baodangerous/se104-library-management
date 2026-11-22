import * as React from 'react';
import { toast } from 'sonner';
import { reservationService } from '../../../services/reservationService';
import type { DatTruoc } from '../../../types/portal';
import { LoanFormCard } from './LoanFormCard';
import { LoanHistoryList } from './LoanHistoryList';
import { ReservationsQueueCard } from './ReservationsQueueCard';
import { useLoans } from './useLoans';

export function LoansPage() {
  const { readers, books, loans, thamSo, loading, createLoan, renewLoanItem } = useLoans();
  const [reservations, setReservations] = React.useState<DatTruoc[]>([]);

  const loadReservations = React.useCallback(() => {
    reservationService.list().then(setReservations).catch(() => {});
  }, []);

  React.useEffect(() => {
    loadReservations();
  }, [loadReservations, loans.length]);

  async function handleCancelReservation(maDatTruoc: string) {
    try {
      await reservationService.cancel(maDatTruoc);
      toast.success(`Đã hủy phiếu đặt trước ${maDatTruoc}.`);
      loadReservations();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể hủy đặt trước.');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Cho mượn sách
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {thamSo
            ? `Tối đa ${thamSo.SoSachMuonToiDa} quyển/độc giả · Hạn mượn ${thamSo.SoNgayMuonToiDa} ngày · Áp dụng cho thẻ còn hạn và không có sách quá hạn.`
            : 'Kiểm tra đủ điều kiện lưu thông trước khi xác nhận cho mượn.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <LoanFormCard
          readers={readers}
          books={books}
          thamSo={thamSo}
          onCreateLoan={createLoan}
        />
        <LoanHistoryList loans={loans} loading={loading} onRenewItem={renewLoanItem} />
      </div>

      <ReservationsQueueCard
        reservations={reservations}
        onCancel={handleCancelReservation}
      />
    </div>
  );
}
