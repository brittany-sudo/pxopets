import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import the banner image
const shakespeareQuarterMainImage = require('@/assets/images/shakespeares-quarter-main.png');

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
      description: 'Candlelit ballroom where masks reveal hidden souls.',
      icon: 'theater-masks'
    },
    {
      id: 'pottery-forge',
      name: 'The Pottery Forge',
      description: 'Glowing kiln built into ancient titan ruins.',
      icon: 'circle'
    },
    {
      id: 'loomhouse',
      name: 'The Loomhouse',
      description: 'Circular hall strung with glowing constellation threads.',
      icon: 'th'
    },
    {
      id: 'jewelers-hollow',
      name: 'The Jeweler\'s Hollow',
      description: 'Glittering cavern where gems hum with soft music.',
      icon: 'diamond'
    },
    {
      id: 'painters-atrium',
      name: 'The Painter\'s Atrium',
      description: 'Skylit halls where canvases shift when you look away.',
      icon: 'paint-brush'
    },
    {
      id: 'sculpture-garden',
      name: 'The Sculpture Garden',
      description: 'Courtyard where statues strain against stone, half-awake.',
      icon: 'cube'
    },
    {
      id: 'dyeing-pools',
      name: 'The Dyeing Pools',
      description: 'Bubbling cauldrons of impossible, shimmering hues.',
      icon: 'tint'
    },
    {
      id: 'everchanging-gallery',
      name: 'Everchanging Gallery',
      description: 'Living gallery whose halls rearrange overnight.',
      icon: 'picture-o'
    },
    {
      id: 'lantern-market',
      name: 'The Lantern Market',
      description: 'Bustling plaza glowing with floating lanterns and spirits.',
      icon: 'lightbulb-o'
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
          <FontAwesome name="arrow-left" size={12} color="#d97706" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>SHAKESPEARE'S{'\n'}QUARTER</Text>
        </RNView>

        {/* Banner Image */}
        <RNView style={styles.bannerContainer}>
          <Image source={shakespeareQuarterMainImage} style={styles.bannerImage} />
        </RNView>

        {/* Activities Title */}
        <Text style={styles.activitiesTitle}>TOWN LOCATIONS</Text>

        {/* Activities List */}
        {activities.map((activity) => {
          const handleActivityPress = () => {
            if (activity.id === 'masquerade-hall') {
              router.navigate('/(tabs)/masquerade-hall');
            }
            // Add navigation for other activities here in the future
          };

          const content = (
            <RNView style={styles.activityContent}>
              <RNView style={styles.activityIconContainer}>
                <FontAwesome name={activity.icon as any} size={20} color="#d97706" />
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
                  color={favorites.has(activity.id) ? "#d97706" : "rgba(217, 119, 6, 0.3)"} 
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
    backgroundColor: '#fffbeb', // Light amber artistic background
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
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.3)',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#d97706',
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
  bannerContainer: {
    width: '100%',
    height: 280,
    borderWidth: 2,
    borderColor: '#d97706',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(217, 119, 6, 0.05)',
  },
  bannerImage: {
    width: '100%',
    height: '120%',
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
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
    backgroundColor: 'rgba(217, 119, 6, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.2)',
    padding: 12,
    marginBottom: 10,
    width: '100%',
    minHeight: 65,
    shadowColor: '#d97706',
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
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
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
    backgroundColor: 'rgba(217, 119, 6, 0.05)',
    borderRadius: 20,
    justifyContent: 'center',
  },
});