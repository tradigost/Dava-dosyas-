/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Player, Suspect, AccusationSubmission, CaseScenario } from '../types';
import { soundManager } from '../utils/audioEffects';
import { evaluateVotesConsensus, evaluateTableVerdict } from '../utils/gameRules';
import { 
  Gavel, 
  CheckCircle, 
  ShieldCheck, 
  UserCheck, 
  Flame, 
  HelpCircle, 
  Award,
  Users2,
  FileCheck
} from 'lucide-react';

interface AccusationPhaseProps {
  scenario?: CaseScenario;
  players: Player[];
  suspects: Suspect[];
  activePlayerId: string;
  submissions: Record<string, AccusationSubmission>;
  onSubmitVote: (submission: AccusationSubmission) => void;
  onProceedToVerdict: () => void;
}

export const AccusationPhase: React.FC<AccusationPhaseProps> = ({
  scenario,
  players,
  suspects,
  activePlayerId,
  submissions,
  onSubmitVote,
  onProceedToVerdict,
}) => {
  const activePlayer = players.find((p) => p.id === activePlayerId) || players[0];
  const currentSub = submissions[activePlayer.id];

  const [selectedSuspectId, setSelectedSuspectId] = useState<string>(currentSub?.suspectId || '');
  const [selectedMotive, setSelectedMotive] = useState<string>(currentSub?.motiveId || '');
  const [selectedEvidence, setSelectedEvidence] = useState<string>(currentSub?.evidenceId || '');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>(
    currentSub?.quizAnswers || {}
  );

  // 120s debate timer
  const [debateTimeLeft, setDebateTimeLeft] = useState<number>(120);
  const [isDebateActive, setIsDebateActive] = useState<boolean>(false);

  useEffect(() => {
    if (currentSub) {
      setSelectedSuspectId(currentSub.suspectId);
      setSelectedMotive(currentSub.motiveId);
      setSelectedEvidence(currentSub.evidenceId);
      if (currentSub.quizAnswers) {
        setQuizAnswers(currentSub.quizAnswers);
      }
    } else {
      setSelectedSuspectId('');
      setSelectedMotive('');
      setSelectedEvidence('');
      setQuizAnswers({});
    }
  }, [currentSub, activePlayerId]);

  const allPlayersVoted = players.every((p) => !!submissions[p.id]);

  const votesList = Object.values(submissions).map((s) => ({
    playerId: s.playerId,
    suspectId: s.suspectId,
    motive: s.motiveId,
    keyEvidence: s.evidenceId,
  }));

  const consensus = evaluateVotesConsensus(votesList);
  const tableVerdict = scenario ? evaluateTableVerdict(votesList, scenario.solution.culpritId) : null;

  // Activate debate when all voted and there is a split
  useEffect(() => {
    if (allPlayersVoted && !consensus.isUnanimous && !isDebateActive) {
      setIsDebateActive(true);
      soundManager.playErrorSound();
    }
  }, [allPlayersVoted, consensus.isUnanimous, isDebateActive]);

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isDebateActive && debateTimeLeft > 0) {
      timer = setInterval(() => {
        setDebateTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            soundManager.playSuccessSound();
            return 0;
          }
          if (prev % 10 === 0) soundManager.playTick();
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isDebateActive, debateTimeLeft]);

  // Generate motives dynamically from scenario
  const motives = scenario ? [
    {
      id: 'motive-solution',
      label: scenario.solution.motiveTitle,
      suspectTarget: scenario.solution.culpritId,
      isCorrect: true,
    },
    ...scenario.suspects
      .filter((s) => s.id !== scenario.solution.culpritId)
      .map((s) => ({
        id: `motive-${s.id}`,
        label: s.motiveHypothesis || `${s.name} Şüpheli Girişimi`,
        suspectTarget: s.id,
        isCorrect: false,
      }))
  ] : suspects.map((s, idx) => ({
    id: `motive-${s.id}`,
    label: s.motiveHypothesis,
    suspectTarget: s.id,
    isCorrect: idx === 0,
  }));

  // Generate key evidence options dynamically from scenario
  const keyEvidences = scenario ? [
    {
      id: 'evidence-solution',
      label: scenario.solution.keyEvidenceTitle,
      isCorrect: true,
    },
    ...scenario.evidence
      .filter((ev) => ev.title !== scenario.solution.keyEvidenceTitle)
      .slice(0, 3)
      .map((ev) => ({
        id: `evidence-${ev.id}`,
        label: ev.title,
        isCorrect: false,
      }))
  ] : [
    { id: 'ev-1', label: 'Adli Tıp Olay Yeri Raporu', isCorrect: true },
    { id: 'ev-2', label: 'Şüpheli İfadeleri & Çelişkiler', isCorrect: false },
  ];

  // Retrieve gate quiz questions from scenario
  const gateEntries = scenario?.gates ? Object.entries(scenario.gates).map(([envStr, gate]) => ({
    envelopeNum: Number(envStr),
    gate,
  })).sort((a, b) => a.envelopeNum - b.envelopeNum) : [];

  const handleSelectQuizAnswer = (envNum: number, optionId: string) => {
    soundManager.playKeyClick();
    setQuizAnswers((prev) => ({
      ...prev,
      [envNum]: optionId,
    }));
  };

  const handleLockVote = () => {
    if (!selectedSuspectId || !selectedMotive || !selectedEvidence) return;

    // Calculate individual score
    let correctQuizCount = 0;
    gateEntries.forEach(({ envelopeNum, gate }) => {
      const chosenOptionId = quizAnswers[envelopeNum];
      const correctOption = gate.options.find((opt) => opt.isCorrect);
      if (chosenOptionId && correctOption && chosenOptionId === correctOption.id) {
        correctQuizCount++;
      }
    });

    const isSuspectCorrect = scenario ? selectedSuspectId === scenario.solution.culpritId : true;
    const isMotiveCorrect = selectedMotive === 'motive-solution';
    const isEvidenceCorrect = selectedEvidence === 'evidence-solution';

    const quizScore = gateEntries.length > 0 
      ? Math.round((correctQuizCount / gateEntries.length) * 40)
      : 30;
    const suspectScore = isSuspectCorrect ? 30 : 0;
    const motiveScore = isMotiveCorrect ? 15 : 0;
    const evidenceScore = isEvidenceCorrect ? 15 : 0;
    const individualTotal = quizScore + suspectScore + motiveScore + evidenceScore;

    soundManager.playPinSound();
    onSubmitVote({
      playerId: activePlayer.id,
      playerName: activePlayer.name,
      role: activePlayer.role,
      suspectId: selectedSuspectId,
      motiveId: selectedMotive,
      evidenceId: selectedEvidence,
      individualScore: individualTotal,
      quizAnswers,
      statementNotes: '',
      submittedAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-zinc-900 border border-amber-600/40 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Gavel className="w-6 h-6 text-amber-500" />
              <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-amber-200">
                Final Soruşturması & Katil Oylaması
              </h2>
            </div>
            <p className="text-xs text-zinc-300 mt-1 max-w-2xl leading-relaxed">
              Katil oylaması <strong>ortak masa kararıdır</strong>: Çoğunluk gerçek katili bulursa masa oyunu kazanır. 
              Aşağıdaki soruşturma test soruları ise dedektiflere <strong>bireysel başarı puanı</strong> kazandırır!
            </p>
          </div>

          <div className="flex items-center gap-2 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 text-xs">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-zinc-300">
              Kilitlenen Oylar: <strong className="text-emerald-400">{Object.keys(submissions).length} / {players.length}</strong>
            </span>
          </div>
        </div>

        {/* Debate Timer Bar if triggered */}
        {isDebateActive && (
          <div className="mt-5 p-4 rounded-xl bg-amber-950/50 border border-amber-500/70 text-amber-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6 text-amber-400 animate-bounce" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-amber-200">
                  ⚠️ OYLAR BÖLÜNDÜ! 120 Saniyelik İhtilaf & İkna Süresi
                </h4>
                <p className="text-xs text-amber-300/80 mt-0.5">
                  Masadaki dedektifler farklı şüphelileri suçladı. Kanıtlarınızı masaya yatırıp birbirinizi ikna edin!
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right shrink-0">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-300 tracking-wider">
                {Math.floor(debateTimeLeft / 60)}:{(debateTimeLeft % 60).toString().padStart(2, '0')}
              </div>
              <span className="text-[10px] text-amber-400/70 uppercase tracking-widest font-mono">
                KALAN SÜRE
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Active Player Voting Form Card */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-lg space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
            <h3 className="font-bold text-sm sm:text-base text-zinc-100">
              📱 {activePlayer.name} ({activePlayer.role.toUpperCase()}) Karar ve Sınav Kağıdı
            </h3>
          </div>
          {currentSub ? (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle className="w-3.5 h-3.5" /> OYUNUZ KİLİTLENDİ (Skor: {currentSub.individualScore || 0}/100)
            </span>
          ) : (
            <span className="text-xs text-amber-400 font-medium">Karar Bekleniyor</span>
          )}
        </div>

        {/* 1. Final Adli Soruşturma Sınavı (Bireysel Puan Kazandıran Test Soruları) */}
        {gateEntries.length > 0 && (
          <div className="p-4 sm:p-5 bg-zinc-900/60 border border-amber-600/30 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-400" />
                <h4 className="font-cinzel font-bold text-sm text-amber-200">
                  Aşama 1: Bireysel Adli Soruşturma Sınavı (40 Puan)
                </h4>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                {gateEntries.length} Soru
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Her zarftaki bulguları ne kadar dikkatli incelediniz? Soruları doğru yanıtlayarak dedektiflik puanınızı yükseltin:
            </p>

            <div className="space-y-4">
              {gateEntries.map(({ envelopeNum, gate }) => {
                const selectedAnswer = quizAnswers[envelopeNum];
                return (
                  <div key={envelopeNum} className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-2.5">
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] font-mono font-bold bg-amber-950/80 border border-amber-600/60 text-amber-300 px-2 py-0.5 rounded uppercase shrink-0 mt-0.5">
                        Zarf {envelopeNum} Sorusu
                      </span>
                      <p className="text-xs font-semibold text-zinc-100 leading-snug">
                        {gate.question}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {gate.options.map((option, optIdx) => {
                        const isChosen = selectedAnswer === option.id;
                        return (
                          <button
                            key={option.id || optIdx}
                            type="button"
                            onClick={() => handleSelectQuizAnswer(envelopeNum, option.id)}
                            className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-center gap-2 ${
                              isChosen
                                ? 'bg-amber-950/70 border-amber-500 text-amber-100 font-semibold shadow-sm ring-1 ring-amber-500/40'
                                : 'bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center text-[10px] ${
                              isChosen ? 'border-amber-400 bg-amber-500 text-zinc-950 font-bold' : 'border-zinc-600'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="line-clamp-2">{option.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. Katil Suçlaması (Ortak Masa Oylaması Bölümü) */}
        <div className="p-4 sm:p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
            <Users2 className="w-5 h-5 text-amber-500" />
            <h4 className="font-cinzel font-bold text-sm text-zinc-100">
              Aşama 2: Katil Suçlama & Ortak Masa Oylaması
            </h4>
          </div>

          {/* Suspect Selection */}
          <div>
            <label className="text-xs font-typewriter uppercase tracking-wider text-amber-300/90 block mb-2">
              1. Katil Adayınız Kim? (Masanın Çoğunluk Oyu Belirleyicidir):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {suspects.map((suspect) => {
                const isSelected = selectedSuspectId === suspect.id;
                return (
                  <button
                    key={suspect.id}
                    type="button"
                    onClick={() => {
                      soundManager.playKeyClick();
                      setSelectedSuspectId(suspect.id);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'bg-amber-950/70 border-amber-500 text-amber-100 shadow-md ring-1 ring-amber-500/50'
                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-lg border flex items-center justify-center font-bold text-xs ${suspect.photoPlaceholder?.silhouetteStyle || 'bg-zinc-800 border-zinc-700 text-zinc-300'}`}
                      >
                        {suspect.photoPlaceholder?.initials || suspect.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-xs truncate">{suspect.name}</p>
                        <p className="text-[11px] text-zinc-400 truncate">{suspect.title}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Motive Selection */}
          <div className="mt-4">
            <label className="text-xs font-typewriter uppercase tracking-wider text-amber-300/90 block mb-2">
              2. Asıl Motif (Cinayet / Hırsızlık Sebebi):
            </label>
            <div className="space-y-2">
              {motives.map((motive) => {
                const isSelected = selectedMotive === motive.id;
                return (
                  <button
                    key={motive.id}
                    type="button"
                    onClick={() => {
                      soundManager.playKeyClick();
                      setSelectedMotive(motive.id);
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-amber-950/70 border-amber-500 text-amber-100 font-semibold shadow-md'
                        : 'bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center ${
                        isSelected ? 'border-amber-400 bg-amber-500' : 'border-zinc-600'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 bg-zinc-950 rounded-full" />}
                    </div>
                    <span>{motive.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Key Evidence Selection */}
          <div className="mt-4">
            <label className="text-xs font-typewriter uppercase tracking-wider text-amber-300/90 block mb-2">
              3. Katili Ele Veren Kilit Kanıt:
            </label>
            <div className="space-y-2">
              {keyEvidences.map((evi) => {
                const isSelected = selectedEvidence === evi.id;
                return (
                  <button
                    key={evi.id}
                    type="button"
                    onClick={() => {
                      soundManager.playKeyClick();
                      setSelectedEvidence(evi.id);
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-amber-950/70 border-amber-500 text-amber-100 font-semibold shadow-md'
                        : 'bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center ${
                        isSelected ? 'border-amber-400 bg-amber-500' : 'border-zinc-600'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 bg-zinc-950 rounded-full" />}
                    </div>
                    <span>{evi.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lock In Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800">
          <p className="text-xs text-zinc-400">
            {currentSub
              ? 'Kararınız ve test yanıtlarınız sisteme kilitlendi. İsterseniz yukarıdan başka bir oyuncu telefonuna geçerek onların kararını verebilirsiniz.'
              : 'Tüm sınav sorularını ve suçlama seçimlerinizi yaptıktan sonra oyunuzu kilitleyin.'}
          </p>

          <button
            type="button"
            disabled={!selectedSuspectId || !selectedMotive || !selectedEvidence}
            onClick={handleLockVote}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedSuspectId && selectedMotive && selectedEvidence
                ? 'bg-amber-600 hover:bg-amber-500 text-zinc-950 shadow-md cursor-pointer'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            {currentSub ? 'Kararımı & Sınavımı Güncelle' : 'Kararımı & Sınavımı Kesinleştir'}
          </button>
        </div>
      </div>

      {/* Players Vote Status Table & Majority Calculation */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h4 className="text-xs font-typewriter uppercase tracking-wider text-zinc-400">
            Masa Oy Dağılımı ve Dedektif Durumu:
          </h4>
          {tableVerdict && tableVerdict.totalVotes > 0 && (
            <span className="text-xs font-mono text-amber-300 bg-amber-950/40 border border-amber-600/30 px-2.5 py-0.5 rounded">
              Lider Tercih: {suspects.find((s) => s.id === tableVerdict.majoritySuspectId)?.name || 'Eşitlik'} ({tableVerdict.majorityCount}/{tableVerdict.totalVotes} Oy)
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {players.map((p) => {
            const sub = submissions[p.id];
            const chosenSuspect = sub ? suspects.find((s) => s.id === sub.suspectId) : null;
            return (
              <div
                key={p.id}
                className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-zinc-200">{p.name}</p>
                  <p className="text-[11px] text-zinc-400">{p.role}</p>
                </div>
                <div>
                  {sub ? (
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-600/50 px-2 py-0.5 rounded block">
                        {chosenSuspect?.name || 'Kilitlendi'}
                      </span>
                      {sub.individualScore !== undefined && (
                        <span className="text-[10px] text-zinc-400 font-mono mt-0.5 block">
                          {sub.individualScore}/100 Puan
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] text-zinc-500 italic">Düşünüyor...</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Proceed to Verdict Button */}
        {allPlayersVoted && (
          <div className="mt-5 p-4 bg-zinc-900/80 border border-emerald-900/50 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-emerald-300">
                {consensus.isUnanimous
                  ? '🎯 Tüm dedektifler oy birliğiyle ortak karar verdi!'
                  : '⚖️ Tüm oylar toplandı! Masa çoğunluk kararı hazır.'}
              </p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Resmi çözümü, masa kazanma/kaybetme sonucunu ve bireysel dedektif karnelerini görüntüleyin.
              </p>
            </div>

            <button
              type="button"
              onClick={onProceedToVerdict}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Gavel className="w-4 h-4" />
              Zarf 4: Çözüm & Dedektif Karnesini Aç
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
