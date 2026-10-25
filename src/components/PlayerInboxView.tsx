/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Player, EvidenceItem, EnvelopeNumber, Suspect } from '../types';
import { ROLES } from '../data/cases';
import { ForensicsAnalyzer } from './ForensicsAnalyzer';
import { CryptoTerminal } from './CryptoTerminal';
import { ProfilerNotes } from './ProfilerNotes';
import { soundManager } from '../utils/audioEffects';
import { 
  FileText, 
  Pin, 
  CheckCircle, 
  ChevronRight, 
  Lock, 
  KeyRound, 
  Sparkles, 
  ShieldAlert, 
  Fingerprint, 
  Activity, 
  Terminal,
  Clock
} from 'lucide-react';

interface PlayerInboxViewProps {
  player: Player;
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
  currentEnvelope,
  evidenceList,
  suspects,
  pinnedEvidenceIds,
  onPinEvidence,
  onOpenGateModal,
  onGoToAccusation,
}) => {
  const roleInfo = ROLES[player.role];
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(
    evidenceList.length > 0 ? evidenceList[0].id : null
  );

  // Filter evidence accessible to this player's role in this envelope
  const myEvidence = evidenceList.filter(
    (ev) => ev.envelope === currentEnvelope && ev.roleAccess.includes(player.role)
  );

  const activeEvidence = myEvidence.find((ev) => ev.id === selectedEvidenceId) || myEvidence[0];

  const handleSelectEvidence = (id: string) => {
    soundManager.playKeyClick();
    setSelectedEvidenceId(id);
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
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Phone Header Banner */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0">
              {getRoleIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-zinc-100">{player.name}</h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-amber-300">
                  {roleInfo.badge}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">{roleInfo.shortDesc}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-xl">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-zinc-200">
              {currentEnvelope <= 3 ? `Zarf ${currentEnvelope} Aktif` : 'Final Karar Aşaması'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Evidence Dossier & Tools */}
      {myEvidence.length === 0 ? (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-400 text-xs">
          <ShieldAlert className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <p className="font-semibold text-zinc-300">Bu zarfta doğrudan uzmanlığınıza ait yeni delil bulunmuyor.</p>
          <p className="mt-1 text-zinc-500">
            Diğer dedektiflerin ortak panoya yansıttığı bulguları inceleyerek masadaki analize destek olun!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Left Column: Evidence List for this specialist */}
          <div className="md:col-span-5 space-y-2.5">
            <span className="text-xs font-typewriter uppercase tracking-wider text-zinc-400 block px-1">
              📥 Uzmanlık Gelen Kutusu ({myEvidence.length} Rapor):
            </span>

            {myEvidence.map((ev) => {
              const isSelected = activeEvidence?.id === ev.id;
              const isPinned = pinnedEvidenceIds.has(ev.id);

              return (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => handleSelectEvidence(ev.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-zinc-900 border-amber-500 text-zinc-100 shadow-md ring-1 ring-amber-500/30'
                      : 'bg-zinc-950/70 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1 font-typewriter">
                    <span className="text-amber-400 font-bold">{ev.metadata?.confidentiality || 'GİZLİ'}</span>
                    <span className="text-zinc-400">{ev.metadata?.date}</span>
                  </div>

                  <h4 className="text-xs font-bold leading-snug text-zinc-200">{ev.title}</h4>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {ev.summary}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400">Ref: {ev.metadata?.caseRef}</span>
                    {isPinned ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-medium">
                        <Pin className="w-3 h-3" /> Panoda
                      </span>
                    ) : (
                      <span className="text-zinc-400 hover:text-amber-400 flex items-center gap-1">
                        Detayı Gör <ChevronRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Evidence Reader & Interactive Tool */}
          <div className="md:col-span-7 space-y-4">
            {activeEvidence && (
              <div className="space-y-4">
                {/* Document Sheet */}
                <div className="bg-dossier-paper rounded-2xl p-5 shadow-xl relative text-zinc-200 border border-amber-900/30">
                  {/* Top stamp */}
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <div>
                      <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block">
                        T.C. ADLİ TAHKİKAT VE SUÇ DOSYASI
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-zinc-100 mt-0.5">
                        {activeEvidence.title}
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-rose-500/50 bg-rose-950/30 text-rose-300 font-bold">
                        {activeEvidence.metadata?.confidentiality}
                      </span>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="mt-3 p-3 bg-zinc-950/80 rounded-xl border border-zinc-800">
                    <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider block mb-1">
                      Özet Bulgu:
                    </span>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      {activeEvidence.summary}
                    </p>
                  </div>

                  {/* Full Text Report */}
                  <div className="mt-3">
                    <span className="text-[11px] font-typewriter uppercase tracking-wider text-zinc-400 block mb-1">
                      Resmi Rapor Metni:
                    </span>
                    <div className="p-3.5 bg-zinc-950/50 border border-zinc-900 rounded-xl text-xs text-zinc-300 whitespace-pre-line leading-relaxed font-typewriter max-h-64 overflow-y-auto">
                      {activeEvidence.fullReport}
                    </div>
                  </div>

                  {/* Key Deduction Note */}
                  <div className="mt-3 p-2.5 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs text-amber-200">
                    <strong>💡 Uzmanlık Çıkarımı:</strong> {activeEvidence.keyDeduction}
                  </div>

                  {/* Pin to Common Board Action */}
                  <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-zinc-400">
                      Bu bulguyu diğer dedektiflerin ortak panosuna yansıtın.
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
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        pinnedEvidenceIds.has(activeEvidence.id)
                          ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                          : 'bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold shadow-md'
                      }`}
                    >
                      <Pin className="w-3.5 h-3.5" />
                      {pinnedEvidenceIds.has(activeEvidence.id)
                        ? 'Panoya Yansıtıldı'
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
          </div>
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
              ? 'Tüm uzmanlar ellerindeki ipuçlarını paylaştığında ortak doğrulama sorusunu çözerek sonraki zarfı açın.'
              : 'Tüm deliller toplandı. Şimdi her dedektif kendi kararını gizlice kilitleyecektir.'}
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
