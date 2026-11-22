import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardBody, CardHeader } from '../../../components/ui/card';
import type { BaoCaoBM71Response } from '../../../types/library';

const PIE_COLORS = ['#0054A6', '#0284C7', '#0D9488', '#D97706', '#6366F1', '#E11D48'];

export function ReportBM71Charts({
  thang,
  nam,
  bm71,
  loading,
}: {
  thang: number;
  nam: number;
  bm71: BaoCaoBM71Response | null;
  loading: boolean;
}) {
  const activeRows = (bm71?.rows || []).filter((r) => r.SoLuotMuon > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <Card className="lg:col-span-7">
        <CardHeader
          title={`Số lượt mượn theo thể loại — Tháng ${thang}/${nam}`}
          description={`Tổng số lượt mượn: ${bm71?.tongSoLuotMuon ?? 0}`}
        />
        <CardBody>
          <div className="h-72 w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">
                Đang tải biểu đồ...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bm71?.rows || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="TenTheLoai" tick={{ fontSize: 12, fill: '#475569' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '10px',
                      borderColor: '#E2E8F0',
                      fontSize: '12px',
                    }}
                  />
                  <Bar
                    dataKey="SoLuotMuon"
                    name="Số lượt mượn"
                    fill="#0054A6"
                    radius={[6, 6, 0, 0]}
                    barSize={38}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardBody>
      </Card>

      <Card className="lg:col-span-5">
        <CardHeader title="Tỉ trọng mượn sách (%)" description="Cơ cấu theo từng thể loại" />
        <CardBody>
          <div className="h-56 w-full">
            {!bm71 || bm71.tongSoLuotMuon === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">
                Chưa có lượt mượn nào trong tháng {thang}/{nam}.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activeRows}
                    dataKey="SoLuotMuon"
                    nameKey="TenTheLoai"
                    cx="50%"
                    cy="50%"
                    outerRadius={82}
                    innerRadius={44}
                    isAnimationActive={false}
                  >
                    {activeRows.map((entry, index) => (
                      <Cell
                        key={entry.MaTheLoai}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          {activeRows.length > 0 ? (
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
              {activeRows.map((entry, idx) => (
                <div
                  key={entry.MaTheLoai}
                  className="flex items-center justify-between text-xs gap-2"
                >
                  <span className="flex items-center gap-2 text-slate-700 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                    />
                    <span className="truncate">{entry.TenTheLoai}</span>
                  </span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums shrink-0">
                    {entry.SoLuotMuon} ({entry.TiLe}%)
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
}
