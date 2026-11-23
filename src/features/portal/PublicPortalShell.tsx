import * as React from 'react';
import { parseHashRoute, setHashRoute } from '../../lib/hashRouter';
import { bookService } from '../../services/bookService';
import type { AuthUser, Sach, TheLoai } from '../../types/library';
import type { PortalTabId } from '../../types/portal';
import { UitLibBotWidget } from '../chatbot/UitLibBotWidget';
import type { ChatAction } from '../chatbot/types';
import { AboutPage } from './AboutPage';
import { BookDetailDrawer } from './BookDetailDrawer';
import { CatalogSearchPage, type CatalogFilterState } from './CatalogSearchPage';
import { CommandPaletteModal } from './CommandPaletteModal';
import { ContactFeedbackModal } from './ContactFeedbackModal';
import { usePortalHashSync } from './usePortalRouting';
import type { HeroSearchQuery } from './HeroSearchSection';
import { KnowledgeMapView } from './KnowledgeMapView';
import { LoginModal } from './LoginModal';
import { MajorsCatalogPage } from './MajorsCatalogPage';
import { PortalFooter } from './PortalFooter';
import { PortalHeader } from './PortalHeader';
import { PortalHomePage } from './PortalHomePage';
import { ServicesPage } from './ServicesPage';

const DEFAULT_CATALOG_FILTERS: CatalogFilterState = {
  q: '',
  nguon: 'ALL',
  maTheLoai: 'ALL',
  maNganh: 'ALL',
  ngonNgu: 'ALL',
  tinhTrang: 'ALL',
  chuDe: 'ALL',
};

interface PublicPortalShellProps {
  user: AuthUser | null;
  onLoginSuccess: (user: AuthUser) => void;
  onEnterWorkspace: () => void;
  onLogout: () => void;
}

export function PublicPortalShell({
  user,
  onLoginSuccess,
  onEnterWorkspace,
  onLogout,
}: PublicPortalShellProps) {
  const [activeTab, setActiveTab] = React.useState<PortalTabId>(() => {
    const parsed = parseHashRoute(typeof window !== 'undefined' ? window.location.hash : '');
    return parsed.area === 'portal' ? parsed.tab : 'home';
  });
  const [books, setBooks] = React.useState<Sach[]>([]);
  const [categories, setCategories] = React.useState<TheLoai[]>([]);
  const [catalogFilters, setCatalogFilters] = React.useState<CatalogFilterState>(
    DEFAULT_CATALOG_FILTERS
  );
  const [mapFocusMajor, setMapFocusMajor] = React.useState<string>('ALL');
  const [mapFocusBookId, setMapFocusBookId] = React.useState<string | null>(null);
  const [selectedBook, setSelectedBook] = React.useState<Sach | null>(null);
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [feedbackOpen, setFeedbackOpen] = React.useState(false);
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const loadCatalog = React.useCallback(async () => {
    const [b, c] = await Promise.all([bookService.listPublic(), bookService.listPublicCategories()]);
    setBooks(b);
    setCategories(c);
  }, []);
  React.useEffect(() => {
    loadCatalog();
  }, [loadCatalog, activeTab]);

  usePortalHashSync(books, setActiveTab, setSelectedBook, setPaletteOpen);

  const openBookWithHash = (book: Sach | null) => {
    setSelectedBook(book);
    setHashRoute(book ? `book/${book.MaSach}` : activeTab === 'home' ? '' : activeTab);
  };

  const handleHeroSearch = (query: HeroSearchQuery) => {
    setCatalogFilters({ ...DEFAULT_CATALOG_FILTERS, ...query });
    setActiveTab('catalog');
  };

  const handleSelectTheme = (themeId: string) => {
    setCatalogFilters({ ...DEFAULT_CATALOG_FILTERS, chuDe: themeId });
    setActiveTab('catalog');
  };

  const handleExploreMajorInMap = (maNganh: string) => {
    setMapFocusMajor(maNganh);
    setMapFocusBookId(null);
    setActiveTab('knowledge-map');
  };

  const handleOpenBookInMap = (book: Sach) => {
    setSelectedBook(null);
    setMapFocusMajor('ALL');
    setMapFocusBookId(book.MaSach);
    setActiveTab('knowledge-map');
  };

  const handleSelectTab = (tab: PortalTabId) => {
    if (tab === 'knowledge-map') {
      setMapFocusMajor('ALL');
      setMapFocusBookId(null);
    }
    setActiveTab(tab);
    setHashRoute(tab === 'home' ? '' : tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChatAction = (action: ChatAction) => {
    if (action.targetTab === 'knowledge-map' && action.majorFilter) {
      handleExploreMajorInMap(action.majorFilter);
      return;
    }
    handleSelectTab(action.targetTab);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#f4f7fc] text-slate-900">
      {/* Ambient Mesh Glow & Subtle Dot-Grid Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden dark:hidden"
      >
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[520px] rounded-full opacity-55 blur-3xl"
          style={{
            background:
              'radial-gradient(circle at 30% 40%, rgba(58,134,255,0.16), rgba(0,84,166,0.06) 55%, transparent 75%)',
          }}
        />
        <div
          className="absolute top-1/3 -left-36 w-[420px] h-[420px] rounded-full opacity-40 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(14,165,233,0.14), transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-10 -right-32 w-[460px] h-[460px] rounded-full opacity-40 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(#94a3b8 0.85px, transparent 0.85px)',
            backgroundSize: '26px 26px',
          }}
        />
      </div>

      <PortalHeader
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        user={user}
        onOpenLogin={() => setLoginOpen(true)}
        onOpenFeedback={() => setFeedbackOpen(true)}
        onEnterWorkspace={onEnterWorkspace}
        onLogout={onLogout}
      />

      <main className="relative z-10 flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-7">
        {activeTab === 'home' ? (
          <PortalHomePage
            books={books}
            categories={categories}
            onHeroSearch={handleHeroSearch}
            onSelectBook={setSelectedBook}
            onSelectTheme={handleSelectTheme}
            onNavigateTab={handleSelectTab}
          />
        ) : null}
        {activeTab === 'catalog' ? (
          <CatalogSearchPage
            categories={categories}
            filters={catalogFilters}
            onChangeFilters={setCatalogFilters}
            onSelectBook={setSelectedBook}
          />
        ) : null}
        {activeTab === 'majors' ? (
          <MajorsCatalogPage
            books={books}
            onSelectBook={setSelectedBook}
            onExploreMajorInMap={handleExploreMajorInMap}
          />
        ) : null}
        {activeTab === 'knowledge-map' ? (
          <KnowledgeMapView
            initialMajor={mapFocusMajor}
            initialBookId={mapFocusBookId}
            onOpenBookDetail={setSelectedBook}
          />
        ) : null}
        {activeTab === 'services' ? <ServicesPage user={user} /> : null}
        {activeTab === 'about' ? <AboutPage books={books} /> : null}
      </main>

      <PortalFooter onSelectTab={handleSelectTab} />

      <BookDetailDrawer
        book={selectedBook}
        user={user}
        onClose={() => openBookWithHash(null)}
        onOpenKnowledgeMap={handleOpenBookInMap}
        onRequireLogin={() => {
          openBookWithHash(null);
          setLoginOpen(true);
        }}
      />

      <CommandPaletteModal
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        books={books}
        onSelectBook={(b) => openBookWithHash(b)}
        onSelectTab={handleSelectTab}
      />

      <LoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onLoginSuccess={onLoginSuccess}
      />

      <ContactFeedbackModal
        open={feedbackOpen}
        user={user}
        onOpenChange={setFeedbackOpen}
      />

      <UitLibBotWidget
        onInspectBook={setSelectedBook}
        onOpenKnowledgeMap={handleOpenBookInMap}
        onExecuteAction={handleChatAction}
      />
    </div>
  );
}
