import React, { useState } from 'react';
import { StyleSheet, View as RNView, Pressable, Image, Dimensions } from 'react-native';

interface MapRegion {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface InteractiveMapProps {
  onRegionPress: (regionId: string, regionName: string) => void;
}

export default function InteractiveMap({ onRegionPress }: InteractiveMapProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const regions: MapRegion[] = [
    {
      id: 'bag-of-stars-forest',
      name: 'Bag of Stars Forest',
      x: 20, // Moved slightly left
      y: 15, // Forest area (moved up even more)
      width: 18, // Made bigger
      height: 18 // Made bigger
    },
    {
      id: 'casino',
      name: 'Crescent Oasis',
      x: 80, // Far right
      y: 50, // Upper area
      width: 12,
      height: 12
    },
    {
      id: 'bag-of-stars-forest',
      name: 'Bag of Stars Forest',
      x: 30, // Left-center
      y: 50, // Upper area
      width: 12,
      height: 12
    },
    {
      id: 'vintage-hollow',
      name: 'Barrelhaven',
      x: 55, // Center-right
      y: 65, // Lower area
      width: 12,
      height: 12
    },
    {
      id: 'pxoburbs',
      name: 'The Pxoburbs',
      x: 75, // Right area
      y: 35, // Top area
      width: 12,
      height: 10
    },
    {
      id: 'mountains',
      name: 'Naptime Valley',
      x: 65, // Right-center
      y: 35, // Top area
      width: 12,
      height: 12
    },
    {
      id: 'crystal-cove',
      name: 'Foggy Harbor',
      x: 8, // Far left
      y: 70, // Bottom area
      width: 12,
      height: 12
    },
    {
      id: 'pirate-port',
      name: 'Saltwick Pier',
      x: 25, // Left area
      y: 75, // Bottom area
      width: 12,
      height: 12
    },
    {
      id: 'artisan',
      name: 'Artisan\'s Quarter',
      x: 45, // Center
      y: 45, // Middle
      width: 12,
      height: 12
    },
    {
      id: 'library',
      name: 'Scarecrow Vale',
      x: 90, // Far right
      y: 60, // Lower area
      width: 12,
      height: 10
    },
    {
      id: 'enchanted-island',
      name: 'Enchanted Island',
      x: 50, // Center-left
      y: 40, // Upper-middle
      width: 12,
      height: 12
    }
  ];

  const handleRegionPress = (region: MapRegion) => {
    console.log('InteractiveMap: Region pressed:', region.id, region.name);
    console.log('Available regions:', regions.map(r => r.id));
    setSelectedRegion(region.id);
    onRegionPress(region.id, region.name);
  };

  return (
    <RNView style={styles.container}>
      {/* Base Map Image */}
      <Image
        source={require('@/assets/images/main-map.png')}
        style={styles.baseMap}
        resizeMode="contain"
      />
      
      {/* Interactive Region Overlays */}
      {regions.map((region) => (
        <Pressable
          key={region.id}
          style={[
            styles.regionOverlay,
            {
              left: `${region.x}%`,
              top: `${region.y}%`,
              width: `${region.width}%`,
              height: `${region.height}%`,
            },
            selectedRegion === region.id && styles.selectedRegion
          ]}
          onPress={() => handleRegionPress(region)}
        >
          {/* You can add region-specific images here later */}
          <RNView style={styles.regionIndicator} />
        </Pressable>
      ))}
    </RNView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: 284,
  },
  baseMap: {
    width: '100%',
    height: 284,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  regionOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRegion: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 3,
  },
  regionIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});
