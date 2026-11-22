import { Download } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardBody, CardHeader } from '../../../components/ui/card';
import { Input, Label, Select } from '../../../components/ui/input';
import type { BaoCaoBM71Response } from '../../../types/library';
import { ReportBM71Charts } from './ReportBM71Charts';

interface ReportBM71PanelProps {
  thang: number;
  nam: number;
  bm71: BaoCaoBM71Response | null;
  loading: boolean;
  onChangeThang: (v: number) => void;
  onChangeNam: (v: number) => void;
  onExportCsv: () => void;
}

export function ReportBM71Panel({
  thang,
  nam,
  bm71,
  loading,
  onChangeThang,
  onChangeNam,
  onExportCsv,
}: ReportBM71PanelProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardBody className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <Label htmlFor="bm71-month">Tháng</Label>
              <Select
                id="bm71-month"
                value={String(thang)}
                onChange={(e) => onChangeThang(Number(e.target.value))}
                className="w-32"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    Tháng {m}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="bm71-year">Năm</Label>
              <Input
                id="bm71-year"
                type="number"
                value={nam}
                onChange={(e) => onChangeNam(Number(e.target.value))}
                className="w-28"
              />
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onExportCsv} disabled={!bm71}>
            <Download className="w-4 h-4" /> Xuất file CSV
          </Button>
        </CardBody>
      </Card>

      <ReportBM71Charts thang={thang} nam={nam} bm71={bm71} loading={loading} />

      <Card>
        <CardHeader title="Bảng tổng hợp chi tiết" />
        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">STT</th>
                <th className="px-4 py-3 text-left">Mã thể loại</th>
                <th className="px-4 py-3 text-left">Tên thể loại</th>
                <th className="px-4 py-3 text-right">Số lượt mượn</th>
                <th className="px-4 py-3 text-right">Tỉ lệ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 tabular-nums">
              {(bm71?.rows || []).map((r, idx) => (
                <tr key={r.MaTheLoai} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                  <td className="px-4 py-3 font-mono font-semibold text-[#0054A6]">
                    {r.MaTheLoai}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{r.TenTheLoai}</td>
                  <td className="px-4 py-3 text-right font-semibold">{r.SoLuotMuon}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{r.TiLe}%</td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold text-slate-900">
                <td className="px-4 py-3" colSpan={3}>
                  Tổng số lượt mượn
                </td>
                <td className="px-4 py-3 text-right">{bm71?.tongSoLuotMuon ?? 0}</td>
                <td className="px-4 py-3 text-right">
                  {bm71 && bm71.tongSoLuotMuon > 0 ? '100%' : '0%'}
                </td>
              </tr>
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
