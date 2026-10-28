/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ScenarioMeta {
  id: string;
  title: string;
  minPlayers: number;
  maxPlayers: number;
}

export interface PlayerVote {
  playerId: string;
  suspectId: string;
  motive: string;
  keyEvidence: string;
}

/**
 * Checks if selected player count satisfies scenario minimum requirements
 */
export function canStartScenario(playerCount: number, scenario: ScenarioMeta): { allowed: boolean; reason?: string } {
  // Solo / Single screen mode is always allowed across all scenarios
  if (playerCount === 1) {
    return { allowed: true };
  }
  if (playerCount < scenario.minPlayers) {
    return {
      allowed: false,
      reason: `"${scenario.title}" asimetrik kurgusu gereği çok oyunculu modda en az ${scenario.minPlayers} dedektif gerektirir. (Tek cihazdan oynamak için "1 Kişi (Solo / Tek Ekran)" modunu seçebilirsiniz).`,
    };
  }
  if (playerCount > scenario.maxPlayers) {
    return {
      allowed: false,
      reason: `Bu vaka en fazla ${scenario.maxPlayers} oyuncu destekler.`,
    };
  }
  return { allowed: true };
}

/**
 * Validates envelope gate answers
 */
export function checkGateAnswer(
  envelope: number,
  selectedAnswerIndex: number,
  correctAnswerIndex: number
): boolean {
  return selectedAnswerIndex === correctAnswerIndex;
}

/**
 * Determines whether players have unanimous agreement or require debate
 */
export function evaluateVotesConsensus(votes: PlayerVote[]): {
  isUnanimous: boolean;
  majoritySuspectId: string;
  voteCounts: Record<string, number>;
} {
  if (votes.length === 0) {
    return { isUnanimous: false, majoritySuspectId: '', voteCounts: {} };
  }

  const counts: Record<string, number> = {};
  for (const v of votes) {
    counts[v.suspectId] = (counts[v.suspectId] || 0) + 1;
  }

  const firstSuspect = votes[0].suspectId;
  const isUnanimous = votes.every((v) => v.suspectId === firstSuspect);

  let majoritySuspectId = firstSuspect;
  let maxCount = -1;
  for (const [suspectId, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      majoritySuspectId = suspectId;
    }
  }

  return { isUnanimous, majoritySuspectId, voteCounts: counts };
}

export interface TableVerdict {
  isWon: boolean;
  majoritySuspectId: string;
  majorityCount: number;
  totalVotes: number;
  percentage: number;
  isUnanimous: boolean;
  voteCounts: Record<string, number>;
  correctSuspectId: string;
}

/**
 * Evaluates the collective table verdict.
 * The table wins if and only if the majority of the votes match the true culprit.
 */
export function evaluateTableVerdict(
  votes: { suspectId: string }[],
  correctSuspectId: string
): TableVerdict {
  if (votes.length === 0) {
    return {
      isWon: false,
      majoritySuspectId: '',
      majorityCount: 0,
      totalVotes: 0,
      percentage: 0,
      isUnanimous: false,
      voteCounts: {},
      correctSuspectId,
    };
  }

  const counts: Record<string, number> = {};
  for (const v of votes) {
    counts[v.suspectId] = (counts[v.suspectId] || 0) + 1;
  }

  let majoritySuspectId = votes[0].suspectId;
  let maxCount = -1;
  for (const [suspectId, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      majoritySuspectId = suspectId;
    }
  }

  const isWon = majoritySuspectId === correctSuspectId;
  const isUnanimous = votes.every((v) => v.suspectId === majoritySuspectId);
  const percentage = Math.round((maxCount / votes.length) * 100);

  return {
    isWon,
    majoritySuspectId,
    majorityCount: maxCount,
    totalVotes: votes.length,
    percentage,
    isUnanimous,
    voteCounts: counts,
    correctSuspectId,
  };
}

/**
 * Calculates final individual score and detective rank
 */
export function calculateDetectiveScore(params: {
  correctSuspectSelected: boolean;
  correctMotiveSelected: boolean;
  correctEvidenceSelected: boolean;
  quizCorrectCount?: number;
  quizTotalCount?: number;
  gateAttempts?: number;
}): {
  totalScore: number;
  maxScore: number;
  rankTitle: string;
  badge: string;
  quizScore: number;
  suspectScore: number;
  motiveScore: number;
  evidenceScore: number;
  bonusScore: number;
} {
  const maxScore = 100;

  // 1. Quiz / Exam Score (up to 40 pts)
  let quizScore = 0;
  if (params.quizTotalCount && params.quizTotalCount > 0) {
    const correctRatio = (params.quizCorrectCount || 0) / params.quizTotalCount;
    quizScore = Math.round(correctRatio * 40);
  } else {
    // If no quiz questions, grant base points
    quizScore = 30;
  }

  // 2. Individual Suspect accuracy (30 pts)
  const suspectScore = params.correctSuspectSelected ? 30 : 0;

  // 3. Motive accuracy (15 pts)
  const motiveScore = params.correctMotiveSelected ? 15 : 0;

  // 4. Evidence accuracy (15 pts)
  const evidenceScore = params.correctEvidenceSelected ? 15 : 0;

  const bonusScore = 0;
  const totalScore = Math.min(100, quizScore + suspectScore + motiveScore + evidenceScore);

  let rankTitle = 'Stajyer Dedektif';
  let badge = '🔍';
  if (totalScore >= 90) {
    rankTitle = 'Efsanevi Başmüfettiş (Sherlock Derecesi)';
    badge = '🏆';
  } else if (totalScore >= 75) {
    rankTitle = 'Kıdemli Cinayet Masası Dedektifi';
    badge = '⭐';
  } else if (totalScore >= 55) {
    rankTitle = 'Adli Vaka Araştırmacısı';
    badge = '📁';
  }

  return {
    totalScore,
    maxScore,
    rankTitle,
    badge,
    quizScore,
    suspectScore,
    motiveScore,
    evidenceScore,
    bonusScore,
  };
}
