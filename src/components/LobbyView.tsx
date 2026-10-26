/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CaseScenario } from '../types';
import { ROLES } from '../data/cases';
import { canStartScenario } from '../utils/gameRules';
import { soundManager } from '../utils/audioEffects';
import { 
  DetectiveProfile, 
  fetchScenarioRatings 
} from '../services/firebase';
import { 
  Users, 
  Lock, 
  Unlock, 
  ShieldAlert, 
  Play, 
  Clock, 
  CheckCircle2, 
  FileSearch,
  Sparkles,
  AlertTriangle,
  MessageCircle,
  Smartphone,
  Star,
  LogIn,
  ShieldCheck,
  BarChart3,
  UserCheck
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
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Header Controls: Dedektif Profil / Giriş & Yönetici Paneli */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          {currentUser && !currentUser.isGuest ? (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 hover:border-amber-400 text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentUser.displayName}</span>
              <span className="text-[10px] text-zinc-500 font-mono">({currentUser.email || 'Google'})</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-amber-300 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Dedektif Girişi / Kayıt Ol</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Admin Dashboard Trigger: ONLY visible to altayyigitozan@gmail.com */}
          {currentUser?.email?.toLowerCase() === 'altayyigitozan@gmail.com' && (
            <button
              type="button"
              onClick={onOpenAdminModal}
              className="px-3 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>🛠️ Yönetici Paneli</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Welcome Card */}
      <div className="bg-zinc-950 border border-amber-600/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-mono tracking-widest uppercase text-amber-400">
                COUCH CO-OP TÜRKÇE ASİMETRİK DEDEKTİFLİK OYUNU
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-zinc-100 tracking-tight">
              Masadaki Dosya
            </h1>
            <p className="text-sm text-zinc-300 mt-2.5 leading-relaxed font-sans">
              Arkadaşlarınızla aynı masada yan yana oturun veya tek ekrandan çözün. Her oyuncunun telefonuna farklı bir adli uzmanlığın (Adli Tıp, Kriptoloji, Profilleme) gizli raporları gelir. Bulgularınızı sesli tartışın, ortak dava panosunda birleştirin ve katili adalete teslim edin!
            </p>
          </div>

          {/* Quick WhatsApp & Multi-device CTA */}
          <div className="bg-zinc-900/90 border border-emerald-500/50 p-4 rounded-2xl flex flex-col items-center text-center gap-2.5 shrink-0 max-w-xs shadow-xl">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono">
              <Smartphone className="w-4 h-4" />
              <span>ÇOKLU TELEFON BAĞLANTISI</span>
            </div>
            <p className="text-xs text-zinc-300">
              Arkadaşlarınızı WhatsApp&apos;tan davet edip kendi telefonlarından oynamalarını sağlayın.
            </p>
            <button
              type="button"
              onClick={onOpenOnlineModal}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>{onlineRoomCode ? `Oda: ${onlineRoomCode}` : 'WhatsApp ile Masa Aç'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step 1: Masadaki Kişi Sayısı (1-6 Kişi) */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-base text-zinc-100">
              1. Masada Kaç Dedektif Oturuyor?
            </h2>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {playerCount === 1 ? '1 OYUNCU (SOLO / TEK EKRAN)' : `${playerCount} OYUNCU AKTİF`}
          </span>
        </div>

        {/* Count Selector Buttons (Includes 1 Kişi / Solo) */}
        <div className="mt-4 flex flex-wrap gap-2.5">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleCountChange(num)}
              className={`flex-1 min-w-[70px] py-3 rounded-xl border text-center transition-all cursor-pointer ${
                playerCount === num
                  ? 'bg-amber-600 text-zinc-950 border-amber-400 font-black shadow-lg ring-1 ring-amber-400'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
              }`}
            >
              <div className="text-lg font-bold">{num} Kişi</div>
              <div className="text-[10px] mt-0.5 opacity-80">
                {num === 1
                  ? 'Solo / Tek Ekran'
                  : num === 2
                  ? 'İkili Ortaklık'
                  : num === 3
                  ? '3 Ana Uzmanlık'
                  : `${num} Departman`}
              </div>
            </button>
          ))}
        </div>

        {/* Player Name and Role Preview */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
              Masa Dağılımı ve Oyuncu İsimleri:
            </span>
            {playerCount === 1 ? (
              <span className="text-[11px] font-mono text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded">
                ⚡ Solo / Tek Ekran Modu: Tüm departman raporları tek ekrandan incelenir
              </span>
            ) : playerCount === 2 ? (
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                ⚡ İkili Ortaklık Modu: 3 ana uzmanlık 2 dedektife paylaştırıldı
              </span>
            ) : null}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
                ? 'Tüm Departmanlar (Tek Ekran)'
                : isTwoPlayer
                ? (idx === 0 ? 'Adli Tıp & Kripto' : 'Profilleme & Sorgu')
                : role.title;
                
              const roleBadge = isSolo
                ? '🔍 OTOPSİ + ŞİFRE + SORGU RAPORLARI'
                : isTwoPlayer
                ? (idx === 0 ? '🔬 OTOPSİ + 💻 ŞİFRE DEŞİFRE' : '🧠 DAVRANIŞ + 🕵️ SORGU')
                : role.badge;

              return (
                <div
                  key={idx}
                  className="p-3 bg-zinc-900/70 border border-zinc-800 rounded-xl flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300">
                      {isSolo ? 'Dedektif (Tek Oyuncu)' : `Oyuncu ${idx + 1}`}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {roleTitle}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={playerNames[idx] || `Dedektif ${idx + 1}`}
                    onChange={(e) => onChangePlayerName(idx, e.target.value)}
                    className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-700 rounded text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                    placeholder={`Oyuncu ${idx + 1} İsmi`}
                  />
                  <span className="text-[10px] text-zinc-400 truncate">
                    {roleBadge}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step 2: Alt Sınır Filtreli Senaryo Seçimi */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-base text-zinc-100">
              2. Soruşturma Dosyası Seçimi
            </h2>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {playerCount === 1 ? 'SOLO OYNAMAYA UYGUN' : 'MİNİMUM OYUNCU SINIRI KONTROLÜ'}
          </span>
        </div>

        {/* Lock Alert Warning Message */}
        {lockedAlertReason && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-950/40 border border-rose-600/60 text-rose-200 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">KİLİT UYARISI: OYUNCU SAYISI YETERSİZ!</p>
              <p className="mt-0.5 leading-relaxed">{lockedAlertReason}</p>
            </div>
          </div>
        )}

        {/* Scenarios Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((scenario) => {
            const isSelected = selectedScenarioId === scenario.id;
            const scenarioCheck = canStartScenario(playerCount, scenario);
            const isLocked = !scenarioCheck.allowed;
            const stats = ratingsMap[scenario.id] || { average: 4.9, count: 12 };

            return (
              <div
                key={scenario.id}
                onClick={() => handleSelectScenarioItem(scenario)}
                className={`p-5 rounded-2xl border text-left cursor-pointer transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-zinc-900 border-amber-500 shadow-xl ring-1 ring-amber-500/40'
                    : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-300 font-bold">
                        {scenario.bannerTag}
                      </span>
                      {stats.average >= 4.8 && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>YÜKSEK PUAN</span>
                        </span>
                      )}
                    </div>

                    {isLocked ? (
                      <span className="text-[11px] font-semibold text-rose-400 flex items-center gap-1 bg-rose-950/60 border border-rose-800/40 px-2 py-0.5 rounded">
                        <Lock className="w-3.5 h-3.5" /> En Az {scenario.minPlayers} Kişi
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                        <Unlock className="w-3.5 h-3.5" /> Oynamaya Uygun
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold font-cinzel text-zinc-100">
                    {scenario.title}
                  </h3>
                  <p className="text-xs text-amber-400/90 font-medium mt-0.5">
                    {scenario.subtitle}
                  </p>

                  {/* Rating Display */}
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-mono mt-1.5">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, sIdx) => (
                        <Star
                          key={sIdx}
                          className={`w-3.5 h-3.5 ${
                            sIdx < Math.round(stats.average) ? 'fill-current text-amber-400' : 'text-zinc-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-zinc-200">⭐ {stats.average} / 5</span>
                    <span className="text-zinc-500 text-[11px]">({stats.count} Dedektif Değerlendirmesi)</span>
                  </div>

                  <p className="text-xs text-zinc-300 mt-2.5 leading-relaxed font-sans line-clamp-3">
                    {scenario.synopsis}
                  </p>

                  <div className="mt-3 flex items-center gap-4 text-[11px] text-zinc-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> ~{scenario.estimatedMinutes} Dakika
                    </span>
                    <span>Zorluk: {scenario.difficulty}</span>
                    <span>3 Şüpheli · 3 Zarf</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-zinc-400">
                    Maktul: <strong className="text-zinc-200">{scenario.victim.name}</strong>
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      isSelected ? 'text-amber-400' : 'text-zinc-500'
                    }`}
                  >
                    {isSelected ? '✓ Seçili Vaka' : 'Seçmek İçin Tıkla'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Start Button Container */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={handleStart}
          className={`px-8 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-xl inline-flex items-center gap-2 ${
            canStart.allowed
              ? 'bg-amber-600 hover:bg-amber-500 text-zinc-950 shadow-amber-600/20 hover:scale-[1.02]'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Vakayı Başlat & Masaya Dosyayı Aç</span>
        </button>

        {!canStart.allowed && (
          <p className="text-xs text-rose-400 mt-2">
            ⚠️ {canStart.reason}
          </p>
        )}
      </div>
    </div>
  );
};
