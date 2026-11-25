import { WorkspacePageHeader } from '../../../components/ui/workspace-header';
import { ReturnFormCard } from './ReturnFormCard';
import { ReturnHistoryList } from './ReturnHistoryList';
import { useReturns } from './useReturns';

export function ReturnsPage() {
  const state = useReturns();

  return (
    <div className="space-y-6">
      <WorkspacePageHeader
        eyebrow="Lưu thông & Tài chính"
        title="Nhận trả sách"
        description="Ghi nhận trả sách, tự động tính tiền phạt quá hạn 1.000 ₫/ngày và đồng bộ trạng thái bản sao."
      />

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
