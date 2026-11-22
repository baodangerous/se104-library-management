import * as React from 'react';
import { toast } from 'sonner';
import { reportService } from '../../../services/reportService';
import { todayIsoDate } from '../../../services/rules/dateUtils';
import type { BaoCaoBM71Response, BaoCaoBM72Response } from '../../../types/library';

export function useReports() {
  const now = new Date();
  const [thang, setThang] = React.useState(now.getMonth() + 1);
  const [nam, setNam] = React.useState(now.getFullYear());
  const [ngayBM72, setNgayBM72] = React.useState(todayIsoDate());
  const [bm71, setBm71] = React.useState<BaoCaoBM71Response | null>(null);
  const [bm72, setBm72] = React.useState<BaoCaoBM72Response | null>(null);
  const [loading71, setLoading71] = React.useState(true);
  const [loading72, setLoading72] = React.useState(true);

  const loadBM71 = React.useCallback(async () => {
    try {
      setLoading71(true);
      const data = await reportService.getBM71(thang, nam);
      setBm71(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi tải thống kê mượn theo thể loại');
    } finally {
      setLoading71(false);
    }
  }, [thang, nam]);

  const loadBM72 = React.useCallback(async () => {
    try {
      setLoading72(true);
      const data = await reportService.getBM72(ngayBM72);
      setBm72(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi tải báo cáo sách trả trễ');
    } finally {
      setLoading72(false);
    }
  }, [ngayBM72]);

  React.useEffect(() => {
    loadBM71();
  }, [loadBM71]);

  React.useEffect(() => {
    loadBM72();
  }, [loadBM72]);

  function exportBM71() {
    if (!bm71) return;
    reportService.exportBM71Csv(bm71);
    toast.success('Đã xuất file thống kê mượn sách (CSV).');
  }

  function exportBM72() {
    if (!bm72) return;
    reportService.exportBM72Csv(bm72);
    toast.success('Đã xuất file danh sách sách trả trễ (CSV).');
  }

  return {
    thang,
    setThang,
    nam,
    setNam,
    ngayBM72,
    setNgayBM72,
    bm71,
    bm72,
    loading71,
    loading72,
    exportBM71,
    exportBM72,
  };
}
