import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import activity icons
const cosmicBurgerImage = require('@/assets/images/cosmicburger.png');
const lilAtomicDinerImage = require('@/assets/images/lil-atomic-diner.png');
const lilChipImage = require('@/assets/images/lil-chip.png');

// Image mapping for activities
const activityImageMap: { [key: string]: any } = {
  'cosmicburger.png': cosmicBurgerImage,
  'lil-atomic-diner.png': lilAtomicDinerImage,
  'lil-chip.png': lilChipImage,
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
      description: 'Dine at the retro 50s diner with alien waitstaff.',
      lightning: 15,
      difficulty: 'Easy',
      icon: 'lil-atomic-diner.png'
    },
    {
      id: 'neon-casino',
      name: 'Neon Casino',
      description: 'Try your luck at the glowing slot machines and cosmic card tables.',
      lightning: 25,
      difficulty: 'Medium',
      icon: 'lil-chip.png'
    },
    {
      id: 'hovercar-speedway',
      name: 'Lucky Strike Speedway',
      description: 'Race hover cars across the pink sand dunes at breakneck speeds.',
      lightning: 30,
      difficulty: 'Hard',
      icon: 'cosmicburger.png'
    },
    {
      id: 'hippie-alien-radio',
      name: 'Visit Zephyr',
      description: 'Hang out with Zephyr, the groovy alien DJ who broadcasts cosmic tunes from his airstream.',
      lightning: 20,
      difficulty: 'Easy',
      icon: 'cosmicburger.png'
    },
    {
      id: 'cosmic-gas-station',
      name: 'Cosmic Gas Station',
      description: 'Fuel up your hovercar with stardust and grab space snacks.',
      lightning: 18,
      difficulty: 'Easy',
      icon: 'cosmicburger.png'
    },
    {
      id: 'moonbeam-motel',
      name: 'Moonbeam Motel',
      description: 'Stay at the sketchy motel where neon signs flicker all night.',
      lightning: 22,
      difficulty: 'Medium',
      icon: 'cosmicburger.png'
    },
    {
      id: 'cosmic-drive-in',
      name: 'Cosmic Drive-In',
      description: 'Watch alien movies under the stars from your hovercar.',
      lightning: 28,
      difficulty: 'Medium',
      icon: 'cosmicburger.png'
    },
    {
      id: 'sunset-rest-stop',
      name: 'Sunset Rest Stop',
      description: 'Meditate as the pink sun sets over the dunes at this peaceful oasis.',
      lightning: 12,
      difficulty: 'Easy',
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
          <FontAwesome name="arrow-left" size={12} color="#8b5cf6" />
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

        {/* Description */}
        <Text style={styles.description}>
          A pink desert mirage where hippie aliens and atomic 50s diners coexist in perfect harmony. 
          Neon lights pulse against the endless dunes while hover cars zip between crystal formations. 
          Here, the future meets the past in a kaleidoscope of color and sound.
        </Text>

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
              } else if (activity.id === 'neon-casino') {
                router.navigate('/(tabs)/neon-casino');
              } else if (activity.id === 'hovercar-speedway') {
                router.navigate('/(tabs)/lucky-strike-speedway');
              }
            }}
          >
            <RNView style={styles.activityHeader}>
              <RNView style={styles.activityInfo}>
                <Image source={activityImageMap[activity.icon]} style={styles.activityIcon} />
                    <RNView style={styles.activityText}>
                      <RNView style={styles.activityTitleRow}>
                        <Text style={styles.activityName}>{activity.name}</Text>
                        <RNView style={styles.ticketDisplay}>
                          <FontAwesome name="bolt" size={15} color="#06b6d4" />
                          <Text style={styles.ticketCountText}>{activity.lightning}</Text>
                        </RNView>
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
                  color={favorites.has(activity.id) ? "#94a3b8" : "#94a3b8"} 
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
    backgroundColor: '#f0f9ff',
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
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
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
    fontSize: 12,
    color: '#8b5cf6',
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
    height: 200,
    borderWidth: 2,
    borderColor: '#0ea5e9',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  description: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    lineHeight: 18,
    marginTop: -10,
    marginBottom: 24,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  activitiesTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  activityItem: {
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
    padding: 16,
    marginBottom: 12,
    width: '100%',
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
  activityIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
    alignSelf: 'center',
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
  ticketDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ticketCountText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#06b6d4',
    fontWeight: 'bold',
  },
  activityName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  activityDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#0f172a',
    lineHeight: 16,
  },
  favoriteButton: {
    padding: 4,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  rewardText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
});