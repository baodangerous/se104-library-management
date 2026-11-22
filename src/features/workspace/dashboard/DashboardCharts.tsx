import * as React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { SurfaceCard, SurfaceCardHeader } from '../../../components/ui/card';
import type { DashboardSummary } from '../../../types/library';

const CHART_COLORS = ['#0054A6', '#0284C7', '#0F766E', '#D97706', '#6366F1'];

export function DashboardCharts({ data }: { data: DashboardSummary }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <SurfaceCard className="lg:col-span-7 flex flex-col">
        <SurfaceCardHeader
          title="Xu hướng mượn và trả sách 6 tháng gần nhất"
          description="So sánh số lượt mượn và số lượt trả sách theo từng tháng"
        />
        <div className="p-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.xuHuongMuon6Thang}
              margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="thang" tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748B' }} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                dataKey="soLuotMuon"
                name="Lượt mượn"
                fill="#0054A6"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              />
              <Bar
                dataKey="soLuotTra"
                name="Lượt trả"
                fill="#0EA5E9"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SurfaceCard>

      <SurfaceCard className="lg:col-span-5 flex flex-col">
        <SurfaceCardHeader
          title="Cơ cấu lượt mượn theo thể loại"
          description="Phân bổ lượt mượn theo từng danh mục sách"
        />
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.muonTheoTheLoai}
                  dataKey="SoLuotMuon"
                  nameKey="TenTheLoai"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={76}
                  paddingAngle={2}
                  isAnimationActive={false}
                >
                  {data.muonTheoTheLoai.map((row, idx) => (
                    <Cell
                      key={row.MaTheLoai}
                      fill={CHART_COLORS[idx % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value} lượt`, 'Số lượt mượn']}
                  contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 divide-y divide-slate-100 text-xs">
            {data.muonTheoTheLoai.map((row, idx) => (
              <div
                key={row.MaTheLoai}
                className="py-2 flex items-center justify-between gap-2"
              >
                <span className="text-slate-700 font-medium truncate">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-xs mr-2 align-middle"
                    style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                  />
                  {row.TenTheLoai}
                </span>
                <span className="font-mono tabular-nums text-slate-600 shrink-0">
                  {row.SoLuotMuon} lượt ({row.TiLe}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </SurfaceCard>
    </div>
  );
}
