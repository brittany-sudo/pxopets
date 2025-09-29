import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useGame } from '@/store/GameStore';
import BorderedBox from '@/components/BorderedBox';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import images
const lumenMainImage = require('@/assets/images/lil-tent-goss.png'); // Placeholder

export default function LumenBazaarScreen() {
  const { hydrated } = useGame();
  if (!hydrated) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button - Fixed Position */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/explore')}
        >
          <FontAwesome name="arrow-left" size={12} color="#8b5cf6" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>LUMEN BAZAAR</Text>
        </RNView>

        {/* Banner Image */}
        <RNView style={styles.bannerContainer}>
          <Image 
            source={lumenMainImage} 
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </RNView>

        {/* Description */}
        <Text style={styles.description}>
          A glowing marketplace where merchants trade in pure light and luminous curiosities. 
          Lanterns float through the air, casting dancing shadows as vendors showcase their 
          radiant wares in this eternal twilight bazaar.
        </Text>

        {/* Coming Soon */}
        <BorderedBox>
          <Text style={styles.comingSoon}>Coming Soon!</Text>
          <Text style={styles.comingSoonDescription}>
            This luminous marketplace is still being built. Check back soon for adventures in the glowing bazaar!
          </Text>
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
    paddingTop: 0,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    marginLeft: 6,
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 4,
    height: 40,
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  bannerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  bannerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  description: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  comingSoon: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 10,
  },
  comingSoonDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 14,
  },
});
