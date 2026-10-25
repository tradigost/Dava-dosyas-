/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SharedPin, Suspect } from '../types';
import { soundManager } from '../utils/audioEffects';
import { Pin, Plus, Trash2, Tag, Clock, User, ShieldAlert, Sparkles } from 'lucide-react';

interface SharedCaseBoardProps {
  pins: SharedPin[];
  suspects: Suspect[];
  activeEnvelope: number;
  onAddCustomNote: (text: string) => void;
  onRemovePin?: (id: string) => void;
}

export const SharedCaseBoard: React.FC<SharedCaseBoardProps> = ({
  pins,
  suspects,
  activeEnvelope,
  onAddCustomNote,
  onRemovePin,
}) => {
  const [filterEnvelope, setFilterEnvelope] = useState<number | 'all'>('all');
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const filteredPins = pins.filter((p) => {
    if (filterEnvelope === 'all') return true;
    return p.envelope === filterEnvelope;
  });

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    soundManager.playPinSound();
    onAddCustomNote(newNoteText.trim());
    setNewNoteText('');
    setIsAddingNote(false);
  };

  return (
    <div className="bg-cork rounded-2xl border border-amber-900/40 p-4 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Wooden Frame Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-amber-800/30">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-amber-200 tracking-wide">
              Masa Ortak Dava Panosu (Delil Odası)
            </h3>
          </div>
          <p className="text-xs text-amber-400/80 mt-1">
            Masadaki tüm dedektiflerin uzmanlıklarından yansıttığı ortak kanıtlar ve bağlantılar.
          </p>
        </div>

        {/* Envelope Filters */}
        <div className="flex items-center gap-1.5 bg-zinc-950/80 p-1 rounded-lg border border-amber-900/40 text-xs">
          <button
            type="button"
            onClick={() => setFilterEnvelope('all')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              filterEnvelope === 'all'
                ? 'bg-amber-600 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Tümü ({pins.length})
          </button>
          {[1, 2, 3].map((envNum) => (
            <button
              key={envNum}
              type="button"
              onClick={() => setFilterEnvelope(envNum)}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                filterEnvelope === envNum
                  ? 'bg-amber-600 text-zinc-950 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Zarf {envNum}
            </button>
          ))}
        </div>
      </div>

      {/* Suspect Polaroids Bar on Corkboard */}
      <div className="mt-5">
        <span className="text-xs font-typewriter uppercase tracking-wider text-amber-300/80 block mb-3">
          📌 Şüpheli Dosyaları & Profil Fotoğrafları:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {suspects.map((suspect) => (
            <div
              key={suspect.id}
              className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 shadow-md relative group hover:border-amber-700/50 transition-colors"
            >
              {/* Pushpin at top */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-rose-600 rounded-full shadow-lg border border-rose-300 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full opacity-60" />
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-lg border flex items-center justify-center font-bold text-sm ${suspect.photoPlaceholder.silhouetteStyle}`}
                >
                  {suspect.photoPlaceholder.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-zinc-100 truncate">{suspect.name}</h4>
                  <p className="text-[11px] text-zinc-400 truncate">{suspect.title}</p>
                  <p className="text-[10px] text-amber-400/90 mt-0.5 truncate">{suspect.relation}</p>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400 line-clamp-2">
                &ldquo;{suspect.suspiciousQuotes[0]}&rdquo;
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pinned Evidence Cards Area */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-typewriter uppercase tracking-wider text-amber-300/80 flex items-center gap-1.5">
            <Pin className="w-3.5 h-3.5 text-amber-400" />
            Yansıtılan Deliller ve İpuçları ({filteredPins.length})
          </span>

          <button
            type="button"
            onClick={() => setIsAddingNote(!isAddingNote)}
            className="flex items-center gap-1 px-2.5 py-1 bg-amber-900/40 hover:bg-amber-800/50 text-amber-300 rounded text-xs border border-amber-700/40 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Masa Notu Ekle
          </button>
        </div>

        {/* Add Note Input Modal / Box */}
        {isAddingNote && (
          <form
            onSubmit={handleCreateNote}
            className="mb-4 p-3 bg-amber-950/40 border border-amber-600/50 rounded-lg flex flex-col gap-2"
          >
            <label className="text-xs text-amber-200 font-medium">Masaya Dedektif Notu İğnele:</label>
            <input
              type="text"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Örn: 'Dr. Kerem'in alibisi ile Cemil'in gördüğü saat uyuşmuyor!'"
              className="px-3 py-1.5 bg-zinc-950 border border-amber-800/60 rounded text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingNote(false)}
                className="px-2.5 py-1 text-xs text-zinc-400 hover:text-zinc-200"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-amber-600 text-zinc-950 font-bold rounded text-xs hover:bg-amber-500"
              >
                İğnele
              </button>
            </div>
          </form>
        )}

        {filteredPins.length === 0 ? (
          <div className="p-8 text-center bg-zinc-950/60 border border-amber-950/40 rounded-xl text-zinc-400 text-xs">
            <Pin className="w-6 h-6 text-amber-600/50 mx-auto mb-2" />
            <p className="font-semibold text-zinc-300">Henüz ortak panoya yansıtılmış delil yok.</p>
            <p className="mt-1 text-zinc-500">
              Telefon ekranlarınızdaki raporlarda bulunan &ldquo;📌 Özeti Ortak Panoya Yansıt&rdquo; butonlarına tıklayarak bulguları buraya aktarın.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredPins.map((pin) => (
              <div
                key={pin.id}
                className="bg-zinc-950/90 border border-amber-900/30 rounded-xl p-4 shadow-lg relative group transition-all hover:border-amber-600/50 hover:-translate-y-0.5"
              >
                {/* Yellow tape effect at top */}
                <div className="w-16 h-3 bg-amber-500/20 border-b border-amber-500/30 -mt-4 mx-auto rounded-b" />

                <div className="flex items-start justify-between gap-2 mt-2">
                  <h4 className="text-xs font-bold text-amber-200 leading-snug">{pin.title}</h4>
                  <span className="text-[10px] font-typewriter px-1.5 py-0.5 rounded bg-zinc-800 text-amber-300 shrink-0">
                    Zarf {pin.envelope}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                  {pin.excerpt}
                </p>

                <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1 text-amber-400/90 font-medium truncate">
                    <User className="w-3 h-3 shrink-0" />
                    {pin.pinnedByPlayerName} ({pin.pinnedByRole})
                  </span>
                  <span className="text-zinc-400 shrink-0">{pin.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
