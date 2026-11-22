import * as React from 'react';
import { toast } from 'sonner';
import { circulationService } from '../../../services/circulationService';
import { readersService } from '../../../services/readersService';
import { validateFinePayment } from '../../../services/rules/circulationRules';
import { formatVnd, todayIsoDate } from '../../../services/rules/dateUtils';
import type { DocGia, PhieuThuTienPhat } from '../../../types/library';

export function useFines() {
  const [readers, setReaders] = React.useState<DocGia[]>([]);
  const [receipts, setReceipts] = React.useState<PhieuThuTienPhat[]>([]);
  const [selectedReaderId, setSelectedReaderId] = React.useState('');
  const [ngayThu, setNgayThu] = React.useState(todayIsoDate());
  const [soTienThu, setSoTienThu] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [r, p] = await Promise.all([
        readersService.list(),
        circulationService.listFineReceipts(),
      ]);
      setReaders(r);
      setReceipts(p);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi tải dữ liệu thu phạt');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const indebtedReaders = React.useMemo(
    () => readers.filter((r) => r.TongNo > 0),
    [readers]
  );

  const selectedReader = readers.find((r) => r.MaDocGia === selectedReaderId) || null;
  const amountNum = Number(soTienThu);

  const paymentValidation = React.useMemo(() => {
    if (!selectedReader || !soTienThu) return null;
    return validateFinePayment(selectedReader.TongNo, amountNum);
  }, [selectedReader, soTienThu, amountNum]);

  function selectReader(id: string) {
    setSelectedReaderId(id);
    const reader = readers.find((r) => r.MaDocGia === id);
    setSoTienThu(reader && reader.TongNo > 0 ? String(reader.TongNo) : '');
  }

  function fillFullDebt() {
    if (selectedReader) setSoTienThu(String(selectedReader.TongNo));
  }

  async function submitReceipt(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedReader) {
      toast.error('Vui lòng chọn độc giả có công nợ.');
      return;
    }
    const check = validateFinePayment(selectedReader.TongNo, amountNum);
    if (!check.valid) {
      toast.error(check.error || 'Số tiền thu không hợp lệ');
      return;
    }
    try {
      setSubmitting(true);
      const res = await circulationService.createFineReceipt({
        MaDocGia: selectedReader.MaDocGia,
        NgayThu: ngayThu,
        SoTienThu: amountNum,
      });
      toast.success(
        `Đã lập phiếu thu ${res.MaPhieuThu}. Đã thu ${formatVnd(res.SoTienThu)}, còn lại ${formatVnd(res.ConLai)}.`
      );
      setSoTienThu('');
      setSelectedReaderId('');
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể lập phiếu thu tiền phạt');
    } finally {
      setSubmitting(false);
    }
  }

  return {
    indebtedReaders,
    receipts,
    selectedReaderId,
    selectedReader,
    ngayThu,
    setNgayThu,
    soTienThu,
    setSoTienThu,
    loading,
    submitting,
    paymentValidation,
    selectReader,
    fillFullDebt,
    submitReceipt,
  };
}
