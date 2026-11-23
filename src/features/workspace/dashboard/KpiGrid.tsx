import * as React from 'react';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  CircleDollarSign,
  Users,
} from 'lucide-react';
import { SurfaceCard } from '../../../components/ui/card';
import { formatVnd } from '../../../services/rules/dateUtils';
import type { DashboardSummary } from '../../../types/library';

export function KpiGrid({ data }: { data: DashboardSummary }) {
  const hasOverdue = data.sachQuaHan > 0;
  const hasDebt = data.tongNoHienHanh > 0;

  const kpis = [
    {
      label: 'Tổng đầu sách trong kho',
      value: data.tongSach.toLocaleString('vi-VN'),
      sub: `${data.sachCoSan.toLocaleString('vi-VN')} có sẵn · ${data.sachDangMuon.toLocaleString('vi-VN')} đang mượn`,
      tone: 'text-slate-900',
      borderTop: 'border-t-sky-500',
      iconBg: 'bg-sky-50 text-sky-600 ring-sky-200/70',
      Icon: BookOpen,
    },
    {
      label: 'Độc giả đã cấp thẻ',
      value: data.tongDocGia.toLocaleString('vi-VN'),
      sub: `${data.docGiaConHan.toLocaleString('vi-VN')} thẻ còn hạn sử dụng`,
      tone: 'text-slate-900',
      borderTop: 'border-t-indigo-500',
      iconBg: 'bg-indigo-50 text-indigo-600 ring-indigo-200/70',
      Icon: Users,
    },
    {
      label: 'Sách mượn quá hạn',
      value: data.sachQuaHan.toLocaleString('vi-VN'),
      sub: hasOverdue
        ? 'Cần theo dõi thu hồi và tính phạt'
        : 'Không có sách quá hạn chưa trả',
      tone: hasOverdue ? 'text-rose-700' : 'text-emerald-700',
      borderTop: hasOverdue ? 'border-t-rose-500' : 'border-t-emerald-500',
      iconBg: hasOverdue
        ? 'bg-rose-50 text-rose-600 ring-rose-200/70'
        : 'bg-emerald-50 text-emerald-600 ring-emerald-200/70',
      Icon: hasOverdue ? AlertTriangle : CheckCircle2,
    },
    {
      label: 'Tổng công nợ tiền phạt',
      value: formatVnd(data.tongNoHienHanh),
      sub: `${data.luotMuonThangNay.toLocaleString('vi-VN')} lượt mượn trong tháng này`,
      tone: hasDebt ? 'text-amber-700' : 'text-slate-900',
      borderTop: 'border-t-amber-500',
      iconBg: 'bg-amber-50 text-amber-600 ring-amber-200/70',
      Icon: CircleDollarSign,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map(({ label, value, sub, tone, borderTop, iconBg, Icon }) => (
        <SurfaceCard
          key={label}
          className={`p-5 border-t-4 ${borderTop} hover:-translate-y-0.5 hover:shadow-md transition-all`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {label}
              </p>
              <p className={`text-2xl sm:text-3xl font-bold mt-2 tabular-nums ${tone}`}>
                {value}
              </p>
            </div>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ring-1 shrink-0 ${iconBg}`}
            >
              <Icon className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 pt-2.5 border-t border-slate-100">
            {sub}
          </p>
        </SurfaceCard>
      ))}
    </div>
  );
}
