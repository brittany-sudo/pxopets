import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import the banner image
const lilWineCasketImage = require('@/assets/images/lil-wine-casket.png');

export default function BarrelhavenScreen() {
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
      id: 'wine-tasting',
      name: 'Wine Tasting',
      description: 'Sample the finest vintages from ancient cellars.',
      lightning: 20,
      difficulty: 'Easy',
      icon: 'glass'
    },
    {
      id: 'barrel-making',
      name: 'Barrel Making',
      description: 'Craft oak barrels using traditional cooper techniques.',
      lightning: 25,
      difficulty: 'Hard',
      icon: 'circle'
    },
    {
      id: 'grape-harvest',
      name: 'Grape Harvest',
      description: 'Pick grapes during the autumn harvest season.',
      lightning: 15,
      difficulty: 'Medium',
      icon: 'leaf'
    },
    {
      id: 'cellar-tour',
      name: 'Cellar Tour',
      description: 'Explore the deep underground wine cellars.',
      lightning: 12,
      difficulty: 'Easy',
      icon: 'arrow-down'
    },
    {
      id: 'wine-blending',
      name: 'Wine Blending',
      description: 'Create your own unique wine blend from different grapes.',
      lightning: 30,
      difficulty: 'Hard',
      icon: 'tint'
    },
    {
      id: 'medieval-feast',
      name: 'Medieval Feast',
      description: 'Dine like royalty at the grand banquet hall.',
      lightning: 35,
      difficulty: 'Medium',
      icon: 'cutlery'
    },
    {
      id: 'vineyard-walk',
      name: 'Vineyard Walk',
      description: 'Stroll through the rolling hills of the vineyard.',
      lightning: 10,
      difficulty: 'Easy',
      icon: 'road'
    },
    {
      id: 'wine-ceremony',
      name: 'Wine Ceremony',
      description: 'Participate in ancient wine-making rituals.',
      lightning: 40,
      difficulty: 'Hard',
      icon: 'heart'
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
        <Text style={styles.title}>BARRELHAVEN</Text>

        {/* Banner Image */}
        <RNView style={styles.bannerContainer}>
          <Image source={lilWineCasketImage} style={styles.bannerImage} />
        </RNView>

        {/* Description */}
        <Text style={styles.description}>
          A medieval winery village nestled in rolling hills where ancient traditions 
          meet modern craftsmanship. Oak barrels line the cellars while grapevines 
          stretch across the countryside. Here, every sip tells a story of centuries past.
        </Text>

        {/* Activities Title */}
        <Text style={styles.activitiesTitle}>WINERY ACTIVITIES</Text>

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
                          <FontAwesome name="bolt" size={15} color="#06b6d4" />
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