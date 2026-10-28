/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Player, EvidenceItem, EnvelopeNumber, Suspect } from '../types';
import { soundManager } from '../utils/audioEffects';
import { 
  FileText, 
  ShieldAlert, 
  ArrowRight,
  Headphones,
  Video,
  Image as ImageIcon,
  X,
  Users2,
  FolderOpen,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface PlayerInboxViewProps {
  player: Player;
  allPlayers?: Player[];
  totalPlayers?: number;
  currentEnvelope: EnvelopeNumber;
  totalEnvelopes?: number;
  evidenceList: EvidenceItem[];
  suspects?: Suspect[];
  onAdvanceEnvelope?: () => void;
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
  totalEnvelopes = 3,
  evidenceList,
  onAdvanceEnvelope,
  onGoToAccusation,
}) => {
  const isSoloMode = totalPlayers === 1 || allPlayers.length === 1;
  const isTwoPlayerMode = !isSoloMode && (totalPlayers === 2 || allPlayers.length === 2);

  // All files in this envelope
  const allEnvelopeEvidence = evidenceList.filter((ev) => ev.envelope === currentEnvelope);

  // Evidence specifically targeted to this player's role
  const specialistEvidence = allEnvelopeEvidence.filter((ev) => {
    if (isSoloMode) return true;
    if (isTwoPlayerMode) {
      if (player.role === 'forensics') {
        return ev.roleAccess.includes('forensics') || ev.roleAccess.includes('cryptology') || ev.roleAccess.includes('ballistics');
      }
      if (player.role === 'profiler') {
        return ev.roleAccess.includes('profiler') || ev.roleAccess.includes('field') || ev.roleAccess.includes('archive');
      }
    }
    return ev.roleAccess.includes(player.role);
  });

  // Default view mode: 'specialist' if they have role files, otherwise 'all'
  const [viewScope, setViewScope] = useState<'specialist' | 'all'>('specialist');

  const displayedEvidenceList = (viewScope === 'specialist' && specialistEvidence.length > 0)
    ? specialistEvidence
    : allEnvelopeEvidence;

  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(
    displayedEvidenceList.length > 0 ? displayedEvidenceList[0].id : null
  );
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);

  // Sync selected evidence when envelope, player, or viewScope changes
  useEffect(() => {
    if (specialistEvidence.length === 0) {
      setViewScope('all');
    }
  }, [currentEnvelope, specialistEvidence.length]);

  useEffect(() => {
    if (displayedEvidenceList.length > 0) {
      const exists = displayedEvidenceList.some((e) => e.id === selectedEvidenceId);
      if (!exists) {
        setSelectedEvidenceId(displayedEvidenceList[0].id);
      }
    } else {
      setSelectedEvidenceId(null);
    }
    setIsPlayingAudio(false);
  }, [currentEnvelope, player.id, viewScope, displayedEvidenceList]);

  const activeEvidence = displayedEvidenceList.find((ev) => ev.id === selectedEvidenceId) || displayedEvidenceList[0];

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-12">

      {/* Detective & Envelope Header Bar */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 font-mono text-sm">
            Z{currentEnvelope}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel font-bold text-sm text-zinc-100">
                ZARF {currentEnvelope} &mdash; ADLİ SORUŞTURMA
              </span>
              <span className="text-[10px] bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 font-mono px-2 py-0.5 rounded font-bold">
                CANLI SENKRON
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Masa Şefi: <strong className="text-zinc-200">{player.name}</strong> ({player.role.toUpperCase()})
            </p>
          </div>
        </div>

        {/* View Scope Toggle: Specialist vs All Envelope Files */}
        {allEnvelopeEvidence.length > 1 && (
          <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => {
                soundManager.playKeyClick();
                setViewScope('specialist');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewScope === 'specialist'
                  ? 'bg-amber-600 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>Bana Özel ({specialistEvidence.length})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundManager.playKeyClick();
                setViewScope('all');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewScope === 'all'
                  ? 'bg-amber-600 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Tüm Zarftaki Dosyalar ({allEnvelopeEvidence.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* File Switcher Buttons */}
      {displayedEvidenceList.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {displayedEvidenceList.map((ev, idx) => {
            const isSelected = activeEvidence?.id === ev.id;
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
              </button>
            );
          })}
        </div>
      )}

      {/* Active Dossier Paper */}
      {activeEvidence ? (
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

          {/* Audio Wiretap / Recording Station */}
          {(activeEvidence.mediaType === 'audio' || activeEvidence.category === 'audio') && (
            <div className="p-4 bg-zinc-950 rounded-2xl border border-amber-600/30 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-2 text-amber-400 font-bold">
                  <Headphones className="w-4 h-4 animate-pulse" />
                  <span>SES KAYDI & TELEFON DİNLEME TUTANAĞI</span>
                </span>
                <span className="text-[10px] text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  {isPlayingAudio ? '● OYNATILIYOR' : 'DURDURULDU'}
                </span>
              </div>

              {activeEvidence.mediaUrl ? (
                <div className="pt-1">
                  <audio
                    src={activeEvidence.mediaUrl}
                    controls
                    className="w-full accent-amber-500 rounded-lg"
                    onPlay={() => setIsPlayingAudio(true)}
                    onPause={() => setIsPlayingAudio(false)}
                  />
                  {activeEvidence.mediaCaption && (
                    <p className="text-[11px] text-zinc-400 mt-1 italic font-sans">{activeEvidence.mediaCaption}</p>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-xs text-zinc-200 font-semibold font-mono">
                      🎙️ {activeEvidence.mediaCaption || '112 & Telsiz Dinleme Bandı'}
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Ses çözümü aşağıdaki resmi metin tutanağına aktarılmıştır.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playKeyClick();
                      soundManager.playSuccessSound();
                    }}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 rounded-lg text-xs font-bold font-mono transition-colors shrink-0 cursor-pointer"
                  >
                    Bandı Oynat
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Crime Scene Photo Embed */}
          {activeEvidence.mediaType === 'image' && activeEvidence.mediaUrl && (
            <div className="p-3.5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-2 text-zinc-300 font-bold">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  <span>OLAY YERİ DELİL FOTOĞRAFI</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
                >
                  Büyüt 🔍
                </button>
              </div>

              <div 
                onClick={() => setIsPhotoModalOpen(true)}
                className="relative rounded-xl overflow-hidden border border-zinc-800 max-h-72 cursor-pointer group bg-black flex items-center justify-center"
              >
                <img
                  src={activeEvidence.mediaUrl}
                  alt={activeEvidence.title}
                  className="w-full h-auto max-h-72 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-lg bg-zinc-900/90 text-amber-300 text-xs font-bold border border-amber-500/40">
                    Büyük Boy İncele
                  </span>
                </div>
              </div>

              {activeEvidence.mediaCaption && (
                <p className="text-[11px] text-zinc-400 italic font-mono pt-1">
                  {activeEvidence.mediaCaption}
                </p>
              )}
            </div>
          )}

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

        </div>
      ) : null}

      {/* Direct Envelope Advancement Buttons */}
      <div className="pt-2 space-y-2">
        {currentEnvelope < totalEnvelopes ? (
          <button
            type="button"
            onClick={() => {
              soundManager.playSuccessSound();
              if (onAdvanceEnvelope) onAdvanceEnvelope();
            }}
            className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 border-2 border-amber-500/60 hover:border-amber-400 text-amber-300 font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ring-2 ring-amber-500/20"
          >
            <span>✓ Zarf {currentEnvelope} İncelendi — Zarf {currentEnvelope + 1}’i Aç</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onGoToAccusation}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-xl flex items-center justify-center gap-2 animate-pulse cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>✓ Son Zarf ({totalEnvelopes}) Tamamlandı — Final Suçlama ve Test Aşamasına Geç &rarr;</span>
          </button>
        )}
        <p className="text-[11px] text-zinc-400 text-center font-sans">
          * Masadaki arkadaşınızla dosyaları inceleyip tartıştığınızda bir sonraki zarfa geçebilirsiniz.
        </p>
      </div>

      {/* Forensic Photo Zoom Lightbox Modal */}
      {isPhotoModalOpen && activeEvidence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center bg-zinc-950 border border-zinc-800 rounded-3xl p-4 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsPhotoModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="overflow-hidden rounded-2xl w-full flex items-center justify-center bg-black">
              <img
                src={activeEvidence.mediaUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80'}
                alt={activeEvidence.title}
                className="max-h-[75vh] w-auto object-contain rounded-xl"
              />
            </div>
            <div className="w-full pt-3 px-2 flex items-center justify-between text-xs text-zinc-300">
              <span className="font-mono text-amber-400 font-bold uppercase tracking-wider">
                [DELİL İNCELEME - BÜYÜTÜLMÜŞ GÖRÜNTÜ]
              </span>
              <span className="font-sans text-zinc-400">{activeEvidence.mediaCaption || activeEvidence.title}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
