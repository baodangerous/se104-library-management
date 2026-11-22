import * as React from 'react';
import { BookOpen, CheckCircle2, Clock, DoorOpen, GraduationCap, MapPin, Users } from 'lucide-react';
import { portalService } from '../../services/portalService';
import { readerService } from '../../services/readerService';
import { serviceRequestService } from '../../services/serviceRequestService';
import type { Sach } from '../../types/library';

interface AboutPageProps {
  books: Sach[];
}

export function AboutPage({ books }: AboutPageProps) {
  const [readerCount, setReaderCount] = React.useState(0);
  const [roomCount, setRoomCount] = React.useState(0);
  const majors = React.useMemo(() => portalService.listMajors(), []);
  const portalConfig = React.useMemo(() => portalService.getConfig(), []);

  React.useEffect(() => {
    Promise.all([readerService.list(), serviceRequestService.listRooms()]).then(
      ([readers, rooms]) => {
        setReaderCount(readers.length);
        setRoomCount(rooms.length);
      }
    );
  }, []);

  const availableBooks = books.filter((b) => b.TinhTrang === 'Có sẵn').length;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-2">
        <h1 className="text-xl font-bold text-slate-900">
          Giới thiệu {portalConfig.tenDonVi}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          Thư viện UIT cung cấp không gian đọc hiện đại, phòng thảo luận nhóm tiện nghi và hệ thống
          học liệu chuyên sâu về Công nghệ Thông tin, Trí tuệ Nhân tạo, An toàn Thông tin và Vi mạch
          bán dẫn phục vụ đào tạo đại học và sau đại học.
        </p>
      </div>

      {/* Public Live Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile icon={BookOpen} label="Đầu sách lưu thông" value={`${availableBooks} / ${books.length}`} sub="Sẵn sàng tại kho mở" />
        <StatTile icon={GraduationCap} label="Ngành đào tạo liên kết" value={String(majors.length)} sub="Chương trình ĐH & Sau ĐH" />
        <StatTile icon={DoorOpen} label="Phòng học nhóm" value={String(roomCount)} sub="Đặt lịch trực tuyến tầng 2–3" />
        <StatTile icon={Users} label="Độc giả đang hoạt động" value={String(readerCount)} sub="Sinh viên & Giảng viên UIT" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lịch phục vụ */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-[#0054A6]">
            <Clock className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-900">Lịch phục vụ bạn đọc</h2>
          </div>

          <div className="divide-y divide-slate-100">
            {portalConfig.gioMoCuaChiTiet.map((row) => (
              <div key={row.thu} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-semibold text-slate-900">{row.thu}</span>
                  <span className="font-bold text-[#0054A6]">{row.gio}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{row.ghiChu}</p>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#0054A6] shrink-0 mt-0.5" />
            <span>{portalConfig.diaChi}</span>
          </div>
        </div>

        {/* Nội quy thư viện */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Nội quy phòng đọc &amp; mượn tài liệu</h2>
          <ul className="space-y-3">
            {portalConfig.noiQuyThuVien.map((rule) => (
              <li key={rule} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-[#0054A6] shrink-0 mt-1" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
      <div className="w-9 h-9 rounded-lg bg-[#0054A6]/10 text-[#0054A6] flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-[11px] text-slate-400">{sub}</p>
    </div>
  );
}
