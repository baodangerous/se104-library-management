import * as React from 'react';
import { Globe, LogOut, Menu } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import type { AuthUser } from '../../../types/library';
import { NAV_ITEMS, ROLE_LABELS, type NavItem, type NavPageId } from './navConfig';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  user: AuthUser;
  activePage: NavPageId;
  onNavigate: (page: NavPageId) => void;
  onBackToPortal: () => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export function AppShell({
  user,
  activePage,
  onNavigate,
  onBackToPortal,
  onLogout,
  children,
}: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const visibleItems = React.useMemo(
    () => NAV_ITEMS.filter((item) => item.roles.includes(user.VaiTro)),
    [user.VaiTro]
  );

  const sections = React.useMemo(() => {
    const groups: { title: string; items: NavItem[] }[] = [];
    for (const item of visibleItems) {
      let grp = groups.find((g) => g.title === item.section);
      if (!grp) {
        grp = { title: item.section, items: [] };
        groups.push(grp);
      }
      grp.items.push(item);
    }
    return groups;
  }, [visibleItems]);

  const currentItem = visibleItems.find((i) => i.id === activePage) || visibleItems[0];
  const headerTitle =
    user.VaiTro === 'READER' && currentItem?.readerLabel
      ? currentItem.readerLabel
      : currentItem?.label;

  function handleSelect(id: NavPageId) {
    onNavigate(id);
    setMobileMenuOpen(false);
  }

  return (
    <div className="relative min-h-screen bg-[#f4f7fc] flex">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden dark:hidden"
      >
        <div
          className="absolute -top-32 right-0 w-[680px] h-[420px] rounded-full opacity-45 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(58,134,255,0.14), rgba(0,84,166,0.04) 60%, transparent 75%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: 'radial-gradient(#94a3b8 0.85px, transparent 0.85px)',
            backgroundSize: '26px 26px',
          }}
        />
      </div>
      <aside className="hidden lg:block w-[260px] shrink-0 fixed inset-y-0 left-0 z-30 no-print">
        <Sidebar
          user={user}
          activePage={activePage}
          sections={sections}
          onSelect={handleSelect}
          onCloseMobile={() => setMobileMenuOpen(false)}
          onLogout={onLogout}
        />
      </aside>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden no-print">
          <div
            className="fixed inset-0 bg-slate-900/40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-[270px] z-10">
            <Sidebar
              user={user}
              activePage={activePage}
              sections={sections}
              onSelect={handleSelect}
              onCloseMobile={() => setMobileMenuOpen(false)}
              onLogout={onLogout}
            />
          </div>
        </div>
      ) : null}

      <div className="relative z-10 flex-1 lg:pl-[260px] min-w-0 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-20 no-print">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Mở trình đơn điều hướng"
              className="lg:hidden p-2 -ml-1 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm min-w-0">
              <span className="text-slate-400 hidden sm:inline whitespace-nowrap">
                Thư viện UIT
              </span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <h1 className="font-semibold text-slate-900 truncate">{headerTitle}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 text-xs text-slate-600">
            <span className="hidden xl:inline whitespace-nowrap">
              {user.HoTen} · {ROLE_LABELS[user.VaiTro]}
            </span>
            <Button variant="outline" size="sm" onClick={onBackToPortal} className="gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#0054A6]" />
              <span className="hidden sm:inline">Cổng Thư viện</span>
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout} className="gap-1.5">
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-[1360px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
