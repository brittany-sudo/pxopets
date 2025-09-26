import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import the banner image
const shakespeareQuartImage = require('@/assets/images/shakespeare-quart.png');

export default function ArtisanQuarterScreen() {
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
      id: 'masquerade-hall',
      name: 'Masquerade Hall',
      description: 'Weekly balls with elegant dancing and mysterious masks.',
      reward: '25 Gems',
      difficulty: 'Medium',
      icon: 'theater-masks'
    },
    {
      id: 'pottery-workshop',
      name: 'Pottery Workshop',
      description: 'Shape clay into beautiful vessels on ancient wheels.',
      reward: '12 Gems',
      difficulty: 'Medium',
      icon: 'circle'
    },
    {
      id: 'weaving-circle',
      name: 'Weaving Circle',
      description: 'Learn traditional textile arts from master weavers.',
      reward: '10 Gems',
      difficulty: 'Medium',
      icon: 'th'
    },
    {
      id: 'jewelry-making',
      name: 'Jewelry Making',
      description: 'Craft intricate pieces from precious metals and gems.',
      reward: '15 Gems',
      difficulty: 'Hard',
      icon: 'diamond'
    },
    {
      id: 'painting-studio',
      name: 'Painting Studio',
      description: 'Express your creativity on canvas with master artists.',
      reward: '8 Gems',
      difficulty: 'Easy',
      icon: 'paint-brush'
    },
    {
      id: 'sculpture-garden',
      name: 'Sculpture Garden',
      description: 'Carve stone and wood into magnificent sculptures.',
      reward: '18 Gems',
      difficulty: 'Hard',
      icon: 'cube'
    },
    {
      id: 'textile-dyeing',
      name: 'Textile Dyeing',
      description: 'Create vibrant colors using natural plant dyes.',
      reward: '9 Gems',
      difficulty: 'Easy',
      icon: 'tint'
    },
    {
      id: 'art-gallery',
      name: 'Art Gallery',
      description: 'Display your creations in the community gallery.',
      reward: '25 Gems',
      difficulty: 'Medium',
      icon: 'picture-o'
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/explore')}
        >
          <FontAwesome name="arrow-left" size={16} color="#0f172a" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Title */}
        <Text style={styles.title}>SHAKESPEARE'S QUARTER</Text>

        {/* Banner Image */}
        <RNView style={styles.bannerContainer}>
          <Image source={shakespeareQuartImage} style={styles.bannerImage} />
        </RNView>

        {/* Description */}
        <Text style={styles.description}>
          A bohemian arts district where creativity flows like wine. Master craftspeople 
          work in open studios, sharing techniques passed down through generations. 
          Here, every street corner bursts with color, texture, and artistic expression.
        </Text>

        {/* Activities Title */}
        <Text style={styles.activitiesTitle}>ARTISTIC ACTIVITIES</Text>

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
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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