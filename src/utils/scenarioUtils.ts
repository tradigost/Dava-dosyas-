import { CaseScenario } from '../types';

export const MAX_FIRESTORE_CASE_BYTES = 950_000;

/**
 * Recursively strips keys with `undefined` values from plain objects while
 * preserving arrays, `null`, `0`, `false`, and empty strings.
 */
export function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefined(item)) as unknown as T;
  }

  if (value !== null && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (val !== undefined) {
        result[key] = stripUndefined(val);
      }
    }
    return result as T;
  }

  return value;
}

/**
 * Estimates the UTF-8 byte size of a JSON-serializable Firestore payload.
 */
export function estimatePayloadBytes(payload: unknown): number {
  return new TextEncoder().encode(JSON.stringify(payload)).length;
}

/**
 * Returns true only when the Firebase Auth user is non-anonymous, has a verified
 * email, and matches `adminEmail` case-insensitively.
 */
export function isVerifiedAdminUser(
  firebaseUser: { email?: string | null; emailVerified?: boolean; isAnonymous?: boolean } | null | undefined,
  adminEmail: string
): boolean {
  if (!firebaseUser) return false;
  if (firebaseUser.isAnonymous) return false;
  if (firebaseUser.emailVerified !== true) return false;
  return firebaseUser.email?.toLowerCase() === adminEmail.toLowerCase();
}

/**
 * Merges built-in and custom scenarios:
 * - Excludes drafts unless `options.includeDrafts` is true (missing status defaults to published).
 * - Deduplicates by `id` (first occurrence wins for custom scenarios, replacing built-in cases in-place).
 */
export function mergeScenarios(
  builtIn: CaseScenario[],
  custom: CaseScenario[],
  options?: { includeDrafts?: boolean }
): CaseScenario[] {
  const includeDrafts = options?.includeDrafts === true;

  const filteredCustom = custom.filter((c) => {
    const effectiveStatus = c.status ?? 'published';
    return includeDrafts || effectiveStatus !== 'draft';
  });

  const customMap = new Map<string, CaseScenario>();
  for (const item of filteredCustom) {
    if (!customMap.has(item.id)) {
      customMap.set(item.id, item);
    }
  }

  const seenIds = new Set<string>();
  const merged: CaseScenario[] = [];

  for (const b of builtIn) {
    if (seenIds.has(b.id)) continue;
    seenIds.add(b.id);
    const override = customMap.get(b.id);
    merged.push(override ? override : b);
  }

  for (const [id, item] of customMap.entries()) {
    if (!seenIds.has(id)) {
      seenIds.add(id);
      merged.push(item);
    }
  }

  return merged;
}

/**
 * Triggers a reliable client-side JSON file download via Blob URL.
 */
export function downloadJsonFile(filename: string, data: unknown): void {
  const jsonText = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonText], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
