import * as React from 'react';
import { BookPlus, CheckCircle2, DoorOpen, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardBody, CardHeader } from '../../../components/ui/card';
import { WorkspacePageHeader } from '../../../components/ui/workspace-header';
import { formatDateVn } from '../../../services/rules/dateUtils';
import { serviceRequestService } from '../../../services/serviceRequestService';
import type { LichDatPhong, YeuCauTaiLieu } from '../../../types/portal';

export function ServiceRequestsManagePage() {
  const [requests, setRequests] = React.useState<YeuCauTaiLieu[]>([]);
  const [bookings, setBookings] = React.useState<LichDatPhong[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadData = React.useCallback(() => {
    setLoading(true);
    Promise.all([
      serviceRequestService.listBookRequests(),
      serviceRequestService.listRoomBookings(),
    ])
      .then(([reqs, bks]) => {
        setRequests(reqs);
        setBookings(bks);
      })
      .catch((err) =>
        toast.error(err instanceof Error ? err.message : 'Không thể tải danh sách yêu cầu.')
      )
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleRequestStatus(
    maYeuCau: string,
    status: YeuCauTaiLieu['TrangThai']
  ) {
    try {
      await serviceRequestService.updateBookRequestStatus(maYeuCau, status);
      toast.success(`Đã cập nhật yêu cầu ${maYeuCau} → ${status}.`);
      loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể cập nhật trạng thái.');
    }
  }

  async function handleBookingStatus(
    maDatPhong: string,
    status: LichDatPhong['TrangThai']
  ) {
    try {
      await serviceRequestService.updateRoomBookingStatus(maDatPhong, status);
      toast.success(`Đã cập nhật lịch đặt phòng ${maDatPhong} → ${status}.`);
      loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể cập nhật lịch phòng.');
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        Đang tải dữ liệu yêu cầu &amp; đặt phòng từ máy chủ...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WorkspacePageHeader
        eyebrow="Dịch vụ Bạn đọc"
        title="Xử lý Biểu mẫu & Đặt phòng (A7)"
        description="Duyệt đề xuất bổ sung tài liệu và phê duyệt lịch đặt phòng học nhóm tầng 2."
      />

      {/* Book Requests Table */}
      <Card>
        <CardHeader
          title={`Yêu cầu bổ sung tài liệu (${requests.length})`}
          description="Thủ thư tiếp nhận và cập nhật trạng thái xử lý yêu cầu sách mới."
          action={<BookPlus className="w-4 h-4 text-[#0054A6]" />}
        />
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Mã YC</th>
                  <th className="px-4 py-2.5 font-semibold">Tài liệu đề xuất</th>
                  <th className="px-4 py-2.5 font-semibold">Người gửi</th>
                  <th className="px-4 py-2.5 font-semibold">Ngày gửi</th>
                  <th className="px-4 py-2.5 font-semibold">Trạng thái</th>
                  <th className="px-4 py-2.5 font-semibold text-right">Xử lý</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((r) => (
                  <tr key={r.MaYeuCau} className="hover:bg-slate-50/70">
                    <td className="px-4 py-2.5 font-mono font-semibold">{r.MaYeuCau}</td>
                    <td className="px-4 py-2.5">
                      <p className="font-semibold text-slate-900">{r.TenTaiLieu}</p>
                      <p className="text-[11px] text-slate-500">
                        {r.TacGia} · Ngành {r.MaNganh}
                      </p>
                    </td>
                    <td className="px-4 py-2.5 text-slate-700">{r.NguoiGui}</td>
                    <td className="px-4 py-2.5 text-slate-600">{formatDateVn(r.NgayGui)}</td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded-full bg-[#f3f8ff] text-[#0a2b86] border border-[#1556d6]/20 font-semibold">
                        {r.TrangThai}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleRequestStatus(r.MaYeuCau, 'Đã duyệt mua')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-semibold cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Duyệt mua
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRequestStatus(r.MaYeuCau, 'Đã bổ sung')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                      >
                        Đã bổ sung
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Room Bookings Table */}
      <Card>
        <CardHeader
          title={`Lịch đặt phòng học nhóm (${bookings.length})`}
          description="Kiểm tra thẻ sinh viên tại quầy tầng 2 trước khi bàn giao phòng hoặc hủy lịch."
          action={<DoorOpen className="w-4 h-4 text-[#0054A6]" />}
        />
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Mã đặt</th>
                  <th className="px-4 py-2.5 font-semibold">Phòng</th>
                  <th className="px-4 py-2.5 font-semibold">Người đặt</th>
                  <th className="px-4 py-2.5 font-semibold">Ngày &amp; Khung giờ</th>
                  <th className="px-4 py-2.5 font-semibold">Trạng thái</th>
                  <th className="px-4 py-2.5 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.MaDatPhong} className="hover:bg-slate-50/70">
                    <td className="px-4 py-2.5 font-mono font-semibold">{b.MaDatPhong}</td>
                    <td className="px-4 py-2.5 font-semibold text-slate-900">{b.TenPhong}</td>
                    <td className="px-4 py-2.5 text-slate-700">
                      {b.NguoiDat} <span className="text-slate-400">({b.MaSoSV})</span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">
                      {formatDateVn(b.NgayDat)} · {b.KhungGio}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full font-semibold ${
                          b.TrangThai === 'Đã xác nhận'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : b.TrangThai === 'Chờ duyệt'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {b.TrangThai}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right space-x-1.5 whitespace-nowrap">
                      {b.TrangThai === 'Chờ duyệt' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleBookingStatus(b.MaDatPhong, 'Đã xác nhận')}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-semibold cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Duyệt phòng
                          </button>
                          <button
                            type="button"
                            onClick={() => handleBookingStatus(b.MaDatPhong, 'Đã hủy')}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-semibold cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Từ chối
                          </button>
                        </>
                      ) : b.TrangThai === 'Đã xác nhận' ? (
                        <button
                          type="button"
                          onClick={() => handleBookingStatus(b.MaDatPhong, 'Đã hủy')}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-semibold cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Hủy lịch
                        </button>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
