import { ReturnFormCard } from './ReturnFormCard';
import { ReturnHistoryList } from './ReturnHistoryList';
import { useReturns } from './useReturns';

export function ReturnsPage() {
  const state = useReturns();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Nhận trả sách</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Ghi nhận trả sách, tự động tính tiền phạt quá hạn 1.000 ₫/ngày và cập nhật công nợ
          độc giả.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <ReturnFormCard
          readers={state.readers}
          selectedReaderId={state.selectedReaderId}
          selectedReader={state.selectedReader}
          activeItems={state.activeItems}
          selectedItemIds={state.selectedItemIds}
          ngayTra={state.ngayTra}
          loadingActive={state.loadingActive}
          submitting={state.submitting}
          estimatedTotalFine={state.estimatedTotalFine}
          onSelectReader={state.selectReader}
          onChangeNgayTra={state.setNgayTra}
          onToggleItem={state.toggleItem}
          onSubmit={state.submitReturn}
        />
        <ReturnHistoryList returnsList={state.returnsList} loading={state.loading} />
      </div>
    </div>
  );
}
