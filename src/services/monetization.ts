/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CaseScenario } from '../types';

const PURCHASED_STORAGE_KEY = 'masadaki_dosya_purchased_cases_v1';

/**
 * Built-in 5 free cases are always free and show interstitial/rewarded ads between envelopes.
 * Paid cases (isPaid: true) require purchase (by player or online room host) and have NO ads.
 */
export function isPaidScenario(scenario: CaseScenario): boolean {
  return scenario.isPaid === true;
}

export function shouldShowEnvelopeAd(
  scenario: CaseScenario,
  options?: { isProPass?: boolean }
): boolean {
  if (options?.isProPass) return false;
  if (isPaidScenario(scenario)) return false;
  return true;
}

export function hasCaseAccess(
  scenario: CaseScenario,
  purchasedCaseIds: string[],
  hostUnlockedCaseId?: string | null
): boolean {
  if (!isPaidScenario(scenario)) return true;
  if (hostUnlockedCaseId && hostUnlockedCaseId === scenario.id) return true;
  if (purchasedCaseIds.includes(scenario.id)) return true;
  if (scenario.storeProductId && purchasedCaseIds.includes(scenario.storeProductId)) return true;
  return false;
}

export function loadLocalPurchasedCases(): string[] {
  try {
    const raw = localStorage.getItem(PURCHASED_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function saveLocalPurchasedCase(caseIdOrSku: string): string[] {
  const current = new Set(loadLocalPurchasedCases());
  current.add(caseIdOrSku);
  const arr = Array.from(current);
  try {
    localStorage.setItem(PURCHASED_STORAGE_KEY, JSON.stringify(arr));
  } catch {
    // ignore storage quota errors
  }
  return arr;
}

/**
 * Bridge hook for native Capacitor Billing / RevenueCat (Play Store & App Store).
 * On web, returns a clean preview/purchase state until native billing plugin is linked.
 */
export async function triggerCasePurchase(scenario: CaseScenario): Promise<{
  success: boolean;
  message: string;
}> {
  const win = typeof window !== 'undefined' ? (window as any) : null;
  if (win?.Capacitor?.isNativePlatform?.() && win?.Purchases?.purchaseProduct) {
    try {
      const sku = scenario.storeProductId || `case_${scenario.id}`;
      await win.Purchases.purchaseProduct(sku);
      saveLocalPurchasedCase(scenario.id);
      return { success: true, message: 'Vaka paketi başarıyla satın alındı.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Satın alma iptal edildi.' };
    }
  }
  return {
    success: false,
    message:
      'Bu ücretli vaka Google Play / App Store uygulama içi satın alma (IAP) ile açılır. Mobil mağaza paketi bağlandığında tek tıkla satın alınabilir.',
  };
}
