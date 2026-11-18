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
    <div className="fixed inset-0 z-50 bg-[#1f1c18]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#fffdf8] border border-[#d6cdbc] rounded-sm max-w-xl w-full p-5 sm:p-6 shadow-[0_6px_28px_rgba(31,28,24,0.2)] text-[#1f1c18] font-typewriter max-h-[90vh] overflow-y-auto">
        {/* Seal Icon Header */}
        <div className="text-center pb-4 border-b border-dashed border-[#c8bfae]">
          <div className="w-12 h-12 bg-[#8b1e1e]/10 border border-[#8b1e1e]/30 rounded-full flex items-center justify-center mx-auto mb-2 text-[#8b1e1e]">
            <KeyRound className="w-6 h-6" />
          </div>
          <span className="text-[11px] text-[#8b1e1e] uppercase tracking-widest block">
            {currentEnvelope < totalEnvelopes
              ? `Zarf ${currentEnvelope} → Zarf ${currentEnvelope + 1} Mühür Kilidi`
              : `Zarf ${currentEnvelope} → Final Suçlama Kilidi`}
          </span>
          <h3 className="text-lg sm:text-xl font-bold uppercase text-[#1f1c18] mt-1">
            {gate.title}
          </h3>
          <p className="text-xs text-[#575046] mt-1.5 leading-relaxed">
            {gate.instructions}
          </p>
        </div>

        {/* Question Body */}
        <div className="mt-4">
          <div className="p-3.5 bg-[#faf6ed] border-l-2 border-[#8b1e1e] text-xs sm:text-sm font-bold text-[#1f1c18]">
            {gate.question}
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
                  className={`w-full p-3 text-left rounded-sm border text-xs sm:text-sm transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-[#fffdf8] border-[#1f1c18] ring-1 ring-[#1f1c18] text-[#1f1c18] font-semibold'
                      : 'bg-[#faf6ed] border-[#d6cdbc] text-[#4a443c] hover:border-[#8c8273]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border shrink-0 mt-0.5 flex items-center justify-center ${
                      isSelected ? 'border-[#1f1c18] bg-[#1f1c18]' : 'border-[#d6cdbc]'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 bg-[#fffdf8] rounded-full" />}
                  </div>
                  <span className="leading-relaxed">{option.text}</span>
                </button>
              );
            })}
          </div>

          {/* Result Alert */}
          {hasSubmitted && (
            <div
              className={`mt-4 p-3.5 rounded-sm border flex items-start gap-2.5 text-xs ${
                isCorrect
                  ? 'bg-[#f0f7f2] border border-[#276749] text-[#1e4e38]'
                  : 'bg-[#fdf2f2] border border-[#8b1e1e] text-[#8b1e1e]'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-[#276749] shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-[#8b1e1e] shrink-0 mt-0.5" />
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
        <div className="mt-6 flex items-center justify-between gap-3 pt-3 border-t border-dashed border-[#c8bfae]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs text-[#575046] hover:text-[#1f1c18] transition-colors underline-offset-4 hover:underline"
          >
            Masaya Geri Dön
          </button>

          {!isCorrect ? (
            <button
              type="button"
              disabled={!selectedOptionId}
              onClick={handleSubmit}
              className={`px-5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all ${
                selectedOptionId
                  ? 'bg-[#1f1c18] hover:bg-[#36312b] text-[#faf6ed]'
                  : 'bg-[#d6cdbc] text-[#4a443c] cursor-not-allowed'
              }`}
            >
              Mührü Doğrula
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[#8b1e1e] hover:bg-[#701616] text-[#faf6ed] rounded-sm text-xs font-bold uppercase tracking-wider"
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
