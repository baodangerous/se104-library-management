import type { NavPageId } from '../features/workspace/layout/navConfig';
import type { PortalTabId } from '../types/portal';

export type HashRoute =
  | { area: 'portal'; tab: PortalTabId; bookId?: string }
  | { area: 'workspace'; page: NavPageId };

const PORTAL_TABS: PortalTabId[] = [
  'home',
  'catalog',
  'majors',
  'knowledge-map',
  'services',
  'about',
];

const STAFF_PAGES: NavPageId[] = [
  'dashboard',
  'readers',
  'books',
  'knowledge-map',
  'loans',
  'returns',
  'fines',
  'reports',
  'regulations',
  'accounts',
  'audit',
  'backup',
  'reader-portal',
];

export function parseHashRoute(hash: string): HashRoute {
  const clean = hash.replace(/^#\/?/, '').trim();
  if (!clean) return { area: 'portal', tab: 'home' };

  if (clean.startsWith('book/')) {
    const bookId = decodeURIComponent(clean.slice('book/'.length)).trim();
    return { area: 'portal', tab: 'catalog', bookId: bookId || undefined };
  }

  if (clean.startsWith('staff/')) {
    const rawPage = clean.slice('staff/'.length);
    const mapped = rawPage === 'circ' ? 'loans' : rawPage;
    if (STAFF_PAGES.includes(mapped as NavPageId)) {
      return { area: 'workspace', page: mapped as NavPageId };
    }
    return { area: 'workspace', page: 'dashboard' };
  }

  if (PORTAL_TABS.includes(clean as PortalTabId)) {
    return { area: 'portal', tab: clean as PortalTabId };
  }

  return { area: 'portal', tab: 'home' };
}

export function setHashRoute(path: string): void {
  if (typeof window === 'undefined') return;
  const target = path.startsWith('#') ? path : `#/${path.replace(/^\//, '')}`;
  if (window.location.hash !== target) {
    window.location.hash = target;
  }
}

