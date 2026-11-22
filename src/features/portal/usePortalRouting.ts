import * as React from 'react';
import { parseHashRoute } from '../../lib/hashRouter';
import type { Sach } from '../../types/library';
import type { PortalTabId } from '../../types/portal';

export function usePortalHashSync(
  books: Sach[],
  setActiveTab: (tab: PortalTabId) => void,
  setSelectedBook: (book: Sach | null) => void,
  setPaletteOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  React.useEffect(() => {
    const syncFromHash = () => {
      const parsed = parseHashRoute(window.location.hash);
      if (parsed.area !== 'portal') return;
      setActiveTab(parsed.tab);
      if (parsed.bookId) {
        const found = books.find((b) => b.MaSach.toUpperCase() === parsed.bookId!.toUpperCase());
        if (found) setSelectedBook(found);
      }
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, [books, setActiveTab, setSelectedBook]);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setPaletteOpen]);
}

