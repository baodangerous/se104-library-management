import * as React from 'react';
import { Card, CardBody, CardHeader } from '../../../components/ui/card';
import { DataTable, type DataTableColumn } from '../../../components/ui/data-table';
import { formatDateVn, formatVnd } from '../../../services/rules/dateUtils';
import type { PhieuThuTienPhat } from '../../../types/library';

export function FineHistoryTable({
  receipts,
  loading,
}: {
  receipts: PhieuThuTienPhat[];
  loading: boolean;
}) {
  const columns = React.useMemo<DataTableColumn<PhieuThuTienPhat>[]>(
    () => [
      {
        accessorKey: 'MaPhieuThu',
        header: 'Mã phiếu',
        cell: ({ row }) => (
          <span className="font-mono text-xs font-semibold text-[#0054A6]">
            {row.original.MaPhieuThu}
          </span>
        ),
      },
      {
        accessorKey: 'HoTenDocGia',
        header: 'Độc giả',
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-slate-900">{row.original.HoTenDocGia}</div>
            <div className="text-xs font-mono text-slate-500">{row.original.MaDocGia}</div>
          </div>
        ),
      },
      {
        accessorKey: 'NgayThu',
        header: 'Ngày thu',
        cell: ({ row }) => (
          <span className="tabular-nums text-xs">{formatDateVn(row.original.NgayThu)}</span>
        ),
      },
      {
        accessorKey: 'TongNoTruocThu',
        header: 'Nợ trước thu',
        cell: ({ row }) => (
          <span className="tabular-nums text-xs text-slate-600">
            {formatVnd(row.original.TongNoTruocThu)}
          </span>
        ),
      },
      {
        accessorKey: 'SoTienThu',
        header: 'Số tiền thu',
        cell: ({ row }) => (
          <span className="tabular-nums text-xs font-semibold text-emerald-700">
            {formatVnd(row.original.SoTienThu)}
          </span>
        ),
      },
      {
        accessorKey: 'ConLai',
        header: 'Còn lại',
        cell: ({ row }) => (
          <span className="tabular-nums text-xs font-medium text-slate-700">
            {formatVnd(row.original.ConLai)}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <Card className="lg:col-span-7">
      <CardHeader
        title="Lịch sử phiếu thu tiền phạt"
        description={`${receipts.length} biên lai đã phát hành`}
      />
      <CardBody className="p-0">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Đang tải dữ liệu...</div>
        ) : (
          <DataTable
            columns={columns}
            data={receipts}
            emptyTitle="Chưa có phiếu thu tiền phạt nào."
          />
        )}
      </CardBody>
    </Card>
  );
}
