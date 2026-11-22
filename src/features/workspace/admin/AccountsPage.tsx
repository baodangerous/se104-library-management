import * as React from 'react';
import { Pencil, ShieldPlus, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardBody, CardHeader } from '../../../components/ui/card';
import { DataTable, type DataTableColumn } from '../../../components/ui/data-table';
import { ConfirmDialog } from '../../../components/ui/dialog';
import { formatDateVn } from '../../../services/rules/dateUtils';
import type { TaiKhoan, UserRole } from '../../../types/library';
import { AccountFormModal } from './AccountFormModal';
import { useAccounts } from './useAccounts';

const ROLE_TEXT: Record<UserRole, string> = {
  ADMIN: 'Quản trị viên',
  LIBRARIAN: 'Thủ thư',
  READER: 'Độc giả UIT',
};

export function AccountsPage() {
  const state = useAccounts();

  const columns = React.useMemo<DataTableColumn<TaiKhoan>[]>(
    () => [
      {
        accessorKey: 'TenDangNhap',
        header: 'Tên đăng nhập',
        cell: ({ row }) => (
          <span className="font-mono text-xs font-semibold text-[#0054A6]">
            {row.original.TenDangNhap}
          </span>
        ),
      },
      {
        accessorKey: 'HoTen',
        header: 'Họ tên',
        cell: ({ row }) => <span className="font-medium text-slate-900">{row.original.HoTen}</span>,
      },
      {
        accessorKey: 'VaiTro',
        header: 'Vai trò',
        cell: ({ row }) => (
          <span className="text-xs font-semibold text-slate-700">
            {ROLE_TEXT[row.original.VaiTro]}
          </span>
        ),
      },
      {
        accessorKey: 'MaDocGia',
        header: 'Mã độc giả',
        cell: ({ row }) => (
          <span className="font-mono text-xs text-slate-500">
            {row.original.MaDocGia || '—'}
          </span>
        ),
      },
      {
        accessorKey: 'TrangThai',
        header: 'Trạng thái',
        cell: ({ row }) => (
          <span
            className={`text-xs font-semibold ${
              row.original.TrangThai === 'ACTIVE' ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {row.original.TrangThai === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
          </span>
        ),
      },
      {
        accessorKey: 'NgayTao',
        header: 'Ngày tạo',
        cell: ({ row }) => (
          <span className="text-xs text-slate-500 tabular-nums">
            {formatDateVn(row.original.NgayTao)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Sửa tài khoản"
              onClick={() => state.openEdit(row.original)}
            >
              <Pencil className="w-3.5 h-3.5 text-slate-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Xóa tài khoản"
              onClick={() => state.setDeleting(row.original)}
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            </Button>
          </div>
        ),
      },
    ],
    [state]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Tài khoản &amp; Phân quyền</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý tài khoản đăng nhập và phân quyền sử dụng cho Quản trị viên, Thủ thư và Độc
            giả UIT.
          </p>
        </div>
        <Button onClick={state.openCreate}>
          <ShieldPlus className="w-4 h-4" /> Tạo tài khoản
        </Button>
      </div>

      <Card>
        <CardHeader
          title="Danh sách tài khoản hệ thống"
          description={`${state.accounts.length} tài khoản đã đăng ký`}
        />
        <CardBody className="p-0">
          {state.loading ? (
            <div className="p-8 text-center text-sm text-slate-500">Đang tải dữ liệu...</div>
          ) : (
            <DataTable columns={columns} data={state.accounts} />
          )}
        </CardBody>
      </Card>

      <AccountFormModal
        open={state.modalOpen}
        editing={state.editing}
        form={state.form}
        readers={state.readers}
        saving={state.saving}
        onOpenChange={state.setModalOpen}
        onChangeForm={state.setForm}
        onSubmit={state.handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(state.deleting)}
        onOpenChange={(open) => !open && state.setDeleting(null)}
        title="Xác nhận xóa tài khoản"
        description={
          state.deleting
            ? `Bạn có chắc chắn muốn xóa tài khoản "${state.deleting.TenDangNhap}"?`
            : ''
        }
        onConfirm={state.confirmDelete}
      />
    </div>
  );
}
