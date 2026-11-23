import * as React from 'react';
import { toast } from 'sonner';
import type { AuthUser, Sach } from '../../types/library';
import { bookService } from '../../services/bookService';
import { UitLibBotWidget } from '../chatbot/UitLibBotWidget';
import type { ChatAction } from '../chatbot/types';
import { AboutPage } from '../portal/AboutPage';
import { BookDetailDrawer } from '../portal/BookDetailDrawer';
import { KnowledgeMapView } from '../portal/KnowledgeMapView';
import { MajorsCatalogPage } from '../portal/MajorsCatalogPage';
import { ServicesPage } from '../portal/ServicesPage';
import { AccountsPage } from './admin/AccountsPage';
import { AuditLogPage } from './admin/AuditLogPage';
import { BackupPage } from './admin/BackupPage';
import { NewsManagePage } from './admin/NewsManagePage';
import { ServiceRequestsManagePage } from './admin/ServiceRequestsManagePage';
import { BooksPage } from './books/BooksPage';
import { DashboardPage } from './dashboard/DashboardPage';
import { FinesPage } from './fines/FinesPage';
import { AppShell } from './layout/AppShell';
import { NAV_ITEMS, type NavPageId } from './layout/navConfig';
import { LoansPage } from './loans/LoansPage';
import { ReaderCatalogView } from './reader-portal/ReaderCatalogView';
import { ReaderPortalPage } from './reader-portal/ReaderPortalPage';
import { ReadersPage } from './readers/ReadersPage';
import { RegulationsPage } from './regulations/RegulationsPage';
import { ReportsPage } from './reports/ReportsPage';
import { ReturnsPage } from './returns/ReturnsPage';

function getDefaultPageForRole(role: AuthUser['VaiTro']): NavPageId {
  return role === 'READER' ? 'reader-portal' : 'dashboard';
}

interface WorkspaceAppProps {
  user: AuthUser;
  onBackToPortal: () => void;
  onLogout: () => void;
}

export function WorkspaceApp({
  user,
  onBackToPortal,
  onLogout,
}: WorkspaceAppProps) {
  const [activePage, setActivePage] = React.useState<NavPageId>(() =>
    getDefaultPageForRole(user.VaiTro)
  );
  const [inspectedBook, setInspectedBook] = React.useState<Sach | null>(null);
  const [mapFocusBookId, setMapFocusBookId] = React.useState<string | null>(null);
  const [portalBooks, setPortalBooks] = React.useState<Sach[]>([]);

  React.useEffect(() => {
    if (user.VaiTro === 'READER' && portalBooks.length === 0) {
      bookService.listPublic().then(setPortalBooks).catch(() => {});
    }
  }, [user.VaiTro, portalBooks.length]);

  React.useEffect(() => {
    setActivePage(getDefaultPageForRole(user.VaiTro));
  }, [user.MaTaiKhoan, user.VaiTro]);

  function handleNavigate(target: NavPageId) {
    const item = NAV_ITEMS.find((i) => i.id === target);
    if (!item || !item.roles.includes(user.VaiTro)) {
      toast.error('Bạn không có quyền truy cập chức năng này.');
      return;
    }
    setActivePage(target);
  }

  function handleOpenBookInMap(book: Sach) {
    setInspectedBook(null);
    setMapFocusBookId(book.MaSach);
    setActivePage('knowledge-map');
  }

  function handleChatAction(action: ChatAction) {
    if (action.targetTab === 'knowledge-map') {
      setActivePage('knowledge-map');
      return;
    }
    if (action.targetTab === 'catalog') {
      setActivePage('books');
      return;
    }
    onBackToPortal();
  }

  function renderPage() {
    const navMeta = NAV_ITEMS.find((i) => i.id === activePage);
    if (!navMeta || !navMeta.roles.includes(user.VaiTro)) {
      return user.VaiTro === 'READER' ? (
        <ReaderPortalPage onNavigate={handleNavigate} />
      ) : (
        <DashboardPage onNavigate={handleNavigate} />
      );
    }

    switch (activePage) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'readers':
        return <ReadersPage />;
      case 'books':
        return user.VaiTro === 'READER' ? (
          <ReaderCatalogView onSelectBook={setInspectedBook} />
        ) : (
          <BooksPage userRole={user.VaiTro} />
        );
      case 'knowledge-map':
        return (
          <KnowledgeMapView
            initialBookId={mapFocusBookId}
            onOpenBookDetail={setInspectedBook}
          />
        );
      case 'loans':
        return <LoansPage />;
      case 'returns':
        return <ReturnsPage />;
      case 'service-requests':
        return <ServiceRequestsManagePage />;
      case 'fines':
        return <FinesPage />;
      case 'reports':
        return <ReportsPage />;
      case 'news':
        return <NewsManagePage />;
      case 'regulations':
        return <RegulationsPage />;
      case 'accounts':
        return <AccountsPage currentRole={user.VaiTro} />;
      case 'audit':
        return <AuditLogPage />;
      case 'backup':
        return <BackupPage />;
      case 'reader-portal':
        return <ReaderPortalPage onNavigate={handleNavigate} />;
      case 'reader-services':
        return <ServicesPage user={user} />;
      case 'reader-majors':
        return (
          <MajorsCatalogPage
            books={portalBooks}
            onSelectBook={setInspectedBook}
            onExploreMajorInMap={() => setActivePage('knowledge-map')}
          />
        );
      case 'reader-about':
        return <AboutPage books={portalBooks} />;
      default:
        return <DashboardPage onNavigate={handleNavigate} />;
    }
  }

  return (
    <>
      <AppShell
        user={user}
        activePage={activePage}
        onNavigate={handleNavigate}
        onBackToPortal={onBackToPortal}
        onLogout={onLogout}
      >
        {renderPage()}
      </AppShell>

      <BookDetailDrawer
        book={inspectedBook}
        user={user}
        onClose={() => setInspectedBook(null)}
        onOpenKnowledgeMap={handleOpenBookInMap}
      />

      <UitLibBotWidget
        onInspectBook={setInspectedBook}
        onOpenKnowledgeMap={handleOpenBookInMap}
        onExecuteAction={handleChatAction}
      />
    </>
  );
}
