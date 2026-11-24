import * as React from 'react';
import { CheckCircle2, ClipboardCheck, Plus, ShieldAlert, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { ModalDialog } from '../../../components/ui/dialog';
import { FieldLabel, SelectInput, TextInput } from '../../../components/ui/input';
import { operationalService } from '../../../services/operationalService';
import { formatVnd as formatCurrency } from '../../../lib/utils';
import type { BanSao, BienBanKiemKe, ChiNhanh, PhieuBoiThuong, PhieuThanhLy, UserRole } from '../../../types/library';

export function InventoryDisposalPage({ userRole }: { userRole: UserRole }) {
  const [tab, setTab] = React.useState<'inventory' | 'disposal' | 'compensation'>('inventory');
  const [sessions, setSessions] = React.useState<BienBanKiemKe[]>([]);
  const [disposals, setDisposals] = React.useState<PhieuThanhLy[]>([]);
  const [compensations, setCompensations] = React.useState<PhieuBoiThuong[]>([]);
  const [branches, setBranches] = React.useState<ChiNhanh[]>([]);
  const [copies, setCopies] = React.useState<BanSao[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [openInv, setOpenInv] = React.useState(false);
  const [invBranch, setInvBranch] = React.useState('CN01');
  const [invBookId, setInvBookId] = React.useState('S001');
  const [invActualQty, setInvActualQty] = React.useState('1');

  const [openDisp, setOpenDisp] = React.useState(false);
  const [dispCopy, setDispCopy] = React.useState('');
  const [dispReason, setDispReason] = React.useState('');

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const [inv, br, cp] = await Promise.all([
        operationalService.getInventoryOverview(),
        operationalService.getBranches(),
        operationalService.listCopies(),
      ]);
      setSessions(inv.sessions);
      setDisposals(inv.disposals);
      setCompensations(inv.compensations);
      setBranches(br.branches);
      setCopies(cp);
      if (cp[0] && !dispCopy) setDispCopy(cp[0].MaBanSao);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể tải dữ liệu kiểm kê.');
    } finally {
      setLoading(false);
    }
  }, [dispCopy]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const canApprove = userRole === 'HEAD_LIBRARIAN';

  async function handleCreateInv(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await operationalService.createInventorySession({
        MaCN: invBranch,
        ChiTiet: [{ MaSach: invBookId.trim(), SoLuongThucTe: Number(invActualQty) }],
      });
      toast.success(`Đã lập biên bản kiểm kê ${res.MaBBKK}.`);
      setOpenInv(false);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi lập biên bản kiểm kê.');
    }
  }

  async function handleApproveInv(maBBKK: string) {
    try {
      await operationalService.approveInventory(maBBKK);
      toast.success(`Đã phê duyệt điều chỉnh tồn kho ${maBBKK}.`);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi phê duyệt kiểm kê.');
    }
  }

  async function handleCreateDisp(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await operationalService.createDisposal({
        MaBanSao: dispCopy,
        LyDo: dispReason,
      });
      toast.success(`Đã gửi đề xuất thanh lý ${res.SoPhieuTL}.`);
      setOpenDisp(false);
      setDispReason('');
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi đề xuất thanh lý.');
    }
  }

  async function handleDecideDisp(soPhieu: string, decision: 'Đã duyệt' | 'Từ chối') {
    try {
      await operationalService.decideDisposal(soPhieu, decision);
      toast.success(`Phiếu thanh lý ${soPhieu}: ${decision}.`);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi duyệt thanh lý.');
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Kiểm kê, Thanh lý &amp; Bồi thường</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Đối chiếu tồn kho theo chi nhánh, phê duyệt thanh lý bản sao hỏng/mất và theo dõi bồi thường.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpenDisp(true)} className="gap-1.5">
            <Trash2 className="w-4 h-4" /> Đề xuất thanh lý
          </Button>
          <Button variant="primary" size="sm" onClick={() => setOpenInv(true)} className="gap-1.5">
            <Plus className="w-4 h-4" /> Tạo phiên kiểm kê
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'inventory', label: `Kiểm kê (${sessions.length})`, icon: ClipboardCheck },
          { id: 'disposal', label: `Thanh lý (${disposals.length})`, icon: Trash2 },
          { id: 'compensation', label: `Bồi thường (${compensations.length})`, icon: ShieldAlert },
        ].map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id as typeof tab)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                active ? 'bg-[#0054A6] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {item.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-500">
          Đang tải dữ liệu...
        </div>
      ) : tab === 'inventory' ? (
        <div className="space-y-3">
          {sessions.map((s) => (
            <div key={s.MaBBKK} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="font-mono font-bold text-sm text-slate-900">{s.MaBBKK}</span>
                  <span className="text-xs text-slate-500 ml-2">
                    {s.TenCN} · {s.NgayKiemKe} · {s.NguoiThucHien}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={s.TrangThai === 'Đã duyệt điều chỉnh' ? 'success' : 'warning'}>{s.TrangThai}</Badge>
                  {s.TrangThai === 'Chờ duyệt' && canApprove && (
                    <Button size="sm" variant="primary" onClick={() => handleApproveInv(s.MaBBKK)} className="text-xs gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Duyệt điều chỉnh
                    </Button>
                  )}
                </div>
              </div>
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Mã sách</th>
                    <th className="px-3 py-2">Tên tài liệu</th>
                    <th className="px-3 py-2 text-right">Hệ thống</th>
                    <th className="px-3 py-2 text-right">Thực tế</th>
                    <th className="px-3 py-2 text-right">Chênh lệch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {s.ChiTiet.map((c) => (
                    <tr key={c.MaSach}>
                      <td className="px-3 py-2 font-mono">{c.MaSach}</td>
                      <td className="px-3 py-2">{c.TenSach}</td>
                      <td className="px-3 py-2 text-right">{c.SoLuongHeThong}</td>
                      <td className="px-3 py-2 text-right font-semibold">{c.SoLuongThucTe}</td>
                      <td className={`px-3 py-2 text-right font-bold ${c.ChenhLech !== 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {c.ChenhLech > 0 ? `+${c.ChenhLech}` : c.ChenhLech}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          {sessions.length === 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-400">
              Chưa có biên bản kiểm kê nào.
            </div>
          )}
        </div>
      ) : tab === 'disposal' ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Số phiếu</th>
                <th className="px-4 py-3">Bản sao / Sách</th>
                <th className="px-4 py-3">Lý do</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Phê duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {disposals.map((d) => (
                <tr key={d.SoPhieuTL}>
                  <td className="px-4 py-3 font-mono font-semibold">{d.SoPhieuTL}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{d.TenSach}</p>
                    <p className="text-xs font-mono text-slate-500">{d.MaBanSao}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{d.LyDo}</td>
                  <td className="px-4 py-3">
                    <Badge variant={d.TrangThai === 'Đã duyệt' ? 'success' : d.TrangThai === 'Từ chối' ? 'danger' : 'warning'}>
                      {d.TrangThai}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right space-x-1.5">
                    {d.TrangThai === 'Chờ duyệt' && canApprove && (
                      <>
                        <Button size="sm" variant="primary" onClick={() => handleDecideDisp(d.SoPhieuTL, 'Đã duyệt')} className="text-xs">Duyệt</Button>
                        <Button size="sm" variant="outline" onClick={() => handleDecideDisp(d.SoPhieuTL, 'Từ chối')} className="text-xs">Từ chối</Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {disposals.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-xs text-slate-400">Chưa có đề xuất thanh lý nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Số phiếu BT</th>
                <th className="px-4 py-3">Độc giả</th>
                <th className="px-4 py-3">Bản sao / Sự cố</th>
                <th className="px-4 py-3 text-right">Tổng bồi thường</th>
                <th className="px-4 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {compensations.map((c) => (
                <tr key={c.SoPhieuBT}>
                  <td className="px-4 py-3 font-mono font-semibold">{c.SoPhieuBT}</td>
                  <td className="px-4 py-3">{c.HoTenDocGia} ({c.MaDocGia})</td>
                  <td className="px-4 py-3 text-xs">{c.MaBanSao} · <Badge variant="danger">{c.LoaiSuCo}</Badge></td>
                  <td className="px-4 py-3 text-right font-semibold">{formatCurrency(c.TongBoiThuong)}</td>
                  <td className="px-4 py-3"><Badge variant={c.TrangThai === 'Đã thu' ? 'success' : 'warning'}>{c.TrangThai}</Badge></td>
                </tr>
              ))}
              {compensations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-xs text-slate-400">Chưa có phiếu bồi thường nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ModalDialog open={openInv} onOpenChange={setOpenInv} title="Tạo phiên kiểm kê chi nhánh">
        <form onSubmit={handleCreateInv} className="space-y-3">
          <div>
            <FieldLabel required>Chi nhánh kiểm kê</FieldLabel>
            <SelectInput value={invBranch} onChange={(e) => setInvBranch(e.target.value)}>
              {branches.map((b) => <option key={b.MaCN} value={b.MaCN}>{b.MaCN} — {b.TenCN}</option>)}
            </SelectInput>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel required>Mã sách kiểm kê</FieldLabel>
              <TextInput value={invBookId} onChange={(e) => setInvBookId(e.target.value)} required />
            </div>
            <div>
              <FieldLabel required>Số lượng thực tế</FieldLabel>
              <TextInput type="number" min={0} value={invActualQty} onChange={(e) => setInvActualQty(e.target.value)} required />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpenInv(false)}>Huỷ</Button>
            <Button type="submit" variant="primary">Lưu biên bản</Button>
          </div>
        </form>
      </ModalDialog>

      <ModalDialog open={openDisp} onOpenChange={setOpenDisp} title="Đề xuất thanh lý bản sao">
        <form onSubmit={handleCreateDisp} className="space-y-3">
          <div>
            <FieldLabel required>Bản sao</FieldLabel>
            <SelectInput value={dispCopy} onChange={(e) => setDispCopy(e.target.value)}>
              {copies.slice(0, 80).map((c) => (
                <option key={c.MaBanSao} value={c.MaBanSao}>{c.MaBanSao} — {c.TenSach}</option>
              ))}
            </SelectInput>
          </div>
          <div>
            <FieldLabel required>Lý do thanh lý</FieldLabel>
            <TextInput value={dispReason} onChange={(e) => setDispReason(e.target.value)} required placeholder="VD: Hư hỏng nặng, rách bìa mất trang" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpenDisp(false)}>Huỷ</Button>
            <Button type="submit" variant="primary">Gửi đề xuất</Button>
          </div>
        </form>
      </ModalDialog>
    </div>
  );
}
