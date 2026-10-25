/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signInAnonymously,
  updateProfile,
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocFromServer,
  getDocs,
  collection, 
  onSnapshot, 
  updateDoc, 
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { RoleType, SharedPin, AccusationSubmission } from '../types';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Test connection on boot per Firebase skill guidelines
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client offline, check network.');
    }
    return false;
  }
}

export interface AuthErrorInfo {
  code: string;
  title: string;
  message: string;
  solution?: string;
}

export function parseFirebaseAuthError(err: any): AuthErrorInfo {
  const code = err?.code || '';
  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'davadosyasi.vercel.app';

  if (code === 'auth/unauthorized-domain') {
    return {
      code,
      title: 'Yetkisiz Alan Adı (auth/unauthorized-domain)',
      message: `Firebase Authentication, "${currentHost}" adresinden gelen Google OAuth giriş isteklerini henüz onaylamadı.`,
      solution: `Firebase Console -> Authentication -> Settings -> "Authorized domains" listesine "${currentHost}" (ve "vercel.app") adresini eklemeniz gerekir. Hemen oynamak için aşağıdaki "Dedektif İsmiyle Katıl" seçeneğini kullanabilirsiniz.`,
    };
  }

  if (code === 'auth/popup-blocked') {
    return {
      code,
      title: 'Açılır Pencere Engellendi (auth/popup-blocked)',
      message: 'Mobil tarayıcınız Google giriş penceresinin açılmasını engelledi.',
      solution: 'Tarayıcınızın adres çubuğundaki engellenen pencere bildirimine dokunup "İzin Ver"i seçin veya "Sayfa Yönlendirmesi (Redirect)" ile giriş yapın.',
    };
  }

  if (code === 'auth/popup-closed-by-user') {
    return {
      code,
      title: 'Giriş Penceresi Kapatıldı',
      message: 'Google giriş penceresi işlem tamamlanmadan kapatıldı.',
      solution: 'Tekrar giriş butonuna basarak Google hesabınızı seçin.',
    };
  }

  if (code === 'auth/operation-not-allowed' || code === 'auth/admin-restricted-operation') {
    return {
      code,
      title: 'Oturum Açma Yöntemi Kapalı',
      message: 'Firebase konsolunda bu oturum açma yöntemi (Google veya Anonim) henüz aktif edilmemiş.',
      solution: 'Firebase Console -> Authentication -> Sign-in method sekmesinden ilgili sağlayıcıyı etkinleştirin.',
    };
  }

  return {
    code: code || 'auth/unknown',
    title: 'Giriş Başarısız',
    message: err?.message || 'Giriş yapılırken beklenmeyen bir hata oluştu.',
    solution: 'İnternet bağlantınızı kontrol edin veya hızlı dedektif ismiyle katılın.',
  };
}

export interface DetectiveProfile {
  uid: string;
  displayName: string;
  photoURL?: string;
  isGuest?: boolean;
  isAnonymous?: boolean;
  email?: string;
}

// Global subscriber for unified auth state
type AuthListener = (user: DetectiveProfile | null) => void;
const authListeners: Set<AuthListener> = new Set();
let cachedDetectiveUser: DetectiveProfile | null = null;

function notifyAuthListeners(user: DetectiveProfile | null) {
  cachedDetectiveUser = user;
  authListeners.forEach((cb) => cb(user));
}

// Initialize guest from localStorage on client load
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('detective_local_user');
    if (saved) {
      cachedDetectiveUser = JSON.parse(saved);
    }
  } catch (e) {
    // Ignore JSON parse errors
  }
}

export function subscribeToDetectiveAuth(callback: AuthListener): () => void {
  authListeners.add(callback);
  callback(cachedDetectiveUser);

  const unsubFirebase = onAuthStateChanged(auth, (user) => {
    if (user) {
      const profile: DetectiveProfile = {
        uid: user.uid,
        displayName: user.displayName || 'Dedektif',
        photoURL: user.photoURL || '',
        email: user.email || '',
        isAnonymous: user.isAnonymous,
        isGuest: false,
      };
      notifyAuthListeners(profile);
    } else {
      // If Firebase auth is null, check if local guest user exists
      let localGuest: DetectiveProfile | null = null;
      try {
        const saved = localStorage.getItem('detective_local_user');
        if (saved) localGuest = JSON.parse(saved);
      } catch (e) {}
      notifyAuthListeners(localGuest);
    }
  });

  return () => {
    authListeners.delete(callback);
    unsubFirebase();
  };
}

// Google Sign-In via Popup or Redirect
export async function loginWithGoogle(useRedirect: boolean = false): Promise<DetectiveProfile | null> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  if (useRedirect) {
    await signInWithRedirect(auth, provider);
    return null;
  }

  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const profile: DetectiveProfile = {
    uid: user.uid,
    displayName: user.displayName || 'Dedektif',
    photoURL: user.photoURL || '',
    email: user.email || '',
    isAnonymous: false,
    isGuest: false,
  };

  // Clear guest local storage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('detective_local_user');
  }

  // Persist user profile document in Firestore
  try {
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      displayName: user.displayName || 'Dedektif',
      email: user.email || '',
      photoURL: user.photoURL || '',
      createdAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.error('Failed to save user profile:', err);
  }

  notifyAuthListeners(profile);
  return profile;
}

// Check redirect result for mobile browsers returning from Google OAuth
export async function checkRedirectResult(): Promise<DetectiveProfile | null> {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      const user = result.user;
      const profile: DetectiveProfile = {
        uid: user.uid,
        displayName: user.displayName || 'Dedektif',
        photoURL: user.photoURL || '',
        email: user.email || '',
        isAnonymous: false,
        isGuest: false,
      };
      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          displayName: user.displayName || 'Dedektif',
          email: user.email || '',
          photoURL: user.photoURL || '',
          createdAt: new Date().toISOString(),
        }, { merge: true });
      } catch (err) {
        console.error('Failed to save redirected user profile:', err);
      }
      notifyAuthListeners(profile);
      return profile;
    }
  } catch (err) {
    console.error('Error handling redirect sign-in result:', err);
    throw err;
  }
  return null;
}

// Fast Detective Nickname Login (Instant Guest Profile with Resilient Storage)
export async function loginWithGuestName(displayName: string): Promise<DetectiveProfile> {
  const cleanName = displayName.trim() || 'Dedektif';
  
  // Try anonymous auth first if available
  let firebaseUid: string | null = null;
  try {
    const userCredential = await signInAnonymously(auth);
    if (userCredential?.user) {
      firebaseUid = userCredential.user.uid;
      try {
        await updateProfile(userCredential.user, { displayName: cleanName });
      } catch (e) {}
    }
  } catch (e) {
    // If anonymous auth is disabled on project, fall back to robust local guest UID
    console.info('Anonymous sign-in not enabled on project; using persistent guest UID fallback.');
  }

  let finalUid = firebaseUid;
  if (!finalUid) {
    let localSavedUid: string | null = null;
    try {
      localSavedUid = localStorage.getItem('detective_guest_uid');
    } catch (e) {}

    if (!localSavedUid) {
      localSavedUid = `guest_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
      try {
        localStorage.setItem('detective_guest_uid', localSavedUid);
      } catch (e) {}
    }
    finalUid = localSavedUid;
  }

  const profile: DetectiveProfile = {
    uid: finalUid,
    displayName: cleanName,
    isGuest: true,
    isAnonymous: true,
  };

  try {
    localStorage.setItem('detective_local_user', JSON.stringify(profile));
  } catch (e) {}

  try {
    await setDoc(doc(db, 'users', finalUid), {
      uid: finalUid,
      displayName: cleanName,
      isGuest: true,
      createdAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn('Could not write guest document to Firestore:', err);
  }

  notifyAuthListeners(profile);
  return profile;
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (e) {}
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('detective_local_user');
      localStorage.removeItem('detective_guest_uid');
    } catch (e) {}
  }
  notifyAuthListeners(null);
}

// Room Data Types
export interface OnlineRoom {
  roomCode: string;
  hostId: string;
  hostName: string;
  scenarioId: string;
  playerCount: number;
  currentEnvelope: 1 | 2 | 3 | 4;
  status: 'lobby' | 'playing' | 'accusation' | 'finished';
  gateAttempts: number;
  debateStartedAt?: number | null;
  createdAt: string;
  updatedAt?: string;
}

export interface OnlineMember {
  userId: string;
  displayName: string;
  photoURL?: string;
  role: RoleType;
  joinedAt: string;
}

// Generate human-friendly 6-char room code (e.g. KND-884)
export function generateRoomCode(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const prefix = Array.from({ length: 3 })
    .map(() => letters[Math.floor(Math.random() * letters.length)])
    .join('');
  const num = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${num}`;
}

// Create a new online investigation room
export async function createOnlineRoom(params: {
  hostUser: DetectiveProfile | User;
  scenarioId: string;
  playerCount: number;
  hostRole: RoleType;
}): Promise<string> {
  const roomCode = generateRoomCode();
  const roomRef = doc(db, 'rooms', roomCode);

  const roomData: OnlineRoom = {
    roomCode,
    hostId: params.hostUser.uid,
    hostName: params.hostUser.displayName || 'Masa Şefi',
    scenarioId: params.scenarioId,
    playerCount: params.playerCount,
    currentEnvelope: 1,
    status: 'lobby',
    gateAttempts: 0,
    createdAt: new Date().toISOString(),
  };

  await setDoc(roomRef, roomData);

  // Add host as first member with their role
  const memberRef = doc(db, 'rooms', roomCode, 'members', params.hostUser.uid);
  const memberData: OnlineMember = {
    userId: params.hostUser.uid,
    displayName: params.hostUser.displayName || 'Masa Şefi',
    photoURL: params.hostUser.photoURL || '',
    role: params.hostRole,
    joinedAt: new Date().toISOString(),
  };
  await setDoc(memberRef, memberData);

  return roomCode;
}

// Join an existing room
export async function joinOnlineRoom(params: {
  roomCode: string;
  user: DetectiveProfile | User;
  desiredRole: RoleType;
}): Promise<{ success: boolean; error?: string }> {
  const cleanCode = params.roomCode.trim().toUpperCase();
  const roomRef = doc(db, 'rooms', cleanCode);
  const snap = await getDoc(roomRef);

  if (!snap.exists()) {
    return { success: false, error: 'Oda bulunamadı. Lütfen 6 haneli oda kodunu kontrol edin.' };
  }

  const roomData = snap.data() as OnlineRoom;

  // Check current members
  const membersRef = collection(db, 'rooms', cleanCode, 'members');
  const membersSnap = await getDocs(membersRef);
  const currentMembers = membersSnap.docs.map((d) => d.data() as OnlineMember);

  const isAlreadyMember = currentMembers.some((m) => m.userId === params.user.uid);

  // If not already in room, check capacity
  if (!isAlreadyMember && currentMembers.length >= roomData.playerCount) {
    return { 
      success: false, 
      error: `Masa dolu! Bu vaka ${roomData.playerCount} dedektifle sınırlandırılmıştır.` 
    };
  }

  // Check if role is taken by someone else
  const roleTakenByOther = currentMembers.find(
    (m) => m.role === params.desiredRole && m.userId !== params.user.uid
  );
  if (roleTakenByOther) {
    return {
      success: false,
      error: `"${params.desiredRole}" rolü zaten ${roleTakenByOther.displayName} tarafından alınmış. Lütfen boş kalan bir rol seçin.`
    };
  }

  const memberRef = doc(db, 'rooms', cleanCode, 'members', params.user.uid);
  await setDoc(memberRef, {
    userId: params.user.uid,
    displayName: params.user.displayName || 'Dedektif',
    photoURL: params.user.photoURL || '',
    role: params.desiredRole,
    joinedAt: new Date().toISOString(),
  }, { merge: true });

  return { success: true };
}

// Fetch room and its members details (useful for guests browsing empty seats before claiming)
export async function fetchRoomDetails(
  roomCode: string
): Promise<{ room: OnlineRoom | null; members: OnlineMember[] }> {
  const cleanCode = roomCode.trim().toUpperCase();
  if (!cleanCode) return { room: null, members: [] };

  try {
    const roomRef = doc(db, 'rooms', cleanCode);
    const snap = await getDoc(roomRef);
    if (!snap.exists()) {
      return { room: null, members: [] };
    }
    const room = snap.data() as OnlineRoom;

    const membersRef = collection(db, 'rooms', cleanCode, 'members');
    const membersSnap = await getDocs(membersRef);
    const members = membersSnap.docs.map((d) => d.data() as OnlineMember);

    return { room, members };
  } catch (err) {
    console.warn('Error fetching room details:', err);
    return { room: null, members: [] };
  }
}

// Host starts the online game (only host, and only when room capacity is reached)
export async function startOnlineRoom(
  roomCode: string,
  callerUserId: string
): Promise<{ success: boolean; error?: string }> {
  const cleanCode = roomCode.trim().toUpperCase();
  const roomRef = doc(db, 'rooms', cleanCode);
  const snap = await getDoc(roomRef);

  if (!snap.exists()) {
    return { success: false, error: 'Oda bulunamadı.' };
  }

  const data = snap.data() as OnlineRoom;
  if (data.hostId !== callerUserId) {
    return { success: false, error: 'Sadece odayı kuran masa şefi oyunu başlatabilir.' };
  }

  // Ensure room has enough members before starting
  const membersRef = collection(db, 'rooms', cleanCode, 'members');
  const membersSnap = await getDocs(membersRef);
  if (membersSnap.size < data.playerCount) {
    return {
      success: false,
      error: `Masa henüz dolmadı (${membersSnap.size}/${data.playerCount}). Lütfen arkadaşlarınızın koltuklara oturmasını bekleyin.`
    };
  }

  await updateDoc(roomRef, {
    status: 'playing',
    currentEnvelope: 1,
    updatedAt: new Date().toISOString(),
  });

  return { success: true };
}

// Leave room
export async function leaveOnlineRoom(roomCode: string, userId: string): Promise<void> {
  try {
    const cleanCode = roomCode.trim().toUpperCase();
    const memberRef = doc(db, 'rooms', cleanCode, 'members', userId);
    await deleteDoc(memberRef);
  } catch (err) {
    console.error('Error leaving online room:', err);
  }
}

// Real-time Listeners
export function subscribeToRoom(
  roomCode: string,
  onUpdate: (room: OnlineRoom | null) => void
): () => void {
  const roomRef = doc(db, 'rooms', roomCode);
  return onSnapshot(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      onUpdate(snapshot.data() as OnlineRoom);
    } else {
      onUpdate(null);
    }
  });
}

export function subscribeToRoomMembers(
  roomCode: string,
  onUpdate: (members: OnlineMember[]) => void
): () => void {
  const membersRef = collection(db, 'rooms', roomCode, 'members');
  return onSnapshot(membersRef, (snapshot) => {
    const list = snapshot.docs.map((d) => d.data() as OnlineMember);
    onUpdate(list);
  });
}

export function subscribeToRoomPins(
  roomCode: string,
  onUpdate: (pins: SharedPin[]) => void
): () => void {
  const pinsRef = collection(db, 'rooms', roomCode, 'pins');
  return onSnapshot(pinsRef, (snapshot) => {
    const list = snapshot.docs.map((d) => d.data() as SharedPin);
    onUpdate(list);
  });
}

export function subscribeToRoomVotes(
  roomCode: string,
  onUpdate: (votes: Record<string, AccusationSubmission>) => void
): () => void {
  const votesRef = collection(db, 'rooms', roomCode, 'votes');
  return onSnapshot(votesRef, (snapshot) => {
    const votesMap: Record<string, AccusationSubmission> = {};
    snapshot.docs.forEach((d) => {
      votesMap[d.id] = d.data() as AccusationSubmission;
    });
    onUpdate(votesMap);
  });
}

// Room Actions
export async function addOnlineRoomPin(roomCode: string, pin: SharedPin): Promise<void> {
  const pinRef = doc(db, 'rooms', roomCode, 'pins', pin.id);
  await setDoc(pinRef, {
    ...pin,
    pinnedByUserId: auth.currentUser?.uid || 'anon',
  });
}

export async function advanceOnlineRoomEnvelope(
  roomCode: string,
  nextEnvelope: 1 | 2 | 3 | 4
): Promise<void> {
  const roomRef = doc(db, 'rooms', roomCode);
  await updateDoc(roomRef, {
    currentEnvelope: nextEnvelope,
    status: nextEnvelope <= 3 ? 'playing' : 'accusation',
    updatedAt: new Date().toISOString(),
  });
}

export async function submitOnlineVote(
  roomCode: string,
  vote: AccusationSubmission
): Promise<void> {
  if (!auth.currentUser) return;
  const voteRef = doc(db, 'rooms', roomCode, 'votes', auth.currentUser.uid);
  await setDoc(voteRef, vote);
}

export async function setOnlineRoomStatus(
  roomCode: string,
  status: 'lobby' | 'playing' | 'accusation' | 'finished',
  debateStartedAt?: number
): Promise<void> {
  const roomRef = doc(db, 'rooms', roomCode);
  const updatePayload: Record<string, any> = { status, updatedAt: new Date().toISOString() };
  if (debateStartedAt !== undefined) {
    updatePayload.debateStartedAt = debateStartedAt;
  }
  await updateDoc(roomRef, updatePayload);
}

export async function incrementOnlineGateAttempts(roomCode: string): Promise<void> {
  const roomRef = doc(db, 'rooms', roomCode);
  const snap = await getDoc(roomRef);
  if (snap.exists()) {
    const current = (snap.data().gateAttempts || 0) + 1;
    await updateDoc(roomRef, { gateAttempts: current });
  }
}
