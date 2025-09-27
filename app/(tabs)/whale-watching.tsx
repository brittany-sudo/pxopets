import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Image, Animated } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { View as RNView } from '@/components/Themed';

type WeatherType = 'calm' | 'foggy' | 'stormy' | 'icy';
type SightingType = 'junk' | 'normal' | 'golden' | 'white';

interface Sighting {
  id: string;
  type: SightingType;
  timestamp: Date;
  weather: WeatherType;
}

const WHALE_TYPES = {
  junk: { name: 'Seaweed', reward: 1 },
  normal: { name: 'Gray Whale', reward: 5 },
  golden: { name: 'Golden Whale', reward: 15 },
  white: { name: 'White Whale', reward: 50 },
};

const WEATHER_EFFECTS = {
  calm: { name: 'Calm Seas', multiplier: 1.0 },
  foggy: { name: 'Foggy', multiplier: 0.8 },
  stormy: { name: 'Stormy', multiplier: 1.2 },
  icy: { name: 'Icy Winds', multiplier: 0.6 },
};

export default function WhaleWatchingScreen() {
  const [outingsLeft, setOutingsLeft] = useState(3);
  const [currentWeather, setCurrentWeather] = useState<WeatherType>('calm');
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [gameActive, setGameActive] = useState(false);
  const [currentSighting, setCurrentSighting] = useState<Sighting | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [totalReward, setTotalReward] = useState(0);

  // Generate random weather
  useEffect(() => {
    const weathers: WeatherType[] = ['calm', 'foggy', 'stormy', 'icy'];
    setCurrentWeather(weathers[Math.floor(Math.random() * weathers.length)]);
  }, []);

  const startWatching = () => {
    if (outingsLeft <= 0 || gameActive) return;
    
    setGameActive(true);
    setShowResult(false);
    
    // Simulate watching for 3 seconds
    setTimeout(() => {
      generateSighting();
      setGameActive(false);
      setOutingsLeft(prev => prev - 1);
    }, 3000);
  };

  const generateSighting = () => {
    const weatherEffect = WEATHER_EFFECTS[currentWeather].multiplier;
    const random = Math.random() * weatherEffect;
    
    let type: SightingType;
    if (random < 0.1) type = 'white';
    else if (random < 0.3) type = 'golden';
    else if (random < 0.7) type = 'normal';
    else type = 'junk';
    
    const sighting: Sighting = {
      id: Date.now().toString(),
      type,
      timestamp: new Date(),
      weather: currentWeather,
    };
    
    setCurrentSighting(sighting);
    setSightings(prev => [...prev, sighting]);
    setTotalReward(prev => prev + WHALE_TYPES[type].reward);
    setShowResult(true);
    
    // Hide result after 3 seconds
    setTimeout(() => {
      setShowResult(false);
      setCurrentSighting(null);
    }, 3000);
  };

  const resetDaily = () => {
    setOutingsLeft(3);
    setSightings([]);
    setTotalReward(0);
    setCurrentSighting(null);
    setShowResult(false);
    setGameActive(false);
  };

  // Generate tiled background pattern - BIG and COMPLETELY TOUCHING, extended to top
  const generateTiledBackground = () => {
    const tiles = [];
    const tileSize = 100; // BIG tiles like before
    const containerWidth = 400;
    const containerHeight = 200;
    const tilesPerRow = Math.ceil(containerWidth / tileSize) + 4; // More horizontal coverage
    const rows = Math.ceil(containerHeight / 10) + 20 + 8; // Many more rows + 8 extra rows for top coverage
    
    for (let row = -8; row < rows; row++) { // Start 8 rows above to fill top space
      for (let col = 0; col < tilesPerRow; col++) {
        tiles.push(
          <Image 
            key={`tile-${row}-${col}`}
            source={require('@/assets/images/thewave.png')} 
            style={[
              styles.tiledWaveImage,
              {
                position: 'absolute',
                top: row * 10, // COMPLETELY TOUCHING (10px apart = overlapping)
                left: col * tileSize, // Touching horizontally
                width: tileSize,
                height: tileSize,
              }
            ]}
            resizeMode="contain"
          />
        );
      }
    }
    return tiles;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/foggy-harbor')}
        >
          <FontAwesome name="arrow-left" size={14} color="#0ea5e9" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Title Logo */}
        <Image 
          source={require('@/assets/images/harbor-watch-logo.png')} 
          style={styles.titleLogo}
          resizeMode="contain"
        />

        {/* Game Stats */}
        <RNView style={styles.gameStats}>
          <RNView style={styles.statItem}>
            <Text style={styles.statLabel}>Outings Left</Text>
            <Text style={styles.statValue}>{outingsLeft}</Text>
          </RNView>
          <RNView style={styles.statItem}>
            <Text style={styles.statLabel}>Total Reward</Text>
            <Text style={styles.statValue}>{totalReward}</Text>
          </RNView>
          <RNView style={styles.statItem}>
            <Text style={styles.statLabel}>Weather</Text>
            <Text style={styles.statValue}>{WEATHER_EFFECTS[currentWeather].name}</Text>
          </RNView>
        </RNView>

        {/* Top Row - Button and Instructions */}
        <RNView style={styles.topRow}>
          {/* Start Whale Watching Button */}
          <Pressable
            style={[styles.watchButton, (outingsLeft <= 0 || gameActive) && styles.disabledButton]}
            onPress={startWatching}
            disabled={outingsLeft <= 0 || gameActive}
          >
            <Text style={styles.watchButtonText}>
              {gameActive ? 'Sailing...' : outingsLeft > 0 ? 'Start Whale Watching' : 'No Outings Left'}
            </Text>
          </Pressable>
          
          {/* Game Instructions */}
          <RNView style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>Watch for moving shadows in the water!</Text>
            <Text style={styles.instructionsSubtext}>Click them when you spot them!</Text>
          </RNView>
        </RNView>

        {/* Ocean View */}
        <RNView style={styles.oceanView}>
          {/* Ocean Background - With tiled wave pattern */}
          <RNView style={styles.oceanBackground}>
            {/* Tiled Background Pattern */}
            <RNView style={styles.tiledBackground}>
              {generateTiledBackground()}
            </RNView>
          </RNView>
        </RNView>

        {/* Captain's Log */}
        <RNView style={styles.captainsLog}>
          <Text style={styles.logTitle}>CAPTAIN'S LOG</Text>
          {sightings.length > 0 ? (
            sightings.slice(-5).reverse().map((sighting) => (
              <RNView key={sighting.id} style={styles.logEntry}>
                <RNView style={styles.logDetails}>
                  <Text style={styles.logName}>{WHALE_TYPES[sighting.type].name}</Text>
                  <Text style={styles.logTime}>
                    {sighting.timestamp.toLocaleTimeString()} - {WEATHER_EFFECTS[sighting.weather].name}
                  </Text>
                </RNView>
                <RNView style={styles.logRewardContainer}>
                  <FontAwesome name="bolt" size={12} color="#fbbf24" />
                  <Text style={styles.logReward}>+{WHALE_TYPES[sighting.type].reward}</Text>
                </RNView>
              </RNView>
            ))
          ) : (
            <Text style={styles.emptyLogText}>No sightings yet. Start sailing to spot some whales!</Text>
          )}
        </RNView>

        {/* Result Display */}
        {showResult && currentSighting && (
          <RNView style={styles.resultContainer}>
            <Text style={styles.resultText}>
              You spotted a {WHALE_TYPES[currentSighting.type].name}!
            </Text>
            <RNView style={styles.resultRewardContainer}>
              <FontAwesome name="bolt" size={16} color="#fbbf24" />
              <Text style={styles.resultReward}>+{WHALE_TYPES[currentSighting.type].reward}</Text>
            </RNView>
          </RNView>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff', // Back to white page background
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0, // No padding at the top
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8, // Small margin from very top
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0ea5e9',
    marginLeft: 6,
  },
  titleLogo: {
    width: 600, // 50% bigger (1.5x from 400)
    height: 180, // 50% bigger (1.5x from 120)
    alignSelf: 'center',
    marginTop: 0, // No padding/margins at the top
    marginBottom: 0, // No padding/margins
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    marginBottom: 4,
  },
  statValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 20,
  },
  watchButton: {
    borderWidth: 2,
    borderColor: '#a78bfa', // Purple border
    backgroundColor: '#f9fafb', // Light purple background
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 4,
    width: 180,
    shadowColor: '#10b981', // Teal drop shadow
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  disabledButton: {
    borderColor: '#94a3b8',
    opacity: 0.5,
  },
  watchButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a', // Dark text for contrast
    textAlign: 'center',
  },
  instructionsContainer: {
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
  },
  instructionsText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 4,
  },
  instructionsSubtext: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
  },
  oceanView: {
    width: '100%',
    marginBottom: 20,
  },
  oceanBackground: {
    width: '100%',
    height: 200,
    backgroundColor: '#4f7c8a', // Between teal and blue - perfect ocean color
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0284c7',
    position: 'relative',
    overflow: 'hidden',
  },
  tiledBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent', // Transparent background
    zIndex: 1, // Above the ocean background
  },
  tiledWaveImage: {
    width: 100, // BIG tiles like before
    height: 100,
    opacity: 0.9, // 90% opacity - very visible waves
  },
  captainsLog: {
    flex: 1,
    backgroundColor: '#f7f3e9',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d4af37',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#8b4513',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  logEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#d4af37',
  },
  logDetails: {
    flex: 1,
  },
  logName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b4513',
    fontWeight: 'bold',
  },
  logTime: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#a0522d',
    marginTop: 2,
  },
  logRewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  logReward: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#fbbf24',
    fontWeight: 'bold',
  },
  emptyLogText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#a0522d',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
  resultContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#a78bfa',
    alignItems: 'center',
  },
  resultText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#0f172a',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  resultRewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resultReward: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 16,
    color: '#fbbf24',
    fontWeight: 'bold',
  },
});