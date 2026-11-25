import * as React from 'react';
import { CheckCircle2, CreditCard, Plus, Scale } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { ModalDialog } from '../../../components/ui/dialog';
import { FieldLabel, SelectInput, TextInput } from '../../../components/ui/input';
import { SegmentedTabs } from '../../../components/ui/segmented-tabs';
import { WorkspacePageHeader } from '../../../components/ui/workspace-header';
import { operationalService } from '../../../services/operationalService';
import { formatVnd as formatCurrency } from '../../../lib/utils';
import type { GiaoDichThanhToan, PhieuDieuChinh, UserRole } from '../../../types/library';
import { FineFormCard } from './FineFormCard';
import { FineHistoryTable } from './FineHistoryTable';
import { useFines } from './useFines';

export function FinesPage({ userRole }: { userRole?: UserRole }) {
  const state = useFines();
  const [tab, setTab] = React.useState<'collect' | 'reconcile'>('collect');
  const [reconcileData, setReconcileData] = React.useState<{
    totalSystemCash: number;
    totalOnline: number;
    totalApprovedAdjustments: number;
    netReconciled: number;
    onlineTransactions: GiaoDichThanhToan[];
    adjustments: PhieuDieuChinh[];
  } | null>(null);
  const [openAdj, setOpenAdj] = React.useState(false);
  const [adjType, setAdjType] = React.useState<'PhieuPhat' | 'PhieuBoiThuong' | 'GiaoDichThanhToan'>('PhieuPhat');
  const [adjRef, setAdjRef] = React.useState('');
  const [adjAmount, setAdjAmount] = React.useState('0');
  const [adjReason, setAdjReason] = React.useState('');

  const loadReconcile = React.useCallback(async () => {
    try {
      const data = await operationalService.getFinanceReconcile();
      setReconcileData(data);
    } catch {
      // Ignore if unauthorized
    }
  }, []);

  React.useEffect(() => {
    if (tab === 'reconcile') void loadReconcile();
  }, [tab, loadReconcile]);

  async function handleCreateAdj(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await operationalService.createAdjustment({
        LoaiChungTu: adjType,
        MaChungTuGoc: adjRef,
        SoTienDieuChinh: Number(adjAmount),
        LyDo: adjReason,
      });
      toast.success(`Đã lập phiếu điều chỉnh ${res.MaPhieuDieuChinh}.`);
      setOpenAdj(false);
      setAdjRef('');
      setAdjReason('');
      await loadReconcile();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi lập phiếu điều chỉnh.');
    }
  }

  async function handleDecideAdj(maPhieu: string, decision: 'Đã duyệt' | 'Từ chối') {
    try {
      await operationalService.decideAdjustment(maPhieu, decision);
      toast.success(`Phiếu điều chỉnh ${maPhieu}: ${decision}.`);
      await loadReconcile();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi duyệt phiếu điều chỉnh.');
    }
  }

  return (
    <div className="space-y-6">
      <WorkspacePageHeader
        eyebrow="Lưu thông & Tài chính"
        title="Tài chính, Thu phạt & Đối soát"
        description="Ghi nhận thu phạt tại quầy, đối soát giao dịch trực tuyến và lập phiếu điều chỉnh chứng từ đã chốt."
        actions={
          tab === 'reconcile' ? (
            <Button variant="primary" size="sm" onClick={() => setOpenAdj(true)} className="gap-1.5">
              <Plus className="w-4 h-4" /> Lập phiếu điều chỉnh
            </Button>
          ) : null
        }
      />

      <SegmentedTabs
        value={tab}
        onChange={setTab}
        items={[
          { id: 'collect', label: 'Thu tiền phạt tại quầy', icon: CreditCard },
          { id: 'reconcile', label: 'Đối soát thu – chi & Phiếu điều chỉnh', icon: Scale },
        ]}
      />

      {tab === 'collect' ? (
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
      ) : (
        <div className="space-y-5">
          {reconcileData && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-500">Thu tại quầy</p>
                <p className="text-lg font-bold text-slate-900 mt-1">{formatCurrency(reconcileData.totalSystemCash)}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-500">Cổng thanh toán online</p>
                <p className="text-lg font-bold text-[#0054A6] mt-1">{formatCurrency(reconcileData.totalOnline)}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-500">Bút toán điều chỉnh duyệt</p>
                <p className="text-lg font-bold text-amber-600 mt-1">{formatCurrency(reconcileData.totalApprovedAdjustments)}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-500">Tổng thực thu sau đối soát</p>
                <p className="text-lg font-bold text-emerald-600 mt-1">{formatCurrency(reconcileData.netReconciled)}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
            <div className="px-4 py-3 border-b border-slate-200 font-semibold text-sm text-slate-900">
              Phiếu điều chỉnh chứng từ tài chính (Quy trình phê duyệt #5)
            </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Mã phiếu</th>
                  <th className="px-4 py-2.5">Chứng từ gốc</th>
                  <th className="px-4 py-2.5 text-right">Số tiền điều chỉnh</th>
                  <th className="px-4 py-2.5">Lý do</th>
                  <th className="px-4 py-2.5">Trạng thái</th>
                  <th className="px-4 py-2.5 text-right">Phê duyệt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reconcileData?.adjustments.map((a) => (
                  <tr key={a.MaPhieuDieuChinh}>
                    <td className="px-4 py-2.5 font-mono font-semibold">{a.MaPhieuDieuChinh}</td>
                    <td className="px-4 py-2.5 text-xs">{a.LoaiChungTu} · <span className="font-mono">{a.MaChungTuGoc}</span></td>
                    <td className="px-4 py-2.5 text-right font-semibold">{formatCurrency(a.SoTienDieuChinh)}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">{a.LyDo}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant={a.TrangThai === 'Đã duyệt' ? 'success' : a.TrangThai === 'Từ chối' ? 'danger' : 'warning'}>
                        {a.TrangThai}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-right space-x-1">
                      {a.TrangThai === 'Chờ duyệt' && userRole === 'HEAD_LIBRARIAN' && (
                        <>
                          <Button size="sm" variant="primary" onClick={() => handleDecideAdj(a.MaPhieuDieuChinh, 'Đã duyệt')} className="text-xs gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Duyệt
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDecideAdj(a.MaPhieuDieuChinh, 'Từ chối')} className="text-xs">
                            Từ chối
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {(!reconcileData || reconcileData.adjustments.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-xs text-slate-400">
                      Chưa có phiếu điều chỉnh nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ModalDialog open={openAdj} onOpenChange={setOpenAdj} title="Lập phiếu điều chỉnh chứng từ đã chốt">
        <form onSubmit={handleCreateAdj} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel required>Loại chứng từ gốc</FieldLabel>
              <SelectInput value={adjType} onChange={(e) => setAdjType(e.target.value as typeof adjType)}>
                <option value="PhieuPhat">Phiếu thu/phạt</option>
                <option value="PhieuBoiThuong">Phiếu bồi thường</option>
                <option value="GiaoDichThanhToan">Giao dịch online</option>
              </SelectInput>
            </div>
            <div>
              <FieldLabel required>Mã chứng từ gốc</FieldLabel>
              <TextInput value={adjRef} onChange={(e) => setAdjRef(e.target.value)} required placeholder="VD: PTH001" />
            </div>
          </div>
          <div>
            <FieldLabel required>Số tiền điều chỉnh (+/- VNĐ)</FieldLabel>
            <TextInput type="number" value={adjAmount} onChange={(e) => setAdjAmount(e.target.value)} required />
          </div>
          <div>
            <FieldLabel required>Lý do điều chỉnh</FieldLabel>
            <TextInput value={adjReason} onChange={(e) => setAdjReason(e.target.value)} required placeholder="VD: Thủ thư nhập nhầm số tiền thực thu" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpenAdj(false)}>Huỷ</Button>
            <Button type="submit" variant="primary">Gửi phê duyệt</Button>
          </div>
        </form>
      </ModalDialog>
    </div>
  );
}
