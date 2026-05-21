// services/firebaseConfig.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyAwEgIWc-aLXA7FrXnqRTQaw0qesuS85Rw",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'elentyapp.firebaseapp.com',
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL || 'https://elentyapp-default-rtdb.firebaseio.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'elentyapp',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'elentyapp.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '316936632647',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:316936632647:web:549a2f871b44a06e31b462'
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getDatabase(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
