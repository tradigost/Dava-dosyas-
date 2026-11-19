/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  AdminDashboardData,
  fetchAdminDashboardData,
  DetectiveProfile,
  loginWithGoogle,
  saveCustomCase,
  deleteCustomCase,
  validateCaseScenario,
  subscribeToCustomCases,
  auth,
  ADMIN_EMAIL,
} from '../services/firebase';
import { CASE_SCENARIOS } from '../data/cases';
import { DEMO_CUSTOM_CASE, SAMPLE_CASE_TEMPLATE } from '../data/sampleCase';
import { CaseScenario, getScenarioTotalEnvelopes } from '../types';
import { CaseWizardEditor } from './CaseWizardEditor';
import { soundManager } from '../utils/audioEffects';
import { isVerifiedAdminUser } from '../utils/scenarioUtils';
import {
  X,
  RefreshCw,
  Search,
  CheckCircle2,
  FileCode2,
  Lock,
  LogIn,
  Upload,
  Download,
  Trash2,
  Eye,
  Check,
  AlertTriangle,
  FileJson,
  Edit3,
  Copy,
  Globe,
  EyeOff,
  Plus,
  ArrowLeft,
  Star,
} from 'lucide-react';

export { ADMIN_EMAIL };

interface AdminDashboardModalProps {
  currentUser: DetectiveProfile | null;
  onClose: () => void;
  customCases?: CaseScenario[];
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  currentUser,
  onClose,
  customCases: externalCustomCases,
}) => {
  const [activeTab, setActiveTab] = useState<'cases' | 'overview' | 'users'>('cases');
  const [caseView, setCaseView] = useState<'list' | 'wizard' | 'import'>('list');
  const [importMode, setImportMode] = useState<'file' | 'json'>('file');

  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchUser, setSearchUser] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Custom Cases State
  const [customCasesList, setCustomCasesList] = useState<CaseScenario[]>(externalCustomCases || []);
  const [rawJsonText, setRawJsonText] = useState<string>('');
  const [pendingParsedCase, setPendingParsedCase] = useState<CaseScenario | null>(null);
  const [caseValidationErrors, setCaseValidationErrors] = useState<string[]>([]);
  const [uploadFeedback, setUploadFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSavingCase, setIsSavingCase] = useState<boolean>(false);
  const [previewCase, setPreviewCase] = useState<CaseScenario | null>(null);
  const [caseToDelete, setCaseToDelete] = useState<string | null>(null);
  const [editingCase, setEditingCase] = useState<CaseScenario | null>(null);
  const [isEditingExisting, setIsEditingExisting] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.removeItem('detective_admin_mode');
    } catch (e) {}
  }, []);

  const isAuthorized = isVerifiedAdminUser(auth.currentUser, ADMIN_EMAIL);

  const handleAdminGoogleLogin = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      soundManager.playKeyClick();
      const profile = await loginWithGoogle();
      if (isVerifiedAdminUser(auth.currentUser, ADMIN_EMAIL)) {
        soundManager.playSuccessSound();
      } else {
        soundManager.playErrorSound();
        setAuthError(
          `"${profile?.email || 'Bu hesap'}" doğrulanmış yönetici olarak tanımlı değil. Lütfen "${ADMIN_EMAIL}" Google hesabı ile giriş yapın.`
        );
      }
    } catch (e: any) {
      soundManager.playErrorSound();
      setAuthError(e.message || 'Giriş yapılamadı.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminDashboardData();
      setData(res);
    } catch (e) {
      console.warn('Failed to load admin dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      loadData();
    }
  }, [isAuthorized]);

  useEffect(() => {
    const unsub = subscribeToCustomCases((cases) => {
      setCustomCasesList(cases);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (externalCustomCases) {
      setCustomCasesList(externalCustomCases);
    }
  }, [externalCustomCases]);

  const handleDownloadTemplate = () => {
    soundManager.playKeyClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(SAMPLE_CASE_TEMPLATE, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'masadaki-dosya-vaka-sablonu.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleLoadDemoCase = async () => {
    soundManager.playKeyClick();
    setIsSavingCase(true);
    setUploadFeedback(null);
    try {
      await saveCustomCase(DEMO_CUSTOM_CASE, currentUser);
      soundManager.playSuccessSound();
      setUploadFeedback({
        type: 'success',
        message: `"${DEMO_CUSTOM_CASE.title}" sisteme yüklendi ve yayınlandı.`,
      });
      setPendingParsedCase(null);
      setRawJsonText('');
      setCaseValidationErrors([]);
    } catch (err: any) {
      soundManager.playErrorSound();
      setUploadFeedback({
        type: 'error',
        message: `Demo vaka yüklenirken hata oluştu: ${err.message || 'Bilinmeyen hata'}`,
      });
    } finally {
      setIsSavingCase(false);
    }
  };

  const processAndValidateJson = (jsonString: string) => {
    setUploadFeedback(null);
    try {
      const parsed = JSON.parse(jsonString);
      const validation = validateCaseScenario(parsed);
      if (!validation.valid) {
        soundManager.playErrorSound();
        setCaseValidationErrors(validation.errors);
        setPendingParsedCase(null);
      } else {
        soundManager.playKeyClick();
        setCaseValidationErrors([]);
        setPendingParsedCase(parsed);
      }
    } catch (err: any) {
      soundManager.playErrorSound();
      setCaseValidationErrors([`JSON sözdizimi hatası: ${err.message}`]);
      setPendingParsedCase(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundManager.playKeyClick();
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawJsonText(content);
      processAndValidateJson(content);
    };
    reader.onerror = () => {
      soundManager.playErrorSound();
      setCaseValidationErrors(['Dosya okunurken bir hata oluştu.']);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handlePublishCase = async (targetStatus: 'published' | 'draft' = 'published') => {
    if (!pendingParsedCase) return;
    setIsSavingCase(true);
    setUploadFeedback(null);
    try {
      soundManager.playKeyClick();
      const casePayload: CaseScenario = { ...pendingParsedCase, status: targetStatus };
      await saveCustomCase(casePayload, currentUser);
      soundManager.playSuccessSound();
      setUploadFeedback({
        type: 'success',
        message:
          targetStatus === 'draft'
            ? `"${casePayload.title}" taslak olarak kaydedildi.`
            : `"${casePayload.title}" canlıda yayınlandı.`,
      });
      setPendingParsedCase(null);
      setRawJsonText('');
      setCaseValidationErrors([]);
      setCaseView('list');
    } catch (err: any) {
      soundManager.playErrorSound();
      setUploadFeedback({
        type: 'error',
        message: `Yükleme başarısız: ${err.message || 'Yetki veya bağlantı hatası'}`,
      });
    } finally {
      setIsSavingCase(false);
    }
  };

  const handleToggleCaseStatus = async (sc: CaseScenario) => {
    const nextStatus: 'published' | 'draft' = sc.status === 'draft' ? 'published' : 'draft';
    setIsSavingCase(true);
    setUploadFeedback(null);
    try {
      soundManager.playKeyClick();
      await saveCustomCase({ ...sc, status: nextStatus }, currentUser);
      soundManager.playSuccessSound();
      setUploadFeedback({
        type: 'success',
        message:
          nextStatus === 'published'
            ? `"${sc.title}" canlıda yayınlandı.`
            : `"${sc.title}" taslağa alındı.`,
      });
    } catch (err: any) {
      soundManager.playErrorSound();
      setUploadFeedback({
        type: 'error',
        message: err?.message || 'Vaka durumu güncellenirken hata oluştu.',
      });
    } finally {
      setIsSavingCase(false);
    }
  };

  const handleConfirmDeleteCase = async (caseId: string) => {
    try {
      soundManager.playKeyClick();
      await deleteCustomCase(caseId);
      soundManager.playSuccessSound();
      setCaseToDelete(null);
      setUploadFeedback({
        type: 'success',
        message: 'Vaka kalıcı olarak silindi.',
      });
    } catch (err: any) {
      soundManager.playErrorSound();
      setUploadFeedback({
        type: 'error',
        message: err?.message || 'Vaka silinirken bir hata oluştu.',
      });
    }
  };

  const filteredUsers = (data?.usersList || []).filter((u) => {
    const q = searchUser.toLowerCase();
    return (
      (u.displayName || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.uid || '').toLowerCase().includes(q)
    );
  });

  // Security Gate
  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1f1c18]/55 backdrop-blur-[2px] animate-fade-in">
        <div className="bg-[#faf6ed] border border-[#1f1c18] rounded-sm w-full max-w-md p-6 shadow-[0_12px_36px_rgba(31,28,24,0.2)] relative text-[#1f1c18] text-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-[#575046] hover:text-[#1f1c18] hover:bg-[#efe9da] rounded-sm transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-11 h-11 rounded-sm bg-[#fffdf8] border border-[#8b1e1e] flex items-center justify-center text-[#8b1e1e] mx-auto mb-4">
            <Lock className="w-5 h-5" />
          </div>

          <span className="text-[10px] font-typewriter uppercase tracking-[0.2em] text-[#8b1e1e] font-bold block mb-1">
            YÖNETİM MERKEZİ
          </span>
          <h2 className="font-typewriter font-bold text-lg text-[#1f1c18]">
            Yetkili Girişi Gerekli
          </h2>
          <p className="text-xs text-[#575046] mt-2 leading-relaxed">
            Bu alan yalnızca sistem yöneticisi (<strong className="text-[#1f1c18]">{ADMIN_EMAIL}</strong>) içindir.
          </p>

          {currentUser?.email && (
            <div className="mt-3 p-2.5 rounded-sm bg-[#fffdf8] border border-[#d6cdbc] text-[11px] text-[#575046]">
              Mevcut oturum: <span className="font-typewriter text-[#1f1c18]">{currentUser.email}</span> (Yetkisiz)
            </div>
          )}

          {authError && (
            <div className="mt-3 p-3 bg-[#fffdf8] border border-[#8b1e1e] rounded-sm text-[#8b1e1e] text-xs">
              {authError}
            </div>
          )}

          <div className="mt-5 space-y-2.5">
            <button
              type="button"
              onClick={handleAdminGoogleLogin}
              disabled={isLoggingIn}
              className="w-full py-2.5 px-4 bg-[#1f1c18] hover:bg-[#36312b] text-[#faf6ed] font-typewriter font-bold rounded-sm text-xs inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoggingIn ? 'Giriş Yapılıyor...' : `Google ile Giriş Yap (${ADMIN_EMAIL})`}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-[#575046] hover:text-[#1f1c18] text-xs font-typewriter cursor-pointer transition-colors"
            >
              Masaya Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#1f1c18]/55 backdrop-blur-[2px] animate-fade-in overflow-y-auto">
      <div className="bg-[#faf6ed] border border-[#1f1c18] rounded-sm w-full max-w-4xl my-auto p-5 sm:p-6 shadow-[0_14px_42px_rgba(31,28,24,0.22)] relative text-[#1f1c18] max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#d6cdbc] shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-typewriter font-bold text-base sm:text-lg uppercase tracking-[0.12em] text-[#1f1c18]">
                YÖNETİM PANELİ
              </h2>
              <span className="text-[10px] font-typewriter px-1.5 py-0.5 rounded-sm border border-[#8b1e1e] text-[#8b1e1e] font-bold">
                ADMİN
              </span>
            </div>
            <p className="text-[11px] text-[#575046] mt-0.5 font-typewriter">
              {currentUser?.email || ADMIN_EMAIL}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                soundManager.playKeyClick();
                loadData();
              }}
              className="p-2 text-[#575046] hover:text-[#1f1c18] hover:bg-[#efe9da] rounded-sm transition-colors cursor-pointer"
              title="Verileri Yenile"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#575046] hover:text-[#1f1c18] hover:bg-[#efe9da] rounded-sm transition-colors cursor-pointer"
              title="Kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Minimal Tabs */}
        <div className="flex border-b border-[#d6cdbc] mt-3 gap-4 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('cases')}
            className={`py-2.5 text-xs font-typewriter border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'cases'
                ? 'border-[#1f1c18] text-[#1f1c18] font-bold'
                : 'border-transparent text-[#7c7265] hover:text-[#1f1c18]'
            }`}
          >
            Vakalar ({CASE_SCENARIOS.length + customCasesList.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 text-xs font-typewriter border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#1f1c18] text-[#1f1c18] font-bold'
                : 'border-transparent text-[#7c7265] hover:text-[#1f1c18]'
            }`}
          >
            Özet
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`py-2.5 text-xs font-typewriter border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-[#1f1c18] text-[#1f1c18] font-bold'
                : 'border-transparent text-[#7c7265] hover:text-[#1f1c18]'
            }`}
          >
            Üyeler ({data?.usersCount || 0})
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto mt-5 pr-1 space-y-5">
          {/* TAB 1: VAKALAR (DEFAULT) */}
          {activeTab === 'cases' && (
            <>
              {/* Feedback Alert */}
              {uploadFeedback && (
                <div
                  className={`p-3 rounded-sm border bg-[#fffdf8] text-xs font-typewriter flex items-center justify-between gap-3 ${
                    uploadFeedback.type === 'success'
                      ? 'border-[#276749] text-[#276749]'
                      : 'border-[#8b1e1e] text-[#8b1e1e]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {uploadFeedback.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{uploadFeedback.message}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadFeedback(null)}
                    className="p-1 opacity-70 hover:opacity-100 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* SUB-VIEW: LIST */}
              {caseView === 'list' && (
                <div className="space-y-6">
                  {/* Minimal Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#d6cdbc]">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playKeyClick();
                          setEditingCase(null);
                          setIsEditingExisting(false);
                          setUploadFeedback(null);
                          setCaseView('wizard');
                        }}
                        className="px-3.5 py-2 bg-[#1f1c18] hover:bg-[#36312b] text-[#faf6ed] font-typewriter font-bold text-xs rounded-sm inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Yeni Vaka</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playKeyClick();
                          setUploadFeedback(null);
                          setCaseView('import');
                        }}
                        className="px-3.5 py-2 bg-[#fffdf8] hover:bg-[#ebe5d8] text-[#1f1c18] border border-[#1f1c18] font-typewriter text-xs rounded-sm inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>JSON İçe Aktar</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleDownloadTemplate}
                        className="px-3 py-1.5 bg-[#faf6ed] hover:bg-[#ebe5d8] text-[#575046] hover:text-[#1f1c18] border border-[#c8bfae] font-typewriter text-xs rounded-sm inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Şablon</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleLoadDemoCase}
                        disabled={isSavingCase}
                        className="px-3 py-1.5 bg-[#faf6ed] hover:bg-[#ebe5d8] text-[#575046] hover:text-[#1f1c18] border border-[#c8bfae] font-typewriter text-xs rounded-sm inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <span>{isSavingCase ? 'Yükleniyor...' : 'Demo Vaka Ekle'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Custom Cases (Firestore) */}
                  <div className="space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-[11px] font-typewriter uppercase tracking-[0.16em] text-[#1f1c18] font-bold">
                        ÖZEL VAKALAR (FİRESTORE)
                      </h3>
                      <span className="text-[11px] font-typewriter text-[#7c7265]">
                        {customCasesList.length} kayıt
                      </span>
                    </div>

                    {customCasesList.length === 0 ? (
                      <div className="p-6 bg-[#fffdf8] border border-dashed border-[#c8bfae] rounded-sm text-center text-xs font-typewriter text-[#7c7265]">
                        Henüz Firestore üzerinde kayıtlı özel vaka yok.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {customCasesList.map((sc) => {
                          const isDraft = sc.status === 'draft';
                          return (
                            <div
                              key={sc.id}
                              className="p-3.5 bg-[#fffdf8] border border-[#d6cdbc] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                              <div className="min-w-0 space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span
                                    className={`px-1.5 py-0.5 rounded-sm font-typewriter text-[10px] font-bold border ${
                                      isDraft
                                        ? 'border-[#c8bfae] text-[#7c7265] bg-[#faf6ed]'
                                        : 'border-[#276749] text-[#276749] bg-[#faf6ed]'
                                    }`}
                                  >
                                    {isDraft ? 'TASLAK' : 'YAYINDA'}
                                  </span>
                                  <h4 className="font-typewriter font-bold text-sm text-[#1f1c18] truncate">
                                    {sc.title}
                                  </h4>
                                </div>
                                <p className="text-xs text-[#575046] line-clamp-1">
                                  {sc.subtitle || sc.synopsis}
                                </p>
                                <div className="text-[11px] font-typewriter text-[#7c7265]">
                                  {sc.id} · {sc.suspects?.length || 0} şüpheli · {sc.evidence?.length || 0} delil · {getScenarioTotalEnvelopes(sc)} zarf
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  disabled={isSavingCase}
                                  onClick={() => handleToggleCaseStatus(sc)}
                                  className="px-2.5 py-1.5 bg-[#faf6ed] hover:bg-[#ebe5d8] text-[#1f1c18] border border-[#c8bfae] rounded-sm text-xs font-typewriter inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                >
                                  {isDraft ? (
                                    <>
                                      <Globe className="w-3.5 h-3.5" />
                                      <span>Yayınla</span>
                                    </>
                                  ) : (
                                    <>
                                      <EyeOff className="w-3.5 h-3.5" />
                                      <span>Taslağa Al</span>
                                    </>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    soundManager.playKeyClick();
                                    setEditingCase(JSON.parse(JSON.stringify(sc)));
                                    setIsEditingExisting(true);
                                    setCaseView('wizard');
                                  }}
                                  className="px-2.5 py-1.5 bg-[#fffdf8] hover:bg-[#ebe5d8] text-[#1f1c18] border border-[#1f1c18] rounded-sm text-xs font-typewriter inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Düzenle</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    soundManager.playKeyClick();
                                    setPreviewCase(sc);
                                  }}
                                  className="px-2.5 py-1.5 bg-[#faf6ed] hover:bg-[#ebe5d8] text-[#575046] border border-[#c8bfae] rounded-sm text-xs font-typewriter inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Önizle</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    soundManager.playKeyClick();
                                    setCaseToDelete(sc.id);
                                  }}
                                  className="px-2.5 py-1.5 bg-[#faf6ed] hover:bg-[#8b1e1e] text-[#8b1e1e] hover:text-[#faf6ed] border border-[#8b1e1e] rounded-sm text-xs font-typewriter inline-flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Sil</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Built-in Cases */}
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-[11px] font-typewriter uppercase tracking-[0.16em] text-[#575046] font-bold">
                        YERLEŞİK VAKALAR
                      </h3>
                      <span className="text-[11px] font-typewriter text-[#7c7265]">
                        {CASE_SCENARIOS.length} dosya
                      </span>
                    </div>

                    <div className="space-y-2">
                      {CASE_SCENARIOS.map((sc) => (
                        <div
                          key={sc.id}
                          className="p-3.5 bg-[#f4efe4] border border-[#d6cdbc] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded-sm border border-[#c8bfae] bg-[#faf6ed] text-[#575046] font-typewriter text-[10px]">
                                SİSTEM
                              </span>
                              <h4 className="font-typewriter font-bold text-sm text-[#1f1c18] truncate">
                                {sc.title}
                              </h4>
                            </div>
                            <p className="text-xs text-[#575046] line-clamp-1">{sc.subtitle}</p>
                            <div className="text-[11px] font-typewriter text-[#7c7265]">
                              {sc.id} · {sc.difficulty} · ~{sc.estimatedMinutes} dk · {getScenarioTotalEnvelopes(sc)} zarf
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                soundManager.playKeyClick();
                                const cloned: CaseScenario = {
                                  ...JSON.parse(JSON.stringify(sc)),
                                  id: `${sc.id}-ozel`,
                                  status: 'draft',
                                };
                                setEditingCase(cloned);
                                setIsEditingExisting(false);
                                setCaseView('wizard');
                              }}
                              className="px-2.5 py-1.5 bg-[#fffdf8] hover:bg-[#ebe5d8] text-[#1f1c18] border border-[#1f1c18] rounded-sm text-xs font-typewriter inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Kopyala & Düzenle</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                soundManager.playKeyClick();
                                setPreviewCase(sc);
                              }}
                              className="px-2.5 py-1.5 bg-[#faf6ed] hover:bg-[#ebe5d8] text-[#575046] border border-[#c8bfae] rounded-sm text-xs font-typewriter inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>İncele</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-VIEW: WIZARD */}
              {caseView === 'wizard' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#d6cdbc]">
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playKeyClick();
                        setEditingCase(null);
                        setIsEditingExisting(false);
                        setCaseView('list');
                      }}
                      className="px-3 py-1.5 bg-[#fffdf8] hover:bg-[#ebe5d8] border border-[#c8bfae] text-[#1f1c18] rounded-sm text-xs font-typewriter inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Vaka Listesi</span>
                    </button>

                    <span className="text-[11px] font-typewriter uppercase tracking-wider text-[#575046]">
                      {isEditingExisting ? 'Vaka Düzenle' : editingCase ? 'Şablondan Yeni Vaka' : 'Yeni Vaka Oluştur'}
                    </span>
                  </div>

                  <CaseWizardEditor
                    key={editingCase ? `${isEditingExisting ? 'edit' : 'clone'}-${editingCase.id}` : 'new-case'}
                    initialScenario={editingCase}
                    isEditing={isEditingExisting}
                    onCancel={() => {
                      setEditingCase(null);
                      setIsEditingExisting(false);
                      setCaseView('list');
                    }}
                    onSaveCase={async (newScenario) => {
                      setIsSavingCase(true);
                      setUploadFeedback(null);
                      try {
                        await saveCustomCase(newScenario, currentUser);
                        soundManager.playSuccessSound();
                        const isDraft = newScenario.status === 'draft';
                        setUploadFeedback({
                          type: 'success',
                          message: isDraft
                            ? `"${newScenario.title}" taslak olarak kaydedildi.`
                            : `"${newScenario.title}" (${newScenario.totalEnvelopes || 3} Zarf) canlıda yayınlandı.`,
                        });
                        setEditingCase(null);
                        setIsEditingExisting(false);
                        setCaseView('list');
                      } catch (err: any) {
                        soundManager.playErrorSound();
                        setUploadFeedback({
                          type: 'error',
                          message: `Vaka kaydedilirken hata oluştu: ${err.message || 'Bilinmeyen hata'}`,
                        });
                      } finally {
                        setIsSavingCase(false);
                      }
                    }}
                    isSaving={isSavingCase}
                  />
                </div>
              )}

              {/* SUB-VIEW: JSON IMPORT */}
              {caseView === 'import' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#d6cdbc]">
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playKeyClick();
                        setCaseView('list');
                      }}
                      className="px-3 py-1.5 bg-[#fffdf8] hover:bg-[#ebe5d8] border border-[#c8bfae] text-[#1f1c18] rounded-sm text-xs font-typewriter inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Vaka Listesi</span>
                    </button>

                    <div className="inline-flex border border-[#c8bfae] rounded-sm overflow-hidden divide-x divide-[#c8bfae]">
                      <button
                        type="button"
                        onClick={() => {
                          setImportMode('file');
                          soundManager.playKeyClick();
                        }}
                        className={`px-3 py-1.5 text-xs font-typewriter inline-flex items-center gap-1.5 cursor-pointer ${
                          importMode === 'file' ? 'bg-[#1f1c18] text-[#faf6ed] font-bold' : 'bg-[#fffdf8] text-[#1f1c18]'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Dosya (.json)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImportMode('json');
                          soundManager.playKeyClick();
                        }}
                        className={`px-3 py-1.5 text-xs font-typewriter inline-flex items-center gap-1.5 cursor-pointer ${
                          importMode === 'json' ? 'bg-[#1f1c18] text-[#faf6ed] font-bold' : 'bg-[#fffdf8] text-[#1f1c18]'
                        }`}
                      >
                        <FileCode2 className="w-3.5 h-3.5" />
                        <span>Metin</span>
                      </button>
                    </div>
                  </div>

                  {importMode === 'file' && (
                    <label className="border border-dashed border-[#b5aa96] hover:border-[#1f1c18] bg-[#fffdf8] rounded-sm p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors">
                      <input
                        type="file"
                        accept=".json,application/json"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <FileJson className="w-7 h-7 text-[#575046] mb-2" />
                      <span className="text-xs font-typewriter font-bold text-[#1f1c18]">
                        Vaka JSON Dosyası Seçin
                      </span>
                      <span className="text-[11px] text-[#575046] mt-1 max-w-sm">
                        Seçilen .json dosyası otomatik taranır ve doğrulanır.
                      </span>
                    </label>
                  )}

                  {importMode === 'json' && (
                    <div className="space-y-3">
                      <textarea
                        value={rawJsonText}
                        onChange={(e) => setRawJsonText(e.target.value)}
                        placeholder='{\n  "id": "bogaz-yalisinda-cinayet",\n  "title": "Boğaz Yalısında Cinayet",\n  ...\n}'
                        rows={8}
                        className="w-full bg-[#fffdf8] border border-[#c8bfae] rounded-sm p-3 font-typewriter text-xs text-[#1f1c18] placeholder-[#9c9284] focus:outline-none focus:border-[#1f1c18]"
                      />
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => processAndValidateJson(rawJsonText)}
                          disabled={!rawJsonText.trim()}
                          className="px-3.5 py-2 bg-[#1f1c18] hover:bg-[#36312b] text-[#faf6ed] rounded-sm text-xs font-typewriter font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Doğrula</span>
                        </button>

                        {rawJsonText && (
                          <button
                            type="button"
                            onClick={() => {
                              setRawJsonText('');
                              setPendingParsedCase(null);
                              setCaseValidationErrors([]);
                            }}
                            className="text-xs font-typewriter text-[#575046] hover:text-[#1f1c18] underline cursor-pointer"
                          >
                            Temizle
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {caseValidationErrors.length > 0 && (
                    <div className="p-3.5 bg-[#fffdf8] border border-[#8b1e1e] rounded-sm space-y-1.5 text-xs text-[#8b1e1e]">
                      <div className="flex items-center gap-2 font-typewriter font-bold">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>Şema Doğrulama Hatası</span>
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] pl-1">
                        {caseValidationErrors.map((err, idx) => (
                          <li key={idx}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {pendingParsedCase && (
                    <div className="p-4 bg-[#fffdf8] border border-[#1f1c18] rounded-sm space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-typewriter uppercase tracking-wider text-[#276749] font-bold">
                            DOĞRULANDI
                          </span>
                          <h5 className="font-typewriter font-bold text-base text-[#1f1c18] mt-0.5">
                            {pendingParsedCase.title}
                          </h5>
                          <p className="text-xs text-[#575046]">{pendingParsedCase.subtitle}</p>
                        </div>

                        <div className="text-right shrink-0 font-typewriter text-[11px] text-[#575046]">
                          <div>ID: {pendingParsedCase.id}</div>
                          <div>{pendingParsedCase.difficulty} · ~{pendingParsedCase.estimatedMinutes} dk</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-typewriter">
                        <div className="p-2.5 rounded-sm bg-[#faf6ed] border border-[#d6cdbc]">
                          <span className="text-[10px] text-[#7c7265] block">Maktul</span>
                          <span className="font-bold text-[#1f1c18] truncate block mt-0.5">
                            {pendingParsedCase.victim?.name}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-sm bg-[#faf6ed] border border-[#d6cdbc]">
                          <span className="text-[10px] text-[#7c7265] block">Şüpheli</span>
                          <span className="font-bold text-[#1f1c18] block mt-0.5">
                            {pendingParsedCase.suspects?.length || 0} kişi
                          </span>
                        </div>
                        <div className="p-2.5 rounded-sm bg-[#faf6ed] border border-[#d6cdbc]">
                          <span className="text-[10px] text-[#7c7265] block">Delil</span>
                          <span className="font-bold text-[#1f1c18] block mt-0.5">
                            {pendingParsedCase.evidence?.length || 0} parça
                          </span>
                        </div>
                        <div className="p-2.5 rounded-sm bg-[#faf6ed] border border-[#d6cdbc]">
                          <span className="text-[10px] text-[#7c7265] block">Zarf</span>
                          <span className="font-bold text-[#1f1c18] block mt-0.5">
                            {getScenarioTotalEnvelopes(pendingParsedCase)} zarf
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setPendingParsedCase(null)}
                          className="text-xs font-typewriter text-[#575046] hover:text-[#1f1c18] underline cursor-pointer mr-auto"
                        >
                          Vazgeç
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePublishCase('draft')}
                          disabled={isSavingCase}
                          className="py-2 px-3.5 bg-[#faf6ed] hover:bg-[#ebe5d8] text-[#1f1c18] border border-[#1f1c18] font-typewriter font-bold rounded-sm text-xs inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>{isSavingCase ? 'Kaydediliyor...' : 'Taslak Kaydet'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePublishCase('published')}
                          disabled={isSavingCase}
                          className="py-2 px-4 bg-[#1f1c18] hover:bg-[#36312b] text-[#faf6ed] font-typewriter font-bold rounded-sm text-xs inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isSavingCase ? 'Yükleniyor...' : 'Yayınla'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* TAB 2: ÖZET & DEĞERLENDİRMELER */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Compact 4-Metric Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 border border-[#d6cdbc] rounded-sm divide-y sm:divide-y-0 sm:divide-x divide-[#d6cdbc] bg-[#fffdf8]">
                <div className="p-4">
                  <span className="text-[10px] font-typewriter uppercase tracking-wider text-[#7c7265] block">
                    Üye
                  </span>
                  <span className="text-2xl font-bold font-typewriter text-[#1f1c18] mt-1 block">
                    {data?.usersCount || 0}
                  </span>
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-typewriter uppercase tracking-wider text-[#7c7265] block">
                    Değerlendirme
                  </span>
                  <span className="text-2xl font-bold font-typewriter text-[#1f1c18] mt-1 block">
                    {data?.ratingsCount || 0}
                  </span>
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-typewriter uppercase tracking-wider text-[#7c7265] block">
                    Ortalama
                  </span>
                  <span className="text-2xl font-bold font-typewriter text-[#1f1c18] mt-1 block">
                    ★ {data?.averageRating || 4.9}
                  </span>
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-typewriter uppercase tracking-wider text-[#7c7265] block">
                    Oda
                  </span>
                  <span className="text-2xl font-bold font-typewriter text-[#1f1c18] mt-1 block">
                    {data?.roomsCount || 0}
                  </span>
                </div>
              </div>

              {/* Scenario Score List */}
              <div className="space-y-2.5">
                <h3 className="text-[11px] font-typewriter uppercase tracking-[0.16em] text-[#1f1c18] font-bold">
                  VAKA PUANLARI
                </h3>
                <div className="divide-y divide-[#d6cdbc] border border-[#d6cdbc] rounded-sm bg-[#fffdf8]">
                  {CASE_SCENARIOS.map((sc) => {
                    const stats = data?.ratingsByScenario[sc.id] || { average: 5.0, count: 0 };
                    return (
                      <div key={sc.id} className="px-4 py-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="font-typewriter font-bold text-xs text-[#1f1c18] truncate">
                            {sc.title}
                          </h4>
                          <p className="text-[11px] text-[#575046] truncate">{sc.subtitle}</p>
                        </div>
                        <div className="text-right shrink-0 font-typewriter">
                          <span className="text-xs font-bold text-[#1f1c18] block">
                            ★ {stats.average} / 5
                          </span>
                          <span className="text-[10px] text-[#7c7265]">{stats.count} oy</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Reviews */}
              <div className="space-y-2.5">
                <h3 className="text-[11px] font-typewriter uppercase tracking-[0.16em] text-[#1f1c18] font-bold">
                  SON YORUMLAR ({data?.ratingsList.length || 0})
                </h3>
                {!data?.ratingsList || data.ratingsList.length === 0 ? (
                  <div className="p-6 text-center bg-[#fffdf8] border border-[#d6cdbc] rounded-sm text-xs font-typewriter text-[#7c7265]">
                    Henüz değerlendirme kaydı bulunmuyor.
                  </div>
                ) : (
                  <div className="divide-y divide-[#d6cdbc] border border-[#d6cdbc] rounded-sm bg-[#fffdf8]">
                    {data.ratingsList.map((rate) => {
                      const sc = CASE_SCENARIOS.find((s) => s.id === rate.scenarioId);
                      return (
                        <div key={rate.id} className="p-3.5 space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-typewriter font-bold text-xs text-[#1f1c18]">
                              {rate.userName || 'Anonim Dedektif'}
                            </span>
                            <div className="flex items-center gap-0.5 text-[#1f1c18]">
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <Star
                                  key={idx}
                                  className={`w-3 h-3 ${
                                    idx < rate.rating ? 'fill-current text-[#1f1c18]' : 'text-[#d6cdbc]'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="text-[10px] font-typewriter text-[#7c7265]">
                            {sc?.title || rate.scenarioId} · {new Date(rate.createdAt).toLocaleDateString('tr-TR')}
                          </div>
                          {rate.comment && (
                            <p className="text-xs text-[#575046] italic">&ldquo;{rate.comment}&rdquo;</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ÜYELER */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-[#7c7265] absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    placeholder="İsim, e-posta veya UID ara..."
                    className="w-full pl-9 pr-3 py-2 bg-[#fffdf8] border border-[#c8bfae] rounded-sm text-xs font-typewriter text-[#1f1c18] placeholder-[#9c9284] focus:outline-none focus:border-[#1f1c18]"
                  />
                </div>
                <span className="text-xs font-typewriter text-[#575046]">
                  {filteredUsers.length} üye
                </span>
              </div>

              <div className="border border-[#d6cdbc] rounded-sm overflow-hidden bg-[#fffdf8]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f4efe4] border-b border-[#d6cdbc] text-[#575046] font-typewriter text-[10px] uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Dedektif</th>
                        <th className="py-2.5 px-3">Tür</th>
                        <th className="py-2.5 px-3">E-Posta</th>
                        <th className="py-2.5 px-3">Kayıt</th>
                        <th className="py-2.5 px-3">UID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#d6cdbc]">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-[#7c7265] font-typewriter">
                            Kayıtlı üye bulunamadı.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u, i) => {
                          const isAdminUser =
                            (u.email || '').toLowerCase() === ADMIN_EMAIL.toLowerCase() || u.uid === 'admin_altay_01';
                          const displayName = u.displayName || (isAdminUser ? 'Altay Yiğit Ozan' : 'Dedektif');
                          const roleLabel = isAdminUser
                            ? 'Yönetici'
                            : u.roleTitle || (u.isGuest ? 'Misafir' : 'Üye');

                          return (
                            <tr key={u.uid || i} className="hover:bg-[#faf6ed]">
                              <td className="py-2.5 px-3 font-typewriter font-bold text-[#1f1c18]">
                                {displayName}
                              </td>
                              <td className="py-2.5 px-3">
                                <span
                                  className={`px-1.5 py-0.5 rounded-sm text-[10px] font-typewriter border ${
                                    isAdminUser
                                      ? 'border-[#8b1e1e] text-[#8b1e1e]'
                                      : u.isGuest
                                      ? 'border-[#d6cdbc] text-[#7c7265]'
                                      : 'border-[#276749] text-[#276749]'
                                  }`}
                                >
                                  {roleLabel}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 font-typewriter text-[#575046]">
                                {u.email || (u.isGuest ? 'Misafir oturumu' : '-')}
                              </td>
                              <td className="py-2.5 px-3 font-typewriter text-[#7c7265] text-[11px]">
                                {u.createdAt
                                  ? new Date(u.createdAt).toLocaleDateString('tr-TR', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                    })
                                  : '-'}
                              </td>
                              <td
                                className="py-2.5 px-3 font-typewriter text-[#7c7265] text-[10px] truncate max-w-[140px]"
                                title={u.uid}
                              >
                                {u.uid}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Case Preview Modal */}
      {previewCase && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-[#1f1c18]/65 backdrop-blur-[2px]">
          <div className="bg-[#faf6ed] border border-[#1f1c18] rounded-sm w-full max-w-3xl max-h-[88vh] flex flex-col p-5 sm:p-6 shadow-[0_14px_42px_rgba(31,28,24,0.25)] text-[#1f1c18]">
            <div className="flex items-center justify-between pb-3 border-b border-[#d6cdbc] shrink-0">
              <div className="flex items-center gap-2 font-typewriter text-xs">
                <span className="px-1.5 py-0.5 rounded-sm border border-[#1f1c18] font-bold">
                  ÖNİZLEME
                </span>
                <span className="text-[#7c7265]">id: {previewCase.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewCase(null)}
                className="p-1 text-[#575046] hover:text-[#1f1c18] rounded-sm cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto mt-4 pr-1 space-y-4 text-xs">
              <div>
                <h3 className="font-typewriter font-bold text-base text-[#1f1c18]">
                  {previewCase.title}
                </h3>
                <p className="text-[#575046] mt-0.5">{previewCase.subtitle}</p>
                <p className="text-[#1f1c18] mt-2 leading-relaxed bg-[#fffdf8] p-3 rounded-sm border border-[#d6cdbc]">
                  {previewCase.synopsis}
                </p>
              </div>

              <div className="p-3 bg-[#fffdf8] border border-[#d6cdbc] rounded-sm space-y-1">
                <h5 className="font-typewriter font-bold text-[#1f1c18] uppercase text-[11px]">
                  Maktul
                </h5>
                <p>
                  <strong>{previewCase.victim?.name}</strong> ({previewCase.victim?.age} yaş) · {previewCase.victim?.title}
                </p>
                <p className="text-[#575046]">
                  Olay Yeri: {previewCase.victim?.locationOfBody} · {previewCase.victim?.timeOfDeath}
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-typewriter font-bold text-[#1f1c18] uppercase text-[11px]">
                  Şüpheliler ({previewCase.suspects?.length})
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {previewCase.suspects?.map((s) => (
                    <div key={s.id} className="p-3 bg-[#fffdf8] border border-[#d6cdbc] rounded-sm space-y-1">
                      <div className="flex items-center justify-between">
                        <strong>{s.name}</strong>
                        <span className="text-[10px] font-typewriter text-[#7c7265]">%{s.initialSuspicion}</span>
                      </div>
                      <p className="text-[11px] text-[#575046]">{s.title} · {s.relation}</p>
                      <p className="text-[11px] text-[#575046] italic">&ldquo;{s.alibi}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-[#f4efe4] border border-[#8b1e1e] rounded-sm space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#8b1e1e] font-typewriter font-bold text-[11px] uppercase">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Çözüm (Gizli)</span>
                </div>
                <p>
                  <strong>Katil:</strong> {previewCase.solution?.culpritName}
                </p>
                <p>
                  <strong>Motif:</strong> {previewCase.solution?.motiveTitle}
                </p>
                <p>
                  <strong>Kilit Kanıt:</strong> {previewCase.solution?.keyEvidenceTitle}
                </p>
                <p className="text-[#575046] pt-1 leading-relaxed">{previewCase.solution?.verdictSummary}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#d6cdbc] mt-4 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setPreviewCase(null)}
                className="py-2 px-4 bg-[#1f1c18] hover:bg-[#36312b] text-[#faf6ed] text-xs font-typewriter font-bold rounded-sm cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {caseToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#1f1c18]/65 backdrop-blur-[2px]">
          <div className="bg-[#faf6ed] border border-[#8b1e1e] rounded-sm w-full max-w-md p-6 text-center text-[#1f1c18] shadow-[0_14px_42px_rgba(31,28,24,0.25)] space-y-4">
            <div className="w-10 h-10 rounded-sm bg-[#fffdf8] border border-[#8b1e1e] flex items-center justify-center text-[#8b1e1e] mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>

            <h3 className="font-typewriter font-bold text-base text-[#1f1c18]">
              Vakayı Silmek İstiyor musunuz?
            </h3>
            <p className="text-xs text-[#575046] leading-relaxed">
              <strong className="text-[#1f1c18]">&ldquo;{caseToDelete}&rdquo;</strong> kalıcı olarak Firestore veritabanından silinecektir.
            </p>

            <div className="pt-2 flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setCaseToDelete(null)}
                className="py-2 px-4 bg-[#fffdf8] hover:bg-[#ebe5d8] text-[#1f1c18] border border-[#c8bfae] rounded-sm text-xs font-typewriter cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDeleteCase(caseToDelete)}
                className="py-2 px-4 bg-[#8b1e1e] hover:bg-[#6e1616] text-[#faf6ed] rounded-sm text-xs font-typewriter font-bold cursor-pointer"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
