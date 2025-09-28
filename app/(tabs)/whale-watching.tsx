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
  const [whalePopups, setWhalePopups] = useState<Array<{id: string, type: 'tail' | 'fin', x: number, y: number, visible: boolean}>>([]);
  const [popupCount, setPopupCount] = useState(0);
  const [stamina, setStamina] = useState(100);

  // Generate random weather
  useEffect(() => {
    const weathers: WeatherType[] = ['calm', 'foggy', 'stormy', 'icy'];
    setCurrentWeather(weathers[Math.floor(Math.random() * weathers.length)]);
  }, []);

  const startWatching = () => {
    if (outingsLeft <= 0 || gameActive) return;
    
    setGameActive(true);
    setShowResult(false);
    
    // Start whale popup spawning
    startWhalePopups();
    
    // End game after 30 seconds
    setTimeout(() => {
      setGameActive(false);
      setWhalePopups([]);
      setOutingsLeft(prev => prev - 1); // Decrement outings when game ends
    }, 30000);
  };

  const startWhalePopups = () => {
    // Reset popup count for this session
    setPopupCount(0);
    
    // Spawn first popup after 5 seconds
    setTimeout(() => {
      spawnWhalePopup();
    }, 5000);
    
    // Spawn second popup after 15 seconds
    setTimeout(() => {
      spawnWhalePopup();
    }, 15000);
    
    // Spawn third popup after 25 seconds
    setTimeout(() => {
      spawnWhalePopup();
    }, 25000);
  };

  const spawnWhalePopup = () => {
    const type = Math.random() < 0.5 ? 'tail' : 'fin';
    
    // Avoid spawning behind the lighthouse (bottom left area)
    // Lighthouse is positioned at bottom left, so avoid x < 100 and y > 60
    let x, y;
    let attempts = 0;
    do {
      x = Math.random() * 300 + 50; // Random x position
      y = Math.random() * 100 + 50; // Random y position
      attempts++;
    } while ((x < 100 && y > 60) && attempts < 10); // Avoid lighthouse area
    
    const id = `whale-${Date.now()}-${Math.random()}`;
    
    const newPopup = {
      id,
      type,
      x,
      y,
      visible: true
    };
    
    setWhalePopups(prev => [...prev, newPopup]);
    setPopupCount(prev => prev + 1);
    
    // Hide popup after 8 seconds if not clicked
    setTimeout(() => {
      setWhalePopups(prev => prev.filter(popup => popup.id !== id));
    }, 8000);
  };

  const handleWhaleClick = (popupId: string) => {
    const popup = whalePopups.find(p => p.id === popupId);
    if (!popup) return;
    
    // New ocean items with proper odds and stamina system
    const random = Math.random();
    let itemType = '';
    let displayName = '';
    let reward = 0;
    let staminaGain = 0;
    
    if (random < 0.0001) {
      // 0.01% chance - Legendary Find
      itemType = 'pearl_deep';
      displayName = '🐚 Pearl of the Deep';
      reward = 1000;
      staminaGain = 0;
    } else if (random < 0.001) {
      // 0.09% chance - Rare Items
      const rareItems = ['mermaid_comb', 'shipwreck_sextant'];
      const rareType = rareItems[Math.floor(Math.random() * rareItems.length)];
      switch(rareType) {
        case 'mermaid_comb':
          itemType = 'mermaid_comb';
          displayName = '⚓ Mermaid\'s Comb';
          reward = 500;
          staminaGain = 0;
          break;
        case 'shipwreck_sextant':
          itemType = 'shipwreck_sextant';
          displayName = '⚓ Shipwreck Sextant';
          reward = 400;
          staminaGain = 0;
          break;
      }
    } else if (random < 0.01) {
      // 0.9% chance - Interesting Finds
      const interestingItems = ['message_bottle', 'sea_glass', 'barnacle_locket'];
      const interestingType = interestingItems[Math.floor(Math.random() * interestingItems.length)];
      switch(interestingType) {
        case 'message_bottle':
          itemType = 'message_bottle';
          displayName = '🌊 Message in a Bottle';
          reward = 100;
          staminaGain = 0;
          break;
        case 'sea_glass':
          itemType = 'sea_glass';
          displayName = '🌊 Sea Glass';
          reward = 80;
          staminaGain = 0;
          break;
        case 'barnacle_locket':
          itemType = 'barnacle_locket';
          displayName = '🌊 Barnacle-Encrusted Locket';
          reward = 90;
          staminaGain = 0;
          break;
      }
    } else if (random < 0.75) {
      // 75% chance - Sharks & Whales (Grant Stamina) - MAJOR INCREASE
      const marineLife = ['harbor_porpoise', 'minke_whale', 'humpback_whale', 'blue_whale', 'orca', 'fin_whale', 'beluga_whale', 'basking_shark', 'great_white_shark', 'greenland_shark'];
      const marineType = marineLife[Math.floor(Math.random() * marineLife.length)];
      switch(marineType) {
        case 'harbor_porpoise':
          itemType = 'harbor_porpoise';
          displayName = '🦈 Harbor Porpoise';
          reward = 50;
          staminaGain = 10;
          break;
        case 'minke_whale':
          itemType = 'minke_whale';
          displayName = '🐋 Minke Whale';
          reward = 60;
          staminaGain = 15;
          break;
        case 'humpback_whale':
          itemType = 'humpback_whale';
          displayName = '🐋 Humpback Whale';
          reward = 80;
          staminaGain = 20;
          break;
        case 'blue_whale':
          itemType = 'blue_whale';
          displayName = '🐋 Blue Whale';
          reward = 100;
          staminaGain = 25;
          break;
        case 'orca':
          itemType = 'orca';
          displayName = '🐋 Orca (Killer Whale)';
          reward = 85;
          staminaGain = 20;
          break;
        case 'fin_whale':
          itemType = 'fin_whale';
          displayName = '🐋 Fin Whale';
          reward = 90;
          staminaGain = 20;
          break;
        case 'beluga_whale':
          itemType = 'beluga_whale';
          displayName = '🐋 Beluga Whale';
          reward = 70;
          staminaGain = 15;
          break;
        case 'basking_shark':
          itemType = 'basking_shark';
          displayName = '🦈 Basking Shark';
          reward = 65;
          staminaGain = 15;
          break;
        case 'great_white_shark':
          itemType = 'great_white_shark';
          displayName = '🦈 Great White Shark';
          reward = 95;
          staminaGain = 20;
          break;
        case 'greenland_shark':
          itemType = 'greenland_shark';
          displayName = '🦈 Greenland Shark';
          reward = 120;
          staminaGain = 25;
          break;
      }
    } else if (random < 0.85) {
      // 10% chance - Garbage (REDUCED from 20%)
      const garbage = ['plastic_bottle', 'fishing_line', 'soda_can', 'flip_flop', 'fast_food_wrapper'];
      const garbageType = garbage[Math.floor(Math.random() * garbage.length)];
      switch(garbageType) {
        case 'plastic_bottle':
          itemType = 'plastic_bottle';
          displayName = '🗑️ Plastic Bottle';
          reward = 5;
          staminaGain = 0;
          break;
        case 'fishing_line':
          itemType = 'fishing_line';
          displayName = '🗑️ Tangled Fishing Line';
          reward = 8;
          staminaGain = 0;
          break;
        case 'soda_can':
          itemType = 'soda_can';
          displayName = '🗑️ Rusty Soda Can';
          reward = 6;
          staminaGain = 0;
          break;
        case 'flip_flop':
          itemType = 'flip_flop';
          displayName = '🗑️ Lost Flip-Flop';
          reward = 4;
          staminaGain = 0;
          break;
        case 'fast_food_wrapper':
          itemType = 'fast_food_wrapper';
          displayName = '🗑️ Soggy Fast Food Wrapper';
          reward = 3;
          staminaGain = 0;
          break;
      }
    } else {
      // 15% chance - Nothing interesting (REDUCED from 65%)
      itemType = 'nothing';
      displayName = 'Nothing of interest';
      reward = 1;
      staminaGain = 0;
    }
    
    const sighting: Sighting = {
      id: `sighting-${Date.now()}`,
      type: itemType as any,
      reward,
      weather: currentWeather,
      timestamp: new Date()
    };
    
    setSightings(prev => [...prev, sighting]);
    setTotalReward(prev => prev + reward);
    setStamina(prev => Math.min(100, prev + staminaGain)); // Cap stamina at 100
    
    // Remove the clicked popup
    setWhalePopups(prev => prev.filter(p => p.id !== popupId));
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
    setWhalePopups([]);
    setPopupCount(0);
    setStamina(100);
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

  // Generate animated scrolling row of waves
  const generateScrollingWaves = () => {
    const scrollAnimation = useRef(new Animated.Value(0)).current;
    const bobbingAnimation = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
      const startScroll = () => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(scrollAnimation, {
              toValue: 1,
              duration: 18000, // 18 seconds to scroll right (slightly faster)
              useNativeDriver: true,
            }),
            Animated.timing(scrollAnimation, {
              toValue: 0,
              duration: 18000, // 18 seconds to scroll back left (slightly faster)
              useNativeDriver: true,
            }),
          ]),
          { iterations: -1 }
        ).start();
      };
      
      const startBobbing = () => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(bobbingAnimation, {
              toValue: 1,
              duration: 3000, // 3 seconds to bob up
              useNativeDriver: true,
            }),
            Animated.timing(bobbingAnimation, {
              toValue: 0,
              duration: 3000, // 3 seconds to bob down
              useNativeDriver: true,
            }),
          ]),
          { iterations: -1 }
        ).start();
      };
      
      startScroll();
      startBobbing();
    }, []);

    const translateX = scrollAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [-200, 200], // Much shorter range so edges never show
    });

    const translateY = bobbingAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -8], // Gentle bobbing up and down
    });

    const waves = [];
    const tileSize = 100;
    const numWaves = 8; // Fewer waves for safer positioning
    
    for (let i = 0; i < numWaves; i++) {
      waves.push(
        <Animated.Image 
          key={`scroll-wave-${i}`}
          source={require('@/assets/images/thewave.png')} 
          style={[
            styles.scrollingWaveImage,
            {
              left: i * tileSize - 100, // Start position well within safe zone
              transform: [{ translateX }, { translateY }],
            }
          ]}
          resizeMode="contain"
        />
      );
    }
    
    return waves;
  };

  // Generate animated scrolling row of waves in opposite direction
  const generateScrollingWavesReverse = () => {
    const scrollAnimation = useRef(new Animated.Value(0)).current;
    const bobbingAnimation = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
      const startScroll = () => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(scrollAnimation, {
              toValue: 1,
              duration: 18000, // 18 seconds to scroll left (slightly faster)
              useNativeDriver: true,
            }),
            Animated.timing(scrollAnimation, {
              toValue: 0,
              duration: 18000, // 18 seconds to scroll back right (slightly faster)
              useNativeDriver: true,
            }),
          ]),
          { iterations: -1 }
        ).start();
      };
      
      const startBobbing = () => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(bobbingAnimation, {
              toValue: 1,
              duration: 3000, // 3 seconds to bob up
              useNativeDriver: true,
            }),
            Animated.timing(bobbingAnimation, {
              toValue: 0,
              duration: 3000, // 3 seconds to bob down
              useNativeDriver: true,
            }),
          ]),
          { iterations: -1 }
        ).start();
      };
      
      startScroll();
      startBobbing();
    }, []);

    const translateX = scrollAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [200, -200], // Opposite direction: right to left
    });

    const translateY = bobbingAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -8], // Gentle bobbing up and down
    });

    const waves = [];
    const tileSize = 100;
    const numWaves = 8; // Same number of waves
    
    for (let i = 0; i < numWaves; i++) {
      waves.push(
        <Animated.Image 
          key={`scroll-wave-reverse-${i}`}
          source={require('@/assets/images/thewave.png')} 
          style={[
            styles.scrollingWaveImage,
            {
              left: i * tileSize - 100, // Start position well within safe zone
              transform: [{ translateX }, { translateY }],
            }
          ]}
          resizeMode="contain"
        />
      );
    }
    
    return waves;
  };

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button - Fixed Position */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/foggy-harbor')}
        >
          <FontAwesome name="arrow-left" size={14} color="#0ea5e9" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>HARBOR WATCH</Text>
        </RNView>

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
            <Text style={styles.statLabel}>Tickets</Text>
            <RNView style={styles.ticketValueContainer}>
              <Text style={styles.statValue}>3</Text>
              <FontAwesome name="ticket" size={12} color="#8b5cf6" />
            </RNView>
          </RNView>
          <RNView style={styles.statItem}>
            <Text style={styles.statLabel}>Weather</Text>
            <Text style={styles.statValue}>{WEATHER_EFFECTS[currentWeather].name}</Text>
          </RNView>
        </RNView>


        {/* Top Row - Button and Instructions */}
        <RNView style={styles.topRow}>
          {/* Scan the Horizon Button */}
          <Pressable
            style={[styles.watchButton, (outingsLeft <= 0 || gameActive) && styles.disabledButton]}
            onPress={startWatching}
            disabled={outingsLeft <= 0 || gameActive}
          >
            <Text style={styles.watchButtonText}>
              {gameActive ? 'Sailing...' : outingsLeft > 0 ? 'Scan the Horizon' : 'No Outings Left'}
            </Text>
          </Pressable>
          
          {/* Game Instructions */}
          <RNView style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>Pay 3 tickets for 3 outings - watch for sea creatures and treasures popping up from the waves!</Text>
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
            {/* Scrolling Wave Row */}
            <RNView style={styles.scrollingWaveContainer}>
              {generateScrollingWaves()}
            </RNView>
            {/* Second Scrolling Wave Row */}
            <RNView style={styles.scrollingWaveContainer2}>
              {generateScrollingWaves()}
            </RNView>
            {/* Third Scrolling Wave Row - Opposite Direction */}
            <RNView style={styles.scrollingWaveContainer3}>
              {generateScrollingWavesReverse()}
            </RNView>
            {/* Fourth Scrolling Wave Row - Original Direction */}
            <RNView style={styles.scrollingWaveContainer4}>
              {generateScrollingWaves()}
            </RNView>
            {/* Fifth Scrolling Wave Row - Opposite Direction */}
            <RNView style={styles.scrollingWaveContainer5}>
              {generateScrollingWavesReverse()}
            </RNView>
            {/* Sixth Scrolling Wave Row - Original Direction */}
            <RNView style={styles.scrollingWaveContainer6}>
              {generateScrollingWaves()}
            </RNView>
            {/* Seventh Scrolling Wave Row - Opposite Direction */}
            <RNView style={styles.scrollingWaveContainer7}>
              {generateScrollingWavesReverse()}
            </RNView>
            {/* Eighth Scrolling Wave Row - Original Direction */}
            <RNView style={styles.scrollingWaveContainer8}>
              {generateScrollingWaves()}
            </RNView>
            {/* Ninth Scrolling Wave Row - Opposite Direction */}
            <RNView style={styles.scrollingWaveContainer9}>
              {generateScrollingWavesReverse()}
            </RNView>
            {/* Tenth Scrolling Wave Row - Original Direction */}
            <RNView style={styles.scrollingWaveContainer10}>
              {generateScrollingWaves()}
            </RNView>
            
            {/* Whale Popups */}
            {/* Harbor Lighthouse */}
            <Image 
              source={require('@/assets/images/harbor-lighthouse.png')} 
              style={styles.harborLighthouse}
              resizeMode="contain"
            />
            
            {whalePopups.map((popup) => (
              <Pressable
                key={popup.id}
                onPress={() => handleWhaleClick(popup.id)}
                style={[
                  styles.whalePopup,
                  {
                    left: popup.x,
                    top: popup.y,
                  }
                ]}
              >
                <Image
                  source={popup.type === 'tail' ? require('@/assets/images/thetail.png') : require('@/assets/images/thefin.png')}
                  style={styles.whalePopupImage}
                  resizeMode="contain"
                />
              </Pressable>
            ))}
          </RNView>
        </RNView>

        {/* Captain's Log */}
        <RNView style={styles.captainsLog}>
          <RNView style={styles.logHeader}>
            <Text style={styles.logTitle}>CAPTAIN'S LOG</Text>
            <RNView style={styles.logHeaderRight}>
              <Text style={styles.staminaText}>⚡ {stamina}/100</Text>
              <Image 
                source={require('@/assets/images/captains-lighthouse.png')} 
                style={styles.lighthouseImage}
                resizeMode="contain"
              />
            </RNView>
          </RNView>
          {sightings.length > 0 ? (
            sightings.slice(-5).reverse().map((sighting) => (
              <RNView key={sighting.id} style={styles.logEntry}>
                <RNView style={styles.logDetails}>
                  <Text style={styles.logName}>
                    {sighting.type === 'pearl_deep' ? '🐚 Pearl of the Deep' :
                     sighting.type === 'mermaid_comb' ? '⚓ Mermaid\'s Comb' :
                     sighting.type === 'shipwreck_sextant' ? '⚓ Shipwreck Sextant' :
                     sighting.type === 'message_bottle' ? '🌊 Message in a Bottle' :
                     sighting.type === 'sea_glass' ? '🌊 Sea Glass' :
                     sighting.type === 'barnacle_locket' ? '🌊 Barnacle-Encrusted Locket' :
                     sighting.type === 'harbor_porpoise' ? '🦈 Harbor Porpoise' :
                     sighting.type === 'minke_whale' ? '🐋 Minke Whale' :
                     sighting.type === 'humpback_whale' ? '🐋 Humpback Whale' :
                     sighting.type === 'blue_whale' ? '🐋 Blue Whale' :
                     sighting.type === 'orca' ? '🐋 Orca (Killer Whale)' :
                     sighting.type === 'fin_whale' ? '🐋 Fin Whale' :
                     sighting.type === 'beluga_whale' ? '🐋 Beluga Whale' :
                     sighting.type === 'basking_shark' ? '🦈 Basking Shark' :
                     sighting.type === 'great_white_shark' ? '🦈 Great White Shark' :
                     sighting.type === 'greenland_shark' ? '🦈 Greenland Shark' :
                     sighting.type === 'plastic_bottle' ? '🗑️ Plastic Bottle' :
                     sighting.type === 'fishing_line' ? '🗑️ Tangled Fishing Line' :
                     sighting.type === 'soda_can' ? '🗑️ Rusty Soda Can' :
                     sighting.type === 'flip_flop' ? '🗑️ Lost Flip-Flop' :
                     sighting.type === 'fast_food_wrapper' ? '🗑️ Soggy Fast Food Wrapper' :
                     sighting.type === 'nothing' ? 'Nothing of interest' :
                     WHALE_TYPES[sighting.type]?.name || 'Unknown Item'}
                  </Text>
                  <Text style={styles.logTime}>
                    {sighting.timestamp.toLocaleTimeString()} - {WEATHER_EFFECTS[sighting.weather].name}
                  </Text>
                </RNView>
                <RNView style={styles.logRewardContainer}>
                  <FontAwesome name="bolt" size={12} color="#fbbf24" />
                  <Text style={styles.logReward}>+{sighting.reward}</Text>
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
    backgroundColor: 'transparent',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0, // No padding at the top
    paddingHorizontal: 20,
    paddingBottom: 100,
    backgroundColor: 'transparent',
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
    height: 40,
  },
  backButton: {
    position: 'absolute',
    top: 20, // Higher up, below the status bar
    left: 20,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
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
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  ticketValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
    flex: 1,
    padding: 12,
  },
  instructionsText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
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
  scrollingWaveContainer: {
    position: 'absolute',
    top: 68, // Moved up 30px from 98 to 68
    left: 0,
    width: '100%',
    height: 100,
    backgroundColor: 'transparent', // Make sure it's transparent
    zIndex: 2, // Above the tiled background
    overflow: 'hidden', // Hide any overflow
  },
  scrollingWaveContainer2: {
    position: 'absolute',
    top: 88, // Moved up 30px from 118 to 88
    left: 0,
    width: '100%',
    height: 100,
    backgroundColor: 'transparent', // Make sure it's transparent
    zIndex: 2, // Above the tiled background
    overflow: 'hidden', // Hide any overflow
  },
  scrollingWaveContainer3: {
    position: 'absolute',
    top: 43, // Moved up 30px from 73 to 43
    left: 0,
    width: '100%',
    height: 100,
    backgroundColor: 'transparent', // Make sure it's transparent
    zIndex: 2, // Above the tiled background
    overflow: 'hidden', // Hide any overflow
  },
  scrollingWaveContainer4: {
    position: 'absolute',
    top: 18, // Moved up 30px from 48 to 18
    left: 0,
    width: '100%',
    height: 100,
    backgroundColor: 'transparent', // Make sure it's transparent
    zIndex: 2, // Above the tiled background
    overflow: 'hidden', // Hide any overflow
  },
  scrollingWaveContainer5: {
    position: 'absolute',
    top: -2, // Moved up 30px from 28 to -2
    left: 0,
    width: '100%',
    height: 100,
    backgroundColor: 'transparent', // Make sure it's transparent
    zIndex: 2, // Above the tiled background
    overflow: 'hidden', // Hide any overflow
  },
  scrollingWaveContainer6: {
    position: 'absolute',
    top: -27, // Moved up 30px from 3 to -27
    left: 0,
    width: '100%',
    height: 100,
    backgroundColor: 'transparent', // Make sure it's transparent
    zIndex: 2, // Above the tiled background
    overflow: 'hidden', // Hide any overflow
  },
  scrollingWaveContainer7: {
    position: 'absolute',
    top: -7, // Moved up 30px from 23 to -7
    left: 0,
    width: '100%',
    height: 100,
    backgroundColor: 'transparent', // Make sure it's transparent
    zIndex: 2, // Above the tiled background
    overflow: 'hidden', // Hide any overflow
  },
  scrollingWaveContainer8: {
    position: 'absolute',
    top: 108, // 20px below the bottom wave (88 + 20)
    left: 0,
    width: '100%',
    height: 100,
    backgroundColor: 'transparent', // Make sure it's transparent
    zIndex: 2, // Above the tiled background
    overflow: 'hidden', // Hide any overflow
  },
  scrollingWaveContainer9: {
    position: 'absolute',
    top: 120, // 12px below the eighth wave (108 + 12)
    left: 0,
    width: '100%',
    height: 100,
    backgroundColor: 'transparent', // Make sure it's transparent
    zIndex: 2, // Above the tiled background
    overflow: 'hidden', // Hide any overflow
  },
  scrollingWaveContainer10: {
    position: 'absolute',
    top: 129, // 9px below the ninth wave (120 + 9)
    left: 0,
    width: '100%',
    height: 100,
    backgroundColor: 'transparent', // Make sure it's transparent
    zIndex: 2, // Above the tiled background
    overflow: 'hidden', // Hide any overflow
  },
  scrollingWaveImage: {
    position: 'absolute',
    width: 100,
    height: 100,
    opacity: 0.8, // Slightly transparent
  },
  whalePopup: {
    position: 'absolute',
    width: 60,
    height: 60,
    zIndex: 10, // Above all waves
    justifyContent: 'center',
    alignItems: 'center',
  },
  whalePopupImage: {
    width: 60,
    height: 60,
    opacity: 0.9,
  },
  captainsLog: {
    width: '100%', // Fixed width instead of flex: 1
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
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  staminaText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#fbbf24',
    fontWeight: 'bold',
  },
  lighthouseImage: {
    width: 40,
    height: 40,
  },
  harborLighthouse: {
    position: 'absolute',
    bottom: -10, // Slightly off the edge at bottom
    left: 20, // Moved to the right
    width: 80,
    height: 120,
    zIndex: 5, // Above waves but below popups
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