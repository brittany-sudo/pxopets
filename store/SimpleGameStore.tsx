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
  ownedBackgrounds: string[]; // IDs of backgrounds owned by the player
  devMode: boolean;
  lastStaminaUpdate: number;
  loginStreak: number; // consecutive days logged in
  lastLoginDate: string; // date string in YYYY-MM-DD format
  streakRewardClaimed: boolean; // whether the 3-day reward has been claimed
  hometown: string; // player's selected hometown
  selectedAvatar: string; // current avatar image name
  playerTag: string; // player's custom title/tag
  collectedAvatars: string[]; // array of avatar image names the player has collected
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
  addBackground: (backgroundId: string) => void;
  hasBackground: (backgroundId: string) => boolean;
  toggleDevMode: () => void;
  setCurrency: (tickets: number, stamina: number, coins: number, gems: number) => void;
  resetGame: () => void;
  checkAndUpdateLoginStreak: () => void;
  claimStreakReward: () => boolean;
  setHometown: (hometown: string) => void;
  setAvatar: (avatar: string) => void;
  setPlayerTag: (tag: string) => void;
  addAvatar: (avatar: string) => void;
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
  gems: 0,
  foodInventory: DEFAULT_FOODS,
  ownedBackgrounds: ['bg1'], // Default background is always owned
  devMode: false,
  lastStaminaUpdate: Date.now(),
  loginStreak: 0,
  lastLoginDate: '',
  streakRewardClaimed: false,
  hometown: 'Pxoburbs', // Default hometown
  selectedAvatar: 'avatar1.png', // Default avatar
  playerTag: 'Adventure Seeker', // Default tag
  collectedAvatars: ['avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png', 'avatar5.png'], // Starting avatars (all for testing)
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
          // Handle migration from old save format
          const migratedState = {
            ...DEFAULT_STATE,
            ...parsedState,
            gems: parsedState.gems ?? DEFAULT_STATE.gems,
            ownedBackgrounds: parsedState.ownedBackgrounds ?? DEFAULT_STATE.ownedBackgrounds,
            loginStreak: parsedState.loginStreak ?? DEFAULT_STATE.loginStreak,
            lastLoginDate: parsedState.lastLoginDate ?? DEFAULT_STATE.lastLoginDate,
            streakRewardClaimed: parsedState.streakRewardClaimed ?? DEFAULT_STATE.streakRewardClaimed,
            hometown: parsedState.hometown ?? DEFAULT_STATE.hometown,
            selectedAvatar: parsedState.selectedAvatar ?? DEFAULT_STATE.selectedAvatar,
            playerTag: parsedState.playerTag ?? DEFAULT_STATE.playerTag,
            collectedAvatars: parsedState.collectedAvatars ?? DEFAULT_STATE.collectedAvatars,
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

  // Check and update login streak when app loads
  useEffect(() => {
    if (hydrated) {
      checkAndUpdateLoginStreak();
    }
  }, [hydrated]);

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

  const addBackground = (backgroundId: string) => {
    setState(prev => ({
      ...prev,
      ownedBackgrounds: prev.ownedBackgrounds.includes(backgroundId)
        ? prev.ownedBackgrounds
        : [...prev.ownedBackgrounds, backgroundId]
    }));
  };

  const hasBackground = (backgroundId: string): boolean => {
    return state.ownedBackgrounds.includes(backgroundId);
  };

  const resetGame = () => {
    setState(DEFAULT_STATE);
  };

  const getTodayDateString = (): string => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const checkAndUpdateLoginStreak = () => {
    const today = getTodayDateString();
    
    setState(prev => {
      // If already logged in today, don't update
      if (prev.lastLoginDate === today) {
        return prev;
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

      let newStreak = 1;
      let newStreakRewardClaimed = false;

      // If they logged in yesterday, increment streak
      if (prev.lastLoginDate === yesterdayString) {
        newStreak = prev.loginStreak + 1;
        // Keep reward claimed status if streak continues
        newStreakRewardClaimed = prev.streakRewardClaimed;
      } else if (prev.lastLoginDate === '') {
        // First time login
        newStreak = 1;
      } else {
        // Streak broken, reset
        newStreak = 1;
        newStreakRewardClaimed = false;
      }

      // If reached 3+ days and haven't claimed, make reward available
      if (newStreak >= 3 && prev.loginStreak < 3) {
        newStreakRewardClaimed = false;
      }

      console.log('Login streak updated:', {
        prevStreak: prev.loginStreak,
        newStreak,
        lastLogin: prev.lastLoginDate,
        today,
      });

      return {
        ...prev,
        loginStreak: newStreak,
        lastLoginDate: today,
        streakRewardClaimed: newStreakRewardClaimed,
      };
    });
  };

  const claimStreakReward = (): boolean => {
    if (state.loginStreak >= 3 && !state.streakRewardClaimed) {
      setState(prev => ({
        ...prev,
        stamina: prev.stamina + 25,
        streakRewardClaimed: true,
      }));
      return true;
    }
    return false;
  };

  const setHometown = (hometown: string) => {
    setState(prev => ({ ...prev, hometown }));
  };

  const setAvatar = (avatar: string) => {
    setState(prev => ({ ...prev, selectedAvatar: avatar }));
  };

  const setPlayerTag = (tag: string) => {
    setState(prev => ({ ...prev, playerTag: tag }));
  };

  const addAvatar = (avatar: string) => {
    setState(prev => {
      if (!prev.collectedAvatars.includes(avatar)) {
        return { ...prev, collectedAvatars: [...prev.collectedAvatars, avatar] };
      }
      return prev;
    });
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
    addBackground,
    hasBackground,
    toggleDevMode,
    setCurrency,
    resetGame,
    checkAndUpdateLoginStreak,
    claimStreakReward,
    setHometown,
    setAvatar,
    setPlayerTag,
    addAvatar,
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



