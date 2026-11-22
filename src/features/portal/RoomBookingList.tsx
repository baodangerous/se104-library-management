import { Calendar, XCircle } from 'lucide-react';
import { formatDateVN } from '../../lib/utils';
import type { LichDatPhong } from '../../types/portal';

interface RoomBookingListProps {
  bookings: LichDatPhong[];
  onRequestCancel: (booking: LichDatPhong) => void;
}

export function RoomBookingList({ bookings, onRequestCancel }: RoomBookingListProps) {
  return (
    <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Lịch đặt phòng gần đây</h3>
        <span className="text-xs text-slate-500">{bookings.length} lượt</span>
      </div>

      <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
        {bookings.map((item) => (
          <div
            key={item.MaDatPhong}
            className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold text-slate-900">{item.TenPhong}</p>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                  item.TrangThai === 'Đã xác nhận'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {item.TrangThai}
              </span>
            </div>
            <p className="text-xs text-[#0054A6] font-medium inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDateVN(item.NgayDat)} · {item.KhungGio}
            </p>
            <p className="text-xs text-slate-600">
              {item.NguoiDat} ({item.MaSoSV}) — {item.MucDich}
            </p>
            {item.TrangThai === 'Đã xác nhận' ? (
              <button
                type="button"
                onClick={() => onRequestCancel(item)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-red-600 hover:underline cursor-pointer pt-1"
              >
                <XCircle className="w-3.5 h-3.5" />
                Hủy lịch đặt
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
