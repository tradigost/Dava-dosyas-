/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { soundManager } from '../utils/audioEffects';
import { Activity, Beaker, CheckCircle2, Pin, Sparkles, AlertTriangle } from 'lucide-react';

interface ForensicsAnalyzerProps {
  onPinFinding: (title: string, excerpt: string, category: string) => void;
  isAlreadyPinned: boolean;
}

type SampleId = 'glass' | 'stomach' | 'capsule';

export const ForensicsAnalyzer: React.FC<ForensicsAnalyzerProps> = ({
  onPinFinding,
  isAlreadyPinned,
}) => {
  const [selectedSample, setSelectedSample] = useState<SampleId>('capsule');
  const [activeReagent, setActiveReagent] = useState<'reagent1' | 'spectro' | 'ph'>('spectro');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedSamples, setAnalyzedSamples] = useState<Record<SampleId, boolean>>({
    capsule: true,
    glass: false,
    stomach: false,
  });

  const handleRunAnalysis = (sampleId: SampleId, reagent: 'reagent1' | 'spectro' | 'ph') => {
    soundManager.playKeyClick();
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzedSamples((prev) => ({ ...prev, [sampleId]: true }));
      soundManager.playSuccessSound();
    }, 450);
  };

  const sampleData = {
    glass: {
      name: 'Numune A: Viski Kadehi Kalıntısı',
      reactionColor: 'text-amber-300 border-amber-600/40 bg-amber-950/20',
      status: 'NEGATİF (Ölümcül Toksin Yok)',
      details: 'Kırık kristal kadehte saf malt viski ve su mineralleri bulundu. Siyanür konsantrasyonu %0.001’in altında (eser miktar yok denecek kadar az). Zehir viski kadehine dökülmemiş!',
      spectrumPeaks: ['410 nm (Etanol)', '520 nm (Meşe Taneni)'],
    },
    stomach: {
      name: 'Numune B: Mide Sıvısı & Asit Çözeltisi',
      reactionColor: 'text-rose-400 border-rose-600/40 bg-rose-950/20',
      status: 'POZİTİF (Yoğun Siyanür Tespiti)',
      details: 'Mide sıvısında 12 mg/L ölümcül dozda serbest Potasyum Siyanür (KCN) alkaloidi saptandı. Zehir doğrudan mide boşluğuna boşalmış.',
      spectrumPeaks: ['280 nm (Siyanür)', '350 nm (Gastrik Asit)', '620 nm (Hücresel Yıkım)'],
    },
    capsule: {
      name: 'Numune C: Midedeki Polimer Kapsül Zarı',
      reactionColor: 'text-emerald-400 border-emerald-600/40 bg-emerald-950/20',
      status: 'KRİTİK BULGU: 180 DAKİKA GECİKMELİ SALINIM',
      details: 'Kapsül, mide asidine (pH 1.5) dayanıklı, yalnızca bağırsak alkali ortamında (pH 7.2) 180 dakika (3 saat) sonra çözünen özel Metakrilat Kopolimer ile kaplanmıştır. Kurban 23:45’te öldüğüne göre kapsül tam 20:45’te yutulmuştur! Üzerinde mikro "LOT-884-K" kodu bulundu!',
      spectrumPeaks: ['180 dk (Zaman-Salınım Zirvesi)', 'pH 7.2 (Metakrilat Çözünme)', 'LOT-884-K (Özel Klinik Seri No)'],
    },
  };

  const current = sampleData[selectedSample];

  const handlePin = () => {
    soundManager.playPinSound();
    onPinFinding(
      '🔬 Toksikoloji Analizi: 3 Saat Gecikmeli Kapsül (LOT-884-K)',
      'Zehir kadehteki viskide değil, saat 20:45’te yutturulan 180 dakika gecikmeli mide kapsülünde (LOT-884-K) tespit edildi!',
      'toxicology'
    );
  };

  return (
    <div className="bg-zinc-900/90 border border-emerald-900/40 rounded-xl p-4 sm:p-5 text-zinc-200">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <h4 className="font-semibold text-sm sm:text-base text-emerald-300">
            Adli Toksikoloji Reaktif & Spektrometre Analizörü
          </h4>
        </div>
        <span className="text-xs text-zinc-400 font-typewriter">
          ATK-LAB-2026 / ONAYLI
        </span>
      </div>

      {/* Sample Selector Tabs */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
        {(Object.keys(sampleData) as SampleId[]).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setSelectedSample(id);
              handleRunAnalysis(id, activeReagent);
            }}
            className={`p-2.5 text-left rounded-lg text-xs font-medium border transition-colors ${
              selectedSample === id
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200 shadow-sm'
                : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">{id === 'glass' ? '1. Viski Kadehi' : id === 'stomach' ? '2. Mide Sıvısı' : '3. Polimer Kapsül'}</span>
              {analyzedSamples[id] && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1 truncate">
              {id === 'glass' ? 'Kristal bardak sıvısı' : id === 'stomach' ? 'Mide sıvısı konsantrasyonu' : 'Metakrilat kopolimer zarı'}
            </p>
          </button>
        ))}
      </div>

      {/* Test Method Selector */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-zinc-400 font-medium">Reaktif / Yöntem:</span>
        <button
          type="button"
          onClick={() => {
            setActiveReagent('spectro');
            handleRunAnalysis(selectedSample, 'spectro');
          }}
          className={`px-3 py-1 rounded text-xs transition-colors ${
            activeReagent === 'spectro'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Kütle Spektrometresi (GC-MS)
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveReagent('ph');
            handleRunAnalysis(selectedSample, 'ph');
          }}
          className={`px-3 py-1 rounded text-xs transition-colors ${
            activeReagent === 'ph'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          pH & Salınım Simülasyonu
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveReagent('reagent1');
            handleRunAnalysis(selectedSample, 'reagent1');
          }}
          className={`px-3 py-1 rounded text-xs transition-colors ${
            activeReagent === 'reagent1'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Liebermann / Alkaloid Damlası
        </button>
      </div>

      {/* Real-time Result Screen */}
      <div className="mt-4 p-4 rounded-lg bg-zinc-950 border border-zinc-800">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-6 gap-2">
            <Beaker className="w-6 h-6 text-emerald-400 animate-spin" />
            <p className="text-xs text-zinc-400 font-typewriter">Spektrometre optik okuma yapıyor...</p>
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-zinc-300">{current.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded font-typewriter border ${current.reactionColor}`}>
                {current.status}
              </span>
            </div>

            <p className="text-xs text-zinc-300 mt-2.5 leading-relaxed font-sans">
              {current.details}
            </p>

            {/* Spectrum Graph Simulation */}
            <div className="mt-3 pt-3 border-t border-zinc-800/80">
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-typewriter">
                Spektrum Tepeleri & Kimyasal İmzalar:
              </span>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {current.spectrumPeaks.map((peak, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-typewriter bg-zinc-900 border border-zinc-700/60 px-2 py-0.5 rounded text-emerald-300"
                  >
                    {peak}
                  </span>
                ))}
              </div>
            </div>

            {selectedSample === 'capsule' && (
              <div className="mt-3 p-2.5 bg-amber-950/30 border border-amber-800/50 rounded flex items-start gap-2 text-xs text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Kritik Adli Çıkarım:</strong> Kurban viskiden zehirlenmemiştir! Cinayet saat 20:45’te içirilen özel geciktirmeli kapsülle işlenmiştir. Katil, kurbanın yanında bulunmadığı saatte (23:45) ölümün gerçekleşeceğini bilerek alibi üretmiştir!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pin to Common Board Button */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-2">
        <span className="text-xs text-zinc-400">
          Bu uzmanlık bulgusu diğer dedektiflerin ortak panosuna aktarılabilir.
        </span>
        <button
          type="button"
          onClick={handlePin}
          disabled={isAlreadyPinned}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            isAlreadyPinned
              ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
          }`}
        >
          <Pin className="w-3.5 h-3.5" />
          {isAlreadyPinned ? 'Ortak Panoya Yansıtıldı' : '📌 Özeti Ortak Panoya Yansıt'}
        </button>
      </div>
    </div>
  );
};
