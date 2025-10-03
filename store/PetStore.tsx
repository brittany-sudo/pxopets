import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AdoptedPet = {
  id: string;
  name: string;
  image: string;
  level: number;
  hp: number;
  atk: number;
  def: number;
  spd: number;
  luck: number;
  int: number;
  charm: number;
  dex: number;
  adoptedAt: string;
  happiness: number;
  lastFed: string | null;
  background: string;
  stamina: number; // Current stamina for this pet
  lastDailyStamina: string | null; // Last time daily stamina was added
};

export type PetState = {
  adoptedPets: AdoptedPet[];
  activePetId: string | null;
  maxPets: number;
  devMode: boolean;
};

type PetContextType = {
  state: PetState;
  adoptPet: (pet: Omit<AdoptedPet, 'adoptedAt' | 'happiness' | 'lastFed' | 'def' | 'spd' | 'luck' | 'int' | 'charm' | 'dex' | 'background' | 'stamina' | 'lastDailyStamina'>) => boolean;
  removePet: (petId: string) => boolean;
  setActivePet: (petId: string) => boolean;
  feedPet: (petId: string, staminaBoost: number) => boolean;
  playWithPet: (petId: string) => boolean;
  updatePetBackground: (petId: string, background: string) => boolean;
  getBackgroundOwner: (backgroundId: string) => AdoptedPet | null;
  canAdoptMore: () => boolean;
  getActivePet: () => AdoptedPet | null;
  getActivePetStamina: () => number;
  addStaminaToPet: (petId: string, amount: number) => boolean;
  spendStamina: (amount: number) => boolean;
  checkAndAddDailyStamina: () => void;
  resetAllPets: () => void;
  toggleDevMode: () => void;
  hydrated: boolean;
};

const DEFAULT_STATE: PetState = {
  adoptedPets: [],
  activePetId: null,
  maxPets: 5,
  devMode: false,
};

const STORAGE_KEY = 'pet-state-v1';

const PetContext = createContext<PetContextType | undefined>(undefined);

export function PetProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PetState>(DEFAULT_STATE);
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
        console.error('Failed to load pet state:', error);
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
          console.error('Failed to save pet state:', error);
        }
      };

      saveState();
    }
  }, [state, hydrated]);

  // Generate random stats for a pet (mostly very low, rare outliers)
  const generateRandomStats = () => {
    const stats = {
      def: 0,
      spd: 0,
      luck: 0,
      int: 0,
      charm: 0,
      dex: 0,
    };

    // First, generate all stats as very low values (3-15)
    const statKeys = Object.keys(stats) as (keyof typeof stats)[];
    statKeys.forEach(key => {
      stats[key] = Math.floor(Math.random() * 13) + 3; // 3-15
    });

    // 3% chance to give ONE random stat an extreme outlier value (40-65)
    const hasOutlier = Math.random() < 0.03;
    if (hasOutlier) {
      const outlierStat = statKeys[Math.floor(Math.random() * statKeys.length)];
      stats[outlierStat] = Math.floor(Math.random() * 26) + 40; // 40-65
    }

    return stats;
  };

  const adoptPet = (pet: Omit<AdoptedPet, 'adoptedAt' | 'happiness' | 'lastFed' | 'def' | 'spd' | 'luck' | 'int' | 'charm' | 'dex' | 'background' | 'stamina' | 'lastDailyStamina'>): boolean => {
    if (state.adoptedPets.length >= state.maxPets) {
      return false; // Can't adopt more pets
    }

    const randomStats = generateRandomStats();

    const newPet: AdoptedPet = {
      ...pet,
      ...randomStats,
      level: 1, // Always start at level 1
      adoptedAt: new Date().toISOString(),
      happiness: 100,
      lastFed: null,
      background: 'bg1', // Default background
      stamina: 150, // Start with 150 stamina
      lastDailyStamina: new Date().toISOString(), // Mark daily stamina as received
    };

    setState(prev => ({
      ...prev,
      adoptedPets: [...prev.adoptedPets, newPet],
      activePetId: newPet.id, // Always set newly adopted pet as active
    }));

    return true;
  };

  const removePet = (petId: string): boolean => {
    setState(prev => {
      const newPets = prev.adoptedPets.filter(pet => pet.id !== petId);
      const newActivePetId = prev.activePetId === petId 
        ? (newPets.length > 0 ? newPets[0].id : null)
        : prev.activePetId;

      return {
        ...prev,
        adoptedPets: newPets,
        activePetId: newActivePetId,
      };
    });

    return true;
  };

  const setActivePet = (petId: string): boolean => {
    const petExists = state.adoptedPets.some(pet => pet.id === petId);
    if (!petExists) return false;

    setState(prev => ({
      ...prev,
      activePetId: petId,
    }));

    return true;
  };

  const feedPet = (petId: string, staminaBoost: number = 15): boolean => {
    setState(prev => ({
      ...prev,
      adoptedPets: prev.adoptedPets.map(pet => 
        pet.id === petId 
          ? { 
              ...pet, 
              happiness: Math.min(100, pet.happiness + 10),
              stamina: pet.stamina + staminaBoost, // Add stamina from food
              lastFed: new Date().toISOString(),
            }
          : pet
      ),
    }));

    return true;
  };

  const playWithPet = (petId: string): boolean => {
    setState(prev => ({
      ...prev,
      adoptedPets: prev.adoptedPets.map(pet => 
        pet.id === petId 
          ? { 
              ...pet, 
              happiness: Math.min(100, pet.happiness + 5),
            }
          : pet
      ),
    }));

    return true;
  };

  const updatePetBackground = (petId: string, background: string): boolean => {
    // Check if this background is already equipped on another pet
    const alreadyEquipped = state.adoptedPets.some(pet => 
      pet.id !== petId && pet.background === background
    );

    if (alreadyEquipped) {
      return false; // Can't equip a background that's already in use
    }

    setState(prev => ({
      ...prev,
      adoptedPets: prev.adoptedPets.map(pet => 
        pet.id === petId 
          ? { ...pet, background }
          : pet
      ),
    }));

    return true;
  };

  const getBackgroundOwner = (backgroundId: string): AdoptedPet | null => {
    return state.adoptedPets.find(pet => pet.background === backgroundId) || null;
  };

  const canAdoptMore = (): boolean => {
    return state.adoptedPets.length < state.maxPets;
  };

  const getActivePet = (): AdoptedPet | null => {
    if (!state.activePetId) return null;
    return state.adoptedPets.find(pet => pet.id === state.activePetId) || null;
  };

  const resetAllPets = () => {
    setState(DEFAULT_STATE);
  };

  const toggleDevMode = () => {
    setState(prev => ({ ...prev, devMode: !prev.devMode }));
  };

  const getActivePetStamina = (): number => {
    const activePet = getActivePet();
    return activePet ? activePet.stamina : 0;
  };

  const addStaminaToPet = (petId: string, amount: number): boolean => {
    setState(prev => ({
      ...prev,
      adoptedPets: prev.adoptedPets.map(pet => 
        pet.id === petId 
          ? { ...pet, stamina: pet.stamina + amount }
          : pet
      ),
    }));
    return true;
  };

  const spendStamina = (amount: number): boolean => {
    const activePet = getActivePet();
    if (!activePet || activePet.stamina < amount) {
      return false; // Not enough stamina
    }

    setState(prev => ({
      ...prev,
      adoptedPets: prev.adoptedPets.map(pet => 
        pet.id === prev.activePetId 
          ? { ...pet, stamina: pet.stamina - amount }
          : pet
      ),
    }));

    return true;
  };

  const checkAndAddDailyStamina = () => {
    const activePet = getActivePet();
    if (!activePet) return;

    const now = new Date();
    const lastStamina = activePet.lastDailyStamina ? new Date(activePet.lastDailyStamina) : null;

    // Check if it's been 24 hours since last daily stamina
    if (!lastStamina || (now.getTime() - lastStamina.getTime()) >= 24 * 60 * 60 * 1000) {
      setState(prev => ({
        ...prev,
        adoptedPets: prev.adoptedPets.map(pet => 
          pet.id === prev.activePetId 
            ? { 
                ...pet, 
                stamina: pet.stamina + 100, 
                lastDailyStamina: now.toISOString() 
              }
            : pet
        ),
      }));
    }
  };

  const value: PetContextType = {
    state,
    adoptPet,
    removePet,
    setActivePet,
    feedPet,
    playWithPet,
    updatePetBackground,
    getBackgroundOwner,
    canAdoptMore,
    getActivePet,
    getActivePetStamina,
    addStaminaToPet,
    spendStamina,
    checkAndAddDailyStamina,
    resetAllPets,
    toggleDevMode,
    hydrated,
  };

  return (
    <PetContext.Provider value={value}>
      {children}
    </PetContext.Provider>
  );
}

export function usePets() {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
}
