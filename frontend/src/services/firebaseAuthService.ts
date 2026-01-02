import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
  type Auth
} from 'firebase/auth';
import { auth } from '../config/firebase';

/**
 * Check if Firebase Auth is available and return it
 */
const getAuthOrThrow = (): Auth => {
  if (!auth) {
    throw new Error('Firebase Authentication is not enabled. Please enable it in Firebase Console: https://console.firebase.google.com/project/al-mawrid-1/authentication');
  }
  return auth;
};

/**
 * Authenticate with Firebase after successful backend login
 * This enables Firestore read/write operations that require Firebase Auth
 */
export const firebaseAuthService = {
  /**
   * Sign in to Firebase with email and password
   * Creates a Firebase user if they don't exist
   */
  async signIn(email: string, password: string): Promise<User> {
    const authInstance = getAuthOrThrow();

    try {
      // Try to sign in first
      const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
      return userCredential.user;
    } catch (error: any) {
      // If user doesn't exist, try to create them
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        try {
          const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
          console.log('Firebase user created:', userCredential.user.email);
          return userCredential.user;
        } catch (createError: any) {
          console.error('Error creating Firebase user:', createError);
          throw new Error(`Failed to authenticate with Firebase: ${createError.message}`);
        }
      }
      throw error;
    }
  },

  /**
   * Sign out from Firebase
   */
  async signOut(): Promise<void> {
    if (!auth) {
      return; // Silently return if auth is not available
    }

    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out from Firebase:', error);
      // Don't throw - this is not critical
    }
  },

  /**
   * Get current Firebase user
   */
  getCurrentUser(): User | null {
    if (!auth) {
      return null;
    }
    return auth.currentUser;
  },

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    if (!auth) {
      // Return a no-op unsubscribe function
      return () => {};
    }
    return onAuthStateChanged(auth, callback);
  },

  /**
   * Check if user is authenticated with Firebase
   */
  isAuthenticated(): boolean {
    if (!auth) {
      return false;
    }
    return auth.currentUser !== null;
  }
};

