/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CaseScenario } from '../types';

const DLC_CACHE_NAME = 'masadaki-dosya-dlc-v1';
const DOWNLOADED_INDEX_KEY = 'masadaki_dosya_downloaded_cases_v1';

export function getCaseMediaUrls(scenario: CaseScenario): string[] {
  const urls = new Set<string>();
  for (const s of scenario.suspects || []) {
    if (s.photoUrl) urls.add(s.photoUrl);
  }
  for (const ev of scenario.evidence || []) {
    if (ev.mediaUrl) urls.add(ev.mediaUrl);
    if (ev.narrationUrl) urls.add(ev.narrationUrl);
  }
  return Array.from(urls);
}

export function getDownloadedCaseIds(): string[] {
  try {
    const raw = localStorage.getItem(DOWNLOADED_INDEX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function isCaseDownloaded(scenarioId: string): boolean {
  return getDownloadedCaseIds().includes(scenarioId);
}

/**
 * Downloads a dynamic case's images and audio files into CacheStorage so new cases
 * added from Firestore can be played offline without updating the Play Store / App Store binary.
 */
export async function downloadCasePack(
  scenario: CaseScenario,
  onProgress?: (percent: number) => void
): Promise<{ ok: boolean; cachedCount: number; totalCount: number }> {
  const urls = getCaseMediaUrls(scenario);
  let cachedCount = 0;

  if (typeof caches !== 'undefined' && urls.length > 0) {
    const cache = await caches.open(DLC_CACHE_NAME);
    for (let i = 0; i < urls.length; i++) {
      try {
        const res = await fetch(urls[i], { mode: 'cors' });
        if (res.ok) {
          await cache.put(urls[i], res.clone());
          cachedCount++;
        }
      } catch {
        // Continue caching remaining assets even if one external URL blocks CORS
      }
      if (onProgress) {
        onProgress(Math.round(((i + 1) / urls.length) * 100));
      }
    }
  } else if (onProgress) {
    onProgress(100);
  }

  const current = new Set(getDownloadedCaseIds());
  current.add(scenario.id);
  try {
    localStorage.setItem(DOWNLOADED_INDEX_KEY, JSON.stringify(Array.from(current)));
  } catch {
    // ignore
  }

  return { ok: true, cachedCount, totalCount: urls.length };
}
