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
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface PlayerInboxViewProps {
  player: Player;
  allPlayers?: Player[];
  totalPlayers?: number;
  currentEnvelope: EnvelopeNumber;
  unlockedEnvelope?: number;
  totalEnvelopes?: number;
  onSelectEnvelope?: (envNum: number) => void;
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
  unlockedEnvelope,
  totalEnvelopes = 3,
  onSelectEnvelope,
  evidenceList,
  onAdvanceEnvelope,
  onGoToAccusation,
}) => {
  const effectiveUnlocked = unlockedEnvelope !== undefined ? unlockedEnvelope : currentEnvelope;
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

  const currentIndex = displayedEvidenceList.findIndex((ev) => ev.id === activeEvidence?.id);
  const safeCurrentIndex = currentIndex >= 0 ? currentIndex : 0;

  const handlePrevEvidence = () => {
    if (safeCurrentIndex > 0) {
      soundManager.playKeyClick();
      setSelectedEvidenceId(displayedEvidenceList[safeCurrentIndex - 1].id);
    }
  };

  const handleNextEvidence = () => {
    if (safeCurrentIndex < displayedEvidenceList.length - 1) {
      soundManager.playKeyClick();
      setSelectedEvidenceId(displayedEvidenceList[safeCurrentIndex + 1].id);
    }
  };

  const getEvidenceIcon = (ev: EvidenceItem) => {
    if (ev.category === 'interrogation') {
      return <Users2 className="w-3.5 h-3.5 text-sky-400" />;
    }
    if (ev.mediaType === 'audio' || ev.category === 'audio') {
      return <Headphones className="w-3.5 h-3.5 text-cyan-400" />;
    }
    if (ev.mediaType === 'image') {
      return <ImageIcon className="w-3.5 h-3.5 text-amber-400" />;
    }
    return <FileText className="w-3.5 h-3.5 text-zinc-300" />;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-12">

      {/* Envelope Navigation & Archive Switcher Tabs */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-2.5 sm:p-3 shadow-lg flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider pl-1">
            ZARFLAR:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {Array.from({ length: totalEnvelopes }).map((_, idx) => {
              const envNum = idx + 1;
              const isUnlocked = envNum <= effectiveUnlocked;
              const isViewing = envNum === currentEnvelope;

              return (
                <button
                  key={envNum}
                  type="button"
                  disabled={!isUnlocked}
                  onClick={() => {
                    if (isUnlocked && onSelectEnvelope) {
                      soundManager.playKeyClick();
                      onSelectEnvelope(envNum);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
                    isViewing
                      ? 'bg-amber-600 text-zinc-950 border-amber-400 shadow-md ring-1 ring-amber-400/40 cursor-default'
                      : isUnlocked
                      ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-amber-500 hover:text-amber-300 cursor-pointer active:scale-95'
                      : 'bg-zinc-950/80 border-zinc-900 text-zinc-600 cursor-not-allowed opacity-50'
                  }`}
                  title={
                    isViewing
                      ? `Zarf ${envNum} (Şu an incelenen dosya)`
                      : isUnlocked
                      ? `Zarf ${envNum} Arşivine Göz At`
                      : `Zarf ${envNum} Henüz Açılmadı`
                  }
                >
                  <span>Zarf {envNum}</span>
                  {!isUnlocked ? (
                    <span className="text-[10px]">🔒</span>
                  ) : isViewing ? (
                    <span className="text-[9px] bg-zinc-950/40 px-1 py-0.5 rounded text-zinc-950 font-sans font-bold">Aktif</span>
                  ) : (
                    <span className="text-[10px] text-emerald-400">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick jump to latest open envelope if browsing archive */}
        {currentEnvelope < effectiveUnlocked && (
          <button
            type="button"
            onClick={() => {
              if (onSelectEnvelope) {
                soundManager.playKeyClick();
                onSelectEnvelope(effectiveUnlocked);
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-950/70 border border-amber-500/60 text-amber-300 text-xs font-bold hover:bg-amber-900/80 transition-all flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Açık Zarfa Dön (Zarf {effectiveUnlocked})</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        )}
      </div>

      {/* Archive Warning Banner when reviewing previous envelopes */}
      {currentEnvelope < effectiveUnlocked && (
        <div className="p-3 bg-amber-950/40 border border-amber-500/50 rounded-2xl text-xs text-amber-200 flex flex-wrap items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-base">📜</span>
            <p>
              <strong>ARŞİV İNCELEME MODU:</strong> Şu an daha önce açılmış olan <strong>Zarf {currentEnvelope}</strong> belgelerini inceliyorsunuz. Masanızın ulaştığı en güncel açık zarf: <strong>Zarf {effectiveUnlocked}</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onSelectEnvelope) {
                soundManager.playKeyClick();
                onSelectEnvelope(effectiveUnlocked);
              }
            }}
            className="px-2.5 py-1 rounded-lg bg-amber-600 text-zinc-950 font-bold text-xs hover:bg-amber-500 transition-all cursor-pointer shrink-0"
          >
            Zarf {effectiveUnlocked}’e Git →
          </button>
        </div>
      )}

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

      {/* Compact Numbered Navigation Bar */}
      {displayedEvidenceList.length > 1 && (
        <div className="bg-zinc-950 border border-zinc-800/90 rounded-2xl p-2.5 sm:p-3 shadow-lg space-y-2.5">
          {/* Top Row: Prev Arrow, Numbered Buttons (Belge 1, Belge 2, ...), Next Arrow */}
          <div className="flex items-center justify-between gap-2">
            
            {/* Prev Arrow */}
            <button
              type="button"
              onClick={handlePrevEvidence}
              disabled={safeCurrentIndex <= 0}
              className={`p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                safeCurrentIndex <= 0
                  ? 'border-zinc-800 text-zinc-600 bg-zinc-900/40 cursor-not-allowed opacity-40'
                  : 'border-zinc-700 text-zinc-300 bg-zinc-900 hover:border-amber-500 hover:text-amber-300 active:scale-95'
              }`}
              title="Önceki Belge"
              aria-label="Önceki Belge"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Compact Numbered Buttons (Belge 1, Belge 2, ...) */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap flex-1 min-w-0">
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-amber-600 text-zinc-950 border-amber-400 shadow-md font-bold ring-1 ring-amber-400/40'
                        : 'bg-zinc-900/90 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    {getEvidenceIcon(ev)}
                    <span>Belge {idx + 1}</span>
                  </button>
                );
              })}
            </div>

            {/* Next Arrow */}
            <button
              type="button"
              onClick={handleNextEvidence}
              disabled={safeCurrentIndex >= displayedEvidenceList.length - 1}
              className={`p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                safeCurrentIndex >= displayedEvidenceList.length - 1
                  ? 'border-zinc-800 text-zinc-600 bg-zinc-900/40 cursor-not-allowed opacity-40'
                  : 'border-zinc-700 text-zinc-300 bg-zinc-900 hover:border-amber-500 hover:text-amber-300 active:scale-95'
              }`}
              title="Sonraki Belge"
              aria-label="Sonraki Belge"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Active Document Header Strip: Counter + Full Title */}
          {activeEvidence && (
            <div className="flex items-center justify-between gap-2.5 px-3 py-2 bg-zinc-900/80 border border-zinc-800/80 rounded-xl text-xs">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
                  {safeCurrentIndex + 1} / {displayedEvidenceList.length}
                </span>
                <span className="text-zinc-200 font-semibold truncate text-xs sm:text-sm">
                  {activeEvidence.title}
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider shrink-0 hidden sm:inline-block">
                {activeEvidence.category === 'interrogation'
                  ? '⚖️ Sorgu Zabtı'
                  : activeEvidence.category === 'toxicology'
                  ? '🔬 Toksikoloji'
                  : activeEvidence.mediaType === 'audio'
                  ? '🎙️ Ses Kaydı'
                  : '📄 Resmi Delil'}
              </span>
            </div>
          )}
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

          {/* Police Interrogation Stamp Banner */}
          {activeEvidence.category === 'interrogation' && (
            <div className="p-3.5 bg-zinc-950/90 rounded-xl border border-sky-600/40 flex items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-950/80 border border-sky-500/50 flex items-center justify-center text-sky-400 shrink-0">
                  <Users2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400 block">
                    T.C. EMNİYET MÜDÜRLÜĞÜ · RESMİ SORGU & ÇAPRAZ İFADE ZAPTI
                  </span>
                  <p className="text-xs text-zinc-300 font-medium">
                    Şüpheli / Tanık Beyanları, Çapraz Sorgu Tutanakları ve İfade Çelişkileri
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-sky-950/80 border border-sky-500/50 text-sky-300 shrink-0 font-bold uppercase">
                POLİS SORGUSU
              </span>
            </div>
          )}

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

      {/* Direct Envelope Advancement & Navigation Buttons */}
      <div className="pt-2 space-y-2">
        {currentEnvelope < effectiveUnlocked ? (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playKeyClick();
                if (onSelectEnvelope) onSelectEnvelope(effectiveUnlocked);
              }}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>← Arşivden Çık: Güncel Açık Zarfa Dön (Zarf {effectiveUnlocked})</span>
              <ArrowRight className="w-4 h-4 text-zinc-950" />
            </button>
            {effectiveUnlocked >= totalEnvelopes && (
              <button
                type="button"
                onClick={onGoToAccusation}
                className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-medium rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Final Suçlama ve Test Aşamasına Doğrudan Geç &rarr;</span>
              </button>
            )}
          </div>
        ) : effectiveUnlocked < totalEnvelopes ? (
          <button
            type="button"
            onClick={() => {
              soundManager.playSuccessSound();
              if (onAdvanceEnvelope) onAdvanceEnvelope();
            }}
            className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 border-2 border-amber-500/60 hover:border-amber-400 text-amber-300 font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ring-2 ring-amber-500/20"
          >
            <span>✓ Zarf {effectiveUnlocked} İncelendi — Zarf {effectiveUnlocked + 1}’i Aç</span>
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
          * İstediğiniz zaman yukarıdaki zarf sekmelerinden önceki zarflara dönüp belgeleri tekrar inceleyebilirsiniz.
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
