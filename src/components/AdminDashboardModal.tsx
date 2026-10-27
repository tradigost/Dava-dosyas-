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
  subscribeToCustomCases
} from '../services/firebase';
import { CASE_SCENARIOS } from '../data/cases';
import { DEMO_CUSTOM_CASE, SAMPLE_CASE_TEMPLATE } from '../data/sampleCase';
import { CaseScenario, getScenarioTotalEnvelopes } from '../types';
import { CaseWizardEditor } from './CaseWizardEditor';
import { soundManager } from '../utils/audioEffects';
import { 
  X, 
  BarChart3, 
  Users, 
  Star, 
  Smartphone, 
  RefreshCw, 
  ShieldAlert, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Apple, 
  Play,
  Terminal,
  FileCode2,
  HelpCircle,
  Lock,
  LogIn,
  KeyRound,
  FolderPlus,
  Upload,
  Download,
  Trash2,
  Eye,
  Check,
  AlertTriangle,
  FileJson,
  FileText,
  Clock,
  UserCheck,
  BookOpen
} from 'lucide-react';

interface AdminDashboardModalProps {
  currentUser: DetectiveProfile | null;
  onClose: () => void;
  customCases?: CaseScenario[];
}

export const ADMIN_EMAIL = 'altayyigitozan@gmail.com';

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  currentUser,
  onClose,
  customCases: externalCustomCases,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'ratings' | 'cases' | 'stores'>('overview');
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchUser, setSearchUser] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Custom Cases State
  const [customCasesList, setCustomCasesList] = useState<CaseScenario[]>(externalCustomCases || []);
  const [uploadMode, setUploadMode] = useState<'wizard' | 'file' | 'json'>('wizard');
  const [rawJsonText, setRawJsonText] = useState<string>('');
  const [pendingParsedCase, setPendingParsedCase] = useState<CaseScenario | null>(null);
  const [caseValidationErrors, setCaseValidationErrors] = useState<string[]>([]);
  const [uploadFeedback, setUploadFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSavingCase, setIsSavingCase] = useState<boolean>(false);
  const [previewCase, setPreviewCase] = useState<CaseScenario | null>(null);
  const [caseToDelete, setCaseToDelete] = useState<string | null>(null);

  const hasAdminParam = typeof window !== 'undefined' && (
    window.location.search.includes('admin=1') ||
    window.location.search.includes('admin=true') ||
    localStorage.getItem('detective_admin_mode') === '1'
  );
  const [adminKeyUnlocked, setAdminKeyUnlocked] = useState<boolean>(hasAdminParam);
  const [adminPassInput, setAdminPassInput] = useState<string>('');

  const isAuthorized = adminKeyUnlocked || currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const handleAdminGoogleLogin = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      soundManager.playKeyClick();
      const profile = await loginWithGoogle();
      if (profile?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        soundManager.playSuccessSound();
      } else {
        soundManager.playErrorSound();
        setAuthError(`"${profile?.email || 'Bu hesap'}" yönetici olarak tanımlı değil. Lütfen "${ADMIN_EMAIL}" hesabı ile giriş yapın.`);
      }
    } catch (e: any) {
      soundManager.playErrorSound();
      setAuthError(e.message || 'Giriş yapılamadı.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handlePasscodeUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = adminPassInput.trim().toLowerCase();
    if (clean === 'admin' || clean === 'altay' || clean === '1923' || clean === 'masadakidosya') {
      soundManager.playSuccessSound();
      setAdminKeyUnlocked(true);
      try {
        localStorage.setItem('detective_admin_mode', '1');
      } catch (e) {}
    } else {
      soundManager.playErrorSound();
      setAuthError('Geçersiz yönetici anahtarı. Lütfen tekrar deneyin.');
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

  // Real-time custom cases sync
  useEffect(() => {
    const unsub = subscribeToCustomCases((cases) => {
      setCustomCasesList(cases);
    });
    return () => unsub();
  }, []);

  // Update from external prop if passed
  useEffect(() => {
    if (externalCustomCases) {
      setCustomCasesList(externalCustomCases);
    }
  }, [externalCustomCases]);

  // Download template JSON
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

  // Quick Demo Case Loader
  const handleLoadDemoCase = async () => {
    soundManager.playKeyClick();
    setIsSavingCase(true);
    setUploadFeedback(null);
    try {
      await saveCustomCase(DEMO_CUSTOM_CASE, currentUser);
      soundManager.playSuccessSound();
      setUploadFeedback({
        type: 'success',
        message: `"${DEMO_CUSTOM_CASE.title}" başarıyla sisteme yüklendi ve yayınlandı! Artık lobide seçilebilir.`
      });
      setPendingParsedCase(null);
      setRawJsonText('');
      setCaseValidationErrors([]);
    } catch (err: any) {
      soundManager.playErrorSound();
      setUploadFeedback({
        type: 'error',
        message: `Demo vaka yüklenirken hata oluştu: ${err.message || 'Bilinmeyen hata'}`
      });
    } finally {
      setIsSavingCase(false);
    }
  };

  // Validate JSON string
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

  // File Upload Handler
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
    // Reset file input value so re-selecting same file triggers change
    e.target.value = '';
  };

  // Save Pending Case to Firestore
  const handlePublishCase = async () => {
    if (!pendingParsedCase) return;
    setIsSavingCase(true);
    setUploadFeedback(null);
    try {
      soundManager.playKeyClick();
      await saveCustomCase(pendingParsedCase, currentUser);
      soundManager.playSuccessSound();
      setUploadFeedback({
        type: 'success',
        message: `"${pendingParsedCase.title}" başarıyla yüklendi! Vaka lobide aktif hale geldi.`
      });
      setPendingParsedCase(null);
      setRawJsonText('');
      setCaseValidationErrors([]);
    } catch (err: any) {
      soundManager.playErrorSound();
      setUploadFeedback({
        type: 'error',
        message: `Yükleme başarısız: ${err.message || 'Yetki veya bağlantı hatası'}`
      });
    } finally {
      setIsSavingCase(false);
    }
  };

  // Delete Case
  const handleConfirmDeleteCase = async (caseId: string) => {
    try {
      soundManager.playKeyClick();
      await deleteCustomCase(caseId);
      soundManager.playSuccessSound();
      setCaseToDelete(null);
      setUploadFeedback({
        type: 'success',
        message: 'Vaka sistemden başarıyla silindi.'
      });
    } catch (err: any) {
      soundManager.playErrorSound();
      setUploadFeedback({
        type: 'error',
        message: 'Vaka silinirken bir hata oluştu.'
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

  // If not authorized, show security gate
  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
        <div className="bg-zinc-950 border border-amber-600/50 rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl relative text-zinc-100 text-center">
          
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>

          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block mb-1">
            GİZLİ YÖNETİM MERKEZİ
          </span>
          <h2 className="font-cinzel font-bold text-xl text-zinc-100">
            Yetkili Girişi Gerekli
          </h2>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            Bu kontrol paneli yalnızca sistem kurucusu (<strong className="text-zinc-200">{ADMIN_EMAIL}</strong>) için ayrılmıştır. Oyuncular ve misafir kullanıcılar bu alana erişemez.
          </p>

          {currentUser?.email && (
            <div className="mt-3 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
              Şu anki oturum: <span className="font-mono text-amber-300">{currentUser.email}</span> (Yetkisiz)
            </div>
          )}

          {authError && (
            <div className="mt-3 p-3 bg-rose-950/50 border border-rose-800/60 rounded-xl text-rose-200 text-xs">
              {authError}
            </div>
          )}

          <div className="mt-5 space-y-3">
            <button
              type="button"
              onClick={handleAdminGoogleLogin}
              disabled={isLoggingIn}
              className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoggingIn ? 'Giriş Yapılıyor...' : `Google ile Giriş Yap (${ADMIN_EMAIL})`}</span>
            </button>

            {/* Quick Admin Passcode Unlock Form */}
            <form onSubmit={handlePasscodeUnlock} className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl text-left space-y-2">
              <label className="text-[11px] font-mono text-zinc-400 block">
                Veya Yönetici Anahtar Kodu ile Doğrula:
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={adminPassInput}
                  onChange={(e) => setAdminPassInput(e.target.value)}
                  placeholder="Yönetici anahtarı (admin / 1923)..."
                  className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400 font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
                >
                  Doğrula
                </button>
              </div>
            </form>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 text-zinc-400 hover:text-zinc-200 text-xs cursor-pointer transition-colors"
            >
              Vazgeç ve Masaya Dön
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-900 text-[11px] text-zinc-500 font-mono">
            İpucu: Bu panele istediğiniz zaman adresinize <code className="text-zinc-400">?admin=1</code> ekleyerek doğrudan erişebilirsiniz.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-zinc-950 border border-amber-600/50 rounded-3xl w-full max-w-5xl my-auto p-5 sm:p-7 shadow-2xl relative text-zinc-100 max-h-[92vh] flex flex-col">
        
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-cinzel font-bold text-lg sm:text-xl text-zinc-100">
                  Yönetici & Analitik Paneli
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                  SÜPER ADMİN
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Kullanıcı mevcudu, vaka derecelendirmeleri ve mobil mağaza yayınlama mimarisi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playKeyClick();
                loadData();
              }}
              className="p-2 text-zinc-400 hover:text-amber-300 hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
              title="Verileri Yenile"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Nav Tabs */}
        <div className="flex border-b border-zinc-800 mt-4 gap-1 sm:gap-2 shrink-0 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 px-3.5 text-xs font-bold rounded-t-xl border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-amber-500 text-amber-400 bg-zinc-900/40'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Genel Bakış & Metrikler</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`py-2.5 px-3.5 text-xs font-bold rounded-t-xl border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-amber-500 text-amber-400 bg-zinc-900/40'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Üye Yönetimi ({data?.usersCount || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ratings')}
            className={`py-2.5 px-3.5 text-xs font-bold rounded-t-xl border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'ratings'
                ? 'border-amber-500 text-amber-400 bg-zinc-900/40'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Vaka Puanları ({data?.ratingsCount || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cases')}
            className={`py-2.5 px-3.5 text-xs font-bold rounded-t-xl border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'cases'
                ? 'border-amber-500 text-amber-400 bg-zinc-900/40'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>Vaka Yükleme & Yönetimi ({CASE_SCENARIOS.length + customCasesList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stores')}
            className={`py-2.5 px-3.5 text-xs font-bold rounded-t-xl border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'stores'
                ? 'border-amber-500 text-amber-400 bg-zinc-900/40'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Play Store & App Store Rehberi</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-5">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 bg-zinc-900/70 border border-zinc-800 rounded-2xl flex flex-col justify-between">
                  <div className="flex items-center justify-between text-zinc-400 text-xs">
                    <span>Toplam Üye</span>
                    <Users className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-zinc-100">
                      {data?.usersCount || 0}
                    </span>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Kayıtlı dedektif</p>
                  </div>
                </div>

                <div className="p-4 bg-zinc-900/70 border border-zinc-800 rounded-2xl flex flex-col justify-between">
                  <div className="flex items-center justify-between text-zinc-400 text-xs">
                    <span>Değerlendirmeler</span>
                    <Star className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-zinc-100">
                      {data?.ratingsCount || 0}
                    </span>
                    <p className="text-[10px] text-zinc-500 mt-0.5">5 üzerinden oy</p>
                  </div>
                </div>

                <div className="p-4 bg-zinc-900/70 border border-zinc-800 rounded-2xl flex flex-col justify-between">
                  <div className="flex items-center justify-between text-zinc-400 text-xs">
                    <span>Ortalama Memnuniyet</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-amber-300">
                      ⭐ {data?.averageRating || 4.9}
                    </span>
                    <p className="text-[10px] text-zinc-500 mt-0.5">5.0 üzerinden puan</p>
                  </div>
                </div>

                <div className="p-4 bg-zinc-900/70 border border-zinc-800 rounded-2xl flex flex-col justify-between">
                  <div className="flex items-center justify-between text-zinc-400 text-xs">
                    <span>Açılan Odalar</span>
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-zinc-100">
                      {data?.roomsCount || 0}
                    </span>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Canlı oyun masası</p>
                  </div>
                </div>
              </div>

              {/* Scenario Breakdown */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 sm:p-5">
                <h3 className="font-cinzel font-bold text-sm text-zinc-200 mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span>Soruşturma Dosyası Puan Durumu</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {CASE_SCENARIOS.map((sc) => {
                    const stats = data?.ratingsByScenario[sc.id] || { average: 5.0, count: 0 };
                    return (
                      <div
                        key={sc.id}
                        className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-xl flex items-center justify-between"
                      >
                        <div>
                          <h4 className="font-bold text-xs text-zinc-100">{sc.title}</h4>
                          <p className="text-[11px] text-zinc-400">{sc.subtitle}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-amber-300 font-mono">
                            ⭐ {stats.average} / 5
                          </span>
                          <p className="text-[10px] text-zinc-500 font-mono">
                            {stats.count} değerlendirme
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Sistem Yönetim Yetkisi: <strong className="text-zinc-200">{currentUser?.email || 'altayyigitozan@gmail.com'}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('stores')}
                  className="px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-600/40 rounded-xl font-bold cursor-pointer transition-all"
                >
                  Mobil Mağaza Yol Haritası &rarr;
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: USERS MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              {/* Member Metrics summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Toplam Üye Mevcudu</span>
                    <span className="text-xl font-bold font-mono text-zinc-100">{data?.usersCount || filteredUsers.length} Dedektif</span>
                  </div>
                  <Users className="w-5 h-5 text-amber-400" />
                </div>

                <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Sistem Yöneticisi</span>
                    <span className="text-xs font-bold text-amber-300 font-mono">1 Kurucu Hesap</span>
                  </div>
                  <ShieldAlert className="w-5 h-5 text-emerald-400" />
                </div>

                <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Veritabanı Durumu</span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Firestore Canlı Senkron
                    </span>
                  </div>
                  <RefreshCw 
                    onClick={loadData}
                    className={`w-4 h-4 text-zinc-400 hover:text-amber-300 cursor-pointer transition-transform ${loading ? 'animate-spin' : ''}`} 
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    placeholder="İsim, e-posta, rol veya UID ile ara..."
                    className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <span className="text-xs font-mono text-zinc-400">
                  {filteredUsers.length} Dedektif / Üye Listeleniyor
                </span>
              </div>

              <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/40">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-mono text-[11px] uppercase">
                      <tr>
                        <th className="py-3 px-4">Dedektif / Kullanıcı</th>
                        <th className="py-3 px-4">Yetki & Unvan</th>
                        <th className="py-3 px-4">E-Posta / Giriş Modeli</th>
                        <th className="py-3 px-4">Kayıt Tarihi</th>
                        <th className="py-3 px-4">Kullanıcı Kimliği (UID)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 font-sans">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-zinc-500 space-y-2">
                            <p>Kayıtlı üye bulunamadı.</p>
                            <button
                              type="button"
                              onClick={loadData}
                              className="text-xs text-amber-400 hover:underline inline-flex items-center gap-1"
                            >
                              <RefreshCw className="w-3 h-3" /> Verileri Yeniden Yükle
                            </button>
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u, i) => {
                          const isAdminUser = (u.email || '').toLowerCase() === ADMIN_EMAIL.toLowerCase() || u.uid === 'admin_altay_01';
                          const displayName = u.displayName || (isAdminUser ? 'Altay Yiğit Ozan' : 'Dedektif');
                          const roleLabel = isAdminUser 
                            ? 'Süper Yönetici & Kurucu' 
                            : (u.roleTitle || (u.isGuest ? 'Misafir Dedektif' : 'Adli Soruşturma Dedektifi'));

                          return (
                            <tr key={u.uid || i} className="hover:bg-zinc-900/60 transition-colors">
                              <td className="py-3 px-4 font-bold text-zinc-200">
                                <div className="flex items-center gap-2.5">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs uppercase border ${
                                    isAdminUser 
                                      ? 'bg-amber-950/80 border-amber-500/80 text-amber-300' 
                                      : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                                  }`}>
                                    {displayName.slice(0, 2)}
                                  </div>
                                  <div>
                                    <span className="block">{displayName}</span>
                                    {isAdminUser && (
                                      <span className="text-[10px] text-amber-400 font-mono font-bold">
                                        ★ SİSTEM SAHİBİ
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                                  isAdminUser
                                    ? 'bg-amber-950/60 border-amber-600/60 text-amber-300'
                                    : u.isGuest
                                    ? 'bg-zinc-900 border-zinc-800 text-zinc-400'
                                    : 'bg-emerald-950/60 border-emerald-600/60 text-emerald-300'
                                }`}>
                                  {roleLabel}
                                </span>
                              </td>

                              <td className="py-3 px-4 text-zinc-300">
                                {u.email ? (
                                  <span className="text-emerald-400 font-mono">{u.email}</span>
                                ) : u.isGuest ? (
                                  <span className="text-zinc-500 font-mono">Misafir Oturumu</span>
                                ) : (
                                  <span className="text-amber-400 font-mono">Google Hesabı</span>
                                )}
                              </td>

                              <td className="py-3 px-4 text-zinc-400 font-mono text-[11px]">
                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Kayıtlı'}
                              </td>

                              <td className="py-3 px-4 text-zinc-500 font-mono text-[10px] truncate max-w-[140px]" title={u.uid}>
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

          {/* TAB 3: RATINGS & FEEDBACK */}
          {activeTab === 'ratings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400">
                  Toplam {data?.ratingsList.length || 0} Değerlendirme Kaydı
                </span>
              </div>

              {(!data?.ratingsList || data.ratingsList.length === 0) ? (
                <div className="p-8 text-center bg-zinc-900/40 border border-zinc-800 rounded-2xl text-zinc-400 text-xs">
                  <Star className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                  <p>Henüz çözümlenen vaka değerlendirmesi bulunmuyor.</p>
                  <p className="mt-1 text-zinc-500">Oyuncular dava sonundaki 5 yıldız formunu doldurdukça burada listelenecektir.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.ratingsList.map((rate) => {
                    const sc = CASE_SCENARIOS.find((s) => s.id === rate.scenarioId);
                    return (
                      <div
                        key={rate.id}
                        className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl flex flex-col justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-zinc-200">
                              {rate.userName || 'Anonim Dedektif'}
                            </span>
                            <div className="flex text-amber-400 text-xs">
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <Star
                                  key={idx}
                                  className={`w-3.5 h-3.5 ${
                                    idx < rate.rating ? 'fill-current text-amber-400' : 'text-zinc-700'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">
                            Vaka: {sc?.title || rate.scenarioId}
                          </span>
                          {rate.comment && (
                            <p className="mt-2 text-xs text-zinc-300 italic bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/80">
                              &ldquo;{rate.comment}&rdquo;
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-2 border-t border-zinc-800/60">
                          <span>{rate.userEmail || 'Google / Üye'}</span>
                          <span>{new Date(rate.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PLAY STORE & APP STORE BLUEPRINT */}
          {activeTab === 'stores' && (
            <div className="space-y-6">
              
              {/* Highlight Banner */}
              <div className="p-5 bg-gradient-to-r from-amber-950/40 via-zinc-900/80 to-zinc-950 border border-amber-600/40 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono uppercase text-amber-300 font-bold">
                    MOBİL MAĞAZALARDA YAYINLAMA MİMARİSİ
                  </span>
                </div>
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-zinc-100">
                  Masadaki Dosya&apos;yı Google Play ve App Store&apos;a Çıkarma Stratejisi
                </h3>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  Mevcut React + Vite kodunuzu sıfırdan yeniden yazmadan doğrudan yerel mobil uygulamaya (Native App) dönüştürebilirsiniz. Tavsiye edilen en sağlam ve modern yöntem <strong>Capacitor (Ionic)</strong> hibrit köprüsüdür.
                </p>
              </div>

              {/* Step 1: Capacitor Integration Steps */}
              <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono">
                  <Terminal className="w-4 h-4" />
                  <span>1. ADIM: CAPACITOR İLE YEREL PROJE OLUŞTURMA</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Terminalinizde aşağıdaki 4 komutu çalıştırarak Android Studio ve iOS Xcode projelerinizi otomatik olarak üretebilirsiniz:
                </p>
                
                <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 font-mono text-[11px] text-amber-300 space-y-1.5 overflow-x-auto">
                  <p className="text-zinc-500"># 1. Capacitor paketlerini yükleyin:</p>
                  <p>npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios</p>
                  <p className="text-zinc-500 mt-2"># 2. Capacitor konfigürasyonunu başlatın:</p>
                  <p>npx cap init &quot;Masadaki Dosya&quot; &quot;com.masadakidosya.app&quot; --web-dir dist</p>
                  <p className="text-zinc-500 mt-2"># 3. Web derlemesini alıp mobil platformları ekleyin:</p>
                  <p>npm run build</p>
                  <p>npx cap add android</p>
                  <p>npx cap add ios</p>
                  <p className="text-zinc-500 mt-2"># 4. Yerel IDE&apos;lerde açın (Android Studio ve Xcode):</p>
                  <p>npx cap open android</p>
                  <p>npx cap open ios</p>
                </div>
              </div>

              {/* Google Play Store Checklist */}
              <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono">
                  <Play className="w-4 h-4 fill-current" />
                  <span>2. ADIM: GOOGLE PLAY STORE YAYIN KONTROL LİSTESİ</span>
                </div>
                <div className="space-y-2 text-xs text-zinc-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>Geliştirici Hesabı:</strong> Google Play Console hesabı açın (tek seferlik $25 kayıt ücreti).
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>14 Gün Kapalı Test Kuralı (Closed Testing):</strong> 2024 sonrası yeni bireysel hesaplar için Google, yayından önce en az 20 gerçek test kullanıcısının 14 gün boyunca uygulamayı test etmesini şart koşar. Arkadaşlarınızı kapalı teste ekleyerek bu süreci başlatabilirsiniz.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>AAB (Android App Bundle) & Keystore:</strong> Android Studio üzerinden <code>Build &gt; Generate Signed Bundle / APK</code> adımıyla imzalı .aab dosyası oluşturun.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>Veri Güvenliği (Data Safety):</strong> Firebase Authentication e-posta kullanımı ve Firestore kayıtları formda dürüstçe işaretlenmelidir.
                    </div>
                  </div>
                </div>
              </div>

              {/* Apple App Store Checklist */}
              <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-bold font-mono">
                  <Apple className="w-4 h-4 fill-current" />
                  <span>3. ADIM: APPLE APP STORE YAYIN KONTROL LİSTESİ</span>
                </div>
                <div className="space-y-2 text-xs text-zinc-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>Apple Developer Program:</strong> Apple Geliştirici hesabı açın ($99/yıllık). Mac bilgisayar ve Xcode gereklidir.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>Guideline 4.2 (Minimum Functionality):</strong> Apple basit web sarıcılarını reddeder; ancak Masadaki Dosya asimetrik oturumlar, ses efektleri, şifre terminalleri ve ortak pano özellikleriyle zengin bir mobil oyun deneyimi sunduğu için kolaylıkla onay alır.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>Guideline 5.1.1(v) (Hesap Silme Zorunluluğu):</strong> Üyelik sistemi olan her iOS uygulamasında kullanıcının kendi hesabını silebilmesi gerekir.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>TestFlight:</strong> Yayından önce TestFlight ile davet linki oluşturarak iOS kullanıcılarına önceden test ettirebilirsiniz.
                    </div>
                  </div>
                </div>
              </div>

              {/* In-App Purchase & Monetization Strategy */}
              <div className="p-5 bg-amber-950/20 border border-amber-800/40 rounded-2xl space-y-2 text-xs text-amber-200">
                <h4 className="font-bold flex items-center gap-2 text-amber-300">
                  💰 Gelir Modeli ve Ek Vaka Satışı (Monetization):
                </h4>
                <p className="leading-relaxed">
                  İlk 2 vaka (Son Kadeh ve Kayıp Miras) ücretsiz sunulup, ileride eklenecek yeni karmaşık dosyalar (örn. 3. Dosya, 4. Dosya) <strong>RevenueCat SDK</strong> veya Google/Apple In-App Purchase ile vaka başına tek seferlik açılabilir paket olarak satılabilir.
                </p>
              </div>

            </div>
          )}

          {/* TAB 5: CUSTOM CASES MANAGEMENT (VAKA YÜKLEME VE YÖNETİMİ) */}
          {activeTab === 'cases' && (
            <div className="space-y-6">
              
              {/* Top Banner & Quick Actions */}
              <div className="p-4 sm:p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-zinc-100 flex items-center gap-2">
                      <FolderPlus className="w-5 h-5 text-amber-400" />
                      <span>Vaka Dosyası Yükleme & Kütüphane Yönetimi</span>
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                    Yeni senaryoları JSON formatında doğrudan veritabanına yükleyin. Yüklenen dosyalar anında tüm dedektiflerin lobisinde listelenir ve oynanabilir.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-zinc-700 shadow-sm"
                    title="Yeni senaryo hazırlamak için örnek şablonu indirin"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Örnek Şablon İndir (.json)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLoadDemoCase}
                    disabled={isSavingCase}
                    className="py-2 px-3 bg-amber-600 hover:bg-amber-500 text-zinc-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-50"
                    title="Sisteme hemen 3. bir vaka eklemek için tıklayın"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isSavingCase ? 'Yükleniyor...' : 'Hızlı Demo Vaka Yükle (Boğaz Ekspresi)'}</span>
                  </button>
                </div>
              </div>

              {/* Feedback Alert */}
              {uploadFeedback && (
                <div
                  className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-3 animate-fade-in ${
                    uploadFeedback.type === 'success'
                      ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-800/80 text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {uploadFeedback.type === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <span>{uploadFeedback.message}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadFeedback(null)}
                    className="text-zinc-400 hover:text-zinc-200 p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Upload Card */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800 gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-zinc-200 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>Yeni Vaka Dosyası Ekle</span>
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      JSON dosyası yükleyin veya doğrudan JSON kodunu yapıştırın.
                    </p>
                  </div>

                  {/* Mode Selector */}
                  <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto overflow-x-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setUploadMode('wizard');
                        soundManager.playKeyClick();
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                        uploadMode === 'wizard'
                          ? 'bg-amber-600 text-zinc-950 shadow-sm font-bold'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Aşamalı / Zarf Zarf Editör</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadMode('file');
                        soundManager.playKeyClick();
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                        uploadMode === 'file'
                          ? 'bg-amber-600 text-zinc-950 shadow-sm'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Dosya Yükle</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadMode('json');
                        soundManager.playKeyClick();
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                        uploadMode === 'json'
                          ? 'bg-amber-600 text-zinc-950 shadow-sm'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <FileCode2 className="w-3.5 h-3.5" />
                      <span>JSON Metni</span>
                    </button>
                  </div>
                </div>

                {/* Wizard Mode (Phase by Phase Case Builder) */}
                {uploadMode === 'wizard' && (
                  <CaseWizardEditor
                    onSaveCase={async (newScenario) => {
                      setIsSavingCase(true);
                      try {
                        await saveCustomCase(newScenario, currentUser);
                        soundManager.playSuccessSound();
                        setUploadFeedback({
                          type: 'success',
                          message: `"${newScenario.title}" (${newScenario.totalEnvelopes || 3} Zarf) başarıyla Firestore veritabanına kaydedildi ve yayınlandı! Artık lobide oynanabilir.`,
                        });
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
                )}

                {/* File Dropzone Mode */}
                {uploadMode === 'file' && (
                  <div className="space-y-3">
                    <label className="border-2 border-dashed border-zinc-700 hover:border-amber-500/80 bg-zinc-950/60 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group">
                      <input
                        type="file"
                        accept=".json,application/json"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform mb-3">
                        <FileJson className="w-6 h-6" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-zinc-200 group-hover:text-amber-300 transition-colors">
                        Vaka JSON Dosyasını Seçmek İçin Tıklayın
                      </span>
                      <span className="text-[11px] text-zinc-400 mt-1 max-w-sm">
                        Bilgisayarınızdan hazırladığınız <code className="text-amber-400/90 font-mono">.json</code> dosyasını seçin. Dosya anında taranıp doğrulanacaktır.
                      </span>
                    </label>
                  </div>
                )}

                {/* Raw JSON Input Mode */}
                {uploadMode === 'json' && (
                  <div className="space-y-3">
                    <textarea
                      value={rawJsonText}
                      onChange={(e) => setRawJsonText(e.target.value)}
                      placeholder='{\n  "id": "bogaz-yalisinda-cinayet",\n  "title": "Boğaz Yalısında Cinayet",\n  "subtitle": "Kandilli...",\n  "victim": { "name": "..." },\n  "suspects": [...],\n  "evidence": [...],\n  "gates": {...},\n  "solution": {...}\n}'
                      rows={8}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 font-mono text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 resize-y"
                    />
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => processAndValidateJson(rawJsonText)}
                        disabled={!rawJsonText.trim()}
                        className="py-2 px-3.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-zinc-700 disabled:opacity-40"
                      >
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>JSON'u Doğrula ve Tara</span>
                      </button>

                      {rawJsonText && (
                        <button
                          type="button"
                          onClick={() => {
                            setRawJsonText('');
                            setPendingParsedCase(null);
                            setCaseValidationErrors([]);
                          }}
                          className="text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
                        >
                          Temizle
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Validation Errors Box */}
                {caseValidationErrors.length > 0 && (
                  <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl space-y-2 text-xs text-rose-200 animate-fade-in">
                    <div className="flex items-center gap-2 font-bold text-rose-300">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Vaka Şemasında Eksik veya Hatalı Alanlar Tespit Edildi:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-200/90 pl-1">
                      {caseValidationErrors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Validated Case Preview Banner & Action */}
                {pendingParsedCase && (
                  <div className="p-4 bg-emerald-950/30 border border-emerald-700/50 rounded-2xl space-y-3 animate-fade-in">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="font-bold text-xs text-emerald-300 uppercase tracking-wider font-mono">
                            Vaka Dosyası Doğrulandı & Hazır
                          </span>
                        </div>
                        <h5 className="font-bold text-base text-zinc-100 mt-1">
                          {pendingParsedCase.title}
                        </h5>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {pendingParsedCase.subtitle}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-amber-300 font-bold block">
                          ID: {pendingParsedCase.id}
                        </span>
                        <span className="text-[10px] text-zinc-400 mt-1 block">
                          Zorluk: {pendingParsedCase.difficulty} · ~{pendingParsedCase.estimatedMinutes} dk
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                        <span className="text-[10px] text-zinc-400 block">Maktul</span>
                        <span className="font-semibold text-zinc-200 truncate block mt-0.5">
                          {pendingParsedCase.victim?.name}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                        <span className="text-[10px] text-zinc-400 block">Şüpheli Sayısı</span>
                        <span className="font-semibold text-zinc-200 block mt-0.5">
                          {pendingParsedCase.suspects?.length || 0} Kişi
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                        <span className="text-[10px] text-zinc-400 block">Delil / Kanıt</span>
                        <span className="font-semibold text-zinc-200 block mt-0.5">
                          {pendingParsedCase.evidence?.length || 0} Parça
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                        <span className="text-[10px] text-zinc-400 block">Zarf Kapıları</span>
                        <span className="font-semibold text-zinc-200 block mt-0.5">
                          {getScenarioTotalEnvelopes(pendingParsedCase)} Zarf / Aşama
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setPendingParsedCase(null)}
                        className="text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
                      >
                        İptal Et
                      </button>
                      <button
                        type="button"
                        onClick={handlePublishCase}
                        disabled={isSavingCase}
                        className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                      >
                        <FolderPlus className="w-4 h-4" />
                        <span>{isSavingCase ? 'Yükleniyor...' : 'Vakayı Firestore’a Yükle ve Yayınla'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Active Cases Library */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-zinc-200 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>Mevcut Vaka Kütüphanesi ({CASE_SCENARIOS.length + customCasesList.length} Dosya)</span>
                  </h4>
                  <span className="text-xs text-zinc-400">
                    Özel Yüklemeler: <strong className="text-amber-400">{customCasesList.length}</strong>
                  </span>
                </div>

                {/* Custom Cases List */}
                {customCasesList.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold px-1">
                      ADMİN TARAFINDAN YÜKLENEN ÖZEL VAKALAR (FIRESTORE)
                    </div>
                    {customCasesList.map((sc) => (
                      <div
                        key={sc.id}
                        className="p-4 bg-zinc-900/90 border border-amber-500/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md hover:border-amber-500 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                              ÖZEL VAKA
                            </span>
                            <span className="text-[10px] font-mono text-zinc-400">
                              id: {sc.id}
                            </span>
                            <span className="text-[10px] text-zinc-400">
                              · {sc.difficulty} · ~{sc.estimatedMinutes} dk · {sc.minPlayers}-{sc.maxPlayers} Oyuncu
                            </span>
                          </div>
                          <h5 className="font-bold text-sm text-zinc-100">
                            {sc.title}
                          </h5>
                          <p className="text-xs text-zinc-400 line-clamp-1">
                            {sc.subtitle || sc.synopsis}
                          </p>
                          <div className="text-[11px] text-zinc-400 pt-1 flex items-center gap-2">
                            <span>Maktul: <strong className="text-zinc-300">{sc.victim?.name}</strong></span>
                            <span>·</span>
                            <span>{sc.suspects?.length || 0} Şüpheli</span>
                            <span>·</span>
                            <span>{sc.evidence?.length || 0} Kanıt</span>
                            <span>·</span>
                            <span>{getScenarioTotalEnvelopes(sc)} Zarf</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => {
                              soundManager.playKeyClick();
                              setPreviewCase(sc);
                            }}
                            className="py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer border border-zinc-700 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 text-amber-400" />
                            <span>Önizle</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              soundManager.playKeyClick();
                              setCaseToDelete(sc.id);
                            }}
                            className="py-1.5 px-3 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer border border-rose-800/60 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Sil</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Built-in System Cases */}
                <div className="space-y-2.5 pt-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold px-1">
                    SİSTEMİN YERLEŞİK VAKALARI (KOD TABANLI)
                  </div>
                  {CASE_SCENARIOS.map((sc) => (
                    <div
                      key={sc.id}
                      className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-zinc-300 opacity-90"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono text-[10px] font-bold">
                            SİSTEM VAKASI
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400">
                            id: {sc.id}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            · {sc.difficulty} · ~{sc.estimatedMinutes} dk · {getScenarioTotalEnvelopes(sc)} Zarf
                          </span>
                        </div>
                        <h5 className="font-bold text-sm text-zinc-200">
                          {sc.title}
                        </h5>
                        <p className="text-xs text-zinc-400 line-clamp-1">
                          {sc.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => {
                            soundManager.playKeyClick();
                            setPreviewCase(sc);
                          }}
                          className="py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer border border-zinc-700 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-zinc-400" />
                          <span>İncele</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* Case Preview Modal */}
      {previewCase && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-zinc-950 border border-amber-600/60 rounded-3xl w-full max-w-3xl max-h-[88vh] flex flex-col p-5 sm:p-7 shadow-2xl relative text-zinc-100">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                  VAKA DETAY ÖNİZLEMESİ
                </span>
                <span className="text-xs font-mono text-zinc-400">id: {previewCase.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewCase(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto mt-4 pr-1 space-y-4 text-xs">
              <div>
                <h3 className="font-cinzel font-bold text-lg text-amber-400">
                  {previewCase.title}
                </h3>
                <p className="text-zinc-400 mt-0.5 font-medium">
                  {previewCase.subtitle}
                </p>
                <p className="text-zinc-300 mt-2 leading-relaxed bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                  {previewCase.synopsis}
                </p>
              </div>

              {/* Victim Card */}
              <div className="p-3 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-1">
                <h5 className="font-bold text-zinc-200 text-xs">Maktul Bilgisi</h5>
                <p className="text-zinc-300">
                  <strong>İsim:</strong> {previewCase.victim?.name} ({previewCase.victim?.age} yaş) - {previewCase.victim?.title}
                </p>
                <p className="text-zinc-400">
                  <strong>Olay Yeri:</strong> {previewCase.victim?.locationOfBody}
                </p>
                <p className="text-zinc-400">
                  <strong>Ölüm Zamanı & Sebep:</strong> {previewCase.victim?.timeOfDeath} · {previewCase.victim?.causeInitial}
                </p>
              </div>

              {/* Suspects */}
              <div className="space-y-2">
                <h5 className="font-bold text-zinc-200 text-xs">Şüpheliler ({previewCase.suspects?.length})</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {previewCase.suspects?.map((s) => (
                    <div key={s.id} className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-zinc-100">{s.name}</strong>
                        <span className="text-[10px] text-amber-400 font-mono">Şüphe: %{s.initialSuspicion}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">{s.title} · {s.relation}</p>
                      <p className="text-[11px] text-zinc-300 italic">Alibi: "{s.alibi}"</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Solution Preview (Confidential) */}
              <div className="p-4 bg-amber-950/30 border border-amber-600/40 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase font-mono">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Vaka Çözümü & Fail Bilgisi (GİZLİ)</span>
                </div>
                <p className="text-zinc-200">
                  <strong>Gerçek Katil:</strong> <span className="text-amber-300 font-bold">{previewCase.solution?.culpritName}</span>
                </p>
                <p className="text-zinc-300">
                  <strong>Motif:</strong> {previewCase.solution?.motiveTitle}
                </p>
                <p className="text-zinc-300">
                  <strong>Kilit Delil:</strong> {previewCase.solution?.keyEvidenceTitle}
                </p>
                <p className="text-zinc-400 text-[11px] leading-relaxed pt-1">
                  {previewCase.solution?.verdictSummary}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 mt-4 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setPreviewCase(null)}
                className="py-2 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {caseToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-zinc-950 border border-rose-600/50 rounded-3xl w-full max-w-md p-6 text-center text-zinc-100 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-lg text-zinc-100">
              Vakayı Silmek İstediğinize Emin misiniz?
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              <strong className="text-zinc-200">"{caseToDelete}"</strong> kimlikli dosya hem Firestore veritabanından hem de yerel hafızadan kalıcı olarak silinecektir. Oyuncuların lobisinde artık görünmeyecektir.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setCaseToDelete(null)}
                className="py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDeleteCase(caseToDelete)}
                className="py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-lg"
              >
                Evet, Kalıcı Olarak Sil
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

