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
  CheckCircle2,
  Volume2,
  Play,
  Pause,
  Video,
  Image as ImageIcon,
  Maximize2,
  X,
  Headphones,
  Radio
} from 'lucide-react';

interface PlayerInboxViewProps {
  player: Player;
  allPlayers?: Player[];
  totalPlayers?: number;
  currentEnvelope: EnvelopeNumber;
  totalEnvelopes?: number;
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
  totalEnvelopes = 3,
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
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);

  // Sync selected evidence when envelope or player changes
  useEffect(() => {
    if (myEvidence.length > 0) {
      setSelectedEvidenceId(myEvidence[0].id);
    } else {
      setSelectedEvidenceId(null);
    }
    setIsPlayingAudio(false);
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
                /* Interactive Simulated Wiretap Deck */
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playKeyClick();
                        setIsPlayingAudio((prev) => !prev);
                      }}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-zinc-950 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{isPlayingAudio ? 'Kaydı Durdur' : 'Teybi Dinle'}</span>
                    </button>
                    
                    {/* Simulated Waveform */}
                    <div className="flex items-center gap-1 h-6 px-3">
                      {[12, 24, 18, 32, 20, 28, 14, 26, 30, 16, 22, 10, 24, 18, 28, 14].map((h, i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-full transition-all duration-300 ${
                            isPlayingAudio ? 'bg-amber-400 animate-pulse' : 'bg-zinc-700'
                          }`}
                          style={{ height: isPlayingAudio ? `${Math.max(6, (h * (i % 3 + 1)) % 24)}px` : '6px' }}
                        />
                      ))}
                    </div>

                    <span className="text-[11px] font-mono text-zinc-400">
                      {isPlayingAudio ? '01:24 / 03:10' : '00:00 / 03:10'}
                    </span>
                  </div>
                  {activeEvidence.mediaCaption && (
                    <p className="text-[11px] text-zinc-400 italic font-sans">{activeEvidence.mediaCaption}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Visual Evidence / Crime Scene Polaroid */}
          {(activeEvidence.mediaType === 'image' || (activeEvidence.mediaUrl && activeEvidence.mediaUrl.match(/\.(jpg|jpeg|png|webp|gif)/i))) && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>OLAY YERİ / DELİL GÖRSELİ</span>
              </span>
              <div 
                onClick={() => setIsPhotoModalOpen(true)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 hover:border-amber-500/60 transition-all shadow-lg"
              >
                <img
                  src={activeEvidence.mediaUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'}
                  alt={activeEvidence.title}
                  className="w-full max-h-72 object-cover object-center group-hover:scale-102 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex items-end justify-between p-3.5">
                  <span className="text-xs text-zinc-200 font-medium font-sans">
                    {activeEvidence.mediaCaption || activeEvidence.title}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-amber-400 bg-zinc-950/80 px-2.5 py-1 rounded-lg border border-amber-500/40 font-mono">
                    <Maximize2 className="w-3 h-3" /> İncele / Büyüt
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Video / Surveillance Camera Embed */}
          {activeEvidence.mediaType === 'video' && (
            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-2 text-rose-400 font-bold">
                  <Video className="w-4 h-4" />
                  <span>GÜVENLİK KAMERASI / SORGULAMA VİDEOSU</span>
                </span>
                <span className="text-[10px] text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-800 font-bold flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> REC [CAM-02]
                </span>
              </div>

              {activeEvidence.mediaUrl && (activeEvidence.mediaUrl.includes('youtube.com') || activeEvidence.mediaUrl.includes('youtu.be') || activeEvidence.mediaUrl.includes('vimeo.com')) ? (
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-zinc-800 bg-black">
                  <iframe
                    src={activeEvidence.mediaUrl.replace('watch?v=', 'embed/')}
                    title={activeEvidence.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : activeEvidence.mediaUrl ? (
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-zinc-800 bg-black">
                  <video
                    src={activeEvidence.mediaUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full rounded-xl border border-zinc-800 bg-zinc-900/80 flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <Video className="w-10 h-10 text-zinc-600 animate-pulse" />
                  <p className="text-xs font-mono text-zinc-300 font-semibold">[KAPALI DEVRE SORGULAMA KAMERASI]</p>
                  <p className="text-[11px] text-zinc-500 max-w-sm">
                    {activeEvidence.mediaCaption || 'Kamera kaydı emniyet sunucusunda arşivlenmiştir. Çözüm tutanağı aşağıdaki resmi rapor metnindedir.'}
                  </p>
                </div>
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

          {/* Single Pin to Common Board Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playPinSound();
                onPinEvidence(
                  activeEvidence.title,
                  activeEvidence.summary,
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
          {currentEnvelope < totalEnvelopes ? (
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
              <span>✓ Son Zarf ({totalEnvelopes}) Tamamlandı - Final Katil Suçlama Aşamasına Geç</span>
            </button>
          )}
        </div>
      )}

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
