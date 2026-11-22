import * as React from 'react';
import { toast } from 'sonner';
import { readersService, type ReaderInput } from '../../../services/readersService';
import { formatDateVn } from '../../../services/rules/dateUtils';
import type { DocGia, LoaiDocGia, ThamSo } from '../../../types/library';

export function useReaders() {
  const [readers, setReaders] = React.useState<DocGia[]>([]);
  const [loaiList, setLoaiList] = React.useState<LoaiDocGia[]>([]);
  const [thamSo, setThamSo] = React.useState<ThamSo | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [loaiFilter, setLoaiFilter] = React.useState('ALL');

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [rData, lData, tsData] = await Promise.all([
        readersService.list(search, loaiFilter),
        readersService.listTypes(),
        readersService.getParams(),
      ]);
      setReaders(rData);
      setLoaiList(lData);
      setThamSo(tsData);
    } catch (err: any) {
      toast.error(err?.message || 'Không thể tải danh sách độc giả.');
    } finally {
      setLoading(false);
    }
  }, [search, loaiFilter]);

  React.useEffect(() => {
    const timer = setTimeout(loadData, 150);
    return () => clearTimeout(timer);
  }, [loadData]);

  async function saveReader(editing: DocGia | null, payload: ReaderInput) {
    if (editing) {
      await readersService.update(editing.MaDocGia, payload);
      toast.success(`Đã cập nhật thông tin độc giả ${editing.MaDocGia}`);
    } else {
      const created = await readersService.create(payload);
      toast.success(
        `Đã lập thẻ độc giả ${created.MaDocGia} (Hết hạn ${formatDateVn(created.NgayHetHan)})`
      );
    }
    await loadData();
  }

  async function deleteReader(reader: DocGia) {
    await readersService.remove(reader.MaDocGia);
    toast.success(`Đã xóa thẻ độc giả ${reader.MaDocGia}`);
    await loadData();
  }

  return {
    readers,
    loaiList,
    thamSo,
    loading,
    search,
    setSearch,
    loaiFilter,
    setLoaiFilter,
    saveReader,
    deleteReader,
  };
}
