// Database helpers — works with both PostgreSQL (native arrays/JSON) and SQLite (stringified)
// On SQLite: arrays → stringified JSON
// On PostgreSQL: arrays → native (already arrays)
// Functions auto-detect via DATABASE_URL.

export const IS_SQLITE = typeof process !== 'undefined' &&
  (process.env.DATABASE_URL || '').startsWith('file:');

export function parseStringArray(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function stringifyStringArray(value: string[] | string | null | undefined): any {
  // SQLite: returns string (JSON-encoded)
  // PostgreSQL: returns array as-is
  if (value === null || value === undefined) return IS_SQLITE ? '[]' : [];
  if (Array.isArray(value)) return IS_SQLITE ? JSON.stringify(value) : value;
  return IS_SQLITE ? value : (() => { try { return JSON.parse(value); } catch { return []; } })();
}

export function parseJson<T = any>(value: any, fallback: T | null = null): T | null {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'object') return value as T;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

export function stringifyJson(value: any): any {
  if (value === null || value === undefined) return null;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function ensureArray<T>(value: T | T[] | null | undefined): T[] {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) return value;
  return [value];
}