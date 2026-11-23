import * as React from 'react';
import { KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { ModalDialog } from '../../components/ui/dialog';
import { Input, Label } from '../../components/ui/input';
import { authService } from '../../services/authService';

interface ChangePasswordModalProps {
  open: boolean;
  username: string;
  onOpenChange: (open: boolean) => void;
}

export function ChangePasswordModal({
  open,
  username,
  onOpenChange,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Xác nhận mật khẩu mới không khớp.');
      return;
    }
    setSaving(true);
    try {
      const res = await authService.changePassword(currentPassword, newPassword, confirmPassword);
      toast.success(res.message || 'Đổi mật khẩu thành công.');
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message || 'Không thể đổi mật khẩu.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ModalDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Đổi mật khẩu tài khoản"
      description={`Cập nhật mật khẩu cá nhân cho tài khoản ${username}`}
      maxWidthClass="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="cp-current">Mật khẩu hiện tại</Label>
          <Input
            id="cp-current"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Nhập mật khẩu được cấp hoặc mật khẩu hiện tại"
            autoComplete="current-password"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cp-new">Mật khẩu mới (tối thiểu 6 ký tự)</Label>
          <Input
            id="cp-new"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cp-confirm">Xác nhận mật khẩu mới</Label>
          <Input
            id="cp-confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type="submit" disabled={saving} className="gap-1.5">
            <KeyRound className="w-4 h-4" />
            {saving ? 'Đang cập nhật...' : 'Lưu mật khẩu mới'}
          </Button>
        </div>
      </form>
    </ModalDialog>
  );
}
