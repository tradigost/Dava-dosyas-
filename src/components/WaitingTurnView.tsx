/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EnvelopeNumber, RoleType } from '../types';
import { ROLES } from '../data/cases';
import { Radio } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface WaitingTurnViewProps {
  currentEnvelope: EnvelopeNumber;
  totalEnvelopes?: number;
  activeInspectorName: string;
  activeInspectorRole: RoleType | string;
}

export const WaitingTurnView: React.FC<WaitingTurnViewProps> = ({
  currentEnvelope,
  totalEnvelopes = 3,
  activeInspectorName,
  activeInspectorRole,
}) => {
  const roleTitle = ROLES[activeInspectorRole as RoleType]?.title || activeInspectorRole;

  return (
    <div className="max-w-md mx-auto py-12 sm:py-20 px-4 text-center">
      <div className="bg-[#fffdf8] border border-[#1f1c18] rounded-sm p-8 sm:p-10 shadow-[0_6px_24px_rgba(31,28,24,0.08)] space-y-6">
        
        {/* Game Logo Badge */}
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-sm bg-[#faf6ed] border-2 border-[#1f1c18] flex items-center justify-center mx-auto text-[#1f1c18]">
            <BrandLogo variant="mark" className="w-14 h-14" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#fffdf8] border border-[#8b1e1e] flex items-center justify-center">
            <Radio className="w-3.5 h-3.5 text-[#8b1e1e] animate-pulse" />
          </div>
        </div>

        {/* Status Message */}
        <div className="space-y-2">
          <span className="text-[10px] font-typewriter uppercase tracking-widest text-[#8b1e1e] block font-bold">
            ZARF {currentEnvelope} / {totalEnvelopes} ŞU AN AÇIK
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-typewriter text-[#1f1c18]">
            {activeInspectorName}
          </h3>
          <p className="text-xs text-[#575046] font-typewriter font-medium">
            ({roleTitle}) dosyasını inceliyor
          </p>
        </div>

        {/* Discreet Table Guidance */}
        <div className="p-3 bg-[#faf6ed] rounded-sm border border-[#d6cdbc] text-xs text-[#575046] leading-relaxed font-sans">
          Lütfen arkadaşınızın sesli okumasını ve masadaki anlatımını dinleyin. Dosya kapatıldığında sıra sonraki dedektife geçecektir.
        </div>

      </div>
    </div>
  );
};
