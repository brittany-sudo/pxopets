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
      id: 'crystal-cove',
      name: 'Foggy Harbor',
      x: 60,
      y: 160,
      width: 50,
      height: 50
    },
    {
      id: 'casino',
      name: 'Desert Oasis Resort',
      x: 350,
      y: 140,
      width: 50,
      height: 50
    },
    {
      id: 'gardens',
      name: 'Emerald Gardens',
      x: 120,
      y: 140,
      width: 50,
      height: 50
    },
    {
      id: 'vintage-hollow',
      name: 'Vintage Hollow',
      x: 220,
      y: 170,
      width: 50,
      height: 50
    },
    {
      id: 'pxoburbs',
      name: 'The Pxoburbs',
      x: 300,
      y: 100,
      width: 50,
      height: 40
    },
    {
      id: 'mountains',
      name: 'Mystic Mountains',
      x: 250,
      y: 100,
      width: 50,
      height: 50
    },
    {
      id: 'pirate-port',
      name: 'Pirate\'s Port',
      x: 30,
      y: 180,
      width: 50,
      height: 50
    },
    {
      id: 'artisan',
      name: 'Artisan\'s Quarter',
      x: 180,
      y: 120,
      width: 50,
      height: 50
    },
    {
      id: 'library',
      name: 'Scholar\'s Library',
      x: 380,
      y: 160,
      width: 50,
      height: 40
    },
    {
      id: 'tiki-island',
      name: 'Tiki Island',
      x: 200,
      y: 110,
      width: 50,
      height: 50
    }
  ];

  const handleRegionPress = (region: MapRegion) => {
    setSelectedRegion(region.id);
    onRegionPress(region.id, region.name);
  };

  return (
    <RNView style={styles.container}>
      {/* Base Map Image */}
      <Image
        source={require('@/assets/images/placeholder-map.png')}
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
              left: region.x,
              top: region.y,
              width: region.width,
              height: region.height,
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
    height: 300,
  },
  baseMap: {
    width: '100%',
    height: 300,
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
