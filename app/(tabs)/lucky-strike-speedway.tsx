import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Modal, Alert, Vibration } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import the speedway image
const speedwayImage = require('@/assets/images/neon-casino.png'); // Using casino image as placeholder

// Import activity images
const cosmicBurgerImage = require('@/assets/images/cosmicburger.png');
const iceCreamSandwichImage = require('@/assets/images/icecreamsandwich.png');
const gumballsImage = require('@/assets/images/gumballs.png');
const lilAtomicDinerImage = require('@/assets/images/lil-atomic-diner.png');
const rinkPizzaImage = require('@/assets/images/rinkpizza.png');
const glowCornImage = require('@/assets/images/glowcorn.png');
const galaxySundaeImage = require('@/assets/images/galaxysundae.png');
const blueTboneImage = require('@/assets/images/blue-tbone.png');

// Image mapping
const imageMap: { [key: string]: any } = {
  'cosmicburger.png': cosmicBurgerImage,
  'icecreamsandwich.png': iceCreamSandwichImage,
  'gumballs.png': gumballsImage,
  'lil-atomic-diner.png': lilAtomicDinerImage,
  'rinkpizza.png': rinkPizzaImage,
  'glowcorn.png': glowCornImage,
  'galaxysundae.png': galaxySundaeImage,
  'blue-tbone.png': blueTboneImage,
};

export default function LuckyStrikeSpeedwayScreen() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [mechanicSaying, setMechanicSaying] = useState<string>('');
  const [showRaceModal, setShowRaceModal] = useState(false);
  const [showGarageModal, setShowGarageModal] = useState(false);
  const [playerStamina, setPlayerStamina] = useState(100);
  const [isRacing, setIsRacing] = useState(false);
  const [currentRace, setCurrentRace] = useState<string | null>(null);
  const [activePetName, setActivePetName] = useState("Pixel");
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [playerCoins, setPlayerCoins] = useState(1000);
  const [currentHovercar, setCurrentHovercar] = useState('basic');
  const [racePosition, setRacePosition] = useState(0);

  // Mechanic's Personality
  const getMechanicGreeting = () => {
    const greetings = [
      "Welcome to Lucky Strike Speedway! I'm Turbo, your hovercar mechanic. Ready to feel the need for speed?",
      "Hey there, speed demon! I'm Turbo, and I'm here to get your hovercar running at maximum velocity!",
      "Welcome to the fastest track in the galaxy! I'm Turbo, and I've got the meanest machines this side of the cosmos!",
      "Well, well, another adrenaline junkie! I'm Turbo, and I'm here to show you what real speed looks like!",
      "Welcome to Lucky Strike Speedway, where we turn hovercars into lightning bolts! I'm Turbo, your speed specialist!",
      "Hey, speedster! I'm Turbo, and I'm about to introduce you to the most intense racing experience in the universe!",
      "Welcome to my speedway kingdom! I'm Turbo, and I'm here to make your hovercar dreams come true at breakneck speeds!",
      "Well, look who's ready to race! I'm Turbo, and I've got the perfect hovercar for your need for speed!",
      "Welcome to Lucky Strike Speedway, where every turn is a thrill! I'm Turbo, your racing mechanic extraordinaire!",
      "Hey there, future champion! I'm Turbo, and I'm here to help you dominate the cosmic racing circuit!"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  const handleMechanicInteraction = () => {
    setMechanicSaying(getMechanicGreeting());
  };

  // Initialize mechanic's greeting on component mount
  React.useEffect(() => {
    setMechanicSaying(getMechanicGreeting());
  }, []);

  // Racing functionality
  const raceTypes = [
    { id: 'sprint', name: 'Cosmic Sprint', distance: '1 Lap', difficulty: 'Easy', stamina: 15, reward: 50, description: 'A quick burst around the track' },
    { id: 'endurance', name: 'Stellar Endurance', distance: '3 Laps', difficulty: 'Medium', stamina: 25, reward: 100, description: 'Test your stamina on the long haul' },
    { id: 'championship', name: 'Galaxy Championship', distance: '5 Laps', difficulty: 'Hard', stamina: 40, reward: 200, description: 'The ultimate test of speed and skill' },
    { id: 'time-trial', name: 'Time Trial', distance: '1 Lap', difficulty: 'Expert', stamina: 20, reward: 75, description: 'Race against the clock for the best time' }
  ];

  const hovercars = [
    { id: 'basic', name: 'Cosmic Cruiser', speed: 80, handling: 70, acceleration: 75, price: 0, description: 'A reliable starter hovercar' },
    { id: 'sport', name: 'Neon Lightning', speed: 95, handling: 85, acceleration: 90, price: 500, description: 'Fast and agile racing machine' },
    { id: 'pro', name: 'Stellar Storm', speed: 110, handling: 95, acceleration: 100, price: 1000, description: 'Professional-grade racing hovercar' },
    { id: 'legend', name: 'Galaxy Phantom', speed: 125, handling: 100, acceleration: 110, price: 2000, description: 'Legendary speed demon of the cosmos' }
  ];

  const startRace = (raceType: any) => {
    if (playerStamina < raceType.stamina) {
      Alert.alert("Not Enough Stamina", "You need more energy to race!");
      return;
    }

    setIsRacing(true);
    setCurrentRace(raceType.name);
    setPlayerStamina(prev => prev - raceType.stamina);
    
    // Simulate race progress
    let progress = 0;
    const raceInterval = setInterval(() => {
      progress += Math.random() * 20;
      setRacePosition(Math.min(progress, 100));
      
      if (progress >= 100) {
        clearInterval(raceInterval);
        setIsRacing(false);
        setCurrentRace(null);
        
        // Calculate race result
        const car = hovercars.find(c => c.id === currentHovercar);
        const baseSpeed = car ? car.speed : 80;
        const randomFactor = Math.random() * 40;
        const totalSpeed = baseSpeed + randomFactor;
        
        let position = '1st';
        let reward = raceType.reward;
        
        if (totalSpeed < 100) {
          position = '3rd';
          reward = Math.floor(raceType.reward * 0.5);
        } else if (totalSpeed < 120) {
          position = '2nd';
          reward = Math.floor(raceType.reward * 0.75);
        }
        
        setPlayerCoins(prev => prev + reward);
        setResultMessage(`🏁 Race Complete! 🏁\n\nYou finished ${position} place!\n\nReward: ${reward} gems\n\nRace: ${raceType.name}`);
        setShowResultModal(true);
        setRacePosition(0);
      }
    }, 200);
  };

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
      } else {
        newFavorites.add(itemId);
      }
      return newFavorites;
    });
  };

  const speedwayActivities = [
    {
      id: 'race-track',
      name: 'Hit the Track',
      description: 'Choose a race and test your speed',
      stamina: 15,
      price: 0,
      icon: 'flag-checkered'
    },
    {
      id: 'garage',
      name: 'Hovercar Garage',
      description: 'Upgrade and customize your ride',
      stamina: 10,
      price: 0,
      icon: 'wrench'
    },
    {
      id: 'chat-mechanic',
      name: 'Chat with Turbo',
      description: 'Talk to the friendly speedway mechanic',
      stamina: 5,
      price: 0,
      icon: 'user'
    }
  ];

  const speedwayRewards = [
    {
      id: 'racing-helmet',
      name: 'Racing Helmet',
      description: 'A sleek helmet that increases your racing confidence',
      price: 300,
      stamina: 0,
      icon: 'cosmicburger.png'
    },
    {
      id: 'speed-boost',
      name: 'Speed Boost',
      description: 'Temporary speed enhancement for your hovercar',
      price: 150,
      stamina: 0,
      icon: 'icecreamsandwich.png'
    },
    {
      id: 'lucky-charm',
      name: 'Lucky Racing Charm',
      description: 'A charm that brings good luck on the track',
      price: 200,
      stamina: 0,
      icon: 'glowcorn.png'
    },
    {
      id: 'trophy',
      name: 'Speedway Trophy',
      description: 'A gleaming trophy for your racing achievements',
      price: 500,
      stamina: 0,
      icon: 'galaxysundae.png'
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button - Fixed Position */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/crescent-oasis')}
        >
          <FontAwesome name="arrow-left" size={12} color="#8b5cf6" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>LUCKY STRIKE SPEEDWAY</Text>
        </RNView>

        {/* Speedway Image */}
        <Image source={speedwayImage} style={styles.speedwayImage} />

        {/* Turbo the Mechanic */}
        <RNView style={styles.attendantContainer}>
          <RNView style={styles.speechBubble}>
            <Text style={styles.characterName}>TURBO:</Text>
            <Text style={styles.speechText}>
              {mechanicSaying}
            </Text>
          </RNView>
          <Image source={require('@/assets/images/dex-guy.png')} style={styles.turboImage} />
        </RNView>

        {/* Player Stats */}
        <RNView style={styles.statsContainer}>
          <RNView style={styles.statItem}>
            <FontAwesome name="diamond" size={16} color="#8b5cf6" />
            <Text style={styles.statText}>{playerCoins} Gems</Text>
          </RNView>
          <RNView style={styles.statItem}>
            <FontAwesome name="bolt" size={16} color="#f59e0b" />
            <Text style={styles.statText}>{playerStamina} Energy</Text>
          </RNView>
          <RNView style={styles.statItem}>
            <FontAwesome name="car" size={16} color="#10b981" />
            <Text style={styles.statText}>{hovercars.find(c => c.id === currentHovercar)?.name || 'Cosmic Cruiser'}</Text>
          </RNView>
        </RNView>

        {/* Activities */}
        {speedwayActivities.map((activity) => (
          <RNView key={activity.id} style={styles.pubActivityItem}>
            <Pressable 
              style={styles.pubActivityPressable}
              onPress={() => {
                if (activity.id === 'race-track') {
                  setShowRaceModal(true);
                } else if (activity.id === 'garage') {
                  setShowGarageModal(true);
                } else if (activity.id === 'chat-mechanic') {
                  handleMechanicInteraction();
                }
              }}
            >
              <RNView style={styles.pubActivityHeader}>
                <RNView style={styles.pubActivityInfo}>
                  <FontAwesome name={activity.icon as any} size={20} color="#8b5cf6" style={styles.pubActivityImageIcon} />
                  <RNView style={styles.pubActivityText}>
                    <RNView style={styles.pubActivityTitleRow}>
                      <Text style={styles.pubActivityName}>{activity.name}</Text>
                      <RNView style={styles.activityCost}>
                        <Text style={styles.costText}>⚡ {activity.stamina}</Text>
                        {activity.price > 0 && <Text style={styles.costText}>💎 {activity.price}</Text>}
                      </RNView>
                    </RNView>
                    <Text style={styles.pubActivityDescription}>{activity.description}</Text>
                  </RNView>
                </RNView>
              </RNView>
            </Pressable>
          </RNView>
        ))}

        {/* Speedway Rewards */}
        <Text style={styles.rewardsTitle}>SPEEDWAY REWARDS</Text>
        
        <RNView style={styles.rewardsContainer}>
          {speedwayRewards.map((item) => (
            <RNView key={item.id} style={styles.rewardItem}>
              <RNView style={styles.rewardItemHeader}>
                <Image source={imageMap[item.icon]} style={styles.rewardItemIcon} />
                <RNView style={styles.rewardItemInfo}>
                  <Text style={styles.rewardItemName}>{item.name}</Text>
                  <Text style={styles.rewardItemDescription}>{item.description}</Text>
                </RNView>
              </RNView>
              <RNView style={styles.rewardItemFooter}>
                <RNView style={styles.ticketPriceContainer}>
                  <Text style={styles.rewardItemPrice}>{item.price}</Text>
                  <FontAwesome name="diamond" size={10} color="#8b5cf6" />
                </RNView>
              </RNView>
            </RNView>
          ))}
        </RNView>

        {/* Race Modal */}
        <Modal
          visible={showRaceModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowRaceModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.raceModal}>
              <View style={styles.raceHeader}>
                <Text style={styles.raceTitle}>CHOOSE YOUR RACE</Text>
                <Pressable 
                  style={styles.closeButton}
                  onPress={() => setShowRaceModal(false)}
                >
                  <FontAwesome name="times" size={20} color="#8b5cf6" />
                </Pressable>
              </View>
              
              <RNView style={styles.raceList}>
                {raceTypes.map((race) => (
                  <Pressable 
                    key={race.id} 
                    style={[
                      styles.raceItem,
                      playerStamina < race.stamina && styles.disabledRace,
                      isRacing && currentRace === race.name && styles.racingItem
                    ]}
                    onPress={() => startRace(race)}
                    disabled={playerStamina < race.stamina || isRacing}
                  >
                    <View style={styles.raceInfo}>
                      <Text style={styles.raceName}>
                        {race.name} {isRacing && currentRace === race.name && "🏁"}
                      </Text>
                      <Text style={styles.raceDistance}>{race.distance}</Text>
                      <Text style={styles.raceDescription}>{race.description}</Text>
                      {isRacing && currentRace === race.name && (
                        <Text style={styles.racingText}>🏎️ Racing... {racePosition.toFixed(0)}% 🏎️</Text>
                      )}
                    </View>
                    <View style={styles.raceCost}>
                      <FontAwesome name="bolt" size={12} color="#f59e0b" />
                      <Text style={styles.staminaCost}>{race.stamina}</Text>
                      <Text style={styles.rewardText}>+{race.reward} gems</Text>
                    </View>
                  </Pressable>
                ))}
              </RNView>
              
            </View>
          </View>
        </Modal>

        {/* Garage Modal */}
        <Modal
          visible={showGarageModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowGarageModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.garageModal}>
              <View style={styles.garageHeader}>
                <Text style={styles.garageTitle}>HOVERCAR GARAGE</Text>
                <Pressable 
                  style={styles.closeButton}
                  onPress={() => setShowGarageModal(false)}
                >
                  <FontAwesome name="times" size={20} color="#8b5cf6" />
                </Pressable>
              </View>
              
              <RNView style={styles.hovercarList}>
                {hovercars.map((car) => (
                  <Pressable 
                    key={car.id} 
                    style={[
                      styles.hovercarItem,
                      currentHovercar === car.id && styles.selectedHovercar
                    ]}
                    onPress={() => setCurrentHovercar(car.id)}
                  >
                    <View style={styles.hovercarInfo}>
                      <Text style={styles.hovercarName}>{car.name}</Text>
                      <Text style={styles.hovercarDescription}>{car.description}</Text>
                      <RNView style={styles.hovercarStats}>
                        <Text style={styles.statText}>Speed: {car.speed}</Text>
                        <Text style={styles.statText}>Handling: {car.handling}</Text>
                        <Text style={styles.statText}>Acceleration: {car.acceleration}</Text>
                      </RNView>
                    </View>
                    <View style={styles.hovercarCost}>
                      {car.price === 0 ? (
                        <Text style={styles.freeText}>FREE</Text>
                      ) : (
                        <RNView style={styles.priceContainer}>
                          <Text style={styles.priceText}>{car.price}</Text>
                          <FontAwesome name="diamond" size={12} color="#8b5cf6" />
                        </RNView>
                      )}
                    </View>
                  </Pressable>
                ))}
              </RNView>
              
            </View>
          </View>
        </Modal>

        {/* Result Modal */}
        <Modal
          visible={showResultModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.resultModal}>
              <Text style={styles.resultTitle}>🏁 Race Results 🏁</Text>
              <Text style={styles.resultMessage}>{resultMessage}</Text>
              <Pressable
                style={styles.resultButton}
                onPress={() => setShowResultModal(false)}
              >
                <Text style={styles.resultButtonText}>Continue</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 100,
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    paddingHorizontal: 4,
    height: 40,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    marginLeft: 6,
  },
  speedwayImage: {
    width: '100%',
    height: 400,
    resizeMode: 'contain',
    marginTop: -5,
    marginBottom: -5,
  },
  attendantContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: -10,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  turboImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginLeft: 2,
  },
  speechBubble: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    maxWidth: 300,
  },
  characterName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#8b5cf6',
    marginBottom: 4,
    textAlign: 'left',
  },
  speechText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    textAlign: 'left',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 20,
    paddingHorizontal: 20,
    flexWrap: 'wrap',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  statText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  pubActivityItem: {
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    padding: 12,
    marginBottom: 8,
    width: '80%',
    alignSelf: 'center',
  },
  pubActivityPressable: {
    width: '100%',
  },
  pubActivityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  pubActivityInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  pubActivityImageIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    alignSelf: 'center',
  },
  pubActivityText: {
    flex: 1,
  },
  pubActivityTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  pubActivityName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  activityCost: {
    flexDirection: 'row',
    gap: 8,
  },
  costText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  pubActivityDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    lineHeight: 12,
  },
  rewardsTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
    alignSelf: 'center',
  },
  rewardsContainer: {
    width: '85%',
    alignSelf: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    padding: 16,
  },
  rewardItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8b5cf6',
    padding: 12,
    marginBottom: 10,
    width: '100%',
  },
  rewardItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rewardItemIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },
  rewardItemInfo: {
    flex: 1,
  },
  rewardItemName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 4,
  },
  rewardItemDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#374151',
    lineHeight: 14,
  },
  rewardItemFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  ticketPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardItemPrice: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  raceModal: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    borderWidth: 3,
    borderColor: '#8b5cf6',
  },
  raceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  raceTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#8b5cf6',
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  raceList: {
    gap: 12,
  },
  raceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  disabledRace: {
    opacity: 0.5,
    backgroundColor: 'rgba(139, 92, 246, 0.02)',
  },
  racingItem: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8b5cf6',
    borderWidth: 2,
  },
  raceInfo: {
    flex: 1,
    marginRight: 10,
  },
  raceName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  raceDistance: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    marginBottom: 2,
  },
  raceDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    fontStyle: 'italic',
  },
  racingText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic'
  },
  raceCost: {
    alignItems: 'center',
    gap: 4,
  },
  staminaCost: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: 'bold',
  },
  rewardText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#10b981',
    fontWeight: 'bold',
  },
  garageModal: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    borderWidth: 3,
    borderColor: '#8b5cf6',
  },
  garageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  garageTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#8b5cf6',
    textAlign: 'center',
    flex: 1,
  },
  hovercarList: {
    gap: 12,
  },
  hovercarItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  selectedHovercar: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8b5cf6',
    borderWidth: 2,
  },
  hovercarInfo: {
    flex: 1,
    marginRight: 10,
  },
  hovercarName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  hovercarDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    marginBottom: 4,
  },
  hovercarStats: {
    flexDirection: 'row',
    gap: 8,
  },
  hovercarCost: {
    alignItems: 'center',
  },
  freeText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#10b981',
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  resultModal: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    borderWidth: 3,
    borderColor: '#8b5cf6',
    alignItems: 'center',
  },
  resultTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 16,
  },
  resultMessage: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#1e293b',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  resultButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  resultButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#ffffff',
  },
});






