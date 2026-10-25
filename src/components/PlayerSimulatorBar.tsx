/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Player, EnvelopeNumber } from '../types';
import { soundManager } from '../utils/audioEffects';
import { Smartphone, Pin, Volume2, VolumeX, MessageCircle, ShieldCheck, Users } from 'lucide-react';
import { DetectiveProfile } from '../services/firebase';

interface PlayerSimulatorBarProps {
  players: Player[];
  activePlayerId: string;
  onSelectPlayer: (id: string) => void;
  isBoardViewOpen: boolean;
  onToggleBoardView: () => void;
  currentEnvelope: EnvelopeNumber;
  pinnedCount: number;
  unreadCountByPlayer: Record<string, number>;
  isMuted: boolean;
  onToggleMute: () => void;
  onlineRoomCode?: string | null;
  currentUser?: DetectiveProfile | null;
  onOpenOnlineModal: () => void;
}

export const PlayerSimulatorBar: React.FC<PlayerSimulatorBarProps> = ({
  players,
  activePlayerId,
  onSelectPlayer,
  isBoardViewOpen,
  onToggleBoardView,
  currentEnvelope,
  pinnedCount,
  unreadCountByPlayer,
  isMuted,
  onToggleMute,
  onlineRoomCode,
  currentUser,
  onOpenOnlineModal,
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
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur border-b border-zinc-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left: App Title and Simulator/Online Tag */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-cinzel text-sm sm:text-base font-bold text-amber-300 whitespace-nowrap">
            Masadaki Dosya
          </span>
          {onlineRoomCode ? (
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded flex items-center gap-1">
              <span>●</span> {onlineRoomCode}
            </span>
          ) : (
            <span className="hidden md:inline text-[11px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
              Masa Simülatörü
            </span>
          )}
        </div>

        {/* Center: When in ONLINE ROOM, lock to active player's own device badge!
            When in OFFLINE mode, show device simulator switcher buttons */}
        {onlineRoomCode ? (
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-950/30 border border-amber-600/40 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-left leading-tight">
              <span className="text-[10px] text-zinc-400 block font-mono uppercase tracking-wider">
                Dedektif Telefonunuz:
              </span>
              <span className="text-xs font-bold text-amber-200">
                {activePlayer.name} ({roleLabels[activePlayer.role] || activePlayer.role})
              </span>
            </div>
          </div>
        ) : (
          <nav aria-label="Oyuncu Telefon Seçici" className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none max-w-full">
            {players.map((player, idx) => {
              const isActive = !isBoardViewOpen && activePlayerId === player.id;
              const unread = unreadCountByPlayer[player.id] || 0;

              return (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => {
                    soundManager.playKeyClick();
                    onSelectPlayer(player.id);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all border ${
                    isActive
                      ? 'bg-amber-600 text-zinc-950 border-amber-400 font-bold shadow-md ring-1 ring-amber-400/50'
                      : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-zinc-100'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Oyuncu {idx + 1}: {roleLabels[player.role] || player.role}
                  </span>

                  {unread > 0 && !isActive && (
                    <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {unread}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Right: Board Toggle, Online Room & Utilities */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Online Room / WhatsApp Modal Trigger */}
          <button
            type="button"
            onClick={onOpenOnlineModal}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
              onlineRoomCode
                ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300'
                : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-emerald-400 hover:border-emerald-600'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400 fill-current" />
            <span className="hidden sm:inline">
              {onlineRoomCode ? `Masa (${onlineRoomCode})` : 'WhatsApp / Çoklu Cihaz'}
            </span>
            <span className="sm:hidden">
              {onlineRoomCode ? onlineRoomCode : 'Masa'}
            </span>
          </button>

          {/* Shared Board Toggle */}
          <button
            type="button"
            onClick={() => {
              soundManager.playPinSound();
              onToggleBoardView();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
              isBoardViewOpen
                ? 'bg-amber-500/20 text-amber-200 border-amber-500/60 shadow-sm'
                : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-amber-300 hover:border-zinc-700'
            }`}
          >
            <Pin className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Ortak Dava Panosu</span>
            <span className="sm:hidden">Pano</span>
            {pinnedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-300 text-[10px] font-mono">
                {pinnedCount}
              </span>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
            title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            aria-label={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>

      </div>
    </header>
  );
};
