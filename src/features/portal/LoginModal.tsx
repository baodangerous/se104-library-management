import * as React from 'react';
import { Lock, LogIn, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { ModalDialog } from '../../components/ui/dialog';
import { FieldLabel, TextInput } from '../../components/ui/input';
import { UitLogo } from '../../components/ui/uit-logo';
import { authService } from '../../services/authService';
import type { AuthUser, UserRole } from '../../types/library';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess: (user: AuthUser) => void;
}

const QUICK_ROLES: Array<{ role: UserRole; label: string }> = [
  { role: 'ADMIN', label: 'Admin' },
  { role: 'LIBRARIAN', label: 'Thủ thư' },
  { role: 'READER', label: 'Sinh viên' },
];

export function LoginModal({
  open,
  onOpenChange,
  onLoginSuccess,
}: LoginModalProps) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      toast.error('Vui lòng nhập đầy đủ tài khoản và mật khẩu.');
      return;
    }
    setLoading(true);
    try {
      const user = await authService.login(username.trim(), password);
      toast.success(`Xin chào, ${user.HoTen}!`);
      onLoginSuccess(user);
      onOpenChange(false);
      setPassword('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Đăng nhập thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: UserRole) => {
    setLoading(true);
    try {
      const user = await authService.demoLogin(role);
      toast.success(`Đăng nhập nhanh: ${user.HoTen}`);
      onLoginSuccess(user);
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể đăng nhập nhanh.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Đăng nhập Thư viện UIT"
      description="Truy cập không gian quản trị thư viện hoặc hồ sơ thẻ độc giả của bạn."
      maxWidthClass="max-w-md"
    >
      <div className="space-y-5">
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <UitLogo className="w-10 h-10" />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">
              Cổng tra cứu &amp; Quản trị Học liệu
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Trường Đại học Công nghệ Thông tin – ĐHQG-HCM
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <FieldLabel htmlFor="portal-login-user" required>
              Tài khoản / Email UIT
            </FieldLabel>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <TextInput
                id="portal-login-user"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="VD: thuthu@uit.edu.vn hoặc MSSV"
                className="pl-9"
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="portal-login-pass" required>
              Mật khẩu
            </FieldLabel>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <TextInput
                id="portal-login-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu của bạn"
                className="pl-9"
                autoComplete="current-password"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full h-10 gap-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Đang xác thực...' : 'Đăng nhập'}
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <p className="text-xs text-center text-slate-500">
            Tài khoản trải nghiệm nhanh
          </p>
          <div className="grid grid-cols-3 gap-2">
            {QUICK_ROLES.map((item) => (
              <button
                key={item.role}
                type="button"
                disabled={loading}
                onClick={() => handleQuickLogin(item.role)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 bg-slate-50 text-slate-700 hover:border-[#0054A6] hover:text-[#0054A6] hover:bg-[#0054A6]/5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ModalDialog>
  );
}
