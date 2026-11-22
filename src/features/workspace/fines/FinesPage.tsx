import { FineFormCard } from './FineFormCard';
import { FineHistoryTable } from './FineHistoryTable';
import { useFines } from './useFines';

export function FinesPage() {
  const state = useFines();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Thu tiền phạt quá hạn</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Ghi nhận thanh toán tiền phạt; số tiền thu phải lớn hơn 0 và không vượt quá tổng nợ
          hiện tại của độc giả.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <FineFormCard
          indebtedReaders={state.indebtedReaders}
          selectedReaderId={state.selectedReaderId}
          selectedReader={state.selectedReader}
          ngayThu={state.ngayThu}
          soTienThu={state.soTienThu}
          submitting={state.submitting}
          paymentValidation={state.paymentValidation}
          onSelectReader={state.selectReader}
          onChangeNgayThu={state.setNgayThu}
          onChangeSoTienThu={state.setSoTienThu}
          onFillFullDebt={state.fillFullDebt}
          onSubmit={state.submitReceipt}
        />
        <FineHistoryTable receipts={state.receipts} loading={state.loading} />
      </div>
    </div>
  );
}
