/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Player, EvidenceItem, EnvelopeNumber, Suspect } from '../types';
import { ROLES } from '../data/cases';
import { ForensicsAnalyzer } from './ForensicsAnalyzer';
import { CryptoTerminal } from './CryptoTerminal';
import { ProfilerNotes } from './ProfilerNotes';
import { soundManager } from '../utils/audioEffects';
import { 
  FileText, 
  Pin, 
  Lock, 
  KeyRound, 
  ShieldAlert, 
  Fingerprint, 
  Activity, 
  Terminal,
  Clock,
  MessageSquare,
  Users,
  CheckCircle,
  Eye,
  ChevronRight
} from 'lucide-react';

interface PlayerInboxViewProps {
  player: Player;
  allPlayers?: Player[];
  totalPlayers?: number;
  currentEnvelope: EnvelopeNumber;
  evidenceList: EvidenceItem[];
  suspects: Suspect[];
  pinnedEvidenceIds: Set<string>;
  onPinEvidence: (title: string, excerpt: string, category: string, evidenceId?: string) => void;
  onOpenGateModal: () => void;
  onGoToAccusation: () => void;
}

export const PlayerInboxView: React.FC<PlayerInboxViewProps> = ({
  player,
  allPlayers = [],
  totalPlayers = 2,
  currentEnvelope,
  evidenceList,
  suspects,
  pinnedEvidenceIds,
  onPinEvidence,
  onOpenGateModal,
  onGoToAccusation,
}) => {
  const roleInfo = ROLES[player.role] || ROLES.forensics;
  const isTwoPlayerMode = totalPlayers === 2 || allPlayers.length === 2;

  // Filter evidence accessible to this player in this envelope
  // In 2-player mode:
  // Dedektif 1 (Forensics): handles forensics and cryptology files
  // Dedektif 2 (Profiler): handles profiler, witness statements, and background files
  const myEvidence = evidenceList.filter((ev) => {
    if (ev.envelope !== currentEnvelope) return false;
    if (isTwoPlayerMode) {
      if (player.role === 'forensics') {
        return ev.roleAccess.includes('forensics') || ev.roleAccess.includes('cryptology');
      }
      if (player.role === 'profiler') {
        // If it's a primary forensics or cryptology lab file, it belongs to Dedektif 1
        const isLabFile = ev.roleAccess.includes('forensics') || ev.roleAccess.includes('cryptology');
        return !isLabFile;
      }
    }
    return ev.roleAccess.includes(player.role);
  });

  // Filter evidence belonging to OTHER player(s) in this envelope
  const otherEvidence = evidenceList.filter((ev) => {
    if (ev.envelope !== currentEnvelope) return false;
    return !myEvidence.some((m) => m.id === ev.id);
  });

  // Active view tab: 'my' (My files) or 'others' (Other players' files)
  const [activeTab, setActiveTab] = useState<'my' | 'others'>('my');
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

  // Helper to find which other player holds a given file
  const getHolderForEvidence = (ev: EvidenceItem): Player | null => {
    if (allPlayers.length <= 1) return null;
    const other = allPlayers.find((p) => p.id !== player.id);
    if (!other) return null;
    return other;
  };

  const getRoleIcon = () => {
    switch (player.role) {
      case 'forensics':
        return <Activity className="w-5 h-5 text-emerald-400" />;
      case 'cryptology':
        return <Terminal className="w-5 h-5 text-cyan-400" />;
      case 'profiler':
        return <Fingerprint className="w-5 h-5 text-amber-400" />;
      default:
        return <FileText className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-8">
      {/* Phone Header Banner: Clean & Focused */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0">
              {getRoleIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-zinc-100">{player.name}</h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-amber-300">
                  {isTwoPlayerMode
                    ? player.role === 'forensics'
                      ? '🔬 ADLİ TIP & 💻 KRİPTOLOJİ'
                      : '🧠 PROFİLLEME & 🕵️ SORGU'
                    : roleInfo.badge}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">{roleInfo.shortDesc}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-xl">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-zinc-200">
              {currentEnvelope <= 3 ? `Zarf ${currentEnvelope} / 3 Aktif` : 'Final Karar Aşaması'}
            </span>
          </div>
        </div>

        {/* Tab switchers: My Dossiers vs Other Player's Files */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-zinc-800/80">
          <button
            type="button"
            onClick={() => {
              soundManager.playKeyClick();
              setActiveTab('my');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'my'
                ? 'bg-amber-600 text-zinc-950 border-amber-400 shadow-md ring-1 ring-amber-400'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Sizin Dosyalarınız ({myEvidence.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playKeyClick();
              setActiveTab('others');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'others'
                ? 'bg-amber-600 text-zinc-950 border-amber-400 shadow-md ring-1 ring-amber-400'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Diğer Dedektifteki Dosyalar ({otherEvidence.length})</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: MY DOSSIERS (Clean, interactive reader with file selector)
         ========================================================================= */}
      {activeTab === 'my' && (
        <div className="space-y-4">
          {myEvidence.length === 0 ? (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-400 text-xs">
              <ShieldAlert className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <p className="font-semibold text-zinc-300">Bu zarfta doğrudan uzmanlığınıza ait yeni dosya bulunmuyor.</p>
              <p className="mt-1 text-zinc-500">
                Diğer dedektifin &quot;Diğer Dedektifteki Dosyalar&quot; sekmesindeki bulgularını sesli dinleyerek ortak panoya odaklanın!
              </p>
            </div>
          ) : (
            <>
              {/* File switcher buttons if player has multiple files */}
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
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                          isSelected
                            ? 'bg-zinc-900 border-amber-500 text-amber-300 shadow-md ring-1 ring-amber-500/40'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Dosya {idx + 1}: {ev.title}</span>
                        {isPinned && <Pin className="w-3 h-3 text-emerald-400 fill-current" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Active Document Card */}
              {activeEvidence && (
                <div className="space-y-4">
                  <div className="bg-dossier-paper rounded-2xl p-5 sm:p-6 shadow-xl relative text-zinc-200 border border-amber-900/30">
                    {/* Top stamp */}
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                      <div>
                        <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block">
                          T.C. ADLİ TAHKİKAT VE SUÇ DOSYASI · {activeEvidence.metadata?.caseRef}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-zinc-100 mt-0.5">
                          {activeEvidence.title}
                        </h3>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-rose-500/50 bg-rose-950/30 text-rose-300 font-bold">
                          {activeEvidence.metadata?.confidentiality || 'GİZLİ'}
                        </span>
                      </div>
                    </div>

                    {/* Summary Box */}
                    <div className="mt-4 p-3.5 bg-zinc-950/80 rounded-xl border border-zinc-800">
                      <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider block mb-1">
                        Özet Bulgu:
                      </span>
                      <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans">
                        {activeEvidence.summary}
                      </p>
                    </div>

                    {/* Full Text Report */}
                    <div className="mt-4">
                      <span className="text-[11px] font-typewriter uppercase tracking-wider text-zinc-400 block mb-1">
                        Resmi Rapor Metni:
                      </span>
                      <div className="p-4 bg-zinc-950/50 border border-zinc-900 rounded-xl text-xs sm:text-sm text-zinc-300 whitespace-pre-line leading-relaxed font-typewriter max-h-72 overflow-y-auto">
                        {activeEvidence.fullReport}
                      </div>
                    </div>

                    {/* Key Deduction Note */}
                    <div className="mt-4 p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs sm:text-sm text-amber-200">
                      <strong>💡 Uzmanlık Çıkarımı:</strong> {activeEvidence.keyDeduction}
                    </div>

                    {/* Pin to Common Board Action */}
                    <div className="mt-4 pt-3 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span className="text-xs text-zinc-400">
                        Bu bulguyu arkadaşınızın görebilmesi için ortak panoya yansıtın.
                      </span>

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
                        className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-md shrink-0 ${
                          pinnedEvidenceIds.has(activeEvidence.id)
                            ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-700'
                            : 'bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold'
                        }`}
                      >
                        <Pin className="w-3.5 h-3.5" />
                        {pinnedEvidenceIds.has(activeEvidence.id)
                          ? 'Panoya Yansıtıldı ✓'
                          : '📌 Özeti Ortak Panoya Yansıt'}
                      </button>
                    </div>
                  </div>

                  {/* Specialist Interactive Tool Section */}
                  {activeEvidence.hasInteractiveTool === 'toxicology' && (
                    <ForensicsAnalyzer
                      onPinFinding={(title, excerpt, cat) => onPinEvidence(title, excerpt, cat, activeEvidence.id)}
                      isAlreadyPinned={pinnedEvidenceIds.has(activeEvidence.id)}
                    />
                  )}

                  {activeEvidence.hasInteractiveTool === 'terminal' && (
                    <CryptoTerminal
                      onPinFinding={(title, excerpt, cat) => onPinEvidence(title, excerpt, cat, activeEvidence.id)}
                      isAlreadyPinned={pinnedEvidenceIds.has(activeEvidence.id)}
                    />
                  )}

                  {activeEvidence.hasInteractiveTool === 'profiler-highlighter' && (
                    <ProfilerNotes
                      suspects={suspects}
                      onPinFinding={(title, excerpt, cat) => onPinEvidence(title, excerpt, cat, activeEvidence.id)}
                      isAlreadyPinned={pinnedEvidenceIds.has(activeEvidence.id)}
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: DIĞER DEDEKTİFTEKİ DOSYALAR (Clean, minimal: displays only active player & who holds the file)
         ========================================================================= */}
      {activeTab === 'others' && (
        <div className="space-y-3">
          {otherEvidence.length === 0 ? (
            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl text-center text-xs text-zinc-400">
              Bu zarftaki tüm belgeler sizin uzmanlığınıza ait.
            </div>
          ) : (
            otherEvidence.map((ev) => {
              const holder = getHolderForEvidence(ev);
              const holderRoleTitle = holder ? (ROLES[holder.role]?.title || holder.role) : 'Diğer Dedektif';
              const holderName = holder ? holder.name : 'Masa Arkadaşınız';

              return (
                <div
                  key={ev.id}
                  className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-md flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-500 shrink-0" />
                      <h4 className="text-sm font-bold text-zinc-200">{ev.title}</h4>
                    </div>
                    <p className="text-xs text-amber-300">
                      📁 Bu dosya şu an <strong>{holderName}</strong> ({holderRoleTitle}) dedektifindedir.
                    </p>
                  </div>

                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
                    Zarf {ev.envelope}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Bottom Envelope Advancement Bar */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <h4 className="text-sm font-bold text-zinc-200">
            {currentEnvelope < 3
              ? `Zarf ${currentEnvelope} Ara Doğrulama Kapısı`
              : 'Zarf 3 Tamamlandı: Bireysel Katil Suçlama Aşaması'}
          </h4>
          <p className="text-xs text-zinc-400 mt-0.5">
            {currentEnvelope < 3
              ? 'İki dedektif de elindeki ipuçlarını masada paylaştıysa doğrulama sorusunu çözerek sonraki zarfa geçin.'
              : 'Tüm deliller toplandı. Şimdi her dedektif kendi katil teorisini gizlice kilitleyecektir.'}
          </p>
        </div>

        {currentEnvelope < 3 ? (
          <button
            type="button"
            onClick={onOpenGateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded-xl text-xs transition-all shadow-md shrink-0"
          >
            <KeyRound className="w-4 h-4" />
            Zarf {currentEnvelope + 1} Doğrulama Sorusunu Çöz
          </button>
        ) : (
          <button
            type="button"
            onClick={onGoToAccusation}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shrink-0 animate-pulse"
          >
            <ShieldAlert className="w-4 h-4" />
            Bireysel Katil Seçimine Geç (Final)
          </button>
        )}
      </div>
    </div>
  );
};
