import * as React from 'react';
import { RefreshCw, Search } from 'lucide-react';
import { toast } from 'sonner';
import { SurfaceCard, SurfaceCardHeader } from '../../../components/ui/card';
import { MAX_RENEWALS_PER_LOAN } from '../../../services/rules/circulationRules';
import { formatDateVn, todayIsoDate } from '../../../services/rules/dateUtils';
import { matchesVietnameseSearch } from '../../../services/rules/searchUtils';
import type { PhieuMuon } from '../../../types/library';

type LoanFilter = 'ALL' | 'ACTIVE' | 'OVERDUE' | 'RETURNED';

export function LoanHistoryList({
  loans,
  loading,
  onRenewItem,
}: {
  loans: PhieuMuon[];
  loading: boolean;
  onRenewItem?: (maChiTietMuon: number) => Promise<void>;
}) {
  const today = todayIsoDate();
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<LoanFilter>('ALL');
  const [renewingId, setRenewingId] = React.useState<number | null>(null);

  const filteredLoans = React.useMemo(() => {
    return loans.filter((pm) => {
      if (statusFilter === 'ACTIVE') {
        if (!pm.ChiTiet.some((ct) => !ct.DaTra)) return false;
      } else if (statusFilter === 'OVERDUE') {
        if (!pm.ChiTiet.some((ct) => !ct.DaTra && ct.HanTra < today)) return false;
      } else if (statusFilter === 'RETURNED') {
        if (!pm.ChiTiet.every((ct) => ct.DaTra)) return false;
      }
      if (!search.trim()) return true;
      return matchesVietnameseSearch(search, [
        pm.MaPhieuMuon,
        pm.MaDocGia,
        pm.HoTenDocGia,
        ...pm.ChiTiet.flatMap((ct) => [ct.MaSach, ct.TenSach]),
      ]);
    });
  }, [loans, search, statusFilter, today]);

  async function handleRenew(maChiTietMuon: number) {
    if (!onRenewItem) return;
    setRenewingId(maChiTietMuon);
    try {
      await onRenewItem(maChiTietMuon);
    } catch (err: any) {
      toast.error(err?.message || 'Không thể gia hạn sách.');
    } finally {
      setRenewingId(null);
    }
  }

  return (
    <SurfaceCard className="lg:col-span-7">
      <SurfaceCardHeader
        title={`Lịch sử phiếu mượn (${filteredLoans.length}/${loans.length})`}
        description="Theo dõi các phiếu mượn sách, gia hạn và tình trạng trả từng quyển"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                aria-label="Tìm phiếu mượn"
                placeholder="Tìm mã PM, độc giả, sách..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 pr-2.5 text-xs bg-white border border-slate-200 rounded-lg w-44 focus:outline-none focus:border-[#0054A6]"
              />
            </div>
            <select
              aria-label="Lọc trạng thái phiếu mượn"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as LoanFilter)}
              className="h-8 px-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0054A6]"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang mượn</option>
              <option value="OVERDUE">Có sách quá hạn</option>
              <option value="RETURNED">Đã trả hết</option>
            </select>
          </div>
        }
      />
      <div className="divide-y divide-slate-100">
        {loading ? (
          <div className="p-6 text-xs text-slate-500">Đang tải danh sách phiếu mượn...</div>
        ) : filteredLoans.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Không có phiếu mượn nào phù hợp.
          </div>
        ) : (
          filteredLoans.map((pm) => (
            <div key={pm.MaPhieuMuon} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="text-sm">
                  <span className="font-mono font-semibold text-slate-900">
                    {pm.MaPhieuMuon}
                  </span>
                  <span className="mx-2 text-slate-300">·</span>
                  <span className="font-medium text-slate-800">{pm.HoTenDocGia}</span>
                  <span className="text-xs text-slate-500 ml-1.5">({pm.MaDocGia})</span>
                </div>
                <span className="font-mono text-xs text-slate-500 tabular-nums">
                  Ngày mượn: {formatDateVn(pm.NgayMuon)}
                </span>
              </div>
              <div className="overflow-x-auto border border-slate-100 rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 whitespace-nowrap">
                      <th className="px-3 py-2 font-medium">Mã sách</th>
                      <th className="px-3 py-2 font-medium">Tên sách</th>
                      <th className="px-3 py-2 font-medium">Hạn trả</th>
                      <th className="px-3 py-2 font-medium text-right">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pm.ChiTiet.map((ct) => {
                      const isOverdue = !ct.DaTra && ct.HanTra < today;
                      const renewals = ct.SoLanGiaHan ?? 0;
                      const canRenew =
                        Boolean(onRenewItem) &&
                        !ct.DaTra &&
                        !isOverdue &&
                        renewals < MAX_RENEWALS_PER_LOAN;
                      return (
                        <tr key={ct.MaChiTietMuon}>
                          <td className="px-3 py-2 font-mono text-slate-700">{ct.MaSach}</td>
                          <td className="px-3 py-2 text-slate-800 font-medium">{ct.TenSach}</td>
                          <td className="px-3 py-2 font-mono tabular-nums text-slate-600">
                            {formatDateVn(ct.HanTra)}
                            {renewals > 0 ? (
                              <span className="ml-1.5 text-[10px] text-[#0054A6] font-sans">
                                (GH {renewals}/{MAX_RENEWALS_PER_LOAN})
                              </span>
                            ) : null}
                          </td>
                          <td className="px-3 py-2 text-right font-medium">
                            <div className="inline-flex items-center justify-end gap-2">
                              {ct.DaTra ? (
                                <span className="text-emerald-700">
                                  Đã trả ({formatDateVn(ct.NgayTra)})
                                </span>
                              ) : isOverdue ? (
                                <span className="text-red-700">Quá hạn chưa trả</span>
                              ) : (
                                <span className="text-amber-700">Đang mượn</span>
                              )}
                              {canRenew ? (
                                <button
                                  type="button"
                                  disabled={renewingId === ct.MaChiTietMuon}
                                  onClick={() => handleRenew(ct.MaChiTietMuon)}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[#0054A6]/30 text-[#0054A6] hover:bg-[#0054A6]/10 text-[11px] font-medium cursor-pointer disabled:opacity-50"
                                >
                                  <RefreshCw className="w-3 h-3" />
                                  Gia hạn
                                </button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </SurfaceCard>
  );
}
