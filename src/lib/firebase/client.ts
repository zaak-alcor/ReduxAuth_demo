import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// const firebaseConfig = {
//   apiKey: "AIzaSyAadRnxl07Ug_f8tOllNGEVCCp9j1orHuU",
//   authDomain: "auth-f5e79.firebaseapp.com",
//   projectId: "auth-f5e79",
//   storageBucket: "auth-f5e79.firebasestorage.app",
//   messagingSenderId: "142788404610",
//   appId: "1:142788404610:web:08d6fd48345bbbb6551b9b",
// };

const missingConfig = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

export const firebaseConfigError =
  missingConfig.length > 0
    ? `Faltan variables de entorno de Firebase: ${missingConfig.join(", ")}.`
    : null;

function getFirebaseApp(): FirebaseApp | null {
  if (firebaseConfigError) {
    return null;
  }

  if (getApps().length > 0) {
    return getApp();
  }

  return initializeApp(firebaseConfig);
}

export function getFirebaseClientAuth(): Auth | null {
  const app = getFirebaseApp();

  if (!app) {
    return null;
  }

  return getAuth(app);
}

export function getFirebaseClientFirestore(): Firestore | null {
  const app = getFirebaseApp();

  if (!app) {
    return null;
  }

  return getFirestore(app);
}
