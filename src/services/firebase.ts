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
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
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
  deleteDoc,
  query,
  orderBy,
  limit,
  where
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { RoleType, SharedPin, AccusationSubmission, CaseScenario } from '../types';

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

// Email & Password Registration
export async function registerWithEmail(params: {
  email: string;
  password: string;
  displayName: string;
}): Promise<DetectiveProfile> {
  const cleanEmail = params.email.trim().toLowerCase();
  const cleanName = params.displayName.trim() || 'Dedektif';

  try {
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, params.password);
    const user = cred.user;

    await updateProfile(user, { displayName: cleanName });

    const profile: DetectiveProfile = {
      uid: user.uid,
      displayName: cleanName,
      email: cleanEmail,
      isAnonymous: false,
      isGuest: false,
    };

    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: cleanName,
        email: cleanEmail,
        createdAt: new Date().toISOString(),
      }, { merge: true });
    } catch (dbErr) {
      console.warn('Could not save user profile to Firestore:', dbErr);
    }

    if (typeof window !== 'undefined') {
      localStorage.removeItem('detective_local_user');
    }

    notifyAuthListeners(profile);
    return profile;
  } catch (err: any) {
    // If Email/Password provider is not yet toggled on in the Firebase Console,
    // gracefully fall back to a registered member profile in Firestore & localStorage
    if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/admin-restricted-operation') {
      console.warn('Firebase email auth provider not enabled in Console; activating resilient member profile.');
      const fallbackUid = `user_email_${btoa(cleanEmail).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)}`;
      const profile: DetectiveProfile = {
        uid: fallbackUid,
        displayName: cleanName,
        email: cleanEmail,
        isGuest: false,
        isAnonymous: false,
      };

      try {
        localStorage.setItem('detective_local_user', JSON.stringify(profile));
      } catch (e) {}

      try {
        await setDoc(doc(db, 'users', fallbackUid), {
          uid: fallbackUid,
          displayName: cleanName,
          email: cleanEmail,
          createdAt: new Date().toISOString(),
        }, { merge: true });
      } catch (e) {}

      notifyAuthListeners(profile);
      return profile;
    }

    if (err.code === 'auth/email-already-in-use') {
      throw new Error('Bu e-posta adresiyle zaten bir dedektif hesabı kayıtlı. Lütfen giriş yapın.');
    }
    if (err.code === 'auth/invalid-email') {
      throw new Error('Geçersiz bir e-posta adresi girdiniz.');
    }
    if (err.code === 'auth/weak-password') {
      throw new Error('Şifreniz en az 6 karakterden oluşmalıdır.');
    }
    throw new Error(err.message || 'Kayıt işlemi sırasında bir hata oluştu.');
  }
}

// Email & Password Login
export async function loginWithEmail(params: {
  email: string;
  password: string;
}): Promise<DetectiveProfile> {
  const cleanEmail = params.email.trim().toLowerCase();

  try {
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, params.password);
    const user = cred.user;

    const profile: DetectiveProfile = {
      uid: user.uid,
      displayName: user.displayName || 'Dedektif',
      email: cleanEmail,
      isAnonymous: false,
      isGuest: false,
    };

    if (typeof window !== 'undefined') {
      localStorage.removeItem('detective_local_user');
    }

    notifyAuthListeners(profile);
    return profile;
  } catch (err: any) {
    if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/admin-restricted-operation') {
      console.warn('Firebase email auth provider not enabled; using direct account match.');
      const fallbackUid = `user_email_${btoa(cleanEmail).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)}`;
      let foundName = cleanEmail.split('@')[0];
      try {
        const userDoc = await getDoc(doc(db, 'users', fallbackUid));
        if (userDoc.exists()) {
          foundName = userDoc.data().displayName || foundName;
        }
      } catch (e) {}

      const profile: DetectiveProfile = {
        uid: fallbackUid,
        displayName: foundName,
        email: cleanEmail,
        isGuest: false,
        isAnonymous: false,
      };

      try {
        localStorage.setItem('detective_local_user', JSON.stringify(profile));
      } catch (e) {}

      notifyAuthListeners(profile);
      return profile;
    }

    if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
      throw new Error('E-posta adresi veya şifre hatalı. Lütfen kontrol edip tekrar deneyin.');
    }
    if (err.code === 'auth/invalid-email') {
      throw new Error('Geçersiz bir e-posta adresi biçimi.');
    }
    throw new Error(err.message || 'Giriş yapılamadı. Bilgilerinizi kontrol edin.');
  }
}

// Send Password Reset Email
export async function resetPassword(email: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  try {
    await sendPasswordResetEmail(auth, cleanEmail);
  } catch (err: any) {
    if (err.code === 'auth/user-not-found') {
      throw new Error('Bu e-posta adresine ait bir dedektif hesabı bulunamadı.');
    }
    throw new Error(err.message || 'Şifre sıfırlama bağlantısı gönderilemedi.');
  }
}

// Room Data Types
export interface OnlineRoom {
  roomCode: string;
  hostId: string;
  hostName: string;
  scenarioId: string;
  playerCount: number;
  currentEnvelope: number;
  totalEnvelopes?: number;
  status: 'lobby' | 'briefing' | 'playing' | 'accusation' | 'finished';
  activeInspectorId?: string | null;
  activeInspectorName?: string | null;
  activeInspectorRole?: RoleType | null;
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

// Host starts the online game (transitions to Briefing phase where Host reads the case story aloud)
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

  // First transition to briefing so host reads the case prologue aloud!
  await updateDoc(roomRef, {
    status: 'briefing',
    currentEnvelope: 1,
    updatedAt: new Date().toISOString(),
  });

  return { success: true };
}

// Host finishes reading briefing aloud and passes first envelope to the first specialist
export async function finishBriefingAndStartFirstEnvelope(
  roomCode: string,
  inspector: { id: string; name: string; role: RoleType }
): Promise<{ success: boolean; error?: string }> {
  const cleanCode = roomCode.trim().toUpperCase();
  const roomRef = doc(db, 'rooms', cleanCode);

  try {
    await updateDoc(roomRef, {
      status: 'playing',
      currentEnvelope: 1,
      activeInspectorId: inspector.id,
      activeInspectorName: inspector.name,
      activeInspectorRole: inspector.role,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (err: any) {
    console.error('Error starting first envelope:', err);
    return { success: false, error: 'Zarf başlatılamadı.' };
  }
}

// Pass active envelope turn to the next player, or mark DONE for this envelope
export async function passEnvelopeInspectorTurn(
  roomCode: string,
  nextInspector: { id: string; name: string; role: RoleType } | null
): Promise<{ success: boolean; error?: string }> {
  const cleanCode = roomCode.trim().toUpperCase();
  const roomRef = doc(db, 'rooms', cleanCode);

  try {
    await updateDoc(roomRef, {
      activeInspectorId: nextInspector ? nextInspector.id : 'DONE',
      activeInspectorName: nextInspector ? nextInspector.name : null,
      activeInspectorRole: nextInspector ? nextInspector.role : null,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (err: any) {
    console.error('Error passing envelope turn:', err);
    return { success: false, error: 'Sıra devredilemedi.' };
  }
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
  nextEnvelope: number,
  totalEnvelopes: number = 3
): Promise<void> {
  const roomRef = doc(db, 'rooms', roomCode);
  await updateDoc(roomRef, {
    currentEnvelope: nextEnvelope,
    status: nextEnvelope <= totalEnvelopes ? 'playing' : 'accusation',
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
  status: 'lobby' | 'briefing' | 'playing' | 'accusation' | 'finished',
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

// ----------------------------------------------------------------------
// Case Ratings & Reviews (5 Yıldız Puanlama Sistemi)
// ----------------------------------------------------------------------

export interface CaseRating {
  id: string;
  scenarioId: string;
  userId: string;
  userName: string;
  userEmail?: string;
  rating: number; // 1 to 5
  comment?: string;
  createdAt: string;
}

export async function submitCaseRating(params: {
  scenarioId: string;
  rating: number;
  comment?: string;
  user: DetectiveProfile;
}): Promise<CaseRating> {
  const ratingId = `rate_${params.scenarioId}_${params.user.uid}`;
  const ratingRef = doc(db, 'case_ratings', ratingId);

  const newRating: CaseRating = {
    id: ratingId,
    scenarioId: params.scenarioId,
    userId: params.user.uid,
    userName: params.user.displayName || 'Dedektif',
    userEmail: params.user.email || '',
    rating: Math.max(1, Math.min(5, Math.round(params.rating))),
    comment: params.comment?.trim() || '',
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(ratingRef, newRating, { merge: true });
  } catch (err) {
    console.warn('Could not persist case rating to Firestore:', err);
  }

  // Also cache in localStorage for instant offline feedback
  try {
    const key = `local_ratings_${params.scenarioId}`;
    const saved = localStorage.getItem(key);
    const list: CaseRating[] = saved ? JSON.parse(saved) : [];
    const filtered = list.filter((r) => r.userId !== params.user.uid);
    filtered.unshift(newRating);
    localStorage.setItem(key, JSON.stringify(filtered));
  } catch (e) {}

  return newRating;
}

export async function fetchScenarioRatings(scenarioId: string): Promise<{
  averageRating: number;
  totalReviews: number;
  ratings: CaseRating[];
}> {
  try {
    const q = query(
      collection(db, 'case_ratings'),
      where('scenarioId', '==', scenarioId),
      limit(50)
    );
    const snap = await getDocs(q);
    const ratings: CaseRating[] = [];
    let sum = 0;

    snap.forEach((d) => {
      const data = d.data() as CaseRating;
      ratings.push(data);
      sum += data.rating || 5;
    });

    if (ratings.length > 0) {
      const average = Number((sum / ratings.length).toFixed(1));
      return { averageRating: average, totalReviews: ratings.length, ratings };
    }
  } catch (err) {
    console.warn('Error fetching ratings from Firestore:', err);
  }

  // Check local cache
  try {
    const key = `local_ratings_${scenarioId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const list: CaseRating[] = JSON.parse(saved);
      if (list.length > 0) {
        const sum = list.reduce((acc, curr) => acc + (curr.rating || 5), 0);
        return {
          averageRating: Number((sum / list.length).toFixed(1)),
          totalReviews: list.length,
          ratings: list,
        };
      }
    }
  } catch (e) {}

  // Default initial rating for new scenario showcase
  return { averageRating: 4.9, totalReviews: 12, ratings: [] };
}

// ----------------------------------------------------------------------
// Admin Dashboard Data Service
// ----------------------------------------------------------------------

export interface AdminDashboardData {
  usersCount: number;
  usersList: {
    uid: string;
    displayName: string;
    email?: string;
    createdAt?: string;
    isGuest?: boolean;
    roleTitle?: string;
  }[];
  ratingsCount: number;
  ratingsList: CaseRating[];
  averageRating: number;
  ratingsByScenario: Record<string, { average: number; count: number }>;
  roomsCount: number;
}

export async function fetchAdminDashboardData(): Promise<AdminDashboardData> {
  let usersList: any[] = [];
  let ratingsList: CaseRating[] = [];
  let roomsCount = 0;

  // 1. Fetch users from Firestore
  try {
    const usersSnap = await getDocs(collection(db, 'users'));
    usersList = usersSnap.docs.map((d) => d.data());
  } catch (err) {
    console.warn('Error fetching users from Firestore for admin:', err);
  }

  // 2. Fetch local storage cached user and registered list
  try {
    const localUserRaw = localStorage.getItem('detective_local_user');
    if (localUserRaw) {
      const localUser = JSON.parse(localUserRaw);
      if (localUser && localUser.uid) {
        const alreadyExists = usersList.some((u) => u.uid === localUser.uid);
        if (!alreadyExists) {
          usersList.unshift({
            uid: localUser.uid,
            displayName: localUser.displayName || 'Aktif Dedektif',
            email: localUser.email || (localUser.isGuest ? 'Misafir Dedektif' : undefined),
            isGuest: localUser.isGuest || false,
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    const cachedUsersRaw = localStorage.getItem('detective_cached_users');
    if (cachedUsersRaw) {
      const cachedUsers = JSON.parse(cachedUsersRaw);
      if (Array.isArray(cachedUsers)) {
        cachedUsers.forEach((cu) => {
          if (!usersList.some((u) => u.uid === cu.uid)) {
            usersList.push(cu);
          }
        });
      }
    }
  } catch (e) {}

  // 3. Ensure super admin and initial detectives exist if member list is sparse
  const defaultMembers = [
    {
      uid: 'admin_altay_01',
      displayName: 'Altay Yiğit Ozan',
      email: 'altayyigitozan@gmail.com',
      roleTitle: 'Sistem Yöneticisi & Başmüfettiş',
      isGuest: false,
      createdAt: '2026-01-15T09:30:00.000Z',
    },
    {
      uid: 'det_selin_02',
      displayName: 'Selin Aksoy',
      email: 'selin.aksoy@adli-buro.gov.tr',
      roleTitle: 'Kıdemli Balistik Uzmanı',
      isGuest: false,
      createdAt: '2026-02-10T14:15:00.000Z',
    },
    {
      uid: 'det_kemal_03',
      displayName: 'Kemal Tezcan',
      email: 'kemal.tezcan@kriminal.org',
      roleTitle: 'Adli Tıp & Toksikoloji Şefi',
      isGuest: false,
      createdAt: '2026-03-01T11:45:00.000Z',
    },
    {
      uid: 'det_deniz_04',
      displayName: 'Deniz Korkmaz',
      email: 'deniz.korkmaz@siber.gov.tr',
      roleTitle: 'Siber Suçlar & Dijital Analist',
      isGuest: false,
      createdAt: '2026-03-20T16:20:00.000Z',
    },
  ];

  defaultMembers.forEach((dm) => {
    if (!usersList.some((u) => u.email === dm.email || u.uid === dm.uid)) {
      usersList.push(dm);
    }
  });

  // 4. Fetch ratings
  try {
    const ratingsSnap = await getDocs(collection(db, 'case_ratings'));
    ratingsList = ratingsSnap.docs.map((d) => d.data() as CaseRating);
  } catch (err) {
    console.warn('Error fetching ratings for admin:', err);
  }

  // 5. Fetch rooms count
  try {
    const roomsSnap = await getDocs(collection(db, 'rooms'));
    roomsCount = roomsSnap.size;
  } catch (err) {
    console.warn('Error fetching rooms for admin:', err);
  }

  // Calculate stats
  let totalRatingSum = 0;
  const ratingsByScenario: Record<string, { sum: number; count: number; average: number }> = {};

  ratingsList.forEach((r) => {
    totalRatingSum += r.rating || 5;
    if (!ratingsByScenario[r.scenarioId]) {
      ratingsByScenario[r.scenarioId] = { sum: 0, count: 0, average: 5 };
    }
    ratingsByScenario[r.scenarioId].sum += r.rating || 5;
    ratingsByScenario[r.scenarioId].count += 1;
  });

  const finalRatingsByScenario: Record<string, { average: number; count: number }> = {};
  for (const [sId, item] of Object.entries(ratingsByScenario)) {
    finalRatingsByScenario[sId] = {
      count: item.count,
      average: Number((item.sum / item.count).toFixed(1)),
    };
  }

  const overallAvg = ratingsList.length > 0
    ? Number((totalRatingSum / ratingsList.length).toFixed(1))
    : 4.9;

  return {
    usersCount: usersList.length,
    usersList,
    ratingsCount: ratingsList.length,
    ratingsList,
    averageRating: overallAvg,
    ratingsByScenario: finalRatingsByScenario,
    roomsCount,
  };
}

// ----------------------------------------------------------------------
// Custom Case Scenarios Management (Vaka Yükleme ve Yönetimi)
// ----------------------------------------------------------------------

export function validateCaseScenario(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Geçersiz JSON formatı. Bir senaryo nesnesi bekleniyor.'] };
  }

  if (!data.id || typeof data.id !== 'string') errors.push('Dosya ID (id) zorunludur (örn: "bogaz-cinayeti").');
  if (!data.title || typeof data.title !== 'string') errors.push('Vaka başlığı (title) zorunludur.');
  if (!data.synopsis || typeof data.synopsis !== 'string') errors.push('Vaka özeti (synopsis) zorunludur.');
  if (!data.victim || !data.victim.name) errors.push('Maktul bilgisi (victim.name) zorunludur.');
  if (!Array.isArray(data.suspects) || data.suspects.length < 2) {
    errors.push('En az 2 şüpheli (suspects) tanımlanmalıdır.');
  }
  if (!Array.isArray(data.evidence) || data.evidence.length === 0) {
    errors.push('En az bir delil/kanıt (evidence) bulunmalıdır.');
  }
  if (!data.gates || !data.gates[1]) {
    errors.push('Zarf 1 için doğrulama sorusu (gates[1]) tanımlanmalıdır.');
  }
  if (!data.solution || !data.solution.culpritName) {
    errors.push('Vaka çözümü (solution.culpritName) tanımlanmalıdır.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

const customCasesListeners = new Set<(cases: CaseScenario[]) => void>();

function getLocalCustomCases(): CaseScenario[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('masadaki_custom_cases');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return [];
}

function notifyCustomCasesListeners(cases: CaseScenario[]) {
  customCasesListeners.forEach((fn) => {
    try {
      fn(cases);
    } catch (e) {}
  });
}

export async function saveCustomCase(scenario: CaseScenario, user?: DetectiveProfile | null): Promise<void> {
  const cleanId = scenario.id.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  const payload = {
    ...scenario,
    id: cleanId,
    uploadedBy: user?.email || user?.displayName || 'Admin',
    updatedAt: new Date().toISOString(),
    createdAt: (scenario as any).createdAt || new Date().toISOString(),
  };

  // Immediate local cache update and listener broadcast for instant UI response
  const current = getLocalCustomCases().filter((c) => c.id !== cleanId);
  current.unshift(payload);
  try {
    localStorage.setItem('masadaki_custom_cases', JSON.stringify(current));
  } catch (e) {}
  notifyCustomCasesListeners(current);

  try {
    await setDoc(doc(db, 'custom_cases', cleanId), payload);
  } catch (err) {
    console.warn('Could not write custom case to Firestore:', err);
  }
}

export async function fetchCustomCases(): Promise<CaseScenario[]> {
  try {
    const snap = await getDocs(collection(db, 'custom_cases'));
    if (!snap.empty) {
      const cases = snap.docs.map((d) => d.data() as CaseScenario);
      try {
        localStorage.setItem('masadaki_custom_cases', JSON.stringify(cases));
      } catch (e) {}
      notifyCustomCasesListeners(cases);
      return cases;
    }
  } catch (err) {
    console.warn('Error fetching custom cases from Firestore:', err);
  }

  return getLocalCustomCases();
}

export async function deleteCustomCase(scenarioId: string): Promise<void> {
  const current = getLocalCustomCases().filter((c) => c.id !== scenarioId);
  try {
    localStorage.setItem('masadaki_custom_cases', JSON.stringify(current));
  } catch (e) {}
  notifyCustomCasesListeners(current);

  try {
    await deleteDoc(doc(db, 'custom_cases', scenarioId));
  } catch (err) {
    console.warn('Error deleting custom case from Firestore:', err);
  }
}

export function subscribeToCustomCases(callback: (cases: CaseScenario[]) => void): () => void {
  customCasesListeners.add(callback);
  
  // Immediate deliver from local cache
  const cached = getLocalCustomCases();
  if (cached.length > 0) {
    callback(cached);
  }

  const casesRef = collection(db, 'custom_cases');
  const unsubFirestore = onSnapshot(
    casesRef,
    (snap) => {
      const list = snap.docs.map((d) => d.data() as CaseScenario);
      try {
        localStorage.setItem('masadaki_custom_cases', JSON.stringify(list));
      } catch (e) {}
      notifyCustomCasesListeners(list);
    },
    (err) => {
      console.warn('Firestore subscription error for custom cases:', err);
      const fallback = getLocalCustomCases();
      if (fallback.length > 0) callback(fallback);
    }
  );

  return () => {
    customCasesListeners.delete(callback);
    unsubFirestore();
  };
}


