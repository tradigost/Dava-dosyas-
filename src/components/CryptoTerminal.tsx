/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { soundManager } from '../utils/audioEffects';
import { Terminal, Lock, Unlock, Play, Pause, Pin, Volume2, AlertCircle } from 'lucide-react';

interface CryptoTerminalProps {
  onPinFinding: (title: string, excerpt: string, category: string) => void;
  isAlreadyPinned: boolean;
  onCodeCracked?: () => void;
}

export const CryptoTerminal: React.FC<CryptoTerminalProps> = ({
  onPinFinding,
  isAlreadyPinned,
  onCodeCracked,
}) => {
  const [pinInput, setPinInput] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);

  const handleDigit = (digit: string) => {
    if (isUnlocked) return;
    if (pinInput.length < 4) {
      soundManager.playTerminalBeep(1000 + (pinInput.length + 1) * 150);
      setPinInput((prev) => prev + digit);
      setErrorMessage(null);
    }
  };

  const handleClear = () => {
    soundManager.playKeyClick();
    setPinInput('');
    setErrorMessage(null);
  };

  const handleSubmit = () => {
    if (pinInput === '1889') {
      soundManager.playSuccessSound();
      setIsUnlocked(true);
      setErrorMessage(null);
      if (onCodeCracked) onCodeCracked();
    } else {
      soundManager.playErrorSound();
      setErrorMessage('HATALI PIN: Yetkisiz erişim denemesi kaydedildi. (İpucu: Profilleme uzmanının sorgu notundaki kurbanın en sevdiği tablo yılını inceleyin).');
      setPinInput('');
    }
  };

  // Simulated audio playback progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 5;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  const toggleAudio = () => {
    soundManager.playKeyClick();
    setIsPlayingAudio((prev) => !prev);
  };

  const handlePin = () => {
    soundManager.playPinSound();
    onPinFinding(
      '💻 Kripto Deşifre: Kasa Kilidi (1889) ve Gizli Ses Kaydı',
      'Kasa PIN kodu 1889 (Yıldızlı Gece) ile açıldı! Çıkan ses kaydında Turgut Soylu, Dr. Kerem’in 25M TL zimmetini ve ölüm tehditlerini anlatıyor!',
      'audio'
    );
  };

  return (
    <div className="bg-zinc-950 border border-cyan-900/40 rounded-xl p-4 sm:p-5 text-cyan-400 font-mono relative overflow-hidden">
      {/* Background scanlines */}
      <div className="absolute inset-0 crt-scanlines pointer-events-none opacity-40" />

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-cyan-950 text-xs">
        <div className="flex items-center gap-2 text-cyan-300">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-bold tracking-wider">KRY-TERMINAL v4.2 // SAMSUNG KNOX SAFE</span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
          {isUnlocked ? (
            <span className="text-emerald-400 flex items-center gap-1">
              <Unlock className="w-3.5 h-3.5" /> DEŞİFRE EDİLDİ
            </span>
          ) : (
            <span className="text-amber-400 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> 4-PIN KİLİTLİ
            </span>
          )}
        </div>
      </div>

      {/* Main Terminal Screen */}
      <div className="relative z-10 mt-4">
        {!isUnlocked ? (
          <div>
            <div className="bg-zinc-900/80 border border-cyan-900/50 rounded-lg p-3 text-center">
              <p className="text-xs text-zinc-400">GÜVENLİ DEPOLAMA PIN KODU GİRİNİZ</p>
              <div className="mt-2 text-2xl font-bold tracking-[0.5em] text-cyan-300">
                {pinInput.padEnd(4, '_')}
              </div>
            </div>

            {errorMessage && (
              <div className="mt-3 p-2.5 bg-rose-950/40 border border-rose-800/60 rounded text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Keypad */}
            <div className="mt-4 grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleDigit(digit)}
                  className="p-3 bg-zinc-900/90 border border-cyan-900/40 hover:border-cyan-500 hover:bg-cyan-950/40 text-cyan-200 font-bold rounded text-lg transition-colors"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="p-3 bg-zinc-900/90 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 font-bold rounded text-xs transition-colors"
              >
                SİL
              </button>
              <button
                type="button"
                onClick={() => handleDigit('0')}
                className="p-3 bg-zinc-900/90 border border-cyan-900/40 hover:border-cyan-500 hover:bg-cyan-950/40 text-cyan-200 font-bold rounded text-lg transition-colors"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="p-3 bg-cyan-700/80 hover:bg-cyan-600 border border-cyan-500 text-zinc-950 font-bold rounded text-xs transition-colors shadow-sm"
              >
                GİRİŞ
              </button>
            </div>

            <p className="mt-3 text-center text-[11px] text-zinc-500 font-sans">
              * İpucu: Kurban şifresini asla unutmamak için hayran olduğu başyapıtın yapılış yılını kullanmıştır.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-cyan-950/30 border border-cyan-700/50 rounded-lg text-xs">
              <div className="flex items-center justify-between text-cyan-300 font-bold">
                <span>[DOSYA BULUNDU] Turgut-Kayit-01.wav</span>
                <span>42 SN · 13 EKİM 22:15</span>
              </div>
              <p className="mt-1 text-zinc-400 font-sans text-xs">
                Kurbanın kasasındaki gizli diktafondan çıkarılan son kişisel ses kaydı.
              </p>

              {/* Audio Waveform & Player */}
              <div className="mt-3 p-3 bg-zinc-950 border border-cyan-900/60 rounded flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleAudio}
                    className="p-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 rounded-full transition-colors shrink-0"
                    aria-label={isPlayingAudio ? 'Durdur' : 'Dinle'}
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[11px] text-cyan-400 mb-1">
                      <span className="flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5" /> Oynatılıyor...
                      </span>
                      <span>{Math.floor((audioProgress / 100) * 42)}s / 42s</span>
                    </div>
                    <div className="h-2 bg-zinc-900 rounded-full overflow-hidden border border-cyan-950">
                      <div
                        className="h-full bg-cyan-500 transition-all duration-300"
                        style={{ width: `${audioProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Animated Spectrum Bars */}
                <div className="flex items-end gap-1 h-8 pt-1 justify-between px-2">
                  {[40, 75, 30, 90, 60, 85, 20, 95, 45, 70, 30, 80, 50, 90, 65, 40, 85, 30, 95, 60].map(
                    (val, idx) => (
                      <div
                        key={idx}
                        className={`w-1 rounded-t transition-all duration-200 ${
                          isPlayingAudio ? 'bg-cyan-400' : 'bg-zinc-800'
                        }`}
                        style={{
                          height: isPlayingAudio ? `${(val * (idx % 3 + 1)) % 100}%` : '20%',
                        }}
                      />
                    )
                  )}
                </div>
              </div>

              {/* Transcript */}
              <div className="mt-3 p-3 bg-zinc-900/70 border border-zinc-800 rounded font-sans text-xs text-zinc-300 leading-relaxed">
                <p className="font-semibold text-cyan-300 mb-1 font-mono text-[11px]">
                  [SES DEŞİFRESİ]:
                </p>
                <p>
                  &ldquo;...Cemil&apos;in müzayededeki sahte tablolarını belgeledim, yarın yönetim kurulunda yüzüne çarpacağım. Ama asıl ihanet Kerem&apos;den geldi... Yıllardır oğlum gibi büyüttüğüm, kliniğine 25 milyon TL aktardığım Dr. Kerem Akman... Teftiş kurulu raporu önümde; paraları kumar ve borsa hesaplarına aktarmış. Dün beni tehdit etti. &apos;Kalp sağlığınız çok hassas Turgut Bey, bir yanlış teşhis hayatınıza mal olabilir&apos; dedi... Yarın sabah ilk işim savcı Bey&apos;e gitmek olacak.&rdquo;
                </p>
              </div>
            </div>

            {/* Pin Action */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-sans">
              <span className="text-xs text-zinc-400">
                Bu deşifre kaydını davanın ortak panosuna sabitleyebilirsiniz.
              </span>
              <button
                type="button"
                onClick={handlePin}
                disabled={isAlreadyPinned}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isAlreadyPinned
                    ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold shadow-sm'
                }`}
              >
                <Pin className="w-3.5 h-3.5" />
                {isAlreadyPinned ? 'Ortak Panoya Yansıtıldı' : '📌 Özeti Ortak Panoya Yansıt'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
