import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Animated, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// Constants
const DAILY_LAP_CAP = 20;
const LAPS_PER_ENDURANCE = 5;
const PET_SAVE_V1 = 'PET_SAVE_V1';

// Import images
const poolMainImage = require('@/assets/images/community-pool-main.png');
const tigerguyImage = require('@/assets/images/tigerguy.png');

// Echo messages for liminal vibe
const ECHOS = [
  "The water felt thicker than yesterday.",
  "The lane hummed like a distant filter.",
  "Someone clapped; no one was there.",
  "A word surfaced, then slipped away.",
  "The pool remembered every stroke.",
  "Time dissolved in the blue depths.",
  "The water whispered secrets of endurance.",
  "Each lap carried you further from shore.",
  "The lane held memories of every swimmer.",
  "The water never forgets your dedication."
];


interface PetStats {
  endurance: number;
  confidence: number;
  resilience: number;
  fatigue: number;
  lapsDoneToday: number;
}

export default function LapTrainerScreen() {
  const [petStats, setPetStats] = useState<PetStats>({
    endurance: 0,
    confidence: 0,
    resilience: 0,
    fatigue: 0,
    lapsDoneToday: 0
  });
  
  const [isSwimming, setIsSwimming] = useState(false);
  const [currentEcho, setCurrentEcho] = useState('');
  const [selectedLaps, setSelectedLaps] = useState(0);
  const [currentLap, setCurrentLap] = useState(0);
  
  const petAnimation = useRef(new Animated.Value(0)).current;
  const swimAnimation = useRef(new Animated.Value(0)).current;

  // Load saved data on mount
  useEffect(() => {
    loadPetData();
  }, []);

  // Check for daily reset
  useEffect(() => {
    checkDailyReset();
  }, []);


  const loadPetData = async () => {
    // For now, just use in-memory state
    // TODO: Add AsyncStorage when package is installed
    console.log('Loading pet data...');
  };

  const savePetData = async (newStats: PetStats) => {
    // For now, just update state
    // TODO: Add AsyncStorage when package is installed
    console.log('Saving pet data:', newStats);
  };

  const checkDailyReset = async () => {
    // For now, just use in-memory state
    // TODO: Add AsyncStorage when package is installed
    console.log('Checking daily reset...');
  };

  const startSwimming = (laps: number) => {
    if (isSwimming || petStats.lapsDoneToday + laps > DAILY_LAP_CAP) return;
    
    const remainingLaps = DAILY_LAP_CAP - petStats.lapsDoneToday;
    const actualLaps = Math.min(laps, remainingLaps);
    
    setIsSwimming(true);
    setSelectedLaps(actualLaps);
    setCurrentLap(0);
    setCurrentEcho('');

    // Animate pet swimming
    animatePetSwimming(actualLaps);
  };

  const animatePetSwimming = (laps: number) => {
    let lapCount = 0;
    
    const swimLap = () => {
      if (lapCount >= laps) {
        completeSwimming(laps);
        return;
      }
      
      lapCount++;
      setCurrentLap(lapCount);
      
      // Create single lap animation (left to right to left)
      const singleLap = Animated.sequence([
        Animated.timing(swimAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(swimAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]);

      singleLap.start(() => {
        // Start next lap after a brief pause
        setTimeout(swimLap, 200);
      });
    };
    
    swimLap();
  };

  const completeSwimming = (laps: number) => {
    const enduranceGain = Math.floor(laps / LAPS_PER_ENDURANCE);
    const newStats = {
      ...petStats,
      endurance: petStats.endurance + enduranceGain,
      fatigue: petStats.fatigue + laps,
      lapsDoneToday: petStats.lapsDoneToday + laps
    };
    
    setPetStats(newStats);
    savePetData(newStats);
    setIsSwimming(false);
    setSelectedLaps(0);
    setCurrentLap(0);
    
    // Show random echo
    const randomEcho = ECHOS[Math.floor(Math.random() * ECHOS.length)];
    setCurrentEcho(randomEcho);
  };


  const translateX = swimAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [20, width - 80],
  });

  const remainingLaps = DAILY_LAP_CAP - petStats.lapsDoneToday;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button - Fixed Position */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/community-pool')}
        >
          <FontAwesome name="arrow-left" size={12} color="#8b5cf6" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>DAILY LAPS</Text>
        </RNView>

        {/* Pool Banner */}
        <RNView style={styles.bannerContainer}>
          <Image source={poolMainImage} style={styles.bannerImage} />
        </RNView>


        {/* Stats Display */}
        <RNView style={styles.statsContainer}>
          <RNView style={styles.statItem}>
            <FontAwesome name="heart" size={16} color="#ef4444" />
            <Text style={styles.statText}>Endurance: {petStats.endurance}</Text>
          </RNView>
          <RNView style={styles.statItem}>
            <FontAwesome name="tired" size={16} color="#f59e0b" />
            <Text style={styles.statText}>Fatigue: {petStats.fatigue}</Text>
          </RNView>
          <RNView style={styles.statItem}>
            <FontAwesome name="tint" size={16} color="#0ea5e9" />
            <Text style={styles.statText}>Laps Today: {petStats.lapsDoneToday}/{DAILY_LAP_CAP}</Text>
          </RNView>
        </RNView>

        {/* Pool Scene */}
        <RNView style={styles.poolScene}>
          <RNView style={styles.waterBackground}>
            <RNView style={styles.laneLine} />
            <Animated.View style={[styles.pet, { transform: [{ translateX }] }]}>
              <Image source={tigerguyImage} style={styles.petImage} />
            </Animated.View>
          </RNView>
        </RNView>

        {/* Swim Controls */}
        <RNView style={styles.controlsContainer}>
          {isSwimming ? (
            <RNView style={styles.swimmingStatus}>
              <Text style={styles.swimmingText}>
                Swimming... {currentLap}/{selectedLaps}
              </Text>
            </RNView>
          ) : (
            <RNView style={styles.lapButtonsContainer}>
              <Pressable 
                style={[
                  styles.lapButton, 
                  remainingLaps < 3 && styles.lapButtonDisabled
                ]}
                onPress={() => startSwimming(3)}
                disabled={remainingLaps < 3}
              >
                <Text style={styles.lapButtonText}>3 LAPS</Text>
              </Pressable>
              
              <Pressable 
                style={[
                  styles.lapButton, 
                  remainingLaps < 6 && styles.lapButtonDisabled
                ]}
                onPress={() => startSwimming(6)}
                disabled={remainingLaps < 6}
              >
                <Text style={styles.lapButtonText}>6 LAPS</Text>
              </Pressable>
              
              <Pressable 
                style={[
                  styles.lapButton, 
                  remainingLaps < 10 && styles.lapButtonDisabled
                ]}
                onPress={() => startSwimming(10)}
                disabled={remainingLaps < 10}
              >
                <Text style={styles.lapButtonText}>10 LAPS</Text>
              </Pressable>
            </RNView>
          )}
        </RNView>

        {/* Echo Message */}
        {currentEcho ? (
          <RNView style={styles.echoContainer}>
            <Text style={styles.echoText}>"{currentEcho}"</Text>
          </RNView>
        ) : null}


      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff', // Standard light blue background
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 80,
    paddingBottom: 100,
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
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    marginLeft: 6,
  },
  headerRow: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    height: 40,
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  bannerContainer: {
    width: '100%',
    height: 200,
    borderWidth: 2,
    borderColor: '#14b8a6',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(20, 184, 166, 0.05)',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 6,
  },
  statsContainer: {
    width: '100%',
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(20, 184, 166, 0.3)',
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    marginLeft: 8,
  },
  poolScene: {
    width: '100%',
    height: 120,
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(20, 184, 166, 0.3)',
    marginBottom: 20,
    overflow: 'hidden',
  },
  waterBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0ea5e9', // Pool blue
    position: 'relative',
  },
  laneLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#ffffff',
    opacity: 0.7,
  },
  pet: {
    position: 'absolute',
    top: 20,
    width: 40,
    height: 40,
  },
  petImage: {
    width: 40,
    height: 40,
  },
  controlsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  lapButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  lapButton: {
    backgroundColor: '#14b8a6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#0d9488',
    minWidth: 80,
  },
  lapButtonDisabled: {
    backgroundColor: '#64748b',
    borderColor: '#475569',
  },
  lapButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#ffffff',
    textAlign: 'center',
  },
  swimmingStatus: {
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(20, 184, 166, 0.3)',
    padding: 12,
    alignItems: 'center',
  },
  swimmingText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#0f172a',
    textAlign: 'center',
  },
  echoContainer: {
    width: '100%',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    padding: 16,
    marginBottom: 20,
  },
  echoText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#a78bfa',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
  },
});
