import * as React from 'react';
import { LoanFormCard } from './LoanFormCard';
import { LoanHistoryList } from './LoanHistoryList';
import { useLoans } from './useLoans';

export function LoansPage() {
  const { readers, books, loans, thamSo, loading, createLoan } = useLoans();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Cho mượn sách
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {thamSo
            ? `Tối đa ${thamSo.SoSachMuonToiDa} quyển/độc giả · Hạn mượn ${thamSo.SoNgayMuonToiDa} ngày · Áp dụng cho thẻ còn hạn và không có sách quá hạn.`
            : 'Kiểm tra đủ điều kiện lưu thông trước khi xác nhận cho mượn.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <LoanFormCard
          readers={readers}
          books={books}
          thamSo={thamSo}
          onCreateLoan={createLoan}
        />
        <LoanHistoryList loans={loans} loading={loading} />
      </div>
    </div>
  );
}
