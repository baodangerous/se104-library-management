import * as React from 'react';
import { BookOpen, CheckCircle2, Clock, DoorOpen, GraduationCap, MapPin, Users } from 'lucide-react';
import { LiveLibraryHours } from '../../components/ui/live-library-hours';
import { portalService } from '../../services/portalService';
import type { Sach } from '../../types/library';
import { AboutOrgAndStats } from './AboutOrgAndStats';
import { PortalNewsSection } from './PortalNewsSection';

interface AboutPageProps {
  books: Sach[];
}

export function AboutPage({ books }: AboutPageProps) {
  const [readerCount, setReaderCount] = React.useState(0);
  const [roomCount, setRoomCount] = React.useState(0);
  const majors = React.useMemo(() => portalService.listMajors(), []);
  const portalConfig = React.useMemo(() => portalService.getConfig(), []);
  const news = React.useMemo(() => portalService.listNews(), []);

  React.useEffect(() => {
    portalService
      .getPublicStats()
      .then((stats) => {
        setReaderCount(stats.readerCount);
        setRoomCount(stats.roomCount);
      })
      .catch(() => {
        setReaderCount(0);
        setRoomCount(0);
      });
  }, []);

  const availableBooks = books.filter((b) => b.TinhTrang === 'Có sẵn').length;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0054A6]/10 text-[#0054A6] text-[11px] font-bold uppercase tracking-wider">
            Welcome to UIT · Soi rọi tri thức số
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
            Giới thiệu {portalConfig.tenDonVi}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Như thấu kính phóng đại giúp nhìn rõ từng chi tiết tri thức, Thư viện UIT kết nối sinh
            viên với không gian đọc hiện đại, phòng thảo luận nhóm tiện nghi và hệ thống học liệu
            chuyên sâu về Công nghệ Thông tin, Trí tuệ Nhân tạo, An toàn Thông tin và Thiết kế Vi
            mạch.
          </p>
          <p className="text-xs text-slate-500 italic">
            “Từ khuôn viên xanh UIT đến kho tàng tri thức mở — mỗi lần tra cứu là một góc nhìn mới.”
          </p>
        </div>

        <figure className="lg:col-span-5 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 relative group">
          <div className="aspect-[3/2] overflow-hidden">
            <img
              src="/resources/library/welcome-uit-lens.jpg"
              alt="Kính lúp Welcome to UIT — Biểu tượng tra cứu và khám phá tri thức"
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
          </div>
          <figcaption className="px-3 py-2 bg-white/95 border-t border-slate-100 text-[11px] font-medium text-slate-600 flex items-center justify-between gap-2">
            <span>Lăng kính khám phá tri thức UIT</span>
            <span className="text-[#0054A6] font-semibold shrink-0">Khuôn viên UIT</span>
          </figcaption>
        </figure>
      </div>

      {/* Public Live Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile icon={BookOpen} label="Đầu sách lưu thông" value={`${availableBooks} / ${books.length}`} sub="Sẵn sàng tại kho mở" />
        <StatTile icon={GraduationCap} label="Ngành đào tạo liên kết" value={String(majors.length)} sub="Chương trình ĐH & Sau ĐH" />
        <StatTile icon={DoorOpen} label="Phòng học nhóm" value={String(roomCount)} sub="Đặt lịch trực tuyến tầng 2" />
        <StatTile icon={Users} label="Độc giả đang hoạt động" value={String(readerCount)} sub="Sinh viên & Giảng viên UIT" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lịch phục vụ */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-[#0054A6]">
            <Clock className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-900">Lịch phục vụ bạn đọc</h2>
          </div>

          <LiveLibraryHours variant="card" />

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

        {/* Nội quy thư viện + Hình ảnh thực tế tầng 2 */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
          <div className="space-y-4">
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

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Không gian thực tế &amp; văn hóa đọc tại Tầng 2
            </p>
            <div className="grid grid-cols-2 gap-3">
              <figure className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                <div className="aspect-[3/2] overflow-hidden">
                  <img
                    src="/resources/library/floor2-study-window.jpg"
                    alt="Giữ trật tự và xếp ghế gọn gàng tại khu đọc tầng 2"
                    className="w-full h-full object-cover object-[center_25%]"
                  />
                </div>
                <figcaption className="px-2.5 py-1.5 text-[11px] font-medium text-slate-600">
                  Giữ trật tự &amp; xếp ghế gọn tại khu đọc yên tĩnh
                </figcaption>
              </figure>
              <figure className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                <div className="aspect-[3/2] overflow-hidden">
                  <img
                    src="/resources/library/floor2-shelf-read.jpg"
                    alt="Đọc và bảo quản sách nguyên vẹn tại kệ"
                    className="w-full h-full object-cover object-[center_20%]"
                  />
                </div>
                <figcaption className="px-2.5 py-1.5 text-[11px] font-medium text-slate-600">
                  Tra cứu &amp; bảo quản nguyên vẹn giáo trình
                </figcaption>
              </figure>
              <figure className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                <div className="aspect-[3/2] overflow-hidden">
                  <img
                    src="/resources/library/floor2-shelf-pick.jpg"
                    alt="Lấy sách nhẹ nhàng trên giá sách tầng 2"
                    className="w-full h-full object-cover object-[center_20%]"
                  />
                </div>
                <figcaption className="px-2.5 py-1.5 text-[11px] font-medium text-slate-600">
                  Kho mở đa ngành phục vụ mượn đọc trực tiếp
                </figcaption>
              </figure>
              <figure className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                <div className="aspect-[3/2] overflow-hidden">
                  <img
                    src="/resources/library/floor2-english-shelf.jpg"
                    alt="Khu vực sách ngoại văn tại tầng 2"
                    className="w-full h-full object-cover object-[center_20%]"
                  />
                </div>
                <figcaption className="px-2.5 py-1.5 text-[11px] font-medium text-slate-600">
                  Tài liệu ngoại văn &amp; tham khảo chuyên sâu
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>

      <AboutOrgAndStats />

      <PortalNewsSection news={news} />
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
