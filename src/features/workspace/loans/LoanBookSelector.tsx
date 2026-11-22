import * as React from 'react';
import { FieldLabel, TextInput } from '../../../components/ui/input';
import type { Sach } from '../../../types/library';

interface LoanBookSelectorProps {
  availableBooks: Sach[];
  selectedBookIds: string[];
  scanCode: string;
  bookSearch: string;
  scanInputRef: React.RefObject<HTMLInputElement | null>;
  onChangeScanCode: (val: string) => void;
  onScanKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChangeBookSearch: (val: string) => void;
  onToggleBook: (maSach: string) => void;
}

export function LoanBookSelector({
  availableBooks,
  selectedBookIds,
  scanCode,
  bookSearch,
  scanInputRef,
  onChangeScanCode,
  onScanKeyDown,
  onChangeBookSearch,
  onToggleBook,
}: LoanBookSelectorProps) {
  return (
    <div>
      <FieldLabel htmlFor="pm-search-sach" required>
        Chọn sách có sẵn ({selectedBookIds.length} đã chọn)
      </FieldLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
        <TextInput
          ref={scanInputRef}
          id="pm-scan-sach"
          type="text"
          placeholder="Quét / nhập mã sách (VD: S001) + Enter"
          value={scanCode}
          onChange={(e) => onChangeScanCode(e.target.value)}
          onKeyDown={onScanKeyDown}
          className="h-9 font-mono text-xs"
        />
        <TextInput
          id="pm-search-sach"
          type="search"
          placeholder="Lọc nhanh theo tên, tác giả..."
          value={bookSearch}
          onChange={(e) => onChangeBookSearch(e.target.value)}
          className="h-9"
        />
      </div>
      <div className="border border-slate-200 rounded-lg max-h-56 overflow-y-auto divide-y divide-slate-100">
        {availableBooks.length === 0 ? (
          <p className="p-4 text-xs text-slate-500 text-center">
            Không có sách phù hợp đang ở trạng thái Có sẵn.
          </p>
        ) : (
          availableBooks.map((book) => {
            const checked = selectedBookIds.includes(book.MaSach);
            return (
              <label
                key={book.MaSach}
                className={`flex items-start gap-3 px-3.5 py-2.5 cursor-pointer transition-colors ${
                  checked ? 'bg-[#EFF6FF]' : 'hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleBook(book.MaSach)}
                  className="mt-0.5 rounded border-slate-300 text-[#0054A6]"
                />
                <div className="min-w-0 text-xs">
                  <p className="font-medium text-slate-900">
                    <span className="font-mono text-slate-500 mr-1.5">{book.MaSach}</span>
                    {book.TenSach}
                  </p>
                  <p className="text-slate-500 mt-0.5 truncate">
                    {book.TenTheLoai} · {book.TacGiaList.join(', ')}
                  </p>
                </div>
              </label>
            );
          })
        )}
      </div>
    </div>
  );
}
