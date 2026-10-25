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
  if (playerCount < scenario.minPlayers) {
    return {
      allowed: false,
      reason: `"${scenario.title}" hikayesi gereği en az ${scenario.minPlayers} dedektif (farklı uzmanlıklar) gerektirir. Masa mevcudunuz: ${playerCount}.`,
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

/**
 * Calculates final score and detective rank
 */
export function calculateDetectiveScore(params: {
  correctSuspectSelected: boolean;
  correctMotiveSelected: boolean;
  correctEvidenceSelected: boolean;
  pinnedCount: number;
  gateAttempts: number; // 1 for first try, 2+ for retries
}): { totalScore: number; maxScore: number; rankTitle: string; badge: string } {
  let score = 0;
  const maxScore = 100;

  // Suspect accuracy (40 pts)
  if (params.correctSuspectSelected) score += 40;

  // Motive accuracy (20 pts)
  if (params.correctMotiveSelected) score += 20;

  // Evidence accuracy (20 pts)
  if (params.correctEvidenceSelected) score += 20;

  // Collaboration pinning effort (up to 10 pts)
  const pinBonus = Math.min(params.pinnedCount * 2, 10);
  score += pinBonus;

  // Deduction efficiency (up to 10 pts)
  if (params.gateAttempts <= 3) {
    score += 10;
  } else if (params.gateAttempts <= 5) {
    score += 5;
  }

  let rankTitle = 'Stajyer Dedektif';
  let badge = '🔍';
  if (score >= 90) {
    rankTitle = 'Efsanevi Başmüfettiş (Sherlock Derecesi)';
    badge = '🏆';
  } else if (score >= 75) {
    rankTitle = 'Kıdemli Cinayet Masası Dedektifi';
    badge = '⭐';
  } else if (score >= 55) {
    rankTitle = 'Adli Vaka Araştırmacısı';
    badge = '📁';
  }

  return { totalScore: score, maxScore, rankTitle, badge };
}
