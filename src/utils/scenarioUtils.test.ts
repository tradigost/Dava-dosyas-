import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CaseScenario } from '../types';
import {
  mergeScenarios,
  stripUndefined,
  estimatePayloadBytes,
  isVerifiedAdminUser,
} from './scenarioUtils';

function makeScenario(overrides: Partial<CaseScenario> = {}): CaseScenario {
  return {
    id: 'base-case',
    title: 'Baz Vaka',
    subtitle: 'Alt Başlık',
    difficulty: 'Orta',
    estimatedMinutes: 30,
    minPlayers: 1,
    maxPlayers: 6,
    synopsis: 'Özet',
    victim: {
      name: 'Maktul',
      age: 40,
      title: 'Unvan',
      timeOfDeath: '23:00',
      locationOfBody: 'Oda',
      causeInitial: 'Zehir',
    },
    suspects: [
      {
        id: 's1',
        name: 'Şüpheli 1',
        title: 'Tanık',
        age: 30,
        relation: 'Tanıdık',
        description: 'Açıklama',
        alibi: 'Evde',
        suspiciousQuotes: ['Masumum'],
        initialSuspicion: 50,
      },
      {
        id: 's2',
        name: 'Şüpheli 2',
        title: 'Ortak',
        age: 35,
        relation: 'Ortak',
        description: 'Açıklama 2',
        alibi: 'Ofiste',
        suspiciousQuotes: ['Bilmiyorum'],
        initialSuspicion: 50,
      },
    ],
    evidence: [
      {
        id: 'e1',
        envelope: 1,
        title: 'Delil 1',
        category: 'document',
        roleAccess: ['forensics'],
        summary: 'Özet',
        fullReport: 'Rapor',
        keyDeduction: 'Çıkarım',
      },
    ],
    gates: {},
    solution: {
      culpritId: 's1',
      culpritName: 'Şüpheli 1',
      motiveTitle: 'Çıkar',
      keyEvidenceTitle: 'Delil 1',
      verdictSummary: 'Çözüm',
    },
    ...overrides,
  };
}

test('mergeScenarios excludes drafts by default and deduplicates by id', () => {
  const builtIn1 = makeScenario({ id: 'vaka-1', title: 'Yerleşik 1' });
  const builtIn2 = makeScenario({ id: 'vaka-2', title: 'Yerleşik 2' });

  const customOverride = makeScenario({ id: 'vaka-1', title: 'Güncel 1', status: 'published' });
  const customDraft = makeScenario({ id: 'vaka-draft', title: 'Taslak Vaka', status: 'draft' });
  const customPublished = makeScenario({ id: 'vaka-custom', title: 'Özel Vaka' }); // missing status => published
  const customDuplicate = makeScenario({ id: 'vaka-custom', title: 'Kopya Özel Vaka' });

  const lobbyList = mergeScenarios(
    [builtIn1, builtIn2],
    [customOverride, customDraft, customPublished, customDuplicate],
    { includeDrafts: false }
  );

  assert.deepEqual(
    lobbyList.map((s) => ({ id: s.id, title: s.title })),
    [
      { id: 'vaka-1', title: 'Güncel 1' },
      { id: 'vaka-2', title: 'Yerleşik 2' },
      { id: 'vaka-custom', title: 'Özel Vaka' },
    ]
  );

  const adminList = mergeScenarios(
    [builtIn1, builtIn2],
    [customOverride, customDraft, customPublished],
    { includeDrafts: true }
  );
  assert.equal(adminList.some((s) => s.id === 'vaka-draft'), true);
});

test('stripUndefined removes nested undefined keys while preserving arrays and falsy values', () => {
  const input = {
    a: 0,
    b: false,
    c: '',
    d: null,
    u: undefined,
    arr: [{ x: 1, y: undefined }, { z: '' }],
    nested: { keep: 'ok', drop: undefined },
  };

  const cleaned = stripUndefined(input);
  assert.equal('u' in cleaned, false);
  assert.equal(cleaned.a, 0);
  assert.equal(cleaned.b, false);
  assert.equal(cleaned.c, '');
  assert.equal(cleaned.d, null);
  assert.equal('y' in cleaned.arr[0], false);
  assert.equal(cleaned.arr[0].x, 1);
  assert.equal(cleaned.arr[1].z, '');
  assert.equal('drop' in cleaned.nested, false);
  assert.equal(cleaned.nested.keep, 'ok');
});

test('estimatePayloadBytes calculates accurate UTF-8 byte length', () => {
  const asciiBytes = estimatePayloadBytes({ a: 'abc' }); // '{"a":"abc"}' => 11 bytes
  assert.equal(asciiBytes, 11);

  const utf8Bytes = estimatePayloadBytes({ t: 'ğüşıöç' }); // 6 two-byte chars (12) + 8 wrapper bytes = 20
  assert.equal(utf8Bytes, 20);
});

test('isVerifiedAdminUser allows only non-anonymous verified admin email', () => {
  const admin = 'altayyigitozan@gmail.com';

  assert.equal(isVerifiedAdminUser(null, admin), false);
  assert.equal(isVerifiedAdminUser(undefined, admin), false);
  assert.equal(isVerifiedAdminUser({ email: admin, emailVerified: true, isAnonymous: true }, admin), false);
  assert.equal(isVerifiedAdminUser({ email: admin, emailVerified: false, isAnonymous: false }, admin), false);
  assert.equal(isVerifiedAdminUser({ email: 'other@gmail.com', emailVerified: true, isAnonymous: false }, admin), false);
  assert.equal(
    isVerifiedAdminUser({ email: 'AltayYigitOzan@gmail.com', emailVerified: true, isAnonymous: false }, admin),
    true
  );
});
