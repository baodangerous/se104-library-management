import * as React from 'react';
import { BookOpen, GraduationCap, Search } from 'lucide-react';
import { Button } from '../../components/ui/button';
import type { TheLoai } from '../../types/library';

export interface HeroSearchQuery {
  q: string;
  maTheLoai: string;
  maNganh: string;
  ngonNgu: string;
  tinhTrang: string;
}

interface HeroSearchSectionProps {
  categories?: TheLoai[];
  totalBooks: number;
  availableBooks: number;
  onSearch: (query: HeroSearchQuery) => void;
  onOpenKnowledgeMap?: () => void;
}

const QUICK_CHIPS: Array<{ label: string; patch: Partial<HeroSearchQuery> }> = [
  { label: 'Giáo trình', patch: { maTheLoai: 'A' } },
  { label: 'Luận văn', patch: { maTheLoai: 'C' } },
  { label: 'Sách ngoại văn', patch: { ngonNgu: 'Tiếng Anh' } },
];

export function HeroSearchSection({
  totalBooks,
  availableBooks,
  onSearch,
}: HeroSearchSectionProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [q, setQ] = React.useState('');

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const runSearch = (override?: Partial<HeroSearchQuery>) => {
    onSearch({
      q,
      maTheLoai: 'ALL',
      maNganh: 'ALL',
      ngonNgu: 'ALL',
      tinhTrang: 'ALL',
      ...override,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch();
  };

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-[#1556d6]/25 shadow-md"
      style={{
        background: 'linear-gradient(135deg, #030a24 0%, #0a2b86 58%, #1556d6 100%)',
      }}
    >
      {/* Single subtle soft glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#4de1ff]/12 blur-3xl" />

      <div className="relative z-10 px-6 sm:px-10 py-12 sm:py-16 max-w-3xl mx-auto text-center space-y-6">
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Tìm học liệu <span className="text-[#4de1ff]">Thư viện UIT</span>
          </h1>
          <p className="text-sm sm:text-base font-normal text-[#c3d6fa]">
            Tra cứu nhanh giáo trình, sách ngoại văn và luận văn theo 12 ngành đào tạo.
          </p>
        </div>

        {/* Single-focus search bar: 1 input + 1 primary button */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-2 shadow-lg flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={inputRef}
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Nhập tên sách, tác giả hoặc mã tài liệu (hỗ trợ không dấu)..."
              className="w-full h-11 pl-10 pr-4 rounded-lg bg-slate-50 text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1556d6]/25"
            />
          </div>
          <Button type="submit" variant="primary" className="h-11 px-6 shrink-0 gap-2 font-bold">
            <Search className="w-4 h-4" />
            Tra cứu ngay
          </Button>
        </form>

        {/* 3 quick filter chips + 2 small live stat chips */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => runSearch(chip.patch)}
              className="px-3.5 py-1.5 rounded-full bg-white/12 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              {chip.label}
            </button>
          ))}
          <span className="hidden sm:inline-block w-px h-4 bg-white/20 mx-1" />
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#030a24]/45 border border-white/15 text-xs font-normal text-[#c3d6fa]">
            <BookOpen className="w-3.5 h-3.5 text-[#4de1ff]" />
            <span>
              <strong className="font-bold text-white">{availableBooks}</strong>/{totalBooks} sách sẵn sàng
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#030a24]/45 border border-white/15 text-xs font-normal text-[#c3d6fa]">
            <GraduationCap className="w-3.5 h-3.5 text-[#f2b84a]" />
            <span>12 ngành đào tạo</span>
          </span>
        </div>
      </div>
    </section>
  );
}
