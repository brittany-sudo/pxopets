import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import the banner image
const lilPopcornImage = require('@/assets/images/lil-popcorn.png');

export default function GossamerMidwayScreen() {
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
      id: 'moonlight-carousel',
      name: 'Moonlight Carousel',
      description: 'Ride ethereal horses that glow under the lunar light.',
      lightning: 30,
      difficulty: 'Easy',
      icon: 'star'
    },
    {
      id: 'fortune-teller',
      name: 'Mystic Fortune Teller',
      description: 'Have your future read by the mysterious Madame Luna.',
      lightning: 40,
      difficulty: 'Medium',
      icon: 'eye'
    },
    {
      id: 'phantom-ferris',
      name: 'Phantom Ferris Wheel',
      description: 'Soar through the night sky on this ghostly ride.',
      lightning: 35,
      difficulty: 'Medium',
      icon: 'circle'
    },
    {
      id: 'crystal-maze',
      name: 'Crystal Mirror Maze',
      description: 'Navigate through an endless maze of reflections.',
      lightning: 45,
      difficulty: 'Hard',
      icon: 'square'
    },
    {
      id: 'moon-cakes',
      name: 'Lunar Treats Stand',
      description: 'Sample otherworldly confections that shimmer like stardust.',
      lightning: 25,
      difficulty: 'Easy',
      icon: 'heart'
    },
    {
      id: 'shadow-puppets',
      name: 'Shadow Puppet Theater',
      description: 'Watch stories unfold in dancing shadows.',
      lightning: 20,
      difficulty: 'Easy',
      icon: 'play'
    },
    {
      id: 'cosmic-games',
      name: 'Cosmic Ring Toss',
      description: 'Toss rings at floating planets and stars.',
      lightning: 38,
      difficulty: 'Medium',
      icon: 'bullseye'
    },
    {
      id: 'midnight-photography',
      name: 'Midnight Photography',
      description: 'Capture the carnival\'s ethereal beauty under the moon.',
      lightning: 50,
      difficulty: 'Hard',
      icon: 'camera'
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
          <FontAwesome name="arrow-left" size={14} color="#0ea5e9" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>GOSSAMER MIDWAY</Text>
        </RNView>

        {/* Title */}
        <Text style={styles.title}>GOSSAMER MIDWAY</Text>

        {/* Banner Image */}
        <RNView style={styles.bannerContainer}>
          <Image source={lilPopcornImage} style={styles.bannerImage} />
        </RNView>

        {/* Description */}
        <Text style={styles.description}>
          A surreal traveling carnival that only appears under certain moons. 
          Step into a world where reality bends and magic flows through every attraction.
        </Text>

        {/* Activities Title */}
        <Text style={styles.activitiesTitle}>CARNIVAL ATTRACTIONS</Text>

        {/* Activities List */}
        {activities.map((activity) => (
          <RNView key={activity.id} style={styles.activityItem}>
            <RNView style={styles.activityHeader}>
              <RNView style={styles.activityInfo}>
                <FontAwesome name={activity.icon as any} size={22} color="#8b5cf6" style={styles.activityIcon} />
                    <RNView style={styles.activityText}>
                      <RNView style={styles.activityTitleRow}>
                        <Text style={styles.activityName}>{activity.name}</Text>
                        <RNView style={styles.ticketDisplay}>
                          <FontAwesome name="bolt" size={14} color="#06b6d4" />
                          <Text style={styles.ticketCountText}>{activity.lightning}</Text>
                        </RNView>
                      </RNView>
                      <Text style={styles.activityDescription}>{activity.description}</Text>
                    </RNView>
              </RNView>
            </RNView>
            <RNView style={styles.activityFooter}>
              <RNView style={styles.ticketDisplay}>
                <FontAwesome name="bolt" size={20} color="#06b6d4" />
                <Text style={styles.ticketCountText}>{activity.lightning}</Text>
              </RNView>
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
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
    height: 40,
  },
  backButton: {
    position: 'absolute',
    top: 20, // Higher up, below the status bar
    left: 20,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
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
    color: '#0ea5e9',
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
    alignSelf: 'center',
  },
  activityText: {
    flex: 1,
    marginLeft: 8,
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
