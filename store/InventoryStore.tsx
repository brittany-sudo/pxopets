import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type InventoryItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'food' | 'drink' | 'snack' | 'special' | 'ticket' | 'fishing';
  quantity: number;
  description?: string;
};

export type SafetyDepositBox = {
  [itemId: string]: InventoryItem;
};

export type InventoryState = {
  mainInventory: InventoryItem[];
  safetyDepositBox: SafetyDepositBox;
  maxMainInventory: number;
  devMode: boolean;
};

type InventoryContextType = {
  state: InventoryState;
  addItem: (item: Omit<InventoryItem, 'quantity'>, quantity?: number) => boolean;
  removeItem: (itemId: string, quantity?: number) => boolean;
  moveToSafetyDeposit: (itemId: string) => boolean;
  moveFromSafetyDeposit: (itemId: string) => boolean;
  getItemQuantity: (itemId: string) => number;
  getMainInventoryCount: () => number;
  getSafetyDepositCount: () => number;
  clearAllItems: () => void;
  resetInventory: () => void;
  toggleDevMode: () => void;
  hydrated: boolean;
};

const DEFAULT_STATE: InventoryState = {
  mainInventory: [],
  safetyDepositBox: {},
  maxMainInventory: 20,
  devMode: false,
};

const STORAGE_KEY = 'inventory-state-v1';

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<InventoryState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  // Load state from storage on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedState = JSON.parse(stored);
          setState(parsedState);
        }
      } catch (error) {
        console.error('Failed to load inventory state:', error);
      } finally {
        setHydrated(true);
      }
    };

    loadState();
  }, []);

  // Save state to storage whenever it changes
  useEffect(() => {
    if (hydrated) {
      const saveState = async () => {
        try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
          console.error('Failed to save inventory state:', error);
        }
      };

      saveState();
    }
  }, [state, hydrated]);

  const addItem = (item: Omit<InventoryItem, 'quantity'>, quantity: number = 1): boolean => {
    setState(prev => {
      const newState = { ...prev };
      
      // Check if item already exists in main inventory
      const existingItemIndex = newState.mainInventory.findIndex(invItem => invItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Item exists, increase quantity
        newState.mainInventory[existingItemIndex].quantity += quantity;
        return newState;
      }
      
      // Check if we have space in main inventory
      if (newState.mainInventory.length >= newState.maxMainInventory) {
        // No space, add to safety deposit box
        newState.safetyDepositBox[item.id] = {
          ...item,
          quantity: quantity
        };
        return newState;
      }
      
      // Add to main inventory
      newState.mainInventory.push({
        ...item,
        quantity: quantity
      });
      
      return newState;
    });
    
    return true;
  };

  const removeItem = (itemId: string, quantity: number = 1): boolean => {
    setState(prev => {
      const newState = { ...prev };
      
      // Check main inventory first
      const mainItemIndex = newState.mainInventory.findIndex(item => item.id === itemId);
      
      if (mainItemIndex >= 0) {
        const item = newState.mainInventory[mainItemIndex];
        
        if (item.quantity <= quantity) {
          // Remove entire item
          newState.mainInventory.splice(mainItemIndex, 1);
        } else {
          // Reduce quantity
          newState.mainInventory[mainItemIndex].quantity -= quantity;
        }
        
        return newState;
      }
      
      // Check safety deposit box
      if (newState.safetyDepositBox[itemId]) {
        const item = newState.safetyDepositBox[itemId];
        
        if (item.quantity <= quantity) {
          // Remove entire item
          delete newState.safetyDepositBox[itemId];
        } else {
          // Reduce quantity
          newState.safetyDepositBox[itemId].quantity -= quantity;
        }
        
        return newState;
      }
      
      return newState;
    });
    
    return true;
  };

  const moveToSafetyDeposit = (itemId: string): boolean => {
    setState(prev => {
      const newState = { ...prev };
      const mainItemIndex = newState.mainInventory.findIndex(item => item.id === itemId);
      
      if (mainItemIndex >= 0) {
        const item = newState.mainInventory[mainItemIndex];
        
        // Add to safety deposit box
        if (newState.safetyDepositBox[itemId]) {
          newState.safetyDepositBox[itemId].quantity += item.quantity;
        } else {
          newState.safetyDepositBox[itemId] = { ...item };
        }
        
        // Remove from main inventory
        newState.mainInventory.splice(mainItemIndex, 1);
        
        return newState;
      }
      
      return newState;
    });
    
    return true;
  };

  const moveFromSafetyDeposit = (itemId: string): boolean => {
    setState(prev => {
      const newState = { ...prev };
      
      // Check if we have space in main inventory
      if (newState.mainInventory.length >= newState.maxMainInventory) {
        return newState; // No space
      }
      
      if (newState.safetyDepositBox[itemId]) {
        const item = newState.safetyDepositBox[itemId];
        
        // Add to main inventory
        newState.mainInventory.push({ ...item });
        
        // Remove from safety deposit box
        delete newState.safetyDepositBox[itemId];
        
        return newState;
      }
      
      return newState;
    });
    
    return true;
  };

  const getItemQuantity = (itemId: string): number => {
    const mainItem = state.mainInventory.find(item => item.id === itemId);
    const safetyItem = state.safetyDepositBox[itemId];
    
    const mainQuantity = mainItem ? mainItem.quantity : 0;
    const safetyQuantity = safetyItem ? safetyItem.quantity : 0;
    
    return mainQuantity + safetyQuantity;
  };

  const getMainInventoryCount = (): number => {
    return state.mainInventory.reduce((total, item) => total + item.quantity, 0);
  };

  const getSafetyDepositCount = (): number => {
    return Object.values(state.safetyDepositBox).reduce((total, item) => total + item.quantity, 0);
  };

  const clearAllItems = () => {
    setState(prev => ({
      ...prev,
      mainInventory: [],
      safetyDepositBox: {}
    }));
  };

  // Reset inventory to empty state (for fixing dev items issue)
  const resetInventory = async () => {
    // Clear AsyncStorage completely
    await AsyncStorage.removeItem(STORAGE_KEY);
    // Reset to default state
    setState(DEFAULT_STATE);
  };


  const toggleDevMode = () => {
    setState(prev => ({ ...prev, devMode: !prev.devMode }));
  };

  const value: InventoryContextType = {
    state,
    addItem,
    removeItem,
    moveToSafetyDeposit,
    moveFromSafetyDeposit,
    getItemQuantity,
    getMainInventoryCount,
    getSafetyDepositCount,
    clearAllItems,
    resetInventory,
    toggleDevMode,
    hydrated,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
