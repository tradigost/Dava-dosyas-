import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canStartScenario,
  checkGateAnswer,
  evaluateVotesConsensus,
  calculateDetectiveScore,
  ScenarioMeta
} from './gameRules';

test('canStartScenario enforces minimum player count constraint', () => {
  const strictMeta: ScenarioMeta = {
    id: 'strict-case',
    title: '3 Kişilik Vaka',
    minPlayers: 3,
    maxPlayers: 6
  };

  const check2 = canStartScenario(2, strictMeta);
  assert.equal(check2.allowed, false);
  assert.match(check2.reason || '', /en az 3 dedektif/);

  const check3 = canStartScenario(3, strictMeta);
  assert.equal(check3.allowed, true);

  const twoPlayerCase: ScenarioMeta = {
    id: 'son-kadeh',
    title: 'Son Kadeh: Müzayede Cinayeti',
    minPlayers: 2,
    maxPlayers: 6
  };
  const checkTwoPlayerCase = canStartScenario(2, twoPlayerCase);
  assert.equal(checkTwoPlayerCase.allowed, true);
});

test('checkGateAnswer verifies correct options', () => {
  assert.equal(checkGateAnswer(1, 2, 2), true);
  assert.equal(checkGateAnswer(1, 1, 2), false);
});

test('evaluateVotesConsensus detects unanimous vs dispute states', () => {
  const unanimousVotes = [
    { playerId: 'p1', suspectId: 'dr-kerem', motive: 'zimmet', keyEvidence: 'kapsul' },
    { playerId: 'p2', suspectId: 'dr-kerem', motive: 'zimmet', keyEvidence: 'kapsul' },
    { playerId: 'p3', suspectId: 'dr-kerem', motive: 'zimmet', keyEvidence: 'kapsul' },
  ];
  const uRes = evaluateVotesConsensus(unanimousVotes);
  assert.equal(uRes.isUnanimous, true);
  assert.equal(uRes.majoritySuspectId, 'dr-kerem');

  const splitVotes = [
    { playerId: 'p1', suspectId: 'dr-kerem', motive: 'zimmet', keyEvidence: 'kapsul' },
    { playerId: 'p2', suspectId: 'cemil-vural', motive: 'borc', keyEvidence: 'viski' },
    { playerId: 'p3', suspectId: 'dr-kerem', motive: 'zimmet', keyEvidence: 'kapsul' },
  ];
  const sRes = evaluateVotesConsensus(splitVotes);
  assert.equal(sRes.isUnanimous, false);
  assert.equal(sRes.majoritySuspectId, 'dr-kerem');
  assert.equal(sRes.voteCounts['dr-kerem'], 2);
  assert.equal(sRes.voteCounts['cemil-vural'], 1);
});

test('calculateDetectiveScore computes high tier for accurate deduction', () => {
  const perfect = calculateDetectiveScore({
    correctSuspectSelected: true,
    correctMotiveSelected: true,
    correctEvidenceSelected: true,
    pinnedCount: 5,
    gateAttempts: 3
  });
  assert.equal(perfect.totalScore, 100);
  assert.equal(perfect.rankTitle, 'Efsanevi Başmüfettiş (Sherlock Derecesi)');

  const moderate = calculateDetectiveScore({
    correctSuspectSelected: true,
    correctMotiveSelected: false,
    correctEvidenceSelected: true,
    pinnedCount: 2,
    gateAttempts: 4
  });
  assert.equal(moderate.totalScore, 69);
  assert.equal(moderate.rankTitle, 'Adli Vaka Araştırmacısı');
});
