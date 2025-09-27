import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, Link } from 'expo-router';

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
      description: 'Weekly balls with elegant dancing.',
      lightning: 3,
      difficulty: 'Medium',
      icon: 'theater-masks'
    },
    {
      id: 'pottery-workshop',
      name: 'Pottery Workshop',
      description: 'Shape clay into beautiful vessels on ancient wheels.',
      lightning: 12,
      difficulty: 'Medium',
      icon: 'circle'
    },
    {
      id: 'weaving-circle',
      name: 'Weaving Circle',
      description: 'Learn traditional textile arts from master weavers.',
      lightning: 10,
      difficulty: 'Medium',
      icon: 'th'
    },
    {
      id: 'jewelry-making',
      name: 'Jewelry Making',
      description: 'Craft intricate pieces from precious metals and gems.',
      lightning: 15,
      difficulty: 'Hard',
      icon: 'diamond'
    },
    {
      id: 'painting-studio',
      name: 'Painting Studio',
      description: 'Express your creativity on canvas with master artists.',
      lightning: 8,
      difficulty: 'Easy',
      icon: 'paint-brush'
    },
    {
      id: 'sculpture-garden',
      name: 'Sculpture Garden',
      description: 'Carve stone and wood into magnificent sculptures.',
      lightning: 18,
      difficulty: 'Hard',
      icon: 'cube'
    },
    {
      id: 'textile-dyeing',
      name: 'Textile Dyeing',
      description: 'Create vibrant colors using natural plant dyes.',
      lightning: 9,
      difficulty: 'Easy',
      icon: 'tint'
    },
    {
      id: 'art-gallery',
      name: 'Art Gallery',
      description: 'Display your creations in the community gallery.',
      lightning: 25,
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
          <FontAwesome name="arrow-left" size={14} color="#0ea5e9" />
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
            {activity.id === 'masquerade-hall' ? (
              <Link href="/masquerade-hall" asChild>
                <Pressable style={styles.activityPressable}>
                  <RNView style={styles.activityHeader}>
                    <RNView style={styles.activityInfo}>
                      <Image 
                        source={require('@/assets/images/masquerade-hall-icon.png')} 
                        style={styles.activityImageIcon} 
                      />
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
                </Pressable>
              </Link>
            ) : (
              <>
                <RNView style={styles.activityHeader}>
                  <RNView style={styles.activityInfo}>
                    <FontAwesome name={activity.icon as any} size={32} color="#8b5cf6" style={styles.activityIcon} />
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
              </>
            )}
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
    color: '#0ea5e9',
    marginLeft: 6,
  },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 5,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  bannerContainer: {
    width: '100%',
    height: 200,
    borderWidth: 2,
    borderColor: '#0ea5e9',
    borderRadius: 8,
    marginTop: 0,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    marginTop: 20,
  },
  description: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    lineHeight: 18,
    marginTop: -10,
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
  activityPressable: {
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
  activityImageIcon: {
    width: 36,
    height: 36,
    marginRight: 12,
    alignSelf: 'center',
    imageRendering: 'pixelated' as any,
  },
  activityText: {
    flex: 1,
    marginLeft: 8,
  },
  activityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  activityName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  ticketDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
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
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rewardText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  ticketCountText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#06b6d4',
    fontWeight: 'bold',
  },
});