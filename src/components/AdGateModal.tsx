/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Film, LockOpen, ShieldCheck, X } from 'lucide-react';
import { soundManager } from '../utils/audioEffects';

interface AdGateModalProps {
  nextEnvelopeNumber: number;
  scenarioTitle: string;
  onComplete: () => void;
  onCancel: () => void;
}

const AD_DURATION_SEC = 5;

export const AdGateModal: React.FC<AdGateModalProps> = ({
  nextEnvelopeNumber,
  scenarioTitle,
  onComplete,
  onCancel,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(AD_DURATION_SEC);
  const [nativeError, setNativeError] = useState<string | null>(null);

  useEffect(() => {
    const win = typeof window !== 'undefined' ? (window as any) : null;
    // If running inside Capacitor with AdMob plugin installed, trigger native Rewarded/Interstitial ad
    if (win?.Capacitor?.isNativePlatform?.() && win?.AdMob?.showRewardVideoAd) {
      win.AdMob.showRewardVideoAd()
        .then(() => {
          onComplete();
        })
        .catch(() => {
          setNativeError('Reklam yüklenemedi, kısa bekleme sonrası zarf açılacak.');
        });
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  const isReady = secondsLeft === 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#1f1c18]/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md paper-sheet rounded-sm border border-[#1f1c18] p-6 relative">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-3 right-3 text-[#7c7265] hover:text-[#1f1c18] p-1 cursor-pointer"
          aria-label="Kapat"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-[10px] font-typewriter uppercase tracking-[0.2em] text-[#8b1e1e] font-bold">
          <Film className="w-3.5 h-3.5" />
          <span>ÜCRETSİZ VAKA · ZARF GEÇİŞİ</span>
        </div>

        <h3 className="mt-2 text-lg font-bold font-typewriter text-[#1f1c18]">
          Zarf {nextEnvelopeNumber} Açılıyor
        </h3>
        <p className="mt-1 text-xs text-[#575046] leading-relaxed">
          <strong>{scenarioTitle}</strong> ücretsiz bir davadır. Sonraki zarfa geçmek için kısa sponsorlu gösterimi tamamlayın.
        </p>

        {/* Ad Placeholder / Native AdMob Slot */}
        <div className="mt-4 rounded-sm border border-dashed border-[#c8bfae] bg-[#fffdf8] p-6 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#ebe5d8] text-[#1f1c18] mb-2">
            {isReady ? <LockOpen className="w-5 h-5 text-[#276749]" /> : <Film className="w-5 h-5" />}
          </div>
          <p className="text-xs font-typewriter font-bold text-[#1f1c18]">
            {isReady ? 'Gösterim Tamamlandı' : `Sponsorlu Gösterim (${secondsLeft} sn)`}
          </p>
          <p className="mt-1 text-[11px] text-[#7c7265]">
            {nativeError ||
              (isReady
                ? 'Yeni delil zarfının mührü açılmaya hazır.'
                : 'Mobil uygulamada bu alanda Google AdMob ödüllü reklamı oynatılır.')}
          </p>
          <div className="mt-3 w-full h-1.5 bg-[#ebe5d8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#8b1e1e] transition-all duration-1000"
              style={{ width: `${((AD_DURATION_SEC - secondsLeft) / AD_DURATION_SEC) * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 text-[11px] text-[#7c7265]">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#276749]" />
            Ücretli vakalarda reklam yoktur
          </span>
        </div>

        <button
          type="button"
          disabled={!isReady}
          onClick={() => {
            soundManager.playSuccessSound();
            onComplete();
          }}
          className={`mt-4 w-full py-2.5 rounded-sm text-xs font-typewriter font-bold uppercase tracking-wider transition-colors ${
            isReady
              ? 'bg-[#1f1c18] text-[#faf6ed] hover:bg-[#8b1e1e] cursor-pointer'
              : 'bg-[#d6cdbc] text-[#7c7265] cursor-not-allowed'
          }`}
        >
          {isReady ? `Zarf ${nextEnvelopeNumber} Mührünü Aç` : `Bekleniyor (${secondsLeft} sn)...`}
        </button>
      </div>
    </div>
  );
};
