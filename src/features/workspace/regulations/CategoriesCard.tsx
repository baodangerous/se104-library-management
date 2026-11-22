import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardBody, CardHeader } from '../../../components/ui/card';
import type { TheLoai } from '../../../types/library';

interface CategoriesCardProps {
  categories: TheLoai[];
  onAdd: () => void;
  onEdit: (cat: TheLoai) => void;
  onRequestDelete: (cat: TheLoai) => void;
}

export function CategoriesCard({
  categories,
  onAdd,
  onEdit,
  onRequestDelete,
}: CategoriesCardProps) {
  return (
    <Card className="lg:col-span-6">
      <CardHeader
        title="Danh mục thể loại sách"
        description="Hệ thống cấm xóa thể loại đang có sách tham chiếu."
        action={
          <Button size="sm" onClick={onAdd}>
            <Plus className="w-4 h-4" /> Thêm thể loại
          </Button>
        }
      />
      <CardBody className="p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left">Mã</th>
              <th className="px-4 py-3 text-left">Tên thể loại</th>
              <th className="px-4 py-3 text-right">Số sách</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <tr key={cat.MaTheLoai} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono font-semibold text-[#0054A6]">
                  {cat.MaTheLoai}
                </td>
                <td className="px-4 py-3 font-medium text-slate-900">{cat.TenTheLoai}</td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-600">
                  {cat.SoLuongSach ?? 0}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Sửa thể loại"
                      onClick={() => onEdit(cat)}
                    >
                      <Pencil className="w-3.5 h-3.5 text-slate-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Xóa thể loại"
                      onClick={() => onRequestDelete(cat)}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}
