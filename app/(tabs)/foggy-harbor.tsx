import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, Link } from 'expo-router';

// Import the banner image
const loomersBackgroundImage = require('@/assets/images/loomers-wharf-main.png');
const lilWhaleImage = require('@/assets/images/lil-whale.png');
const lilOldnetImage = require('@/assets/images/lil-oldnet.png');
const trapperIconImage = require('@/assets/images/trappericon.png');
const lilAnchorImage = require('@/assets/images/lil-anchor.png');

export default function FoggyHarborScreen() {
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
      id: 'old-net-pub',
      name: 'The Old Net Pub',
      description: 'Cozy harbor pub where sailors gather for stories, drinks, and the best fish chowder.',
      lightning: 25,
      difficulty: 'Easy',
      icon: 'lil-oldnet'
    },
    {
      id: 'whale-watching',
      name: 'Harbor Watch',
      description: 'Daily whale watching tours with experienced captains in prime whale territory.',
      lightning: 35,
      difficulty: 'Easy',
      icon: 'lil-whale'
    },
    {
      id: 'trappers-shack',
      name: 'Trapper\'s Shack',
      description: 'Rustic shack where seasoned fishermen share traditional trapping techniques.',
      lightning: 50,
      difficulty: 'Medium',
      icon: 'trappericon'
    },
    {
      id: 'lowtide-pier',
      name: 'Lowtide Pier',
      description: 'Scenic pier for watching the ocean and discovering treasures during low tide.',
      lightning: 0,
      difficulty: 'Easy',
      icon: 'anchor'
    },
    {
      id: 'lighthouse-keeper',
      name: 'Lighthouse Keeper',
      description: 'Tend the ancient lighthouse that guides ships through treacherous waters.',
      lightning: 60,
      difficulty: 'Medium',
      icon: 'lightbulb-o'
    },
    {
      id: 'storm-watching',
      name: 'Storm Watching',
      description: 'Experience Atlantic storms from the harbor breakwater viewing areas.',
      lightning: 30,
      difficulty: 'Easy',
      icon: 'cloud'
    },
    {
      id: 'net-mending',
      name: 'Net Mending',
      description: 'Learn traditional net mending craft from master craftspeople.',
      lightning: 20,
      difficulty: 'Easy',
      icon: 'th'
    },
    {
      id: 'harbor-mystery',
      name: 'Harbor Mystery',
      description: 'Investigate mysterious disappearances and solve dark harbor secrets.',
      lightning: 100,
      difficulty: 'Hard',
      icon: 'search'
    },
    {
      id: 'fog-horn',
      name: 'Fog Horn Keeper',
      description: 'Operate the iconic fog horn to guide ships through thick coastal fog.',
      lightning: 45,
      difficulty: 'Medium',
      icon: 'volume-up'
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
          <FontAwesome name="arrow-left" size={12} color="#0ea5e9" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>LOOMER'S WHARF</Text>
        </RNView>

        {/* Banner Image */}
        <RNView style={styles.bannerContainer}>
          <Image source={loomersBackgroundImage} style={styles.bannerImage} />
        </RNView>

        {/* Activities Title */}
        <Text style={styles.activitiesTitle}>HARBOR ACTIVITIES</Text>

        {/* Activities List */}
        {activities.map((activity) => {
          const getActivityIcon = () => {
            const iconContent = (() => {
              switch (activity.id) {
                case 'whale-watching':
                  return <Image source={lilWhaleImage} style={styles.activityImageIcon} />;
                case 'old-net-pub':
                  return <Image source={lilOldnetImage} style={styles.activityImageIcon} />;
                case 'trappers-shack':
                  return <Image source={trapperIconImage} style={styles.activityImageIcon} />;
                case 'lowtide-pier':
                  return <Image source={lilAnchorImage} style={styles.activityImageIcon} />;
                default:
                  return <FontAwesome name={activity.icon as any} size={20} color="#0ea5e9" style={styles.activityIcon} />;
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
              <RNView style={styles.activityHeader}>
                <RNView style={styles.activityInfo}>
                  {getActivityIcon()}
                  <RNView style={styles.activityText}>
                    <Text style={styles.activityName}>{activity.name}</Text>
                    <Text style={styles.activityDescription}>{activity.description}</Text>
                  </RNView>
                </RNView>
              </RNView>
            );

            const footer = (
              <RNView style={styles.activityFooter}>
                <Pressable
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorite(activity.id)}
                >
                  <FontAwesome 
                    name={favorites.has(activity.id) ? "star" : "star-o"} 
                    size={12} 
                    color={favorites.has(activity.id) ? "#0ea5e9" : "rgba(14, 165, 233, 0.3)"} 
                  />
                </Pressable>
              </RNView>
            );

            switch (activity.id) {
              case 'whale-watching':
                return <Pressable style={styles.activityPressable} onPress={() => router.navigate('/(tabs)/whale-watching')}>{content}{footer}</Pressable>;
              case 'old-net-pub':
                return <Pressable style={styles.activityPressable} onPress={() => router.navigate('/(tabs)/old-net-pub')}>{content}{footer}</Pressable>;
              case 'lowtide-pier':
                return <Pressable style={styles.activityPressable} onPress={() => router.navigate('/(tabs)/lowtide-pier')}>{content}{footer}</Pressable>;
              case 'trappers-shack':
                return <Pressable style={styles.activityPressable} onPress={() => router.navigate('/(tabs)/trappers-shack')}>{content}{footer}</Pressable>;
              case 'lighthouse-keeper':
                return <Pressable style={styles.activityPressable} onPress={() => router.navigate('/(tabs)/lighthouse-keeper')}>{content}{footer}</Pressable>;
              default:
                return <Pressable style={styles.activityPressable} onPress={() => {}}>{content}{footer}</Pressable>;
            }
          };

          return (
            <RNView key={activity.id} style={styles.activityItem}>
              {getActivityPressable()}
            </RNView>
          );
        })}
        </ScrollView>

      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f2fe', // Light blue maritime background
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 80,
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
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14, // Larger (was 12)
    color: '#0ea5e9',
    marginLeft: 6,
  },
  headerRow: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderColor: '#0ea5e9',
    borderRadius: 8,
    marginTop: -20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    marginTop: 0,
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
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
    padding: 12,
    marginBottom: 10,
    width: '100%',
    minHeight: 70,
    justifyContent: 'center',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityPressable: {
    width: '100%',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  activityInfo: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 0,
    minHeight: 50,
    marginRight: 40,
  },
  activityIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityImageIcon: {
    width: 42,
    height: 42,
    alignSelf: 'center',
    imageRendering: 'pixelated' as any,
    resizeMode: 'contain',
  },
  activityIcon: {
    width: 28,
    height: 28,
    alignSelf: 'center',
    textAlign: 'center',
    lineHeight: 28,
  },
  activityText: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  activityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 3,
  },
  activityName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12, // Larger (was 10)
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 3,
    textAlign: 'left',
    lineHeight: 16, // Adjusted for larger font
    textTransform: 'uppercase',
  },
  activityDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11, // Larger (was 9)
    color: '#64748b',
    lineHeight: 15, // Adjusted for larger font
    textAlign: 'justify',
  },
  favoriteButton: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
  },
  activityFooter: {
    position: 'absolute',
    top: 12, // More centered vertically
    right: 12, // More centered from right edge
    flexDirection: 'row',
    justifyContent: 'center', // Center the star within its container
    alignItems: 'center',
  },
});