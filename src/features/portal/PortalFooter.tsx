import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { UitLogo } from '../../components/ui/uit-logo';
import { portalService } from '../../services/portalService';
import type { PortalTabId } from '../../types/portal';

interface PortalFooterProps {
  onSelectTab: (tab: PortalTabId) => void;
}

export function PortalFooter({ onSelectTab }: PortalFooterProps) {
  const UIT_LIBRARY_INFO = portalService.getConfig();
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-3">
          <div className="flex items-center gap-3">
            <UitLogo className="w-10 h-10" />
            <div>
              <p className="text-sm font-bold text-white">{UIT_LIBRARY_INFO.tenNgan}</p>
              <p className="text-xs text-slate-400">{UIT_LIBRARY_INFO.tenDonVi}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md">
            Trung tâm học liệu số và không gian nghiên cứu mở phục vụ giảng viên, học viên cao học
            và sinh viên Trường Đại học Công nghệ Thông tin – ĐHQG-HCM.
          </p>
        </div>

        <div className="md:col-span-4 space-y-2.5 text-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-white">
            Thông tin liên hệ
          </p>
          <p className="flex items-start gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <span>{UIT_LIBRARY_INFO.diaChi}</span>
          </p>
          <p className="flex items-center gap-2 text-slate-300">
            <Phone className="w-4 h-4 text-sky-400 shrink-0" />
            <span>{UIT_LIBRARY_INFO.hotline}</span>
          </p>
          <p className="flex items-center gap-2 text-slate-300">
            <Mail className="w-4 h-4 text-sky-400 shrink-0" />
            <span>{UIT_LIBRARY_INFO.email}</span>
          </p>
          <p className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-sky-400 shrink-0" />
            <span>{UIT_LIBRARY_INFO.gioMoCuaNgan}</span>
          </p>
        </div>

        <div className="md:col-span-3 space-y-2 text-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-white">
            Truy cập nhanh
          </p>
          <ul className="space-y-1.5">
            {[
              { id: 'catalog' as const, label: 'Tra cứu tài liệu & Sách mới' },
              { id: 'majors' as const, label: 'CSDL 12 ngành đào tạo UIT' },
              { id: 'knowledge-map' as const, label: 'Bản đồ Tri thức Học liệu' },
              { id: 'services' as const, label: 'Đặt phòng họp nhóm & Yêu cầu sách' },
              { id: 'about' as const, label: 'Nội quy & Lịch phục vụ' },
            ].map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => onSelectTab(link.id)}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Thư viện Trường Đại học Công nghệ Thông tin – ĐHQG-HCM.</p>
          <p>Cổng thông tin &amp; Tra cứu Học liệu Mở</p>
        </div>
      </div>
    </footer>
  );
}
