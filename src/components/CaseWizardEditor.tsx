/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CaseScenario, Suspect, EvidenceItem, GateQuestion, RoleType } from '../types';
import { ROLES } from '../data/cases';
import { soundManager } from '../utils/audioEffects';
import { 
  FolderPlus, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Users, 
  KeyRound, 
  Lock, 
  FileText, 
  Headphones, 
  Image as ImageIcon, 
  Video, 
  ArrowRight, 
  ArrowLeft,
  Download,
  Sparkles,
  HelpCircle,
  Eye
} from 'lucide-react';

interface CaseWizardEditorProps {
  onSaveCase: (scenario: CaseScenario) => Promise<void>;
  isSaving: boolean;
  onCancel?: () => void;
}

export const CaseWizardEditor: React.FC<CaseWizardEditorProps> = ({
  onSaveCase,
  isSaving,
  onCancel,
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedEnvelopeTab, setSelectedEnvelopeTab] = useState<number>(1);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Wizard state
  const [caseId, setCaseId] = useState(`vaka-${Date.now().toString().slice(-4)}`);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [difficulty, setDifficulty] = useState<'Kolay' | 'Orta' | 'Zor' | 'Uzman'>('Orta');
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  const [minPlayers, setMinPlayers] = useState(1);
  const [maxPlayers, setMaxPlayers] = useState(6);
  const [totalEnvelopes, setTotalEnvelopes] = useState(4);

  // Victim
  const [victimName, setVictimName] = useState('');
  const [victimAge, setVictimAge] = useState(48);
  const [victimTitle, setVictimTitle] = useState('');
  const [victimLocation, setVictimLocation] = useState('');
  const [victimTimeOfDeath, setVictimTimeOfDeath] = useState('23:00 - 00:30 suları');
  const [victimCauseInitial, setVictimCauseInitial] = useState('');

  // Suspects
  const [suspects, setSuspects] = useState<Suspect[]>([
    {
      id: 'supheli-1',
      name: '',
      title: '',
      age: 38,
      relation: '',
      description: '',
      alibi: '',
      suspiciousQuotes: [''],
      initialSuspicion: 50,
      motiveHypothesis: '',
      photoPlaceholder: {
        initials: 'Ş1',
        tint: 'bg-zinc-800',
        silhouetteStyle: 'shadow',
      },
    },
    {
      id: 'supheli-2',
      name: '',
      title: '',
      age: 42,
      relation: '',
      description: '',
      alibi: '',
      suspiciousQuotes: [''],
      initialSuspicion: 50,
      motiveHypothesis: '',
      photoPlaceholder: {
        initials: 'Ş2',
        tint: 'bg-zinc-800',
        silhouetteStyle: 'shadow',
      },
    },
  ]);

  // Evidence list
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([
    {
      id: 'delil-1-1',
      envelope: 1,
      title: 'İlk Olay Yeri & Telsiz / Ses Tutanakları',
      category: 'audio',
      mediaType: 'audio',
      mediaUrl: '',
      mediaCaption: 'Olay gecesi 112 Acil çağrı ve devriye ekibi telsiz kaydı',
      roleAccess: ['forensics', 'profiler'],
      summary: 'Maktulün bulunduğu andaki ilk telsiz anonsu ve şüpheli sesler.',
      fullReport: 'Resmi zabıt no #001: 23:45 sularında gelen ihbar üzerine ekipler adrese intikal etmiştir.',
      keyDeduction: 'Ölüm saati ve ses kayıtları arasındaki zaman tutarsızlığı.',
      metadata: {
        date: new Date().toLocaleDateString('tr-TR'),
        caseRef: 'DOSYA-1',
        confidentiality: 'GİZLİ',
      },
    },
  ]);

  // Gates
  const [gates, setGates] = useState<Record<number, GateQuestion>>({
    1: {
      envelope: 1,
      title: 'Zarf 1 İlerleme Kilidi',
      instructions: 'Bir sonraki aşamaya geçmek için aşağıdaki durum tespitini ekipçe doğrulayın.',
      question: 'Zarf 1 İlerleme Kilidi: Ekibiniz maktulün ölüm zamanı ve ilk ifadelerdeki kritik çelişkiyi tespit etti mi?',
      options: [
        { id: 'opt-1', text: 'Evet, alibi saatleri ile olay yeri bulguları arasındaki çelişki netleşti.', isCorrect: true },
        { id: 'opt-2', text: 'Toksikoloji sonuçları henüz tamamlanmadı.', isCorrect: false },
        { id: 'opt-3', text: 'Olay yeri tamamen kaza gibi görünüyor.', isCorrect: false },
      ],
      explanation: 'İlk zarftaki çelişki tespit edildi. Soruşturma derinleşiyor.',
    },
  });

  // Solution
  const [culpritId, setCulpritId] = useState('');
  const [culpritName, setCulpritName] = useState('');
  const [motiveTitle, setMotiveTitle] = useState('');
  const [keyEvidenceTitle, setKeyEvidenceTitle] = useState('');
  const [verdictSummary, setVerdictSummary] = useState('');

  // Handle adding a suspect
  const handleAddSuspect = () => {
    soundManager.playKeyClick();
    const newIdx = suspects.length + 1;
    const newId = `supheli-${newIdx}`;
    setSuspects([
      ...suspects,
      {
        id: newId,
        name: '',
        title: '',
        age: 35,
        relation: '',
        description: '',
        alibi: '',
        suspiciousQuotes: [''],
        initialSuspicion: 50,
        motiveHypothesis: '',
        photoPlaceholder: {
          initials: `Ş${newIdx}`,
          tint: 'bg-zinc-800',
          silhouetteStyle: 'shadow',
        },
      },
    ]);
  };

  const handleRemoveSuspect = (index: number) => {
    soundManager.playKeyClick();
    if (suspects.length <= 1) return;
    setSuspects(suspects.filter((_, i) => i !== index));
  };

  // Handle adding evidence to selected envelope
  const handleAddEvidenceToCurrentEnvelope = () => {
    soundManager.playKeyClick();
    const newId = `delil-${selectedEnvelopeTab}-${Date.now().toString().slice(-4)}`;
    const newEvidence: EvidenceItem = {
      id: newId,
      envelope: selectedEnvelopeTab,
      title: `Zarf ${selectedEnvelopeTab} Yeni Delil / Rapor`,
      category: 'document',
      mediaType: 'text',
      mediaUrl: '',
      mediaCaption: '',
      roleAccess: ['forensics', 'profiler'],
      summary: 'Bu delilin kısa özeti ve dedektiflerin dikkat etmesi gereken nokta.',
      fullReport: 'Resmi soruşturma raporu ve teknik detaylar...',
      keyDeduction: 'Bu delilden çıkarılacak kilit bilgi.',
      metadata: {
        date: new Date().toLocaleDateString('tr-TR'),
        caseRef: `ZARF-${selectedEnvelopeTab}`,
        confidentiality: 'GİZLİ',
      },
    };
    setEvidenceList([...evidenceList, newEvidence]);
  };

  const handleRemoveEvidence = (id: string) => {
    soundManager.playKeyClick();
    setEvidenceList(evidenceList.filter((ev) => ev.id !== id));
  };

  // Update specific evidence
  const updateEvidenceField = (id: string, field: keyof EvidenceItem, value: any) => {
    setEvidenceList(
      evidenceList.map((ev) => {
        if (ev.id === id) {
          return { ...ev, [field]: value };
        }
        return ev;
      })
    );
  };

  // Toggle role in roleAccess
  const toggleRoleAccess = (evidenceId: string, role: RoleType) => {
    soundManager.playKeyClick();
    setEvidenceList(
      evidenceList.map((ev) => {
        if (ev.id === evidenceId) {
          const exists = ev.roleAccess.includes(role);
          const nextRoles = exists
            ? ev.roleAccess.filter((r) => r !== role)
            : [...ev.roleAccess, role];
          return { ...ev, roleAccess: nextRoles.length > 0 ? nextRoles : [role] };
        }
        return ev;
      })
    );
  };

  // Update Gate for current envelope
  const currentGate: GateQuestion = gates[selectedEnvelopeTab] || {
    envelope: selectedEnvelopeTab,
    title: `Zarf ${selectedEnvelopeTab} Doğrulama Kilidi`,
    instructions: 'Bir sonraki aşamaya geçmek için aşağıdaki durum tespitini ekipçe doğrulayın.',
    question: `Zarf ${selectedEnvelopeTab} Doğrulama Kilidi: Bu aşamadaki kanıtları masaya yatırdınız mı?`,
    options: [
      { id: 'opt-1', text: 'Evet, tüm bulguları ve ifadeleri değerlendirdik, ilerlemeye hazırız.', isCorrect: true },
      { id: 'opt-2', text: 'Şüpheliler ve deliller arasında kritik çelişkileri netleştirdik.', isCorrect: false },
      { id: 'opt-3', text: 'Zarfın kilit detaylarını paylaştık ve sonraki aşamaya geçiyoruz.', isCorrect: false },
    ],
    explanation: `Zarf ${selectedEnvelopeTab} incelemesi başarıyla tamamlandı.`,
  };

  const updateCurrentGate = (field: keyof GateQuestion, value: any) => {
    setGates((prev) => ({
      ...prev,
      [selectedEnvelopeTab]: {
        ...currentGate,
        [field]: value,
      },
    }));
  };

  const updateGateOptionText = (optIndex: number, text: string) => {
    const existing = currentGate.options || [];
    const nextOptions = [0, 1, 2].map((idx) => {
      const prev = existing[idx] || { id: `opt-${idx + 1}`, text: '', isCorrect: idx === 0 };
      if (idx === optIndex) {
        return { ...prev, text };
      }
      return prev;
    });
    updateCurrentGate('options', nextOptions);
  };

  const setGateCorrectOption = (optIndex: number) => {
    const existing = currentGate.options || [];
    const nextOptions = [0, 1, 2].map((idx) => {
      const prev = existing[idx] || { id: `opt-${idx + 1}`, text: '', isCorrect: false };
      return { ...prev, isCorrect: idx === optIndex };
    });
    updateCurrentGate('options', nextOptions);
  };

  // Build the complete CaseScenario
  const assembleScenario = (): CaseScenario => {
    const finalCulprit = suspects.find((s) => s.id === culpritId || s.name === culpritName) || suspects[0];

    return {
      id: caseId.trim().toLowerCase().replace(/\s+/g, '-'),
      title: title.trim() || 'Yeni Gizemli Dosya',
      subtitle: subtitle.trim() || 'Çözülmeyi bekleyen esrarengiz bir vaka',
      synopsis: synopsis.trim() || 'Dedektif ekibi olay yerine intikal eder...',
      estimatedMinutes: Number(estimatedMinutes) || 45,
      difficulty: difficulty || 'Orta',
      minPlayers: Number(minPlayers) || 1,
      maxPlayers: Number(maxPlayers) || 6,
      totalEnvelopes: Math.max(1, Number(totalEnvelopes) || 1),
      victim: {
        name: victimName.trim() || 'Maktul',
        age: Number(victimAge) || 40,
        title: victimTitle.trim() || 'İş İnsanı',
        causeInitial: victimCauseInitial.trim() || 'Şüpheli ölüm bulguları',
        timeOfDeath: victimTimeOfDeath.trim() || 'Gece yarısı',
        locationOfBody: victimLocation.trim() || 'Olay Yeri',
      },
      suspects: suspects.map((s, idx) => ({
        ...s,
        id: s.id || `supheli-${idx + 1}`,
        name: s.name.trim() || `Şüpheli ${idx + 1}`,
        title: s.title.trim() || 'Görgü Tanığı',
        relation: s.relation.trim() || 'Maktulün Tanıdığı',
        alibi: s.alibi.trim() || 'Olay saatinde evde olduğunu iddia ediyor.',
        suspiciousQuotes: s.suspiciousQuotes.filter(Boolean).length > 0 ? s.suspiciousQuotes : ['Ben masumum.'],
      })),
      evidence: evidenceList.map((ev) => ({
        ...ev,
        title: ev.title.trim() || 'Delil Dosyası',
        summary: ev.summary.trim() || 'İncelenmesi gereken kritik bulgu.',
        fullReport: ev.fullReport.trim() || 'Resmi tutanak metni.',
      })),
      gates,
      solution: {
        culpritId: finalCulprit?.id || 'supheli-1',
        culpritName: finalCulprit?.name || 'Fail',
        motiveTitle: motiveTitle.trim() || 'Maddi Çıkar ve İntikam',
        keyEvidenceTitle: keyEvidenceTitle.trim() || 'Olay Yeri Ses ve Kamera Kayıtları',
        verdictSummary: verdictSummary.trim() || 'Dedektif ekibinin titiz çalışması sonucu katil suçunu itiraf etmiştir.',
      },
    };
  };

  // Validate before publishing
  const validateScenario = (): boolean => {
    const errs: string[] = [];
    if (!title.trim()) errs.push('Vaka Başlığı boş bırakılamaz.');
    if (!victimName.trim()) errs.push('Maktul İsmi boş bırakılamaz.');
    if (suspects.some((s) => !s.name.trim())) errs.push('Tüm şüphelilerin isimleri girilmelidir.');
    if (evidenceList.length === 0) errs.push('Vakada en az 1 delil bulunmalıdır.');

    setValidationErrors(errs);
    return errs.length === 0;
  };

  // Download compiled JSON
  const handleDownloadJSON = () => {
    soundManager.playKeyClick();
    const scenario = assembleScenario();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(scenario, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${scenario.id}-vaka-dosyasi.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Publish to Firestore
  const handlePublish = async () => {
    if (!validateScenario()) {
      soundManager.playErrorSound();
      return;
    }
    soundManager.playKeyClick();
    const scenario = assembleScenario();
    await onSaveCase(scenario);
  };

  // Current envelope's evidence list
  const currentEnvelopeEvidence = evidenceList.filter((ev) => ev.envelope === selectedEnvelopeTab);

  return (
    <div className="space-y-6">
      
      {/* Wizard Step Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pb-2">
        {[
          { step: 1, label: '1. Vaka & Maktul', icon: FileText },
          { step: 2, label: '2. Şüpheliler', icon: Users },
          { step: 3, label: '3. Zarflar & Medya', icon: Layers },
          { step: 4, label: '4. Fail & Çözüm', icon: Lock },
          { step: 5, label: '5. Önizle & Yayınla', icon: Sparkles },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeStep === item.step;
          const isDone = activeStep > item.step;
          return (
            <button
              key={item.step}
              type="button"
              onClick={() => {
                soundManager.playKeyClick();
                setActiveStep(item.step as any);
              }}
              className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                isActive
                  ? 'bg-amber-600 text-zinc-950 border-amber-400 shadow-md font-bold'
                  : isDone
                  ? 'bg-zinc-900 border-emerald-700/60 text-emerald-300'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Validation alert if any */}
      {validationErrors.length > 0 && (
        <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-xl text-xs text-rose-200 space-y-1">
          <div className="flex items-center gap-2 font-bold text-rose-300">
            <AlertTriangle className="w-4 h-4" />
            <span>Lütfen aşağıdaki eksik alanları tamamlayın:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] pl-1">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* STEP 1: CASE & VICTIM INFO */}
      {activeStep === 1 && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <h4 className="font-bold text-sm text-zinc-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Temel Vaka Bilgileri</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Vaka Başlığı *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="örn: Boğaz Yalısında Sır Cinayet"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Benzersiz Vaka ID (Küçük harf, tireli)</label>
                <input
                  type="text"
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  placeholder="bogaz-yalisi-cinayeti"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-400 mb-1">Alt Başlık</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="örn: Kandilli Yalı Partisinde Şüpheli Zehirlenme"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-400 mb-1">Sinopsis (Lobide Görünecek Vaka Özeti)</label>
                <textarea
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  rows={3}
                  placeholder="Vakanın başlangıç hikayesi, olay anı ve dedektifleri bekleyen gizem..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-bold text-amber-300">
                  Toplam Zarf Sayısı (Phase Sayısı: 1 - 10) *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={totalEnvelopes}
                    onChange={(e) => setTotalEnvelopes(Number(e.target.value))}
                    className="flex-1 accent-amber-500 cursor-pointer"
                  />
                  <span className="font-mono text-base font-bold text-amber-400 px-3 py-1 bg-zinc-950 rounded-xl border border-zinc-800">
                    {totalEnvelopes} Zarf
                  </span>
                </div>
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  İstediğiniz sayıda zarf (örneğin 10 zarf) tanımlayabilirsiniz; oyun sistemi zarf kısıtlaması olmaksızın tüm aşamaları oynatır.
                </span>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Zorluk Seviyesi</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="Kolay">Kolay</option>
                  <option value="Orta">Orta</option>
                  <option value="Zor">Zor</option>
                  <option value="Uzman">Uzman</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Tahmini Çözüm Süresi (Dakika)</label>
                <input
                  type="number"
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Oyuncu Sayısı Aralığı (Min - Max)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={minPlayers}
                    onChange={(e) => setMinPlayers(Number(e.target.value))}
                    className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 font-mono text-center"
                  />
                  <span className="text-zinc-500">-</span>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(Number(e.target.value))}
                    className="w-1/2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 font-mono text-center"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Victim Details */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <h4 className="font-bold text-sm text-zinc-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-rose-400" />
              <span>Maktul Künyesi</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Maktul Adı Soyadı *</label>
                <input
                  type="text"
                  value={victimName}
                  onChange={(e) => setVictimName(e.target.value)}
                  placeholder="örn: Selim Karadağ"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Yaşı</label>
                <input
                  type="number"
                  value={victimAge}
                  onChange={(e) => setVictimAge(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Unvanı / Mesleği</label>
                <input
                  type="text"
                  value={victimTitle}
                  onChange={(e) => setVictimTitle(e.target.value)}
                  placeholder="Holding Yönetim Kurulu Başkanı"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Bulunduğu Yer (Olay Yeri)</label>
                <input
                  type="text"
                  value={victimLocation}
                  onChange={(e) => setVictimLocation(e.target.value)}
                  placeholder="Yalı Çalışma Odası, Masanın Yanı"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Ölüm Zamanı</label>
                <input
                  type="text"
                  value={victimTimeOfDeath}
                  onChange={(e) => setVictimTimeOfDeath(e.target.value)}
                  placeholder="23:15 - 23:45 suları"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">İlk Ölüm Sebebi İpucu</label>
                <input
                  type="text"
                  value={victimCauseInitial}
                  onChange={(e) => setVictimCauseInitial(e.target.value)}
                  placeholder="Akut zehirlenme ve solunum felci"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playKeyClick();
                setActiveStep(2);
              }}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>2. Adım: Şüphelileri Belirle</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SUSPECTS */}
      {activeStep === 2 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-zinc-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Şüpheli Listesi ({suspects.length} Kişi)</span>
            </h4>

            <button
              type="button"
              onClick={handleAddSuspect}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-zinc-700"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Yeni Şüpheli Ekle</span>
            </button>
          </div>

          <div className="space-y-3">
            {suspects.map((s, idx) => (
              <div key={s.id || idx} className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="font-mono text-xs text-amber-400 font-bold">
                    Şüpheli #{idx + 1}
                  </span>
                  {suspects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSuspect(idx)}
                      className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-zinc-400 mb-1">Adı Soyadı *</label>
                    <input
                      type="text"
                      value={s.name}
                      onChange={(e) => {
                        const copy = [...suspects];
                        copy[idx].name = e.target.value;
                        setSuspects(copy);
                      }}
                      placeholder="örn: Dr. Hakan Vural"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Unvanı / Mesleği</label>
                    <input
                      type="text"
                      value={s.title}
                      onChange={(e) => {
                        const copy = [...suspects];
                        copy[idx].title = e.target.value;
                        setSuspects(copy);
                      }}
                      placeholder="Aile Doktoru"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Maktul ile İlişkisi</label>
                    <input
                      type="text"
                      value={s.relation}
                      onChange={(e) => {
                        const copy = [...suspects];
                        copy[idx].relation = e.target.value;
                        setSuspects(copy);
                      }}
                      placeholder="20 yıllık kadim dostu ve özel doktoru"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-zinc-400 mb-1">Alibisi (Olay Anında Neredeydi?)</label>
                    <input
                      type="text"
                      value={s.alibi}
                      onChange={(e) => {
                        const copy = [...suspects];
                        copy[idx].alibi = e.target.value;
                        setSuspects(copy);
                      }}
                      placeholder="Yalı bahçesinde telefonla konuştuğunu söylüyor..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Başlangıç Şüphe Oranı (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={s.initialSuspicion || 50}
                      onChange={(e) => {
                        const copy = [...suspects];
                        copy[idx].initialSuspicion = Number(e.target.value);
                        setSuspects(copy);
                      }}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 font-mono text-center"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playKeyClick();
                setActiveStep(1);
              }}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Geri: Vaka Bilgileri</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playKeyClick();
                setActiveStep(3);
              }}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>3. Adım: Zarf Zarf Kanıt ve Medyalar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PHASE-BY-PHASE ENVELOPES & MEDIA */}
      {activeStep === 3 && (
        <div className="space-y-5 animate-fade-in">
          
          {/* Envelope Selector Tabs */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-xs">
              <span className="font-bold text-zinc-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Düzenlenen Aşama / Zarf Seçimi:</span>
              </span>
              <span className="text-zinc-500 font-mono text-[11px]">
                Toplam {totalEnvelopes} Zarf Planlandı
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {Array.from({ length: totalEnvelopes }).map((_, idx) => {
                const envNum = idx + 1;
                const isSelected = selectedEnvelopeTab === envNum;
                const count = evidenceList.filter((e) => e.envelope === envNum).length;
                return (
                  <button
                    key={envNum}
                    type="button"
                    onClick={() => {
                      soundManager.playKeyClick();
                      setSelectedEnvelopeTab(envNum);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-600 text-zinc-950 border-amber-400 shadow-md'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <span>Zarf {envNum}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      isSelected ? 'bg-zinc-950/20 text-zinc-950' : 'bg-zinc-900 text-zinc-400'
                    }`}>
                      {count} Kanıt
                    </span>
                  </button>
                );
              })}

              {totalEnvelopes < 10 && (
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playKeyClick();
                    setTotalEnvelopes((prev) => prev + 1);
                    setSelectedEnvelopeTab(totalEnvelopes + 1);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-mono border border-dashed border-zinc-700 hover:border-amber-400 text-zinc-400 hover:text-amber-300 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Zarf Ekle</span>
                </button>
              )}
            </div>
          </div>

          {/* Current Envelope Evidence Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                  <span>Zarf {selectedEnvelopeTab} Kanıt & Medya Dosyaları</span>
                  <span className="text-xs text-amber-400 font-mono">
                    ({currentEnvelopeEvidence.length} Dosya)
                  </span>
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Bu zarf açıldığında dedektiflerin uzmanlık telefonlarına hangi ses kayıtları, görüntüler veya raporlar düşecek?
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddEvidenceToCurrentEnvelope}
                className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-zinc-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Bu Zarfa Delil / Medya Ekle</span>
              </button>
            </div>

            {currentEnvelopeEvidence.length === 0 ? (
              <div className="p-8 text-center bg-zinc-900/40 border border-dashed border-zinc-800 rounded-2xl text-xs text-zinc-500">
                Bu zarf için henüz kanıt eklenmedi. Yukarıdaki butona basarak ses kaydı, olay yeri fotoğrafı veya rapor ekleyin.
              </div>
            ) : (
              <div className="space-y-4">
                {currentEnvelopeEvidence.map((ev, i) => (
                  <div key={ev.id} className="p-4 sm:p-5 bg-zinc-900/70 border border-zinc-800 rounded-2xl space-y-4 shadow-md">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                          ZARF {ev.envelope} · DOSYA #{i + 1}
                        </span>
                        <span className="text-xs font-mono text-zinc-500">id: {ev.id}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveEvidence(ev.id)}
                        className="text-rose-400 hover:text-rose-300 p-1 text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Kaldır</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-zinc-400 mb-1">Delil Başlığı *</label>
                        <input
                          type="text"
                          value={ev.title}
                          onChange={(e) => updateEvidenceField(ev.id, 'title', e.target.value)}
                          placeholder="örn: 112 Acil İhbar Ses Kaydı"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-400 mb-1 font-bold text-amber-300 flex items-center gap-1">
                          <span>Medya Türü *</span>
                        </label>
                        <select
                          value={ev.mediaType || 'text'}
                          onChange={(e) => updateEvidenceField(ev.id, 'mediaType', e.target.value)}
                          className="w-full bg-zinc-950 border border-amber-600/50 rounded-xl px-3 py-2 text-zinc-100 font-semibold focus:outline-none focus:border-amber-400"
                        >
                          <option value="text">📄 Metin / Adli Rapor</option>
                          <option value="audio">🎧 Ses Kaydı / Telefon Dinleme (Audio)</option>
                          <option value="image">📸 Olay Yeri Fotoğrafı / Belge (Image)</option>
                          <option value="video">🎥 Güvenlik Kamerası / Video (CCTV)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-zinc-400 mb-1">Kategori</label>
                        <select
                          value={ev.category}
                          onChange={(e) => updateEvidenceField(ev.id, 'category', e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-400"
                        >
                          <option value="audio">Ses / Telsiz Kaydı</option>
                          <option value="autopsy">Otopsi Raporu</option>
                          <option value="toxicology">Toksikoloji Raporu</option>
                          <option value="interrogation">Sorgu / İfade Tutanağı</option>
                          <option value="document">Yazılı Belge / Fatura / Mektup</option>
                          <option value="cipher">Şifreli Mesaj / Kripto</option>
                          <option value="gps">GPS & Konum Kaydı</option>
                          <option value="banking">Banka & Finansal Hareket</option>
                        </select>
                      </div>

                      {/* Media URL Input if Audio, Image, or Video */}
                      {(ev.mediaType === 'audio' || ev.mediaType === 'image' || ev.mediaType === 'video') && (
                        <div className="sm:col-span-2">
                          <label className="block text-zinc-400 mb-1 flex items-center justify-between">
                            <span className="text-amber-400 font-bold">
                              {ev.mediaType === 'audio' ? '🎧 Ses Dosyası Linki (.mp3, .wav URL veya Boş Bırakın)' : ev.mediaType === 'image' ? '📸 Görsel Linki (Görsel URL veya Boş Bırakın)' : '🎥 Video Linki (YouTube, Vimeo veya .mp4 URL)'}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              (Boş bırakılırsa interaktif retro arayüz çalışır)
                            </span>
                          </label>
                          <input
                            type="text"
                            value={ev.mediaUrl || ''}
                            onChange={(e) => updateEvidenceField(ev.id, 'mediaUrl', e.target.value)}
                            placeholder={ev.mediaType === 'audio' ? 'https://example.com/kayit.mp3' : ev.mediaType === 'image' ? 'https://images.unsplash.com/...' : 'https://youtube.com/watch?v=...'}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 font-mono text-[11px] focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      )}

                      {(ev.mediaType === 'audio' || ev.mediaType === 'image' || ev.mediaType === 'video') && (
                        <div>
                          <label className="block text-zinc-400 mb-1">Medya Alt Açıklaması</label>
                          <input
                            type="text"
                            value={ev.mediaCaption || ''}
                            onChange={(e) => updateEvidenceField(ev.id, 'mediaCaption', e.target.value)}
                            placeholder="örn: Gece 23:45 güvenlik kamerası kaydı"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 text-[11px] focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      )}

                      {/* Role checkboxes */}
                      <div className="sm:col-span-3">
                        <label className="block text-zinc-400 mb-1.5 font-bold">
                          Bu Delili Hangi Uzman(lar) Görsün? (Asimetrik Rol Dağılımı)
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {(['forensics', 'cryptology', 'profiler', 'field', 'ballistics', 'archive'] as RoleType[]).map((r) => {
                            const isSelected = ev.roleAccess.includes(r);
                            const roleTitle = ROLES[r]?.title || r;
                            return (
                              <button
                                key={r}
                                type="button"
                                onClick={() => toggleRoleAccess(ev.id, r)}
                                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                                  isSelected
                                    ? 'bg-amber-600/20 border-amber-500 text-amber-300 font-bold'
                                    : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                                }`}
                              >
                                <span>{isSelected ? '✓' : '+'}</span>
                                <span>{roleTitle}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-zinc-400 mb-1">Özet Bulgu (Dedektifin Ekranında Üstte Vurgulanacak Kısa Cümle)</label>
                        <input
                          type="text"
                          value={ev.summary}
                          onChange={(e) => updateEvidenceField(ev.id, 'summary', e.target.value)}
                          placeholder="Maktulün kadehinde ölümcül dozda potasyum siyanür tespit edildi."
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-zinc-400 mb-1">Resmi Rapor Metni / Tutanak</label>
                        <textarea
                          value={ev.fullReport}
                          onChange={(e) => updateEvidenceField(ev.id, 'fullReport', e.target.value)}
                          rows={4}
                          placeholder="Resmi adli tutanak, laboratuvar raporu veya tanık ifadesinin ayrıntılı metni..."
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 font-mono text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Current Envelope Gate Question */}
          <div className="p-4 sm:p-5 bg-zinc-900/60 border border-amber-600/40 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-400" />
              <h4 className="font-bold text-sm text-zinc-100">
                Zarf {selectedEnvelopeTab} Kapı Sorusu (Geçiş Doğrulama Kilidi)
              </h4>
            </div>
            <p className="text-xs text-zinc-400">
              Dedektifler Zarf {selectedEnvelopeTab}’deki delilleri bitirdiğinde, bir sonraki aşamaya geçmek için bu soruyu ortaklaşa çözmek zorundadır.
            </p>

            <div className="space-y-3 text-xs pt-1">
              <div>
                <label className="block text-zinc-400 mb-1 font-bold">Soru Metni *</label>
                <input
                  type="text"
                  value={currentGate.question}
                  onChange={(e) => updateCurrentGate('question', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-zinc-400 font-bold">Seçenekler ve Doğru Cevap:</label>
                {[0, 1, 2].map((optIdx) => {
                  const opt = currentGate.options?.[optIdx] || { id: `opt-${optIdx + 1}`, text: '', isCorrect: optIdx === 0 };
                  return (
                    <div key={optIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`gate-correct-${selectedEnvelopeTab}`}
                        checked={opt.isCorrect}
                        onChange={() => setGateCorrectOption(optIdx)}
                        className="accent-amber-500 cursor-pointer"
                        title="Doğru cevap olarak işaretle"
                      />
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => updateGateOptionText(optIdx, e.target.value)}
                        placeholder={`Seçenek ${optIdx + 1}`}
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-400"
                      />
                      {opt.isCorrect && (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                          DOĞRU
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Açıklama (Doğru Çözüldüğünde Dedektiflere Gösterilecek Not)</label>
                <input
                  type="text"
                  value={currentGate.explanation || ''}
                  onChange={(e) => updateCurrentGate('explanation', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playKeyClick();
                setActiveStep(2);
              }}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Geri: Şüpheliler</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playKeyClick();
                setActiveStep(4);
              }}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>4. Adım: Katil & Çözüm Bilgileri</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SOLUTION & CULPRIT */}
      {activeStep === 4 && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 sm:p-5 bg-amber-950/20 border border-amber-600/50 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-300">
              <Lock className="w-5 h-5 text-amber-400" />
              <h4 className="font-bold text-sm">Vaka Çözümü & Katil Kimliği (Gizli Bilgi)</h4>
            </div>
            <p className="text-xs text-zinc-400">
              Bu bilgiler oyun sırasında dedektiflerden tamamen gizlenir. Yalnızca son suçlama oylamasından sonra gerçeği açıklamak için kullanılır.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1 font-bold">Gerçek Katil Kim? *</label>
                <select
                  value={culpritName}
                  onChange={(e) => {
                    setCulpritName(e.target.value);
                    const matched = suspects.find((s) => s.name === e.target.value);
                    if (matched) setCulpritId(matched.id);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                >
                  <option value="">-- Katili Seçin --</option>
                  {suspects.map((s, idx) => (
                    <option key={s.id || idx} value={s.name || `Şüpheli ${idx + 1}`}>
                      {s.name || `Şüpheli ${idx + 1}`} ({s.title || 'Unvan Yok'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-bold">Cinayet Motifi *</label>
                <input
                  type="text"
                  value={motiveTitle}
                  onChange={(e) => setMotiveTitle(e.target.value)}
                  placeholder="örn: Miras Hırsı ve Sahte Vasiyetname"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-300 mb-1 font-bold">Katili Ele Veren Kilit Kanıt *</label>
                <input
                  type="text"
                  value={keyEvidenceTitle}
                  onChange={(e) => setKeyEvidenceTitle(e.target.value)}
                  placeholder="örn: Maktulün Kadehinde Tespit Edilen Zehir & Gizli Ses Kaydı"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-300 mb-1 font-bold">Final İtiraf & Karar Metni (Olayın Gerçek Perde Arkası)</label>
                <textarea
                  value={verdictSummary}
                  onChange={(e) => setVerdictSummary(e.target.value)}
                  rows={5}
                  placeholder="Cinayetin nasıl işlendiğini, katilin cinayeti nasıl planladığını ve dedektiflerin hangi kritik ipucunu yakalayarak olayı çözdüğünü detaylıca yazın..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 leading-relaxed font-sans focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playKeyClick();
                setActiveStep(3);
              }}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Geri: Zarflar</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playKeyClick();
                setActiveStep(5);
              }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>5. Adım: Önizle ve Yayınla</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW & PUBLISH */}
      {activeStep === 5 && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h4 className="font-bold text-base text-zinc-100">
                  {title || 'Yeni Vaka Dosyası'}
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {subtitle || 'Aşamalı vaka dosyası hazır'}
                </p>
              </div>

              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/40">
                {totalEnvelopes} Zarf / Aşama
              </span>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block">Maktul</span>
                <strong className="text-zinc-200 block truncate mt-0.5">{victimName || 'Belirtilmedi'}</strong>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block">Şüpheli Sayısı</span>
                <strong className="text-zinc-200 block mt-0.5">{suspects.length} Kişi</strong>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block">Toplam Delil / Medya</span>
                <strong className="text-zinc-200 block mt-0.5">{evidenceList.length} Parça</strong>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block">Gerçek Fail</span>
                <strong className="text-amber-300 block truncate mt-0.5">{culpritName || suspects[0]?.name}</strong>
              </div>
            </div>

            {/* Evidence Breakdown by Media Type */}
            <div className="p-3.5 bg-zinc-950/70 border border-zinc-800/80 rounded-xl text-xs space-y-2">
              <span className="font-mono text-zinc-400 uppercase text-[11px] block font-bold">
                Medya Dosyaları Dağılımı:
              </span>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-1">
                  <Headphones className="w-3 h-3 text-amber-400" />
                  {evidenceList.filter((e) => e.mediaType === 'audio').length} Ses Kaydı
                </span>
                <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-cyan-400" />
                  {evidenceList.filter((e) => e.mediaType === 'image').length} Olay Yeri Fotoğrafı
                </span>
                <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-1">
                  <Video className="w-3 h-3 text-rose-400" />
                  {evidenceList.filter((e) => e.mediaType === 'video').length} Video / CCTV Kaydı
                </span>
                <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-zinc-400" />
                  {evidenceList.filter((e) => e.mediaType === 'text' || !e.mediaType).length} Metin Raporu
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playKeyClick();
                  setActiveStep(4);
                }}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Geri: Çözüm Bilgileri</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadJSON}
                className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-zinc-700 transition-colors"
                title="Vakanın JSON kopyasını bilgisayarınıza kaydedin"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>JSON Olarak İndir (.json)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handlePublish}
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaving ? 'Firestore’a Kaydediliyor...' : '🔥 Vakayı Doğrula ve Canlıda Yayınla'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
