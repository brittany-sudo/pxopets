import { StyleSheet, ScrollView, View as RNView, Image, Alert, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useGame } from '@/store/GameStore';
import BorderedBox from '@/components/BorderedBox';
import FontAwesome from '@expo/vector-icons/FontAwesome';
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
const mapOfPxopiaImage = require('@/assets/images/mapofpxopia.png');

export default function ExploreScreen() {
  const { hydrated } = useGame();
  if (!hydrated) return <View style={styles.container}><Text>Loading...</Text></View>;

  const worlds = [
    {
      id: "pxoburbs",
      name: "The Pxoburbs",
      icon: "home",
      color: "#64748b",
      description: "Nostalgic 90s suburban neighborhood.",
      image: staticTvImage
    },
    {
      id: "artisan",
      name: "Shakespeare's Quarter",
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


  const handleWorldPress = (world: any) => {
    console.log('World pressed:', world.id, world.name);
    if (world.id === 'enchanted-island') {
      console.log('Navigating to Enchanted Island from list...');
      router.navigate('/(tabs)/enchanted-island');
    } else if (world.id === 'artisan') {
      console.log('Navigating to Artisan\'s Quarter from list...');
      router.navigate('/(tabs)/artisan-quarter');
    } else if (world.id === 'casino') {
      console.log('Navigating to Crescent Oasis from list...');
      router.navigate('/(tabs)/crescent-oasis');
    } else if (world.id === 'crystal-cove') {
      console.log('Navigating to Foggy Harbor from list...');
      router.navigate('/(tabs)/foggy-harbor');
    } else if (world.id === 'vintage-hollow') {
      console.log('Navigating to Barrelhaven from list...');
      router.navigate('/(tabs)/barrelhaven');
    } else if (world.id === 'bag-of-stars-forest') {
      console.log('Navigating to Bag of Stars Forest from list...');
      router.navigate('/(tabs)/bag-of-stars-forest');
    } else if (world.id === 'pxoburbs') {
      console.log('Navigating to The Pxoburbs from list...');
      router.navigate('/(tabs)/pxoburbs');
    } else if (world.id === 'pirate-port') {
      console.log('Navigating to Saltwick Pier from list...');
      router.navigate('/(tabs)/saltwick-pier');
    } else if (world.id === 'library') {
      console.log('Navigating to Scarecrow Vale from list...');
      router.navigate('/(tabs)/scarecrow-vale');
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
      {/* Second Top Navigation */}
      <RNView style={styles.secondNavContainer}>
        <Pressable style={styles.navButton} onPress={() => Alert.alert('Battle', 'Battle system coming soon!')}>
          <FontAwesome name="sword" size={20} color="#ef4444" />
          <Text style={styles.navButtonText}>BATTLE</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => Alert.alert('Trade', 'Trading system coming soon!')}>
          <FontAwesome name="exchange" size={20} color="#f59e0b" />
          <Text style={styles.navButtonText}>TRADE</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => Alert.alert('User Shop', 'User shops coming soon!')}>
          <FontAwesome name="store" size={20} color="#8b5cf6" />
          <Text style={styles.navButtonText}>SHOP</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => Alert.alert('Contest', 'Contests coming soon!')}>
          <FontAwesome name="trophy" size={20} color="#fbbf24" />
          <Text style={styles.navButtonText}>CONTEST</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => Alert.alert('Dailies', 'Daily quests coming soon!')}>
          <FontAwesome name="calendar" size={20} color="#10b981" />
          <Text style={styles.navButtonText}>DAILIES</Text>
        </Pressable>
      </RNView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Worlds List */}
        <BorderedBox>
          <Image 
            source={mapOfPxopiaImage} 
            style={styles.mapOfPxopiaImage}
            resizeMode="contain"
          />
          <Text style={styles.pxopiaBlurb}>
            Welcome to Pxopia, a magical realm where pixelated adventures await! 
            Explore diverse worlds, meet quirky characters, and discover hidden treasures 
            in this vibrant digital universe.
          </Text>
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
  secondNavContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderBottomWidth: 2,
    borderBottomColor: '#0ea5e9',
    paddingVertical: 8,
    paddingHorizontal: 4,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navButton: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 6,
    minWidth: 60,
  },
  navButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#0f172a',
    fontWeight: 'bold',
    marginTop: 2,
    textAlign: 'center',
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
  mapText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  mapOfPxopiaImage: {
    width: '100%',
    height: 134, // 40% bigger than 96px (96 * 1.4 = 134.4, rounded to 134)
    marginTop: -16, // Negative margin to counteract BorderedBox padding
    marginBottom: 0,
    alignSelf: 'center',
  },
  pxopiaBlurb: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 14,
    marginBottom: 16,
    paddingHorizontal: 8,
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


