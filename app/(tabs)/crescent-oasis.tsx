import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

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
      id: 'atomic-diner',
      name: 'Atomic Diner',
      description: 'Retro 50s diner with alien waitstaff.',
      icon: 'lil-atomic-diner.png'
    },
    {
      id: 'moonbeam-motel',
      name: 'Moonbeam Motel',
      description: 'Sketchy motel with flickering neon signs.',
      icon: 'motelkeys.png'
    },
    {
      id: 'neon-casino',
      name: 'Neon Casino',
      description: 'Glowing slot machines and cosmic card tables.',
      icon: 'lil-die.png'
    },
    {
      id: 'hovercar-speedway',
      name: 'Lucky Strike Speedway',
      description: 'Race hovercars across pink sand dunes.',
      icon: 'cosmicburger.png'
    },
    {
      id: 'hippie-alien-radio',
      name: 'Visit Zephyr',
      description: 'Groovy alien DJ broadcasting cosmic tunes.',
      icon: 'cosmicburger.png'
    },
    {
      id: 'cosmic-gas-station',
      name: 'Cosmic Gas Station',
      description: 'Fuel hovercars with stardust and space snacks.',
      icon: 'cosmicburger.png'
    },
    {
      id: 'cosmic-drive-in',
      name: 'Cosmic Drive-In',
      description: 'Watch alien movies under the stars.',
      icon: 'cosmicburger.png'
    },
    {
      id: 'sunset-rest-stop',
      name: 'Sunset Rest Stop',
      description: 'Meditate as the pink sun sets over dunes.',
      icon: 'cosmicburger.png'
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
            <RNView style={styles.activityHeader}>
              <RNView style={styles.activityInfo}>
                <RNView style={styles.activityIconContainer}>
                  <Image source={activityImageMap[activity.icon]} style={styles.activityIcon} />
                </RNView>
                    <RNView style={styles.activityText}>
                      <RNView style={styles.activityTitleRow}>
                        <Text style={styles.activityName}>{activity.name}</Text>
                      </RNView>
                      <Text style={styles.activityDescription}>{activity.description}</Text>
                    </RNView>
              </RNView>
            </RNView>
            <RNView style={styles.activityFooter}>
              <Pressable
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(activity.id)}
              >
                <FontAwesome 
                  name={favorites.has(activity.id) ? "star" : "star-o"} 
                  size={16} 
                  color={favorites.has(activity.id) ? "#ec4899" : "rgba(236, 72, 153, 0.3)"} 
                />
              </Pressable>
            </RNView>
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
    padding: 20,
    paddingTop: 80,
    paddingBottom: 100,
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: -20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
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
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  activityItem: {
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.2)',
    padding: 12,
    marginBottom: 10,
    width: '100%',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  activityInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  activityIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  activityText: {
    flex: 1,
    marginLeft: 8,
  },
  activityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  activityName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 3,
    textAlign: 'left',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  activityDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    lineHeight: 15,
    textAlign: 'justify',
  },
  favoriteButton: {
    padding: 4,
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
  },
  activityFooter: {
    position: 'absolute',
    top: 12,
    right: 12,
    justifyContent: 'center',
  },
  rewardText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
});