import * as React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { BookPlus, DoorOpen, ShieldCheck } from 'lucide-react';
import { bookService } from '../../services/bookService';
import type { AuthUser, ThamSo } from '../../types/library';
import { BookRequestPanel } from './BookRequestPanel';
import { RoomBookingPanel } from './RoomBookingPanel';
import { ServicePoliciesAndTools } from './ServicePoliciesAndTools';

interface ServicesPageProps {
  user: AuthUser | null;
}

export function ServicesPage({ user }: ServicesPageProps) {
  const [params, setParams] = React.useState<ThamSo | null>(null);

  React.useEffect(() => {
    bookService.getPublicParams().then(setParams).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900">Dịch vụ Thư viện trực tuyến</h1>
        <p className="text-xs text-slate-500 mt-1">
          Đặt phòng học nhóm tầng 2, gửi đề xuất bổ sung tài liệu mới và tra cứu chính sách thẻ
          mượn sách hiện hành của Thư viện UIT.
        </p>
      </div>

      <Tabs.Root defaultValue="rooms" className="space-y-5">
        <Tabs.List className="flex flex-wrap gap-2 bg-white border border-slate-200 rounded-xl p-2 shadow-xs">
          <Tabs.Trigger
            value="rooms"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 data-[state=active]:bg-[#0054A6] data-[state=active]:text-white transition-colors cursor-pointer"
          >
            <DoorOpen className="w-4 h-4" />
            Đặt phòng họp nhóm
          </Tabs.Trigger>
          <Tabs.Trigger
            value="requests"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 data-[state=active]:bg-[#0054A6] data-[state=active]:text-white transition-colors cursor-pointer"
          >
            <BookPlus className="w-4 h-4" />
            Yêu cầu bổ sung tài liệu
          </Tabs.Trigger>
          <Tabs.Trigger
            value="policies"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 data-[state=active]:bg-[#0054A6] data-[state=active]:text-white transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            Chính sách thẻ &amp; Mượn sách
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="rooms">
          <RoomBookingPanel user={user} />
        </Tabs.Content>

        <Tabs.Content value="requests">
          <BookRequestPanel user={user} />
        </Tabs.Content>

        <Tabs.Content value="policies">
          <ServicePoliciesAndTools params={params} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
