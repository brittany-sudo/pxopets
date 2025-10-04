import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import activity icons
const cosmicBurgerImage = require('@/assets/images/cosmicburger.png');
const lilAtomicDinerImage = require('@/assets/images/lil-atomic-diner.png');
const lilChipImage = require('@/assets/images/lil-chip.png');
const lilDieImage = require('@/assets/images/lil-die.png');
const motelKeysImage = require('@/assets/images/motelkeys.png');

// Image mapping for activities
const activityImageMap: { [key: string]: any } = {
  'cosmicburger.png': cosmicBurgerImage,
  'lil-atomic-diner.png': lilAtomicDinerImage,
  'lil-chip.png': lilChipImage,
  'lil-die.png': lilDieImage,
  'motelkeys.png': motelKeysImage,
};

// Import the banner image
const crescentBackgroundImage = require('@/assets/images/crescent-background.png');

export default function CrescentOasisScreen() {
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
      id: 'hovercar-speedway',
      name: 'Hovercar Speedway',
      description: 'Race hovercars across pink sand dunes.',
      icon: 'car'
    },
    {
      id: 'hippie-alien-radio',
      name: 'Hippie Alien Radio',
      description: 'Groovy alien DJ broadcasting cosmic tunes.',
      icon: 'microphone'
    },
    {
      id: 'cosmic-gas-station',
      name: 'Cosmic Gas Station',
      description: 'Fill up on stardust and cosmic fuel.',
      icon: 'tint'
    },
    {
      id: 'cosmic-drive-in',
      name: 'Cosmic Drive-In',
      description: 'Watch alien movies under the desert stars.',
      icon: 'film'
    },
    {
      id: 'sunset-rest-stop',
      name: 'Sunset Rest Stop',
      description: 'Relax and watch the cosmic sunset.',
      icon: 'sun-o'
    },
    {
      id: 'moonbeam-motel',
      name: 'Moonbeam Motel',
      description: 'Sketchy motel with flickering neon signs.',
      icon: 'bed'
    },
    {
      id: 'neon-casino',
      name: 'Neon Casino',
      description: 'Glowing slot machines and cosmic card tables.',
      icon: 'diamond'
    },
    {
      id: 'atomic-diner',
      name: 'Atomic Diner',
      description: 'Retro 50s diner with alien waitstaff.',
      icon: 'cutlery'
    },
    {
      id: 'cactus-garden',
      name: 'Cactus Garden',
      description: 'Desert garden with glowing cacti.',
      icon: 'leaf'
    },
    {
      id: 'stargazing',
      name: 'Stargazing',
      description: 'Watch the cosmic dance of distant stars.',
      icon: 'star'
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
          <FontAwesome name="arrow-left" size={12} color="#ec4899" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>CRESCENT OASIS</Text>
        </RNView>

        {/* Banner Image */}
        <RNView style={styles.bannerContainer}>
          <Image source={crescentBackgroundImage} style={styles.bannerImage} />
        </RNView>

        {/* Activities Title */}
        <Text style={styles.activitiesTitle}>OASIS ACTIVITIES</Text>

        {/* Activities List */}
        {activities.map((activity) => (
          <Pressable 
            key={activity.id} 
            style={styles.activityItem}
            onPress={() => {
              if (activity.id === 'atomic-diner') {
                router.navigate('/(tabs)/atomic-diner');
              } else if (activity.id === 'moonbeam-motel') {
                router.navigate('/(tabs)/moonbeam-motel');
              } else if (activity.id === 'neon-casino') {
                router.navigate('/(tabs)/neon-casino');
              } else if (activity.id === 'hovercar-speedway') {
                router.navigate('/(tabs)/lucky-strike-speedway');
              }
            }}
          >
            <RNView style={styles.activityContent}>
              <RNView style={styles.activityIconContainer}>
                <Image source={activityImageMap[activity.icon]} style={styles.activityIcon} />
              </RNView>
              <RNView style={styles.activityText}>
                <Text style={styles.activityName}>{activity.name}</Text>
                <Text style={styles.activityDescription}>{activity.description}</Text>
              </RNView>
            </RNView>
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
                color={favorites.has(activity.id) ? "#ec4899" : "rgba(236, 72, 153, 0.3)"} 
              />
            </Pressable>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fce7f3', // Light pink desert background
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 4,
    height: 40,
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
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.3)',
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#ec4899',
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
    height: 300,
    borderWidth: 2,
    borderColor: '#ec4899',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
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
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.2)',
    padding: 12,
    marginBottom: 10,
    width: '100%',
    minHeight: 65,
    shadowColor: '#ec4899',
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
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  activityIcon: {
    width: 40,
    height: 40,
    alignSelf: 'center',
    resizeMode: 'contain',
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
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
    borderRadius: 20,
    justifyContent: 'center',
  },
  rewardText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
});