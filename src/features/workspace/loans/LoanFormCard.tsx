import * as React from 'react';
import { BookUp } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { SurfaceCard, SurfaceCardHeader } from '../../../components/ui/card';
import { FieldLabel, SelectInput, TextInput } from '../../../components/ui/input';
import { addDaysIso, diffDaysIso, todayIsoDate } from '../../../services/rules/dateUtils';
import type { DocGia, Sach, ThamSo } from '../../../types/library';
import { LoanEligibilityBox, type LoanRuleStatus } from './LoanEligibilityBox';

interface LoanFormCardProps {
  readers: DocGia[];
  books: Sach[];
  thamSo: ThamSo | null;
  onCreateLoan: (maDocGia: string, ngayMuon: string, maSachList: string[]) => Promise<void>;
}

export function LoanFormCard({ readers, books, thamSo, onCreateLoan }: LoanFormCardProps) {
  const [selectedReaderId, setSelectedReaderId] = React.useState('');
  const [ngayMuon, setNgayMuon] = React.useState(todayIsoDate());
  const [selectedBookIds, setSelectedBookIds] = React.useState<string[]>([]);
  const [bookSearch, setBookSearch] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const selectedReader = readers.find((r) => r.MaDocGia === selectedReaderId) || null;
  const availableBooks = React.useMemo(() => {
    const kw = bookSearch.trim().toLowerCase();
    return books.filter((b) => {
      if (b.TinhTrang !== 'Có sẵn') return false;
      if (!kw) return true;
      return (
        b.MaSach.toLowerCase().includes(kw) ||
        b.TenSach.toLowerCase().includes(kw) ||
        b.TacGiaList.some((a) => a.toLowerCase().includes(kw))
      );
    });
  }, [books, bookSearch]);

  const ruleStatus = React.useMemo<LoanRuleStatus | null>(() => {
    if (!selectedReader || !thamSo) return null;
    const cardValid =
      diffDaysIso(selectedReader.NgayHetHan, ngayMuon) >= 0 &&
      diffDaysIso(ngayMuon, selectedReader.NgayLapThe) >= 0;
    const currentHeld = selectedReader.SoSachDangMuon || 0;
    return {
      cardValid,
      noOverdue: (selectedReader.SoSachQuaHan || 0) === 0,
      withinLimit: currentHeld + selectedBookIds.length <= thamSo.SoSachMuonToiDa,
      currentHeld,
      maxAllowed: thamSo.SoSachMuonToiDa,
      hanTra: addDaysIso(ngayMuon, thamSo.SoNgayMuonToiDa),
    };
  }, [selectedReader, thamSo, ngayMuon, selectedBookIds.length]);

  function toggleBook(maSach: string) {
    setSelectedBookIds((prev) =>
      prev.includes(maSach) ? prev.filter((id) => id !== maSach) : [...prev, maSach]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedReaderId || selectedBookIds.length === 0) {
      toast.error('Vui lòng chọn độc giả và ít nhất 1 quyển sách.');
      return;
    }
    setSubmitting(true);
    try {
      await onCreateLoan(selectedReaderId, ngayMuon, selectedBookIds);
      setSelectedBookIds([]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể lập phiếu mượn.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SurfaceCard className="lg:col-span-5">
      <SurfaceCardHeader
        title="Thông tin phiếu mượn mới"
        description="Chọn độc giả, ngày mượn và các đầu sách đang có sẵn"
      />
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <FieldLabel htmlFor="pm-docgia" required>
            Độc giả mượn sách
          </FieldLabel>
          <SelectInput
            id="pm-docgia"
            value={selectedReaderId}
            onChange={(e) => {
              setSelectedReaderId(e.target.value);
              setSelectedBookIds([]);
            }}
          >
            <option value="">-- Chọn độc giả --</option>
            {readers.map((r) => (
              <option key={r.MaDocGia} value={r.MaDocGia}>
                {r.MaDocGia} – {r.HoTen} (Đang giữ {r.SoSachDangMuon || 0} quyển)
              </option>
            ))}
          </SelectInput>
        </div>

        <div>
          <FieldLabel htmlFor="pm-ngaymuon" required>
            Ngày mượn
          </FieldLabel>
          <TextInput
            id="pm-ngaymuon"
            type="date"
            required
            value={ngayMuon}
            onChange={(e) => setNgayMuon(e.target.value)}
          />
        </div>

        {selectedReader && ruleStatus ? (
          <LoanEligibilityBox
            reader={selectedReader}
            ruleStatus={ruleStatus}
            selectedCount={selectedBookIds.length}
          />
        ) : null}

        <div>
          <FieldLabel htmlFor="pm-search-sach" required>
            Chọn sách có sẵn ({selectedBookIds.length} đã chọn)
          </FieldLabel>
          <TextInput
            id="pm-search-sach"
            type="search"
            placeholder="Lọc nhanh theo mã hoặc tên sách..."
            value={bookSearch}
            onChange={(e) => setBookSearch(e.target.value)}
            className="mb-2 h-9"
          />
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
                      onChange={() => toggleBook(book.MaSach)}
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

        <Button
          type="submit"
          className="w-full"
          disabled={
            submitting ||
            !selectedReaderId ||
            selectedBookIds.length === 0 ||
            Boolean(
              ruleStatus &&
                (!ruleStatus.cardValid || !ruleStatus.noOverdue || !ruleStatus.withinLimit)
            )
          }
        >
          <BookUp className="w-4 h-4" />
          {submitting ? 'Đang lập phiếu...' : 'Xác nhận cho mượn sách'}
        </Button>
      </form>
    </SurfaceCard>
  );
}
