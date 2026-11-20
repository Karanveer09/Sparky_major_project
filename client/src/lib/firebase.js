import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "withspark-3195b.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "withspark-3195b",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "withspark-3195b.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "20473899706",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:20473899706:web:161bd0c0491fdbcbc57083",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-6HMC1KQ9DN",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

