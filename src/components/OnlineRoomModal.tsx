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

  const activeScenarioTitle =
    scenarios.find((s) => s.id === (currentRoom?.scenarioId || selectedScenarioId))?.title ||
    'Suç Dosyası';

  const getInviteMessage = (roomCode: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://davadosyasi.vercel.app';
    const inviteUrl = `${origin}/?room=${roomCode}`;
    return {
      inviteUrl,
      text: `🔎 Suç Dosyası - Dedektiflik Daveti!\n\nSeninle "${activeScenarioTitle}" dosyasını çözeceğiz.\n\n📲 Masaya Bağlan:\n1. Linke tıkla: ${inviteUrl}\n2. Adını yaz ve boş koltuğa otur!\n\n(Oda Kodu: ${roomCode})`,
    };
  };

  // WhatsApp Share URL generator
  const getWhatsAppShareUrl = (roomCode: string) => {
    const { text } = getInviteMessage(roomCode);
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  const handleNativeShare = async (roomCode: string) => {
    soundManager.playKeyClick();
    const { inviteUrl, text } = getInviteMessage(roomCode);
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Suç Dosyası · ${activeScenarioTitle}`,
          text,
          url: inviteUrl,
        });
        return;
      } catch {
        // user cancelled or unsupported -> fall back to clipboard
      }
    }
    handleCopyLink(roomCode);
  };

  const handleCopyLink = (roomCode: string) => {
    const { inviteUrl } = getInviteMessage(roomCode);
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
    <div className="fixed inset-0 z-50 bg-[#1f1c18]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#faf6ed] border border-[#1f1c18] rounded-sm max-w-lg w-full p-5 sm:p-6 shadow-[0_12px_36px_rgba(31,28,24,0.22)] relative text-[#1f1c18] max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#575046] hover:text-[#1f1c18] transition-colors rounded-sm bg-[#fffdf8] border border-[#c8bfae] cursor-pointer"
          aria-label="Kapat"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-3 border-b border-[#d6cdbc]">
          <div className="w-11 h-11 bg-[#fffdf8] border border-[#1f1c18] rounded-sm flex items-center justify-center mx-auto mb-2 text-[#8b1e1e]">
            <Smartphone className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-typewriter text-[#8b1e1e] uppercase tracking-widest block font-bold">
            ÇOKLU TELEFON SENKRONİZASYONU
          </span>
          <h3 className="text-lg sm:text-xl font-bold font-typewriter text-[#1f1c18] mt-1">
            {isMember ? 'Masa Bekleme Odası' : 'Dedektif Masası'}
          </h3>
          <p className="text-xs text-[#575046] mt-1 leading-relaxed">
            {isMember
              ? 'Tüm dedektifler bağlandığında Masa Şefi oyunu başlatır.'
              : 'Davet alan dedektifler boş koltuklara isimlerini yazarak doğrudan oturabilir.'}
          </p>
        </div>

        {/* Structured Diagnostic Error Alert */}
        {authError && (
          <div className="mt-3.5 p-3.5 bg-[#fffdf8] border border-[#8b1e1e] rounded-sm text-xs text-[#8b1e1e] space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{authError.title}</span>
            </div>
            
            <p className="text-[11px] leading-relaxed text-[#575046]">
              {authError.message}
            </p>

            {authError.code === 'auth/unauthorized-domain' && (
              <div className="pt-1 border-t border-[#d6cdbc] space-y-2 text-[11px]">
                <div className="bg-[#ebe5d8] p-2.5 rounded-sm border border-[#c8bfae] space-y-1.5">
                  <span className="font-semibold text-[#1f1c18] block">
                    Google Girişini Yetkilendirmek İçin:
                  </span>
                  <div className="flex items-center justify-between gap-2 bg-[#fffdf8] p-1.5 rounded-sm border border-[#c8bfae]">
                    <code className="font-typewriter text-[11px] text-[#276749] truncate">
                      {currentHostname}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyHostname}
                      className="px-2 py-1 bg-[#1f1c18] text-[#faf6ed] rounded-sm text-[10px] font-typewriter flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      {copiedDomain ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
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
          <div className="mt-3 p-3 bg-[#fffdf8] border border-[#8b1e1e] rounded-sm text-xs text-[#8b1e1e]">
            {actionError}
          </div>
        )}

        {/* =========================================================================
            STATE 1: USER IS ALREADY A JOINED MEMBER -> SYNCHRONIZED LOBBY
           ========================================================================= */}
        {isMember && currentRoom ? (
          <div className="mt-5 space-y-4">
            {/* Room Code Card */}
            <div className="p-4 bg-[#fffdf8] border border-[#1f1c18] rounded-sm text-center">
              <span className="text-[11px] font-typewriter text-[#7c7265] uppercase tracking-wider block">
                MASA ODA KODU:
              </span>
              <div className="text-3xl font-black font-typewriter text-[#8b1e1e] tracking-[0.2em] my-1">
                {currentRoom.roomCode}
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-[#575046] mt-1">
                <span>Masa Şefi: <strong className="text-[#1f1c18]">{currentRoom.hostName}</strong></span>
                <span>·</span>
                <span className={`font-typewriter font-bold ${isRoomFull ? 'text-[#276749]' : 'text-[#8b1e1e]'}`}>
                  {roomMembers.length} / {currentRoom.playerCount} Dedektif Masada
                </span>
              </div>
            </div>

            {/* WhatsApp & Native Share Invite Actions */}
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href={getWhatsAppShareUrl(currentRoom.roomCode)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-[#276749] hover:bg-[#1f543b] text-[#faf6ed] font-typewriter font-bold rounded-sm text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp ile Davet Et</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleNativeShare(currentRoom.roomCode)}
                  className="w-full py-2.5 px-4 bg-[#1f1c18] hover:bg-[#8b1e1e] text-[#faf6ed] font-typewriter font-bold rounded-sm text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Diğer Uygulamalarla Paylaş</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleCopyLink(currentRoom.roomCode)}
                className="w-full py-2.5 px-3 bg-[#fffdf8] hover:bg-[#ebe5d8] border border-[#c8bfae] text-[#1f1c18] font-typewriter rounded-sm text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-[#276749]" />
                    <span className="text-[#276749] font-semibold">Davet Bağlantısı Kopyalandı!</span>
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
            <div className="mt-4 pt-3 border-t border-[#d6cdbc]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-typewriter text-[#575046] uppercase tracking-wider block">
                  Masadaki Dedektifler ({roomMembers.length}/{currentRoom.playerCount}):
                </span>
                {isRoomFull ? (
                  <span className="text-[11px] font-bold font-typewriter text-[#276749] bg-[#fffdf8] border border-[#276749] px-2 py-0.5 rounded-sm">
                    Masa Tamamlandı ✓
                  </span>
                ) : (
                  <span className="text-[11px] font-typewriter text-[#8b1e1e] bg-[#fffdf8] border border-[#8b1e1e]/40 px-2 py-0.5 rounded-sm animate-pulse">
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
                      className={`p-3 rounded-sm border flex items-center justify-between ${
                        isThisMe
                          ? 'bg-[#fffdf8] border-[#1f1c18]'
                          : 'bg-[#ebe5d8]/60 border-[#d6cdbc]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {member.photoURL ? (
                          <img
                            src={member.photoURL}
                            alt={member.displayName}
                            className="w-7 h-7 rounded-full border border-[#c8bfae]"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[#1f1c18] text-[#faf6ed] text-xs font-bold flex items-center justify-center">
                            {member.displayName ? member.displayName[0] : 'D'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#1f1c18] truncate">
                              {member.displayName}
                            </span>
                            {isThisHost && (
                              <span className="text-[10px] text-[#8b1e1e] bg-[#fffdf8] border border-[#8b1e1e]/40 px-1 rounded-sm flex items-center gap-0.5">
                                <Crown className="w-2.5 h-2.5" /> Şef
                              </span>
                            )}
                            {isThisMe && (
                              <span className="text-[10px] text-[#276749] bg-[#fffdf8] border border-[#276749]/40 px-1 rounded-sm">
                                Siz
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className="text-[11px] font-typewriter px-2 py-0.5 rounded-sm bg-[#fffdf8] border border-[#c8bfae] text-[#1f1c18] shrink-0">
                        {roleData.title}
                      </span>
                    </div>
                  );
                })}

                {/* Show vacant seats if room is not yet full */}
                {Array.from({ length: Math.max(0, currentRoom.playerCount - roomMembers.length) }).map((_, idx) => (
                  <div
                    key={`vacant-${idx}`}
                    className="p-3 rounded-sm border border-dashed border-[#c8bfae] bg-[#fffdf8]/60 flex items-center justify-between text-[#7c7265]"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full border border-dashed border-[#c8bfae] flex items-center justify-center text-xs">
                        ?
                      </div>
                      <span className="text-xs italic">Boş Dedektif Sandalyesi</span>
                    </div>
                    <span className="text-[11px] font-typewriter text-[#7c7265]">Davet Bekleniyor</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Host Controls OR Guest Waiting Panel */}
            <div className="pt-2 space-y-2">
              {isHost ? (
                <div>
                  <button
                    type="button"
                    onClick={handleHostStartGame}
                    disabled={!isRoomFull || isSubmitting}
                    className={`w-full py-3 rounded-sm text-xs font-typewriter font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                      isRoomFull && !isSubmitting
                        ? 'bg-[#8b1e1e] hover:bg-[#1f1c18] text-[#faf6ed] cursor-pointer'
                        : 'bg-[#d6cdbc] text-[#7c7265] cursor-not-allowed border border-[#c8bfae]'
                    }`}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 fill-current" />
                    )}
                    <span>
                      {isRoomFull
                        ? `Masa Hazır (${roomMembers.length}/${currentRoom.playerCount}) - Vakayı Masaya Aç`
                        : `Arkadaşınız Bekleniyor (${roomMembers.length}/${currentRoom.playerCount})`}
                    </span>
                  </button>
                  {!isRoomFull && (
                    <p className="text-[11px] text-center text-[#575046] mt-2">
                      * Oyunu başlatmak için arkadaşınızın davet linkiyle boş koltuğa oturması gerekir.
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-3.5 bg-[#fffdf8] border border-[#d6cdbc] rounded-sm text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#8b1e1e]">
                    <Radio className="w-4 h-4 animate-ping text-[#8b1e1e]" />
                    <span>
                      {isRoomFull
                        ? `Masa Doldu! Masa Şefi (${currentRoom.hostName}) Vakayı Açıyor...`
                        : `Diğer Dedektifin Masaya Oturması Bekleniyor (${roomMembers.length}/${currentRoom.playerCount})...`}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#575046]">
                    Oda sahibi &quot;Vakayı Aç&quot; dediğinde vaka dosyası telefonunuzda otomatik olarak açılacaktır.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleLeaveRoom}
                className="w-full py-2 text-xs font-typewriter text-[#7c7265] hover:text-[#8b1e1e] transition-colors cursor-pointer"
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
            
            {!initialRoomCode && (
              <div className="flex border-b border-[#d6cdbc] text-xs font-typewriter">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playKeyClick();
                    setActiveTab('create');
                    setActionError(null);
                  }}
                  className={`flex-1 py-2.5 font-bold border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'create'
                      ? 'border-[#1f1c18] text-[#1f1c18]'
                      : 'border-transparent text-[#7c7265] hover:text-[#1f1c18]'
                  }`}
                >
                  Yeni Masa Kur (Şef)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playKeyClick();
                    setActiveTab('join');
                    setActionError(null);
                  }}
                  className={`flex-1 py-2.5 font-bold border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'join'
                      ? 'border-[#1f1c18] text-[#1f1c18]'
                      : 'border-transparent text-[#7c7265] hover:text-[#1f1c18]'
                  }`}
                >
                  Boş Koltuğa Otur (Davetli)
                </button>
              </div>
            )}

            {/* TAB A: CREATE ROOM */}
            {activeTab === 'create' && !initialRoomCode && (
              <div className="space-y-4">
                {!isGoogleUser ? (
                  <div className="p-4 bg-[#fffdf8] border border-[#1f1c18] rounded-sm text-center space-y-3">
                    <div className="w-10 h-10 rounded-sm bg-[#ebe5d8] border border-[#1f1c18] flex items-center justify-center mx-auto text-[#8b1e1e]">
                      <Crown className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold font-typewriter text-[#1f1c18]">
                        Masa Şefi (Kurucu) Doğrulaması
                      </h4>
                      <p className="text-xs text-[#575046] mt-1 leading-relaxed">
                        Masayı kuracak dedektif için Google hesabı zorunludur. Davet edeceğiniz arkadaşlarınız ise <strong>hesap açmadan</strong>, doğrudan isimlerini yazarak masaya katılabilir.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleGoogleLogin(false)}
                      disabled={isSubmitting}
                      className="w-full py-2.5 px-4 bg-[#1f1c18] hover:bg-[#8b1e1e] text-[#faf6ed] font-typewriter font-bold rounded-sm text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <LogIn className="w-4 h-4" />
                      )}
                      <span>Google ile Giriş Yap ve Masayı Kur</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Host Profile Card */}
                    <div className="p-3 bg-[#fffdf8] border border-[#d6cdbc] rounded-sm flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {currentUser?.photoURL ? (
                          <img
                            src={currentUser.photoURL}
                            alt={currentUser.displayName || 'Şef'}
                            className="w-8 h-8 rounded-full border border-[#c8bfae]"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#1f1c18] text-[#faf6ed] font-bold flex items-center justify-center text-xs">
                            {currentUser?.displayName ? currentUser.displayName[0] : 'Ş'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#1f1c18] truncate">
                            {currentUser?.displayName}
                          </p>
                          <p className="text-[10px] text-[#276749] flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Masa Şefi (Doğrulamalı)
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={logoutUser}
                        className="text-[11px] font-typewriter text-[#575046] hover:text-[#8b1e1e] px-2 py-1 rounded-sm bg-[#ebe5d8] border border-[#c8bfae] cursor-pointer"
                      >
                        Değiştir
                      </button>
                    </div>

                    {/* Player Count Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-typewriter uppercase tracking-wider text-[#1f1c18] font-bold block">
                          Masada Kaç Dedektif Olacak?
                        </label>
                        <span className="text-[10px] text-[#276749] font-typewriter font-bold">
                          {modalPlayerCount === 2 ? '2 KİŞİ (İKİLİ ORTAKLIK)' : `${modalPlayerCount} KİŞİ`}
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
                            className={`flex-1 py-2 rounded-sm text-xs font-typewriter font-bold border transition-colors cursor-pointer ${
                              modalPlayerCount === cnt
                                ? 'bg-[#1f1c18] text-[#faf6ed] border-[#1f1c18]'
                                : 'bg-[#fffdf8] border-[#c8bfae] text-[#1f1c18] hover:border-[#1f1c18]'
                            }`}
                          >
                            {cnt} Kişi
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Host's Own Role Selection */}
                    <div>
                      <label className="text-xs font-typewriter uppercase tracking-wider text-[#1f1c18] font-bold block mb-1.5">
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
                              className={`p-3 rounded-sm border text-left transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-[#fffdf8] border-[#8b1e1e] text-[#1f1c18]'
                                  : 'bg-[#ebe5d8]/50 border-[#d6cdbc] text-[#4a443c] hover:border-[#1f1c18]'
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs font-bold">
                                <span>{role.title}</span>
                                {isSelected && <span className="text-[10px] text-[#8b1e1e] font-typewriter">✓ Şef Rolü</span>}
                              </div>
                              <p className="text-[11px] text-[#575046] mt-1 leading-snug">
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
                      className="w-full py-3 bg-[#1f1c18] hover:bg-[#8b1e1e] text-[#faf6ed] font-typewriter font-bold uppercase tracking-wider rounded-sm text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                      <span>Masayı Kur &amp; Davet Bağlantısı Al</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB B: JOIN ROOM VIA EMPTY SEATS */}
            {(activeTab === 'join' || initialRoomCode) && (
              <div className="space-y-4">
                
                {!initialRoomCode && (
                  <div className="p-3 bg-[#fffdf8] border border-[#d6cdbc] rounded-sm space-y-2">
                    <label className="text-xs font-typewriter text-[#1f1c18] block">
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
                        className="flex-1 px-3 py-2 bg-[#faf6ed] border border-[#c8bfae] rounded-sm text-sm font-typewriter tracking-widest text-center text-[#1f1c18] uppercase focus:outline-none focus:border-[#1f1c18]"
                      />
                      <button
                        type="button"
                        onClick={() => loadRoomForInspection(joinCodeInput)}
                        disabled={isInspecting}
                        className="px-3.5 py-2 bg-[#1f1c18] hover:bg-[#8b1e1e] text-[#faf6ed] font-typewriter font-bold rounded-sm text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        {isInspecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                        <span>Masayı Bul</span>
                      </button>
                    </div>
                  </div>
                )}

                {inspectError && (
                  <div className="p-3 bg-[#fffdf8] border border-[#8b1e1e] rounded-sm text-xs text-[#8b1e1e] text-center">
                    {inspectError}
                  </div>
                )}

                {inspectedRoom ? (
                  <div className="space-y-3">
                    {/* Room Info Header */}
                    <div className="p-3 bg-[#fffdf8] border border-[#1f1c18] rounded-sm flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-typewriter text-[#8b1e1e] uppercase tracking-widest block font-bold">
                          MASA: {inspectedRoom.roomCode}
                        </span>
                        <h4 className="text-xs font-bold text-[#1f1c18] mt-0.5">
                          Masa Şefi: {inspectedRoom.hostName}
                        </h4>
                      </div>
                      <span className="text-xs font-typewriter font-bold text-[#1f1c18] bg-[#ebe5d8] px-2.5 py-1 rounded-sm border border-[#c8bfae]">
                        {inspectedMembers.length} / {inspectedRoom.playerCount} Koltuk Dolu
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-typewriter uppercase tracking-wider text-[#1f1c18] font-bold block">
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
                            className={`p-3.5 rounded-sm border transition-colors ${
                              isOccupied
                                ? isOccupiedByMe
                                  ? 'bg-[#fffdf8] border-[#1f1c18]'
                                  : 'bg-[#ebe5d8]/60 border-[#d6cdbc] opacity-80'
                                : 'bg-[#fffdf8] border-[#276749]'
                            }`}
                          >
                            <div className="flex items-center justify-between pb-2 border-b border-[#d6cdbc]">
                              <div className="flex items-center gap-2">
                                <Armchair className={`w-4 h-4 ${isOccupied ? 'text-[#7c7265]' : 'text-[#276749]'}`} />
                                <span className="text-xs font-bold text-[#1f1c18]">
                                  {role.title}
                                </span>
                              </div>

                              {isOccupied ? (
                                <span className="text-[10px] font-typewriter px-2 py-0.5 rounded-sm bg-[#ebe5d8] text-[#575046] border border-[#c8bfae]">
                                  ✓ {occupiedBy?.displayName} ({occupiedBy?.userId === inspectedRoom.hostId ? 'Şef' : 'Oturdu'})
                                </span>
                              ) : (
                                <span className="text-[10px] font-typewriter px-2 py-0.5 rounded-sm bg-[#fffdf8] text-[#276749] border border-[#276749] font-bold">
                                  BOŞ KOLTUK
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-[#575046] mt-2 leading-snug">
                              {role.shortDesc}
                            </p>

                            {!isOccupied && (
                              <div className="mt-3 pt-2.5 border-t border-dashed border-[#d6cdbc] flex flex-col sm:flex-row gap-2">
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
                                  className="flex-1 px-3 py-2 bg-[#faf6ed] border border-[#c8bfae] rounded-sm text-xs text-[#1f1c18] placeholder:text-[#9c9284] focus:outline-none focus:border-[#1f1c18] font-medium"
                                />

                                <button
                                  type="button"
                                  onClick={() => handleClaimSeat(roleKey)}
                                  disabled={isSubmitting}
                                  className="px-4 py-2 bg-[#276749] hover:bg-[#1f543b] text-[#faf6ed] font-typewriter font-bold rounded-sm text-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0"
                                >
                                  {isSubmitting && submittingRole === roleKey ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <UserCheck className="w-3.5 h-3.5" />
                                  )}
                                  <span>Bu Koltuğa Otur &amp; Katıl</span>
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
                    <div className="p-8 text-center text-[#7c7265] text-xs border border-dashed border-[#c8bfae] rounded-sm">
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
