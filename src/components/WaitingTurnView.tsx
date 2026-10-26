/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EnvelopeNumber, RoleType } from '../types';
import { ROLES } from '../data/cases';
import { Radio, Eye } from 'lucide-react';

interface WaitingTurnViewProps {
  currentEnvelope: EnvelopeNumber;
  activeInspectorName: string;
  activeInspectorRole: RoleType | string;
}

export const WaitingTurnView: React.FC<WaitingTurnViewProps> = ({
  currentEnvelope,
  activeInspectorName,
  activeInspectorRole,
}) => {
  const roleTitle = ROLES[activeInspectorRole as RoleType]?.title || activeInspectorRole;

  return (
    <div className="max-w-md mx-auto py-12 sm:py-20 px-4 text-center">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        
        {/* Game Logo Badge */}
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto shadow-inner text-amber-400">
            <span className="font-cinzel text-3xl font-black tracking-widest text-amber-300">
              MD
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Status Message */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block font-bold">
            ZARF {currentEnvelope} ŞU AN AÇIK
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-cinzel text-zinc-100">
            {activeInspectorName}
          </h3>
          <p className="text-xs text-amber-300 font-mono font-medium">
            ({roleTitle}) dosyasını inceliyor
          </p>
        </div>

        {/* Discreet Table Guidance */}
        <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80 text-xs text-zinc-400 leading-relaxed font-sans">
          Lütfen arkadaşınızın sesli okumasını ve masadaki anlatımını dinleyin. Dosya kapatıldığında sıra sonraki dedektife geçecektir.
        </div>

      </div>
    </div>
  );
};
