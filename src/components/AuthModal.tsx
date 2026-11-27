/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  DetectiveProfile,
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  loginWithApple,
  resetPassword,
  logoutUser,
  deleteCurrentAccount,
} from '../services/firebase';
import { restorePurchases } from '../services/monetization';
import { soundManager } from '../utils/audioEffects';
import {
  X,
  Mail,
  Lock,
  User,
  LogIn,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  LogOut,
  Trash2,
  RotateCcw,
} from 'lucide-react';

interface AuthModalProps {
  currentUser: DetectiveProfile | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  onClose,
  onSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      soundManager.playKeyClick();
      await loginWithGoogle();
      soundManager.playSuccessSound();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      soundManager.playErrorSound();
      setErrorMsg(err.message || 'Google ile giriş başarısız oldu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      soundManager.playKeyClick();
      await loginWithApple();
      soundManager.playSuccessSound();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      soundManager.playErrorSound();
      setErrorMsg(err.message || 'Apple ile giriş başarısız oldu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestorePurchases = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      soundManager.playKeyClick();
      const res = await restorePurchases();
      if (res.success) {
        soundManager.playSuccessSound();
        setSuccessMsg(res.message);
      } else {
        setErrorMsg(res.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }

    if (tab === 'forgot') {
      setIsLoading(true);
      try {
        await resetPassword(email);
        soundManager.playSuccessSound();
        setSuccessMsg('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.');
      } catch (err: any) {
        soundManager.playErrorSound();
        setErrorMsg(err.message || 'Şifre sıfırlama işlemi başarısız.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!password) {
      setErrorMsg('Lütfen şifrenizi girin.');
      return;
    }

    if (tab === 'register') {
      if (password.length < 6) {
        setErrorMsg('Şifreniz en az 6 karakter olmalıdır.');
        return;
      }
      if (password !== passwordConfirm) {
        setErrorMsg('Şifreler birbiriyle eşleşmiyor.');
        return;
      }

      setIsLoading(true);
      try {
        soundManager.playKeyClick();
        await registerWithEmail({
          email,
          password,
          displayName: displayName.trim() || 'Dedektif',
        });
        soundManager.playSuccessSound();
        if (onSuccess) onSuccess();
        onClose();
      } catch (err: any) {
        soundManager.playErrorSound();
        setErrorMsg(err.message || 'Kayıt sırasında bir hata oluştu.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
      try {
        soundManager.playKeyClick();
        await loginWithEmail({ email, password });
        soundManager.playSuccessSound();
        if (onSuccess) onSuccess();
        onClose();
      } catch (err: any) {
        soundManager.playErrorSound();
        setErrorMsg(err.message || 'Giriş yapılamadı. Bilgilerinizi kontrol edin.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    soundManager.playKeyClick();
    await logoutUser();
    onClose();
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      soundManager.playKeyClick();
      await deleteCurrentAccount();
      soundManager.playSuccessSound();
      onClose();
    } catch (err: any) {
      soundManager.playErrorSound();
      setErrorMsg(
        err?.code === 'auth/requires-recent-login'
          ? 'Güvenlik gereği hesabınızı silmek için çıkış yapıp yeniden giriş yaptıktan hemen sonra deneyin.'
          : err?.message || 'Hesap silinemedi.'
      );
      setConfirmDelete(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1f1c18]/55 backdrop-blur-[2px] animate-fade-in">
      <div className="bg-[#faf6ed] border border-[#1f1c18] rounded-sm w-full max-w-md p-6 shadow-[0_12px_36px_rgba(31,28,24,0.2)] text-[#1f1c18]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#d6cdbc]">
          <div>
            <h3 className="font-typewriter font-bold text-sm uppercase tracking-[0.16em] text-[#1f1c18]">
              {currentUser && !currentUser.isGuest ? 'DEDEKTİF KİMLİĞİ' : 'DEDEKTİF GİRİŞİ'}
            </h3>
            <p className="text-[11px] text-[#575046] mt-0.5">
              {currentUser && !currentUser.isGuest
                ? 'Aktif oturum bilgileri'
                : 'Vakaları puanlamak ve oda yönetmek için giriş yapın'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#575046] hover:text-[#1f1c18] hover:bg-[#efe9da] rounded-sm transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Already Logged In View */}
        {currentUser && !currentUser.isGuest ? (
          <div className="mt-5 space-y-4">
            <div className="p-4 bg-[#fffdf8] border border-[#d6cdbc] rounded-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-[#f4efe4] border border-[#1f1c18] flex items-center justify-center text-[#1f1c18] font-typewriter font-bold text-sm shrink-0">
                {currentUser.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-typewriter font-bold text-sm text-[#1f1c18] truncate">
                    {currentUser.displayName}
                  </h4>
                  <span className="text-[10px] font-typewriter uppercase px-1.5 py-0.5 rounded-sm border border-[#276749] text-[#276749] shrink-0">
                    AKTİF
                  </span>
                </div>
                <p className="text-xs text-[#575046] truncate mt-0.5">
                  {currentUser.email || 'Google Hesabı'}
                </p>
                <p className="text-[10px] text-[#7c7265] font-typewriter mt-0.5 truncate">
                  UID: {currentUser.uid}
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 py-2.5 px-4 bg-[#faf6ed] hover:bg-[#8b1e1e] border border-[#8b1e1e] text-[#8b1e1e] hover:text-[#faf6ed] font-typewriter font-bold rounded-sm text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Oturumu Kapat</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 bg-[#1f1c18] hover:bg-[#36312b] text-[#faf6ed] font-typewriter font-bold rounded-sm text-xs transition-colors cursor-pointer"
              >
                Kapat
              </button>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-[#fffdf8] border border-[#8b1e1e] text-[#8b1e1e] text-[11px] rounded-sm">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-2.5 bg-[#fffdf8] border border-[#276749] text-[#276749] text-[11px] rounded-sm">
                {successMsg}
              </div>
            )}

            <div className="pt-2 border-t border-dashed border-[#d6cdbc] flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleRestorePurchases}
                className="text-[11px] font-typewriter text-[#1f1c18] hover:text-[#8b1e1e] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Satın Almaları Geri Yükle</span>
              </button>

              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="text-[11px] font-typewriter text-[#7c7265] hover:text-[#8b1e1e] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Hesabımı Kalıcı Olarak Sil</span>
                </button>
              ) : (
                <div className="p-3 bg-[#fffdf8] border border-[#8b1e1e] rounded-sm space-y-2">
                  <p className="text-[11px] text-[#8b1e1e] font-medium">
                    Hesabınız ve dedektif sicil puanlarınız kalıcı olarak silinecek. Emin misiniz?
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={handleDeleteAccount}
                      className="px-3 py-1.5 bg-[#8b1e1e] text-[#faf6ed] rounded-sm text-[11px] font-typewriter font-bold cursor-pointer"
                    >
                      {isLoading ? 'Siliniyor...' : 'Evet, Hesabımı Sil'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="px-3 py-1.5 bg-[#ebe5d8] text-[#1f1c18] rounded-sm text-[11px] font-typewriter cursor-pointer"
                    >
                      Vazgeç
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {/* Tabs */}
            <div className="flex border-b border-[#d6cdbc]">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2 text-xs font-typewriter font-bold text-center border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  tab === 'login'
                    ? 'border-[#1f1c18] text-[#1f1c18]'
                    : 'border-transparent text-[#7c7265] hover:text-[#1f1c18]'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Giriş Yap</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2 text-xs font-typewriter font-bold text-center border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  tab === 'register'
                    ? 'border-[#1f1c18] text-[#1f1c18]'
                    : 'border-transparent text-[#7c7265] hover:text-[#1f1c18]'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Yeni Kayıt</span>
              </button>
            </div>

            {/* Google Sign-in */}
            <div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-[#fffdf8] hover:bg-[#f0e9da] border border-[#1f1c18] text-[#1f1c18] font-typewriter font-bold rounded-sm text-xs flex items-center justify-center gap-2.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google ile Giriş Yap</span>
              </button>

              <button
                type="button"
                onClick={handleAppleLogin}
                disabled={isLoading}
                className="mt-2 w-full py-2.5 px-4 bg-[#1f1c18] hover:bg-[#36312b] text-[#faf6ed] font-typewriter font-bold rounded-sm text-xs flex items-center justify-center gap-2.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
                </svg>
                <span>Apple ile Giriş Yap</span>
              </button>

              <div className="flex items-center my-3">
                <div className="flex-1 border-t border-[#d6cdbc]" />
                <span className="px-3 text-[10px] font-typewriter text-[#7c7265] uppercase tracking-wider">
                  VEYA E-POSTA
                </span>
                <div className="flex-1 border-t border-[#d6cdbc]" />
              </div>
            </div>

            {/* Alerts */}
            {errorMsg && (
              <div className="p-3 bg-[#fffdf8] border border-[#8b1e1e] rounded-sm text-[#8b1e1e] text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-[#fffdf8] border border-[#276749] rounded-sm text-[#276749] text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              {tab === 'register' && (
                <div>
                  <label className="text-[11px] font-typewriter uppercase tracking-wider text-[#575046] block mb-1">
                    Dedektif İsmi
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-[#7c7265] absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Başkomiser Hakan"
                      className="w-full pl-9 pr-3 py-2 bg-[#fffdf8] border border-[#c8bfae] rounded-sm text-xs font-typewriter text-[#1f1c18] placeholder-[#9c9284] focus:outline-none focus:border-[#1f1c18]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[11px] font-typewriter uppercase tracking-wider text-[#575046] block mb-1">
                  E-Posta Adresi
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-[#7c7265] absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dedektif@ornek.com"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-[#fffdf8] border border-[#c8bfae] rounded-sm text-xs font-typewriter text-[#1f1c18] placeholder-[#9c9284] focus:outline-none focus:border-[#1f1c18]"
                  />
                </div>
              </div>

              {tab !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-typewriter uppercase tracking-wider text-[#575046]">
                      Şifre
                    </label>
                    {tab === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setTab('forgot');
                          setErrorMsg(null);
                        }}
                        className="text-[10px] font-typewriter text-[#575046] hover:text-[#1f1c18] underline cursor-pointer"
                      >
                        Şifremi unuttum
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-[#7c7265] absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-[#fffdf8] border border-[#c8bfae] rounded-sm text-xs font-typewriter text-[#1f1c18] placeholder-[#9c9284] focus:outline-none focus:border-[#1f1c18]"
                    />
                  </div>
                </div>
              )}

              {tab === 'register' && (
                <div>
                  <label className="text-[11px] font-typewriter uppercase tracking-wider text-[#575046] block mb-1">
                    Şifre Tekrarı
                  </label>
                  <div className="relative">
                    <KeyRound className="w-3.5 h-3.5 text-[#7c7265] absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="password"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      placeholder="••••••"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-[#fffdf8] border border-[#c8bfae] rounded-sm text-xs font-typewriter text-[#1f1c18] placeholder-[#9c9284] focus:outline-none focus:border-[#1f1c18]"
                    />
                  </div>
                </div>
              )}

              {tab === 'forgot' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setTab('login');
                      setErrorMsg(null);
                    }}
                    className="text-[11px] font-typewriter text-[#575046] hover:text-[#1f1c18] underline cursor-pointer"
                  >
                    &larr; Giriş ekranına dön
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#1f1c18] hover:bg-[#36312b] text-[#faf6ed] font-typewriter font-bold uppercase tracking-wider rounded-sm text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>İşlem yapılıyor...</span>
                ) : tab === 'login' ? (
                  <>
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Giriş Yap</span>
                  </>
                ) : tab === 'register' ? (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Kaydol</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5" />
                    <span>Bağlantı Gönder</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-dashed border-[#d6cdbc] flex items-center justify-center gap-3 text-[10px] font-typewriter text-[#7c7265]">
          <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="hover:text-[#1f1c18] underline">
            Gizlilik Politikası
          </a>
          <span>·</span>
          <a href="/terms.html" target="_blank" rel="noopener noreferrer" className="hover:text-[#1f1c18] underline">
            Kullanım Koşulları
          </a>
        </div>
      </div>
    </div>
  );
};
