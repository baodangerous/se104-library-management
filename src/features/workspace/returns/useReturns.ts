import * as React from 'react';
import { toast } from 'sonner';
import {
  circulationService,
  type ActiveBorrowedItem,
} from '../../../services/circulationService';
import { readersService } from '../../../services/readersService';
import { calculateReturnFine } from '../../../services/rules/circulationRules';
import { formatVnd, todayIsoDate } from '../../../services/rules/dateUtils';
import type { DocGia, PhieuTra } from '../../../types/library';

export function useReturns() {
  const [readers, setReaders] = React.useState<DocGia[]>([]);
  const [returnsList, setReturnsList] = React.useState<PhieuTra[]>([]);
  const [selectedReaderId, setSelectedReaderId] = React.useState('');
  const [activeItems, setActiveItems] = React.useState<ActiveBorrowedItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = React.useState<number[]>([]);
  const [ngayTra, setNgayTra] = React.useState(todayIsoDate());
  const [loading, setLoading] = React.useState(true);
  const [loadingActive, setLoadingActive] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const loadBase = React.useCallback(async () => {
    try {
      setLoading(true);
      const [r, rt] = await Promise.all([
        readersService.list(),
        circulationService.listReturns(),
      ]);
      setReaders(r);
      setReturnsList(rt);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi tải dữ liệu nhận trả');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadBase();
  }, [loadBase]);

  const loadActiveForReader = React.useCallback(async (maDocGia: string) => {
    if (!maDocGia) {
      setActiveItems([]);
      setSelectedItemIds([]);
      return;
    }
    try {
      setLoadingActive(true);
      const items = await circulationService.listReaderActiveLoans(maDocGia);
      setActiveItems(items);
      setSelectedItemIds(items.map((i) => i.MaChiTietMuon));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể tải sách đang mượn');
    } finally {
      setLoadingActive(false);
    }
  }, []);

  function selectReader(maDocGia: string) {
    setSelectedReaderId(maDocGia);
    loadActiveForReader(maDocGia);
  }

  function toggleItem(id: number) {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const selectedReader = readers.find((r) => r.MaDocGia === selectedReaderId) || null;

  const estimatedTotalFine = React.useMemo(
    () =>
      activeItems
        .filter((item) => selectedItemIds.includes(item.MaChiTietMuon))
        .reduce((sum, item) => sum + calculateReturnFine(item.HanTra, ngayTra).tienPhat, 0),
    [activeItems, selectedItemIds, ngayTra]
  );

  async function submitReturn(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedReaderId || selectedItemIds.length === 0) {
      toast.error('Vui lòng chọn độc giả và ít nhất 1 quyển sách cần trả.');
      return;
    }
    try {
      setSubmitting(true);
      const res = await circulationService.createReturn({
        MaDocGia: selectedReaderId,
        NgayTra: ngayTra,
        MaChiTietMuonList: selectedItemIds,
      });
      toast.success(
        `Đã lập phiếu trả ${res.MaPhieuTra}. Tiền phạt kỳ này: ${formatVnd(res.TongTienPhat)}.`
      );
      await loadBase();
      await loadActiveForReader(selectedReaderId);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể lập phiếu trả sách');
    } finally {
      setSubmitting(false);
    }
  }

  return {
    readers,
    returnsList,
    selectedReaderId,
    selectedReader,
    activeItems,
    selectedItemIds,
    ngayTra,
    setNgayTra,
    loading,
    loadingActive,
    submitting,
    estimatedTotalFine,
    selectReader,
    toggleItem,
    submitReturn,
  };
}
