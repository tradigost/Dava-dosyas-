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
  logoutUser, 
  createOnlineRoom, 
  joinOnlineRoom, 
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
  Sparkles, 
  ShieldCheck, 
  Smartphone,
  MessageCircle,
  X,
  Play
} from 'lucide-react';

interface OnlineRoomModalProps {
  currentUser: User | null;
  currentRoom: OnlineRoom | null;
  roomMembers: OnlineMember[];
  scenarios: CaseScenario[];
  selectedScenarioId: string;
  onSelectScenario: (id: string) => void;
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
  onRoomJoined,
  onStartOnlineGame,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<RoleType>('forensics');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const availableRoles: RoleType[] = ['forensics', 'cryptology', 'profiler', 'field', 'ballistics', 'archive'];

  // Check which roles are already taken in the active room
  const takenRoles = new Set(roomMembers.map((m) => m.role));

  const handleGoogleLogin = async () => {
    try {
      soundManager.playKeyClick();
      setIsSubmitting(true);
      setErrorMessage(null);
      await loginWithGoogle();
      soundManager.playSuccessSound();
    } catch (err) {
      console.error(err);
      setErrorMessage('Google girişi sırasında bir sorun oluştu.');
      soundManager.playErrorSound();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateRoom = async () => {
    if (!currentUser) {
      setErrorMessage('Lütfen önce Google ile giriş yapın.');
      return;
    }
    try {
      soundManager.playKeyClick();
      setIsSubmitting(true);
      setErrorMessage(null);

      const code = await createOnlineRoom({
        hostUser: currentUser,
        scenarioId: selectedScenarioId,
        playerCount: 3,
        hostRole: selectedRole,
      });

      soundManager.playSuccessSound();
      onRoomJoined(code);
    } catch (err) {
      console.error(err);
      setErrorMessage('Oda oluşturulurken bir hata oluştu.');
      soundManager.playErrorSound();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!currentUser) {
      setErrorMessage('Lütfen önce Google ile giriş yapın.');
      return;
    }
    if (!joinCodeInput.trim()) {
      setErrorMessage('Lütfen 6 haneli oda kodunu girin.');
      return;
    }
    try {
      soundManager.playKeyClick();
      setIsSubmitting(true);
      setErrorMessage(null);

      const cleanCode = joinCodeInput.trim().toUpperCase();
      const res = await joinOnlineRoom({
        roomCode: cleanCode,
        user: currentUser,
        desiredRole: selectedRole,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Odaya bağlanılamadı.');
        soundManager.playErrorSound();
        return;
      }

      soundManager.playSuccessSound();
      onRoomJoined(cleanCode);
    } catch (err) {
      console.error(err);
      setErrorMessage('Odaya katılırken beklenmeyen bir hata oluştu.');
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
      `🔎 Masadaki Dosya - Dedektiflik Daveti!\n\nSeninle aynı masada oturup "Son Kadeh Cinayeti"ni çözeceğiz. Kendi telefonundan katılmak için bu linke tıkla ve uzmanlık rolünü seç:\n${inviteUrl}\n\n(Oda Kodu: ${roomCode})`
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

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-amber-600/50 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-zinc-100 max-h-[90vh] overflow-y-auto">
        
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
        <div className="text-center pb-4 border-b border-zinc-800">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-400">
            <Smartphone className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
            ÇOKLU CİHAZ SENKRONİZASYONU
          </span>
          <h3 className="text-lg sm:text-xl font-bold font-cinzel text-zinc-100 mt-1">
            Farklı Telefonlarla Masaya Bağlan
          </h3>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Arkadaşlarınızın her biri kendi telefonundan bağlanır, WhatsApp davetiyle odaya katılır ve canlı ortak panoda delilleri çözer.
          </p>
        </div>

        {/* Google Authentication Box */}
        <div className="mt-4 p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex items-center justify-between gap-3">
          {currentUser ? (
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
                  <ShieldCheck className="w-3 h-3" /> Google İle Bağlandı
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs font-semibold text-zinc-200">Henüz profil oluşturulmadı</p>
              <p className="text-[11px] text-zinc-400">Çok oyunculu odaya girmek için Google ile bağlanın.</p>
            </div>
          )}

          {currentUser ? (
            <button
              type="button"
              onClick={logoutUser}
              className="text-xs text-zinc-400 hover:text-rose-400 p-2 rounded-lg bg-zinc-950 border border-zinc-800 transition-colors"
              title="Çıkış Yap"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-zinc-200 text-zinc-900 font-bold rounded-xl text-xs transition-colors shadow-md"
            >
              <LogIn className="w-4 h-4" />
              <span>Google ile Giriş</span>
            </button>
          )}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-3 p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300">
            {errorMessage}
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
                  const roleData = ROLES[member.role];
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
                            {member.displayName[0]}
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

            {/* Role Picker for the Joining/Creating User */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-amber-300/90 block mb-2">
                Uzmanlık Alanınızı Seçin:
              </label>
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
