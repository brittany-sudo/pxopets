import React, { useState, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Alert, PanResponder, Dimensions } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, useLocalSearchParams } from 'expo-router';
import BorderedBox from '@/components/BorderedBox';
import { useGame } from '@/store/GameStore';

// Import game-related images
const starlightGlideImage = require('@/assets/images/starlight-rink-main.png');
const gamepadImage = require('@/assets/images/lil-computer90.png');
const skateBgImage = require('@/assets/images/skate-bg.png');
const rollerRinkFloorImage = require('@/assets/images/rollerrinkfloor.png');
const skateConeImage = require('@/assets/images/skate-cone.png');
const coinImage = require('@/assets/images/coin.png');

// ----- Game Constants (Optimized for Snappy Performance)
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const WORLD_W = SCREEN_W - 40;         // canvas width (40px narrower)
const WORLD_H = 350;                   // slightly longer game window
const LANES = 3;
const LANE_W = WORLD_W / LANES;
const GROUND_Y = WORLD_H - 20;         // floor line for skater feet (closer to bottom)
const SKATER_W = 72, SKATER_H = 96;    // 20% bigger (60*1.2, 80*1.2)
const JUMP_VELOCITY = -600;            // px/s (slightly softer)
const GRAVITY = 1800;                  // px/s^2 (slightly softer)
const SCROLL_SPEED_START = 160;        // px/s downward movement of objects (much slower)
const SCROLL_SPEED_MAX = 360;          // px/s max speed (much slower)
const TOKEN_SIZE = 18;                 // 50% smaller (36*0.5)
const CONE_W = 25, CONE_H = 31;        // 30% smaller (36*0.7, 44*0.7)
const SPAWN_EVERY_MS_BASE = 640;       // base spawn cadence (much slower)
const SPAWN_EVERY_MS_MIN = 460;        // floor as combo rises
const TOKEN_CHANCE = 0.6;              // token vs cone probability
const HITSTOP_MS = 120;                // brief slow-mo on cone hit
const SWIPE_THRESHOLD_PX = 40;         // min horizontal delta to count as swipe
const TAP_MAX_DURATION_MS = 180;       // tap if quick

// Small lane drift for 'rolling floor' feel (per lane)
const laneDrift = [-14, 0, 14]; // px/sec sideways

type ObjKind = "token" | "cone";
type Obj = { id: number; kind: ObjKind; lane: number; x: number; y: number; w: number; h: number };

// ----- Game Component
function StarlightGlideGame({
  paused = false,
  onScore,          // optional: (score:number)=>void
  onCombo,          // optional: (combo:number)=>void
}: { paused?: boolean; onScore?: (n:number)=>void; onCombo?: (n:number)=>void }) {

  // ----- All state in refs to prevent re-renders
  const laneRef = useRef(1);
  const yRef = useRef(GROUND_Y - SKATER_H);
  const vyRef = useRef(0);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const hitstopRef = useRef(false);
  
  // Object management - all in refs
  const objectsRef = useRef<Obj[]>([]);
  const laneBucketsRef = useRef<Obj[][]>([[],[],[]]);
  const deadPoolRef = useRef<Obj[]>([]);
  const nextIdRef = useRef(1);

  // Game loop refs
  const speedRef = useRef(SCROLL_SPEED_START);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const spawnAccumRef = useRef(0);
  const justStartedRef = useRef(true);

  // State for rendering only (minimal updates)
  const [renderTrigger, setRenderTrigger] = useState(0);
  const [lane, setLane] = useState(1);
  const [y, setY] = useState(GROUND_Y - SKATER_H);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);

  // ----- Input: PanResponder (swipe lanes + tap-to-jump)
  const touchStartRef = useRef<{x:number;y:number;ts:number} | null>(null);

  const panRes = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      const { locationX, locationY, timestamp } = e.nativeEvent;
      touchStartRef.current = { x: locationX, y: locationY, ts: timestamp };
    },
    onPanResponderMove: (e, g) => {
      // we wait until release to decide swipe vs tap
    },
    onPanResponderRelease: (e) => {
      const start = touchStartRef.current;
      const { locationX, timestamp } = e.nativeEvent;
      if (!start) return;
      const dx = locationX - start.x;
      const dt = timestamp - start.ts;

      // swipe?
      if (Math.abs(dx) > SWIPE_THRESHOLD_PX) {
        if (dx > 0) {
          laneRef.current = Math.min(LANES - 1, laneRef.current + 1);
          setLane(laneRef.current);
        } else {
          laneRef.current = Math.max(0, laneRef.current - 1);
          setLane(laneRef.current);
        }
      } else if (dt <= TAP_MAX_DURATION_MS) {
        // tap: jump if on ground
        if (Math.abs(vyRef.current) < 1 && (yRef.current >= GROUND_Y - SKATER_H - 2)) {
          vyRef.current = JUMP_VELOCITY;
        }
      }
      touchStartRef.current = null;
    },
  }), []);

  // ----- Helpers
  const laneX = (ln: number) => Math.round(ln * LANE_W + (LANE_W - SKATER_W) / 2);

  // Faster AABB; lane-only check
  const aabb = (ax:number,ay:number,aw:number,ah:number,bx:number,by:number,bw:number,bh:number) =>
    ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;

  // ----- Spawning (Optimized with object pooling)
  function spawnObject() {
    const ln = (Math.random() * LANES) | 0;
    const kind: ObjKind = Math.random() < TOKEN_CHANCE ? "token" : "cone";
    const w = kind === "token" ? TOKEN_SIZE : CONE_W;
    const h = kind === "token" ? TOKEN_SIZE : CONE_H;
    const x = Math.round(ln * LANE_W + (LANE_W - w) / 2);
    const y = -h - 12;

    const obj = deadPoolRef.current.pop() || { id: nextIdRef.current++ } as Obj;
    obj.kind = kind; obj.lane = ln; obj.x = x; obj.y = y; obj.w = w; obj.h = h;

    objectsRef.current.push(obj);
    laneBucketsRef.current[ln].push(obj);
  }

  // ----- Ultra-optimized game loop (minimal React re-renders)
  useEffect(() => {
    if (paused) { 
      if (rafRef.current) cancelAnimationFrame(rafRef.current); 
      rafRef.current = null; 
      lastTsRef.current = null; 
      return; 
    }

    let frameCount = 0;
    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      let dtMs = ts - lastTsRef.current;
      lastTsRef.current = ts;

      // clamp dt (prevents "slow-mo" after tabbing back)
      if (dtMs > 50) dtMs = 16.7;
      const dt = dtMs / 1000;

      // Use refs only - no state reads
      const lane = laneRef.current;
      const combo = comboRef.current;
      let y = yRef.current;

      // speed ramp with combo influence
      const cur = speedRef.current;
      const target = Math.min(SCROLL_SPEED_MAX, SCROLL_SPEED_START + combo * 5);
      speedRef.current = hitstopRef.current
        ? speedRef.current * 0.5
        : speedRef.current + (target - cur) * 0.16;

      // spawn objects
      spawnAccumRef.current += dtMs;
      const spawnEvery = Math.max(SPAWN_EVERY_MS_MIN, SPAWN_EVERY_MS_BASE - combo * 10);
      
      if (objectsRef.current.length < 25 && spawnAccumRef.current >= spawnEvery) {
        spawnAccumRef.current -= spawnEvery;
        spawnObject();
      }
      
      if (justStartedRef.current) {
        spawnObject();
        justStartedRef.current = false;
      }

      // move objects (single pass, no array re-alloc)
      const objs = objectsRef.current;
      const lanes = laneBucketsRef.current;
      const speed = speedRef.current;

      for (let i = 0; i < objs.length; i++) {
        objs[i].y += speed * dt;
        objs[i].x += laneDrift[objs[i].lane] * dt;
        objs[i].x = Math.round(objs[i].x);
        objs[i].y = Math.round(objs[i].y);
      }

      // remove off-screen objects
      for (let ln = 0; ln < LANES; ln++) {
        const arr = lanes[ln];
        for (let i = arr.length - 1; i >= 0; i--) {
          const o = arr[i];
          if (o.y > WORLD_H + 80) {
            arr.splice(i, 1);
            const idx = objs.indexOf(o);
            if (idx >= 0) objs.splice(idx, 1);
            deadPoolRef.current.push(o);
          }
        }
      }

      // jump / gravity
      vyRef.current += GRAVITY * dt;
      let newY = y + vyRef.current * dt;
      if (newY > GROUND_Y - SKATER_H) { 
        newY = GROUND_Y - SKATER_H; 
        vyRef.current = 0; 
      }
      
      yRef.current = newY;

      // collisions (lane only)
      const skX = Math.round(laneX(lane)), skY = Math.round(newY);
      const laneObjs = laneBucketsRef.current[lane];
      let picked = 0, hitCone = false;

      for (let i = laneObjs.length - 1; i >= 0; i--) {
        const o = laneObjs[i];
        if (aabb(skX, skY, SKATER_W, SKATER_H, o.x, o.y, o.w, o.h)) {
          if (o.kind === "token") {
            picked++;
            laneObjs.splice(i, 1);
            const idx = objs.indexOf(o);
            if (idx >= 0) objs.splice(idx, 1);
            deadPoolRef.current.push(o);
          } else {
            hitCone = true;
            break;
          }
        }
      }

      if (picked) {
        scoreRef.current += picked * (1 + Math.floor(combo * 0.15));
        comboRef.current = Math.min(999, comboRef.current + picked);
        onScore?.(scoreRef.current);
        onCombo?.(comboRef.current);
      }

      if (hitCone) {
        comboRef.current = 0;
        if (!hitstopRef.current) {
          hitstopRef.current = true;
          setTimeout(() => { hitstopRef.current = false; }, HITSTOP_MS);
        }
        vyRef.current = Math.min(vyRef.current, 120);
      }

      // Update React state only every 3 frames to reduce re-renders
      frameCount++;
      if (frameCount % 3 === 0) {
        setY(Math.round(newY));
        setScore(scoreRef.current);
        setCombo(comboRef.current);
        setRenderTrigger(prev => prev + 1);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { 
      if (rafRef.current) cancelAnimationFrame(rafRef.current); 
      rafRef.current = null; 
      lastTsRef.current = null; 
    };
  }, [paused]);

  // ----- Render (basic rectangles; swap to your sprites/images)
  // Round positions to avoid subpixel fringe
  const skX = Math.round(laneX(lane));
  const skY = Math.round(y);

  return (
    <View style={styles.gameWorld} {...panRes.panHandlers}>
      {/* Background */}
      <Image 
        source={rollerRinkFloorImage} 
        style={[styles.gameBackground, { transform: [{ rotate: '90deg' }] }]} 
      />
      
      {/* Skater - Direct Image with no wrapper to avoid white border */}
      <Image 
        source={skateBgImage} 
        style={{
          position: "absolute",
          left: skX,
          top: skY,
          width: SKATER_W,
          height: SKATER_H,
          // absolutely NO backgroundColor / borderRadius here
        }}
        resizeMode="contain"
      />
      
      {/* Optional soft shadow (makes it feel grounded) */}
      <View style={{
        position: "absolute",
        left: skX + 8,
        top: Math.round(GROUND_Y - 10),
        width: 32,
        height: 12,
        backgroundColor: "rgba(0,0,0,0.25)",
        borderRadius: 12,
      }}/>

      {/* Objects - render from refs */}
      {objectsRef.current.map(o => (
        <Image 
          key={o.id}
          source={o.kind === "token" ? coinImage : skateConeImage}
          style={{
            position: "absolute",
            left: Math.round(o.x), 
            top: Math.round(o.y), 
            width: o.w, 
            height: o.h,
          }}
          resizeMode="contain"
        />
      ))}
    </View>
  );
}

export default function StarlightGlideScreen() {
  const { state: gameState, addTickets } = useGame();
  const params = useLocalSearchParams();
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [gameStatus, setGameStatus] = useState<'ready' | 'playing' | 'paused' | 'finished'>('ready');

  // Auto-start game when coming from roller rink
  useEffect(() => {
    if (params.startGame === 'true') {
      startGame();
    }
  }, [params.startGame]);

  // Game timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (gameStatus === 'playing' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameStatus('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStatus, timeLeft]);

  const startGame = () => {
    setGameStatus('playing');
    setGameStarted(true);
    setScore(0);
    setCombo(0);
    setTimeLeft(120);
  };

  const pauseGame = () => {
    setGameStatus('paused');
  };

  const resumeGame = () => {
    setGameStatus('playing');
  };

  const endGame = () => {
    setGameStatus('finished');
  };

  return (
    <SafeAreaView
      edges={["left","right"]} // NOT "top", we want edge-to-edge
      style={{ flex: 1, backgroundColor: "#1a120d" }}
    >
      <StatusBar translucent style="light" hidden />
      <View style={[styles.container, { backgroundColor: "#1a120d" }]}>
        {/* Chic Back Bar */}
        <Pressable 
          style={styles.chicBackBar}
          onPress={() => router.navigate('/(tabs)/starlight-roller-rink')}
        >
          <View style={styles.backBarContent}>
            <FontAwesome name="arrow-left" size={14} color="#8b5cf6" />
            <Text style={styles.chicBackText}>BACK TO STARLIGHT ROLLER RINK</Text>
            <View style={styles.backBarAccent} />
          </View>
        </Pressable>

        {/* Game Screen */}
        <View style={styles.gameContainer}>
          {/* Game Area */}
          <View style={styles.gameArea}>
            <Text style={styles.gameTitle}>STARLIGHT GLIDE</Text>
            <Text style={styles.gameSubtitle}>Swipe to move • Tap to jump</Text>
            
            {/* Real Game */}
            <View style={styles.gameWrapper}>
              <StarlightGlideGame 
                paused={gameStatus !== 'playing'}
                onScore={setScore}
                onCombo={(combo) => setCombo(combo)}
              />
            </View>
            
            {/* Game Stats - moved to overlay */}
            <View style={styles.gameStatsOverlay}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>SCORE</Text>
                <Text style={styles.statValue}>{score}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>TIME</Text>
                <Text style={styles.statValue}>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>COMBO</Text>
                <Text style={styles.statValue}>x{combo}</Text>
              </View>
            </View>
            
            {/* Small pause button in corner */}
            {gameStatus === 'playing' && (
              <Pressable style={styles.smallPauseButton} onPress={pauseGame}>
                <Text style={styles.smallPauseButtonText}>⏸</Text>
              </Pressable>
            )}
          </View>
          
          {/* Game Controls - only show when paused/finished */}
          {gameStatus !== 'playing' && (
            <View style={styles.gameControls}>
              {gameStatus === 'paused' ? (
                <View style={styles.gamePausedControls}>
                  <Pressable style={styles.resumeButton} onPress={resumeGame}>
                    <Text style={styles.resumeButtonText}>RESUME</Text>
                  </Pressable>
                  <Pressable style={styles.endButton} onPress={endGame}>
                    <Text style={styles.endButtonText}>END GAME</Text>
                  </Pressable>
                </View>
              ) : gameStatus === 'finished' ? (
                <View style={styles.finishedControls}>
                  <Text style={styles.finishedText}>GAME OVER!</Text>
                  <Text style={styles.rewardText}>Final Score: {score}</Text>
                  <Pressable style={styles.playAgainButton} onPress={() => {
                    setGameStatus('ready');
                    setScore(0);
                    setCombo(0);
                    setTimeLeft(120);
                    startGame();
                  }}>
                    <Text style={styles.playAgainButtonText}>PLAY AGAIN</Text>
                  </Pressable>
                </View>
              ) : null}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  chicBackBar: {
    width: '100%',
    marginBottom: 20,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  backBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 16,
    position: 'relative',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  chicBackText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    marginLeft: 8,
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  backBarAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#8b5cf6',
    borderRadius: 1,
  },
  gameContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  gameArea: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  gameTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
    color: '#8b5cf6',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 2,
  },
  gameSubtitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 20,
    textAlign: 'center',
  },
  gameWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  // Game styles
  gameWorld: {
    width: WORLD_W,
    height: WORLD_H,
    backgroundColor: "#0a0a0a",
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 0,
  },
  gameBackground: {
    position: "absolute",
    top: -50,
    left: -50,
    width: WORLD_W + 100,
    height: WORLD_H + 100,
    resizeMode: "cover",
  },
  // New UI styles
  gameStatsOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
  },
  statLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    marginBottom: 2,
  },
  statValue: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#ffffff',
  },
  smallPauseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  smallPauseButtonText: {
    fontSize: 16,
    color: '#ffffff',
  },
  gameControls: {
    marginTop: 20,
    alignItems: 'center',
  },
  gamePausedControls: {
    flexDirection: 'row',
    gap: 16,
  },
  resumeButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  resumeButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#ffffff',
  },
  endButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  endButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#ffffff',
  },
  finishedControls: {
    alignItems: 'center',
    gap: 16,
  },
  finishedText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
  rewardText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
  playAgainButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  playAgainButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#ffffff',
  },
});