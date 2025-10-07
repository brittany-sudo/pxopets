import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View, Text, Animated, PanGestureHandler, TapGestureHandler } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Game constants
const LANE_COUNT = 3;
const LANE_WIDTH = screenWidth / LANE_COUNT;
const SKATER_SIZE = 40;
const GAME_SPEED = 200; // pixels per second

// Game state interface
interface GameState {
  score: number;
  combo: number;
  speed: number;
  isJumping: boolean;
  currentLane: number;
  isPaused: boolean;
  isGameOver: boolean;
}

// Object types
interface GameObject {
  id: string;
  x: number;
  y: number;
  type: 'token' | 'cone';
  lane: number;
  collected?: boolean;
}

export default function SimpleGameScreen() {
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    combo: 1,
    speed: GAME_SPEED,
    isJumping: false,
    currentLane: 1, // Start in middle lane
    isPaused: false,
    isGameOver: false,
  });

  const [objects, setObjects] = useState<GameObject[]>([]);
  const [skaterPosition, setSkaterPosition] = useState({ x: LANE_WIDTH * 1.5, y: screenHeight * 0.7 });

  // Animation values
  const skaterAnim = new Animated.ValueXY({ x: LANE_WIDTH * 1.5, y: screenHeight * 0.7 });
  const jumpAnim = new Animated.Value(0);

  // Game loop
  useEffect(() => {
    if (gameState.isPaused || gameState.isGameOver) return;

    const gameLoop = setInterval(() => {
      // Update object positions
      setObjects(prev => 
        prev.map(obj => ({
          ...obj,
          y: obj.y + (gameState.speed * 0.016), // 60fps
        })).filter(obj => obj.y < screenHeight + 100)
      );

      // Spawn new objects occasionally
      if (Math.random() < 0.02) {
        const newObject: GameObject = {
          id: Math.random().toString(36).substr(2, 9),
          x: LANE_WIDTH * Math.floor(Math.random() * LANE_COUNT) + LANE_WIDTH / 2,
          y: -50,
          type: Math.random() < 0.7 ? 'token' : 'cone',
          lane: Math.floor(Math.random() * LANE_COUNT),
        };
        setObjects(prev => [...prev, newObject]);
      }

      // Check collisions
      checkCollisions();
    }, 16); // ~60fps

    return () => clearInterval(gameLoop);
  }, [gameState.isPaused, gameState.isGameOver, gameState.speed]);

  const checkCollisions = () => {
    const skaterCenterX = skaterPosition.x;
    const skaterCenterY = skaterPosition.y;
    
    setObjects(prev => {
      return prev.map(obj => {
        if (obj.collected) return obj;

        const distance = Math.sqrt(
          Math.pow(obj.x - skaterCenterX, 2) + 
          Math.pow(obj.y - skaterCenterY, 2)
        );

        if (distance < 30) {
          if (obj.type === 'token') {
            // Collect token
            setGameState(prev => ({
              ...prev,
              score: prev.score + (10 * prev.combo),
              combo: prev.combo + 1,
            }));
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          } else if (obj.type === 'cone') {
            // Hit cone
            setGameState(prev => ({
              ...prev,
              combo: 1,
            }));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          }
          return { ...obj, collected: true };
        }
        return obj;
      });
    });
  };

  // Gesture handlers
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const laneDelta = Math.round(event.translationX / LANE_WIDTH);
      const newLane = Math.max(0, Math.min(2, gameState.currentLane + laneDelta));
      setGameState(prev => ({ ...prev, currentLane: newLane }));
      
      // Animate skater to new lane
      const targetX = LANE_WIDTH * (newLane + 0.5);
      Animated.timing(skaterAnim, {
        toValue: { x: targetX, y: skaterPosition.y },
        duration: 200,
        useNativeDriver: false,
      }).start();
      
      setSkaterPosition(prev => ({ ...prev, x: targetX }));
    });

  const tapGesture = Gesture.Tap()
    .onStart(() => {
      if (!gameState.isJumping) {
        setGameState(prev => ({ ...prev, isJumping: true }));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        // Animate jump
        Animated.sequence([
          Animated.timing(jumpAnim, {
            toValue: -80,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(jumpAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
        ]).start(() => {
          setGameState(prev => ({ ...prev, isJumping: false }));
        });
      }
    });

  const composedGesture = Gesture.Simultaneous(panGesture, tapGesture);

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composedGesture}>
        <View style={styles.gameArea}>
          {/* Background */}
          <View style={styles.background} />
          
          {/* Floor */}
          <View style={styles.floor} />
          
          {/* Lane dividers */}
          {Array.from({ length: LANE_COUNT - 1 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.laneDivider,
                { left: LANE_WIDTH * (i + 1) }
              ]}
            />
          ))}
          
          {/* Game Objects */}
          {objects.map((obj) => (
            <GameObject key={obj.id} object={obj} />
          ))}
          
          {/* Skater */}
          <Animated.View
            style={[
              styles.skater,
              {
                left: skaterAnim.x,
                top: skaterAnim.y,
                transform: [{ translateY: jumpAnim }],
              }
            ]}
          />
        </View>
      </GestureDetector>
      
      {/* HUD */}
      <View style={styles.hud}>
        <View style={styles.hudItem}>
          <Text style={styles.hudLabel}>SCORE</Text>
          <Text style={styles.hudValue}>{gameState.score}</Text>
        </View>
        <View style={styles.hudItem}>
          <Text style={styles.hudLabel}>COMBO</Text>
          <Text style={styles.hudValue}>x{gameState.combo}</Text>
        </View>
      </View>
    </View>
  );
}

// Game Object Component
function GameObject({ object }: { object: GameObject }) {
  if (object.collected) return null;

  return (
    <View
      style={[
        object.type === 'token' ? styles.token : styles.cone,
        {
          left: object.x - (object.type === 'token' ? 12 : 8),
          top: object.y - (object.type === 'token' ? 12 : 15),
        }
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1e293b',
  },
  floor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.2,
    backgroundColor: '#8b5cf6',
  },
  laneDivider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  skater: {
    position: 'absolute',
    width: SKATER_SIZE,
    height: SKATER_SIZE,
    backgroundColor: '#8b5cf6',
    borderRadius: SKATER_SIZE / 2,
    borderWidth: 2,
    borderColor: '#7c3aed',
  },
  token: {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: '#fbbf24',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  cone: {
    position: 'absolute',
    width: 16,
    height: 30,
    backgroundColor: '#ef4444',
    borderWidth: 2,
    borderColor: '#dc2626',
  },
  hud: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hudItem: {
    alignItems: 'center',
  },
  hudLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    marginBottom: 4,
  },
  hudValue: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    color: '#ffffff',
  },
});



