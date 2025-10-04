import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import the banner image
const lilWineCasketImage = require('@/assets/images/lil-wine-casket.png');
const vineyardBgImage = require('@/assets/images/vineyard-bg.png');

export default function BarrelhavenScreen() {
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
      id: 'wine-tasting',
      name: 'Wine Tasting',
      description: 'Central piazza with cobblestone and vine-wrapped fountain.',
      icon: 'glass'
    },
    {
      id: 'ivy-post',
      name: 'Ivy Post',
      description: 'Cozy tavern with thick beams and outdoor grape arbors.',
      icon: 'envelope'
    },
    {
      id: 'treading-fields',
      name: 'Treading Fields',
      description: 'Terraced vineyards with olive groves and stone farmhouses.',
      icon: 'leaf'
    },
    {
      id: 'craftsmens-row',
      name: 'Craftsmen\'s Row',
      description: 'Narrow street of workshops with hammer clinks and beeswax.',
      icon: 'wrench'
    },
    {
      id: 'cellar-row',
      name: 'Cellar Row',
      description: 'Cool underground passages carved into the hillside.',
      icon: 'arrow-down'
    },
    {
      id: 'winery-chapel',
      name: 'Winery Chapel',
      description: 'Peaceful chapel nestled among the vineyards.',
      icon: 'heart'
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button - Fixed Position */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/explore')}
        >
          <FontAwesome name="arrow-left" size={12} color="#92400e" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>BARRELHAVEN</Text>
        </RNView>

        {/* Banner Image */}
        <RNView style={styles.bannerContainer}>
          <Image source={vineyardBgImage} style={styles.bannerImage} />
        </RNView>

        {/* Activities Title */}
        <Text style={styles.activitiesTitle}>VILLAGE LOCATIONS</Text>

        {/* Activities List */}
        {activities.map((activity) => {
          const handleActivityPress = () => {
            switch (activity.id) {
              case 'treading-fields':
                router.navigate('/(tabs)/treading-fields');
                break;
              case 'wine-tasting':
                router.navigate('/(tabs)/wine-tasting');
                break;
              case 'ivy-post':
                router.navigate('/(tabs)/ivy-post');
                break;
              case 'craftsmens-row':
                router.navigate('/(tabs)/craftsmens-row');
                break;
              case 'cellar-row':
                router.navigate('/(tabs)/cellar-row');
                break;
              case 'winery-chapel':
                router.navigate('/(tabs)/winery-chapel');
                break;
              default:
                // No navigation for now
                break;
            }
          };

          const content = (
            <RNView style={styles.activityContent}>
              <RNView style={styles.activityIconContainer}>
                <FontAwesome name={activity.icon as any} size={20} color="#92400e" />
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
                  color={favorites.has(activity.id) ? "#92400e" : "rgba(146, 64, 14, 0.3)"} 
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
    backgroundColor: '#fef7f0', // Light wine/burgundy background
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
    backgroundColor: 'rgba(146, 64, 14, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(146, 64, 14, 0.3)',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#92400e',
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
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  bannerContainer: {
    width: '100%',
    height: 280,
    borderWidth: 2,
    borderColor: '#92400e',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(146, 64, 14, 0.05)',
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
    backgroundColor: 'rgba(146, 64, 14, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(146, 64, 14, 0.2)',
    padding: 12,
    marginBottom: 10,
    width: '100%',
    minHeight: 65,
    shadowColor: '#92400e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  activityPressable: {
    width: '100%',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  activityInfo: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 0,
    minHeight: 50,
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
    backgroundColor: 'rgba(146, 64, 14, 0.1)',
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
    backgroundColor: 'rgba(146, 64, 14, 0.05)',
    borderRadius: 20,
    justifyContent: 'center',
  },
});