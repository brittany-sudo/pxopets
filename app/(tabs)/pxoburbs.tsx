import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import the banner image
const pxoburbsSkylineImage = require('@/assets/images/thepxoburbs-main.png');

export default function PxoburbsScreen() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Load starred activities from storage
  useEffect(() => {
    loadStarredActivities();
  }, []);

  const loadStarredActivities = async () => {
    try {
      const saved = await AsyncStorage.getItem('starredActivities');
      if (saved) {
        setFavorites(new Set(JSON.parse(saved)));
      }
    } catch (error) {
      console.error('Failed to load starred activities:', error);
    }
  };

  const toggleFavorite = async (activityId: string) => {
    try {
      const newFavorites = new Set(favorites);
      if (newFavorites.has(activityId)) {
        newFavorites.delete(activityId);
      } else {
        newFavorites.add(activityId);
      }
      setFavorites(newFavorites);
      await AsyncStorage.setItem('starredActivities', JSON.stringify([...newFavorites]));
    } catch (error) {
      console.error('Failed to save starred activities:', error);
    }
  };


  const activities = [
    {
      id: 'pxoburbs-mall',
      name: 'Pxoburbs Mall',
      description: 'Multi-level shopping complex with food court, retail stores, and entertainment.',
      lightning: 25,
      difficulty: 'Medium',
      icon: 'shopping-bag'
    },
    {
      id: 'quickstop',
      name: 'Quickstop Corner Store',
      description: 'Marty\'s 24/7 convenience store with snacks, lottery tickets, and special imports.',
      lightning: 12,
      difficulty: 'Easy',
      icon: 'shopping-cart'
    },
    {
      id: 'starlight-roller-rink',
      name: 'Starlight Roller Rink',
      description: 'Retro roller skating rink with disco lights and classic arcade games.',
      lightning: 20,
      difficulty: 'Easy',
      icon: 'circle'
    },
    {
      id: 'makeout-hill',
      name: 'Lovers Hill',
      description: 'Romantic overlook with panoramic city views, perfect for couples and stargazing.',
      lightning: 15,
      difficulty: 'Medium',
      icon: 'heart'
    },
    {
      id: 'midnight-rewind',
      name: 'Midnight Rewind',
      description: 'Classic video rental store with rare films, cult classics, and vintage VHS tapes.',
      lightning: 10,
      difficulty: 'Easy',
      icon: 'film'
    },
    {
      id: 'pxo-radio',
      name: 'PXO 101.8 FM',
      description: 'Independent community radio station with local music and live broadcasts.',
      lightning: 18,
      difficulty: 'Medium',
      icon: 'microphone'
    },
    {
      id: 'post-office',
      name: 'Pxoburbs Post Office',
      description: 'Full-service postal facility for mail delivery and package shipping.',
      lightning: 6,
      difficulty: 'Easy',
      icon: 'envelope'
    },
    {
      id: 'pet-supply',
      name: 'PXOPET SUPPLY CO.',
      description: 'Comprehensive pet store with food, toys, accessories, and grooming services.',
      lightning: 14,
      difficulty: 'Medium',
      icon: 'paw'
    },
    {
      id: 'community-pool',
      name: 'Pxoburbs Community Pool',
      description: 'Public swimming facility with Olympic-sized pool and recreational areas.',
      lightning: 8,
      difficulty: 'Easy',
      icon: 'tint'
    },
    {
      id: 'frog-market-thrift',
      name: 'Frog Market Thrift',
      description: 'Eclectic thrift store with vintage clothing, retro furniture, and unique collectibles.',
      lightning: 16,
      difficulty: 'Easy',
      icon: 'tag'
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
          <FontAwesome name="arrow-left" size={12} color="#8b5cf6" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>THE PXOBURBS</Text>
        </RNView>

        {/* Banner Image */}
        <RNView style={styles.bannerContainer}>
          <Image source={pxoburbsSkylineImage} style={styles.bannerImage} />
        </RNView>



        {/* Activities Title */}
        <Text style={styles.activitiesTitle}>NEIGHBORHOOD ACTIVITIES</Text>

        {/* Activities List */}
        {activities.map((activity) => {
          const getActivityIcon = () => {
            const iconContent = <FontAwesome name={activity.icon as any} size={20} color="#8b5cf6" style={styles.activityIcon} />;

            return (
              <RNView style={styles.activityIconContainer}>
                {iconContent}
              </RNView>
            );
          };

          const getActivityPressable = () => {
            const content = (
              <RNView style={styles.activityContent}>
                {getActivityIcon()}
                <RNView style={styles.activityText}>
                  <Text style={styles.activityName}>{activity.name}</Text>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                </RNView>
              </RNView>
            );

            const star = (
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
                  color={favorites.has(activity.id) ? "#8b5cf6" : "rgba(139, 92, 246, 0.3)"} 
                />
              </Pressable>
            );

            switch (activity.id) {
              case 'quickstop':
                return <Link href="/quickstop" asChild><Pressable key={activity.id} style={styles.activityItem}>{content}{star}</Pressable></Link>;
              case 'frog-market-thrift':
                return <Link href="/frog-market-thrift" asChild><Pressable key={activity.id} style={styles.activityItem}>{content}{star}</Pressable></Link>;
              case 'starlight-roller-rink':
                return <Link href="/(tabs)/starlight-roller-rink" asChild><Pressable key={activity.id} style={styles.activityItem}>{content}{star}</Pressable></Link>;
              case 'makeout-hill':
                return <Link href="/(tabs)/makeout-hill" asChild><Pressable key={activity.id} style={styles.activityItem}>{content}{star}</Pressable></Link>;
              case 'pxo-radio':
                return <Pressable key={activity.id} style={styles.activityItem} onPress={() => router.navigate('/(tabs)/pxo-radio')}>{content}{star}</Pressable>;
              case 'midnight-rewind':
                return <Pressable key={activity.id} style={styles.activityItem} onPress={() => router.navigate('/(tabs)/midnight-rewind')}>{content}{star}</Pressable>;
              case 'pxoburbs-mall':
                return <Pressable key={activity.id} style={styles.activityItem} onPress={() => router.navigate('/(tabs)/pxoburbs-mall')}>{content}{star}</Pressable>;
              case 'post-office':
                return <Pressable key={activity.id} style={styles.activityItem} onPress={() => router.navigate('/(tabs)/post-office')}>{content}{star}</Pressable>;
              case 'pet-supply':
                return <Pressable key={activity.id} style={styles.activityItem} onPress={() => router.navigate('/(tabs)/pxopet-supply')}>{content}{star}</Pressable>;
              case 'community-pool':
                return <Pressable key={activity.id} style={styles.activityItem} onPress={() => router.navigate('/(tabs)/community-pool')}>{content}{star}</Pressable>;
              default:
                return <Pressable key={activity.id} style={styles.activityItem}>{content}{star}</Pressable>;
            }
          };

          return getActivityPressable();
        })}
        </ScrollView>

      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f0ff', // Light purple suburban background
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
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14, // Larger (was 12)
    color: '#8b5cf6',
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
    fontSize: 12, // Larger (was 10)
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  bannerContainer: {
    width: '100%',
    height: 300,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    marginTop: 0,
  },
  description: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14, // Larger (was 12)
    color: '#0f172a',
    lineHeight: 20, // Adjusted for larger font
    marginTop: -10,
    marginBottom: 24,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  activitiesTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14, // Larger (was 12)
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12, // Closer to activity cards (was 20)
    marginTop: 16, // More space from banner (was 8)
    textAlign: 'left',
    alignSelf: 'flex-start',
    width: '100%',
    textTransform: 'uppercase',
  },
  activityItem: {
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    padding: 12,
    marginBottom: 10,
    width: '100%',
    minHeight: 65,
    shadowColor: '#8b5cf6',
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
  activityIcon: {
    width: 28,
    height: 28,
    alignSelf: 'center',
    textAlign: 'center',
    lineHeight: 28,
  },
  activityIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  activityIcon: {
    textAlign: 'center',
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
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 20,
    justifyContent: 'center',
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
});
