import * as React from 'react';
import { SurfaceCard, SurfaceCardHeader } from '../../../components/ui/card';
import { formatDateVn, todayIsoDate } from '../../../services/rules/dateUtils';
import type { PhieuMuon } from '../../../types/library';

export function LoanHistoryList({
  loans,
  loading,
}: {
  loans: PhieuMuon[];
  loading: boolean;
}) {
  const today = todayIsoDate();

  return (
    <SurfaceCard className="lg:col-span-7">
      <SurfaceCardHeader
        title={`Lịch sử phiếu mượn (${loans.length})`}
        description="Theo dõi các phiếu mượn sách và tình trạng trả từng quyển"
      />
      <div className="divide-y divide-slate-100">
        {loading ? (
          <div className="p-6 text-xs text-slate-500">Đang tải danh sách phiếu mượn...</div>
        ) : loans.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Chưa có phiếu mượn nào.
          </div>
        ) : (
          loans.map((pm) => (
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
                      return (
                        <tr key={ct.MaChiTietMuon}>
                          <td className="px-3 py-2 font-mono text-slate-700">{ct.MaSach}</td>
                          <td className="px-3 py-2 text-slate-800 font-medium">{ct.TenSach}</td>
                          <td className="px-3 py-2 font-mono tabular-nums text-slate-600">
                            {formatDateVn(ct.HanTra)}
                          </td>
                          <td className="px-3 py-2 text-right font-medium">
                            {ct.DaTra ? (
                              <span className="text-emerald-700">
                                Đã trả ({formatDateVn(ct.NgayTra)})
                              </span>
                            ) : isOverdue ? (
                              <span className="text-red-700">Quá hạn chưa trả</span>
                            ) : (
                              <span className="text-amber-700">Đang mượn</span>
                            )}
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
