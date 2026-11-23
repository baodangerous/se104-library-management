import { ArrowRight, BookOpen, GraduationCap, Network } from 'lucide-react';
import { portalService } from '../../services/portalService';
import type { Sach, TheLoai } from '../../types/library';
import type { PortalTabId } from '../../types/portal';
import { FeaturedBooksCarousel } from './FeaturedBooksCarousel';
import { HeroSearchSection, type HeroSearchQuery } from './HeroSearchSection';
import { PortalFaqSection } from './PortalFaqSection';

interface PortalHomePageProps {
  books: Sach[];
  categories: TheLoai[];
  onHeroSearch: (query: HeroSearchQuery) => void;
  onSelectBook: (book: Sach) => void;
  onSelectTheme?: (themeId: string) => void;
  onNavigateTab: (tab: PortalTabId) => void;
}

export function PortalHomePage({
  books,
  categories,
  onHeroSearch,
  onSelectBook,
  onNavigateTab,
}: PortalHomePageProps) {
  const majors = portalService.listMajors();
  const availableCount = books.filter((b) => b.TinhTrang === 'Có sẵn').length;
  const featuredBooks = books.filter((b) => b.NoiBat);
  const carouselBooks = featuredBooks.length >= 4 ? featuredBooks : books.slice(0, 8);

  return (
    <div className="space-y-8">
      <HeroSearchSection
        categories={categories}
        totalBooks={books.length}
        availableBooks={availableCount}
        onSearch={onHeroSearch}
      />

      {/* Block 1: Sách mới */}
      <FeaturedBooksCarousel
        books={carouselBooks}
        onSelectBook={onSelectBook}
        onViewAll={() => onNavigateTab('catalog')}
      />

      {/* Block 2: 12 Ngành học UIT (compact tiles) */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0a2b86] text-white flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0a1f4d]">12 Ngành đào tạo UIT</h2>
              <p className="text-xs font-normal text-slate-500">
                Chọn ngành để tra cứu nhanh giáo trình và tài liệu chuyên môn
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('majors')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1556d6] hover:underline shrink-0 cursor-pointer"
          >
            Xem chi tiết
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {majors.map((major) => {
            const count = books.filter((b) => b.MaNganh === major.MaNganh).length;
            const thumb = major.HinhAnh || portalService.getMajorImage(major.MaNganh);
            return (
              <button
                key={major.MaNganh}
                type="button"
                onClick={() =>
                  onHeroSearch({
                    q: '',
                    maTheLoai: 'ALL',
                    maNganh: major.MaNganh,
                    ngonNgu: 'ALL',
                    tinhTrang: 'ALL',
                  })
                }
                className="text-left rounded-xl border border-slate-200 bg-white hover:border-[#1556d6]/50 hover:shadow-sm transition-all cursor-pointer group overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[35/24] w-full overflow-hidden bg-slate-100">
                  <img
                    src={thumb}
                    alt={major.TenNganh}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#0a2b86]/90 text-white text-[11px] font-bold">
                    {major.MaNganh}
                  </span>
                </div>
                <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                  <p className="text-sm font-bold text-[#0a1f4d] group-hover:text-[#1556d6] line-clamp-2 leading-snug">
                    {major.TenNganh}
                  </p>
                  <p className="text-[11px] font-normal text-slate-500">
                    {count} đầu sách
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Block 3: Bản đồ Tri thức */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dcebff] text-[#0a2b86] text-xs font-bold">
            <Network className="w-3.5 h-3.5 text-[#1556d6]" />
            Khám phá trực quan
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0a1f4d]">
            Bản đồ Tri thức Học liệu UIT
          </h2>
          <p className="text-sm font-normal text-slate-600 leading-relaxed">
            Quan sát mạng lưới liên kết giữa 12 ngành đào tạo, thể loại tài liệu, giáo trình và tác giả
            để tìm nhanh học liệu liên quan.
          </p>
          <button
            type="button"
            onClick={() => onNavigateTab('knowledge-map')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0a2b86] hover:bg-[#1556d6] text-white text-sm font-bold transition-colors cursor-pointer"
          >
            Mở Bản đồ Tri thức
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Clean visual graph preview */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-gradient-to-br from-[#030a24] to-[#0a2b86] p-6 text-white space-y-4">
          <div className="flex items-center justify-between text-xs text-[#c3d6fa]">
            <span className="font-bold text-white">Xem trước mạng tri thức</span>
            <span className="px-2 py-0.5 rounded-full bg-[#4de1ff]/15 text-[#4de1ff] font-bold">
              Tương tác
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 items-center text-center">
            <div className="p-3 rounded-xl bg-white/10 border border-white/15 space-y-1">
              <GraduationCap className="w-5 h-5 text-[#f2b84a] mx-auto" />
              <p className="text-xs font-bold">12 Ngành</p>
            </div>
            <div className="p-3 rounded-xl bg-[#1556d6] border border-[#4de1ff]/40 space-y-1">
              <Network className="w-5 h-5 text-[#4de1ff] mx-auto" />
              <p className="text-xs font-bold">Liên kết</p>
            </div>
            <div className="p-3 rounded-xl bg-white/10 border border-white/15 space-y-1">
              <BookOpen className="w-5 h-5 text-[#4de1ff] mx-auto" />
              <p className="text-xs font-bold">{books.length} Sách</p>
            </div>
          </div>
          <p className="text-[11px] font-normal text-[#c3d6fa] text-center">
            Nhấp vào từng nút ngành học để lọc và mở chi tiết tài liệu trực tiếp.
          </p>
        </div>
      </section>

      <PortalFaqSection />
    </div>
  );
}
