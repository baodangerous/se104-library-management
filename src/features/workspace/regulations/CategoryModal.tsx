import * as React from 'react';
import { Button } from '../../../components/ui/button';
import { ModalDialog } from '../../../components/ui/dialog';
import { Input, Label } from '../../../components/ui/input';
import type { TheLoai } from '../../../types/library';

interface CategoryModalProps {
  open: boolean;
  editingCat: TheLoai | null;
  catCode: string;
  catName: string;
  saving: boolean;
  onOpenChange: (open: boolean) => void;
  onChangeCode: (v: string) => void;
  onChangeName: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CategoryModal({
  open,
  editingCat,
  catCode,
  catName,
  saving,
  onOpenChange,
  onChangeCode,
  onChangeName,
  onSubmit,
}: CategoryModalProps) {
  return (
    <ModalDialog
      open={open}
      onOpenChange={onOpenChange}
      title={editingCat ? `Đổi tên thể loại ${editingCat.MaTheLoai}` : 'Thêm thể loại sách mới'}
      maxWidthClass="max-w-md"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {!editingCat ? (
          <div className="space-y-1.5">
            <Label htmlFor="cat-code">Mã thể loại (VD: D, AI, SEC)</Label>
            <Input
              id="cat-code"
              value={catCode}
              onChange={(e) => onChangeCode(e.target.value)}
              placeholder="D"
              maxLength={10}
              required
            />
          </div>
        ) : null}
        <div className="space-y-1.5">
          <Label htmlFor="cat-name">Tên thể loại</Label>
          <Input
            id="cat-name"
            value={catName}
            onChange={(e) => onChangeName(e.target.value)}
            placeholder="Ví dụ: Trí tuệ nhân tạo & Khoa học dữ liệu"
            required
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Hủy bỏ
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu thể loại'}
          </Button>
        </div>
      </form>
    </ModalDialog>
  );
}
