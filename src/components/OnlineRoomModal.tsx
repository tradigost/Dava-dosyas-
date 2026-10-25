/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RoleType, CaseScenario } from '../types';
import { ROLES } from '../data/cases';
import { soundManager } from '../utils/audioEffects';
import { 
  loginWithGoogle, 
  loginWithGuestName,
  logoutUser, 
  createOnlineRoom, 
  joinOnlineRoom, 
  startOnlineRoom,
  leaveOnlineRoom,
  fetchRoomDetails,
  parseFirebaseAuthError,
  AuthErrorInfo,
  OnlineRoom, 
  OnlineMember,
  DetectiveProfile,
  subscribeToRoom,
  subscribeToRoomMembers
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
  UserCheck,
  Sparkles,
  Loader2,
  Crown,
  Radio,
  Search,
  RefreshCw,
  Armchair
} from 'lucide-react';

interface OnlineRoomModalProps {
  currentUser: DetectiveProfile | null;
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
  initialRoomCode?: string | null;
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
  initialRoomCode,
}) => {
  // Check whether current user is an existing member of the room
  const isMember = Boolean(currentUser && roomMembers.some((m) => m.userId === currentUser.uid));
  const isHost = Boolean(currentUser && currentRoom && currentRoom.hostId === currentUser.uid);
  const isGoogleUser = Boolean(currentUser && !currentUser.isGuest && !currentUser.isAnonymous);

  // Tab state: default to 'join' if an initial room code exists or user is not host; otherwise 'create'
  const [activeTab, setActiveTab] = useState<'create' | 'join'>(
    initialRoomCode ? 'join' : isMember ? 'join' : 'create'
  );

  const [modalPlayerCount, setModalPlayerCount] = useState<number>(currentRoom?.playerCount || playerCount);
  const [joinCodeInput, setJoinCodeInput] = useState<string>(initialRoomCode || currentRoom?.roomCode || '');
  const [hostSelectedRole, setHostSelectedRole] = useState<RoleType>('forensics');
  
  // Per-seat guest name inputs: map role -> string
  const [seatNameInputs, setSeatNameInputs] = useState<Record<string, string>>({});

  // Fetched room state when user is inspecting a room before joining
  const [inspectedRoom, setInspectedRoom] = useState<OnlineRoom | null>(currentRoom);
  const [inspectedMembers, setInspectedMembers] = useState<OnlineMember[]>(roomMembers);
  const [isInspecting, setIsInspecting] = useState<boolean>(false);
  const [inspectError, setInspectError] = useState<string | null>(null);

  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedDomain, setCopiedDomain] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittingRole, setSubmittingRole] = useState<string | null>(null);
  const [authError, setAuthError] = useState<AuthErrorInfo | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'davadosyasi.vercel.app';

  // Available roles based on active player count
  const effectivePlayerCount = currentRoom?.playerCount || inspectedRoom?.playerCount || modalPlayerCount;
  const allRoleList: RoleType[] = ['forensics', 'cryptology', 'profiler', 'field', 'ballistics', 'archive'];
  const activeRoles: RoleType[] = effectivePlayerCount === 2
    ? ['forensics', 'profiler']
    : allRoleList.slice(0, effectivePlayerCount);

  // Sync join code input if initialRoomCode changes
  useEffect(() => {
    if (initialRoomCode) {
      const code = initialRoomCode.trim().toUpperCase();
      setJoinCodeInput(code);
      setActiveTab('join');
      loadRoomForInspection(code);
    }
  }, [initialRoomCode]);

  // Keep inspected members synced with live room members if this is the active room
  useEffect(() => {
    if (currentRoom) {
      setInspectedRoom(currentRoom);
      setInspectedMembers(roomMembers);
    }
  }, [currentRoom, roomMembers]);

  // Real-time listener for inspected room when user is on join tab
  useEffect(() => {
    const code = (joinCodeInput || initialRoomCode || '').trim().toUpperCase();
    if (code.length >= 6 && !isMember) {
      const unsubRoom = subscribeToRoom(code, (room) => {
        if (room) setInspectedRoom(room);
      });
      const unsubMembers = subscribeToRoomMembers(code, (members) => {
        setInspectedMembers(members);
      });
      return () => {
        unsubRoom();
        unsubMembers();
      };
    }
  }, [joinCodeInput, initialRoomCode, isMember]);

  // Inspect room details
  const loadRoomForInspection = async (codeToInspect: string) => {
    const cleanCode = codeToInspect.trim().toUpperCase();
    if (!cleanCode) return;
    try {
      setIsInspecting(true);
      setInspectError(null);
      const res = await fetchRoomDetails(cleanCode);
      if (!res.room) {
        setInspectError('Oda bulunamadı. Lütfen 6 haneli kodu kontrol edin.');
        setInspectedRoom(null);
        setInspectedMembers([]);
      } else {
        setInspectedRoom(res.room);
        setInspectedMembers(res.members);
      }
    } catch (e) {
      setInspectError('Oda bilgisi alınamadı.');
    } finally {
      setIsInspecting(false);
    }
  };

  // Google Login (for room creator)
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

  // Create Room (Strictly requires Google Login)
  const handleCreateRoom = async () => {
    if (!currentUser || !isGoogleUser) {
      setActionError('Masa kurucu şef olmak için Google ile giriş yapmanız zorunludur.');
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
        hostRole: hostSelectedRole,
      });

      soundManager.playSuccessSound();
      onRoomJoined(code);
    } catch (err) {
      console.error(err);
      setActionError('Oda oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      soundManager.playErrorSound();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Direct 1-Click Seat Claim for Invited Guests (No Google Login Required!)
  const handleClaimSeat = async (roleKey: RoleType) => {
    const targetCode = (currentRoom?.roomCode || inspectedRoom?.roomCode || joinCodeInput || initialRoomCode || '').trim().toUpperCase();
    if (!targetCode) {
      setActionError('Geçerli bir oda kodu bulunamadı.');
      return;
    }

    // Determine detective display name
    const inputName = (seatNameInputs[roleKey] || '').trim();
    const existingName = currentUser?.displayName?.trim();
    const finalName = inputName || existingName;

    if (!finalName) {
      setActionError(`Lütfen "${ROLES[roleKey]?.title || roleKey}" koltuğuna oturmak için dedektif adınızı yazın.`);
      return;
    }

    try {
      soundManager.playKeyClick();
      setSubmittingRole(roleKey);
      setIsSubmitting(true);
      setActionError(null);

      // Create or update guest profile if not already signed in with this name
      let activeUser = currentUser;
      if (!activeUser || activeUser.displayName !== finalName) {
        activeUser = await loginWithGuestName(finalName);
      }

      // Join the room with this role
      const res = await joinOnlineRoom({
        roomCode: targetCode,
        user: activeUser,
        desiredRole: roleKey,
      });

      if (!res.success) {
        setActionError(res.error || 'Koltuğa oturulamadı.');
        soundManager.playErrorSound();
        return;
      }

      soundManager.playSuccessSound();
      onRoomJoined(targetCode);
    } catch (err: any) {
      console.error('Seat claim error:', err);
      setActionError('Masaya katılırken beklenmeyen bir hata oluştu.');
      soundManager.playErrorSound();
    } finally {
      setIsSubmitting(false);
      setSubmittingRole(null);
    }
  };

  // Host starts the game
  const handleHostStartGame = async () => {
    if (!currentRoom || !currentUser) return;
    try {
      setIsSubmitting(true);
      setActionError(null);
      const res = await startOnlineRoom(currentRoom.roomCode, currentUser.uid);
      if (!res.success) {
        setActionError(res.error || 'Oyun başlatılamadı.');
        soundManager.playErrorSound();
        return;
      }

      soundManager.playSuccessSound();
      onStartOnlineGame();
      onClose();
    } catch (err) {
      console.error(err);
      setActionError('Oyun başlatılırken hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Leave room
  const handleLeaveRoom = async () => {
    if (currentRoom && currentUser) {
      soundManager.playKeyClick();
      await leaveOnlineRoom(currentRoom.roomCode, currentUser.uid);
      onRoomJoined('');
    }
  };

  // WhatsApp Share URL generator
  const getWhatsAppShareUrl = (roomCode: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const inviteUrl = `${origin}/?room=${roomCode}`;
    const text = encodeURIComponent(
      `🔎 Masadaki Dosya - Dedektiflik Daveti!\n\nSeninle aynı masada oturup "Son Kadeh Cinayeti"ni çözeceğiz.\n\n📲 Telefonundan Masaya Bağlan:\n1. Linke tıkla: ${inviteUrl}\n2. Adını yaz ve boş koltuğa otur!\n\n(Oda Kodu: ${roomCode})`
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

  const activeMembersList = isMember ? roomMembers : inspectedMembers;
  const isRoomFull = currentRoom 
    ? roomMembers.length >= currentRoom.playerCount 
    : inspectedRoom 
    ? inspectedMembers.length >= inspectedRoom.playerCount 
    : false;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-zinc-950 border border-amber-600/60 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative text-zinc-100 max-h-[92vh] overflow-y-auto">
        
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
            ÇOKLU TELEFON SENKRONİZASYONU
          </span>
          <h3 className="text-lg sm:text-xl font-bold font-cinzel text-zinc-100 mt-1">
            {isMember ? 'Masa Bekleme Odası' : 'Dedektif Masası'}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            {isMember
              ? 'Tüm dedektifler bağlandığında Masa Şefi oyunu başlatır.'
              : 'Davet alan dedektifler boş koltuklara isimlerini yazarak doğrudan oturabilir.'}
          </p>
        </div>

        {/* Structured Diagnostic Error Alert */}
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
                    🔧 Google Girişini Yetkilendirmek İçin:
                  </span>
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

        {/* =========================================================================
            STATE 1: USER IS ALREADY A JOINED MEMBER -> SYNCHRONIZED LOBBY
           ========================================================================= */}
        {isMember && currentRoom ? (
          <div className="mt-5 space-y-4">
            {/* Room Code Card */}
            <div className="p-4 bg-emerald-950/20 border border-emerald-600/40 rounded-2xl text-center">
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block">
                MASA ODA KODU:
              </span>
              <div className="text-3xl font-black font-mono text-emerald-300 tracking-[0.2em] my-1">
                {currentRoom.roomCode}
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 mt-1">
                <span>Masa Şefi: <strong className="text-zinc-200">{currentRoom.hostName}</strong></span>
                <span>·</span>
                <span className={`font-mono font-bold ${isRoomFull ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {roomMembers.length} / {currentRoom.playerCount} Dedektif Masada
                </span>
              </div>
            </div>

            {/* WhatsApp Invite Actions */}
            <div className="space-y-2">
              <a
                href={getWhatsAppShareUrl(currentRoom.roomCode)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg hover:shadow-emerald-600/20"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>WhatsApp ile Arkadaşını Masaya Çağır</span>
              </a>

              <button
                type="button"
                onClick={() => handleCopyLink(currentRoom.roomCode)}
                className="w-full py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Davet Bağlantısı Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Davet Bağlantısını Kopyala</span>
                  </>
                )}
              </button>
            </div>

            {/* Seated Detectives List */}
            <div className="mt-4 pt-3 border-t border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
                  Masadaki Dedektifler ({roomMembers.length}/{currentRoom.playerCount}):
                </span>
                {isRoomFull ? (
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
                    Masa Tamamlandı ✓
                  </span>
                ) : (
                  <span className="text-[11px] text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded animate-pulse">
                    Boş Koltuk Var...
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {roomMembers.map((member) => {
                  const roleData = ROLES[member.role] || ROLES.forensics;
                  const isThisMe = currentUser && member.userId === currentUser.uid;
                  const isThisHost = member.userId === currentRoom.hostId;

                  return (
                    <div
                      key={member.userId}
                      className={`p-3 rounded-xl border flex items-center justify-between ${
                        isThisMe
                          ? 'bg-amber-950/30 border-amber-500/50'
                          : 'bg-zinc-900/60 border-zinc-800'
                      }`}
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
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-zinc-200 truncate">
                              {member.displayName}
                            </span>
                            {isThisHost && (
                              <span className="text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800/40 px-1 rounded flex items-center gap-0.5">
                                <Crown className="w-2.5 h-2.5" /> Şef
                              </span>
                            )}
                            {isThisMe && (
                              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1 rounded">
                                Siz
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-300 shrink-0">
                        {roleData.title}
                      </span>
                    </div>
                  );
                })}

                {/* Show vacant seats if room is not yet full */}
                {Array.from({ length: Math.max(0, currentRoom.playerCount - roomMembers.length) }).map((_, idx) => (
                  <div
                    key={`vacant-${idx}`}
                    className="p-3 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 flex items-center justify-between text-zinc-500"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full border border-dashed border-zinc-700 flex items-center justify-center text-xs">
                        ?
                      </div>
                      <span className="text-xs italic">Boş Dedektif Sandalyesi</span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-600">Davet Bekleniyor</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Host Controls OR Guest Waiting Panel */}
            <div className="pt-2 space-y-2">
              {isHost ? (
                /* Host Action: Start button activates once room is FULL */
                <div>
                  <button
                    type="button"
                    onClick={handleHostStartGame}
                    disabled={!isRoomFull || isSubmitting}
                    className={`w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-xl flex items-center justify-center gap-2 ${
                      isRoomFull && !isSubmitting
                        ? 'bg-amber-600 hover:bg-amber-500 text-zinc-950 ring-2 ring-amber-400/50 animate-pulse cursor-pointer'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 fill-current" />
                    )}
                    <span>
                      {isRoomFull
                        ? `✓ Masa Hazır (${roomMembers.length}/${currentRoom.playerCount}) - Vakayı Masaya Aç`
                        : `Arkadaşınız Bekleniyor (${roomMembers.length}/${currentRoom.playerCount})`}
                    </span>
                  </button>
                  {!isRoomFull && (
                    <p className="text-[11px] text-center text-zinc-400 mt-2">
                      * Oyunu başlatmak için arkadaşınızın WhatsApp linkiyle boş koltuğa oturması gerekir.
                    </p>
                  )}
                </div>
              ) : (
                /* Guest View: Waiting for Host to Launch */
                <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-400">
                    <Radio className="w-4 h-4 animate-ping text-amber-500" />
                    <span>
                      {isRoomFull
                        ? `🎉 Masa Doldu! Masa Şefi (${currentRoom.hostName}) Vakayı Açıyor...`
                        : `Diğer Dedektifin Masaya Oturması Bekleniyor (${roomMembers.length}/${currentRoom.playerCount})...`}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Oda sahibi &quot;Vakayı Aç&quot; dediğinde vaka dosyası telefonunuzda otomatik olarak açılacaktır.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleLeaveRoom}
                className="w-full py-2 text-xs text-zinc-500 hover:text-rose-400 transition-colors"
              >
                Masadan Ayrıl
              </button>
            </div>
          </div>
        ) : (
          /* =========================================================================
              STATE 2: NOT A MEMBER YET -> TABS: CREATE OR JOIN VIA EMPTY SEATS
             ========================================================================= */
          <div className="mt-5 space-y-4">
            
            {/* Tab switchers (only if not directly navigating to an invite link) */}
            {!initialRoomCode && (
              <div className="flex rounded-xl bg-zinc-900 p-1 border border-zinc-800 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playKeyClick();
                    setActiveTab('create');
                    setActionError(null);
                  }}
                  className={`flex-1 py-2 font-bold rounded-lg transition-colors ${
                    activeTab === 'create'
                      ? 'bg-amber-600 text-zinc-950'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Yeni Masa Kur (Masa Şefi)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playKeyClick();
                    setActiveTab('join');
                    setActionError(null);
                  }}
                  className={`flex-1 py-2 font-bold rounded-lg transition-colors ${
                    activeTab === 'join'
                      ? 'bg-amber-600 text-zinc-950'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Boş Koltuğa Otur (Davetli)
                </button>
              </div>
            )}

            {/* -------------------------------------------------------------------
                TAB A: CREATE ROOM (Strictly requires Google login for the Host)
               ------------------------------------------------------------------- */}
            {activeTab === 'create' && !initialRoomCode && (
              <div className="space-y-4">
                {!isGoogleUser ? (
                  /* Creator must sign in with Google */
                  <div className="p-4 bg-gradient-to-br from-amber-950/40 to-zinc-900/90 border border-amber-500/50 rounded-2xl text-center space-y-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center mx-auto text-amber-400">
                      <Crown className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-amber-300">
                        Masa Şefi (Kurucu) Doğrulaması
                      </h4>
                      <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                        Masayı kuracak dedektif için Google hesabı zorunludur. Davet edeceğiniz arkadaşlarınız ise <strong>Google hesabı olmadan</strong>, doğrudan isimlerini yazarak masaya katılabileceklerdir.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleGoogleLogin(false)}
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 bg-white hover:bg-zinc-200 text-zinc-900 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
                      ) : (
                        <LogIn className="w-4 h-4 text-zinc-900" />
                      )}
                      <span>Google ile Giriş Yap ve Masayı Kur</span>
                    </button>
                  </div>
                ) : (
                  /* Google-Verified Creator Controls */
                  <div className="space-y-4">
                    {/* Host Profile Card */}
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {currentUser?.photoURL ? (
                          <img
                            src={currentUser.photoURL}
                            alt={currentUser.displayName || 'Şef'}
                            className="w-8 h-8 rounded-full border border-amber-500"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-amber-600 text-zinc-950 font-bold flex items-center justify-center text-xs">
                            {currentUser?.displayName ? currentUser.displayName[0] : 'Ş'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-zinc-100 truncate">
                            {currentUser?.displayName}
                          </p>
                          <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Masa Şefi (Google Doğrulamalı)
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={logoutUser}
                        className="text-[11px] text-zinc-400 hover:text-rose-400 px-2 py-1 rounded bg-zinc-950 border border-zinc-800"
                      >
                        Değiştir
                      </button>
                    </div>

                    {/* Player Count Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-mono uppercase tracking-wider text-amber-300 block">
                          Masada Kaç Dedektif Olacak?
                        </label>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          {modalPlayerCount === 2 ? '⚡ 2 KİŞİ (İKİLİ ORTAKLIK)' : `${modalPlayerCount} KİŞİ`}
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
                              if (cnt === 2 && hostSelectedRole !== 'forensics' && hostSelectedRole !== 'profiler') {
                                setHostSelectedRole('forensics');
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
                    </div>

                    {/* Host's Own Role Selection */}
                    <div>
                      <label className="text-xs font-mono uppercase tracking-wider text-amber-300 block mb-1.5">
                        Kendi Uzmanlık Alanınızı Seçin:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeRoles.map((roleKey) => {
                          const role = ROLES[roleKey];
                          const isSelected = hostSelectedRole === roleKey;
                          return (
                            <button
                              key={roleKey}
                              type="button"
                              onClick={() => {
                                soundManager.playKeyClick();
                                setHostSelectedRole(roleKey);
                              }}
                              className={`p-3 rounded-xl border text-left transition-all ${
                                isSelected
                                  ? 'bg-amber-950/70 border-amber-500 text-amber-200 ring-1 ring-amber-500'
                                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs font-bold">
                                <span>{role.title}</span>
                                {isSelected && <span className="text-[10px] text-emerald-400">✓ Şef Rolü</span>}
                              </div>
                              <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                                {role.shortDesc}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Create Room Button */}
                    <button
                      type="button"
                      onClick={handleCreateRoom}
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                      <span>Masayı Kur & WhatsApp Davet Bağlantısı Al</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* -------------------------------------------------------------------
                TAB B: JOIN ROOM VIA EMPTY SEATS (Zero Google Login Required!)
               ------------------------------------------------------------------- */}
            {(activeTab === 'join' || initialRoomCode) && (
              <div className="space-y-4">
                
                {/* Room Code Search (if not pre-filled by link) */}
                {!initialRoomCode && (
                  <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-2">
                    <label className="text-xs text-zinc-300 block">
                      Arkadaşınızın Paylaştığı 6 Haneli Masa Kodu:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={joinCodeInput}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase();
                          setJoinCodeInput(val);
                          if (val.length >= 6) {
                            loadRoomForInspection(val);
                          }
                        }}
                        placeholder="Örn: KND-884"
                        maxLength={10}
                        className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-sm font-mono tracking-widest text-center text-zinc-100 uppercase focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => loadRoomForInspection(joinCodeInput)}
                        disabled={isInspecting}
                        className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                      >
                        {isInspecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                        <span>Masayı Bul</span>
                      </button>
                    </div>
                  </div>
                )}

                {inspectError && (
                  <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300 text-center">
                    {inspectError}
                  </div>
                )}

                {/* Target Room Details & Detective Seats Grid */}
                {inspectedRoom ? (
                  <div className="space-y-3">
                    {/* Room Info Header */}
                    <div className="p-3 bg-emerald-950/20 border border-emerald-600/40 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
                          MASA: {inspectedRoom.roomCode}
                        </span>
                        <h4 className="text-xs font-bold text-zinc-100 mt-0.5">
                          Masa Şefi: {inspectedRoom.hostName}
                        </h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-300 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
                        {inspectedMembers.length} / {inspectedRoom.playerCount} Koltuk Dolu
                      </span>
                    </div>

                    {/* Detective Seats Header */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-mono uppercase tracking-wider text-amber-300 block">
                        Masa Koltukları (Boş Koltuğa İsminizi Yazıp Oturun):
                      </span>
                    </div>

                    {/* Seats Cards */}
                    <div className="space-y-2.5">
                      {activeRoles.map((roleKey) => {
                        const role = ROLES[roleKey] || ROLES.forensics;
                        const occupiedBy = inspectedMembers.find((m) => m.role === roleKey);
                        const isOccupied = Boolean(occupiedBy);
                        const isOccupiedByMe = currentUser && occupiedBy?.userId === currentUser.uid;
                        const currentInputName = seatNameInputs[roleKey] !== undefined 
                          ? seatNameInputs[roleKey] 
                          : currentUser?.displayName || '';

                        return (
                          <div
                            key={roleKey}
                            className={`p-3.5 rounded-2xl border transition-all ${
                              isOccupied
                                ? isOccupiedByMe
                                  ? 'bg-amber-950/30 border-amber-500/60'
                                  : 'bg-zinc-900/40 border-zinc-800/80 opacity-80'
                                : 'bg-gradient-to-br from-zinc-900/90 to-zinc-950 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                            }`}
                          >
                            <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
                              <div className="flex items-center gap-2">
                                <Armchair className={`w-4 h-4 ${isOccupied ? 'text-zinc-500' : 'text-emerald-400'}`} />
                                <span className={`text-xs font-bold ${isOccupied ? 'text-zinc-300' : 'text-zinc-100'}`}>
                                  {role.title}
                                </span>
                              </div>

                              {isOccupied ? (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                                  ✓ {occupiedBy?.displayName} ({occupiedBy?.userId === inspectedRoom.hostId ? 'Şef' : 'Oturdu'})
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800 font-bold">
                                  🟢 BOŞ KOLTUK
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-zinc-400 mt-2 leading-snug">
                              {role.shortDesc}
                            </p>

                            {/* If Seat is Empty: Direct Name Input & Sit Button */}
                            {!isOccupied && (
                              <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex flex-col sm:flex-row gap-2">
                                <input
                                  type="text"
                                  value={currentInputName}
                                  onChange={(e) => {
                                    setSeatNameInputs((prev) => ({
                                      ...prev,
                                      [roleKey]: e.target.value,
                                    }));
                                  }}
                                  placeholder="Dedektif Adınız (Örn: Selim)"
                                  maxLength={24}
                                  className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 font-medium"
                                />

                                <button
                                  type="button"
                                  onClick={() => handleClaimSeat(roleKey)}
                                  disabled={isSubmitting}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0"
                                >
                                  {isSubmitting && submittingRole === roleKey ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <UserCheck className="w-3.5 h-3.5" />
                                  )}
                                  <span>Bu Koltuğa Otur & Katıl</span>
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  !initialRoomCode && (
                    <div className="p-8 text-center text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-2xl">
                      Yukarıdaki kutuya arkadaşınızın gönderdiği 6 haneli oda kodunu girin.
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
