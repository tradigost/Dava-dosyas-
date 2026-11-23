/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { CaseScenario } from '../types';
import { shouldShowEnvelopeAd, hasCaseAccess, isPaidScenario } from '../services/monetization';

const baseScenario = {
  id: 'test-case',
  title: 'Test Davası',
  subtitle: 'Test',
  difficulty: 'Orta',
  estimatedMinutes: 30,
  minPlayers: 1,
  maxPlayers: 6,
  synopsis: 'Test',
  victim: {
    name: 'Maktul',
    age: 45,
    title: 'Test',
    timeOfDeath: '23:00',
    locationOfBody: 'Oda',
    causeInitial: 'Bilinmiyor',
  },
  suspects: [],
  evidence: [],
  gates: {},
  solution: {
    culpritId: 's1',
    culpritName: 'Fail',
    motiveTitle: 'Motiv',
    keyEvidenceTitle: 'Delil',
    verdictSummary: 'Özet',
  },
} as CaseScenario;

test('shouldShowEnvelopeAd requires ad on free cases and skips on paid or Pro Pass', () => {
  const freeCase: CaseScenario = { ...baseScenario, isPaid: false };
  const paidCase: CaseScenario = { ...baseScenario, isPaid: true, priceLabel: '49,90 TL' };

  assert.equal(isPaidScenario(freeCase), false);
  assert.equal(isPaidScenario(paidCase), true);
  assert.equal(shouldShowEnvelopeAd(freeCase), true);
  assert.equal(shouldShowEnvelopeAd(paidCase), false);
  assert.equal(shouldShowEnvelopeAd(freeCase, { isProPass: true }), false);
});

test('hasCaseAccess enforces paid lock unless purchased locally or unlocked by host', () => {
  const freeCase: CaseScenario = { ...baseScenario, id: 'free-1', isPaid: false };
  const paidCase: CaseScenario = {
    ...baseScenario,
    id: 'paid-1',
    isPaid: true,
    storeProductId: 'sku_paid_1',
  };

  assert.equal(hasCaseAccess(freeCase, []), true);
  assert.equal(hasCaseAccess(paidCase, []), false);
  assert.equal(hasCaseAccess(paidCase, ['paid-1']), true);
  assert.equal(hasCaseAccess(paidCase, ['sku_paid_1']), true);
  assert.equal(hasCaseAccess(paidCase, [], 'paid-1'), true);
});
