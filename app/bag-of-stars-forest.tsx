import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import AppHeader from '@/components/AppHeader';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import the banner image
const totemGuyImage = require('@/assets/images/lil-totem-guy.png');

export default function BagOfStarsForestScreen() {
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
      id: 'star-gazing',
      name: 'Star Gazing',
      description: 'Watch stars fall like leaves in the enchanted canopy',
      reward: '5 Gems',
      difficulty: 'Easy',
      icon: 'star'
    },
    {
      id: 'totem-carving',
      name: 'Totem Carving',
      description: 'Carve mystical totems from fallen starwood',
      reward: '8 Gems',
      difficulty: 'Medium',
      icon: 'tree'
    },
    {
      id: 'spirit-communion',
      name: 'Spirit Communion',
      description: 'Connect with ancient forest spirits',
      reward: '12 Gems',
      difficulty: 'Hard',
      icon: 'heart'
    },
    {
      id: 'moonlight-dance',
      name: 'Moonlight Dance',
      description: 'Dance under the silver moonbeams',
      reward: '6 Gems',
      difficulty: 'Easy',
      icon: 'music'
    },
    {
      id: 'crystal-hunting',
      name: 'Crystal Hunting',
      description: 'Search for fallen star crystals',
      reward: '10 Gems',
      difficulty: 'Medium',
      icon: 'diamond'
    },
    {
      id: 'forest-meditation',
      name: 'Forest Meditation',
      description: 'Find inner peace among the ancient trees',
      reward: '7 Gems',
      difficulty: 'Easy',
      icon: 'leaf'
    },
    {
      id: 'spirit-guide',
      name: 'Spirit Guide',
      description: 'Lead lost travelers through the mystical paths',
      reward: '15 Gems',
      difficulty: 'Hard',
      icon: 'compass'
    },
    {
      id: 'star-blessing',
      name: 'Star Blessing',
      description: 'Receive blessings from the falling stars',
      reward: '9 Gems',
      difficulty: 'Medium',
      icon: 'magic'
    }
  ];

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={16} color="#0f172a" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Title */}
        <Text style={styles.title}>BAG OF STARS FOREST</Text>

        {/* Banner Image */}
        <RNView style={styles.bannerContainer}>
          <Image source={totemGuyImage} style={styles.bannerImage} />
        </RNView>

        {/* Description */}
        <Text style={styles.description}>
          An enchanted forest where stars fall like leaves from the mystical canopy. 
          Ancient totems watch over travelers, and forest spirits guide the way through 
          moonlit paths. Here, the boundary between earth and sky blurs in eternal twilight.
        </Text>

        {/* Activities Title */}
        <Text style={styles.activitiesTitle}>FOREST ACTIVITIES</Text>

        {/* Activities List */}
        {activities.map((activity) => (
          <RNView key={activity.id} style={styles.activityItem}>
            <RNView style={styles.activityHeader}>
              <RNView style={styles.activityInfo}>
                <FontAwesome name={activity.icon as any} size={20} color="#8b5cf6" style={styles.activityIcon} />
                <RNView style={styles.activityText}>
                  <Text style={styles.activityName}>{activity.name}</Text>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                </RNView>
              </RNView>
              <Pressable
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(activity.id)}
              >
                <FontAwesome 
                  name={favorites.has(activity.id) ? "star" : "star-o"} 
                  size={16} 
                  color={favorites.has(activity.id) ? "#fbbf24" : "#6b7280"} 
                />
              </Pressable>
            </RNView>
            <RNView style={styles.activityFooter}>
              <Text style={styles.rewardText}>{activity.reward}</Text>
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
    backgroundColor: '#f0f9ff',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingBottom: 100,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    marginLeft: 6,
  },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 20,
    textAlign: 'left',
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
  description: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    lineHeight: 18,
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
    marginRight: 12,
    marginTop: 2,
  },
  activityText: {
    flex: 1,
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
});
