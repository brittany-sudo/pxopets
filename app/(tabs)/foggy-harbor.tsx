import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import the banner image
const lilAnchorImage = require('@/assets/images/lil-anchor.png');

export default function FoggyHarborScreen() {
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
      id: 'lobster-trap',
      name: 'Lobster Trap Master',
      description: 'Learn the ancient art of lobster trapping from weathered old salts.',
      reward: '50 Gems',
      difficulty: 'Medium',
      icon: 'anchor'
    },
    {
      id: 'fog-navigation',
      name: 'Fog Navigation',
      description: 'Master the art of navigating through thick coastal fog.',
      reward: '75 Gems',
      difficulty: 'Hard',
      icon: 'compass'
    },
    {
      id: 'tall-tales',
      name: 'Tall Tales Tavern',
      description: 'Gather around the crackling fire at the Rusty Anchor Tavern.',
      reward: '25 Gems',
      difficulty: 'Easy',
      icon: 'glass'
    },
    {
      id: 'lighthouse-keeper',
      name: 'Lighthouse Keeper',
      description: 'Tend to the ancient lighthouse that guides ships through treacherous waters.',
      reward: '60 Gems',
      difficulty: 'Medium',
      icon: 'lightbulb-o'
    },
    {
      id: 'storm-watching',
      name: 'Storm Watching',
      description: 'Experience the raw power of Atlantic storms from the harbor breakwater.',
      reward: '30 Gems',
      difficulty: 'Easy',
      icon: 'cloud'
    },
    {
      id: 'net-mending',
      name: 'Net Mending',
      description: 'Learn the traditional craft of mending fishing nets.',
      reward: '20 Gems',
      difficulty: 'Easy',
      icon: 'th'
    },
    {
      id: 'harbor-mystery',
      name: 'Harbor Mystery',
      description: 'Investigate the mysterious disappearances that have plagued the harbor.',
      reward: '100 Gems',
      difficulty: 'Hard',
      icon: 'search'
    },
    {
      id: 'fog-horn',
      name: 'Fog Horn Keeper',
      description: 'Operate the town\'s iconic fog horn that echoes across the harbor.',
      reward: '45 Gems',
      difficulty: 'Medium',
      icon: 'volume-up'
    }
  ];

  return (
    <View style={styles.container}>
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
        <Text style={styles.title}>FOGGY HARBOR</Text>

        {/* Banner Image */}
        <RNView style={styles.bannerContainer}>
          <Image source={lilAnchorImage} style={styles.bannerImage} />
        </RNView>

        {/* Description */}
        <Text style={styles.description}>
          A dreary Maine fishing town shrouded in mist and mystery. Weathered lobster boats 
          bob in the harbor while ancient lighthouses guide ships through treacherous waters. 
          Here, the line between reality and legend blurs in the eternal fog.
        </Text>

        {/* Activities Title */}
        <Text style={styles.activitiesTitle}>HARBOR ACTIVITIES</Text>

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