import * as React from 'react';
import { ArrowRight, BookDown, BookUp, CreditCard, Network } from 'lucide-react';
import { SurfaceCard, SurfaceCardHeader } from '../../../components/ui/card';
import { formatDateVn } from '../../../services/rules/dateUtils';
import type { DashboardSummary } from '../../../types/library';
import type { NavPageId } from '../layout/navConfig';

const SHORTCUTS: {
  page: NavPageId;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    page: 'loans',
    title: 'Cho mượn sách',
    desc: 'Kiểm tra thẻ, hạn mức và sách có sẵn',
    icon: BookUp,
  },
  {
    page: 'returns',
    title: 'Nhận trả sách & tính phạt',
    desc: 'Tự động tính 1.000 ₫/ngày trả trễ',
    icon: BookDown,
  },
  {
    page: 'fines',
    title: 'Thu tiền phạt quá hạn',
    desc: 'Ghi nhận thanh toán và cập nhật công nợ',
    icon: CreditCard,
  },
  {
    page: 'knowledge-map',
    title: 'Bản đồ tri thức',
    desc: 'Khám phá mạng lưới Sách – Tác giả – Thể loại',
    icon: Network,
  },
  {
    page: 'reports',
    title: 'Báo cáo thống kê',
    desc: 'Thống kê thể loại, sách trả trễ & xuất CSV',
    icon: ArrowRight,
  },
];

export function RecentActivitySection({
  data,
  onNavigate,
}: {
  data: DashboardSummary;
  onNavigate: (page: NavPageId) => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <SurfaceCard className="lg:col-span-8">
        <SurfaceCardHeader
          title="Giao dịch lưu thông gần đây"
          description="Tổng hợp phiếu mượn, phiếu trả và phiếu thu tiền phạt mới nhất"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600 whitespace-nowrap">
                <th className="px-5 py-3">Mã phiếu</th>
                <th className="px-5 py-3">Nghiệp vụ</th>
                <th className="px-5 py-3">Độc giả</th>
                <th className="px-5 py-3">Chi tiết</th>
                <th className="px-5 py-3 text-right">Ngày thực hiện</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {data.giaoDichGanDay.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-500 text-xs">
                    Chưa có giao dịch nào được ghi nhận.
                  </td>
                </tr>
              ) : (
                data.giaoDichGanDay.map((tx) => (
                  <tr key={`${tx.loai}-${tx.maPhieu}`} className="hover:bg-slate-50/80">
                    <td className="px-5 py-3 font-mono text-xs font-medium text-slate-900">
                      {tx.maPhieu}
                    </td>
                    <td className="px-5 py-3 text-xs font-medium whitespace-nowrap">
                      {tx.loai === 'MUON' ? (
                        <span className="text-[#0054A6]">Mượn sách</span>
                      ) : tx.loai === 'TRA' ? (
                        <span className="text-emerald-700">Trả sách</span>
                      ) : (
                        <span className="text-amber-700">Thu phạt</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-slate-800">{tx.tenDocGia}</td>
                    <td className="px-5 py-3 text-slate-600 text-xs">{tx.moTa}</td>
                    <td className="px-5 py-3 text-right font-mono text-xs text-slate-500 tabular-nums">
                      {formatDateVn(tx.ngay)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SurfaceCard>

      <SurfaceCard className="lg:col-span-4">
        <SurfaceCardHeader
          title="Truy cập nhanh nghiệp vụ"
          description="Thao tác thường dùng tại quầy thủ thư"
        />
        <div className="divide-y divide-slate-100">
          {SHORTCUTS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.page}
                type="button"
                onClick={() => onNavigate(item.page)}
                className="w-full px-5 py-3.5 text-left hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                <Icon className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            );
          })}
        </div>
      </SurfaceCard>
    </div>
  );
}
