/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CaseScenario, Player } from '../types';
import { soundManager } from '../utils/audioEffects';
import { ShieldCheck, Play, Radio, Volume2 } from 'lucide-react';

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
        <div className="bg-zinc-950 border border-amber-600/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          
          {/* Header Banner */}
          <div className="border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest mb-1.5">
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span>MASA ŞEFİ OLAY YERİ BRİFİNGİ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-zinc-100 tracking-tight">
              {scenario.title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              {scenario.subtitle}
            </p>
          </div>

          {/* Attention Directive Box */}
          <div className="p-3.5 bg-amber-950/30 border border-amber-600/40 rounded-2xl text-xs sm:text-sm text-amber-200 leading-relaxed">
            📢 <strong>Masadaki Dedektiflerin Dikkatini Toplayın:</strong> Lütfen aşağıdaki olay yeri özetini masadaki arkadaşlarınıza <strong>yüksek sesle</strong> okuyun.
          </div>

          {/* Victim & Crime Scene Dossier Sheet */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4 text-xs sm:text-sm leading-relaxed">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-zinc-800/80 text-zinc-300">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Maktul:</span>
                <strong className="text-zinc-100">{scenario.victim.name} ({scenario.victim.age})</strong>
                <span className="text-zinc-400 block text-[11px]">{scenario.victim.title}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Olay Yeri & Tahmini Saat:</span>
                <span className="text-zinc-200">{scenario.victim.locationOfBody}</span>
                <span className="text-amber-400 block font-mono text-[11px]">{scenario.victim.timeOfDeath}</span>
              </div>
            </div>

            {/* Narrative Story */}
            <div className="text-zinc-200 font-serif text-sm sm:text-base leading-relaxed space-y-3 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/50">
              <p>
                {scenario.synopsis}
              </p>
              <div className="pt-2 border-t border-zinc-800/80 text-xs text-zinc-400 font-sans space-y-1">
                <p>
                  <strong className="text-zinc-300">İlk Olay Yeri Tespiti:</strong> {scenario.victim.causeInitial}
                </p>
                <p>
                  <strong className="text-zinc-300">Cesedin Bulunduğu Konum:</strong> {scenario.victim.locationOfBody}
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
              className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer ring-2 ring-amber-400/40 animate-pulse"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>
                🎙️ Masaya Sesli Okudum, 1. Zarfı {firstInspector.name}&apos;e Teslim Et &amp; Başlat
              </span>
            </button>
            <p className="text-[11px] text-zinc-500 text-center mt-2 font-mono">
              * Devam ettiğinizde 1. Zarf doğrudan {firstInspector.name} ({firstInspector.role.toUpperCase()}) ekranında açılacaktır.
            </p>
          </div>

        </div>
      ) : (
        /* Guest View: Shows logo & waiting status */
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 sm:p-12 text-center shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
            <Volume2 className="w-8 h-8 animate-pulse text-amber-400" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
              MASADAKİ DOSYA · VAKA BRİFİNGİ
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-zinc-100">
              Masa Şefi ({hostName}) Olay Yeri Brifingini Okuyor...
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
              Lütfen masa şefinizin sesli anlatımını dinleyin. Olayın genel tablosu dinlendikten sonra 1. Zarf ilgili uzmanın telefonunda açılacaktır.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
            <Radio className="w-3.5 h-3.5 text-amber-500 animate-ping" />
            <span>Şefin onayı bekleniyor...</span>
          </div>
        </div>
      )}
    </div>
  );
};
