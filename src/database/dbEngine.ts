import type { AuthUser, NhatKyThaoTac } from '../types/library';
import type { LibraryDatabase } from './schema';
import { createInitialDatabase } from './seedData';

const STORAGE_KEY = 'uit_library_portal_db_v12';
let memoryFallbackDb: LibraryDatabase | null = null;
let currentActor: AuthUser | null = null;

function hasLocalStorage(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
}

export function setCurrentActor(user: AuthUser | null): void {
  currentActor = user;
}

export function getCurrentActor(): AuthUser | null {
  return currentActor;
}

function hydrateMissingTables(parsed: Partial<LibraryDatabase>): LibraryDatabase {
  const seed = createInitialDatabase();
  return {
    ...seed,
    ...parsed,
    NGANHHOC:
      Array.isArray(parsed.NGANHHOC) && parsed.NGANHHOC.length > 0
        ? parsed.NGANHHOC
        : seed.NGANHHOC,
    TINTUC:
      Array.isArray(parsed.TINTUC) && parsed.TINTUC.length > 0
        ? parsed.TINTUC
        : seed.TINTUC,
    TUSACHCHUYENDE:
      Array.isArray(parsed.TUSACHCHUYENDE) && parsed.TUSACHCHUYENDE.length > 0
        ? parsed.TUSACHCHUYENDE
        : seed.TUSACHCHUYENDE,
    CAUHINHCONG: parsed.CAUHINHCONG ?? seed.CAUHINHCONG,
    HUONGDAN: parsed.HUONGDAN ?? seed.HUONGDAN,
    DATTRUOC: Array.isArray(parsed.DATTRUOC) ? parsed.DATTRUOC : seed.DATTRUOC,
  };
}

export function loadDb(): LibraryDatabase {
  if (!hasLocalStorage()) {
    if (!memoryFallbackDb) memoryFallbackDb = createInitialDatabase();
    return structuredClone(memoryFallbackDb);
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = createInitialDatabase();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as Partial<LibraryDatabase>;
    if (!parsed.SACH || !parsed.THAMSO || !parsed.PHONGHOP) {
      const seeded = createInitialDatabase();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return hydrateMissingTables(parsed);
  } catch {
    const seeded = createInitialDatabase();
    if (hasLocalStorage()) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    }
    return seeded;
  }
}

export function saveDb(db: LibraryDatabase): void {
  if (!hasLocalStorage()) {
    memoryFallbackDb = structuredClone(db);
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function resetDb(): LibraryDatabase {
  const fresh = createInitialDatabase();
  saveDb(fresh);
  return fresh;
}

export function mutateDb<T>(fn: (db: LibraryDatabase) => T): T {
  const db = loadDb();
  const result = fn(db);
  saveDb(db);
  return result;
}

export function nextPrefixedId(existingIds: string[], prefix: string, pad = 3): string {
  const maxNum = existingIds.reduce((max, id) => {
    if (!id.startsWith(prefix)) return max;
    const n = Number(id.slice(prefix.length));
    return Number.isFinite(n) && n > max ? n : max;
  }, 0);
  return `${prefix}${String(maxNum + 1).padStart(pad, '0')}`;
}

export function nextNumericId(existingIds: number[]): number {
  return existingIds.reduce((max, id) => (id > max ? id : max), 0) + 1;
}

export function appendAuditLog(
  db: LibraryDatabase,
  hanhDong: string,
  bangTacDong: string,
  chiTiet: string,
  actorOverride?: AuthUser | null
): void {
  const actor = actorOverride ?? currentActor;
  const entry: NhatKyThaoTac = {
    MaNhatKy: nextNumericId(db.NHATKYTHAOTAC.map((n) => n.MaNhatKy)),
    ThoiGian: new Date().toISOString(),
    MaTaiKhoan: actor?.MaTaiKhoan ?? null,
    TenDangNhap: actor?.TenDangNhap ?? 'khach',
    VaiTro: actor?.VaiTro ?? 'PUBLIC',
    HanhDong: hanhDong,
    BangTacDong: bangTacDong,
    ChiTiet: chiTiet,
  };
  db.NHATKYTHAOTAC.unshift(entry);
  if (db.NHATKYTHAOTAC.length > 300) {
    db.NHATKYTHAOTAC.length = 300;
  }
}

