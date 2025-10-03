import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
}

interface InventoryContextType {
  inventory: InventoryItem[];
  addToInventory: (itemId: string, itemName: string) => void;
  removeFromInventory: (itemId: string) => void;
  getItemQuantity: (itemId: string) => number;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

interface InventoryProviderProps {
  children: ReactNode;
}

export const InventoryProvider: React.FC<InventoryProviderProps> = ({ children }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const addToInventory = (itemId: string, itemName: string) => {
    setInventory(prev => {
      const existingItem = prev.find(item => item.id === itemId);
      if (existingItem) {
        return prev.map(item => 
          item.id === itemId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { id: itemId, name: itemName, quantity: 1 }];
      }
    });
  };

  const removeFromInventory = (itemId: string) => {
    setInventory(prev => {
      const existingItem = prev.find(item => item.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(item => 
          item.id === itemId 
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prev.filter(item => item.id !== itemId);
      }
    });
  };

  const getItemQuantity = (itemId: string): number => {
    const item = inventory.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };

  const value: InventoryContextType = {
    inventory,
    addToInventory,
    removeFromInventory,
    getItemQuantity,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};














