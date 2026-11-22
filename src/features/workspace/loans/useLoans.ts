import * as React from 'react';
import { toast } from 'sonner';
import { bookService } from '../../../services/bookService';
import { circulationService } from '../../../services/circulationService';
import { readerService } from '../../../services/readerService';
import { formatDateVn } from '../../../services/rules/dateUtils';
import type { DocGia, PhieuMuon, Sach, ThamSo } from '../../../types/library';

export function useLoans() {
  const [readers, setReaders] = React.useState<DocGia[]>([]);
  const [books, setBooks] = React.useState<Sach[]>([]);
  const [loans, setLoans] = React.useState<PhieuMuon[]>([]);
  const [thamSo, setThamSo] = React.useState<ThamSo | null>(null);
  const [loading, setLoading] = React.useState(true);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [rData, bData, pmData, tsData] = await Promise.all([
        readerService.list(),
        bookService.list(),
        circulationService.listLoans(),
        readerService.getParams(),
      ]);
      setReaders(rData);
      setBooks(bData);
      setLoans(pmData);
      setThamSo(tsData);
    } catch (err: any) {
      toast.error(err?.message || 'Không thể tải dữ liệu cho mượn sách.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  async function createLoan(maDocGia: string, ngayMuon: string, maSachList: string[]) {
    const res = await circulationService.createLoan({
      MaDocGia: maDocGia,
      NgayMuon: ngayMuon,
      MaSachList: maSachList,
    });
    toast.success(
      `Đã lập phiếu mượn ${res.MaPhieuMuon} (Hạn trả ${formatDateVn(res.HanTra)})`
    );
    await loadData();
  }

  async function renewLoanItem(maChiTietMuon: number) {
    const res = await circulationService.renewLoanItem(maChiTietMuon);
    toast.success(
      `Đã gia hạn thành công đến ${formatDateVn(res.HanTraMoi)} (lần ${res.SoLanGiaHan}/2)`
    );
    await loadData();
  }

  return { readers, books, loans, thamSo, loading, createLoan, renewLoanItem };
}
