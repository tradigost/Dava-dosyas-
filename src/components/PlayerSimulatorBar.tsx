/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Player, EnvelopeNumber } from '../types';
import { soundManager } from '../utils/audioEffects';
import { Pin } from 'lucide-react';
import { DetectiveProfile } from '../services/firebase';

interface PlayerSimulatorBarProps {
  players: Player[];
  activePlayerId: string;
  onSelectPlayer: (id: string) => void;
  isBoardViewOpen: boolean;
  onToggleBoardView: () => void;
  currentEnvelope: EnvelopeNumber;
  pinnedCount: number;
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
  isBoardViewOpen,
  onToggleBoardView,
  currentEnvelope,
  pinnedCount,
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

        {/* Right: Clean Envelope Indicator & Common Board Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-mono text-zinc-400">
            {currentEnvelope <= 3 ? `Zarf ${currentEnvelope} / 3` : 'Final Karar'}
          </span>

          <button
            type="button"
            onClick={() => {
              soundManager.playPinSound();
              onToggleBoardView();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              isBoardViewOpen
                ? 'bg-amber-500/20 text-amber-200 border-amber-500/60 shadow-sm'
                : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-amber-300 hover:border-zinc-700'
            }`}
          >
            <Pin className="w-3.5 h-3.5 text-amber-400" />
            <span>Ortak Pano</span>
            {pinnedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-300 text-[10px] font-mono">
                {pinnedCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
