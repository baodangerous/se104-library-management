import { Card, CardBody, CardHeader } from '../../../components/ui/card';
import { diffDaysIso, formatDateVn, formatVnd } from '../../../services/rules/dateUtils';
import type { ChiTietPhieuMuon, PhieuThuTienPhat } from '../../../types/library';

interface ReaderHistoryTablesProps {
  lichSuMuon: ChiTietPhieuMuon[];
  phieuThuPhat: PhieuThuTienPhat[];
  today: string;
}

export function ReaderHistoryTables({
  lichSuMuon,
  phieuThuPhat,
  today,
}: ReaderHistoryTablesProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <Card className="lg:col-span-8">
        <CardHeader
          title="Lịch sử mượn / trả sách"
          description={`${lichSuMuon.length} lượt mượn sách`}
        />
        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Sách</th>
                <th className="px-4 py-3 text-left">Ngày mượn</th>
                <th className="px-4 py-3 text-left">Hạn trả</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
                <th className="px-4 py-3 text-right">Tiền phạt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 tabular-nums">
              {lichSuMuon.map((item) => {
                const isOverdue = !item.DaTra && diffDaysIso(today, item.HanTra) > 0;
                return (
                  <tr key={item.MaChiTietMuon} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{item.TenSach}</div>
                      <div className="text-xs text-slate-500 font-mono">
                        {item.MaSach} · {item.MaPhieuMuon}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">{formatDateVn(item.NgayMuon)}</td>
                    <td className="px-4 py-3 text-xs">{formatDateVn(item.HanTra)}</td>
                    <td className="px-4 py-3 text-xs">
                      {item.DaTra ? (
                        <span className="text-emerald-700 font-medium">
                          Đã trả ({formatDateVn(item.NgayTra)})
                        </span>
                      ) : isOverdue ? (
                        <span className="text-rose-700 font-semibold">
                          Quá hạn {diffDaysIso(today, item.HanTra)} ngày
                        </span>
                      ) : (
                        <span className="text-[#0054A6] font-medium">Đang mượn</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-xs font-medium">
                      {item.TienPhat && item.TienPhat > 0 ? (
                        <span className="text-rose-700">{formatVnd(item.TienPhat)}</span>
                      ) : (
                        <span className="text-slate-400">0 ₫</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <Card className="lg:col-span-4">
        <CardHeader
          title="Biên lai nộp phạt"
          description={`${phieuThuPhat.length} phiếu thu`}
        />
        <CardBody className="p-0">
          {phieuThuPhat.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              Chưa có biên lai nộp phạt nào.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {phieuThuPhat.map((p) => (
                <div key={p.MaPhieuThu} className="px-4 py-3 text-xs space-y-1 tabular-nums">
                  <div className="flex justify-between">
                    <span className="font-mono font-semibold text-[#0054A6]">
                      {p.MaPhieuThu}
                    </span>
                    <span className="text-slate-500">{formatDateVn(p.NgayThu)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Đã nộp:</span>
                    <span className="font-semibold text-emerald-700">
                      {formatVnd(p.SoTienThu)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Còn lại sau thu:</span>
                    <span>{formatVnd(p.ConLai)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
