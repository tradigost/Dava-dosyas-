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
  isPaidScenario,
  hasCaseAccess,
  loadLocalPurchasedCases,
  triggerCasePurchase,
} from '../services/monetization';
import {
  downloadCasePack,
  getDownloadedCaseIds,
} from '../services/caseDownloader';
import {
  Play,
  LogIn,
  ShieldCheck,
  Smartphone,
  Trophy,
  Download,
  Check,
  Lock,
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
  onOpenLeaderboard?: () => void;
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
  onOpenLeaderboard,
  currentUser,
  onlineRoomCode,
}) => {
  const [lockedAlertReason, setLockedAlertReason] = useState<string | null>(null);
  const [ratingsMap, setRatingsMap] = useState<Record<string, { average: number; count: number }>>({});
  const [purchasedIds, setPurchasedIds] = useState<string[]>(() => loadLocalPurchasedCases());
  const [downloadedIds, setDownloadedIds] = useState<string[]>(() => getDownloadedCaseIds());
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});

  useEffect(() => {
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

  const handlePurchaseCase = async (e: React.MouseEvent, scenario: CaseScenario) => {
    e.stopPropagation();
    soundManager.playKeyClick();
    const res = await triggerCasePurchase(scenario);
    if (res.success) {
      setPurchasedIds(loadLocalPurchasedCases());
      setLockedAlertReason(null);
    } else {
      setLockedAlertReason(res.message);
    }
  };

  const handleDownloadCase = async (e: React.MouseEvent, scenario: CaseScenario) => {
    e.stopPropagation();
    soundManager.playKeyClick();
    setDownloadProgress((prev) => ({ ...prev, [scenario.id]: 10 }));
    await downloadCasePack(scenario, (pct) => {
      setDownloadProgress((prev) => ({ ...prev, [scenario.id]: pct }));
    });
    setDownloadedIds(getDownloadedCaseIds());
    setDownloadProgress((prev) => {
      const next = { ...prev };
      delete next[scenario.id];
      return next;
    });
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
    if (selectedScenario && !hasCaseAccess(selectedScenario, purchasedIds)) {
      soundManager.playErrorSound();
      setLockedAlertReason(
        `"${selectedScenario.title}" ücretli bir vakadır. Başlatmak için vaka paketini açmanız (veya satın almış bir arkadaşınızın odasına katılmanız) gerekir.`
      );
      return;
    }
    if (!canStart.allowed) {
      soundManager.playErrorSound();
      setLockedAlertReason(canStart.reason || 'Oyuncu sayısı yetersiz.');
      return;
    }
    soundManager.playSuccessSound();
    onStartGame();
  };

  return (
    <div className="bg-paper-desk min-h-screen text-[#1f1c18] py-8 sm:py-12 px-4 sm:px-6">
      <div className="w-full max-w-2xl mx-auto">
        {/* Top Utility Bar */}
        <header className="flex items-center justify-between gap-2 pb-4 mb-10 border-b border-[#d6cdbc]">
          <div>
            {currentUser && !currentUser.isGuest ? (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="px-2.5 py-1.5 rounded-sm bg-[#faf6ed] border border-[#c8bfae] hover:border-[#1f1c18] text-xs font-typewriter text-[#1f1c18] inline-flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#276749] shrink-0" />
                <span className="truncate max-w-[160px]">{currentUser.displayName}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="px-2.5 py-1.5 rounded-sm bg-[#faf6ed] border border-[#c8bfae] hover:border-[#1f1c18] text-xs font-typewriter text-[#1f1c18] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Giriş</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onOpenLeaderboard && (
              <button
                type="button"
                onClick={() => {
                  soundManager.playKeyClick();
                  onOpenLeaderboard();
                }}
                className="px-2.5 py-1.5 rounded-sm bg-[#faf6ed] border border-[#c8bfae] hover:border-[#1f1c18] text-xs font-typewriter text-[#1f1c18] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Trophy className="w-3.5 h-3.5 text-[#8b1e1e]" />
                <span>Sıralama</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenOnlineModal}
              className="px-2.5 py-1.5 rounded-sm bg-[#faf6ed] border border-[#c8bfae] hover:border-[#1f1c18] text-xs font-typewriter text-[#1f1c18] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{onlineRoomCode ? `Oda: ${onlineRoomCode}` : 'Online Masa'}</span>
            </button>

            {isVerifiedAdminUser(auth.currentUser, ADMIN_EMAIL) && (
              <button
                type="button"
                onClick={onOpenAdminModal}
                className="px-2.5 py-1.5 rounded-sm bg-[#faf6ed] border border-[#8b1e1e] text-[#8b1e1e] hover:bg-[#8b1e1e] hover:text-[#faf6ed] text-xs font-typewriter font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Yönetim</span>
              </button>
            )}
          </div>
        </header>

        {/* Editorial Masthead */}
        <div className="mb-10">
          <p className="text-[10px] font-typewriter uppercase tracking-[0.25em] text-[#7c7265]">
            ARŞİV DOSYA MASASI
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold font-typewriter tracking-[0.18em] text-[#1f1c18] mt-1">
            SUÇ DOSYASI
          </h1>
          <p className="text-xs sm:text-sm text-[#575046] mt-2 leading-relaxed">
            Belgeleri sırayla inceleyin, bulgularınızı birleştirin ve katili bulun.
          </p>
        </div>

        {/* 01 · Dava Dosyası */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between border-b border-[#d6cdbc] pb-2 mb-3">
            <h2 className="text-[11px] font-typewriter uppercase tracking-[0.18em] text-[#1f1c18] font-bold">
              01 · DAVA DOSYASI
            </h2>
            <span className="text-[11px] font-typewriter text-[#7c7265]">
              {scenarios.length} dosya
            </span>
          </div>

          {lockedAlertReason && (
            <div className="mb-3 px-3 py-2 border border-[#8b1e1e] bg-[#fffdf8] text-[#8b1e1e] text-xs font-typewriter rounded-sm">
              {lockedAlertReason}
            </div>
          )}

          <div className="space-y-2.5">
            {scenarios.map((scenario) => {
              const isSelected = selectedScenarioId === scenario.id;
              const scenarioCheck = canStartScenario(playerCount, scenario);
              const isLocked = !scenarioCheck.allowed;
              const stats = ratingsMap[scenario.id] || { average: 4.9, count: 12 };

              return (
                <div
                  key={scenario.id}
                  onClick={() => handleSelectScenarioItem(scenario)}
                  className={`rounded-sm border p-4 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#fffdf8] border-[#1f1c18] shadow-[0_2px_10px_rgba(31,28,24,0.06)]'
                      : 'bg-[#faf6ed] border-[#d6cdbc] hover:border-[#8c8273]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-typewriter font-bold text-sm sm:text-base uppercase tracking-wide text-[#1f1c18]">
                        {scenario.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isPaidScenario(scenario) ? (
                        hasCaseAccess(scenario, purchasedIds) ? (
                          <span className="border border-[#276749] text-[#276749] px-1.5 py-0.5 text-[10px] font-typewriter uppercase tracking-wider rounded-sm">
                            AÇIK · PREMİUM
                          </span>
                        ) : (
                          <span className="border border-[#8b1e1e] bg-[#8b1e1e] text-[#faf6ed] px-1.5 py-0.5 text-[10px] font-typewriter uppercase tracking-wider rounded-sm">
                            {scenario.priceLabel || 'ÜCRETLİ'}
                          </span>
                        )
                      ) : (
                        <span className="border border-[#c8bfae] text-[#575046] px-1.5 py-0.5 text-[10px] font-typewriter uppercase tracking-wider rounded-sm">
                          ÜCRETSİZ
                        </span>
                      )}

                      {isLocked ? (
                        <span className="border border-[#8b1e1e] text-[#8b1e1e] px-1.5 py-0.5 text-[10px] font-typewriter uppercase tracking-wider rounded-sm">
                          EN AZ {scenario.minPlayers} KİŞİ
                        </span>
                      ) : isSelected ? (
                        <span className="border border-[#8b1e1e] text-[#8b1e1e] px-1.5 py-0.5 text-[10px] font-typewriter uppercase tracking-wider rounded-sm">
                          SEÇİLDİ
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <p className="text-xs text-[#575046] line-clamp-2 mt-1.5 leading-relaxed">
                    {scenario.synopsis}
                  </p>

                  <div className="text-[11px] font-typewriter text-[#7c7265] mt-3 pt-2 border-t border-dashed border-[#d6cdbc] flex flex-wrap items-center justify-between gap-2">
                    <span>
                      ~{scenario.estimatedMinutes} dk · {scenario.suspects?.length || 0} şüpheli · {getScenarioTotalEnvelopes(scenario)} zarf · ★ {stats.average}
                    </span>
                    <div className="flex items-center gap-2">
                      {isPaidScenario(scenario) && !hasCaseAccess(scenario, purchasedIds) && (
                        <button
                          type="button"
                          onClick={(e) => handlePurchaseCase(e, scenario)}
                          className="px-2 py-0.5 rounded-sm bg-[#8b1e1e] text-[#faf6ed] text-[10px] font-typewriter font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Lock className="w-3 h-3" />
                          <span>Kilidi Aç</span>
                        </button>
                      )}
                      {scenario.downloadable && (
                        <button
                          type="button"
                          onClick={(e) => handleDownloadCase(e, scenario)}
                          disabled={downloadProgress[scenario.id] !== undefined}
                          className={`px-2 py-0.5 rounded-sm border text-[10px] font-typewriter inline-flex items-center gap-1 cursor-pointer ${
                            downloadedIds.includes(scenario.id)
                              ? 'border-[#276749] text-[#276749] bg-[#fffdf8]'
                              : 'border-[#1f1c18] text-[#1f1c18] hover:bg-[#ebe5d8]'
                          }`}
                        >
                          {downloadedIds.includes(scenario.id) ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>İndirildi</span>
                            </>
                          ) : downloadProgress[scenario.id] !== undefined ? (
                            <span>İndiriliyor %{downloadProgress[scenario.id]}</span>
                          ) : (
                            <>
                              <Download className="w-3 h-3" />
                              <span>Paket İndir</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 02 · Masadaki Oyuncular */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between border-b border-[#d6cdbc] pb-2 mb-4">
            <h2 className="text-[11px] font-typewriter uppercase tracking-[0.18em] text-[#1f1c18] font-bold">
              02 · MASADAKİ OYUNCULAR
            </h2>
            <span className="text-[11px] font-typewriter text-[#7c7265]">
              {playerCount} dedektif
            </span>
          </div>

          <div className="grid grid-cols-6 border border-[#c8bfae] rounded-sm overflow-hidden divide-x divide-[#c8bfae] mb-4">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleCountChange(num)}
                className={`py-2 text-xs font-typewriter font-bold transition-colors cursor-pointer ${
                  playerCount === num
                    ? 'bg-[#1f1c18] text-[#faf6ed]'
                    : 'bg-[#faf6ed] text-[#1f1c18] hover:bg-[#fffdf8]'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <div className="divide-y divide-[#d6cdbc] border-t border-b border-[#d6cdbc] bg-[#faf6ed]">
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
                <div key={idx} className="flex items-center gap-3 px-3 py-2">
                  <span className="text-[11px] font-typewriter text-[#7c7265] w-6 shrink-0">
                    0{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={playerNames[idx] || `Dedektif ${idx + 1}`}
                    onChange={(e) => onChangePlayerName(idx, e.target.value)}
                    className="flex-1 min-w-0 bg-transparent py-1 text-sm font-typewriter text-[#1f1c18] focus:outline-none placeholder-[#9c9284]"
                    placeholder={`Oyuncu ${idx + 1}`}
                  />
                  <span className="text-[11px] font-typewriter text-[#575046] shrink-0 text-right">
                    {roleTitle}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Primary CTA */}
        <div>
          <button
            type="button"
            onClick={handleStart}
            disabled={!canStart.allowed}
            className="w-full py-3.5 px-6 bg-[#1f1c18] hover:bg-[#36312b] text-[#faf6ed] font-typewriter font-bold text-xs sm:text-sm uppercase tracking-[0.18em] rounded-sm inline-flex items-center justify-center gap-2.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>DOSYAYI AÇ VE BAŞLA</span>
          </button>

          {!canStart.allowed && (
            <p className="text-xs text-[#8b1e1e] mt-2 font-typewriter text-center">
              {canStart.reason}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
