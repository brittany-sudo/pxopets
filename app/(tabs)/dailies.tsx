import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View as RNView, Pressable, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DailiesScreen() {
  const [starredActivities, setStarredActivities] = useState<Set<string>>(new Set());
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);

  // Main locations from explore page only
  const allLocations = [
    {
      id: 'pxoburbs',
      name: 'The Pxoburbs',
      color: '#8b5cf6',
      backgroundColor: '#8b5cf6',
      icon: 'home',
      activities: [
        { id: 'quickstop', name: 'QuickStop', route: '/(tabs)/quickstop' },
        { id: 'post-office', name: 'Post Office', route: '/(tabs)/post-office' },
        { id: 'community-pool', name: 'Community Pool', route: '/(tabs)/community-pool' },
        { id: 'pxoburbs-mall', name: 'Pxoburbs Mall', route: '/(tabs)/pxoburbs-mall' },
        { id: 'pet-supply', name: 'Pet Supply Co.', route: '/(tabs)/pxopet-supply' },
        { id: 'pxo-radio', name: 'PXO 101.8 FM', route: '/(tabs)/pxo-radio' },
        { id: 'midnight-rewind', name: 'Midnight Rewind', route: '/(tabs)/midnight-rewind' }
      ]
    },
    {
      id: 'casino',
      name: 'Cosmic Oasis',
      color: '#f59e0b',
      backgroundColor: '#f59e0b',
      icon: 'sun-o',
      activities: [
        { id: 'hovercar-speedway', name: 'Hovercar Speedway', route: '/(tabs)/hovercar-speedway' },
        { id: 'hippie-alien-radio', name: 'Hippie Alien Radio', route: '/(tabs)/hippie-alien-radio' },
        { id: 'cosmic-gas-station', name: 'Cosmic Gas Station', route: '/(tabs)/cosmic-gas-station' },
        { id: 'cosmic-drive-in', name: 'Cosmic Drive-In', route: '/(tabs)/cosmic-drive-in' },
        { id: 'sunset-rest-stop', name: 'Sunset Rest Stop', route: '/(tabs)/sunset-rest-stop' },
        { id: 'moonbeam-motel', name: 'Moonbeam Motel', route: '/(tabs)/moonbeam-motel' },
        { id: 'neon-casino', name: 'Neon Casino', route: '/(tabs)/neon-casino' },
        { id: 'atomic-diner', name: 'Atomic Diner', route: '/(tabs)/atomic-diner' },
        { id: 'cactus-garden', name: 'Cactus Garden', route: '/(tabs)/cactus-garden' },
        { id: 'stargazing', name: 'Stargazing', route: '/(tabs)/stargazing' }
      ]
    },
    {
      id: 'barrelhaven',
      name: 'Barrelhaven',
      color: '#8b5cf6',
      backgroundColor: '#8b5cf6',
      icon: 'glass',
      activities: [
        { id: 'wine-tasting', name: 'Wine Tasting', route: '/(tabs)/wine-tasting' },
        { id: 'ivy-post', name: 'Ivy Post', route: '/(tabs)/ivy-post' },
        { id: 'treading-fields', name: 'Treading Fields', route: '/(tabs)/treading-fields' },
        { id: 'craftsmens-row', name: 'Craftsmen\'s Row', route: '/(tabs)/craftsmens-row' },
        { id: 'cellar-row', name: 'Cellar Row', route: '/(tabs)/cellar-row' },
        { id: 'winery-chapel', name: 'Winery Chapel', route: '/(tabs)/winery-chapel' }
      ]
    },
    {
      id: 'artisan',
      name: "Shakespeare's Quarter",
      color: '#ec4899',
      backgroundColor: '#ec4899',
      icon: 'paint-brush',
      activities: [
        { id: 'masquerade-hall', name: 'Masquerade Hall', route: '/(tabs)/masquerade-hall' },
        { id: 'pottery-forge', name: 'The Pottery Forge', route: '/(tabs)/pottery-forge' },
        { id: 'loomhouse', name: 'The Loomhouse', route: '/(tabs)/loomhouse' },
        { id: 'jewelers-hollow', name: 'The Jeweler\'s Hollow', route: '/(tabs)/jewelers-hollow' },
        { id: 'painters-atrium', name: 'The Painter\'s Atrium', route: '/(tabs)/painters-atrium' },
        { id: 'sculpture-garden', name: 'The Sculpture Garden', route: '/(tabs)/sculpture-garden' },
        { id: 'dyeing-pools', name: 'The Dyeing Pools', route: '/(tabs)/dyeing-pools' },
        { id: 'everchanging-gallery', name: 'Everchanging Gallery', route: '/(tabs)/everchanging-gallery' },
        { id: 'lantern-market', name: 'The Lantern Market', route: '/(tabs)/lantern-market' }
      ]
    },
    {
      id: 'bag-of-stars-forest',
      name: 'Stardiver Forest',
      color: '#10b981',
      backgroundColor: '#10b981',
      icon: 'star',
      activities: [
        { id: 'silver-crust', name: 'The Silver Crust', route: '/(tabs)/silver-crust' },
        { id: 'starfall-clearing', name: 'The Starfall Clearing', route: '/(tabs)/starfall-clearing' },
        { id: 'constellarium', name: 'Constellarium', route: '/(tabs)/constellarium' },
        { id: 'lantern-fox-market', name: 'Lantern Fox Market', route: '/(tabs)/lantern-fox-market' },
        { id: 'dream-pool', name: 'Dream-Diver\'s Pool', route: '/(tabs)/dream-pool' },
        { id: 'moth-priest-chapel', name: 'Moth Priest\'s Chapel', route: '/(tabs)/moth-priest-chapel' },
        { id: 'twilight-teahouse', name: 'Twilight Teahouse', route: '/(tabs)/twilight-teahouse' }
      ]
    },
    {
      id: 'lullaby-downs',
      name: 'Lullaby Downs',
      color: '#6b7280',
      backgroundColor: '#6b7280',
      icon: 'moon-o',
      activities: [
        { id: 'archive-of-slumber', name: 'The Archive of Slumber', route: '/(tabs)/archive-of-slumber' },
        { id: 'humming-riverbank', name: 'Humming Riverbank', route: '/(tabs)/humming-riverbank' },
        { id: 'celestial-pastures', name: 'Celestial Pastures', route: '/(tabs)/celestial-pastures' },
        { id: 'drowseway-warren', name: 'Drowseway Warren', route: '/(tabs)/drowseway-warren' },
        { id: 'spindle-ladys-nook', name: 'The Spindle Lady\'s Nook', route: '/(tabs)/spindle-ladys-nook' },
        { id: 'sleepytime-teahouse', name: 'Sleepytime Teahouse & Inn', route: '/(tabs)/sleepytime-teahouse' }
      ]
    },
    {
      id: 'bayou-nocturne',
      name: 'Bayou Nocturne',
      color: '#1f2937',
      backgroundColor: '#1f2937',
      icon: 'tree',
      activities: [
        { id: 'firefly-glade', name: 'Firefly Glade', route: '/(tabs)/firefly-glade' },
        { id: 'spirit-dock-boat', name: 'Spirit Dock Boat Ride', route: '/(tabs)/spirit-dock-boat' },
        { id: 'voodoo-shack', name: 'Voodoo Shack', route: '/(tabs)/voodoo-shack' },
        { id: 'skeleton-tavern', name: 'Skeleton Tavern', route: '/(tabs)/skeleton-tavern' },
        { id: 'cypress-cathedral', name: 'Cypress Cathedral', route: '/(tabs)/cypress-cathedral' },
        { id: 'gator-graveyard', name: 'Gator Graveyard', route: '/(tabs)/gator-graveyard' }
      ]
    },
    {
      id: 'library',
      name: 'Thistledown',
      color: '#7c3aed',
      backgroundColor: '#7c3aed',
      icon: 'leaf',
      activities: [
        { id: 'crop-watching', name: 'Crop Watching', route: '/(tabs)/crop-watching' },
        { id: 'scarecrow-building', name: 'Scarecrow Building', route: '/(tabs)/scarecrow-building' },
        { id: 'field-walking', name: 'Field Walking', route: '/(tabs)/field-walking' },
        { id: 'bird-watching', name: 'Bird Watching', route: '/(tabs)/bird-watching' },
        { id: 'harvest-helping', name: 'Harvest Helping', route: '/(tabs)/harvest-helping' },
        { id: 'windmill-tending', name: 'Windmill Tending', route: '/(tabs)/windmill-tending' },
        { id: 'farm-animals', name: 'Farm Animals', route: '/(tabs)/farm-animals' },
        { id: 'sunset-meditation', name: 'Sunset Meditation', route: '/(tabs)/sunset-meditation' }
      ]
    },
    {
      id: 'enchanted-island',
      name: 'Twilight Atoll',
      color: '#f97316',
      backgroundColor: '#f97316',
      icon: 'fire',
      activities: [
        { id: 'volcano-dance', name: 'Volcano Dance', route: '/(tabs)/volcano-dance' },
        { id: 'pearl-diving', name: 'Pearl Diving', route: '/(tabs)/pearl-diving' },
        { id: 'tiki-crafting', name: 'Tiki Crafting', route: '/(tabs)/tiki-crafting' },
        { id: 'spirit-ceremony', name: 'Spirit Ceremony', route: '/(tabs)/spirit-ceremony' },
        { id: 'coconut-harvest', name: 'Coconut Harvest', route: '/(tabs)/coconut-harvest' },
        { id: 'hula-lessons', name: 'Hula Lessons', route: '/(tabs)/hula-lessons' },
        { id: 'volcano-offering', name: 'Volcano Offering', route: '/(tabs)/volcano-offering' },
        { id: 'sunset-meditation', name: 'Sunset Meditation', route: '/(tabs)/sunset-meditation' }
      ]
    },
    {
      id: 'midwinter-crossing',
      name: 'Midwinter Crossing',
      color: '#e5e7eb',
      backgroundColor: '#e5e7eb',
      icon: 'snowflake-o',
      activities: [
        { id: 'choral-chapel', name: 'Choral Chapel', route: '/(tabs)/choral-chapel' },
        { id: 'mulled-wine-tavern', name: 'Mulled Wine House Tavern', route: '/(tabs)/mulled-wine-tavern' },
        { id: 'parcel-house', name: 'Parcel House', route: '/(tabs)/parcel-house' },
        { id: 'lantern-market', name: 'Lantern Market', route: '/(tabs)/lantern-market' },
        { id: 'gift-exchange', name: 'Gift Exchange', route: '/(tabs)/gift-exchange' },
        { id: 'winter-post', name: 'The Winter Post', route: '/(tabs)/winter-post' },
        { id: 'frost-flour', name: 'Frost & Flour', route: '/(tabs)/frost-flour' },
        { id: 'candlewright-hall', name: 'Candlewright\'s Hall', route: '/(tabs)/candlewright-hall' }
      ]
    },
    {
      id: 'gossamer-midway',
      name: 'Gossamer Midway',
      color: '#dc2626',
      backgroundColor: '#dc2626',
      icon: 'ticket',
      activities: [
        { id: 'moonlit-ferris', name: 'Moonlit Ferris Wheel', route: '/(tabs)/moonlit-ferris' },
        { id: 'house-mirrors', name: 'House of Mirrors', route: '/(tabs)/house-mirrors' },
        { id: 'fortune-teller-tent', name: 'Fortune Teller Tent', route: '/(tabs)/fortune-teller-tent' },
        { id: 'zodiac-carousel', name: 'Zodiac Carousel', route: '/(tabs)/zodiac-carousel' },
        { id: 'star-candy-booth', name: 'Star Candy Booth', route: '/(tabs)/star-candy-booth' },
        { id: 'celestial-mask-shop', name: 'Celestial Mask Shop', route: '/(tabs)/celestial-mask-shop' },
        { id: 'celestial-menagerie', name: 'Celestial Menagerie', route: '/(tabs)/celestial-menagerie' },
        { id: 'cosmic-ring-toss', name: 'Cosmic Ring Toss', route: '/(tabs)/cosmic-ring-toss' }
      ]
    },
    {
      id: 'loomers-wharf',
      name: 'Loomer\'s Wharf',
      color: '#0ea5e9',
      backgroundColor: '#0ea5e9',
      icon: 'anchor',
      activities: [
        { id: 'old-net-pub', name: 'The Old Net Pub', route: '/(tabs)/old-net-pub' },
        { id: 'whale-watching', name: 'Harbor Watch', route: '/(tabs)/whale-watching' },
        { id: 'trappers-shack', name: 'Trapper\'s Shack', route: '/(tabs)/trappers-shack' },
        { id: 'lighthouse-keeper', name: 'Lighthouse Keeper', route: '/(tabs)/lighthouse-keeper' },
        { id: 'saltwick-pier', name: 'Saltwick Pier', route: '/(tabs)/saltwick-pier' },
        { id: 'lowtide-pier', name: 'Lowtide Pier', route: '/(tabs)/lowtide-pier' },
        { id: 'foggy-harbor', name: 'Foggy Harbor', route: '/(tabs)/foggy-harbor' }
      ]
    }
  ];

  // Load starred activities from storage
  useEffect(() => {
    loadStarredActivities();
  }, []);

  // Reload starred activities when page comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadStarredActivities();
    }, [])
  );

  const loadStarredActivities = async () => {
    try {
      const saved = await AsyncStorage.getItem('starredActivities');
      if (saved) {
        const starred = JSON.parse(saved);
        setStarredActivities(new Set(starred));
      }
    } catch (error) {
      console.error('Failed to load starred activities:', error);
    }
  };

  const toggleStar = async (activityId: string) => {
    try {
      const newStarred = new Set(starredActivities);
      if (newStarred.has(activityId)) {
        newStarred.delete(activityId);
      } else {
        newStarred.add(activityId);
      }
      
      setStarredActivities(newStarred);
      await AsyncStorage.setItem('starredActivities', JSON.stringify([...newStarred]));
    } catch (error) {
      console.error('Failed to save starred activities:', error);
    }
  };

  const toggleLocation = (locationId: string) => {
    if (expandedLocation === locationId) {
      setExpandedLocation(null);
    } else {
      setExpandedLocation(locationId);
    }
  };

  const navigateToActivity = (route: string) => {
    router.navigate(route as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <RNView style={styles.headerContainer}>
          <Text style={styles.pageTitle}>DAILY FAVORITES</Text>
        </RNView>

        {/* Stats Bar */}
        <RNView style={styles.statsBar}>
          <RNView style={styles.statItem}>
            <Text style={styles.statLabel}>LOCATIONS</Text>
            <Text style={styles.statValue}>{allLocations.length}</Text>
          </RNView>
          <RNView style={styles.statDivider} />
          <RNView style={styles.statItem}>
            <Text style={styles.statLabel}>STARRED</Text>
            <Text style={styles.statValue}>{Array.from(starredActivities).length}</Text>
          </RNView>
        </RNView>

        {/* Locations List */}
        {allLocations.map((location) => {
          const starredActivitiesInLocation = location.activities.filter(activity => 
            starredActivities.has(activity.id)
          );
          
          return (
            <RNView key={location.id} style={styles.locationCard}>
              <Pressable 
                style={[styles.locationHeader, { borderColor: location.color }]}
                onPress={() => toggleLocation(location.id)}
              >
                <RNView style={styles.locationInfo}>
                  <RNView style={[styles.locationIcon, { backgroundColor: location.color }]}>
                    <FontAwesome 
                      name={location.icon as any} 
                      size={16} 
                      color="#ffffff" 
                    />
                </RNView>
                  <RNView style={styles.locationText}>
                    <Text style={styles.locationName}>{location.name.toUpperCase()}</Text>
                    <Text style={styles.locationCount}>
                      {starredActivitiesInLocation.length} FAVORITES
                    </Text>
                  </RNView>
                </RNView>
                <RNView style={styles.locationActions}>
                  <FontAwesome 
                    name={expandedLocation === location.id ? "chevron-up" : "chevron-down"} 
                    size={12} 
                    color="#2d3748" 
                  />
              </RNView>
              </Pressable>

              {/* Expanded Activities */}
              {expandedLocation === location.id && (
                <RNView style={styles.activitiesContainer}>
                  {starredActivitiesInLocation.length > 0 ? (
                    starredActivitiesInLocation.map((activity, index) => (
                      <Pressable 
                        key={activity.id} 
                        style={[styles.activityItem, index === starredActivitiesInLocation.length - 1 && styles.lastActivityItem]}
                        onPress={() => navigateToActivity(activity.route)}
                      >
                        <RNView style={styles.activityInfo}>
                          <RNView style={styles.activityBullet} />
                          <Text style={styles.activityName}>{activity.name.toUpperCase()}</Text>
                        </RNView>
                <Pressable
                          style={styles.activityStar}
                  onPress={(e) => {
                    e.stopPropagation();
                            toggleStar(activity.id);
                  }}
                >
                  <FontAwesome 
                            name="star" 
                            size={12} 
                            color="#fbbf24" 
                  />
                </Pressable>
              </Pressable>
                    ))
                  ) : (
                    <RNView style={styles.emptyLocation}>
                      <Text style={styles.emptyLocationText}>NO FAVORITES YET</Text>
                      <Text style={styles.emptyLocationSubtext}>
                        Star activities from this location
                      </Text>
                    </RNView>
                  )}
                </RNView>
              )}
            </RNView>
          );
        })}

        {/* Empty State */}
        {Array.from(starredActivities).length === 0 && (
          <RNView style={styles.emptyState}>
            <Text style={styles.emptyTitle}>NO FAVORITES</Text>
            <Text style={styles.emptyDescription}>
              Star activities from any location to see them here
            </Text>
          </RNView>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', // Clean, modern background
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  pageTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#8b5cf6',
    letterSpacing: 1,
    textAlign: 'center',
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 0,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    marginBottom: 4,
  },
  statValue: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    color: '#8b5cf6',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 4,
  },
  locationCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 0,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  locationText: {
    flex: 1,
  },
  locationName: {
    fontSize: 12,
    fontFamily: 'Silkscreen_400Regular',
    color: '#1e293b',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  locationCount: {
    fontSize: 10,
    fontFamily: 'Silkscreen_400Regular',
    color: '#64748b',
  },
  locationActions: {
    padding: 4,
  },
  activitiesContainer: {
    backgroundColor: '#f8fafc',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  lastActivityItem: {
    borderBottomWidth: 0,
  },
  activityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityBullet: {
    width: 6,
    height: 6,
    backgroundColor: '#8b5cf6',
    marginRight: 10,
    borderRadius: 3,
  },
  activityName: {
    fontSize: 11,
    fontFamily: 'Silkscreen_400Regular',
    color: '#374151',
    fontWeight: '500',
  },
  activityStar: {
    padding: 6,
  },
  emptyLocation: {
    alignItems: 'center',
    padding: 24,
  },
  emptyLocationText: {
    fontSize: 12,
    fontFamily: 'Silkscreen_400Regular',
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emptyLocationSubtext: {
    fontSize: 10,
    fontFamily: 'Silkscreen_400Regular',
    color: '#64748b',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#ffffff',
    marginHorizontal: 0,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyTitle: {
    fontSize: 14,
    fontFamily: 'Silkscreen_400Regular',
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 11,
    fontFamily: 'Silkscreen_400Regular',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
});