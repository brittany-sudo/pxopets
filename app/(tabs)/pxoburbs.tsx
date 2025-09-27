import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, Link } from 'expo-router';

// Import the banner image
const staticTvImage = require('@/assets/images/static-tv.png');
const pxoburbsSkylineImage = require('@/assets/images/pxoburbs-skyline.png');
const chipsImage = require('@/assets/images/chips.png');
const lilArcadeImage = require('@/assets/images/lil-arcade.png');
const lilMovieReelImage = require('@/assets/images/lil-movie-reel.png');
const makeoutHillImage = require('@/assets/images/makeout-hill.png');

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
      id: 'corner-store',
      name: 'Quick Stop Corner Store',
      description: 'Shop, lottery tickets, and gas station snacks.',
      lightning: 12,
      difficulty: 'Easy',
      icon: 'chips'
    },
    {
      id: 'arcade',
      name: 'Pxoburbs Arcade',
      description: 'Classic arcade games and pinball machines.',
      lightning: 5,
      difficulty: 'Easy',
      icon: 'arcade'
    },
    {
      id: 'makeout-hill',
      name: 'Makeout Hill',
      description: 'The legendary spot for romantic encounters.',
      lightning: 15,
      difficulty: 'Medium',
      icon: 'makeout-hill'
    },
    {
      id: 'lost-found',
      name: 'Lost & Found Kiosk',
      description: 'Find missing items and lost treasures.',
      lightning: 10,
      difficulty: 'Easy',
      icon: 'search'
    },
    {
      id: 'radio-station',
      name: 'PXO 101.7 FM',
      description: 'Local radio station with community shows.',
      lightning: 18,
      difficulty: 'Medium',
      icon: 'microphone'
    },
    {
      id: 'movie-theater',
      name: 'Starlight Cinema',
      description: 'Catch the latest blockbusters and indie films.',
      lightning: 20,
      difficulty: 'Easy',
      icon: 'lil-movie-reel'
    },
    {
      id: 'post-office',
      name: 'Pxoburbs Post Office',
      description: 'Send mail and packages to friends.',
      lightning: 6,
      difficulty: 'Easy',
      icon: 'envelope'
    },
    {
      id: 'pet-daycare',
      name: 'Happy Paws Daycare',
      description: 'Drop off your pets for fun and socialization.',
      lightning: 14,
      difficulty: 'Medium',
      icon: 'paw'
    },
    {
      id: 'mall-food-court',
      name: 'Pxoburbs Mall',
      description: 'Shop and eat at the bustling food court.',
      lightning: 25,
      difficulty: 'Medium',
      icon: 'shopping-bag'
    },
    {
      id: 'computer-store',
      name: 'Tech & Tunes',
      description: 'Computer parts and vintage record collection.',
      lightning: 22,
      difficulty: 'Hard',
      icon: 'laptop'
    },
    {
      id: 'suburban-park',
      name: 'Maple Leaf Park',
      description: 'Quiet suburban park with playground and trails.',
      lightning: 8,
      difficulty: 'Easy',
      icon: 'tree'
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
        <Text style={styles.title}>THE PXOBURBS</Text>

        {/* Banner Image */}
        <RNView style={styles.bannerContainer}>
          <Image source={pxoburbsSkylineImage} style={styles.bannerImage} />
        </RNView>

        {/* Description */}
        <Text style={styles.description}>
          Welcome to The Pxoburbs! This bustling suburban district is where the action happens. 
          From the neon-lit arcade to the local corner store, every block offers something exciting. 
          Catch a movie at the cinema, grab snacks at the mall food court, or explore the arcade. 
          It's the perfect place to hang out, explore, and make memories with friends!
        </Text>

        {/* Activities Title */}
        <Text style={styles.activitiesTitle}>NEIGHBORHOOD ACTIVITIES</Text>

        {/* Activities List */}
        {activities.map((activity) => (
          <RNView key={activity.id} style={styles.activityItem}>
            {activity.id === 'corner-store' ? (
              <Link href="/quickstop" asChild>
                <Pressable style={styles.activityPressable}>
                  <RNView style={styles.activityHeader}>
                    <RNView style={styles.activityInfo}>
                      {activity.id === 'corner-store' ? (
                        <Image source={chipsImage} style={styles.activityImageIcon} />
                      ) : (
                        <FontAwesome name={activity.icon as any} size={32} color="#8b5cf6" style={styles.activityIcon} />
                      )}
                      <RNView style={styles.activityText}>
                        <RNView style={styles.activityTitleRow}>
                          <Text style={styles.activityName}>{activity.name}</Text>
                          {activity.id !== 'corner-store' && (
                            <RNView style={styles.ticketDisplay}>
                              <FontAwesome name="bolt" size={15} color="#06b6d4" />
                              <Text style={styles.ticketCountText}>{activity.lightning}</Text>
                            </RNView>
                          )}
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
                {activity.id === 'corner-store' ? (
                  <Image source={chipsImage} style={styles.activityImageIcon} />
                ) : activity.id === 'arcade' ? (
                  <Image source={lilArcadeImage} style={styles.arcadeImageIcon} />
                ) : activity.id === 'makeout-hill' ? (
                  <Image source={makeoutHillImage} style={styles.activityImageIcon} />
                ) : activity.id === 'movie-theater' ? (
                  <Image source={lilMovieReelImage} style={styles.activityImageIcon} />
                ) : (
                  <FontAwesome name={activity.icon as any} size={32} color="#8b5cf6" style={styles.activityIcon} />
                )}
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
  arcadeImageIcon: {
    width: 36,
    height: 36,
    marginRight: 12,
    alignSelf: 'center',
    imageRendering: 'pixelated' as any,
    resizeMode: 'contain',
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
