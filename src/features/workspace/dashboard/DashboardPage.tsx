import * as React from 'react';
import { BookUp, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { circulationService } from '../../../services/circulationService';
import type { DashboardSummary } from '../../../types/library';
import type { NavPageId } from '../layout/navConfig';
import { DashboardCharts } from './DashboardCharts';
import { KpiGrid } from './KpiGrid';
import { RecentActivitySection } from './RecentActivitySection';

export function DashboardPage({
  onNavigate,
}: {
  onNavigate: (page: NavPageId) => void;
}) {
  const [data, setData] = React.useState<DashboardSummary | null>(null);
  const [loading, setLoading] = React.useState(true);

  const loadSummary = React.useCallback(async () => {
    setLoading(true);
    try {
      setData(await circulationService.getDashboardSummary());
    } catch (err: any) {
      toast.error(err?.message || 'Không thể tải dữ liệu tổng quan.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 h-28 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl h-80 animate-pulse" />
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl h-80 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Tổng quan hoạt động Thư viện UIT
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Theo dõi tình trạng kho học liệu, lưu thông mượn trả và công nợ tiền phạt theo thời gian thực.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadSummary}>
            <RefreshCw className="w-3.5 h-3.5" />
            Làm mới
          </Button>
          <Button size="sm" onClick={() => onNavigate('loans')}>
            <BookUp className="w-3.5 h-3.5" />
            Cho mượn sách
          </Button>
        </div>
      </div>

      <KpiGrid data={data} />
      <DashboardCharts data={data} />
      <RecentActivitySection data={data} onNavigate={onNavigate} />
    </div>
  );
}
