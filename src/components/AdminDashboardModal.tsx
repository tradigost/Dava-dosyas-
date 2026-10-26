/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  AdminDashboardData, 
  fetchAdminDashboardData, 
  DetectiveProfile,
  loginWithGoogle
} from '../services/firebase';
import { CASE_SCENARIOS } from '../data/cases';
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
  KeyRound
} from 'lucide-react';

interface AdminDashboardModalProps {
  currentUser: DetectiveProfile | null;
  onClose: () => void;
}

export const ADMIN_EMAIL = 'altayyigitozan@gmail.com';

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  currentUser,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'ratings' | 'stores'>('overview');
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchUser, setSearchUser] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const isAuthorized = currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

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

  const loadData = async () => {
    if (!isAuthorized) return;
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

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={handleAdminGoogleLogin}
              disabled={isLoggingIn}
              className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoggingIn ? 'Giriş Yapılıyor...' : `Google ile Giriş Yap (${ADMIN_EMAIL})`}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 text-zinc-400 hover:text-zinc-200 text-xs cursor-pointer transition-colors"
            >
              Vazgeç ve Masaya Dön
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-900 text-[11px] text-zinc-500 font-mono">
            İpucu: Bu panele istediğiniz zaman adresinize <code className="text-zinc-400">?admin=1</code> ekleyerek erişebilirsiniz.
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
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    placeholder="İsim, e-posta veya UID ile ara..."
                    className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <span className="text-xs font-mono text-zinc-400">
                  {filteredUsers.length} Üye Listeleniyor
                </span>
              </div>

              <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/40">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-mono text-[11px] uppercase">
                      <tr>
                        <th className="py-3 px-4">Dedektif Adı</th>
                        <th className="py-3 px-4">E-Posta / Hesap Tipi</th>
                        <th className="py-3 px-4">Kayıt Tarihi</th>
                        <th className="py-3 px-4">Kullanıcı Kimliği (UID)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 font-sans">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-zinc-500">
                            Kayıtlı üye bulunamadı.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u, i) => (
                          <tr key={u.uid || i} className="hover:bg-zinc-900/60 transition-colors">
                            <td className="py-3 px-4 font-bold text-zinc-200">
                              {u.displayName || 'Dedektif'}
                            </td>
                            <td className="py-3 px-4 text-zinc-300">
                              {u.email ? (
                                <span className="text-emerald-400 font-mono">{u.email}</span>
                              ) : u.isGuest ? (
                                <span className="text-zinc-500 font-mono">Misafir Girişi</span>
                              ) : (
                                <span className="text-amber-400 font-mono">Google Hesabı</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-zinc-400 font-mono text-[11px]">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                            </td>
                            <td className="py-3 px-4 text-zinc-500 font-mono text-[10px] truncate max-w-[140px]">
                              {u.uid}
                            </td>
                          </tr>
                        ))
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
        </div>

      </div>
    </div>
  );
};
