import * as React from 'react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { ModalDialog } from '../../../components/ui/dialog';
import { FieldLabel, SelectInput, TextInput } from '../../../components/ui/input';
import type { ReaderInput } from '../../../services/readerService';
import { validateReaderCard } from '../../../services/rules/catalogRules';
import { formatDateVn, todayIsoDate } from '../../../services/rules/dateUtils';
import type { DocGia, LoaiDocGia, ThamSo } from '../../../types/library';

function buildReaderForm(editing: DocGia | null, loaiList: LoaiDocGia[]): ReaderInput {
  if (editing) {
    return {
      HoTen: editing.HoTen,
      MaLoaiDocGia: editing.MaLoaiDocGia,
      NgaySinh: editing.NgaySinh,
      DiaChi: editing.DiaChi,
      Email: editing.Email,
      NgayLapThe: editing.NgayLapThe,
    };
  }
  return {
    HoTen: '',
    MaLoaiDocGia: loaiList[0]?.MaLoaiDocGia || 'X',
    NgaySinh: '2005-05-10',
    DiaChi: '',
    Email: '',
    NgayLapThe: todayIsoDate(),
  };
}

interface ReaderFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: DocGia | null;
  loaiList: LoaiDocGia[];
  thamSo: ThamSo | null;
  onSave: (editing: DocGia | null, payload: ReaderInput) => Promise<void>;
}

export function ReaderFormModal({
  open,
  onOpenChange,
  editing,
  loaiList,
  thamSo,
  onSave,
}: ReaderFormModalProps) {
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState<ReaderInput>(() => buildReaderForm(null, loaiList));

  React.useEffect(() => {
    if (open) setForm(buildReaderForm(editing, loaiList));
  }, [open, editing, loaiList]);

  const liveCheck = React.useMemo(() => {
    if (!thamSo || !form.NgaySinh || !form.NgayLapThe) return null;
    return validateReaderCard(form.NgaySinh, form.NgayLapThe, thamSo);
  }, [form.NgaySinh, form.NgayLapThe, thamSo]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(editing, form);
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể lưu thẻ độc giả.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ModalDialog
      open={open}
      onOpenChange={onOpenChange}
      title={editing ? `Cập nhật thẻ độc giả ${editing.MaDocGia}` : 'Lập thẻ độc giả mới'}
      description="Hệ thống tự động kiểm tra độ tuổi hợp lệ và tính ngày hết hạn thẻ."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="dg-hoten" required>Họ và tên</FieldLabel>
            <TextInput
              id="dg-hoten"
              required
              placeholder="VD: Nguyễn Văn An"
              value={form.HoTen}
              onChange={(e) => setForm((p) => ({ ...p, HoTen: e.target.value }))}
            />
          </div>
          <div>
            <FieldLabel htmlFor="dg-loai" required>Loại độc giả</FieldLabel>
            <SelectInput
              id="dg-loai"
              value={form.MaLoaiDocGia}
              onChange={(e) => setForm((p) => ({ ...p, MaLoaiDocGia: e.target.value }))}
            >
              {loaiList.map((l) => (
                <option key={l.MaLoaiDocGia} value={l.MaLoaiDocGia}>{l.TenLoaiDocGia}</option>
              ))}
            </SelectInput>
          </div>
          <div>
            <FieldLabel htmlFor="dg-ngaysinh" required>Ngày sinh</FieldLabel>
            <TextInput
              id="dg-ngaysinh"
              type="date"
              required
              value={form.NgaySinh}
              onChange={(e) => setForm((p) => ({ ...p, NgaySinh: e.target.value }))}
            />
          </div>
          <div>
            <FieldLabel htmlFor="dg-email" required>Email UIT</FieldLabel>
            <TextInput
              id="dg-email"
              type="email"
              required
              placeholder="mssv@gm.uit.edu.vn"
              value={form.Email}
              onChange={(e) => setForm((p) => ({ ...p, Email: e.target.value }))}
            />
          </div>
          <div>
            <FieldLabel htmlFor="dg-ngaylap" required>Ngày lập thẻ</FieldLabel>
            <TextInput
              id="dg-ngaylap"
              type="date"
              required
              value={form.NgayLapThe}
              onChange={(e) => setForm((p) => ({ ...p, NgayLapThe: e.target.value }))}
            />
          </div>
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="dg-diachi" required>Địa chỉ liên hệ</FieldLabel>
            <TextInput
              id="dg-diachi"
              required
              placeholder="KTX Khu B ĐHQG-HCM, TP. Thủ Đức"
              value={form.DiaChi}
              onChange={(e) => setForm((p) => ({ ...p, DiaChi: e.target.value }))}
            />
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
            {liveCheck.valid ? (
              <span>
                Hợp lệ · Tuổi: <strong className="tabular-nums">{liveCheck.tuoi} tuổi</strong> · Hết hạn:{' '}
                <strong className="font-mono tabular-nums">
                  {formatDateVn(
                    editing && form.NgayLapThe === editing.NgayLapThe
                      ? editing.NgayHetHan
                      : liveCheck.ngayHetHan
                  )}
                </strong>
              </span>
            ) : (
              <span>{liveCheck.error}</span>
            )}
          </div>
        ) : null}

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy bỏ</Button>
          <Button type="submit" disabled={saving || (liveCheck !== null && !liveCheck.valid)}>
            {saving ? 'Đang lưu...' : editing ? 'Lưu thay đổi' : 'Lập thẻ độc giả'}
          </Button>
        </div>
      </form>
    </ModalDialog>
  );
}
