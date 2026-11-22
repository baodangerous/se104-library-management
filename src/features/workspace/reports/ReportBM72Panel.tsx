import { Download } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '../../../components/ui/button';
import { Card, CardBody, CardHeader } from '../../../components/ui/card';
import { Input, Label } from '../../../components/ui/input';
import { formatDateVn, formatVnd } from '../../../services/rules/dateUtils';
import type { BaoCaoBM72Response } from '../../../types/library';

interface ReportBM72PanelProps {
  ngay: string;
  bm72: BaoCaoBM72Response | null;
  loading: boolean;
  onChangeNgay: (v: string) => void;
  onExportCsv: () => void;
}

export function ReportBM72Panel({
  ngay,
  bm72,
  loading,
  onChangeNgay,
  onExportCsv,
}: ReportBM72PanelProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardBody className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <Label htmlFor="bm72-date">Ngày lập báo cáo</Label>
              <Input
                id="bm72-date"
                type="date"
                value={ngay}
                onChange={(e) => onChangeNgay(e.target.value)}
                className="w-44"
              />
            </div>
            {bm72 ? (
              <div className="text-xs text-slate-600 pb-2 tabular-nums">
                Tổng sách trễ:{' '}
                <strong className="text-rose-700">{bm72.tongSoSachTre}</strong> · Tổng tiền
                phạt:{' '}
                <strong className="text-slate-900">{formatVnd(bm72.tongTienPhat)}</strong>
              </div>
            ) : null}
          </div>
          <Button variant="outline" size="sm" onClick={onExportCsv} disabled={!bm72}>
            <Download className="w-4 h-4" /> Xuất file CSV
          </Button>
        </CardBody>
      </Card>

      {bm72 && bm72.rows.length > 0 ? (
        <Card>
          <CardHeader
            title="Biểu đồ số ngày trả trễ theo đầu sách"
            description={`Tính đến ngày ${formatDateVn(ngay)}`}
          />
          <CardBody>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bm72.rows}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="MaSach" tick={{ fontSize: 12, fill: '#475569' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip />
                  <Bar
                    dataKey="SoNgayTraTre"
                    name="Số ngày trễ"
                    fill="#DC2626"
                    radius={[6, 6, 0, 0]}
                    barSize={32}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      ) : null}

      <Card>
        <CardHeader title={`Danh sách sách trả trễ tính đến ${formatDateVn(ngay)}`} />
        <CardBody className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">Đang tải dữ liệu...</div>
          ) : !bm72 || bm72.rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">
              Không có sách trả trễ nào tính đến ngày đã chọn.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">STT</th>
                  <th className="px-4 py-3 text-left">Tên sách</th>
                  <th className="px-4 py-3 text-left">Độc giả</th>
                  <th className="px-4 py-3 text-left">Ngày mượn</th>
                  <th className="px-4 py-3 text-left">Hạn trả</th>
                  <th className="px-4 py-3 text-right">Số ngày trễ</th>
                  <th className="px-4 py-3 text-right">Tiền phạt</th>
                  <th className="px-4 py-3 text-left">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 tabular-nums">
                {bm72.rows.map((r, idx) => (
                  <tr key={r.MaChiTietMuon} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{r.TenSach}</div>
                      <div className="text-xs font-mono text-slate-500">{r.MaSach}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-900">{r.HoTenDocGia}</div>
                      <div className="text-xs font-mono text-slate-500">{r.MaDocGia}</div>
                    </td>
                    <td className="px-4 py-3 text-xs">{formatDateVn(r.NgayMuon)}</td>
                    <td className="px-4 py-3 text-xs">{formatDateVn(r.HanTra)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-rose-700">
                      {r.SoNgayTraTre} ngày
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900">
                      {formatVnd(r.TienPhatDuKien)}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <span
                        className={
                          r.TrangThai.includes('Chưa trả')
                            ? 'text-rose-700 font-semibold'
                            : 'text-amber-700 font-medium'
                        }
                      >
                        {r.TrangThai}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
