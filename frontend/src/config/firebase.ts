// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2EW9KkQRKZMhjzxPjUSTjeQw0DJtgofk",
  authDomain: "al-mawrid-1.firebaseapp.com",
  databaseURL: "https://al-mawrid-1-default-rtdb.firebaseio.com",
  projectId: "al-mawrid-1",
  storageBucket: "al-mawrid-1.firebasestorage.app",
  messagingSenderId: "958348791060",
  appId: "1:958348791060:web:97c293575874cdb56ac601",
  measurementId: "G-ZEJ0TY5SCD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Auth (only if Auth is enabled in Firebase Console)
// If Auth is not enabled, this will log a warning but won't crash the app
import type { Auth } from 'firebase/auth';
let auth: Auth | null;
try {
  auth = getAuth(app);
} catch (error) {
  console.warn('Firebase Authentication not available. Enable it in Firebase Console to use Firestore write operations.');
  auth = null;
}

// Initialize Analytics only in browser environment
import type { Analytics } from 'firebase/analytics';
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Firebase Analytics not available');
    analytics = null;
  }
}

export { app, analytics, db, auth };

