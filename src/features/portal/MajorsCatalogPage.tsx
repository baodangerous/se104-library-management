import * as React from 'react';
import { UIT_MAJORS } from '../../constants/majors';
import { cn } from '../../lib/utils';
import type { Sach } from '../../types/library';
import type { ChuongTrinhDaoTao } from '../../types/portal';
import { MajorBooksPanel } from './MajorBooksPanel';

const PROGRAM_FILTERS: Array<'ALL' | ChuongTrinhDaoTao> = [
  'ALL',
  'ĐH chính quy',
  'CT Tiếng Anh',
  'Sau ĐH',
];

interface MajorsCatalogPageProps {
  books: Sach[];
  onSelectBook: (book: Sach) => void;
  onExploreMajorInMap: (maNganh: string) => void;
}

export function MajorsCatalogPage({
  books,
  onSelectBook,
  onExploreMajorInMap,
}: MajorsCatalogPageProps) {
  const [program, setProgram] = React.useState<'ALL' | ChuongTrinhDaoTao>('ALL');
  const [selectedMajor, setSelectedMajor] = React.useState<string>('ATTT');

  const visibleMajors = React.useMemo(
    () =>
      program === 'ALL'
        ? UIT_MAJORS
        : UIT_MAJORS.filter((m) => m.ChuongTrinh.includes(program)),
    [program]
  );

  React.useEffect(() => {
    if (!visibleMajors.some((m) => m.MaNganh === selectedMajor) && visibleMajors[0]) {
      setSelectedMajor(visibleMajors[0].MaNganh);
    }
  }, [visibleMajors, selectedMajor]);

  const activeMajor =
    UIT_MAJORS.find((m) => m.MaNganh === selectedMajor) || visibleMajors[0];
  const majorBooks = books.filter((b) => b.MaNganh === activeMajor?.MaNganh);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Cơ sở dữ liệu 12 ngành đào tạo UIT
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tra cứu nhanh giáo trình cốt lõi, sách tham khảo ngoại văn và luận văn theo từng ngành.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {PROGRAM_FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setProgram(item)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
                program === item
                  ? 'bg-[#0054A6] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
              )}
            >
              {item === 'ALL' ? 'Tất cả bậc đào tạo' : item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {visibleMajors.map((major) => {
          const count = books.filter((b) => b.MaNganh === major.MaNganh).length;
          const active = activeMajor?.MaNganh === major.MaNganh;
          return (
            <button
              key={major.MaNganh}
              type="button"
              onClick={() => setSelectedMajor(major.MaNganh)}
              className={cn(
                'text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5',
                active
                  ? 'bg-[#0054A6] text-white border-[#0054A6] shadow-md'
                  : 'bg-white text-slate-900 border-slate-200 hover:border-[#0054A6]/50 hover:shadow-xs'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={cn(
                    'text-[11px] font-mono font-bold px-2 py-0.5 rounded',
                    active ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#0054A6]'
                  )}
                >
                  {major.MaNganh}
                </span>
                <span className={cn('text-xs font-medium', active ? 'text-sky-100' : 'text-slate-500')}>
                  {count} học liệu
                </span>
              </div>
              <div>
                <h2 className="text-sm font-bold leading-snug">{major.TenNganh}</h2>
                <p className={cn('text-[11px] mt-1 line-clamp-1', active ? 'text-sky-100' : 'text-slate-500')}>
                  {major.Khoa}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {activeMajor ? (
        <MajorBooksPanel
          major={activeMajor}
          books={majorBooks}
          onSelectBook={onSelectBook}
          onExploreMajorInMap={onExploreMajorInMap}
        />
      ) : null}
    </div>
  );
}
