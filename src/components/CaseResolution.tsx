/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { CaseScenario, Player, AccusationSubmission } from '../types';
import { calculateDetectiveScore, evaluateTableVerdict } from '../utils/gameRules';
import { soundManager } from '../utils/audioEffects';
import { 
  DetectiveProfile, 
  submitCaseRating,
  recordDetectiveMatchResult,
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
  Trophy,
  Users2,
  FileCheck,
  Check,
  X
} from 'lucide-react';

interface CaseResolutionProps {
  scenario: CaseScenario;
  players: Player[];
  submissions: Record<string, AccusationSubmission>;
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
  gateAttempts,
  onRestartGame,
  onBackToLobby,
  currentUser,
}) => {
  const { solution } = scenario;
  const [selectedStars, setSelectedStars] = useState<number>(5);
  const [hoverStars, setHoverStars] = useState<number | null>(null);
  const [commentText, setCommentText] = useState<string>('');
  const [isSubmittingRating, setIsSubmittingRating] = useState<boolean>(false);
  const [hasRated, setHasRated] = useState<boolean>(false);

  // Evaluate collective table verdict
  const votesList = Object.values(submissions).map((s) => ({
    suspectId: s.suspectId,
  }));
  const tableVerdict = evaluateTableVerdict(votesList, solution.culpritId);
  const majoritySuspect = scenario.suspects.find((s) => s.id === tableVerdict.majoritySuspectId);
  const hasRecordedRankRef = useRef<string | null>(null);

  useEffect(() => {
    if (!currentUser || currentUser.isGuest) return;
    if (hasRecordedRankRef.current === scenario.id) return;
    hasRecordedRankRef.current = scenario.id;

    const mySub =
      submissions[currentUser.uid] ||
      Object.values(submissions).find((s) => s.playerName === currentUser.displayName) ||
      submissions[players[0]?.id || ''];
    const isSuspectCorrect = mySub?.suspectId === solution.culpritId;
    const isMotiveCorrect = mySub?.motiveId === 'motive-solution';
    const isEvidenceCorrect = mySub?.evidenceId === 'evidence-solution';
    const gateEntries = Object.entries(scenario.gates || {});
    let quizCorrectCount = 0;
    if (mySub?.quizAnswers) {
      gateEntries.forEach(([envNumStr, gate]) => {
        const selectedOptionId = mySub.quizAnswers?.[Number(envNumStr)];
        if (gate.options.some((opt) => opt.id === selectedOptionId && opt.isCorrect)) {
          quizCorrectCount++;
        }
      });
    }
    const myScore = calculateDetectiveScore({
      correctSuspectSelected: isSuspectCorrect,
      correctMotiveSelected: isMotiveCorrect,
      correctEvidenceSelected: isEvidenceCorrect,
      quizCorrectCount,
      quizTotalCount: gateEntries.length,
      gateAttempts,
    });

    recordDetectiveMatchResult(currentUser, {
      caseId: scenario.id,
      score: myScore.totalScore,
      rankTitle: myScore.rankTitle,
      solved: tableVerdict.isWon || isSuspectCorrect,
    });
  }, [currentUser, scenario, submissions, players, gateAttempts, solution, tableVerdict.isWon]);

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
      
      {/* 1. MASA OYUNU SONUCU: ÇOĞUNLUK OYU İLE KAZANMA / KAYBETME BANNERI */}
      {tableVerdict.isWon ? (
        <div className="bg-[#f0f7f2] border-2 border-[#276749] rounded-sm p-6 sm:p-8 shadow-[0_2px_12px_rgba(31,28,24,0.07)] relative overflow-hidden">
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 border-2 border-[#276749] text-[#276749] font-typewriter font-black text-xs sm:text-sm px-3 py-1 rotate-3 uppercase tracking-widest pointer-events-none opacity-85">
            MASA KAZANDI · VAKA ÇÖZÜLDÜ
          </div>

          <div className="flex items-center gap-2 text-[#276749] text-xs font-typewriter uppercase tracking-wider mb-2">
            <Trophy className="w-5 h-5 text-[#276749]" />
            <span>ORTAK MASA KARARI: BAŞARILI SORUŞTURMA</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-cinzel font-black text-[#1f1c18]">
            Tebrikler Dedektifler! Masa Oyunu Kazandı!
          </h2>

          <p className="text-sm text-[#4a443c] mt-2 max-w-2xl leading-relaxed">
            Masanın çoğunluğu (<strong>{tableVerdict.majorityCount} / {tableVerdict.totalVotes} oy</strong>, %{tableVerdict.percentage}) 
            doğru şüpheliyi (<strong>{solution.culpritName}</strong>) suçlayarak gerçeği ortaya çıkardı. Sahte ipuçları ve yanıltıcı husumetler sizi yanıltamadı!
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-typewriter">
            <div className="px-3 py-1.5 bg-[#fffdf8] border border-[#276749]/40 rounded-sm text-[#276749] flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Gerçek Katil: <strong>{solution.culpritName}</strong></span>
            </div>
            <div className="px-3 py-1.5 bg-[#fffdf8] border border-[#c8bfae] rounded-sm text-[#4a443c]">
              Çoğunluk Oy Oranı: %{tableVerdict.percentage}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#fdf2f2] border-2 border-[#8b1e1e] rounded-sm p-6 sm:p-8 shadow-[0_2px_12px_rgba(31,28,24,0.07)] relative overflow-hidden">
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 border-2 border-[#8b1e1e] text-[#8b1e1e] font-typewriter font-black text-xs sm:text-sm px-3 py-1 -rotate-3 uppercase tracking-widest pointer-events-none opacity-85">
            MASA KAYBETTİ · KATİL KAÇTI
          </div>

          <div className="flex items-center gap-2 text-[#8b1e1e] text-xs font-typewriter uppercase tracking-wider mb-2">
            <AlertOctagon className="w-5 h-5 text-[#8b1e1e]" />
            <span>ORTAK MASA KARARI: YANILGI</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-cinzel font-black text-[#1f1c18]">
            Vaka Çözülemedi! Masa Çoğunluğu Yanıldı.
          </h2>

          <p className="text-sm text-[#4a443c] mt-2 max-w-2xl leading-relaxed">
            Masanın çoğunluğu {majoritySuspect ? `"${majoritySuspect.name}"` : 'farklı bir şüpheli'} üzerinde yoğunlaştı ({tableVerdict.majorityCount} / {tableVerdict.totalVotes} oy). 
            Ancak bu şüpheler aradaki kişisel husumetlerin ve yanıltıcı ipuçlarının birer tuzağıydı! Gerçek suçlu <strong>{solution.culpritName}</strong> delillerin arasından sıyrılarak cezasız kaldı.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-typewriter">
            <div className="px-3 py-1.5 bg-[#fffdf8] border border-[#8b1e1e]/40 rounded-sm text-[#8b1e1e] flex items-center gap-2">
              <X className="w-4 h-4" />
              <span>Masanın Tercihi: <strong>{majoritySuspect?.name || 'Belirsiz'}</strong></span>
            </div>
            <div className="px-3 py-1.5 bg-[#fffdf8] border border-[#276749]/40 rounded-sm text-[#276749] flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Asıl Katil: <strong>{solution.culpritName}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* 2. ZARF 4: RESMİ ÇÖZÜM DOSYASI */}
      <div className="bg-[#fffdf8] border border-[#d6cdbc] rounded-sm shadow-[0_2px_12px_rgba(31,28,24,0.07)] p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-2 text-[#1f1c18] text-xs font-typewriter uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>ZARF 4: ADLİ MAHKEME DOSYASI VE ÇÖZÜM REKONSTRÜKSİYONU</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-[#1f1c18]">
          Suçun Anatomisi: <span className="text-[#276749]">{solution.culpritName}</span>
        </h3>

        <p className="text-xs sm:text-sm text-[#4a443c] leading-relaxed bg-[#faf6ed] border border-[#c8bfae] p-4 rounded-sm">
          {solution.verdictSummary}
        </p>

        {/* Motive & Key Evidence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 bg-[#faf6ed] border border-[#c8bfae] rounded-sm">
            <span className="text-[11px] font-typewriter text-[#575046] uppercase tracking-wider block">
              Asıl Suç Sebebi (Gerçek Motif):
            </span>
            <p className="text-xs font-bold text-[#276749] mt-1">
              {solution.motiveTitle}
            </p>
          </div>

          <div className="p-3.5 bg-[#faf6ed] border border-[#c8bfae] rounded-sm">
            <span className="text-[11px] font-typewriter text-[#575046] uppercase tracking-wider block">
              Katili Ele Veren Kilit Kanıt:
            </span>
            <p className="text-xs font-bold text-[#276749] mt-1">
              {solution.keyEvidenceTitle}
            </p>
          </div>
        </div>
      </div>

      {/* 3. DEDEKTİF PERFORMANS KARNELERİ (BİREYSEL BAŞARI PUANLARI) */}
      <div className="bg-[#fffdf8] border border-[#c8bfae] rounded-sm p-6 shadow-[0_2px_12px_rgba(31,28,24,0.07)]">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#c8bfae]">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#1f1c18]" />
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#1f1c18]">
              Bireysel Dedektif Karneleri & Sınav Puanları
            </h3>
          </div>
          <span className="text-xs text-[#575046] font-typewriter">
            TEST SORULARI (40P) + ŞÜPHELİ (30P) + MOTİF (15P) + KANIT (15P)
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {players.map((player) => {
            const sub = submissions[player.id];
            const isSuspectCorrect = sub?.suspectId === solution.culpritId;
            const isMotiveCorrect = sub?.motiveId === 'motive-solution';
            const isEvidenceCorrect = sub?.evidenceId === 'evidence-solution';

            // Count quiz answers if any
            let quizCorrectCount = 0;
            const gateEntries = scenario.gates ? Object.entries(scenario.gates) : [];
            if (sub?.quizAnswers && gateEntries.length > 0) {
              gateEntries.forEach(([envNumStr, gate]) => {
                const selectedOptionId = sub.quizAnswers?.[Number(envNumStr)];
                const isCorrect = gate.options.some((opt) => opt.id === selectedOptionId && opt.isCorrect);
                if (isCorrect) {
                  quizCorrectCount++;
                }
              });
            }

            const scoreData = calculateDetectiveScore({
              correctSuspectSelected: isSuspectCorrect,
              correctMotiveSelected: isMotiveCorrect,
              correctEvidenceSelected: isEvidenceCorrect,
              quizCorrectCount,
              quizTotalCount: gateEntries.length,
              gateAttempts,
            });

            const displayScore = sub?.individualScore !== undefined ? sub.individualScore : scoreData.totalScore;

            return (
              <div
                key={player.id}
                className="bg-[#faf6ed] border border-[#c8bfae] rounded-sm p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#c8bfae]">
                    <div>
                      <h4 className="font-bold text-sm text-[#1f1c18]">{player.name}</h4>
                      <p className="text-[11px] text-[#575046]">{player.role.toUpperCase()}</p>
                    </div>
                    <span className="text-2xl">{scoreData.badge}</span>
                  </div>

                  {/* Score Number */}
                  <div className="my-3 text-center p-2.5 bg-[#faf6ed] rounded-sm border border-[#c8bfae]">
                    <span className="text-2xl font-black text-[#276749] font-typewriter">
                      {displayScore}
                    </span>
                    <span className="text-xs text-[#575046] font-typewriter"> / 100 PUAN</span>
                    <p className="text-[11px] font-semibold text-[#4a443c] mt-1">
                      {scoreData.rankTitle}
                    </p>
                  </div>

                  {/* Breakdown checklist */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#575046]">Soruşturma Testi:</span>
                      <span className="text-[#276749] font-typewriter font-bold">
                        {scoreData.quizScore} / 40 Puan
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#575046]">Katil Tespiti:</span>
                      {isSuspectCorrect ? (
                        <span className="text-[#276749] flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Doğru (+30)
                        </span>
                      ) : (
                        <span className="text-[#8b1e1e] flex items-center gap-1 font-medium">
                          <XCircle className="w-3.5 h-3.5" /> Hatalı (0)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#575046]">Motif Analizi:</span>
                      {isMotiveCorrect ? (
                        <span className="text-[#276749] flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Doğru (+15)
                        </span>
                      ) : (
                        <span className="text-[#8b1e1e] flex items-center gap-1 font-medium">
                          <XCircle className="w-3.5 h-3.5" /> Hatalı (0)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#575046]">Kilit Kanıt:</span>
                      {isEvidenceCorrect ? (
                        <span className="text-[#276749] flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Doğru (+15)
                        </span>
                      ) : (
                        <span className="text-[#8b1e1e] flex items-center gap-1 font-medium">
                          <XCircle className="w-3.5 h-3.5" /> Hatalı (0)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. OLAYIN ADIM ADIM KRONOLOJİSİ */}
      {solution.fullChronology && solution.fullChronology.length > 0 && (
        <div className="bg-[#fffdf8] border border-[#d6cdbc] rounded-sm p-6">
          <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#1f1c18] mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#276749]" />
            Cinayetin / Sabotajın Adım Adım Kronolojisi (Adli Rekonstrüksiyon)
          </h3>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#c8bfae]">
            {solution.fullChronology.map((item, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#276749] border-2 border-[#276749]" />
                <div className="p-3 bg-[#faf6ed] border border-[#c8bfae] rounded-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#276749] font-typewriter">{item.time}</span>
                    <span className="text-[10px] bg-[#d6cdbc] px-2 py-0.5 rounded text-[#4a443c]">
                      Kanıt: {item.proof}
                    </span>
                  </div>
                  <p className="text-xs text-[#4a443c] mt-1 leading-relaxed">
                    {item.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. KATİLİN GİZLİ İTİRAF MEKTUBU & ADLİ İTİRAF ZAPTI */}
      {(solution.confessionLetter || solution.confessionAudioTranscript) && (
        <div className="bg-gradient-to-b from-[#fffdf8] via-[#faf6ed] to-[#fffdf8] border-2 border-[#8b1e1e] rounded-sm p-6 sm:p-8 shadow-[0_2px_12px_rgba(31,28,24,0.07)] relative overflow-hidden space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#8b1e1e]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-sm bg-[#8b1e1e] border border-[#8b1e1e] flex items-center justify-center text-[#faf6ed] shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-typewriter font-bold tracking-widest text-[#8b1e1e] uppercase block">
                  ADLİ EMANET KASASI · RESMİ DELİL #İTR-FINAL
                </span>
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#276749]">
                  Katilin Gizli İtiraf Mektubu & Suçun İtirafı
                </h3>
              </div>
            </div>
            <span className="text-[11px] font-typewriter px-3 py-1 rounded-sm bg-[#8b1e1e] border border-[#8b1e1e] text-[#faf6ed] font-bold">
              FAİL: {solution.culpritName.toUpperCase()}
            </span>
          </div>

          {solution.confessionLetter && (
            <div className="p-5 sm:p-6 bg-[#fffdf8] rounded-sm border border-[#8b1e1e] font-typewriter text-xs sm:text-sm text-[#4a443c] whitespace-pre-line leading-relaxed relative">
              <span className="text-[#8b1e1e] font-bold block mb-2 font-cinzel text-xs uppercase tracking-wider">
                [OYLAMA SONRASI AÇILAN GİZLİ İTİRAF BELGESİ]
              </span>
              {solution.confessionLetter}
            </div>
          )}

          {solution.confessionAudioTranscript && !solution.confessionLetter && (
            <div className="p-4 bg-[#fffdf8] border border-[#8b1e1e] rounded-sm font-typewriter text-xs text-[#4a443c] whitespace-pre-line leading-relaxed">
              {solution.confessionAudioTranscript}
            </div>
          )}
        </div>
      )}

      {/* 6. VAKA PUANLAMA (5 YILDIZ DERECELENDİRME) */}
      <div className="bg-[#fffdf8] border border-[#c8bfae] rounded-sm p-6 shadow-[0_2px_12px_rgba(31,28,24,0.07)] relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-[#c8bfae]">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-[#1f1c18] fill-current" />
            <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#1f1c18]">
              Bu Soruşturma Dosyasına Puan Verin
            </h3>
          </div>
          <span className="text-xs text-[#575046] font-typewriter">
            5 ÜZERİNDEN DERECELEME
          </span>
        </div>

        {hasRated ? (
          <div className="py-6 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#276749]/20 border border-[#276749] text-[#276749] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-[#1f1c18] text-sm">Değerlendirmeniz Kaydedildi!</h4>
            <p className="text-xs text-[#4a443c] max-w-md mx-auto">
              Oyunuz ve yorumunuz başarıyla iletildi. Bu vakanın genel arşivi ve puan ortalaması güncellendi.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRateSubmit} className="mt-4 space-y-4">
            <div>
              <p className="text-xs text-[#4a443c] mb-2">
                &quot;{scenario.title}&quot; kurgusu, ipucu dengesi ve gizem örgüsü nasıldı?
              </p>
              
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
                            ? 'text-[#1f1c18] fill-current drop-shadow-[0_0_8px_rgba(31,28,24,0.5)]'
                            : 'text-[#7c7265]'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="ml-3 text-sm font-typewriter font-bold text-[#276749]">
                  {hoverStars !== null ? hoverStars : selectedStars} / 5 Yıldız
                </span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-typewriter uppercase tracking-wider text-[#575046] block mb-1">
                Dedektif Yorumunuz (Opsiyonel):
              </label>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Örn: Ses kayıtları ve şüphelilerin aralarındaki husumetler çok gerçekçiydi..."
                rows={3}
                className="w-full px-3.5 py-2.5 bg-[#faf6ed] border border-[#c8bfae] rounded-sm text-xs text-[#4a443c] placeholder-[#7c7265] focus:outline-none focus:border-[#1f1c18] resize-none font-sans"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#7c7265]">
                Puanlayan: <strong className="text-[#1f1c18]">{currentUser?.displayName || players[0]?.name || 'Dedektif'}</strong>
              </span>

              <button
                type="submit"
                disabled={isSubmittingRating}
                className="py-2.5 px-5 bg-[#1f1c18] hover:bg-[#36312b] text-[#faf6ed] font-bold rounded-sm text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
          className="flex items-center gap-2 px-6 py-2.5 bg-[#1f1c18] hover:bg-[#36312b] text-[#faf6ed] rounded-sm text-xs font-semibold transition-colors cursor-pointer"
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
          className="px-6 py-2.5 bg-[#1f1c18] hover:bg-[#36312b] text-[#faf6ed] font-bold rounded-sm text-xs transition-all shadow-lg cursor-pointer"
        >
          Lobiye Dön & Yeni Vaka Seç
        </button>
      </div>
    </div>
  );
};
