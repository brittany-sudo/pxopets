import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import the banner image
const lullabyDownsMainImage = require('@/assets/images/lullaby-downs-main.png');
const lilGnomeImage = require('@/assets/images/lil-gnome.png');

export default function LullabyDownsScreen() {
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
      id: 'archive-of-slumber',
      name: 'The Archive of Slumber',
      description: 'Carved mountain library lit with bottled dream fragments.',
      icon: 'book'
    },
    {
      id: 'humming-riverbank',
      name: 'Humming Riverbank',
      description: 'Silver waters where lullabies drift like fish beneath the surface.',
      icon: 'tint'
    },
    {
      id: 'celestial-pastures',
      name: 'Celestial Pastures',
      description: 'Giant sheep grazing stardust under the dragon\'s path.',
      icon: 'circle'
    },
    {
      id: 'drowseway-warren',
      name: 'Drowseway Warren',
      description: 'Winding lantern-lit path with drifting dream-pillows and wisps.',
      icon: 'lightbulb-o'
    },
    {
      id: 'spindle-ladys-nook',
      name: 'The Spindle Lady\'s Nook',
      description: 'Glowing loom under swaying dream-lanterns, weaving dreamcatchers.',
      icon: 'th'
    },
    {
      id: 'sleepytime-teahouse',
      name: 'Sleepytime Teahouse & Inn',
      description: 'Cozy inn serving celestial teas infused with stardust and cosmic herbs.',
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
          <FontAwesome name="arrow-left" size={12} color="#7c3aed" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>LULLABY DOWNS</Text>
        </RNView>

        {/* Banner Image */}
        <RNView style={styles.bannerContainer}>
          <Image source={lullabyDownsMainImage} style={styles.bannerImage} />
        </RNView>

        {/* Activities Title */}
        <Text style={styles.activitiesTitle}>SLEEPY VALLEY ATTRACTIONS</Text>

        {/* Activities List */}
        {activities.map((activity) => {
          const handleActivityPress = () => {
            // Add navigation for other locations here in the future
          };

          const content = (
            <RNView style={styles.activityContent}>
              <RNView style={styles.activityIconContainer}>
                <FontAwesome name={activity.icon as any} size={20} color="#7c3aed" />
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
                  color={favorites.has(activity.id) ? "#7c3aed" : "rgba(124, 58, 237, 0.3)"} 
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
    backgroundColor: '#faf5ff', // Soft lavender background
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
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.3)',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#7c3aed',
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
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  bannerContainer: {
    width: '100%',
    height: 280,
    borderWidth: 2,
    borderColor: '#7c3aed',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(124, 58, 237, 0.05)',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
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
    backgroundColor: 'rgba(124, 58, 237, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.2)',
    padding: 12,
    marginBottom: 10,
    width: '100%',
    minHeight: 65,
    shadowColor: '#7c3aed',
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
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
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
    backgroundColor: 'rgba(124, 58, 237, 0.05)',
    borderRadius: 20,
    justifyContent: 'center',
  },
});
