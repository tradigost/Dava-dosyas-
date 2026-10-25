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

// Google Sign-In via Popup or Redirect
export async function loginWithGoogle(useRedirect: boolean = false): Promise<User | null> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  if (useRedirect) {
    await signInWithRedirect(auth, provider);
    return null;
  }

  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Persist user profile document
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

  return user;
}

// Check redirect result for mobile browsers returning from Google OAuth
export async function checkRedirectResult(): Promise<User | null> {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      const user = result.user;
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
      return user;
    }
  } catch (err) {
    console.error('Error handling redirect sign-in result:', err);
    throw err;
  }
  return null;
}

// Fast Detective Nickname Login (Anonymous Auth + Profile)
// This avoids OAuth domain whitelisting restrictions so friends on WhatsApp can join immediately
export async function loginWithGuestName(displayName: string): Promise<User> {
  const cleanName = displayName.trim() || 'Dedektif';
  
  const userCredential = await signInAnonymously(auth);
  const user = userCredential.user;

  try {
    await updateProfile(user, {
      displayName: cleanName,
    });
  } catch (e) {
    console.warn('Could not update profile display name:', e);
  }

  try {
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      displayName: cleanName,
      isGuest: true,
      createdAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.error('Failed to save guest user profile:', err);
  }

  return user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
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
  hostUser: User;
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
  user: User;
  desiredRole: RoleType;
}): Promise<{ success: boolean; error?: string }> {
  const cleanCode = params.roomCode.trim().toUpperCase();
  const roomRef = doc(db, 'rooms', cleanCode);
  const snap = await getDoc(roomRef);

  if (!snap.exists()) {
    return { success: false, error: 'Oda bulunamadı. Lütfen oda kodunu kontrol edin.' };
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
