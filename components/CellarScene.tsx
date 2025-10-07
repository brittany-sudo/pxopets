import React from 'react';
import { Canvas, Rect, Circle, LinearGradient, vec, Image as SkiaImage, useImage, Group, BlendMode } from '@shopify/react-native-skia';
import { Dimensions } from 'react-native';
import Animated, { useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { CandleGlowLOUD } from './CandleGlowLOUD';

const { width: screenWidth } = Dimensions.get('window');

interface CellarSceneProps {
  opened: boolean[][];
  danger: number[][];
  gameState: any;
  lastOpenedSpoiled: {row: number, col: number} | null;
  lastOpenedGood: {row: number, col: number, foundDustyBottle: boolean} | null;
  sparkleFade: number;
}

export const CellarScene: React.FC<CellarSceneProps> = ({ opened, danger, gameState, lastOpenedSpoiled, lastOpenedGood, sparkleFade }) => {
  const gridSize = 5;
  const cellSize = 60;
  const padding = 20;
  const gridWidth = gridSize * cellSize; // 5 * 60 = 300
  const gridHeight = gridSize * cellSize;
  // Center the barrels properly, but move them left a bit
  const startX = (screenWidth - gridWidth) / 2 - 40; // Center the 300px grid, then move left 40px
  const startY = 80; // Moved up to give more space at bottom

  // Candle positioning
  const candleX = 60;
  const candleY = 425;
  const candleRadius = 40;

  // Load barrel images
  const barrelClosed = useImage(require('@/assets/images/barrel-closed.png'));
  const barrelOpen = useImage(require('@/assets/images/barrel-open.png'));
  const barrelSpoiled = useImage(require('@/assets/images/barrel-spoiled.png'));
  const spoiledFog = useImage(require('@/assets/images/spoiled-barrel-fog.png'));
  const cellarCandle = useImage(require('@/assets/images/cellar-candle.png'));
  const sparkleParticle = useImage(require('@/assets/images/sparkle-particle.png'));
  const vintageIcon = useImage(require('@/assets/images/vintage-icon.png'));
  const frogTwins = useImage(require('@/assets/images/frog-twins.png'));
  const woodenFloor = useImage(require('@/assets/images/wooden-floor.png'));

  return (
    <Canvas style={{ width: '100%', height: 480 }}>
      {/* Wooden floor background - tiled */}
      {woodenFloor && (
        <Group>
          {/* Tile the wooden floor to fill the space */}
          {Array.from({ length: Math.ceil(screenWidth / 200) + 10 }).map((_, i) =>
            Array.from({ length: Math.ceil(480 / 200) + 10 }).map((_, j) => (
              <SkiaImage
                key={`floor-${i}-${j}`}
                image={woodenFloor}
                x={i * 200 - 90}
                y={j * 200 - 90}
                width={380}
                height={380}
              />
            ))
          )}
        </Group>
      )}

      {/* Actual candle image */}
      {cellarCandle && (
        <SkiaImage
          image={cellarCandle}
          x={20}
          y={385}
          width={80}
          height={80}
        />
      )}

      {/* LOUD candle glow - back to working version */}
      <CandleGlowLOUD x={candleX} y={candleY} r={candleRadius} />

      {/* Frog Twins - the barrel inspectors */}
      {frogTwins && (
        <SkiaImage
          image={frogTwins}
          x={170}
          y={380}
          width={120}
          height={90}
        />
      )}

      {/* Barrel grid with actual images */}
      {Array.from({ length: gridSize }).map((_, row) =>
        Array.from({ length: gridSize }).map((_, col) => {
          const x = startX + col * cellSize;
          const y = startY + row * cellSize;
          const isOpened = opened[row]?.[col] || false;
          const cell = gameState?.grid?.[row]?.[col];
          const isSpoiled = cell?.isSpoiled || false;
          
          // Determine which barrel image to show
          let barrelImage = barrelClosed;
          if (isOpened && isSpoiled) {
            barrelImage = barrelSpoiled;
          } else if (isOpened && !isSpoiled) {
            barrelImage = barrelOpen;
          }
          
                    return (
                      <React.Fragment key={`barrel-${row}-${col}`}>
                        {/* Barrel image */}
                        {barrelImage && (
                          <SkiaImage
                            image={barrelImage}
                            x={x + 5}
                            y={y + 5}
                            width={cellSize - 10}
                            height={cellSize - 10}
                          />
                        )}
                        
                        {/* Spoiled barrel fog effect - only for the last opened spoiled barrel */}
                        {isOpened && isSpoiled && spoiledFog && lastOpenedSpoiled && 
                         lastOpenedSpoiled.row === row && lastOpenedSpoiled.col === col && (
                          <SkiaImage
                            image={spoiledFog}
                            x={x - 10}
                            y={y - 10}
                            width={cellSize + 20}
                            height={cellSize + 20}
                            opacity={0.8}
                          />
                        )}
                        
                          {/* Sparkle effect for good barrels - only for the last opened good barrel (but not Dusty Bottles) */}
                          {isOpened && !isSpoiled && sparkleParticle && lastOpenedGood && 
                           lastOpenedGood.row === row && lastOpenedGood.col === col && 
                           !lastOpenedGood.foundDustyBottle && (
                            <SkiaImage
                              image={sparkleParticle}
                              x={x + 5 + (cellSize - 10) / 4}
                              y={y - 10}
                              width={(cellSize - 10) / 2}
                              height={(cellSize - 10) / 2}
                              opacity={0.9 * sparkleFade}
                            />
                          )}
                        
                        {/* Vintage icon for dusty bottle rewards */}
                        {isOpened && !isSpoiled && vintageIcon && lastOpenedGood && 
                         lastOpenedGood.row === row && lastOpenedGood.col === col && 
                         lastOpenedGood.foundDustyBottle && (
                          <SkiaImage
                            image={vintageIcon}
                            x={x + 15}
                            y={y - 10}
                            width={22.5}
                            height={22.5}
                            opacity={1.0}
                          />
                        )}
                        
                        {/* Sparkle particle for dusty bottle rewards (25% smaller) */}
                        {isOpened && !isSpoiled && sparkleParticle && lastOpenedGood && 
                         lastOpenedGood.row === row && lastOpenedGood.col === col && 
                         lastOpenedGood.foundDustyBottle && (
                          <SkiaImage
                            image={sparkleParticle}
                            x={x + 5 + (cellSize - 10) / 4}
                            y={y - 10}
                            width={(cellSize - 10) / 2 * 0.75}
                            height={(cellSize - 10) / 2 * 0.75}
                            opacity={0.9 * sparkleFade}
                          />
                        )}
                      </React.Fragment>
                    );
        })
      )}
    </Canvas>
  );
};
