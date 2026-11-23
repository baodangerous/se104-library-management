import * as React from 'react';
import {
  BookCopy,
  BookDown,
  BookUp,
  DatabaseBackup,
  DoorOpen,
  History,
  Newspaper,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
  UserCog,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { circulationService } from '../../../services/circulationService';
import type { AuthUser, DashboardSummary, UserRole } from '../../../types/library';
import type { NavPageId } from '../layout/navConfig';
import { DashboardCharts } from './DashboardCharts';
import { KpiGrid } from './KpiGrid';
import { RecentActivitySection } from './RecentActivitySection';

interface RoleBannerConfig {
  badge: string;
  subtitle: string;
  gradient: string;
  actions: Array<{
    target: NavPageId;
    label: string;
    primary?: boolean;
    Icon: React.ComponentType<{ className?: string }>;
  }>;
}

const ROLE_BANNERS: Record<Exclude<UserRole, 'READER'>, RoleBannerConfig> = {
  ADMIN: {
    badge: 'Quản trị viên Hệ thống · Toàn quyền',
    subtitle:
      'Giám sát toàn bộ kho học liệu, phân quyền 4 cấp tài khoản, tin tức Portal, nhật ký bảo mật và sao lưu CSDL SQLite.',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 52%, #0054A6 100%)',
    actions: [
      { target: 'accounts', label: 'Tài khoản & Phân quyền', primary: true, Icon: UserCog },
      { target: 'news', label: 'Tin tức & Sự kiện', Icon: Newspaper },
      { target: 'audit', label: 'Nhật ký hệ thống', Icon: History },
      { target: 'backup', label: 'Sao lưu & Khôi phục', Icon: DatabaseBackup },
    ],
  },
  HEAD_LIBRARIAN: {
    badge: 'Phụ trách Thư viện · Điều hành',
    subtitle:
      'Điều phối chuyên môn, duyệt tin sự kiện Portal, quản lý sách & tác giả, quy định lưu thông và tài khoản nhân sự/độc giả.',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #0f766e 52%, #0054A6 100%)',
    actions: [
      { target: 'news', label: 'Đăng Tin tức & Sự kiện', primary: true, Icon: Newspaper },
      { target: 'books', label: 'Kho sách & Tác giả', Icon: BookCopy },
      { target: 'accounts', label: 'Quản lý Tài khoản', Icon: UserCog },
      { target: 'regulations', label: 'Quy định & Nhật ký', Icon: SlidersHorizontal },
    ],
  },
  LIBRARIAN: {
    badge: 'Chuyên viên Thư viện · Nghiệp vụ quầy',
    subtitle:
      'Phục vụ mượn trả nhanh chóng, cấp/gia hạn thẻ độc giả, tiếp nhận sách mới và xử lý đặt phòng họp A2.01 / A2.02.',
    gradient: 'linear-gradient(135deg, #030a24 0%, #0a2b86 58%, #1556d6 100%)',
    actions: [
      { target: 'loans', label: 'Cho mượn sách', primary: true, Icon: BookUp },
      { target: 'returns', label: 'Nhận trả sách', Icon: BookDown },
      { target: 'service-requests', label: 'Yêu cầu & Đặt phòng', Icon: DoorOpen },
      { target: 'readers', label: 'Quản lý độc giả', Icon: Users },
    ],
  },
};

export function DashboardPage({
  user,
  onNavigate,
}: {
  user?: AuthUser;
  onNavigate: (page: NavPageId) => void;
}) {
  const [data, setData] = React.useState<DashboardSummary | null>(null);
  const [loading, setLoading] = React.useState(true);

  const loadSummary = React.useCallback(async () => {
    setLoading(true);
    try {
      setData(await circulationService.getDashboardSummary());
    } catch (err: any) {
      toast.error(err?.message || 'Không thể tải dữ liệu tổng quan.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-slate-200/80 h-40 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 h-28 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl h-80 animate-pulse" />
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl h-80 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const roleKey: Exclude<UserRole, 'READER'> =
    user?.VaiTro === 'ADMIN' || user?.VaiTro === 'HEAD_LIBRARIAN'
      ? user.VaiTro
      : 'LIBRARIAN';
  const banner = ROLE_BANNERS[roleKey];

  return (
    <div className="space-y-6">
      {/* Role-Aware Vibrant Hero Banner */}
      <section
        className="relative overflow-hidden rounded-2xl border border-white/15 shadow-lg p-6 sm:p-7 text-white"
        style={{ background: banner.gradient }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
        <div className="pointer-events-none absolute -top-20 -right-16 w-72 h-72 rounded-full bg-cyan-300/15 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 w-64 h-64 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 border border-white/25 font-semibold text-cyan-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                {banner.badge}
              </span>
              <button
                type="button"
                onClick={loadSummary}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/90 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                Làm mới số liệu
              </button>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {user ? `Xin chào, ${user.HoTen}` : 'Tổng quan hoạt động Thư viện UIT'}
            </h2>
            <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed">
              {banner.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 shrink-0">
            {banner.actions.map(({ target, label, primary, Icon }) => (
              <button
                key={target}
                type="button"
                onClick={() => onNavigate(target)}
                className={
                  primary
                    ? 'flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white text-[#0054A6] font-semibold text-xs shadow-sm hover:bg-sky-50 transition-colors cursor-pointer'
                    : 'flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/12 hover:bg-white/22 border border-white/20 text-white font-medium text-xs backdrop-blur-xs transition-colors cursor-pointer'
                }
              >
                <Icon className={`w-4 h-4 shrink-0 ${primary ? 'text-[#0054A6]' : 'text-cyan-300'}`} />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <KpiGrid data={data} />
      <DashboardCharts data={data} />
      <RecentActivitySection data={data} onNavigate={onNavigate} />
    </div>
  );
}
