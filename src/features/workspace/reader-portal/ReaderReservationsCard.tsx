import { BookmarkCheck, Clock, XCircle } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/card';
import { formatDateVn } from '../../../services/rules/dateUtils';
import type { DatTruoc } from '../../../types/portal';

interface ReaderReservationsCardProps {
  reservations: DatTruoc[];
  onCancel: (maDatTruoc: string) => void;
}

export function ReaderReservationsCard({
  reservations,
  onCancel,
}: ReaderReservationsCardProps) {
  return (
    <Card>
      <CardHeader
        title={`Phiếu đặt trước sách của tôi (${reservations.length})`}
        description="Theo dõi trạng thái giữ chỗ hoặc hủy yêu cầu đặt trước trực tuyến."
      />
      <CardBody className="p-0">
        {reservations.length === 0 ? (
          <p className="p-6 text-center text-xs text-slate-500">
            Bạn chưa có phiếu đặt trước nào. Hãy tra cứu sách ở Cổng bạn đọc để đặt giữ chỗ.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Mã phiếu</th>
                  <th className="px-4 py-2.5 font-semibold">Sách</th>
                  <th className="px-4 py-2.5 font-semibold">Ngày đặt</th>
                  <th className="px-4 py-2.5 font-semibold">Trạng thái</th>
                  <th className="px-4 py-2.5 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reservations.map((r) => {
                  const canCancel = r.TrangThai === 'Đang chờ' || r.TrangThai === 'Đã giữ chỗ';
                  return (
                    <tr key={r.MaDatTruoc} className="hover:bg-slate-50/70">
                      <td className="px-4 py-2.5 font-mono font-semibold text-slate-700">
                        {r.MaDatTruoc}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="font-semibold text-slate-900">{r.TenSach}</span>
                        <span className="ml-1.5 font-mono text-[11px] text-slate-400">
                          ({r.MaSach})
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-600">{formatDateVn(r.NgayDat)}</td>
                      <td className="px-4 py-2.5">
                        <ReservationStatusPill status={r.TrangThai} />
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {canCancel ? (
                          <button
                            type="button"
                            onClick={() => onCancel(r.MaDatTruoc)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-semibold cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Hủy
                          </button>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function ReservationStatusPill({ status }: { status: DatTruoc['TrangThai'] }) {
  if (status === 'Đã giữ chỗ') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
        <BookmarkCheck className="w-3 h-3" />
        Đã giữ chỗ
      </span>
    );
  }
  if (status === 'Đang chờ') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
        <Clock className="w-3 h-3" />
        Đang chờ
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
      {status}
    </span>
  );
}
