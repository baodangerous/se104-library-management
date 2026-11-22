import * as React from 'react';
import { CalendarPlus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import type { DataTableColumn } from '../../../components/ui/data-table';
import { formatDateVn, formatVnd, todayIsoDate } from '../../../services/rules/dateUtils';
import type { DocGia } from '../../../types/library';

export function buildReaderColumns(
  onEdit: (reader: DocGia) => void,
  onDelete: (reader: DocGia) => void,
  onRenew?: (reader: DocGia) => void
): DataTableColumn<DocGia>[] {
  const today = todayIsoDate();

  return [
    {
      accessorKey: 'MaDocGia',
      header: 'Mã ĐG',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-slate-900">
          {row.original.MaDocGia}
        </span>
      ),
    },
    {
      accessorKey: 'HoTen',
      header: 'Họ tên & Email',
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-slate-900">{row.original.HoTen}</p>
          <p className="text-xs text-slate-500">{row.original.Email}</p>
        </div>
      ),
    },
    {
      accessorKey: 'TenLoaiDocGia',
      header: 'Loại độc giả',
      cell: ({ row }) => (
        <span className="text-xs text-slate-700">{row.original.TenLoaiDocGia}</span>
      ),
    },
    {
      accessorKey: 'NgaySinh',
      header: 'Ngày sinh',
      cell: ({ row }) => (
        <span className="font-mono text-xs tabular-nums text-slate-600">
          {formatDateVn(row.original.NgaySinh)}
        </span>
      ),
    },
    {
      accessorKey: 'NgayHetHan',
      header: 'Hiệu lực thẻ',
      cell: ({ row }) => {
        const expired = row.original.NgayHetHan < today;
        return (
          <div className="text-xs tabular-nums">
            <p className={expired ? 'text-red-700 font-medium' : 'text-emerald-700 font-medium'}>
              {expired ? 'Hết hạn' : 'Còn hạn'} · {formatDateVn(row.original.NgayHetHan)}
            </p>
            <p className="text-slate-400">Lập ngày {formatDateVn(row.original.NgayLapThe)}</p>
          </div>
        );
      },
    },
    {
      accessorKey: 'SoSachDangMuon',
      header: 'Đang mượn',
      cell: ({ row }) => {
        const active = row.original.SoSachDangMuon || 0;
        const overdue = row.original.SoSachQuaHan || 0;
        return (
          <span className="text-xs tabular-nums text-slate-700">
            {active} quyển
            {overdue > 0 ? (
              <span className="text-red-700 font-medium"> ({overdue} quá hạn)</span>
            ) : null}
          </span>
        );
      },
    },
    {
      accessorKey: 'TongNo',
      header: 'Tổng nợ',
      cell: ({ row }) => (
        <span
          className={`font-mono text-xs font-medium tabular-nums ${
            row.original.TongNo > 0 ? 'text-red-700' : 'text-slate-500'
          }`}
        >
          {formatVnd(row.original.TongNo)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Thao tác',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {onRenew ? (
            <Button
              variant="ghost"
              size="icon"
              title="Gia hạn thẻ độc giả"
              aria-label={`Gia hạn thẻ ${row.original.HoTen}`}
              onClick={() => onRenew(row.original)}
            >
              <CalendarPlus className="w-4 h-4 text-[#0054A6]" />
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Sửa độc giả ${row.original.HoTen}`}
            onClick={() => onEdit(row.original)}
          >
            <Pencil className="w-4 h-4 text-slate-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Xóa độc giả ${row.original.HoTen}`}
            onClick={() => onDelete(row.original)}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];
}
