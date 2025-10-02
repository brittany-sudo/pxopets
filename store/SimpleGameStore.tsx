import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FoodItem = {
  id: string;
  name: string;
  quantity: number;
  staminaValue: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
};

type SimpleGameState = {
  tickets: number;
  stamina: number;
  coins: number;
  gems: number;
  foodInventory: { [key: string]: FoodItem };
  devMode: boolean;
  lastStaminaUpdate: number;
};

type SimpleGameContextType = {
  state: SimpleGameState;
  addTickets: (amount: number) => void;
  addStamina: (amount: number) => void;
  addCoins: (amount: number) => void;
  addGems: (amount: number) => void;
  spendTickets: (amount: number) => boolean;
  spendStamina: (amount: number) => boolean;
  spendCoins: (amount: number) => boolean;
  spendGems: (amount: number) => boolean;
  addFood: (foodId: string, quantity: number) => void;
  consumeFood: (foodId: string, quantity: number) => boolean;
  toggleDevMode: () => void;
  setCurrency: (tickets: number, stamina: number, coins: number, gems: number) => void;
  resetGame: () => void;
  hydrated: boolean;
};

const SimpleGameContext = createContext<SimpleGameContextType | null>(null);

const DEFAULT_FOODS: { [key: string]: FoodItem } = {
  apple: {
    id: 'apple',
    name: 'Apple',
    quantity: 3,
    staminaValue: 5,
    rarity: 'common'
  },
  sandwich: {
    id: 'sandwich',
    name: 'Sandwich',
    quantity: 1,
    staminaValue: 15,
    rarity: 'common'
  },
  energy_drink: {
    id: 'energy_drink',
    name: 'Energy Drink',
    quantity: 0,
    staminaValue: 25,
    rarity: 'rare'
  },
  golden_apple: {
    id: 'golden_apple',
    name: 'Golden Apple',
    quantity: 0,
    staminaValue: 50,
    rarity: 'legendary'
  }
};

const DEFAULT_STATE: SimpleGameState = {
  tickets: 0,
  stamina: 100,
  coins: 50,
  gems: 25,
  foodInventory: DEFAULT_FOODS,
  devMode: false,
  lastStaminaUpdate: Date.now(),
};

const STORAGE_KEY = 'simple-game-state-v2';

export function SimpleGameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SimpleGameState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  // Load state from storage on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedState = JSON.parse(stored);
          // Handle migration from old save format that might not have gems
          const migratedState = {
            ...DEFAULT_STATE,
            ...parsedState,
            gems: parsedState.gems ?? DEFAULT_STATE.gems, // Ensure gems exists
          };
          setState(migratedState);
        }
      } catch (error) {
        console.error('Failed to load game state:', error);
      } finally {
        setHydrated(true);
      }
    };
    loadState();
  }, []);

  // Save state to storage whenever it changes
  useEffect(() => {
    if (hydrated) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
    }
  }, [state, hydrated]);

  const addTickets = (amount: number) => {
    console.log('Adding tickets:', amount);
    setState(prev => {
      const newState = { ...prev, tickets: prev.tickets + amount };
      console.log('New state:', newState);
      return newState;
    });
  };

  const addStamina = (amount: number) => {
    setState(prev => ({ ...prev, stamina: prev.stamina + amount }));
  };

  const addCoins = (amount: number) => {
    setState(prev => ({ ...prev, coins: prev.coins + amount }));
  };

  const addGems = (amount: number) => {
    console.log('Adding gems:', amount, 'Current gems:', state.gems);
    setState(prev => {
      const currentGems = prev.gems || 0; // Fallback to 0 if undefined
      const newGems = currentGems + amount;
      console.log('New gems:', newGems);
      return { ...prev, gems: newGems };
    });
  };

  const spendTickets = (amount: number): boolean => {
    if (state.tickets >= amount) {
      setState(prev => ({ ...prev, tickets: prev.tickets - amount }));
      return true;
    }
    return false;
  };

  const spendStamina = (amount: number): boolean => {
    if (state.stamina >= amount) {
      setState(prev => ({ ...prev, stamina: prev.stamina - amount }));
      return true;
    }
    return false;
  };

  const spendCoins = (amount: number): boolean => {
    if (state.coins >= amount) {
      setState(prev => ({ ...prev, coins: prev.coins - amount }));
      return true;
    }
    return false;
  };

  const spendGems = (amount: number): boolean => {
    const currentGems = state.gems || 0; // Fallback to 0 if undefined
    if (currentGems >= amount) {
      setState(prev => {
        const prevGems = prev.gems || 0;
        return { ...prev, gems: prevGems - amount };
      });
      return true;
    }
    return false;
  };

  const addFood = (foodId: string, quantity: number) => {
    setState(prev => ({
      ...prev,
      foodInventory: {
        ...prev.foodInventory,
        [foodId]: {
          ...prev.foodInventory[foodId],
          quantity: (prev.foodInventory[foodId]?.quantity || 0) + quantity
        }
      }
    }));
  };

  const consumeFood = (foodId: string, quantity: number): boolean => {
    const food = state.foodInventory[foodId];
    if (food && food.quantity >= quantity) {
      setState(prev => ({
        ...prev,
        foodInventory: {
          ...prev.foodInventory,
          [foodId]: {
            ...food,
            quantity: food.quantity - quantity
          }
        }
      }));
      return true;
    }
    return false;
  };

  const toggleDevMode = () => {
    setState(prev => ({ ...prev, devMode: !prev.devMode }));
  };

  const setCurrency = (tickets: number, stamina: number, coins: number, gems: number) => {
    setState(prev => ({
      ...prev,
      tickets: Math.max(0, tickets),
      stamina: Math.max(0, stamina),
      coins: Math.max(0, coins),
      gems: Math.max(0, gems)
    }));
  };

  const resetGame = () => {
    setState(DEFAULT_STATE);
  };

  const value: SimpleGameContextType = {
    state,
    addTickets,
    addStamina,
    addCoins,
    addGems,
    spendTickets,
    spendStamina,
    spendCoins,
    spendGems,
    addFood,
    consumeFood,
    toggleDevMode,
    setCurrency,
    resetGame,
    hydrated,
  };

  return (
    <SimpleGameContext.Provider value={value}>
      {children}
    </SimpleGameContext.Provider>
  );
}

export function useSimpleGame() {
  const context = useContext(SimpleGameContext);
  if (!context) {
    throw new Error('useSimpleGame must be used within SimpleGameProvider');
  }
  return context;
}



