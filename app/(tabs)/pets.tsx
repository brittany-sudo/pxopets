import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Image, StyleSheet, View as RNView, ScrollView, Pressable, Modal, Alert, Animated, Dimensions, PanResponder } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useSimpleGame } from '@/store/SimpleGameStore';
import { usePets } from '@/store/PetStore';
import { useInventory } from '@/store/InventoryStore';
import PixelButton from '@/components/PixelButton';
import { Link, router, useFocusEffect } from 'expo-router';
import BorderedBox from '@/components/BorderedBox';
import JazzyTitle from '@/components/JazzyTitle';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DraggableFood from '@/components/DraggableFood';
import { Rect } from '@/utils/dragMath';

// Removed OldDraggableFood component - now using new DraggableFood component with gesture handlers

export default function PetsScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const { state: gameState, hydrated: gameHydrated } = useSimpleGame();
  const { 
    state: petState, 
    setActivePet, 
    feedPet, 
    playWithPet, 
    updatePetBackground, 
    getBackgroundOwner,
    getActivePet,
    canAdoptMore,
    resetAllPets,
    toggleDevMode,
    hydrated: petsHydrated 
  } = usePets();
  const { state: inventoryState, removeItem, hydrated: inventoryHydrated } = useInventory();
  
  const [showClosetModal, setShowClosetModal] = useState(false);
  const [closetTab, setClosetTab] = useState<'backgrounds' | 'skins' | 'subpxos'>('backgrounds');
  const [showFeedModal, setShowFeedModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [equippedWeapon, setEquippedWeapon] = useState('none');
  const [equippedAccessory, setEquippedAccessory] = useState('none');
  // Feed menu food sprite state
  const [selectedFoodSprite, setSelectedFoodSprite] = useState(null);
  
  // Removed old draggable food state - now using new gesture handler approach

  // State for hearts animation
  const [hearts, setHearts] = useState<Array<{
    id: string;
    x: number;
    y: number;
    rotation: number;
    opacity: Animated.Value;
    translateY: Animated.Value;
    scale: Animated.Value;
  }>>([]);

  // State for new gesture handler approach
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [visibleImageBounds, setVisibleImageBounds] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [petRect, setPetRect] = useState<Rect>({ x: 0, y: 0, width: 88, height: 88 });
  const [showNewFood, setShowNewFood] = useState(false);
  const [selectedFoodForNew, setSelectedFoodForNew] = useState<any>(null);
  
  // Pet drag position state - using transform for smooth movement
  const [petPosition, setPetPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  
  // Stable drag state ref to avoid re-renders
  const dragStateRef = useRef({
    dragging: false,
    startTouch: { x: 0, y: 0 },
    startPos: { x: 0, y: 0 },
    rafId: 0 as number | 0,
  });

  // Calculate center position for heart animations
  const screenWidth = Dimensions.get('window').width;
  const containerWidth = screenWidth - 40;
  const containerHeight = 200;
  const petWidth = 88;
  const petHeight = 88;
  const centerX = (containerWidth - petWidth) / 2;
  const centerY = (containerHeight - petHeight) / 2;
  
  // Animation values for hearts
  // Removed animation values for now
  
  const activePet = getActivePet();
  
  // Save pet position to AsyncStorage
  const savePetPosition = async (position: { x: number, y: number }) => {
    try {
      await AsyncStorage.setItem('petPosition', JSON.stringify(position));
    } catch (error) {
      console.error('Failed to save pet position:', error);
    }
  };
  
  // Load pet position from AsyncStorage
  const loadPetPosition = async () => {
    try {
      const savedPosition = await AsyncStorage.getItem('petPosition');
      if (savedPosition) {
        const position = JSON.parse(savedPosition);
        setPetPosition(position);
      } else {
        // If no saved position, use center position
        resetPetPosition();
      }
    } catch (error) {
      console.error('Failed to load pet position:', error);
      // Fallback to center position
      resetPetPosition();
    }
  };
  
  // Load saved position on component mount
  useEffect(() => {
    loadPetPosition();
  }, []);

  // Update petRect whenever petPosition changes
  useEffect(() => {
    setPetRect({
      x: petPosition.x,
      y: petPosition.y,
      width: 88,
      height: 88,
    });
  }, [petPosition]);

  // Only reset position when a new pet becomes active (not when returning to the same pet)
  useEffect(() => {
    if (activePet) {
      // Only reset if this is a truly new pet, not just returning to the same pet
      loadPetPosition(); // Load saved position instead of resetting
    }
  }, [activePet?.id]);
  
  // Reset pet position to center
  const resetPetPosition = () => {
    const screenWidth = Dimensions.get('window').width;
    const containerWidth = screenWidth - 40;
    const petWidth = 88;
    const petHeight = 88;
    const containerHeight = 200; // Match the actual container height
    
    const centerX = (containerWidth - petWidth) / 2;
    const centerY = (containerHeight - petHeight) / 2;
    
    const centerPosition = { x: centerX, y: centerY };
    setPetPosition(centerPosition);
    savePetPosition(centerPosition);
  };
  
  // Clamp position to container bounds - fixed for sprite size issues
  const clampToBounds = (x: number, y: number) => {
    const screenWidth = Dimensions.get('window').width;
    const containerWidth = screenWidth - 40; // 20px padding each side
    const containerHeight = 200; // Actual container height from styles
    const petWidth = 88;
    const petHeight = 88;
    
    // Debug logging
    console.log('Container:', containerWidth, 'x', containerHeight);
    console.log('Pet:', petWidth, 'x', petHeight);
    console.log('Position before clamp:', x, y);
    
    // If the sprite is larger than the container, allow negative range
    // Example: if petWidth=500 and containerWidth=300, range should be [-412, 0]
    const minX = Math.min(0, containerWidth - petWidth);
    const maxX = Math.max(0, containerWidth - petWidth);
    const minY = Math.min(0, containerHeight - petHeight);
    const maxY = Math.max(0, containerHeight - petHeight);
    
    const clamped = {
      x: Math.max(minX, Math.min(x, maxX)),
      y: Math.max(minY, Math.min(y, maxY)),
    };
    
    console.log('Clamped to:', clamped);
    console.log('Y range:', minY, 'to', maxY);
    return clamped;
  };

  // Simple PanResponder for pet dragging
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt, gestureState) => {
      // Check for double tap to reset position
      const now = Date.now();
      if (now - lastTap < 300) {
        resetPetPosition();
        setLastTap(0);
        return;
      }
      setLastTap(now);
      
      // Use gestureState coordinates (more reliable)
      const startX = gestureState.x0;
      const startY = gestureState.y0;
      
      // Store initial touch and position
      dragStateRef.current.dragging = true;
      dragStateRef.current.startTouch = { x: startX, y: startY };
      dragStateRef.current.startPos = { ...petPosition };
      setIsDragging(true);
    },
    onPanResponderMove: (evt, gestureState) => {
      if (!dragStateRef.current.dragging) return;
      
      // Use gestureState coordinates
      const currentX = gestureState.moveX;
      const currentY = gestureState.moveY;
      
      // Calculate movement from start position
      const dx = currentX - dragStateRef.current.startTouch.x;
      const dy = currentY - dragStateRef.current.startTouch.y;
      
      // New position relative to where we started dragging
      const desired = {
        x: dragStateRef.current.startPos.x + dx,
        y: dragStateRef.current.startPos.y + dy,
      };
      
      // Clamp to bounds
      const clamped = clampToBounds(desired.x, desired.y);
      setPetPosition(clamped);
      // Save position immediately during drag for better persistence
      savePetPosition(clamped);
    },
    onPanResponderRelease: () => {
      dragStateRef.current.dragging = false;
      setIsDragging(false);
      savePetPosition(petPosition);
    },
  });
  
  // Reset scroll position when screen comes into focus (only bottom section)
  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );
  
  // Removed animation useEffect for now
  
  // Wait for data to load before rendering
  if (!gameHydrated || !petsHydrated || !inventoryHydrated) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  
  const pets = {
    juno: {
      name: 'JUNO',
      image: require('@/assets/images/tigerguy.png'),
      level: 1,
      hp: 100,
      atk: 50
    },
    frekki: {
      name: 'FREKKI',
      image: require('@/assets/images/frekki.png'),
      level: 3,
      hp: 85,
      atk: 42
    },
    lallazo: {
      name: 'LALLAZO',
      image: require('@/assets/images/lallazo.png'),
      level: 5,
      hp: 92,
      atk: 38
    },
    technor: {
      name: 'TECHNOR',
      image: require('@/assets/images/robot-guy.png'),
      level: 2,
      hp: 78,
      atk: 45
    }
  };

  // Background collection - bg1 is default and always available
  // All available backgrounds in the game
  const allBackgrounds: { [key: string]: { id: string; name: string; image: any; rarity: string } } = {
    bg1: { 
      id: 'bg1', 
      name: 'Default', 
      image: require('@/assets/images/bg1.png'), 
      rarity: 'common' 
    },
    bg_vapoburbs: {
      id: 'bg_vapoburbs',
      name: 'Vapoburbs',
      image: require('@/assets/images/bg-vapoburbs.png'),
      rarity: 'common'
    },
    bg_barrelhaven: {
      id: 'bg_barrelhaven',
      name: 'Barrelhaven Warren',
      image: require('@/assets/images/bg-barrelhaven-warren.png'),
      rarity: 'common'
    },
    bg_vineyard: {
      id: 'bg_vineyard',
      name: 'Vineyard',
      image: require('@/assets/images/vineyard-bg.png'),
      rarity: 'common'
    },
    bg_hovercar_races: {
      id: 'bg_hovercar_races',
      name: 'Hovercar Races',
      image: require('@/assets/images/bg-hovercar-races.png'),
      rarity: 'common'
    },
    bg_fortune_tent: {
      id: 'bg_fortune_tent',
      name: 'Fortune Tent',
      image: require('@/assets/images/bg-fortune-tent.png'),
      rarity: 'common'
    },
    bg_swamp_lagoon: {
      id: 'bg_swamp_lagoon',
      name: 'Swamp Lagoon',
      image: require('@/assets/images/bg-swamp-lagoon.png'),
      rarity: 'common'
    },
    bg_zodiac_carousel: {
      id: 'bg_zodiac_carousel',
      name: 'Zodiac Carousel',
      image: require('@/assets/images/bg-zodiac-carousel.png'),
      rarity: 'common'
    },
    bg_twilight_sky: {
      id: 'bg_twilight_sky',
      name: 'Twilight Sky',
      image: require('@/assets/images/bg-twlight-sky.png'),
      rarity: 'common'
    },
  };

  // Filter to only show backgrounds the player owns
  const ownedBackgrounds = Object.values(allBackgrounds).filter(bg => 
    gameState.ownedBackgrounds.includes(bg.id)
  );

  const equipment = {
    weapons: {
      none: { id: 'none', name: 'None', icon: 'hand-paper-o', unlocked: true },
      sword: { id: 'sword', name: 'Wooden Sword', icon: 'flash', unlocked: true },
      staff: { id: 'staff', name: 'Magic Staff', icon: 'magic', unlocked: false, cost: 100 },
      bow: { id: 'bow', name: 'Crystal Bow', icon: 'bullseye', unlocked: false, cost: 200 }
    },
    accessories: {
      none: { id: 'none', name: 'None', icon: 'circle-o', unlocked: true },
      crown: { id: 'crown', name: 'Golden Crown', icon: 'star', unlocked: false, cost: 300 },
      cape: { id: 'cape', name: 'Hero Cape', icon: 'flag', unlocked: false, cost: 250 },
      amulet: { id: 'amulet', name: 'Power Amulet', icon: 'heart', unlocked: false, cost: 400 }
    }
  };

  // Image map for food items - maps item IDs to their actual image files
  const foodImageMap: { [key: string]: any } = {
    // QuickStop items (by actual inventory IDs)
    'quickstop-coffee': require('@/assets/images/quickstopcoffee.png'),
    'monthly-slushee': require('@/assets/images/slushee3.png'),
    
    // QuickStop items (by item ID from store)
    's1': require('@/assets/images/glow-worms.png'), // Glow Worm Gummies
    's2': require('@/assets/images/hotchips.png'), // Hot Chips
    's3': require('@/assets/images/slushee.png'), // Slushee
    's4': require('@/assets/images/neon-cola.png'), // Neon Cola
    's5': require('@/assets/images/astro-tarts.png'), // Astro Tarts
    's6': require('@/assets/images/glitterdog.png'), // Glitterdog
    's7': require('@/assets/images/quickchipz.png'), // Quick Chipz
    's8': require('@/assets/images/saturnsoda.png'), // Saturn Soda
    's9': require('@/assets/images/orbit-rings.png'), // Orbit Rings
    'l1': require('@/assets/images/gumballs.png'), // Space Bubblegum
    'l2': require('@/assets/images/cosmicburger.png'), // Cosmic Burger
    'l3': require('@/assets/images/pouchdrink.png'), // Punch Pouch
    'l4': require('@/assets/images/chocodonut.png'), // Choco-Donut
    
    // Additional food items
    'astro-tarts': require('@/assets/images/astro-tarts.png'), // Astro Tarts
    'astrotarts': require('@/assets/images/astro-tarts.png'), // Astro Tarts (alternative spelling)
    'astro tarts': require('@/assets/images/astro-tarts.png'), // Astro Tarts (with space)
    
    // Generic food/drink names (in case they're stored differently)
    'cosmicburger': require('@/assets/images/cosmicburger.png'),
    'cupnoddle': require('@/assets/images/cupnoddle.png'),
    'cupnoodle': require('@/assets/images/cupnoodle.png'),
    'chocolate': require('@/assets/images/chocolate.png'),
    'pouchdrink': require('@/assets/images/pouchdrink.png'),
    'energydrink': require('@/assets/images/energydrink.png'),
    'quickstopcoffee': require('@/assets/images/quickstopcoffee.png'),
    'chocodonut': require('@/assets/images/chocodonut.png'),
    'slushee': require('@/assets/images/slushee.png'),
    'slushee3': require('@/assets/images/slushee3.png'),
    'milkshake': require('@/assets/images/milkshake.png'),
    'milkshakes': require('@/assets/images/milkshakes.png'),
    'hotchips': require('@/assets/images/hotchips.png'),
    'potatochomps': require('@/assets/images/potatochomps.png'),
    'regularhotdog': require('@/assets/images/regularhotdog.png'),
    'quickdog': require('@/assets/images/regularhotdog.png'),
    'lil-soda': require('@/assets/images/lil-soda.png'),
    'icecreamsandwich': require('@/assets/images/icecreamsandwich.png'),
    'gumballs': require('@/assets/images/gumballs.png'),
    'nuggets': require('@/assets/images/nuggets.png'),
    'saturnsoda': require('@/assets/images/saturnsoda.png'),
    'glowcorn': require('@/assets/images/glowcorn.png'),
    'glow-worm-gummies': require('@/assets/images/glow-worms.png'), // Glow Worm Gummies
    'glowwormgummies': require('@/assets/images/glow-worms.png'), // Glow Worm Gummies (no spaces)
    'glow worm gummies': require('@/assets/images/glow-worms.png'), // Glow Worm Gummies (with spaces)
    'glow worms': require('@/assets/images/glow-worms.png'), // Glow Worms
    'glowworms': require('@/assets/images/glow-worms.png'), // Glow Worms (no spaces)
    'glow-worms': require('@/assets/images/glow-worms.png'), // Glow Worms (with hyphen)
    
    // Arcade/Rink items
    'arcadefries': require('@/assets/images/arcadefries.png'),
    'flamingoburger': require('@/assets/images/flamingoburger.png'),
    'galaxysundae': require('@/assets/images/galaxysundae.png'),
    'glowshake': require('@/assets/images/glowshake.png'),
    'rinkpizza': require('@/assets/images/rinkpizza.png'),
    'rinkpopcorn': require('@/assets/images/rinkpopcorn.png'),
    'rinkpretzel': require('@/assets/images/rinkpretzel.png'),
    
    // Seafood items
    'clamchowder': require('@/assets/images/clamchowder.png'),
    'fishstew': require('@/assets/images/fishstew.png'),
    'shrimpcocktail': require('@/assets/images/shrimpcocktail.png'),
    'pickledherring': require('@/assets/images/pickledherring.png'),
    'blue-tbone': require('@/assets/images/blue-tbone.png'),
    
    // Specialty items
    'moonpetal-tea': require('@/assets/images/moonpetal-tea.png'),
    'stardust-sourdough': require('@/assets/images/stardust-sourdough.png'),
    'moonproof-loaf': require('@/assets/images/moonproof-loaf.png'),
    
    // Cocktails/Drinks
    'aurora-highball': require('@/assets/images/aurora-highball.png'),
    'pink-sand-shaker': require('@/assets/images/pink-sand-shaker.png'),
    'mirage-martini': require('@/assets/images/mirage-martini.png'),
    'solar-flare-sling': require('@/assets/images/solar-flare-sling.png'),
    'starlight-sour': require('@/assets/images/starlight-sour.png'),
  };

  // Get food items from actual inventory (food, drink, snack categories)
  // Exclude Pxogulp refillable jugs as they are not feedable
  const availableFoods = (inventoryState?.mainInventory || [])
    .filter(item => 
      item && 
      ['food', 'drink', 'snack'].includes(item.category) && 
      !(item.name && item.name.toLowerCase().includes('pxogulp')) &&
      !(item.id && item.id.includes('pxogulp'))
    )
    .map(item => {
      try {
        // Process food item
        
        // Get the image from the map with multiple fallback strategies
        let imageSource = null;
      
      // Try exact ID match first
      if (item.id && foodImageMap[item.id]) {
        imageSource = foodImageMap[item.id];
        console.log('Found by ID:', item.id);
      }
      // Try image property if it exists
      else if (item.image && foodImageMap[item.image]) {
        imageSource = foodImageMap[item.image];
        console.log('Found by image property:', item.image);
      }
      // Try name-based matching (convert to lowercase, remove spaces/special chars)
      else if (item.name) {
        const nameKey = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        console.log('Searching for name:', nameKey);
        const matchingKey = Object.keys(foodImageMap).find(key => 
          key.toLowerCase().replace(/[^a-z0-9]/g, '') === nameKey
        );
        if (matchingKey) {
          imageSource = foodImageMap[matchingKey];
          console.log('Found by exact name match:', matchingKey);
        } else {
          // Try partial matching for common variations
          const partialMatch = Object.keys(foodImageMap).find(key => {
            const keyNormalized = key.toLowerCase().replace(/[^a-z0-9]/g, '');
            return nameKey.includes(keyNormalized) || keyNormalized.includes(nameKey);
          });
          if (partialMatch) {
            imageSource = foodImageMap[partialMatch];
            console.log('Found by partial match:', partialMatch);
          }
        }
      }
      
      // Fallback to burger if no match found
      if (!imageSource) {
        imageSource = require('@/assets/images/cosmicburger.png');
        console.log('Using fallback image for:', item.name);
      }
      
        return {
          id: item.id,
          name: item.name,
          stamina: 15, // Default stamina boost - can be enhanced later with item-specific values
          quantity: item.quantity,
          image: imageSource
        };
      } catch (error) {
        console.error('Error processing food item:', item, error);
        return {
          id: item.id || 'unknown',
          name: item.name || 'Unknown Food',
          stamina: 15,
          quantity: item.quantity || 0,
          image: require('@/assets/images/cosmicburger.png')
        };
      }
    })
    .filter(food => food.quantity > 0);

  const getBackgroundImage = (bgId: string) => {
    return allBackgrounds[bgId]?.image || allBackgrounds.bg1.image;
  };

  const getPetImage = (imageName: string) => {
    const imageMap: { [key: string]: any } = {
      'tigerguy': require('@/assets/images/tigerguy.png'),
      'plumeca': require('@/assets/images/plumeca.png'),
      'coco-guy': require('@/assets/images/coco-guy.png'),
      'frekki': require('@/assets/images/frekki.png'),
      'lallazo': require('@/assets/images/lallazo.png'),
      'robot-guy': require('@/assets/images/robot-guy.png'),
      'sheep-guy': require('@/assets/images/sheep-guy.png'),
      'bull-guy': require('@/assets/images/bull-guy.png'),
      'storm-guy': require('@/assets/images/storm-guy.png'),
      'fish-guys': require('@/assets/images/fish-guys.png'),
      'sappo': require('@/assets/images/sappo.png'),
      'gazo': require('@/assets/images/gazo.png'),
    };
    return imageMap[imageName] || require('@/assets/images/tigerguy.png');
  };

  const purchaseItem = (item: any, type: string) => {
    if (item.unlocked) return;
    
    if (gameState.coins >= item.cost) {
      Alert.alert(
        `Purchase ${item.name}?`,
        `This will cost ${item.cost} coins.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Buy', 
            onPress: () => {
              // In a real app, you'd update the game state here
              Alert.alert('Success!', `You purchased ${item.name}!`);
            }
          }
        ]
      );
    } else {
      Alert.alert('Not enough coins!', `You need ${item.cost} coins to buy ${item.name}.`);
    }
  };

  const selectFood = (food: any) => {
    console.log('selectFood called with:', food);
    
    if (food.quantity > 0) {
      setSelectedFood(food);
      console.log('Food selected:', food.name, 'waiting for user to press SELECT button');
    }
  };

  // Clear food when modal is opened or closed
  const clearFood = () => {
    setShowNewFood(false);
    setSelectedFoodForNew(null);
    setSelectedFood(null);
  };

  // Removed old handleFoodConsumed function - now using onNewFoodFed

  // Removed old playFeedSequence function - now using new gesture handler approach

  // Hearts burst animation (React Native version of the web pattern)
  const triggerHeartsBurst = (x: number, y: number) => {
    // Create temporary heart elements (like the web version)
    const newHearts: Array<{
      id: string;
      x: number;
      y: number;
      rotation: number;
      opacity: Animated.Value;
      translateY: Animated.Value;
      scale: Animated.Value;
    }> = [];
    
    for (let i = 0; i < 3; i++) {
      // Random spread like the web version
      const dx = (Math.random() * 40 + 20) * (Math.random() < 0.5 ? -1 : 1);
      const dy = -(60 + Math.random() * 30);
      const rot = (Math.random() < 0.5 ? -1 : 1) * (10 + Math.random() * 10);
      
      newHearts.push({
        id: Math.random().toString(36).substr(2, 9),
        x: x + dx,
        y: y + dy,
        rotation: rot,
        opacity: new Animated.Value(0),
        translateY: new Animated.Value(0),
        scale: new Animated.Value(0.8),
      });
    }

    setHearts(prev => [...prev, ...newHearts]);

    // Animate hearts (like the web version with proper timing)
    newHearts.forEach(heart => {
      // Phase 1: Fade in and scale up (0-300ms)
      Animated.parallel([
        Animated.timing(heart.opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(heart.scale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(heart.translateY, {
          toValue: heart.y - y, // Move to final position
          duration: 900 + Math.random() * 200, // Random duration like web
          useNativeDriver: true,
        }),
      ]).start();

      // Phase 2: Fade out (after 400ms)
      setTimeout(() => {
        Animated.timing(heart.opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          setHearts(prev => prev.filter(h => h.id !== heart.id));
        });
      }, 400);
    });
  };

  // Pet squash animation
  const triggerPetSquash = () => {
    // This would animate the pet sprite, but since it's in a transform, 
    // we'll just trigger a visual feedback
    console.log('Pet squash animation triggered');
  };

  // New gesture handler onFed callback
  const onNewFoodFed = useCallback(() => {
    if (selectedFoodForNew) {
      console.log('Pet consumed food:', selectedFoodForNew.name);
      
      // 1) Remove food from inventory
      removeItem(selectedFoodForNew.id, 1);
      
      // 2) Feed the pet (this handles stamina, hunger, etc.)
      const activePet = getActivePet();
      if (activePet) {
        feedPet(activePet.id, selectedFoodForNew.stamina);
      }
      
      // 3) Trigger pet squash animation
      triggerPetSquash();
      
      // 4) Show hearts
      if (activePet) {
        triggerHeartsBurst(petPosition.x + 44, petPosition.y + 44);
      }
      
      // 5) Hide food
      setShowNewFood(false);
      setSelectedFoodForNew(null);
      setSelectedFood(null);
    }
  }, [selectedFoodForNew, removeItem, getActivePet, feedPet]);

  // Removed feedSelectedFood function for now

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#94a3b8';
      case 'rare': return '#3b82f6';
      case 'epic': return '#8b5cf6';
      case 'legendary': return '#f59e0b';
      default: return '#94a3b8';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollViewRef} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isDragging}
      >
        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>MY PETS</Text>
        </RNView>

        {/* Active Pet Card */}
        <RNView style={styles.activePetCard}>
          {activePet ? (
            <RNView 
              style={styles.petImageContainer}
              onLayout={({ nativeEvent }) => {
                const { width, height } = nativeEvent.layout;
                setContainerSize({ width, height });
                
                // Calculate visible image bounds for the background image
                // Assuming a typical background image aspect ratio (you can adjust this)
                const backgroundImageAspectRatio = 16 / 9; // Adjust based on your actual background images
                const { getVisibleImageBounds } = require('@/utils/dragMath');
                const visibleBounds = getVisibleImageBounds(width, height, backgroundImageAspectRatio);
                setVisibleImageBounds(visibleBounds);
                
                console.log('Container measured:', { width, height });
                console.log('Visible image bounds:', visibleBounds);
              }}
            >
              <Image
                source={getBackgroundImage(activePet.background)}
                style={styles.petBackgroundImage}
                resizeMode="cover"
              />
              <Animated.View
                {...panResponder.panHandlers}
                style={[
                  styles.draggablePetContainer,
                  {
                    transform: [
                      { translateX: petPosition.x },
                      { translateY: petPosition.y }
                    ]
                  }
                ]}
                onLayout={() => {
                  // Pet rect is now updated via useEffect when petPosition changes
                }}
              >
                <Image
                  source={getPetImage(activePet.image)}
                  style={styles.petImage}
                />
              </Animated.View>
              
              {/* Pet info on left side of image */}
              <RNView style={styles.petInfoOverlay}>
                <Text style={styles.petName}>{activePet.name}</Text>
                <Text style={styles.petLevel}>Level {activePet.level}</Text>
                <RNView style={styles.petOverlayStaminaRow}>
                  <FontAwesome name="bolt" size={12} color="#f59e0b" />
                  <Text style={styles.petOverlayStamina}>{Number(activePet.stamina) || 0}</Text>
                </RNView>
              </RNView>

              {/* Draggable food items - using new gesture handler approach */}

              {/* Hearts animation */}
              {hearts.map((heart) => (
                <Animated.View
                  key={heart.id}
                  style={[
                    styles.heartAnimation,
                    {
                      left: heart.x,
                      top: heart.y,
                      opacity: heart.opacity,
                      transform: [
                        { translateY: heart.translateY },
                        { scale: heart.scale },
                        { rotate: `${heart.rotation}deg` }
                      ],
                    }
                  ]}
                >
                  <Image 
                    source={require('@/assets/images/pxo-hearts.png')} 
                    style={styles.heartImage}
                    resizeMode="contain"
                  />
                </Animated.View>
              ))}

              {/* New gesture handler food */}
              {showNewFood && containerSize.width > 0 && selectedFoodForNew && (
                <DraggableFood
                  src={selectedFoodForNew.image}
                  containerSize={containerSize}
                  petRect={petRect}
                  onFed={onNewFoodFed}
                />
              )}

              {/* Removed feed success overlay for now */}
            </RNView>
          ) : (
            <RNView style={styles.noPetsContainer}>
              <FontAwesome name="heart" size={48} color="#8b5cf6" />
              <Text style={styles.noPetsTitle}>No Pets Adopted</Text>
              <Text style={styles.noPetsText}>Visit the Nursery to adopt your first pet!</Text>
              <Pressable 
                style={styles.nurseryButton}
                onPress={() => router.push('/(tabs)/nursery')}
              >
                <FontAwesome name="leaf" size={16} color="#ffffff" />
                <Text style={styles.nurseryButtonText}>GO TO NURSERY</Text>
              </Pressable>
            </RNView>
          )}

          {/* Action boxes underneath */}
          {activePet && (
            <RNView style={styles.actionBoxes}>
              <Pressable 
                style={styles.actionBox}
                onPress={() => {
                  if (activePet) {
                    setCurrentPage(0);
                    clearFood(); // Clear any existing food
                    setShowFeedModal(true);
                    // Don't show food sprite until food is selected
                  }
                }}
              >
                <FontAwesome name="cutlery" size={18} color="#8b5cf6" />
                <Text style={styles.actionLabel}>FEED</Text>
              </Pressable>
              <Pressable 
                style={styles.actionBox}
                onPress={() => {
                  if (activePet) {
                    playWithPet(activePet.id);
                    Alert.alert('Play Time!', `You played with ${activePet.name}! Their happiness increased!`);
                  }
                }}
              >
                <FontAwesome name="futbol-o" size={18} color="#8b5cf6" />
                <Text style={styles.actionLabel}>PLAY</Text>
              </Pressable>
              <Pressable 
                style={styles.actionBox}
                onPress={() => setShowClosetModal(true)}
              >
                <FontAwesome name="tags" size={18} color="#8b5cf6" />
                <Text style={styles.actionLabel}>CLOSET</Text>
              </Pressable>
            </RNView>
          )}

          {/* About Section - Inside the pet card */}
          {activePet && (
            <RNView style={styles.aboutContainer}>
              <Text style={styles.aboutTitle}>ABOUT</Text>
              <RNView style={styles.aboutRow}>
                <Text style={styles.aboutLabel}>Personality:</Text>
                <Text style={styles.aboutValue}>
                  {activePet.personalityTraits ? activePet.personalityTraits.join(', ') : 'Shy, Playful'}
                </Text>
              </RNView>
              <RNView style={styles.aboutRow}>
                <Text style={styles.aboutLabel}>Sign:</Text>
                <Text style={styles.aboutValue}>{activePet.zodiacSign || 'Aries'}</Text>
              </RNView>
            </RNView>
          )}

          {/* Mood Section - Inside the pet card */}
          {activePet && (
            <RNView style={styles.moodContainer}>
              <Text style={styles.moodTitle}>MOOD</Text>
              <RNView style={styles.moodRow}>
                <Text style={styles.moodLabel}>Happiness:</Text>
                <RNView style={styles.moodBarContainer}>
                  <RNView style={styles.moodBar}>
                    <RNView style={[
                      styles.moodBarFill, 
                      { 
                        width: `${Math.min(100, (activePet.happiness / 100) * 100)}%`,
                        backgroundColor: activePet.happiness >= 80 ? '#10b981' : 
                                       activePet.happiness >= 50 ? '#f59e0b' : '#ef4444'
                      }
                    ]} />
                  </RNView>
                  <Text style={styles.moodValue}>{activePet.happiness}</Text>
                </RNView>
              </RNView>
              <RNView style={styles.moodRow}>
                <Text style={styles.moodLabel}>Hunger:</Text>
                <RNView style={styles.moodBarContainer}>
                  <RNView style={styles.moodBar}>
                    <RNView style={[
                      styles.moodBarFill, 
                      { 
                        width: `${Math.min(100, ((100 - (activePet.hunger || 50)) / 100) * 100)}%`,
                        backgroundColor: (activePet.hunger || 50) <= 20 ? '#ef4444' : 
                                       (activePet.hunger || 50) <= 50 ? '#f59e0b' : '#10b981'
                      }
                    ]} />
                  </RNView>
                  <Text style={styles.moodValue}>{100 - (activePet.hunger || 50)}</Text>
                </RNView>
              </RNView>
            </RNView>
          )}

          {/* Stats Section - Inside the pet card */}
          {activePet && (
            <RNView style={styles.barStatsContainer}>
              <Text style={styles.statsTitle}>STATS</Text>
                {/* HP First - Colored based on value */}
                <RNView style={styles.barStatRow}>
                  <Text style={[styles.barStatLabel, activePet.hp < 30 ? styles.hpLow : styles.hpGood]}>HP</Text>
                  <RNView style={styles.barStatBar}>
                    <RNView style={[
                      styles.barStatFill, 
                      activePet.hp < 30 ? styles.hpLowFill : styles.hpGoodFill,
                      { width: `${Math.min(100, (activePet.hp / 100) * 100)}%` }
                    ]} />
                  </RNView>
                  <Text style={[styles.barStatValue, activePet.hp < 30 ? styles.hpLow : styles.hpGood]}>{activePet.hp}</Text>
                </RNView>
                <RNView style={styles.barStatRow}>
                  <Text style={styles.barStatLabel}>ATK</Text>
                  <RNView style={styles.barStatBar}>
                    <RNView style={[styles.barStatFill, { width: `${Math.min(100, (activePet.atk / 100) * 100)}%` }]} />
                  </RNView>
                  <Text style={styles.barStatValue}>{activePet.atk}</Text>
                </RNView>
                <RNView style={styles.barStatRow}>
                  <Text style={styles.barStatLabel}>DEF</Text>
                  <RNView style={styles.barStatBar}>
                    <RNView style={[styles.barStatFill, { width: `${activePet.def}%` }]} />
                  </RNView>
                  <Text style={styles.barStatValue}>{activePet.def}</Text>
                </RNView>
                <RNView style={styles.barStatRow}>
                  <Text style={styles.barStatLabel}>SPD</Text>
                  <RNView style={styles.barStatBar}>
                    <RNView style={[styles.barStatFill, { width: `${activePet.spd}%` }]} />
                  </RNView>
                  <Text style={styles.barStatValue}>{activePet.spd}</Text>
                </RNView>
                <RNView style={styles.barStatRow}>
                  <Text style={styles.barStatLabel}>LUCK</Text>
                  <RNView style={styles.barStatBar}>
                    <RNView style={[styles.barStatFill, { width: `${activePet.luck}%` }]} />
                  </RNView>
                  <Text style={styles.barStatValue}>{activePet.luck}</Text>
                </RNView>
                <RNView style={styles.barStatRow}>
                  <Text style={styles.barStatLabel}>INT</Text>
                  <RNView style={styles.barStatBar}>
                    <RNView style={[styles.barStatFill, { width: `${activePet.int}%` }]} />
                  </RNView>
                  <Text style={styles.barStatValue}>{activePet.int}</Text>
                </RNView>
                <RNView style={styles.barStatRow}>
                  <Text style={styles.barStatLabel}>CHARM</Text>
                  <RNView style={styles.barStatBar}>
                    <RNView style={[styles.barStatFill, { width: `${activePet.charm}%` }]} />
                  </RNView>
                  <Text style={styles.barStatValue}>{activePet.charm}</Text>
                </RNView>
                <RNView style={styles.barStatRow}>
                  <Text style={styles.barStatLabel}>DEX</Text>
                  <RNView style={styles.barStatBar}>
                    <RNView style={[styles.barStatFill, { width: `${activePet.dex}%` }]} />
                  </RNView>
                  <Text style={styles.barStatValue}>{activePet.dex}</Text>
                </RNView>
            </RNView>
          )}
        </RNView>


        {/* Only show Adopted Pets section if there's at least 1 pet */}
        {petState.adoptedPets.length > 0 && (
          <>
            <Text style={styles.collectionTitle}>ALL PETS ({petState.adoptedPets.length}/{petState.maxPets})</Text>
            <RNView style={styles.petsCollectionCard}>
              <RNView style={styles.petsList}>
                {petState.adoptedPets.map((pet) => (
                  <Pressable 
                    key={pet.id}
                    style={[styles.petListItem, activePet?.id === pet.id && styles.activePetListItem]}
                    onPress={() => setActivePet(pet.id)}
                  >
                    <Image source={getPetImage(pet.image)} style={styles.petListImage} />
                    <RNView style={styles.petListInfo}>
                      <Text style={styles.petListName}>{pet.name}</Text>
                      <Text style={styles.petListLevel}>Level {pet.level}</Text>
                      <RNView style={styles.petStaminaRow}>
                        <FontAwesome name="bolt" size={12} color="#f59e0b" />
                        <Text style={styles.petStaminaText}>{Number(pet.stamina) || 0}</Text>
                      </RNView>
                    </RNView>
                    <RNView style={styles.petListActions}>
                      {activePet?.id === pet.id ? (
                        <RNView style={styles.activeButton}>
                          <Text style={styles.activeText}>ACTIVE</Text>
                        </RNView>
                      ) : (
                        <Pressable style={styles.swapButton}>
                          <FontAwesome name="exchange" size={14} color="#8b5cf6" />
                          <Text style={styles.swapButtonText}>SWAP</Text>
                        </Pressable>
                      )}
                    </RNView>
                  </Pressable>
                ))}
                
                {/* Add Pet Button - Show if under limit */}
                {canAdoptMore() && (
                  <Pressable 
                    style={styles.addPetButton}
                    onPress={() => router.push('/(tabs)/nursery')}
                  >
                    <FontAwesome name="plus" size={16} color="rgba(139, 92, 246, 0.4)" />
                    <Text style={styles.addPetText}>ADOPT</Text>
                  </Pressable>
                )}
              </RNView>
            </RNView>
          </>
        )}

        {/* Dev Mode Reset Button */}
        {petState.devMode && (
          <RNView style={styles.devModeCard}>
            <Text style={styles.devModeTitle}>DEV MODE</Text>
            <Pressable 
              style={styles.resetButton}
              onPress={() => {
                Alert.alert(
                  'Reset All Pets',
                  'This will permanently delete all adopted pets. Are you sure?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Reset',
                      style: 'destructive',
                      onPress: () => {
                        resetAllPets();
                        Alert.alert('Reset Complete', 'All pets have been removed!');
                      }
                    }
                  ]
                );
              }}
            >
              <FontAwesome name="trash" size={16} color="#ef4444" />
              <Text style={styles.resetButtonText}>RESET ALL PETS</Text>
            </Pressable>
          </RNView>
        )}
      </ScrollView>

      {/* Closet Modal */}
      <Modal
        visible={showClosetModal}
        animationType="slide"
        transparent={true}
      >
        <RNView style={styles.closetModalOverlay}>
          <RNView style={styles.closetModalContainer}>
            {/* Header */}
            <RNView style={styles.closetModalHeader}>
              <Text style={styles.closetModalTitle}>CLOSET</Text>
              <Pressable 
                style={styles.closetCloseButton}
                onPress={() => setShowClosetModal(false)}
              >
                <FontAwesome name="times" size={24} color="#64748b" />
              </Pressable>
            </RNView>
            
            {/* Tabs */}
            <RNView style={styles.closetModalTabs}>
              <Pressable 
                style={[styles.closetModalTab, closetTab === 'backgrounds' && styles.closetModalTabActive]}
                onPress={() => setClosetTab('backgrounds')}
              >
                <Text style={[styles.closetModalTabText, closetTab === 'backgrounds' && styles.closetModalTabTextActive]}>
                  BACKGROUNDS
                </Text>
              </Pressable>
              <Pressable 
                style={[styles.closetModalTab, closetTab === 'skins' && styles.closetModalTabActive]}
                onPress={() => setClosetTab('skins')}
              >
                <Text style={[styles.closetModalTabText, closetTab === 'skins' && styles.closetModalTabTextActive]}>
                  SKINS
                </Text>
              </Pressable>
              <Pressable 
                style={[styles.closetModalTab, closetTab === 'subpxos' && styles.closetModalTabActive]}
                onPress={() => setClosetTab('subpxos')}
              >
                <Text style={[styles.closetModalTabText, closetTab === 'subpxos' && styles.closetModalTabTextActive]}>
                  SUBPXOS
                </Text>
              </Pressable>
            </RNView>
            
            {/* Content */}
            <ScrollView 
              style={styles.closetModalScrollView}
              contentContainerStyle={styles.closetModalContent}
            >
              {/* Backgrounds Tab */}
              {closetTab === 'backgrounds' && (
                <>
                  {ownedBackgrounds.length > 0 ? (
                    ownedBackgrounds.map((bg) => {
                      const bgOwner = getBackgroundOwner(bg.id);
                      const isEquippedToCurrentPet = activePet?.background === bg.id;
                      const isEquippedToOtherPet = bgOwner && bgOwner.id !== activePet?.id;
                      
                      return (
                        <Pressable
                          key={bg.id}
                          style={[
                            styles.closetBgCard,
                            isEquippedToCurrentPet && styles.closetBgCardSelected,
                            isEquippedToOtherPet && styles.closetBgCardDisabled
                          ]}
                          onPress={() => {
                            if (activePet && !isEquippedToOtherPet) {
                              const success = updatePetBackground(activePet.id, bg.id);
                              if (success) {
                                setShowClosetModal(false);
                              } else {
                                Alert.alert('Already Equipped', 'This background is equipped to another pet!');
                              }
                            }
                          }}
                          disabled={isEquippedToOtherPet}
                        >
                          <RNView style={styles.closetBgImageContainer}>
                            <Image source={bg.image} style={styles.closetBgImage} />
                            {isEquippedToOtherPet && (
                              <RNView style={styles.equippedBadgeOverlay}>
                                <Text style={styles.equippedBadgeText}>EQUIPPED</Text>
                              </RNView>
                            )}
                          </RNView>
                          <RNView style={styles.closetBgInfo}>
                            <Text style={styles.closetBgName}>{bg.name}</Text>
                            {isEquippedToCurrentPet && (
                              <FontAwesome name="check-circle" size={18} color="#8b5cf6" />
                            )}
                          </RNView>
                        </Pressable>
                      );
                    })
                  ) : (
                    <RNView style={styles.closetEmptyState}>
                      <Text style={styles.closetEmptyText}>No backgrounds owned yet. Visit the shop!</Text>
                    </RNView>
                  )}
                </>
              )}

              {/* Skins Tab */}
              {closetTab === 'skins' && (
                <RNView style={styles.closetEmptyState}>
                  <Text style={styles.closetEmptyText}>No skins available yet. Coming soon!</Text>
                </RNView>
              )}

              {/* SubPxos Tab */}
              {closetTab === 'subpxos' && (
                <RNView style={styles.closetEmptyState}>
                  <Text style={styles.closetEmptyText}>No SubPxos available yet. Pets for your Pxopet coming soon!</Text>
                </RNView>
              )}
            </ScrollView>
          </RNView>
        </RNView>
      </Modal>

      {/* Food Selection Modal - Sleek Co-Star Style */}
      <Modal
        visible={showFeedModal}
        animationType="slide"
        transparent={true}
      >
        <RNView style={styles.feedModalOverlay}>
          <RNView style={styles.feedModalContainer}>
            {/* Header */}
            <RNView style={styles.feedModalHeader}>
              <Text style={styles.feedModalTitle}>FEED {activePet?.name.toUpperCase()}</Text>
              <Pressable 
                style={styles.feedCloseButton}
                onPress={() => {
                  setShowFeedModal(false);
                  setSelectedFoodSprite(null);
                  setSelectedFood(null);
                  setShowNewFood(false);
                  setSelectedFoodForNew(null);
                  // Don't clear draggable foods - let them stay in the pet container
                }}
              >
                <FontAwesome name="times" size={20} color="#64748b" />
              </Pressable>
            </RNView>

            {/* Food Grid */}
            <ScrollView style={styles.feedModalScrollView} contentContainerStyle={styles.feedModalContent}>
              {availableFoods.length > 0 ? (
                <RNView style={styles.feedGrid}>
                  {availableFoods.map((food) => (
                    <Pressable
                      key={food.id}
                      style={[
                        styles.feedCard,
                        selectedFood?.id === food.id && styles.feedCardSelected
                      ]}
                      onPress={() => selectFood(food)}
                    >
                      <Image source={food.image} style={styles.feedImage} />
                      <Text style={styles.feedName}>{food.name}</Text>
                      <Text style={styles.feedQuantity}>x{food.quantity}</Text>
                      <RNView style={styles.feedStaminaTag}>
                        <FontAwesome name="bolt" size={10} color="#fbbf24" />
                        <Text style={styles.feedStaminaText}>+{food.stamina}</Text>
                      </RNView>
                    </Pressable>
                  ))}
                </RNView>
              ) : (
                <RNView style={styles.emptyFoodState}>
                  <FontAwesome name="frown-o" size={40} color="rgba(139, 92, 246, 0.3)" style={{ marginBottom: 16 }} />
                  <Text style={styles.emptyFoodText}>No food in inventory</Text>
                  <Text style={styles.emptyFoodSubtext}>Play games or visit shops to get food!</Text>
                  <Pressable 
                    style={styles.exploreButton}
                    onPress={() => {
                      setShowFeedModal(false);
                      setSelectedFoodSprite(null);
                      setShowNewFood(false);
                      setSelectedFoodForNew(null);
                      // Don't clear draggable foods - let them stay in the pet container
                      router.push('/(tabs)/explore');
                    }}
                  >
                    <FontAwesome name="compass" size={14} color="#ffffff" />
                    <Text style={styles.exploreButtonText}>Go to Explore</Text>
                  </Pressable>
                </RNView>
              )}
            </ScrollView>

            {/* Feed Button */}
            {availableFoods.length > 0 && (
              <RNView style={styles.feedModalFooter}>
                <Pressable 
                  style={[
                    styles.feedModalButton,
                    !selectedFood && styles.feedModalButtonDisabled
                  ]}
                  onPress={() => {
                    console.log('Feed button pressed - spawning draggable food');
                    if (selectedFood) {
                      setSelectedFoodForNew(selectedFood);
                      setShowNewFood(true);
                      console.log('Spawning food:', selectedFood.name);
                    }
                    setShowFeedModal(false);
                    setSelectedFoodSprite(null);
                  }}
                  disabled={!selectedFood}
                >
                  <Text style={[
                    styles.feedModalButtonText,
                    !selectedFood && styles.feedModalButtonTextDisabled
                  ]}>
                    SELECT
                  </Text>
                </Pressable>
              </RNView>
            )}
          </RNView>
        </RNView>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#8b5cf6',
    textAlign: 'center',
    marginTop: 100,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 20,
    paddingBottom: 100,
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -8,
    marginBottom: 4,
    paddingHorizontal: 20,
    height: 32,
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
    lineHeight: 20,
  },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a', // Premium deep slate
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'left',
  },
  activePetCard: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 16,
    padding: 16,
    marginTop: 0,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  petImageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    padding: 0,
    position: 'relative',
    overflow: 'hidden',
  },
    petBackgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    petInfoOverlay: {
      position: 'absolute',
      top: 10,
      left: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    actionBoxes: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: 24,
      width: '100%',
    },
    statsClosetContainer: {
      flexDirection: 'row',
      gap: 16,
      paddingHorizontal: 10,
      width: '100%',
    },
    statsSection: {
      flex: 1,
    },
    closetSection: {
      flex: 1,
    },
    statsTitle: {
      fontFamily: 'PressStart2P_400Regular',
      fontSize: 10,
      fontWeight: 'bold',
      color: '#0f172a',
      textAlign: 'center',
      marginBottom: 4,
      alignSelf: 'center',
    },
    closetContainer: {
      padding: 4,
      minHeight: 100,
    },
    closetRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: 8,
    },
    closetSubtitle: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 8,
      color: '#0ea5e9',
      fontWeight: 'bold',
      marginBottom: 6,
      marginTop: 8,
    },
    backgroundGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 12,
    },
    backgroundItem: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 6,
      backgroundColor: 'rgba(14, 165, 233, 0.1)',
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#0ea5e9',
      minWidth: '45%',
      minHeight: 35,
    },
    selectedBackgroundItem: {
      backgroundColor: '#0ea5e9',
      borderColor: '#0ea5e9',
    },
    backgroundName: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 7,
      color: '#0ea5e9',
      marginTop: 2,
      textAlign: 'center',
    },
    selectedBackgroundName: {
      color: '#ffffff',
    },
    lockedBackgroundItem: {
      backgroundColor: 'rgba(148, 163, 184, 0.1)',
      borderColor: '#94a3b8',
    },
    lockedBackgroundName: {
      color: '#94a3b8',
    },
    backgroundCost: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 6,
      color: '#f59e0b',
      marginTop: 1,
      textAlign: 'center',
    },
    itemsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    closetItem: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 8,
      backgroundColor: 'rgba(14, 165, 233, 0.1)',
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#0ea5e9',
      minWidth: '30%',
      minHeight: 40,
    },
  actionBox: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 8,
    height: 70,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    textAlign: 'center',
    fontWeight: '600',
  },
  petImage: {
    width: 88, // 20% smaller than 110
    height: 88, // 20% smaller than 110
  },
  draggablePetContainer: {
    position: 'absolute',
    left: 0,              // Important: pin origin to top-left
    top: 0,               // Important: pin origin to top-left
    width: 88, // 20% smaller than 110
    height: 88, // 20% smaller than 110
    backgroundColor: 'transparent',
    // Prevent iOS gestures and selection
    touchAction: 'none',
    userSelect: 'none',
    willChange: 'transform',
  },
  petName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'left',
  },
  petLevel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ffffff',
    textAlign: 'left',
    opacity: 0.8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  statLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#0f172a',
    opacity: 0.7,
    marginTop: 2,
  },
  equipmentContainer: {
    width: '100%',
  },
  equipmentTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
  equipmentSlots: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  equipmentSlot: {
    alignItems: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0ea5e9',
    padding: 8,
    minWidth: 60,
  },
  equipmentIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  equipmentLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#0f172a',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  equipmentItem: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 7,
    color: '#0f172a',
    opacity: 0.6,
    textAlign: 'center',
  },
  collectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 16,
    alignSelf: 'center',
  },
  activePetTitleAbove: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'left',
    marginBottom: 8,
    marginLeft: 0,
    alignSelf: 'flex-start',
  },
  petCollection: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 20,
  },
  petSlot: {
    width: '30%',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    padding: 12,
    marginBottom: 8,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  petSlotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  petSlotImage: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  petSlotName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    fontWeight: 'bold',
    flex: 1,
  },
  petSlotStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  petSlotStat: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#0f172a',
    marginBottom: 2,
  },
  activePetSlot: {
    borderColor: '#8b5cf6',
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  barStatsContainer: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    gap: 8,
  },
    barStatRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    barStatLabel: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 8,
      color: '#0f172a',
      fontWeight: 'bold',
      width: 40,
    },
    barStatBar: {
      flex: 1,
      height: 4,
      backgroundColor: 'rgba(14, 165, 233, 0.2)',
      borderRadius: 2,
      borderWidth: 1,
      borderColor: '#0ea5e9',
      overflow: 'hidden',
      marginLeft: 8,
      marginRight: 8,
    },
    barStatFill: {
      height: '100%',
      backgroundColor: '#8b5cf6',
      borderRadius: 1,
    },
    barStatValue: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 8,
      color: '#0f172a',
      fontWeight: 'bold',
      width: 30,
      textAlign: 'right',
    },
    // Equipped Items Styles
    equippedItem: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 8,
      backgroundColor: 'rgba(139, 92, 246, 0.03)',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'rgba(139, 92, 246, 0.2)',
      minHeight: 45,
      flex: 1,
    },
    equippedItemName: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 10,
      color: '#0f172a',
      textAlign: 'center',
      marginBottom: 2,
    },
    equippedItemValue: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 9,
      color: '#64748b',
      textAlign: 'center',
    },
    // Modal Styles
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContentWrapper: {
      backgroundColor: '#ffffff',
      borderRadius: 0,
      borderWidth: 3,
      borderColor: '#14b8a6',
      width: '85%',
      maxHeight: '70%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    // New Closet Modal Styles
    closetModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    closetModalContainer: {
      backgroundColor: '#ffffff',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      height: '80%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 20,
    },
    closetModalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f1f5f9',
    },
    closetModalTitle: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 16,
      color: '#0f172a',
      fontWeight: 'bold',
    },
    closetModalCloseButton: {
      padding: 4,
    },
    closetModalTabs: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f1f5f9',
    },
    closetModalTab: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      borderBottomWidth: 3,
      borderBottomColor: 'transparent',
    },
    closetModalTabActive: {
      borderBottomColor: '#8b5cf6',
    },
    closetModalTabText: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 10,
      color: '#94a3b8',
      fontWeight: 'bold',
    },
    closetModalTabTextActive: {
      color: '#8b5cf6',
    },
    closetModalScrollView: {
      flex: 1,
    },
    closetModalContent: {
      padding: 20,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    closetBgCard: {
      width: '47%',
      backgroundColor: '#f8fafc',
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#e2e8f0',
      overflow: 'hidden',
    },
  closetBgCardSelected: {
    borderColor: '#8b5cf6',
    borderWidth: 3,
  },
  closetBgCardDisabled: {
    opacity: 0.5,
    borderColor: '#94a3b8',
  },
  closetBgImageContainer: {
    position: 'relative',
    width: '100%',
  },
  closetBgImage: {
      width: '100%',
      height: 100,
      resizeMode: 'cover',
    },
    closetBgInfo: {
      padding: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#ffffff',
    },
    closetBgName: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 10,
      color: '#0f172a',
      fontWeight: 'bold',
    },
  closetEmptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  equippedBadgeOverlay: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#94a3b8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  equippedBadgeText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#ffffff',
    fontWeight: 'bold',
  },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 8,
      position: 'relative',
    },
    modalTitle: {
      fontFamily: 'PressStart2P_400Regular',
      fontSize: 16,
      color: '#0f172a',
    },
    inventoryTitle: {
      fontFamily: 'PressStart2P_400Regular',
      fontSize: 12,
      color: '#14b8a6',
      marginTop: 4,
    },
    closeButton: {
      position: 'absolute',
      right: 16,
      top: 16,
      width: 32,
      height: 32,
      backgroundColor: '#ffffff',
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#8b5cf6',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#8b5cf6',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    paginationContainer: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      gap: 12,
    },
    foodAndArrowRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
    arrowButton: {
      width: 48,
      height: 48,
      backgroundColor: '#ffffff',
      borderRadius: 8,
      borderWidth: 2,
      borderColor: '#14b8a6',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#14b8a6',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 6,
    },
    arrowButtonDisabled: {
      borderColor: '#94a3b8',
      shadowColor: '#94a3b8',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 6,
    },
    foodGrid: {
      width: 300,
      height: 200,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backgroundCollection: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    backgroundCard: {
      width: '48%',
      backgroundColor: '#ffffff',
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#e2e8f0',
      overflow: 'hidden',
      marginBottom: 12,
    },
    selectedBackgroundCard: {
      borderColor: '#0ea5e9',
      backgroundColor: 'rgba(14, 165, 233, 0.05)',
    },
    lockedBackgroundCard: {
      borderColor: '#94a3b8',
      backgroundColor: 'rgba(148, 163, 184, 0.05)',
    },
    backgroundPreview: {
      width: '100%',
      height: 80,
      resizeMode: 'cover',
    },
    backgroundInfo: {
      padding: 8,
    },
    backgroundCardName: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 10,
      color: '#0f172a',
      marginBottom: 2,
    },
    lockedBackgroundCardName: {
      color: '#94a3b8',
    },
    backgroundRarity: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 8,
      marginBottom: 4,
    },
    backgroundCardCost: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 8,
      color: '#f59e0b',
    },
    unlockedIcon: {
      position: 'absolute',
      top: 4,
      right: 4,
    },
    // Food Selection Styles
    foodCollection: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
      paddingVertical: 8,
    },
    foodCard: {
      backgroundColor: '#ffffff',
      borderRadius: 0,
      borderWidth: 2,
      borderColor: '#14b8a6',
      padding: 8,
      alignItems: 'center',
      width: 90,
      height: 90,
      shadowColor: '#14b8a6',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    foodInfo: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      flex: 1,
    },
    foodImage: {
      width: 24,
      height: 24,
      resizeMode: 'contain',
    },
    foodName: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 10,
      color: '#0f172a',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    staminaContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    foodStamina: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 8,
      color: '#14b8a6',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    foodQuantity: {
      position: 'absolute',
      top: 4,
      right: 4,
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 8,
      color: '#14b8a6',
      fontWeight: 'bold',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      paddingHorizontal: 4,
      paddingVertical: 1,
      borderRadius: 3,
      borderWidth: 1,
      borderColor: '#14b8a6',
    },
    selectedFoodCard: {
      borderColor: '#fbbf24',
      borderWidth: 3,
      backgroundColor: 'rgba(251, 191, 36, 0.1)',
    },
    feedButtonContainer: {
      padding: 4,
      alignItems: 'center',
    },
    feedButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#8b5cf6',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: '#8b5cf6',
      gap: 8,
      shadowColor: '#8b5cf6',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 6,
    },
    feedButtonDisabled: {
      backgroundColor: '#94a3b8',
      borderColor: '#94a3b8',
      shadowColor: '#94a3b8',
    },
    feedButtonText: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 12,
      color: '#ffffff',
      fontWeight: 'bold',
    },
    feedButtonTextDisabled: {
      color: '#ffffff',
    },
    // Section Styles
    sectionBox: {
      marginVertical: 4,
      marginHorizontal: -8,
    },
  sectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  aboutTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
    fontWeight: 'bold',
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 6,
  },
  aboutContainer: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    gap: 8,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aboutLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    fontWeight: 'bold',
  },
  aboutValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  moodTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
    fontWeight: 'bold',
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 6,
  },
  moodContainer: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    gap: 8,
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moodLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    fontWeight: 'bold',
  },
  moodBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    justifyContent: 'flex-end',
  },
  moodBar: {
    width: 80,
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  moodBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  moodValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'right',
  },
  statsCard: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  closetTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  closetCard: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  trophiesCard: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  petsCollectionCard: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  petsList: {
    gap: 12,
  },
  petListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activePetListItem: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  petListImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  petListImage: {
    width: 45,
    height: 45,
  },
  petListInfo: {
    flex: 1,
    marginLeft: 16,
  },
  petListName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#0f172a',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  petListLevel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: '600',
    marginBottom: 2,
  },
  petStaminaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  petStaminaText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#f59e0b',
    fontWeight: 'bold',
  },
  petListStats: {
    flexDirection: 'row',
    gap: 16,
  },
  petListStat: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  petListActions: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  activeText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  swapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    gap: 6,
  },
  swapButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  // Pet System Styles
  noPetsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noPetsTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  noPetsText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  petHappiness: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ef4444',
    fontWeight: 'bold',
  },
  petOverlayStaminaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  petOverlayStamina: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#f59e0b',
    fontWeight: 'bold',
  },
  noAdoptedPetsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noAdoptedPetsTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  noAdoptedPetsText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
  },
  devModeCard: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  devModeTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#ef4444',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    gap: 8,
  },
  resetButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ef4444',
    fontWeight: '600',
  },
  // Nursery Button Styles
  nurseryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 2,
    borderColor: '#7c3aed',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    gap: 8,
  },
  nurseryButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  nurseryButtonSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#7c3aed',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    gap: 6,
  },
  nurseryButtonTextSmall: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  // Add Pet Button
  addPetButton: {
    width: '100%',
    minHeight: 50,
    backgroundColor: 'rgba(139, 92, 246, 0.03)',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    flexDirection: 'column',
    gap: 4,
  },
  addPetText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: 'rgba(139, 92, 246, 0.6)',
    fontWeight: 'bold',
  },
    // Trophies Styles
    trophiesContainer: {
      padding: 8,
      alignItems: 'center',
    },
    trophyRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 8,
    },
    trophyItem: {
      alignItems: 'center',
      flex: 1,
      paddingHorizontal: 4,
    },
    trophyName: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 7,
      color: '#0f172a',
      textAlign: 'center',
      marginTop: 2,
    },
    // Feed Modal - Co-Star Style
    feedModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'flex-end',
    },
    feedModalContainer: {
      backgroundColor: '#ffffff',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      minHeight: '70%',
      maxHeight: '85%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 10,
    },
    feedModalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#f1f5f9',
    },
    feedModalTitle: {
      fontFamily: 'PressStart2P_400Regular',
      fontSize: 13,
      color: '#8b5cf6',
      fontWeight: 'bold',
    },
    feedCloseButton: {
      padding: 8,
      marginTop: -4,
    },
    feedModalScrollView: {
      flex: 1,
    },
    feedModalContent: {
      padding: 20,
    },
    feedGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    feedCard: {
      width: '47%',
      height: 100, // Fixed height for consistency
      backgroundColor: '#f8fafc',
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
      justifyContent: 'center', // Center content vertically
      borderWidth: 2,
      borderColor: '#e2e8f0',
    },
    feedCardSelected: {
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.05)',
      borderWidth: 3,
    },
  feedImage: {
    width: 36,
    height: 36,
    marginBottom: 6,
    resizeMode: 'contain', // Ensure whole icon is visible
  },
    feedName: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 9,
      color: '#0f172a',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 3,
    },
    feedQuantity: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 8,
      color: '#64748b',
      marginBottom: 6,
    },
    feedStaminaTag: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      backgroundColor: 'rgba(251, 191, 36, 0.1)',
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 6,
    },
    feedStaminaText: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 8,
      color: '#f59e0b',
      fontWeight: 'bold',
    },
    emptyFoodState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 80,
      paddingHorizontal: 40,
    },
    emptyFoodText: {
      fontFamily: 'PressStart2P_400Regular',
      fontSize: 11,
      color: '#8b5cf6',
      marginBottom: 16,
      textAlign: 'center',
      lineHeight: 20,
    },
    emptyFoodSubtext: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 11,
      color: '#64748b',
      textAlign: 'center',
      marginBottom: 20,
    },
    exploreButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#8b5cf6',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      gap: 8,
      shadowColor: '#8b5cf6',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    exploreButtonText: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 12,
      color: '#ffffff',
      fontWeight: '600',
    },
    feedModalFooter: {
      padding: 20,
      paddingBottom: 32,
      borderTopWidth: 0,
      backgroundColor: '#ffffff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 5,
    },
    feedModalButton: {
      backgroundColor: '#8b5cf6',
      paddingVertical: 18,
      borderRadius: 16,
      alignItems: 'center',
      shadowColor: '#8b5cf6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    feedModalButtonDisabled: {
      backgroundColor: '#cbd5e1',
      shadowColor: '#64748b',
      shadowOpacity: 0.1,
    },
    feedModalButtonText: {
      fontFamily: 'PressStart2P_400Regular',
      fontSize: 12,
      color: '#ffffff',
      fontWeight: 'bold',
      letterSpacing: 1,
    },
    feedModalButtonTextDisabled: {
      color: '#94a3b8',
    },
    // Feed Success - Redesigned
    feedSuccessOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    feedSuccessCard: {
      backgroundColor: '#ffffff',
      borderRadius: 20,
      padding: 32,
      alignItems: 'center',
      shadowColor: '#8b5cf6',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 10,
      minWidth: 280,
    },
    feedSuccessTitle: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 14,
      color: '#0f172a',
      textAlign: 'center',
      marginBottom: 8,
    },
    feedSuccessItem: {
      fontFamily: 'PressStart2P_400Regular',
      fontSize: 12,
      color: '#8b5cf6',
      textAlign: 'center',
      marginBottom: 16,
    },
    feedSuccessStamina: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: 'rgba(251, 191, 36, 0.1)',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
    },
    feedSuccessStaminaText: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 16,
      color: '#f59e0b',
      fontWeight: 'bold',
    },
    // Feed Success Inline Overlay - Appears at bottom of pet image
    feedSuccessOverlayInline: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingVertical: 8,
      paddingHorizontal: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
    },
    feedSuccessInlineText: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 9,
      color: '#ffffff',
      fontWeight: 'bold',
      flex: 1,
      marginRight: 8,
    },
    feedSuccessInlineStamina: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
    },
    feedSuccessInlineStaminaText: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 9,
      color: '#fbbf24',
      fontWeight: 'bold',
    },
    // Hearts animation that appears above pet's head
    feedHeartAnimation: {
      position: 'absolute',
      width: 16,
      height: 16,
      zIndex: 10,
      pointerEvents: 'none', // Don't interfere with pet dragging
    },
    // Food icon that appears next to pet when feeding
    fedFoodIcon: {
      position: 'absolute',
      width: 25,
      height: 25,
      zIndex: 5,
      pointerEvents: 'none', // Don't interfere with pet dragging
    },
    feedMenuSprite: {
      position: 'absolute',
      width: 25,
      height: 25,
      top: 10,
      right: 10,
      zIndex: 15,
      pointerEvents: 'none', // Don't interfere with pet dragging
      resizeMode: 'contain', // Ensure whole food icon is visible
    },
    draggableFood: {
      position: 'absolute',
      width: 60,
      height: 60,
      zIndex: 20,
      backgroundColor: 'rgba(255, 0, 0, 0.5)', // Red background so you can see it
      borderRadius: 8,
    },
    draggableFoodImage: {
      width: 50,
      height: 50,
    },
    heartAnimation: {
      position: 'absolute',
      width: 24,
      height: 24,
      zIndex: 999,
      pointerEvents: 'none',
    },
    heartImage: {
      width: '100%',
      height: '100%',
    },
    debugText: {
      position: 'absolute',
      top: -20,
      left: 0,
      color: 'white',
      fontSize: 10,
      fontWeight: 'bold',
      backgroundColor: 'black',
      padding: 2,
    },
    debugCounter: {
      position: 'absolute',
      top: 10,
      right: 10,
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold',
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: 4,
      zIndex: 1000,
    },
    successOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    successMessage: {
      backgroundColor: '#8b5cf6',
      padding: 20,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#8b5cf6',
      alignItems: 'center',
      shadowColor: '#8b5cf6',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 6,
    },
    successText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    successStamina: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    // HP Color Styles
    hpGood: {
      color: '#22c55e',
    },
    hpLow: {
      color: '#ef4444',
    },
    hpGoodFill: {
      backgroundColor: '#22c55e',
    },
    hpLowFill: {
      backgroundColor: '#ef4444',
    },
    // Closet Modal Styles - Co-Star Chic
    closetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#f1f5f9',
    },
    closetCloseButton: {
      padding: 4,
    },
    closetTabs: {
      flexDirection: 'row',
      backgroundColor: '#fafafa',
      paddingHorizontal: 8,
    },
    closetTab: {
      flex: 1,
      paddingVertical: 14,
      alignItems: 'center',
      borderBottomWidth: 3,
      borderBottomColor: 'transparent',
    },
    closetTabActive: {
      borderBottomColor: '#8b5cf6',
    },
    closetTabText: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 9,
      color: '#94a3b8',
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
    closetTabTextActive: {
      color: '#8b5cf6',
    },
    closetContent: {
      flex: 1,
      backgroundColor: '#ffffff',
      minHeight: 400,
    },
    closetBackgroundCollection: {
      padding: 16,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      minHeight: 300,
    },
    closetBackgroundCard: {
      width: '47%',
      aspectRatio: 16 / 9,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: '#f8fafc',
      borderWidth: 2,
      borderColor: '#e2e8f0',
    },
    closetBackgroundCardSelected: {
      borderColor: '#8b5cf6',
      borderWidth: 3,
    },
    closetBackgroundImage: {
      width: '100%',
      height: '100%',
    },
    closetBackgroundOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      paddingVertical: 8,
      paddingHorizontal: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    closetBackgroundName: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 9,
      color: '#ffffff',
      fontWeight: 'bold',
    },
    closetSelectedIcon: {
      marginLeft: 8,
    },
    closetEmptyText: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 11,
      color: '#94a3b8',
      textAlign: 'center',
      lineHeight: 20,
    },
  });


