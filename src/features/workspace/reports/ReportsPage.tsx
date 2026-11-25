import * as Tabs from '@radix-ui/react-tabs';
import { Printer } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { WorkspacePageHeader } from '../../../components/ui/workspace-header';
import { ReportBM71Panel } from './ReportBM71Panel';
import { ReportBM72Panel } from './ReportBM72Panel';
import { useReports } from './useReports';

export function ReportsPage() {
  const state = useReports();

  return (
    <div className="space-y-6">
      <WorkspacePageHeader
        eyebrow="Thống kê & Kết xuất"
        title="Báo cáo & Thống kê"
        description="Thống kê động tình hình mượn sách theo thể loại và danh sách sách trả trễ, hỗ trợ in ấn và xuất CSV."
        actions={
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4" /> In báo cáo
          </Button>
        }
      />

      <Tabs.Root defaultValue="bm71" className="space-y-4">
        <Tabs.List className="inline-flex rounded-xl bg-slate-200/70 p-1 gap-1">
          <Tabs.Trigger
            value="bm71"
            className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 data-[state=active]:bg-white data-[state=active]:text-[#0054A6] data-[state=active]:shadow-xs transition-all cursor-pointer"
          >
            Thống kê mượn theo thể loại
          </Tabs.Trigger>
          <Tabs.Trigger
            value="bm72"
            className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 data-[state=active]:bg-white data-[state=active]:text-[#0054A6] data-[state=active]:shadow-xs transition-all cursor-pointer"
          >
            Danh sách sách trả trễ
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="bm71">
          <ReportBM71Panel
            thang={state.thang}
            nam={state.nam}
            bm71={state.bm71}
            loading={state.loading71}
            onChangeThang={state.setThang}
            onChangeNam={state.setNam}
            onExportCsv={state.exportBM71}
          />
        </Tabs.Content>

        <Tabs.Content value="bm72">
          <ReportBM72Panel
            ngay={state.ngayBM72}
            bm72={state.bm72}
            loading={state.loading72}
            onChangeNgay={state.setNgayBM72}
            onExportCsv={state.exportBM72}
          />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
