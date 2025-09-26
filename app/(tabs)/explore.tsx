import { StyleSheet, ScrollView, View as RNView, Image, Alert, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useGame } from '@/store/GameStore';
import BorderedBox from '@/components/BorderedBox';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import InteractiveMap from '@/components/InteractiveMap';
import JazzyTitle from '@/components/JazzyTitle';
import { router } from 'expo-router';

// Import images
const volcanoImage = require('@/assets/images/tiny-volcano.png');
const staticTvImage = require('@/assets/images/static-tv.png');
const lilPaletteImage = require('@/assets/images/lil-palette.png');
const neonBurgerImage = require('@/assets/images/neon-burger.png');
const lilAnchorImage = require('@/assets/images/lil-anchor.png');
const lilWineCasketImage = require('@/assets/images/lil-wine-casket.png');
const lilTotemGuyImage = require('@/assets/images/lil-totem-guy.png');
const lilPopcornImage = require('@/assets/images/lil-popcorn.png');
const lilScarecrowImage = require('@/assets/images/lil-scarecrow.png');
const lilGnomeImage = require('@/assets/images/lil-gnome.png');

export default function ExploreScreen() {
  const { hydrated } = useGame();
  if (!hydrated) return <View style={styles.container}><Text>Loading...</Text></View>;

  const worlds = [
    {
      id: "artisan",
      name: "Artisan's Quarter",
      icon: "paint-brush",
      color: "#ec4899",
      description: "Main village square with shops and craftspeople.",
      image: lilPaletteImage
    },
    {
      id: "crystal-cove",
      name: "Foggy Harbor",
      icon: "anchor",
      color: "#64748b",
      description: "Dreary Maine fishing town shrouded in mist.",
      image: lilAnchorImage
    },
    {
      id: "casino",
      name: "Crescent Oasis",
      icon: "sun-o",
      color: "#f59e0b",
      description: "Pink desert mirage with hippie aliens and atomic 50s diners.",
      image: neonBurgerImage
    },
    {
      id: "bag-of-stars-forest",
      name: "Bag of Stars Forest",
      icon: "leaf",
      color: "#10b981",
      description: "Enchanted forest where stars fall like leaves.",
      image: lilTotemGuyImage
    },
    {
      id: "vintage-hollow",
      name: "Barrelhaven",
      icon: "glass",
      color: "#8b5cf6",
      description: "Medieval winery village in rolling hills.",
      image: lilWineCasketImage
    },
    {
      id: "pxoburbs",
      name: "The Pxoburbs",
      icon: "home",
      color: "#64748b",
      description: "Nostalgic 90s suburban neighborhood.",
      image: staticTvImage
    },
    {
      id: "mountains",
      name: "Slumbering Hills",
      icon: "mountain",
      color: "#6b7280",
      description: "Peaceful valley where sleepy creatures rest.",
      image: lilGnomeImage
    },
    {
      id: "pirate-port",
      name: "Saltwick Pier",
      icon: "ship",
      color: "#dc2626",
      description: "Colorful carnival with rides and games.",
      image: lilPopcornImage
    },
    {
      id: "library",
      name: "Scarecrow Vale",
      icon: "book",
      color: "#7c3aed",
      description: "Mysterious fields where scarecrows watch over crops.",
      image: lilScarecrowImage
    },
    {
      id: "enchanted-island",
      name: "Enchanted Island",
      icon: "music",
      color: "#f97316",
      description: "Mystical Polynesian island with tiki spirits.",
      image: volcanoImage
    }
  ];

  const handleRegionPress = (regionId: string, regionName: string) => {
    console.log('Region pressed:', regionId, regionName);
    const world = worlds.find(w => w.id === regionId);
    if (world) {
      if (regionId === 'enchanted-island') {
        console.log('Navigating to Enchanted Island...');
        router.push('/enchanted-island');
      } else if (regionId === 'artisan') {
        console.log('Navigating to Artisan\'s Quarter...');
        router.push('/artisan-quarter');
      } else if (regionId === 'casino') {
        console.log('Navigating to Crescent Oasis...');
        router.push('/crescent-oasis');
      } else if (regionId === 'crystal-cove') {
        console.log('Navigating to Foggy Harbor...');
        router.push('/foggy-harbor');
      } else if (regionId === 'vintage-hollow') {
        console.log('Navigating to Barrelhaven...');
        router.push('/barrelhaven');
      } else if (regionId === 'bag-of-stars-forest') {
        console.log('Navigating to Bag of Stars Forest...');
        router.push('/bag-of-stars-forest');
      } else if (regionId === 'pxoburbs') {
        console.log('Navigating to The Pxoburbs...');
        router.push('/pxoburbs');
      } else if (regionId === 'pirate-port') {
        console.log('Navigating to Saltwick Pier...');
        router.push('/saltwick-pier');
      } else if (regionId === 'library') {
        console.log('Navigating to Scarecrow Vale...');
        router.push('/scarecrow-vale');
      } else {
        Alert.alert(
          `Welcome to ${regionName}!`,
          world.description,
          [
            { text: "Explore", onPress: () => console.log(`Navigating to ${regionName}`) },
            { text: "Cancel", style: "cancel" }
          ]
        );
      }
    }
  };

  const handleWorldPress = (world: any) => {
    console.log('World pressed:', world.id, world.name);
    if (world.id === 'enchanted-island') {
      console.log('Navigating to Enchanted Island from list...');
      router.push('/enchanted-island');
    } else if (world.id === 'artisan') {
      console.log('Navigating to Artisan\'s Quarter from list...');
      router.push('/artisan-quarter');
    } else if (world.id === 'casino') {
      console.log('Navigating to Crescent Oasis from list...');
      router.push('/crescent-oasis');
    } else if (world.id === 'crystal-cove') {
      console.log('Navigating to Foggy Harbor from list...');
      router.push('/foggy-harbor');
    } else if (world.id === 'vintage-hollow') {
      console.log('Navigating to Barrelhaven from list...');
      router.push('/barrelhaven');
    } else if (world.id === 'bag-of-stars-forest') {
      console.log('Navigating to Bag of Stars Forest from list...');
      router.push('/bag-of-stars-forest');
    } else if (world.id === 'pxoburbs') {
      console.log('Navigating to The Pxoburbs from list...');
      router.push('/pxoburbs');
    } else if (world.id === 'pirate-port') {
      console.log('Navigating to Saltwick Pier from list...');
      router.push('/saltwick-pier');
    } else if (world.id === 'library') {
      console.log('Navigating to Scarecrow Vale from list...');
      router.push('/scarecrow-vale');
    } else {
      Alert.alert(
        `Welcome to ${world.name}!`,
        world.description,
        [
          { text: "Explore", onPress: () => console.log(`Navigating to ${world.name}`) },
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
            <Pressable 
              key={index} 
              style={styles.worldItem}
              onPress={() => handleWorldPress(world)}
            >
              {world.image ? (
                <Image source={world.image} style={styles.worldImage} />
              ) : (
                <FontAwesome name={world.icon as any} size={32} color={world.color} style={styles.worldIcon} />
              )}
              <RNView style={styles.worldContent}>
                <Text style={styles.worldName}>{world.name}</Text>
                <Text style={styles.worldDescription}>{world.description}</Text>
              </RNView>
            </Pressable>
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
    fontSize: 32,
  },
  worldImage: {
    width: 48,
    height: 48,
    marginRight: 12,
    marginTop: 2,
    flexShrink: 0,
    resizeMode: 'contain',
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


