import * as React from 'react';
import { RefreshCw, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { Card, CardBody, CardHeader } from '../../../components/ui/card';
import { DataTable, type DataTableColumn } from '../../../components/ui/data-table';
import { Input } from '../../../components/ui/input';
import { WorkspacePageHeader } from '../../../components/ui/workspace-header';
import { adminService } from '../../../services/adminService';
import type { NhatKyThaoTac } from '../../../types/library';

export function AuditLogPage() {
  const [logs, setLogs] = React.useState<NhatKyThaoTac[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');

  const loadLogs = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.listAuditLogs(150);
      setLogs(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi tải nhật ký thao tác');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return logs;
    return logs.filter(
      (l) =>
        l.TenDangNhap.toLowerCase().includes(q) ||
        l.HanhDong.toLowerCase().includes(q) ||
        l.BangTacDong.toLowerCase().includes(q) ||
        l.ChiTiet.toLowerCase().includes(q)
    );
  }, [logs, search]);

  const columns = React.useMemo<DataTableColumn<NhatKyThaoTac>[]>(
    () => [
      {
        accessorKey: 'ThoiGian',
        header: 'Thời gian',
        cell: ({ row }) => (
          <span className="font-mono text-xs text-slate-500 tabular-nums whitespace-nowrap">
            {row.original.ThoiGian.replace('T', ' ').slice(0, 19)}
          </span>
        ),
      },
      {
        accessorKey: 'TenDangNhap',
        header: 'Tài khoản',
        cell: ({ row }) => (
          <div>
            <span className="font-mono text-xs font-semibold text-slate-900">
              {row.original.TenDangNhap}
            </span>
            <span className="ml-1.5 text-[11px] text-slate-500">({row.original.VaiTro})</span>
          </div>
        ),
      },
      {
        accessorKey: 'HanhDong',
        header: 'Hành động',
        cell: ({ row }) => (
          <span className="font-mono text-xs font-semibold text-[#0054A6]">
            {row.original.HanhDong}
          </span>
        ),
      },
      {
        accessorKey: 'BangTacDong',
        header: 'Bảng tác động',
        cell: ({ row }) => (
          <span className="font-mono text-xs text-slate-700">{row.original.BangTacDong}</span>
        ),
      },
      {
        accessorKey: 'ChiTiet',
        header: 'Chi tiết nghiệp vụ',
        cell: ({ row }) => <span className="text-xs text-slate-700">{row.original.ChiTiet}</span>,
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <WorkspacePageHeader
        eyebrow="Quản trị & Bảo mật"
        title="Nhật ký hoạt động"
        description="Theo dõi lịch sử thao tác quản trị, lưu thông học liệu và truy cập hệ thống Thư viện UIT."
        actions={
          <Button variant="outline" size="sm" onClick={loadLogs}>
            <RefreshCw className="w-4 h-4" /> Làm mới
          </Button>
        }
      />

      <Card>
        <CardHeader
          title="Lịch sử truy vết"
          description={`Hiển thị ${filtered.length} bản ghi gần nhất`}
          action={
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Lọc tài khoản, hành động..."
                className="pl-9"
              />
            </div>
          }
        />
        <CardBody className="p-0">
          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">Đang tải nhật ký...</div>
          ) : (
            <DataTable
              columns={columns}
              data={filtered}
              pageSize={15}
              emptyTitle="Chưa có bản ghi nhật ký phù hợp."
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}
