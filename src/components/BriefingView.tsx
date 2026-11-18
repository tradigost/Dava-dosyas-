/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CaseScenario, Player } from '../types';
import { soundManager } from '../utils/audioEffects';
import { Play } from 'lucide-react';

interface BriefingViewProps {
  scenario: CaseScenario;
  isHost: boolean;
  hostName: string;
  firstInspector: Player;
  onFinishBriefing: () => void;
}

export const BriefingView: React.FC<BriefingViewProps> = ({
  scenario,
  isHost,
  hostName,
  firstInspector,
  onFinishBriefing,
}) => {
  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 px-3 sm:px-4">
      {isHost ? (
        /* Host View: Reads the case prologue aloud to the table */
        <div className="bg-[#fffdf8] border border-[#d6cdbc] rounded-sm p-6 sm:p-8 shadow-[0_2px_12px_rgba(31,28,24,0.08)] space-y-6 relative overflow-hidden">
          
          {/* Header Banner */}
          <div className="border-b border-[#1f1c18] pb-3">
            <div className="flex items-center gap-2 text-[#8b1e1e] text-xs font-typewriter font-bold uppercase tracking-widest mb-1.5">
              MASA ŞEFİ OLAY YERİ BRİFİNGİ
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-typewriter text-[#1f1c18] tracking-tight">
              {scenario.title.toUpperCase()}
            </h2>
            <p className="text-sm text-[#575046] mt-1">
              {scenario.subtitle}
            </p>
          </div>

          {/* Attention Directive Box */}
          <div className="border-l-2 border-[#8b1e1e] bg-[#faf6ed] p-3 text-xs sm:text-sm text-[#1f1c18] leading-relaxed">
            📢 <strong>Masadaki Dedektiflerin Dikkatini Toplayın:</strong> Lütfen aşağıdaki olay yeri özetini masadaki arkadaşlarınıza <strong>yüksek sesle</strong> okuyun.
          </div>

          {/* Victim & Crime Scene Dossier Sheet */}
          <div className="bg-[#faf6ed] border border-[#d6cdbc] rounded-sm p-5 space-y-4 text-xs sm:text-sm leading-relaxed">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-y border-dashed border-[#c8bfae] py-3">
              <div>
                <span className="text-[10px] font-typewriter text-[#575046] uppercase block">Maktul:</span>
                <strong className="text-[#1f1c18]">{scenario.victim.name} ({scenario.victim.age})</strong>
                <span className="text-[#4a443c] block text-[11px]">{scenario.victim.title}</span>
              </div>
              <div>
                <span className="text-[10px] font-typewriter text-[#575046] uppercase block">Olay Yeri & Tahmini Saat:</span>
                <span className="text-[#1f1c18]">{scenario.victim.locationOfBody}</span>
                <span className="text-[#8b1e1e] block font-typewriter text-[11px]">{scenario.victim.timeOfDeath}</span>
              </div>
            </div>

            {/* Narrative Story */}
            <div className="text-[#1f1c18] font-typewriter text-sm sm:text-base leading-relaxed space-y-3">
              <p>
                {scenario.synopsis}
              </p>
              <div className="pt-2 border-t border-[#c8bfae] text-xs text-[#4a443c] font-typewriter space-y-1">
                <p>
                  <strong className="text-[#1f1c18]">İlk Olay Yeri Tespiti:</strong> {scenario.victim.causeInitial}
                </p>
                <p>
                  <strong className="text-[#1f1c18]">Cesedin Bulunduğu Konum:</strong> {scenario.victim.locationOfBody}
                </p>
              </div>
            </div>
          </div>

          {/* Transition Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playSuccessSound();
                onFinishBriefing();
              }}
              className="w-full py-4 bg-[#1f1c18] hover:bg-[#36312b] text-[#faf6ed] font-bold rounded-sm uppercase tracking-wider text-sm sm:text-base transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>
                MASAYA SESLİ OKUDUM · 1. ZARFI BAŞLAT
              </span>
            </button>
            <p className="text-[11px] text-[#575046] text-center mt-2 font-typewriter">
              * Devam ettiğinizde 1. Zarf doğrudan {firstInspector.name}&apos;e teslim edilecektir.
            </p>
          </div>

        </div>
      ) : (
        /* Guest View: Shows logo & waiting status */
        <div className="bg-[#fffdf8] border border-[#d6cdbc] rounded-sm p-8 sm:p-12 text-center shadow-[0_2px_12px_rgba(31,28,24,0.08)] space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#8b1e1e]/10 border border-[#8b1e1e]/40 flex items-center justify-center mx-auto text-[#8b1e1e]">
            <Play className="w-8 h-8 text-[#8b1e1e]" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-typewriter uppercase tracking-widest text-[#8b1e1e] block">
              MASADAKİ DOSYA · VAKA BRİFİNGİ
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-typewriter text-[#1f1c18]">
              Masa Şefi ({hostName}) Olay Yeri Brifingini Okuyor...
            </h2>
            <p className="text-xs sm:text-sm text-[#4a443c] max-w-md mx-auto leading-relaxed">
              Lütfen masa şefinizin sesli anlatımını dinleyin. Olayın genel tablosu dinlendikten sonra 1. Zarf ilgili uzmanın telefonunda açılacaktır.
            </p>
          </div>

        </div>
      )}
    </div>
  );
};
