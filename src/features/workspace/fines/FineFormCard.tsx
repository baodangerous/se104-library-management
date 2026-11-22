import * as React from 'react';
import { AlertCircle, CreditCard } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardBody, CardHeader } from '../../../components/ui/card';
import { Input, Label, Select } from '../../../components/ui/input';
import { formatVnd } from '../../../services/rules/dateUtils';
import type { DocGia } from '../../../types/library';

interface FineFormCardProps {
  indebtedReaders: DocGia[];
  selectedReaderId: string;
  selectedReader: DocGia | null;
  ngayThu: string;
  soTienThu: string;
  submitting: boolean;
  paymentValidation: { valid: boolean; error?: string; conLai?: number } | null;
  onSelectReader: (id: string) => void;
  onChangeNgayThu: (val: string) => void;
  onChangeSoTienThu: (val: string) => void;
  onFillFullDebt: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function FineFormCard({
  indebtedReaders,
  selectedReaderId,
  selectedReader,
  ngayThu,
  soTienThu,
  submitting,
  paymentValidation,
  onSelectReader,
  onChangeNgayThu,
  onChangeSoTienThu,
  onFillFullDebt,
  onSubmit,
}: FineFormCardProps) {
  return (
    <Card className="lg:col-span-5">
      <CardHeader
        title="Lập phiếu thu tiền phạt"
        description={`Hiện có ${indebtedReaders.length} độc giả đang có công nợ`}
      />
      <CardBody>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fine-reader">Độc giả nộp phạt</Label>
            <Select
              id="fine-reader"
              value={selectedReaderId}
              onChange={(e) => onSelectReader(e.target.value)}
            >
              <option value="">-- Chọn độc giả đang có nợ --</option>
              {indebtedReaders.map((r) => (
                <option key={r.MaDocGia} value={r.MaDocGia}>
                  {r.MaDocGia} — {r.HoTen} (Nợ: {formatVnd(r.TongNo)})
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fine-date">Ngày thu</Label>
            <Input
              id="fine-date"
              type="date"
              value={ngayThu}
              onChange={(e) => onChangeNgayThu(e.target.value)}
              required
            />
          </div>

          {selectedReader ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs space-y-1.5 tabular-nums">
              <div className="flex justify-between">
                <span className="text-slate-500">Tổng nợ hiện tại:</span>
                <span className="font-bold text-rose-700">
                  {formatVnd(selectedReader.TongNo)}
                </span>
              </div>
              {paymentValidation?.valid && paymentValidation.conLai !== undefined ? (
                <div className="flex justify-between">
                  <span className="text-slate-500">Còn lại sau thu:</span>
                  <span className="font-semibold text-emerald-700">
                    {formatVnd(paymentValidation.conLai)}
                  </span>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="fine-amount">Số tiền thu (VNĐ)</Label>
              {selectedReader ? (
                <button
                  type="button"
                  onClick={onFillFullDebt}
                  className="text-xs font-medium text-[#0054A6] hover:underline cursor-pointer"
                >
                  Thu toàn bộ nợ
                </button>
              ) : null}
            </div>
            <Input
              id="fine-amount"
              type="number"
              min={1000}
              step={1000}
              value={soTienThu}
              onChange={(e) => onChangeSoTienThu(e.target.value)}
              placeholder="Nhập số tiền thu..."
              disabled={!selectedReader}
              required
            />
          </div>

          {paymentValidation && !paymentValidation.valid ? (
            <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{paymentValidation.error}</span>
            </div>
          ) : null}

          <Button
            type="submit"
            className="w-full"
            disabled={submitting || !selectedReader || !paymentValidation?.valid}
          >
            <CreditCard className="w-4 h-4" />
            {submitting ? 'Đang ghi nhận...' : 'Lập phiếu thu tiền phạt'}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
