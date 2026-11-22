import * as React from 'react';
import { toast } from 'sonner';
import { adminService } from '../../../services/adminService';
import { readerService } from '../../../services/readerService';
import type { DocGia, TaiKhoan, UserRole } from '../../../types/library';

export interface AccountFormState {
  TenDangNhap: string;
  MatKhau: string;
  HoTen: string;
  VaiTro: UserRole;
  MaDocGia: string;
  TrangThai: 'ACTIVE' | 'LOCKED';
}

const EMPTY_FORM: AccountFormState = {
  TenDangNhap: '',
  MatKhau: '',
  HoTen: '',
  VaiTro: 'LIBRARIAN',
  MaDocGia: '',
  TrangThai: 'ACTIVE',
};

export function useAccounts() {
  const [accounts, setAccounts] = React.useState<TaiKhoan[]>([]);
  const [readers, setReaders] = React.useState<DocGia[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<TaiKhoan | null>(null);
  const [deleting, setDeleting] = React.useState<TaiKhoan | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState<AccountFormState>(EMPTY_FORM);

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [a, r] = await Promise.all([
        adminService.listAccounts(),
        readerService.list(),
      ]);
      setAccounts(a);
      setReaders(r);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi tải danh sách tài khoản');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(acc: TaiKhoan) {
    setEditing(acc);
    setForm({
      TenDangNhap: acc.TenDangNhap,
      MatKhau: '',
      HoTen: acc.HoTen,
      VaiTro: acc.VaiTro,
      MaDocGia: acc.MaDocGia || '',
      TrangThai: acc.TrangThai,
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      if (editing) {
        await adminService.updateAccount(editing.MaTaiKhoan, {
          HoTen: form.HoTen,
          VaiTro: form.VaiTro,
          TrangThai: form.TrangThai,
          MaDocGia: form.VaiTro === 'READER' ? form.MaDocGia || null : null,
          MatKhauMoi: form.MatKhau.trim() || undefined,
        });
        toast.success(`Đã cập nhật tài khoản ${editing.TenDangNhap}.`);
      } else {
        await adminService.createAccount({
          TenDangNhap: form.TenDangNhap.trim(),
          MatKhau: form.MatKhau,
          HoTen: form.HoTen.trim(),
          VaiTro: form.VaiTro,
          MaDocGia: form.VaiTro === 'READER' ? form.MaDocGia || null : null,
        });
        toast.success(`Đã tạo tài khoản ${form.TenDangNhap.trim()}.`);
      }
      setModalOpen(false);
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể lưu tài khoản');
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await adminService.deleteAccount(deleting.MaTaiKhoan);
      toast.success(`Đã xóa tài khoản ${deleting.TenDangNhap}.`);
      setDeleting(null);
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể xóa tài khoản');
      setDeleting(null);
    }
  }

  return {
    accounts,
    readers,
    loading,
    modalOpen,
    setModalOpen,
    editing,
    deleting,
    setDeleting,
    saving,
    form,
    setForm,
    openCreate,
    openEdit,
    handleSubmit,
    confirmDelete,
  };
}
