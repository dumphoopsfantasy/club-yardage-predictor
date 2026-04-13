import { useState, useEffect, useCallback } from "react";

const STORAGE_PREFIX = "club-yardage-predictor:";

export function usePersistedState<T>(
  key: string,
  defaultValue: T
): [T, (val: T | ((prev: T) => T)) => void] {
  const storageKey = STORAGE_PREFIX + key;

  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore parse errors
    }
    return defaultValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // ignore quota errors
    }
  }, [storageKey, value]);

  return [value, setValue];
}

export function clearAllPersistedState() {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      keys.push(key);
    }
  }
  keys.forEach((key) => localStorage.removeItem(key));
}
