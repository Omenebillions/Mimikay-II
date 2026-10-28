import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const PRIMARY_ADMIN_EMAIL = 'tintvillenigeria@gmail.com';

// Test connection on boot as mandated by Firebase Integration Skill
async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase connection verified successfully.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or network unavailable.');
    }
  }
}
testFirestoreConnection();

/**
 * Checks whether an email address is authorized for admin access.
 */
export function isAuthorizedAdmin(userEmail: string | null | undefined): boolean {
  if (!userEmail) return false;
  const normalized = userEmail.trim().toLowerCase();
  return (
    normalized === PRIMARY_ADMIN_EMAIL.toLowerCase() ||
    normalized.endsWith('@tintville.com') ||
    normalized.endsWith('@mimikaypoliticalmovement.com')
  );
}

/**
 * Sign in using Google OAuth Popup
 */
export async function signInWithGoogle(): Promise<{ user: User | null; error: string | null }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (err: any) {
    console.error('Google Sign-In Error:', err);
    return { user: null, error: err.message || 'Google Sign-In failed' };
  }
}

/**
 * Sign in using Email & Password
 */
export async function signInWithEmail(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (err: any) {
    // If user not found, try creating it for seamless first-time onboarding
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      try {
        const createResult = await createUserWithEmailAndPassword(auth, email, password);
        return { user: createResult.user, error: null };
      } catch (createErr: any) {
        return { user: null, error: createErr.message || 'Authentication failed' };
      }
    }
    return { user: null, error: err.message || 'Email authentication failed' };
  }
}

/**
 * Sign out
 */
export async function logoutAdmin(): Promise<void> {
  await signOut(auth);
}
