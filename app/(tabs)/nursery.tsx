import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Pressable, Alert, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Import pet images
const tigerguyImage = require('@/assets/images/tigerguy.png');
const pinkGuyImage = require('@/assets/images/pink-guy.png');
const coconutGuyImage = require('@/assets/images/coco-guy.png');
const purpleGuyImage = require('@/assets/images/purple-guy.png');
const robotGuyImage = require('@/assets/images/robot-guy.png');
const sheepGuyImage = require('@/assets/images/sheep-guy.png');
const bullGuyImage = require('@/assets/images/bull-guy.png');
const stormGuyImage = require('@/assets/images/storm-guy.png');
const fishGuysImage = require('@/assets/images/fish-guys.png');
const sappoImage = require('@/assets/images/sappo.png');
const gazoImage = require('@/assets/images/gazo.png');
const nurseryHeaderImage = require('@/assets/images/pxopia-nursery.png');

export default function NurseryScreen() {
  const [selectedTab, setSelectedTab] = useState<'create' | 'adopt'>('create');
  const [myPets, setMyPets] = useState<Set<string>>(new Set());
  const [donatedItems, setDonatedItems] = useState<Set<string>>(new Set());

  const handleCreatePet = (pet: any) => {
    Alert.alert(
      'Create Pet',
      `Create a ${pet.name} for ${pet.cost} tickets?\n\n${pet.description}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Create", onPress: () => {
          setMyPets(prev => new Set([...prev, pet.id]));
          Alert.alert('Pet Created!', `Your ${pet.name} is ready to play!`);
        }}
      ]
    );
  };

  const handleAdoptPet = (pet: any) => {
    Alert.alert(
      'Adopt Pet',
      `Adopt ${pet.name}?\n\n${pet.description}\n\nPrevious owner: ${pet.previousOwner}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Adopt", onPress: () => {
          setMyPets(prev => new Set([...prev, pet.id]));
          Alert.alert('Pet Adopted!', `Welcome ${pet.name} to your family!`);
        }}
      ]
    );
  };

  const handleDonateItem = (item: any) => {
    Alert.alert(
      'Donate Item',
      `Donate ${item.name} to the nursery?\n\n${item.description}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Donate", onPress: () => {
          setDonatedItems(prev => new Set([...prev, item.id]));
          Alert.alert('Item Donated!', `Thank you for donating ${item.name}!`);
        }}
      ]
    );
  };

  const createablePets = [
    {
      id: 'sudotiger',
      name: 'SUDOTIGER',
      cost: 100,
      description: 'A fierce tiger companion with high attack power.',
      image: tigerguyImage,
      rarity: 'Common',
      color: '#8b5cf6',
      level: 1,
      hp: 100,
      atk: 50
    },
    {
      id: 'wheezie',
      name: 'WHEEZIE',
      cost: 120,
      description: 'A cheerful pink companion with healing abilities.',
      image: pinkGuyImage,
      rarity: 'Common',
      color: '#ec4899',
      level: 1,
      hp: 90,
      atk: 35
    },
    {
      id: 'frekki',
      name: 'FREKKI',
      cost: 150,
      description: 'A loyal companion with balanced stats.',
      image: coconutGuyImage,
      rarity: 'Uncommon',
      color: '#10b981',
      level: 3,
      hp: 85,
      atk: 42
    },
    {
      id: 'noxia',
      name: 'NOXIA',
      cost: 200,
      description: 'A mysterious purple creature with magical abilities.',
      image: purpleGuyImage,
      rarity: 'Rare',
      color: '#f59e0b',
      level: 5,
      hp: 92,
      atk: 38
    },
    {
      id: 'gazo',
      name: 'GAZO',
      cost: 175,
      description: 'A mysterious companion with unique abilities.',
      image: gazoImage,
      rarity: 'Rare',
      color: '#ef4444',
      level: 2,
      hp: 78,
      atk: 45
    },
    {
      id: 'doppio',
      name: 'DOPPIO',
      cost: 130,
      description: 'A fluffy sheep with defensive capabilities.',
      image: sheepGuyImage,
      rarity: 'Common',
      color: '#6b7280',
      level: 2,
      hp: 95,
      atk: 30
    },
    {
      id: 'cursive',
      name: 'CURSIVE',
      cost: 180,
      description: 'A strong bull with incredible strength.',
      image: bullGuyImage,
      rarity: 'Uncommon',
      color: '#92400e',
      level: 4,
      hp: 110,
      atk: 55
    },
    {
      id: 'lemento',
      name: 'LEMENTO',
      cost: 220,
      description: 'A storm-powered creature with elemental magic.',
      image: stormGuyImage,
      rarity: 'Rare',
      color: '#3b82f6',
      level: 6,
      hp: 88,
      atk: 60
    },
    {
      id: 'guptrois',
      name: 'GUPTROIS',
      cost: 250,
      description: 'A trio of fish with synchronized abilities.',
      image: fishGuysImage,
      rarity: 'Epic',
      color: '#06b6d4',
      level: 7,
      hp: 75,
      atk: 65
    },
    {
      id: 'sappo',
      name: 'SAPPO',
      cost: 300,
      description: 'A mysterious creature with ancient wisdom.',
      image: sappoImage,
      rarity: 'Legendary',
      color: '#7c3aed',
      level: 8,
      hp: 120,
      atk: 70
    }
  ];

  const adoptablePets = [
    {
      id: 'adopt-1',
      name: 'xXx_TigerLord_xXx',
      description: 'Surrendered by previous owner. Loves to hunt and play.',
      image: tigerguyImage,
      color: '#8b5cf6',
      level: 3,
      hp: 85,
      atk: 45
    },
    {
      id: 'adopt-2',
      name: 'PinkPrincess99',
      description: 'Sweet and caring. Needs a patient owner.',
      image: pinkGuyImage,
      color: '#ec4899',
      level: 2,
      hp: 70,
      atk: 30
    },
    {
      id: 'adopt-3',
      name: 'CocoBean2001',
      description: 'Energetic and friendly. Great with kids.',
      image: coconutGuyImage,
      color: '#10b981',
      level: 4,
      hp: 95,
      atk: 40
    },
    {
      id: 'adopt-4',
      name: 'PurpleHaze420',
      description: 'Mysterious and independent. Prefers quiet homes.',
      image: purpleGuyImage,
      color: '#f59e0b',
      level: 5,
      hp: 80,
      atk: 55
    },
    {
      id: 'adopt-5',
      name: 'TechNoob_2024',
      description: 'Tech-savvy but needs guidance. Very loyal.',
      image: gazoImage,
      color: '#ef4444',
      level: 2,
      hp: 65,
      atk: 35
    },
    {
      id: 'adopt-6',
      name: 'SheepySheep123',
      description: 'Gentle and calm. Perfect for beginners.',
      image: sheepGuyImage,
      color: '#6b7280',
      level: 3,
      hp: 90,
      atk: 25
    },
    {
      id: 'adopt-7',
      name: 'BullMoose88',
      description: 'Strong and protective. Needs experienced owner.',
      image: bullGuyImage,
      color: '#92400e',
      level: 6,
      hp: 120,
      atk: 70
    },
    {
      id: 'adopt-8',
      name: 'StormChaser_Pro',
      description: 'Powerful but unpredictable. For advanced trainers.',
      image: stormGuyImage,
      color: '#3b82f6',
      level: 7,
      hp: 75,
      atk: 80
    },
    {
      id: 'adopt-9',
      name: 'FishGang_Leader',
      description: 'Social and playful. Loves water activities.',
      image: fishGuysImage,
      color: '#06b6d4',
      level: 4,
      hp: 60,
      atk: 50
    },
    {
      id: 'adopt-10',
      name: 'WiseOldSage_OG',
      description: 'Ancient wisdom. Requires special care.',
      image: sappoImage,
      color: '#7c3aed',
      level: 8,
      hp: 100,
      atk: 90
    }
  ];

  const donationItems = [
    {
      id: 'pet-food',
      name: 'Premium Pet Food',
      description: 'High-quality nutrition for all pet types.',
      icon: 'cutlery',
      value: 25
    },
    {
      id: 'toy-ball',
      name: 'Bouncy Ball',
      description: 'A fun toy that pets love to play with.',
      icon: 'circle',
      value: 15
    },
    {
      id: 'warm-blanket',
      name: 'Cozy Blanket',
      description: 'A soft blanket to keep pets warm and comfortable.',
      icon: 'square',
      value: 30
    },
    {
      id: 'health-potion',
      name: 'Health Potion',
      description: 'A magical potion that heals sick pets.',
      icon: 'flask',
      value: 50
    },
    {
      id: 'training-treats',
      name: 'Training Treats',
      description: 'Special treats that help pets learn new tricks.',
      icon: 'gift',
      value: 20
    },
    {
      id: 'magic-collar',
      name: 'Magic Collar',
      description: 'A special collar that enhances pet abilities.',
      icon: 'diamond',
      value: 75
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header Row */}
            <RNView style={styles.headerRow}>
              <Text style={styles.locationTitle}>PXOPIA NURSERY</Text>
            </RNView>

            {/* Nursery Header Image */}
            <Image source={nurseryHeaderImage} style={styles.nurseryHeaderImage} resizeMode="contain" />

        {/* Tab Navigation */}
        <RNView style={styles.tabContainer}>
          <Pressable 
            style={[styles.tab, selectedTab === 'create' && styles.activeTab]}
            onPress={() => setSelectedTab('create')}
          >
            <FontAwesome name="plus" size={16} color={selectedTab === 'create' ? '#ffffff' : '#8b5cf6'} />
            <Text style={[styles.tabText, selectedTab === 'create' && styles.activeTabText]}>CREATE</Text>
          </Pressable>
          <Pressable 
            style={[styles.tab, selectedTab === 'adopt' && styles.activeTab]}
            onPress={() => setSelectedTab('adopt')}
          >
            <FontAwesome name="heart" size={16} color={selectedTab === 'adopt' ? '#ffffff' : '#8b5cf6'} />
            <Text style={[styles.tabText, selectedTab === 'adopt' && styles.activeTabText]}>ADOPT</Text>
          </Pressable>
        </RNView>

        {/* Create Pets Section */}
        {selectedTab === 'create' && (
          <RNView style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>CREATE A PET</Text>
            <Text style={styles.sectionDescription}>Design and create your perfect companion!</Text>
            <RNView style={styles.petsGrid}>
              {createablePets.map((pet) => (
                <Pressable
                  key={pet.id}
                  style={styles.petCard}
                  onPress={() => handleCreatePet(pet)}
                >
                  <RNView style={styles.petImageContainer}>
                    <Image source={pet.image} style={styles.petImage} />
                  </RNView>
                  <Text style={styles.petName}>{pet.name}</Text>
                  <Text style={styles.petDescription}>{pet.description}</Text>
                  <RNView style={styles.petStats}>
                    <Text style={styles.petLevel}>Level {pet.level}</Text>
                    <Text style={styles.petHpAtk}>HP: {pet.hp} | ATK: {pet.atk}</Text>
                  </RNView>
                  <RNView style={styles.petMeta}>
                    <Text style={[styles.petRarity, { color: pet.color }]}>{pet.rarity}</Text>
                    <Text style={styles.petCost}>{pet.cost} 🎫</Text>
                  </RNView>
                  {myPets.has(pet.id) && (
                    <RNView style={styles.ownedBadge}>
                      <FontAwesome name="check" size={12} color="#ffffff" />
                      <Text style={styles.ownedText}>OWNED</Text>
                    </RNView>
                  )}
                </Pressable>
              ))}
            </RNView>
          </RNView>
        )}

        {/* Adopt Pets Section */}
        {selectedTab === 'adopt' && (
          <RNView style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>ADOPT A PET</Text>
            <Text style={styles.sectionDescription}>Give a loving home to surrendered pets!</Text>
            <RNView style={styles.adoptList}>
              {adoptablePets.map((pet) => (
                <Pressable
                  key={pet.id}
                  style={styles.adoptCard}
                  onPress={() => handleAdoptPet(pet)}
                >
                  <RNView style={styles.adoptCardContent}>
                    <RNView style={[styles.adoptImageContainer, { backgroundColor: `${pet.color}20` }]}>
                      <Image source={pet.image} style={styles.adoptImage} />
                    </RNView>
                    <RNView style={styles.adoptTextInfo}>
                      <Text style={styles.adoptName}>{pet.name}</Text>
                      <Text style={styles.adoptDescription}>{pet.description}</Text>
                      <RNView style={styles.adoptStats}>
                        <Text style={styles.adoptLevel}>Level {pet.level}</Text>
                        <Text style={styles.adoptHpAtk}>HP: {pet.hp} | ATK: {pet.atk}</Text>
                      </RNView>
                    </RNView>
                  </RNView>
                  <RNView style={styles.adoptButtonContainer}>
                    <Pressable style={styles.adoptButton}>
                      <FontAwesome name="heart" size={12} color="#ffffff" />
                      <Text style={styles.adoptButtonText}>ADOPT</Text>
                    </Pressable>
                  </RNView>
                  {myPets.has(pet.id) && (
                    <RNView style={styles.ownedBadge}>
                      <FontAwesome name="check" size={12} color="#ffffff" />
                      <Text style={styles.ownedText}>ADOPTED</Text>
                    </RNView>
                  )}
                </Pressable>
              ))}
            </RNView>
          </RNView>
        )}

        {/* Surrender Pet Option */}
        <RNView style={styles.surrenderSection}>
          <Pressable 
            style={styles.surrenderButton}
            onPress={() => Alert.alert('Surrender Pet', 'This feature is coming soon! You\'ll be able to surrender your pets to the nursery for other players to adopt.')}
          >
            <Text style={styles.surrenderButtonText}>SURRENDER A PET</Text>
          </Pressable>
        </RNView>

        {/* Nursery Info */}
        <RNView style={styles.infoContainer}>
          <Text style={styles.infoTitle}>About Pxopia Nursery</Text>
          <Text style={styles.infoText}>
            Welcome to the Pxopia Nursery! Here you can create new pets, adopt abandoned companions, 
            or donate items to help care for all the little ones. Every pet deserves a loving home!
          </Text>
        </RNView>

        {/* Donate Section - Simplified */}
        <RNView style={styles.donateSection}>
          <Text style={styles.donateSectionTitle}>DONATE TO NURSERY</Text>
          <Text style={styles.donateSectionDescription}>Help care for pets in need!</Text>
          <RNView style={styles.donateOptions}>
            <Pressable
              style={styles.donateOption}
              onPress={() => Alert.alert('Donate Tickets', 'Donate tickets to help the nursery care for pets!', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Donate 50 Tickets', onPress: () => Alert.alert('Thank you!', 'Your donation helps care for pets in need!') }
              ])}
            >
              <RNView style={styles.donateOptionIcon}>
                <FontAwesome name="ticket" size={24} color="#8b5cf6" />
              </RNView>
              <Text style={styles.donateOptionTitle}>DONATE TICKETS</Text>
              <Text style={styles.donateOptionDescription}>Give tickets to help fund pet care</Text>
            </Pressable>
            
            <Pressable
              style={styles.donateOption}
              onPress={() => Alert.alert('Donate Food', 'Donate food from your inventory to feed hungry pets!', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Donate Food', onPress: () => Alert.alert('Thank you!', 'Your food donation helps feed hungry pets!') }
              ])}
            >
              <RNView style={styles.donateOptionIcon}>
                <FontAwesome name="cutlery" size={24} color="#8b5cf6" />
              </RNView>
              <Text style={styles.donateOptionTitle}>DONATE FOOD</Text>
              <Text style={styles.donateOptionDescription}>Give food from your inventory</Text>
            </Pressable>
          </RNView>
        </RNView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 4,
    paddingHorizontal: 40,
    height: 40,
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
    lineHeight: 16,
  },
  nurseryHeaderImage: {
    width: '100%',
    height: 180,
    marginBottom: 8,
    alignSelf: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#8b5cf6',
  },
  tabText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#ffffff',
  },
  sectionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  petsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  petCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    position: 'relative',
  },
  petImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  petImage: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  petName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
    textAlign: 'center',
  },
  petDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 12,
  },
  petStats: {
    marginBottom: 6,
    alignItems: 'center',
  },
  petLevel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  petHpAtk: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 7,
    color: '#64748b',
    textAlign: 'center',
  },
  petMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  petRarity: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    fontWeight: 'bold',
  },
  petCost: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  adoptList: {
    width: '100%',
    gap: 12,
  },
  adoptCard: {
    backgroundColor: '#fafafa',
    borderRadius: 20,
    padding: 24,
    borderWidth: 0,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    marginHorizontal: 4,
  },
  adoptImageContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  adoptImage: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
  },
  adoptCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  adoptTextInfo: {
    flex: 1,
    marginLeft: 20,
  },
  adoptButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  adoptName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    lineHeight: 18,
    letterSpacing: 0.3,
  },
  adoptDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  adoptStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 0,
  },
  adoptLevel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: '600',
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    letterSpacing: 0.3,
  },
  adoptHpAtk: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#6b7280',
    backgroundColor: 'rgba(107, 114, 128, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    letterSpacing: 0.2,
  },
  adoptMeta: {
    alignItems: 'center',
  },
  adoptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  adoptButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  donateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  donateCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    position: 'relative',
  },
  donateIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  donateName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
    textAlign: 'center',
  },
  donateDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 12,
  },
  donateValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  ownedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
  },
  ownedText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  donatedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
  },
  donatedText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    width: '100%',
  },
  infoTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#666666',
    lineHeight: 16,
    textAlign: 'center',
  },
  donateSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  donateSectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 8,
    textAlign: 'center',
  },
  donateSectionDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  donateOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  donateOption: {
    flex: 1,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  donateOptionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  donateOptionTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
    textAlign: 'center',
  },
  donateOptionDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 12,
  },
  surrenderSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  surrenderButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  surrenderButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ef4444',
    fontWeight: 'bold',
  },
});
