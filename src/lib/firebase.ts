import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import appletConfig from '../../firebase-applet-config.json';

// Configuração do Firebase da aplicação
const firebaseConfig = {
  apiKey: appletConfig.apiKey || "AIzaSyCvEjH-CohEJnDYHsdyyIgmnWYUoZsUHOQ",
  authDomain: appletConfig.authDomain || "erikapaperart-7b449.firebaseapp.com",
  projectId: appletConfig.projectId || "erikapaperart-7b449",
  storageBucket: appletConfig.storageBucket || "erikapaperart-7b449.firebasestorage.app",
  messagingSenderId: appletConfig.messagingSenderId || "976554342129",
  appId: appletConfig.appId || "1:976554342129:web:9fadf500d55cbde84ddb50"
};

// Inicializa a instância do Firebase App (garantindo padrão singleton)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inicializa e exporta o Cloud Firestore (suportando databaseId se configurado)
const databaseId = appletConfig.firestoreDatabaseId;
export const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);

// Inicializa e exporta o Firebase Auth e Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});


