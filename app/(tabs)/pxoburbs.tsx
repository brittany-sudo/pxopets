import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, Link } from 'expo-router';

// Import the banner image
const staticTvImage = require('@/assets/images/static-tv.png');
const pxoburbsSkylineImage = require('@/assets/images/thepxoburbs-main.png');
const cosmicBurgerImage = require('@/assets/images/cosmicburger.png');
const lilSodaImage = require('@/assets/images/lil-soda.png');
const lilArcadeImage = require('@/assets/images/lil-arcade.png');
const lilMovieReelImage = require('@/assets/images/lil-movie-reel.png');
const rolerImage = require('@/assets/images/roler.png');
const makeoutHillImage = require('@/assets/images/makeout-hill.png');
const lilRadioImage = require('@/assets/images/lil-radio.png');
const lilMailImage = require('@/assets/images/lil-mail.png');
const lilMallImage = require('@/assets/images/lil-mall.png');
const lilPxosupplyImage = require('@/assets/images/lil-pxosupply.png');
const lilRubberduckImage = require('@/assets/images/lil-rubberduck.png');
const lilTagImage = require('@/assets/images/lil-tag.png');
const lilComputer90Image = require('@/assets/images/lil-computer90.png');

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
      id: 'mall-food-court',
      name: 'Pxoburbs Mall',
      description: 'Multi-level shopping complex with food court, retail stores, and entertainment.',
      lightning: 25,
      difficulty: 'Medium',
      icon: 'shopping-bag'
    },
    {
      id: 'corner-store',
      name: 'Quickstop Corner Store',
      description: 'Marty\'s 24/7 convenience store with snacks, lottery tickets, and special imports.',
      lightning: 12,
      difficulty: 'Easy',
      icon: 'chips'
    },
    {
      id: 'roller-rink',
      name: 'Starlight Roller Rink',
      description: 'Retro roller skating rink with disco lights and classic arcade games.',
      lightning: 20,
      difficulty: 'Easy',
      icon: 'roler'
    },
    {
      id: 'makeout-hill',
      name: 'Lovers Hill',
      description: 'Romantic overlook with panoramic city views, perfect for couples and stargazing.',
      lightning: 15,
      difficulty: 'Medium',
      icon: 'makeout-hill'
    },
    {
      id: 'midnight-rewind',
      name: 'Midnight Rewind',
      description: 'Classic video rental store with rare films, cult classics, and vintage VHS tapes.',
      lightning: 10,
      difficulty: 'Easy',
      icon: 'lil-movie-reel.png'
    },
    {
      id: 'radio-station',
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
      icon: 'tree'
    },
    {
      id: 'frog-market-thrift',
      name: 'Frog Market Thrift',
      description: 'Eclectic thrift store with vintage clothing, retro furniture, and unique collectibles.',
      lightning: 16,
      difficulty: 'Easy',
      image: 'lil-tag'
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
            const iconContent = (() => {
              switch (activity.id) {
                case 'corner-store':
                  return <Image source={cosmicBurgerImage} style={styles.activityImageIcon} />;
                case 'frog-market-thrift':
                  return <Image source={lilTagImage} style={styles.activityImageIcon} />;
                case 'roller-rink':
                  return <Image source={rolerImage} style={styles.activityImageIcon} />;
                case 'makeout-hill':
                  return <Image source={makeoutHillImage} style={styles.activityImageIcon} />;
                case 'radio-station':
                  return <Image source={lilRadioImage} style={styles.activityImageIcon} />;
                case 'midnight-rewind':
                  return <Image source={lilMovieReelImage} style={styles.activityImageIcon} />;
                case 'mall-food-court':
                  return <Image source={lilMallImage} style={styles.activityImageIcon} />;
                case 'post-office':
                  return <Image source={lilMailImage} style={styles.activityImageIcon} />;
                case 'pet-supply':
                  return <Image source={lilPxosupplyImage} style={styles.activityImageIcon} />;
                case 'community-pool':
                  return <Image source={lilRubberduckImage} style={styles.activityImageIcon} />;
                default:
                  return <FontAwesome name={activity.icon as any} size={20} color="#8b5cf6" style={styles.activityIcon} />;
              }
            })();

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
              case 'corner-store':
                return <Link href="/quickstop" asChild><Pressable key={activity.id} style={styles.activityItem}>{content}{star}</Pressable></Link>;
              case 'frog-market-thrift':
                return <Link href="/frog-market-thrift" asChild><Pressable key={activity.id} style={styles.activityItem}>{content}{star}</Pressable></Link>;
              case 'roller-rink':
                return <Link href="/(tabs)/starlight-roller-rink" asChild><Pressable key={activity.id} style={styles.activityItem}>{content}{star}</Pressable></Link>;
              case 'makeout-hill':
                return <Link href="/(tabs)/makeout-hill" asChild><Pressable key={activity.id} style={styles.activityItem}>{content}{star}</Pressable></Link>;
              case 'radio-station':
                return <Pressable key={activity.id} style={styles.activityItem} onPress={() => router.navigate('/(tabs)/pxo-radio')}>{content}{star}</Pressable>;
              case 'midnight-rewind':
                return <Pressable key={activity.id} style={styles.activityItem} onPress={() => router.navigate('/(tabs)/midnight-rewind')}>{content}{star}</Pressable>;
              case 'mall-food-court':
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
  activityImageIcon: {
    width: 42,
    height: 42,
    alignSelf: 'center',
    imageRendering: 'pixelated' as any,
    resizeMode: 'contain',
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
