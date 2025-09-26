import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import AppHeader from '@/components/AppHeader';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import the banner image
const staticTvImage = require('@/assets/images/static-tv.png');

export default function PxoburbsScreen() {
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
      id: 'bike-riding',
      name: 'Bike Riding',
      description: 'Cruise through the neighborhood on your trusty bike.',
      reward: '15 ⚡',
      difficulty: 'Easy',
      icon: 'bicycle'
    },
    {
      id: 'keycard-hunt',
      name: 'Lost Motel Key Card Hunt',
      description: 'Find hidden key cards in the abandoned motel.',
      reward: '25 ⚡',
      difficulty: 'Medium',
      icon: 'key'
    },
    {
      id: 'stamp-safari',
      name: 'Stamp Safari',
      description: 'Collect rare stamps from around the world.',
      reward: '20 ⚡',
      difficulty: 'Easy',
      icon: 'book'
    },
    {
      id: 'neighborhood-watch',
      name: 'Neighborhood Watch',
      description: 'Keep an eye on the community and report suspicious activity.',
      reward: '30 ⚡',
      difficulty: 'Medium',
      icon: 'eye'
    },
    {
      id: 'garage-sale',
      name: 'Garage Sale',
      description: 'Browse and buy treasures from your neighbors.',
      reward: '18 ⚡',
      difficulty: 'Easy',
      icon: 'shopping-bag'
    },
    {
      id: 'block-party',
      name: 'Block Party',
      description: 'Join the community celebration with games and food.',
      reward: '35 ⚡',
      difficulty: 'Medium',
      icon: 'music'
    },
    {
      id: 'mail-delivery',
      name: 'Mail Delivery',
      description: 'Help deliver mail to the neighborhood residents.',
      reward: '22 ⚡',
      difficulty: 'Easy',
      icon: 'envelope'
    },
    {
      id: 'treehouse-building',
      name: 'Treehouse Building',
      description: 'Construct the ultimate backyard treehouse.',
      reward: '40 ⚡',
      difficulty: 'Hard',
      icon: 'home'
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
        <Text style={styles.title}>THE PXOBURBS</Text>

        {/* Banner Image */}
        <RNView style={styles.bannerContainer}>
          <Image source={staticTvImage} style={styles.bannerImage} />
        </RNView>

        {/* Description */}
        <Text style={styles.description}>
          A nostalgic 90s suburban neighborhood where every house tells a story. 
          Tree-lined streets, white picket fences, and the hum of lawnmowers create 
          the perfect backdrop for childhood adventures and community connections.
        </Text>

        {/* Activities Title */}
        <Text style={styles.activitiesTitle}>NEIGHBORHOOD ACTIVITIES</Text>

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
