import { Card, CardBody, CardHeader } from '../../../components/ui/card';
import { formatDateVn, formatVnd } from '../../../services/rules/dateUtils';
import type { PhieuTra } from '../../../types/library';

export function ReturnHistoryList({
  returnsList,
  loading,
}: {
  returnsList: PhieuTra[];
  loading: boolean;
}) {
  return (
    <Card className="lg:col-span-7">
      <CardHeader
        title="Lịch sử phiếu trả sách"
        description={`${returnsList.length} phiếu trả đã ghi nhận`}
      />
      <CardBody className="p-0">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Đang tải dữ liệu...</div>
        ) : returnsList.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">Chưa có phiếu trả nào.</div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
            {returnsList.map((pt) => (
              <div key={pt.MaPhieuTra} className="px-5 py-4 hover:bg-slate-50/70">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div>
                    <span className="font-mono text-xs font-semibold text-[#0054A6]">
                      {pt.MaPhieuTra}
                    </span>
                    <span className="mx-2 text-slate-300">·</span>
                    <span className="text-sm font-semibold text-slate-900">
                      {pt.HoTenDocGia}
                    </span>
                    <span className="text-xs text-slate-500 ml-1.5 font-mono">
                      ({pt.MaDocGia})
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs tabular-nums">
                    <span className="text-slate-500">Ngày trả: {formatDateVn(pt.NgayTra)}</span>
                    <span
                      className={`font-semibold ${
                        pt.TongTienPhat > 0 ? 'text-rose-700' : 'text-emerald-700'
                      }`}
                    >
                      Phạt: {formatVnd(pt.TongTienPhat)}
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5 pl-3 border-l-2 border-slate-200">
                  {pt.ChiTiet.map((ct) => (
                    <div
                      key={ct.MaChiTietTra}
                      className="flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0">
                        <span className="font-mono text-slate-500 mr-1.5">{ct.MaSach}</span>
                        <span className="text-slate-800">{ct.TenSach}</span>
                      </div>
                      <div className="shrink-0 tabular-nums text-right">
                        {ct.SoNgayTraTre > 0 ? (
                          <span className="text-rose-700 font-medium">
                            Trễ {ct.SoNgayTraTre} ngày · {formatVnd(ct.TienPhat)}
                          </span>
                        ) : (
                          <span className="text-emerald-700">Đúng hạn</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
