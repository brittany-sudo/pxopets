import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import the banner image
const bagOfStarsMainImage = require('@/assets/images/bag-of-stars-forest-main.png');

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
      id: 'silver-crust',
      name: 'The Silver Crust',
      description: 'Bakery carved into the trunk of a massive silver-barked oak.',
      icon: 'cutlery'
    },
    {
      id: 'starfall-clearing',
      name: 'The Starfall Clearing',
      description: 'Wide grove where stars drop nightly, canopy glowing with fragments.',
      icon: 'star'
    },
    {
      id: 'constellarium',
      name: 'Constellarium',
      description: 'Spiraled wooden tower strung with star fragments and maps.',
      icon: 'book'
    },
    {
      id: 'lantern-fox-market',
      name: 'Lantern Fox Market',
      description: 'Fox-shaped spirit stalls glowing amber, selling magical odds.',
      icon: 'shopping-cart'
    },
    {
      id: 'dream-pool',
      name: 'Dream-Diver\'s Pool',
      description: 'Dark pond glowing with stars beneath, grants dream relics.',
      icon: 'tint'
    },
    {
      id: 'moth-priest-chapel',
      name: 'Moth Priest\'s Chapel',
      description: 'Shrine where glowing moths roost, priests weave starlight cocoons.',
      icon: 'home'
    },
    {
      id: 'twilight-teahouse',
      name: 'Twilight Teahouse',
      description: 'Cozy teahouse where starlight brews into magical teas.',
      icon: 'coffee'
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
          <FontAwesome name="arrow-left" size={12} color="#6b7280" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>STARDIVER{'\n'}FOREST</Text>
        </RNView>

        {/* Banner Image */}
        <Image source={bagOfStarsMainImage} style={styles.bannerImage} />

        {/* Activities Title */}
        <Text style={styles.activitiesTitle}>STARLIT DESTINATIONS</Text>

        {/* Activities List */}
        {activities.map((activity) => {
          const handleActivityPress = () => {
            if (activity.id === 'silver-crust') {
              router.navigate('/(tabs)/silver-crust');
            } else if (activity.id === 'twilight-teahouse') {
              router.navigate('/(tabs)/twilight-teahouse');
            }
            // Add navigation for other activities here in the future
          };

          const content = (
            <RNView style={styles.activityContent}>
              <RNView style={styles.activityIconContainer}>
                  <FontAwesome name={activity.icon as any} size={20} color="#6b7280" />
              </RNView>
              <RNView style={styles.activityText}>
                <Text style={styles.activityName}>{activity.name}</Text>
                <Text style={styles.activityDescription}>{activity.description}</Text>
              </RNView>
            </RNView>
          );

          return (
            <Pressable key={activity.id} style={styles.activityItem} onPress={handleActivityPress}>
              {content}
              <Pressable
                style={styles.favoriteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  toggleFavorite(activity.id);
                }}
              >
                <FontAwesome 
                  name={favorites.has(activity.id) ? "star" : "star-o"} 
                  size={16} 
                    color={favorites.has(activity.id) ? "#6b7280" : "rgba(107, 114, 128, 0.3)"}
                />
              </Pressable>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', // Soft silver background
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
    paddingHorizontal: 20,
    paddingBottom: 100,
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
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(107, 114, 128, 0.3)',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 4,
    height: 40,
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
    lineHeight: 16,
  },
  bannerImage: {
    width: '100%',
    height: 400,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  activitiesTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
    marginTop: 16,
    textAlign: 'left',
    alignSelf: 'flex-start',
    width: '100%',
    textTransform: 'uppercase',
  },
  activityItem: {
    backgroundColor: 'rgba(107, 114, 128, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(107, 114, 128, 0.2)',
    padding: 12,
    marginBottom: 10,
    width: '100%',
    minHeight: 65,
    shadowColor: '#6b7280',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 35, // Space for favorite button
  },
  activityIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  activityText: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  activityName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 11,
    color: '#0f172a',
    marginBottom: 2,
    lineHeight: 14,
    textTransform: 'uppercase',
    textAlign: 'left',
  },
  activityDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    lineHeight: 13,
    textAlign: 'left',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    backgroundColor: 'rgba(107, 114, 128, 0.05)',
    borderRadius: 20,
    justifyContent: 'center',
  },
});