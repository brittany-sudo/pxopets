import React, { useState, useEffect, useRef } from 'react';
import { Image, StyleSheet, View as RNView, ScrollView, Pressable, Modal, Alert, Animated } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useSimpleGame } from '@/store/SimpleGameStore';
import { usePets } from '@/store/PetStore';
import { useInventory } from '@/store/InventoryStore';
import PixelButton from '@/components/PixelButton';
import { Link, router, useFocusEffect } from 'expo-router';
import BorderedBox from '@/components/BorderedBox';
import JazzyTitle from '@/components/JazzyTitle';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
  const [selectedFood, setSelectedFood] = useState(null);
  const [equippedWeapon, setEquippedWeapon] = useState('none');
  const [equippedAccessory, setEquippedAccessory] = useState('none');
  const [showFeedSuccess, setShowFeedSuccess] = useState(false);
  const [lastFedStamina, setLastFedStamina] = useState(0);
  
  // Animation values for hearts
  const heartsOpacity = useRef(new Animated.Value(0)).current;
  const heartsSlideUp = useRef(new Animated.Value(30)).current;
  const heartsBob = useRef(new Animated.Value(0)).current;
  
  const activePet = getActivePet();
  
  // Reset scroll position when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );
  
  // Animate hearts when feeding
  useEffect(() => {
    if (showFeedSuccess) {
      // Reset animation values
      heartsOpacity.setValue(0);
      heartsSlideUp.setValue(30);
      heartsBob.setValue(0);
      
      // Fade in and slide up animation
      Animated.parallel([
        Animated.timing(heartsOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(heartsSlideUp, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Once at the top, start bobbing animation
        Animated.loop(
          Animated.sequence([
            Animated.timing(heartsBob, {
              toValue: -8,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(heartsBob, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    }
  }, [showFeedSuccess]);
  
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
      image: require('@/assets/images/coco-guy.png'),
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
    // QuickStop items (by item ID from store)
    's1': require('@/assets/images/chocolate.png'), // Protein Bar
    's2': require('@/assets/images/hotchips.png'), // Hot Chips
    's3': require('@/assets/images/slushee.png'), // Slushee
    's4': require('@/assets/images/lil-soda.png'), // Lil Soda
    's5': require('@/assets/images/cupnoodle.png'), // Cup O'Noodle
    's6': require('@/assets/images/regularhotdog.png'), // Quickdog
    's7': require('@/assets/images/potatochomps.png'), // Quick Chips
    's8': require('@/assets/images/saturnsoda.png'), // Saturn Soda
    's9': require('@/assets/images/nuggets.png'), // Nuggets
    'l1': require('@/assets/images/gumballs.png'), // Space Bubblegum
    'l2': require('@/assets/images/cosmicburger.png'), // Cosmic Burger
    'l3': require('@/assets/images/pouchdrink.png'), // Punch Pouch
    'l4': require('@/assets/images/chocodonut.png'), // Choco-Donut
    
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
  const availableFoods = inventoryState.mainInventory
    .filter(item => ['food', 'drink', 'snack'].includes(item.category))
    .map(item => {
      // Get the image from the map or use default
      const imageName = item.id || 'cosmicburger';
      const imageSource = foodImageMap[imageName] || require('@/assets/images/cosmicburger.png');
      
      return {
        id: item.id,
        name: item.name,
        stamina: 15, // Default stamina boost - can be enhanced later with item-specific values
        quantity: item.quantity,
        image: imageSource
      };
    });

  const getBackgroundImage = (bgId: string) => {
    return allBackgrounds[bgId]?.image || allBackgrounds.bg1.image;
  };

  const getPetImage = (imageName: string) => {
    const imageMap: { [key: string]: any } = {
      'tigerguy': require('@/assets/images/tigerguy.png'),
      'plumeca': require('@/assets/images/plumeca.png'),
      'coco-guy': require('@/assets/images/coco-guy.png'),
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
    
    if (state.coins >= item.cost) {
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
    if (food.quantity > 0) {
      setSelectedFood(food);
    }
  };

  const feedSelectedFood = () => {
    if (selectedFood && activePet) {
      // Remove food item from inventory
      removeItem(selectedFood.id, 1);
      
      // Feed pet with stamina boost
      feedPet(activePet.id, selectedFood.stamina);
      
      // Close modal and show success
      setShowFeedModal(false);
      setShowFeedSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowFeedSuccess(false);
        setSelectedFood(null);
      }, 5000);
    }
  };

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
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>MY PETS</Text>
        </RNView>

        {/* Active Pet Card */}
        <RNView style={styles.activePetCard}>
          {activePet ? (
            <RNView style={styles.petImageContainer}>
              <Image
                source={getBackgroundImage(activePet.background)}
                style={styles.petBackgroundImage}
                resizeMode="cover"
              />
              <Image
                source={getPetImage(activePet.image)}
                style={styles.petImage}
              />
              
              {/* Hearts animation above pet's head when feeding */}
              {showFeedSuccess && (
                <Animated.Image
                  source={require('@/assets/images/pxo-hearts.png')}
                  style={[
                    styles.feedHeartsAnimation,
                    {
                      opacity: heartsOpacity,
                      transform: [
                        { translateY: Animated.add(heartsSlideUp, heartsBob) }
                      ]
                    }
                  ]}
                  resizeMode="contain"
                />
              )}
              
              {/* Pet info on left side of image */}
              <RNView style={styles.petInfoOverlay}>
                <Text style={styles.petName}>{activePet.name}</Text>
                <Text style={styles.petLevel}>Level {activePet.level}</Text>
                <RNView style={styles.petOverlayStaminaRow}>
                  <FontAwesome name="bolt" size={12} color="#f59e0b" />
                  <Text style={styles.petOverlayStamina}>{activePet.stamina}</Text>
                </RNView>
              </RNView>

              {/* Feed Success Overlay - Appears at bottom of pet image */}
              {showFeedSuccess && (
                <RNView style={styles.feedSuccessOverlayInline}>
                  <Text style={styles.feedSuccessInlineText}>
                    {activePet?.name} devoured {selectedFood?.name}!
                  </Text>
                  <RNView style={styles.feedSuccessInlineStamina}>
                    <FontAwesome name="bolt" size={12} color="#fbbf24" />
                    <Text style={styles.feedSuccessInlineStaminaText}>+{selectedFood?.stamina || 0}</Text>
                  </RNView>
                </RNView>
              )}
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
                    setShowFeedModal(true);
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
            <>
              <Text style={styles.aboutTitle}>ABOUT</Text>
              <RNView style={styles.aboutContainer}>
                <RNView style={styles.aboutRow}>
                  <Text style={styles.aboutLabel}>Personality:</Text>
                  <Text style={styles.aboutValue}>Shy, Playful</Text>
                </RNView>
                <RNView style={styles.aboutRow}>
                  <Text style={styles.aboutLabel}>Fav Hobby:</Text>
                  <Text style={styles.aboutValue}>?</Text>
                </RNView>
              </RNView>
            </>
          )}

          {/* Stats Section - Inside the pet card */}
          {activePet && (
            <>
              <Text style={styles.statsTitle}>STATS</Text>
              <RNView style={styles.barStatsContainer}>
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
            </>
          )}
        </RNView>

        {/* Closet Section - Only show if there's an active pet */}
        {activePet && (
          <>
          <Text style={styles.closetTitle}>CLOSET</Text>
          <RNView style={styles.closetCard}>
          <RNView style={styles.closetContainer}>
            {/* Row 1 */}
            <RNView style={styles.closetRow}>
              {/* Weapon */}
              <Pressable 
                style={styles.equippedItem}
                onPress={() => purchaseItem(equipment.weapons[equippedWeapon], 'weapon')}
              >
                <Text style={styles.equippedItemName}>Weapon</Text>
                <Text style={styles.equippedItemValue}>{equipment.weapons[equippedWeapon]?.name}</Text>
              </Pressable>

              {/* Accessory */}
              <Pressable 
                style={styles.equippedItem}
                onPress={() => purchaseItem(equipment.accessories[equippedAccessory], 'accessory')}
              >
                <Text style={styles.equippedItemName}>Accessory</Text>
                <Text style={styles.equippedItemValue}>{equipment.accessories[equippedAccessory]?.name}</Text>
              </Pressable>

              {/* Glasses */}
              <Pressable 
                style={styles.equippedItem}
                onPress={() => purchaseItem({ id: 'none', name: 'None', unlocked: true }, 'glasses')}
              >
                <Text style={styles.equippedItemName}>Glasses</Text>
                <Text style={styles.equippedItemValue}>None</Text>
              </Pressable>
            </RNView>

            {/* Row 2 */}
            <RNView style={styles.closetRow}>
              {/* Necklace */}
              <Pressable 
                style={styles.equippedItem}
                onPress={() => purchaseItem({ id: 'none', name: 'None', unlocked: true }, 'necklace')}
              >
                <Text style={styles.equippedItemName}>Necklace</Text>
                <Text style={styles.equippedItemValue}>None</Text>
              </Pressable>

              {/* Bracelet */}
              <Pressable 
                style={styles.equippedItem}
                onPress={() => purchaseItem({ id: 'none', name: 'None', unlocked: true }, 'bracelet')}
              >
                <Text style={styles.equippedItemName}>Bracelet</Text>
                <Text style={styles.equippedItemValue}>None</Text>
              </Pressable>

              {/* Wings */}
              <Pressable 
                style={styles.equippedItem}
                onPress={() => purchaseItem({ id: 'none', name: 'None', unlocked: true }, 'wings')}
              >
                <Text style={styles.equippedItemName}>Wings</Text>
                <Text style={styles.equippedItemValue}>None</Text>
              </Pressable>
            </RNView>
          </RNView>
        </RNView>
        </>
        )}

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
                        <Text style={styles.petStaminaText}>{pet.stamina}</Text>
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
                  setSelectedFood(null);
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
                  onPress={feedSelectedFood}
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
  actionBoxes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 4,
    marginBottom: 16,
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
    flex: 1,
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
    width: 110,
    height: 110,
    imageRendering: 'pixelated' as any,
    marginTop: 50,
  },
  petName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'left',
  },
  petLevel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
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
    color: '#8b5cf6',
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
    imageRendering: 'pixelated' as any,
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
    width: '100%',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
    barStatRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
      paddingHorizontal: 10,
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
    marginTop: 8,
    marginBottom: 10,
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
  statsTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
    fontWeight: 'bold',
    color: '#8b5cf6',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 10,
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
    imageRendering: 'pixelated' as any,
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
      backgroundColor: '#f8fafc',
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#e2e8f0',
    },
    feedCardSelected: {
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.05)',
      borderWidth: 3,
    },
    feedImage: {
      width: 48,
      height: 48,
      marginBottom: 6,
      imageRendering: 'pixelated' as any,
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
    feedHeartsAnimation: {
      position: 'absolute',
      top: 50,
      left: '52%',
      marginLeft: -25,
      width: 50,
      height: 50,
      imageRendering: 'pixelated' as any,
      zIndex: 10,
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
    closetModalTitle: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 16,
      color: '#0f172a',
      fontWeight: 'bold',
      letterSpacing: 0.5,
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
    closetSection: {
      padding: 48,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 300,
    },
    closetEmptyText: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 11,
      color: '#94a3b8',
      textAlign: 'center',
      lineHeight: 20,
    },
  });


