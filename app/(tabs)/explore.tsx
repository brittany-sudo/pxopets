import { StyleSheet, ScrollView, View as RNView, Image, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useGame } from '@/store/GameStore';
import BorderedBox from '@/components/BorderedBox';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import InteractiveMap from '@/components/InteractiveMap';
import JazzyTitle from '@/components/JazzyTitle';

export default function ExploreScreen() {
  const { hydrated } = useGame();
  if (!hydrated) return <View style={styles.container}><Text>Loading...</Text></View>;

  const worlds = [
    {
      id: "artisan",
      name: "Artisan's Quarter",
      icon: "paint-brush",
      color: "#ec4899",
      description: "Main village square with shops and craftspeople."
    },
    {
      id: "crystal-cove",
      name: "Foggy Harbor",
      icon: "anchor",
      color: "#64748b",
      description: "Dreary Maine fishing town shrouded in mist."
    },
    {
      id: "casino",
      name: "Desert Oasis Resort",
      icon: "sun-o",
      color: "#f59e0b",
      description: "Luxurious Palm Springs resort for high-rollers."
    },
    {
      id: "gardens",
      name: "Emerald Gardens",
      icon: "leaf",
      color: "#10b981",
      description: "Lush paradise for growing magical plants."
    },
    {
      id: "vintage-hollow",
      name: "Vintage Hollow",
      icon: "glass",
      color: "#8b5cf6",
      description: "Medieval winery village in rolling hills."
    },
    {
      id: "pxoburbs",
      name: "The Pxoburbs",
      icon: "home",
      color: "#64748b",
      description: "Nostalgic 90s suburban neighborhood."
    },
    {
      id: "mountains",
      name: "Mystic Mountains",
      icon: "mountain",
      color: "#6b7280",
      description: "Ancient peaks with hidden caves and gems."
    },
    {
      id: "pirate-port",
      name: "Pirate's Port",
      icon: "ship",
      color: "#dc2626",
      description: "Bustling harbor where pirates gather."
    },
    {
      id: "library",
      name: "Scholar's Library",
      icon: "book",
      color: "#7c3aed",
      description: "Vast repository of ancient knowledge."
    },
    {
      id: "tiki-island",
      name: "Tiki Island",
      icon: "music",
      color: "#f97316",
      description: "Mystical Polynesian island with tiki spirits."
    }
  ];

  const handleRegionPress = (regionId: string, regionName: string) => {
    const world = worlds.find(w => w.id === regionId);
    if (world) {
      Alert.alert(
        `Welcome to ${regionName}!`,
        world.description,
        [
          { text: "Explore", onPress: () => console.log(`Navigating to ${regionName}`) },
          { text: "Cancel", style: "cancel" }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Interactive Map */}
        <RNView style={styles.mapContainer}>
          <InteractiveMap onRegionPress={handleRegionPress} />
        </RNView>

        {/* Worlds List */}
        <BorderedBox>
          <Text style={styles.worldsTitle}>MAP OF PXOPIA</Text>
          {worlds.map((world, index) => (
            <RNView key={index} style={styles.worldItem}>
              <FontAwesome name={world.icon as any} size={20} color={world.color} style={styles.worldIcon} />
              <RNView style={styles.worldContent}>
                <Text style={styles.worldName}>{world.name}</Text>
                <Text style={styles.worldDescription}>{world.description}</Text>
              </RNView>
            </RNView>
          ))}
        </BorderedBox>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'left',
  },
  mapContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
    width: '100%',
  },
  mapText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  worldsTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  worldItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
    padding: 12,
    marginBottom: 8,
    width: '100%',
  },
  worldIcon: {
    marginRight: 12,
    marginTop: 2,
    flexShrink: 0,
  },
  worldContent: {
    flex: 1,
  },
  worldName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  worldDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#0f172a',
    lineHeight: 16,
  },
});


