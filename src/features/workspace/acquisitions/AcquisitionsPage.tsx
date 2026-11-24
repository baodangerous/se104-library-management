import * as React from 'react';
import { Building2, CheckCircle2, FileCheck2, PackagePlus, Plus, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { ModalDialog } from '../../../components/ui/dialog';
import { FieldLabel, SelectInput, TextInput } from '../../../components/ui/input';
import { operationalService } from '../../../services/operationalService';
import { formatVnd as formatCurrency } from '../../../lib/utils';
import type { DonDatMua, KeHoachMuaSam, NhaCungCap, PhieuTiepNhan, UserRole } from '../../../types/library';

export function AcquisitionsPage({ userRole }: { userRole: UserRole }) {
  const [tab, setTab] = React.useState<'plans' | 'orders' | 'suppliers' | 'receipts'>('plans');
  const [plans, setPlans] = React.useState<KeHoachMuaSam[]>([]);
  const [suppliers, setSuppliers] = React.useState<NhaCungCap[]>([]);
  const [orders, setOrders] = React.useState<DonDatMua[]>([]);
  const [receipts, setReceipts] = React.useState<PhieuTiepNhan[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [openPlan, setOpenPlan] = React.useState(false);
  const [planName, setPlanName] = React.useState('');
  const [planBudget, setPlanBudget] = React.useState('30000000');

  const [openOrder, setOpenOrder] = React.useState(false);
  const [orderPlan, setOrderPlan] = React.useState('');
  const [orderSupplier, setOrderSupplier] = React.useState('');
  const [orderTitle, setOrderTitle] = React.useState('');
  const [orderQty, setOrderQty] = React.useState('5');
  const [orderPrice, setOrderPrice] = React.useState('250000');

  const [openReceive, setOpenReceive] = React.useState<DonDatMua | null>(null);
  const [recvQty, setRecvQty] = React.useState('0');
  const [recvCond, setRecvCond] = React.useState<'Đạt' | 'Thiếu' | 'Thừa' | 'Lỗi chất lượng'>('Đạt');
  const [recvNote, setRecvNote] = React.useState('');

  const [openSupplier, setOpenSupplier] = React.useState(false);
  const [supName, setSupName] = React.useState('');
  const [supPhone, setSupPhone] = React.useState('');
  const [supEmail, setSupEmail] = React.useState('');

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await operationalService.getAcquisitions();
      setPlans(data.plans);
      setSuppliers(data.suppliers);
      setOrders(data.orders);
      setReceipts(data.receipts);
      if (data.plans[0] && !orderPlan) setOrderPlan(data.plans[0].MaKeHoach);
      if (data.suppliers[0] && !orderSupplier) setOrderSupplier(data.suppliers[0].MaNCC);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể tải dữ liệu bổ sung.');
    } finally {
      setLoading(false);
    }
  }, [orderPlan, orderSupplier]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const canApprovePlan = userRole === 'HEAD_LIBRARIAN';

  async function handleCreatePlan(e: React.FormEvent) {
    e.preventDefault();
    try {
      await operationalService.createPlan({
        TenKeHoach: planName,
        NganSach: Number(planBudget),
        NgayBatDau: new Date().toISOString().slice(0, 10),
      });
      toast.success('Đã tạo kế hoạch mua sắm mới.');
      setOpenPlan(false);
      setPlanName('');
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi tạo kế hoạch.');
    }
  }

  async function handleCreateOrder(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await operationalService.createOrder({
        MaKeHoach: orderPlan,
        MaNCC: orderSupplier,
        ChiTiet: [
          {
            TenTaiLieuDat: orderTitle,
            SoLuongDat: Number(orderQty),
            DonGia: Number(orderPrice),
          },
        ],
      });
      toast.success(`Đã lập đơn đặt mua ${res.MaDonDatMua} (${formatCurrency(res.TongTien)}).`);
      setOpenOrder(false);
      setOrderTitle('');
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi lập đơn đặt mua.');
    }
  }

  async function handleReceive(e: React.FormEvent) {
    e.preventDefault();
    if (!openReceive) return;
    try {
      const res = await operationalService.receiveOrder({
        MaDonDatMua: openReceive.MaDonDatMua,
        SoLuongThucNhan: Number(recvQty),
        TinhTrangHang: recvCond,
        GhiChuChenhLech: recvNote || undefined,
      });
      toast.success(`Đã lập phiếu tiếp nhận ${res.MaPhieuTiepNhan} (${res.TrangThaiDon}).`);
      setOpenReceive(null);
      setRecvNote('');
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi tiếp nhận hàng.');
    }
  }

  async function handleCreateSupplier(e: React.FormEvent) {
    e.preventDefault();
    try {
      await operationalService.createSupplier({
        TenNCC: supName,
        SDT: supPhone,
        Email: supEmail,
      });
      toast.success('Đã thêm nhà cung cấp.');
      setOpenSupplier(false);
      setSupName('');
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi thêm nhà cung cấp.');
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Bổ sung &amp; Mua sắm tài liệu</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kế hoạch ngân sách (QĐ37), đơn đặt mua, nhà cung cấp và tiếp nhận hàng (BM28).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canApprovePlan && (
            <Button variant="outline" size="sm" onClick={() => setOpenPlan(true)} className="gap-1.5">
              <Plus className="w-4 h-4" /> Kế hoạch mới
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={() => setOpenOrder(true)} className="gap-1.5">
            <ShoppingCart className="w-4 h-4" /> Lập đơn đặt mua
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'plans', label: `Kế hoạch (${plans.length})`, icon: PackagePlus },
          { id: 'orders', label: `Đơn đặt mua (${orders.length})`, icon: ShoppingCart },
          { id: 'receipts', label: `Tiếp nhận (${receipts.length})`, icon: FileCheck2 },
          { id: 'suppliers', label: `Nhà cung cấp (${suppliers.length})`, icon: Building2 },
        ].map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id as typeof tab)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                active
                  ? 'bg-[#0054A6] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-500">
          Đang tải dữ liệu mua sắm...
        </div>
      ) : tab === 'plans' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((p) => {
            const pct = p.NganSach > 0 ? Math.min(100, Math.round((p.NganSachDaDung / p.NganSach) * 100)) : 0;
            const remaining = Math.max(0, p.NganSach - p.NganSachDaDung);
            return (
              <div key={p.MaKeHoach} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-mono text-[#0054A6] font-semibold">{p.MaKeHoach}</span>
                    <h3 className="text-sm font-bold text-slate-900">{p.TenKeHoach}</h3>
                  </div>
                  <Badge variant="info">{pct}% đã dùng</Badge>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-[#0054A6]" style={{ width: `${pct}%` }} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-slate-400">Ngân sách</p>
                    <p className="font-semibold text-slate-800">{formatCurrency(p.NganSach)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Đã chi</p>
                    <p className="font-semibold text-amber-600">{formatCurrency(p.NganSachDaDung)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Còn lại</p>
                    <p className="font-semibold text-emerald-600">{formatCurrency(remaining)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : tab === 'orders' ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Mã đơn</th>
                <th className="px-4 py-3">Kế hoạch / NCC</th>
                <th className="px-4 py-3">Ngày đặt</th>
                <th className="px-4 py-3 text-right">Tổng tiền</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.MaDonDatMua} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono font-semibold text-slate-900">{o.MaDonDatMua}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{o.TenNCC}</p>
                    <p className="text-xs text-slate-500">{o.MaKeHoach} · {o.ChiTiet.length} đầu sách</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{o.NgayDat}</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatCurrency(o.TongTien)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={o.TrangThai === 'Đã nhận đủ' ? 'success' : 'warning'}>{o.TrangThai}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {o.TrangThai !== 'Đã nhận đủ' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const totalQ = o.ChiTiet.reduce((s, c) => s + c.SoLuongDat, 0);
                          setRecvQty(String(totalQ));
                          setOpenReceive(o);
                        }}
                        className="gap-1 text-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Tiếp nhận
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : tab === 'receipts' ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Mã phiếu</th>
                <th className="px-4 py-3">Đơn đặt mua</th>
                <th className="px-4 py-3">Ngày nhận</th>
                <th className="px-4 py-3 text-right">Thực nhận</th>
                <th className="px-4 py-3">Tình trạng</th>
                <th className="px-4 py-3">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {receipts.map((r) => (
                <tr key={r.MaPhieuTiepNhan}>
                  <td className="px-4 py-3 font-mono font-semibold">{r.MaPhieuTiepNhan}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.MaDonDatMua}</td>
                  <td className="px-4 py-3 text-xs">{r.NgayNhan}</td>
                  <td className="px-4 py-3 text-right font-semibold">{r.SoLuongThucNhan}</td>
                  <td className="px-4 py-3">
                    <Badge variant={r.TinhTrangHang === 'Đạt' ? 'success' : 'warning'}>{r.TinhTrangHang}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{r.GhiChuChenhLech || '—'}</td>
                </tr>
              ))}
              {receipts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-xs text-slate-400">
                    Chưa có phiếu tiếp nhận hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => setOpenSupplier(true)} className="gap-1.5">
              <Plus className="w-4 h-4" /> Thêm nhà cung cấp
            </Button>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Mã NCC</th>
                  <th className="px-4 py-3">Tên nhà cung cấp</th>
                  <th className="px-4 py-3">Điện thoại</th>
                  <th className="px-4 py-3">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {suppliers.map((s) => (
                  <tr key={s.MaNCC}>
                    <td className="px-4 py-3 font-mono font-semibold">{s.MaNCC}</td>
                    <td className="px-4 py-3 font-medium">{s.TenNCC}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{s.SDT || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{s.Email || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ModalDialog open={openPlan} onOpenChange={setOpenPlan} title="Tạo kế hoạch mua sắm mới">
        <form onSubmit={handleCreatePlan} className="space-y-3">
          <div>
            <FieldLabel required>Tên kế hoạch</FieldLabel>
            <TextInput value={planName} onChange={(e) => setPlanName(e.target.value)} required placeholder="VD: Bổ sung tài liệu HK2 2026" />
          </div>
          <div>
            <FieldLabel required>Ngân sách duyệt (VNĐ)</FieldLabel>
            <TextInput type="number" value={planBudget} onChange={(e) => setPlanBudget(e.target.value)} required />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpenPlan(false)}>Huỷ</Button>
            <Button type="submit" variant="primary">Lưu kế hoạch</Button>
          </div>
        </form>
      </ModalDialog>

      <ModalDialog open={openOrder} onOpenChange={setOpenOrder} title="Lập đơn đặt mua tài liệu">
        <form onSubmit={handleCreateOrder} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel required>Kế hoạch mua sắm</FieldLabel>
              <SelectInput value={orderPlan} onChange={(e) => setOrderPlan(e.target.value)}>
                {plans.map((p) => (
                  <option key={p.MaKeHoach} value={p.MaKeHoach}>{p.MaKeHoach}</option>
                ))}
              </SelectInput>
            </div>
            <div>
              <FieldLabel required>Nhà cung cấp</FieldLabel>
              <SelectInput value={orderSupplier} onChange={(e) => setOrderSupplier(e.target.value)}>
                {suppliers.map((s) => (
                  <option key={s.MaNCC} value={s.MaNCC}>{s.TenNCC}</option>
                ))}
              </SelectInput>
            </div>
          </div>
          <div>
            <FieldLabel required>Tên đầu tài liệu đặt mua</FieldLabel>
            <TextInput value={orderTitle} onChange={(e) => setOrderTitle(e.target.value)} required placeholder="VD: System Design Interview Vol.2" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel required>Số lượng</FieldLabel>
              <TextInput type="number" min={1} value={orderQty} onChange={(e) => setOrderQty(e.target.value)} required />
            </div>
            <div>
              <FieldLabel required>Đơn giá (VNĐ)</FieldLabel>
              <TextInput type="number" min={0} value={orderPrice} onChange={(e) => setOrderPrice(e.target.value)} required />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpenOrder(false)}>Huỷ</Button>
            <Button type="submit" variant="primary">Xác nhận đặt mua</Button>
          </div>
        </form>
      </ModalDialog>

      <ModalDialog open={Boolean(openReceive)} onOpenChange={(o) => !o && setOpenReceive(null)} title={`Tiếp nhận đơn ${openReceive?.MaDonDatMua || ''}`}>
        <form onSubmit={handleReceive} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel required>Số lượng thực nhận</FieldLabel>
              <TextInput type="number" min={0} value={recvQty} onChange={(e) => setRecvQty(e.target.value)} required />
            </div>
            <div>
              <FieldLabel required>Tình trạng hàng</FieldLabel>
              <SelectInput value={recvCond} onChange={(e) => setRecvCond(e.target.value as typeof recvCond)}>
                <option value="Đạt">Đạt</option>
                <option value="Thiếu">Thiếu</option>
                <option value="Thừa">Thừa</option>
                <option value="Lỗi chất lượng">Lỗi chất lượng</option>
              </SelectInput>
            </div>
          </div>
          <div>
            <FieldLabel>Ghi chú chênh lệch</FieldLabel>
            <TextInput value={recvNote} onChange={(e) => setRecvNote(e.target.value)} placeholder="Ghi rõ nếu thiếu/lỗi..." />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpenReceive(null)}>Huỷ</Button>
            <Button type="submit" variant="primary">Xác nhận tiếp nhận</Button>
          </div>
        </form>
      </ModalDialog>

      <ModalDialog open={openSupplier} onOpenChange={setOpenSupplier} title="Thêm nhà cung cấp mới">
        <form onSubmit={handleCreateSupplier} className="space-y-3">
          <div>
            <FieldLabel required>Tên nhà cung cấp</FieldLabel>
            <TextInput value={supName} onChange={(e) => setSupName(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Số điện thoại</FieldLabel>
              <TextInput value={supPhone} onChange={(e) => setSupPhone(e.target.value)} />
            </div>
            <div>
              <FieldLabel>Email</FieldLabel>
              <TextInput value={supEmail} onChange={(e) => setSupEmail(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpenSupplier(false)}>Huỷ</Button>
            <Button type="submit" variant="primary">Lưu nhà cung cấp</Button>
          </div>
        </form>
      </ModalDialog>
    </div>
  );
}
