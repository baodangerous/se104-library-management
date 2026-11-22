import { AlertCircle, BookOpen, Calendar, CreditCard, Mail, MapPin } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../../components/ui/card';
import { formatDateVn, formatVnd } from '../../../services/rules/dateUtils';
import type { DocGia, ThamSo } from '../../../types/library';

interface ReaderCardSummaryProps {
  docGia: DocGia;
  thamSo: ThamSo;
  activeCount: number;
  overdueCount: number;
  isExpired: boolean;
}

export function ReaderCardSummary({
  docGia,
  thamSo,
  activeCount,
  overdueCount,
  isExpired,
}: ReaderCardSummaryProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#0054A6] text-white border-[#00448A]">
          <CardBody className="space-y-3">
            <div className="flex items-center justify-between text-xs text-blue-100">
              <span>THẺ ĐỘC GIẢ UIT</span>
              <span className="font-mono font-semibold">{docGia.MaDocGia}</span>
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">{docGia.HoTen}</p>
              <p className="text-xs text-blue-100 mt-0.5">{docGia.TenLoaiDocGia}</p>
            </div>
            <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs tabular-nums">
              <span>Hạn thẻ: {formatDateVn(docGia.NgayHetHan)}</span>
              <span className={isExpired ? 'text-amber-300 font-semibold' : 'text-emerald-300'}>
                {isExpired ? 'Đã hết hạn' : 'Đang hiệu lực'}
              </span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase">
              <BookOpen className="w-4 h-4 text-[#0054A6]" /> Hạn mức mượn sách
            </div>
            <p className="text-3xl font-bold text-slate-900 tabular-nums">
              {activeCount} / {thamSo.SoSachMuonToiDa}
            </p>
            <p className="text-xs text-slate-500">
              {overdueCount > 0 ? (
                <span className="text-rose-700 font-semibold">
                  Bạn đang có {overdueCount} quyển quá hạn chưa trả.
                </span>
              ) : (
                `Tối đa ${thamSo.SoNgayMuonToiDa} ngày cho mỗi lượt mượn.`
              )}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase">
              <CreditCard className="w-4 h-4 text-rose-600" /> Công nợ tiền phạt
            </div>
            <p
              className={`text-3xl font-bold tabular-nums ${
                docGia.TongNo > 0 ? 'text-rose-700' : 'text-emerald-700'
              }`}
            >
              {formatVnd(docGia.TongNo)}
            </p>
            <p className="text-xs text-slate-500">
              {docGia.TongNo > 0
                ? 'Vui lòng liên hệ quầy Thủ thư UIT để thanh toán.'
                : 'Không có công nợ tiền phạt.'}
            </p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Thông tin thẻ độc giả" />
        <CardBody className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="flex items-start gap-2">
            <Mail className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-slate-500">Email UIT</p>
              <p className="font-medium text-slate-900 mt-0.5">{docGia.Email}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-slate-500">Ngày sinh / Ngày lập thẻ</p>
              <p className="font-medium text-slate-900 mt-0.5 tabular-nums">
                {formatDateVn(docGia.NgaySinh)} · {formatDateVn(docGia.NgayLapThe)}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 sm:col-span-2">
            <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-slate-500">Địa chỉ liên hệ</p>
              <p className="font-medium text-slate-900 mt-0.5">{docGia.DiaChi}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {overdueCount > 0 ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>
            Lưu ý: Bạn cần hoàn trả các quyển sách quá hạn trước khi đăng ký mượn sách mới.
          </span>
        </div>
      ) : null}
    </>
  );
}
