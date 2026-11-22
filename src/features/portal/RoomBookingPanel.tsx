import * as React from 'react';
import { CheckCircle2, DoorOpen, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { ConfirmDialog } from '../../components/ui/dialog';
import { FieldLabel, SelectInput, TextInput } from '../../components/ui/input';
import { formatDateVN } from '../../lib/utils';
import { portalService } from '../../services/portalService';
import { todayIsoDate } from '../../services/rules/dateUtils';
import { serviceRequestService } from '../../services/serviceRequestService';
import type { AuthUser } from '../../types/library';
import type { LichDatPhong, PhongHop } from '../../types/portal';
import { RoomBookingList } from './RoomBookingList';

export function RoomBookingPanel({ user }: { user: AuthUser | null }) {
  const ROOM_TIME_SLOTS = React.useMemo(() => portalService.getConfig().khungGioDatPhong, []);
  const [rooms, setRooms] = React.useState<PhongHop[]>([]);
  const [bookings, setBookings] = React.useState<LichDatPhong[]>([]);
  const [maPhong, setMaPhong] = React.useState('');
  const [ngayDat, setNgayDat] = React.useState(todayIsoDate());
  const [khungGio, setKhungGio] = React.useState(ROOM_TIME_SLOTS[0]);
  const [nguoiDat, setNguoiDat] = React.useState(user?.HoTen || '');
  const [maSoSV, setMaSoSV] = React.useState(user?.MaDocGia || '');
  const [email, setEmail] = React.useState(user?.TenDangNhap || '');
  const [mucDich, setMucDich] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [cancelTarget, setCancelTarget] = React.useState<LichDatPhong | null>(null);

  React.useEffect(() => {
    if (user) {
      setNguoiDat((prev) => prev || user.HoTen);
      setMaSoSV((prev) => prev || user.MaDocGia || '');
      setEmail((prev) => prev || user.TenDangNhap);
    }
  }, [user]);

  const bookedSlotsForSelection = React.useMemo(() => {
    return new Set(
      bookings
        .filter(
          (b) =>
            b.TrangThai === 'Đã xác nhận' &&
            b.MaPhong === maPhong &&
            b.NgayDat === ngayDat
        )
        .map((b) => b.KhungGio)
    );
  }, [bookings, maPhong, ngayDat]);

  const loadData = React.useCallback(async () => {
    const [r, b] = await Promise.all([
      serviceRequestService.listRooms(),
      serviceRequestService.listRoomBookings(),
    ]);
    setRooms(r);
    setBookings(b);
    setMaPhong((prev) => prev || r.find((x) => x.TrangThai === 'Sẵn sàng')?.MaPhong || '');
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!maPhong || !nguoiDat.trim() || !maSoSV.trim()) {
      toast.error('Vui lòng chọn phòng và nhập họ tên, MSSV / Mã cán bộ.');
      return;
    }
    setSubmitting(true);
    try {
      await serviceRequestService.createRoomBooking({
        MaPhong: maPhong,
        NguoiDat: nguoiDat,
        MaSoSV: maSoSV,
        Email: email || `${maSoSV.trim()}@gm.uit.edu.vn`,
        NgayDat: ngayDat,
        KhungGio: khungGio,
        MucDich: mucDich,
      });
      toast.success('Đăng ký phòng họp nhóm thành công!');
      setMucDich('');
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể đặt phòng.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    try {
      await serviceRequestService.cancelRoomBooking(cancelTarget.MaDatPhong);
      toast.success(`Đã hủy lịch đặt ${cancelTarget.TenPhong}.`);
      setCancelTarget(null);
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Hủy lịch thất bại.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rooms.map((room) => {
            const selected = room.MaPhong === maPhong;
            const ready = room.TrangThai === 'Sẵn sàng';
            return (
              <button
                key={room.MaPhong}
                type="button"
                disabled={!ready}
                onClick={() => setMaPhong(room.MaPhong)}
                className={`text-left rounded-xl border transition-all cursor-pointer disabled:opacity-60 overflow-hidden ${
                  selected
                    ? 'border-[#0054A6] bg-[#0054A6]/5 ring-1 ring-[#0054A6]'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {room.MaPhong === 'P202' || room.MaPhong === 'P201' ? (
                  <div className="aspect-[3/2] w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                    <img
                      src={
                        room.MaPhong === 'P202'
                          ? '/resources/library/room-a202.jpg'
                          : '/resources/library/floor2-group.jpg'
                      }
                      alt={room.TenPhong}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}
                <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-slate-900">{room.TenPhong}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${ready ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {room.TrangThai}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <DoorOpen className="w-3.5 h-3.5 text-[#0054A6]" />
                  <span>{room.Tang}</span>
                  <span>·</span>
                  <Users className="w-3.5 h-3.5 text-[#0054A6]" />
                  <span>Tối đa {room.SucChua} người</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-1.5">{room.TrangThietBi}</p>
                </div>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900">Phiếu đăng ký phòng học nhóm</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <FieldLabel htmlFor="rb-date" required>Ngày sử dụng</FieldLabel>
              <TextInput id="rb-date" type="date" min={todayIsoDate()} value={ngayDat} onChange={(e) => setNgayDat(e.target.value)} />
            </div>
            <div>
              <FieldLabel htmlFor="rb-slot" required>Khung giờ</FieldLabel>
              <SelectInput id="rb-slot" value={khungGio} onChange={(e) => setKhungGio(e.target.value)}>
                {ROOM_TIME_SLOTS.map((slot) => {
                  const isTaken = bookedSlotsForSelection.has(slot);
                  return (
                    <option key={slot} value={slot} disabled={isTaken}>
                      {slot}{isTaken ? ' (Đã đặt)' : ''}
                    </option>
                  );
                })}
              </SelectInput>
            </div>
            <div>
              <FieldLabel htmlFor="rb-name" required>Họ tên đại diện nhóm</FieldLabel>
              <TextInput id="rb-name" value={nguoiDat} onChange={(e) => setNguoiDat(e.target.value)} placeholder="Nguyễn Văn A" />
            </div>
            <div>
              <FieldLabel htmlFor="rb-id" required>MSSV / Mã cán bộ</FieldLabel>
              <TextInput id="rb-id" value={maSoSV} onChange={(e) => setMaSoSV(e.target.value)} placeholder="22520101" />
            </div>
            <div>
              <FieldLabel htmlFor="rb-email">Email UIT</FieldLabel>
              <TextInput id="rb-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="22520101@gm.uit.edu.vn" />
            </div>
            <div>
              <FieldLabel htmlFor="rb-purpose">Mục đích sử dụng</FieldLabel>
              <TextInput id="rb-purpose" value={mucDich} onChange={(e) => setMucDich(e.target.value)} placeholder="Thảo luận đồ án môn học..." />
            </div>
          </div>
          <Button type="submit" variant="primary" disabled={submitting} className="gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            {submitting ? 'Đang xác nhận...' : 'Xác nhận đặt phòng'}
          </Button>
        </form>
      </div>

      <RoomBookingList bookings={bookings} onRequestCancel={setCancelTarget} />

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        onOpenChange={(open) => !open && setCancelTarget(null)}
        title="Xác nhận hủy lịch đặt phòng"
        description={`Bạn có chắc muốn hủy lịch đặt ${cancelTarget?.TenPhong} khung giờ ${cancelTarget?.KhungGio} ngày ${cancelTarget ? formatDateVN(cancelTarget.NgayDat) : ''}?`}
        confirmLabel="Hủy lịch đặt"
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}
