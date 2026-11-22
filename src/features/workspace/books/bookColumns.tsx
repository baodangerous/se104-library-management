import * as React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import type { DataTableColumn } from '../../../components/ui/data-table';
import { formatDateVn, formatVnd } from '../../../services/rules/dateUtils';
import type { Sach } from '../../../types/library';

export function buildBookColumns(
  canEdit: boolean,
  canDelete: boolean,
  onEdit: (book: Sach) => void,
  onDelete: (book: Sach) => void
): DataTableColumn<Sach>[] {
  const base: DataTableColumn<Sach>[] = [
    {
      accessorKey: 'MaSach',
      header: 'Mã sách',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-slate-900">
          {row.original.MaSach}
        </span>
      ),
    },
    {
      accessorKey: 'TenSach',
      header: 'Tên sách & Tác giả',
      cell: ({ row }) => (
        <div className="max-w-md">
          <p className="font-medium text-slate-900">{row.original.TenSach}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {row.original.TacGiaList.join(', ')} · {row.original.NhaXuatBan} (
            {row.original.NamXuatBan})
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'TenTheLoai',
      header: 'Thể loại',
      cell: ({ row }) => (
        <span className="text-xs text-slate-700">{row.original.TenTheLoai}</span>
      ),
    },
    {
      accessorKey: 'NgayNhap',
      header: 'Ngày nhập',
      cell: ({ row }) => (
        <span className="font-mono text-xs tabular-nums text-slate-600">
          {formatDateVn(row.original.NgayNhap)}
        </span>
      ),
    },
    {
      accessorKey: 'TriGia',
      header: 'Trị giá',
      cell: ({ row }) => (
        <span className="font-mono text-xs tabular-nums text-slate-700">
          {formatVnd(row.original.TriGia)}
        </span>
      ),
    },
    {
      accessorKey: 'TinhTrang',
      header: 'Tình trạng',
      cell: ({ row }) => {
        const available = row.original.TinhTrang === 'Có sẵn';
        return (
          <div className="text-xs">
            <p
              className={
                available ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'
              }
            >
              {row.original.TinhTrang}
            </p>
            {!available && row.original.HanTraHienTai ? (
              <p className="text-slate-400 tabular-nums">
                Hạn trả {formatDateVn(row.original.HanTraHienTai)}
              </p>
            ) : null}
          </div>
        );
      },
    },
  ];

  if (!canEdit && !canDelete) return base;

  return [
    ...base,
    {
      id: 'actions',
      header: 'Thao tác',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {canEdit ? (
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Sửa sách ${row.original.TenSach}`}
              onClick={() => onEdit(row.original)}
            >
              <Pencil className="w-4 h-4 text-slate-600" />
            </Button>
          ) : null}
          {canDelete ? (
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Xóa sách ${row.original.TenSach}`}
              onClick={() => onDelete(row.original)}
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          ) : null}
        </div>
      ),
    },
  ];
}
