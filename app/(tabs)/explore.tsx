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
const pxoburbsIconImage = require('@/assets/images/pxoburbs-icon.png');
const lilPaletteImage = require('@/assets/images/lil-palette.png');
const cosmicBurgerImage = require('@/assets/images/cosmicburger.png');
const lilAnchorImage = require('@/assets/images/lil-anchor.png');
const lilWineCasketImage = require('@/assets/images/lil-wine-casket.png');
const lilTotemGuyImage = require('@/assets/images/lil-totem-guy.png');
const lilPopcornImage = require('@/assets/images/lil-popcorn.png');
const lilScarecrowImage = require('@/assets/images/lil-scarecrow.png');
const lilGnomeImage = require('@/assets/images/lil-gnome.png');
const lilGnomehatImage = require('@/assets/images/lil-gnomehat.png');
const lilTentGossImage = require('@/assets/images/lil-tent-goss.png');
const lilPotImage = require('@/assets/images/lil-pot.png');
const lilTrailerImage = require('@/assets/images/lil-trailer.png');
const lilBayouImage = require('@/assets/images/lil-bayou.png');
const loomersTinyImage = require('@/assets/images/loomers-tiny.png');
const mapOfPxopiaImage = require('@/assets/images/map-of-pxopia.png');

export default function ExploreScreen() {
  const { hydrated } = useGame();
  if (!hydrated) return <View style={styles.container}><Text>Loading...</Text></View>;

  const worlds = [
    {
      id: "pxoburbs",
      name: "The Pxoburbs",
      icon: "home",
      color: "#64748b",
      description: "A nostalgic suburban enclave where neon-lit arcades meet corner stores.",
      image: pxoburbsIconImage
    },
    {
      id: "crystal-cove",
      name: "Loomer's Wharf",
      icon: "anchor",
      color: "#64748b",
      description: "A misty maritime port where fog dances with fishing boats.",
      image: loomersTinyImage
    },
    {
      id: "casino",
      name: "Crescent Oasis",
      icon: "sun-o",
      color: "#f59e0b",
      description: "A desert mirage where atomic age meets cosmic wonder.",
      image: lilTrailerImage
    },
    {
      id: "vintage-hollow",
      name: "Barrelhaven",
      icon: "glass",
      color: "#8b5cf6",
      description: "A medieval vineyard where wine flows as freely as the rolling hills.",
      image: lilWineCasketImage
    },
    {
      id: "artisan",
      name: "Shakespeare's Quarter",
      icon: "paint-brush",
      color: "#ec4899",
      description: "An artistic district where creativity flows through cobblestone streets.",
      image: lilPotImage
    },
    {
      id: "bag-of-stars-forest",
      name: "Bag of Stars Forest",
      icon: "leaf",
      color: "#10b981",
      description: "An enchanted woodland where celestial bodies bloom as foliage.",
      image: lilTotemGuyImage
    },
    {
      id: "lullaby-downs",
      name: "Lullaby Downs",
      icon: "moon-o",
      color: "#6b7280",
      description: "A dreamy valley where sleepy melodies drift through moonlit meadows.",
      image: lilGnomehatImage
    },
    {
      id: "gossamer-midway",
      name: "Gossamer Midway",
      icon: "star",
      color: "#dc2626",
      description: "A surreal traveling carnival that only appears under certain moons.",
      image: lilTentGossImage
    },
    {
      id: "library",
      name: "Thistledown",
      icon: "book",
      color: "#7c3aed",
      description: "A pastoral landscape where silent sentinels guard golden fields.",
      image: lilScarecrowImage
    },
    {
      id: "bayou-nocturne",
      name: "Bayou Nocturne",
      icon: "moon-o",
      color: "#1f2937",
      description: "A mysterious swamp where fireflies dance with ancient spirits under moonlit cypress trees.",
      image: lilBayouImage
    },
    {
      id: "lumen-bazaar",
      name: "Lumen Bazaar",
      icon: "lightbulb-o",
      color: "#fbbf24",
      description: "A glowing marketplace where merchants trade in pure light and luminous curiosities.",
      image: lilTentGossImage
    },
    {
      id: "enchanted-island",
      name: "Twilight Atoll",
      icon: "music",
      color: "#f97316",
      description: "A tropical paradise where ancient tiki spirits dance with volcanic fire.",
      image: volcanoImage
    },
    {
      id: "midwinter-crossing",
      name: "Midwinter Crossing",
      icon: "snowflake-o",
      color: "#e5e7eb",
      description: "A frozen crossroads where winter's breath creates crystalline bridges between worlds.",
      image: lilGnomeImage
    }
  ];


  const handleWorldPress = (world: any) => {
    console.log('World pressed:', world.id, world.name);
    if (world.id === 'enchanted-island') {
      console.log('Navigating to Twilight Atoll from list...');
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
    } else if (world.id === 'gossamer-midway') {
      console.log('Navigating to Gossamer Midway from list...');
      router.navigate('/(tabs)/gossamer-midway');
    } else if (world.id === 'library') {
      console.log('Navigating to Thistledown from list...');
      router.navigate('/(tabs)/scarecrow-vale');
    } else if (world.id === 'bayou-nocturne') {
      console.log('Navigating to Bayou Nocturne from list...');
      router.navigate('/(tabs)/bayou-nocturne');
    } else if (world.id === 'midwinter-crossing') {
      console.log('Navigating to Midwinter Crossing from list...');
      router.navigate('/(tabs)/midwinter-crossing');
    } else if (world.id === 'lumen-bazaar') {
      console.log('Navigating to Lumen Bazaar from list...');
      router.navigate('/(tabs)/lumen-bazaar');
    } else if (world.id === 'lullaby-downs') {
      console.log('Navigating to Lullaby Downs from list...');
      router.navigate('/(tabs)/lullaby-downs');
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
          <FontAwesome name="gamepad" size={20} color="#8b5cf6" />
          <Text style={styles.navButtonText}>BATTLE</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => Alert.alert('Trade', 'Trading system coming soon!')}>
          <FontAwesome name="exchange" size={20} color="#8b5cf6" />
          <Text style={styles.navButtonText}>TRADE</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => Alert.alert('User Shop', 'User shops coming soon!')}>
          <FontAwesome name="shopping-cart" size={20} color="#8b5cf6" />
          <Text style={styles.navButtonText}>SHOP</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => Alert.alert('Inventory', 'Inventory coming soon!')}>
          <FontAwesome name="archive" size={20} color="#8b5cf6" />
          <Text style={styles.navButtonText}>INVENTORY</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => Alert.alert('Bank', 'Bank coming soon!')}>
          <FontAwesome name="bank" size={20} color="#8b5cf6" />
          <Text style={styles.navButtonText}>BANK</Text>
        </Pressable>
      </RNView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Worlds List */}
        <RNView style={styles.worldsContainer}>
          <Image 
            source={mapOfPxopiaImage} 
            style={styles.mapOfPxopiaImage}
            resizeMode="contain"
          />
          {worlds.map((world, index) => (
            <Pressable 
              key={index} 
              style={styles.worldItem}
              onPress={() => handleWorldPress(world)}
            >
              <RNView style={styles.worldIconContainer}>
                {world.image ? (
                  <Image source={world.image} style={styles.worldImage} />
                ) : (
                  <FontAwesome name={world.icon as any} size={32} color={world.color} style={styles.worldIcon} />
                )}
              </RNView>
              <RNView style={styles.worldContent}>
                <Text style={styles.worldName}>{world.name}</Text>
                <Text style={styles.worldDescription}>{world.description}</Text>
              </RNView>
            </Pressable>
          ))}
        </RNView>
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
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(139, 92, 246, 0.2)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 4,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
    minWidth: 60,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  navButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginTop: 2,
    textAlign: 'center',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16, // More reasonable padding
    paddingHorizontal: 12, // Better horizontal padding
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
    height: 140, // Slightly taller for better presence
    marginTop: 20, // More space above the map (was -20)
    marginBottom: 20, // More space below the map (was 8)
    alignSelf: 'center',
    borderRadius: 12, // Rounded corners to match design
  },
  pxopiaBlurb: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9, // Reduced from 10
    color: '#8b5cf6', // Purple color to match UI
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 12, // Reduced from 14
    marginTop: 4,
    marginBottom: 16, // Reduced from 20
    paddingHorizontal: 12, // Reduced from 16
    paddingVertical: 6, // Reduced from 8
    backgroundColor: 'rgba(139, 92, 246, 0.1)', // Light purple background
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)', // Purple border
    borderRadius: 6, // Reduced from 8
    letterSpacing: 0.4, // Reduced from 0.5
  },
  worldsContainer: {
    width: '95%', // Slightly less wide (was 100%)
    backgroundColor: 'rgba(255, 255, 255, 0.98)', // Clean white background
    borderRadius: 12, // More subtle rounding (was 20)
    padding: 16, // Internal padding
    borderWidth: 1, // Simple 1px border
    borderColor: 'rgba(139, 92, 246, 0.3)', // Transparent purple border
    // Removed all shadow properties for clean border look
  },
  worldItem: {
    flexDirection: 'row',
    alignItems: 'center', // Better alignment
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Clean white background
    borderRadius: 16, // Much more rounded, co-star style
    borderWidth: 0, // Remove border for cleaner look
    padding: 16, // More padding for premium feel
    marginBottom: 12, // More space between items
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3, // Android shadow
  },
  worldIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    flexShrink: 0,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  worldIcon: {
    fontSize: 32,
    color: '#8b5cf6',
  },
  worldImage: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  worldContent: {
    flex: 1,
  },
  worldName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 16, // Bigger title
    fontWeight: 'bold',
    color: '#1f2937', // Darker, more premium color
    marginBottom: 6, // More space below title
  },
  worldDescription: {
    fontFamily: 'monospace',
    fontSize: 13, // Bigger description text
    color: '#6b7280', // Softer gray color
    lineHeight: 18, // Better line height for readability
    fontWeight: '400',
    letterSpacing: 0.2, // Subtle letter spacing
  },
});


