import React, { useRef } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, useFocusEffect } from 'expo-router';

// Import images
const vineyardBgImage = require('@/assets/images/vineyard-bg.png');

export default function TheOldWineryScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Reset scroll position when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent}>
        {/* Back Button - Fixed Position */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/barrelhaven')}
        >
          <FontAwesome name="arrow-left" size={12} color="#92400e" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>THE OLD WINERY</Text>
        </RNView>

        {/* Header Image */}
        <Image source={vineyardBgImage} style={styles.headerImage} resizeMode="contain" />

        {/* Description */}
        <RNView style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            The heart of Barrelhaven's winemaking tradition. This centuries-old communal hall has witnessed countless harvests, 
            where villagers gather to transform their grapes into the finest wines. The air is thick with the scent of oak barrels, 
            fermenting grapes, and the stories of generations past.
          </Text>
        </RNView>

        {/* Activities Section */}
        <RNView style={styles.activitiesContainer}>
          <Text style={styles.sectionTitle}>WINEMAKING ACTIVITIES</Text>
          
          {/* Play Cellar Keeper - Featured Game */}
          <Pressable 
            style={styles.featuredGameCard}
            onPress={() => router.navigate('/(tabs)/cellar-keeper')}
          >
            <RNView style={styles.featuredGameHeader}>
              <FontAwesome name="gamepad" size={18} color="#ffffff" />
              <Text style={styles.featuredGameName}>PLAY CELLAR KEEPER</Text>
            </RNView>
            <Text style={styles.featuredGameDescription}>
              Test your wine knowledge and become the master of the cellar! 
              Identify rare vintages and unlock the secrets of Barrelhaven's finest wines.
            </Text>
            <RNView style={styles.playButton}>
              <Text style={styles.playButtonText}>START GAME</Text>
            </RNView>
          </Pressable>
          
          <RNView style={styles.activityCard}>
            <RNView style={styles.activityHeader}>
              <FontAwesome name="leaf" size={16} color="#92400e" />
              <Text style={styles.activityName}>Grape Treading</Text>
            </RNView>
            <Text style={styles.activityDescription}>
              Join the traditional grape treading ceremony during harvest season. 
              Experience the ancient art of crushing grapes with your feet in the communal vats.
            </Text>
          </RNView>

          <RNView style={styles.activityCard}>
            <RNView style={styles.activityHeader}>
              <FontAwesome name="cogs" size={16} color="#92400e" />
              <Text style={styles.activityName}>Barrel Making</Text>
            </RNView>
            <Text style={styles.activityDescription}>
              Learn the craft of cooperage from master barrel makers. 
              Watch as oak staves are shaped and bound to create the perfect aging vessels.
            </Text>
          </RNView>

          <RNView style={styles.activityCard}>
            <RNView style={styles.activityHeader}>
              <FontAwesome name="flask" size={16} color="#92400e" />
              <Text style={styles.activityName}>Wine Tasting</Text>
            </RNView>
            <Text style={styles.activityDescription}>
              Sample the finest vintages from the Old Winery's cellars. 
              Discover the complex flavors that develop through years of careful aging.
            </Text>
          </RNView>

          <RNView style={styles.activityCard}>
            <RNView style={styles.activityHeader}>
              <FontAwesome name="book" size={16} color="#92400e" />
              <Text style={styles.activityName}>Wine History</Text>
            </RNView>
            <Text style={styles.activityDescription}>
              Explore the rich history of winemaking in Barrelhaven. 
              Learn about the families, traditions, and techniques that have shaped this place.
            </Text>
          </RNView>
        </RNView>

        {/* Info Section */}
        <RNView style={styles.infoContainer}>
          <Text style={styles.infoTitle}>About The Old Winery</Text>
          <Text style={styles.infoText}>
            The Old Winery stands as both a place of work and worship, where the sacred act of winemaking 
            brings the community together. Its thick stone walls have absorbed the laughter, songs, and 
            prayers of countless harvest seasons, making it truly the heart of Barrelhaven.
          </Text>
        </RNView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
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
    top: 10,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#92400e',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#92400e',
    marginLeft: 6,
    fontWeight: 'bold',
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 4,
    paddingHorizontal: 40,
    height: 40,
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
    lineHeight: 16,
  },
  headerImage: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    alignSelf: 'center',
  },
  descriptionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#92400e',
  },
  descriptionText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    lineHeight: 18,
    textAlign: 'center',
  },
  activitiesContainer: {
    width: '100%',
    marginBottom: 20,
  },
  featuredGameCard: {
    backgroundColor: '#92400e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#a16207',
    shadowColor: '#92400e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  featuredGameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featuredGameName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 10,
    letterSpacing: 1,
  },
  featuredGameDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#ffffff',
    lineHeight: 18,
    marginBottom: 16,
    opacity: 0.9,
  },
  playButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#a16207',
  },
  playButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#92400e',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#92400e',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#92400e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  activityDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    lineHeight: 16,
  },
  infoContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#92400e',
  },
  infoTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 13,
    color: '#0f172a',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    lineHeight: 18,
    textAlign: 'center',
  },
});
