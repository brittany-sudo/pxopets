import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import {
  Canvas,
  useValue,
  Group,
  Rect,
  Circle,
  LinearGradient,
  vec,
} from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Game constants
const LANE_COUNT = 3;
const LANE_WIDTH = screenWidth / LANE_COUNT;
const SKATER_SIZE = 40;
const GAME_SPEED = 200; // pixels per second
const JUMP_HEIGHT = 80;
const JUMP_DURATION = 600; // milliseconds

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

export default function GameScreen() {
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
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Skia values for animation
  const skaterX = useValue(LANE_WIDTH * 1.5); // Center of middle lane
  const skaterY = useValue(screenHeight * 0.7);
  const skaterJumpY = useValue(0);
  const parallaxOffset = useValue(0);

  // Shared values for gestures
  const gestureLane = useSharedValue(1);
  const isJumping = useSharedValue(false);

  // Game loop using useEffect instead of Skia clock
  useEffect(() => {
    if (gameState.isPaused || gameState.isGameOver) return;

    const gameLoop = setInterval(() => {
      // Update parallax
      parallaxOffset.current = (parallaxOffset.current + 2) % (screenWidth * 2);

      // Update skater position based on lane
      const targetX = LANE_WIDTH * (gestureLane.value + 0.5);
      skaterX.current = targetX;

      // Handle jumping
      if (isJumping.value) {
        const jumpTime = Date.now() % JUMP_DURATION;
        const jumpProgress = jumpTime / JUMP_DURATION;
        skaterJumpY.current = Math.sin(jumpProgress * Math.PI) * JUMP_HEIGHT;
      } else {
        skaterJumpY.current = 0;
      }

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
  }, [gameState.isPaused, gameState.isGameOver, gameState.speed, gestureLane, isJumping]);

  const checkCollisions = () => {
    const skaterCenterX = skaterX.current;
    const skaterCenterY = skaterY.current - skaterJumpY.current;
    
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
      const newLane = Math.max(0, Math.min(2, gestureLane.value + laneDelta));
      gestureLane.value = newLane;
    });

  const tapGesture = Gesture.Tap()
    .onStart(() => {
      if (!isJumping.value) {
        isJumping.value = true;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        // Auto-stop jumping after duration
        setTimeout(() => {
          isJumping.value = false;
        }, JUMP_DURATION);
      }
    });

  const composedGesture = Gesture.Simultaneous(panGesture, tapGesture);

  // Initialize audio
  useEffect(() => {
    const initAudio = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('@/assets/audio/interstellar-small-talk.mp3'),
          { shouldPlay: true, isLooping: true, volume: 0.3 }
        );
        setSound(sound);
      } catch (error) {
        console.log('Audio initialization failed:', error);
      }
    };

    initAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composedGesture}>
        <Canvas style={styles.canvas}>
          {/* Simple background */}
          <Rect
            x={0}
            y={0}
            width={screenWidth}
            height={screenHeight}
          >
            <LinearGradient
              start={vec(0, 0)}
              end={vec(0, screenHeight)}
              colors={['#0f172a', '#1e293b']}
            />
          </Rect>
          
          {/* Floor */}
          <Rect
            x={0}
            y={screenHeight * 0.8}
            width={screenWidth}
            height={screenHeight * 0.2}
          >
            <LinearGradient
              start={vec(0, 0)}
              end={vec(0, screenHeight * 0.2)}
              colors={['#8b5cf6', '#7c3aed']}
            />
          </Rect>
          
          {/* Game Objects */}
          <Group>
            {objects.map((obj) => (
              <GameObject key={obj.id} object={obj} />
            ))}
          </Group>
          
          {/* Skater */}
          <Skater 
            x={skaterX} 
            y={skaterY} 
            jumpY={skaterJumpY}
            isJumping={isJumping.value}
          />
        </Canvas>
      </GestureDetector>
      
      {/* HUD */}
      <HUD gameState={gameState} />
    </View>
  );
}


// Game Object Component
function GameObject({ object }: { object: GameObject }) {
  if (object.collected) return null;

  return (
    <Group>
      {object.type === 'token' ? (
        <Circle
          cx={object.x}
          cy={object.y}
          r={12}
        >
          <LinearGradient
            start={vec(object.x - 12, object.y - 12)}
            end={vec(object.x + 12, object.y + 12)}
            colors={['#fbbf24', '#f59e0b']}
          />
        </Circle>
      ) : (
        <Rect
          x={object.x - 8}
          y={object.y - 15}
          width={16}
          height={30}
        >
          <LinearGradient
            start={vec(object.x - 8, object.y - 15)}
            end={vec(object.x + 8, object.y + 15)}
            colors={['#ef4444', '#dc2626']}
          />
        </Rect>
      )}
    </Group>
  );
}

// Skater Component
function Skater({ x, y, jumpY, isJumping }: { 
  x: any; 
  y: any; 
  jumpY: any; 
  isJumping: boolean;
}) {
  return (
    <Group>
      {/* Skater body */}
      <Circle
        cx={x}
        cy={y.current - jumpY.current}
        r={SKATER_SIZE / 2}
      >
        <LinearGradient
          start={vec(x.current - SKATER_SIZE/2, y.current - jumpY.current - SKATER_SIZE/2)}
          end={vec(x.current + SKATER_SIZE/2, y.current - jumpY.current + SKATER_SIZE/2)}
          colors={['#8b5cf6', '#7c3aed']}
        />
      </Circle>
      
      {/* Jump trail effect */}
      {isJumping && (
        <Circle
          cx={x}
          cy={y.current + 20}
          r={8}
          opacity={0.3}
        >
          <LinearGradient
            start={vec(x.current - 8, y.current + 12)}
            end={vec(x.current + 8, y.current + 28)}
            colors={['#8b5cf6', 'transparent']}
          />
        </Circle>
      )}
    </Group>
  );
}


// HUD Component
function HUD({ gameState }: { gameState: GameState }) {
  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  canvas: {
    flex: 1,
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
