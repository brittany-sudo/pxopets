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
const volcanoImage = require('@/assets/images/tiny-volcano.png');

export default function EnchantedIslandScreen() {
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
      id: 'hula-dancing',
      name: 'Sacred Hula Dance',
      icon: 'music',
      color: '#f97316',
      description: 'Learn the ancient art of hula dancing with the island spirits. Master traditional moves and unlock mystical powers.',
      reward: 'Hula Master Badge + 25 Gems',
      difficulty: 'Medium'
    },
    {
      id: 'lei-crafting',
      name: 'Flower Lei Weaving',
      icon: 'heart',
      color: '#ec4899',
      description: 'Weave beautiful flower leis using exotic island blooms. Each lei tells a different story of the island.',
      reward: 'Lei Artisan Badge + 15 Gems',
      difficulty: 'Easy'
    },
    {
      id: 'tiki-carving',
      name: 'Tiki Totem Carving',
      icon: 'tree',
      color: '#8b5cf6',
      description: 'Carve mystical tiki totems from sacred wood. Each totem grants protection and good fortune.',
      reward: 'Tiki Carver Badge + 30 Gems',
      difficulty: 'Hard'
    },
    {
      id: 'coconut-harvesting',
      name: 'Coconut Harvest',
      icon: 'circle-o',
      color: '#10b981',
      description: 'Climb palm trees and harvest fresh coconuts. Learn the ancient techniques of the islanders.',
      reward: 'Coconut Master Badge + 20 Gems',
      difficulty: 'Medium'
    },
    {
      id: 'volcano-offering',
      name: 'Volcano Offering Ceremony',
      icon: 'fire',
      color: '#dc2626',
      description: 'Participate in the sacred volcano offering ceremony. Honor the fire spirits with traditional rituals.',
      reward: 'Fire Spirit Blessing + 40 Gems',
      difficulty: 'Hard'
    },
    {
      id: 'tide-pool-exploration',
      name: 'Tide Pool Discovery',
      icon: 'tint',
      color: '#0ea5e9',
      description: 'Explore the magical tide pools at low tide. Discover rare sea creatures and hidden treasures.',
      reward: 'Ocean Explorer Badge + 25 Gems',
      difficulty: 'Easy'
    },
    {
      id: 'drum-circle',
      name: 'Sacred Drum Circle',
      icon: 'circle',
      color: '#f59e0b',
      description: 'Join the island drum circle and learn traditional rhythms. Connect with the heartbeat of the island.',
      reward: 'Rhythm Keeper Badge + 20 Gems',
      difficulty: 'Medium'
    },
    {
      id: 'sunset-meditation',
      name: 'Sunset Meditation',
      icon: 'sun-o',
      color: '#fbbf24',
      description: 'Meditate with the island elders as the sun sets over the ocean. Find inner peace and wisdom.',
      reward: 'Zen Master Badge + 35 Gems',
      difficulty: 'Easy'
    },
    {
      id: 'coral-reef-diving',
      name: 'Coral Reef Diving',
      icon: 'life-ring',
      color: '#06b6d4',
      description: 'Dive into the crystal-clear waters and explore the vibrant coral reefs. Discover underwater wonders.',
      reward: 'Deep Diver Badge + 30 Gems',
      difficulty: 'Hard'
    },
    {
      id: 'banana-boat-race',
      name: 'Banana Boat Racing',
      icon: 'ship',
      color: '#84cc16',
      description: 'Race traditional banana boats around the island. Compete with other adventurers for glory!',
      reward: 'Speed Demon Badge + 25 Gems',
      difficulty: 'Medium'
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
        <Text style={styles.title}>ENCHANTED ISLAND</Text>

        {/* Banner Image */}
        <View style={styles.bannerContainer}>
          <Image
            source={volcanoImage}
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </View>

        {/* Description */}
        <BorderedBox style={styles.descriptionBox}>
          <Text style={styles.description}>
            A mystical Polynesian island with enchanted tiki spirits! Learn ancient hula dances, 
            craft magical leis, explore hidden waterfalls, and discover the secrets of the island's 
            mystical guardians. Perfect for those who love tropical magic and island adventures.
          </Text>
        </BorderedBox>

        {/* Activities */}
        <Text style={styles.activitiesTitle}>ISLAND ACTIVITIES</Text>
        
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
  islandDescription: {
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
});
