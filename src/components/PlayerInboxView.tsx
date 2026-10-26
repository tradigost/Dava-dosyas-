/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Player, EvidenceItem, EnvelopeNumber, Suspect } from '../types';
import { soundManager } from '../utils/audioEffects';
import { 
  FileText, 
  Pin, 
  KeyRound, 
  ShieldAlert, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface PlayerInboxViewProps {
  player: Player;
  allPlayers?: Player[];
  totalPlayers?: number;
  currentEnvelope: EnvelopeNumber;
  evidenceList: EvidenceItem[];
  suspects?: Suspect[];
  pinnedEvidenceIds: Set<string>;
  onPinEvidence: (title: string, excerpt: string, category: string, evidenceId?: string) => void;
  onOpenGateModal: () => void;
  onGoToAccusation: () => void;
  nextInspector?: Player | null;
  onPassTurn?: () => void;
  isEnvelopeCompleted?: boolean;
}

export const PlayerInboxView: React.FC<PlayerInboxViewProps> = ({
  player,
  allPlayers = [],
  totalPlayers = 2,
  currentEnvelope,
  evidenceList,
  pinnedEvidenceIds,
  onPinEvidence,
  onOpenGateModal,
  onGoToAccusation,
  nextInspector,
  onPassTurn,
  isEnvelopeCompleted = false,
}) => {
  const isSoloMode = totalPlayers === 1 || allPlayers.length === 1;
  const isTwoPlayerMode = !isSoloMode && (totalPlayers === 2 || allPlayers.length === 2);

  // Filter evidence accessible to this player in this envelope
  const myEvidence = evidenceList.filter((ev) => {
    if (ev.envelope !== currentEnvelope) return false;
    // In solo mode, the single player or shared single screen has access to ALL evidence
    if (isSoloMode) return true;
    if (isTwoPlayerMode) {
      if (player.role === 'forensics') {
        return ev.roleAccess.includes('forensics') || ev.roleAccess.includes('cryptology');
      }
      if (player.role === 'profiler') {
        const isLabFile = ev.roleAccess.includes('forensics') || ev.roleAccess.includes('cryptology');
        return !isLabFile;
      }
    }
    return ev.roleAccess.includes(player.role);
  });

  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(
    myEvidence.length > 0 ? myEvidence[0].id : null
  );

  // Sync selected evidence when envelope or player changes
  useEffect(() => {
    if (myEvidence.length > 0) {
      setSelectedEvidenceId(myEvidence[0].id);
    } else {
      setSelectedEvidenceId(null);
    }
  }, [currentEnvelope, player.id]);

  const activeEvidence = myEvidence.find((ev) => ev.id === selectedEvidenceId) || myEvidence[0];

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-10">
      
      {/* File switcher if player holds multiple files in this envelope */}
      {myEvidence.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {myEvidence.map((ev, idx) => {
            const isSelected = activeEvidence?.id === ev.id;
            const isPinned = pinnedEvidenceIds.has(ev.id);
            return (
              <button
                key={ev.id}
                type="button"
                onClick={() => {
                  soundManager.playKeyClick();
                  setSelectedEvidenceId(ev.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-zinc-950 border-amber-400 font-bold shadow-md'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Dosya {idx + 1}: {ev.title}</span>
                {isPinned && <Pin className="w-3 h-3 text-zinc-950 fill-current" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Dossier Paper */}
      {myEvidence.length === 0 ? (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-400 text-xs">
          <ShieldAlert className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <p className="font-semibold text-zinc-300">Bu zarfta doğrudan uzmanlığınıza ait yeni dosya bulunmuyor.</p>
          <p className="mt-1 text-zinc-500">
            Masadaki arkadaşınızın paylaştığı bilgileri dinleyerek ortak dava panosuna odaklanın.
          </p>
        </div>
      ) : activeEvidence ? (
        <div className="bg-zinc-900/90 rounded-2xl p-5 sm:p-6 shadow-xl relative text-zinc-200 border border-zinc-800 space-y-4">
          
          {/* Top Stamp & Case Reference */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest">
              T.C. ADLİ TAHKİKAT VE SUÇ DOSYASI · {activeEvidence.metadata?.caseRef || 'ATK-2026'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-rose-500/40 bg-rose-950/30 text-rose-300 font-bold">
              {activeEvidence.metadata?.confidentiality || 'GİZLİ'}
            </span>
          </div>

          {/* Dossier Title */}
          <h3 className="text-base sm:text-lg font-bold text-zinc-100">
            {activeEvidence.title}
          </h3>

          {/* Summary Box */}
          <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800/80">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
              ÖZET BULGU:
            </span>
            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans">
              {activeEvidence.summary}
            </p>
          </div>

          {/* Official Report Text */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1.5">
              RESMİ RAPOR METNİ:
            </span>
            <div className="p-4 bg-zinc-950/70 border border-zinc-800/80 rounded-xl text-xs sm:text-sm text-zinc-300 whitespace-pre-line leading-relaxed font-mono max-h-80 overflow-y-auto">
              {activeEvidence.fullReport}
            </div>
          </div>

          {/* Key Deduction Note */}
          <div className="p-3.5 bg-amber-950/20 border border-amber-800/40 rounded-xl text-xs sm:text-sm text-amber-200">
            <strong>💡 Uzmanlık Çıkarımı:</strong> {activeEvidence.keyDeduction}
          </div>

          {/* Single Pin to Common Board Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playPinSound();
                onPinEvidence(
                  activeEvidence.title,
                  activeEvidence.keyDeduction,
                  activeEvidence.category,
                  activeEvidence.id
                );
              }}
              disabled={pinnedEvidenceIds.has(activeEvidence.id)}
              className={`w-full py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                pinnedEvidenceIds.has(activeEvidence.id)
                  ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-700'
                  : 'bg-amber-600 hover:bg-amber-500 text-zinc-950 cursor-pointer'
              }`}
            >
              <Pin className="w-4 h-4" />
              <span>
                {pinnedEvidenceIds.has(activeEvidence.id)
                  ? 'Panoya Yansıtıldı ✓'
                  : '📌 Bu Bulguyu Ortak Panoya Yansıt'}
              </span>
            </button>
          </div>

          {/* Close Dossier & Pass Turn Button */}
          {onPassTurn && !isEnvelopeCompleted && (
            <div className="pt-3 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={() => {
                  soundManager.playSuccessSound();
                  onPassTurn();
                }}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {isSoloMode
                    ? '📁 Dosyaları İnceledim - Doğrulama Sorusunu Çözmeye Geç'
                    : nextInspector
                    ? `📁 Dosyayı Okudum, Sırayı ${nextInspector.name}'e Devret`
                    : '📁 Zarfı İnceledim & Masaya Bırak (Tüm Dosyalar Tamamlandı)'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-zinc-400 text-center mt-1.5">
                {isSoloMode
                  ? '* İncelemeniz bittiğinde butona basarak şifreli doğrulama aşamasını açabilirsiniz.'
                  : nextInspector
                  ? `* Butona bastığınızda dosyanız kapanacak ve sıradaki zarf ${nextInspector.name} ekranında açılacaktır.`
                  : '* Masadaki tüm dosyalar incelendi. Şimdi doğrulama sorusunu çözebilirsiniz.'}
              </p>
            </div>
          )}

        </div>
      ) : null}

      {/* Envelope Advancement Gate: Appears once all players in the envelope have reviewed files */}
      {isEnvelopeCompleted && (
        <div className="pt-2">
          {currentEnvelope < 3 ? (
            <button
              type="button"
              onClick={onOpenGateModal}
              className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-amber-500/50 hover:border-amber-400 text-amber-300 font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ring-2 ring-amber-500/20 animate-pulse"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>✓ Tüm Dosyalar İncelendi - Zarf {currentEnvelope + 1} Doğrulama Sorusunu Çöz</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onGoToAccusation}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-xl flex items-center justify-center gap-2 animate-pulse cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>✓ 3. Zarf Tamamlandı - Final Katil Suçlama Aşamasına Geç</span>
            </button>
          )}
        </div>
      )}

    </div>
  );
};
