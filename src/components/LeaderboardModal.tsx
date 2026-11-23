/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Award, Loader2, Trophy, X } from 'lucide-react';
import {
  DetectiveProfile,
  fetchDetectiveLeaderboard,
  LeaderboardEntry,
} from '../services/firebase';

interface LeaderboardModalProps {
  currentUser?: DetectiveProfile | null;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  currentUser,
  onClose,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchDetectiveLeaderboard(15)
      .then((data) => {
        if (active) setEntries(data);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#1f1c18]/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg paper-sheet rounded-sm border border-[#1f1c18] p-5 sm:p-6 relative max-h-[85vh] flex flex-col">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-[#7c7265] hover:text-[#1f1c18] p-1 cursor-pointer"
          aria-label="Kapat"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-[10px] font-typewriter uppercase tracking-[0.2em] text-[#8b1e1e] font-bold">
          <Trophy className="w-3.5 h-3.5" />
          <span>EMNİYET SİCİL SIRALAMASI</span>
        </div>

        <h3 className="mt-1.5 text-lg font-bold font-typewriter text-[#1f1c18]">
          Dedektif Rütbe &amp; XP Tablosu
        </h3>
        <p className="mt-0.5 text-xs text-[#575046]">
          Giriş yapan dedektiflerin çözdüğü dosyalar ve biriken sicil puanları.
        </p>

        <div className="mt-4 flex-1 overflow-y-auto space-y-2 pr-1">
          {isLoading ? (
            <div className="py-10 text-center text-xs text-[#7c7265] flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sicil kayıtları yükleniyor...</span>
            </div>
          ) : entries.length === 0 ? (
            <div className="py-10 text-center border border-dashed border-[#c8bfae] rounded-sm text-xs text-[#7c7265]">
              Henüz kayıtlı sicil puanı yok. Giriş yapıp ilk vakayı çözerek liderliğe yerleşin!
            </div>
          ) : (
            entries.map((entry, idx) => {
              const isMe = currentUser?.uid === entry.uid;
              return (
                <div
                  key={entry.uid}
                  className={`p-3 rounded-sm border flex items-center justify-between gap-3 ${
                    isMe
                      ? 'bg-[#fffdf8] border-[#1f1c18]'
                      : 'bg-[#faf6ed] border-[#d6cdbc]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-sm border flex items-center justify-center font-typewriter font-bold text-xs shrink-0 ${
                        idx === 0
                          ? 'bg-[#8b1e1e] border-[#8b1e1e] text-[#faf6ed]'
                          : idx < 3
                          ? 'bg-[#1f1c18] border-[#1f1c18] text-[#faf6ed]'
                          : 'bg-[#ebe5d8] border-[#c8bfae] text-[#1f1c18]'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-typewriter font-bold text-xs text-[#1f1c18] truncate">
                        {entry.displayName} {isMe ? '(Sen)' : ''}
                      </p>
                      <p className="text-[11px] text-[#575046] truncate flex items-center gap-1">
                        <Award className="w-3 h-3 text-[#8b1e1e] shrink-0" />
                        <span>{entry.rankTitle} · {entry.solvedCount} vaka</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-typewriter font-bold text-xs text-[#1f1c18]">
                      {entry.totalXp} XP
                    </p>
                    <p className="text-[10px] text-[#7c7265]">En iyi: {entry.bestScore}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
