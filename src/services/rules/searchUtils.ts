/**
 * Normalize Vietnamese text by stripping diacritics and lowercasing
 * so users can search seamlessly with or without Vietnamese accents.
 */
export function removeVietnameseTones(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

export function matchesVietnameseSearch(
  query: string,
  fields: Array<string | number | undefined | null>
): boolean {
  const normalizedQuery = removeVietnameseTones(query);
  if (!normalizedQuery) return true;
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const haystack = fields
    .map((f) => (f == null ? '' : removeVietnameseTones(String(f))))
    .join(' ');
  return tokens.every((tok) => haystack.includes(tok));
}
