import * as React from 'react';
import { SurfaceCard } from '../../../components/ui/card';
import { formatVnd } from '../../../services/rules/dateUtils';
import type { DashboardSummary } from '../../../types/library';

export function KpiGrid({ data }: { data: DashboardSummary }) {
  const kpis = [
    {
      label: 'Tổng đầu sách trong kho',
      value: data.tongSach.toLocaleString('vi-VN'),
      sub: `${data.sachCoSan} có sẵn · ${data.sachDangMuon} đang mượn`,
      tone: 'text-slate-900',
    },
    {
      label: 'Độc giả đã cấp thẻ',
      value: data.tongDocGia.toLocaleString('vi-VN'),
      sub: `${data.docGiaConHan} thẻ còn hạn sử dụng`,
      tone: 'text-slate-900',
    },
    {
      label: 'Sách mượn quá hạn',
      value: data.sachQuaHan.toLocaleString('vi-VN'),
      sub:
        data.sachQuaHan > 0
          ? 'Cần theo dõi thu hồi và tính phạt'
          : 'Không có sách quá hạn chưa trả',
      tone: data.sachQuaHan > 0 ? 'text-red-700' : 'text-emerald-700',
    },
    {
      label: 'Tổng công nợ tiền phạt',
      value: formatVnd(data.tongNoHienHanh),
      sub: `${data.luotMuonThangNay} lượt mượn trong tháng này`,
      tone: data.tongNoHienHanh > 0 ? 'text-amber-700' : 'text-slate-900',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <SurfaceCard key={kpi.label} className="p-5">
          <p className="text-xs font-medium text-slate-500">{kpi.label}</p>
          <p className={`text-2xl font-bold mt-2 tabular-nums ${kpi.tone}`}>
            {kpi.value}
          </p>
          <p className="text-xs text-slate-500 mt-2">{kpi.sub}</p>
        </SurfaceCard>
      ))}
    </div>
  );
}
