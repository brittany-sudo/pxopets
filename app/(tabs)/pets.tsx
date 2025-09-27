import React, { useState } from 'react';
import { Image, StyleSheet, View as RNView, ScrollView, Pressable, Modal, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useGame } from '@/store/GameStore';
import PixelButton from '@/components/PixelButton';
import { Link } from 'expo-router';
import BorderedBox from '@/components/BorderedBox';
import JazzyTitle from '@/components/JazzyTitle';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function PetsScreen() {
  const { state, increaseHappiness, hydrated } = useGame();
  const [activePet, setActivePet] = useState('juno'); // Default to Juno
  const [selectedBackground, setSelectedBackground] = useState('bg1'); // Default background
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);
  const [showFeedModal, setShowFeedModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedFood, setSelectedFood] = useState(null);
  const [equippedWeapon, setEquippedWeapon] = useState('none');
  const [equippedAccessory, setEquippedAccessory] = useState('none');
  const [showFeedSuccess, setShowFeedSuccess] = useState(false);
  const [lastFedStamina, setLastFedStamina] = useState(0);
  
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
    noxia: {
      name: 'NOXIA',
      image: require('@/assets/images/purple-guy.png'),
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

  // Expanded background collection (ready for hundreds)
  const backgrounds = {
    bg1: { id: 'bg1', name: 'Forest', image: require('@/assets/images/bg1.png'), unlocked: true, rarity: 'common' },
    bg2: { id: 'bg2', name: 'Harbor', image: require('@/assets/images/loomers-background.png'), unlocked: true, rarity: 'common' },
    bg3: { id: 'bg3', name: 'Crescent Oasis', image: require('@/assets/images/crescent-background.png'), unlocked: true, rarity: 'common' },
    bg4: { id: 'bg4', name: 'Mountain Peak', image: require('@/assets/images/bg1.png'), unlocked: false, rarity: 'common', cost: 50 },
    bg5: { id: 'bg5', name: 'Desert Oasis', image: require('@/assets/images/bg1.png'), unlocked: false, rarity: 'common', cost: 75 },
    bg6: { id: 'bg6', name: 'Space Station', image: require('@/assets/images/bg1.png'), unlocked: false, rarity: 'rare', cost: 150 },
    bg7: { id: 'bg7', name: 'Crystal Cave', image: require('@/assets/images/bg1.png'), unlocked: false, rarity: 'rare', cost: 200 },
    bg8: { id: 'bg8', name: 'Underwater Palace', image: require('@/assets/images/bg1.png'), unlocked: false, rarity: 'epic', cost: 500 },
    bg9: { id: 'bg9', name: 'Cloud City', image: require('@/assets/images/bg1.png'), unlocked: false, rarity: 'epic', cost: 750 },
    bg10: { id: 'bg10', name: 'Volcano Lair', image: require('@/assets/images/bg1.png'), unlocked: false, rarity: 'legendary', cost: 1000 },
    bg11: { id: 'bg11', name: 'Rainbow Falls', image: require('@/assets/images/bg1.png'), unlocked: false, rarity: 'legendary', cost: 1500 },
    // Ready to add hundreds more...
  };

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

  // Food inventory system (QuickStop store items)
  const foodInventory = {
    chips: { id: 'chips', name: 'Chips', stamina: 12, quantity: 2, image: require('@/assets/images/chips.png') },
    cupnoddle: { id: 'cupnoddle', name: 'Cup Noodles', stamina: 18, quantity: 1, image: require('@/assets/images/cupnoddle.png') },
    chocolate: { id: 'chocolate', name: 'Chocolate', stamina: 15, quantity: 3, image: require('@/assets/images/chocolate.png') },
    pouchdrink: { id: 'pouchdrink', name: 'Energy Drink', stamina: 22, quantity: 1, image: require('@/assets/images/pouchdrink.png') },
    coffee: { id: 'coffee', name: 'Coffee', stamina: 8, quantity: 4, image: require('@/assets/images/chips.png') }, // placeholder
    donut: { id: 'donut', name: 'Donut', stamina: 20, quantity: 2, image: require('@/assets/images/chips.png') }, // placeholder
    sandwich: { id: 'sandwich', name: 'Sandwich', stamina: 25, quantity: 1, image: require('@/assets/images/chips.png') }, // placeholder
    soda: { id: 'soda', name: 'Soda', stamina: 10, quantity: 3, image: require('@/assets/images/chips.png') } // placeholder
  };

  const getBackgroundImage = (bgId: string) => {
    return backgrounds[bgId]?.image || backgrounds.bg1.image;
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
    if (selectedFood) {
      setShowFeedModal(false);
      setShowFeedSuccess(true);
      setSelectedFood(null);
      
      // Hide success message after 2 seconds
      setTimeout(() => {
        setShowFeedSuccess(false);
      }, 2000);
    }
  };

  // Pagination logic
  const itemsPerPage = 6;
  const availableFoods = Object.values(foodInventory).filter(food => food.quantity > 0);
  const totalPages = Math.ceil(availableFoods.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageItems = availableFoods.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
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

  if (!hydrated) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BorderedBox>
        {/* Active Pet Title positioned above image */}
        <Text style={styles.activePetTitleAbove}>ACTIVE PET</Text>
        {/* Pet with full-width border */}
        <RNView style={styles.petImageContainer}>
          <Image
            source={getBackgroundImage(selectedBackground)}
            style={styles.petBackgroundImage}
            resizeMode="cover"
          />
          <Image
            source={pets[activePet].image}
            style={styles.petImage}
          />
          
          {/* Pet info on left side of image */}
          <RNView style={styles.petInfoOverlay}>
            <Text style={styles.petName}>{pets[activePet].name}</Text>
            <Text style={styles.petLevel}>Level {pets[activePet].level}</Text>
          </RNView>
          
          {/* Stamina on right side of image */}
          <RNView style={styles.staminaOverlay}>
            <Text style={styles.staminaLabel}>STAMINA</Text>
            <RNView style={styles.staminaContainer}>
              <FontAwesome name="bolt" size={12} color="#f59e0b" />
              <Text style={styles.staminaText}>{state.coins}</Text>
            </RNView>
          </RNView>
        </RNView>

        {/* Action boxes underneath */}
        <RNView style={styles.actionBoxes}>
          <Pressable 
            style={styles.actionBox}
            onPress={() => {
              setCurrentPage(0);
              setShowFeedModal(true);
            }}
          >
            <FontAwesome name="cutlery" size={20} color="#14b8a6" />
            <Text style={styles.actionLabel}>FEED</Text>
          </Pressable>
          <Pressable style={styles.actionBox}>
            <FontAwesome name="futbol-o" size={20} color="#14b8a6" />
            <Text style={styles.actionLabel}>PLAY</Text>
          </Pressable>
          <Pressable style={styles.actionBox}>
            <FontAwesome name="map" size={20} color="#14b8a6" />
            <Text style={styles.actionLabel}>EXPLORE</Text>
          </Pressable>
        </RNView>

        {/* Stats Section */}
        <BorderedBox style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>STATS</Text>
          <RNView style={styles.barStatsContainer}>
            <RNView style={styles.barStatRow}>
              <Text style={styles.barStatLabel}>ATK</Text>
              <RNView style={styles.barStatBar}>
                <RNView style={[styles.barStatFill, { width: `${Math.min(100, (state.pet.level * 10) % 100)}%` }]} />
              </RNView>
              <Text style={styles.barStatValue}>{Math.min(100, (state.pet.level * 10) % 100)}</Text>
            </RNView>
            <RNView style={styles.barStatRow}>
              <Text style={styles.barStatLabel}>DEF</Text>
              <RNView style={styles.barStatBar}>
                <RNView style={[styles.barStatFill, { width: `${Math.min(100, (state.pet.level * 8) % 100)}%` }]} />
              </RNView>
              <Text style={styles.barStatValue}>{Math.min(100, (state.pet.level * 8) % 100)}</Text>
            </RNView>
            <RNView style={styles.barStatRow}>
              <Text style={styles.barStatLabel}>SPD</Text>
              <RNView style={styles.barStatBar}>
                <RNView style={[styles.barStatFill, { width: `${Math.min(100, (state.pet.level * 12) % 100)}%` }]} />
              </RNView>
              <Text style={styles.barStatValue}>{Math.min(100, (state.pet.level * 12) % 100)}</Text>
            </RNView>
            <RNView style={styles.barStatRow}>
              <Text style={styles.barStatLabel}>HP</Text>
              <RNView style={styles.barStatBar}>
                <RNView style={[styles.barStatFill, { width: `${Math.min(100, (state.pet.level * 15) % 100)}%` }]} />
              </RNView>
              <Text style={styles.barStatValue}>{Math.min(100, (state.pet.level * 15) % 100)}</Text>
            </RNView>
            <RNView style={styles.barStatRow}>
              <Text style={styles.barStatLabel}>LUCK</Text>
              <RNView style={styles.barStatBar}>
                <RNView style={[styles.barStatFill, { width: `${Math.min(100, (state.pet.level * 7) % 100)}%` }]} />
              </RNView>
              <Text style={styles.barStatValue}>{Math.min(100, (state.pet.level * 7) % 100)}</Text>
            </RNView>
            <RNView style={styles.barStatRow}>
              <Text style={styles.barStatLabel}>INT</Text>
              <RNView style={styles.barStatBar}>
                <RNView style={[styles.barStatFill, { width: `${Math.min(100, (state.pet.level * 9) % 100)}%` }]} />
              </RNView>
              <Text style={styles.barStatValue}>{Math.min(100, (state.pet.level * 9) % 100)}</Text>
            </RNView>
            <RNView style={styles.barStatRow}>
              <Text style={styles.barStatLabel}>CHARM</Text>
              <RNView style={styles.barStatBar}>
                <RNView style={[styles.barStatFill, { width: `${Math.min(100, (state.pet.level * 6) % 100)}%` }]} />
              </RNView>
              <Text style={styles.barStatValue}>{Math.min(100, (state.pet.level * 6) % 100)}</Text>
            </RNView>
            <RNView style={styles.barStatRow}>
              <Text style={styles.barStatLabel}>DEX</Text>
              <RNView style={styles.barStatBar}>
                <RNView style={[styles.barStatFill, { width: `${Math.min(100, (state.pet.level * 11) % 100)}%` }]} />
              </RNView>
              <Text style={styles.barStatValue}>{Math.min(100, (state.pet.level * 11) % 100)}</Text>
            </RNView>
          </RNView>
        </BorderedBox>

        {/* Closet Section */}
        <BorderedBox style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>CLOSET</Text>
          <RNView style={styles.closetContainer}>
            {/* Row 1 */}
            <RNView style={styles.closetRow}>
              {/* Background Button */}
              <Pressable 
                style={styles.equippedItem}
                onPress={() => setShowBackgroundModal(true)}
              >
                <Text style={styles.equippedItemName}>Background</Text>
                <Text style={styles.equippedItemValue}>{backgrounds[selectedBackground]?.name}</Text>
              </Pressable>

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
            </RNView>

            {/* Row 2 */}
            <RNView style={styles.closetRow}>
              {/* Hat */}
              <Pressable 
                style={styles.equippedItem}
                onPress={() => purchaseItem({ id: 'none', name: 'None', unlocked: true }, 'hat')}
              >
                <Text style={styles.equippedItemName}>Hat</Text>
                <Text style={styles.equippedItemValue}>None</Text>
              </Pressable>

              {/* Shoes */}
              <Pressable 
                style={styles.equippedItem}
                onPress={() => purchaseItem({ id: 'none', name: 'None', unlocked: true }, 'shoes')}
              >
                <Text style={styles.equippedItemName}>Shoes</Text>
                <Text style={styles.equippedItemValue}>None</Text>
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

            {/* Row 3 */}
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
        </BorderedBox>

        {/* Trophies Section */}
        <BorderedBox style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>TROPHIES</Text>
          <RNView style={styles.trophiesContainer}>
            <RNView style={styles.trophyRow}>
              <RNView style={styles.trophyItem}>
                <FontAwesome name="trophy" size={20} color="#fbbf24" />
                <Text style={styles.trophyName}>Speed Champion</Text>
              </RNView>
              <RNView style={styles.trophyItem}>
                <FontAwesome name="star" size={20} color="#f59e0b" />
                <Text style={styles.trophyName}>Explorer</Text>
              </RNView>
              <RNView style={styles.trophyItem}>
                <FontAwesome name="medal" size={20} color="#8b5cf6" />
                <Text style={styles.trophyName}>Battle Master</Text>
              </RNView>
            </RNView>
            <RNView style={styles.trophyRow}>
              <RNView style={styles.trophyItem}>
                <FontAwesome name="crown" size={20} color="#ec4899" />
                <Text style={styles.trophyName}>Royal Pet</Text>
              </RNView>
              <RNView style={styles.trophyItem}>
                <FontAwesome name="gem" size={20} color="#06b6d4" />
                <Text style={styles.trophyName}>Treasure Hunter</Text>
              </RNView>
              <RNView style={styles.trophyItem}>
                <FontAwesome name="heart" size={20} color="#ef4444" />
                <Text style={styles.trophyName}>Best Friend</Text>
              </RNView>
            </RNView>
          </RNView>
        </BorderedBox>
      </BorderedBox>

      <Text style={[styles.collectionTitle, { marginTop: 16 }]}>ALL PETS</Text>
      <BorderedBox>
        <RNView style={styles.petCollection}>
          {/* Pet 1 - FREKKI */}
          <Pressable 
            style={[styles.petSlot, activePet === 'frekki' && styles.activePetSlot]}
            onPress={() => setActivePet('frekki')}
          >
            <RNView style={styles.petSlotHeader}>
              <Image source={require('@/assets/images/coco-guy.png')} style={styles.petSlotImage} />
              <Text style={styles.petSlotName}>FREKKI</Text>
            </RNView>
            <RNView style={styles.petSlotStats}>
              <Text style={styles.petSlotStat}>Lvl 3</Text>
              <Text style={styles.petSlotStat}>HP: 85</Text>
              <Text style={styles.petSlotStat}>ATK: 42</Text>
            </RNView>
          </Pressable>
          
          {/* Pet 2 - NOXIA */}
          <Pressable 
            style={[styles.petSlot, activePet === 'noxia' && styles.activePetSlot]}
            onPress={() => setActivePet('noxia')}
          >
            <RNView style={styles.petSlotHeader}>
              <Image source={require('@/assets/images/purple-guy.png')} style={styles.petSlotImage} />
              <Text style={styles.petSlotName}>NOXIA</Text>
            </RNView>
            <RNView style={styles.petSlotStats}>
              <Text style={styles.petSlotStat}>Lvl 5</Text>
              <Text style={styles.petSlotStat}>HP: 92</Text>
              <Text style={styles.petSlotStat}>ATK: 38</Text>
            </RNView>
          </Pressable>
          
          {/* Pet 3 - TECHNOR */}
          <Pressable 
            style={[styles.petSlot, activePet === 'technor' && styles.activePetSlot]}
            onPress={() => setActivePet('technor')}
          >
            <RNView style={styles.petSlotHeader}>
              <Image source={require('@/assets/images/robot-guy.png')} style={styles.petSlotImage} />
              <Text style={styles.petSlotName}>TECHNOR</Text>
            </RNView>
            <RNView style={styles.petSlotStats}>
              <Text style={styles.petSlotStat}>Lvl 2</Text>
              <Text style={styles.petSlotStat}>HP: 78</Text>
              <Text style={styles.petSlotStat}>ATK: 45</Text>
            </RNView>
          </Pressable>
        </RNView>
      </BorderedBox>

      <RNView style={styles.adoptButtons}>
        <Link href="/(tabs)/adoption/pound" asChild>
          <RNView style={styles.adoptButton}>
            <FontAwesome name="heart" size={24} color="#8b5cf6" />
            <Text style={styles.adoptButtonText}>ADOPT</Text>
            <Text style={styles.adoptButtonSubtext}>From The Pound</Text>
          </RNView>
        </Link>
        <Link href="/(tabs)/adoption/create" asChild>
          <RNView style={styles.adoptButton}>
            <FontAwesome name="plus-circle" size={24} color="#8b5cf6" />
            <Text style={styles.adoptButtonText}>CREATE</Text>
            <Text style={styles.adoptButtonSubtext}>New Pet</Text>
          </RNView>
        </Link>
      </RNView>
      </ScrollView>

      {/* Background Selection Modal */}
        <Modal
          visible={showBackgroundModal}
          animationType="fade"
          transparent={true}
        >
        <View style={styles.modalContainer}>
          <RNView style={styles.modalContentWrapper}>
            <RNView style={styles.modalHeader}>
              <Text style={styles.modalTitle}>BACKGROUND COLLECTION</Text>
              <Pressable 
                style={styles.closeButton}
                onPress={() => setShowBackgroundModal(false)}
              >
                <FontAwesome name="times" size={20} color="#0ea5e9" />
              </Pressable>
            </RNView>
            
            <ScrollView style={styles.modalContent}>
              <RNView style={styles.backgroundCollection}>
                {Object.values(backgrounds)
                  .filter(bg => bg.unlocked)
                  .map((bg) => (
                  <Pressable
                    key={bg.id}
                    style={[
                      styles.backgroundCard,
                      selectedBackground === bg.id && styles.selectedBackgroundCard
                    ]}
                    onPress={() => {
                      setSelectedBackground(bg.id);
                      setShowBackgroundModal(false);
                    }}
                  >
                    <Image source={bg.image} style={styles.backgroundPreview} />
                    <RNView style={styles.backgroundInfo}>
                      <Text style={styles.backgroundCardName}>
                        {bg.name}
                      </Text>
                      <Text style={[
                        styles.backgroundRarity,
                        { color: getRarityColor(bg.rarity) }
                      ]}>
                        {bg.rarity.toUpperCase()}
                      </Text>
                      <FontAwesome 
                        name="check-circle" 
                        size={16} 
                        color="#10b981" 
                        style={styles.unlockedIcon}
                      />
                    </RNView>
                  </Pressable>
                ))}
              </RNView>
            </ScrollView>
          </RNView>
        </View>
      </Modal>

      {/* Food Selection Modal */}
      <Modal
        visible={showFeedModal}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <RNView style={styles.modalContentWrapper}>
            <RNView style={styles.modalHeader}>
              <Pressable 
                style={styles.closeButton}
                onPress={() => setShowFeedModal(false)}
              >
                <FontAwesome name="times" size={14} color="#8b5cf6" />
              </Pressable>
            </RNView>
            
            <RNView style={styles.paginationContainer}>
              {/* Food Grid and Arrow Row */}
              <RNView style={styles.foodAndArrowRow}>
                <RNView style={styles.foodGrid}>
                  {currentPageItems.map((food) => (
                    <Pressable
                      key={food.id}
                      style={[
                        styles.foodCard,
                        selectedFood?.id === food.id && styles.selectedFoodCard
                      ]}
                      onPress={() => selectFood(food)}
                    >
                      <Text style={styles.foodQuantity}>x{food.quantity}</Text>
                      <RNView style={styles.foodInfo}>
                        <Image source={food.image} style={styles.foodImage} />
                        <Text style={styles.foodName}>{food.name}</Text>
                        <RNView style={styles.staminaContainer}>
                          <Text style={styles.foodStamina}>+{food.stamina}</Text>
                          <FontAwesome name="bolt" size={8} color="#fbbf24" />
                        </RNView>
                      </RNView>
                    </Pressable>
                  ))}
                </RNView>

                {/* Single Arrow - Right when on first page, Left when on other pages */}
                {totalPages > 1 && (
                  <Pressable 
                    style={styles.arrowButton}
                    onPress={currentPage === 0 ? nextPage : prevPage}
                  >
                    <FontAwesome 
                      name={currentPage === 0 ? "chevron-right" : "chevron-left"} 
                      size={18} 
                      color="#14b8a6" 
                    />
                  </Pressable>
                )}
              </RNView>

              {/* Feed Pet Button - Centered with inventory */}
              <Pressable 
                style={[
                  styles.feedButton,
                  !selectedFood && styles.feedButtonDisabled
                ]}
                onPress={feedSelectedFood}
                disabled={!selectedFood}
              >
                <Text style={[
                  styles.feedButtonText,
                  !selectedFood && styles.feedButtonTextDisabled
                ]}>
                  FEED PET
                </Text>
              </Pressable>
            </RNView>
          </RNView>
        </View>
      </Modal>

      {/* Feed Success Message */}
      {showFeedSuccess && (
        <View style={styles.successOverlay}>
          <View style={styles.successMessage}>
            <Text style={styles.successText}>Pet Fed!</Text>
            <Text style={styles.successStamina}>+{selectedFood?.stamina || 0} ⚡</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
    paddingBottom: 100,
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
    petImageContainer: {
      width: '100%',
      height: 240,
      borderRadius: 0,
      borderWidth: 2,
      borderColor: '#0ea5e9',
      backgroundColor: 'rgba(14, 165, 233, 0.05)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
      padding: 20,
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
    staminaOverlay: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      alignItems: 'center',
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
    closetTitle: {
      fontFamily: 'PressStart2P_400Regular',
      fontSize: 10,
      fontWeight: 'bold',
      color: '#0f172a',
      textAlign: 'center',
      marginBottom: 2,
      alignSelf: 'center',
    },
    closetContainer: {
      padding: 6,
      minHeight: 160,
    },
    closetRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 2,
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
      borderWidth: 2,
      borderColor: '#14b8a6',
      backgroundColor: '#ffffff',
      paddingHorizontal: 24,
      paddingVertical: 20,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 8,
      flex: 1,
      height: 80,
      shadowColor: '#14b8a6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 6,
    },
    actionLabel: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 12,
      color: '#14b8a6',
      textAlign: 'center',
      fontWeight: 'bold',
    },
  petImage: {
    width: 110,
    height: 110,
    imageRendering: 'pixelated' as any,
    marginTop: 80, // Moved down a bit more
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
    staminaLabel: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 8,
      color: '#ffffff',
      textAlign: 'right',
      marginBottom: 4,
    },
    staminaContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    staminaText: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 10,
      color: '#f59e0b',
      fontWeight: 'bold',
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
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0ea5e9',
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 8,
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
    borderWidth: 2,
    borderColor: '#0ea5e9',
    borderRadius: 8,
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    padding: 8,
    marginBottom: 8,
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
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  barStatsContainer: {
    width: '100%',
    marginBottom: 16,
  },
    barStatRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 6,
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
  adoptButtons: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    marginTop: 12,
    paddingHorizontal: 40,
    width: '100%',
  },
  adoptButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 28,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    borderRadius: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
    adoptButtonText: {
      fontFamily: 'PressStart2P_400Regular',
      fontSize: 14,
      fontWeight: 'bold',
      color: '#8b5cf6',
      marginTop: 8,
      marginBottom: 4,
    },
    adoptButtonSubtext: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 10,
      color: '#0f172a',
      textAlign: 'center',
      opacity: 0.8,
    },
    // Equipped Items Styles
    equippedItem: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 8,
      backgroundColor: 'rgba(14, 165, 233, 0.05)',
      borderRadius: 6,
      borderWidth: 1,
      borderColor: 'rgba(14, 165, 233, 0.2)',
      minHeight: 50,
      flex: 1,
      marginHorizontal: 2,
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
      fontSize: 10,
      fontWeight: 'bold',
      color: '#0f172a',
      textAlign: 'center',
      marginBottom: 8,
      alignSelf: 'center',
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
  });


