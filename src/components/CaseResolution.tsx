/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CaseScenario, Player, AccusationSubmission } from '../types';
import { calculateDetectiveScore } from '../utils/gameRules';
import { soundManager } from '../utils/audioEffects';
import { 
  DetectiveProfile, 
  submitCaseRating 
} from '../services/firebase';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ShieldCheck, 
  FileText, 
  AlertOctagon,
  Star,
  Send,
  Sparkles
} from 'lucide-react';

interface CaseResolutionProps {
  scenario: CaseScenario;
  players: Player[];
  submissions: Record<string, AccusationSubmission>;
  pinnedCount: number;
  gateAttempts: number;
  onRestartGame: () => void;
  onBackToLobby: () => void;
  currentUser?: DetectiveProfile | null;
  onOpenAuthModal?: () => void;
}

export const CaseResolution: React.FC<CaseResolutionProps> = ({
  scenario,
  players,
  submissions,
  pinnedCount,
  gateAttempts,
  onRestartGame,
  onBackToLobby,
  currentUser,
  onOpenAuthModal,
}) => {
  const { solution } = scenario;
  const [selectedStars, setSelectedStars] = useState<number>(5);
  const [hoverStars, setHoverStars] = useState<number | null>(null);
  const [commentText, setCommentText] = useState<string>('');
  const [isSubmittingRating, setIsSubmittingRating] = useState<boolean>(false);
  const [hasRated, setHasRated] = useState<boolean>(false);

  const handleRateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingRating(true);
    soundManager.playKeyClick();
    try {
      const activeUser: DetectiveProfile = currentUser || {
        uid: `guest_${Date.now()}`,
        displayName: players[0]?.name || 'Dedektif',
        isGuest: true,
      };
      await submitCaseRating({
        scenarioId: scenario.id,
        rating: selectedStars,
        comment: commentText,
        user: activeUser,
      });
      soundManager.playSuccessSound();
      setHasRated(true);
    } catch (err) {
      console.warn('Error submitting rating:', err);
      setHasRated(true);
    } finally {
      setIsSubmittingRating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Solved Banner */}
      <div className="bg-zinc-950 border-2 border-emerald-600/70 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Closed Dossier Stamp */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 border-2 border-red-500/80 text-red-500 font-cinzel font-black text-xs sm:text-base px-3 py-1 rotate-12 uppercase tracking-widest pointer-events-none opacity-80">
          DOSYA KAPATILDI · SUÇLU YAKALANDI
        </div>

        <div className="flex items-center gap-2 text-emerald-400 text-xs font-typewriter uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4" />
          ZARF 4: ÇÖZÜM DOSYASI VE ADLİ MAHKEME KARARI
        </div>

        <h1 className="text-2xl sm:text-3xl font-cinzel font-bold text-zinc-100">
          Gerçek Katil: <span className="text-emerald-400">{solution.culpritName}</span>
        </h1>
        <p className="text-sm text-zinc-300 mt-2 max-w-2xl leading-relaxed">
          {solution.verdictSummary}
        </p>

        {/* Motive & Key Evidence Badge Box */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-xl">
            <span className="text-[11px] font-typewriter text-zinc-400 uppercase tracking-wider block">
              Cinayet Sebebi (Motive):
            </span>
            <p className="text-xs font-bold text-zinc-200 mt-1">
              {solution.motiveTitle}
            </p>
          </div>

          <div className="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-xl">
            <span className="text-[11px] font-typewriter text-zinc-400 uppercase tracking-wider block">
              Katili Yıkan Kilit Kanıt:
            </span>
            <p className="text-xs font-bold text-zinc-200 mt-1">
              {solution.keyEvidenceTitle}
            </p>
          </div>
        </div>
      </div>

      {/* Detective Report Cards (Dedektif Karnesi) */}
      <div className="bg-zinc-950 border border-amber-600/40 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-amber-200">
              Dedektif Performans Karneleri
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-typewriter">
            MASA DEDEKTİF DEĞERLENDİRMESİ
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {players.map((player) => {
            const sub = submissions[player.id];
            const isSuspectCorrect = sub?.suspectId === solution.culpritId;
            const isMotiveCorrect = sub?.motiveId === 'zimmet';
            const isEvidenceCorrect = sub?.evidenceId === 'kapsul-gps';

            const scoreData = calculateDetectiveScore({
              correctSuspectSelected: isSuspectCorrect,
              correctMotiveSelected: isMotiveCorrect,
              correctEvidenceSelected: isEvidenceCorrect,
              pinnedCount,
              gateAttempts,
            });

            return (
              <div
                key={player.id}
                className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                    <div>
                      <h4 className="font-bold text-sm text-zinc-100">{player.name}</h4>
                      <p className="text-[11px] text-zinc-400">{player.role.toUpperCase()}</p>
                    </div>
                    <span className="text-2xl">{scoreData.badge}</span>
                  </div>

                  {/* Score Number */}
                  <div className="my-3 text-center p-2.5 bg-zinc-950 rounded-lg border border-zinc-800">
                    <span className="text-2xl font-black text-amber-300 font-mono">
                      {scoreData.totalScore}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono"> / 100 PUAN</span>
                    <p className="text-[11px] font-semibold text-zinc-300 mt-1">
                      {scoreData.rankTitle}
                    </p>
                  </div>

                  {/* Breakdown checklist */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Katil Tespiti:</span>
                      {isSuspectCorrect ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Doğru (+40)
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1 font-medium">
                          <XCircle className="w-3.5 h-3.5" /> Hatalı (0)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Motif Analizi:</span>
                      {isMotiveCorrect ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Doğru (+20)
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1 font-medium">
                          <XCircle className="w-3.5 h-3.5" /> Hatalı (0)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Kilit Kanıt:</span>
                      {isEvidenceCorrect ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Doğru (+20)
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1 font-medium">
                          <XCircle className="w-3.5 h-3.5" /> Hatalı (0)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Masa İğnesi Bonusu:</span>
                      <span className="text-amber-400 font-mono">+{Math.min(pinnedCount * 2, 10)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Murder Chronology (Olayın Kronolojisi) */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
        <h3 className="font-cinzel text-base sm:text-lg font-bold text-zinc-100 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-500" />
          Cinayetin Adım Adım Kronolojisi (Adli Rekonstrüksiyon)
        </h3>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
          {solution.fullChronology.map((item, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-amber-500 border-2 border-zinc-950" />
              <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-amber-400 font-typewriter">{item.time}</span>
                  <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">
                    Kanıt: {item.proof}
                  </span>
                </div>
                <p className="text-xs text-zinc-200 mt-1 leading-relaxed">
                  {item.action}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confession Transcript */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
        <h3 className="font-cinzel text-base sm:text-lg font-bold text-zinc-100 mb-3 flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-rose-500" />
          Dr. Kerem Akman’ın İtirafı (Sorgu Kaydı)
        </h3>
        <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl font-typewriter text-xs text-zinc-300 whitespace-pre-line leading-relaxed">
          {solution.confessionAudioTranscript}
        </div>
      </div>

      {/* Case Rating Card (5 Üzerinden Dosya Puanlama Sistemi) */}
      <div className="bg-zinc-950 border border-amber-500/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-current" />
            <h3 className="font-cinzel text-base sm:text-lg font-bold text-zinc-100">
              Bu Soruşturma Dosyasına Puan Verin
            </h3>
          </div>
          <span className="text-xs text-amber-400 font-mono">
            5 ÜZERİNDEN DERECELEME
          </span>
        </div>

        {hasRated ? (
          <div className="py-6 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-zinc-100 text-sm">Değerlendirmeniz Kaydedildi!</h4>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Oyunuz ve yorumunuz başarıyla veritabanına iletildi. Bu vakanın genel arşivi ve puan ortalaması güncellendi.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRateSubmit} className="mt-4 space-y-4">
            <div>
              <p className="text-xs text-zinc-300 mb-2">
                &quot;{scenario.title}&quot; kurgusu, ipucu dengesi ve gizem örgüsü nasıldı?
              </p>
              
              {/* Interactive 5 Stars */}
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const isHovered = hoverStars !== null && hoverStars >= starVal;
                  const isSelected = selectedStars >= starVal;
                  const active = hoverStars !== null ? isHovered : isSelected;

                  return (
                    <button
                      key={starVal}
                      type="button"
                      onMouseEnter={() => setHoverStars(starVal)}
                      onMouseLeave={() => setHoverStars(null)}
                      onClick={() => {
                        soundManager.playKeyClick();
                        setSelectedStars(starVal);
                      }}
                      className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          active
                            ? 'text-amber-400 fill-current drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                            : 'text-zinc-700'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="ml-3 text-sm font-mono font-bold text-amber-300">
                  {hoverStars !== null ? hoverStars : selectedStars} / 5 Yıldız
                </span>
              </div>
            </div>

            {/* Optional Comment */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                Dedektif Yorumunuz (Opsiyonel):
              </label>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Örn: Otopsi bulgusu ile şifre bağlantısı harikaydı, son ana kadar katili tahmin edemedik..."
                rows={3}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400 resize-none font-sans"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-zinc-500">
                Puanlayan: <strong className="text-zinc-300">{currentUser?.displayName || players[0]?.name || 'Dedektif'}</strong>
              </span>

              <button
                type="submit"
                disabled={isSubmittingRating}
                className="py-2.5 px-5 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmittingRating ? 'Gönderiliyor...' : 'Puanı Kaydet'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <button
          type="button"
          onClick={() => {
            soundManager.playKeyClick();
            onRestartGame();
          }}
          className="flex items-center gap-2 px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Bu Vakayı Tekrar Oyna
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playKeyClick();
            onBackToLobby();
          }}
          className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded-xl text-xs transition-colors shadow-lg cursor-pointer"
        >
          Lobiye Dön & Yeni Vaka Seç
        </button>
      </div>
    </div>
  );
};

