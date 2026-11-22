import * as React from 'react';
import { toast } from 'sonner';
import { booksService, type BookInput } from '../../../services/booksService';
import type { Sach, ThamSo, TheLoai } from '../../../types/library';

export function useBooks() {
  const [books, setBooks] = React.useState<Sach[]>([]);
  const [categories, setCategories] = React.useState<TheLoai[]>([]);
  const [thamSo, setThamSo] = React.useState<ThamSo | null>(null);
  const [loading, setLoading] = React.useState(true);

  const [search, setSearch] = React.useState('');
  const [catFilter, setCatFilter] = React.useState('ALL');
  const [statusFilter, setStatusFilter] = React.useState('ALL');

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [bData, cData, tsData] = await Promise.all([
        booksService.list({ q: search, maTheLoai: catFilter, tinhTrang: statusFilter }),
        booksService.listCategories(),
        booksService.getParams(),
      ]);
      setBooks(bData);
      setCategories(cData);
      setThamSo(tsData);
    } catch (err: any) {
      toast.error(err?.message || 'Không thể tải danh mục sách.');
    } finally {
      setLoading(false);
    }
  }, [search, catFilter, statusFilter]);

  React.useEffect(() => {
    const timer = setTimeout(loadData, 150);
    return () => clearTimeout(timer);
  }, [loadData]);

  async function saveBook(editing: Sach | null, payload: BookInput) {
    if (editing) {
      await booksService.update(editing.MaSach, payload);
      toast.success(`Đã cập nhật thông tin sách ${editing.MaSach}`);
    } else {
      const created = await booksService.create(payload);
      toast.success(`Đã tiếp nhận sách mới ${created.MaSach} – ${created.TenSach}`);
    }
    await loadData();
  }

  async function deleteBook(book: Sach) {
    await booksService.remove(book.MaSach);
    toast.success(`Đã xóa đầu sách ${book.MaSach}`);
    await loadData();
  }

  return {
    books,
    categories,
    thamSo,
    loading,
    search,
    setSearch,
    catFilter,
    setCatFilter,
    statusFilter,
    setStatusFilter,
    saveBook,
    deleteBook,
  };
}
