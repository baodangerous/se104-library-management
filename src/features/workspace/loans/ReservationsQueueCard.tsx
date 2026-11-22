import { BookmarkCheck, Clock, XCircle } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/card';
import { formatDateVn } from '../../../services/rules/dateUtils';
import type { DatTruoc } from '../../../types/portal';

interface ReservationsQueueCardProps {
  reservations: DatTruoc[];
  onCancel: (maDatTruoc: string) => void;
}

export function ReservationsQueueCard({
  reservations,
  onCancel,
}: ReservationsQueueCardProps) {
  const active = reservations.filter(
    (r) => r.TrangThai === 'Đang chờ' || r.TrangThai === 'Đã giữ chỗ'
  );

  return (
    <Card>
      <CardHeader
        title={`Hàng chờ & Giữ chỗ đặt trước (${active.length})`}
        description="Các đầu sách đang được bạn đọc đặt trước hoặc hệ thống tự động giữ chỗ khi nhận trả."
      />
      <CardBody className="p-0">
        {active.length === 0 ? (
          <p className="p-6 text-center text-xs text-slate-500">
            Hiện không có phiếu đặt trước nào đang chờ xử lý.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Mã đặt</th>
                  <th className="px-4 py-2.5 font-semibold">Độc giả</th>
                  <th className="px-4 py-2.5 font-semibold">Tài liệu</th>
                  <th className="px-4 py-2.5 font-semibold">Ngày đặt</th>
                  <th className="px-4 py-2.5 font-semibold">Trạng thái</th>
                  <th className="px-4 py-2.5 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {active.map((r) => (
                  <tr key={r.MaDatTruoc} className="hover:bg-slate-50/70">
                    <td className="px-4 py-2.5 font-mono font-semibold text-slate-700">
                      {r.MaDatTruoc}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-slate-900">
                      {r.HoTenDocGia}{' '}
                      <span className="font-mono text-[11px] text-slate-400">({r.MaDocGia})</span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-700">
                      {r.TenSach}{' '}
                      <span className="font-mono text-[11px] text-slate-400">({r.MaSach})</span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">{formatDateVn(r.NgayDat)}</td>
                    <td className="px-4 py-2.5">
                      {r.TrangThai === 'Đã giữ chỗ' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                          <BookmarkCheck className="w-3 h-3" />
                          Đã giữ chỗ
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                          <Clock className="w-3 h-3" />
                          Đang chờ
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => onCancel(r.MaDatTruoc)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Hủy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
