/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CaseScenario, Suspect, EvidenceItem, GateQuestion, RoleType, getScenarioTotalEnvelopes } from '../types';
import { ROLES } from '../data/cases';
import { soundManager } from '../utils/audioEffects';
import { downloadJsonFile } from '../utils/scenarioUtils';
import {
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
  Copy,
  Check,
  Edit3,
  X,
  EyeOff,
  Volume2,
} from 'lucide-react';
import { MediaDropzoneUploader } from './MediaDropzoneUploader';

interface CaseWizardEditorProps {
  onSaveCase: (scenario: CaseScenario) => Promise<void>;
  isSaving: boolean;
  initialScenario?: CaseScenario | null;
  isEditing?: boolean;
  onCancel?: () => void;
}

export const CaseWizardEditor: React.FC<CaseWizardEditorProps> = ({
  onSaveCase,
  isSaving,
  initialScenario,
  isEditing = false,
  onCancel,
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedEnvelopeTab, setSelectedEnvelopeTab] = useState<number>(1);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Wizard state
  const [caseId, setCaseId] = useState(initialScenario?.id || `vaka-${Date.now().toString().slice(-4)}`);
  const [title, setTitle] = useState(initialScenario?.title || '');
  const [subtitle, setSubtitle] = useState(initialScenario?.subtitle || '');
  const [synopsis, setSynopsis] = useState(initialScenario?.synopsis || '');
  const [difficulty, setDifficulty] = useState<'Kolay' | 'Orta' | 'Zor' | 'Uzman'>(
    (initialScenario?.difficulty as 'Kolay' | 'Orta' | 'Zor' | 'Uzman') || 'Orta'
  );
  const [estimatedMinutes, setEstimatedMinutes] = useState(initialScenario?.estimatedMinutes || 45);
  const [minPlayers, setMinPlayers] = useState(initialScenario?.minPlayers || 1);
  const [maxPlayers, setMaxPlayers] = useState(initialScenario?.maxPlayers || 6);
  const [totalEnvelopes, setTotalEnvelopes] = useState(
    initialScenario ? getScenarioTotalEnvelopes(initialScenario) : 4
  );
  const [status, setStatus] = useState<'published' | 'draft'>(initialScenario?.status || 'published');
  const [isPaid, setIsPaid] = useState<boolean>(initialScenario?.isPaid === true);
  const [priceLabel, setPriceLabel] = useState<string>(initialScenario?.priceLabel || '49,90 TL');
  const [storeProductId, setStoreProductId] = useState<string>(
    initialScenario?.storeProductId || ''
  );
  const [downloadable, setDownloadable] = useState<boolean>(
    initialScenario?.downloadable ?? true
  );

  // Victim
  const [victimName, setVictimName] = useState(initialScenario?.victim?.name || '');
  const [victimAge, setVictimAge] = useState(initialScenario?.victim?.age || 48);
  const [victimTitle, setVictimTitle] = useState(initialScenario?.victim?.title || '');
  const [victimLocation, setVictimLocation] = useState(initialScenario?.victim?.locationOfBody || '');
  const [victimTimeOfDeath, setVictimTimeOfDeath] = useState(
    initialScenario?.victim?.timeOfDeath || '23:00 - 00:30 suları'
  );
  const [victimCauseInitial, setVictimCauseInitial] = useState(initialScenario?.victim?.causeInitial || '');

  // Suspects
  const [suspects, setSuspects] = useState<Suspect[]>(
    initialScenario?.suspects?.length
      ? initialScenario.suspects.map((s) => ({
          ...s,
          suspiciousQuotes: s.suspiciousQuotes?.length ? s.suspiciousQuotes : [''],
        }))
      : [
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
              tint: 'bg-[#d6cdbc]',
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
              tint: 'bg-[#d6cdbc]',
              silhouetteStyle: 'shadow',
            },
          },
        ]
  );

  // Evidence list
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>(
    initialScenario?.evidence?.length
      ? initialScenario.evidence
      : [
          {
            id: 'delil-1-1',
            envelope: 1,
            title: 'İlk Olay Yeri ve Ses Tutanağı',
            category: 'audio',
            mediaType: 'audio',
            mediaUrl: '',
            mediaCaption: 'Olay gecesi 112 Acil çağrı ve devriye telsiz kaydı',
            narrationUrl: '',
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
        ]
  );

  // Gates
  const [gates, setGates] = useState<Record<number, GateQuestion>>(
    initialScenario?.gates && Object.keys(initialScenario.gates).length > 0
      ? initialScenario.gates
      : {
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
        }
  );

  // Solution
  const [culpritId, setCulpritId] = useState(initialScenario?.solution?.culpritId || '');
  const [culpritName, setCulpritName] = useState(initialScenario?.solution?.culpritName || '');
  const [motiveTitle, setMotiveTitle] = useState(initialScenario?.solution?.motiveTitle || '');
  const [keyEvidenceTitle, setKeyEvidenceTitle] = useState(initialScenario?.solution?.keyEvidenceTitle || '');
  const [verdictSummary, setVerdictSummary] = useState(initialScenario?.solution?.verdictSummary || '');
  const [confessionLetter, setConfessionLetter] = useState(
    initialScenario
      ? initialScenario.solution?.confessionLetter || ''
      : 'Bu mektubu okuyorsanız oyun bitti demektir... O gece salona girdiğimde her şey çoktan açığa çıkmıştı. Bıraktığım sahte izlerin sizi yanıltacağını düşünmüştüm ama adaletten kaçamadım.'
  );
  const [isCopied, setIsCopied] = useState(false);

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
          tint: 'bg-[#d6cdbc]',
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

  const updateEvidenceField = (id: string, field: keyof EvidenceItem, value: any) => {
    setEvidenceList(
      evidenceList.map((ev) => (ev.id === id ? { ...ev, [field]: value } : ev))
    );
  };

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
      return idx === optIndex ? { ...prev, text } : prev;
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

  const assembleScenario = (targetStatus?: 'published' | 'draft'): CaseScenario => {
    const finalCulprit = suspects.find((s) => s.id === culpritId || s.name === culpritName) || suspects[0];
    const effectiveStatus = targetStatus || status;

    return {
      id: caseId.trim().toLowerCase().replace(/\s+/g, '-'),
      title: title.trim() || 'Yeni Gizemli Dosya',
      subtitle: subtitle.trim() || 'Çözülmeyi bekleyen esrarengiz bir vaka',
      bannerTag: initialScenario?.bannerTag,
      synopsis: synopsis.trim() || 'Dedektif ekibi olay yerine intikal eder...',
      estimatedMinutes: Number(estimatedMinutes) || 45,
      difficulty: difficulty || 'Orta',
      minPlayers: Number(minPlayers) || 1,
      maxPlayers: Number(maxPlayers) || 6,
      totalEnvelopes: Math.max(1, Number(totalEnvelopes) || 1),
      status: effectiveStatus,
      isPaid: isPaid || undefined,
      priceLabel: isPaid ? priceLabel.trim() || '49,90 TL' : undefined,
      storeProductId: isPaid && storeProductId.trim() ? storeProductId.trim() : undefined,
      downloadable: downloadable || undefined,
      createdAt: initialScenario?.createdAt,
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
        narrationUrl: ev.narrationUrl?.trim() ? ev.narrationUrl.trim() : undefined,
      })),
      gates,
      solution: {
        culpritId: finalCulprit?.id || 'supheli-1',
        culpritName: finalCulprit?.name || 'Fail',
        motiveTitle: motiveTitle.trim() || 'Maddi Çıkar ve İntikam',
        keyEvidenceTitle: keyEvidenceTitle.trim() || 'Olay Yeri Ses ve Kamera Kayıtları',
        verdictSummary: verdictSummary.trim() || 'Dedektif ekibinin titiz çalışması sonucu katil suçunu itiraf etmiştir.',
        confessionLetter: confessionLetter.trim() || undefined,
        fullChronology: initialScenario?.solution?.fullChronology,
        confessionAudioTranscript: initialScenario?.solution?.confessionAudioTranscript,
      },
    };
  };

  const validateScenario = (): boolean => {
    const errs: string[] = [];
    if (!title.trim()) errs.push('Vaka Başlığı boş bırakılamaz.');
    if (!victimName.trim()) errs.push('Maktul İsmi boş bırakılamaz.');
    if (suspects.some((s) => !s.name.trim())) errs.push('Tüm şüphelilerin isimleri girilmelidir.');
    if (evidenceList.length === 0) errs.push('Vakada en az 1 delil bulunmalıdır.');

    setValidationErrors(errs);
    return errs.length === 0;
  };

  const handleDownloadJSON = () => {
    soundManager.playKeyClick();
    const scenario = assembleScenario();
    downloadJsonFile(`${scenario.id}-vaka-dosyasi.json`, scenario);
  };

  const handleCopyJSON = async () => {
    soundManager.playKeyClick();
    const scenario = assembleScenario();
    const textToCopy = JSON.stringify(scenario, null, 2);
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        throw new Error('Clipboard API unavailable');
      }
      setIsCopied(true);
      soundManager.playSuccessSound();
      setTimeout(() => setIsCopied(false), 3000);
    } catch {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        setIsCopied(true);
        soundManager.playSuccessSound();
        setTimeout(() => setIsCopied(false), 3000);
      } catch (err) {
        console.error('All clipboard copy attempts failed', err);
      }
    }
  };

  const handleSaveWithStatus = async (targetStatus: 'published' | 'draft') => {
    if (!validateScenario()) {
      soundManager.playErrorSound();
      return;
    }
    soundManager.playKeyClick();
    setStatus(targetStatus);
    const scenario = assembleScenario(targetStatus);
    await onSaveCase(scenario);
  };

  const currentEnvelopeEvidence = evidenceList.filter((ev) => ev.envelope === selectedEnvelopeTab);

  const inputClass =
    'w-full bg-[#faf6ed] focus:bg-[#fffdf8] border border-[#c8bfae] focus:border-[#1f1c18] rounded-sm px-3 py-2 text-xs text-[#1f1c18] placeholder-[#9c9284] focus:outline-none transition-colors';
  const labelClass = 'block text-[11px] font-typewriter uppercase tracking-wider text-[#575046] mb-1';

  return (
    <div className="space-y-5">
      {initialScenario && (
        <div className="px-4 py-3 bg-[#f4efe4] border border-[#1f1c18] rounded-sm flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Edit3 className="w-4 h-4 text-[#1f1c18] shrink-0" />
            <div>
              <span className="font-typewriter font-bold text-[#1f1c18] block">
                {isEditing ? `Düzenlenen Vaka: ${initialScenario.title}` : `Klonlanan Şablon: ${initialScenario.title}`}
              </span>
              <span className="text-[11px] text-[#575046]">
                {isEditing
                  ? 'Değişiklikleri taslak olarak saklayabilir veya doğrudan yayınlayabilirsiniz.'
                  : 'Yeni bir ID ile özel kopya oluşturuyorsunuz.'}
              </span>
            </div>
          </div>
          {onCancel && (
            <button
              type="button"
              onClick={() => {
                soundManager.playKeyClick();
                onCancel();
              }}
              className="px-3 py-1.5 bg-[#fffdf8] hover:bg-[#ebe5d8] border border-[#c8bfae] text-[#1f1c18] rounded-sm text-xs font-typewriter inline-flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>İptal Et</span>
            </button>
          )}
        </div>
      )}

      {/* Minimal Step Nav */}
      <div className="grid grid-cols-2 sm:grid-cols-5 border-b border-[#d6cdbc]">
        {[
          { step: 1, label: '1. Vaka & Maktul' },
          { step: 2, label: '2. Şüpheliler' },
          { step: 3, label: '3. Zarflar & Medya' },
          { step: 4, label: '4. Fail & Çözüm' },
          { step: 5, label: '5. Yayınla' },
        ].map((item) => {
          const isActive = activeStep === item.step;
          const isDone = activeStep > item.step;
          return (
            <button
              key={item.step}
              type="button"
              onClick={() => {
                soundManager.playKeyClick();
                setActiveStep(item.step as 1 | 2 | 3 | 4 | 5);
              }}
              className={`py-2.5 px-2 text-xs font-typewriter text-center border-b-2 transition-colors cursor-pointer truncate ${
                isActive
                  ? 'border-[#1f1c18] text-[#1f1c18] font-bold'
                  : isDone
                  ? 'border-transparent text-[#276749]'
                  : 'border-transparent text-[#7c7265] hover:text-[#1f1c18]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Validation Alert */}
      {validationErrors.length > 0 && (
        <div className="p-3.5 bg-[#fffdf8] border border-[#8b1e1e] rounded-sm text-xs text-[#8b1e1e] space-y-1">
          <div className="flex items-center gap-2 font-typewriter font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Eksik alanları tamamlayın:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] pl-1">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* STEP 1: CASE & VICTIM */}
      {activeStep === 1 && (
        <div className="space-y-4">
          <div className="bg-[#fffdf8] border border-[#d6cdbc] rounded-sm p-4 sm:p-5 space-y-3">
            <h4 className="font-typewriter font-bold text-xs uppercase tracking-wider text-[#1f1c18] pb-2 border-b border-[#d6cdbc] flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Temel Vaka Bilgileri</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Vaka Başlığı *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Boğaz Yalısında Sır Cinayet"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Vaka ID (küçük harf, tireli)</label>
                <input
                  type="text"
                  value={caseId}
                  disabled={isEditing}
                  onChange={(e) => setCaseId(e.target.value)}
                  placeholder="bogaz-yalisi-cinayeti"
                  className={`${inputClass} font-typewriter ${
                    isEditing ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                />
                {isEditing && (
                  <p className="text-[10px] text-[#7c7265] mt-1 font-typewriter">
                    Düzenleme modunda ID değiştirilemez
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Alt Başlık</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Kandilli Yalı Partisinde Şüpheli Zehirlenme"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Sinopsis (Lobide Görünecek Özet)</label>
                <textarea
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  rows={3}
                  placeholder="Vakanın başlangıç hikayesi, olay anı ve dedektifleri bekleyen gizem..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Zarf Sayısı (1 - 10) *</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={totalEnvelopes}
                    onChange={(e) => setTotalEnvelopes(Number(e.target.value))}
                    className="flex-1 accent-[#1f1c18] cursor-pointer"
                  />
                  <span className="font-typewriter text-xs font-bold text-[#1f1c18] px-2.5 py-1.5 bg-[#faf6ed] rounded-sm border border-[#c8bfae]">
                    {totalEnvelopes} Zarf
                  </span>
                </div>
              </div>

              <div>
                <label className={labelClass}>Zorluk Seviyesi</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'Kolay' | 'Orta' | 'Zor' | 'Uzman')}
                  className={inputClass}
                >
                  <option value="Kolay">Kolay</option>
                  <option value="Orta">Orta</option>
                  <option value="Zor">Zor</option>
                  <option value="Uzman">Uzman</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Tahmini Süre (Dakika)</label>
                <input
                  type="number"
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                  className={`${inputClass} font-typewriter`}
                />
              </div>

              <div>
                <label className={labelClass}>Oyuncu Aralığı (Min - Max)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={minPlayers}
                    onChange={(e) => setMinPlayers(Number(e.target.value))}
                    className={`${inputClass} font-typewriter text-center`}
                  />
                  <span className="text-[#7c7265]">-</span>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(Number(e.target.value))}
                    className={`${inputClass} font-typewriter text-center`}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-dashed border-[#d6cdbc] space-y-2.5">
              <p className="font-typewriter font-bold text-[11px] uppercase tracking-wider text-[#1f1c18]">
                Ücretlendirme &amp; İndirme (Mağaza)
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPaid}
                    onChange={(e) => setIsPaid(e.target.checked)}
                    className="accent-[#8b1e1e]"
                  />
                  <span>Ücretli Vaka (Reklamsız · IAP Kilidi)</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={downloadable}
                    onChange={(e) => setDownloadable(e.target.checked)}
                    className="accent-[#1f1c18]"
                  />
                  <span>Uygulama İçi İndirilebilir Paket (DLC)</span>
                </label>
              </div>

              {isPaid && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className={labelClass}>Etiket Fiyatı</label>
                    <input
                      type="text"
                      value={priceLabel}
                      onChange={(e) => setPriceLabel(e.target.value)}
                      placeholder="49,90 TL"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Store Ürün Kodu (SKU)</label>
                    <input
                      type="text"
                      value={storeProductId}
                      onChange={(e) => setStoreProductId(e.target.value)}
                      placeholder={`case_${caseId}`}
                      className={`${inputClass} font-typewriter`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#fffdf8] border border-[#d6cdbc] rounded-sm p-4 sm:p-5 space-y-3">
            <h4 className="font-typewriter font-bold text-xs uppercase tracking-wider text-[#1f1c18] pb-2 border-b border-[#d6cdbc] flex items-center gap-2">
              <Users className="w-3.5 h-3.5" />
              <span>Maktul Künyesi</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Adı Soyadı *</label>
                <input
                  type="text"
                  value={victimName}
                  onChange={(e) => setVictimName(e.target.value)}
                  placeholder="Selim Karadağ"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Yaşı</label>
                <input
                  type="number"
                  value={victimAge}
                  onChange={(e) => setVictimAge(Number(e.target.value))}
                  className={`${inputClass} font-typewriter`}
                />
              </div>

              <div>
                <label className={labelClass}>Unvan / Meslek</label>
                <input
                  type="text"
                  value={victimTitle}
                  onChange={(e) => setVictimTitle(e.target.value)}
                  placeholder="Yönetim Kurulu Başkanı"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Olay Yeri</label>
                <input
                  type="text"
                  value={victimLocation}
                  onChange={(e) => setVictimLocation(e.target.value)}
                  placeholder="Çalışma Odası"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Ölüm Zamanı</label>
                <input
                  type="text"
                  value={victimTimeOfDeath}
                  onChange={(e) => setVictimTimeOfDeath(e.target.value)}
                  placeholder="23:15 - 23:45"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>İlk Bulgu</label>
                <input
                  type="text"
                  value={victimCauseInitial}
                  onChange={(e) => setVictimCauseInitial(e.target.value)}
                  placeholder="Akut zehirlenme"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => {
                soundManager.playKeyClick();
                setActiveStep(2);
              }}
              className="px-4 py-2.5 bg-[#1f1c18] hover:bg-[#36312b] text-[#faf6ed] font-typewriter font-bold rounded-sm text-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Şüpheliler</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SUSPECTS */}
      {activeStep === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-typewriter font-bold text-xs uppercase tracking-wider text-[#1f1c18]">
              Şüpheli Listesi ({suspects.length})
            </h4>

            <button
              type="button"
              onClick={handleAddSuspect}
              className="px-3 py-1.5 bg-[#fffdf8] hover:bg-[#ebe5d8] text-[#1f1c18] rounded-sm text-xs font-typewriter inline-flex items-center gap-1.5 cursor-pointer border border-[#1f1c18]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Şüpheli Ekle</span>
            </button>
          </div>

          <div className="space-y-3">
            {suspects.map((s, idx) => (
              <div key={s.id || idx} className="p-4 bg-[#fffdf8] border border-[#d6cdbc] rounded-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#d6cdbc]">
                  <span className="font-typewriter text-xs text-[#1f1c18] font-bold">
                    ŞÜPHELİ #{idx + 1}
                  </span>
                  {suspects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSuspect(idx)}
                      className="text-[#8b1e1e] hover:underline text-xs font-typewriter inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Kaldır</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Adı Soyadı *</label>
                    <input
                      type="text"
                      value={s.name}
                      onChange={(e) => {
                        const copy = [...suspects];
                        copy[idx].name = e.target.value;
                        setSuspects(copy);
                      }}
                      placeholder="Dr. Hakan Vural"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Unvan / Meslek</label>
                    <input
                      type="text"
                      value={s.title}
                      onChange={(e) => {
                        const copy = [...suspects];
                        copy[idx].title = e.target.value;
                        setSuspects(copy);
                      }}
                      placeholder="Aile Doktoru"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Maktul ile İlişkisi</label>
                    <input
                      type="text"
                      value={s.relation}
                      onChange={(e) => {
                        const copy = [...suspects];
                        copy[idx].relation = e.target.value;
                        setSuspects(copy);
                      }}
                      placeholder="Özel doktoru"
                      className={inputClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClass}>Alibi</label>
                    <input
                      type="text"
                      value={s.alibi}
                      onChange={(e) => {
                        const copy = [...suspects];
                        copy[idx].alibi = e.target.value;
                        setSuspects(copy);
                      }}
                      placeholder="Bahçede telefonla konuştuğunu söylüyor..."
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Başlangıç Şüphesi (%)</label>
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
                      className={`${inputClass} font-typewriter text-center`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => {
                soundManager.playKeyClick();
                setActiveStep(1);
              }}
              className="px-4 py-2 bg-[#faf6ed] hover:bg-[#ebe5d8] text-[#1f1c18] border border-[#c8bfae] font-typewriter rounded-sm text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Geri</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playKeyClick();
                setActiveStep(3);
              }}
              className="px-4 py-2.5 bg-[#1f1c18] hover:bg-[#36312b] text-[#faf6ed] font-typewriter font-bold rounded-sm text-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Zarflar & Medya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: ENVELOPES & MEDIA */}
      {activeStep === 3 && (
        <div className="space-y-5">
          {/* Envelope Tabs */}
          <div className="bg-[#fffdf8] border border-[#d6cdbc] rounded-sm p-3 space-y-2.5">
            <div className="flex items-center justify-between text-xs border-b border-[#d6cdbc] pb-2">
              <span className="font-typewriter font-bold text-[#1f1c18] flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Zarf Seçimi</span>
              </span>
              <span className="text-[#7c7265] font-typewriter text-[11px]">
                Toplam {totalEnvelopes} zarf
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
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
                    className={`px-3 py-1.5 rounded-sm text-xs font-typewriter font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer border ${
                      isSelected
                        ? 'bg-[#1f1c18] text-[#faf6ed] border-[#1f1c18]'
                        : 'bg-[#faf6ed] text-[#1f1c18] border-[#c8bfae] hover:border-[#1f1c18]'
                    }`}
                  >
                    <span>Zarf {envNum}</span>
                    <span className="text-[10px] opacity-75">({count})</span>
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
                  className="px-3 py-1.5 rounded-sm text-xs font-typewriter border border-dashed border-[#b5aa96] hover:border-[#1f1c18] text-[#575046] hover:text-[#1f1c18] transition-colors inline-flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Zarf Ekle</span>
                </button>
              )}
            </div>
          </div>

          {/* Current Envelope Evidence */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="font-typewriter font-bold text-xs uppercase tracking-wider text-[#1f1c18]">
                  Zarf {selectedEnvelopeTab} Belgeleri ({currentEnvelopeEvidence.length})
                </h4>
                <p className="text-xs text-[#575046] mt-0.5">
                  Bu zarfta açılacak metin, görsel, ses veya video kanıtları.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddEvidenceToCurrentEnvelope}
                className="px-3 py-1.5 bg-[#1f1c18] hover:bg-[#36312b] text-[#faf6ed] rounded-sm text-xs font-typewriter font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Delil Ekle</span>
              </button>
            </div>

            {currentEnvelopeEvidence.length === 0 ? (
              <div className="p-6 text-center bg-[#fffdf8] border border-dashed border-[#c8bfae] rounded-sm text-xs font-typewriter text-[#7c7265]">
                Bu zarfta henüz delil yok. Yukarıdan Delil Ekle ile ekleyin.
              </div>
            ) : (
              <div className="space-y-4">
                {currentEnvelopeEvidence.map((ev, i) => (
                  <div key={ev.id} className="p-4 bg-[#fffdf8] border border-[#d6cdbc] rounded-sm space-y-4">
                    <div className="flex items-center justify-between pb-2.5 border-b border-[#d6cdbc]">
                      <div className="flex items-center gap-2 font-typewriter text-xs">
                        <span className="px-2 py-0.5 bg-[#f4efe4] border border-[#c8bfae] rounded-sm font-bold text-[#1f1c18]">
                          ZARF {ev.envelope} · #{i + 1}
                        </span>
                        <span className="text-[#7c7265] text-[11px]">{ev.id}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveEvidence(ev.id)}
                        className="text-[#8b1e1e] hover:underline text-xs font-typewriter inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Kaldır</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className={labelClass}>Delil Başlığı *</label>
                        <input
                          type="text"
                          value={ev.title}
                          onChange={(e) => updateEvidenceField(ev.id, 'title', e.target.value)}
                          placeholder="112 Acil İhbar Ses Kaydı"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Medya Türü *</label>
                        <select
                          value={ev.mediaType || 'text'}
                          onChange={(e) => updateEvidenceField(ev.id, 'mediaType', e.target.value)}
                          className={inputClass}
                        >
                          <option value="text">Metin / Adli Rapor</option>
                          <option value="audio">Ses Kaydı (Audio)</option>
                          <option value="image">Olay Yeri Fotoğrafı (Image)</option>
                          <option value="video">Güvenlik Kamerası / Video</option>
                        </select>
                      </div>

                      <div>
                        <label className={labelClass}>Kategori</label>
                        <select
                          value={ev.category}
                          onChange={(e) => updateEvidenceField(ev.id, 'category', e.target.value)}
                          className={inputClass}
                        >
                          <option value="audio">Ses / Telsiz Kaydı</option>
                          <option value="autopsy">Otopsi Raporu</option>
                          <option value="toxicology">Toksikoloji Raporu</option>
                          <option value="interrogation">Sorgu / İfade Tutanağı</option>
                          <option value="document">Yazılı Belge / Mektup</option>
                          <option value="cipher">Şifreli Mesaj / Kripto</option>
                          <option value="gps">GPS & Konum Kaydı</option>
                          <option value="banking">Banka & Finansal Hareket</option>
                        </select>
                      </div>

                      {(ev.mediaType === 'audio' || ev.mediaType === 'image' || ev.mediaType === 'video') && (
                        <MediaDropzoneUploader
                          caseId={caseId}
                          evidenceId={ev.id}
                          uploadKind="media"
                          mediaType={ev.mediaType}
                          mediaUrl={ev.mediaUrl || ''}
                          mediaCaption={ev.mediaCaption || ''}
                          onUpdateUrl={(url) => updateEvidenceField(ev.id, 'mediaUrl', url)}
                          onUpdateCaption={(caption) => updateEvidenceField(ev.id, 'mediaCaption', caption)}
                        />
                      )}

                      <MediaDropzoneUploader
                        caseId={caseId}
                        evidenceId={ev.id}
                        uploadKind="narration"
                        mediaType="audio"
                        mediaUrl={ev.narrationUrl || ''}
                        onUpdateUrl={(url) => updateEvidenceField(ev.id, 'narrationUrl', url)}
                        title="Belge Sesli Anlatımı (Opsiyonel · .mp3 / .wav)"
                        hideCaption={true}
                      />

                      <div className="sm:col-span-3">
                        <label className={labelClass}>Uzman Erişimi</label>
                        <div className="flex flex-wrap gap-1.5">
                          {(['forensics', 'cryptology', 'profiler', 'field', 'ballistics', 'archive'] as RoleType[]).map((r) => {
                            const isSelected = ev.roleAccess.includes(r);
                            const roleTitle = ROLES[r]?.title || r;
                            return (
                              <button
                                key={r}
                                type="button"
                                onClick={() => toggleRoleAccess(ev.id, r)}
                                className={`px-2.5 py-1 rounded-sm text-xs font-typewriter inline-flex items-center gap-1.5 transition-colors cursor-pointer border ${
                                  isSelected
                                    ? 'bg-[#1f1c18] text-[#faf6ed] border-[#1f1c18] font-bold'
                                    : 'bg-[#faf6ed] text-[#575046] border-[#c8bfae] hover:border-[#1f1c18]'
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
                        <label className={labelClass}>Özet Bulgu</label>
                        <input
                          type="text"
                          value={ev.summary}
                          onChange={(e) => updateEvidenceField(ev.id, 'summary', e.target.value)}
                          placeholder="Kısa özet cümlesi..."
                          className={inputClass}
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className={labelClass}>Resmi Rapor / Tutanak Metni</label>
                        <textarea
                          value={ev.fullReport}
                          onChange={(e) => updateEvidenceField(ev.id, 'fullReport', e.target.value)}
                          rows={4}
                          placeholder="Tutanak ve teknik detaylar..."
                          className={`${inputClass} font-typewriter`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gate Question */}
          <div className="p-4 sm:p-5 bg-[#fffdf8] border border-[#1f1c18] rounded-sm space-y-3">
            <div className="flex items-center gap-2 font-typewriter font-bold text-xs uppercase tracking-wider text-[#1f1c18]">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Zarf {selectedEnvelopeTab} Kapı Sorusu</span>
            </div>
            <p className="text-xs text-[#575046]">
              Bir sonraki zarfa geçmeden önce doğrulanması gereken kontrol sorusu.
            </p>

            <div className="space-y-3 pt-1">
              <div>
                <label className={labelClass}>Soru Metni *</label>
                <input
                  type="text"
                  value={currentGate.question}
                  onChange={(e) => updateCurrentGate('question', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Seçenekler ve Doğru Cevap</label>
                {[0, 1, 2].map((optIdx) => {
                  const opt = currentGate.options?.[optIdx] || { id: `opt-${optIdx + 1}`, text: '', isCorrect: optIdx === 0 };
                  return (
                    <div key={optIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`gate-correct-${selectedEnvelopeTab}`}
                        checked={opt.isCorrect}
                        onChange={() => setGateCorrectOption(optIdx)}
                        className="accent-[#1f1c18] cursor-pointer"
                        title="Doğru cevap olarak işaretle"
                      />
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => updateGateOptionText(optIdx, e.target.value)}
                        placeholder={`Seçenek ${optIdx + 1}`}
                        className={`${inputClass} flex-1`}
                      />
                      {opt.isCorrect && (
                        <span className="text-[10px] font-typewriter text-[#276749] font-bold px-2 py-0.5 rounded-sm border border-[#276749] bg-[#faf6ed] shrink-0">
                          DOĞRU
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div>
                <label className={labelClass}>Açıklama Notu</label>
                <input
                  type="text"
                  value={currentGate.explanation || ''}
                  onChange={(e) => updateCurrentGate('explanation', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => {
                soundManager.playKeyClick();
                setActiveStep(2);
              }}
              className="px-4 py-2 bg-[#faf6ed] hover:bg-[#ebe5d8] text-[#1f1c18] border border-[#c8bfae] font-typewriter rounded-sm text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Geri</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playKeyClick();
                setActiveStep(4);
              }}
              className="px-4 py-2.5 bg-[#1f1c18] hover:bg-[#36312b] text-[#faf6ed] font-typewriter font-bold rounded-sm text-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Fail & Çözüm</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SOLUTION & CULPRIT */}
      {activeStep === 4 && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 bg-[#fffdf8] border border-[#d6cdbc] rounded-sm space-y-4">
            <div className="flex items-center gap-2 text-[#1f1c18] font-typewriter font-bold text-xs uppercase tracking-wider pb-2 border-b border-[#d6cdbc]">
              <Lock className="w-3.5 h-3.5 text-[#8b1e1e]" />
              <span>Vaka Çözümü & Katil (Gizli Bilgi)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Gerçek Katil *</label>
                <select
                  value={culpritName}
                  onChange={(e) => {
                    setCulpritName(e.target.value);
                    const matched = suspects.find((s) => s.name === e.target.value);
                    if (matched) setCulpritId(matched.id);
                  }}
                  className={`${inputClass} font-bold`}
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
                <label className={labelClass}>Cinayet Motifi *</label>
                <input
                  type="text"
                  value={motiveTitle}
                  onChange={(e) => setMotiveTitle(e.target.value)}
                  placeholder="Miras Hırsı ve Sahte Vasiyetname"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Kilit Kanıt *</label>
                <input
                  type="text"
                  value={keyEvidenceTitle}
                  onChange={(e) => setKeyEvidenceTitle(e.target.value)}
                  placeholder="Kadehte Tespit Edilen Zehir"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Resmi Dava Kapanış Özeti</label>
                <textarea
                  value={verdictSummary}
                  onChange={(e) => setVerdictSummary(e.target.value)}
                  rows={4}
                  placeholder="Olayın gerçek perde arkası ve çözüm özeti..."
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2 pt-2 border-t border-[#d6cdbc] space-y-2">
                <div className="flex items-center justify-between">
                  <label className={labelClass}>Katilin İtiraf Mektubu</label>
                  <span className="text-[10px] font-typewriter text-[#7c7265]">
                    {confessionLetter.length} karakter
                  </span>
                </div>
                <textarea
                  value={confessionLetter}
                  onChange={(e) => setConfessionLetter(e.target.value)}
                  rows={5}
                  placeholder="Katilin oylama sonrasında açılacak itiraf mektubu..."
                  className={`${inputClass} font-typewriter leading-relaxed`}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => {
                soundManager.playKeyClick();
                setActiveStep(3);
              }}
              className="px-4 py-2 bg-[#faf6ed] hover:bg-[#ebe5d8] text-[#1f1c18] border border-[#c8bfae] font-typewriter rounded-sm text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Geri</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playKeyClick();
                setActiveStep(5);
              }}
              className="px-4 py-2.5 bg-[#1f1c18] hover:bg-[#36312b] text-[#faf6ed] font-typewriter font-bold rounded-sm text-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Önizle & Yayınla</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW & PUBLISH */}
      {activeStep === 5 && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 bg-[#fffdf8] border border-[#d6cdbc] rounded-sm space-y-4">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#d6cdbc]">
              <div>
                <h4 className="font-typewriter font-bold text-base text-[#1f1c18]">
                  {title || 'Yeni Vaka Dosyası'}
                </h4>
                <p className="text-xs text-[#575046] mt-0.5">
                  {subtitle || 'Vaka dosyası yayınlamaya hazır'}
                </p>
              </div>

              <span className="px-2 py-0.5 rounded-sm border border-[#1f1c18] bg-[#faf6ed] font-typewriter text-xs font-bold text-[#1f1c18] shrink-0">
                {totalEnvelopes} ZARF
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-typewriter">
              <div className="p-3 rounded-sm bg-[#faf6ed] border border-[#d6cdbc]">
                <span className="text-[10px] text-[#7c7265] uppercase block">Maktul</span>
                <strong className="text-[#1f1c18] block truncate mt-0.5">{victimName || 'Belirtilmedi'}</strong>
              </div>
              <div className="p-3 rounded-sm bg-[#faf6ed] border border-[#d6cdbc]">
                <span className="text-[10px] text-[#7c7265] uppercase block">Şüpheli</span>
                <strong className="text-[#1f1c18] block mt-0.5">{suspects.length} kişi</strong>
              </div>
              <div className="p-3 rounded-sm bg-[#faf6ed] border border-[#d6cdbc]">
                <span className="text-[10px] text-[#7c7265] uppercase block">Delil</span>
                <strong className="text-[#1f1c18] block mt-0.5">{evidenceList.length} parça</strong>
              </div>
              <div className="p-3 rounded-sm bg-[#faf6ed] border border-[#d6cdbc]">
                <span className="text-[10px] text-[#7c7265] uppercase block">Fail</span>
                <strong className="text-[#8b1e1e] block truncate mt-0.5">{culpritName || suspects[0]?.name}</strong>
              </div>
            </div>

            <div className="pt-2 border-t border-dashed border-[#d6cdbc] flex flex-wrap gap-3 text-[11px] font-typewriter text-[#575046]">
              <span className="inline-flex items-center gap-1">
                <Headphones className="w-3.5 h-3.5" />
                {evidenceList.filter((e) => e.mediaType === 'audio').length} Ses
              </span>
              <span className="inline-flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" />
                {evidenceList.filter((e) => e.mediaType === 'image').length} Görsel
              </span>
              <span className="inline-flex items-center gap-1">
                <Video className="w-3.5 h-3.5" />
                {evidenceList.filter((e) => e.mediaType === 'video').length} Video
              </span>
              <span className="inline-flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                {evidenceList.filter((e) => e.mediaType === 'text' || !e.mediaType).length} Metin
              </span>
              <span className="inline-flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5" />
                {evidenceList.filter((e) => Boolean(e.narrationUrl?.trim())).length} Sesli Anlatım
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playKeyClick();
                  setActiveStep(4);
                }}
                className="px-3.5 py-2 bg-[#faf6ed] hover:bg-[#ebe5d8] text-[#1f1c18] border border-[#c8bfae] font-typewriter rounded-sm text-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Geri</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadJSON}
                className="px-3 py-2 bg-[#fffdf8] hover:bg-[#ebe5d8] text-[#1f1c18] rounded-sm text-xs font-typewriter inline-flex items-center gap-1.5 cursor-pointer border border-[#c8bfae]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>İndir (.json)</span>
              </button>

              <button
                type="button"
                onClick={handleCopyJSON}
                className="px-3 py-2 bg-[#fffdf8] hover:bg-[#ebe5d8] text-[#1f1c18] rounded-sm text-xs font-typewriter inline-flex items-center gap-1.5 cursor-pointer border border-[#c8bfae]"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-[#276749]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                type="button"
                onClick={() => handleSaveWithStatus('draft')}
                disabled={isSaving}
                className="px-4 py-2.5 bg-[#fffdf8] hover:bg-[#ebe5d8] text-[#1f1c18] border border-[#1f1c18] font-typewriter font-bold rounded-sm text-xs inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Kaydediliyor...' : 'Taslak Kaydet'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveWithStatus('published')}
                disabled={isSaving}
                className="px-5 py-2.5 bg-[#1f1c18] hover:bg-[#36312b] text-[#faf6ed] font-typewriter font-bold rounded-sm text-xs inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {isSaving
                    ? 'Kaydediliyor...'
                    : isEditing
                    ? 'Değişiklikleri Yayınla'
                    : 'Canlıda Yayınla'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
