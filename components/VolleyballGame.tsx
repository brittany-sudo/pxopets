import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, Pressable, Alert, Animated, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useGame } from '@/store/GameStore';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Constants
const MAX_MATCHES_PER_DAY = 3;
const VOLLEYS_TO_WIN = 10;
const STAMINA_COST = 5;
const STAMINA_REWARD = 3;
const BALL_RADIUS = 12;
const PET_SIZE = 40;
const COURT_WIDTH = screenWidth - 40;
const COURT_HEIGHT = 200;
const NET_X = COURT_WIDTH / 2;
const PET_X = 60;
const NPC_X = COURT_WIDTH - 60;
const GROUND_Y = COURT_HEIGHT - 20;
const ARC_HEIGHT = 80;

// Import pet image
const tigerguyImage = require('@/assets/images/tigerguy.png');

// Game state interface
interface GameState {
  matchesToday: number;
  volleysInMatch: number;
  isMatchActive: boolean;
  ballLeg: 'toPlayer' | 'toNPC' | 'idle';
  dayKey: string;
}

export default function VolleyballGame() {
  const { state, spendStamina, addBonusStamina } = useGame();
  
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    matchesToday: 0,
    volleysInMatch: 0,
    isMatchActive: false,
    ballLeg: 'idle',
    dayKey: '',
  });

  // Timeout ref for miss detection
  const missTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Animation values
  const ballX = useRef(new Animated.Value(PET_X)).current;
  const ballY = useRef(new Animated.Value(GROUND_Y - BALL_RADIUS)).current;
  const petYOffset = useRef(new Animated.Value(0)).current;
  const ballShadowOpacity = useRef(new Animated.Value(0)).current;
  const ballShadowScale = useRef(new Animated.Value(1)).current;

  // Initialize game
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setGameState(prev => ({
      ...prev,
      dayKey: today,
    }));

    // Start pet bobbing animation
    startPetBobbing();

    // Cleanup timeout on unmount
    return () => {
      if (missTimeoutRef.current) {
        clearTimeout(missTimeoutRef.current);
      }
    };
  }, []);

  // Pet bobbing animation
  const startPetBobbing = () => {
    const bobAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(petYOffset, {
          toValue: 6,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(petYOffset, {
          toValue: -6,
          duration: 1200,
          useNativeDriver: false,
        }),
      ])
    );
    bobAnimation.start();
  };

  // Animate ball arc
  const animateBallArc = (fromX: number, fromY: number, toX: number, toY: number, duration: number, targetLeg: 'toPlayer' | 'toNPC') => {
    // Reset ball position
    ballX.setValue(fromX);
    ballY.setValue(fromY);
    ballShadowOpacity.setValue(0.3);
    ballShadowScale.setValue(1);

    // Create arc animation
    const controlX = (fromX + toX) / 2;
    const controlY = Math.min(fromY, toY) - ARC_HEIGHT + (Math.random() - 0.5) * 20;
    const finalToX = toX + (Math.random() - 0.5) * 20;

    // Animate X position
    Animated.timing(ballX, {
      toValue: finalToX,
      duration,
      useNativeDriver: false,
    }).start();

    // Animate Y position with arc
    const yAnimation = Animated.timing(ballY, {
      toValue: controlY,
      duration: duration / 2,
      useNativeDriver: false,
    });

    const yAnimation2 = Animated.timing(ballY, {
      toValue: toY,
      duration: duration / 2,
      useNativeDriver: false,
    });

    // Animate shadow
    Animated.parallel([
      Animated.sequence([yAnimation, yAnimation2]),
      Animated.timing(ballShadowOpacity, {
        toValue: 0,
        duration,
        useNativeDriver: false,
      }),
      Animated.timing(ballShadowScale, {
        toValue: 0.3,
        duration,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Animation complete - update ball leg
      setGameState(prev => ({ ...prev, ballLeg: targetLeg }));
      
      if (targetLeg === 'toPlayer') {
        // Ball reached player - set up miss timeout
        if (missTimeoutRef.current) {
          clearTimeout(missTimeoutRef.current);
        }
        missTimeoutRef.current = setTimeout(() => {
          if (gameState.isMatchActive && gameState.ballLeg === 'toPlayer') {
            handleMiss();
          }
        }, 2000); // 2 seconds to return the ball
      } else if (targetLeg === 'toNPC') {
        // Ball reached NPC - start return to player after delay
        setTimeout(() => {
          setGameState(prev => ({ ...prev, ballLeg: 'toPlayer' }));
          animateBallArc(NPC_X, GROUND_Y - BALL_RADIUS, PET_X, GROUND_Y - BALL_RADIUS, 1000, 'toPlayer');
        }, 500);
      }
    });
  };

  // Start match
  const startMatch = () => {
    if (gameState.matchesToday >= MAX_MATCHES_PER_DAY) {
      Alert.alert("Daily Limit Reached", "You've played all matches today. Come back tomorrow!");
      return;
    }

    const totalStamina = state.dailyStamina + state.bonusStamina;
    if (totalStamina < STAMINA_COST) {
      Alert.alert("Not Enough Stamina", `You need ${STAMINA_COST} stamina to play a match!`);
      return;
    }

    spendStamina(STAMINA_COST);
    setGameState(prev => ({
      ...prev,
      isMatchActive: true,
      volleysInMatch: 0,
      ballLeg: 'toPlayer',
    }));

    // Start with ball coming to player
    animateBallArc(NPC_X, GROUND_Y - BALL_RADIUS, PET_X, GROUND_Y - BALL_RADIUS, 1000, 'toPlayer');
  };

  // Handle return
  const handleReturn = () => {
    if (!gameState.isMatchActive || gameState.ballLeg !== 'toPlayer') return;

    // Clear miss timeout since player is returning
    if (missTimeoutRef.current) {
      clearTimeout(missTimeoutRef.current);
      missTimeoutRef.current = null;
    }

    // Check if ball is in return window (position-based)
    const ballXValue = ballX._value;
    const returnWindowX = COURT_WIDTH * 0.3; // Left 30% of court
    
    if (ballXValue > returnWindowX) {
      // Ball not in return window - ignore tap
      return;
    }

    // Successful return!
    const newVolleys = gameState.volleysInMatch + 1;
    
    // Pet anticipation bob
    Animated.sequence([
      Animated.timing(petYOffset, {
        toValue: petYOffset._value - 10,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(petYOffset, {
        toValue: petYOffset._value + 10,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();

    if (newVolleys >= VOLLEYS_TO_WIN) {
      // Match won! Give bonus stamina (permanent)
      addBonusStamina(STAMINA_REWARD);
      const newMatches = gameState.matchesToday + 1;
      
      setGameState(prev => ({
        ...prev,
        isMatchActive: false,
        ballLeg: 'idle',
        volleysInMatch: 0,
        matchesToday: newMatches,
      }));

      // Reset ball position
      ballX.setValue(PET_X);
      ballY.setValue(GROUND_Y - BALL_RADIUS);
      ballShadowOpacity.setValue(0);

      Alert.alert("Match Won!", `+${STAMINA_REWARD} stamina! You've completed ${newMatches}/${MAX_MATCHES_PER_DAY} matches today.`);
    } else {
      // Continue match
      setGameState(prev => ({
        ...prev,
        volleysInMatch: newVolleys,
        ballLeg: 'toNPC',
      }));

      // Animate ball to NPC
      animateBallArc(PET_X, GROUND_Y - BALL_RADIUS, NPC_X, GROUND_Y - BALL_RADIUS, 1000, 'toNPC');
    }
  };

  // Handle miss
  const handleMiss = () => {
    setGameState(prev => ({
      ...prev,
      isMatchActive: false,
      ballLeg: 'idle',
      volleysInMatch: 0,
    }));

    // Animate ball falling
    Animated.timing(ballY, {
      toValue: GROUND_Y + 50,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      // Reset ball position
      ballX.setValue(PET_X);
      ballY.setValue(GROUND_Y - BALL_RADIUS);
      ballShadowOpacity.setValue(0);
    });

    Alert.alert("Miss!", "The ball got away! Try again!");
  };

  // Get button text and state
  const getButtonState = () => {
    if (!gameState.isMatchActive) {
      return {
        text: gameState.matchesToday >= MAX_MATCHES_PER_DAY ? 'DAILY LIMIT REACHED' : 'START MATCH',
        disabled: gameState.matchesToday >= MAX_MATCHES_PER_DAY,
        onPress: startMatch,
      };
    } else if (gameState.ballLeg === 'toPlayer') {
      return {
        text: 'RETURN!',
        disabled: false,
        onPress: handleReturn,
      };
    } else {
      return {
        text: 'BALL TRAVELING...',
        disabled: true,
        onPress: () => {},
      };
    }
  };

  const buttonState = getButtonState();

  return (
    <View style={styles.container}>
      {/* HUD */}
      <View style={styles.hud}>
        <Text style={styles.hudText}>Volleys: {gameState.volleysInMatch} / {VOLLEYS_TO_WIN}</Text>
        <Text style={styles.hudText}>Matches Today: {gameState.matchesToday} / {MAX_MATCHES_PER_DAY}</Text>
        <Text style={styles.hudText}>Stamina: {state.dailyStamina + state.bonusStamina} ({state.dailyStamina}+{state.bonusStamina})</Text>
      </View>

      {/* Game Canvas */}
      <View style={styles.canvasContainer}>
        <View style={styles.canvas}>
          {/* Court background */}
          <View style={styles.courtBackground} />
          
          {/* Court lines */}
          <View style={styles.courtLine} />
          
          {/* Net */}
          <View style={styles.net} />

          {/* Pet (player) */}
          <Animated.View 
            style={[
              styles.petContainer,
              {
                left: PET_X - PET_SIZE / 2,
                top: GROUND_Y - PET_SIZE + petYOffset,
              }
            ]}
          >
            <Image source={tigerguyImage} style={styles.petImage} />
          </Animated.View>

          {/* NPC (opponent) */}
          <View style={[styles.npcContainer, { left: NPC_X - PET_SIZE / 2, top: GROUND_Y - PET_SIZE }]}>
            <View style={styles.npcCircle} />
          </View>

          {/* Ball shadow */}
          <Animated.View 
            style={[
              styles.ballShadow,
              {
                left: ballX,
                top: GROUND_Y - 5,
                opacity: ballShadowOpacity,
                transform: [{ scale: ballShadowScale }],
              }
            ]}
          />

          {/* Ball */}
          <Animated.View 
            style={[
              styles.ball,
              {
                left: ballX,
                top: ballY,
              }
            ]}
          />
        </View>
      </View>

      {/* Control Button */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={[
            styles.controlButton,
            buttonState.disabled && styles.controlButtonDisabled
          ]}
          onPress={buttonState.onPress}
          disabled={buttonState.disabled}
        >
          <FontAwesome 
            name={buttonState.text === 'RETURN!' ? 'hand-rock-o' : 'play'} 
            size={20} 
            color="#ffffff" 
          />
          <Text style={styles.controlButtonText}>{buttonState.text}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  hud: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(20, 184, 166, 0.3)',
  },
  hudText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  canvasContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  canvas: {
    width: COURT_WIDTH,
    height: COURT_HEIGHT,
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#14b8a6',
    position: 'relative',
  },
  courtBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#e0f2fe',
    borderRadius: 6,
  },
  courtLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: GROUND_Y,
    height: 3,
    backgroundColor: '#14b8a6',
  },
  net: {
    position: 'absolute',
    left: NET_X - 2,
    top: GROUND_Y - 40,
    width: 4,
    height: 40,
    backgroundColor: '#ffffff',
  },
  petContainer: {
    position: 'absolute',
    width: PET_SIZE,
    height: PET_SIZE,
  },
  petImage: {
    width: PET_SIZE,
    height: PET_SIZE,
    imageRendering: 'pixelated' as any,
  },
  npcContainer: {
    position: 'absolute',
    width: PET_SIZE,
    height: PET_SIZE,
  },
  npcCircle: {
    width: PET_SIZE,
    height: PET_SIZE,
    borderRadius: PET_SIZE / 2,
    backgroundColor: '#64748b',
  },
  ballShadow: {
    position: 'absolute',
    width: BALL_RADIUS * 2,
    height: BALL_RADIUS,
    borderRadius: BALL_RADIUS,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    marginLeft: -BALL_RADIUS,
    marginTop: -BALL_RADIUS / 2,
  },
  ball: {
    position: 'absolute',
    width: BALL_RADIUS * 2,
    height: BALL_RADIUS * 2,
    borderRadius: BALL_RADIUS,
    backgroundColor: '#f59e0b',
    marginLeft: -BALL_RADIUS,
    marginTop: -BALL_RADIUS,
  },
  buttonContainer: {
    padding: 20,
    alignItems: 'center',
  },
  controlButton: {
    backgroundColor: '#14b8a6',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0d9488',
    minWidth: 200,
    justifyContent: 'center',
  },
  controlButtonDisabled: {
    backgroundColor: '#64748b',
    borderColor: '#475569',
  },
  controlButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#ffffff',
    marginLeft: 8,
  },
});