import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Pressable, Alert, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import BorderedBox from '@/components/BorderedBox';
import JazzyTitle from '@/components/JazzyTitle';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import AppHeader from '@/components/AppHeader';
import BottomNavigation from '@/components/BottomNavigation';

// Import banner image
const neonBurgerImage = require('@/assets/images/neon-burger.png');

export default function CrescentOasisScreen() {
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (activityId: string) => {
    setFavorites(prev => 
      prev.includes(activityId) 
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const activities = [
    {
      id: 'alien-encounter',
      name: 'Hippie Alien Meet & Greet',
      icon: 'user',
      color: '#ec4899',
      description: 'Meet peaceful extraterrestrial beings who love peace, love, and cosmic vibes.',
      reward: 'Cosmic Friend Badge + 30 Gems',
      difficulty: 'Easy'
    },
    {
      id: 'atomic-diner',
      name: 'Atomic Diner Experience',
      icon: 'cutlery',
      color: '#f59e0b',
      description: 'Dine at retro-futuristic 50s diners with neon lights and space-age decor.',
      reward: 'Atomic Eater Badge + 25 Gems',
      difficulty: 'Easy'
    },
    {
      id: 'desert-mirage',
      name: 'Pink Desert Mirage',
      icon: 'sun-o',
      color: '#f97316',
      description: 'Explore the surreal pink desert landscape where reality bends and shifts.',
      reward: 'Mirage Walker Badge + 35 Gems',
      difficulty: 'Medium'
    },
    {
      id: 'ufo-riding',
      name: 'UFO Joyride',
      icon: 'circle-o',
      color: '#8b5cf6',
      description: 'Take a wild ride on friendly alien spacecraft through the pink desert skies.',
      reward: 'Sky Rider Badge + 40 Gems',
      difficulty: 'Hard'
    },
    {
      id: 'cosmic-dancing',
      name: 'Intergalactic Dance Party',
      icon: 'music',
      color: '#10b981',
      description: 'Join hippie aliens in groovy cosmic dance sessions under the desert stars.',
      reward: 'Space Dancer Badge + 20 Gems',
      difficulty: 'Easy'
    },
    {
      id: 'neon-sign-making',
      name: 'Neon Sign Crafting',
      icon: 'lightbulb-o',
      color: '#06b6d4',
      description: 'Create glowing neon signs for the atomic diners using alien technology.',
      reward: 'Neon Artist Badge + 30 Gems',
      difficulty: 'Medium'
    },
    {
      id: 'crystal-hunting',
      name: 'Desert Crystal Hunt',
      icon: 'diamond',
      color: '#dc2626',
      description: 'Search for rare pink crystals that power the alien technology in the oasis.',
      reward: 'Crystal Hunter Badge + 35 Gems',
      difficulty: 'Medium'
    },
    {
      id: 'telepathy-lessons',
      name: 'Alien Telepathy Training',
      icon: 'eye',
      color: '#7c3aed',
      description: 'Learn to communicate with hippie aliens through peaceful mind-to-mind contact.',
      reward: 'Mind Reader Badge + 45 Gems',
      difficulty: 'Hard'
    },
    {
      id: 'retro-cooking',
      name: 'Atomic Age Cooking',
      icon: 'flask',
      color: '#84cc16',
      description: 'Master the art of 50s diner cooking with a futuristic twist and alien ingredients.',
      reward: 'Atomic Chef Badge + 25 Gems',
      difficulty: 'Medium'
    },
    {
      id: 'desert-meditation',
      name: 'Cosmic Desert Meditation',
      icon: 'leaf',
      color: '#64748b',
      description: 'Find inner peace in the pink desert with guided meditation from wise alien elders.',
      reward: 'Zen Master Badge + 20 Gems',
      difficulty: 'Easy'
    }
  ];

  const handleActivityPress = (activity: any) => {
    Alert.alert(
      `${activity.name}`,
      `${activity.description}\n\nDifficulty: ${activity.difficulty}\nReward: ${activity.reward}\n\nComing Soon!`,
      [
        { text: "Start Activity", onPress: () => console.log(`Starting ${activity.name}`) },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={16} color="#0f172a" />
            <Text style={styles.backButtonText}>BACK</Text>
          </Pressable>
          <View style={styles.placeholder} />
        </View>

        {/* Title */}
        <Text style={styles.title}>CRESCENT OASIS</Text>

        {/* Banner Image */}
        <View style={styles.bannerContainer}>
          <Image
            source={neonBurgerImage}
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </View>

        {/* Description */}
        <BorderedBox style={styles.descriptionBox}>
          <Text style={styles.description}>
            Pink desert mirage with hippie aliens and atomic 50s diners. Where the wealthy come to play 
            in a luxurious Palm Springs-style resort. High-stakes poker in air-conditioned suites, 
            champagne by the infinity pool, and the kind of decadent gambling that would make even 
            the White Lotus eaters jealous. Where fortunes are won and lost in the desert heat.
          </Text>
        </BorderedBox>

        {/* Activities */}
        <Text style={styles.activitiesTitle}>OASIS EXPERIENCES</Text>
        
        {activities.map((activity) => (
          <BorderedBox key={activity.id} style={styles.activityBox}>
            <Pressable 
              style={styles.activityContent}
              onPress={() => handleActivityPress(activity)}
            >
              <View style={styles.activityHeader}>
                <FontAwesome name={activity.icon as any} size={24} color={activity.color} />
                <View style={styles.activityInfo}>
                  <Text style={styles.activityName}>{activity.name}</Text>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                </View>
                <Pressable 
                  style={styles.starButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleFavorite(activity.id);
                  }}
                >
                  <FontAwesome 
                    name={favorites.includes(activity.id) ? 'star' : 'star-o'} 
                    size={20} 
                    color="#f59e0b" 
                  />
                </Pressable>
              </View>
              <View style={styles.activityFooter}>
                <Text style={styles.difficulty}>{activity.difficulty}</Text>
                <Text style={styles.reward}>{activity.reward}</Text>
              </View>
            </Pressable>
          </BorderedBox>
        ))}
      </ScrollView>
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#0ea5e9',
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 4,
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  placeholder: {
    flex: 1,
  },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'left',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  oasisDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    lineHeight: 18,
    textAlign: 'left',
  },
  activitiesTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'left',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  activitiesList: {
    width: '100%',
    gap: 12,
  },
  activityItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#0ea5e9',
    borderRadius: 6,
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  activityInfo: {
    flex: 1,
  },
  starButton: {
    padding: 4,
  },
  activityName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  activityDifficulty: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
  },
  activityDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    lineHeight: 14,
    marginBottom: 6,
  },
  activityReward: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#10b981',
    fontWeight: 'bold',
  },
  descriptionBox: {
    width: '100%',
    marginBottom: 30,
  },
  description: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    lineHeight: 18,
    textAlign: 'left',
  },
  activityBox: {
    width: '100%',
    marginBottom: 12,
  },
  activityContent: {
    width: '100%',
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficulty: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    opacity: 0.6,
  },
  reward: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#10b981',
    fontWeight: 'bold',
  },
  bannerContainer: {
    width: '100%',
    height: 200,
    borderWidth: 2,
    borderColor: '#0ea5e9',
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
  },
  bannerImage: {
    width: 150,
    height: 150,
  },
});
