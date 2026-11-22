import { ArrowRight, BookOpen, DoorOpen, GraduationCap, Library, Network } from 'lucide-react';
import { portalService } from '../../services/portalService';
import type { Sach, TheLoai } from '../../types/library';
import type { PortalTabId } from '../../types/portal';
import { FeaturedBooksCarousel } from './FeaturedBooksCarousel';
import { HeroSearchSection, type HeroSearchQuery } from './HeroSearchSection';
import { PortalNewsSection } from './PortalNewsSection';

interface PortalHomePageProps {
  books: Sach[];
  categories: TheLoai[];
  onHeroSearch: (query: HeroSearchQuery) => void;
  onSelectBook: (book: Sach) => void;
  onSelectTheme: (themeId: string) => void;
  onNavigateTab: (tab: PortalTabId) => void;
}

export function PortalHomePage({
  books,
  categories,
  onHeroSearch,
  onSelectBook,
  onSelectTheme,
  onNavigateTab,
}: PortalHomePageProps) {
  const PORTAL_NEWS = portalService.listNews();
  const THEMATIC_SHELVES = portalService.listThematicShelves();
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
        onOpenKnowledgeMap={() => onNavigateTab('knowledge-map')}
      />

      {/* Quick Utility Strip */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickShortcut
          icon={GraduationCap}
          title="CSDL 12 ngành đào tạo UIT"
          description="Lọc giáo trình, sách tham khảo và luận văn theo từng ngành học."
          onClick={() => onNavigateTab('majors')}
        />
        <QuickShortcut
          icon={Network}
          title="Bản đồ Tri thức Học liệu"
          description="Khám phá trực quan mạng lưới liên kết Ngành học – Thể loại – Sách – Tác giả."
          onClick={() => onNavigateTab('knowledge-map')}
        />
        <QuickShortcut
          icon={DoorOpen}
          title="Đặt phòng họp nhóm & Dịch vụ"
          description="Đăng ký phòng thảo luận tầng 2–3 và gửi đề xuất bổ sung sách mới."
          onClick={() => onNavigateTab('services')}
        />
      </section>

      {/* Featured IT Books Carousel */}
      <FeaturedBooksCarousel
        books={carouselBooks}
        onSelectBook={onSelectBook}
        onViewAll={() => onNavigateTab('catalog')}
      />

      {/* Bento Grid: News + Thematic Shelves */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <PortalNewsSection news={PORTAL_NEWS} onOpenAbout={() => onNavigateTab('about')} />

        {/* Tủ sách Chuyên đề */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Tủ sách Chuyên đề</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Bộ sưu tập văn hóa, kỹ năng và học liệu mở chọn lọc tại Thư viện
            </p>
          </div>

          <div className="space-y-3 pt-4 flex-1">
            {THEMATIC_SHELVES.map((shelf) => {
              const linkedCount = books.filter((b) => b.ChuDe === shelf.id).length;
              return (
                <button
                  key={shelf.id}
                  type="button"
                  onClick={() => onSelectTheme(shelf.id)}
                  className="w-full text-left p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#0054A6]/50 transition-all hover:shadow-xs cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white"
                      style={{ backgroundColor: shelf.accentColor }}
                    >
                      <Library className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-[#0054A6] transition-colors">
                          {shelf.tenTuSach}
                        </h3>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0054A6] shrink-0" />
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{shelf.moTa}</p>
                      <p className="text-[11px] font-medium text-slate-500 mt-2 inline-flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-[#0054A6]" />
                        {shelf.soTaiLieuMinhHoa}+ tài liệu ({linkedCount} bản tiêu biểu trên cổng)
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Real UIT Library Space Gallery */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Không gian &amp; Hoạt động Thư viện UIT
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hình ảnh thực tế khu đọc mở, phòng học nhóm và các hoạt động học thuật tại UIT
            </p>
          </div>
          <a
            href="https://www.facebook.com/LibUIT.Fanpage"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-[#0054A6] hover:underline"
          >
            Fanpage Thư viện UIT →
          </a>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { src: '/resources/library/uit-lib-space-1.jpg', label: 'Không gian đọc mở UIT' },
            { src: '/resources/library/uit-lib-banner.jpg', label: 'Kệ sách chuyên ngành CNTT' },
            { src: '/resources/library/uit-lib-training.jpg', label: 'Tập huấn kỹ năng thông tin' },
            { src: '/resources/library/uit-lib-festival.jpg', label: 'Ngày hội Thư viện ĐHQG-HCM' },
          ].map((photo) => (
            <div key={photo.src} className="group relative rounded-xl overflow-hidden border border-slate-200 h-36">
              <img
                src={photo.src}
                alt={photo.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent p-2.5">
                <p className="text-[11px] font-medium text-white truncate">{photo.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function QuickShortcut({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left bg-white border border-slate-200 hover:border-[#0054A6]/50 rounded-xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-start gap-4 group"
    >
      <div className="w-10 h-10 rounded-xl bg-[#0054A6]/10 text-[#0054A6] flex items-center justify-center shrink-0 group-hover:bg-[#0054A6] group-hover:text-white transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0054A6] transition-colors">
          {title}
        </h3>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{description}</p>
      </div>
    </button>
  );
}
