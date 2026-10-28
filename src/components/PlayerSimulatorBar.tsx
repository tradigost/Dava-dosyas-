/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Player, EnvelopeNumber } from '../types';
import { DetectiveProfile } from '../services/firebase';

interface PlayerSimulatorBarProps {
  players: Player[];
  activePlayerId: string;
  onSelectPlayer?: (id: string) => void;
  currentEnvelope: EnvelopeNumber;
  totalEnvelopes?: number;
  unreadCountByPlayer?: Record<string, number>;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onlineRoomCode?: string | null;
  currentUser?: DetectiveProfile | null;
  onOpenOnlineModal?: () => void;
}

export const PlayerSimulatorBar: React.FC<PlayerSimulatorBarProps> = ({
  players,
  activePlayerId,
  currentEnvelope,
  totalEnvelopes = 3,
}) => {
  const activePlayer = players.find((p) => p.id === activePlayerId) || players[0];

  const roleLabels: Record<string, string> = {
    forensics: 'Adli Tıp & Kripto',
    cryptology: 'Kriptoloji',
    profiler: 'Profilleme & Sorgu',
    field: 'Saha Ajanı',
    ballistics: 'Kriminalistik',
    archive: 'Arşiv',
  };

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur border-b border-zinc-800/80 shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        
        {/* Left: Detective Name & Role */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
          <div className="truncate text-xs sm:text-sm">
            <span className="font-bold text-zinc-100">{activePlayer.name}</span>
            <span className="text-zinc-500 mx-1.5 font-mono">·</span>
            <span className="text-amber-300 font-medium text-xs">
              {roleLabels[activePlayer.role] || activePlayer.role}
            </span>
          </div>
        </div>

        {/* Right: Clean Envelope Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-lg">
            {currentEnvelope <= totalEnvelopes ? `Zarf ${currentEnvelope} / ${totalEnvelopes}` : 'Final Karar'}
          </span>
        </div>

      </div>
    </header>
  );
};
