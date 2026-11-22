import * as React from 'react';
import { BookDown, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardBody, CardHeader } from '../../../components/ui/card';
import { Input, Label, Select } from '../../../components/ui/input';
import type { ActiveBorrowedItem } from '../../../services/circulationService';
import { calculateReturnFine } from '../../../services/rules/circulationRules';
import { formatDateVn, formatVnd } from '../../../services/rules/dateUtils';
import type { DocGia } from '../../../types/library';

interface ReturnFormCardProps {
  readers: DocGia[];
  selectedReaderId: string;
  selectedReader: DocGia | null;
  activeItems: ActiveBorrowedItem[];
  selectedItemIds: number[];
  ngayTra: string;
  loadingActive: boolean;
  submitting: boolean;
  estimatedTotalFine: number;
  onSelectReader: (id: string) => void;
  onChangeNgayTra: (val: string) => void;
  onToggleItem: (id: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ReturnFormCard({
  readers,
  selectedReaderId,
  selectedReader,
  activeItems,
  selectedItemIds,
  ngayTra,
  loadingActive,
  submitting,
  estimatedTotalFine,
  onSelectReader,
  onChangeNgayTra,
  onToggleItem,
  onSubmit,
}: ReturnFormCardProps) {
  return (
    <Card className="lg:col-span-5">
      <CardHeader
        title="Lập phiếu nhận trả sách"
        description="Phạt 1.000 đ/ngày/quyển khi trả sau hạn và tự động cộng dồn vào Tổng nợ."
      />
      <CardBody>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ret-reader">Độc giả trả sách</Label>
            <Select
              id="ret-reader"
              value={selectedReaderId}
              onChange={(e) => onSelectReader(e.target.value)}
            >
              <option value="">-- Chọn độc giả --</option>
              {readers.map((r) => (
                <option key={r.MaDocGia} value={r.MaDocGia}>
                  {r.MaDocGia} — {r.HoTen} (Đang giữ {r.SoSachDangMuon ?? 0} quyển)
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ret-date">Ngày trả</Label>
            <Input
              id="ret-date"
              type="date"
              value={ngayTra}
              onChange={(e) => onChangeNgayTra(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Sách độc giả đang mượn ({activeItems.length})</Label>
            <div className="border border-slate-200 rounded-xl max-h-64 overflow-y-auto divide-y divide-slate-100">
              {!selectedReaderId ? (
                <div className="px-3 py-6 text-center text-xs text-slate-400">
                  Chọn độc giả để xem danh sách sách chưa trả.
                </div>
              ) : loadingActive ? (
                <div className="px-3 py-6 text-center text-xs text-slate-400">
                  Đang tải sách đang mượn...
                </div>
              ) : activeItems.length === 0 ? (
                <div className="px-3 py-6 text-center text-xs text-slate-400">
                  Độc giả hiện không giữ quyển sách nào.
                </div>
              ) : (
                activeItems.map((item) => {
                  const checked = selectedItemIds.includes(item.MaChiTietMuon);
                  const fine = calculateReturnFine(item.HanTra, ngayTra);
                  return (
                    <label
                      key={item.MaChiTietMuon}
                      className={`flex items-start gap-2.5 px-3 py-2.5 cursor-pointer transition-colors ${
                        checked ? 'bg-blue-50/60' : 'hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggleItem(item.MaChiTietMuon)}
                        className="mt-0.5 rounded border-slate-300 text-[#0054A6] focus:ring-[#0054A6]"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-slate-900">{item.TenSach}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap gap-x-2 tabular-nums">
                          <span className="font-mono">{item.MaSach}</span>
                          <span>Mượn: {formatDateVn(item.NgayMuon)}</span>
                          <span>Hạn: {formatDateVn(item.HanTra)}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0 tabular-nums">
                        {fine.soNgayTraTre > 0 ? (
                          <>
                            <div className="text-xs font-semibold text-rose-700">
                              +{formatVnd(fine.tienPhat)}
                            </div>
                            <div className="text-[11px] text-rose-600">
                              Trễ {fine.soNgayTraTre} ngày
                            </div>
                          </>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                            <CheckCircle2 className="w-3 h-3" /> Đúng hạn
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {selectedReader ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs space-y-1 tabular-nums">
              <div className="flex justify-between">
                <span className="text-slate-500">Tiền phạt kỳ trả này:</span>
                <span className="font-semibold text-rose-700">
                  {formatVnd(estimatedTotalFine)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tổng nợ sau khi trả:</span>
                <span className="font-semibold text-slate-900">
                  {formatVnd(selectedReader.TongNo + estimatedTotalFine)}
                </span>
              </div>
            </div>
          ) : null}

          <Button
            type="submit"
            className="w-full"
            disabled={submitting || !selectedReaderId || selectedItemIds.length === 0}
          >
            <BookDown className="w-4 h-4" />
            {submitting
              ? 'Đang xử lý...'
              : `Xác nhận nhận trả (${selectedItemIds.length} quyển)`}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
