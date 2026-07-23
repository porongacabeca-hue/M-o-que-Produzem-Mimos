import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import appletConfig from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: appletConfig.apiKey,
  authDomain: appletConfig.authDomain,
  projectId: appletConfig.projectId,
  storageBucket: appletConfig.storageBucket,
  messagingSenderId: appletConfig.messagingSenderId,
  appId: appletConfig.appId,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Export Firestore DB with databaseId if configured
const databaseId = appletConfig.firestoreDatabaseId;
export const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);

// Export Firebase Auth
export const auth = getAuth(app);

// Export Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

