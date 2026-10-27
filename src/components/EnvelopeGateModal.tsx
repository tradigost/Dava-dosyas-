/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GateQuestion, RoleType } from '../types';
import { soundManager } from '../utils/audioEffects';
import { KeyRound, ShieldAlert, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface EnvelopeGateModalProps {
  gate: GateQuestion;
  currentEnvelope: number;
  totalEnvelopes?: number;
  onSuccessNextEnvelope: () => void;
  onClose: () => void;
  onIncrementAttempts: () => void;
}

export const EnvelopeGateModal: React.FC<EnvelopeGateModalProps> = ({
  gate,
  currentEnvelope,
  totalEnvelopes = 3,
  onSuccessNextEnvelope,
  onClose,
  onIncrementAttempts,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const handleSubmit = () => {
    if (!selectedOptionId) return;
    onIncrementAttempts();
    const chosen = gate.options.find((o) => o.id === selectedOptionId);
    if (chosen && chosen.isCorrect) {
      soundManager.playSuccessSound();
      setIsCorrect(true);
      setHasSubmitted(true);
    } else {
      soundManager.playErrorSound();
      setIsCorrect(false);
      setHasSubmitted(true);
    }
  };

  const handleNext = () => {
    soundManager.playKeyClick();
    onSuccessNextEnvelope();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-amber-600/50 rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl relative text-zinc-100 max-h-[90vh] overflow-y-auto">
        {/* Seal Icon Header */}
        <div className="text-center pb-4 border-b border-zinc-800">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-2 text-amber-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-typewriter text-amber-400 uppercase tracking-widest block">
            {currentEnvelope < totalEnvelopes
              ? `Zarf ${currentEnvelope} → Zarf ${currentEnvelope + 1} Mühür Kilidi`
              : `Zarf ${currentEnvelope} → Final Suçlama Kilidi`}
          </span>
          <h3 className="text-lg sm:text-xl font-bold font-cinzel text-zinc-100 mt-1">
            {gate.title}
          </h3>
          <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
            {gate.instructions}
          </p>
        </div>

        {/* Question Body */}
        <div className="mt-4">
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
            <p className="text-xs sm:text-sm font-semibold text-amber-200 leading-relaxed">
              ❓ {gate.question}
            </p>
          </div>

          {/* Options */}
          <div className="mt-4 space-y-2.5">
            {gate.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={hasSubmitted && isCorrect}
                  onClick={() => {
                    soundManager.playKeyClick();
                    setSelectedOptionId(option.id);
                    setHasSubmitted(false);
                  }}
                  className={`w-full p-3 text-left rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-amber-950/60 border-amber-500 text-amber-100 font-medium shadow-md'
                      : 'bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border shrink-0 mt-0.5 flex items-center justify-center ${
                      isSelected ? 'border-amber-400 bg-amber-500' : 'border-zinc-600'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 bg-zinc-950 rounded-full" />}
                  </div>
                  <span className="leading-relaxed">{option.text}</span>
                </button>
              );
            })}
          </div>

          {/* Result Alert */}
          {hasSubmitted && (
            <div
              className={`mt-4 p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/60 text-rose-200'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold text-sm">
                  {isCorrect ? 'MÜHÜR AÇILDI! TEBRİKLER DEDEKTİF!' : 'YANLIŞ AKIL YÜRÜTME!'}
                </p>
                <p className="mt-1 leading-relaxed">
                  {isCorrect ? gate.explanation : 'Seçtiğiniz cevap masadaki diğer kanıtlarla uyuşmuyor. Lütfen Profilleme ve Adli Tıp uzmanlarının verilerini tekrar karşılaştırın.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between gap-3 pt-3 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Masaya Geri Dön
          </button>

          {!isCorrect ? (
            <button
              type="button"
              disabled={!selectedOptionId}
              onClick={handleSubmit}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedOptionId
                  ? 'bg-amber-600 hover:bg-amber-500 text-zinc-950 shadow-md'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              Mührü Doğrula
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md animate-pulse"
            >
              <span>
                {currentEnvelope < totalEnvelopes
                  ? `Zarf ${currentEnvelope + 1}’i Aç`
                  : 'Bireysel Suçlama ve Oylamaya Geç'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
