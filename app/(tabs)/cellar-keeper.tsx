import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Alert, Animated } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, useFocusEffect } from 'expo-router';
import { CellarScene } from '@/components/CellarScene';

// Import images
const cellarKeeperImage = require('@/assets/images/cellarkeeper.png');

// Game types
type CellState = 'hidden' | 'sniffed' | 'opened';
type Cell = {
  isSpoiled: boolean;
  state: CellState;
  adjCount: number;
};

type GameState = {
  grid: Cell[][];
  points: number;
  streak: number;
  multiplier: number;
  isGameOver: boolean;
  banked: number;
  boardSize: number;
};

export default function CellarKeeperScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [gameState, setGameState] = useState<GameState>({
    grid: [],
    points: 0,
    streak: 0,
    multiplier: 1.0,
    isGameOver: false,
    banked: 0,
    boardSize: 5
  });
  const [lastClue, setLastClue] = useState<string>('');
  const [candleAnimation] = useState(new Animated.Value(1));
  const [lastOpenedSpoiled, setLastOpenedSpoiled] = useState<{row: number, col: number} | null>(null);
  const [lastOpenedGood, setLastOpenedGood] = useState<{row: number, col: number, foundDustyBottle: boolean} | null>(null);
  const [sparkleFade, setSparkleFade] = useState<number>(1);

  // Reset scroll position when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const grid = generateGrid(5, 5);
    setGameState({
      grid,
      points: 0,
      streak: 0,
      multiplier: 1.0,
      isGameOver: false,
      banked: 0,
      boardSize: 5
    });
  };

  const generateGrid = (rows: number, cols: number): Cell[][] => {
    const grid: Cell[][] = [];
    const spoiledDensity = 0.18; // 18% spoiled barrels
    
    // Initialize grid
    for (let r = 0; r < rows; r++) {
      grid[r] = [];
      for (let c = 0; c < cols; c++) {
        grid[r][c] = {
          isSpoiled: Math.random() < spoiledDensity,
          state: 'hidden',
          adjCount: 0
        };
      }
    }

    // Calculate adjacent spoiled counts
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
              if (grid[nr][nc].isSpoiled) count++;
            }
          }
        }
        grid[r][c].adjCount = count;
      }
    }

    // Debug: Log the entire grid
    console.log('=== GRID GENERATION DEBUG ===');
    for (let r = 0; r < rows; r++) {
      let rowStr = '';
      for (let c = 0; c < cols; c++) {
        const cell = grid[r][c];
        rowStr += `[${cell.isSpoiled ? 'S' : 'G'}${cell.adjCount}] `;
      }
      console.log(`Row ${r}: ${rowStr}`);
    }
    console.log('S = Spoiled, G = Good, number = adjacent spoiled count');
    console.log('=== END GRID DEBUG ===');

    return grid;
  };

  const getClueText = (adjCount: number): string => {
    const clues = {
      0: [
        "The barrel boys say: 'This one's clean as a whistle!'",
        "Barrel boys report: 'Nothing but pure vintage here!'",
        "The twins whisper: 'This barrel's golden, boss!'",
        "Barrel boys nod: 'Safe as houses, this one!'"
      ],
      1: [
        "Barrel boys sniff: 'Something's fishy nearby...'",
        "The twins mutter: 'We smell trouble brewing...'",
        "Barrel boys warn: 'Keep your nose sharp around here!'",
        "The twins say: 'Something's not quite right...'"
      ],
      2: [
        "Barrel boys grimace: 'Definitely some bad barrels nearby!'",
        "The twins shake their heads: 'This area's got problems!'",
        "Barrel boys point: 'Multiple spoiled ones in this corner!'",
        "The twins warn: 'Watch out - this section's risky!'"
      ],
      3: [
        "Barrel boys cover their noses: 'This area reeks!'",
        "The twins gag: 'Multiple spoiled barrels nearby!'",
        "Barrel boys step back: 'This corner's a disaster zone!'",
        "The twins warn: 'Danger zone - lots of spoiled ones!'"
      ],
      4: [
        "Barrel boys run away: 'This whole area's contaminated!'",
        "The twins scream: 'So many spoiled barrels nearby!'",
        "Barrel boys panic: 'This corner's a total loss!'",
        "The twins flee: 'Nothing but rot in this section!'"
      ]
    };
    
    const clueArray = clues[adjCount as keyof typeof clues] || clues[4];
    return clueArray[Math.floor(Math.random() * clueArray.length)];
  };

  const getCandleIntensity = (adjCount: number): string => {
    if (adjCount === 0) return "steady";
    if (adjCount === 1) return "soft-flicker";
    if (adjCount === 2) return "flicker";
    if (adjCount === 3) return "hard-flicker";
    return "chaotic";
  };

  const startCandleAnimation = (intensity: string) => {
    const durations = {
      'steady': 2000,
      'soft-flicker': 1500,
      'flicker': 1000,
      'hard-flicker': 500,
      'chaotic': 200
    };
    
    const duration = durations[intensity as keyof typeof durations] || 2000;
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(candleAnimation, {
          toValue: 0.3,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(candleAnimation, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleSniff = (row: number, col: number) => {
    if (gameState.isGameOver) return;
    
    setGameState(prev => {
      const newGrid = [...prev.grid];
      if (newGrid[row][col].state === 'hidden') {
        newGrid[row][col].state = 'sniffed';
        
        // First check if this barrel itself is spoiled
        if (newGrid[row][col].isSpoiled) {
          setLastClue("The barrel boys warn: 'This barrel reeks of spoilage! Do not open!'");
          startCandleAnimation("chaotic");
        } else {
          // Only show clue for adjacent spoiled count if this barrel is safe
          const adjCount = newGrid[row][col].adjCount;
          const clueText = getClueText(adjCount);
          const intensity = getCandleIntensity(adjCount);
          setLastClue(clueText);
          startCandleAnimation(intensity);
        }
        
        return { ...prev, grid: newGrid };
      }
      return prev;
    });
  };

  const handleOpen = (row: number, col: number) => {
    if (gameState.isGameOver) return;
    
    setGameState(prev => {
      const newGrid = [...prev.grid];
      const cell = newGrid[row][col];
      
      if (cell.state === 'opened') return prev;
      
      if (cell.isSpoiled) {
        // Game over - spoiled barrel
        newGrid[row][col].state = 'opened';
        setLastClue('You opened a spoiled barrel! The stench is overwhelming!');
        setLastOpenedSpoiled({ row, col }); // Track which barrel was just opened
        return { ...prev, grid: newGrid, isGameOver: true };
      }
      
      // Safe barrel - award points
      newGrid[row][col].state = 'opened';
      let gained = 10;
      let newMultiplier = prev.multiplier;
      let foundDustyBottle = false;
      
      // 50% chance for Dusty Bottle (temporarily increased for testing)
      if (Math.random() < 0.50) {
        gained += 5;
        newMultiplier = Math.min(2.0, newMultiplier + 0.25);
        foundDustyBottle = true;
        setLastClue('You found a rare Dusty Bottle! +5 points and multiplier boost!');
      } else {
        setLastClue('Safe! You found a vintage wine. +10 points!');
      }
      
      // Track the good barrel that was just opened
      setLastOpenedGood({ row, col, foundDustyBottle });
      
      // Start the sparkle fade animation
      startSparkleFade();
      
      const newStreak = prev.streak + 1;
      const newPoints = prev.points + gained + (2 * newStreak);
      
      return {
        ...prev,
        grid: newGrid,
        points: newPoints,
        streak: newStreak,
        multiplier: newMultiplier
      };
    });
  };

  const handleCashOut = () => {
    if (gameState.isGameOver) return;
    
    const finalScore = Math.floor(gameState.points * gameState.multiplier);
    setGameState(prev => ({
      ...prev,
      banked: prev.banked + finalScore,
      isGameOver: true
    }));
  };

  const handleNewGame = () => {
    setLastClue(''); // Clear any existing clue
    setLastOpenedSpoiled(null); // Clear the last opened spoiled barrel
    setLastOpenedGood(null); // Clear the last opened good barrel
    setSparkleFade(1); // Reset sparkle fade
    initializeGame();
  };

  const clearClue = () => {
    setLastClue('');
  };

  const startSparkleFade = () => {
    setSparkleFade(1);
    
    // Create a flickering fade effect
    const fadeInterval = setInterval(() => {
      setSparkleFade(prev => {
        if (prev <= 0) {
          clearInterval(fadeInterval);
          setLastOpenedGood(null);
          return 0;
        }
        // Flicker between current value and slightly lower, then decrease
        const flicker = Math.random() > 0.5 ? prev * 0.8 : prev * 1.2;
        return Math.max(0, flicker - 0.05);
      });
    }, 100); // Update every 100ms for smooth flicker
  };


  return (
    <View style={styles.container}>
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/the-old-winery')}
        >
          <FontAwesome name="arrow-left" size={12} color="#92400e" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>


        {/* Game Description */}
        <RNView style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            Navigate the wine cellar carefully. Sniff barrels to detect spoiled wine, 
            but beware - opening a spoiled barrel ends your run. Cash out your points 
            before it's too late!
          </Text>
        </RNView>

        {/* Game HUD */}
        <RNView style={styles.hudContainer}>
          <RNView style={styles.hudRow}>
            <RNView style={styles.hudItem}>
              <Text style={styles.hudLabel}>Points</Text>
              <Text style={styles.hudValue}>{gameState.points}</Text>
            </RNView>
            <RNView style={styles.hudItem}>
              <Text style={styles.hudLabel}>Streak</Text>
              <Text style={styles.hudValue}>{gameState.streak}</Text>
            </RNView>
            <RNView style={styles.hudItem}>
              <Text style={styles.hudLabel}>Multiplier</Text>
              <Text style={styles.hudValue}>{gameState.multiplier.toFixed(2)}x</Text>
            </RNView>
          </RNView>
          <RNView style={styles.hudRow}>
            <RNView style={styles.hudItem}>
              <Text style={styles.hudLabel}>Banked</Text>
              <Text style={styles.hudValue}>{gameState.banked}</Text>
            </RNView>
          </RNView>
        </RNView>

        {/* Visual Cellar Scene */}
        <RNView style={styles.sceneContainer}>
          <RNView style={styles.sceneWrapper}>
            <CellarScene
              opened={gameState.grid.map(row => row.map(cell => cell.state === 'opened'))}
              danger={gameState.grid.map(row => row.map(cell => cell.adjCount))}
              gameState={gameState}
              lastOpenedSpoiled={lastOpenedSpoiled}
              lastOpenedGood={lastOpenedGood}
              sparkleFade={sparkleFade}
            />
            
            {/* Touch overlay for barrel interaction */}
            <RNView style={styles.touchOverlay}>
              <RNView style={styles.touchGridContainer}>
                {gameState.grid.map((row, rowIndex) => (
                  <RNView key={rowIndex} style={styles.touchRow}>
                    {row.map((cell, colIndex) => (
                      <Pressable
                        key={`${rowIndex}-${colIndex}`}
                        style={styles.touchCell}
                        onPress={() => handleOpen(rowIndex, colIndex)}
                        onLongPress={() => handleSniff(rowIndex, colIndex)}
                        delayLongPress={500}
                      />
                    ))}
                  </RNView>
                ))}
              </RNView>
            </RNView>

            {/* Clue Display - moved to top of game window */}
            <RNView style={styles.clueDisplayContainer}>
            <Text style={styles.clueDisplayText}>
              {lastClue ? lastClue : "Click or hold a barrel to start investigating..."}
            </Text>
              {lastClue && (
                <Pressable style={styles.clearClueButton} onPress={clearClue}>
                  <FontAwesome name="times" size={12} color="#f4e0aa" />
                </Pressable>
              )}
            </RNView>
          </RNView>
        </RNView>


        {/* Game Over Message */}
        {gameState.isGameOver && (
          <RNView style={styles.gameOverContainer}>
            <Text style={styles.gameOverTitle}>Game Over!</Text>
            <Text style={styles.gameOverText}>
              {gameState.grid.some(row => row.some(cell => cell.state === 'opened' && cell.isSpoiled))
                ? "You opened a spoiled barrel!"
                : `You cashed out with ${Math.floor(gameState.points * gameState.multiplier)} points!`
              }
            </Text>
          </RNView>
        )}
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
  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#92400e',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#92400e',
    marginLeft: 6,
    fontWeight: 'bold',
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
  gameImage: {
    width: '100%',
    height: 150,
    marginBottom: 16,
    alignSelf: 'center',
  },
  descriptionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#92400e',
  },
  descriptionText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    lineHeight: 18,
    textAlign: 'center',
  },
  hudContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: '100%',
    borderWidth: 2,
    borderColor: '#92400e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  hudRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  hudItem: {
    alignItems: 'center',
  },
  hudLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    marginBottom: 2,
  },
  hudValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  sceneContainer: {
    marginBottom: 20,
    width: '100%',
  },
  sceneWrapper: {
    height: 480, // A bit more room
    borderRadius: 8,
    overflow: 'visible', // Changed from 'hidden' to allow clue display to show
    backgroundColor: '#1a0f08',
    position: 'relative',
    width: '95%', // Constrain width to prevent overflow
    alignSelf: 'center', // Center the container
  },
  touchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 80, // Match the barrel startY
    paddingLeft: 40, // Move left to match barrel positioning
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  touchGridContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchRow: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  touchCell: {
    width: 60,
    height: 60,
    margin: 0,
  },
  clueDisplayContainer: {
    position: 'absolute',
    top: 10,
    left: '50%',
    transform: [{ translateX: -150 }], // Half of approximate width to center
    width: 300,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#92400e',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  candleContainer: {
    marginRight: 12,
    padding: 8,
    backgroundColor: '#92400e',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#a16207',
  },
  clueDisplayText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#f4e0aa',
    lineHeight: 16,
    flex: 1,
    fontStyle: 'italic',
  },
  clearClueButton: {
    marginLeft: 12,
    padding: 8,
    backgroundColor: '#92400e',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#a16207',
  },
  controlsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: '100%',
    borderWidth: 2,
    borderColor: '#92400e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  controlsTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  controlsText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    lineHeight: 16,
    marginBottom: 4,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cashOutButton: {
    backgroundColor: '#16a34a',
    borderWidth: 2,
    borderColor: '#15803d',
  },
  newGameButton: {
    backgroundColor: '#92400e',
    borderWidth: 2,
    borderColor: '#a16207',
  },
  actionButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  gameOverContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    borderWidth: 2,
    borderColor: '#dc2626',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  gameOverTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#dc2626',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  gameOverText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    lineHeight: 18,
    textAlign: 'center',
  },
});
