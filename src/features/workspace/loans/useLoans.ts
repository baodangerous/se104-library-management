import * as React from 'react';
import { toast } from 'sonner';
import { booksService } from '../../../services/booksService';
import { circulationService } from '../../../services/circulationService';
import { readersService } from '../../../services/readersService';
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
        readersService.list(),
        booksService.list(),
        circulationService.listLoans(),
        readersService.getParams(),
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

  return { readers, books, loans, thamSo, loading, createLoan };
}
