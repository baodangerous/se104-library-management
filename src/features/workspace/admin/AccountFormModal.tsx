import * as React from 'react';
import { Button } from '../../../components/ui/button';
import { ModalDialog } from '../../../components/ui/dialog';
import { Input, Label, Select } from '../../../components/ui/input';
import type { DocGia, TaiKhoan, UserRole } from '../../../types/library';
import type { AccountFormState } from './useAccounts';

interface AccountFormModalProps {
  open: boolean;
  editing: TaiKhoan | null;
  form: AccountFormState;
  readers: DocGia[];
  currentRole: UserRole;
  saving: boolean;
  onOpenChange: (open: boolean) => void;
  onChangeForm: React.Dispatch<React.SetStateAction<AccountFormState>>;
  onSubmit: (e: React.FormEvent) => void;
}

export function AccountFormModal({
  open,
  editing,
  form,
  readers,
  currentRole,
  saving,
  onOpenChange,
  onChangeForm,
  onSubmit,
}: AccountFormModalProps) {
  return (
    <ModalDialog
      open={open}
      onOpenChange={onOpenChange}
      title={editing ? `Cập nhật tài khoản: ${editing.TenDangNhap}` : 'Tạo tài khoản mới'}
      maxWidthClass="max-w-md"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {!editing ? (
          <div className="space-y-1.5">
            <Label htmlFor="acc-user">Tên đăng nhập</Label>
            <Input
              id="acc-user"
              value={form.TenDangNhap}
              onChange={(e) => onChangeForm((p) => ({ ...p, TenDangNhap: e.target.value }))}
              required
            />
          </div>
        ) : null}

        <div className="space-y-1.5">
          <Label htmlFor="acc-name">Họ và tên</Label>
          <Input
            id="acc-name"
            value={form.HoTen}
            onChange={(e) => onChangeForm((p) => ({ ...p, HoTen: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="acc-pass">
            {editing ? 'Mật khẩu mới (để trống nếu giữ nguyên)' : 'Mật khẩu (>= 6 ký tự)'}
          </Label>
          <Input
            id="acc-pass"
            type="password"
            value={form.MatKhau}
            onChange={(e) => onChangeForm((p) => ({ ...p, MatKhau: e.target.value }))}
            required={!editing}
            minLength={editing ? undefined : 6}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="acc-role">Vai trò</Label>
            <Select
              id="acc-role"
              value={form.VaiTro}
              onChange={(e) =>
                onChangeForm((p) => ({ ...p, VaiTro: e.target.value as UserRole }))
              }
            >
              {currentRole === 'ADMIN' ? (
                <>
                  <option value="ADMIN">ADMIN (Quản trị viên)</option>
                  <option value="HEAD_LIBRARIAN">HEAD_LIBRARIAN (Phụ trách thư viện)</option>
                </>
              ) : null}
              <option value="LIBRARIAN">LIBRARIAN (Chuyên viên thư viện)</option>
              <option value="READER">READER (Độc giả)</option>
            </Select>
          </div>
          {editing ? (
            <div className="space-y-1.5">
              <Label htmlFor="acc-status">Trạng thái</Label>
              <Select
                id="acc-status"
                value={form.TrangThai}
                onChange={(e) =>
                  onChangeForm((p) => ({
                    ...p,
                    TrangThai: e.target.value as 'ACTIVE' | 'LOCKED',
                  }))
                }
              >
                <option value="ACTIVE">Hoạt động</option>
                <option value="LOCKED">Tạm khóa</option>
              </Select>
            </div>
          ) : null}
        </div>

        {form.VaiTro === 'READER' ? (
          <div className="space-y-1.5">
            <Label htmlFor="acc-reader">Liên kết thẻ độc giả</Label>
            <Select
              id="acc-reader"
              value={form.MaDocGia}
              onChange={(e) => onChangeForm((p) => ({ ...p, MaDocGia: e.target.value }))}
            >
              <option value="">-- Không liên kết --</option>
              {readers.map((r) => (
                <option key={r.MaDocGia} value={r.MaDocGia}>
                  {r.MaDocGia} — {r.HoTen}
                </option>
              ))}
            </Select>
          </div>
        ) : null}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Hủy bỏ
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu tài khoản'}
          </Button>
        </div>
      </form>
    </ModalDialog>
  );
}
