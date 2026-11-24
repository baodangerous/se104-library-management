import * as React from 'react';
import { Pencil, ShieldCheck, ShieldPlus, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { Card, CardBody, CardHeader } from '../../../components/ui/card';
import { DataTable, type DataTableColumn } from '../../../components/ui/data-table';
import { ConfirmDialog } from '../../../components/ui/dialog';
import { operationalService } from '../../../services/operationalService';
import { formatDateVn } from '../../../services/rules/dateUtils';
import type { ChiNhanh, PhamViChiNhanh, QuyenItem, TaiKhoan, UserRole, VaiTroQuyen } from '../../../types/library';
import { AccountFormModal } from './AccountFormModal';
import { useAccounts } from './useAccounts';

const ROLE_TEXT: Record<UserRole, string> = {
  ADMIN: 'Quản trị hệ thống',
  HEAD_LIBRARIAN: 'Quản lý thư viện',
  LIBRARIAN: 'Thủ thư',
  CATALOGER: 'Nhân viên biên mục',
  READER: 'Độc giả UIT',
};

export function AccountsPage({ currentRole }: { currentRole: UserRole }) {
  const state = useAccounts();
  const [tab, setTab] = React.useState<'accounts' | 'matrix'>('accounts');
  const [matrix, setMatrix] = React.useState<{
    permissions: QuyenItem[];
    rolePermissions: VaiTroQuyen[];
    branchScopes: PhamViChiNhanh[];
    branches: ChiNhanh[];
  } | null>(null);

  const loadMatrix = React.useCallback(async () => {
    try {
      const data = await operationalService.getPermissionMatrix();
      setMatrix(data);
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    if (tab === 'matrix') void loadMatrix();
  }, [tab, loadMatrix]);

  async function handleTogglePerm(role: UserRole, maQuyen: string, enabled: boolean) {
    try {
      await operationalService.toggleRolePermission({ MaVaiTro: role, MaQuyen: maQuyen, enabled });
      await loadMatrix();
      toast.success(`Đã ${enabled ? 'cấp' : 'thu hồi'} quyền ${maQuyen} cho ${role}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể cập nhật phân quyền.');
    }
  }

  async function handleToggleBranch(maTaiKhoan: number, maCN: string, enabled: boolean) {
    try {
      await operationalService.toggleBranchScope({ MaTaiKhoan: maTaiKhoan, MaCN: maCN, enabled });
      await loadMatrix();
      toast.success(`Đã cập nhật phạm vi chi nhánh ${maCN}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể cập nhật chi nhánh.');
    }
  }

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

      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setTab('accounts')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
            tab === 'accounts' ? 'bg-[#0054A6] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Danh sách tài khoản
        </button>
        <button
          type="button"
          onClick={() => setTab('matrix')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
            tab === 'matrix' ? 'bg-[#0054A6] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Ma trận phân quyền &amp; Chi nhánh
        </button>
      </div>

      {tab === 'accounts' ? (
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
      ) : (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
            <div className="px-4 py-3 border-b border-slate-200 font-semibold text-sm text-slate-900">
              Ma trận phân quyền theo chức năng (QUYEN – VAITROQUYEN)
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Quyền chức năng</th>
                  {(['ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN', 'CATALOGER', 'READER'] as UserRole[]).map((r) => (
                    <th key={r} className="px-3 py-2.5 text-center">{ROLE_TEXT[r]}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matrix?.permissions.map((p) => (
                  <tr key={p.MaQuyen} className="hover:bg-slate-50">
                    <td className="px-4 py-2">
                      <p className="font-medium text-slate-800">{p.TenQuyen}</p>
                      <p className="font-mono text-[10px] text-slate-400">{p.MaQuyen} · {p.NhomChucNang}</p>
                    </td>
                    {(['ADMIN', 'HEAD_LIBRARIAN', 'LIBRARIAN', 'CATALOGER', 'READER'] as UserRole[]).map((role) => {
                      const checked = matrix.rolePermissions.some(
                        (rp) => rp.MaVaiTro === role && rp.MaQuyen === p.MaQuyen
                      );
                      return (
                        <td key={role} className="px-3 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={currentRole !== 'ADMIN'}
                            onChange={(e) => handleTogglePerm(role, p.MaQuyen, e.target.checked)}
                            className="h-4 w-4 accent-[#0054A6] cursor-pointer"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
            <div className="px-4 py-3 border-b border-slate-200 font-semibold text-sm text-slate-900">
              Phạm vi chi nhánh nhân viên (PHAMVICHINHANH)
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Nhân viên</th>
                  <th className="px-4 py-2.5">Vai trò</th>
                  {matrix?.branches.map((b) => (
                    <th key={b.MaCN} className="px-4 py-2.5 text-center">{b.MaCN}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.accounts
                  .filter((a) => a.VaiTro !== 'READER')
                  .map((acc) => (
                    <tr key={acc.MaTaiKhoan}>
                      <td className="px-4 py-2 font-medium">{acc.HoTen} ({acc.TenDangNhap})</td>
                      <td className="px-4 py-2 text-slate-500">{ROLE_TEXT[acc.VaiTro]}</td>
                      {matrix?.branches.map((b) => {
                        const checked = matrix.branchScopes.some(
                          (bs) => bs.MaTaiKhoan === acc.MaTaiKhoan && bs.MaCN === b.MaCN
                        );
                        return (
                          <td key={b.MaCN} className="px-4 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => handleToggleBranch(acc.MaTaiKhoan, b.MaCN, e.target.checked)}
                              className="h-4 w-4 accent-[#0054A6] cursor-pointer"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AccountFormModal
        open={state.modalOpen}
        editing={state.editing}
        form={state.form}
        readers={state.readers}
        currentRole={currentRole}
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
