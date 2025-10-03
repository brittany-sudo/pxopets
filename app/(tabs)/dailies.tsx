import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View as RNView, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

export default function DailiesScreen() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [favoriteActivities, setFavoriteActivities] = useState<any[]>([]);

  // Mock data for all activities across locations - in a real app this would come from a global store
  const allActivities = [
    // Pxoburbs activities
    { id: 'midnight-rewind', name: 'Midnight Rewind', description: 'Dance to retro beats at the late-night club.', location: 'Pxoburbs', locationColor: '#8b5cf6', icon: 'music' },
    { id: 'pxo-radio', name: 'PXO 101.8 FM', description: 'Tune into the local radio station.', location: 'Pxoburbs', locationColor: '#8b5cf6', icon: 'radio' },
    { id: 'post-office', name: 'Post Office', description: 'Send letters and packages to friends.', location: 'Pxoburbs', locationColor: '#8b5cf6', icon: 'envelope' },
    { id: 'pet-supply', name: 'Pet Supply Co.', description: 'Shop for pet food and accessories.', location: 'Pxoburbs', locationColor: '#8b5cf6', icon: 'paw' },
    { id: 'community-pool', name: 'Community Pool', description: 'Swim and relax at the local pool.', location: 'Pxoburbs', locationColor: '#8b5cf6', icon: 'tint' },
    { id: 'pxoburbs-mall', name: 'Pxoburbs Mall', description: 'Shop at the suburban shopping center.', location: 'Pxoburbs', locationColor: '#8b5cf6', icon: 'shopping-bag' },
    
    // Loomer's Wharf activities
    { id: 'fishing-expedition', name: 'Fishing Expedition', description: 'Cast nets in the misty harbor waters.', location: "Loomer's Wharf", locationColor: '#0ea5e9', icon: 'anchor' },
    { id: 'lighthouse-tour', name: 'Lighthouse Tour', description: 'Climb the ancient lighthouse beacon.', location: "Loomer's Wharf", locationColor: '#0ea5e9', icon: 'lightbulb-o' },
    { id: 'seafood-market', name: 'Seafood Market', description: 'Browse fresh catches at the dock.', location: "Loomer's Wharf", locationColor: '#0ea5e9', icon: 'shopping-cart' },
    { id: 'boat-repair', name: 'Boat Repair', description: 'Fix weathered vessels at the shipyard.', location: "Loomer's Wharf", locationColor: '#0ea5e9', icon: 'wrench' },
    { id: 'fog-walk', name: 'Fog Walk', description: 'Stroll through the mysterious harbor mist.', location: "Loomer's Wharf", locationColor: '#0ea5e9', icon: 'cloud' },
    { id: 'sailor-tavern', name: 'Sailor Tavern', description: 'Share stories with old sea dogs.', location: "Loomer's Wharf", locationColor: '#0ea5e9', icon: 'glass' },
    
    // Crescent Oasis activities
    { id: 'moonbeam-motel', name: 'Moonbeam Motel', description: 'Rest at the desert roadside inn.', location: 'Crescent Oasis', locationColor: '#ec4899', icon: 'bed' },
    { id: 'neon-casino', name: 'Neon Casino', description: 'Try your luck at the bright casino.', location: 'Crescent Oasis', locationColor: '#ec4899', icon: 'diamond' },
    { id: 'desert-diner', name: 'Desert Diner', description: 'Grab a bite at the roadside cafe.', location: 'Crescent Oasis', locationColor: '#ec4899', icon: 'cutlery' },
    { id: 'cactus-garden', name: 'Cactus Garden', description: 'Explore the prickly desert flora.', location: 'Crescent Oasis', locationColor: '#ec4899', icon: 'leaf' },
    { id: 'stargazing', name: 'Stargazing', description: 'Watch stars in the clear desert sky.', location: 'Crescent Oasis', locationColor: '#ec4899', icon: 'star' },
    { id: 'vintage-shop', name: 'Vintage Shop', description: 'Browse retro treasures and antiques.', location: 'Crescent Oasis', locationColor: '#ec4899', icon: 'shopping-bag' },
    
    // Barrelhaven activities
    { id: 'wine-tasting', name: 'Wine Tasting', description: 'Sample finest vintages from ancient cellars.', location: 'Barrelhaven', locationColor: '#92400e', icon: 'glass' },
    { id: 'barrel-making', name: 'Barrel Making', description: 'Craft oak barrels using traditional techniques.', location: 'Barrelhaven', locationColor: '#92400e', icon: 'circle' },
    { id: 'grape-harvest', name: 'Grape Harvest', description: 'Pick grapes during autumn harvest season.', location: 'Barrelhaven', locationColor: '#92400e', icon: 'leaf' },
    { id: 'cellar-tour', name: 'Cellar Tour', description: 'Explore deep underground wine cellars.', location: 'Barrelhaven', locationColor: '#92400e', icon: 'arrow-down' },
    { id: 'wine-blending', name: 'Wine Blending', description: 'Create unique wine blends from grapes.', location: 'Barrelhaven', locationColor: '#92400e', icon: 'tint' },
    { id: 'medieval-feast', name: 'Medieval Feast', description: 'Dine like royalty at the banquet hall.', location: 'Barrelhaven', locationColor: '#92400e', icon: 'cutlery' },
    { id: 'vineyard-walk', name: 'Vineyard Walk', description: 'Stroll through rolling vineyard hills.', location: 'Barrelhaven', locationColor: '#92400e', icon: 'road' },
    { id: 'wine-ceremony', name: 'Wine Ceremony', description: 'Participate in ancient wine rituals.', location: 'Barrelhaven', locationColor: '#92400e', icon: 'heart' },
  ];

  // In a real app, this would sync with a global favorites store
  useEffect(() => {
    // Mock some favorites for demonstration
    const mockFavorites = new Set(['wine-tasting', 'fishing-expedition', 'neon-casino', 'midnight-rewind']);
    setFavorites(mockFavorites);
    
    // Filter activities to show only favorites
    const favActivities = allActivities.filter(activity => mockFavorites.has(activity.id));
    setFavoriteActivities(favActivities);
  }, []);

  const toggleFavorite = (activityId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(activityId)) {
        newFavorites.delete(activityId);
      } else {
        newFavorites.add(activityId);
      }
      
      // Update favorite activities list
      const favActivities = allActivities.filter(activity => newFavorites.has(activity.id));
      setFavoriteActivities(favActivities);
      
      return newFavorites;
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/home')}
        >
          <FontAwesome name="arrow-left" size={12} color="#8b5cf6" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header */}
        <RNView style={styles.headerRow}>
          <Text style={styles.pageTitle}>DAILY FAVORITES</Text>
        </RNView>

        {/* Description */}
        <RNView style={styles.descriptionContainer}>
          <Text style={styles.description}>
            Your starred activities from across all locations. Complete these daily for bonus rewards!
          </Text>
        </RNView>

        {/* Favorites List */}
        {favoriteActivities.length > 0 ? (
          favoriteActivities.map((activity) => {
            const content = (
              <RNView style={styles.activityContent}>
                <RNView style={[styles.activityIconContainer, { backgroundColor: `${activity.locationColor}15` }]}>
                  <FontAwesome name={activity.icon as any} size={24} color={activity.locationColor} />
                </RNView>
                <RNView style={styles.activityText}>
                  <RNView style={styles.activityHeader}>
                    <Text style={styles.activityName}>{activity.name}</Text>
                    <Text style={[styles.locationBadge, { color: activity.locationColor }]}>
                      {activity.location}
                    </Text>
                  </RNView>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                </RNView>
              </RNView>
            );

            return (
              <Pressable key={activity.id} style={styles.activityItem}>
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
                    color={favorites.has(activity.id) ? "#f59e0b" : "rgba(245, 158, 11, 0.3)"} 
                  />
                </Pressable>
              </Pressable>
            );
          })
        ) : (
          <RNView style={styles.emptyState}>
            <FontAwesome name="star-o" size={48} color="#94a3b8" />
            <Text style={styles.emptyTitle}>No Favorites Yet</Text>
            <Text style={styles.emptyDescription}>
              Star activities from different locations to add them to your daily list!
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
    backgroundColor: '#f8fafc',
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
    fontSize: 14,
    color: '#8b5cf6',
    marginLeft: 6,
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 4,
    height: 40,
  },
  pageTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  descriptionContainer: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    padding: 16,
    marginBottom: 24,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  description: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
    textAlign: 'center',
  },
  activityItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    padding: 16,
    marginBottom: 12,
    width: '100%',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: 40, // Space for favorite button
  },
  activityIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    flexShrink: 0,
  },
  activityText: {
    flex: 1,
    minWidth: 0,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  activityName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 11,
    color: '#0f172a',
    lineHeight: 14,
    textTransform: 'uppercase',
    flex: 1,
  },
  locationBadge: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    fontWeight: '600',
    marginLeft: 8,
  },
  activityDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    lineHeight: 15,
    textAlign: 'justify',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 20,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#64748b',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 18,
    textAlign: 'center',
  },
});








