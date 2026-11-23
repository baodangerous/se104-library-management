import * as React from 'react';
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  MessageSquarePlus,
  X,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { ThemeToggle } from '../../components/ui/theme-toggle';
import { UitLogo } from '../../components/ui/uit-logo';
import { cn } from '../../lib/utils';
import type { AuthUser } from '../../types/library';
import type { PortalTabId } from '../../types/portal';

const NAV_ITEMS: Array<{ id: PortalTabId; label: string }> = [
  { id: 'home', label: 'Trang chủ' },
  { id: 'catalog', label: 'Tra cứu' },
  { id: 'majors', label: 'Ngành học' },
  { id: 'services', label: 'Dịch vụ' },
  { id: 'about', label: 'Giới thiệu' },
];

interface PortalHeaderProps {
  activeTab: PortalTabId;
  onSelectTab: (tab: PortalTabId) => void;
  user: AuthUser | null;
  onOpenLogin: () => void;
  onOpenFeedback: () => void;
  onEnterWorkspace: () => void;
  onLogout: () => void;
}

export function PortalHeader({
  activeTab,
  onSelectTab,
  user,
  onOpenLogin,
  onOpenFeedback,
  onEnterWorkspace,
  onLogout,
}: PortalHeaderProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleSelect = (tab: PortalTabId) => {
    onSelectTab(tab);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs">
      {/* Single-tier Main Navbar */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
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
        <nav aria-label="Điều hướng chính" className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap',
                  active
                    ? 'bg-gradient-to-r from-[#3a86ff] to-[#1556d6] dark:from-[#8fefff] dark:to-[#4da8ff] text-white dark:text-[#030a24] font-semibold shadow-xs'
                    : 'text-slate-700 hover:text-[#1556d6] hover:bg-[#dcebff]/60'
                )}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Auth / Workspace Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenFeedback}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0054A6] bg-[#0054A6]/8 hover:bg-[#0054A6]/15 border border-[#0054A6]/20 transition-colors cursor-pointer whitespace-nowrap"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Liên hệ &amp; Góp ý</span>
          </button>
          <ThemeToggle />
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
            <Button variant="outline" size="sm" onClick={onOpenLogin} className="gap-1.5">
              <LogIn className="w-4 h-4" />
              Đăng nhập
            </Button>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Mở menu điều hướng"
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileOpen ? (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
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
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onOpenFeedback();
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-[#0054A6] bg-[#0054A6]/8 hover:bg-[#0054A6]/15 flex items-center gap-2 cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4" />
            Liên hệ &amp; Đóng góp ý kiến
          </button>
        </div>
      ) : null}
    </header>
  );
}
