import * as React from 'react';
import { bookService } from '../../../services/bookService';
import type { Sach, TheLoai } from '../../../types/library';
import {
  CatalogSearchPage,
  type CatalogFilterState,
} from '../../portal/CatalogSearchPage';

const DEFAULT_FILTERS: CatalogFilterState = {
  q: '',
  nguon: 'ALL',
  maTheLoai: 'ALL',
  maNganh: 'ALL',
  ngonNgu: 'ALL',
  tinhTrang: 'ALL',
  chuDe: 'ALL',
};

export function ReaderCatalogView({
  onSelectBook,
}: {
  onSelectBook: (book: Sach) => void;
}) {
  const [categories, setCategories] = React.useState<TheLoai[]>([]);
  const [filters, setFilters] = React.useState<CatalogFilterState>(DEFAULT_FILTERS);

  React.useEffect(() => {
    bookService.listPublicCategories().then(setCategories).catch(() => {});
  }, []);

  return (
    <CatalogSearchPage
      categories={categories}
      filters={filters}
      onChangeFilters={setFilters}
      onSelectBook={onSelectBook}
    />
  );
}

