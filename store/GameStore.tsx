import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Pet = {
  id: string;
  name: string;
  level: number;
  happiness: number; // 0-100
};

export type Food = {
  id: string;
  name: string;
  staminaValue: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
  image: string;
};

export type FoodInventory = {
  [foodId: string]: {
    quantity: number;
    food: Food;
  };
};

export type GameState = {
  coins: number;
  dailyStamina: number; // regenerates to 100 daily
  bonusStamina: number; // permanent bonus stamina from activities
  tickets: number;
  pet: Pet;
  unlockedLevels: number; // highest unlocked level index
  foodInventory: FoodInventory;
  lastStaminaUpdate: number; // timestamp for stamina regeneration
  lastDailyReset: number; // timestamp for daily reset
  playerLevel: number;
};

type GameContextType = {
  state: GameState;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addDailyStamina: (amount: number) => void;
  addBonusStamina: (amount: number) => void;
  spendStamina: (amount: number) => boolean;
  addTickets: (amount: number) => void;
  spendTickets: (amount: number) => boolean;
  addFood: (foodId: string, quantity: number) => void;
  consumeFood: (foodId: string, quantity: number) => boolean;
  eatFood: (foodId: string) => boolean;
  increaseHappiness: (amount: number) => void;
  unlockNextLevel: () => void;
  renamePet: (name: string) => void;
  setPet: (pet: Pet) => void;
  levelUp: () => void;
  reset: () => void;
  hydrated: boolean;
};

// Default food items
const DEFAULT_FOODS: Food[] = [
  {
    id: 'apple',
    name: 'Apple',
    staminaValue: 5,
    rarity: 'common',
    description: 'A crisp, refreshing apple',
    image: 'apple.png'
  },
  {
    id: 'sandwich',
    name: 'Sandwich',
    staminaValue: 15,
    rarity: 'common',
    description: 'A hearty sandwich',
    image: 'sandwich.png'
  },
  {
    id: 'energy_drink',
    name: 'Energy Drink',
    staminaValue: 25,
    rarity: 'rare',
    description: 'A powerful energy boost',
    image: 'energy_drink.png'
  },
  {
    id: 'golden_apple',
    name: 'Golden Apple',
    staminaValue: 50,
    rarity: 'legendary',
    description: 'A magical golden apple',
    image: 'golden_apple.png'
  }
];

const DEFAULT_STATE: GameState = {
  coins: 50,
  dailyStamina: 100,
  bonusStamina: 0,
  tickets: 0,
  pet: {
    id: 'starter-pet',
    name: 'Puff',
    level: 1,
    happiness: 60,
  },
  unlockedLevels: 1,
  foodInventory: {
    'apple': { quantity: 3, food: DEFAULT_FOODS[0] },
    'sandwich': { quantity: 1, food: DEFAULT_FOODS[1] }
  },
  lastStaminaUpdate: Date.now(),
  lastDailyReset: Date.now(),
  playerLevel: 1,
};

const STORAGE_KEY = 'game-state-v1';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  // Daily stamina regeneration effect
  useEffect(() => {
    if (!hydrated) return;
    
    const interval = setInterval(() => {
      setState(prevState => {
        const now = Date.now();
        const timeSinceLastReset = now - prevState.lastDailyReset;
        const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        // Check if a new day has passed
        if (timeSinceLastReset >= oneDay) {
          return {
            ...prevState,
            dailyStamina: 100, // Reset daily stamina to 100
            lastDailyReset: now
          };
        }
        
        // Slow regeneration throughout the day (1 stamina per 10 minutes)
        const timeSinceLastUpdate = now - prevState.lastStaminaUpdate;
        const staminaRegenRate = 10 * 60 * 1000; // 10 minutes in milliseconds
        const staminaToAdd = Math.floor(timeSinceLastUpdate / staminaRegenRate);
        
        if (staminaToAdd > 0) {
          const newDailyStamina = Math.min(100, prevState.dailyStamina + staminaToAdd);
          return {
            ...prevState,
            dailyStamina: newDailyStamina,
            lastStaminaUpdate: now
          };
        }
        return prevState;
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [hydrated]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as GameState;
          // Handle migration from old save format
          const migratedState = {
            ...DEFAULT_STATE,
            ...parsed,
            dailyStamina: parsed.dailyStamina ?? parsed.stamina ?? DEFAULT_STATE.dailyStamina,
            bonusStamina: parsed.bonusStamina ?? DEFAULT_STATE.bonusStamina,
            tickets: parsed.tickets ?? DEFAULT_STATE.tickets,
            foodInventory: parsed.foodInventory ?? DEFAULT_STATE.foodInventory,
            lastStaminaUpdate: parsed.lastStaminaUpdate ?? Date.now(),
            lastDailyReset: parsed.lastDailyReset ?? Date.now(),
            playerLevel: parsed.playerLevel ?? DEFAULT_STATE.playerLevel,
          };
          setState(migratedState);
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
    addDailyStamina: (amount) => {
      setState((s) => ({ 
        ...s, 
        dailyStamina: Math.min(100, s.dailyStamina + Math.max(0, amount)) 
      }));
    },
    addBonusStamina: (amount) => {
      setState((s) => ({ 
        ...s, 
        bonusStamina: s.bonusStamina + Math.max(0, amount) 
      }));
    },
    spendStamina: (amount) => {
      let success = false;
      setState((s) => {
        const totalStamina = s.dailyStamina + s.bonusStamina;
        if (totalStamina >= amount) {
          success = true;
          // Spend from daily stamina first, then bonus
          if (s.dailyStamina >= amount) {
            return { ...s, dailyStamina: s.dailyStamina - amount };
          } else {
            const remaining = amount - s.dailyStamina;
            return { 
              ...s, 
              dailyStamina: 0, 
              bonusStamina: s.bonusStamina - remaining 
            };
          }
        }
        return s;
      });
      return success;
    },
    addTickets: (amount) => {
      console.log('GameStore addTickets called with:', amount);
      setState((s) => {
        const newTickets = s.tickets + Math.max(0, amount);
        console.log('GameStore addTickets - old:', s.tickets, 'new:', newTickets);
        const newState = { ...s, tickets: newTickets };
        console.log('GameStore addTickets - new state:', newState);
        return newState;
      });
    },
    spendTickets: (amount) => {
      let success = false;
      setState((s) => {
        if (s.tickets >= amount) {
          success = true;
          return { ...s, tickets: s.tickets - amount };
        }
        return s;
      });
      return success;
    },
    addFood: (foodId, quantity) => {
      setState((s) => {
        const food = DEFAULT_FOODS.find(f => f.id === foodId);
        if (!food) return s;
        
        const currentQuantity = s.foodInventory[foodId]?.quantity || 0;
        return {
          ...s,
          foodInventory: {
            ...s.foodInventory,
            [foodId]: {
              quantity: currentQuantity + quantity,
              food
            }
          }
        };
      });
    },
    consumeFood: (foodId, quantity) => {
      let success = false;
      setState((s) => {
        const foodItem = s.foodInventory[foodId];
        if (foodItem && foodItem.quantity >= quantity) {
          success = true;
          return {
            ...s,
            foodInventory: {
              ...s.foodInventory,
              [foodId]: {
                ...foodItem,
                quantity: foodItem.quantity - quantity
              }
            }
          };
        }
        return s;
      });
      return success;
    },
    eatFood: (foodId) => {
      let success = false;
      setState((s) => {
        const foodItem = s.foodInventory[foodId];
        if (foodItem && foodItem.quantity > 0) {
          success = true;
          const staminaGain = foodItem.food.staminaValue;
          // Food gives bonus stamina (permanent)
          return {
            ...s,
            bonusStamina: s.bonusStamina + staminaGain,
            foodInventory: {
              ...s.foodInventory,
              [foodId]: {
                ...foodItem,
                quantity: foodItem.quantity - 1
              }
            }
          };
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
    levelUp: () => {
      setState((s) => {
        const newLevel = s.playerLevel + 1;
        // Level up gives bonus stamina (permanent)
        return {
          ...s,
          playerLevel: newLevel,
          bonusStamina: s.bonusStamina + 10 // +10 bonus stamina per level
        };
      });
    },
    reset: () => setState(DEFAULT_STATE),
  }), [state, hydrated]);

  return <GameContext.Provider value={api}>{children}</GameContext.Provider>;
};

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}


