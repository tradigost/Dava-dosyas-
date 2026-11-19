/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CaseScenario, getScenarioTotalEnvelopes } from '../types';
import { ROLES } from '../data/cases';
import { canStartScenario } from '../utils/gameRules';
import { soundManager } from '../utils/audioEffects';
import {
  DetectiveProfile,
  fetchScenarioRatings,
  auth,
  ADMIN_EMAIL,
} from '../services/firebase';
import { isVerifiedAdminUser } from '../utils/scenarioUtils';
import {
  Play,
  LogIn,
  ShieldCheck,
  UserCheck,
  Smartphone,
  CheckCircle2
} from 'lucide-react';

interface LobbyViewProps {
  scenarios: CaseScenario[];
  selectedScenarioId: string;
  onSelectScenario: (id: string) => void;
  playerCount: number;
  onChangePlayerCount: (count: number) => void;
  playerNames: string[];
  onChangePlayerName: (index: number, name: string) => void;
  onStartGame: () => void;
  onOpenOnlineModal: () => void;
  onOpenAuthModal?: () => void;
  onOpenAdminModal?: () => void;
  currentUser?: DetectiveProfile | null;
  onlineRoomCode?: string | null;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  scenarios,
  selectedScenarioId,
  onSelectScenario,
  playerCount,
  onChangePlayerCount,
  playerNames,
  onChangePlayerName,
  onStartGame,
  onOpenOnlineModal,
  onOpenAuthModal,
  onOpenAdminModal,
  currentUser,
  onlineRoomCode,
}) => {
  const [lockedAlertReason, setLockedAlertReason] = useState<string | null>(null);
  const [ratingsMap, setRatingsMap] = useState<Record<string, { average: number; count: number }>>({});

  useEffect(() => {
    // Load ratings for all scenarios
    scenarios.forEach(async (sc) => {
      try {
        const res = await fetchScenarioRatings(sc.id);
        setRatingsMap((prev) => ({
          ...prev,
          [sc.id]: { average: res.averageRating, count: res.totalReviews },
        }));
      } catch (e) {}
    });
  }, [scenarios]);

  const selectedScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];
  const canStart = canStartScenario(playerCount, selectedScenario);

  const roleAssignmentKeys = ['forensics', 'cryptology', 'profiler', 'field', 'ballistics', 'archive'] as const;

  const handleSelectScenarioItem = (scenario: CaseScenario) => {
    soundManager.playKeyClick();
    onSelectScenario(scenario.id);
    const check = canStartScenario(playerCount, scenario);
    if (!check.allowed) {
      setLockedAlertReason(check.reason || null);
    } else {
      setLockedAlertReason(null);
    }
  };

  const handleCountChange = (num: number) => {
    soundManager.playKeyClick();
    onChangePlayerCount(num);
    const check = canStartScenario(num, selectedScenario);
    if (!check.allowed) {
      setLockedAlertReason(check.reason || null);
    } else {
      setLockedAlertReason(null);
    }
  };

  const handleStart = () => {
    if (!canStart.allowed) {
      soundManager.playErrorSound();
      setLockedAlertReason(canStart.reason || 'Oyuncu sayısı yetersiz.');
      return;
    }
    soundManager.playSuccessSound();
    onStartGame();
  };

  return (
    <div className="bg-[#ebe5d8] min-h-screen flex flex-col items-center justify-center px-4">
      {/* Top Utility Row */}
      <div className="flex items-center justify-between w-full max-w-3xl mb-8">
        <div className="flex items-center gap-2">
          {currentUser && !currentUser.isGuest ? (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="bg-[#faf6ed] border border-[#c8bfae] text-[#1f1c18] hover:border-[#1f1c18] rounded-sm px-3 py-1.5 text-xs font-typewriter transition-all cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentUser.displayName}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="bg-[#faf6ed] hover:bg-[#ebe5d8] border border-[#c8bfae] hover:border-[#c8bfae] text-[#1f1c18] text-xs font-typewriter font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Dedektif Girişi</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenOnlineModal}
            className="bg-[#faf6ed] hover:bg-[#ebe5d8] border border-[#c8bfae] hover:border-[#c8bfae] text-[#1f1c18] text-xs font-typewriter font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{onlineRoomCode ? `Oda: ${onlineRoomCode}` : 'Online Masa'}</span>
          </button>
          {isVerifiedAdminUser(auth.currentUser, ADMIN_EMAIL) && (
            <button
              type="button"
              onClick={onOpenAdminModal}
              className="bg-[#faf6ed] border border-[#8b1e1e]/40 text-[#8b1e1e] text-xs font-typewriter font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>🛠️ Yönetici Paneli</span>
            </button>
          )}
        </div>
      </div>

      {/* Calm Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1f1c18] font-typewriter tracking-widest">
          MASADAKİ DOSYA
        </h1>
        <div className="border-b-2 border-[#1f1c18] pb-3"></div>
        <p className="text-xs sm:text-sm text-[#575046] font-typewriter">
          Belgeleri sırayla inceleyin, bulgularınızı birleştirin ve katili bulun.
        </p>
      </div>

      {/* Step 1 — Dava Dosyası Seçimi */}
      <div className="space-y-4 mb-8">
        <h2 className="text-xs font-typewriter uppercase tracking-wider text-[#1f1c18]">
          1. DAVA DOSYASI SEÇİMİ
        </h2>
        {lockedAlertReason && (
          <div className="text-[#8b1e1e] text-[11px] font-bold font-typewriter">
            {lockedAlertReason}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {scenarios.map((scenario) => {
            const isSelected = selectedScenarioId === scenario.id;
            const scenarioCheck = canStartScenario(playerCount, scenario);
            const isLocked = !scenarioCheck.allowed;
            const stats = ratingsMap[scenario.id] || { average: 4.9, count: 12 };

            return (
              <div
                key={scenario.id}
                onClick={() => handleSelectScenarioItem(scenario)}
                className={`paper-sheet rounded-sm p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#fffdf8] border-[#1f1c18] ring-1 ring-[#1f1c18]'
                    : 'bg-[#faf6ed] border-[#d6cdbc] hover:border-[#8c8273]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base uppercase tracking-wide text-[#1f1c18] font-typewriter">
                    {scenario.title}
                  </h3>
                  {isLocked ? (
                    <span className="text-[#8b1e1e] text-[11px] font-bold font-typewriter">
                      KİLİTLİ: EN AZ {scenario.minPlayers} KİŞİ
                    </span>
                  ) : isSelected ? (
                    <span className="border border-[#8b1e1e] text-[#8b1e1e] px-1.5 py-0.5 text-[10px] uppercase tracking-wider font-typewriter">
                      SEÇİLDİ
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-[#4a443c] line-clamp-2 mt-1.5 leading-relaxed font-typewriter">
                  {scenario.synopsis}
                </p>
                <div className="text-[11px] text-[#7c7265] mt-3 pt-2 border-t border-dashed border-[#d6cdbc] font-typewriter">
                  ~{scenario.estimatedMinutes} dk · {scenario.suspects?.length || 0} ŞÜPHELİ · {getScenarioTotalEnvelopes(scenario)} ZARF · ★ {stats.average}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2 — Masadaki Oyuncu Sayısı & İsimler */}
      <div className="space-y-4 mb-8">
        <h2 className="text-xs font-typewriter uppercase tracking-wider text-[#1f1c18]">
          2. MASADAKİ OYUNCULAR
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleCountChange(num)}
              className={`rounded-sm border py-2 text-xs font-bold font-typewriter transition-colors cursor-pointer ${
                playerCount === num
                  ? 'bg-[#1f1c18] text-[#faf6ed] border-[#1f1c18]'
                  : 'bg-[#faf6ed] text-[#1f1c18] border-[#d6cdbc] hover:border-[#1f1c18]'
              }`}
            >
              {num} KİŞİ
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {Array.from({ length: playerCount }).map((_, idx) => {
            const isSolo = playerCount === 1;
            const isTwoPlayer = playerCount === 2;
            const roleKey = isSolo
              ? 'forensics'
              : isTwoPlayer
              ? (idx === 0 ? 'forensics' : 'profiler')
              : roleAssignmentKeys[idx % roleAssignmentKeys.length];
            const role = ROLES[roleKey];
            const roleTitle = isSolo
              ? 'Tüm Departmanlar'
              : isTwoPlayer
              ? (idx === 0 ? 'Adli Tıp & Kripto' : 'Profilleme & Sorgu')
              : role.title;

            return (
              <div
                key={idx}
                className="bg-[#fffdf8] border border-[#c8bfae] rounded-sm p-3"
              >
                <div className="text-[11px] text-[#575046] uppercase font-typewriter">
                  {isSolo ? 'Dedektif' : `Oyuncu ${idx + 1}`} · {roleTitle}
                </div>
                <input
                  type="text"
                  value={playerNames[idx] || `Dedektif ${idx + 1}`}
                  onChange={(e) => onChangePlayerName(idx, e.target.value)}
                  className="w-full bg-transparent border-b border-[#8c8273] rounded-sm p-3 text-sm text-[#1f1c18] focus:outline-none focus:border-[#1f1c18] font-typewriter"
                  placeholder={`Oyuncu ${idx + 1} İsmi`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="text-center">
        <button
          type="button"
          onClick={handleStart}
          className={`bg-[#1f1c18] hover:bg-[#36312b] text-[#faf6ed] font-bold rounded-sm py-3.5 px-8 uppercase tracking-wider text-sm inline-flex items-center justify-center gap-2 w-full sm:w-auto transition-colors cursor-pointer ${
            !canStart.allowed ? 'cursor-not-allowed opacity-60' : ''
          }`}
          disabled={!canStart.allowed}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>DOSYAYI AÇ VE BAŞLA</span>
        </button>
        {!canStart.allowed && (
          <p className="text-xs text-[#8b1e1e] mt-2 font-typewriter">
            {canStart.reason}
          </p>
        )}
      </div>
    </div>
  );
};
