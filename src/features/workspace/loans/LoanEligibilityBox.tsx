import { CheckCircle2, XCircle } from 'lucide-react';
import { formatDateVn } from '../../../services/rules/dateUtils';
import type { DocGia } from '../../../types/library';

export interface LoanRuleStatus {
  cardValid: boolean;
  noOverdue: boolean;
  withinLimit: boolean;
  currentHeld: number;
  maxAllowed: number;
  hanTra: string;
}

export function LoanEligibilityBox({
  reader,
  ruleStatus,
  selectedCount,
}: {
  reader: DocGia;
  ruleStatus: LoanRuleStatus;
  selectedCount: number;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-2 text-xs">
      <p className="font-semibold text-slate-800">Kiểm tra điều kiện mượn sách</p>
      <div className="flex items-center justify-between">
        <span className="text-slate-600">
          1. Hiệu lực thẻ ({formatDateVn(reader.NgayHetHan)})
        </span>
        <span
          className={`inline-flex items-center gap-1 font-medium ${
            ruleStatus.cardValid ? 'text-emerald-700' : 'text-red-700'
          }`}
        >
          {ruleStatus.cardValid ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" /> Còn hạn
            </>
          ) : (
            <>
              <XCircle className="w-3.5 h-3.5" /> Hết hạn
            </>
          )}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-slate-600">2. Sách mượn quá hạn chưa trả</span>
        <span
          className={`inline-flex items-center gap-1 font-medium ${
            ruleStatus.noOverdue ? 'text-emerald-700' : 'text-red-700'
          }`}
        >
          {ruleStatus.noOverdue ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" /> Không có
            </>
          ) : (
            <>
              <XCircle className="w-3.5 h-3.5" /> {reader.SoSachQuaHan} quá hạn
            </>
          )}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-slate-600">3. Hạn mức mượn tối đa</span>
        <span
          className={`font-mono tabular-nums font-medium ${
            ruleStatus.withinLimit ? 'text-emerald-700' : 'text-red-700'
          }`}
        >
          {ruleStatus.currentHeld} + {selectedCount} / {ruleStatus.maxAllowed} quyển
        </span>
      </div>
      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-slate-800">
        <span>Hạn trả tự động:</span>
        <strong className="font-mono tabular-nums text-[#0054A6]">
          {formatDateVn(ruleStatus.hanTra)}
        </strong>
      </div>
    </div>
  );
}
