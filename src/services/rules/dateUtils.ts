const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidIsoDate(dateStr: string): boolean {
  if (!ISO_DATE_RE.test(dateStr)) return false;
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

export function parseIsoDateUTC(dateStr: string): Date {
  if (!isValidIsoDate(dateStr)) {
    throw new Error(`Ngày không hợp lệ: ${dateStr}`);
  }
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function formatIsoDateUTC(dt: Date): string {
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dt.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDaysIso(dateStr: string, days: number): string {
  const dt = parseIsoDateUTC(dateStr);
  dt.setUTCDate(dt.getUTCDate() + days);
  return formatIsoDateUTC(dt);
}

export function addMonthsIso(dateStr: string, months: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const targetTotalMonths = y * 12 + (m - 1) + months;
  const targetYear = Math.floor(targetTotalMonths / 12);
  const targetMonth = targetTotalMonths % 12;
  const lastDay = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  return formatIsoDateUTC(new Date(Date.UTC(targetYear, targetMonth, Math.min(d, lastDay))));
}

export function diffDaysIso(laterDateStr: string, earlierDateStr: string): number {
  const later = parseIsoDateUTC(laterDateStr);
  const earlier = parseIsoDateUTC(earlierDateStr);
  return Math.round((later.getTime() - earlier.getTime()) / (24 * 60 * 60 * 1000));
}

export function calculateAgeAtDate(birthDateStr: string, refDateStr: string): number {
  const [by, bm, bd] = birthDateStr.split('-').map(Number);
  const [ry, rm, rd] = refDateStr.split('-').map(Number);
  let age = ry - by;
  if (rm < bm || (rm === bm && rd < bd)) age -= 1;
  return age;
}

export function formatVnd(amount: number): string {
  return `${Math.round(amount).toLocaleString('vi-VN')} ₫`;
}

export function formatDateVn(isoDate: string | null | undefined): string {
  if (!isoDate) return '—';
  if (!ISO_DATE_RE.test(isoDate.slice(0, 10))) return isoDate;
  const [y, m, d] = isoDate.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}
