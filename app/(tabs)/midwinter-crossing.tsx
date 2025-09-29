import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import images
const midwinterMainImage = require('@/assets/images/lil-gnome.png'); // Placeholder

export default function MidwinterCrossingScreen() {
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
      id: 'choral-chapel',
      name: 'Choral Chapel',
      description: 'A candlelit sanctuary where ethereal voices rise in ancient winter hymns. Always open for quiet reflection.',
      lightning: 5,
      difficulty: 'Easy',
      icon: 'music',
      status: 'open'
    },
    {
      id: 'mulled-wine-tavern',
      name: 'Mulled Wine House Tavern',
      description: 'Warm your soul by the crackling fire with spiced wine and hearty winter fare. A cozy refuge from the eternal snow.',
      lightning: 8,
      difficulty: 'Easy',
      icon: 'glass',
      status: 'open'
    },
    {
      id: 'parcel-house',
      name: 'Parcel House',
      description: 'Where carefully wrapped gifts await their destined recipients. The air is thick with anticipation and ribbon.',
      lightning: 6,
      difficulty: 'Easy',
      icon: 'gift',
      status: 'open'
    },
    {
      id: 'lantern-market',
      name: 'Lantern Market',
      description: 'Frosted stalls aglow with warm light, selling winter treasures and seasonal delights. (Closed until October)',
      lightning: 12,
      difficulty: 'Medium',
      icon: 'shopping-cart',
      status: 'closed'
    },
    {
      id: 'gift-exchange',
      name: 'Gift Exchange',
      description: 'A magical tradition where anonymous presents appear under the great winter tree. (Closed until October)',
      lightning: 15,
      difficulty: 'Medium',
      icon: 'exchange',
      status: 'closed'
    },
    {
      id: 'winter-post',
      name: 'The Winter Post',
      description: 'Write letters to the mysterious figure in the snow. Your words may reach the heart of winter itself. (Closed until October)',
      lightning: 10,
      difficulty: 'Easy',
      icon: 'envelope',
      status: 'closed'
    },
    {
      id: 'frost-flour',
      name: 'Frost & Flour',
      description: 'A bakery where holiday sweets and winter treats are crafted with magical ingredients. (Closed until October)',
      lightning: 7,
      difficulty: 'Easy',
      icon: 'cutlery',
      status: 'closed'
    },
    {
      id: 'candlewright-hall',
      name: 'Candlewright\'s Hall',
      description: 'Where enchanted candles are hand-dipped, each one holding a different winter wish. (Closed until October)',
      lightning: 9,
      difficulty: 'Medium',
      icon: 'fire',
      status: 'closed'
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
          <Text style={styles.locationTitle}>MIDWINTER CROSSING</Text>
        </RNView>

        {/* Banner Image */}
        <RNView style={styles.bannerContainer}>
          <Image 
            source={midwinterMainImage} 
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </RNView>

        {/* Description */}
        <Text style={styles.description}>
          An alpine holiday town frozen at midnight — cobblestone streets, half-timbered houses, 
          frosted bridges, and candlelit chapels. Always snowing softly, always midnight. This 
          elegant winter gothic village where the holiday never ends, though most shops slumber 
          until the festive season returns.
        </Text>

        {/* Activities Title */}
        <Text style={styles.activitiesTitle}>WINTER DESTINATIONS</Text>

        {/* Activities List */}
        {activities.map((activity) => (
          <RNView key={activity.id} style={[
            styles.activityCard,
            activity.status === 'closed' && styles.closedCard
          ]}>
            <RNView style={styles.activityHeader}>
              <RNView style={styles.activityIconContainer}>
                <FontAwesome 
                  name={activity.icon as any} 
                  size={20} 
                  color={activity.status === 'open' ? '#8b5cf6' : '#94a3b8'} 
                />
              </RNView>
              <RNView style={styles.activityContent}>
                <RNView style={styles.activityTitleRow}>
                  <Text style={[
                    styles.activityName,
                    activity.status === 'closed' && styles.closedText
                  ]}>
                    {activity.name}
                  </Text>
                  <RNView style={[
                    styles.statusBadge,
                    activity.status === 'open' ? styles.openBadge : styles.closedBadge
                  ]}>
                    <Text style={[
                      styles.statusText,
                      activity.status === 'open' ? styles.openText : styles.closedText
                    ]}>
                      {activity.status === 'open' ? 'OPEN' : 'CLOSED'}
                    </Text>
                  </RNView>
                </RNView>
                <Text style={[
                  styles.activityDescription,
                  activity.status === 'closed' && styles.closedText
                ]}>
                  {activity.description}
                </Text>
              </RNView>
              <Pressable
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(activity.id)}
              >
                <FontAwesome 
                  name={favorites.has(activity.id) ? "star" : "star-o"} 
                  size={16} 
                  color={favorites.has(activity.id) ? "#fbbf24" : "#cbd5e1"} 
                />
              </Pressable>
            </RNView>
            <RNView style={styles.activityFooter}>
              <RNView style={styles.energyCost}>
                <FontAwesome name="bolt" size={14} color="#f59e0b" />
                <Text style={styles.energyText}>{activity.lightning} Energy</Text>
              </RNView>
              <RNView style={styles.activityType}>
                <Text style={styles.typeText}>
                  {activity.status === 'open' ? 'Available Now' : 'Seasonal Activity'}
                </Text>
              </RNView>
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
    backgroundColor: '#f8fafc',
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
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
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
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  bannerContainer: {
    width: '100%',
    height: 200,
    borderWidth: 2,
    borderColor: '#64748b',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(100, 116, 139, 0.05)',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 6,
  },
  description: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    lineHeight: 18,
    marginBottom: 16,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  activitiesTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  activityCard: {
    backgroundColor: 'rgba(100, 116, 139, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.2)',
    padding: 16,
    marginBottom: 16,
    width: '100%',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  closedCard: {
    backgroundColor: 'rgba(148, 163, 184, 0.05)',
    borderColor: 'rgba(148, 163, 184, 0.15)',
    opacity: 0.7,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(100, 116, 139, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
    marginRight: 8,
  },
  activityTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    flex: 1,
  },
  closedText: {
    color: '#94a3b8',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  openBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  closedBadge: {
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
  },
  statusText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    fontWeight: 'bold',
  },
  openText: {
    color: '#22c55e',
  },
  activityDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    lineHeight: 16,
    marginTop: 4,
  },
  favoriteButton: {
    padding: 4,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(100, 116, 139, 0.1)',
  },
  energyCost: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  energyText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#f59e0b',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  activityType: {
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  typeText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    fontWeight: 'bold',
  },
});
