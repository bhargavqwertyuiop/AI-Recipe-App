import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirebaseAuth } from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = null;
    const init = async () => {
      try {
        const auth = getFirebaseAuth();
        if (auth) {
          unsubscribe = auth.onAuthStateChanged(async (fbUser) => {
            if (fbUser) {
              setUser({ uid: fbUser.uid, email: fbUser.email || null, provider: 'firebase' });
              await AsyncStorage.setItem('user', JSON.stringify({ uid: fbUser.uid }));
            } else {
              const stored = await AsyncStorage.getItem('user');
              if (stored) {
                setUser(JSON.parse(stored));
              } else {
                setUser(null);
              }
            }
            setIsLoading(false);
          });
        } else {
          const stored = await AsyncStorage.getItem('user');
          setUser(stored ? JSON.parse(stored) : null);
          setIsLoading(false);
        }
      } catch (e) {
        setIsLoading(false);
      }
    };
    init();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const signInAnonymously = async () => {
    const auth = getFirebaseAuth();
    if (auth) {
      const { signInAnonymously } = await import('firebase/auth');
      const cred = await signInAnonymously(auth);
      return cred.user;
    }
    const localUser = { uid: `local-${Date.now()}` };
    setUser(localUser);
    await AsyncStorage.setItem('user', JSON.stringify(localUser));
    return localUser;
  };

  const signOut = async () => {
    const auth = getFirebaseAuth();
    if (auth) {
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
    }
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signInAnonymously, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}