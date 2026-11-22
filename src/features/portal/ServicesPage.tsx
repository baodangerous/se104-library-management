import * as React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { BookPlus, DoorOpen, ShieldCheck } from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { AuthUser, ThamSo } from '../../types/library';
import { BookRequestPanel } from './BookRequestPanel';
import { RoomBookingPanel } from './RoomBookingPanel';

interface ServicesPageProps {
  user: AuthUser | null;
}

export function ServicesPage({ user }: ServicesPageProps) {
  const [params, setParams] = React.useState<ThamSo | null>(null);

  React.useEffect(() => {
    adminService.getParams().then(setParams);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900">Dịch vụ Thư viện trực tuyến</h1>
        <p className="text-xs text-slate-500 mt-1">
          Đặt phòng học nhóm tầng 2–3, gửi đề xuất bổ sung tài liệu mới và tra cứu chính sách thẻ
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
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Chính sách cấp thẻ &amp; lưu thông học liệu hiện hành
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Các định mức dưới đây được đồng bộ tự động từ cấu hình quy định hiện hành của Thư
                viện UIT.
              </p>
            </div>

            {params ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <PolicyCard
                  title="Điều kiện cấp thẻ độc giả"
                  value={`${params.TuoiToiThieu} – ${params.TuoiToiDa} tuổi`}
                  detail={`Thẻ độc giả có giá trị sử dụng ${params.ThoiHanThe} tháng kể từ ngày lập thẻ. Áp dụng cho Sinh viên/Học viên và Giảng viên/Cán bộ UIT.`}
                />
                <PolicyCard
                  title="Định mức mượn tài liệu"
                  value={`Tối đa ${params.SoSachMuonToiDa} quyển / ${params.SoNgayMuonToiDa} ngày`}
                  detail="Độc giả chỉ được mượn thêm khi thẻ còn hạn sử dụng và không có đầu sách nào đang quá hạn."
                />
                <PolicyCard
                  title="Tiêu chuẩn tiếp nhận & phí quá hạn"
                  value="1.000đ / ngày quá hạn"
                  detail={`Thư viện ưu tiên tiếp nhận giáo trình và sách xuất bản trong vòng ${params.KhoangCachNamXuatBan} năm trở lại đây.`}
                />
              </div>
            ) : null}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

function PolicyCard({
  title,
  value,
  detail,
}: {
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
      <p className="text-xs font-semibold text-slate-500">{title}</p>
      <p className="text-lg font-bold text-[#0054A6]">{value}</p>
      <p className="text-xs text-slate-600 leading-relaxed">{detail}</p>
    </div>
  );
}
