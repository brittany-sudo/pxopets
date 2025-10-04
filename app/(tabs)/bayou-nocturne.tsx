import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useGame } from '@/store/GameStore';
import BorderedBox from '@/components/BorderedBox';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import images
const bayouMainImage = require('@/assets/images/bayou-nocture.png');

export default function BayouNocturneScreen() {
  const { hydrated } = useGame();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Load starred activities from storage
  useEffect(() => {
    loadStarredActivities();
  }, []);

  const loadStarredActivities = async () => {
    try {
      const saved = await AsyncStorage.getItem('starredActivities');
      if (saved) {
        setFavorites(new Set(JSON.parse(saved)));
      }
    } catch (error) {
      console.error('Failed to load starred activities:', error);
    }
  };

  const toggleFavorite = async (activityId: string) => {
    try {
      const newFavorites = new Set(favorites);
      if (newFavorites.has(activityId)) {
        newFavorites.delete(activityId);
      } else {
        newFavorites.add(activityId);
      }
      setFavorites(newFavorites);
      await AsyncStorage.setItem('starredActivities', JSON.stringify([...newFavorites]));
    } catch (error) {
      console.error('Failed to save starred activities:', error);
    }
  };

  const activities = [
    {
      id: 'firefly-glade',
      name: 'Firefly Glade',
      description: 'Mystical clearing where thousands of fireflies create dancing patterns of light.',
      icon: 'star'
    },
    {
      id: 'spirit-dock-boat',
      name: 'Spirit Dock Boat Ride',
      description: 'Pirogue through misty waters where bayou spirits guide your journey.',
      icon: 'ship'
    },
    {
      id: 'voodoo-shack',
      name: 'Voodoo Shack',
      description: 'Mysterious swamp shack where ancient rituals and magical potions await.',
      icon: 'home'
    },
    {
      id: 'skeleton-tavern',
      name: 'Skeleton Tavern',
      description: 'Haunted tavern where skeletal patrons share ghostly tales over spectral drinks.',
      icon: 'glass'
    },
    {
      id: 'cypress-cathedral',
      name: 'Cypress Cathedral',
      description: 'Towering cypress grove where ancient trees form a natural cathedral.',
      icon: 'tree'
    },
    {
      id: 'gator-graveyard',
      name: 'Gator Graveyard',
      description: 'Eerie graveyard where alligator spirits guard the resting place of the bayou.',
      icon: 'bug'
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
          <FontAwesome name="arrow-left" size={12} color="#1f2937" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>BAYOU NOCTURNE</Text>
        </RNView>

        {/* Banner Image */}
        <RNView style={styles.bannerContainer}>
          <Image source={bayouMainImage} style={styles.bannerImage} />
        </RNView>

        {/* Activities Title */}
        <Text style={styles.activitiesTitle}>BAYOU ADVENTURES</Text>

        {/* Activities List */}
        {activities.map((activity) => {
          const handleActivityPress = () => {
            // Add navigation for other locations here in the future
          };

          const content = (
            <RNView style={styles.activityContent}>
              <RNView style={styles.activityIconContainer}>
                <FontAwesome name={activity.icon as any} size={20} color="#1f2937" />
              </RNView>
              <RNView style={styles.activityText}>
                <Text style={styles.activityName}>{activity.name}</Text>
                <Text style={styles.activityDescription}>{activity.description}</Text>
              </RNView>
            </RNView>
          );

          return (
            <Pressable key={activity.id} style={styles.activityItem} onPress={handleActivityPress}>
              {content}
              <Pressable
                style={styles.favoriteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  toggleFavorite(activity.id);
                }}
              >
                <FontAwesome 
                  name={favorites.has(activity.id) ? "star" : "star-o"} 
                  size={16} 
                  color={favorites.has(activity.id) ? "#1f2937" : "rgba(31, 41, 55, 0.3)"} 
                />
              </Pressable>
            </Pressable>
          );
        })}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb', // Light gray background
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
    backgroundColor: 'rgba(31, 41, 55, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(31, 41, 55, 0.3)',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#1f2937',
    marginLeft: 6,
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 4,
    height: 40,
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  bannerContainer: {
    width: '100%',
    height: 280,
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
  },
  activitiesTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
    marginTop: 16,
    textAlign: 'left',
    alignSelf: 'flex-start',
    width: '100%',
    textTransform: 'uppercase',
  },
  activityItem: {
    backgroundColor: 'rgba(31, 41, 55, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(31, 41, 55, 0.2)',
    padding: 12,
    marginBottom: 10,
    width: '100%',
    minHeight: 65,
    shadowColor: '#1f2937',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 35, // Space for favorite button
  },
  activityIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(31, 41, 55, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  activityText: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  activityName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 11,
    color: '#0f172a',
    marginBottom: 2,
    lineHeight: 14,
    textTransform: 'uppercase',
    textAlign: 'left',
  },
  activityDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    lineHeight: 13,
    textAlign: 'left',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    backgroundColor: 'rgba(31, 41, 55, 0.05)',
    borderRadius: 20,
    justifyContent: 'center',
  },
});
