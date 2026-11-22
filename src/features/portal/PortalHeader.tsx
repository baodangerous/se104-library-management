import * as React from 'react';
import {
  Clock,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mail,
  Menu,
  Phone,
  X,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { UitLogo } from '../../components/ui/uit-logo';
import { cn } from '../../lib/utils';
import { portalService } from '../../services/portalService';
import type { AuthUser } from '../../types/library';
import type { PortalTabId } from '../../types/portal';

const NAV_ITEMS: Array<{ id: PortalTabId; label: string }> = [
  { id: 'home', label: 'Trang chủ' },
  { id: 'catalog', label: 'Tra cứu & Sách mới' },
  { id: 'majors', label: 'CSDL Ngành học' },
  { id: 'knowledge-map', label: 'Bản đồ Tri thức' },
  { id: 'services', label: 'Dịch vụ' },
  { id: 'about', label: 'Giới thiệu' },
];

interface PortalHeaderProps {
  activeTab: PortalTabId;
  onSelectTab: (tab: PortalTabId) => void;
  user: AuthUser | null;
  onOpenLogin: () => void;
  onEnterWorkspace: () => void;
  onLogout: () => void;
}

export function PortalHeader({
  activeTab,
  onSelectTab,
  user,
  onOpenLogin,
  onEnterWorkspace,
  onLogout,
}: PortalHeaderProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const UIT_LIBRARY_INFO = React.useMemo(() => portalService.getConfig(), []);

  const handleSelect = (tab: PortalTabId) => {
    onSelectTab(tab);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Topbar */}
      <div className="bg-[#003B73] text-sky-100 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6 truncate">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-sky-300 shrink-0" />
              <span className="font-medium text-white">{UIT_LIBRARY_INFO.hotline}</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-sky-300 shrink-0" />
              <span>{UIT_LIBRARY_INFO.email}</span>
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-sky-100 shrink-0">
            <Clock className="w-3.5 h-3.5 text-sky-300 shrink-0" />
            <span className="hidden md:inline">{UIT_LIBRARY_INFO.gioMoCuaNgan}</span>
            <span className="md:hidden">T2–T6: 07:30–18:00</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => handleSelect('home')}
          className="flex items-center gap-3 text-left cursor-pointer shrink-0 group"
        >
          <UitLogo className="w-10 h-10" />
          <div className="leading-tight">
            <p className="text-sm sm:text-base font-bold text-[#0054A6] tracking-tight group-hover:text-[#003B73] transition-colors">
              Thư viện UIT
            </p>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              ĐH Công nghệ Thông tin – ĐHQG-HCM
            </p>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav aria-label="Điều hướng chính" className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap',
                  active
                    ? 'text-[#0054A6] bg-[#0054A6]/8 font-semibold'
                    : 'text-slate-700 hover:text-[#0054A6] hover:bg-slate-100'
                )}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Auth / Workspace Action */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={onEnterWorkspace}
                className="gap-1.5"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Không gian làm việc</span>
                <span className="sm:hidden">Quản trị</span>
              </Button>
              <button
                type="button"
                onClick={onLogout}
                title={`Đăng xuất (${user.HoTen})`}
                aria-label="Đăng xuất"
                className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Button variant="primary" size="sm" onClick={onOpenLogin} className="gap-1.5">
              <LogIn className="w-4 h-4" />
              Đăng nhập
            </Button>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Mở menu điều hướng"
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileOpen ? (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={cn(
                'w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer',
                activeTab === item.id
                  ? 'bg-[#0054A6]/10 text-[#0054A6] font-semibold'
                  : 'text-slate-700 hover:bg-slate-100'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </header>
  );
}
