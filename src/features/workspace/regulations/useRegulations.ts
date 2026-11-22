import * as React from 'react';
import { toast } from 'sonner';
import { adminService } from '../../../services/adminService';
import { validateRegulationParams } from '../../../services/rules/catalogRules';
import type { ThamSo, TheLoai } from '../../../types/library';

export function useRegulations() {
  const [params, setParams] = React.useState<ThamSo | null>(null);
  const [categories, setCategories] = React.useState<TheLoai[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [savingParams, setSavingParams] = React.useState(false);

  const [catModalOpen, setCatModalOpen] = React.useState(false);
  const [editingCat, setEditingCat] = React.useState<TheLoai | null>(null);
  const [catCode, setCatCode] = React.useState('');
  const [catName, setCatName] = React.useState('');
  const [savingCat, setSavingCat] = React.useState(false);
  const [deletingCat, setDeletingCat] = React.useState<TheLoai | null>(null);

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [p, c] = await Promise.all([
        adminService.getParams(),
        adminService.listCategories(),
      ]);
      setParams(p);
      setCategories(c);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi tải cấu hình quy định');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  function updateParamField(key: keyof Omit<ThamSo, 'MaThamSo'>, value: number) {
    setParams((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function saveParams(e: React.FormEvent) {
    e.preventDefault();
    if (!params) return;
    const payload = {
      TuoiToiThieu: Number(params.TuoiToiThieu),
      TuoiToiDa: Number(params.TuoiToiDa),
      ThoiHanThe: Number(params.ThoiHanThe),
      KhoangCachNamXuatBan: Number(params.KhoangCachNamXuatBan),
      SoSachMuonToiDa: Number(params.SoSachMuonToiDa),
      SoNgayMuonToiDa: Number(params.SoNgayMuonToiDa),
    };
    const check = validateRegulationParams(payload);
    if (!check.valid) {
      toast.error(check.error || 'Tham số không hợp lệ');
      return;
    }
    try {
      setSavingParams(true);
      const updated = await adminService.updateParams(payload);
      setParams(updated);
      toast.success('Đã cập nhật quy định hoạt động thư viện.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể lưu quy định');
    } finally {
      setSavingParams(false);
    }
  }

  function openAddCategory() {
    setEditingCat(null);
    setCatCode('');
    setCatName('');
    setCatModalOpen(true);
  }

  function openEditCategory(cat: TheLoai) {
    setEditingCat(cat);
    setCatCode(cat.MaTheLoai);
    setCatName(cat.TenTheLoai);
    setCatModalOpen(true);
  }

  async function saveCategory(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSavingCat(true);
      if (editingCat) {
        await adminService.updateCategory(editingCat.MaTheLoai, catName.trim());
        toast.success('Đã cập nhật tên thể loại.');
      } else {
        await adminService.createCategory({
          MaTheLoai: catCode.trim().toUpperCase(),
          TenTheLoai: catName.trim(),
        });
        toast.success('Đã thêm thể loại sách mới.');
      }
      setCatModalOpen(false);
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể lưu thể loại');
    } finally {
      setSavingCat(false);
    }
  }

  async function confirmDeleteCategory() {
    if (!deletingCat) return;
    try {
      await adminService.deleteCategory(deletingCat.MaTheLoai);
      toast.success(`Đã xóa thể loại "${deletingCat.TenTheLoai}".`);
      setDeletingCat(null);
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể xóa thể loại');
      setDeletingCat(null);
    }
  }

  return {
    params,
    categories,
    loading,
    savingParams,
    catModalOpen,
    setCatModalOpen,
    editingCat,
    catCode,
    setCatCode,
    catName,
    setCatName,
    savingCat,
    deletingCat,
    setDeletingCat,
    updateParamField,
    saveParams,
    openAddCategory,
    openEditCategory,
    saveCategory,
    confirmDeleteCategory,
  };
}
