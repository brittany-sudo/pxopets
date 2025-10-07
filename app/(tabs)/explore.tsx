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
const barrelhavenIconImage = require('@/assets/images/barrelhaven-icon.png');
const stardiverForestIconImage = require('@/assets/images/stardiver-forest-icon.png');
const lilPopcornImage = require('@/assets/images/lil-popcorn.png');
const lilScarecrowImage = require('@/assets/images/lil-scarecrow.png');
const lilGnomeImage = require('@/assets/images/lil-gnome.png');
const lullabyDownsIconImage = require('@/assets/images/lullaby-downs-icon.png');
const lilTentGossImage = require('@/assets/images/lil-tent-goss.png');
const lilPotImage = require('@/assets/images/lil-pot.png');
const cosmicOasisIconImage = require('@/assets/images/cosmic-oasis-icon.png');
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
      name: "Cosmic Oasis",
      icon: "sun-o",
      color: "#f59e0b",
      description: "A desert mirage where atomic age meets cosmic wonder.",
      image: cosmicOasisIconImage
    },
    {
      id: "barrelhaven",
      name: "Barrelhaven",
      icon: "glass",
      color: "#8b5cf6",
      description: "A medieval vineyard where wine flows as freely as the rolling hills.",
      image: barrelhavenIconImage
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
      name: "Stardiver Forest",
      icon: "leaf",
      color: "#10b981",
      description: "An enchanted woodland where celestial bodies bloom as foliage.",
      image: stardiverForestIconImage
    },
    {
      id: "lullaby-downs",
      name: "Lullaby Downs",
      icon: "moon-o",
      color: "#6b7280",
      description: "A dreamy valley where sleepy melodies drift through moonlit meadows.",
      image: lullabyDownsIconImage
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
      id: "library",
      name: "Thistledown",
      icon: "book",
      color: "#7c3aed",
      description: "A pastoral landscape where silent sentinels guard golden fields.",
      image: lilScarecrowImage
    },
    {
      id: "midwinter-crossing",
      name: "Midwinter Crossing",
      icon: "snowflake-o",
      color: "#e5e7eb",
      description: "A frozen crossroads where winter's breath creates crystalline bridges between worlds.",
      image: lilGnomeImage
    },
    {
      id: "gossamer-midway",
      name: "Gossamer Midway",
      icon: "star",
      color: "#dc2626",
      description: "A surreal traveling carnival that only appears under certain moons.",
      image: lilTentGossImage
    }
  ];


  const handleWorldPress = (world: any) => {
    if (world.id === 'enchanted-island') {
      router.navigate('/(tabs)/enchanted-island');
    } else if (world.id === 'artisan') {
      router.navigate('/(tabs)/artisan-quarter');
    } else if (world.id === 'casino') {
      router.navigate('/(tabs)/crescent-oasis');
    } else if (world.id === 'crystal-cove') {
      router.navigate('/(tabs)/foggy-harbor');
    } else if (world.id === 'barrelhaven') {
      router.navigate('/(tabs)/barrelhaven');
    } else if (world.id === 'bag-of-stars-forest') {
      router.navigate('/(tabs)/bag-of-stars-forest');
    } else if (world.id === 'pxoburbs') {
      router.navigate('/(tabs)/pxoburbs');
    } else if (world.id === 'gossamer-midway') {
      router.navigate('/(tabs)/gossamer-midway');
    } else if (world.id === 'library') {
      router.navigate('/(tabs)/scarecrow-vale');
    } else if (world.id === 'bayou-nocturne') {
      router.navigate('/(tabs)/bayou-nocturne');
    } else if (world.id === 'midwinter-crossing') {
      router.navigate('/(tabs)/midwinter-crossing');
    } else if (world.id === 'lumen-bazaar') {
      router.navigate('/(tabs)/lumen-bazaar');
    } else if (world.id === 'lullaby-downs') {
      router.navigate('/(tabs)/lullaby-downs');
    } else {
      Alert.alert(
        `Welcome to ${world.name}!`,
        world.description,
        [
          { text: "Explore", onPress: () => {} },
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
        <Pressable style={styles.navButton} onPress={() => Alert.alert('Auctions', 'Auction system coming soon!')}>
          <FontAwesome name="gavel" size={20} color="#8b5cf6" />
          <Text style={styles.navButtonText}>AUCTIONS</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => router.navigate('/(tabs)/bank')}>
          <FontAwesome name="bank" size={20} color="#8b5cf6" />
          <Text style={styles.navButtonText}>BANK</Text>
        </Pressable>
            <Pressable style={styles.navButton} onPress={() => router.navigate('/(tabs)/stocks')}>
              <FontAwesome name="line-chart" size={20} color="#8b5cf6" />
              <Text style={styles.navButtonText}>STOCKS</Text>
            </Pressable>
        <Pressable style={styles.navButton} onPress={() => router.navigate('/(tabs)/nursery')}>
          <FontAwesome name="leaf" size={20} color="#8b5cf6" />
          <Text style={styles.navButtonText}>NURSERY</Text>
        </Pressable>
      </RNView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <RNView style={styles.headerSection}>
          <RNView style={styles.mapSection}>
            <RNView style={styles.mapContainer}>
              <Image 
                source={mapOfPxopiaImage} 
                style={styles.mapOfPxopiaImage}
                resizeMode="contain"
              />
            </RNView>
            <RNView style={styles.mapSummary}>
              <Text style={styles.summaryTitle}>Welcome to Pxopia</Text>
              <Text style={styles.summaryText}>
                A vibrant digital realm where neon-lit suburbs meet mystical forests, 
                cosmic oases, and enchanted islands. Each location offers unique adventures, 
                characters, and treasures waiting to be discovered.
              </Text>
            </RNView>
          </RNView>
        </RNView>

        {/* Worlds List */}
        <Text style={styles.locationsTitle}>LOCATIONS</Text>
        <RNView style={styles.worldsContainer}>
          {worlds.map((world, index) => {
            const isComingSoon = index > 3; // Barrelhaven is at index 3, so everything after is coming soon
            
            return (
              <RNView key={index} style={styles.worldItemContainer}>
                <Pressable 
                  style={[
                    styles.worldItem,
                    isComingSoon && styles.worldItemDisabled
                  ]}
                  onPress={() => !isComingSoon && handleWorldPress(world)}
                  disabled={isComingSoon}
                >
                  <RNView style={[
                    styles.worldIconContainer,
                    isComingSoon && styles.worldIconContainerDisabled
                  ]}>
                    {world.image ? (
                      <Image 
                        source={world.image} 
                        style={[
                          styles.worldImage,
                          isComingSoon && styles.worldImageDisabled
                        ]} 
                      />
                    ) : (
                      <FontAwesome 
                        name={world.icon as any} 
                        size={32} 
                        color={isComingSoon ? '#9ca3af' : world.color} 
                        style={styles.worldIcon} 
                      />
                    )}
                  </RNView>
                  <RNView style={styles.worldContent}>
                    <Text style={[
                      styles.worldName,
                      isComingSoon && styles.worldNameDisabled
                    ]}>
                      {world.name}
                    </Text>
                    <Text style={[
                      styles.worldDescription,
                      isComingSoon && styles.worldDescriptionDisabled
                    ]}>
                      {world.description}
                    </Text>
                  </RNView>
                </Pressable>
                {isComingSoon && (
                  <RNView style={styles.comingSoonOverlay}>
                    <Text style={styles.comingSoonText}>COMING SOON</Text>
                  </RNView>
                )}
              </RNView>
            );
          })}
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
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    minWidth: 70,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  navButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
    paddingHorizontal: 12,
    flexGrow: 1,
  },
  headerSection: {
    width: '100%',
    marginBottom: 24,
  },
  mainTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
  },
  mapSection: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  mapContainer: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  mapSummary: {
    flex: 1,
    justifyContent: 'center',
  },
  summaryTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  summaryText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    lineHeight: 14,
    letterSpacing: 0.2,
  },
  locationsTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
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
    width: 100,
    height: 100,
    borderRadius: 8,
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
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  worldItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.15)',
    padding: 14,
    marginBottom: 10,
    width: '100%',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  worldIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    flexShrink: 0,
  },
  worldIcon: {
    fontSize: 24,
    color: '#8b5cf6',
  },
  worldImage: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
    borderRadius: 6,
  },
  worldContent: {
    flex: 1,
  },
  worldName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  worldDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    lineHeight: 16,
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  worldItemContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 10,
  },
  worldItemDisabled: {
    opacity: 0.6,
  },
  worldIconContainerDisabled: {
    opacity: 0.7,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  worldImageDisabled: {
    opacity: 0.7,
  },
  worldNameDisabled: {
    opacity: 0.7,
  },
  worldDescriptionDisabled: {
    opacity: 0.7,
  },
  comingSoonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.6)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  comingSoonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1.2,
    textShadowColor: '#8b5cf6',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    backgroundColor: 'rgba(139, 92, 246, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
});


