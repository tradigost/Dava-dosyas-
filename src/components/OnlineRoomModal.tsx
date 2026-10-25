/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { RoleType, CaseScenario } from '../types';
import { ROLES } from '../data/cases';
import { soundManager } from '../utils/audioEffects';
import { 
  loginWithGoogle, 
  loginWithGuestName,
  logoutUser, 
  createOnlineRoom, 
  joinOnlineRoom, 
  parseFirebaseAuthError,
  AuthErrorInfo,
  OnlineRoom, 
  OnlineMember 
} from '../services/firebase';
import { 
  Share2, 
  Users, 
  LogIn, 
  LogOut, 
  Copy, 
  Check, 
  ShieldCheck, 
  Smartphone,
  MessageCircle,
  X,
  Play,
  AlertTriangle,
  ExternalLink,
  UserCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface OnlineRoomModalProps {
  currentUser: User | null;
  currentRoom: OnlineRoom | null;
  roomMembers: OnlineMember[];
  scenarios: CaseScenario[];
  selectedScenarioId: string;
  onSelectScenario: (id: string) => void;
  playerCount?: number;
  onChangePlayerCount?: (count: number) => void;
  onRoomJoined: (roomCode: string) => void;
  onStartOnlineGame: () => void;
  onClose: () => void;
}

export const OnlineRoomModal: React.FC<OnlineRoomModalProps> = ({
  currentUser,
  currentRoom,
  roomMembers,
  scenarios,
  selectedScenarioId,
  onSelectScenario,
  playerCount = 2,
  onChangePlayerCount,
  onRoomJoined,
  onStartOnlineGame,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [modalPlayerCount, setModalPlayerCount] = useState<number>(playerCount);
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [guestNameInput, setGuestNameInput] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<RoleType>('forensics');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedDomain, setCopiedDomain] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [authError, setAuthError] = useState<AuthErrorInfo | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const availableRoles: RoleType[] = ['forensics', 'cryptology', 'profiler', 'field', 'ballistics', 'archive'];

  // Current domain (e.g. davadosyasi.vercel.app)
  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'davadosyasi.vercel.app';

  // Handle Google Login (with popup or redirect)
  const handleGoogleLogin = async (useRedirect: boolean = false) => {
    try {
      soundManager.playKeyClick();
      setIsSubmitting(true);
      setAuthError(null);
      setActionError(null);
      await loginWithGoogle(useRedirect);
      soundManager.playSuccessSound();
    } catch (err: any) {
      console.error('Google login error:', err);
      const parsed = parseFirebaseAuthError(err);
      setAuthError(parsed);
      soundManager.playErrorSound();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Fast Guest/Detective Name Login
  const handleGuestLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const name = guestNameInput.trim();
    if (!name) {
      setActionError('Lütfen bir dedektif adı veya takma ad girin (Örn: Komiser Selim).');
      return;
    }

    try {
      soundManager.playKeyClick();
      setIsSubmitting(true);
      setAuthError(null);
      setActionError(null);
      await loginWithGuestName(name);
      soundManager.playSuccessSound();
    } catch (err: any) {
      console.error('Guest login error:', err);
      const parsed = parseFirebaseAuthError(err);
      setAuthError(parsed);
      soundManager.playErrorSound();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateRoom = async () => {
    if (!currentUser) {
      setActionError('Lütfen önce dedektif profili oluşturun veya Google ile bağlanın.');
      return;
    }
    try {
      soundManager.playKeyClick();
      setIsSubmitting(true);
      setActionError(null);

      const code = await createOnlineRoom({
        hostUser: currentUser,
        scenarioId: selectedScenarioId,
        playerCount: modalPlayerCount,
        hostRole: selectedRole,
      });

      soundManager.playSuccessSound();
      onRoomJoined(code);
    } catch (err) {
      console.error(err);
      setActionError('Oda oluşturulurken bir hata oluştu. İnternet bağlantınızı kontrol edin.');
      soundManager.playErrorSound();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!currentUser) {
      setActionError('Lütfen önce dedektif profili oluşturun veya Google ile bağlanın.');
      return;
    }
    if (!joinCodeInput.trim()) {
      setActionError('Lütfen 6 haneli oda kodunu girin.');
      return;
    }
    try {
      soundManager.playKeyClick();
      setIsSubmitting(true);
      setActionError(null);

      const cleanCode = joinCodeInput.trim().toUpperCase();
      const res = await joinOnlineRoom({
        roomCode: cleanCode,
        user: currentUser,
        desiredRole: selectedRole,
      });

      if (!res.success) {
        setActionError(res.error || 'Odaya bağlanılamadı.');
        soundManager.playErrorSound();
        return;
      }

      soundManager.playSuccessSound();
      onRoomJoined(cleanCode);
    } catch (err) {
      console.error(err);
      setActionError('Odaya katılırken beklenmeyen bir hata oluştu.');
      soundManager.playErrorSound();
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp Share URL generator
  const getWhatsAppShareUrl = (roomCode: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const inviteUrl = `${origin}/?room=${roomCode}`;
    const text = encodeURIComponent(
      `🔎 Masadaki Dosya - Dedektiflik Daveti!\n\nSeninle aynı masada oturup "Son Kadeh Cinayeti"ni çözeceğiz.\n\n📲 Telefonundan Masaya Bağlan:\n1. Linke tıkla: ${inviteUrl}\n2. İsmini yazıp dedektif rozetini al\n3. Uzmanlık rolünü seç!\n\n(Oda Kodu: ${roomCode})`
    );
    return `https://api.whatsapp.com/send?text=${text}`;
  };

  const handleCopyLink = (roomCode: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const inviteUrl = `${origin}/?room=${roomCode}`;
    navigator.clipboard.writeText(inviteUrl);
    soundManager.playKeyClick();
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyHostname = () => {
    navigator.clipboard.writeText(currentHostname);
    soundManager.playKeyClick();
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-amber-600/50 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative text-zinc-100 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-200 transition-colors rounded-full bg-zinc-900 border border-zinc-800"
          aria-label="Kapat"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-3 border-b border-zinc-800">
          <div className="w-11 h-11 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
            ÇOKLU CİHAZ SENKRONİZASYONU
          </span>
          <h3 className="text-lg sm:text-xl font-bold font-cinzel text-zinc-100 mt-1">
            Farklı Telefonlarla Masaya Bağlan
          </h3>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Arkadaşlarınız WhatsApp linkiyle kendi telefonlarından bağlanır, ortak panoda delilleri canlı olarak çözer.
          </p>
        </div>

        {/* User Profile Status Box */}
        {currentUser ? (
          <div className="mt-4 p-3.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Dedektif'}
                  className="w-10 h-10 rounded-full border border-amber-500/50"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-amber-600/30 border border-amber-500 text-amber-300 font-bold flex items-center justify-center text-sm">
                  {currentUser.displayName ? currentUser.displayName[0] : 'D'}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-100 truncate">
                  {currentUser.displayName || 'Dedektif'}
                </p>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 
                  {currentUser.isAnonymous ? 'Dedektif Rozeti Aktif' : 'Google İle Bağlandı'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={logoutUser}
              className="text-xs text-zinc-400 hover:text-rose-400 px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 transition-colors flex items-center gap-1.5"
              title="Profili Değiştir / Çıkış Yap"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Değiştir</span>
            </button>
          </div>
        ) : (
          /* Profile Sign-in Choices (Quick Guest Name OR Google) */
          <div className="mt-4 space-y-3">
            {/* Quick Guest Name Input (Preferred & Instant on Mobile/WhatsApp) */}
            <div className="p-3.5 bg-gradient-to-br from-amber-950/30 to-zinc-900/80 border border-amber-500/30 rounded-2xl">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hızlı Katıl (Dedektif İsmiyle - Önerilen)</span>
              </div>
              <p className="text-[11px] text-zinc-400 mb-2.5 leading-snug">
                Arkadaşlarınız WhatsApp linkine tıkladığında Google şifresi girmeden anında masaya dahil olabilir.
              </p>
              
              <form onSubmit={handleGuestLogin} className="flex gap-2">
                <input
                  type="text"
                  value={guestNameInput}
                  onChange={(e) => setGuestNameInput(e.target.value)}
                  placeholder="Dedektif Adınız (Örn: Müfettiş Can)"
                  maxLength={24}
                  className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 font-medium"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded-xl text-xs transition-colors shadow flex items-center gap-1 whitespace-nowrap"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Rozeti Al</span>
                </button>
              </form>
            </div>

            {/* Google Login Alternative */}
            <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-2xl flex items-center justify-between gap-2">
              <div className="text-left">
                <p className="text-xs font-semibold text-zinc-200">Google Hesabı ile Giriş</p>
                <p className="text-[10px] text-zinc-400">Profil fotoğrafınız ve adınızla bağlanın</p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleGoogleLogin(false)}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-zinc-200 text-zinc-900 font-bold rounded-xl text-xs transition-colors shadow"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Google Giriş</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Structured Diagnostic Error Alert (Solves auth/unauthorized-domain & mobile popup errors) */}
        {authError && (
          <div className="mt-3.5 p-3.5 bg-rose-950/50 border border-rose-800/80 rounded-2xl text-xs text-rose-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{authError.title}</span>
            </div>
            
            <p className="text-[11px] leading-relaxed text-rose-200/90">
              {authError.message}
            </p>

            {authError.code === 'auth/unauthorized-domain' && (
              <div className="pt-1 border-t border-rose-900/60 space-y-2 text-[11px]">
                <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800 space-y-1.5">
                  <span className="font-semibold text-amber-300 block">
                    🔧 Google Girişini Vercel'de Açmak İçin (30 saniye):
                  </span>
                  <ol className="list-decimal list-inside space-y-1 text-zinc-300 text-[10px]">
                    <li><strong>Firebase Console</strong> &gt; Projeniz &gt; <strong>Authentication</strong></li>
                    <li><strong>Settings</strong> (Ayarlar) &gt; <strong>Authorized domains</strong> sekmesini açın.</li>
                    <li><strong>Add domain</strong> butonuna tıklayıp aşağıdaki alan adını ekleyin:</li>
                  </ol>

                  <div className="flex items-center justify-between gap-2 bg-zinc-900 p-1.5 rounded-lg border border-zinc-700">
                    <code className="font-mono text-[11px] text-emerald-400 truncate">
                      {currentHostname}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyHostname}
                      className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[10px] font-mono flex items-center gap-1 shrink-0"
                    >
                      {copiedDomain ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedDomain ? 'Kopyalandı' : 'Kopyala'}</span>
                    </button>
                  </div>
                </div>

                <div className="text-zinc-300 text-[10px] bg-amber-950/30 p-2 rounded-xl border border-amber-600/30">
                  💡 <strong>Hemen Oynamak İçin:</strong> Yukarıdaki <em>"Hızlı Katıl (Dedektif İsmiyle)"</em> kutusuna adınızı yazıp doğrudan odaya geçebilirsiniz!
                </div>
              </div>
            )}

            {authError.code === 'auth/popup-blocked' && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => handleGoogleLogin(true)}
                  className="w-full py-1.5 px-2 bg-rose-900 hover:bg-rose-800 text-rose-100 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3" />
                  <span>Açılır pencere yerine Sayfa Yönlendirmesiyle Giriş Yap</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Action Error Alert */}
        {actionError && !authError && (
          <div className="mt-3 p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300">
            {actionError}
          </div>
        )}

        {/* If user is ALREADY inside an active room: Show the Room Lobby & WhatsApp link */}
        {currentRoom ? (
          <div className="mt-5 space-y-4">
            <div className="p-4 bg-emerald-950/20 border border-emerald-600/40 rounded-2xl text-center">
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block">
                AKTİF MASA ODA KODU:
              </span>
              <div className="text-3xl font-black font-mono text-emerald-300 tracking-[0.2em] my-1">
                {currentRoom.roomCode}
              </div>
              <p className="text-xs text-zinc-400">
                Oda Sahibi: <strong className="text-zinc-200">{currentRoom.hostName}</strong>
              </p>
            </div>

            {/* WhatsApp Invite Button */}
            <div className="space-y-2">
              <a
                href={getWhatsAppShareUrl(currentRoom.roomCode)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg hover:shadow-emerald-600/20"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>WhatsApp ile Masayı Paylaş</span>
              </a>

              <button
                type="button"
                onClick={() => handleCopyLink(currentRoom.roomCode)}
                className="w-full py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Davet Linki Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Davet Bağlantısını Kopyala</span>
                  </>
                )}
              </button>
            </div>

            {/* Connected Members List */}
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-2.5">
                Masaya Bağlanan Dedektifler ({roomMembers.length}):
              </span>
              <div className="space-y-2">
                {roomMembers.map((member) => {
                  const roleData = ROLES[member.role] || ROLES.forensics;
                  return (
                    <div
                      key={member.userId}
                      className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {member.photoURL ? (
                          <img
                            src={member.photoURL}
                            alt={member.displayName}
                            className="w-7 h-7 rounded-full border border-zinc-700"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-300 text-xs font-bold flex items-center justify-center">
                            {member.displayName ? member.displayName[0] : 'D'}
                          </div>
                        )}
                        <span className="text-xs font-bold text-zinc-200 truncate">
                          {member.displayName}
                        </span>
                      </div>

                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-300">
                        {roleData.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Start / Close Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playSuccessSound();
                  onStartOnlineGame();
                  onClose();
                }}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Oyuna Başla & Dosyayı Masaya Aç</span>
              </button>
            </div>
          </div>
        ) : (
          /* If NOT in a room: Show Tabs (Create Room or Join Room) */
          <div className="mt-5 space-y-4">
            <div className="flex rounded-xl bg-zinc-900 p-1 border border-zinc-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className={`flex-1 py-2 font-bold rounded-lg transition-colors ${
                  activeTab === 'create'
                    ? 'bg-amber-600 text-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Yeni Masa Kur
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('join')}
                className={`flex-1 py-2 font-bold rounded-lg transition-colors ${
                  activeTab === 'join'
                    ? 'bg-amber-600 text-zinc-950'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Mevcut Masaya Katıl
              </button>
            </div>

            {/* Player Count Selection for Room Host */}
            {activeTab === 'create' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-amber-300/90 block">
                    Masada Kaç Kişi Olacaksınız?
                  </label>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {modalPlayerCount === 2 ? '⚡ 2 KİŞİ (İKİLİ ORTAKLIK)' : `${modalPlayerCount} DEDEKTİF`}
                  </span>
                </div>
                <div className="flex gap-2">
                  {[2, 3, 4, 5, 6].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => {
                        soundManager.playKeyClick();
                        setModalPlayerCount(cnt);
                        onChangePlayerCount?.(cnt);
                        if (cnt === 2 && selectedRole !== 'forensics' && selectedRole !== 'profiler') {
                          setSelectedRole('forensics');
                        }
                      }}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        modalPlayerCount === cnt
                          ? 'bg-amber-600 text-zinc-950 border-amber-400 shadow-md ring-1 ring-amber-400'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      {cnt} Kişi
                    </button>
                  ))}
                </div>
                {modalPlayerCount === 2 && (
                  <p className="text-[11px] text-emerald-400/90 mt-1.5 bg-emerald-950/30 border border-emerald-800/40 p-2 rounded-xl">
                    ✓ <strong>2 Kişilik Ortaklık Modu:</strong> 1. Dedektif Adli Tıp & Kripto terminallerini, 2. Dedektif Profilleme ve sorgu tutanaklarını inceler.
                  </p>
                )}
              </div>
            )}

            {/* Role Picker for the Joining/Creating User */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-amber-300/90 block mb-2">
                {modalPlayerCount === 2 ? 'Görevinizi Seçin (2 Kişilik Dağılım):' : 'Uzmanlık Alanınızı Seçin:'}
              </label>

              {modalPlayerCount === 2 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playKeyClick();
                      setSelectedRole('forensics');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedRole === 'forensics'
                        ? 'bg-amber-950/70 border-amber-500 text-amber-200 shadow-md ring-1 ring-amber-500/40'
                        : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-100">
                      <span>Dedektif 1: Adli Tıp & Kripto</span>
                      <span className="text-[10px] text-emerald-400 font-mono">🔬 + 💻</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                      Otopsi raporları, toksikoloji analizörü ve PIN terminali sizde.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playKeyClick();
                      setSelectedRole('profiler');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedRole === 'profiler'
                        ? 'bg-amber-950/70 border-amber-500 text-amber-200 shadow-md ring-1 ring-amber-500/40'
                        : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-100">
                      <span>Dedektif 2: Profilleme & İfadeler</span>
                      <span className="text-[10px] text-amber-400 font-mono">🧠 + 🕵️</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                      Şüpheli ifadeleri, psikolojik çelişkiler ve saha istihbaratı sizde.
                    </p>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {availableRoles.slice(0, 3).map((roleKey) => {
                    const role = ROLES[roleKey];
                    const isSelected = selectedRole === roleKey;
                    return (
                      <button
                        key={roleKey}
                        type="button"
                        onClick={() => {
                          soundManager.playKeyClick();
                          setSelectedRole(roleKey);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-amber-950/70 border-amber-500 text-amber-200 shadow-md ring-1 ring-amber-500/40'
                            : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <p className="text-xs font-bold leading-tight text-zinc-200">{role.title}</p>
                        <p className="text-[10px] text-zinc-400 mt-0.5 truncate">{role.shortDesc.substring(0, 32)}...</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {activeTab === 'create' ? (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCreateRoom}
                  disabled={!currentUser || isSubmitting}
                  className={`w-full py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-xl flex items-center justify-center gap-2 ${
                    currentUser && !isSubmitting
                      ? 'bg-amber-600 hover:bg-amber-500 text-zinc-950'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                  <span>Oda Oluştur & WhatsApp Linki Al</span>
                </button>
                {!currentUser && (
                  <p className="text-[10px] text-center text-zinc-500 mt-2">
                    * Oda kurmak için yukarıdan dedektif adınızı girin veya Google ile bağlanın.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">
                    Arkadaşınızın Paylaştığı 6 Haneli Oda Kodu:
                  </label>
                  <input
                    type="text"
                    value={joinCodeInput}
                    onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                    placeholder="Örn: KND-884"
                    maxLength={10}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-sm font-mono tracking-widest text-center text-zinc-100 uppercase focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleJoinRoom}
                  disabled={!currentUser || isSubmitting}
                  className={`w-full py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-xl flex items-center justify-center gap-2 ${
                    currentUser && !isSubmitting
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masaya Katıl</span>
                </button>
                {!currentUser && (
                  <p className="text-[10px] text-center text-zinc-500 mt-1">
                    * Odaya girmek için yukarıdan dedektif adınızı girin veya Google ile bağlanın.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
