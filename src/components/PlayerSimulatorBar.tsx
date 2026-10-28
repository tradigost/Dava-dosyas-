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
  unlockedEnvelope?: number;
  totalEnvelopes?: number;
  onSelectEnvelope?: (envNum: number) => void;
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
  unlockedEnvelope,
  totalEnvelopes = 3,
  onSelectEnvelope,
}) => {
  const activePlayer = players.find((p) => p.id === activePlayerId) || players[0];
  const maxUnlocked = unlockedEnvelope !== undefined ? unlockedEnvelope : currentEnvelope;

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
      <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        
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

        {/* Right: Envelope Switcher & History Navigation Chips */}
        <div className="flex items-center gap-1.5 shrink-0">
          {Array.from({ length: totalEnvelopes }).map((_, idx) => {
            const envNum = idx + 1;
            const isUnlocked = envNum <= maxUnlocked;
            const isViewing = envNum === currentEnvelope;

            return (
              <button
                key={envNum}
                type="button"
                disabled={!isUnlocked}
                onClick={() => {
                  if (isUnlocked && onSelectEnvelope) {
                    onSelectEnvelope(envNum);
                  }
                }}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-mono font-bold transition-all border ${
                  isViewing
                    ? 'bg-amber-600 text-zinc-950 border-amber-400 shadow ring-1 ring-amber-400/40 cursor-default'
                    : isUnlocked
                    ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-amber-500 hover:text-amber-300 cursor-pointer active:scale-95'
                    : 'bg-zinc-950/60 border-zinc-900 text-zinc-600 cursor-not-allowed opacity-50'
                }`}
                title={
                  isViewing
                    ? `Zarf ${envNum} (Şu an inceleniyor)`
                    : isUnlocked
                    ? `Zarf ${envNum} Dosyalarına Dön`
                    : `Zarf ${envNum} Kilitli`
                }
              >
                <span>Z{envNum}</span>
                {!isUnlocked && <span className="ml-0.5 text-[9px]">🔒</span>}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
