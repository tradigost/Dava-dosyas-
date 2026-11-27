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
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>(suspects[0]?.id || '');
  const [highlightedClues, setHighlightedClues] = useState<Record<string, boolean>>({});

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
  const matchedClues = clues.filter((c) => c.suspectId === currentSuspect?.id);
  const suspectClues: ClueSentence[] =
    matchedClues.length > 0
      ? matchedClues
      : (currentSuspect?.suspiciousQuotes || []).map((q, idx) => ({
          id: `${currentSuspect.id}-q-${idx}`,
          suspectId: currentSuspect.id,
          text: q,
          tag: idx === 0 ? 'İFADE ANALİZİ' : 'ALİBİ KONTROLÜ',
          isCrucial: idx === 0,
          insight: currentSuspect.motiveHypothesis || currentSuspect.alibi,
        }));

  const handlePin = () => {
    soundManager.playPinSound();
    onPinFinding(
      `🧠 Profilleme & Sorgu: ${currentSuspect?.name || 'Şüpheli'}`,
      currentSuspect
        ? `${currentSuspect.name} (${currentSuspect.title}): ${currentSuspect.alibi} — Şüpheli beyan: ${currentSuspect.suspiciousQuotes?.[0] || ''}`
        : 'Şüpheli ifade çelişkileri panoya eklendi.',
      'interrogation'
    );
  };

  return (
    <div className="bg-[#faf6ed] border border-[#d6cdbc] rounded-sm p-4 sm:p-5 text-[#1f1c18]">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#d6cdbc]">
        <div className="flex items-center gap-2">
          <Fingerprint className="w-5 h-5 text-[#8b1e1e]" />
          <h4 className="font-semibold font-typewriter text-sm sm:text-base text-[#1f1c18]">
            Davranış Bilimleri & İfade Çelişki İşaretçisi
          </h4>
        </div>
        <span className="text-xs text-[#7c7265] font-typewriter">
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
            className={`px-3 py-1.5 rounded-sm text-xs font-typewriter font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentSuspect?.id === suspect.id
                ? 'bg-[#1f1c18] border-[#1f1c18] text-[#faf6ed]'
                : 'bg-[#fffdf8] border-[#c8bfae] text-[#1f1c18] hover:border-[#1f1c18]'
            }`}
          >
            {suspect.photoUrl ? (
              <img
                src={suspect.photoUrl}
                alt={suspect.name}
                className="w-5 h-5 rounded-full object-cover border border-[#c8bfae]"
              />
            ) : (
              <UserCheck className="w-3.5 h-3.5" />
            )}
            <span>{suspect.name}</span>
            <span className="text-[10px] opacity-75">({suspect.title.split(' ')[0]})</span>
          </button>
        ))}
      </div>

      {/* Suspect Card Detail */}
      {currentSuspect && (
        <div className="mt-4 p-4 rounded-sm bg-[#fffdf8] border border-[#d6cdbc]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d6cdbc] pb-2">
            <div>
              <h5 className="text-sm font-bold font-typewriter text-[#1f1c18]">{currentSuspect.name}</h5>
              <p className="text-xs text-[#575046]">{currentSuspect.title} · {currentSuspect.age} Yaşında</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#7c7265] font-typewriter uppercase tracking-wider block">Resmi Alibi:</span>
              <span className="text-xs text-[#1f1c18] font-medium">{currentSuspect.alibi.substring(0, 56)}...</span>
            </div>
          </div>

          {/* Clickable Statement Highlighter */}
          <div className="mt-3">
            <p className="text-xs text-[#575046] mb-2 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-[#8b1e1e]" />
              <span>İfadedeki çelişkileri ve ipuçlarını işaretlemek için cümlelere tıklayın:</span>
            </p>

            <div className="space-y-2">
              {suspectClues.map((clue) => {
                const isChecked = !!highlightedClues[clue.id];
                return (
                  <div
                    key={clue.id}
                    onClick={() => handleToggleClue(clue.id)}
                    className={`p-3 rounded-sm border cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-[#faf6ed] border-[#8b1e1e] text-[#1f1c18]'
                        : 'bg-[#fffdf8] border-[#d6cdbc] text-[#4a443c] hover:border-[#8c8273]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs leading-relaxed italic">{clue.text}</p>
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-[#8b1e1e] shrink-0 mt-0.5" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-[#c8bfae] shrink-0 mt-0.5" />
                      )}
                    </div>

                    {isChecked && (
                      <div className="mt-2.5 pt-2 border-t border-dashed border-[#d6cdbc]">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold font-typewriter uppercase px-1.5 py-0.5 rounded-sm bg-[#8b1e1e]/10 text-[#8b1e1e] border border-[#8b1e1e]/30">
                            {clue.tag}
                          </span>
                        </div>
                        <p className="text-xs text-[#575046] mt-1.5 font-sans leading-relaxed">
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
      )}

      {/* Pin Finding Action */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-2">
        <span className="text-xs text-[#575046]">
          Bu sorgu ve psikolojik analiz notunu masadaki diğer dedektiflerle paylaşın.
        </span>
        <button
          type="button"
          onClick={handlePin}
          disabled={isAlreadyPinned}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm text-xs font-typewriter font-semibold transition-colors ${
            isAlreadyPinned
              ? 'bg-[#ebe5d8] text-[#7c7265] border border-[#d6cdbc] cursor-not-allowed'
              : 'bg-[#1f1c18] hover:bg-[#8b1e1e] text-[#faf6ed] font-bold cursor-pointer'
          }`}
        >
          <Pin className="w-3.5 h-3.5" />
          {isAlreadyPinned ? 'Ortak Panoya Yansıtıldı' : 'Özeti Ortak Panoya Yansıt'}
        </button>
      </div>
    </div>
  );
};
