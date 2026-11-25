import * as React from 'react';
import { ArrowLeftRight, CheckCircle2, PackageCheck, Plus, Truck, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { ModalDialog } from '../../../components/ui/dialog';
import { FieldLabel, SelectInput } from '../../../components/ui/input';
import { WorkspacePageHeader } from '../../../components/ui/workspace-header';
import { operationalService } from '../../../services/operationalService';
import type { BanSao, ChiNhanh, PhieuDieuChuyen, UserRole } from '../../../types/library';

export function TransfersPage({ userRole }: { userRole: UserRole }) {
  const [transfers, setTransfers] = React.useState<PhieuDieuChuyen[]>([]);
  const [branches, setBranches] = React.useState<ChiNhanh[]>([]);
  const [copies, setCopies] = React.useState<BanSao[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [selectedCopy, setSelectedCopy] = React.useState('');
  const [targetBranch, setTargetBranch] = React.useState('CN02');

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const [trf, br, cp] = await Promise.all([
        operationalService.listTransfers(),
        operationalService.getBranches(),
        operationalService.listCopies(),
      ]);
      setTransfers(trf);
      setBranches(br.branches);
      const ready = cp.filter((c) => c.TinhTrang === 'Sẵn sàng');
      setCopies(ready);
      if (ready[0] && !selectedCopy) setSelectedCopy(ready[0].MaBanSao);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể tải danh sách điều chuyển.');
    } finally {
      setLoading(false);
    }
  }, [selectedCopy]);

  React.useEffect(() => {
    void load();
  }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await operationalService.createTransfer({
        MaBanSao: selectedCopy,
        ChiNhanhNhan: targetBranch,
      });
      toast.success(`Đã lập phiếu điều chuyển ${res.SoPhieuDC}.`);
      setOpenCreate(false);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể tạo phiếu điều chuyển.');
    }
  }

  async function handleTransition(
    soPhieu: string,
    nextStatus: 'Đã duyệt' | 'Từ chối' | 'Đã xuất kho' | 'Đã nhập kho' | 'Thất lạc'
  ) {
    try {
      await operationalService.transitionTransfer(soPhieu, nextStatus);
      toast.success(`Phiếu ${soPhieu} đã chuyển sang trạng thái "${nextStatus}".`);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Thao tác thất bại.');
    }
  }

  const canApprove = userRole === 'HEAD_LIBRARIAN';

  return (
    <div className="space-y-6">
      <WorkspacePageHeader
        eyebrow="Lưu thông Liên chi nhánh"
        title="Điều chuyển tài liệu giữa chi nhánh"
        description="Theo dõi vòng đời 7 bước (QĐ29): chi nhánh quản lý bản sao chỉ cập nhật khi xác nhận nhập kho."
        actions={
          <Button variant="primary" size="sm" onClick={() => setOpenCreate(true)} className="gap-1.5">
            <Plus className="w-4 h-4" /> Lập phiếu điều chuyển
          </Button>
        }
      />

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-500">
          Đang tải phiếu điều chuyển...
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Số phiếu</th>
                <th className="px-4 py-3">Bản sao &amp; Sách</th>
                <th className="px-4 py-3">Lộ trình</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác vòng đời</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transfers.map((t) => (
                <tr key={t.SoPhieuDC} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono font-semibold text-slate-900">
                    {t.SoPhieuDC}
                    <div className="text-[11px] font-normal text-slate-400">{t.NgayLap}</div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{t.TenSach}</p>
                    <p className="text-xs font-mono text-slate-500">{t.MaBanSao}</p>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span className="font-semibold">{t.ChiNhanhGui}</span>
                    <ArrowLeftRight className="w-3 h-3 inline mx-1.5 text-slate-400" />
                    <span className="font-semibold text-[#0054A6]">{t.ChiNhanhNhan}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        t.TrangThai === 'Đã nhập kho' || t.TrangThai === 'Hoàn tất'
                          ? 'success'
                          : t.TrangThai === 'Thất lạc' || t.TrangThai === 'Từ chối'
                            ? 'danger'
                            : 'warning'
                      }
                    >
                      {t.TrangThai}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right space-x-1.5">
                    {t.TrangThai === 'Chờ duyệt' && canApprove && (
                      <>
                        <Button size="sm" variant="primary" onClick={() => handleTransition(t.SoPhieuDC, 'Đã duyệt')} className="text-xs gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Duyệt
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleTransition(t.SoPhieuDC, 'Từ chối')} className="text-xs gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Từ chối
                        </Button>
                      </>
                    )}
                    {t.TrangThai === 'Đã duyệt' && (
                      <Button size="sm" variant="outline" onClick={() => handleTransition(t.SoPhieuDC, 'Đã xuất kho')} className="text-xs gap-1">
                        <Truck className="w-3.5 h-3.5" /> Xác nhận xuất kho
                      </Button>
                    )}
                    {t.TrangThai === 'Đã xuất kho' && (
                      <>
                        <Button size="sm" variant="primary" onClick={() => handleTransition(t.SoPhieuDC, 'Đã nhập kho')} className="text-xs gap-1">
                          <PackageCheck className="w-3.5 h-3.5" /> Xác nhận nhập kho
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleTransition(t.SoPhieuDC, 'Thất lạc')} className="text-xs">
                          Báo thất lạc
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ModalDialog open={openCreate} onOpenChange={setOpenCreate} title="Lập yêu cầu điều chuyển bản sao">
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <FieldLabel required>Chọn bản sao khả dụng</FieldLabel>
            <SelectInput value={selectedCopy} onChange={(e) => setSelectedCopy(e.target.value)}>
              {copies.slice(0, 80).map((c) => (
                <option key={c.MaBanSao} value={c.MaBanSao}>
                  {c.MaBanSao} ({c.MaCN}) — {c.TenSach}
                </option>
              ))}
            </SelectInput>
          </div>
          <div>
            <FieldLabel required>Chi nhánh nhận</FieldLabel>
            <SelectInput value={targetBranch} onChange={(e) => setTargetBranch(e.target.value)}>
              {branches.map((b) => (
                <option key={b.MaCN} value={b.MaCN}>{b.MaCN} — {b.TenCN}</option>
              ))}
            </SelectInput>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpenCreate(false)}>Huỷ</Button>
            <Button type="submit" variant="primary">Gửi yêu cầu</Button>
          </div>
        </form>
      </ModalDialog>
    </div>
  );
}

