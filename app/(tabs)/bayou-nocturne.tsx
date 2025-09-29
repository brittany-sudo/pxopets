import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useGame } from '@/store/GameStore';
import BorderedBox from '@/components/BorderedBox';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import images
const bayouMainImage = require('@/assets/images/bayou-nocture.png');

export default function BayouNocturneScreen() {
  const { hydrated } = useGame();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (activityId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(activityId)) {
        newFavorites.delete(activityId);
      } else {
        newFavorites.add(activityId);
      }
      return newFavorites;
    });
  };

  const activities = [
    {
      id: 'firefly-glade',
      name: 'Firefly Glade',
      description: 'Wander through a mystical clearing where thousands of fireflies create dancing patterns of light.',
      icon: 'star',
      difficulty: 'Easy'
    },
    {
      id: 'spirit-dock-boat',
      name: 'Spirit Dock Boat Ride',
      description: 'Take a pirogue through the misty waters where spirits of the bayou guide your journey.',
      icon: 'ship',
      difficulty: 'Medium'
    },
    {
      id: 'voodoo-shack',
      name: 'Voodoo Shack',
      description: 'Visit the mysterious swamp shack where ancient rituals and magical potions await.',
      icon: 'home',
      difficulty: 'Hard'
    },
    {
      id: 'skeleton-tavern',
      name: 'Skeleton Tavern',
      description: 'Enter the haunted tavern where skeletal patrons share ghostly tales over spectral drinks.',
      icon: 'glass',
      difficulty: 'Medium'
    },
    {
      id: 'cypress-cathedral',
      name: 'Cypress Cathedral',
      description: 'Explore the towering cypress grove where ancient trees form a natural cathedral.',
      icon: 'tree',
      difficulty: 'Easy'
    },
    {
      id: 'gator-graveyard',
      name: 'Gator Graveyard',
      description: 'Navigate the eerie graveyard where alligator spirits guard the resting place of the bayou.',
      icon: 'bug',
      difficulty: 'Hard'
    }
  ];

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
          <Text style={styles.locationTitle}>BAYOU NOCTURNE</Text>
        </RNView>

        {/* Banner Image */}
        <RNView style={styles.bannerContainer}>
          <Image 
            source={bayouMainImage} 
            style={styles.bannerImage}
          />
        </RNView>

        {/* Description */}
        <Text style={styles.description}>
          A mysterious swamp where fireflies dance with ancient spirits under moonlit cypress trees. 
          The bayou whispers secrets to those brave enough to listen, while glowing orbs guide lost souls 
          through the misty waters.
        </Text>

        {/* Activities Title */}
        <Text style={styles.activitiesTitle}>BAYOU ADVENTURES</Text>

        {/* Activities List */}
        {activities.map((activity) => (
          <RNView key={activity.id} style={styles.activityItem}>
            <RNView style={styles.activityHeader}>
              <RNView style={styles.activityInfo}>
                <FontAwesome name={activity.icon as any} size={22} color="#1f2937" style={styles.activityIcon} />
                <RNView style={styles.activityText}>
                  <RNView style={styles.activityTitleRow}>
                    <Text style={styles.activityName}>{activity.name}</Text>
                  </RNView>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                </RNView>
              </RNView>
            </RNView>
            <RNView style={styles.activityFooter}>
              <RNView style={styles.difficultyContainer}>
                <Text style={styles.difficultyLabel}>Difficulty:</Text>
                <Text style={styles.difficultyValue}>{activity.difficulty}</Text>
              </RNView>
              <Pressable
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(activity.id)}
              >
                <FontAwesome 
                  name={favorites.has(activity.id) ? "star" : "star-o"} 
                  size={16} 
                  color={favorites.has(activity.id) ? "#fbbf24" : "rgba(31, 41, 55, 0.3)"} 
                />
              </Pressable>
            </RNView>
          </RNView>
        ))}

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
    height: 200,
    borderWidth: 2,
    borderColor: '#1f2937',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(31, 41, 55, 0.05)',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 6,
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
  activitiesTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
  },
  activityItem: {
    backgroundColor: 'rgba(31, 41, 55, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(31, 41, 55, 0.2)',
    padding: 16,
    marginBottom: 12,
    width: '100%',
    shadowColor: '#1f2937',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  activityInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  activityIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  activityText: {
    flex: 1,
  },
  activityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  activityDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#4b5563',
    lineHeight: 16,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#6b7280',
    marginRight: 4,
  },
  difficultyValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  favoriteButton: {
    padding: 4,
  },
});
