/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, FolderOpen, Gavel, Users, X } from 'lucide-react';
import { soundManager } from '../utils/audioEffects';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  const handleDismiss = () => {
    soundManager.playKeyClick();
    try {
      localStorage.setItem('suc_dosyasi_seen_guide_v1', '1');
    } catch {
      // ignore storage errors
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1f1c18]/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md paper-sheet rounded-sm border border-[#1f1c18] p-6 relative">
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-[#7c7265] hover:text-[#1f1c18] p-1 cursor-pointer"
          aria-label="Kapat"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-[10px] font-typewriter uppercase tracking-[0.2em] text-[#8b1e1e] font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>SUÇ DOSYASI · BRİFİNG REHBERİ</span>
        </div>

        <h3 className="mt-2 text-lg font-bold font-typewriter text-[#1f1c18]">
          3 Adımda Nasıl Oynanır?
        </h3>
        <p className="mt-1 text-xs text-[#575046]">
          Tek cihazdan yan yana (sırayla geçirerek) veya herkes kendi telefonundan Online Masa ile oynayabilirsiniz.
        </p>

        <div className="mt-4 space-y-3">
          <div className="p-3 bg-[#fffdf8] border border-[#d6cdbc] rounded-sm flex items-start gap-3">
            <div className="w-7 h-7 rounded-sm bg-[#1f1c18] text-[#faf6ed] font-typewriter font-bold text-xs flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-typewriter font-bold text-xs text-[#1f1c18]">01 · Masayı Kur</p>
              <p className="text-[11px] text-[#575046] mt-0.5 leading-relaxed">
                Bir vaka seçin ve dedektif ekibini belirleyin. Her oyuncu farklı bir uzmanlık rolü üstlenir.
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#fffdf8] border border-[#d6cdbc] rounded-sm flex items-start gap-3">
            <div className="w-7 h-7 rounded-sm bg-[#8b1e1e] text-[#faf6ed] font-typewriter font-bold text-xs flex items-center justify-center shrink-0">
              <FolderOpen className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-typewriter font-bold text-xs text-[#1f1c18]">02 · Gizli Zarfını İncele</p>
              <p className="text-[11px] text-[#575046] mt-0.5 leading-relaxed">
                Her zarfta yalnızca ilgili uzmanların gördüğü adli tıp raporları, ses kayıtları ve sorgular açılır. Bulgularınızı sesli tartışın.
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#fffdf8] border border-[#d6cdbc] rounded-sm flex items-start gap-3">
            <div className="w-7 h-7 rounded-sm bg-[#276749] text-[#faf6ed] font-typewriter font-bold text-xs flex items-center justify-center shrink-0">
              <Gavel className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-typewriter font-bold text-xs text-[#1f1c18]">03 · Çelişkileri Yakala &amp; Oyla</p>
              <p className="text-[11px] text-[#575046] mt-0.5 leading-relaxed">
                Doğrulama sorularını çözüp tüm zarfları bitirdiğinizde katili, sebebi ve kilit kanıtı işaretleyin.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="mt-5 w-full py-2.5 bg-[#1f1c18] hover:bg-[#8b1e1e] text-[#faf6ed] font-typewriter font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
        >
          Anladım, Masaya Geç
        </button>
      </div>
    </div>
  );
};
