let app = null;
let auth = null;

export function getFirebaseAuth() {
  try {
    if (!app) {
      const config = getConfigFromEnv();
      if (!config) return null;
      const { initializeApp, getApps } = require('firebase/app');
      const { getAuth, connectAuthEmulator } = require('firebase/auth');
      if (getApps().length === 0) {
        app = initializeApp(config);
      } else {
        app = getApps()[0];
      }
      auth = getAuth(app);
      if (process.env.FIREBASE_USE_EMULATOR === '1') {
        connectAuthEmulator(auth, 'http://localhost:9099');
      }
    }
    return auth;
  } catch (e) {
    return null;
  }
}

function getConfigFromEnv() {
  const cfg = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  };
  if (Object.values(cfg).some((v) => !v)) return null;
  return cfg;
}