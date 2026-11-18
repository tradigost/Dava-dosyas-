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

  // Check if video URL is YouTube or Vimeo embed
  const getVideoEmbedUrl = (url?: string) => {
    if (!url) return '';
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=0&rel=0`;
    }
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return '';
  };

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
      <div className="bg-[#fffdf8] border border-[#d6cdbc] rounded-sm shadow-[0_2px_12px_rgba(31,28,24,0.07)] p-2.5 sm:p-3 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-typewriter text-[#1f1c18] font-bold uppercase tracking-wider pl-1">
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
                  className={`px-3 py-1.5 rounded-sm text-xs font-typewriter font-bold transition-all border flex items-center gap-1.5 ${
                    isViewing
                      ? 'bg-[#8b1e1e] text-[#faf6ed] border-[#701616] shadow-md ring-1 ring-[#701616]/40 cursor-default'
                      : isUnlocked
                      ? 'bg-[#fffdf8] border-[#d6cdbc] text-[#4a443c] hover:border-[#8b1e1e] hover:text-[#1f1c18] cursor-pointer active:scale-95'
                      : 'bg-[#fffdf8]/80 border-[#c8bfae] text-[#7c7265] cursor-not-allowed opacity-50'
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
                    <span className="text-[9px] bg-[#fffdf8]/40 px-1 py-0.5 rounded text-[#1f1c18] font-typewriter font-bold">Aktif</span>
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
            className="px-3 py-1.5 rounded-sm bg-[#8b1e1e]/70 border border-[#8b1e1e]/60 text-[#faf6ed] text-xs font-typewriter font-bold hover:bg-[#8b1e1e]/80 transition-all flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Açık Zarfa Dön (Zarf {effectiveUnlocked})</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#faf6ed]" />
          </button>
        )}
      </div>

      {/* Archive Warning Banner when reviewing previous envelopes */}
      {currentEnvelope < effectiveUnlocked && (
        <div className="p-3 bg-[#fffdf8]/40 border border-[#8b1e1e]/50 rounded-sm text-xs text-[#8b1e1e] flex flex-wrap items-center justify-between gap-3 shadow-md">
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
            className="px-2.5 py-1 rounded-sm bg-[#8b1e1e] text-[#faf6ed] font-bold text-xs hover:bg-[#701616] transition-all cursor-pointer shrink-0"
          >
            Zarf {effectiveUnlocked}’e Git →
          </button>
        </div>
      )}

      {/* Detective & Envelope Header Bar */}
      <div className="bg-[#fffdf8] border border-[#d6cdbc] rounded-sm p-4 flex flex-wrap items-center justify-between gap-3 shadow-[0_2px_12px_rgba(31,28,24,0.07)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-[#8b1e1e]/10 border border-[#8b1e1e]/30 flex items-center justify-center font-bold text-[#8b1e1e] font-typewriter text-sm">
            Z{currentEnvelope}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-typewriter font-bold text-sm text-[#1f1c18]">
                ZARF {currentEnvelope} &mdash; ADLİ SORUŞTURMA
              </span>
              <span className="text-[10px] bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 font-typewriter px-2 py-0.5 rounded font-bold">
                CANLI SENKRON
              </span>
            </div>
            <p className="text-[11px] text-[#4a443c]">
              Masa Şefi: <strong className="text-[#1f1c18]">{player.name}</strong> ({player.role.toUpperCase()})
            </p>
          </div>
        </div>

        {/* View Scope Toggle: Specialist vs All Envelope Files */}
        {allEnvelopeEvidence.length > 1 && (
          <div className="flex bg-[#fffdf8] border border-[#d6cdbc] p-1 rounded-sm text-xs">
            <button
              type="button"
              onClick={() => {
                soundManager.playKeyClick();
                setViewScope('specialist');
              }}
              className={`px-3 py-1.5 rounded-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewScope === 'specialist'
                  ? 'bg-[#8b1e1e] text-[#faf6ed] shadow-sm'
                  : 'text-[#4a443c] hover:text-[#1f1c18]'
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
              className={`px-3 py-1.5 rounded-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewScope === 'all'
                  ? 'bg-[#8b1e1e] text-[#faf6ed] shadow-sm'
                  : 'text-[#4a443c] hover:text-[#1f1c18]'
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
        <div className="bg-[#fffdf8] border border-[#d6cdbc]/90 rounded-sm p-2.5 sm:p-3 shadow-[0_2px_12px_rgba(31,28,24,0.07)] space-y-2.5">
          {/* Top Row: Prev Arrow, Numbered Buttons (Belge 1, Belge 2, ...), Next Arrow */}
          <div className="flex items-center justify-between gap-2">
            
            {/* Prev Arrow */}
            <button
              type="button"
              onClick={handlePrevEvidence}
              disabled={safeCurrentIndex <= 0}
              className={`p-2 rounded-sm border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                safeCurrentIndex <= 0
                  ? 'border-[#d6cdbc] text-[#7c7265] bg-[#fffdf8]/40 cursor-not-allowed opacity-40'
                  : 'border-[#c8bfae] text-[#4a443c] bg-[#fffdf8] hover:border-[#8b1e1e] hover:text-[#1f1c18] active:scale-95'
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-sm text-xs font-semibold transition-all border cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-[#8b1e1e] text-[#faf6ed] border-[#701616] shadow-md font-bold ring-1 ring-[#701616]/40'
                        : 'bg-[#fffdf8]/90 border-[#d6cdbc] text-[#4a443c] hover:border-[#c8bfae] hover:text-[#1f1c18]'
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
              className={`p-2 rounded-sm border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                safeCurrentIndex >= displayedEvidenceList.length - 1
                  ? 'border-[#d6cdbc] text-[#7c7265] bg-[#fffdf8]/40 cursor-not-allowed opacity-40'
                  : 'border-[#c8bfae] text-[#4a443c] bg-[#fffdf8] hover:border-[#8b1e1e] hover:text-[#1f1c18] active:scale-95'
              }`}
              title="Sonraki Belge"
              aria-label="Sonraki Belge"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Active Document Header Strip: Counter + Full Title */}
          {activeEvidence && (
            <div className="flex items-center justify-between gap-2.5 px-3 py-2 bg-[#fffdf8]/80 border border-[#d6cdbc]/80 rounded-sm text-xs">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-[10px] font-typewriter font-bold px-2 py-0.5 rounded bg-[#8b1e1e]/10 border border-[#8b1e1e]/30 text-[#8b1e1e] shrink-0">
                  {safeCurrentIndex + 1} / {displayedEvidenceList.length}
                </span>
                <span className="text-[#1f1c18] font-semibold truncate text-xs sm:text-sm">
                  {activeEvidence.title}
                </span>
              </div>
              <span className="text-[10px] font-typewriter text-[#7c7265] uppercase tracking-wider shrink-0 hidden sm:inline-block">
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
        <div className="bg-[#fffdf8] border border-[#d6cdbc] rounded-sm p-5 sm:p-8 shadow-[0_2px_12px_rgba(31,28,24,0.07)] relative text-[#1f1c18] space-y-4">
          
          {/* Top Stamp & Case Reference */}
          <div className="flex items-center justify-between pb-3 border-b border-[#d6cdbc]">
            <span className="text-[11px] font-typewriter text-[#8b1e1e] uppercase tracking-widest">
              T.C. ADLİ TAHKİKAT VE SUÇ DOSYASI · {activeEvidence.metadata?.caseRef || 'ATK-2026'}
            </span>
            <span className="text-[10px] font-typewriter px-2 py-0.5 rounded-sm border border-[#8b1e1e] bg-[#8b1e1e] text-[#faf6ed] font-bold">
              {activeEvidence.metadata?.confidentiality || 'GİZLİ'}
            </span>
          </div>

          {/* Dossier Title */}
          <h3 className="text-base sm:text-lg font-bold text-[#1f1c18]">
            {activeEvidence.title}
          </h3>

          {/* Optional Document Voice Narration Player */}
          {activeEvidence.narrationUrl && (
            <div className="p-3 bg-[#faf6ed] border border-[#c8bfae] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <span className="flex items-center gap-2 text-xs font-typewriter font-bold text-[#1f1c18] shrink-0">
                <Headphones className="w-4 h-4 text-[#8b1e1e]" />
                <span>BELGEYİ SESLİ DİNLE</span>
              </span>
              <audio
                key={activeEvidence.narrationUrl}
                src={activeEvidence.narrationUrl}
                controls
                preload="none"
                className="w-full sm:max-w-sm h-8 accent-[#8b1e1e]"
                onPlay={() => setIsPlayingAudio(true)}
                onPause={() => setIsPlayingAudio(false)}
              />
            </div>
          )}

          {/* Police Interrogation Stamp Banner */}
          {activeEvidence.category === 'interrogation' && (
            <div className="p-3.5 bg-[#faf6ed] rounded-sm border border-[#c8bfae] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-sm bg-[#1f1c18] text-[#faf6ed] flex items-center justify-center shrink-0">
                  <Users2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-typewriter font-bold uppercase tracking-wider text-[#8b1e1e] block">
                    T.C. EMNİYET MÜDÜRLÜĞÜ · RESMİ SORGU & ÇAPRAZ İFADE ZAPTI
                  </span>
                  <p className="text-xs text-[#4a443c] font-medium">
                    Şüpheli / Tanık Beyanları, Çapraz Sorgu Tutanakları ve İfade Çelişkileri
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-typewriter px-2.5 py-1 rounded-sm border border-[#1f1c18] text-[#1f1c18] shrink-0 font-bold uppercase">
                POLİS SORGUSU
              </span>
            </div>
          )}

          {/* Audio Wiretap / Recording Station */}
          {(activeEvidence.mediaType === 'audio' || activeEvidence.category === 'audio') && (
            <div className="p-4 bg-[#fffdf8] rounded-sm border border-[#8b1e1e]/30 space-y-3">
              <div className="flex items-center justify-between text-xs font-typewriter">
                <span className="flex items-center gap-2 text-[#8b1e1e] font-bold">
                  <Headphones className="w-4 h-4 animate-pulse" />
                  <span>SES KAYDI & TELEFON DİNLEME TUTANAĞI</span>
                </span>
                <span className="text-[10px] text-[#4a443c] bg-[#fffdf8] px-2 py-0.5 rounded border border-[#d6cdbc]">
                  {isPlayingAudio ? '● OYNATILIYOR' : 'DURDURULDU'}
                </span>
              </div>

              {activeEvidence.mediaUrl ? (
                <div className="pt-1">
                  <audio
                    src={activeEvidence.mediaUrl}
                    controls
                    className="w-full accent-[#8b1e1e] rounded-lg"
                    onPlay={() => setIsPlayingAudio(true)}
                    onPause={() => setIsPlayingAudio(false)}
                  />
                  {activeEvidence.mediaCaption && (
                    <p className="text-[11px] text-[#4a443c] mt-1 italic font-typewriter">{activeEvidence.mediaCaption}</p>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-[#fffdf8]/60 rounded-sm border border-[#d6cdbc]/80 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-xs text-[#1f1c18] font-semibold font-typewriter">
                      🎙️ {activeEvidence.mediaCaption || '112 & Telsiz Dinleme Bandı'}
                    </p>
                    <p className="text-[11px] text-[#4a443c]">
                      Ses çözümü aşağıdaki resmi metin tutanağına aktarılmıştır.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playKeyClick();
                      soundManager.playSuccessSound();
                    }}
                    className="px-3 py-1.5 bg-[#8b1e1e] hover:bg-[#701616] text-[#faf6ed] rounded-sm text-xs font-bold font-typewriter transition-colors shrink-0 cursor-pointer"
                  >
                    Bandı Oynat
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Crime Scene Photo Embed */}
          {activeEvidence.mediaType === 'image' && activeEvidence.mediaUrl && (
            <div className="p-3.5 bg-[#fffdf8] rounded-sm border border-[#d6cdbc] space-y-2">
              <div className="flex items-center justify-between text-xs font-typewriter">
                <span className="flex items-center gap-2 text-[#4a443c] font-bold">
                  <ImageIcon className="w-4 h-4 text-[#8b1e1e]" />
                  <span>OLAY YERİ DELİL FOTOĞRAFI</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="text-[11px] text-[#8b1e1e] hover:text-[#701616] font-medium cursor-pointer"
                >
                  Büyüt 🔍
                </button>
              </div>

              <div 
                onClick={() => setIsPhotoModalOpen(true)}
                className="relative rounded-sm overflow-hidden border border-[#d6cdbc] max-h-72 cursor-pointer group bg-black flex items-center justify-center"
              >
                <img
                  src={activeEvidence.mediaUrl}
                  alt={activeEvidence.title}
                  className="w-full h-auto max-h-72 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-lg bg-[#fffdf8]/90 text-[#8b1e1e] text-xs font-bold border border-[#8b1e1e]/40">
                    Büyük Boy İncele
                  </span>
                </div>
              </div>

              {activeEvidence.mediaCaption && (
                <p className="text-[11px] text-[#4a443c] italic font-typewriter pt-1">
                  {activeEvidence.mediaCaption}
                </p>
              )}
            </div>
          )}

          {/* CCTV Surveillance Video Player */}
          {activeEvidence.mediaType === 'video' && (
            <div className="p-3.5 sm:p-4 bg-[#fffdf8] rounded-sm border border-[#8b1e1e]/30 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-typewriter">
                <span className="flex items-center gap-2 text-[#8b1e1e] font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8b1e1e] animate-ping inline-block" />
                  <Video className="w-4 h-4 text-[#8b1e1e]" />
                  <span>CCTV GÜVENLİK KAMERASI · [CAM-02 ÇEVRE KAYDI]</span>
                </span>
                <span className="text-[10px] text-[#4a443c] bg-[#fffdf8] px-2 py-0.5 rounded border border-[#d6cdbc]">
                  REC ● 23:45:12
                </span>
              </div>

              {activeEvidence.mediaUrl ? (
                <div className="relative rounded-sm overflow-hidden border border-[#d6cdbc] bg-black">
                  {getVideoEmbedUrl(activeEvidence.mediaUrl) ? (
                    <div className="relative aspect-video w-full">
                      <iframe
                        src={getVideoEmbedUrl(activeEvidence.mediaUrl)}
                        title={activeEvidence.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <video
                      src={activeEvidence.mediaUrl}
                      controls
                      playsInline
                      className="w-full max-h-80 object-contain bg-black"
                    />
                  )}
                  {/* Subtle CCTV timestamp watermark overlay */}
                  <div className="absolute top-2 left-2 pointer-events-none px-2 py-0.5 rounded bg-black/60 text-[10px] font-typewriter text-emerald-400 border border-emerald-500/30">
                    CAM_SEC_02 · {activeEvidence.metadata?.date || '2026-11-04'}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-[#fffdf8]/60 rounded-sm border border-[#d6cdbc]/80 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-xs text-[#1f1c18] font-semibold font-typewriter">
                      📹 {activeEvidence.mediaCaption || 'Güvenlik Kamerası Video Bandı İncelendi'}
                    </p>
                    <p className="text-[11px] text-[#4a443c]">
                      Kamera görüntüleri ve hareket logları aşağıdaki resmi rapora aktarılmıştır.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playKeyClick();
                      soundManager.playSuccessSound();
                    }}
                    className="px-3 py-1.5 bg-[#8b1e1e]/80 hover:bg-[#8b1e1e] border border-[#701616]/50 text-[#faf6ed] rounded-sm text-xs font-bold font-typewriter transition-colors shrink-0 cursor-pointer"
                  >
                    Kayıt Logunu Aç
                  </button>
                </div>
              )}

              {activeEvidence.mediaCaption && (
                <p className="text-[11px] text-[#4a443c] italic font-typewriter pt-1">
                  {activeEvidence.mediaCaption}
                </p>
              )}
            </div>
          )}

          {/* Summary Box */}
          <div className="p-3.5 bg-[#fffdf8] rounded-sm border border-[#d6cdbc]/80">
            <span className="text-[10px] font-typewriter text-[#7c7265] uppercase tracking-wider block mb-1">
              ÖZET BULGU:
            </span>
            <p className="text-xs sm:text-sm text-[#1f1c18] leading-relaxed font-typewriter max-h-80 overflow-y-auto">
              {activeEvidence.summary}
            </p>
          </div>

          {/* Official Report Text */}
          <div>
            <span className="text-[10px] font-typewriter uppercase tracking-wider text-[#7c7265] block mb-1.5">
              RESMİ RAPOR METNİ:
            </span>
            <div className="p-4 bg-[#fffdf8]/70 border border-[#d6cdbc]/80 rounded-sm text-xs sm:text-sm text-[#4a443c] whitespace-pre-line leading-relaxed font-typewriter max-h-80 overflow-y-auto">
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
              className="w-full py-3.5 bg-[#8b1e1e] hover:bg-[#701616] text-[#faf6ed] font-bold rounded-sm text-xs sm:text-sm transition-all shadow-[0_2px_12px_rgba(31,28,24,0.07)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>← Arşivden Çık: Güncel Açık Zarfa Dön (Zarf {effectiveUnlocked})</span>
              <ArrowRight className="w-4 h-4 text-[#faf6ed]" />
            </button>
            {effectiveUnlocked >= totalEnvelopes && (
              <button
                type="button"
                onClick={onGoToAccusation}
                className="w-full py-3 bg-[#fffdf8] hover:bg-[#d6cdbc] border border-[#c8bfae] text-[#4a443c] font-medium rounded-sm text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-[#8b1e1e]" />
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
            className="w-full py-3.5 bg-[#fffdf8] hover:bg-[#d6cdbc] border-2 border-[#8b1e1e]/60 hover:border-[#8b1e1e] text-[#8b1e1e] font-bold rounded-sm text-xs sm:text-sm transition-all shadow-[0_2px_12px_rgba(31,28,24,0.07)] flex items-center justify-center gap-2 cursor-pointer ring-2 ring-[#8b1e1e]/20"
          >
            <span>✓ Zarf {effectiveUnlocked} İncelendi — Zarf {effectiveUnlocked + 1}’i Aç</span>
            <ArrowRight className="w-4 h-4 text-[#8b1e1e]" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onGoToAccusation}
            className="w-full py-3.5 bg-[#276749] hover:bg-[#36312b] text-white font-bold rounded-sm text-xs sm:text-sm transition-all shadow-[0_2px_12px_rgba(31,28,24,0.07)] flex items-center justify-center gap-2 animate-pulse cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>✓ Son Zarf ({totalEnvelopes}) Tamamlandı — Final Suçlama ve Test Aşamasına Geç &rarr;</span>
          </button>
        )}
        <p className="text-[11px] text-[#4a443c] text-center font-typewriter">
          * İstediğiniz zaman yukarıdaki zarf sekmelerinden önceki zarflara dönüp belgeleri tekrar inceleyebilirsiniz.
        </p>
      </div>

      {/* Forensic Photo Zoom Lightbox Modal */}
      {isPhotoModalOpen && activeEvidence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center bg-[#fffdf8] border border-[#d6cdbc] rounded-sm p-4 shadow-[0_2px_12px_rgba(31,28,24,0.07)]">
            <button
              type="button"
              onClick={() => setIsPhotoModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#4a443c] hover:text-[#1f1c18] bg-[#fffdf8]/80 hover:bg-[#d6cdbc] rounded-sm transition-colors cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="overflow-hidden rounded-sm w-full flex items-center justify-center bg-black">
              <img
                src={activeEvidence.mediaUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80'}
                alt={activeEvidence.title}
                className="max-h-[75vh] w-auto object-contain rounded-sm"
              />
            </div>
            <div className="w-full pt-3 px-2 flex items-center justify-between text-xs text-[#4a443c]">
              <span className="font-typewriter text-[#8b1e1e] font-bold uppercase tracking-wider">
                [DELİL İNCELEME - BÜYÜTÜLMÜŞ GÖRÜNTÜ]
              </span>
              <span className="font-typewriter text-[#4a443c]">{activeEvidence.mediaCaption || activeEvidence.title}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
