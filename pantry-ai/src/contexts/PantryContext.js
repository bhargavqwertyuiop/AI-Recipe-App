import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PantryContext = createContext(null);
const STORAGE_KEY = 'pantry_items_v1';

export function PantryProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        setItems(raw ? JSON.parse(raw) : []);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const persist = async (next) => {
    setItems(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addItem = async (item) => {
    const next = [
      { id: `${Date.now()}`, name: item.name || 'Unknown', quantity: item.quantity || 1, barcode: item.barcode || null, expiry: item.expiry || null },
      ...items,
    ];
    await persist(next);
  };

  const updateItem = async (id, updates) => {
    const next = items.map((it) => (it.id === id ? { ...it, ...updates } : it));
    await persist(next);
  };

  const removeItem = async (id) => {
    const next = items.filter((it) => it.id !== id);
    await persist(next);
  };

  return (
    <PantryContext.Provider value={{ items, isLoading, addItem, updateItem, removeItem }}>
      {children}
    </PantryContext.Provider>
  );
}

export function usePantry() {
  const ctx = useContext(PantryContext);
  if (!ctx) throw new Error('usePantry must be used within PantryProvider');
  return ctx;
}