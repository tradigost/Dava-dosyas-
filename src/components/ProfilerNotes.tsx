/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { soundManager } from '../utils/audioEffects';
import { Fingerprint, Pin, CheckCircle2, UserCheck, HelpCircle } from 'lucide-react';
import { Suspect } from '../types';

interface ProfilerNotesProps {
  suspects: Suspect[];
  onPinFinding: (title: string, excerpt: string, category: string) => void;
  isAlreadyPinned: boolean;
}

interface ClueSentence {
  id: string;
  suspectId: string;
  text: string;
  tag: string;
  isCrucial: boolean;
  insight: string;
}

export const ProfilerNotes: React.FC<ProfilerNotesProps> = ({
  suspects,
  onPinFinding,
  isAlreadyPinned,
}) => {
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>('selin-soylu');
  const [highlightedClues, setHighlightedClues] = useState<Record<string, boolean>>({
    'c-1': true, // default starter clue highlighted
  });

  const clues: ClueSentence[] = [
    {
      id: 'c-1',
      suspectId: 'selin-soylu',
      text: '"Turgut bana hep \'benim için dünyada gerçek sanatın başladığı o büyülü yıldır şifrem\' derdi. En hayran olduğu tabloyu bilmeyen yoktur."',
      tag: 'KASA ŞİFRESİ İPUCU',
      isCrucial: true,
      insight: 'Kurbanın şifreleme algoritması sanat tarihine dayanıyor. En sevdiği başyapıt Vincent van Gogh’un Yıldızlı Gece (1889) tablosudur!',
    },
    {
      id: 'c-2',
      suspectId: 'selin-soylu',
      text: '"Evlilik sözleşmemiz vardı ama son vasiyetinde bana pay bırakıp bırakmadığını bilmiyordum. Ölümüne sevinmedim ama yalan söyleyemem, rahatladım."',
      tag: 'MİRAS VE DUYGUSAL TEPKİ',
      isCrucial: false,
      insight: 'Selin boşanma protokolünden dolayı kızgın fakat cinayet yöntemine dair teknik bilgisi yok.',
    },
    {
      id: 'c-3',
      suspectId: 'cemil-vural',
      text: '"22:50’de yalıdan çıkarken sokağın köşesinde Dr. Kerem’in siyah sedan arabasını farları sönük vaziyette beklerken gördüm!"',
      tag: 'KRİTİK GÖRGÜ TANIKLIĞI',
      isCrucial: true,
      insight: 'Dr. Kerem 21:00’de Kadıköy’e gittiğini söylemişti. Cemil’in bu ifadesi Dr. Kerem’in alibisini doğrudan çökertecek kilit tanıklıktır!',
    },
    {
      id: 'c-4',
      suspectId: 'dr-kerem',
      text: '"Turgut Bey’e akşam tam 20:45’te villadaydım. Kendi elimle hazırladığım magnezyum-kardiyo vitamin kapsülünü suyla içirdim."',
      tag: 'ZAMAN ÇAKIŞMASI & İLAÇ VERME',
      isCrucial: true,
      insight: 'Adli Tıp’ın bulduğu 3 saat gecikmeli kapsül ile Dr. Kerem’in 20:45’te bizzat kendi eliyle içirdiği kapsül birebir örtüşüyor (20:45 + 180 dk = 23:45 Ölüm Anı)!',
    },
  ];

  const handleToggleClue = (clueId: string) => {
    soundManager.playKeyClick();
    setHighlightedClues((prev) => ({
      ...prev,
      [clueId]: !prev[clueId],
    }));
  };

  const currentSuspect = suspects.find((s) => s.id === selectedSuspectId) || suspects[0];
  const suspectClues = clues.filter((c) => c.suspectId === selectedSuspectId);

  const handlePin = () => {
    soundManager.playPinSound();
    onPinFinding(
      '🧠 Profilleme & Sorgu: Şifre İpucu ve Alibi Çelişkisi',
      'Selin: "Şifre kurbanın en sevdiği tablonun yılıdır" (1889). Cemil: "22:50’de kapıda Dr. Kerem’in arabasını gördüm." Dr. Kerem 20:45’te kapsülü içiren tek kişidir!',
      'interrogation'
    );
  };

  return (
    <div className="bg-zinc-900/90 border border-amber-900/40 rounded-xl p-4 sm:p-5 text-zinc-200">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Fingerprint className="w-5 h-5 text-amber-400" />
          <h4 className="font-semibold text-sm sm:text-base text-amber-300">
            Davranış Bilimleri & İfade Çelişki İşaretçisi
          </h4>
        </div>
        <span className="text-xs text-zinc-400 font-typewriter">
          PROFİLLEYİCİ ÇALIŞMA MASASI
        </span>
      </div>

      {/* Suspect Selector */}
      <div className="mt-4 flex flex-wrap gap-2">
        {suspects.map((suspect) => (
          <button
            key={suspect.id}
            type="button"
            onClick={() => {
              soundManager.playKeyClick();
              setSelectedSuspectId(suspect.id);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
              selectedSuspectId === suspect.id
                ? 'bg-amber-950/80 border-amber-500/70 text-amber-200 shadow-sm'
                : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{suspect.name}</span>
            <span className="text-[10px] opacity-70">({suspect.title.split(' ')[0]})</span>
          </button>
        ))}
      </div>

      {/* Suspect Card Detail */}
      <div className="mt-4 p-4 rounded-lg bg-zinc-950 border border-zinc-800">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-2">
          <div>
            <h5 className="text-sm font-bold text-zinc-100">{currentSuspect.name}</h5>
            <p className="text-xs text-zinc-400">{currentSuspect.title} · {currentSuspect.age} Yaşında</p>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">Resmi Alibi:</span>
            <span className="text-xs text-zinc-300 font-medium">{currentSuspect.alibi.substring(0, 48)}...</span>
          </div>
        </div>

        {/* Clickable Statement Highlighter */}
        <div className="mt-3">
          <p className="text-xs text-zinc-400 mb-2 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>İfadedeki çelişkileri ve ipuçlarını işaretlemek için cümlelere tıklayın:</span>
          </p>

          <div className="space-y-2">
            {suspectClues.map((clue) => {
              const isChecked = !!highlightedClues[clue.id];
              return (
                <div
                  key={clue.id}
                  onClick={() => handleToggleClue(clue.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-amber-950/40 border-amber-600/70 text-amber-100'
                      : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs leading-relaxed italic">{clue.text}</p>
                    {isChecked ? (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-zinc-700 shrink-0 mt-0.5" />
                    )}
                  </div>

                  {isChecked && (
                    <div className="mt-2.5 pt-2 border-t border-amber-900/40">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold font-typewriter uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {clue.tag}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 mt-1.5 font-sans leading-relaxed">
                        {clue.insight}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pin Finding Action */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-2">
        <span className="text-xs text-zinc-400">
          Bu sorgu ve psikolojik analiz notunu masadaki diğer dedektiflerle paylaşın.
        </span>
        <button
          type="button"
          onClick={handlePin}
          disabled={isAlreadyPinned}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            isAlreadyPinned
              ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
              : 'bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold shadow-sm'
          }`}
        >
          <Pin className="w-3.5 h-3.5" />
          {isAlreadyPinned ? 'Ortak Panoya Yansıtıldı' : '📌 Özeti Ortak Panoya Yansıt'}
        </button>
      </div>
    </div>
  );
};
