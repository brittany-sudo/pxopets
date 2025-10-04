import React, { useState, useRef } from 'react';
import { StyleSheet, ScrollView, View as RNView, Pressable, Alert, Image, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, View } from '@/components/Themed';
import { usePets } from '@/store/PetStore';
import { useSimpleGame } from '@/store/SimpleGameStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, useFocusEffect } from 'expo-router';

// Import pet images
const tigerguyImage = require('@/assets/images/tigerguy.png');
const plumecaImage = require('@/assets/images/plumeca.png');
const coconutGuyImage = require('@/assets/images/coco-guy.png');
const frekkiImage = require('@/assets/images/frekki.png');
const lallazoImage = require('@/assets/images/lallazo.png');
const robotGuyImage = require('@/assets/images/robot-guy.png');
const sheepGuyImage = require('@/assets/images/sheep-guy.png');
const bullGuyImage = require('@/assets/images/bull-guy.png');
const stormGuyImage = require('@/assets/images/storm-guy.png');
const fishGuysImage = require('@/assets/images/fish-guys.png');
const sappoImage = require('@/assets/images/sappo.png');
const gazoImage = require('@/assets/images/gazo.png');
const nurseryHeaderImage = require('@/assets/images/pxopia-nursery.png');

// Personality traits
const personalityTraits = [
  'Bold', 'Timid', 'Brave', 'Calm', 'Energetic', 'Gentle', 'Playful', 'Serious',
  'Curious', 'Loyal', 'Mischievous', 'Caring', 'Adventurous', 'Relaxed', 'Clever',
  'Friendly', 'Independent', 'Protective', 'Silly', 'Wise'
];

export default function NurseryScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const { adoptPet, canAdoptMore, state: petState } = usePets();
  const { state: gameState, spendGems } = useSimpleGame();
  const [selectedTab, setSelectedTab] = useState<'create' | 'adopt'>('create');
  const [donatedItems, setDonatedItems] = useState<Set<string>>(new Set());
  
  // Reset scroll position when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [generatedStats, setGeneratedStats] = useState<any>(null);
  const [petGender, setPetGender] = useState<'Male' | 'Female'>('Male');
  const [petTraits, setPetTraits] = useState<string[]>([]);
  const [showNamingStep, setShowNamingStep] = useState(false);
  const [petName, setPetName] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorTitle, setErrorTitle] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successPetName, setSuccessPetName] = useState('');

  // Generate random stats (3-15 range with potential outliers)
  const generateRandomStats = () => {
    const generateStat = () => {
      const isOutlier = Math.random() < 0.03;
      if (isOutlier) {
        return Math.floor(Math.random() * 26) + 40; // 40-65
      }
      return Math.floor(Math.random() * 13) + 3; // 3-15
    };

    return {
      def: generateStat(),
      spd: generateStat(),
      luck: generateStat(),
      int: generateStat(),
      charm: generateStat(),
      dex: generateStat(),
    };
  };

  // Get 2 random personality traits
  const getRandomTraits = () => {
    const shuffled = [...personalityTraits].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  };

  const handleCreatePet = (pet: any) => {
    if (!canAdoptMore()) {
      setErrorTitle('Pet Limit Reached');
      setErrorMessage(`You can only have ${petState.maxPets} pets maximum!`);
      setShowErrorModal(true);
      return;
    }

    // Calculate cost: first pet free, all others 25 gems
    const cost = petState.adoptedPets.length === 0 ? 0 : 25;
    const currentGems = gameState.gems || 0;

    // Check if player has enough gems (if not free)
    if (cost > 0 && currentGems < cost) {
      setErrorTitle('Not Enough Gems');
      setErrorMessage(`You need ${cost} gems to create this pet.\n\nYou currently have ${currentGems} gems.`);
      setShowErrorModal(true);
      return;
    }

    // Generate random stats, gender, and traits
    const stats = generateRandomStats();
    const gender = Math.random() < 0.5 ? 'Male' : 'Female';
    const traits = getRandomTraits();

    // Set up modal data
    setSelectedPet(pet);
    setGeneratedStats(stats);
    setPetGender(gender);
    setPetTraits(traits);
    setShowNamingStep(false);
    setPetName('');
    setShowCreateModal(true);
  };

  const handleConfirmCreate = () => {
    // First pet is free, all others cost 25 gems
    const cost = petState.adoptedPets.length === 0 ? 0 : 25;
    
    // If there's a cost, check and spend gems
    if (cost > 0) {
      const currentGems = gameState.gems || 0;
      
      // Check if player has enough gems
      if (currentGems < cost) {
        setErrorTitle('Not Enough Gems');
        setErrorMessage(`You need ${cost} gems to create this pet.\n\nYou currently have ${currentGems} gems.`);
        setShowErrorModal(true);
        return;
      }
      
      // Try to spend the gems
      const success = spendGems(cost);
      if (!success) {
        setErrorTitle('Not Enough Gems');
        setErrorMessage(`You need ${cost} gems to create this pet.\n\nYou currently have ${currentGems} gems.`);
        setShowErrorModal(true);
        return;
      }
    }

    const newPetId = `${selectedPet.id}-${Date.now()}`; // Unique ID
    const success = adoptPet({
      id: newPetId,
      name: petName || selectedPet.name,
      image: selectedPet.imageName,
      hp: 100,
      atk: 10,
      level: 1,
    });
    
    if (success) {
      // Close modal first
      setShowCreateModal(false);
      setShowNamingStep(false);
      setPetName('');
      
      // Show success modal after a short delay
      setTimeout(() => {
        setSuccessPetName(petName || selectedPet.name);
        setShowSuccessModal(true);
      }, 300);
    } else {
      setErrorTitle('Error');
      setErrorMessage('Failed to create pet. Please try again.');
      setShowErrorModal(true);
    }
  };

  const handleAdoptPet = (pet: any) => {
    if (!canAdoptMore()) {
      setErrorTitle('Pet Limit Reached');
      setErrorMessage(`You can only have ${petState.maxPets} pets maximum!`);
      setShowErrorModal(true);
      return;
    }

    // First pet is free, all others cost 25 gems
    const cost = petState.adoptedPets.length === 0 ? 0 : 25;
    const costText = cost === 0 ? 'FREE' : `${cost} gems`;
    const currentGems = gameState.gems || 0;

    // Check if player has enough gems (if not free)
    if (cost > 0 && currentGems < cost) {
      setErrorTitle('Not Enough Gems');
      setErrorMessage(`You need ${cost} gems to adopt this pet.\n\nYou currently have ${currentGems} gems.`);
      setShowErrorModal(true);
      return;
    }

    Alert.alert(
      'Adopt Pet',
      `Adopt ${pet.name} for ${costText}?\n\n${pet.description}\n\nPrevious owner: ${pet.previousOwner}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Adopt", onPress: () => {
          // Spend gems if not first pet
          if (cost > 0) {
            const gemSuccess = spendGems(cost);
            if (!gemSuccess) {
              setErrorTitle('Not Enough Gems');
              setErrorMessage(`You need ${cost} gems to adopt this pet.\n\nYou currently have ${currentGems} gems.`);
              setShowErrorModal(true);
              return;
            }
          }

          const success = adoptPet({
            id: `${pet.id}-${Date.now()}`, // Unique ID
            name: pet.name,
            image: pet.imageName,
            hp: 100,
            atk: 10,
            level: 1,
          });
          
          if (success) {
            Alert.alert(
              'Pet Adopted!', 
              `Welcome ${pet.name} to your family!`,
              [{ text: 'View Pet', onPress: () => router.push('/(tabs)/pets') }]
            );
          } else {
            Alert.alert('Error', 'Failed to adopt pet. Please try again.');
          }
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
      description: 'A fierce tiger companion with high attack power.',
      image: tigerguyImage,
      imageName: 'tigerguy',
      color: '#8b5cf6'
    },
    {
      id: 'plumeca',
      name: 'PLUMECA',
      description: 'A cheerful companion with healing abilities.',
      image: plumecaImage,
      imageName: 'plumeca',
      color: '#ec4899'
    },
    {
      id: 'frekki',
      name: 'FREKKI',
      description: 'A loyal companion with balanced stats.',
      image: frekkiImage,
      imageName: 'frekki',
      color: '#10b981'
    },
    {
      id: 'lallazo',
      name: 'LALLAZO',
      description: 'A mysterious creature with magical abilities.',
      image: lallazoImage,
      imageName: 'lallazo',
      color: '#f59e0b'
    },
    {
      id: 'gazo',
      name: 'GAZO',
      description: 'A mysterious companion with unique abilities.',
      image: gazoImage,
      imageName: 'gazo',
      color: '#ef4444'
    },
    {
      id: 'doppio',
      name: 'DOPPIO',
      description: 'A fluffy sheep with defensive capabilities.',
      image: sheepGuyImage,
      imageName: 'sheep-guy',
      color: '#6b7280'
    },
    {
      id: 'cursive',
      name: 'CURSIVE',
      description: 'A strong bull with incredible strength.',
      image: bullGuyImage,
      imageName: 'bull-guy',
      color: '#92400e'
    },
    {
      id: 'lemento',
      name: 'LEMENTO',
      description: 'A storm-powered creature with elemental magic.',
      image: stormGuyImage,
      imageName: 'storm-guy',
      color: '#3b82f6'
    },
    {
      id: 'guptrois',
      name: 'GUPTROIS',
      description: 'A trio of fish with synchronized abilities.',
      image: fishGuysImage,
      imageName: 'fish-guys',
      color: '#06b6d4'
    },
    {
      id: 'sappo',
      name: 'SAPPO',
      description: 'A mysterious creature with ancient wisdom.',
      image: sappoImage,
      imageName: 'sappo',
      color: '#7c3aed'
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
      name: 'PlumecaQueen',
      description: 'Sweet and caring. Needs a patient owner.',
      image: plumecaImage,
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
      name: 'LallazoTheGreat',
      description: 'Mysterious and independent. Prefers quiet homes.',
      image: lallazoImage,
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
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent}>
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
                  {petState.adoptedPets.some(adoptedPet => adoptedPet.name === pet.name) && (
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

      {/* Custom Create Pet Modal */}
      <Modal
        visible={showCreateModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <RNView style={styles.modalContainer}>
            {!showNamingStep ? (
              /* Stats Preview Step */
              <>
                <RNView style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>CREATE PET</Text>
                  <Pressable 
                    style={styles.modalCloseButton}
                    onPress={() => setShowCreateModal(false)}
                  >
                    <FontAwesome name="times" size={18} color="#64748b" />
                  </Pressable>
                </RNView>

                {selectedPet && generatedStats && (
                  <RNView style={styles.modalContent}>
                    {/* Pet Image */}
                    <RNView style={styles.modalPetImageContainer}>
                      <Image source={selectedPet.image} style={styles.modalPetImage} />
                    </RNView>

                    {/* Pet Info */}
                    <Text style={styles.modalPetName}>{selectedPet.name}</Text>
                    <Text style={styles.modalPetDescription}>{selectedPet.description}</Text>

                    {/* Gender */}
                    <RNView style={styles.modalInfoRow}>
                      <FontAwesome 
                        name={petGender === 'Male' ? 'mars' : 'venus'} 
                        size={16} 
                        color={petGender === 'Male' ? '#3b82f6' : '#ec4899'} 
                      />
                      <Text style={styles.modalInfoText}>{petGender}</Text>
                    </RNView>

                    {/* Personality Traits */}
                    <RNView style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>PERSONALITY</Text>
                      <RNView style={styles.traitsContainer}>
                        {petTraits.map((trait, index) => (
                          <RNView key={index} style={styles.traitBadge}>
                            <Text style={styles.traitText}>{trait}</Text>
                          </RNView>
                        ))}
                      </RNView>
                    </RNView>

                    {/* Stats */}
                    <RNView style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>STATS</Text>
                      <RNView style={styles.statsGrid}>
                        <RNView style={styles.statBox}>
                          <Text style={styles.statLabel}>DEF</Text>
                          <Text style={styles.statValue}>{generatedStats.def}</Text>
                        </RNView>
                        <RNView style={styles.statBox}>
                          <Text style={styles.statLabel}>SPD</Text>
                          <Text style={styles.statValue}>{generatedStats.spd}</Text>
                        </RNView>
                        <RNView style={styles.statBox}>
                          <Text style={styles.statLabel}>LUCK</Text>
                          <Text style={styles.statValue}>{generatedStats.luck}</Text>
                        </RNView>
                        <RNView style={styles.statBox}>
                          <Text style={styles.statLabel}>INT</Text>
                          <Text style={styles.statValue}>{generatedStats.int}</Text>
                        </RNView>
                        <RNView style={styles.statBox}>
                          <Text style={styles.statLabel}>CHARM</Text>
                          <Text style={styles.statValue}>{generatedStats.charm}</Text>
                        </RNView>
                        <RNView style={styles.statBox}>
                          <Text style={styles.statLabel}>DEX</Text>
                          <Text style={styles.statValue}>{generatedStats.dex}</Text>
                        </RNView>
                      </RNView>
                    </RNView>

                    {/* Cost */}
                    <Text style={styles.modalCostText}>
                      Cost: {petState.adoptedPets.length === 0 ? 'FREE' : '25 💎'}
                    </Text>

                    {/* Buttons */}
                    <RNView style={styles.modalButtons}>
                      <Pressable 
                        style={styles.modalCancelButton}
                        onPress={() => setShowCreateModal(false)}
                      >
                        <Text style={styles.modalCancelButtonText}>Cancel</Text>
                      </Pressable>
                      <Pressable 
                        style={styles.modalCreateButton}
                        onPress={() => setShowNamingStep(true)}
                      >
                        <Text style={styles.modalCreateButtonText}>Create</Text>
                      </Pressable>
                    </RNView>
                  </RNView>
                )}
              </>
            ) : (
              /* Naming Step */
              <>
                <RNView style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>NAME YOUR PXOPET</Text>
                  <Pressable 
                    style={styles.modalCloseButton}
                    onPress={() => {
                      setShowNamingStep(false);
                      setShowCreateModal(false);
                    }}
                  >
                    <FontAwesome name="times" size={18} color="#8b5cf6" />
                  </Pressable>
                </RNView>

                {selectedPet && (
                  <ScrollView 
                    contentContainerStyle={styles.modalContentScrollable}
                    keyboardShouldPersistTaps="handled"
                  >
                    {/* Pet Image */}
                    <Image source={selectedPet.image} style={styles.modalPetImageNaming} />

                    <Text style={styles.modalNamingPrompt}>What would you like to name your {selectedPet.name}?</Text>

                    {/* Name Input */}
                    <TextInput
                      style={styles.nameInput}
                      placeholder="Enter pet name..."
                      value={petName}
                      onChangeText={setPetName}
                      maxLength={20}
                      autoFocus={true}
                    />

                    {/* Buttons */}
                    <RNView style={styles.modalButtons}>
                      <Pressable 
                        style={styles.modalCancelButton}
                        onPress={() => setShowNamingStep(false)}
                      >
                        <Text style={styles.modalCancelButtonText}>Back</Text>
                      </Pressable>
                      <Pressable 
                        style={[styles.modalCreateButton, !petName && styles.modalButtonDisabled]}
                        onPress={handleConfirmCreate}
                        disabled={!petName}
                      >
                        <Text style={styles.modalCreateButtonText}>Adopt</Text>
                      </Pressable>
                    </RNView>
                  </ScrollView>
                )}
              </>
            )}
          </RNView>
        </KeyboardAvoidingView>
      </Modal>

      {/* Error Modal */}
      <Modal
        visible={showErrorModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowErrorModal(false)}
      >
        <RNView style={styles.errorModalOverlay}>
          <RNView style={styles.errorModalContainer}>
            <RNView style={styles.errorModalHeader}>
              <FontAwesome name="exclamation-circle" size={40} color="#ef4444" />
            </RNView>
            <Text style={styles.errorModalTitle}>{errorTitle}</Text>
            <Text style={styles.errorModalMessage}>{errorMessage}</Text>
            <Pressable 
              style={styles.errorModalButton}
              onPress={() => setShowErrorModal(false)}
            >
              <Text style={styles.errorModalButtonText}>OK</Text>
            </Pressable>
          </RNView>
        </RNView>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <RNView style={styles.successModalOverlay}>
          <RNView style={styles.successModalContainer}>
            <RNView style={styles.successModalHeader}>
              <FontAwesome name="check-circle" size={48} color="#8b5cf6" />
            </RNView>
            <Text style={styles.successModalTitle}>Welcome, {successPetName}</Text>
            <Text style={styles.successModalMessage}>Your new companion is ready to explore Pxopia with you.</Text>
            <Pressable 
              style={styles.successModalButton}
              onPress={() => {
                setShowSuccessModal(false);
                router.push('/(tabs)/pets');
              }}
            >
              <Text style={styles.successModalButtonText}>Continue</Text>
            </Pressable>
          </RNView>
        </RNView>
      </Modal>
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#f1f5f9',
    position: 'relative',
  },
  modalTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  modalCloseButton: {
    padding: 4,
    position: 'absolute',
    right: 16,
  },
  modalContent: {
    padding: 24,
    alignItems: 'center',
  },
  modalContentScrollable: {
    padding: 16,
    alignItems: 'center',
    flexGrow: 1,
  },
  modalPetImageContainer: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  modalPetImage: {
    width: 100,
    height: 100,
  },
  modalPetImageNaming: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  modalPetName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 18,
    color: '#0f172a',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalPetDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 16,
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  modalInfoText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  modalSection: {
    width: '100%',
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#8b5cf6',
    marginBottom: 12,
    textAlign: 'center',
  },
  traitsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  traitBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 1,
    borderColor: '#8b5cf6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  traitText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  statBox: {
    width: '30%',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#64748b',
    marginBottom: 4,
  },
  statValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 16,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  modalCostText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalCancelButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    fontWeight: 'bold',
  },
  modalCreateButton: {
    flex: 1,
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  modalCreateButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modalButtonDisabled: {
    opacity: 0.5,
  },
  modalNamingPrompt: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  nameInput: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#8b5cf6',
    borderRadius: 8,
    padding: 14,
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 24,
    textAlign: 'center',
  },
  // Error Modal Styles
  errorModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorModalContainer: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 28,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ef4444',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  errorModalHeader: {
    marginBottom: 16,
  },
  errorModalTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#0f172a',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorModalMessage: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  errorModalButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  errorModalButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  // Success Modal Styles
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModalContainer: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  successModalHeader: {
    marginBottom: 20,
  },
  successModalTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 15,
    color: '#0f172a',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  successModalMessage: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 28,
  },
  successModalButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 8,
    minWidth: 140,
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  successModalButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
