import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Pet = {
  id: string;
  name: string;
  level: number;
  happiness: number; // 0-100
};

export type GameState = {
  coins: number;
  pet: Pet;
  unlockedLevels: number; // highest unlocked level index
};

type GameContextType = {
  state: GameState;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  increaseHappiness: (amount: number) => void;
  unlockNextLevel: () => void;
  renamePet: (name: string) => void;
  setPet: (pet: Pet) => void;
  reset: () => void;
  hydrated: boolean;
};

const DEFAULT_STATE: GameState = {
  coins: 50,
  pet: {
    id: 'starter-pet',
    name: 'Puff',
    level: 1,
    happiness: 60,
  },
  unlockedLevels: 1,
};

const STORAGE_KEY = 'game-state-v1';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as GameState;
          setState(parsed);
        }
      } catch {
        // ignore corrupted storage
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, hydrated]);

  const api: GameContextType = useMemo(() => ({
    state,
    hydrated,
    addCoins: (amount) => {
      setState((s) => ({ ...s, coins: s.coins + Math.max(0, amount) }));
    },
    spendCoins: (amount) => {
      let success = false;
      setState((s) => {
        if (s.coins >= amount) {
          success = true;
          return { ...s, coins: s.coins - amount };
        }
        return s;
      });
      return success;
    },
    increaseHappiness: (amount) => {
      setState((s) => ({
        ...s,
        pet: { ...s.pet, happiness: Math.min(100, s.pet.happiness + amount) },
      }));
    },
    unlockNextLevel: () => {
      setState((s) => ({ ...s, unlockedLevels: s.unlockedLevels + 1 }));
    },
    renamePet: (name) => {
      setState((s) => ({ ...s, pet: { ...s.pet, name } }));
    },
    setPet: (pet) => setState((s) => ({ ...s, pet })),
    reset: () => setState(DEFAULT_STATE),
  }), [state, hydrated]);

  return <GameContext.Provider value={api}>{children}</GameContext.Provider>;
};

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}


