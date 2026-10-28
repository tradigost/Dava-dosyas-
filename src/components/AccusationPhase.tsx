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
  Users2,
  FileCheck,
  AlertTriangle,
  RotateCcw
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
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(activePlayerId);

  useEffect(() => {
    setSelectedPlayerId(activePlayerId);
  }, [activePlayerId]);

  const effectivePlayer = players.find((p) => p.id === selectedPlayerId) || players[0];
  const currentSub = submissions[effectivePlayer.id];

  const [selectedSuspectId, setSelectedSuspectId] = useState<string>(currentSub?.suspectId || '');
  const [selectedMotive, setSelectedMotive] = useState<string>(currentSub?.motiveId || '');
  const [selectedEvidence, setSelectedEvidence] = useState<string>(currentSub?.evidenceId || '');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>(
    currentSub?.quizAnswers || {}
  );
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

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
    setValidationWarning(null);
  }, [currentSub, selectedPlayerId]);

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
      .slice(0, 4)
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
    const missing: string[] = [];
    if (!selectedSuspectId) missing.push('1. Katil Adayı (Şüpheli)');
    if (!selectedMotive) missing.push('2. Suç Motifi (Cinayet Sebebi)');
    if (!selectedEvidence) missing.push('3. Kilit Kanıt');

    if (missing.length > 0) {
      soundManager.playErrorSound();
      setValidationWarning(`Kararınızı kilitlemek için lütfen aşağıdaki eksik alanları seçin: ${missing.join(', ')}.`);
      return;
    }

    setValidationWarning(null);

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
    soundManager.playSuccessSound();

    onSubmitVote({
      playerId: effectivePlayer.id,
      playerName: effectivePlayer.name,
      role: effectivePlayer.role,
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
              Soruşturma sınav soruları ise dedektiflere <strong>bireysel başarı puanı</strong> (100 üzerinden) kazandırır!
            </p>
          </div>

          <div className="flex items-center gap-2 bg-zinc-950 px-3.5 py-2 rounded-xl border border-zinc-800 text-xs">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-zinc-300 font-mono">
              Kilitlenen Oylar: <strong className="text-emerald-400">{Object.keys(submissions).length} / {players.length}</strong>
            </span>
          </div>
        </div>

        {/* Multi-Player Seat Switcher Bar */}
        {players.length > 1 && (
          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-mono text-zinc-400 whitespace-nowrap">
              Dedektif Koltuğu:
            </span>
            {players.map((p) => {
              const isSelected = p.id === effectivePlayer.id;
              const hasVoted = Boolean(submissions[p.id]);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    soundManager.playKeyClick();
                    setSelectedPlayerId(p.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap border ${
                    isSelected
                      ? 'bg-amber-600 text-zinc-950 border-amber-400 shadow-md font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span>{p.name} ({p.role.toUpperCase()})</span>
                  {hasVoted && (
                    <span className="text-[10px] text-emerald-400 font-mono">✓ Kilitlendi</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

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
              📱 {effectivePlayer.name} ({effectivePlayer.role.toUpperCase()}) Karar ve Sınav Kağıdı
            </h3>
          </div>
          {currentSub ? (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-bold">
              <CheckCircle className="w-4 h-4" /> OYUNUZ KİLİTLENDİ ({currentSub.individualScore || 0}/100 Puan)
            </span>
          ) : (
            <span className="text-xs text-amber-400 font-medium">Karar Bekleniyor</span>
          )}
        </div>

        {/* Lock feedback banner if already submitted */}
        {currentSub && (
          <div className="p-3.5 bg-emerald-950/70 border border-emerald-600/60 rounded-xl text-emerald-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold">Oyunuz ve Sınavınız Başarıyla Kilitlendi!</p>
                <p className="text-[11px] text-emerald-300/80 mt-0.5">
                  Tahmini Bireysel Puanınız: <strong>{currentSub.individualScore || 0} / 100 Puan</strong> &mdash; Dilerseniz seçimlerinizi değiştirip tekrar kilitleyebilirsiniz.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-emerald-900/80 px-2.5 py-1 rounded text-emerald-300 font-bold shrink-0">
              KAYDEDİLDİ ✓
            </span>
          </div>
        )}

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
              Zarflardaki bulguları ne kadar dikkatli incelediniz? Aşağıdaki soruları yanıtlayarak bireysel dedektiflik puanınızı yükseltin:
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
                            className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-center gap-2 cursor-pointer ${
                              isChosen
                                ? 'bg-amber-950/70 border-amber-500 text-amber-100 font-semibold shadow-sm ring-1 ring-amber-500/40'
                                : 'bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-zinc-100'
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
        <div className="p-4 sm:p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-5">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
            <Users2 className="w-5 h-5 text-amber-500" />
            <h4 className="font-cinzel font-bold text-sm text-zinc-100">
              Aşama 2: Katil Suçlama & Ortak Masa Oylaması (60 Puan)
            </h4>
          </div>

          {/* Suspect Selection */}
          <div className={`p-3 rounded-xl border transition-colors ${!selectedSuspectId && validationWarning ? 'border-rose-500/80 bg-rose-950/20' : 'border-transparent'}`}>
            <label className="text-xs font-typewriter uppercase tracking-wider text-amber-300/90 block mb-2 font-bold">
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
                      setValidationWarning(null);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950/70 border-amber-500 text-amber-100 shadow-md ring-2 ring-amber-500/50'
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
          <div className={`p-3 rounded-xl border transition-colors ${!selectedMotive && validationWarning ? 'border-rose-500/80 bg-rose-950/20' : 'border-transparent'}`}>
            <label className="text-xs font-typewriter uppercase tracking-wider text-amber-300/90 block mb-2 font-bold">
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
                      setValidationWarning(null);
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950/70 border-amber-500 text-amber-100 font-semibold shadow-md ring-1 ring-amber-500/40'
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
          <div className={`p-3 rounded-xl border transition-colors ${!selectedEvidence && validationWarning ? 'border-rose-500/80 bg-rose-950/20' : 'border-transparent'}`}>
            <label className="text-xs font-typewriter uppercase tracking-wider text-amber-300/90 block mb-2 font-bold">
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
                      setValidationWarning(null);
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950/70 border-amber-500 text-amber-100 font-semibold shadow-md ring-1 ring-amber-500/40'
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

        {/* Live Decision Summary Checklist */}
        <div className="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-1.5 text-xs font-sans">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">1. Zarf Soruşturma Sınavı:</span>
            <span className={Object.keys(quizAnswers).length >= gateEntries.length ? 'text-emerald-400 font-bold font-mono' : 'text-amber-400 font-mono'}>
              {Object.keys(quizAnswers).length} / {gateEntries.length} Soru Yanıtlandı
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">2. Katil Adayı (Şüpheli):</span>
            <span className={selectedSuspectId ? 'text-emerald-400 font-bold' : 'text-rose-400 font-semibold'}>
              {selectedSuspectId ? `${suspects.find((s) => s.id === selectedSuspectId)?.name} ✓` : '⚠️ Seçilmedi'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">3. Suç Motifi:</span>
            <span className={selectedMotive ? 'text-emerald-400 font-bold' : 'text-rose-400 font-semibold'}>
              {selectedMotive ? 'Seçildi ✓' : '⚠️ Seçilmedi'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">4. Kilit Kanıt:</span>
            <span className={selectedEvidence ? 'text-emerald-400 font-bold' : 'text-rose-400 font-semibold'}>
              {selectedEvidence ? 'Seçildi ✓' : '⚠️ Seçilmedi'}
            </span>
          </div>
        </div>

        {/* Validation Warning Alert if any field is missing on click */}
        {validationWarning && (
          <div className="p-3 bg-rose-950/80 border border-rose-600 rounded-xl text-rose-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{validationWarning}</span>
          </div>
        )}

        {/* Lock In Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800">
          <p className="text-xs text-zinc-400">
            {currentSub
              ? 'Kararınız ve sınav yanıtlarınız kilitlendi. Dilerseniz yukarıdaki seçimleri güncelleyip butona tekrar basabilirsiniz.'
              : 'Seçimlerinizi yaptıktan sonra butona basarak oyunuzu ve sınavınızı sisteme kilitleyin.'}
          </p>

          <button
            type="button"
            onClick={handleLockVote}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg bg-amber-600 hover:bg-amber-500 text-zinc-950 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{currentSub ? '✓ Kararımı ve Sınavımı Güncelle' : '🔒 Kararımı ve Sınavımı Kesinleştir'}</span>
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
