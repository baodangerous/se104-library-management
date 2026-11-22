import * as React from 'react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { ModalDialog } from '../../../components/ui/dialog';
import { FieldLabel, SelectInput, TextInput } from '../../../components/ui/input';
import type { BookInput } from '../../../services/booksService';
import { validateBookIntake } from '../../../services/rules/catalogRules';
import { todayIsoDate } from '../../../services/rules/dateUtils';
import type { Sach, ThamSo, TheLoai } from '../../../types/library';

interface BookFormState {
  tenSach: string;
  maTheLoai: string;
  tacGiaRaw: string;
  namXuatBan: string;
  nhaXuatBan: string;
  ngayNhap: string;
  triGia: string;
}

function buildBookForm(editing: Sach | null, categories: TheLoai[]): BookFormState {
  return editing
    ? {
        tenSach: editing.TenSach,
        maTheLoai: editing.MaTheLoai,
        tacGiaRaw: editing.TacGiaList.join(', '),
        namXuatBan: String(editing.NamXuatBan),
        nhaXuatBan: editing.NhaXuatBan,
        ngayNhap: editing.NgayNhap,
        triGia: String(editing.TriGia),
      }
    : {
        tenSach: '',
        maTheLoai: categories[0]?.MaTheLoai || 'A',
        tacGiaRaw: '',
        namXuatBan: String(new Date().getFullYear()),
        nhaXuatBan: 'NXB ĐHQG-HCM',
        ngayNhap: todayIsoDate(),
        triGia: '125000',
      };
}

interface BookFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Sach | null;
  categories: TheLoai[];
  thamSo: ThamSo | null;
  onSave: (editing: Sach | null, payload: BookInput) => Promise<void>;
}

export function BookFormModal({
  open,
  onOpenChange,
  editing,
  categories,
  thamSo,
  onSave,
}: BookFormModalProps) {
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState<BookFormState>(() => buildBookForm(null, categories));

  React.useEffect(() => {
    if (open) setForm(buildBookForm(editing, categories));
  }, [open, editing, categories]);

  const liveCheck = React.useMemo(() => {
    if (!thamSo || !form.namXuatBan || !form.ngayNhap) return null;
    return validateBookIntake(Number(form.namXuatBan), form.ngayNhap, Number(form.triGia || 0), thamSo);
  }, [form.namXuatBan, form.ngayNhap, form.triGia, thamSo]);

  const setField = (key: keyof BookFormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const authors = form.tacGiaRaw.split(',').map((s) => s.trim()).filter(Boolean);
    if (authors.length === 0) {
      toast.error('Vui lòng nhập ít nhất 1 tên tác giả.');
      return;
    }
    setSaving(true);
    try {
      await onSave(editing, {
        TenSach: form.tenSach,
        MaTheLoai: form.maTheLoai,
        NamXuatBan: Number(form.namXuatBan),
        NhaXuatBan: form.nhaXuatBan,
        NgayNhap: form.ngayNhap,
        TriGia: Number(form.triGia),
        TacGiaList: authors,
      });
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể lưu thông tin sách.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ModalDialog
      open={open}
      onOpenChange={onOpenChange}
      title={editing ? `Cập nhật sách ${editing.MaSach}` : 'Tiếp nhận sách mới'}
      description={
        thamSo
          ? `Chỉ tiếp nhận sách xuất bản trong vòng ${thamSo.KhoangCachNamXuatBan} năm so với năm nhập.`
          : undefined
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="sach-ten" required>Tên sách</FieldLabel>
            <TextInput id="sach-ten" required placeholder="VD: Thiết kế Hướng đối tượng & UML" value={form.tenSach} onChange={(e) => setField('tenSach', e.target.value)} />
          </div>
          <div>
            <FieldLabel htmlFor="sach-theloai" required>Thể loại</FieldLabel>
            <SelectInput id="sach-theloai" value={form.maTheLoai} onChange={(e) => setField('maTheLoai', e.target.value)}>
              {categories.map((c) => (
                <option key={c.MaTheLoai} value={c.MaTheLoai}>{c.TenTheLoai}</option>
              ))}
            </SelectInput>
          </div>
          <div>
            <FieldLabel htmlFor="sach-nxb" required>Nhà xuất bản</FieldLabel>
            <TextInput id="sach-nxb" required value={form.nhaXuatBan} onChange={(e) => setField('nhaXuatBan', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="sach-tacgia" required>Tác giả (phân cách bằng dấu phẩy)</FieldLabel>
            <TextInput id="sach-tacgia" required placeholder="VD: TS. Vũ Thanh Nguyên, Ian Sommerville" value={form.tacGiaRaw} onChange={(e) => setField('tacGiaRaw', e.target.value)} />
          </div>
          <div>
            <FieldLabel htmlFor="sach-namxb" required>Năm xuất bản</FieldLabel>
            <TextInput id="sach-namxb" type="number" required value={form.namXuatBan} onChange={(e) => setField('namXuatBan', e.target.value)} />
          </div>
          <div>
            <FieldLabel htmlFor="sach-ngaynhap" required>Ngày nhập</FieldLabel>
            <TextInput id="sach-ngaynhap" type="date" required value={form.ngayNhap} onChange={(e) => setField('ngayNhap', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="sach-trigia" required>Trị giá (VNĐ)</FieldLabel>
            <TextInput id="sach-trigia" type="number" min={0} step={1000} required value={form.triGia} onChange={(e) => setField('triGia', e.target.value)} />
          </div>
        </div>

        {liveCheck ? (
          <div
            className={`rounded-lg px-3.5 py-2.5 text-xs border ${
              liveCheck.valid
                ? 'bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {liveCheck.valid
              ? `Hợp lệ · Khoảng cách NXB: ${Number(form.ngayNhap.slice(0, 4)) - Number(form.namXuatBan)} năm (tối đa ${thamSo?.KhoangCachNamXuatBan} năm).`
              : liveCheck.error}
          </div>
        ) : null}

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy bỏ</Button>
          <Button type="submit" disabled={saving || (liveCheck !== null && !liveCheck.valid)}>
            {saving ? 'Đang lưu...' : editing ? 'Lưu thay đổi' : 'Tiếp nhận sách'}
          </Button>
        </div>
      </form>
    </ModalDialog>
  );
}
