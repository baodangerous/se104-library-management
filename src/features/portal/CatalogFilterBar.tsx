import { Filter, RotateCcw, Search } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';
import type { TheLoai } from '../../types/library';
import type { NganhHoc, NguonTaiLieu, TuSachChuyenDe } from '../../types/portal';

const SOURCE_TABS: Array<{ value: 'ALL' | NguonTaiLieu; label: string }> = [
  { value: 'ALL', label: 'Tất cả nguồn' },
  { value: 'Giáo trình UIT', label: 'Giáo trình UIT' },
  { value: 'Luận văn UIT', label: 'Luận văn UIT' },
  { value: 'Sách Tiếng Việt', label: 'Sách Tiếng Việt' },
  { value: 'Sách Ngoại văn', label: 'Sách Ngoại văn' },
];

export interface CatalogFilterState {
  q: string;
  nguon: string;
  maTheLoai: string;
  maNganh: string;
  ngonNgu: string;
  tinhTrang: string;
  chuDe: string;
}

interface CatalogFilterBarProps {
  filters: CatalogFilterState;
  categories: TheLoai[];
  majors: NganhHoc[];
  activeTheme?: TuSachChuyenDe;
  onUpdate: (patch: Partial<CatalogFilterState>) => void;
  onReset: () => void;
}

export function CatalogFilterBar({
  filters,
  categories,
  majors,
  activeTheme,
  onUpdate,
  onReset,
}: CatalogFilterBarProps) {
  return (
    <>
      <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-4">
        {SOURCE_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onUpdate({ nguon: tab.value })}
            className={cn(
              'px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
              filters.nguon === tab.value
                ? 'bg-[#0054A6] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.q}
              onChange={(e) => onUpdate({ q: e.target.value })}
              placeholder="Nhập từ khóa tìm kiếm (VD: CompTIA, DevOps, Giai thuat, Bao mat...)"
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0054A6]/20 focus:border-[#0054A6]"
            />
          </div>
          <Button variant="outline" onClick={onReset} className="gap-1.5 shrink-0">
            <RotateCcw className="w-3.5 h-3.5" />
            Đặt lại bộ lọc
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <select
            aria-label="Lọc theo thể loại"
            value={filters.maTheLoai}
            onChange={(e) => onUpdate({ maTheLoai: e.target.value })}
            className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
          >
            <option value="ALL">Tất cả thể loại</option>
            {categories.map((c) => (
              <option key={c.MaTheLoai} value={c.MaTheLoai}>
                {c.TenTheLoai}
              </option>
            ))}
          </select>
          <select
            aria-label="Lọc theo ngành đào tạo"
            value={filters.maNganh}
            onChange={(e) => onUpdate({ maNganh: e.target.value })}
            className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
          >
            <option value="ALL">Tất cả {majors.length} ngành UIT</option>
            {majors.map((m) => (
              <option key={m.MaNganh} value={m.MaNganh}>
                {m.TenNganh}
              </option>
            ))}
          </select>
          <select
            aria-label="Lọc theo ngôn ngữ"
            value={filters.ngonNgu}
            onChange={(e) => onUpdate({ ngonNgu: e.target.value })}
            className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
          >
            <option value="ALL">Mọi ngôn ngữ</option>
            <option value="Tiếng Việt">Tiếng Việt</option>
            <option value="Tiếng Anh">Tiếng Anh</option>
          </select>
          <select
            aria-label="Lọc theo tình trạng sách"
            value={filters.tinhTrang}
            onChange={(e) => onUpdate({ tinhTrang: e.target.value })}
            className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
          >
            <option value="ALL">Mọi tình trạng</option>
            <option value="Có sẵn">Có sẵn</option>
            <option value="Đang mượn">Đang mượn</option>
          </select>
        </div>

        {activeTheme ? (
          <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-lg bg-[#0054A6]/8 text-xs text-[#0054A6]">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Filter className="w-3.5 h-3.5" />
              Đang lọc theo tủ sách: <strong>{activeTheme.tenTuSach}</strong>
            </span>
            <button
              type="button"
              onClick={() => onUpdate({ chuDe: 'ALL' })}
              className="font-semibold hover:underline cursor-pointer"
            >
              Bỏ lọc
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
