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
  resetPassword, 
  logoutUser 
} from '../services/firebase';
import { soundManager } from '../utils/audioEffects';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound, 
  LogOut 
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
      // Login
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-zinc-950 border border-amber-600/50 rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl relative overflow-hidden text-zinc-100">
        
        {/* Background glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-cinzel font-bold text-base sm:text-lg text-zinc-100">
                {currentUser && !currentUser.isGuest ? 'Dedektif Kimlik Kartı' : 'Dedektif Kulübü Üyeliği'}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {currentUser && !currentUser.isGuest
                  ? 'Giriş yapılmış aktif dedektif hesabı'
                  : 'Vakaları puanlamak ve odaları yönetmek için giriş yapın'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Already Logged In View */}
        {currentUser && !currentUser.isGuest ? (
          <div className="mt-5 space-y-4">
            <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-lg font-cinzel">
                {currentUser.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-zinc-100 truncate">{currentUser.displayName}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-300">
                    Aktif Üye
                  </span>
                </div>
                <p className="text-xs text-zinc-400 truncate mt-0.5">{currentUser.email || 'Google Hesabı'}</p>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5 truncate">UID: {currentUser.uid}</p>
              </div>
            </div>

            <div className="p-3.5 bg-amber-950/20 border border-amber-800/30 rounded-xl text-xs text-amber-200/90 leading-relaxed">
              ⭐ Üyeliğiniz sayesinde tamamladığınız dava dosyalarını 5 üzerinden puanlayabilir, dava arşiv istatistiklerine katkıda bulunabilirsiniz.
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-rose-300 hover:text-rose-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Oturumu Kapat</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md"
              >
                Tamam
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {/* Tabs */}
            <div className="flex border-b border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  tab === 'login'
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
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
                className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  tab === 'register'
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Yeni Kayıt</span>
              </button>
            </div>

            {/* Google Fast Sign-in Button */}
            <div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-zinc-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm"
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
                <span>Google ile Tek Tıkla Giriş Yap</span>
              </button>

              <div className="flex items-center my-3">
                <div className="flex-1 border-t border-zinc-800" />
                <span className="px-3 text-[10px] font-mono text-zinc-500 uppercase">VEYA E-POSTA İLE</span>
                <div className="flex-1 border-t border-zinc-800" />
              </div>
            </div>

            {/* Error & Success Alerts */}
            {errorMsg && (
              <div className="p-3 bg-rose-950/50 border border-rose-800/60 rounded-xl text-rose-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-950/50 border border-emerald-800/60 rounded-xl text-emerald-200 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              {tab === 'register' && (
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Dedektif İsminiz:
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Örn: Başkomiser Hakan"
                      className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                  E-Posta Adresi:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dedektif@ornek.com"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {tab !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                      Şifre:
                    </label>
                    {tab === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setTab('forgot');
                          setErrorMsg(null);
                        }}
                        className="text-[10px] text-amber-400 hover:text-amber-300 cursor-pointer"
                      >
                        Şifremi unuttum?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              {tab === 'register' && (
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Şifre Tekrarı:
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="password"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
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
                    className="text-[11px] text-amber-400 hover:text-amber-300 cursor-pointer"
                  >
                    &larr; Giriş Ekranına Dön
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded-xl text-xs transition-all shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>İşlem yapılıyor...</span>
                ) : tab === 'login' ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Giriş Yap</span>
                  </>
                ) : tab === 'register' ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Dedektif Olarak Kaydol</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Sıfırlama Bağlantısı Gönder</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
