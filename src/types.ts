/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RoleType = 
  | 'forensics' 
  | 'cryptology' 
  | 'profiler' 
  | 'field' 
  | 'ballistics' 
  | 'archive';

export interface RoleInfo {
  type: RoleType;
  title: string;
  badge: string;
  color: string;
  shortDesc: string;
  iconName: string;
}

export interface Player {
  id: string;
  name: string;
  role: RoleType;
  avatar: string;
  isHost?: boolean;
}

export type EnvelopeNumber = number;

export interface EvidenceItem {
  id: string;
  envelope: EnvelopeNumber;
  title: string;
  category: 'autopsy' | 'toxicology' | 'cipher' | 'audio' | 'interrogation' | 'document' | 'gps' | 'banking' | string;
  roleAccess: RoleType[];
  summary: string;
  fullReport: string;
  keyDeduction: string;
  mediaType?: 'text' | 'image' | 'audio' | 'video';
  mediaUrl?: string;
  mediaCaption?: string;
  hasInteractiveTool?: 'toxicology' | 'terminal' | 'profiler-highlighter' | 'gps-map';
  interactiveToolTitle?: string;
  interactiveToolSubtitle?: string;
  metadata?: {
    date: string;
    caseRef: string;
    confidentiality: 'GİZLİ' | 'ÇOK GİZLİ' | 'ADLİ TIP RAPORU' | 'TEKNİK DEŞİFRE' | string;
  };
}

export interface Suspect {
  id: string;
  name: string;
  title: string;
  age: number;
  relation: string;
  description: string;
  alibi: string;
  suspiciousQuotes: string[];
  motiveHypothesis?: string;
  initialSuspicion: number; // 0-100
  photoPlaceholder?: {
    initials: string;
    tint: string;
    silhouetteStyle: string;
  };
  isCulprit?: boolean;
}

export interface GateQuestion {
  envelope: number;
  title?: string;
  instructions?: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  hintByRole?: Partial<Record<RoleType, string>>;
}

export interface SharedPin {
  id: string;
  evidenceId: string;
  title: string;
  excerpt: string;
  category: string;
  pinnedByPlayerName: string;
  pinnedByRole: RoleType;
  envelope: EnvelopeNumber;
  timestamp: string;
  notes?: string;
}

export interface AccusationSubmission {
  playerId: string;
  playerName: string;
  role: RoleType;
  suspectId: string;
  motiveId: string;
  evidenceId: string;
  statementNotes: string;
  submittedAt: string;
}

export interface CaseSolution {
  culpritId: string;
  culpritName: string;
  motiveTitle: string;
  keyEvidenceTitle: string;
  fullChronology?: {
    time: string;
    action: string;
    proof: string;
  }[];
  verdictSummary: string;
  confessionAudioTranscript?: string;
}

export interface CaseScenario {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor' | 'Uzman' | string;
  estimatedMinutes: number;
  minPlayers: number;
  maxPlayers: number;
  bannerTag?: string;
  synopsis: string;
  victim: {
    name: string;
    age: number;
    title: string;
    timeOfDeath: string;
    locationOfBody: string;
    causeInitial: string;
  };
  totalEnvelopes?: number;
  suspects: Suspect[];
  evidence: EvidenceItem[];
  gates: Record<number, GateQuestion>;
  solution: CaseSolution;
}

export function getScenarioTotalEnvelopes(scenario: CaseScenario): number {
  if (scenario.totalEnvelopes && scenario.totalEnvelopes > 0) {
    return scenario.totalEnvelopes;
  }
  const envFromEvidence = scenario.evidence?.length
    ? Math.max(...scenario.evidence.map((e) => Number(e.envelope) || 1))
    : 1;
  const envFromGates = scenario.gates
    ? Math.max(...Object.keys(scenario.gates).map(Number))
    : 1;
  return Math.max(envFromEvidence, envFromGates, 1);
}

export type GameView = 
  | 'LOBBY' 
  | 'BRIEFING'
  | 'CASE_OVERVIEW' 
  | 'ENVELOPE_ACTIVE' 
  | 'BOARD_VIEW' 
  | 'GATE_CHECK' 
  | 'ACCUSATION' 
  | 'DEBATE_TIMER' 
  | 'FINAL_VERDICT';
