import { LogOut, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { ThemeToggle } from '../../../components/ui/theme-toggle';
import { UitLogo } from '../../../components/ui/uit-logo';
import { cn } from '../../../lib/utils';
import type { AuthUser } from '../../../types/library';
import { ROLE_LABELS, type NavItem, type NavPageId } from './navConfig';

interface SidebarProps {
  user: AuthUser;
  activePage: NavPageId;
  sections: { title: string; items: NavItem[] }[];
  onSelect: (id: NavPageId) => void;
  onCloseMobile: () => void;
  onLogout: () => void;
}

export function Sidebar({
  user,
  activePage,
  sections,
  onSelect,
  onCloseMobile,
  onLogout,
}: SidebarProps) {
  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <UitLogo className="w-8 h-8" />
          <div className="min-w-0">
            <span className="block text-sm font-bold text-slate-900 tracking-tight truncate">
              Thư viện UIT
            </span>
            <span className="block text-[11px] text-slate-400 truncate">
              ĐHQG-HCM
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Đóng thanh điều hướng"
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <nav
        aria-label="Điều hướng chính"
        className="flex-1 overflow-y-auto px-3 py-4 space-y-5"
      >
        {sections.map((group) => (
          <div key={group.title}>
            <p className="px-3 mb-1.5 text-[11px] font-semibold text-slate-400">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                const label =
                  user.VaiTro === 'READER' && item.readerLabel
                    ? item.readerLabel
                    : item.label;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelect(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left',
                      isActive
                        ? 'bg-[#EFF6FF] text-[#0054A6]'
                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-4 h-4 shrink-0',
                        isActive ? 'text-[#0054A6]' : 'text-slate-400'
                      )}
                    />
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 shrink-0">
        <div className="px-2 py-1.5">
          <p className="text-sm font-semibold text-slate-900 truncate">{user.HoTen}</p>
          <p className="text-xs text-slate-500 truncate mt-0.5">
            {ROLE_LABELS[user.VaiTro]} · {user.TenDangNhap}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2.5 justify-center"
          onClick={onLogout}
        >
          <LogOut className="w-3.5 h-3.5" />
          Đăng xuất
        </Button>
      </div>
    </div>
  );
}
