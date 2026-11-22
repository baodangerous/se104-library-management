import * as React from 'react';
import { BookOpen, Search, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { portalService } from '../../services/portalService';
import type { TheLoai } from '../../types/library';

export interface HeroSearchQuery {
  q: string;
  maTheLoai: string;
  maNganh: string;
  ngonNgu: string;
  tinhTrang: string;
}

interface HeroSearchSectionProps {
  categories: TheLoai[];
  totalBooks: number;
  availableBooks: number;
  onSearch: (query: HeroSearchQuery) => void;
  onOpenKnowledgeMap: () => void;
}

export function HeroSearchSection({
  categories,
  totalBooks,
  availableBooks,
  onSearch,
  onOpenKnowledgeMap,
}: HeroSearchSectionProps) {
  const UIT_MAJORS = React.useMemo(() => portalService.listMajors(), []);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [q, setQ] = React.useState('');
  const [maTheLoai, setMaTheLoai] = React.useState('ALL');
  const [maNganh, setMaNganh] = React.useState('ALL');
  const [ngonNgu, setNgonNgu] = React.useState('ALL');
  const [tinhTrang, setTinhTrang] = React.useState('ALL');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ q, maTheLoai, maNganh, ngonNgu, tinhTrang });
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      <img
        src="/resources/library/uit-lib-space-1.jpg"
        alt="Không gian đọc Thư viện Trường Đại học Công nghệ Thông tin – ĐHQG-HCM"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(125deg, rgba(0, 42, 84, 0.88) 0%, rgba(0, 84, 166, 0.80) 55%, rgba(0, 59, 115, 0.86) 100%)',
        }}
      />

      <div className="relative z-10 px-6 sm:px-10 py-10 sm:py-12 max-w-4xl mx-auto text-center space-y-6">
        <div className="space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-200">
            Thư viện Trường Đại học Công nghệ Thông tin – ĐHQG-HCM
          </p>
          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            Cổng tra cứu Học liệu &amp; Tri thức số UIT
          </h1>
          <p className="text-sm sm:text-base text-sky-100/95 max-w-2xl mx-auto">
            Tìm kiếm nhanh giáo trình, sách ngoại văn chuyên ngành CNTT, luận văn tốt nghiệp theo
            12 ngành đào tạo và kiểm tra tình trạng sẵn sàng theo thời gian thực.
          </p>
        </div>

        {/* Centered Search Box */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-3 sm:p-4 shadow-xl border border-white/20 text-left space-y-3"
        >
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={inputRef}
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm tên sách, tác giả, giáo trình, mã ngành (hỗ trợ không dấu)..."
                className="w-full h-11 pl-10 pr-16 rounded-lg border border-slate-200 bg-slate-50/70 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0054A6]/25 focus:border-[#0054A6]"
              />
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[11px] font-mono text-slate-400 bg-white border border-slate-200 rounded absolute right-3 top-1/2 -translate-y-1/2">
                Ctrl+K
              </kbd>
            </div>
            <Button type="submit" variant="primary" className="h-11 px-6 shrink-0 gap-2">
              <Search className="w-4 h-4" />
              Tra cứu ngay
            </Button>
          </div>

          {/* Quick Filters Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
            <select
              aria-label="Lọc theo thể loại"
              value={maTheLoai}
              onChange={(e) => setMaTheLoai(e.target.value)}
              className="h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-[#0054A6]"
            >
              <option value="ALL">Tất cả thể loại</option>
              {categories.map((c) => (
                <option key={c.MaTheLoai} value={c.MaTheLoai}>
                  {c.TenTheLoai}
                </option>
              ))}
            </select>

            <select
              aria-label="Lọc theo ngành học UIT"
              value={maNganh}
              onChange={(e) => setMaNganh(e.target.value)}
              className="h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-[#0054A6]"
            >
              <option value="ALL">Tất cả 12 ngành UIT</option>
              {UIT_MAJORS.map((m) => (
                <option key={m.MaNganh} value={m.MaNganh}>
                  {m.TenNganh}
                </option>
              ))}
            </select>

            <select
              aria-label="Lọc theo ngôn ngữ"
              value={ngonNgu}
              onChange={(e) => setNgonNgu(e.target.value)}
              className="h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-[#0054A6]"
            >
              <option value="ALL">Mọi ngôn ngữ</option>
              <option value="Tiếng Việt">Tiếng Việt</option>
              <option value="Tiếng Anh">Tiếng Anh (Ngoại văn)</option>
            </select>

            <select
              aria-label="Lọc theo tình trạng"
              value={tinhTrang}
              onChange={(e) => setTinhTrang(e.target.value)}
              className="h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-[#0054A6]"
            >
              <option value="ALL">Mọi tình trạng</option>
              <option value="Có sẵn">Có sẵn tại kệ</option>
              <option value="Đang mượn">Đang được mượn</option>
            </select>
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-sky-100">
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-sky-300" />
            <span>
              <strong className="text-white">{availableBooks}</strong> / {totalBooks} đầu sách sẵn
              sàng tại kho mở
            </span>
          </span>
          <button
            type="button"
            onClick={onOpenKnowledgeMap}
            className="inline-flex items-center gap-1.5 text-white font-medium underline underline-offset-4 hover:text-sky-200 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            Khám phá Bản đồ Tri thức tương tác
          </button>
        </div>
      </div>
    </section>
  );
}
