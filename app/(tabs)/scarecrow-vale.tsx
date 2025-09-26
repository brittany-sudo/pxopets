import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import the banner image
const lilScarecrowImage = require('@/assets/images/lil-scarecrow.png');

export default function ScarecrowValeScreen() {
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
      id: 'crop-watching',
      name: 'Crop Watching',
      description: 'Keep watch over the fields and protect the harvest.',
      reward: '20 ⚡',
      difficulty: 'Easy',
      icon: 'eye'
    },
    {
      id: 'scarecrow-building',
      name: 'Scarecrow Building',
      description: 'Craft the perfect scarecrow to guard the crops.',
      reward: '30 ⚡',
      difficulty: 'Medium',
      icon: 'user'
    },
    {
      id: 'field-walking',
      name: 'Field Walking',
      description: 'Take peaceful walks through the golden fields.',
      reward: '15 ⚡',
      difficulty: 'Easy',
      icon: 'road'
    },
    {
      id: 'bird-watching',
      name: 'Bird Watching',
      description: 'Observe the birds that visit the farm fields.',
      reward: '18 ⚡',
      difficulty: 'Easy',
      icon: 'twitter'
    },
    {
      id: 'harvest-helping',
      name: 'Harvest Helping',
      description: 'Assist with the seasonal crop harvest.',
      reward: '35 ⚡',
      difficulty: 'Hard',
      icon: 'leaf'
    },
    {
      id: 'windmill-tending',
      name: 'Windmill Tending',
      description: 'Maintain the old windmill that powers the farm.',
      reward: '25 ⚡',
      difficulty: 'Medium',
      icon: 'cog'
    },
    {
      id: 'farm-animals',
      name: 'Farm Animals',
      description: 'Care for the friendly farm animals.',
      reward: '22 ⚡',
      difficulty: 'Easy',
      icon: 'heart'
    },
    {
      id: 'sunset-meditation',
      name: 'Sunset Meditation',
      description: 'Find peace watching the sun set over the fields.',
      reward: '28 ⚡',
      difficulty: 'Medium',
      icon: 'sun-o'
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
        <Text style={styles.title}>SCARECROW VALE</Text>

        {/* Banner Image */}
        <RNView style={styles.bannerContainer}>
          <Image source={lilScarecrowImage} style={styles.bannerImage} />
        </RNView>

        {/* Description */}
        <Text style={styles.description}>
          Mysterious fields where ancient scarecrows stand silent watch over golden crops. 
          The air is filled with the rustle of wheat and the gentle creaking of old windmills. 
          Here, the boundary between the living and the mystical blurs in the endless horizon.
        </Text>

        {/* Activities Title */}
        <Text style={styles.activitiesTitle}>FARM ACTIVITIES</Text>

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
